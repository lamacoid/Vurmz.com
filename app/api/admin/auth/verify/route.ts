import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessions } from '@/lib/db/client'
import { createAdminSession } from '@/lib/auth/admin'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const schema = z.object({ token: z.string().min(10).max(128) })

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json().catch(() => null))
  if (!body.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
  }
  const sessions = getSessions()
  const key = `admin_magic:${body.data.token}`
  const email = await sessions.get(key)
  if (!email) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_TOKEN' } }, { status: 400 })
  }
  // One-shot — delete immediately
  try { await sessions.delete(key) } catch {}

  const { cookie } = await createAdminSession(email)

  await audit({
    actorType: 'admin',
    actorId: email,
    action: 'auth.login',
    targetType: 'admin',
    targetId: email,
    diff: { method: 'magic' },
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  })

  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', cookie)
  return res
}
