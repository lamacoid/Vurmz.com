import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'

export const runtime = 'edge'

/**
 * Rail Phase D: start a delivery run. A run is metadata (id + startedAt)
 * stamped onto READY hand-delivery tickets; no schema change, no new
 * status. The stamp is status-guarded (I3/I4): an order that moved since
 * the picker loaded is skipped, never mangled. Returns the stops and the
 * maps handoff links (one Apple Maps link per stop, one Google Maps
 * multi-stop link for the whole run).
 */
const schema = z.object({
  orderIds: z.array(z.string().min(1)).min(1).max(12),
})

type AddressRow = {
  id: string
  number: string
  status: string
  fulfillment_method: string
  fulfillment_address: string | null
}

function addressLine(a: { line1?: string; line2?: string | null; city?: string; state?: string; postalCode?: string } | null): string | null {
  if (!a?.line1 || !a.city) return null
  return `${a.line1}${a.line2 ? ' ' + a.line2 : ''}, ${a.city}, ${a.state ?? 'CO'} ${a.postalCode ?? ''}`.trim()
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = schema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'BAD_REQUEST' } }, { status: 400 })
    }
    const db = getDb()
    const ids = [...new Set(body.data.orderIds)]
    const placeholders = ids.map(() => '?').join(',')
    const { results } = await db
      .prepare(`SELECT id, number, status, fulfillment_method, fulfillment_address FROM orders WHERE id IN (${placeholders})`)
      .bind(...ids)
      .all<AddressRow>()

    const problems: Array<{ orderId: string; reason: string }> = []
    const eligible: Array<{ row: AddressRow; address: string }> = []
    for (const id of ids) {
      const row = results.find(r => r.id === id)
      if (!row) { problems.push({ orderId: id, reason: 'NOT_FOUND' }); continue }
      if (row.status !== 'ready') { problems.push({ orderId: id, reason: 'NOT_READY' }); continue }
      if (row.fulfillment_method !== 'hand_deliver') { problems.push({ orderId: id, reason: 'NOT_HAND_DELIVERY' }); continue }
      let addr: string | null = null
      try { addr = addressLine(JSON.parse(row.fulfillment_address || 'null')) } catch {}
      if (!addr) { problems.push({ orderId: id, reason: 'NO_ADDRESS' }); continue }
      eligible.push({ row, address: addr })
    }
    if (eligible.length === 0) {
      return NextResponse.json({ ok: false, error: { code: 'NO_ELIGIBLE_ORDERS', problems } }, { status: 400 })
    }

    const runId = `run_${new Date().toISOString().slice(0, 10).replaceAll('-', '')}_${Math.random().toString(36).slice(2, 7)}`
    const startedAt = new Date().toISOString()
    const stamp = JSON.stringify({ id: runId, startedAt })

    const stops: Array<{ orderId: string; number: string; address: string; appleUrl: string }> = []
    for (const { row, address } of eligible) {
      // Status-guarded stamp: if the order moved since the picker loaded,
      // skip it rather than stamping a stale ticket.
      const res = await db
        .prepare(`UPDATE orders SET metadata = json_set(COALESCE(metadata, '{}'), '$.deliveryRun', json(?)), updated_at = datetime('now') WHERE id = ? AND status = 'ready'`)
        .bind(stamp, row.id)
        .run()
      if (!res.meta.changes) { problems.push({ orderId: row.id, reason: 'MOVED' }); continue }
      stops.push({
        orderId: row.id,
        number: row.number,
        address,
        appleUrl: `http://maps.apple.com/?daddr=${encodeURIComponent(address)}&dirflg=d`,
      })
    }
    if (stops.length === 0) {
      return NextResponse.json({ ok: false, error: { code: 'NO_ELIGIBLE_ORDERS', problems } }, { status: 409 })
    }

    const googleUrl = `https://www.google.com/maps/dir/${stops.map(s => encodeURIComponent(s.address)).join('/')}`

    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'order.delivery_run_start',
      targetType: 'delivery_run',
      targetId: runId,
      diff: { orderIds: stops.map(s => s.orderId) },
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { runId, startedAt, stops, googleUrl, problems } })
  })
}
