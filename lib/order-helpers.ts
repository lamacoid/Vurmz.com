/**
 * Unified order creation helper for VURMZ.
 *
 * Single function used by all three order creation paths:
 *   1. POST /api/orders (standalone admin creation)
 *   2. POST /api/quotes/[id]/accept (admin approves quote → order)
 *   3. POST /api/webhooks/square (payment webhook → order)
 */

import { generateId, now } from './d1'

export interface CreateOrderInput {
  db: D1Database
  customerId: string
  quoteId?: string
  projectDescription: string
  material: string
  quantity: number
  price: number
  status?: string
  deliveryMethod?: string
  deliveryNotes?: string
  productionNotes?: string
  laserType?: string
  paymentStatus?: string
  squarePaymentId?: string
  /** Provide an existing order number (e.g. from a quote) to reuse it */
  orderNumber?: string
}

export interface CreatedOrder {
  id: string
  orderNumber: string
}

/**
 * Generate order number in format V-{MONTH_LETTER}{YY}####
 * Example: V-B260001 = February 2026, order #1
 *
 * Checks both orders AND quotes tables for the highest existing number
 * to avoid collisions between the two number sequences.
 */
export async function generateOrderNumber(db: D1Database): Promise<string> {
  const monthLetters = 'ABCDEFGHIJKL'
  const today = new Date()
  const monthLetter = monthLetters[today.getMonth()]
  const year = String(today.getFullYear()).slice(-2)
  const prefix = `V-${monthLetter}${year}`

  // Check both tables to find the highest number
  const [lastOrder, lastQuote] = await Promise.all([
    db.prepare('SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1')
      .bind(`${prefix}%`).first(),
    db.prepare('SELECT order_number FROM quotes WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1')
      .bind(`${prefix}%`).first()
  ])

  let maxNum = 0

  if (lastOrder) {
    const num = parseInt((lastOrder as { order_number: string }).order_number.slice(-4))
    if (num > maxNum) maxNum = num
  }
  if (lastQuote) {
    const num = parseInt((lastQuote as { order_number: string }).order_number.slice(-4))
    if (num > maxNum) maxNum = num
  }

  return `${prefix}${String(maxNum + 1).padStart(4, '0')}`
}

/**
 * Create an order record in the orders table.
 * Optionally links back to a quote and updates the quote status.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const { db } = input
  const id = generateId()
  const timestamp = now()
  const orderNumber = input.orderNumber || await generateOrderNumber(db)

  await db.prepare(`
    INSERT INTO orders (
      id, order_number, customer_id, quote_id,
      project_description, material, quantity, price,
      status, delivery_method, delivery_notes,
      production_notes, laser_type,
      payment_status, square_payment_id,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    orderNumber,
    input.customerId,
    input.quoteId || null,
    input.projectDescription,
    input.material,
    input.quantity,
    input.price,
    input.status || 'PENDING',
    input.deliveryMethod || 'PICKUP',
    input.deliveryNotes || null,
    input.productionNotes || null,
    input.laserType || null,
    input.paymentStatus || 'unpaid',
    input.squarePaymentId || null,
    timestamp,
    timestamp
  ).run()

  return { id, orderNumber }
}

/**
 * Generate a receipt number in format R-{YYYYMMDD}-{RANDOM}
 */
export function generateReceiptNumber(): string {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `R-${dateStr}-${random}`
}
