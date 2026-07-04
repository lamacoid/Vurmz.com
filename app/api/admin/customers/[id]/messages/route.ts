export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getCustomerById } from '@/lib/db/repos/customers'
import { listThread, sendMessage } from '@/lib/db/repos/messages'
import { renderBrandedEmail, renderBrandedEmailText } from '@/lib/email/branded'
import { reportError } from '@/lib/error'

// Two-way portal messaging, admin side. Customers could always write from
// /account/messages; this is the missing reply/initiate half. Every
// outbound message also sends a branded email nudge so the customer knows
// to look at their portal (or can just read it in the email).

const postSchema = z.object({ body: z.string().min(1).max(5000) })

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const messages = await listThread(id)
    return NextResponse.json({ ok: true, data: { messages } })
  })
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const parsed = postSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { code: 'EMPTY', message: 'Write a message first.' } }, { status: 400 })
    }
    const customer = await getCustomerById(id)
    if (!customer) {
      return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Customer not found.' } }, { status: 404 })
    }

    const message = await sendMessage({
      customerId: id,
      direction: 'outbound',
      channel: 'admin',
      body: parsed.data.body,
    })

    // Email nudge, best-effort: the message is already in their portal.
    try {
      const { env } = getRequestContext()
      const resendApiKey = env.RESEND_API_KEY
      if (resendApiKey && customer.email) {
        const input = {
          heading: 'A message from Zach',
          body: parsed.data.body,
          ctaLabel: 'Reply in your account',
          ctaHref: 'https://www.vurmz.com/account/messages/',
        }
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Zach at VURMZ <zach@vurmz.com>',
            to: customer.email,
            reply_to: 'zach@vurmz.com',
            subject: 'A message from Zach at VURMZ',
            html: renderBrandedEmail(input),
            text: renderBrandedEmailText(input),
          }),
        })
      }
    } catch (e) {
      await reportError(e instanceof Error ? e : new Error('portal message nudge failed'), { route: 'admin/customers/messages' })
    }

    return NextResponse.json({ ok: true, data: { message } })
  })
}
