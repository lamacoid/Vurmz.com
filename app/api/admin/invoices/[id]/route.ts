import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getInvoiceById, listInvoiceItems, setInvoiceStatus, type InvoiceStatus } from '@/lib/db/repos/invoices'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const invoice = await getInvoiceById(id)
    if (!invoice) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const items = await listInvoiceItems(id)
    return NextResponse.json({ ok: true, data: { invoice, items } })
  })
}

const patchSchema = z.object({
  status: z.enum(['draft','sent','viewed','paid','partially_paid','overdue','void','refunded']).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    if (body.data.status) {
      await setInvoiceStatus(id, body.data.status as InvoiceStatus)
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'invoice.status_change', targetType: 'invoice', targetId: id,
        diff: { status: body.data.status },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }
    const invoice = await getInvoiceById(id)
    return NextResponse.json({ ok: true, data: { invoice } })
  })
}
