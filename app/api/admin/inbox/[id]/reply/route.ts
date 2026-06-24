export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAdminAuth } from '@/lib/auth/admin'
import { reportError } from '@/lib/error'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

interface InboxMsg {
  email?: string
  name?: string
  message?: string
  read?: boolean
  replies?: { body: string; sentAt: string; by: string }[]
}

// Reply to a contact message by email, straight from the admin. Records the
// reply on the message so the thread shows it. The contact inbox lives in the
// RATE_LIMIT KV namespace (inbox:<id>).
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const { env } = getRequestContext()
    const kv = env.RATE_LIMIT

    const parsed = await req.json().catch(() => ({})) as { body?: string }
    const text = (parsed.body || '').trim()
    if (!text) return NextResponse.json({ ok: false, error: { code: 'EMPTY', message: 'Write a reply first.' } }, { status: 400 })
    if (text.length > 5000) return NextResponse.json({ ok: false, error: { code: 'TOO_LONG', message: 'Reply is too long.' } }, { status: 400 })

    const raw = await kv.get(`inbox:${id}`)
    if (!raw) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Message not found.' } }, { status: 404 })
    const msg = JSON.parse(raw) as InboxMsg
    if (!msg.email) return NextResponse.json({ ok: false, error: { code: 'NO_EMAIL', message: 'This message has no email to reply to.' } }, { status: 400 })

    const resendApiKey = env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json({ ok: false, error: { code: 'EMAIL_OFF', message: 'Email is not set up yet.' } }, { status: 503 })
    }

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 0;color:#111">
        <p style="font-size:15px;line-height:1.6;color:#333;white-space:pre-wrap">${esc(text)}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:13px;color:#666">Zach DeMillo &middot; VURMZ &middot; Centennial, CO &middot; (719) 257-3834</p>
        ${msg.message ? `<p style="font-size:12px;color:#999;margin-top:16px">Re: &ldquo;${esc((msg.message || '').slice(0, 300))}&rdquo;</p>` : ''}
      </div>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Zach at VURMZ <noreply@vurmz.com>',
        to: msg.email,
        reply_to: 'zach@vurmz.com',
        subject: 'Re: your message to VURMZ',
        html,
      }),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      await reportError(new Error('Inbox reply email failed'), { route: 'admin/inbox/reply', extra: { errorData } })
      return NextResponse.json({ ok: false, error: { code: 'SEND_FAILED', message: 'Could not send the email. Please try again.' } }, { status: 502 })
    }

    msg.replies = Array.isArray(msg.replies) ? msg.replies : []
    msg.replies.push({ body: text, sentAt: new Date().toISOString(), by: 'admin' })
    msg.read = true
    await kv.put(`inbox:${id}`, JSON.stringify(msg), { expirationTtl: 7776000 })

    return NextResponse.json({ ok: true, message: msg })
  }) as Promise<NextResponse>
}
