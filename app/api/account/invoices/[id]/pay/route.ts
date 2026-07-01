import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { getInvoiceById, recordInvoicePayment } from '@/lib/db/repos/invoices'
import { createPayment, isSquareEnabled } from '@/lib/payments/square'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getDb, newId, nowIso } from '@/lib/db/client'
import { reportError } from '@/lib/error'

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
    if (invoice.status === 'paid' || invoice.status === 'void' || invoice.status === 'refunded') {
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

    // The charge has SUCCEEDED at Square. From here on, any failure must NOT be
    // surfaced as a pre-charge error (e.g. 401/402) — the customer's card was
    // charged. Record the payment idempotently and, if recording fails, return a
    // 500 that tells them to contact support rather than implying nothing happened.
    try {
      const db = getDb()

      // Idempotency: if we've already recorded this Square payment (e.g. a retry
      // of the same idempotencyKey returned the same paymentId), don't double-count.
      const already = await db.prepare(
        'SELECT id FROM payments WHERE square_payment_id = ? LIMIT 1'
      ).bind(result.paymentId).first<{ id: string }>()
      if (already) {
        return NextResponse.json({ ok: true, data: { receiptUrl: result.receiptUrl } })
      }

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
    } catch (recordErr) {
      // Charge succeeded but we failed to persist it — this needs manual reconciliation.
      reportError(recordErr, {
        route: 'account/invoices/pay',
        extra: {
          alert: 'CHARGE_SUCCEEDED_RECORD_FAILED',
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          squarePaymentId: result.paymentId,
          amountCents: owed,
        },
      })
      console.error(
        `[invoice-pay] PAYMENT RECORDED AT SQUARE BUT DB WRITE FAILED — reconcile manually. ` +
        `invoice=${invoice.number} squarePaymentId=${result.paymentId} amountCents=${owed}`
      )
      return NextResponse.json({
        ok: false,
        error: {
          code: 'PAYMENT_RECORD_FAILED',
          message: `Payment processed but confirmation failed. Contact support with order ${invoice.number}.`,
        },
      }, { status: 500 })
    }
  } catch (err) {
    // Pre-charge failure: no card was charged. Preserve auth semantics, otherwise 500.
    const status = (err as { status?: number })?.status
    if (status === 401) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
    }
    reportError(err, { route: 'account/invoices/pay' })
    return NextResponse.json({ ok: false, error: { code: 'PAYMENT_FAILED' } }, { status: 500 })
  }
}
