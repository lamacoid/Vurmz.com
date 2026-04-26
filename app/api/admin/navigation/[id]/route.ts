import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const patchSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  href: z.string().min(1).max(500).optional(),
  placement: z.enum(['header', 'footer', 'footer-legal', 'mobile']).optional(),
  position: z.number().optional(),
  parentId: z.string().nullable().optional(),
  opensNewTab: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const db = getDb()
    const sets: string[] = []
    const binds: unknown[] = []
    const map: Array<[keyof typeof body.data, string]> = [
      ['label','label'], ['href','href'], ['placement','placement'], ['position','position'],
    ]
    for (const [k, col] of map) {
      if (body.data[k] !== undefined) { sets.push(`${col} = ?`); binds.push(body.data[k] as unknown) }
    }
    if (body.data.parentId !== undefined) { sets.push('parent_id = ?'); binds.push(body.data.parentId) }
    if (body.data.opensNewTab !== undefined) { sets.push('opens_new_tab = ?'); binds.push(body.data.opensNewTab ? 1 : 0) }
    if (sets.length === 0) return NextResponse.json({ ok: true })
    sets.push('updated_at = ?'); binds.push(nowIso())
    binds.push(id)
    await db.prepare(`UPDATE navigation SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'nav.update', targetType: 'nav', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await getDb().prepare('DELETE FROM navigation WHERE id = ?').bind(id).run()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'nav.delete', targetType: 'nav', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
