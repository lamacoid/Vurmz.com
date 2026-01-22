export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'
import { Resend } from 'resend'

const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY

interface SquareWebhookPayload {
  merchant_id: string
  type: string
  event_id: string
  created_at: string
  data: {
    type: string
    id: string
    object: {
      payment?: {
        id: string
        status: string
        amount_money: { amount: number; currency: string }
        order_id: string
        receipt_url: string
        buyer_email_address?: string
        note?: string
      }
      order?: {
        id: string
        state: string
      }
    }
  }
}

// Verify Square webhook signature
async function verifySignature(body: string, signature: string, url: string): Promise<boolean> {
  if (!SQUARE_WEBHOOK_SIGNATURE_KEY) {
    console.warn('No Square webhook signature key configured - skipping verification')
    return true // Allow in dev, but log warning
  }

  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SQUARE_WEBHOOK_SIGNATURE_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const payload = url + body
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))

    return computedSignature === signature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// Generate order number
async function generateOrderNumber(db: D1Database): Promise<string> {
  const monthLetters = 'ABCDEFGHIJKL'
  const today = new Date()
  const monthLetter = monthLetters[today.getMonth()]
  const year = String(today.getFullYear()).slice(-2)
  const prefix = `V-${monthLetter}${year}`

  const lastOrder = await db.prepare(
    'SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1'
  ).bind(`${prefix}%`).first()

  if (!lastOrder) {
    return `${prefix}0001`
  }

  const lastNum = parseInt((lastOrder as { order_number: string }).order_number.slice(-4))
  return `${prefix}${String(lastNum + 1).padStart(4, '0')}`
}

// Generate receipt number
function generateReceiptNumber(): string {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `R-${dateStr}-${random}`
}

// Send receipt email
async function sendReceiptEmail(data: {
  customerEmail: string
  customerName: string
  orderNumber: string
  receiptNumber: string
  amount: number
  description: string
  squareReceiptUrl?: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'VURMZ <noreply@vurmz.com>',
    to: data.customerEmail,
    subject: `Receipt for Order ${data.orderNumber} - VURMZ`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">Payment Received</h1>
          <p style="color: #666; margin-top: 8px;">Thank you for your order!</p>
        </div>

        <div style="background: #f9f9f9; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Receipt #</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.receiptNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Order #</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Description</td>
              <td style="padding: 8px 0; text-align: right;">${data.description}</td>
            </tr>
            <tr style="border-top: 1px solid #ddd;">
              <td style="padding: 16px 0 8px; font-weight: 600; font-size: 18px;">Total Paid</td>
              <td style="padding: 16px 0 8px; text-align: right; font-weight: 600; font-size: 18px; color: #22c55e;">$${data.amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${data.squareReceiptUrl ? `
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${data.squareReceiptUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
            View Full Receipt
          </a>
        </div>
        ` : ''}

        <div style="background: linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%); color: white; padding: 24px; border-radius: 12px; text-align: center;">
          <p style="margin: 0 0 8px; font-weight: 600;">What's Next?</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            I'll start working on your order right away. You'll receive an email when it's ready for pickup/delivery.
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Questions? Reply to this email or text <strong>(719) 257-3834</strong>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 16px;">
            VURMZ LLC | Centennial, Colorado
          </p>
        </div>
      </div>
    `
  })
}

// Notify admin of payment
async function notifyAdmin(data: {
  orderNumber: string
  customerName: string
  amount: number
  description: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL || 'zach@vurmz.com'

  await resend.emails.send({
    from: 'VURMZ System <noreply@vurmz.com>',
    to: adminEmail,
    subject: `Payment Received - ${data.orderNumber}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #22c55e; color: white; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">Payment Received!</h2>
        </div>
        <p><strong>Order:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p style="margin-top: 20px;">
          <a href="https://vurmz.com/admin/orders" style="background: #1a1a1a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
            View in Admin
          </a>
        </p>
      </div>
    `
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-square-hmacsha256-signature') || ''
    const url = request.url

    // Verify signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = await verifySignature(body, signature, url)
      if (!isValid) {
        console.error('Invalid Square webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload: SquareWebhookPayload = JSON.parse(body)
    console.log('Square webhook received:', payload.type, payload.event_id)

    const db = getD1()

    // Handle payment completed events
    if (payload.type === 'payment.completed' || payload.type === 'payment.updated') {
      const payment = payload.data.object.payment
      if (!payment || payment.status !== 'COMPLETED') {
        return NextResponse.json({ received: true, action: 'ignored - not completed' })
      }

      const squarePaymentId = payment.id
      const amount = payment.amount_money.amount / 100 // Convert from cents
      const squareOrderId = payment.order_id
      const note = payment.note || ''
      const receiptUrl = payment.receipt_url

      // Check if we've already processed this payment
      const existingPayment = await db.prepare(
        'SELECT id FROM payments WHERE square_payment_id = ?'
      ).bind(squarePaymentId).first()

      if (existingPayment) {
        console.log('Payment already processed:', squarePaymentId)
        return NextResponse.json({ received: true, action: 'already processed' })
      }

      // Try to find the quote by payment note (contains order number) or payment_link_id
      // Note format is typically "V-A260001 - Customer Name"
      const orderNumberMatch = note.match(/V-[A-Z]\d{6}/i)
      let quote = null

      if (orderNumberMatch) {
        quote = await db.prepare(`
          SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
          FROM quotes q
          LEFT JOIN customers c ON q.customer_id = c.id
          WHERE q.order_number = ?
        `).bind(orderNumberMatch[0]).first()
      }

      // If not found by order number, try by Square order ID
      if (!quote) {
        // This would require storing the Square order ID when creating payment link
        console.log('Could not find quote for payment:', squarePaymentId, note)

        // Still record the payment even if we can't match it
        await db.prepare(`
          INSERT INTO payments (id, customer_id, square_payment_id, square_order_id, amount, status, paid_at, created_at)
          VALUES (?, 'unknown', ?, ?, ?, 'completed', ?, ?)
        `).bind(generateId(), squarePaymentId, squareOrderId, amount, now(), now()).run()

        return NextResponse.json({ received: true, action: 'payment recorded but no matching quote' })
      }

      const quoteData = quote as {
        id: string
        customer_id: string
        product_type: string
        quantity: string
        description: string
        turnaround: string
        delivery_method: string
        price: number
        customer_name: string
        customer_email: string
        customer_phone: string
        order_number: string
      }

      // 1. Record the payment
      const paymentId = generateId()
      await db.prepare(`
        INSERT INTO payments (id, quote_id, customer_id, square_payment_id, square_order_id, amount, status, paid_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)
      `).bind(paymentId, quoteData.id, quoteData.customer_id, squarePaymentId, squareOrderId, amount, now(), now()).run()

      // 2. Update quote status
      await db.prepare(`
        UPDATE quotes SET payment_status = 'paid', square_payment_id = ?, status = 'paid', updated_at = ?
        WHERE id = ?
      `).bind(squarePaymentId, now(), quoteData.id).run()

      // 3. Create order in orders table
      const orderNumber = quoteData.order_number || await generateOrderNumber(db)
      const orderId = generateId()

      await db.prepare(`
        INSERT INTO orders (id, order_number, customer_id, quote_id, project_description, material, quantity, price, status, delivery_method, payment_status, square_payment_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, 'paid', ?, ?, ?)
      `).bind(
        orderId,
        orderNumber,
        quoteData.customer_id,
        quoteData.id,
        quoteData.description,
        quoteData.product_type,
        parseInt(quoteData.quantity) || 1,
        amount,
        quoteData.delivery_method || 'PICKUP',
        squarePaymentId,
        now(),
        now()
      ).run()

      // 4. Update payment with order_id
      await db.prepare('UPDATE payments SET order_id = ? WHERE id = ?').bind(orderId, paymentId).run()

      // 5. Create receipt
      const receiptNumber = generateReceiptNumber()
      const receiptId = generateId()

      await db.prepare(`
        INSERT INTO receipts (id, receipt_number, order_id, payment_id, customer_id, amount, total, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(receiptId, receiptNumber, orderId, paymentId, quoteData.customer_id, amount, amount, now()).run()

      // 6. Send receipt email to customer
      if (quoteData.customer_email) {
        try {
          await sendReceiptEmail({
            customerEmail: quoteData.customer_email,
            customerName: quoteData.customer_name,
            orderNumber,
            receiptNumber,
            amount,
            description: `${quoteData.product_type} x${quoteData.quantity}`,
            squareReceiptUrl: receiptUrl
          })

          // Update receipt as sent
          await db.prepare('UPDATE receipts SET sent_at = ? WHERE id = ?').bind(now(), receiptId).run()
          await db.prepare('UPDATE orders SET receipt_sent = 1, receipt_sent_at = ? WHERE id = ?').bind(now(), orderId).run()
        } catch (emailError) {
          console.error('Failed to send receipt email:', emailError)
        }
      }

      // 7. Notify admin
      try {
        await notifyAdmin({
          orderNumber,
          customerName: quoteData.customer_name,
          amount,
          description: `${quoteData.product_type} x${quoteData.quantity}`
        })
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError)
      }

      console.log('Payment processed successfully:', squarePaymentId, orderNumber)
      return NextResponse.json({
        received: true,
        action: 'payment processed',
        orderNumber,
        receiptNumber
      })
    }

    // Handle other event types as needed
    return NextResponse.json({ received: true, action: 'event type not handled' })

  } catch (error) {
    console.error('Square webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Square sends a test webhook on setup
export async function GET() {
  return NextResponse.json({ status: 'Square webhook endpoint active' })
}
