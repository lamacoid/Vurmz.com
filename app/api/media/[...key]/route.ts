import { NextRequest, NextResponse } from 'next/server'
import { getObject } from '@/lib/media/r2'

export const runtime = 'edge'

/**
 * Public read endpoint for R2-stored media. Content-addressed keys → safe to
 * cache aggressively. CF Cache API handles it automatically with these headers.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params
  const r2Key = key.join('/')
  const obj = await getObject(r2Key)
  if (!obj) return new NextResponse('Not found', { status: 404 })
  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType || 'application/octet-stream')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  if (obj.size) headers.set('Content-Length', String(obj.size))
  return new NextResponse(obj.body as unknown as ReadableStream, { headers })
}
