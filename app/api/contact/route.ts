export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { reportError } from '@/lib/error'
import { CONTACT_PRODUCT_OPTIONS } from '@/lib/pricing'
import { signFilePath, fileLinkSecret } from '@/lib/media/signed-link'

// Links in the notification email are absolute and always point at production.
const SITE = 'https://www.vurmz.com'

const ALLOWED_ORIGINS = [
  'https://vurmz.com',
  'https://www.vurmz.com',
  'http://localhost:3000',
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
    const kv = env.RATE_LIMIT
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
        { error: 'Too many submissions. Please wait a few minutes and try again, or text me directly.' },
        { status: 429, headers: { 'Retry-After': '600' } }
      )
    }

    const body = await request.json() as {
      name?: string
      email?: string
      phone?: string
      message?: string
      productInterest?: string
      website?: string  // honeypot, must be empty
      /** Photos from the "Can you engrave this?" form: guest upload keys. */
      attachments?: Array<{ key?: string; filename?: string }>
    }

    // Honeypot check — bots fill every field; humans don't see this one.
    // Silent 200 so the bot thinks it succeeded and doesn't retry.
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true })
    }

    let { name, email, phone, message, productInterest } = body

    // Basic validation. A photo quote can come with a phone number and no
    // email (that is how most people want the answer back), so one of the
    // two is enough.
    if (!name || !message || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name, a message, and a phone number or email are required.' },
        { status: 400 }
      )
    }
    email = email || ''

    // Attachments: only keys the guest upload route hands out, at most three.
    const ATTACH_KEY_RE = /^checkout\/gup_[A-Za-z0-9]+\/[^/]{1,200}$/
    const attachments = (Array.isArray(body.attachments) ? body.attachments : [])
      .filter(a => a && typeof a.key === 'string' && ATTACH_KEY_RE.test(a.key))
      .slice(0, 3)
      .map(a => ({ key: a.key as string, filename: stripControlChars(String(a.filename ?? '')).slice(0, 200) || 'photo' }))

    // Enforce length limits
    if (name.length > MAX_LENGTHS.name) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    if (email && email.length > MAX_LENGTHS.email) {
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
    if (productInterest && !CONTACT_PRODUCT_OPTIONS.includes(productInterest as typeof CONTACT_PRODUCT_OPTIONS[number])) {
      productInterest = ''
    }

    // Email validation (when given)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Capture the lead FIRST, before any email. Resend can fail or be spam
    // filtered; storing up front means a real submission is NEVER lost even if
    // the notification email never sends. The admin inbox reads these from the
    // RATE_LIMIT KV namespace (inbox:<id> + inbox:_index).
    try {
      const { env } = getRequestContext()
      const kv = env.RATE_LIMIT
      if (kv) {
        const submission = {
          id: crypto.randomUUID().slice(0, 8),
          name, email, phone, message, productInterest,
          ...(attachments.length ? { attachments } : {}),
          read: false,
          archived: false,
          receivedAt: new Date().toISOString(),
          notes: '',
        }
        await kv.put(`inbox:${submission.id}`, JSON.stringify(submission), { expirationTtl: 7776000 })
        const existingIds = await kv.get('inbox:_index')
        const ids = existingIds ? JSON.parse(existingIds) : []
        ids.unshift(submission.id)
        await kv.put('inbox:_index', JSON.stringify(ids.slice(0, 500)))
      }
    } catch (e) {
      await reportError(e, { route: 'contact', extra: { step: 'store' } })
    }

    // Get API key from Cloudflare Pages env (secrets), fallback to process.env for local dev
    let resendApiKey: string | undefined
    try {
      const { env } = getRequestContext()
      resendApiKey = env.RESEND_API_KEY
    } catch {
      // Not in Cloudflare context (local dev)
    }
    if (!resendApiKey) {
      resendApiKey = process.env.RESEND_API_KEY
    }
    if (!resendApiKey) {
      // The lead is already captured in the inbox above, so don't fail the
      // visitor — just skip the notification email.
      console.error('RESEND_API_KEY not configured — lead stored, email skipped')
      return NextResponse.json({ success: true })
    }

    // Each photo gets a signed link that opens with no login (the old link
    // needed an admin session and looked dead from a mail app). A file whose
    // link cannot be signed falls back to a pointer at the admin inbox, where
    // the lead and its files are already stored.
    const files = await Promise.all(attachments.map(async a => {
      const path = await signFilePath(a.key, fileLinkSecret()).catch(() => null)
      return { ...a, url: path ? `${SITE}${path}` : null, isImage: /\.(jpe?g|png|gif|webp)$/i.test(a.key) }
    }))
    const linked = files.filter((f): f is typeof f & { url: string } => !!f.url)

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
            <td style="padding: 8px 0;"><a href="sms:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td>
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
        ${files.length ? `
        <p style="margin-top: 16px; font-weight: bold; color: #666;">Photos</p>
        ${files.map(f => f.url
          ? `<p style="margin: 8px 0;"><a href="${f.url}">${escapeHtml(f.filename)}</a></p>${f.isImage ? `<p style="margin: 8px 0;"><a href="${f.url}"><img src="${f.url}" alt="${escapeHtml(f.filename)}" style="max-width: 100%; height: auto; border: 1px solid #eee; border-radius: 4px;" /></a></p>` : ''}`
          : `<p style="margin: 8px 0;">${escapeHtml(f.filename)}: open it in the <a href="${SITE}/admin/inbox">admin inbox</a>.</p>`).join('')}
        <p style="font-size: 12px; color: #999;">The photo links open without a login and stop working after 30 days. The files stay in the admin inbox.</p>
        ` : ''}
      </div>
    `

    const sendLead = (withFiles: boolean) => fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VURMZ Website <noreply@vurmz.com>',
        to: 'zach@vurmz.com',
        ...(email ? { reply_to: email } : {}),
        subject: `${attachments.length ? 'Can you engrave this' : 'New Contact'}: ${name.slice(0, 80)}${productInterest ? ` (${productInterest})` : ''}`,
        html: htmlBody,
        // The photos also ride the email as real attachments. Resend fetches
        // each one from its signed link, so nothing is loaded into this worker.
        ...(withFiles && linked.length ? { attachments: linked.map(f => ({ filename: f.filename, path: f.url })) } : {}),
      }),
    })

    let res = await sendLead(true)
    if (!res.ok && linked.length) {
      // An attachment that will not fetch must never cost the notification.
      // Send it again with the links and inline photos only.
      const firstError = await res.json().catch(() => ({}))
      await reportError(new Error('Contact email with attachments failed, resent without'), { route: 'contact', extra: { step: 'notify-attachments', firstError } })
      res = await sendLead(false)
    }

    if (!res.ok) {
      // Notification email failed, but the lead is already in the inbox. Log
      // loudly and keep going so the visitor still gets a success (we have it).
      const errorData = await res.json().catch(() => ({}))
      console.error('Resend API error (lead still captured in inbox):', errorData)
      await reportError(new Error('Contact notification email failed'), { route: 'contact', extra: { step: 'notify', errorData } })
    }

    // Send confirmation email to the customer, when there is an address.
    try {
      if (email) await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Zach at VURMZ <noreply@vurmz.com>',
          to: email,
          reply_to: 'zach@vurmz.com',
          subject: 'Got your message · VURMZ',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 0;">
              <div style="margin-bottom: 24px;">
                <strong style="font-size: 18px; color: #235158;">VURMZ</strong>
                <span style="color: #999; font-size: 14px; margin-left: 8px;">Laser Engraving</span>
              </div>
              <p style="font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 16px;">
                Hey ${escapeHtml(name.split(' ')[0])},
              </p>
              <p style="font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 16px;">
                I received your message and I&rsquo;ll be reaching out soon. If you need a faster response, feel free to text me directly at <strong>(720) 468-0138</strong>.
              </p>
              <p style="font-size: 15px; color: #333; line-height: 1.6; margin-bottom: 24px;">
                Talk soon,<br/>
                <strong>Zach DeMillo</strong><br/>
                <span style="color: #666;">VURMZ &middot; Centennial, CO</span>
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="font-size: 12px; color: #999;">
                <a href="https://vurmz.com" style="color: #6BB8B2;">vurmz.com</a> &middot; (720) 468-0138 &middot; zach@vurmz.com
              </p>
            </div>
          `,
        }),
      })
    } catch {
      // Don't fail the whole request if confirmation email fails
      console.warn('Confirmation email failed to send')
    }

    const response = NextResponse.json({ success: true })
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response
  } catch (error) {
    await reportError(error, { route: 'contact', method: 'POST' })
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or text me directly.' },
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
