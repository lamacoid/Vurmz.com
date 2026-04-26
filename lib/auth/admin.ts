/**
 * Admin auth — thin wrapper over existing lib/admin-auth.ts.
 * Keeps legacy API intact while exposing the new session-data shape.
 * The legacy file stays in place; import from here in new code.
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSessions, nowIso } from '@/lib/db/client'
import { generateToken, cookieString, clearCookieString } from './session'

export const ADMIN_COOKIE = 'vurmz_admin'
export const ADMIN_SESSION_TTL = 60 * 60 * 24 * 7 // 7 days

export interface AdminSessionData {
  createdAt: string
  csrfToken: string
  email?: string
}

export async function createAdminSession(email?: string): Promise<{ token: string; cookie: string; csrfToken: string }> {
  const token = generateToken(32)
  const csrfToken = generateToken(16)
  const data: AdminSessionData = {
    createdAt: nowIso(),
    csrfToken,
    email,
  }
  await getSessions().put(`session:${token}`, JSON.stringify(data), {
    expirationTtl: ADMIN_SESSION_TTL,
  })
  const cookie = cookieString(ADMIN_COOKIE, token, {
    maxAge: ADMIN_SESSION_TTL,
    sameSite: 'Lax',
  })
  return { token, cookie, csrfToken }
}

export async function getAdminSession(req: NextRequest): Promise<(AdminSessionData & { token: string }) | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!token) return null
  try {
    const raw = await getSessions().get(`session:${token}`)
    if (!raw) return null
    // legacy sessions might only have { createdAt } — normalize
    const parsed = JSON.parse(raw) as Partial<AdminSessionData>
    return {
      createdAt: parsed.createdAt ?? nowIso(),
      csrfToken: parsed.csrfToken ?? '',
      email: parsed.email,
      token,
    }
  } catch {
    return null
  }
}

export async function destroyAdminSession(req: NextRequest): Promise<string> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (token) {
    try { await getSessions().delete(`session:${token}`) } catch {}
  }
  return clearCookieString(ADMIN_COOKIE)
}

export async function requireAdmin(req: NextRequest) {
  const session = await getAdminSession(req)
  if (!session) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  return session
}

/** Route-handler wrapper. */
export async function withAdminAuth(
  req: NextRequest,
  handler: (session: AdminSessionData & { token: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getAdminSession(req)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  return handler(session)
}
