export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'
import { sendEmail } from '@/lib/resend-edge'

// GET - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params

    const order = await db.prepare(`
      SELECT o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.company as customer_company,
        c.address as customer_address,
        c.city as customer_city,
        c.state as customer_state,
        c.zip as customer_zip
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).bind(id).first()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get order activity/timeline
    const activity = await db.prepare(`
      SELECT * FROM order_activity WHERE order_id = ? ORDER BY created_at DESC
    `).bind(id).all().catch(() => ({ results: [] }))

    const row = order as any
    return NextResponse.json({
      id: row.id,
      orderNumber: row.order_number,
      projectDescription: row.project_description,
      material: row.material,
      quantity: row.quantity,
      price: row.price,
      status: row.status,
      paymentStatus: row.payment_status,
      dueDate: row.due_date,
      deliveryMethod: row.delivery_method,
      deliveryNotes: row.delivery_notes,
      productionNotes: row.production_notes,
      laserType: row.laser_type,
      receiptSent: row.receipt_sent_at !== null, // Check if receipt_sent_at is not null to determine if receipt was sent
      receiptSentAt: row.receipt_sent_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at,
      customer: {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        company: row.customer_company,
        address: row.customer_address,
        city: row.customer_city,
        state: row.customer_state,
        zip: row.customer_zip
      },
      activity: (activity.results || []).map((a: any) => ({
        id: a.id,
        action: a.action,
        details: a.details,
        createdAt: a.created_at
      }))
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PATCH - Update order (status, notes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params
    const updates = await request.json() as {
      status?: string
      productionNotes?: string
      dueDate?: string
      deliveryNotes?: string
      notifyCustomer?: boolean
    }

    // Get current order
    const order = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `).bind(id).first() as any

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const oldStatus = order.status
    const timestamp = now()

    // Build update query dynamically
    const setClauses: string[] = ['updated_at = ?']
    const values: any[] = [timestamp]

    if (updates.status) {
      setClauses.push('status = ?')
      values.push(updates.status)

      if (updates.status === 'COMPLETED') {
        setClauses.push('completed_at = ?')
        values.push(timestamp)
      }
    }

    if (updates.productionNotes !== undefined) {
      setClauses.push('production_notes = ?')
      values.push(updates.productionNotes)
    }

    if (updates.dueDate !== undefined) {
      setClauses.push('due_date = ?')
      values.push(updates.dueDate)
    }

    if (updates.deliveryNotes !== undefined) {
      setClauses.push('delivery_notes = ?')
      values.push(updates.deliveryNotes)
    }

    values.push(id)

    await db.prepare(`UPDATE orders SET ${setClauses.join(', ')} WHERE id = ?`)
      .bind(...values).run()

    // Log activity
    if (updates.status && updates.status !== oldStatus) {
      await db.prepare(`
        INSERT INTO order_activity (id, order_id, action, details, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        generateId(),
        id,
        'status_changed',
        JSON.stringify({ from: oldStatus, to: updates.status }),
        timestamp
      ).run().catch(() => {}) // Ignore if table doesn't exist yet

      // Send customer notification if requested
      if (updates.notifyCustomer && order.customer_email) {
        const statusMessages: Record<string, { subject: string; message: string }> = {
          'IN_PROGRESS': {
            subject: `Your order ${order.order_number} is being worked on`,
            message: "Great news! I've started working on your order. You'll receive another email when it's ready."
          },
          'COMPLETED': {
            subject: `Your order ${order.order_number} is ready!`,
            message: order.delivery_method === 'PICKUP'
              ? "Your order is complete and ready for pickup! Text me at (719) 257-3834 to arrange a time."
              : "Your order is complete! I'll be delivering it soon or it's on its way to you."
          },
          'SHIPPED': {
            subject: `Your order ${order.order_number} has shipped`,
            message: "Your order is on its way! You should receive it within a few business days."
          }
        }

        const statusInfo = statusMessages[updates.status]
        if (statusInfo) {
          await sendEmail({
            from: 'VURMZ <noreply@vurmz.com>',
            to: order.customer_email,
            subject: statusInfo.subject,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Order Update</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>

                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                  <p style="margin: 0 0 8px;"><strong>Order:</strong> ${order.order_number}</p>
                  <p style="margin: 0 0 8px;"><strong>Status:</strong> ${updates.status.replace('_', ' ')}</p>
                  <p style="margin: 0;"><strong>Item:</strong> ${order.project_description}</p>
                </div>

                <p style="color: #666; font-size: 14px;">
                  Questions? Reply to this email or text <strong>(719) 257-3834</strong>
                </p>

                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">VURMZ LLC | Centennial, Colorado</p>
                </div>
              </div>
            `
          }).catch(err => console.error('Failed to send status email:', err))
        }
      }
    }

    return NextResponse.json({ success: true, status: updates.status || order.status })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE - Delete order (soft delete or hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getD1()
    const { id } = await params

    // Hard delete for now - could make this soft delete later
    await db.prepare('DELETE FROM orders WHERE id = ?').bind(id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
