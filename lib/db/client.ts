/**
 * D1 client access.
 *
 * Always call these INSIDE a request handler, never at module scope —
 * Cloudflare bindings are only available via getRequestContext during a request.
 */
import { getRequestContext } from '@cloudflare/next-on-pages'

export function getDb(): D1Database {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).DB
}

export function getTrackDb(): D1Database {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).TRACK_DB
}

export function getMedia(): R2Bucket {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).MEDIA
}

export function getSessions(): KVNamespace {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).SESSIONS
}

export function getCustomerSessions(): KVNamespace {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).CUSTOMER_SESSIONS
}

export function getRateLimit(): KVNamespace {
  const { env } = getRequestContext()
  return (env as unknown as CloudflareEnv).RATE_LIMIT
}

export function getEnv(): CloudflareEnv {
  const { env } = getRequestContext()
  return env as unknown as CloudflareEnv
}

/**
 * Generate a random id. Uses Web Crypto (available on edge).
 * Returns a 25-char base32-ish string — short enough for URLs, long enough for uniqueness.
 */
export function newId(prefix?: string): string {
  const bytes = new Uint8Array(15)
  crypto.getRandomValues(bytes)
  // base32 (crockford-ish) for URL-safety + no ambiguous chars
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  let out = ''
  for (const b of bytes) {
    out += alphabet[b & 31]
    out += alphabet[(b >> 3) & 31]
  }
  const id = out.slice(0, 24).toLowerCase()
  return prefix ? `${prefix}_${id}` : id
}

export function nowIso(): string {
  return new Date().toISOString()
}

/**
 * Fractional ordering — compute a position value between two neighbors.
 * If both are null, returns 0. If only one, offsets by ±1.
 */
export function positionBetween(before: number | null, after: number | null): number {
  if (before == null && after == null) return 0
  if (before == null) return (after as number) - 1
  if (after == null) return before + 1
  return (before + after) / 2
}
