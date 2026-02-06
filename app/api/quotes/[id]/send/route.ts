export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'
import { siteInfo } from '@/lib/site-info'

// POST - Send quote to customer (generates a link)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params
    const { price, adminNotes } = await request.json() as { price: number; adminNotes?: string }

    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 })
    }

    // Generate a unique token for the customer to view/accept the quote
    const token = crypto.randomUUID()

    // Update the quote
    await db.prepare(`
      UPDATE quotes
      SET price = ?, admin_notes = ?, customer_token = ?, status = 'quoted', response_sent_at = datetime('now')
      WHERE id = ?
    `).bind(price, adminNotes || null, token, id).run()

    // Get the updated quote with customer info
    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.id = ?
    `).bind(id).first() as any

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Generate the quote link for the customer
    const quoteLink = `${siteInfo.url}/view-quote/${token}`

    // Return the quote info and the link to share
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
      customerToken: quote.customer_token,
      createdAt: quote.created_at,
      responseSentAt: quote.response_sent_at,
      acceptedAt: quote.accepted_at,
      completedAt: quote.completed_at,
      customer: {
        name: quote.customer_name,
        email: quote.customer_email,
        phone: quote.customer_phone,
        business: quote.customer_business
      },
      quoteLink
    })
  } catch (error) {
    console.error('Error sending quote:', error)
    return NextResponse.json({ error: 'Failed to send quote' }, { status: 500 })
  }
}
