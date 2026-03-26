import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

const SESSION_TTL = 7 * 24 * 60 * 60 // 7 days
const COOKIE_NAME = 'vurmz_admin'

// Simple hash using Web Crypto (available on Cloudflare Workers)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password)
  return computed === hash
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSession(env: any): Promise<{ token: string; cookie: string }> {
  const token = generateToken()
  const sessions = env.SESSIONS as KVNamespace
  await sessions.put(`session:${token}`, JSON.stringify({
    createdAt: new Date().toISOString(),
  }), { expirationTtl: SESSION_TTL })

  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`
  return { token, cookie }
}

export async function validateSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return false

  try {
    const { env } = getRequestContext()
    const sessions = (env as any).SESSIONS as KVNamespace
    const data = await sessions.get(`session:${token}`)
    return data !== null
  } catch {
    return false
  }
}

export async function deleteSession(req: NextRequest): Promise<string> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (token) {
    try {
      const { env } = getRequestContext()
      const sessions = (env as any).SESSIONS as KVNamespace
      await sessions.delete(`session:${token}`)
    } catch {}
  }
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}

// Wrapper for protected API routes
export async function withAuth(req: NextRequest, handler: () => Promise<NextResponse>): Promise<NextResponse> {
  const valid = await validateSession(req)
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return handler()
}
