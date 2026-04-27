export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function POST(req: NextRequest) {
  try {
    // Check for owner cookie — if present, skip tracking
    const isOwner = req.cookies.get('vurmz_owner')?.value === '1'
    if (isOwner) {
      return NextResponse.json({ ok: true, tracked: false })
    }

    const { env } = getRequestContext()
    const db = env.TRACK_DB

    // Get path from request body
    const body = await req.json().catch(() => ({} as any)) as { path?: string; referrer?: string }
    const path = (body.path || '/').slice(0, 500)
    const referrer = (body.referrer || '').slice(0, 500)

    // Get date/hour in Mountain Time (UTC-7)
    const now = new Date()
    const mt = new Date(now.getTime() - 7 * 60 * 60 * 1000)
    const date = mt.toISOString().split('T')[0]
    const hour = mt.getUTCHours()

    // Get country from Cloudflare header
    const country = req.headers.get('cf-ipcountry') || 'XX'

    await db.prepare(
      'INSERT INTO pageviews (path, date, hour, referrer, country) VALUES (?, ?, ?, ?, ?)'
    ).bind(path, date, hour, referrer, country).run()

    return NextResponse.json({ ok: true, tracked: true })
  } catch (e: any) {
    // Don't fail silently but don't break the page either
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// Also support GET for simple beacon
export async function GET(req: NextRequest) {
  try {
    const isOwner = req.cookies.get('vurmz_owner')?.value === '1'
    if (isOwner) {
      return new NextResponse('', { status: 204 })
    }

    const { env } = getRequestContext()
    const db = env.TRACK_DB

    const path = req.nextUrl.searchParams.get('p') || '/'
    const referrer = req.nextUrl.searchParams.get('r') || ''

    const now = new Date()
    const mt = new Date(now.getTime() - 7 * 60 * 60 * 1000)
    const date = mt.toISOString().split('T')[0]
    const hour = mt.getUTCHours()
    const country = req.headers.get('cf-ipcountry') || 'XX'

    await db.prepare(
      'INSERT INTO pageviews (path, date, hour, referrer, country) VALUES (?, ?, ?, ?, ?)'
    ).bind(path.slice(0, 500), date, hour, referrer.slice(0, 500), country).run()

    return new NextResponse('', { status: 204 })
  } catch {
    return new NextResponse('', { status: 204 })
  }
}
