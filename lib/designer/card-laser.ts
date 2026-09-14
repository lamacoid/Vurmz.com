/**
 * The laser file for a card design: the same record the customer saw,
 * written as an SVG in millimetres with every letter outlined. Server only
 * (opentype.js, font fetches, R2 reads). Layers:
 *   #engrave   filled shapes, one tone (text outlines, rules, QR, logo)
 *   #line      stroked shapes (frame border, loyalty circles)
 *   #reference the card outline, laser red, for alignment only. Not output.
 */
import { textToPath, fitTextToBox } from './text-to-path'
import { FONT_FILES } from './font-files.generated'
import {
  CARD_MM, type CardDesign, type DesignerTemplate, type DesignerSlot,
  templateByKey, materialByKey, familyForFontValue, availableWidth, qrPath, monogramFor, sanitizeLogoSvg, escapeXml,
} from './card'

/** Smallest engraved text, 6 pt. Below this the fiber fills the counters. */
export const MIN_TEXT_MM = 2.12

export interface LaserFontLoader {
  (family: string): Promise<ArrayBuffer | null>
}
export interface LaserLogoLoader {
  (logo: NonNullable<CardDesign['logo']>): Promise<{ mime: string; bytes: ArrayBuffer } | null>
}
export interface LaserResult {
  svg: string
  /** Anything Zach should know before he fires: shrunken text, missing glyphs, dropped logo. */
  notes: string[]
}

/** Fetch-based font loader for the edge: fonts live under public/. */
export function fontLoaderFor(origin: string): LaserFontLoader {
  const cache = new Map<string, Promise<ArrayBuffer | null>>()
  return family => {
    const path = FONT_FILES[family]
    if (!path) return Promise.resolve(null)
    if (!cache.has(path)) {
      cache.set(path, fetch(new URL(path, origin)).then(r => (r.ok ? r.arrayBuffer() : null)).catch(() => null))
    }
    return cache.get(path)!
  }
}

function toBase64(bytes: ArrayBuffer): string {
  const u8 = new Uint8Array(bytes)
  let s = ''
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000))
  return btoa(s)
}

function slotRegexText(name: string) {
  return new RegExp(`<text\\b[^>]*data-slot="${name}"[^>]*>[^<]*<\\/text>`)
}

export async function cardLaserSvg(
  design: CardDesign,
  loadFont: LaserFontLoader,
  loadLogo?: LaserLogoLoader,
): Promise<LaserResult> {
  const template = templateByKey(design.templateKey)
  if (!template) throw new Error(`Unknown card template ${design.templateKey}`)
  const material = materialByKey(design.materialKey)
  const notes: string[] = []
  let body = template.body
  const engrave: string[] = []
  const lines: string[] = []
  const nameFamily = familyForFontValue(design.nameFont)
  const hasLogo = Boolean(design.logo)

  // Text slots -> outlines.
  for (const slot of template.slots) {
    if (slot.kind !== 'text') continue
    let value = (design.values[slot.name] ?? '').trim()
    if (!value && slot.name === 'monogram' && design.values.name?.trim()) value = monogramFor(design.values.name, slot)
    if (slot.name === 'monogram') value = value.slice(0, (slot.sizeMm ?? 0) >= 20 ? 1 : 3)
    if (slot.name === 'monogram' && hasLogo) value = ''
    body = body.replace(slotRegexText(slot.name), '')
    if (!value) continue
    const wanted = slot.name === 'name' ? nameFamily : (slot.fontFamily ?? 'Inter')
    let family = wanted
    let font = await loadFont(family)
    if (!font) { family = 'Inter'; font = await loadFont(family); notes.push(`${slot.name}: ${wanted} has no outline file, set in Inter`) }
    if (!font) throw new Error('No outline font available')
    let text = value
    let size = slot.sizeMm ?? 3
    if (slot.smallCaps) { text = text.toUpperCase(); size = size * 0.85 }
    const avail = availableWidth(slot, template)
    const base = { font, text, letterSpacingMm: slot.letterSpacing ?? 0, align: 'left' as const }
    let path
    try {
      path = textToPath({ ...base, sizeMm: size })
      if (path.widthMm > avail) {
        const fit = fitTextToBox({ ...base, boxMm: { w: avail, h: 1000 }, maxSizeMm: size, minSizeMm: MIN_TEXT_MM })
        path = fit
        if (!fit.fits) notes.push(`${slot.name}: "${value}" does not fit at ${MIN_TEXT_MM} mm, still too wide`)
        else notes.push(`${slot.name}: shrunk to ${fit.sizeMm.toFixed(2)} mm to fit`)
      }
    } catch (e) {
      // A glyph the font lacks: set that slot in Inter and say so.
      if (family !== 'Inter') {
        const inter = await loadFont('Inter')
        if (!inter) throw e
        path = textToPath({ ...base, font: inter, sizeMm: size })
        notes.push(`${slot.name}: ${family} is missing a character, set in Inter`)
      } else throw e
    }
    const anchor = slot.anchor ?? 'start'
    const dx = anchor === 'middle' ? slot.x - path.widthMm / 2 : anchor === 'end' ? slot.x - path.widthMm : slot.x
    const dy = slot.y - path.baselineMm
    engrave.push(`<path data-slot="${slot.name}" transform="translate(${dx.toFixed(3)} ${dy.toFixed(3)})" d="${path.d}"/>`)
  }

  // Rules -> filled rectangles (one engrave layer, no stroke widths to guess).
  body = body.replace(/<line\b([^>]*)\/>/g, (_m, attrs: string) => {
    const g = (n: string) => parseFloat(attrs.match(new RegExp(`\\s${n}="([^"]+)"`))?.[1] ?? '0')
    const x1 = g('x1'), y1 = g('y1'), x2 = g('x2'), y2 = g('y2')
    const t = parseFloat(attrs.match(/stroke-width="([^"]+)"/)?.[1] ?? '0.15')
    if (Math.abs(y1 - y2) < 1e-6) engrave.push(`<rect x="${Math.min(x1, x2)}" y="${(y1 - t / 2).toFixed(3)}" width="${Math.abs(x2 - x1).toFixed(3)}" height="${t}"/>`)
    else if (Math.abs(x1 - x2) < 1e-6) engrave.push(`<rect x="${(x1 - t / 2).toFixed(3)}" y="${Math.min(y1, y2)}" width="${t}" height="${Math.abs(y2 - y1).toFixed(3)}"/>`)
    else lines.push(`<line${attrs}/>`)
    return ''
  })
  // Stroked shapes stay stroked, on the line layer.
  body = body.replace(/<(rect|circle)\b([^>]*)\/>/g, (m, tag: string, attrs: string) => {
    if (/data-slot="(emblem|qr)"/.test(attrs)) return m
    if (/stroke="#000"/.test(attrs)) { lines.push(`<${tag}${attrs}/>`); return '' }
    engrave.push(`<${tag}${attrs}/>`)
    return ''
  })

  // QR.
  const qrSlot = template.slots.find(s => s.name === 'qr')
  if (qrSlot) {
    body = body.replace(/<rect\b[^>]*data-slot="qr"[^>]*\/>/, '')
    const d = qrPath(design.values.url ?? '', qrSlot)
    if (d) engrave.push(`<path data-slot="qr" d="${d}"/>`)
    else if (design.values.url) notes.push('qr: could not encode the website')
  }

  // Logo into the emblem slot.
  const emblem = template.slots.find(s => s.name === 'emblem')
  if (emblem) body = body.replace(/<rect\b[^>]*data-slot="emblem"[^>]*\/>/, '')
  if (emblem && design.logo && loadLogo) {
    const file = await loadLogo(design.logo)
    if (!file) notes.push(`logo: ${design.logo.filename} could not be read, place it by hand`)
    else if (file.mime === 'image/svg+xml') {
      const clean = sanitizeLogoSvg(new TextDecoder().decode(file.bytes), '#000', '#000')
      if (clean) { notes.push(`logo: ${design.logo.filename} set to one tone; its light fills are nested shapes, so LightBurn fills them as holes (fill all shapes at once). Check the fill preview.`); engrave.push(`<svg data-slot="emblem" x="${emblem.x}" y="${emblem.y}" width="${emblem.w}" height="${emblem.h}" viewBox="${escapeXml(clean.viewBox)}" preserveAspectRatio="xMidYMid meet">${clean.inner}</svg>`) }
      else notes.push(`logo: ${design.logo.filename} is not a readable SVG, place it by hand`)
    } else if (/^image\/(png|jpeg|gif|webp)$/.test(file.mime)) {
      engrave.push(`<image data-slot="emblem" x="${emblem.x}" y="${emblem.y}" width="${emblem.w}" height="${emblem.h}" preserveAspectRatio="xMidYMid meet" href="data:${file.mime};base64,${toBase64(file.bytes)}"/>`)
      notes.push(`logo: ${design.logo.filename} is a raster, engraves as an image (light pixels mark)`)
    } else notes.push(`logo: ${design.logo.filename} (${file.mime}) needs converting, place it by hand`)
  }

  // Whatever is left in the body is grouping markup only.
  const leftover = body.replace(/<\/?g\b[^>]*>/g, '').trim()
  if (leftover) notes.push('template carried markup the laser writer did not understand; check the file')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_MM.w}mm" height="${CARD_MM.h}mm" viewBox="0 0 ${CARD_MM.w} ${CARD_MM.h}">
<title>VURMZ card, ${escapeXml(template.label)}, ${escapeXml(material?.label ?? design.materialKey)}</title>
<g id="reference" fill="none" stroke="#FF2A2A" stroke-width="0.1"><rect x="0" y="0" width="${CARD_MM.w}" height="${CARD_MM.h}" rx="${CARD_MM.r}"/></g>
<g id="engrave" fill="#000" stroke="none">
${engrave.join('\n')}
</g>
<g id="line" fill="none" stroke="#000" stroke-width="0.1">
${lines.join('\n')}
</g>
</svg>
`
  return { svg, notes }
}
