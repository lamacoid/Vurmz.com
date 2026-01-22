export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'
import { Resend } from 'resend'

// POST - Quick actions (mark-complete, resend-receipt, mark-paid)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params
    const { action } = await request.json() as { action: string }

    const order = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).bind(id).first() as any

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const timestamp = now()
    const resend = new Resend(process.env.RESEND_API_KEY)

    switch (action) {
      case 'mark-complete': {
        await db.prepare(`
          UPDATE orders SET status = 'COMPLETED', completed_at = ?, updated_at = ? WHERE id = ?
        `).bind(timestamp, timestamp, id).run()

        // Notify customer
        if (order.customer_email) {
          await resend.emails.send({
            from: 'VURMZ <noreply@vurmz.com>',
            to: order.customer_email,
            subject: `Your order ${order.order_number} is ready!`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="width: 64px; height: 64px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  </div>
                </div>
                <h1 style="color: #1a1a1a; font-size: 24px; text-align: center; margin-bottom: 16px;">Your Order is Ready!</h1>
                <p style="color: #666; text-align: center; font-size: 16px; line-height: 1.6;">
                  ${order.delivery_method === 'PICKUP'
                    ? "Your order is complete and ready for pickup! Text me at (719) 257-3834 to arrange a time."
                    : "Your order is complete and will be delivered soon!"}
                </p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                  <p style="margin: 0 0 8px;"><strong>Order:</strong> ${order.order_number}</p>
                  <p style="margin: 0;"><strong>Item:</strong> ${order.project_description}</p>
                </div>
                <p style="color: #666; font-size: 14px; text-align: center;">
                  Questions? Text <strong>(719) 257-3834</strong>
                </p>
              </div>
            `
          }).catch(err => console.error('Email failed:', err))
        }

        return NextResponse.json({ success: true, message: 'Order marked complete, customer notified' })
      }

      case 'mark-in-progress': {
        await db.prepare(`
          UPDATE orders SET status = 'IN_PROGRESS', updated_at = ? WHERE id = ?
        `).bind(timestamp, id).run()

        if (order.customer_email) {
          await resend.emails.send({
            from: 'VURMZ <noreply@vurmz.com>',
            to: order.customer_email,
            subject: `Work started on order ${order.order_number}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Work Has Started!</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  I've started working on your order. You'll receive another email when it's ready!
                </p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                  <p style="margin: 0 0 8px;"><strong>Order:</strong> ${order.order_number}</p>
                  <p style="margin: 0;"><strong>Item:</strong> ${order.project_description}</p>
                </div>
              </div>
            `
          }).catch(err => console.error('Email failed:', err))
        }

        return NextResponse.json({ success: true, message: 'Order marked in progress' })
      }

      case 'mark-paid': {
        await db.prepare(`
          UPDATE orders SET payment_status = 'paid', updated_at = ? WHERE id = ?
        `).bind(timestamp, id).run()

        return NextResponse.json({ success: true, message: 'Order marked as paid' })
      }

      case 'resend-receipt': {
        if (!order.customer_email) {
          return NextResponse.json({ error: 'No customer email' }, { status: 400 })
        }

        // Get receipt info
        const receipt = await db.prepare(`
          SELECT * FROM receipts WHERE order_id = ? ORDER BY created_at DESC LIMIT 1
        `).bind(id).first() as any

        await resend.emails.send({
          from: 'VURMZ <noreply@vurmz.com>',
          to: order.customer_email,
          subject: `Receipt for Order ${order.order_number} - VURMZ`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Payment Receipt</h1>
              <div style="background: #f9f9f9; padding: 24px; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Receipt #</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${receipt?.receipt_number || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Order #</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 600;">${order.order_number}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Item</td>
                    <td style="padding: 8px 0; text-align: right;">${order.project_description}</td>
                  </tr>
                  <tr style="border-top: 1px solid #ddd;">
                    <td style="padding: 16px 0 8px; font-weight: 600; font-size: 18px;">Total Paid</td>
                    <td style="padding: 16px 0 8px; text-align: right; font-weight: 600; font-size: 18px; color: #22c55e;">$${order.price?.toFixed(2) || '0.00'}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 24px;">
                Questions? Text <strong>(719) 257-3834</strong>
              </p>
            </div>
          `
        })

        await db.prepare(`
          UPDATE orders SET receipt_sent = 1, receipt_sent_at = ? WHERE id = ?
        `).bind(timestamp, id).run()

        return NextResponse.json({ success: true, message: 'Receipt resent' })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error performing action:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
