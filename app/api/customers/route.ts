export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'

// POST - Create new customer
interface CustomerInput {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const data = await request.json() as CustomerInput
    const id = generateId()
    const timestamp = now()

    await db.prepare(`
      INSERT INTO customers (id, name, email, phone, company, address, city, state, zip, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.name,
      data.email,
      data.phone || null,
      data.company || null,
      data.address || null,
      data.city || null,
      data.state || 'CO',
      data.zip || null,
      data.notes || null,
      timestamp,
      timestamp
    ).run()

    const customer = await db.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first()
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

// GET - Get all customers
export async function GET(request: NextRequest) {
  try {
    const db = getD1()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = 'SELECT * FROM customers'
    const params: string[] = []

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR company LIKE ?'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    query += ' ORDER BY name ASC LIMIT ?'
    params.push(limit.toString())

    const stmt = db.prepare(query)
    const result = await stmt.bind(...params).all()

    // Get counts for each customer
    const customers = await Promise.all(
      (result.results || []).map(async (customer: any) => {
        const quotesCount = await db.prepare('SELECT COUNT(*) as count FROM quotes WHERE customer_id = ?').bind(customer.id).first()
        const ordersCount = await db.prepare('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?').bind(customer.id).first()
        return {
          ...customer,
          _count: {
            quotes: (quotesCount as any)?.count || 0,
            orders: (ordersCount as any)?.count || 0
          }
        }
      })
    )

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
