import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  sku: z.string().max(100).nullable().optional(),
  category: z.string().max(100).optional(),
  qtyOnHand: z.number().int().nonnegative().optional(),
  unit: z.string().max(20).optional(),
  costCents: z.number().int().nonnegative().optional(),
  supplier: z.string().max(200).nullable().optional(),
  notes: z.string().max(5000).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const sets: string[] = []
    const binds: unknown[] = []
    const map: Array<[keyof typeof body.data, string]> = [
      ['name','name'], ['sku','sku'], ['category','category'],
      ['qtyOnHand','qty_on_hand'], ['unit','unit'], ['costCents','cost_cents'],
      ['supplier','supplier'], ['notes','notes'],
    ]
    for (const [k, col] of map) {
      if (body.data[k] !== undefined) { sets.push(`${col} = ?`); binds.push(body.data[k] as unknown) }
    }
    if (sets.length === 0) return NextResponse.json({ ok: true })
    sets.push('updated_at = ?'); binds.push(nowIso())
    binds.push(id)
    await getDb().prepare(`UPDATE materials SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'material.update', targetType: 'material', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await getDb().prepare('UPDATE materials SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'material.delete', targetType: 'material', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
