import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { createMagicLinkToken } from '@/lib/auth/customer'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { getEnv, getRateLimit } from '@/lib/db/client'

export const runtime = 'edge'

const schema = z.object({ email: z.string().email().max(200) })

async function sendEmail(env: CloudflareEnv, to: string, link: string) {
  if (!env.RESEND_API_KEY) {
    console.warn('[magic] RESEND_API_KEY missing — link:', link)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'VURMZ <noreply@vurmz.com>',
      to,
      subject: 'Your VURMZ sign-in link',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111">
          <h2 style="margin:0 0 12px;font-size:20px">Sign in to your VURMZ account</h2>
          <p style="margin:0 0 24px;color:#555;line-height:1.5">Tap the button below to sign in. This link expires in 15 minutes and works only once.</p>
          <a href="${link}" style="display:inline-block;padding:12px 22px;background:#C46B4D;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">Sign in</a>
          <p style="margin:28px 0 0;color:#888;font-size:12px">If the button doesn't work, paste this link into your browser:<br/><span style="color:#555">${link}</span></p>
          <p style="margin:32px 0 0;color:#aaa;font-size:11px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }),
  })
}

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json().catch(() => null))
  if (!body.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
  }
  const email = body.data.email.toLowerCase().trim()
  const ip = getClientIp(req) ?? 'unknown'

  // Basic rate limit: 5 requests / 10 min per ip+email
  try {
    const rl = getRateLimit()
    const key = `magic:${ip}:${email}`
    const count = parseInt((await rl.get(key)) ?? '0', 10)
    if (count >= 5) {
      return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED', message: 'Try again in a few minutes.' } }, { status: 429 })
    }
    await rl.put(key, String(count + 1), { expirationTtl: 600 })
  } catch {}

  // Always respond 200 even if we don't actually email — prevents account enumeration
  const customer = await upsertCustomerByEmail({ email })
  const token = await createMagicLinkToken(customer.id, { ip, userAgent: getUserAgent(req) })
  const env = getEnv()
  const link = `${env.SITE_URL || 'https://vurmz.com'}/account/verify?t=${token}`

  await sendEmail(env, email, link).catch(err => console.error('[magic] email failed', err))

  return NextResponse.json({ ok: true })
}
