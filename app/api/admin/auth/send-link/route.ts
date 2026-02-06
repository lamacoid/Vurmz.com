export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'
import { sendEmail } from '@/lib/resend-edge'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email?: string }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const db = getD1()

    // Find admin user
    const user = await db.prepare(
      'SELECT id, name, email FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first() as { id: string; name: string; email: string } | null

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({ success: true })
    }

    // Generate magic link token
    const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    // Store token - use a simple approach: store in notes column or create a session_token column
    // For simplicity, we'll store in DB directly
    await db.prepare(
      'UPDATE users SET magic_token = ?, magic_token_expires = ? WHERE id = ?'
    ).bind(token, expiresAt, user.id).run()

    // Send magic link email
    const siteUrl = process.env.SITE_URL || 'https://vurmz.com'
    const magicLink = `${siteUrl}/admin/verify?token=${token}&email=${encodeURIComponent(user.email)}`

    await sendEmail({
      from: 'Vurmz <noreply@vurmz.com>',
      to: user.email,
      subject: 'Admin Login - Vurmz',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Admin Sign In</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Click the button below to sign in to the Vurmz admin panel.
          </p>
          <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Sign In to Admin
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            This link expires in 15 minutes. If you didn't request this, you can safely ignore it.
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending admin magic link:', error)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
