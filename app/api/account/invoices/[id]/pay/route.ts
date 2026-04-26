import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { getInvoiceById, recordInvoicePayment } from '@/lib/db/repos/invoices'
import { createPayment, isSquareEnabled } from '@/lib/payments/square'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getDb, newId, nowIso } from '@/lib/db/client'

export const runtime = 'edge'

const schema = z.object({
  sourceId: z.string(),
  idempotencyKey: z.string().uuid(),
})

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const body = schema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

    const invoice = await getInvoiceById(id)
    if (!invoice || invoice.customerId !== session.customer.id) {
      return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    }
    if (invoice.status === 'paid' || invoice.status === 'void') {
      return NextResponse.json({ ok: false, error: { code: 'ALREADY_FINALIZED' } }, { status: 400 })
    }
    if (!isSquareEnabled()) {
      return NextResponse.json({ ok: false, error: { code: 'PAYMENT_UNAVAILABLE' } }, { status: 400 })
    }
    const owed = invoice.totalCents - invoice.amountPaidCents
    if (owed <= 0) {
      return NextResponse.json({ ok: false, error: { code: 'NOTHING_OWED' } }, { status: 400 })
    }

    const result = await createPayment({
      sourceId: body.data.sourceId,
      amountCents: owed,
      idempotencyKey: body.data.idempotencyKey,
      referenceId: invoice.id,
      note: `Invoice ${invoice.number}`,
      buyerEmail: session.customer.email,
    })
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: { code: 'PAYMENT_DECLINED', message: result.error } }, { status: 402 })
    }

    const db = getDb()
    await db.prepare(
      `INSERT INTO payments (id, invoice_id, customer_id, amount_cents, status, square_payment_id, square_receipt_url, method_brand, method_last4, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'succeeded', ?, ?, ?, ?, '{}', ?, ?)`
    ).bind(
      newId('pay'),
      invoice.id,
      session.customer.id,
      owed,
      result.paymentId,
      result.receiptUrl,
      result.brand,
      result.last4,
      nowIso(),
      nowIso()
    ).run()
    await recordInvoicePayment(invoice.id, owed)

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'invoice.pay', targetType: 'invoice', targetId: invoice.id,
      diff: { amount: owed, square_payment: result.paymentId },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { receiptUrl: result.receiptUrl } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
