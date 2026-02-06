export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'
import { sendEmail } from '@/lib/resend-edge'

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// POST - Send magic link to customer email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email?: string }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const db = getD1()

    // Find customer by email
    const customer = await db.prepare(
      'SELECT id, name, email FROM customers WHERE email = ?'
    ).bind(email.toLowerCase()).first() as { id: string; name: string; email: string } | null

    if (!customer) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a login link has been sent.'
      })
    }

    // Generate magic link token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    // Store token in customer record (add column if needed, or use a separate table)
    // For now, we'll use admin_notes temporarily or create a tokens approach
    // Let's store in a simple way - update customer with token
    await db.prepare(
      'UPDATE customers SET notes = ? WHERE id = ?'
    ).bind(JSON.stringify({
      loginToken: token,
      tokenExpires: expiresAt,
      previousNotes: customer
    }), customer.id).run()

    // Send email with magic link
    const siteUrl = process.env.SITE_URL || 'https://vurmz.com'
    const loginUrl = `${siteUrl}/portal/verify?token=${token}&email=${encodeURIComponent(email)}`

    await sendEmail({
      from: 'VURMZ <noreply@vurmz.com>',
      to: email,
      subject: 'Your VURMZ Login Link',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Hi ${customer.name}!</h2>
          <p>Click the button below to access your VURMZ customer portal:</p>
          <a href="${loginUrl}" style="display: inline-block; background: #6a8c8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Sign In to VURMZ
          </a>
          <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">VURMZ LLC - Centennial, CO</p>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a login link has been sent.'
    })
  } catch (error) {
    console.error('Error sending magic link:', error)
    return NextResponse.json({ error: 'Failed to send login link' }, { status: 500 })
  }
}
