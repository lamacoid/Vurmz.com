/**
 * Customer auth — magic link (primary) + passkey (opt-in after first login).
 *
 * Magic link flow:
 *   1. POST /api/account/auth/magic  { email }       → create token, email it
 *   2. GET  /account/verify?t=<token>                 → consume token, set session cookie
 *
 * Passkey flow (Chunk 3):
 *   1. POST /api/account/auth/passkey/register-start
 *   2. POST /api/account/auth/passkey/register-finish
 *   3. POST /api/account/auth/passkey/auth-start
 *   4. POST /api/account/auth/passkey/auth-finish
 *
 * Sessions live in KV (`CUSTOMER_SESSIONS`) — not D1 — for speed.
 */
import type { NextRequest } from 'next/server'
import { getCustomerSessions, getDb, newId, nowIso } from '@/lib/db/client'
import { getCustomerById, updateLastSeen } from '@/lib/db/repos/customers'
import type { Customer } from '@/lib/db/repos/customers'
import { generateToken, sha256, cookieString, clearCookieString } from './session'

export const CUSTOMER_COOKIE = 'vurmz_account'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days
export const MAGIC_LINK_TTL_MINUTES = 15

export interface CustomerSessionData {
  customerId: string
  createdAt: string
  csrfToken: string
  loginMethod: 'magic' | 'passkey'
}

// ---------- magic link ----------

export async function createMagicLinkToken(customerId: string, ctx?: { ip?: string | null; userAgent?: string | null }): Promise<string> {
  const rawToken = generateToken(32)
  const tokenHash = await sha256(rawToken)
  const expires = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000).toISOString()
  const db = getDb()
  await db
    .prepare(
      `INSERT INTO customer_auth_tokens (id, customer_id, token_hash, expires_at, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(newId('tok'), customerId, tokenHash, expires, ctx?.ip ?? null, ctx?.userAgent ?? null)
    .run()
  return rawToken
}

export async function consumeMagicLinkToken(rawToken: string): Promise<Customer | null> {
  const tokenHash = await sha256(rawToken)
  const db = getDb()
  const row = await db
    .prepare(
      `SELECT id, customer_id, expires_at, consumed_at
       FROM customer_auth_tokens
       WHERE token_hash = ?
       LIMIT 1`
    )
    .bind(tokenHash)
    .first<{ id: string; customer_id: string; expires_at: string; consumed_at: string | null }>()
  if (!row) return null
  if (row.consumed_at) return null
  if (new Date(row.expires_at).getTime() < Date.now()) return null

  await db
    .prepare('UPDATE customer_auth_tokens SET consumed_at = ? WHERE id = ?')
    .bind(nowIso(), row.id)
    .run()

  return await getCustomerById(row.customer_id)
}

// ---------- session ----------

export async function createCustomerSession(
  customerId: string,
  loginMethod: 'magic' | 'passkey'
): Promise<{ token: string; cookie: string; csrfToken: string }> {
  const token = generateToken(32)
  const csrfToken = generateToken(16)
  const sessions = getCustomerSessions()
  const data: CustomerSessionData = {
    customerId,
    createdAt: nowIso(),
    csrfToken,
    loginMethod,
  }
  await sessions.put(`cust:${token}`, JSON.stringify(data), { expirationTtl: SESSION_TTL_SECONDS })
  const cookie = cookieString(CUSTOMER_COOKIE, token, {
    maxAge: SESSION_TTL_SECONDS,
    sameSite: 'Lax',
    httpOnly: true,
    secure: true,
  })
  return { token, cookie, csrfToken }
}

export async function getCustomerSession(req: NextRequest): Promise<(CustomerSessionData & { customer: Customer }) | null> {
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value
  if (!token) return null
  try {
    const sessions = getCustomerSessions()
    const raw = await sessions.get(`cust:${token}`)
    if (!raw) return null
    const data = JSON.parse(raw) as CustomerSessionData
    const customer = await getCustomerById(data.customerId)
    if (!customer) return null

    // Refresh last-seen, throttled to at most once per 5 minutes so we don't write
    // to D1 on every authenticated request. Best-effort — a failed write must not
    // break the session lookup.
    const last = customer.lastSeenAt ? new Date(customer.lastSeenAt).getTime() : 0
    if (Date.now() - last > 5 * 60 * 1000) {
      await updateLastSeen(customer.id).catch(() => {})
    }

    return { ...data, customer }
  } catch {
    return null
  }
}

export async function destroyCustomerSession(req: NextRequest): Promise<string> {
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value
  if (token) {
    try {
      await getCustomerSessions().delete(`cust:${token}`)
    } catch {}
  }
  return clearCookieString(CUSTOMER_COOKIE)
}

export async function requireCustomer(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  return session
}
