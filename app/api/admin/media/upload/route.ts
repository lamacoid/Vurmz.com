import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { createMedia, getMediaByKey } from '@/lib/db/repos/media'
import { guessExt, putObject, r2KeyFromHash, sha256Hex } from '@/lib/media/r2'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB
// Raster images + PDF only. SVG is intentionally excluded: it can carry inline
// script and the public /api/media route would otherwise serve it same-origin.
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf',
])

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const form = await req.formData()
    const file = form.get('file')
    const altText = (form.get('alt') as string) ?? ''
    const folder = (form.get('folder') as string) ?? ''
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: { code: 'BAD_REQUEST', message: 'file required' } }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: { code: 'TOO_LARGE', message: 'file exceeds 50 MB' } }, { status: 413 })
    }
    if (!ALLOWED_MIME.has((file.type || '').toLowerCase())) {
      return NextResponse.json({ ok: false, error: { code: 'UNSUPPORTED_TYPE', message: 'Only JPEG, PNG, WebP, GIF, AVIF, or PDF are allowed' } }, { status: 415 })
    }
    const buf = await file.arrayBuffer()
    const hash = await sha256Hex(buf)
    const ext = guessExt(file.name, file.type)
    const r2Key = r2KeyFromHash(hash, ext)

    // Dedup: if a media row already exists for this key, return it without re-uploading.
    const existing = await getMediaByKey(r2Key)
    if (existing) {
      return NextResponse.json({ ok: true, data: { item: existing, deduped: true } })
    }

    await putObject(r2Key, buf, file.type || 'application/octet-stream')
    const item = await createMedia({
      r2Key,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      altText,
      folder,
      uploadedBy: session.email ?? null,
    })

    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'media.upload',
      targetType: 'media',
      targetId: item.id,
      diff: { filename: item.filename, size: item.sizeBytes },
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { item } })
  })
}
