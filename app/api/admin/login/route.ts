export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { hashPassword, createAdminSession } from '@/lib/auth/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { password?: string }
    const password = body.password

    if (!password || typeof password !== 'string' || password.length > 200) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const { env } = getRequestContext()

    const expectedHash = env.ADMIN_PASSWORD_HASH
    if (!expectedHash) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const inputHash = await hashPassword(password)

    // Constant-time comparison to prevent timing attacks
    const encoder = new TextEncoder()
    const a = encoder.encode(inputHash)
    const b = encoder.encode(expectedHash)
    let match = a.length === b.length
    if (match) {
      try {
        // timingSafeEqual is available in Cloudflare Workers runtime
        match = (crypto.subtle as any).timingSafeEqual(a, b)
      } catch {
        // Fallback: XOR-based comparison (still constant-time for equal lengths)
        let diff = 0
        for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
        match = diff === 0
      }
    }

    if (!match) {
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    const { cookie } = await createAdminSession()

    const res = NextResponse.json({ ok: true })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
