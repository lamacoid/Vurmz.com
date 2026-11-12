import { NextRequest, NextResponse } from 'next/server'
import { getObject } from '@/lib/media/r2'
import { verifyFileLink, fileLinkSecret } from '@/lib/media/signed-link'

export const runtime = 'edge'

// One private guest upload, opened by a signed, expiring link (see
// lib/media/signed-link.ts). This is what the quote-form email links to, so
// a photo opens from any mail app with no admin login. Anything without a
// valid signature for this exact file is a plain 404: the route never says
// whether a file exists.
const INLINE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  const notFound = () => new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  try {
    const { key } = await ctx.params
    const r2Key = key.map(decodeURIComponent).join('/')
    const url = new URL(req.url)
    const ok = await verifyFileLink(r2Key, url.searchParams.get('exp'), url.searchParams.get('sig'), fileLinkSecret())
    if (!ok) return notFound()

    const obj = await getObject(r2Key)
    if (!obj) return notFound()

    const contentType = obj.httpMetadata?.contentType || 'application/octet-stream'
    const filename = (r2Key.split('/').pop() || 'file').replace(/[^A-Za-z0-9._-]/g, '_')
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-Robots-Tag', 'noindex, nofollow')
    headers.set('Cache-Control', 'private, max-age=3600')
    // Photos show in the mail app or the browser. Anything else (SVG, PDF)
    // downloads, so a file can never run as a page on this site.
    headers.set('Content-Disposition', `${INLINE_TYPES.has(contentType) ? 'inline' : 'attachment'}; filename="${filename}"`)
    if (obj.size) headers.set('Content-Length', String(obj.size))
    return new NextResponse(obj.body as unknown as ReadableStream, { headers })
  } catch {
    return notFound()
  }
}
