import manifest from './image-manifest.json'

/**
 * The image loader for next/image (2026-11-16).
 *
 * The built-in optimizer does nothing on Cloudflare Pages: it returned the
 * original file at every width. scripts/optimize-images.mjs writes sized
 * WebP copies of each photo in public/ and lists them in the manifest.
 * This picks the smallest copy that is at least as wide as the browser
 * asked for.
 *
 * Anything not in the manifest (a product photo served from R2, an SVG, a
 * photo added without a build) is returned unchanged, so an image can be
 * unoptimized but never broken.
 */
interface Sized { h: string; w: number[] }
const SIZED = manifest as Record<string, Sized>

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const entry = SIZED[src]
  if (!entry || entry.w.length === 0) return src
  const pick = entry.w.find(w => w >= width) ?? entry.w[entry.w.length - 1]
  return `/_img${src.replace(/\.[a-z]+$/i, '')}-${pick}.${entry.h}.webp`
}
