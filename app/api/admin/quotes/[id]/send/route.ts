import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getQuoteById, listQuoteItems, setQuoteStatus } from '@/lib/db/repos/quotes'
import { getEnv } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

// Escape values that flow into the email HTML (item descriptions, notes).
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const quote = await getQuoteById(id)
    if (!quote) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const items = await listQuoteItems(id)
    const env = getEnv()

    const dollars = (c: number) => `$${(c / 100).toFixed(2)}`
    const rows = items.map(it => `<tr><td style="padding:6px 0;color:#333">${it.qty} × ${esc(it.description)}</td><td style="text-align:right;padding:6px 0">${dollars(it.totalCents)}</td></tr>`).join('')

    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'VURMZ Quotes <quotes@vurmz.com>',
          to: quote.email,
          subject: `Quote ${quote.number} from VURMZ — ${dollars(quote.totalCents)}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111">
              <h2 style="margin:0 0 12px;font-size:20px">Quote ${quote.number}</h2>
              <p style="color:#555;line-height:1.5">Here&rsquo;s the quote we discussed. Let me know if you want to move forward or if anything needs adjusting.</p>
              <table style="width:100%;margin:16px 0;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}
                <tr><td style="padding:10px 0;font-weight:700">Total</td><td style="text-align:right;padding:10px 0;font-weight:700">${dollars(quote.totalCents)}</td></tr>
              </table>
              ${quote.expiresAt ? `<p style="color:#555">Valid until <strong>${new Date(quote.expiresAt).toLocaleDateString()}</strong>.</p>` : ''}
              ${quote.notes ? `<p style="color:#555;white-space:pre-wrap;border-left:3px solid #eee;padding-left:12px">${esc(quote.notes)}</p>` : ''}
              <p style="margin-top:24px;color:#555">Reply to this email to accept, request changes, or ask questions.</p>
              <p style="margin-top:32px;color:#999;font-size:12px">VURMZ · Centennial, CO · zach@vurmz.com</p>
            </div>
          `,
        }),
      })
    }
    await setQuoteStatus(id, 'sent')
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'quote.send', targetType: 'quote', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
