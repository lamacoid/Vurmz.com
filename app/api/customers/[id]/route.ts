export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, now } from '@/lib/d1'

// GET - Get single customer with their orders and quotes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params

    const customer = await db.prepare(`
      SELECT * FROM customers WHERE id = ?
    `).bind(id).first()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get customer's orders
    const orders = await db.prepare(`
      SELECT id, order_number, project_description, price, status, created_at
      FROM orders WHERE customer_id = ?
      ORDER BY created_at DESC
    `).bind(id).all()

    // Get customer's quotes
    const quotes = await db.prepare(`
      SELECT id, product_type, quantity, price, status, created_at
      FROM quotes WHERE customer_id = ?
      ORDER BY created_at DESC
    `).bind(id).all()

    // Calculate totals
    const totalSpent = (orders.results || []).reduce((sum: number, o: any) =>
      sum + (o.price || 0), 0
    )
    const orderCount = (orders.results || []).length

    const c = customer as any
    return NextResponse.json({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      address: c.address,
      city: c.city,
      state: c.state,
      zip: c.zip,
      notes: c.notes,
      createdAt: c.created_at,
      stats: {
        totalSpent,
        orderCount,
        quoteCount: (quotes.results || []).length
      },
      orders: (orders.results || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        description: o.project_description,
        price: o.price,
        status: o.status,
        createdAt: o.created_at
      })),
      quotes: (quotes.results || []).map((q: any) => ({
        id: q.id,
        productType: q.product_type,
        quantity: q.quantity,
        price: q.price,
        status: q.status,
        createdAt: q.created_at
      }))
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

// PATCH - Update customer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params
    const updates = await request.json() as {
      name?: string
      email?: string
      phone?: string
      company?: string
      address?: string
      city?: string
      state?: string
      zip?: string
      notes?: string
    }

    const setClauses: string[] = ['updated_at = ?']
    const values: any[] = [now()]

    if (updates.name) { setClauses.push('name = ?'); values.push(updates.name) }
    if (updates.email) { setClauses.push('email = ?'); values.push(updates.email) }
    if (updates.phone) { setClauses.push('phone = ?'); values.push(updates.phone) }
    if (updates.company !== undefined) { setClauses.push('company = ?'); values.push(updates.company) }
    if (updates.address !== undefined) { setClauses.push('address = ?'); values.push(updates.address) }
    if (updates.city !== undefined) { setClauses.push('city = ?'); values.push(updates.city) }
    if (updates.state !== undefined) { setClauses.push('state = ?'); values.push(updates.state) }
    if (updates.zip !== undefined) { setClauses.push('zip = ?'); values.push(updates.zip) }
    if (updates.notes !== undefined) { setClauses.push('notes = ?'); values.push(updates.notes) }

    values.push(id)

    await db.prepare(`UPDATE customers SET ${setClauses.join(', ')} WHERE id = ?`)
      .bind(...values).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}
