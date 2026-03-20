export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

const ALLOWED_ORIGINS = [
  'https://vurmz.com',
  'https://www.vurmz.com',
  'http://localhost:3000',
]

const ALLOWED_PRODUCTS = [
  'Branded Pens',
  'Metal Business Cards',
  'Coasters',
  'Keychains',
  'Knife Engraving',
  'Tool Marking',
  'Industrial Labels',
  'Name Plates',
  'Custom Gift / Award',
  'Other',
]

const MAX_LENGTHS = {
  name: 100,
  email: 254,
  phone: 30,
  message: 5000,
  productInterest: 50,
}

// Rate limit: 5 submissions per 10 minutes per IP
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_SECONDS = 600

function stripControlChars(str: string): string {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/[\r\n]/g, ' ').trim()
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const { env } = getRequestContext()
    const kv = (env as unknown as Record<string, KVNamespace>).RATE_LIMIT
    if (!kv) {
      // KV not bound — allow request but log warning
      console.warn('RATE_LIMIT KV not bound, skipping rate limit check')
      return { allowed: true, remaining: RATE_LIMIT_MAX }
    }

    const key = `contact:${ip}`
    const existing = await kv.get(key)

    if (!existing) {
      await kv.put(key, '1', { expirationTtl: RATE_LIMIT_WINDOW_SECONDS })
      return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
    }

    const count = parseInt(existing, 10)
    if (count >= RATE_LIMIT_MAX) {
      return { allowed: false, remaining: 0 }
    }

    // KV put with same key resets TTL, which is fine — window slides
    await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS })
    return { allowed: true, remaining: RATE_LIMIT_MAX - count - 1 }
  } catch {
    // If KV fails, allow the request (fail open for availability)
    console.warn('Rate limit check failed, allowing request')
    return { allowed: true, remaining: RATE_LIMIT_MAX }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Origin check
    const origin = request.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Rate limiting
    const clientIp = getClientIp(request)
    const { allowed, remaining } = await checkRateLimit(clientIp)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes and try again, or text/call directly.' },
        { status: 429, headers: { 'Retry-After': '600' } }
      )
    }

    const body = await request.json() as {
      name?: string
      email?: string
      phone?: string
      message?: string
      productInterest?: string
    }

    let { name, email, phone, message, productInterest } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Enforce length limits
    if (name.length > MAX_LENGTHS.name) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    if (email.length > MAX_LENGTHS.email) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
    }
    if (phone && phone.length > MAX_LENGTHS.phone) {
      return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })
    }
    if (message.length > MAX_LENGTHS.message) {
      return NextResponse.json({ error: 'Message is too long (5000 character max).' }, { status: 400 })
    }

    // Strip control characters to prevent header injection
    name = stripControlChars(name)
    email = stripControlChars(email)
    phone = phone ? stripControlChars(phone) : ''
    message = body.message?.trim() || ''
    productInterest = productInterest ? stripControlChars(productInterest) : ''

    // Validate productInterest against allowed values
    if (productInterest && !ALLOWED_PRODUCTS.includes(productInterest)) {
      productInterest = ''
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Get API key from Cloudflare Pages env (secrets), fallback to process.env for local dev
    let resendApiKey: string | undefined
    try {
      const { env } = getRequestContext()
      resendApiKey = (env as unknown as Record<string, string>).RESEND_API_KEY
    } catch {
      // Not in Cloudflare context (local dev)
    }
    if (!resendApiKey) {
      resendApiKey = process.env.RESEND_API_KEY
    }
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please call or text instead.' },
        { status: 500 }
      )
    }

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #3CB9B2;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Name</td>
            <td style="padding: 8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone</td>
            <td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td>
          </tr>
          ` : ''}
          ${productInterest ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Interest</td>
            <td style="padding: 8px 0;">${escapeHtml(productInterest)}</td>
          </tr>
          ` : ''}
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VURMZ Website <noreply@vurmz.com>',
        to: 'zach@vurmz.com',
        reply_to: email,
        subject: `New Contact: ${name.slice(0, 80)}${productInterest ? ` — ${productInterest}` : ''}`,
        html: htmlBody,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('Resend API error:', errorData)
      throw new Error('Failed to send email')
    }

    const response = NextResponse.json({ success: true })
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call/text directly.' },
      { status: 500 }
    )
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
