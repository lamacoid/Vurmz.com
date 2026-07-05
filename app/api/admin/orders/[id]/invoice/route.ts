import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getOrderById, listOrderItems } from '@/lib/db/repos/orders'
import { createInvoice, getInvoiceById } from '@/lib/db/repos/invoices'
import { getDb } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

/**
 * Phase B collect gate: turn a delivered-unpaid order into an invoice in
 * one tap. The invoice is built from the order's REAL items (one truth,
 * I1) and linked both ways: invoices.order_id points here, and the order
 * carries metadata.invoiceId. Idempotent (I4): a second tap returns the
 * invoice that already exists instead of creating a twin. Settlement
 * then closes itself: when that invoice is marked paid, the settled
 * derivation sees it with no further writes.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async session => {
    const { id } = await ctx.params
    const order = await getOrderById(id)
    if (!order) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    if (!order.customerId) {
      return NextResponse.json({ ok: false, error: { code: 'NO_CUSTOMER', message: 'This order has no customer record to invoice.' } }, { status: 422 })
    }

    const existingId = (order.metadata as { invoiceId?: string } | null)?.invoiceId
    if (existingId) {
      const existing = await getInvoiceById(existingId)
      if (existing) return NextResponse.json({ ok: true, data: { invoice: existing, existed: true } })
    }

    const items = await listOrderItems(id)
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: { code: 'EMPTY', message: 'No items on this order to invoice.' } }, { status: 422 })
    }

    const invoice = await createInvoice({
      customerId: order.customerId,
      orderId: order.id,
      items: items.map(it => ({ description: it.nameSnapshot, qty: it.qty, unitPriceCents: it.unitPriceCents })),
      notes: `For order ${order.number}`,
    })

    const db = getDb()
    await db
      .prepare(`UPDATE orders SET metadata = json_set(COALESCE(metadata,'{}'), '$.invoiceId', ?), updated_at = ? WHERE id = ?`)
      .bind(invoice.id, new Date().toISOString(), id)
      .run()

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'order.invoice_created', targetType: 'order', targetId: id,
      diff: { invoiceId: invoice.id, invoiceNumber: invoice.number, totalCents: invoice.totalCents },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { invoice, existed: false } })
  })
}
