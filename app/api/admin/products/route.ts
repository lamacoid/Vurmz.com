import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { createProduct, listProducts } from '@/lib/db/repos/products'

export const runtime = 'edge'

const createSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i),
  name: z.string().min(1).max(200),
  description: z.string().optional().default(''),
  shortDescription: z.string().optional().default(''),
  categoryId: z.string().nullable().optional(),
  audience: z.enum(['shop', 'services', 'both']).optional(),
  priceCents: z.number().int().nonnegative(),
  packSize: z.number().int().min(1),
  position: z.number().optional(),
  isPublished: z.boolean().optional(),
  madeToOrder: z.boolean().optional(),
  leadTimeDays: z.number().int().nonnegative().optional(),
  weightGrams: z.number().int().nonnegative().optional(),
  heroMediaId: z.string().nullable().optional(),
  oneOff: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const categoryId = url.searchParams.get('categoryId') ?? undefined
    const search = url.searchParams.get('q') ?? undefined
    const products = await listProducts({
      includeUnpublished: true,
      includeSold: true,
      categoryId,
      search,
      limit: 500,
    })
    return NextResponse.json({ ok: true, data: { products } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    const product = await createProduct(body.data)
    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'product.create',
      targetType: 'product',
      targetId: product.id,
      diff: { slug: product.slug, name: product.name },
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { product } })
  })
}
