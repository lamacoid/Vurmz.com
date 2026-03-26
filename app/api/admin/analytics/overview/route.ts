export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAuth } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const { env } = getRequestContext()
    const db = (env as any).TRACK_DB as D1Database

    const days = parseInt(req.nextUrl.searchParams.get('days') || '30')
    const end = new Date().toISOString().split('T')[0]
    const start = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]

    // Mountain time date for "today"
    const now = new Date()
    const mt = new Date(now.getTime() - 7 * 60 * 60 * 1000)
    const today = mt.toISOString().split('T')[0]

    const [daily, todayRow, totalRow, paths, referrers] = await Promise.all([
      db.prepare('SELECT date, COUNT(*) as views FROM pageviews WHERE date >= ? AND date <= ? GROUP BY date ORDER BY date ASC')
        .bind(start, end).all(),
      db.prepare('SELECT COUNT(*) as views FROM pageviews WHERE date = ?')
        .bind(today).first(),
      db.prepare('SELECT COUNT(*) as views FROM pageviews WHERE date >= ? AND date <= ?')
        .bind(start, end).first(),
      db.prepare('SELECT path, COUNT(*) as views FROM pageviews WHERE date >= ? AND date <= ? GROUP BY path ORDER BY views DESC LIMIT 10')
        .bind(start, end).all(),
      db.prepare("SELECT referrer, COUNT(*) as views FROM pageviews WHERE date >= ? AND date <= ? AND referrer != '' AND referrer NOT LIKE '%vurmz.com%' GROUP BY referrer ORDER BY views DESC LIMIT 10")
        .bind(start, end).all(),
    ])

    return NextResponse.json({
      today: { views: (todayRow as any)?.views || 0 },
      period: { views: (totalRow as any)?.views || 0, days },
      chart: daily.results,
      paths: paths.results,
      referrers: referrers.results,
    })
  })
}
