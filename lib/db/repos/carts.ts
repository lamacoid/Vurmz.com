/**
 * Server-side cart persistence for logged-in customers.
 * One row per customer; items column is a JSON array of CartItem snapshots.
 */
import { getDb, newId, nowIso } from '../client'

export interface ServerCartItem {
  productId: string
  slug: string
  name: string
  priceCents: number
  packSize: number
  qty: number
  heroUrl: string | null
  oneOff?: boolean
  metadata?: Record<string, unknown>
}

interface CartRow {
  id: string
  customer_id: string | null
  guest_token: string | null
  items: string
  notes: string
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface CustomerCart {
  id: string
  items: ServerCartItem[]
  notes: string
  updatedAt: string
}

function hydrate(row: CartRow): CustomerCart {
  let items: ServerCartItem[] = []
  try {
    const parsed = JSON.parse(row.items)
    if (Array.isArray(parsed)) items = parsed as ServerCartItem[]
  } catch {}
  return { id: row.id, items, notes: row.notes ?? '', updatedAt: row.updated_at }
}

export async function getCustomerCart(customerId: string): Promise<CustomerCart | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM carts WHERE customer_id = ? ORDER BY updated_at DESC LIMIT 1')
    .bind(customerId)
    .first<CartRow>()
  return row ? hydrate(row) : null
}

/**
 * Replace the customer's cart with the given items. Idempotent — creates the
 * row on first save.
 */
export async function saveCustomerCart(
  customerId: string,
  items: ServerCartItem[],
  notes: string = ''
): Promise<CustomerCart> {
  const db = getDb()
  const now = nowIso()
  const existing = await db
    .prepare('SELECT id FROM carts WHERE customer_id = ? LIMIT 1')
    .bind(customerId)
    .first<{ id: string }>()
  const itemsJson = JSON.stringify(items)
  if (existing) {
    await db
      .prepare('UPDATE carts SET items = ?, notes = ?, updated_at = ? WHERE id = ?')
      .bind(itemsJson, notes, now, existing.id)
      .run()
    const row = await db.prepare('SELECT * FROM carts WHERE id = ?').bind(existing.id).first<CartRow>()
    return hydrate(row!)
  }
  const id = newId('cart')
  await db
    .prepare(
      `INSERT INTO carts (id, customer_id, guest_token, items, notes, created_at, updated_at)
       VALUES (?, ?, NULL, ?, ?, ?, ?)`
    )
    .bind(id, customerId, itemsJson, notes, now, now)
    .run()
  const row = await db.prepare('SELECT * FROM carts WHERE id = ?').bind(id).first<CartRow>()
  return hydrate(row!)
}

export async function clearCustomerCart(customerId: string): Promise<void> {
  const db = getDb()
  await db.prepare('DELETE FROM carts WHERE customer_id = ?').bind(customerId).run()
}
