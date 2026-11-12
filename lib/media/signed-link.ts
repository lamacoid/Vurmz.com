/**
 * Signed, expiring links to one private upload.
 *
 * Why: the quote form emails Zach a photo link. The old link pointed at the
 * admin file route, which needs an admin login, so from a phone's mail app it
 * came back 401 and looked dead (reported 2026-11-11). A signed link opens
 * the one file it names, with no login, until it expires.
 *
 * Scope is deliberately narrow: only guest uploads (checkout/gup_...), only
 * the exact key that was signed, only until `exp`. The signature is an
 * HMAC-SHA256 over "key.exp". The HMAC key is derived from a server secret
 * that already exists in the environment, so there is nothing new to
 * configure and nothing to forget in production.
 */
import { getRequestContext } from '@cloudflare/next-on-pages'

export const GUEST_UPLOAD_KEY_RE = /^checkout\/gup_[A-Za-z0-9]+\/[^/]{1,200}$/

/**
 * The secret both sides sign and verify with. FILE_LINK_SECRET when it is
 * set, otherwise the Resend key, which production always has. Empty means
 * no links are made and every link is refused: it fails closed.
 */
export function fileLinkSecret(): string {
  try {
    const { env } = getRequestContext()
    const s = env.FILE_LINK_SECRET || env.RESEND_API_KEY
    if (s) return s
  } catch {
    // Not in a Cloudflare context (local dev).
  }
  return process.env.FILE_LINK_SECRET || process.env.RESEND_API_KEY || ''
}

const enc = new TextEncoder()

async function hmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  // Derive, never use the raw secret: a leaked link signature must say
  // nothing about the secret it came from.
  const material = await crypto.subtle.digest('SHA-256', enc.encode(`vurmz-file-link:v1:${secret}`))
  return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, usage)
}

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')

function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[0-9a-f]{64}$/.test(hex)) return null
  const out = new Uint8Array(new ArrayBuffer(32))
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}

/** Path and query for a signed link to `key`, good for `days` days. */
export async function signFilePath(key: string, secret: string, days = 30): Promise<string | null> {
  if (!secret || !GUEST_UPLOAD_KEY_RE.test(key)) return null
  const exp = Math.floor(Date.now() / 1000) + days * 86400
  const sig = toHex(await crypto.subtle.sign('HMAC', await hmacKey(secret, ['sign']), enc.encode(`${key}.${exp}`)))
  return `/api/files/${key.split('/').map(encodeURIComponent).join('/')}?exp=${exp}&sig=${sig}`
}

/** True only for an unexpired link whose signature matches this exact key. */
export async function verifyFileLink(key: string, exp: string | null, sig: string | null, secret: string): Promise<boolean> {
  if (!secret || !exp || !sig || !GUEST_UPLOAD_KEY_RE.test(key)) return false
  if (!/^\d{1,12}$/.test(exp) || Number(exp) < Math.floor(Date.now() / 1000)) return false
  const given = fromHex(sig)
  if (!given) return false
  // subtle.verify compares in constant time.
  return crypto.subtle.verify('HMAC', await hmacKey(secret, ['verify']), given, enc.encode(`${key}.${exp}`))
}
