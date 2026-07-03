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

    // Get path from request body
    const body = await req.json().catch(() => ({} as any)) as {
      path?: string
      referrer?: string
      /** Conversion event name (add_to_cart | begin_checkout | purchase). Absent = pageview. */
      event?: string
      valueCents?: number
    }
    const path = (body.path || '/').slice(0, 500)
    const referrer = (body.referrer || '').slice(0, 500)

    // Get date/hour in Mountain Time (UTC-7)
    const now = new Date()
    const mt = new Date(now.getTime() - 7 * 60 * 60 * 1000)
    const date = mt.toISOString().split('T')[0]
    const hour = mt.getUTCHours()

    // Conversion events land in the MAIN database (vurmz-core) so the
    // funnel can be joined against orders; pageviews stay in TRACK_DB.
    const ALLOWED_EVENTS = new Set(['add_to_cart', 'begin_checkout', 'purchase'])
    if (body.event) {
      if (!ALLOWED_EVENTS.has(body.event)) return NextResponse.json({ ok: true, tracked: false })
      const value = Number.isFinite(body.valueCents) ? Math.max(0, Math.min(10_000_000, Math.round(body.valueCents!))) : null
      await env.DB.prepare(
        'INSERT INTO events (date, name, path, value_cents) VALUES (?, ?, ?, ?)'
      ).bind(date, body.event, path, value).run()
      return NextResponse.json({ ok: true, tracked: true })
    }

    // Get country from Cloudflare header
    const country = req.headers.get('cf-ipcountry') || 'XX'

    await env.TRACK_DB.prepare(
      'INSERT INTO pageviews (path, date, hour, referrer, country) VALUES (?, ?, ?, ?, ?)'
    ).bind(path, date, hour, referrer, country).run()

    return NextResponse.json({ ok: true, tracked: true })
  } catch {
    // Don't leak internal error details to the client.
    return NextResponse.json({ ok: false }, { status: 500 })
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
