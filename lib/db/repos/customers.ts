import type { CustomerRow } from '../types'
import { getDb, newId, nowIso } from '../client'

export interface Customer {
  id: string
  email: string
  name: string
  phone: string | null
  company: string | null
  squareCustomerId: string | null
  tags: string[]
  notes: string
  lifetimeValueCents: number
  orderCount: number
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
  lastSeenAt: string | null
}

function hydrate(row: CustomerRow): Customer {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    company: row.company,
    squareCustomerId: row.square_customer_id,
    tags: JSON.parse(row.tags) as string[],
    notes: row.notes,
    lifetimeValueCents: row.lifetime_value_cents,
    orderCount: row.order_count,
    emailVerifiedAt: row.email_verified_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSeenAt: row.last_seen_at,
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM customers WHERE id = ? AND deleted_at IS NULL LIMIT 1')
    .bind(id)
    .first<CustomerRow>()
  return row ? hydrate(row) : null
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM customers WHERE email = ? AND deleted_at IS NULL LIMIT 1')
    .bind(email.toLowerCase().trim())
    .first<CustomerRow>()
  return row ? hydrate(row) : null
}

export async function upsertCustomerByEmail(input: {
  email: string
  name?: string
  phone?: string | null
  company?: string | null
}): Promise<Customer> {
  const existing = await getCustomerByEmail(input.email)
  if (existing) return existing
  const db = getDb()
  const id = newId('cus')
  const now = nowIso()
  await db
    .prepare(
      `INSERT INTO customers (id, email, name, phone, company, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.email.toLowerCase().trim(),
      input.name ?? '',
      input.phone ?? null,
      input.company ?? null,
      now,
      now
    )
    .run()
  const created = await getCustomerById(id)
  if (!created) throw new Error('Failed to create customer')
  return created
}

export async function listCustomers(opts: { limit?: number; offset?: number; search?: string } = {}): Promise<Customer[]> {
  const db = getDb()
  const limit = opts.limit ?? 50
  const offset = opts.offset ?? 0
  if (opts.search) {
    const q = `%${opts.search.toLowerCase()}%`
    const { results } = await db
      .prepare(
        `SELECT * FROM customers
         WHERE deleted_at IS NULL
           AND (lower(email) LIKE ? OR lower(name) LIKE ? OR lower(company) LIKE ?)
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .bind(q, q, q, limit, offset)
      .all<CustomerRow>()
    return results.map(hydrate)
  }
  const { results } = await db
    .prepare('SELECT * FROM customers WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all<CustomerRow>()
  return results.map(hydrate)
}

export async function updateLastSeen(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE customers SET last_seen_at = ? WHERE id = ?').bind(nowIso(), id).run()
}
