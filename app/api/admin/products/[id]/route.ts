import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getProductById, updateProduct, softDeleteProduct, restoreProduct } from '@/lib/db/repos/products'

export const runtime = 'edge'

const patchSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  audience: z.enum(['shop', 'services', 'both']).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  packSize: z.number().int().min(1).optional(),
  position: z.number().optional(),
  isPublished: z.boolean().optional(),
  madeToOrder: z.boolean().optional(),
  leadTimeDays: z.number().int().nonnegative().optional(),
  weightGrams: z.number().int().nonnegative().optional(),
  heroMediaId: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const product = await getProductById(id)
    if (!product) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { product } })
  })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    const before = await getProductById(id)
    if (!before) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    await updateProduct(id, body.data)
    const after = await getProductById(id)
    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'product.update',
      targetType: 'product',
      targetId: id,
      diff: body.data,
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { product: after } })
  })
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const url = new URL(req.url)
    if (url.searchParams.get('restore') === '1') {
      await restoreProduct(id)
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'product.restore', targetType: 'product', targetId: id,
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
      return NextResponse.json({ ok: true })
    }
    await softDeleteProduct(id)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'product.delete', targetType: 'product', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
