/**
 * Unified auth utilities for VURMZ (edge-compatible)
 *
 * Single source of truth for session cookie name, encoding/decoding,
 * and magic link token generation. Used by:
 *   - /api/admin/auth/verify (sets cookie)
 *   - /api/auth/session (reads cookie)
 *   - /api/auth/logout (clears cookie)
 *   - middleware.ts (validates cookie)
 */

export const SESSION_COOKIE = 'vurmz_session'
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export type UserType = 'admin' | 'customer'

export interface SessionPayload {
  userId: string
  userType: UserType
  sessionId: string
}

/**
 * Encode a session into a cookie value.
 * Format: userId:userType:sessionId
 */
export function encodeSession(userId: string, userType: UserType): string {
  const sessionId = crypto.randomUUID()
  return `${userId}:${userType}:${sessionId}`
}

/**
 * Decode a session cookie value back into its parts.
 * Returns null if the format is invalid.
 *
 * Supports both new format (userId:userType:sessionId) and
 * legacy format (userId:sessionId) for backwards compatibility.
 */
export function decodeSession(cookieValue: string): SessionPayload | null {
  if (!cookieValue) return null

  const parts = cookieValue.split(':')

  // New format: userId:userType:sessionId
  if (parts.length === 3) {
    const [userId, userType, sessionId] = parts
    if (!userId || !sessionId) return null
    if (userType !== 'admin' && userType !== 'customer') return null
    return { userId, userType, sessionId }
  }

  // Legacy format: userId:sessionId (treat as admin for backwards compat)
  if (parts.length === 2) {
    const [userId, sessionId] = parts
    if (!userId || !sessionId) return null
    return { userId, userType: 'admin', sessionId }
  }

  return null
}

/**
 * Generate a magic link token (URL-safe, 40 hex chars).
 */
export function generateMagicToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 8)
}
