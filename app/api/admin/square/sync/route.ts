import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { runSquareSync } from '@/lib/payments/square-sync'
import { getSetting } from '@/lib/db/repos/settings'
import { isSquareEnabled } from '@/lib/payments/square'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

/** GET: when the last sync ran and what it found. POST: run one now. */
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const last = await getSetting<{ at: string; report: unknown }>('square_sync_last')
    return NextResponse.json({ ok: true, data: { enabled: isSquareEnabled(), last } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async session => {
    if (!isSquareEnabled()) {
      return NextResponse.json({ ok: false, error: { code: 'SQUARE_NOT_CONFIGURED', message: 'Square is not set up on this environment.' } }, { status: 400 })
    }
    const report = await runSquareSync()
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'square.sync', targetType: 'ledger', targetId: 'square',
      diff: report as unknown as Record<string, unknown>,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: report.ok, data: report }, { status: report.ok ? 200 : 502 })
  })
}
