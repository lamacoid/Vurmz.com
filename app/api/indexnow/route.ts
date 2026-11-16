import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { submitToIndexNow } from '@/lib/indexnow'

export const runtime = 'edge'

/**
 * POST /api/indexnow  { "urls": ["https://www.vurmz.com/engrave/", ...] }
 *
 * Tells Bing (and the other IndexNow search engines) that these pages
 * changed. Admin login required: left open, anyone could submit junk under
 * this site's key and get the key throttled or ignored. Addresses that are
 * not pages on www.vurmz.com are dropped and reported back.
 *
 * To submit the whole site from the terminal, use scripts/indexnow.mjs.
 */
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: { code: 'BAD_JSON' } }, { status: 400 })
    }
    const urls = (body as { urls?: unknown } | null)?.urls
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ ok: false, error: { code: 'NO_URLS', message: 'Send { "urls": [...] }.' } }, { status: 400 })
    }
    const result = await submitToIndexNow(urls)
    return NextResponse.json(result, { status: result.ok ? 200 : 502 })
  })
}
