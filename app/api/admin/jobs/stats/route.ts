export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAdminAuth } from '@/lib/auth/admin'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { env } = getRequestContext()
    const db = env.TRACK_DB

    const total = await db.prepare('SELECT COUNT(*) as c FROM jobs').first() as any
    const active = await db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status NOT IN ('delivered', 'cancelled')").first() as any
    const quoted = await db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'quoted'").first() as any
    const delivered = await db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'delivered'").first() as any

    // Month revenue
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthRevenue = await db.prepare(
      "SELECT COALESCE(SUM(price), 0) as r FROM jobs WHERE status = 'delivered' AND delivered_at >= ?"
    ).bind(monthStart.toISOString()).first() as any

    return NextResponse.json({
      total: total?.c || 0,
      active: active?.c || 0,
      quoted: quoted?.c || 0,
      delivered: delivered?.c || 0,
      monthRevenue: monthRevenue?.r || 0,
    })
  })
}
