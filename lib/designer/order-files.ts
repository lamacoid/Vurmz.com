/**
 * After an order is created: write the laser file for every designed line
 * into R2 under orders/<order>/, record it on the line item, and add it
 * to the order's attachments so the ticket links it. Never fails the
 * order: a problem here becomes a note on the ticket instead.
 */
import { getDb, nowIso } from '@/lib/db/client'
import { getObject, putObject } from '@/lib/media/r2'
import { listOrderItems, type Order } from '@/lib/db/repos/orders'
import { reportError } from '@/lib/error'
import { cardLaserSvg, fontLoaderFor } from './card-laser'
import type { CardDesign } from './card'

export interface DesignOnOrder extends CardDesign {
  laserKey?: string
  notes?: string[]
}

export interface WrittenDesignFile {
  key: string
  filename: string
  svg: string
  notes: string[]
  label: string
}

export async function writeOrderDesignFiles(order: Order, origin: string): Promise<WrittenDesignFile[]> {
  const db = getDb()
  const items = await listOrderItems(order.id)
  const loadFont = fontLoaderFor(origin)
  const added: Array<{ key: string; filename: string }> = []
  const written: WrittenDesignFile[] = []
  for (const it of items) {
    const design = (it.metadata as { design?: DesignOnOrder }).design
    if (!design || design.kind !== 'card') continue
    let laserKey: string | undefined
    let notes: string[] = []
    try {
      const result = await cardLaserSvg(design, loadFont, async logo => {
        const obj = await getObject(logo.key)
        if (!obj) return null
        return { mime: obj.httpMetadata?.contentType || logo.mime, bytes: await obj.arrayBuffer() }
      })
      notes = result.notes
      laserKey = `orders/${order.id}/${it.id}-card.svg`
      await putObject(laserKey, new TextEncoder().encode(result.svg).buffer as ArrayBuffer, 'image/svg+xml')
      const filename = `${order.number}-${it.id.slice(-4)}-card.svg`
      added.push({ key: laserKey, filename })
      written.push({ key: laserKey, filename, svg: result.svg, notes: result.notes, label: `${it.qty} × ${it.nameSnapshot}` })
    } catch (err) {
      reportError(err, { route: 'orders', extra: { alert: 'DESIGN_LASER_FILE_FAILED', orderId: order.id, itemId: it.id } })
      notes = [...notes, 'the laser file could not be written; lay this one out by hand from the design below']
    }
    const meta = { ...it.metadata, design: { ...design, ...(laserKey ? { laserKey } : {}), ...(notes.length ? { notes } : {}) } }
    await db.prepare('UPDATE order_items SET metadata = ? WHERE id = ?').bind(JSON.stringify(meta), it.id).run()
  }
  if (added.length) {
    const existing = (order.metadata?.attachments as Array<{ key: string; filename: string }> | undefined) ?? []
    const attachments = [...existing, ...added].filter((a, i, arr) => arr.findIndex(x => x.key === a.key) === i)
    await db.prepare('UPDATE orders SET metadata = ?, updated_at = ? WHERE id = ?')
      .bind(JSON.stringify({ ...order.metadata, attachments }), nowIso(), order.id).run()
  }
  return written
}
