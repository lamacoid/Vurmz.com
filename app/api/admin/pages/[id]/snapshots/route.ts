import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { listPageSnapshots, restoreSnapshotToDraft } from '@/lib/db/repos/pages'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const snapshots = await listPageSnapshots(id, 50)
    return NextResponse.json({ ok: true, data: { snapshots } })
  })
}

const restoreSchema = z.object({ snapshotId: z.string() })

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = restoreSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const ok = await restoreSnapshotToDraft(id, body.data.snapshotId)
    if (!ok) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'page.snapshot_restore', targetType: 'page', targetId: id,
      diff: { snapshotId: body.data.snapshotId },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
