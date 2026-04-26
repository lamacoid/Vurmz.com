import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb, newId, nowIso } from '@/lib/db/client'
import { putObject } from '@/lib/media/r2'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const MAX_SIZE = 50 * 1024 * 1024

interface FileRow {
  id: string; customer_id: string; r2_key: string; filename: string; mime_type: string; size_bytes: number; uploaded_at: string
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const db = getDb()
    const { results } = await db.prepare(
      'SELECT id, r2_key, filename, mime_type, size_bytes, uploaded_at FROM customer_files WHERE customer_id = ? AND deleted_at IS NULL ORDER BY uploaded_at DESC'
    ).bind(session.customer.id).all<FileRow>()
    return NextResponse.json({
      ok: true,
      data: {
        files: results.map(r => ({
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
    if (file.size > MAX_SIZE) return NextResponse.json({ ok: false, error: { code: 'TOO_LARGE' } }, { status: 413 })

    const id = newId('cfi')
    const r2Key = `customer/${session.customer.id}/${id}/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 180)}`
    const buf = await file.arrayBuffer()
    await putObject(r2Key, buf, file.type || 'application/octet-stream')

    const db = getDb()
    await db.prepare(
      `INSERT INTO customer_files (id, customer_id, r2_key, filename, mime_type, size_bytes, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, session.customer.id, r2Key, file.name, file.type || 'application/octet-stream', file.size, nowIso()).run()

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'file.upload', targetType: 'customer_file', targetId: id,
      diff: { filename: file.name, size: file.size },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { id } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
