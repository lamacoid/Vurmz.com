export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'vurmz_session'

// Simple password hash
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
    // Check if user is logged in
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const [userId] = sessionCookie.value.split(':')
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json() as {
      currentPassword: string
      newPassword: string
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    const { env } = getRequestContext()
    const db = env.DB as D1Database

    // Get user and verify current password
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentHash = await hashPassword(currentPassword)
    if (currentHash !== (user as any).password) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Update password
    const newHash = await hashPassword(newPassword)
    await db.prepare('UPDATE users SET password = ? WHERE id = ?').bind(newHash, userId).run()

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}
