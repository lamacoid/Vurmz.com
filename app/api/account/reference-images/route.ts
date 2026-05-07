import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb, newId, nowIso } from '@/lib/db/client'
import { putObject } from '@/lib/media/r2'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const MAX_REFERENCE_IMAGES = 5
const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

interface FileRow {
  id: string; r2_key: string; filename: string; mime_type: string; size_bytes: number; uploaded_at: string
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const db = getDb()
    const { results } = await db.prepare(
      "SELECT id, r2_key, filename, mime_type, size_bytes, uploaded_at FROM customer_files WHERE customer_id = ? AND kind = 'reference' AND deleted_at IS NULL ORDER BY uploaded_at ASC"
    ).bind(session.customer.id).all<FileRow>()
    return NextResponse.json({
      ok: true,
      data: {
        max: MAX_REFERENCE_IMAGES,
        images: results.map(r => ({
          id: r.id, filename: r.filename, mimeType: r.mime_type, sizeBytes: r.size_bytes,
          uploadedAt: r.uploaded_at,
          url: `/api/account/files/${r.id}`,
        })),
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ ok: false, error: { code: 'BAD_REQUEST' } }, { status: 400 })
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ ok: false, error: { code: 'UNSUPPORTED_TYPE', message: 'Only JPG, PNG, WEBP, GIF, or SVG.' } }, { status: 415 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: { code: 'TOO_LARGE', message: 'Each image must be under 10 MB.' } }, { status: 413 })
    }

    const db = getDb()
    const countRow = await db.prepare(
      "SELECT COUNT(*) AS n FROM customer_files WHERE customer_id = ? AND kind = 'reference' AND deleted_at IS NULL"
    ).bind(session.customer.id).first<{ n: number }>()
    if ((countRow?.n ?? 0) >= MAX_REFERENCE_IMAGES) {
      return NextResponse.json(
        { ok: false, error: { code: 'LIMIT_REACHED', message: `You can store up to ${MAX_REFERENCE_IMAGES} reference images. Remove one first.` } },
        { status: 409 },
      )
    }

    const id = newId('cfi')
    const r2Key = `customer/${session.customer.id}/${id}/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 180)}`
    const buf = await file.arrayBuffer()
    await putObject(r2Key, buf, file.type)

    await db.prepare(
      `INSERT INTO customer_files (id, customer_id, r2_key, filename, mime_type, size_bytes, uploaded_at, kind)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'reference')`
    ).bind(id, session.customer.id, r2Key, file.name, file.type, file.size, nowIso()).run()

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'reference_image.upload', targetType: 'customer_file', targetId: id,
      diff: { filename: file.name, size: file.size },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { id } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
