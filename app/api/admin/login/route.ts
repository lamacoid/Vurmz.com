export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { hashPassword, createSession } from '@/lib/admin-auth'

// Hardcoded hash of 'vurmz2024' — can also be overridden by ADMIN_PASSWORD_HASH secret
const DEFAULT_HASH = '5e2bf57d3f40c4b6df69daf1936cb766f832374b4fc0259a7cbff06e2f70f269'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { password?: string }
    const password = body.password

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const { env } = getRequestContext()

    // Use secret if set, otherwise use default hash
    const expectedHash = (env as any).ADMIN_PASSWORD_HASH || DEFAULT_HASH
    const inputHash = await hashPassword(password)

    if (inputHash !== expectedHash) {
      // Brief delay to slow brute force
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    const { cookie } = await createSession(env)

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
