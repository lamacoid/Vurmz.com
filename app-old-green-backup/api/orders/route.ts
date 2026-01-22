export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'

// Helper to generate order number in format V-{letter}{YY}####
// Month letters: A=Jan, B=Feb, C=Mar, D=Apr, E=May, F=Jun, G=Jul, H=Aug, I=Sep, J=Oct, K=Nov, L=Dec
// Example: V-B260001 = February 2026, order 1
async function generateOrderNumber(db: D1Database): Promise<string> {
  const monthLetters = 'ABCDEFGHIJKL'
  const now = new Date()
  const monthLetter = monthLetters[now.getMonth()] // A-L for Jan-Dec
  const year = String(now.getFullYear()).slice(-2) // Last 2 digits of year
  const prefix = `V-${monthLetter}${year}`

  // Get the highest order number for this month/year prefix
  const lastOrder = await db.prepare(
    'SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1'
  ).bind(`${prefix}%`).first()

  if (!lastOrder) {
    return `${prefix}0001`
  }

  // Extract the sequential number (last 4 digits) and increment
  const lastNum = parseInt((lastOrder as any).order_number.slice(-4))
  const nextNum = String(lastNum + 1).padStart(4, '0')
  return `${prefix}${nextNum}`
}

interface OrderInput {
  customerId: string
  quoteId?: string
  projectDescription: string
  material: string
  quantity: number
  price: number
  status?: string
  dueDate?: string
  deliveryMethod?: string
  deliveryNotes?: string
  productionNotes?: string
  laserType?: string
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const data = await request.json() as OrderInput
    const id = generateId()
    const timestamp = now()
    const orderNumber = await generateOrderNumber(db)

    await db.prepare(`
      INSERT INTO orders (id, order_number, customer_id, quote_id, project_description, material, quantity, price, status, due_date, delivery_method, delivery_notes, production_notes, laser_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      orderNumber,
      data.customerId,
      data.quoteId || null,
      data.projectDescription,
      data.material,
      data.quantity,
      data.price,
      data.status || 'PENDING',
      data.dueDate || null,
      data.deliveryMethod || 'PICKUP',
      data.deliveryNotes || null,
      data.productionNotes || null,
      data.laserType || null,
      timestamp,
      timestamp
    ).run()

    // Update quote status if linked
    if (data.quoteId) {
      await db.prepare('UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?')
        .bind('APPROVED', timestamp, data.quoteId).run()
    }

    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first()
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET - Get all orders
export async function GET(request: NextRequest) {
  try {
    const db = getD1()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = `
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.company as customer_company
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
    `
    const params: any[] = []

    if (status) {
      query += ' WHERE o.status = ?'
      params.push(status)
    }

    query += ' ORDER BY o.created_at DESC LIMIT ?'
    params.push(limit)

    const result = await db.prepare(query).bind(...params).all()

    const orders = (result.results || []).map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      customerId: row.customer_id,
      projectDescription: row.project_description,
      material: row.material,
      quantity: row.quantity,
      price: row.price,
      status: row.status,
      dueDate: row.due_date,
      deliveryMethod: row.delivery_method,
      createdAt: row.created_at,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
        company: row.customer_company
      }
    }))

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
