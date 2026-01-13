import { cookies } from 'next/headers'
import { getD1, generateId, now } from './d1'

const SESSION_COOKIE = 'vurmz_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Simple password hash comparison (for edge runtime)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'vurmz-salt-2024')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function login(email: string, password: string) {
  try {
    const db = getD1()

    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    const isValid = await verifyPassword(password, (user as any).password)

    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    // Return user info - cookie will be set by the route handler
    return {
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role
      }
    }
  } catch (error) {
    console.error('Login error in auth-edge:', error)
    return { error: 'Database error' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessionCookie) {
    return null
  }

  const [userId] = sessionCookie.value.split(':')

  if (!userId) {
    return null
  }

  const db = getD1()
  const user = await db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').bind(userId).first()

  if (!user) {
    return null
  }

  return {
    user: {
      id: (user as any).id,
      email: (user as any).email,
      name: (user as any).name,
      role: (user as any).role
    }
  }
}

// Helper to create a hashed password for seeding
export async function createPasswordHash(password: string): Promise<string> {
  return hashPassword(password)
}
