import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { publishPage, getPageById } from '@/lib/db/repos/pages'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    await publishPage(id, session.email)
    const page = await getPageById(id)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'page.publish', targetType: 'page', targetId: id,
      diff: { version: page?.version },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { page } })
  })
}
