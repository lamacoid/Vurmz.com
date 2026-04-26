import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getPageById, saveDraft, softDeletePage } from '@/lib/db/repos/pages'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const blockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.unknown()),
  visibility: z.object({
    mobile: z.boolean().optional(),
    desktop: z.boolean().optional(),
    adminOnly: z.boolean().optional(),
  }).optional(),
})

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9/-]+$/i).optional(),
  metaDescription: z.string().max(300).nullable().optional(),
  draftBlocks: z.array(blockSchema).optional(),
  noindex: z.boolean().optional(),
})

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const page = await getPageById(id)
    if (!page) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { page } })
  })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })

    // Save blocks only
    if (body.data.draftBlocks !== undefined) {
      await saveDraft(id, body.data.draftBlocks as never)
    }

    // Metadata updates
    const sets: string[] = []
    const binds: unknown[] = []
    if (body.data.title !== undefined) { sets.push('title = ?'); binds.push(body.data.title) }
    if (body.data.slug !== undefined) { sets.push('slug = ?'); binds.push(body.data.slug) }
    if (body.data.metaDescription !== undefined) { sets.push('meta_description = ?'); binds.push(body.data.metaDescription) }
    if (body.data.noindex !== undefined) { sets.push('noindex = ?'); binds.push(body.data.noindex ? 1 : 0) }
    if (sets.length > 0) {
      sets.push('updated_at = ?'); binds.push(nowIso())
      binds.push(id)
      await getDb().prepare(`UPDATE pages SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
    }

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'page.update', targetType: 'page', targetId: id,
      diff: { ...body.data, draftBlocks: body.data.draftBlocks ? `(${body.data.draftBlocks.length} blocks)` : undefined },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    const page = await getPageById(id)
    return NextResponse.json({ ok: true, data: { page } })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await softDeletePage(id)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'page.delete', targetType: 'page', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
