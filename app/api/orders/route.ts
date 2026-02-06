export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, now } from '@/lib/d1'
import { createOrder } from '@/lib/order-helpers'

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

    const order = await createOrder({
      db,
      customerId: data.customerId,
      quoteId: data.quoteId,
      projectDescription: data.projectDescription,
      material: data.material,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      deliveryMethod: data.deliveryMethod,
      deliveryNotes: data.deliveryNotes,
      productionNotes: data.productionNotes,
      laserType: data.laserType,
    })

    // Update quote status if linked
    if (data.quoteId) {
      await db.prepare('UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?')
        .bind('APPROVED', now(), data.quoteId).run()
    }

    const result = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(order.id).first()
    return NextResponse.json(result, { status: 201 })
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
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.business_name as customer_company
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
