import { NextRequest, NextResponse } from 'next/server'
import { getRateLimit, newId } from '@/lib/db/client'
import { putObject } from '@/lib/media/r2'
import { getClientIp } from '@/lib/auth/session'

export const runtime = 'edge'

/**
 * Guest checkout upload: lets anyone attach a photo/logo to an order without an
 * account. Files land in R2 under `checkout/<id>/<name>` — a private prefix the
 * public media route refuses to serve — and the returned key is passed back in
 * the order payload, where /api/orders validates its shape and stores it in the
 * order's metadata. Files for orders that never complete just age out unused.
 */
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB — design refs don't need more
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
])

// 12 uploads / 10 min per IP — roomy for a real customer (3 files per order,
// a few retries), tight enough to stop drive-by R2 stuffing.
const RL_MAX = 12
const RL_WINDOW_SECONDS = 600

async function rateLimit(ip: string): Promise<boolean> {
  try {
    const kv = getRateLimit()
    if (!kv) return true
    const key = `checkout-upload:${ip}`
    const current = parseInt((await kv.get(key)) ?? '0', 10)
    if (current >= RL_MAX) return false
    await kv.put(key, String(current + 1), { expirationTtl: RL_WINDOW_SECONDS })
    return true
  } catch {
    return true // fail open — uploads still capped by size/MIME
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req) || 'unknown'
  if (!(await rateLimit(ip))) {
    return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED', message: 'Too many uploads. Give it a few minutes.' } }, { status: 429 })
  }

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: { code: 'BAD_REQUEST' } }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: { code: 'TOO_LARGE', message: 'Max file size is 10 MB.' } }, { status: 413 })
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: { code: 'UNSUPPORTED_TYPE', message: 'Only JPG, PNG, GIF, WEBP, or PDF files are allowed.' } },
      { status: 400 },
    )
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 180) || 'upload'
  const key = `checkout/${newId('gup')}/${safeName}`
  await putObject(key, await file.arrayBuffer(), file.type || 'application/octet-stream')

  return NextResponse.json({ ok: true, data: { key, filename: file.name.slice(0, 200), sizeBytes: file.size } })
}
