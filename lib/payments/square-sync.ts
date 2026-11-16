/**
 * Square sync: pull payments, refunds, and payouts from Square and post
 * anything the webhook missed. Idempotent through the ledger posting
 * keys, so running it every day is harmless.
 *
 * Windowing (PIPELINE.md section 7, note 4): the window starts 7 days
 * before the last successful checkpoint, because Square objects change
 * after they are created (refunds, disputes, fee settlement). Square's own
 * cursor pagination walks the window. The checkpoint moves only after the
 * whole run succeeds.
 *
 * A payment whose reference_id matches nothing of ours still posts, with
 * no order or invoice link. Money lists those as exceptions for Zach to
 * tie to a ticket by hand. Nothing is guessed.
 */
import { getEnv } from '@/lib/db/client'
import { getSetting, setSetting } from '@/lib/db/repos/settings'
import { getSquareConfig } from './square'
import { recordSquarePayout, recordSquareRefund, settleSquarePayment } from '@/lib/money/settle'
import { upsertSquareInvoice, type InvoiceStatus } from '@/lib/db/repos/invoices'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'

const CHECKPOINT_KEY = 'square_sync_checkpoint'
const OVERLAP_MS = 7 * 24 * 60 * 60 * 1000
const FIRST_RUN_LOOKBACK_MS = 400 * 24 * 60 * 60 * 1000
const MAX_PAGES = 40

interface Money { amount: number; currency: string }
interface SqPayment {
  id: string; status: string; amount_money?: Money; reference_id?: string; order_id?: string; receipt_url?: string
  created_at?: string; processing_fee?: Array<{ amount_money?: Money }>
  card_details?: { card?: { last_4?: string; card_brand?: string } }
}
interface SqRefund { id: string; status: string; payment_id?: string; amount_money?: Money; reason?: string; created_at?: string }
interface SqPayout { id: string; status: string; amount_money?: Money; created_at?: string; arrival_date?: string }
interface SqInvoice {
  id: string; order_id?: string; invoice_number?: string; title?: string; description?: string; status?: string
  created_at?: string; updated_at?: string; public_url?: string
  primary_recipient?: { customer_id?: string; given_name?: string; family_name?: string; email_address?: string; phone_number?: string; company_name?: string }
  payment_requests?: Array<{ due_date?: string; computed_amount_money?: Money; total_completed_amount_money?: Money }>
}

export interface SyncReport {
  ok: boolean
  from: string
  to: string
  invoices: { seen: number; mirrored: number; open: number }
  payments: { seen: number; posted: number; unmatched: number }
  refunds: { seen: number; posted: number }
  payouts: { seen: number; posted: number }
  error?: string
}

/** Square invoice status to ours. Drafts, cancels, and failures are not money owed. */
function mapInvoiceStatus(sq: string | undefined, dueDate: string | null, now: Date): InvoiceStatus | null {
  switch (sq) {
    case 'UNPAID': case 'SCHEDULED': case 'PAYMENT_PENDING':
      return dueDate && new Date(dueDate).getTime() < now.getTime() - 24 * 60 * 60 * 1000 ? 'overdue' : 'sent'
    case 'PARTIALLY_PAID': return 'partially_paid'
    case 'PAID': return 'paid'
    case 'REFUNDED': case 'PARTIALLY_REFUNDED': return 'refunded'
    case 'CANCELED': return 'void'
    default: return null
  }
}

/**
 * Mirror the invoices Zach writes in the Square app, so money owed shows on
 * Today and in Money without anyone re-typing it here. Walks every invoice
 * at the location (the list is small) and upserts by Square invoice id.
 * Returns a map of Square order id to our invoice id for linking payments.
 */
async function mirrorSquareInvoices(report: SyncReport, now: Date): Promise<Map<string, string>> {
  const cfg = getSquareConfig()!
  const byOrder = new Map<string, string>()
  const invoices = await page<SqInvoice>('/v2/invoices', 'invoices', { location_id: cfg.locationId, limit: '100' })
  for (const inv of invoices) {
    report.invoices.seen++
    const requests = inv.payment_requests ?? []
    const totalCents = requests.reduce((s, r) => s + (r.computed_amount_money?.amount ?? 0), 0)
    const paidCents = requests.reduce((s, r) => s + (r.total_completed_amount_money?.amount ?? 0), 0)
    const dueDate = requests.map(r => r.due_date).filter(Boolean).sort()[0] ?? null
    const status = mapInvoiceStatus(inv.status, dueDate, now)
    if (!status || totalCents <= 0) continue

    const who = inv.primary_recipient ?? {}
    const name = [who.given_name, who.family_name].filter(Boolean).join(' ') || who.company_name || ''
    // customers.email is the key here. Square lets an invoice go out by text
    // alone, so a recipient with no email gets a stable stand-in address.
    const email = who.email_address?.trim().toLowerCase()
      || `square-${(who.customer_id ?? inv.id).toLowerCase()}@no-email.vurmz.invalid`
    const customer = await upsertCustomerByEmail({ email, name, phone: who.phone_number ?? null, company: who.company_name ?? null })

    const { invoice, inserted } = await upsertSquareInvoice({
      squareInvoiceId: inv.id, squareOrderId: inv.order_id ?? null, squareNumber: inv.invoice_number ?? null,
      customerId: customer.id, status, totalCents, amountPaidCents: paidCents, dueDate,
      notes: [inv.title, inv.description, inv.public_url ? `Square: ${inv.public_url}` : ''].filter(Boolean).join('\n'),
      sentAt: inv.created_at ?? null, paidAt: status === 'paid' ? (inv.updated_at ?? null) : null,
    })
    if (inserted) report.invoices.mirrored++
    if (status === 'sent' || status === 'overdue' || status === 'partially_paid') report.invoices.open++
    if (inv.order_id) byOrder.set(inv.order_id, invoice.id)
  }
  return byOrder
}

async function page<T>(path: string, key: string, params: Record<string, string>): Promise<T[]> {
  const cfg = getSquareConfig()
  if (!cfg) throw new Error('square_not_configured')
  const env = getEnv()
  const base = cfg.environment === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
  const out: T[] = []
  let cursor: string | undefined
  for (let i = 0; i < MAX_PAGES; i++) {
    const qs = new URLSearchParams({ ...params, ...(cursor ? { cursor } : {}) })
    const res = await fetch(`${base}${path}?${qs}`, {
      headers: { Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`, 'Square-Version': '2024-11-20' },
    })
    const json = (await res.json()) as Record<string, unknown> & { cursor?: string; errors?: Array<{ detail?: string; code?: string }> }
    if (!res.ok) throw new Error(`square ${path}: ${json.errors?.map(e => e.code ?? e.detail).join(', ') ?? res.status}`)
    out.push(...((json[key] as T[] | undefined) ?? []))
    cursor = json.cursor
    if (!cursor) break
  }
  return out
}

export async function runSquareSync(opts: { since?: string } = {}): Promise<SyncReport> {
  const cfg = getSquareConfig()
  const now = new Date()
  const checkpoint = opts.since ?? (await getSetting<string>(CHECKPOINT_KEY))
  const from = new Date(checkpoint ? new Date(checkpoint).getTime() - OVERLAP_MS : now.getTime() - FIRST_RUN_LOOKBACK_MS)
  const report: SyncReport = {
    ok: false, from: from.toISOString(), to: now.toISOString(),
    invoices: { seen: 0, mirrored: 0, open: 0 },
    payments: { seen: 0, posted: 0, unmatched: 0 }, refunds: { seen: 0, posted: 0 }, payouts: { seen: 0, posted: 0 },
  }
  if (!cfg) { report.error = 'square_not_configured'; return report }

  try {
    const window = { begin_time: report.from, end_time: report.to, sort_order: 'ASC', location_id: cfg.locationId }

    // Invoices first, so a payment on a Square invoice can find its paper.
    const invoiceByOrder = await mirrorSquareInvoices(report, now)

    const payments = await page<SqPayment>('/v2/payments', 'payments', window)
    for (const p of payments) {
      report.payments.seen++
      if (p.status !== 'COMPLETED' || !p.amount_money) continue
      const feeCents = (p.processing_fee ?? []).reduce((s, f) => s + Math.abs(f.amount_money?.amount ?? 0), 0)
      const invoiceId = p.order_id ? invoiceByOrder.get(p.order_id) ?? null : null
      const r = await settleSquarePayment({
        squarePaymentId: p.id, amountCents: p.amount_money.amount, occurredAt: p.created_at,
        receiptUrl: p.receipt_url ?? null, brand: p.card_details?.card?.card_brand ?? null, last4: p.card_details?.card?.last_4 ?? null,
        referenceId: p.reference_id ?? null, invoiceId, source: 'square_sync', feeCents: feeCents || null,
      })
      if (r.inserted) report.payments.posted++
      if (!r.orderId && !r.invoiceId) report.payments.unmatched++
    }

    const refunds = await page<SqRefund>('/v2/refunds', 'refunds', window)
    for (const rf of refunds) {
      report.refunds.seen++
      if (rf.status !== 'COMPLETED' || !rf.amount_money) continue
      const r = await recordSquareRefund({
        squareRefundId: rf.id, squarePaymentId: rf.payment_id ?? null, amountCents: rf.amount_money.amount,
        occurredAt: rf.created_at, source: 'square_sync', reason: rf.reason,
      })
      if (r.inserted) report.refunds.posted++
    }

    const payouts = await page<SqPayout>('/v2/payouts', 'payouts', { location_id: cfg.locationId, begin_time: report.from, end_time: report.to, sort_order: 'ASC' })
    for (const po of payouts) {
      report.payouts.seen++
      if (po.status !== 'PAID' || !po.amount_money) continue
      const r = await recordSquarePayout({
        squarePayoutId: po.id, amountCents: po.amount_money.amount, occurredAt: po.arrival_date ?? po.created_at,
        source: 'square_sync', status: po.status,
      })
      if (r.inserted) report.payouts.posted++
    }

    // Mark it good before saving, or the saved report always reads ok: false.
    report.ok = true
    await setSetting(CHECKPOINT_KEY, report.to)
    await setSetting('square_sync_last', { at: report.to, report })
  } catch (err) {
    report.ok = false
    report.error = String((err as Error)?.message ?? err)
    await setSetting('square_sync_last', { at: report.to, report }).catch(() => {})
  }
  return report
}
