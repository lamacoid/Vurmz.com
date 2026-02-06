export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { SESSION_COOKIE, decodeSession } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    const session = decodeSession(sessionCookie.value)
    if (!session) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    const { env } = getRequestContext()
    const db = env.DB as D1Database

    const user = await db.prepare(
      'SELECT id, email, name, role FROM users WHERE id = ?'
    ).bind(session.userId).first()

    if (!user) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    return NextResponse.json({
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role
      },
      isAuthenticated: true,
      userType: session.userType
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null, isAuthenticated: false })
  }
}
