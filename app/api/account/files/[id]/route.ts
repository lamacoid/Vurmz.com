import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb, nowIso } from '@/lib/db/client'
import { getObject, deleteObject } from '@/lib/media/r2'

export const runtime = 'edge'

interface FileRow { id: string; customer_id: string; r2_key: string; filename: string; mime_type: string }

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const db = getDb()
    const row = await db.prepare('SELECT * FROM customer_files WHERE id = ? AND customer_id = ? AND deleted_at IS NULL')
      .bind(id, session.customer.id).first<FileRow>()
    if (!row) return new NextResponse('Not found', { status: 404 })
    const obj = await getObject(row.r2_key)
    if (!obj) return new NextResponse('Gone', { status: 410 })
    const headers = new Headers()
    headers.set('Content-Type', row.mime_type || 'application/octet-stream')
    // Force download rather than inline rendering — prevents a stored HTML/SVG
    // file from executing as same-origin script (stored XSS) when opened.
    headers.set('Content-Disposition', `attachment; filename="${row.filename.replace(/[\r\n"]/g, '')}"`)
    headers.set('Cache-Control', 'private, max-age=3600')
    return new NextResponse(obj.body as unknown as ReadableStream, { headers })
  } catch {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const db = getDb()
    const row = await db.prepare('SELECT r2_key FROM customer_files WHERE id = ? AND customer_id = ? AND deleted_at IS NULL')
      .bind(id, session.customer.id).first<{ r2_key: string }>()
    if (!row) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    await db.prepare('UPDATE customer_files SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
    // Fire-and-forget delete from R2
    deleteObject(row.r2_key).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
