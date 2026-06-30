export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { reportError } from '@/lib/error'

const ALLOWED_ORIGINS = [
  'https://vurmz.com',
  'https://www.vurmz.com',
  'http://localhost:3000',
]

// Rate limit: 3 signups per 10 minutes per IP
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_SECONDS = 600

// Escape user-supplied values before they land in HTML emails. The email regex
// below permits angle brackets/quotes (it only excludes whitespace and @), so
// both name and address must be escaped.
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  try {
    const { env } = getRequestContext()
    const kv = env.RATE_LIMIT
    if (!kv) return { allowed: true }

    const key = `newsletter:${ip}`
    const existing = await kv.get(key)

    if (!existing) {
      await kv.put(key, '1', { expirationTtl: RATE_LIMIT_WINDOW_SECONDS })
      return { allowed: true }
    }

    const count = parseInt(existing, 10)
    if (count >= RATE_LIMIT_MAX) {
      return { allowed: false }
    }

    await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS })
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Origin check
    const origin = request.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Rate limiting
    const clientIp = getClientIp(request)
    const { allowed } = await checkRateLimit(clientIp)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': '600' } }
      )
    }

    const body = await request.json() as { email?: string; firstName?: string }
    const { email, firstName } = body
    const safeFirstName = firstName ? escapeHtml(String(firstName).slice(0, 100).trim()) : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    if (email.length > 254) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Get Resend API key
    let resendApiKey: string | undefined
    let audienceId: string | undefined
    try {
      const { env } = getRequestContext()
      resendApiKey = env.RESEND_API_KEY
      audienceId = env.RESEND_AUDIENCE_ID
    } catch {
      // Local dev fallback
    }
    if (!resendApiKey) resendApiKey = process.env.RESEND_API_KEY
    if (!audienceId) audienceId = process.env.RESEND_AUDIENCE_ID

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Newsletter signups are paused right now — text me instead and I’ll add you.' },
        { status: 503 }
      )
    }

    // Add contact to the Resend Audience when one is configured. With no
    // RESEND_AUDIENCE_ID the signup still succeeds for the visitor — Zach gets
    // the notification email below (flagged for manual add) instead of a 500.
    let addedToAudience = false
    if (audienceId) {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          first_name: firstName?.trim() || undefined,
          unsubscribed: false,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Resend Audience API error:', errorData)

        // If already subscribed, still return success
        if (res.status === 409) {
          return NextResponse.json({ success: true, alreadySubscribed: true })
        }

        throw new Error('Failed to add to newsletter')
      }
      addedToAudience = true
    } else {
      console.warn('RESEND_AUDIENCE_ID not set — signup accepted, notifying owner for manual add')
    }

    // Send welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VURMZ <noreply@vurmz.com>',
        to: email.trim().toLowerCase(),
        subject: "You're in — welcome to the VURMZ list",
        headers: {
          'List-Unsubscribe': '<mailto:zach@vurmz.com?subject=Unsubscribe>, <https://www.vurmz.com/unsubscribe>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #3CB9B2; font-size: 24px; margin: 0;">VURMZ</h1>
              <p style="color: #666; font-size: 13px; margin-top: 4px;">Laser Engraving &middot; Denver Metro</p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hey${safeFirstName ? ` ${safeFirstName}` : ''}! Thanks for signing up.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              I'll send you occasional updates — new products, materials, and stuff I'm working on. No spam, just things I think you'll actually want to see.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              In the meantime, if you need anything engraved — text me anytime.
            </p>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #888; font-size: 13px; margin: 0;">
                Zach DeMillo &middot; VURMZ<br/>
                <a href="sms:7192573834" style="color: #3CB9B2;">(719) 257-3834 (text)</a> &middot;
                <a href="https://vurmz.com" style="color: #3CB9B2;">vurmz.com</a>
              </p>
            </div>
          </div>
        `,
      }),
    }).catch((err) => {
      // Welcome email is nice-to-have, don't fail the signup
      console.warn('Welcome email failed:', err)
    })

    // Notify Zach
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VURMZ Website <noreply@vurmz.com>',
        to: 'zach@vurmz.com',
        subject: `New newsletter signup: ${email}`,
        html: `
          <div style="font-family: sans-serif;">
            <h3 style="color: #3CB9B2;">New Newsletter Subscriber</h3>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${safeFirstName ? `<p><strong>Name:</strong> ${safeFirstName}</p>` : ''}
            <p style="color: #888; font-size: 13px;">${addedToAudience ? "They've been added to your Resend Audience automatically." : '⚠️ RESEND_AUDIENCE_ID is not set — add this contact to your Resend Audience manually (and set the secret to automate this).'}</p>
          </div>
        `,
      }),
    }).catch(() => {
      // Notification is nice-to-have
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    await reportError(error, { route: 'newsletter', method: 'POST' })
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
