import { getDb, newId, nowIso } from '../client'

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'partially_paid' | 'overdue' | 'void' | 'refunded'

export interface InvoiceItem {
  id: string
  description: string
  qty: number
  unitPriceCents: number
  totalCents: number
  position: number
}

export interface Invoice {
  id: string
  number: string
  customerId: string
  orderId: string | null
  status: InvoiceStatus
  subtotalCents: number
  taxCents: number
  totalCents: number
  amountPaidCents: number
  dueDate: string | null
  squareInvoiceId: string | null
  squareOrderId: string | null
  notes: string
  sentAt: string | null
  viewedAt: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

interface InvoiceRow {
  id: string; number: string; customer_id: string; order_id: string | null; status: InvoiceStatus
  subtotal_cents: number; tax_cents: number; total_cents: number; amount_paid_cents: number
  due_date: string | null; square_invoice_id: string | null; square_order_id: string | null
  notes: string; sent_at: string | null; viewed_at: string | null; paid_at: string | null
  created_at: string; updated_at: string
}
interface InvoiceItemRow { id: string; invoice_id: string; description: string; qty: number; unit_price_cents: number; total_cents: number; position: number }

function hydrate(row: InvoiceRow): Invoice {
  return {
    id: row.id, number: row.number, customerId: row.customer_id, orderId: row.order_id,
    status: row.status, subtotalCents: row.subtotal_cents, taxCents: row.tax_cents,
    totalCents: row.total_cents, amountPaidCents: row.amount_paid_cents,
    dueDate: row.due_date, squareInvoiceId: row.square_invoice_id, squareOrderId: row.square_order_id,
    notes: row.notes, sentAt: row.sent_at, viewedAt: row.viewed_at, paidAt: row.paid_at,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
}

function hydrateItem(row: InvoiceItemRow): InvoiceItem {
  return { id: row.id, description: row.description, qty: row.qty, unitPriceCents: row.unit_price_cents, totalCents: row.total_cents, position: row.position }
}

async function nextInvoiceNumber(): Promise<string> {
  const db = getDb()
  const now = nowIso()
  // Atomic increment — UPSERT returning new value
  await db.prepare(
    `INSERT INTO counters (key, value, updated_at) VALUES ('invoice_number', 1001, ?)
     ON CONFLICT(key) DO UPDATE SET value = value + 1, updated_at = excluded.updated_at`
  ).bind(now).run()
  const row = await db.prepare("SELECT value FROM counters WHERE key = 'invoice_number'").first<{ value: number }>()
  const seq = row?.value ?? 1001
  return `INV-${seq}`
}

export interface CreateInvoiceInput {
  customerId: string
  orderId?: string | null
  items: Array<{ description: string; qty: number; unitPriceCents: number }>
  taxCents?: number
  dueDate?: string | null
  notes?: string
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const db = getDb()
  const id = newId('inv')
  const number = await nextInvoiceNumber()
  const now = nowIso()
  const subtotalCents = input.items.reduce((s, it) => s + it.unitPriceCents * it.qty, 0)
  const totalCents = subtotalCents + (input.taxCents ?? 0)

  const stmts = [
    db.prepare(
      `INSERT INTO invoices (
        id, number, customer_id, order_id, status,
        subtotal_cents, tax_cents, total_cents, amount_paid_cents,
        due_date, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, 0, ?, ?, ?, ?)`
    ).bind(
      id, number, input.customerId, input.orderId ?? null,
      subtotalCents, input.taxCents ?? 0, totalCents,
      input.dueDate ?? null, input.notes ?? '', now, now
    ),
  ]
  input.items.forEach((it, i) => {
    stmts.push(
      db.prepare(
        `INSERT INTO invoice_items (id, invoice_id, description, qty, unit_price_cents, total_cents, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(newId('ili'), id, it.description, it.qty, it.unitPriceCents, it.unitPriceCents * it.qty, (i + 1) * 10)
    )
  })
  await db.batch(stmts)
  const row = await db.prepare('SELECT * FROM invoices WHERE id = ?').bind(id).first<InvoiceRow>()
  return hydrate(row!)
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM invoices WHERE id = ?').bind(id).first<InvoiceRow>()
  return row ? hydrate(row) : null
}

export async function getInvoiceByNumber(number: string): Promise<Invoice | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM invoices WHERE number = ?').bind(number).first<InvoiceRow>()
  return row ? hydrate(row) : null
}

export async function listInvoices(opts: { customerId?: string; status?: InvoiceStatus; limit?: number; offset?: number } = {}): Promise<Invoice[]> {
  const db = getDb()
  const limit = opts.limit ?? 100
  const offset = opts.offset ?? 0
  const conds: string[] = []
  const binds: unknown[] = []
  if (opts.customerId) { conds.push('customer_id = ?'); binds.push(opts.customerId) }
  if (opts.status) { conds.push('status = ?'); binds.push(opts.status) }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''
  const { results } = await db.prepare(`SELECT * FROM invoices ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...binds, limit, offset).all<InvoiceRow>()
  return results.map(hydrate)
}

export async function listInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  const db = getDb()
  const { results } = await db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY position').bind(invoiceId).all<InvoiceItemRow>()
  return results.map(hydrateItem)
}

export async function setInvoiceStatus(id: string, status: InvoiceStatus): Promise<void> {
  const db = getDb()
  const now = nowIso()
  const ts = status === 'sent' ? { col: 'sent_at', val: now }
           : status === 'viewed' ? { col: 'viewed_at', val: now }
           : status === 'paid' ? { col: 'paid_at', val: now }
           : null
  if (ts) {
    await db.prepare(`UPDATE invoices SET status = ?, ${ts.col} = COALESCE(${ts.col}, ?), updated_at = ? WHERE id = ?`)
      .bind(status, ts.val, now, id).run()
  } else {
    await db.prepare('UPDATE invoices SET status = ?, updated_at = ? WHERE id = ?').bind(status, now, id).run()
  }
}

export async function recordInvoicePayment(invoiceId: string, amountCents: number): Promise<void> {
  const db = getDb()
  const inv = await getInvoiceById(invoiceId)
  if (!inv) return
  const newPaid = inv.amountPaidCents + amountCents
  const fullyPaid = newPaid >= inv.totalCents
  const status: InvoiceStatus = fullyPaid ? 'paid' : 'partially_paid'
  const now = nowIso()
  await db.prepare(
    `UPDATE invoices SET amount_paid_cents = ?, status = ?, paid_at = COALESCE(paid_at, ?), updated_at = ? WHERE id = ?`
  ).bind(newPaid, status, fullyPaid ? now : null, now, invoiceId).run()
}
