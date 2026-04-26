import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getCustomerById } from '@/lib/db/repos/customers'
import { listOrders } from '@/lib/db/repos/orders'
import { listInvoices } from '@/lib/db/repos/invoices'
import { listThread } from '@/lib/db/repos/messages'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

interface FileRow { id: string; filename: string; mime_type: string; size_bytes: number; uploaded_at: string }

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const customer = await getCustomerById(id)
    if (!customer) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })

    const [orders, invoices, messages, filesResult] = await Promise.all([
      (async () => (await listOrders({ limit: 100 })).filter(o => o.customerId === id))(),
      listInvoices({ customerId: id, limit: 100 }),
      listThread(id, 500),
      getDb().prepare('SELECT id, filename, mime_type, size_bytes, uploaded_at FROM customer_files WHERE customer_id = ? AND deleted_at IS NULL ORDER BY uploaded_at DESC').bind(id).all<FileRow>(),
    ])

    return NextResponse.json({
      ok: true,
      data: {
        customer,
        orders,
        invoices,
        messages,
        files: filesResult.results.map(r => ({
          id: r.id, filename: r.filename, mimeType: r.mime_type, sizeBytes: r.size_bytes, uploadedAt: r.uploaded_at,
        })),
      },
    })
  })
}

const patchSchema = z.object({
  name: z.string().max(200).optional(),
  phone: z.string().max(30).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
  notes: z.string().max(10000).optional(),
  tags: z.array(z.string().max(50)).max(50).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

    const sets: string[] = []
    const binds: unknown[] = []
    if (body.data.name !== undefined) { sets.push('name = ?'); binds.push(body.data.name) }
    if (body.data.phone !== undefined) { sets.push('phone = ?'); binds.push(body.data.phone) }
    if (body.data.company !== undefined) { sets.push('company = ?'); binds.push(body.data.company) }
    if (body.data.notes !== undefined) { sets.push('notes = ?'); binds.push(body.data.notes) }
    if (body.data.tags !== undefined) { sets.push('tags = ?'); binds.push(JSON.stringify(body.data.tags)) }
    if (sets.length === 0) return NextResponse.json({ ok: true })
    sets.push('updated_at = ?'); binds.push(nowIso())
    binds.push(id)
    await getDb().prepare(`UPDATE customers SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'customer.update', targetType: 'customer', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
