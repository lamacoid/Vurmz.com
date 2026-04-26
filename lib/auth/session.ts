/**
 * Shared session primitives used by both admin and customer auth.
 * Uses Web Crypto (edge-runtime compatible).
 */
import type { NextRequest } from 'next/server'

export function generateToken(lengthBytes = 32): string {
  const bytes = new Uint8Array(lengthBytes)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function cookieString(name: string, value: string, opts: {
  maxAge?: number
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  expires?: Date
} = {}): string {
  const parts = [`${name}=${value}`]
  parts.push(`Path=${opts.path ?? '/'}`)
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`)
  if (opts.expires) parts.push(`Expires=${opts.expires.toUTCString()}`)
  parts.push(`SameSite=${opts.sameSite ?? 'Lax'}`)
  if (opts.httpOnly !== false) parts.push('HttpOnly')
  if (opts.secure !== false) parts.push('Secure')
  return parts.join('; ')
}

export function clearCookieString(name: string, path = '/'): string {
  return cookieString(name, '', { maxAge: 0, path })
}

export function getClientIp(req: NextRequest): string | null {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    null
  )
}

export function getUserAgent(req: NextRequest): string | null {
  return req.headers.get('user-agent') || null
}
