import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getCategoryById, updateCategory, softDeleteCategory } from '@/lib/db/repos/products'

export const runtime = 'edge'

const patchSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  heroMediaId: z.string().nullable().optional(),
  position: z.number().optional(),
  isPublished: z.boolean().optional(),
})

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const category = await getCategoryById(id)
    if (!category) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { category } })
  })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    await updateCategory(id, body.data)
    const category = await getCategoryById(id)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'category.update', targetType: 'category', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { category } })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await softDeleteCategory(id)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'category.delete', targetType: 'category', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
