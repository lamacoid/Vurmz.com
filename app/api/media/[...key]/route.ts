import { NextRequest, NextResponse } from 'next/server'
import { getObject } from '@/lib/media/r2'

export const runtime = 'edge'

/**
 * Public read endpoint for R2-stored media.
 *
 * SECURITY: this route is unauthenticated, so it must only ever serve the
 * public media library (content-addressed `media/aa/bb/<sha256>.<ext>` keys
 * written by the admin upload). Customer uploads live under `customer/…` and
 * checkout uploads under `checkout/…` — those are private and are served only
 * through their authenticated routes (/api/account/files/[id], admin). Without
 * this prefix gate, any private R2 key could be fetched anonymously (IDOR).
 */
const PUBLIC_KEY_RE = /^media\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{64}(\.[a-z0-9]+)?$/

export async function GET(_req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params
  const r2Key = key.join('/')
  if (!PUBLIC_KEY_RE.test(r2Key)) return new NextResponse('Not found', { status: 404 })
  const obj = await getObject(r2Key)
  if (!obj) return new NextResponse('Not found', { status: 404 })
  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  if (obj.size) headers.set('Content-Length', String(obj.size))
  return new NextResponse(obj.body as unknown as ReadableStream, { headers })
}
