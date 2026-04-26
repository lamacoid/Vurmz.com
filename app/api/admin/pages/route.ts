import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { createPage, listPages } from '@/lib/db/repos/pages'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const createSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9/-]+$/i),
  title: z.string().min(1).max(200),
  metaDescription: z.string().max(300).optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const pages = await listPages({ includeUnpublished: true })
    return NextResponse.json({ ok: true, data: { pages } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    const page = await createPage({ slug: body.data.slug, title: body.data.title, metaDescription: body.data.metaDescription, blocks: [] })
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'page.create', targetType: 'page', targetId: page.id,
      diff: { slug: page.slug, title: page.title },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { page } })
  })
}
