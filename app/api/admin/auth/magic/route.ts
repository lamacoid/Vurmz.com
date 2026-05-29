import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getEnv, getSessions, getRateLimit } from '@/lib/db/client'
import { generateToken } from '@/lib/auth/session'
import { getClientIp } from '@/lib/auth/session'
import { reportError } from '@/lib/error'

export const runtime = 'edge'

const ADMIN_EMAIL = 'zach@vurmz.com'
const TOKEN_TTL = 60 * 15

const schema = z.object({ email: z.string().email().max(200) })

async function sendEmail(env: CloudflareEnv, to: string, link: string) {
  if (!env.RESEND_API_KEY) {
    console.warn('[admin-magic] RESEND_API_KEY missing — link:', link)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'VURMZ Admin <noreply@vurmz.com>',
      to,
      subject: 'VURMZ admin sign-in link',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111">
          <h2 style="margin:0 0 12px;font-size:20px">Admin sign-in</h2>
          <p style="margin:0 0 24px;color:#555;line-height:1.5">Tap to sign in. This link expires in 15 minutes and works only once.</p>
          <a href="${link}" style="display:inline-block;padding:12px 22px;background:#235158;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">Sign in to admin</a>
          <p style="margin:28px 0 0;color:#888;font-size:12px">If you didn't request this, ignore the email and rotate ADMIN_PASSWORD_HASH immediately.</p>
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

  // Rate limit: 5 / 10 min per IP
  try {
    const rl = getRateLimit()
    const key = `admin_magic:${ip}`
    const count = parseInt((await rl.get(key)) ?? '0', 10)
    if (count >= 5) {
      return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED', message: 'Try again in a few minutes.' } }, { status: 429 })
    }
    await rl.put(key, String(count + 1), { expirationTtl: 600 })
  } catch {}

  // Always 200 to prevent email enumeration. Only actually send for the whitelisted email.
  if (email === ADMIN_EMAIL) {
    const token = generateToken(32)
    const env = getEnv()
    try {
      await getSessions().put(`admin_magic:${token}`, email, { expirationTtl: TOKEN_TTL })
      const link = `${env.SITE_URL || 'https://vurmz.com'}/admin/verify?t=${token}`
      await sendEmail(env, email, link).catch((err) => reportError(err, { route: 'admin/auth/magic' }))
    } catch (err) {
      reportError(err, { route: 'admin/auth/magic' })
    }
  }

  return NextResponse.json({ ok: true })
}
