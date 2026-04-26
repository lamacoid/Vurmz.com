import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { createNavItem, listNav, type NavPlacement } from '@/lib/db/repos/navigation'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const placements: NavPlacement[] = ['header', 'footer', 'footer-legal', 'mobile']

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const data: Record<NavPlacement, Awaited<ReturnType<typeof listNav>>> = {
      header: await listNav('header'),
      footer: await listNav('footer'),
      'footer-legal': await listNav('footer-legal'),
      mobile: await listNav('mobile'),
    }
    return NextResponse.json({ ok: true, data })
  })
}

const createSchema = z.object({
  placement: z.enum(['header', 'footer', 'footer-legal', 'mobile']),
  label: z.string().min(1).max(100),
  href: z.string().min(1).max(500),
  position: z.number().optional(),
  parentId: z.string().nullable().optional(),
  opensNewTab: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const id = await createNavItem(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'nav.create', targetType: 'nav', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { id } })
  })
}

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), position: z.number() })).min(1),
})

export async function PUT(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = reorderSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const db = getDb()
    await db.batch(
      body.data.items.map(it =>
        db.prepare('UPDATE navigation SET position = ?, updated_at = ? WHERE id = ?').bind(it.position, nowIso(), it.id)
      )
    )
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'nav.reorder', targetType: 'nav',
      diff: { count: body.data.items.length },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
