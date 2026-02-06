export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// GET - Get customer's orders
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal_session')?.value
    const customerId = request.cookies.get('portal_customer_id')?.value

    if (!sessionToken || !customerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getD1()

    // Verify session
    const customer = await db.prepare(
      'SELECT id, notes FROM customers WHERE id = ?'
    ).bind(customerId).first() as { id: string; notes: string | null } | null

    if (!customer?.notes) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let sessionData: { sessionToken?: string }
    try {
      sessionData = JSON.parse(customer.notes)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (sessionData.sessionToken !== sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get quotes/orders for this customer with order numbers
    const quotes = await db.prepare(`
      SELECT
        q.id,
        q.product_type as productType,
        q.quantity,
        q.description,
        q.status,
        q.price,
        q.turnaround,
        q.delivery_method as deliveryMethod,
        q.created_at as createdAt,
        q.response_sent_at as responseSentAt,
        q.accepted_at as acceptedAt,
        q.completed_at as completedAt,
        o.order_number as orderNumber
      FROM quotes q
      LEFT JOIN orders o ON q.id = o.quote_id
      WHERE q.customer_id = ?
      ORDER BY q.created_at DESC
    `).bind(customerId).all()

    // Map to order format
    const orders = (quotes.results || []).map((q: any) => ({
      id: q.id,
      orderNumber: q.orderNumber || `Q-${q.id}`,
      productType: q.productType,
      quantity: q.quantity,
      description: q.description,
      price: q.price,
      status: q.status,
      turnaround: q.turnaround,
      deliveryMethod: q.deliveryMethod,
      createdAt: q.createdAt,
      responseSentAt: q.responseSentAt,
      acceptedAt: q.acceptedAt,
      completedAt: q.completedAt
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
