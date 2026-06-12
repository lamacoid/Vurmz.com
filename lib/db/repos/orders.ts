import { getDb, newId, nowIso } from '../client'

export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
export type FulfillmentMethod = 'ship' | 'hand_deliver' | 'pickup' | 'uber_direct' | 'invoice_later'
export type OrderChannel = 'shop' | 'service' | 'admin'

export interface OrderLineItemInput {
  productId: string | null
  variantId?: string | null
  nameSnapshot: string
  qty: number
  unitPriceCents: number
  metadata?: Record<string, unknown>
}

export interface ShippingAddress {
  name: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country?: string
  phone?: string | null
}

export interface CreateOrderInput {
  customerId?: string | null
  email: string
  subtotalCents: number
  taxCents?: number
  fulfillmentFeeCents?: number
  totalCents: number
  status?: OrderStatus
  channel?: OrderChannel
  fulfillmentMethod: FulfillmentMethod
  fulfillmentAddress?: ShippingAddress | null
  fulfillmentEta?: string | null
  notes?: string
  metadata?: Record<string, unknown>
  items: OrderLineItemInput[]
}

export interface Order {
  id: string
  number: string
  customerId: string | null
  email: string
  subtotalCents: number
  taxCents: number
  shippingCents: number
  fulfillmentFeeCents: number
  totalCents: number
  status: OrderStatus
  channel: OrderChannel
  fulfillmentMethod: FulfillmentMethod
  fulfillmentAddress: ShippingAddress | null
  fulfillmentEta: string | null
  trackingNumber: string | null
  uberDeliveryId: string | null
  notes: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string | null
  variantId: string | null
  nameSnapshot: string
  qty: number
  unitPriceCents: number
  metadata: Record<string, unknown>
  position: number
}

interface OrderRow {
  id: string
  number: string
  customer_id: string | null
  email: string
  subtotal_cents: number
  tax_cents: number
  shipping_cents: number
  fulfillment_fee_cents: number
  total_cents: number
  status: OrderStatus
  channel: OrderChannel
  fulfillment_method: FulfillmentMethod
  fulfillment_address: string | null
  fulfillment_eta: string | null
  tracking_number: string | null
  uber_delivery_id: string | null
  notes: string
  metadata: string
  created_at: string
  updated_at: string
}

interface OrderItemRow {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  name_snapshot: string
  qty: number
  unit_price_cents: number
  metadata: string
  position: number
}

function hydrateOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.number,
    customerId: row.customer_id,
    email: row.email,
    subtotalCents: row.subtotal_cents,
    taxCents: row.tax_cents,
    shippingCents: row.shipping_cents,
    fulfillmentFeeCents: row.fulfillment_fee_cents ?? 0,
    totalCents: row.total_cents,
    status: row.status,
    channel: row.channel,
    fulfillmentMethod: row.fulfillment_method,
    fulfillmentAddress: row.fulfillment_address ? JSON.parse(row.fulfillment_address) as ShippingAddress : null,
    fulfillmentEta: row.fulfillment_eta,
    trackingNumber: row.tracking_number,
    uberDeliveryId: row.uber_delivery_id,
    notes: row.notes,
    metadata: JSON.parse(row.metadata) as Record<string, unknown>,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function hydrateItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    variantId: row.variant_id,
    nameSnapshot: row.name_snapshot,
    qty: row.qty,
    unitPriceCents: row.unit_price_cents,
    metadata: JSON.parse(row.metadata) as Record<string, unknown>,
    position: row.position,
  }
}

/**
 * Short, human-readable, sequential-ish order number.
 * Format: V-YYMMDD-XXXX (last 4 chars of id uppercased).
 */
function makeOrderNumber(id: string): string {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const tail = id.slice(-4).toUpperCase()
  return `V-${yy}${mm}${dd}-${tail}`
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const db = getDb()
  const id = newId('ord')
  const number = makeOrderNumber(id)
  const now = nowIso()

  const statements = [
    db.prepare(
      `INSERT INTO orders (
        id, number, customer_id, email,
        subtotal_cents, tax_cents, shipping_cents, fulfillment_fee_cents, total_cents,
        status, channel, fulfillment_method, fulfillment_address, fulfillment_eta,
        notes, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      number,
      input.customerId ?? null,
      input.email.toLowerCase().trim(),
      input.subtotalCents,
      input.taxCents ?? 0,
      0,
      input.fulfillmentFeeCents ?? 0,
      input.totalCents,
      input.status ?? 'new',
      input.channel ?? 'shop',
      input.fulfillmentMethod,
      input.fulfillmentAddress ? JSON.stringify(input.fulfillmentAddress) : null,
      input.fulfillmentEta ?? null,
      input.notes ?? '',
      JSON.stringify(input.metadata ?? {}),
      now,
      now
    ),
    db.prepare(
      `INSERT INTO order_events (id, order_id, type, to_status, actor_type, created_at)
       VALUES (?, ?, 'created', ?, 'customer', ?)`
    ).bind(newId('evt'), id, input.status ?? 'new', now),
  ]

  for (let i = 0; i < input.items.length; i++) {
    const it = input.items[i]
    statements.push(
      db.prepare(
        `INSERT INTO order_items (id, order_id, product_id, variant_id, name_snapshot, qty, unit_price_cents, metadata, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        newId('oli'),
        id,
        it.productId,
        it.variantId ?? null,
        it.nameSnapshot,
        it.qty,
        it.unitPriceCents,
        JSON.stringify(it.metadata ?? {}),
        (i + 1) * 10
      )
    )
  }

  await db.batch(statements)

  const row = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<OrderRow>()
  if (!row) throw new Error('Order not found after insert')
  return hydrateOrder(row)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<OrderRow>()
  return row ? hydrateOrder(row) : null
}

export async function getOrderByNumber(number: string): Promise<Order | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM orders WHERE number = ?').bind(number).first<OrderRow>()
  return row ? hydrateOrder(row) : null
}

export async function listOrders(opts: { limit?: number; offset?: number; status?: OrderStatus } = {}): Promise<Order[]> {
  const db = getDb()
  const limit = opts.limit ?? 100
  const offset = opts.offset ?? 0
  if (opts.status) {
    const { results } = await db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(opts.status, limit, offset).all<OrderRow>()
    return results.map(hydrateOrder)
  }
  const { results } = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset).all<OrderRow>()
  return results.map(hydrateOrder)
}

export async function listOrderItems(orderId: string): Promise<OrderItem[]> {
  const db = getDb()
  const { results } = await db.prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY position').bind(orderId).all<OrderItemRow>()
  return results.map(hydrateItem)
}

/**
 * Per-order personalization flags for board/dashboard cards — one GROUP BY
 * instead of N item queries. hasText/hasElement come from item metadata.
 */
export async function listOrderItemFlags(): Promise<Record<string, { hasText: boolean; hasElement: boolean }>> {
  const db = getDb()
  const { results } = await db.prepare(
    `SELECT order_id,
            MAX(CASE WHEN COALESCE(json_extract(metadata, '$.engraving.text'), '') != '' THEN 1 ELSE 0 END) AS has_text,
            MAX(CASE WHEN json_extract(metadata, '$.engraving.element.id') IS NOT NULL THEN 1 ELSE 0 END) AS has_element
     FROM order_items GROUP BY order_id`
  ).all<{ order_id: string; has_text: number; has_element: number }>()
  return Object.fromEntries(results.map(r => [r.order_id, { hasText: r.has_text === 1, hasElement: r.has_element === 1 }]))
}

export type ProofStatus = 'needed' | 'sent' | 'approved'

/**
 * Track the proof-photo workflow on the order's metadata (no schema change;
 * the status CHECK stays untouched). Writes an order_event for the timeline.
 */
export async function setOrderProof(orderId: string, status: ProofStatus, actor: { id?: string | null }): Promise<void> {
  const db = getDb()
  const now = nowIso()
  await db.batch([
    db.prepare(
      `UPDATE orders SET metadata = json_set(COALESCE(metadata, '{}'), '$.proof', json(?)), updated_at = ? WHERE id = ?`
    ).bind(JSON.stringify({ status, at: now }), now, orderId),
    db.prepare(
      `INSERT INTO order_events (id, order_id, type, from_status, to_status, actor_type, actor_id, note, created_at)
       VALUES (?, ?, 'proof', NULL, NULL, 'admin', ?, ?, ?)`
    ).bind(newId('evt'), orderId, actor.id ?? null, `Proof ${status}`, now),
  ])
}

export interface OrderEvent {
  id: string
  orderId: string
  type: string
  fromStatus: OrderStatus | null
  toStatus: OrderStatus | null
  actorType: string
  note: string | null
  createdAt: string
}

interface OrderEventRow {
  id: string
  order_id: string
  type: string
  from_status: string | null
  to_status: string | null
  actor_type: string
  actor_id: string | null
  note: string | null
  created_at: string
}

export async function listOrderEvents(orderId: string): Promise<OrderEvent[]> {
  const db = getDb()
  const { results } = await db.prepare(
    'SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC'
  ).bind(orderId).all<OrderEventRow>()
  return results.map(r => ({
    id: r.id,
    orderId: r.order_id,
    type: r.type,
    fromStatus: (r.from_status as OrderStatus | null) ?? null,
    toStatus: (r.to_status as OrderStatus | null) ?? null,
    actorType: r.actor_type,
    note: r.note,
    createdAt: r.created_at,
  }))
}

export async function updateOrderStatus(orderId: string, to: OrderStatus, actor: { type: 'admin' | 'customer' | 'system' | 'webhook'; id?: string | null; note?: string }): Promise<void> {
  const db = getDb()
  const before = await getOrderById(orderId)
  if (!before) throw new Error('Order not found')
  const now = nowIso()
  await db.batch([
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').bind(to, now, orderId),
    db.prepare(
      `INSERT INTO order_events (id, order_id, type, from_status, to_status, actor_type, actor_id, note, created_at)
       VALUES (?, ?, 'status_change', ?, ?, ?, ?, ?, ?)`
    ).bind(newId('evt'), orderId, before.status, to, actor.type, actor.id ?? null, actor.note ?? null, now),
  ])
}
