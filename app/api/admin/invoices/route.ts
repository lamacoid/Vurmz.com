import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { createInvoice, listInvoices } from '@/lib/db/repos/invoices'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const createSchema = z.object({
  customerId: z.string(),
  orderId: z.string().nullable().optional(),
  items: z.array(z.object({
    description: z.string().min(1).max(500),
    qty: z.number().int().min(1),
    unitPriceCents: z.number().int().nonnegative(),
  })).min(1).max(50),
  taxCents: z.number().int().nonnegative().optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().max(2000).optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const customerId = url.searchParams.get('customerId') ?? undefined
    const invoices = await listInvoices({ customerId, limit: 500 })
    return NextResponse.json({ ok: true, data: { invoices } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    const invoice = await createInvoice(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'invoice.create', targetType: 'invoice', targetId: invoice.id,
      diff: { number: invoice.number, total: invoice.totalCents },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { invoice } })
  })
}
