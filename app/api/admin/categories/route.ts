import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { createCategory, listCategories } from '@/lib/db/repos/products'

export const runtime = 'edge'

const createSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  position: z.number().optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const cats = await listCategories({ includeUnpublished: true })
    return NextResponse.json({ ok: true, data: { categories: cats } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    const category = await createCategory(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'category.create', targetType: 'category', targetId: category.id,
      diff: { slug: category.slug, name: category.name },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { category } })
  })
}
