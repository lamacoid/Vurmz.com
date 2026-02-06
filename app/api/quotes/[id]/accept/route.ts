export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'
import { createOrder, generateOrderNumber } from '@/lib/order-helpers'

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
    version: number
    status: string
  }
  errors?: Array<{ detail: string }>
}

// POST - Start an order (creates Square invoice, sends email with payment link)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getD1()
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

    // Get the quote/order with customer info
    const quote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.id = ?
    `).bind(id).first() as any

    if (!quote) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (quote.status !== 'pending-approval') {
      return NextResponse.json({ error: 'Order is not pending approval' }, { status: 400 })
    }

    if (!quote.price) {
      return NextResponse.json({ error: 'Order has no price set' }, { status: 400 })
    }

    if (!quote.customer_email) {
      return NextResponse.json({ error: 'Customer email required for invoice' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = await generateOrderNumber(db)

    // Create Square Invoice
    let invoiceUrl: string | null = null
    let invoiceNumber: string | null = null

    if (SQUARE_ACCESS_TOKEN) {
      try {
        // Get Square location
        const locResponse = await fetch(`${SQUARE_API_URL}/v2/locations`, {
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          }
        })
        const locData = await locResponse.json() as { locations?: Array<{ id: string }> }
        const locationId = locData.locations?.[0]?.id

        if (!locationId) {
          throw new Error('Square location not found')
        }

        // Find or create Square customer
        let customerId: string | undefined

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
          throw new Error('Failed to create Square customer')
        }

        // Create Square Order with line items
        const description = `${quote.product_type} - Qty: ${quote.quantity}`
        const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

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
                  name: quote.admin_notes || description,
                  quantity: '1',
                  base_price_money: {
                    amount: Math.round(quote.price * 100),
                    currency: 'USD'
                  }
                }
              ]
            }
          })
        })
        const orderData = await orderResponse.json() as { order?: { id: string } }

        if (!orderData.order?.id) {
          throw new Error('Failed to create Square order')
        }

        // Create invoice
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
                  due_date: dueDate,
                  automatic_payment_source: 'NONE'
                }
              ],
              delivery_method: 'SHARE_MANUALLY',
              invoice_number: orderNumber,
              title: 'VURMZ Laser Engraving',
              accepted_payment_methods: {
                card: true,
                square_gift_card: false,
                bank_account: false,
                buy_now_pay_later: false,
                cash_app_pay: true
              }
            }
          })
        })
        const invoiceData = await invoiceResponse.json() as SquareInvoiceResponse

        if (!invoiceData.invoice?.id) {
          console.error('Invoice creation failed:', invoiceData)
          throw new Error('Failed to create invoice')
        }

        // Publish the invoice
        const publishResponse = await fetch(`${SQUARE_API_URL}/v2/invoices/${invoiceData.invoice.id}/publish`, {
          method: 'POST',
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            version: invoiceData.invoice.version
          })
        })
        const publishData = await publishResponse.json() as SquareInvoiceResponse

        invoiceUrl = publishData.invoice?.public_url || invoiceData.invoice.public_url
        invoiceNumber = invoiceData.invoice.invoice_number

      } catch (squareError) {
        console.error('Square Invoice API error:', squareError)
        // Continue without invoice
      }
    }

    // Send email with Square invoice link
    if (quote.customer_email && process.env.RESEND_API_KEY) {
      const emailBody = {
        from: 'VURMZ <orders@vurmz.com>',
        to: quote.customer_email,
        subject: `Your VURMZ Order Has Started! ${invoiceNumber ? `(Invoice ${invoiceNumber})` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #5B8A8A;">We're Working on Your Order!</h1>
            <p>Hi ${quote.customer_name},</p>
            <p>Great news! Your order has been started and we're working on it now.</p>

            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="margin-top: 0;">Order Details</h3>
              ${invoiceNumber ? `<p><strong>Invoice #:</strong> ${invoiceNumber}</p>` : ''}
              <p><strong>Product:</strong> ${quote.product_type}</p>
              <p><strong>Quantity:</strong> ${quote.quantity}</p>
              <p><strong>Total:</strong> $${quote.price.toFixed(2)}</p>
            </div>

            ${invoiceUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invoiceUrl}" style="background: #5B8A8A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                  Pay Invoice - $${quote.price.toFixed(2)}
                </a>
              </div>
              <p style="text-align: center; color: #666; font-size: 14px;">
                Click the button above to pay securely via Square.
              </p>
            ` : ''}

            <p>We'll notify you when your order is ready for ${quote.delivery_method === 'delivery' ? 'delivery' : 'pickup'}!</p>

            <p>Thanks for choosing VURMZ!</p>
            <p style="color: #666;">- Zach</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
              VURMZ | Laser Engraving in Centennial, CO<br>
              (719) 257-3834 | vurmz.com
            </p>
          </div>
        `
      }

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailBody)
        })
      } catch (err) {
        console.error('Email send error:', err)
      }
    }

    // Update the quote status to in_progress and store invoice URL
    await db.prepare(`
      UPDATE quotes
      SET status = 'in_progress', accepted_at = datetime('now'), order_number = ?, invoice_url = ?
      WHERE id = ?
    `).bind(orderNumber, invoiceUrl, id).run()

    // Create an order from the accepted quote using shared helper
    const createdOrder = await createOrder({
      db,
      customerId: String(quote.customer_id),
      quoteId: String(id),
      projectDescription: quote.description || `${quote.product_type} order`,
      material: quote.product_type,
      quantity: parseInt(quote.quantity) || 1,
      price: quote.price,
      status: 'IN_PROGRESS',
      deliveryMethod: quote.delivery_method || 'PICKUP',
      orderNumber,
    })

    // Fetch updated quote
    const updatedQuote = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.id = ?
    `).bind(id).first() as any

    return NextResponse.json({
      id: updatedQuote.id,
      productType: updatedQuote.product_type,
      quantity: updatedQuote.quantity,
      description: updatedQuote.description,
      status: updatedQuote.status,
      turnaround: updatedQuote.turnaround,
      deliveryMethod: updatedQuote.delivery_method,
      price: updatedQuote.price,
      adminNotes: updatedQuote.admin_notes,
      customerToken: updatedQuote.customer_token,
      createdAt: updatedQuote.created_at,
      responseSentAt: updatedQuote.response_sent_at,
      acceptedAt: updatedQuote.accepted_at,
      completedAt: updatedQuote.completed_at,
      customer: {
        name: updatedQuote.customer_name,
        email: updatedQuote.customer_email,
        phone: updatedQuote.customer_phone,
        business: updatedQuote.customer_business
      },
      orderNumber,
      invoiceUrl,
      invoiceNumber,
      message: invoiceUrl
        ? `Order started! Invoice ${invoiceNumber} sent to ${quote.customer_email}.`
        : 'Order started! (Square invoice could not be created - check API token)'
    })
  } catch (error) {
    console.error('Error accepting order:', error)
    return NextResponse.json({ error: 'Failed to accept order' }, { status: 500 })
  }
}
