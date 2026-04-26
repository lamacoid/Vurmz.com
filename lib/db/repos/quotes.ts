import { getDb, newId, nowIso } from '../client'

export type QuoteStatus = 'new' | 'drafting' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted'

export interface QuoteItem {
  id: string
  description: string
  qty: number
  unitPriceCents: number
  totalCents: number
  position: number
}

export interface Quote {
  id: string
  number: string
  customerId: string | null
  email: string
  status: QuoteStatus
  totalCents: number
  notes: string
  expiresAt: string | null
  acceptedAt: string | null
  convertedOrderId: string | null
  createdAt: string
  updatedAt: string
}

interface QuoteRow {
  id: string; number: string; customer_id: string | null; email: string; status: QuoteStatus
  total_cents: number; notes: string; expires_at: string | null; accepted_at: string | null
  converted_order_id: string | null; created_at: string; updated_at: string
}

interface QuoteItemRow {
  id: string; quote_id: string; description: string; qty: number; unit_price_cents: number; total_cents: number; position: number
}

function hydrate(row: QuoteRow): Quote {
  return {
    id: row.id, number: row.number, customerId: row.customer_id, email: row.email,
    status: row.status, totalCents: row.total_cents, notes: row.notes,
    expiresAt: row.expires_at, acceptedAt: row.accepted_at,
    convertedOrderId: row.converted_order_id,
    createdAt: row.created_at, updatedAt: row.updated_at,
  }
}

async function nextQuoteNumber(): Promise<string> {
  const db = getDb()
  const now = nowIso()
  await db.prepare(
    `INSERT INTO counters (key, value, updated_at) VALUES ('quote_number', 1001, ?)
     ON CONFLICT(key) DO UPDATE SET value = value + 1, updated_at = excluded.updated_at`
  ).bind(now).run()
  const row = await db.prepare("SELECT value FROM counters WHERE key = 'quote_number'").first<{ value: number }>()
  return `QT-${row?.value ?? 1001}`
}

export interface CreateQuoteInput {
  customerId?: string | null
  email: string
  items: Array<{ description: string; qty: number; unitPriceCents: number }>
  notes?: string
  expiresAt?: string | null
}

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const db = getDb()
  const id = newId('qte')
  const number = await nextQuoteNumber()
  const now = nowIso()
  const total = input.items.reduce((s, it) => s + it.unitPriceCents * it.qty, 0)

  const stmts = [
    db.prepare(
      `INSERT INTO quotes (id, number, customer_id, email, status, total_cents, notes, expires_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)`
    ).bind(id, number, input.customerId ?? null, input.email.toLowerCase().trim(), total, input.notes ?? '', input.expiresAt ?? null, now, now),
  ]
  input.items.forEach((it, i) => {
    stmts.push(
      db.prepare(
        `INSERT INTO quote_items (id, quote_id, description, qty, unit_price_cents, total_cents, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(newId('qli'), id, it.description, it.qty, it.unitPriceCents, it.unitPriceCents * it.qty, (i + 1) * 10)
    )
  })
  await db.batch(stmts)
  const row = await db.prepare('SELECT * FROM quotes WHERE id = ?').bind(id).first<QuoteRow>()
  return hydrate(row!)
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM quotes WHERE id = ?').bind(id).first<QuoteRow>()
  return row ? hydrate(row) : null
}

export async function listQuotes(opts: { status?: QuoteStatus; limit?: number } = {}): Promise<Quote[]> {
  const db = getDb()
  const limit = opts.limit ?? 200
  if (opts.status) {
    const { results } = await db.prepare('SELECT * FROM quotes WHERE status = ? ORDER BY created_at DESC LIMIT ?').bind(opts.status, limit).all<QuoteRow>()
    return results.map(hydrate)
  }
  const { results } = await db.prepare('SELECT * FROM quotes ORDER BY created_at DESC LIMIT ?').bind(limit).all<QuoteRow>()
  return results.map(hydrate)
}

export async function listQuoteItems(quoteId: string): Promise<QuoteItem[]> {
  const db = getDb()
  const { results } = await db.prepare('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY position').bind(quoteId).all<QuoteItemRow>()
  return results.map(r => ({
    id: r.id, description: r.description, qty: r.qty, unitPriceCents: r.unit_price_cents, totalCents: r.total_cents, position: r.position,
  }))
}

export async function setQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  const db = getDb()
  const now = nowIso()
  if (status === 'accepted') {
    await db.prepare('UPDATE quotes SET status = ?, accepted_at = ?, updated_at = ? WHERE id = ?').bind(status, now, now, id).run()
  } else {
    await db.prepare('UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?').bind(status, now, id).run()
  }
}

export async function markQuoteConverted(quoteId: string, orderId: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE quotes SET status = ?, converted_order_id = ?, updated_at = ? WHERE id = ?')
    .bind('converted', orderId, nowIso(), quoteId).run()
}
