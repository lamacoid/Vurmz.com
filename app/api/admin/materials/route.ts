import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, newId, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

interface MaterialRow {
  id: string; name: string; sku: string | null; category: string; qty_on_hand: number; unit: string
  cost_cents: number; supplier: string | null; notes: string; created_at: string; updated_at: string
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { results } = await getDb().prepare(
      'SELECT * FROM materials WHERE deleted_at IS NULL ORDER BY category, name'
    ).all<MaterialRow>()
    return NextResponse.json({
      ok: true,
      data: {
        materials: results.map(r => ({
          id: r.id, name: r.name, sku: r.sku, category: r.category,
          qtyOnHand: r.qty_on_hand, unit: r.unit, costCents: r.cost_cents,
          supplier: r.supplier, notes: r.notes,
          createdAt: r.created_at, updatedAt: r.updated_at,
        })),
      },
    })
  })
}

const createSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  qtyOnHand: z.number().int().nonnegative().optional(),
  unit: z.string().max(20).optional(),
  costCents: z.number().int().nonnegative().optional(),
  supplier: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const id = newId('mat')
    const now = nowIso()
    await getDb().prepare(
      `INSERT INTO materials (id, name, sku, category, qty_on_hand, unit, cost_cents, supplier, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, body.data.name, body.data.sku ?? null, body.data.category ?? '',
      body.data.qtyOnHand ?? 0, body.data.unit ?? 'pcs', body.data.costCents ?? 0,
      body.data.supplier ?? null, body.data.notes ?? '', now, now
    ).run()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'material.create', targetType: 'material', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { id } })
  })
}
