export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

const SESSION_COOKIE = 'vurmz_session'

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json() as { token?: string; email?: string }

    if (!token || !email) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const db = getD1()

    // Find user with valid token
    const user = await db.prepare(`
      SELECT id, name, email, role, magic_token, magic_token_expires
      FROM users WHERE email = ?
    `).bind(email.toLowerCase()).first() as {
      id: string
      name: string
      email: string
      role: string
      magic_token: string | null
      magic_token_expires: string | null
    } | null

    if (!user || !user.magic_token) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
    }

    // Verify token
    if (user.magic_token !== token) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
    }

    // Check expiry
    if (!user.magic_token_expires || new Date(user.magic_token_expires) < new Date()) {
      return NextResponse.json({ error: 'Link has expired' }, { status: 401 })
    }

    // Clear magic token
    await db.prepare(
      'UPDATE users SET magic_token = NULL, magic_token_expires = NULL WHERE id = ?'
    ).bind(user.id).run()

    // Create session
    const sessionId = crypto.randomUUID()
    const response = NextResponse.json({ success: true })

    response.cookies.set(SESSION_COOKIE, `${user.id}:${sessionId}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error verifying admin magic link:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
