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

// GET - Get quote by customer token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const db = getD1()
    const { token } = await params

    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.customer_token = ?
    `).bind(token).first() as QuoteRow | null

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Return limited info for customer view
    return NextResponse.json({
      id: quote.id,
      productType: quote.product_type,
      quantity: quote.quantity,
      description: quote.description,
      status: quote.status,
      turnaround: quote.turnaround,
      deliveryMethod: quote.delivery_method,
      price: quote.price,
      adminNotes: quote.admin_notes,
      createdAt: quote.created_at,
      responseSentAt: quote.response_sent_at,
      acceptedAt: quote.accepted_at,
      customerName: quote.customer_name
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

// POST - Accept or decline quote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const db = getD1()
    const { token } = await params
    const { action } = await request.json() as { action: 'accept' | 'decline' }

    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Verify quote exists and is in 'quoted' status
    const quote = await db.prepare(`
      SELECT * FROM quotes WHERE customer_token = ?
    `).bind(token).first() as QuoteRow | null

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    if (quote.status !== 'quoted') {
      return NextResponse.json({
        error: quote.status === 'accepted' ? 'Quote already accepted' : 'Quote cannot be modified'
      }, { status: 400 })
    }

    const newStatus = action === 'accept' ? 'accepted' : 'declined'
    const timestamp = action === 'accept' ? ", accepted_at = datetime('now')" : ""

    await db.prepare(`
      UPDATE quotes SET status = ?${timestamp} WHERE customer_token = ?
    `).bind(newStatus, token).run()

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: action === 'accept'
        ? 'Quote accepted! We will begin work shortly.'
        : 'Quote declined. Thank you for considering us.'
    })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}
