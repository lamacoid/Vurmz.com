export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRequestContext } from '@cloudflare/next-on-pages'

const ADMIN_SESSION_COOKIE = 'vurmz_admin_session'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)

    // Also check the old cookie name for backwards compatibility
    const legacyCookie = cookieStore.get('vurmz_session')
    const activeCookie = sessionCookie || legacyCookie

    if (!activeCookie) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    const [userId] = activeCookie.value.split(':')
    if (!userId) {
      return NextResponse.json({ user: null, isAuthenticated: false })
    }

    const { env } = getRequestContext()
    const db = env.DB as D1Database

    const user = await db.prepare(
      'SELECT id, email, name, role FROM users WHERE id = ?'
    ).bind(userId).first()

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
      isAuthenticated: true
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null, isAuthenticated: false })
  }
}
