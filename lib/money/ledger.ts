/**
 * The ledger: the one writer for money, and the one rule for "settled".
 *
 * Every path that moves money (checkout card, cash tap, invoice marked
 * paid, customer paying an invoice, Square webhook, Square sync, expense
 * form, backfill) calls post(). Nothing else inserts into ledger.
 *
 * post() is idempotent on posting_key: calling it twice with the same key
 * inserts once and returns { inserted: false } the second time. That is
 * what makes a webhook retry, a double tap, or a re-run sync safe.
 *
 * Settlement is DERIVED, never stored: an order is settled when the sum of
 * its sale and refund lines covers its total. SETTLED_SQL is the SQL form
 * of that rule for the dashboard and order pages. Use it, do not copy it.
 */
import { getDb, newId, nowIso } from '@/lib/db/client'

export type LedgerKind = 'sale' | 'refund' | 'fee' | 'payout' | 'expense' | 'adjustment'
export type LedgerMethod = 'card' | 'cash' | 'invoice' | 'square_invoice' | 'venmo' | 'other'
export type LedgerSource =
  | 'checkout' | 'admin_cash' | 'invoice_paid' | 'account_pay'
  | 'square_webhook' | 'square_sync' | 'backfill' | 'manual'

export interface LedgerEntry {
  id: string
  postingKey: string
  occurredAt: string
  kind: LedgerKind
  amountCents: number
  taxCents: number
  method: LedgerMethod
  category: string
  orderId: string | null
  invoiceId: string | null
  paymentId: string | null
  customerId: string | null
  source: LedgerSource
  externalId: string | null
  receiptKey: string | null
  note: string
  createdBy: string | null
  createdAt: string
}

export interface PostInput {
  /** Unique per real-world money event. See keys() for the house forms. */
  postingKey: string
  kind: LedgerKind
  /** Positive for money in, negative for money out. post() enforces the sign per kind. */
  amountCents: number
  occurredAt?: string
  taxCents?: number
  method?: LedgerMethod
  category?: string
  orderId?: string | null
  invoiceId?: string | null
  paymentId?: string | null
  customerId?: string | null
  source: LedgerSource
  externalId?: string | null
  receiptKey?: string | null
  note?: string
  createdBy?: string | null
}

/** Expense categories offered in Money. Books group by these. */
export const EXPENSE_CATEGORIES = [
  'materials', 'blanks', 'delivery', 'shipping', 'software', 'equipment', 'supplies', 'marketing', 'fees', 'tax', 'other',
] as const

/** The house posting keys. One place, so no two paths spell them differently. */
export const keys = {
  squarePayment: (paymentId: string) => `square:${paymentId}`,
  squareRefund: (refundId: string) => `square_refund:${refundId}`,
  squareFee: (paymentId: string) => `square_fee:${paymentId}`,
  squarePayout: (payoutId: string) => `square_payout:${payoutId}`,
  cash: (orderId: string) => `cash:${orderId}`,
  invoiceManual: (invoiceId: string) => `invoice:${invoiceId}:manual`,
  expense: (id: string) => `expense:${id}`,
  adjustment: (id: string) => `adjustment:${id}`,
}

/** Default books category for a kind, when the caller does not say. */
const DEFAULT_CATEGORY: Record<LedgerKind, string> = {
  sale: 'engraving',
  refund: 'engraving',
  fee: 'fees',
  payout: 'transfer',
  expense: 'other',
  adjustment: 'adjustment',
}

/**
 * SQL fragment: true when order alias `o` is settled: sale lines cover the
 * total. Refunds do NOT un-settle (a refund is money Zach chose to give
 * back, not money the customer owes). A zero-total order counts as
 * settled. Payouts, fees, and expenses never count.
 */
export const SETTLED_SQL = `(
  o.total_cents <= 0 OR
  COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale'), 0) >= o.total_cents
)`

/** Same rule for an invoice alias `i`. */
export const INVOICE_SETTLED_SQL = `(
  i.total_cents <= 0 OR
  COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.invoice_id = i.id AND l.kind = 'sale'), 0) >= i.total_cents
)`

function signFor(kind: LedgerKind, amount: number): number {
  const abs = Math.abs(Math.round(amount))
  switch (kind) {
    case 'sale': return abs
    case 'refund':
    case 'fee':
    case 'expense': return -abs
    case 'payout': return -abs // money leaving Square for the bank; a transfer, excluded from income
    case 'adjustment': return Math.round(amount)
  }
}

/**
 * Write one ledger row. Idempotent on postingKey.
 * Returns the row (existing or new) and whether this call inserted it.
 */
export async function post(input: PostInput): Promise<{ entry: LedgerEntry; inserted: boolean }> {
  const db = getDb()
  if (!input.postingKey || input.postingKey.length > 200) throw new Error('ledger: bad posting key')
  if (!Number.isFinite(input.amountCents)) throw new Error('ledger: bad amount')
  if (input.kind === 'adjustment' && !input.note?.trim()) throw new Error('ledger: adjustment needs a note')

  const id = newId('led')
  const now = nowIso()
  const amount = signFor(input.kind, input.amountCents)
  const res = await db.prepare(
    `INSERT INTO ledger (id, posting_key, occurred_at, kind, amount_cents, tax_cents, method, category,
       order_id, invoice_id, payment_id, customer_id, source, external_id, receipt_key, note, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(posting_key) DO NOTHING`
  ).bind(
    id, input.postingKey, input.occurredAt ?? now, input.kind, amount, Math.max(0, Math.round(input.taxCents ?? 0)),
    input.method ?? 'other', input.category ?? DEFAULT_CATEGORY[input.kind],
    input.orderId ?? null, input.invoiceId ?? null, input.paymentId ?? null, input.customerId ?? null,
    input.source, input.externalId ?? null, input.receiptKey ?? null, (input.note ?? '').slice(0, 1000),
    input.createdBy ?? null, now,
  ).run()
  const inserted = (res.meta?.changes ?? 0) > 0
  const row = await db.prepare('SELECT * FROM ledger WHERE posting_key = ?').bind(input.postingKey).first<LedgerRow>()
  if (!row) throw new Error('ledger: row vanished after insert')
  return { entry: hydrate(row), inserted }
}

/** Sum of sale lines for an order, in cents (what the customer has paid; refunds are separate). */
export async function orderPaidCents(orderId: string): Promise<number> {
  const db = getDb()
  const row = await db.prepare(
    `SELECT COALESCE(SUM(amount_cents),0) AS c FROM ledger WHERE order_id = ? AND kind = 'sale'`
  ).bind(orderId).first<{ c: number }>()
  return row?.c ?? 0
}

export async function isOrderSettled(orderId: string): Promise<boolean> {
  const db = getDb()
  const row = await db.prepare(`SELECT ${SETTLED_SQL} AS s FROM orders o WHERE o.id = ?`).bind(orderId).first<{ s: number }>()
  return row?.s === 1
}

export async function listLedger(opts: {
  from?: string; to?: string; kind?: LedgerKind; orderId?: string; limit?: number; offset?: number
} = {}): Promise<LedgerEntry[]> {
  const db = getDb()
  const conds: string[] = []
  const binds: unknown[] = []
  if (opts.from) { conds.push('occurred_at >= ?'); binds.push(opts.from) }
  if (opts.to) { conds.push('occurred_at < ?'); binds.push(opts.to) }
  if (opts.kind) { conds.push('kind = ?'); binds.push(opts.kind) }
  if (opts.orderId) { conds.push('order_id = ?'); binds.push(opts.orderId) }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''
  const limit = Math.min(500, Math.max(1, opts.limit ?? 200))
  const { results } = await db.prepare(
    `SELECT * FROM ledger ${where} ORDER BY occurred_at DESC, created_at DESC LIMIT ? OFFSET ?`
  ).bind(...binds, limit, opts.offset ?? 0).all<LedgerRow>()
  return results.map(hydrate)
}

/** Sale lines nobody can tie to an order or invoice. Money shows these as exceptions. */
export async function listExceptions(limit = 50): Promise<LedgerEntry[]> {
  const db = getDb()
  const { results } = await db.prepare(
    `SELECT * FROM ledger WHERE kind IN ('sale','refund') AND order_id IS NULL AND invoice_id IS NULL
     ORDER BY occurred_at DESC LIMIT ?`
  ).bind(limit).all<LedgerRow>()
  return results.map(hydrate)
}

export interface MonthSummary {
  month: string
  salesCents: number
  refundsCents: number
  feesCents: number
  expensesCents: number
  payoutsCents: number
  taxCents: number
  netCents: number
}

/** Cash-basis month rows: income minus fees minus expenses. Payouts shown, not netted. */
export async function monthlySummary(months = 12): Promise<MonthSummary[]> {
  const db = getDb()
  const { results } = await db.prepare(
    `SELECT substr(occurred_at,1,7) AS month,
       SUM(CASE WHEN kind='sale' THEN amount_cents ELSE 0 END) AS sales,
       SUM(CASE WHEN kind='refund' THEN amount_cents ELSE 0 END) AS refunds,
       SUM(CASE WHEN kind='fee' THEN amount_cents ELSE 0 END) AS fees,
       SUM(CASE WHEN kind='expense' THEN amount_cents ELSE 0 END) AS expenses,
       SUM(CASE WHEN kind='payout' THEN amount_cents ELSE 0 END) AS payouts,
       SUM(CASE WHEN kind='adjustment' THEN amount_cents ELSE 0 END) AS adjustments,
       SUM(CASE WHEN kind IN ('sale','refund') THEN tax_cents ELSE 0 END) AS tax
     FROM ledger GROUP BY month ORDER BY month DESC LIMIT ?`
  ).bind(Math.min(36, months)).all<{ month: string; sales: number; refunds: number; fees: number; expenses: number; payouts: number; adjustments: number; tax: number }>()
  return results.map(r => ({
    month: r.month,
    salesCents: r.sales,
    refundsCents: r.refunds,
    feesCents: r.fees,
    expensesCents: r.expenses,
    payoutsCents: r.payouts,
    taxCents: r.tax,
    netCents: r.sales + r.refunds + r.fees + r.expenses + r.adjustments,
  })).reverse()
}

interface LedgerRow {
  id: string; posting_key: string; occurred_at: string; kind: LedgerKind; amount_cents: number; tax_cents: number
  method: LedgerMethod; category: string; order_id: string | null; invoice_id: string | null; payment_id: string | null
  customer_id: string | null; source: LedgerSource; external_id: string | null; receipt_key: string | null
  note: string; created_by: string | null; created_at: string
}

function hydrate(r: LedgerRow): LedgerEntry {
  return {
    id: r.id, postingKey: r.posting_key, occurredAt: r.occurred_at, kind: r.kind, amountCents: r.amount_cents,
    taxCents: r.tax_cents, method: r.method, category: r.category, orderId: r.order_id, invoiceId: r.invoice_id,
    paymentId: r.payment_id, customerId: r.customer_id, source: r.source, externalId: r.external_id,
    receiptKey: r.receipt_key, note: r.note, createdBy: r.created_by, createdAt: r.created_at,
  }
}
