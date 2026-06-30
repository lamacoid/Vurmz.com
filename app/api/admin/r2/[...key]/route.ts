import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getObject } from '@/lib/media/r2'

export const runtime = 'edge'

// Admin-only read for the PRIVATE R2 prefixes: guest checkout uploads and
// customer account files. The public /api/media route refuses these on purpose;
// this is the authenticated counterpart so order/customer attachments are
// viewable from the admin. Images render inline, everything else downloads.
// checkout/<gup_id>/<name> (3 segments) or customer/<cus_id>/<cfi_id>/<name> (4).
const PRIVATE_KEY_RE = /^(checkout|customer)\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)?\/[^/]{1,200}$/
const INLINE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

export async function GET(req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  return withAdminAuth(req, async () => {
    const { key } = await ctx.params
    const r2Key = key.join('/')
    if (!PRIVATE_KEY_RE.test(r2Key)) return new NextResponse('Not found', { status: 404 })
    const obj = await getObject(r2Key)
    if (!obj) return new NextResponse('Not found', { status: 404 })

    const contentType = obj.httpMetadata?.contentType || 'application/octet-stream'
    const filename = r2Key.split('/').pop() || 'file'
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Cache-Control', 'private, max-age=3600')
    headers.set(
      'Content-Disposition',
      `${INLINE_TYPES.has(contentType) ? 'inline' : 'attachment'}; filename="${filename.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
    )
    if (obj.size) headers.set('Content-Length', String(obj.size))
    return new NextResponse(obj.body as unknown as ReadableStream, { headers })
  }) as Promise<NextResponse>
}
