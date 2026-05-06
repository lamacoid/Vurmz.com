import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { consumeMagicLinkToken, createCustomerSession } from '@/lib/auth/customer'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { nowIso, getDb } from '@/lib/db/client'

export const runtime = 'edge'

const schema = z.object({ token: z.string().min(10).max(128) })

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json().catch(() => null))
  if (!body.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
  }
  const customer = await consumeMagicLinkToken(body.data.token)
  if (!customer) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_TOKEN' } }, { status: 400 })
  }

  // Mark email verified on first successful magic-link consumption
  try {
    if (!customer.emailVerifiedAt) {
      await getDb()
        .prepare('UPDATE customers SET email_verified_at = ?, last_seen_at = ? WHERE id = ?')
        .bind(nowIso(), nowIso(), customer.id)
        .run()
    }
  } catch {}

  const { cookie } = await createCustomerSession(customer.id, 'magic')
  await audit({
    actorType: 'customer',
    actorId: customer.id,
    action: 'auth.login',
    targetType: 'customer',
    targetId: customer.id,
    diff: { method: 'magic' },
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  })

  const firstName = customer.name.trim().split(/\s+/)[0]
  const res = NextResponse.json({ ok: true, firstName })
  res.headers.append('Set-Cookie', cookie)
  return res
}
