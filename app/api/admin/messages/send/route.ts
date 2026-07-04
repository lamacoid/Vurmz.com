export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { reportError } from '@/lib/error'
import { renderBrandedEmail, renderBrandedEmailText } from '@/lib/email/branded'

// Compose from the admin: any email, sent as Zach from zach@vurmz.com,
// wrapped in the branded card (or plain if styled=false). The sent message
// is recorded into the contact-inbox KV as an outbound thread so the
// Messages page keeps a visible history with zero extra UI.

const sendSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10_000),
  heading: z.string().max(120).optional(),
  styled: z.boolean().optional().default(true),
  ctaLabel: z.string().max(60).optional(),
  ctaHref: z.string().url().max(500).optional(),
})

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const parsed = sendSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Check the address, subject, and message.', details: parsed.error.issues } }, { status: 422 })
    }
    const { to, subject, body, heading, styled, ctaLabel, ctaHref } = parsed.data

    const { env } = getRequestContext()
    const resendApiKey = env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json({ ok: false, error: { code: 'EMAIL_OFF', message: 'Email is not set up yet.' } }, { status: 503 })
    }

    const html = styled
      ? renderBrandedEmail({ heading, body, ctaLabel, ctaHref })
      : `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 0;color:#111">
          <p style="font-size:15px;line-height:1.6;color:#333;white-space:pre-wrap">${esc(body)}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
          <p style="font-size:13px;color:#666">Zach DeMillo &middot; VURMZ &middot; Centennial, CO &middot; (719) 257-3834 &middot; vurmz.com</p>
        </div>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Zach at VURMZ <zach@vurmz.com>',
        to,
        reply_to: 'zach@vurmz.com',
        subject,
        html,
        text: renderBrandedEmailText({ heading, body, ctaLabel, ctaHref }),
      }),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      await reportError(new Error('Admin compose email failed'), { route: 'admin/messages/send', extra: { errorData } })
      return NextResponse.json({ ok: false, error: { code: 'SEND_FAILED', message: 'Could not send the email. Please try again.' } }, { status: 502 })
    }

    // Record the send as an outbound thread in the contact inbox (90-day
    // TTL like inbound). It renders in the existing Messages list with the
    // email as a reply entry, so sent history is visible with no new UI.
    try {
      const kv = env.RATE_LIMIT
      const id = `out_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await kv.put(
        `inbox:${id}`,
        JSON.stringify({
          email: to,
          name: `Sent to ${to}`,
          message: subject,
          read: true,
          createdAt: new Date().toISOString(),
          direction: 'outbound',
          replies: [{ body, sentAt: new Date().toISOString(), by: 'admin' }],
        }),
        { expirationTtl: 7776000 }
      )
    } catch {
      // History is best-effort; the email itself already went out.
    }

    return NextResponse.json({ ok: true })
  }) as Promise<NextResponse>
}
