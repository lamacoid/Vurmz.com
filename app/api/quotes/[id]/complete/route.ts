export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

const SQUARE_API_URL = 'https://connect.squareup.com'

// POST - Mark order complete and send reminder email with invoice (if unpaid)
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

    if (quote.status !== 'in_progress') {
      return NextResponse.json({ error: 'Order is not in progress' }, { status: 400 })
    }

    // Check if invoice has been paid (if we have Square access)
    let invoicePaid = false
    let invoiceUrl = quote.invoice_url

    if (SQUARE_ACCESS_TOKEN && quote.order_number) {
      try {
        // Search for invoice by invoice number
        const searchResponse = await fetch(`${SQUARE_API_URL}/v2/invoices/search`, {
          method: 'POST',
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              filter: {
                invoice_number: [quote.order_number]
              }
            }
          })
        })
        const searchData = await searchResponse.json() as { invoices?: Array<{ status: string; public_url: string }> }

        if (searchData.invoices && searchData.invoices.length > 0) {
          const invoice = searchData.invoices[0]
          invoicePaid = invoice.status === 'PAID'
          invoiceUrl = invoice.public_url || invoiceUrl
        }
      } catch (err) {
        console.error('Error checking invoice status:', err)
      }
    }

    // Update the quote status to complete
    await db.prepare(`
      UPDATE quotes
      SET status = 'complete', completed_at = datetime('now')
      WHERE id = ?
    `).bind(id).run()

    // Update order status too
    await db.prepare(`
      UPDATE orders
      SET status = 'COMPLETE', completed_at = datetime('now'), updated_at = datetime('now')
      WHERE quote_id = ?
    `).bind(id).run()

    // Send completion email with invoice reminder (if not paid)
    if (quote.customer_email && process.env.RESEND_API_KEY) {
      const emailSubject = invoicePaid
        ? `Your VURMZ Order is Ready!`
        : `Your VURMZ Order is Ready! ${quote.order_number ? `(Invoice ${quote.order_number})` : ''}`

      const emailBody = {
        from: 'VURMZ <orders@vurmz.com>',
        to: quote.customer_email,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #5B8A8A;">Your Order is Complete!</h1>
            <p>Hi ${quote.customer_name},</p>
            <p>Great news! Your order is finished and ready for ${quote.delivery_method === 'delivery' ? 'delivery' : 'pickup'}.</p>

            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="margin-top: 0;">Order Details</h3>
              ${quote.order_number ? `<p><strong>Order #:</strong> ${quote.order_number}</p>` : ''}
              <p><strong>Product:</strong> ${quote.product_type}</p>
              <p><strong>Quantity:</strong> ${quote.quantity}</p>
              <p><strong>Total:</strong> $${quote.price.toFixed(2)}</p>
            </div>

            ${invoicePaid ? `
              <div style="background: #d4edda; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #155724; font-weight: bold;">✓ Payment Received - Thank You!</p>
              </div>
            ` : invoiceUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invoiceUrl}" style="background: #5B8A8A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                  Pay Invoice - $${quote.price.toFixed(2)}
                </a>
              </div>
              <p style="text-align: center; color: #666; font-size: 14px;">
                Please pay before pickup/delivery. Click above to pay securely via Square.
              </p>
            ` : ''}

            ${quote.delivery_method === 'pickup' ? `
              <p><strong>Pickup Location:</strong><br>
              Centennial, CO<br>
              Please text or call to arrange pickup: (719) 257-3834</p>
            ` : `
              <p>We'll be in touch to coordinate delivery!</p>
            `}

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
      invoicePaid,
      message: invoicePaid
        ? `Order complete! Customer has already paid.`
        : `Order complete! Reminder email sent with invoice link.`
    })
  } catch (error) {
    console.error('Error completing order:', error)
    return NextResponse.json({ error: 'Failed to complete order' }, { status: 500 })
  }
}
