export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

interface QuoteRow {
  id: number
  customer_id: number
  product_type: string
  quantity: string
  description: string
  status: string
  turnaround: string
  delivery_method: string
  price: number | null
  admin_notes: string | null
  customer_token: string | null
  created_at: string
  response_sent_at: string | null
  accepted_at: string | null
  completed_at: string | null
  customer_name: string
  customer_email: string | null
  customer_phone: string
  customer_business: string | null
}

function formatQuote(row: QuoteRow) {
  return {
    id: row.id,
    productType: row.product_type,
    quantity: row.quantity,
    description: row.description,
    status: row.status,
    turnaround: row.turnaround,
    deliveryMethod: row.delivery_method,
    price: row.price,
    adminNotes: row.admin_notes,
    customerToken: row.customer_token,
    createdAt: row.created_at,
    responseSentAt: row.response_sent_at,
    acceptedAt: row.accepted_at,
    completedAt: row.completed_at,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      business: row.customer_business
    }
  }
}

// GET - Get single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params

    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.id = ?
    `).bind(id).first() as QuoteRow | null

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    return NextResponse.json(formatQuote(quote))
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

interface QuoteUpdateInput {
  status?: string
  price?: number | null
  adminNotes?: string | null
}

// PATCH - Update quote
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params
    const data = await request.json() as QuoteUpdateInput

    const updates: string[] = []
    const values: (string | number | null)[] = []

    if (data.status !== undefined) {
      updates.push('status = ?')
      values.push(data.status)

      // Set timestamps based on status
      if (data.status === 'complete') {
        updates.push('completed_at = datetime("now")')
      }
    }
    if (data.price !== undefined) {
      updates.push('price = ?')
      values.push(data.price)
    }
    if (data.adminNotes !== undefined) {
      updates.push('admin_notes = ?')
      values.push(data.adminNotes)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    values.push(id)

    await db.prepare(`UPDATE quotes SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run()

    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q LEFT JOIN customers c ON q.customer_id = c.id WHERE q.id = ?
    `).bind(id).first() as QuoteRow | null

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    return NextResponse.json(formatQuote(quote))
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}

// DELETE - Delete quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params

    await db.prepare('DELETE FROM quotes WHERE id = ?').bind(id).run()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 })
  }
}
