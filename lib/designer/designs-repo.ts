/**
 * Saved designs: the folder every design lands in, ordered or not.
 * One row per (owner, product): a guest is a token in their browser, an
 * account is a customer id. Saving again updates the same row.
 */
import { getDb, newId, nowIso } from '@/lib/db/client'
import type { CardDesign } from './card'

export interface DesignRow {
  id: string
  customer_id: string | null
  guest_token: string | null
  email: string | null
  product_id: string | null
  kind: string
  design: string
  order_id: string | null
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface SavedDesign {
  id: string
  customerId: string | null
  email: string | null
  productId: string | null
  productName?: string | null
  productSlug?: string | null
  kind: string
  design: CardDesign
  orderId: string | null
  orderNumber?: string | null
  createdAt: string
  updatedAt: string
}

const GUEST_TTL_DAYS = 30

export function hydrate(r: DesignRow & { product_name?: string | null; product_slug?: string | null; order_number?: string | null }): SavedDesign {
  return {
    id: r.id,
    customerId: r.customer_id,
    email: r.email,
    productId: r.product_id,
    productName: r.product_name ?? null,
    productSlug: r.product_slug ?? null,
    kind: r.kind,
    design: JSON.parse(r.design) as CardDesign,
    orderId: r.order_id,
    orderNumber: r.order_number ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

function expiry(): string {
  return new Date(Date.now() + GUEST_TTL_DAYS * 86400_000).toISOString()
}

/** Upsert by owner + product. Returns the row id. */
export async function saveDesign(input: {
  customerId?: string | null
  guestToken?: string | null
  productId: string
  design: CardDesign
  email?: string | null
}): Promise<{ id: string }> {
  const db = getDb()
  const now = nowIso()
  const owner = input.customerId
    ? { sql: 'customer_id = ?', val: input.customerId }
    : { sql: 'guest_token = ?', val: input.guestToken! }
  const existing = await db.prepare(
    `SELECT id FROM designs WHERE ${owner.sql} AND product_id = ? AND order_id IS NULL ORDER BY updated_at DESC LIMIT 1`
  ).bind(owner.val, input.productId).first<{ id: string }>()
  const json = JSON.stringify(input.design)
  if (existing) {
    await db.prepare(
      `UPDATE designs SET design = ?, updated_at = ?, email = COALESCE(?, email), customer_id = COALESCE(?, customer_id),
         expires_at = CASE WHEN ? IS NOT NULL OR email IS NOT NULL OR customer_id IS NOT NULL THEN NULL ELSE ? END
       WHERE id = ?`
    ).bind(json, now, input.email ?? null, input.customerId ?? null, input.customerId ?? null, expiry(), existing.id).run()
    return { id: existing.id }
  }
  const id = newId('dsg')
  await db.prepare(
    `INSERT INTO designs (id, customer_id, guest_token, email, product_id, kind, design, order_id, created_at, updated_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?)`
  ).bind(id, input.customerId ?? null, input.customerId ? null : input.guestToken ?? null, input.email ?? null, input.productId, input.design.kind, json, now, now, input.customerId || input.email ? null : expiry()).run()
  return { id }
}

/** Attach an email to every unordered guest design under a token, so it never expires. */
export async function claimGuestDesigns(guestToken: string, email: string): Promise<number> {
  const db = getDb()
  const r = await db.prepare(
    `UPDATE designs SET email = ?, expires_at = NULL, updated_at = ? WHERE guest_token = ? AND email IS NULL`
  ).bind(email.toLowerCase().trim(), nowIso(), guestToken).run()
  return r.meta.changes ?? 0
}

/** When a customer signs in, their guest designs become theirs. */
export async function adoptGuestDesigns(guestToken: string, customerId: string): Promise<void> {
  await getDb().prepare(
    `UPDATE designs SET customer_id = ?, expires_at = NULL, updated_at = ? WHERE guest_token = ? AND customer_id IS NULL`
  ).bind(customerId, nowIso(), guestToken).run()
}

/** Link the design rows behind an order's designed items to the order. */
export async function linkDesignsToOrder(ids: string[], orderId: string): Promise<void> {
  if (!ids.length) return
  const db = getDb()
  const placeholders = ids.map(() => '?').join(',')
  await db.prepare(`UPDATE designs SET order_id = ?, expires_at = NULL, updated_at = ? WHERE id IN (${placeholders}) AND order_id IS NULL`)
    .bind(orderId, nowIso(), ...ids).run()
}

export async function listDesignsForCustomer(customerId: string): Promise<SavedDesign[]> {
  const { results } = await getDb().prepare(
    `SELECT d.*, p.name AS product_name, p.slug AS product_slug, o.number AS order_number
     FROM designs d LEFT JOIN products p ON p.id = d.product_id LEFT JOIN orders o ON o.id = d.order_id
     WHERE d.customer_id = ? ORDER BY d.updated_at DESC LIMIT 100`
  ).bind(customerId).all<DesignRow & { product_name: string | null; product_slug: string | null; order_number: string | null }>()
  return results.map(hydrate)
}

export async function getDesignForOwner(id: string, owner: { customerId?: string | null; guestToken?: string | null }): Promise<SavedDesign | null> {
  const row = await getDb().prepare(
    `SELECT d.*, p.name AS product_name, p.slug AS product_slug FROM designs d LEFT JOIN products p ON p.id = d.product_id WHERE d.id = ?`
  ).bind(id).first<DesignRow & { product_name: string | null; product_slug: string | null }>()
  if (!row) return null
  const mine = (owner.customerId && row.customer_id === owner.customerId) || (owner.guestToken && row.guest_token === owner.guestToken)
  return mine ? hydrate(row) : null
}

/** The admin room: everything, newest first. */
export async function listDesignsAdmin(opts: { limit?: number; ordered?: 'yes' | 'no' | 'all' } = {}): Promise<Array<SavedDesign & { customerName: string | null; customerPhone: string | null; customerEmail: string | null }>> {
  const where = opts.ordered === 'yes' ? 'WHERE d.order_id IS NOT NULL' : opts.ordered === 'no' ? 'WHERE d.order_id IS NULL' : ''
  const { results } = await getDb().prepare(
    `SELECT d.*, p.name AS product_name, p.slug AS product_slug, o.number AS order_number,
            c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email
     FROM designs d
     LEFT JOIN products p ON p.id = d.product_id
     LEFT JOIN orders o ON o.id = d.order_id
     LEFT JOIN customers c ON c.id = d.customer_id
     ${where} ORDER BY d.updated_at DESC LIMIT ?`
  ).bind(opts.limit ?? 200).all<DesignRow & { product_name: string | null; product_slug: string | null; order_number: string | null; customer_name: string | null; customer_phone: string | null; customer_email: string | null }>()
  return results.map(r => ({ ...hydrate(r), customerName: r.customer_name, customerPhone: r.customer_phone, customerEmail: r.customer_email }))
}
