#!/usr/bin/env node
/**
 * Right-sized copies of every photo in public/ (2026-11-16).
 *
 * Why: on Cloudflare Pages the built-in Next image optimizer does nothing.
 * /_next/image handed back the original file whatever width was asked for,
 * so a phone downloaded the same 500 KB JPEG a desktop did, and the homepage
 * pulled about twenty of them. Page speed is a ranking signal, so this
 * script makes the sized copies ahead of time instead.
 *
 * What it does: for each JPEG or PNG under public/ it writes WebP copies at
 * the widths in WIDTHS (never larger than the original) to public/_img/,
 * and records them in lib/image-manifest.json. lib/image-loader.ts reads
 * that manifest. A photo that is not in the manifest is served as the
 * original file, so a missing copy can never break an image.
 *
 * File names carry a short hash of the source, so a replaced photo gets a
 * new address and the copies can be cached for a year (public/_headers).
 *
 * It runs before every build (package.json "build"). It only does work for
 * photos that are new or changed. Run by hand: node scripts/optimize-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, sep } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(root, 'public')
const OUT = join(PUBLIC, '_img')
const MANIFEST = join(root, 'lib', 'image-manifest.json')

// Must match deviceSizes + imageSizes in next.config.ts.
const WIDTHS = [128, 256, 384, 640, 1080, 1920]
const SKIP_DIRS = new Set(['_img', 'fonts', 'models', 'data'])
const QUALITY = 74

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (dir === PUBLIC && SKIP_DIRS.has(name)) continue
      walk(full, found)
    } else if (/\.(jpe?g|png)$/i.test(name)) {
      found.push(full)
    }
  }
  return found
}

function prune(dir, keep) {
  if (!existsSync(dir)) return 0
  let removed = 0
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      removed += prune(full, keep)
      if (readdirSync(full).length === 0) rmdirSync(full)
    } else if (!keep.has(full)) {
      unlinkSync(full)
      removed++
    }
  }
  return removed
}

const manifest = {}
const keep = new Set()
let made = 0
let before = 0
let after = 0

for (const file of walk(PUBLIC).sort()) {
  const src = '/' + relative(PUBLIC, file).split(sep).join('/')
  const bytes = readFileSync(file)
  const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 8)
  let width
  try {
    const meta = await sharp(bytes).metadata()
    // A phone photo can be stored sideways with a flag saying how to turn it.
    width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width
  } catch {
    console.warn(`skipped (unreadable): ${src}`)
    continue
  }
  if (!width) continue

  const top = Math.min(width, WIDTHS[WIDTHS.length - 1])
  const widths = [...new Set([...WIDTHS.filter(w => w < top), top])].sort((a, b) => a - b)
  const base = src.replace(/\.[a-z]+$/i, '')
  const isPng = /\.png$/i.test(file)

  // A damaged file is skipped whole: it stays out of the manifest and is
  // served as the original, so one bad photo cannot stop a build.
  let ok = true
  const mine = []
  for (const w of widths) {
    const out = join(OUT, `${base}-${w}.${hash}.webp`)
    mine.push(out)
    if (existsSync(out)) continue
    try {
      mkdirSync(dirname(out), { recursive: true })
      await sharp(bytes, { failOn: 'none' })
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp(isPng ? { quality: 84, alphaQuality: 92, effort: 5 } : { quality: QUALITY, effort: 5 })
        .toFile(out)
      made++
    } catch (e) {
      console.warn(`skipped (could not convert): ${src} (${e.message})`)
      ok = false
      break
    }
  }
  if (!ok) continue
  for (const out of mine) keep.add(out)
  before += bytes.length
  after += statSync(join(OUT, `${base}-${top}.${hash}.webp`)).size
  manifest[src] = { h: hash, w: widths }
}

const removed = prune(OUT, keep)
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')

const mb = n => (n / 1024 / 1024).toFixed(1)
console.log(`images: ${Object.keys(manifest).length} photos, ${made} copies written, ${removed} stale removed. Full size ${mb(before)} MB as shipped before, ${mb(after)} MB now.`)
