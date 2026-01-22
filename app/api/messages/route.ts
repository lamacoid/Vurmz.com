export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// POST - Save a new message
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const { name, contact, message, type } = await request.json() as {
      name: string
      contact: string
      message: string
      type: string
    }

    if (!name || !contact || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await db.prepare(`
      INSERT INTO messages (name, contact, message, type, created_at, read)
      VALUES (?, ?, ?, ?, datetime('now'), 0)
    `).bind(name, contact, message, type || 'general').run()

    // Also send email notification
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'VURMZ <orders@vurmz.com>',
            to: 'zach@vurmz.com',
            subject: `New Personal Project Inquiry from ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #5B8A8A;">New Personal Project Message</h2>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                  This message was sent via the "Not a business?" form on vurmz.com
                </p>
              </div>
            `
          })
        })
      } catch {
        // Email failed but message was saved
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

// GET - Fetch messages (for admin)
export async function GET() {
  try {
    const db = getD1()
    const result = await db.prepare(`
      SELECT * FROM messages ORDER BY created_at DESC
    `).all()

    return NextResponse.json(result.results || [])
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json([])
  }
}
