/**
 * R2 helpers. All calls must run inside a request handler — getMedia()
 * uses getRequestContext() which only works during a request.
 */
import { getMedia } from '@/lib/db/client'

export async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function r2KeyFromHash(hash: string, ext: string): string {
  return `media/${hash.slice(0, 2)}/${hash.slice(2, 4)}/${hash}${ext ? `.${ext}` : ''}`
}

export function guessExt(filename: string, mimeType: string): string {
  const m = filename.match(/\.([a-z0-9]+)$/i)
  if (m) return m[1].toLowerCase()
  const byMime: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  }
  return byMime[mimeType] ?? ''
}

export async function putObject(key: string, body: ArrayBuffer | ReadableStream, contentType: string): Promise<void> {
  const bucket = getMedia()
  await bucket.put(key, body, { httpMetadata: { contentType } })
}

export async function getObject(key: string): Promise<R2ObjectBody | null> {
  return await getMedia().get(key)
}

export async function deleteObject(key: string): Promise<void> {
  await getMedia().delete(key)
}

export async function headObject(key: string): Promise<R2Object | null> {
  return await getMedia().head(key)
}
