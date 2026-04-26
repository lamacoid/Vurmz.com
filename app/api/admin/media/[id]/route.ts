import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getMediaById, softDeleteMedia, updateMediaAltText } from '@/lib/db/repos/media'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const patchSchema = z.object({
  altText: z.string().max(500).optional(),
})

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const item = await getMediaById(id)
    if (!item) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { item } })
  })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })

    if (body.data.altText !== undefined) {
      await updateMediaAltText(id, body.data.altText)
      await audit({
        actorType: 'admin',
        actorId: session.email ?? null,
        action: 'media.update_alt',
        targetType: 'media',
        targetId: id,
        diff: { altText: body.data.altText },
        ip: getClientIp(req),
        userAgent: getUserAgent(req),
      })
    }

    const item = await getMediaById(id)
    return NextResponse.json({ ok: true, data: { item } })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await softDeleteMedia(id)
    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'media.delete',
      targetType: 'media',
      targetId: id,
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
