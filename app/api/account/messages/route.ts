import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { listThread, sendMessage, markThreadRead } from '@/lib/db/repos/messages'
import { getEnv } from '@/lib/db/client'

export const runtime = 'edge'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const messages = await listThread(session.customer.id)
    // mark read on fetch (customer-side only — doesn't flip admin inbox)
    await markThreadRead(session.customer.id)
    return NextResponse.json({ ok: true, data: { messages } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}

const postSchema = z.object({ body: z.string().min(1).max(10000) })

export async function POST(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const body = postSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const msg = await sendMessage({
      customerId: session.customer.id,
      direction: 'inbound',
      channel: 'web',
      body: body.data.body,
    })
    // Notify owner (non-blocking)
    const env = getEnv()
    if (env.RESEND_API_KEY) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'VURMZ Portal <portal@vurmz.com>',
          to: 'zach@vurmz.com',
          reply_to: session.customer.email,
          subject: `Message from ${session.customer.name || session.customer.email}`,
          html: `<p>${escapeHtml(body.data.body).replace(/\n/g, '<br/>')}</p><p style="color:#999;font-size:12px"><a href="https://vurmz.com/admin/customers/${session.customer.id}">View customer →</a></p>`,
        }),
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true, data: { message: msg } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
