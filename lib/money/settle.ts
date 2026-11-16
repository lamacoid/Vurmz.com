/**
 * Settle paths. Each one is the whole story for one way money moves:
 * the payments row (legacy, kept for receipts and Square ids), the
 * ledger line (the truth), and the invoice or order bookkeeping that
 * hangs off it. Every function here is safe to call twice.
 *
 * Callers: checkout (card), admin cash tap, admin "mark invoice paid",
 * customer pays invoice on the site, Square webhook, Square sync, backfill.
 */
import { getDb, newId, nowIso } from '@/lib/db/client'
import { getInvoiceById, recordInvoicePayment, setInvoiceStatus } from '@/lib/db/repos/invoices'
import { getOrderById } from '@/lib/db/repos/orders'
import { keys, orderPaidCents, post, type LedgerMethod, type LedgerSource } from './ledger'

interface PaymentRow { id: string; invoice_id: string | null; customer_id: string | null; amount_cents: number; metadata: string }

/** Resolve what a Square reference_id points at. Orders and invoices share the field. */
export async function resolveReference(referenceId: string | null | undefined): Promise<{
  orderId: string | null; invoiceId: string | null; customerId: string | null; orderNumber: string | null
}> {
  const none = { orderId: null, invoiceId: null, customerId: null, orderNumber: null }
  if (!referenceId) return none
  const order = await getOrderById(referenceId)
  if (order) return { orderId: order.id, invoiceId: null, customerId: order.customerId, orderNumber: order.number }
  const inv = await getInvoiceById(referenceId)
  if (inv) return { orderId: inv.orderId, invoiceId: inv.id, customerId: inv.customerId, orderNumber: null }
  return none
}

export interface SquarePaymentInput {
  squarePaymentId: string
  amountCents: number
  occurredAt?: string
  receiptUrl?: string | null
  brand?: string | null
  last4?: string | null
  /** Square reference_id: our order id or invoice id. Resolved here when links are not given. */
  referenceId?: string | null
  orderId?: string | null
  invoiceId?: string | null
  customerId?: string | null
  source: LedgerSource
  /** Square processing fee, when the event carries it. Posted as its own fee line. */
  feeCents?: number | null
  taxCents?: number | null
  note?: string
}

/**
 * A completed Square card payment. Writes the payments row if missing,
 * posts the sale line, bumps the invoice if one is linked. Idempotent on
 * the Square payment id end to end.
 */
export async function settleSquarePayment(input: SquarePaymentInput): Promise<{ inserted: boolean; orderId: string | null; invoiceId: string | null }> {
  const db = getDb()
  const now = nowIso()
  let { orderId = null, invoiceId = null, customerId = null } = input
  let orderNumber: string | null = null
  if (!orderId && !invoiceId) {
    const r = await resolveReference(input.referenceId)
    orderId = r.orderId; invoiceId = r.invoiceId; customerId = customerId ?? r.customerId; orderNumber = r.orderNumber
  } else if (orderId && !orderNumber) {
    const o = await getOrderById(orderId)
    orderNumber = o?.number ?? null
    customerId = customerId ?? o?.customerId ?? null
  }
  if (invoiceId && !orderId) {
    const inv = await getInvoiceById(invoiceId)
    orderId = inv?.orderId ?? null
    customerId = customerId ?? inv?.customerId ?? null
  }

  // Legacy payments row: receipts, card brand, Square id. Keyed on square_payment_id.
  let payRow = await db.prepare('SELECT id, invoice_id, customer_id, amount_cents, metadata FROM payments WHERE square_payment_id = ?')
    .bind(input.squarePaymentId).first<PaymentRow>()
  if (!payRow) {
    const id = newId('pay')
    await db.prepare(
      `INSERT INTO payments (id, invoice_id, customer_id, amount_cents, status, square_payment_id, square_receipt_url, method_brand, method_last4, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'succeeded', ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(square_payment_id) DO NOTHING`
    ).bind(
      id, invoiceId, customerId, input.amountCents, input.squarePaymentId, input.receiptUrl ?? null,
      input.brand ?? null, input.last4 ?? null,
      JSON.stringify(orderId ? { orderId, orderNumber } : {}), input.occurredAt ?? now, now,
    ).run()
    payRow = await db.prepare('SELECT id, invoice_id, customer_id, amount_cents, metadata FROM payments WHERE square_payment_id = ?')
      .bind(input.squarePaymentId).first<PaymentRow>()
  }

  const { inserted } = await post({
    postingKey: keys.squarePayment(input.squarePaymentId),
    kind: 'sale',
    amountCents: input.amountCents,
    occurredAt: input.occurredAt,
    taxCents: input.taxCents ?? 0,
    method: 'card',
    orderId, invoiceId, customerId,
    paymentId: payRow?.id ?? null,
    source: input.source,
    externalId: input.squarePaymentId,
    note: input.note ?? (orderNumber ? `Order ${orderNumber}` : ''),
  })

  if (inserted && invoiceId) {
    await recordInvoicePayment(invoiceId, input.amountCents)
  }
  if (input.feeCents && input.feeCents > 0) {
    await post({
      postingKey: keys.squareFee(input.squarePaymentId),
      kind: 'fee', amountCents: input.feeCents, occurredAt: input.occurredAt,
      method: 'card', category: 'fees', orderId, invoiceId, customerId,
      paymentId: payRow?.id ?? null, source: input.source, externalId: input.squarePaymentId,
      note: 'Square processing fee',
    })
  }
  return { inserted, orderId, invoiceId }
}

/**
 * Cash (or Venmo, Zelle) in hand for an order. Posts whatever is still
 * owed. A second tap posts nothing: the key is per order.
 */
export async function settleCash(orderId: string, actor: { id?: string | null }, method: LedgerMethod = 'cash'): Promise<{ inserted: boolean; amountCents: number }> {
  const db = getDb()
  const order = await getOrderById(orderId)
  if (!order) return { inserted: false, amountCents: 0 }
  const paid = await orderPaidCents(orderId)
  const owed = Math.max(0, order.totalCents - paid)
  if (owed === 0) return { inserted: false, amountCents: 0 }
  const now = nowIso()
  const { inserted } = await post({
    postingKey: keys.cash(orderId),
    kind: 'sale', amountCents: owed, method, taxCents: order.taxCents,
    orderId, customerId: order.customerId, source: 'admin_cash',
    note: `Order ${order.number}, ${method}`, createdBy: actor.id ?? 'admin',
  })
  if (inserted) {
    await db.batch([
      db.prepare(
        `INSERT INTO payments (id, invoice_id, customer_id, amount_cents, status, square_payment_id, square_receipt_url, method_brand, method_last4, metadata, created_at, updated_at)
         VALUES (?, NULL, ?, ?, 'succeeded', NULL, NULL, ?, NULL, ?, ?, ?)`
      ).bind(newId('pay'), order.customerId, owed, method, JSON.stringify({ orderId: order.id, orderNumber: order.number }), now, now),
      db.prepare(
        `UPDATE orders SET metadata = json_set(COALESCE(metadata,'{}'), '$.payment', json(?)), updated_at = ? WHERE id = ?`
      ).bind(JSON.stringify({ settled: true, method, settledBy: actor.id ?? 'admin', settledAt: now }), now, orderId),
      db.prepare(
        `INSERT INTO order_events (id, order_id, type, from_status, to_status, actor_type, actor_id, note, created_at)
         VALUES (?, ?, 'payment', NULL, NULL, 'admin', ?, ?, ?)`
      ).bind(newId('evt'), orderId, actor.id ?? null, `Paid in ${method}`, now),
    ])
  }
  return { inserted, amountCents: owed }
}

/**
 * Zach marks an invoice paid by hand (check, Venmo, cash). Posts the
 * remaining balance and closes the invoice. Second call: no-op.
 */
export async function markInvoicePaid(invoiceId: string, actor: { id?: string | null }, method: LedgerMethod = 'invoice'): Promise<{ inserted: boolean; amountCents: number }> {
  const inv = await getInvoiceById(invoiceId)
  if (!inv) return { inserted: false, amountCents: 0 }
  const owed = Math.max(0, inv.totalCents - inv.amountPaidCents)
  if (owed === 0) {
    if (inv.status !== 'paid') await setInvoiceStatus(invoiceId, 'paid')
    return { inserted: false, amountCents: 0 }
  }
  const { inserted } = await post({
    postingKey: keys.invoiceManual(invoiceId),
    kind: 'sale', amountCents: owed, method, taxCents: inv.taxCents,
    orderId: inv.orderId, invoiceId: inv.id, customerId: inv.customerId,
    source: 'invoice_paid', note: `Invoice ${inv.number}, marked paid`, createdBy: actor.id ?? 'admin',
  })
  if (inserted) await recordInvoicePayment(invoiceId, owed)
  return { inserted, amountCents: owed }
}

/** A completed Square refund. Links through the original payment. */
export async function recordSquareRefund(input: {
  squareRefundId: string; squarePaymentId: string | null; amountCents: number; occurredAt?: string; source: LedgerSource; reason?: string
}): Promise<{ inserted: boolean }> {
  const db = getDb()
  let orderId: string | null = null, invoiceId: string | null = null, customerId: string | null = null, paymentId: string | null = null
  if (input.squarePaymentId) {
    const p = await db.prepare('SELECT id, invoice_id, customer_id, amount_cents, metadata FROM payments WHERE square_payment_id = ?')
      .bind(input.squarePaymentId).first<PaymentRow>()
    if (p) {
      paymentId = p.id; invoiceId = p.invoice_id; customerId = p.customer_id
      try { orderId = (JSON.parse(p.metadata) as { orderId?: string }).orderId ?? null } catch { /* ignore */ }
      if (!orderId && invoiceId) orderId = (await getInvoiceById(invoiceId))?.orderId ?? null
    }
  }
  const { inserted } = await post({
    postingKey: keys.squareRefund(input.squareRefundId),
    kind: 'refund', amountCents: input.amountCents, occurredAt: input.occurredAt, method: 'card',
    orderId, invoiceId, customerId, paymentId, source: input.source, externalId: input.squareRefundId,
    note: input.reason ?? 'Square refund',
  })
  if (inserted && paymentId) {
    await db.prepare(`UPDATE payments SET status = CASE WHEN ? >= amount_cents THEN 'refunded' ELSE 'partially_refunded' END, updated_at = ? WHERE id = ?`)
      .bind(input.amountCents, nowIso(), paymentId).run()
  }
  return { inserted }
}

/** Square paid out to the bank. A transfer: shown in Money, never income. */
export async function recordSquarePayout(input: {
  squarePayoutId: string; amountCents: number; occurredAt?: string; source: LedgerSource; status?: string
}): Promise<{ inserted: boolean }> {
  return post({
    postingKey: keys.squarePayout(input.squarePayoutId),
    kind: 'payout', amountCents: input.amountCents, occurredAt: input.occurredAt, method: 'card',
    category: 'transfer', source: input.source, externalId: input.squarePayoutId,
    note: `Square payout${input.status ? ` (${input.status})` : ''}`,
  })
}
