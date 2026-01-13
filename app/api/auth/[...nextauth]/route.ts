export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'vurmz_session'

// Simple password hash comparison
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
    const url = new URL(request.url)
    const action = url.pathname.split('/').filter(Boolean).pop()

    if (action === 'signin' || action === 'callback') {
      const data = await request.json() as { email: string; password: string }

      // Get D1 database
      const { env } = getRequestContext()
      const db = env.DB as D1Database

      // Find user
      const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(data.email).first()

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Verify password
      const passwordHash = await hashPassword(data.password)
      if (passwordHash !== (user as any).password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Create session response
      const sessionId = crypto.randomUUID()
      const response = NextResponse.json({
        user: {
          id: (user as any).id,
          email: (user as any).email,
          name: (user as any).name,
          role: (user as any).role
        }
      })

      response.cookies.set(SESSION_COOKIE, `${(user as any).id}:${sessionId}`, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/'
      })

      return response
    }

    if (action === 'signout') {
      const response = NextResponse.json({ success: true })
      response.cookies.delete(SESSION_COOKIE)
      return response
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.pathname.split('/').filter(Boolean).pop()

    if (action === 'session') {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get(SESSION_COOKIE)

      if (!sessionCookie) {
        return NextResponse.json({})
      }

      const [userId] = sessionCookie.value.split(':')
      if (!userId) {
        return NextResponse.json({})
      }

      const { env } = getRequestContext()
      const db = env.DB as D1Database
      const user = await db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').bind(userId).first()

      if (!user) {
        return NextResponse.json({})
      }

      return NextResponse.json({
        user: {
          id: (user as any).id,
          email: (user as any).email,
          name: (user as any).name,
          role: (user as any).role
        }
      })
    }

    if (action === 'csrf') {
      return NextResponse.json({ csrfToken: crypto.randomUUID() })
    }

    if (action === 'providers') {
      return NextResponse.json({
        credentials: { id: 'credentials', name: 'Credentials', type: 'credentials' }
      })
    }

    return NextResponse.json({})
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}
