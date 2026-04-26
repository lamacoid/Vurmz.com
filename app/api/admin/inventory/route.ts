import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, newId, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

interface InventoryRow {
  id: string
  product_id: string | null
  variant_id: string | null
  product_name: string | null
  qty_on_hand: number
  low_threshold: number
  updated_at: string
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const db = getDb()
    const { results } = await db.prepare(
      `SELECT i.id, i.product_id, i.variant_id, p.name as product_name, i.qty_on_hand, i.low_threshold, i.updated_at
       FROM inventory i
       LEFT JOIN products p ON p.id = i.product_id
       ORDER BY (i.qty_on_hand <= i.low_threshold) DESC, p.name`
    ).all<InventoryRow>()
    return NextResponse.json({
      ok: true,
      data: {
        items: results.map(r => ({
          id: r.id,
          productId: r.product_id,
          variantId: r.variant_id,
          productName: r.product_name ?? '(unlinked)',
          qtyOnHand: r.qty_on_hand,
          lowThreshold: r.low_threshold,
          updatedAt: r.updated_at,
          isLow: r.qty_on_hand <= r.low_threshold,
        })),
      },
    })
  })
}

const adjustSchema = z.object({
  productId: z.string(),
  qtyChange: z.number().int(),
  reason: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = adjustSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const db = getDb()
    const now = nowIso()

    // Upsert inventory row
    const existing = await db.prepare('SELECT id, qty_on_hand FROM inventory WHERE product_id = ? AND variant_id IS NULL LIMIT 1')
      .bind(body.data.productId).first<{ id: string; qty_on_hand: number }>()

    let invId: string
    let newQty: number
    if (existing) {
      invId = existing.id
      newQty = Math.max(0, existing.qty_on_hand + body.data.qtyChange)
      await db.prepare('UPDATE inventory SET qty_on_hand = ?, updated_at = ? WHERE id = ?').bind(newQty, now, invId).run()
    } else {
      invId = newId('inv')
      newQty = Math.max(0, body.data.qtyChange)
      await db.prepare('INSERT INTO inventory (id, product_id, variant_id, qty_on_hand, low_threshold, updated_at) VALUES (?, ?, NULL, ?, 0, ?)')
        .bind(invId, body.data.productId, newQty, now).run()
    }

    await db.prepare(
      `INSERT INTO inventory_movements (id, inventory_id, change, reason, actor_type, actor_id, created_at)
       VALUES (?, ?, ?, ?, 'admin', ?, ?)`
    ).bind(newId('imv'), invId, body.data.qtyChange, body.data.reason ?? 'adjustment', session.email ?? null, now).run()

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'inventory.adjust', targetType: 'inventory', targetId: invId,
      diff: { qtyChange: body.data.qtyChange, newQty }, ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { qtyOnHand: newQty } })
  })
}

const thresholdSchema = z.object({
  id: z.string(),
  lowThreshold: z.number().int().nonnegative(),
})

export async function PATCH(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const body = thresholdSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    await getDb().prepare('UPDATE inventory SET low_threshold = ?, updated_at = ? WHERE id = ?')
      .bind(body.data.lowThreshold, nowIso(), body.data.id).run()
    return NextResponse.json({ ok: true })
  })
}
