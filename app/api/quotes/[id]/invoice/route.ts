export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
const SQUARE_API_URL = 'https://connect.squareup.com'

interface SquareCustomerResponse {
  customer?: { id: string }
  customers?: Array<{ id: string }>
  errors?: Array<{ detail: string }>
}

interface SquareInvoiceResponse {
  invoice?: {
    id: string
    invoice_number: string
    public_url: string
  }
  errors?: Array<{ detail: string }>
}

interface SquareLocationsResponse {
  locations?: Array<{ id: string }>
}

// POST - Create and send Square invoice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!SQUARE_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Square not configured' }, { status: 500 })
    }

    const db = getD1()
    const { id } = await params

    // Get the quote with customer info
    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.id = ?
    `).bind(id).first() as any

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    if (!quote.price) {
      return NextResponse.json({ error: 'No price set on quote' }, { status: 400 })
    }

    if (!quote.customer_email) {
      return NextResponse.json({ error: 'Customer email required for invoice' }, { status: 400 })
    }

    // Get Square location
    const locResponse = await fetch(`${SQUARE_API_URL}/v2/locations`, {
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      }
    })
    const locData = await locResponse.json() as SquareLocationsResponse
    const locationId = locData.locations?.[0]?.id

    if (!locationId) {
      return NextResponse.json({ error: 'Square location not found' }, { status: 500 })
    }

    // Find or create Square customer
    let customerId: string | undefined

    // Search for existing customer by email
    const searchResponse = await fetch(`${SQUARE_API_URL}/v2/customers/search`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          filter: {
            email_address: { exact: quote.customer_email }
          }
        }
      })
    })
    const searchData = await searchResponse.json() as SquareCustomerResponse

    if (searchData.customers && searchData.customers.length > 0) {
      customerId = searchData.customers[0].id
    } else {
      // Create new customer
      const createResponse = await fetch(`${SQUARE_API_URL}/v2/customers`, {
        method: 'POST',
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idempotency_key: crypto.randomUUID(),
          given_name: quote.customer_name,
          email_address: quote.customer_email,
          phone_number: quote.customer_phone,
          company_name: quote.customer_business || undefined
        })
      })
      const createData = await createResponse.json() as SquareCustomerResponse

      if (createData.customer?.id) {
        customerId = createData.customer.id
      }
    }

    if (!customerId) {
      return NextResponse.json({ error: 'Failed to create Square customer' }, { status: 500 })
    }

    // Create Square Order first (required for invoices with line items)
    const description = `${quote.product_type} - Qty: ${quote.quantity}`
    const priceInCents = Math.round(quote.price * 100)

    const orderResponse = await fetch(`${SQUARE_API_URL}/v2/orders`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: locationId,
          customer_id: customerId,
          line_items: [
            {
              name: description,
              quantity: '1',
              note: quote.admin_notes || '',
              base_price_money: {
                amount: priceInCents,
                currency: 'USD'
              }
            }
          ]
        }
      })
    })
    const orderData = await orderResponse.json() as { order?: { id: string }, errors?: Array<{ detail: string }> }

    if (!orderData.order?.id) {
      console.error('Order creation failed:', orderData)
      return NextResponse.json({
        error: 'Failed to create order',
        details: orderData.errors?.[0]?.detail || 'Unknown error'
      }, { status: 500 })
    }

    // Now create invoice linked to the order
    const invoiceResponse = await fetch(`${SQUARE_API_URL}/v2/invoices`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        invoice: {
          location_id: locationId,
          order_id: orderData.order.id,
          primary_recipient: {
            customer_id: customerId
          },
          payment_requests: [
            {
              request_type: 'BALANCE',
              due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              automatic_payment_source: 'NONE'
            }
          ],
          delivery_method: 'EMAIL',
          invoice_number: `VURMZ-${quote.id}`,
          title: 'VURMZ Laser Engraving',
          accepted_payment_methods: {
            card: true,
            square_gift_card: false,
            bank_account: false,
            buy_now_pay_later: false
          }
        }
      })
    })
    const invoiceData = await invoiceResponse.json() as SquareInvoiceResponse

    if (!invoiceData.invoice?.id) {
      console.error('Invoice creation failed:', invoiceData)
      return NextResponse.json({
        error: 'Failed to create invoice',
        details: (invoiceData as { errors?: Array<{ detail: string }> }).errors?.[0]?.detail || 'Unknown error'
      }, { status: 500 })
    }

    // Publish (send) the invoice - version is 0 for newly created invoice
    const publishResponse = await fetch(`${SQUARE_API_URL}/v2/invoices/${invoiceData.invoice.id}/publish`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        version: 0
      })
    })
    const publishData = await publishResponse.json() as SquareInvoiceResponse

    if (!publishData.invoice) {
      console.error('Publish failed:', publishData)
      return NextResponse.json({
        error: 'Invoice created but failed to send',
        invoiceId: invoiceData.invoice.id,
        details: (publishData as { errors?: Array<{ detail: string }> }).errors?.[0]?.detail || 'Unknown error'
      }, { status: 500 })
    }

    // Update quote with invoice URL
    await db.prepare('UPDATE quotes SET invoice_url = ?, status = ? WHERE id = ?')
      .bind(publishData.invoice.public_url, 'invoiced', id)
      .run()

    return NextResponse.json({
      success: true,
      invoiceId: invoiceData.invoice.id,
      invoiceNumber: invoiceData.invoice.invoice_number,
      invoiceUrl: publishData.invoice.public_url
    })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
