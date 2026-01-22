export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

const SESSION_COOKIE = 'vurmz_session'

// Simple password hash comparison (edge-compatible)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'vurmz-salt-2024')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as { email: string; password: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const { env } = getRequestContext()
    const db = env.DB as D1Database

    // Find user
    const user = await db.prepare(
      'SELECT id, email, name, role, password FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first() as {
      id: string
      email: string
      name: string
      role: string
      password: string
    } | null

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const passwordHash = await hashPassword(password)
    if (passwordHash !== user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    response.cookies.set(SESSION_COOKIE, `${user.id}:${sessionId}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json({ error: 'Sign in failed' }, { status: 500 })
  }
}
