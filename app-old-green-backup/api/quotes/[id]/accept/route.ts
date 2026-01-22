export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

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
  }
  errors?: Array<{ detail: string }>
}

interface SquareLocationsResponse {
  locations?: Array<{ id: string }>
}

// POST - Accept an order and send Square invoice
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
        const locData = await locResponse.json() as SquareLocationsResponse
        const locationId = locData.locations?.[0]?.id

        if (!locationId) {
          console.error('Square location not found')
          throw new Error('Square location not found')
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
          console.error('Failed to create Square customer')
          throw new Error('Failed to create Square customer')
        }

        // Create invoice
        const description = `${quote.product_type} - Qty: ${quote.quantity}`
        const orderNumber = quote.order_number || `VURMZ-${id}`

        // Calculate due date (14 days from now)
        const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

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
              description: quote.admin_notes || description,
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

        // Add line item to invoice
        const updateResponse = await fetch(`${SQUARE_API_URL}/v2/invoices/${invoiceData.invoice.id}`, {
          method: 'PUT',
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            invoice: {
              version: invoiceData.invoice.version,
              order_id: invoiceData.invoice.id,
              line_items: [
                {
                  name: description,
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
        const updateData = await updateResponse.json() as SquareInvoiceResponse

        // Publish (send) the invoice - Square will email it directly to customer
        const publishResponse = await fetch(`${SQUARE_API_URL}/v2/invoices/${invoiceData.invoice.id}/publish`, {
          method: 'POST',
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            version: updateData.invoice?.version || 1
          })
        })
        const publishData = await publishResponse.json() as SquareInvoiceResponse

        invoiceUrl = publishData.invoice?.public_url || invoiceData.invoice.public_url
        invoiceNumber = invoiceData.invoice.invoice_number

      } catch (squareError) {
        console.error('Square Invoice API error:', squareError)
        // Continue without invoice - we'll still update status and send our email
      }
    }

    // Send confirmation email (in addition to Square's invoice email)
    if (quote.customer_email && process.env.RESEND_API_KEY) {
      const emailBody = {
        from: 'VURMZ <orders@vurmz.com>',
        to: quote.customer_email,
        subject: `Your VURMZ Order Has Been Approved! ${invoiceNumber ? `(Invoice ${invoiceNumber})` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #5B8A8A;">Order Approved!</h1>
            <p>Hi ${quote.customer_name},</p>
            <p>Great news! Your order has been approved and we're ready to get started.</p>

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
                Click the button above to view and pay your invoice securely via Square.
              </p>
            ` : ''}

            <p>We'll start working on your order as soon as payment is received!</p>

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

    // Update the order status to accepted
    await db.prepare(`
      UPDATE quotes
      SET status = 'accepted', accepted_at = datetime('now')
      WHERE id = ?
    `).bind(id).run()

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
      invoiceUrl,
      invoiceNumber,
      message: invoiceUrl
        ? `Order accepted! Square invoice ${invoiceNumber} sent to ${quote.customer_email}.`
        : 'Order accepted! Configure SQUARE_ACCESS_TOKEN to send invoices automatically.'
    })
  } catch (error) {
    console.error('Error accepting order:', error)
    return NextResponse.json({ error: 'Failed to accept order' }, { status: 500 })
  }
}
