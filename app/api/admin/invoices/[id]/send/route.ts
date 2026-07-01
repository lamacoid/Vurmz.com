import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getInvoiceById, listInvoiceItems, setInvoiceStatus } from '@/lib/db/repos/invoices'
import { getCustomerById } from '@/lib/db/repos/customers'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getEnv } from '@/lib/db/client'

export const runtime = 'edge'

// Escape values that flow into the email HTML (item descriptions, customer name,
// notes). These are admin/customer-authored, so this is defense in depth.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const invoice = await getInvoiceById(id)
    if (!invoice) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const customer = await getCustomerById(invoice.customerId)
    if (!customer) return NextResponse.json({ ok: false, error: { code: 'CUSTOMER_MISSING' } }, { status: 400 })
    const items = await listInvoiceItems(id)
    const env = getEnv()

    const dollars = (c: number) => `$${(c / 100).toFixed(2)}`
    const rows = items.map(it => `<tr><td style="padding:6px 0;color:#333">${it.qty} × ${esc(it.description)}</td><td style="text-align:right;padding:6px 0">${dollars(it.totalCents)}</td></tr>`).join('')
    const payLink = `${env.SITE_URL || 'https://vurmz.com'}/account/invoices/${id}`
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111">
        <h2 style="margin:0 0 12px;font-size:20px">Invoice ${invoice.number}</h2>
        <p style="color:#555;line-height:1.5">Hi ${esc(customer.name || customer.email)}, here's your invoice from VURMZ.</p>
        <table style="width:100%;margin:16px 0;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}
          <tr><td style="padding:10px 0;font-weight:700">Total</td><td style="text-align:right;padding:10px 0;font-weight:700">${dollars(invoice.totalCents)}</td></tr>
        </table>
        <a href="${payLink}" style="display:inline-block;padding:12px 22px;background:#C46B4D;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;margin:12px 0">View & pay invoice</a>
        ${invoice.dueDate ? `<p style="color:#555">Due: <strong>${new Date(invoice.dueDate).toLocaleDateString()}</strong></p>` : ''}
        ${invoice.notes ? `<p style="color:#555;white-space:pre-wrap;border-left:3px solid #eee;padding-left:12px">${esc(invoice.notes)}</p>` : ''}
        <p style="margin-top:32px;color:#999;font-size:12px">VURMZ · Centennial, CO · zach@vurmz.com</p>
      </div>
    `
    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'VURMZ Invoices <invoices@vurmz.com>',
          to: customer.email,
          subject: `Invoice ${invoice.number} from VURMZ: ${dollars(invoice.totalCents)}`,
          html,
        }),
      })
    }
    await setInvoiceStatus(id, 'sent')
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'invoice.send', targetType: 'invoice', targetId: id,
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
