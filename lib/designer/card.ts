/**
 * The card designer's shared core: the design record, the six real
 * materials, the sample people, and the preview render. Isomorphic (no
 * opentype, no DOM) so the client bundle stays light; the laser file is
 * made server-side in card-laser.ts from the same record.
 */
import qrcode from 'qrcode-generator'
import { CARD_TEMPLATES, type DesignerTemplate, type DesignerSlot } from './templates.generated'
import { fontOptions } from '@/lib/fonts'

export { CARD_TEMPLATES }
export type { DesignerTemplate, DesignerSlot }

/** The anodized wallet card. 3.375 by 2.125 in, 0.125 in corners, 0.2 in safe margin. */
export const CARD_MM = { w: 85.725, h: 53.975, r: 3.175, safe: 5.08 }

/** Material truths: anodized aluminum always marks bare-alu silver. The dye
 *  comes off, whatever colour the card is. The silver card marks a shade
 *  darker and reads low contrast, which is the truth of that blank. */
export interface CardMaterial {
  key: string
  label: string
  surface: string
  markColor: string
  gloss?: boolean
}
export const CARD_MATERIALS: CardMaterial[] = [
  { key: 'black-matte', label: 'Black, matte', surface: '#1c1c1e', markColor: '#C9CACC' },
  { key: 'black-gloss', label: 'Black, gloss', surface: '#111114', markColor: '#C9CACC', gloss: true },
  { key: 'silver', label: 'Silver', surface: '#c8c9cb', markColor: '#B4B6B9' },
  { key: 'blue', label: 'Blue', surface: '#2a5d8f', markColor: '#C9CACC' },
  { key: 'red', label: 'Red', surface: '#a03030', markColor: '#C9CACC' },
  { key: 'purple', label: 'Purple', surface: '#5a3a7e', markColor: '#C9CACC' },
]

export interface CardLogo {
  /** R2 key minted by /api/checkout/upload. */
  key: string
  filename: string
  mime: string
}

/** What rides the cart, the order, and the saved-designs table. */
export interface CardDesign {
  kind: 'card'
  templateKey: string
  materialKey: string
  /** fontOptions value for the name slot. Other slots stay in the template's face. */
  nameFont: string
  values: Record<string, string>
  logo?: CardLogo
}

export const DEFAULT_NAME_FONT = 'zen-kurenaido'

export function templateByKey(key: string): DesignerTemplate | undefined {
  return CARD_TEMPLATES.find(t => t.key === key)
}
export function materialByKey(key: string): CardMaterial | undefined {
  return CARD_MATERIALS.find(m => m.key === key)
}

/** CSS family name for a fontOptions value ("'Zen Kurenaido', sans-serif" -> "Zen Kurenaido"). */
export function familyForFontValue(value: string): string {
  const opt = fontOptions.find(f => f.value === value) ?? fontOptions.find(f => f.value === DEFAULT_NAME_FONT)
  const fam = String(opt?.style.fontFamily ?? 'Zen Kurenaido')
  const m = fam.match(/^\s*'([^']+)'|^\s*"([^"]+)"|^\s*([^,]+)/)
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? 'Zen Kurenaido').trim()
}

// ---- sample people --------------------------------------------------------
// Zach's rule (2026-09-13): every sample card is a long-dead famous name
// with a modernized title. Nobody living, nobody's real number.
export interface SamplePerson {
  name: string
  title: string
  company: string
  phone: string
  email: string
  url: string
}
export const SAMPLE_PEOPLE: SamplePerson[] = [
  { name: 'Ada Lovelace', title: 'Systems Architect', company: 'Analytical Engines', phone: '(720) 555-0143', email: 'ada@analyticalengines.com', url: 'analyticalengines.com' },
  { name: 'Nikola Tesla', title: 'Master Electrician', company: 'Wardenclyffe Electric', phone: '(720) 555-0188', email: 'nikola@wardenclyffe.com', url: 'wardenclyffe.com' },
  { name: 'Johannes Gutenberg', title: 'Print Broker', company: 'Mainz Press', phone: '(720) 555-0145', email: 'johannes@mainzpress.com', url: 'mainzpress.com' },
  { name: 'Leonardo da Vinci', title: 'Design Lead', company: 'Studio Vinci', phone: '(720) 555-0152', email: 'leo@studiovinci.com', url: 'studiovinci.com' },
  { name: 'Marie Curie', title: 'Lab Manager', company: 'Radium Works', phone: '(720) 555-0198', email: 'marie@radiumworks.com', url: 'radiumworks.com' },
  { name: 'Isambard Brunel', title: 'Site Superintendent', company: 'Great Western Contracting', phone: '(720) 555-0159', email: 'ik@greatwestern.build', url: 'greatwestern.build' },
  { name: 'Hedy Lamarr', title: 'Wireless Engineer', company: 'Frequency Hopping', phone: '(720) 555-0141', email: 'hedy@frequencyhopping.com', url: 'frequencyhopping.com' },
  { name: 'George W. Carver', title: 'Agronomist', company: 'Tuskegee Soil and Seed', phone: '(720) 555-0164', email: 'george@tuskegeeseed.com', url: 'tuskegeeseed.com' },
  { name: 'Benjamin Franklin', title: 'Print Shop Owner', company: 'Franklin and Sons', phone: '(720) 555-0176', email: 'ben@franklinandsons.com', url: 'franklinandsons.com' },
  { name: 'Florence Nightingale', title: 'Operations Director', company: 'Scutari Care', phone: '(720) 555-0120', email: 'florence@scutaricare.com', url: 'scutaricare.com' },
  { name: 'Archimedes', title: 'Mechanical Engineer', company: 'Syracuse Machine Works', phone: '(720) 555-0112', email: 'arch@syracusemachine.com', url: 'syracusemachine.com' },
  { name: 'Harriet Tubman', title: 'Logistics Coordinator', company: 'North Star Freight', phone: '(720) 555-0183', email: 'harriet@northstarfreight.com', url: 'northstarfreight.com' },
  { name: 'Galileo Galilei', title: 'Optics Technician', company: 'Padua Instruments', phone: '(720) 555-0161', email: 'galileo@paduainstruments.com', url: 'paduainstruments.com' },
  { name: 'Jane Austen', title: 'Managing Editor', company: 'Chawton House Press', phone: '(720) 555-0117', email: 'jane@chawtonpress.com', url: 'chawtonpress.com' },
  { name: 'Frederick Douglass', title: 'Publisher', company: 'North Star Media', phone: '(720) 555-0138', email: 'frederick@northstarmedia.com', url: 'northstarmedia.com' },
  { name: 'Cleopatra', title: 'Chief Executive', company: 'Ptolemaic Holdings', phone: '(720) 555-0130', email: 'cleo@ptolemaic.co', url: 'ptolemaic.co' },
]

export function initialsOf(name: string, max = 3): string {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]?.toUpperCase() ?? '').join('').slice(0, max)
}

/** The oversized initial (Monogram) is one letter; small monograms take up to three. */
export function monogramFor(name: string, slot: DesignerSlot): string {
  return initialsOf(name, (slot.sizeMm ?? 0) >= 20 ? 1 : 3)
}

/** Luminance of a CSS colour, 0..1, or null when it cannot be read. */
function luminance(color: string): number | null {
  const c = color.trim().toLowerCase()
  if (c === 'white') return 1
  if (c === 'black') return 0
  const m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (m) {
    const h = m[1].length === 3 ? m[1].split('').map(x => x + x).join('') : m[1]
    const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const rgb = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (rgb) return (0.2126 * +rgb[1] + 0.7152 * +rgb[2] + 0.0722 * +rgb[3]) / 255
  return null
}

/**
 * Strip anything executable or external from an uploaded SVG and force it
 * to one tone: the laser marks or it does not. Light fills (white, near
 * white) become knockouts, everything else becomes the mark. Isomorphic,
 * so the preview shows the same one-tone logo the laser gets.
 *
 * `knockout` is what a light fill paints: the card colour on screen, and
 * the mark colour in the laser file, where LightBurn's nested-fill rule
 * turns a filled shape inside a filled shape into a hole.
 */
export function sanitizeLogoSvg(src: string, mark = '#000', knockout = 'none'): { inner: string; viewBox: string } | null {
  const open = src.match(/<svg\b[^>]*>/i)
  if (!open) return null
  const openTag = open[0]
  let inner = src.slice(src.indexOf(openTag) + openTag.length).replace(/<\/svg>\s*$/i, '')
  const tone = (v: string) => { const l = luminance(v); return l !== null && l > 0.88 ? knockout : mark }
  inner = inner
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<(a|iframe|video|audio|animate|animateTransform|set)\b[\s\S]*?(<\/\1>|\/>)/gi, '')
    .replace(/\son[a-z]+="[^"]*"/gi, '')
    .replace(/\s(href|xlink:href)="(?!#)[^"]*"/gi, '')
    .replace(/\sstyle="([^"]*)"/gi, (_m, css: string) => {
      const f = css.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/)?.[1]
      const st = css.match(/(?:^|;)\s*stroke\s*:\s*([^;]+)/)?.[1]
      return (f ? ` fill="${f.trim() === 'none' ? 'none' : tone(f)}"` : '') + (st ? ` stroke="${st.trim() === 'none' ? 'none' : tone(st)}"` : '')
    })
    .replace(/\sfill="(?!none)([^"]*)"/gi, (_m, v: string) => ` fill="${v.startsWith('url(') ? mark : tone(v)}"`)
    .replace(/\sstroke="(?!none)([^"]*)"/gi, (_m, v: string) => ` stroke="${v.startsWith('url(') ? mark : tone(v)}"`)
  // Elements with no fill attribute default to black in SVG: make that the mark too.
  inner = inner.replace(/<(path|rect|circle|ellipse|polygon|polyline|text)\b([^>]*?)(\/?)>/gi, (m, tag: string, attrs: string, close: string) =>
    /\sfill=/.test(attrs) ? m : `<${tag}${attrs} fill="${mark}"${close}>`)
  let viewBox = openTag.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) {
    const w = parseFloat(openTag.match(/\swidth="([\d.]+)/)?.[1] ?? '')
    const h = parseFloat(openTag.match(/\sheight="([\d.]+)/)?.[1] ?? '')
    if (!(w > 0 && h > 0)) return null
    viewBox = `0 0 ${w} ${h}`
  }
  return { inner, viewBox }
}

/** Sample values for a template: the person fills the identity slots, the
 *  template's own sample stays for value/date/place style slots. */
export function sampleValues(template: DesignerTemplate, person: SamplePerson): Record<string, string> {
  const out: Record<string, string> = {}
  for (const s of template.slots) {
    if (s.kind !== 'text') continue
    switch (s.name) {
      case 'name': out[s.name] = person.name; break
      case 'title': out[s.name] = person.title; break
      case 'company': out[s.name] = person.company; break
      case 'monogram': out[s.name] = initialsOf(person.name); break
      case 'contact-1': out[s.name] = person.phone; break
      case 'contact-2': out[s.name] = person.email; break
      case 'contact-3': out[s.name] = person.url; break
      case 'url': out[s.name] = person.url; break
      default: out[s.name] = (s.sample ?? '').replace(/Alex Rivera/g, person.name).replace(/Rivera Plumbing/g, person.company).replace(/\(720\) 555-0139/g, person.phone)
    }
  }
  return out
}

/** Sample person for a template, stable per template so previews don't shuffle. */
export function samplePersonFor(templateKey: string): SamplePerson {
  const i = Math.max(0, CARD_TEMPLATES.findIndex(t => t.key === templateKey))
  return SAMPLE_PEOPLE[i % SAMPLE_PEOPLE.length]
}

/** Human labels for the fields. */
export const SLOT_LABELS: Record<string, string> = {
  name: 'Name', title: 'Title', company: 'Company', monogram: 'Initials',
  'contact-1': 'Phone', 'contact-2': 'Email', 'contact-3': 'Website', url: 'Website',
  tagline: 'Line', value: 'Value', date: 'Date', place: 'Place',
}
export function slotLabel(template: DesignerTemplate, slot: DesignerSlot): string {
  if (SLOT_LABELS[slot.name] && !['value', 'tagline', 'date', 'place'].includes(slot.name)) return SLOT_LABELS[slot.name]
  // The "other" cards use generic slots; the sample text says what they are.
  const s = (slot.sample ?? '').trim()
  if (template.key === 'gift' && slot.name === 'value') return 'Amount'
  if (template.key === 'membership' && slot.name === 'value') return 'Member number'
  if (template.key === 'coordinates' && slot.name === 'value') return 'Coordinates'
  if (slot.name === 'date') return 'Date'
  if (slot.name === 'place') return 'Place'
  if (slot.name === 'value') return 'Detail'
  return s.length > 0 && s.length <= 22 ? s : 'Line'
}

// ---- rendering ------------------------------------------------------------
export function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Available width for a text slot inside the safe margin, given its anchor. */
export function availableWidth(slot: DesignerSlot, template?: DesignerTemplate): number {
  const left = CARD_MM.safe, right = CARD_MM.w - CARD_MM.safe
  let l = left, r = right
  // Divider's columns and Scan's QR share the card with the text; keep text off them.
  if (template?.key === 'divider') { if (slot.x < 34) r = Math.min(r, 31); else l = Math.max(l, slot.x) }
  if (template?.key === 'scan' && slot.x < 50) r = Math.min(r, 48)
  if (template?.key === 'monogram' && slot.name !== 'monogram') l = Math.max(l, 42)
  if (template?.key === 'band') l = Math.max(l, slot.x)
  const a = slot.anchor ?? 'start'
  if (a === 'middle') return 2 * Math.min(slot.x - l, r - slot.x)
  if (a === 'end') return slot.x - l
  return r - slot.x
}

/** QR modules for a url, drawn as one path inside a slot rect with a
 *  4-module quiet zone. Returns '' when the value is empty or too long. */
export function qrPath(value: string, slot: DesignerSlot): string {
  const v = value.trim()
  if (!v || !slot.w || !slot.h) return ''
  try {
    const qr = qrcode(0, 'M')
    qr.addData(v.startsWith('http') ? v : `https://${v}`)
    qr.make()
    const n = qr.getModuleCount()
    const quiet = 4
    const size = Math.min(slot.w, slot.h)
    const cell = size / (n + quiet * 2)
    const ox = slot.x + (slot.w - size) / 2 + quiet * cell
    const oy = slot.y + (slot.h - size) / 2 + quiet * cell
    const parts: string[] = []
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c)) continue
      const x = (ox + c * cell).toFixed(3), y = (oy + r * cell).toFixed(3), s = cell.toFixed(3)
      parts.push(`M${x} ${y}h${s}v${s}h-${s}z`)
    }
    return parts.join('')
  } catch {
    return ''
  }
}

export interface FillOptions {
  /** Mark colour for screen previews. Laser output leaves #000. */
  markColor?: string
  /** For the emblem slot: a raster image href (data URL). Rendered one-tone. */
  logoHref?: string
  /** For the emblem slot: SVG source text. Sanitised and rendered one-tone. */
  logoSvg?: string
  /** Card surface colour, what a logo's light fills paint on screen. */
  surface?: string
  /** Placeholders: render sample text at reduced opacity for empty slots. */
  placeholders?: Record<string, string>
}

/** The template body with the design's text, logo, and QR filled in. */
export function fillBody(template: DesignerTemplate, design: Pick<CardDesign, 'values' | 'nameFont'>, opts: FillOptions = {}): string {
  let body = template.body
  const nameFamily = familyForFontValue(design.nameFont)
  const hasLogo = Boolean(opts.logoHref || opts.logoSvg)
  for (const slot of template.slots) {
    if (slot.kind === 'text') {
      const re = new RegExp(`<text\\b([^>]*)data-slot="${slot.name}"([^>]*)>[^<]*<\\/text>`)
      const raw = design.values[slot.name] ?? ''
      let value = raw.trim()
      let ghost = false
      if (!value && slot.name === 'monogram' && design.values.name?.trim()) value = monogramFor(design.values.name, slot)
      if (!value && opts.placeholders?.[slot.name]) { value = opts.placeholders[slot.name]; ghost = true }
      if (slot.name === 'monogram') value = value.slice(0, (slot.sizeMm ?? 0) >= 20 ? 1 : 3)
      if (slot.name === 'monogram' && hasLogo) value = ''
      body = body.replace(re, (_m, a: string, b: string) => {
        let attrs = a + b
        if (slot.name === 'name') attrs = attrs.replace(/font-family="[^"]*"/, `font-family="${escapeXml(nameFamily)}"`)
        if (ghost) attrs += ' opacity="0.45"'
        attrs += ` data-slot="${slot.name}"`
        return `<text${attrs}>${escapeXml(value)}</text>`
      })
    } else if (slot.name === 'emblem') {
      const re = new RegExp(`<rect\\b[^>]*data-slot="emblem"[^>]*\\/>`)
      const mark = opts.markColor ?? '#000'
      let el = ''
      if (opts.logoSvg) {
        const clean = sanitizeLogoSvg(opts.logoSvg, mark, opts.surface ?? 'none')
        if (clean) el = `<svg data-slot="emblem" x="${slot.x}" y="${slot.y}" width="${slot.w}" height="${slot.h}" viewBox="${escapeXml(clean.viewBox)}" preserveAspectRatio="xMidYMid meet">${clean.inner}</svg>`
      } else if (opts.logoHref) {
        // A raster shows as its luminance in the mark colour: light pixels
        // are the mark, dark pixels are bare card. That is what engraving
        // an image does.
        const [r, g, b] = [1, 3, 5].map(i => parseInt(mark.slice(i, i + 2), 16) / 255)
        el = `<filter id="emblem-tone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0.2126 0.7152 0.0722 0 0"/></filter><image data-slot="emblem" filter="url(#emblem-tone)" href="${escapeXml(opts.logoHref)}" x="${slot.x}" y="${slot.y}" width="${slot.w}" height="${slot.h}" preserveAspectRatio="xMidYMid meet"/>`
      }
      body = body.replace(re, el)
    } else if (slot.name === 'qr') {
      const re = new RegExp(`<rect\\b[^>]*data-slot="qr"[^>]*\\/>`)
      const url = design.values.url ?? opts.placeholders?.url ?? ''
      const d = qrPath(url, slot)
      body = body.replace(re, d ? `<path data-slot="qr" d="${d}" fill="#000"${design.values.url ? '' : ' opacity="0.45"'}/>` : '')
    }
  }
  if (opts.markColor) body = body.replace(/#000\b/g, opts.markColor)
  return body
}

/** The on-screen card: surface colour, faint sheen, the marks in the true
 *  mark colour. Text stays live text so the browser's fonts render it. */
export function previewSvg(design: CardDesign, opts: { logoHref?: string; logoSvg?: string; placeholders?: Record<string, string>; id?: string } = {}): string {
  const template = templateByKey(design.templateKey) ?? CARD_TEMPLATES[0]
  const material = materialByKey(design.materialKey) ?? CARD_MATERIALS[0]
  const id = opts.id ?? 'card'
  const body = fillBody(template, design, { markColor: material.markColor, surface: material.surface, logoHref: opts.logoHref, logoSvg: opts.logoSvg, placeholders: opts.placeholders })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_MM.w} ${CARD_MM.h}" width="100%" role="img" aria-label="${escapeXml(template.label)} on ${escapeXml(material.label)}">
<defs>
<linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${material.gloss ? 0.16 : 0.07}"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${material.gloss ? 0.18 : 0.08}"/></linearGradient>
<clipPath id="${id}-clip"><rect x="0" y="0" width="${CARD_MM.w}" height="${CARD_MM.h}" rx="${CARD_MM.r}"/></clipPath>
</defs>
<rect x="0" y="0" width="${CARD_MM.w}" height="${CARD_MM.h}" rx="${CARD_MM.r}" fill="${material.surface}"/>
<rect x="0" y="0" width="${CARD_MM.w}" height="${CARD_MM.h}" rx="${CARD_MM.r}" fill="url(#${id}-sheen)"/>
<g clip-path="url(#${id}-clip)">${body}</g>
</svg>`
}

/** Card colour chips: stocked finishes when the inventory has rows, else all six. */
export function materialsFor(stockedLabels: string[]): CardMaterial[] {
  const norm = (s: string) => s.trim().toLowerCase()
  const stocked = CARD_MATERIALS.filter(m => stockedLabels.some(l => norm(l) === norm(m.label)))
  return stocked.length > 0 ? stocked : CARD_MATERIALS
}

/** A design with nothing typed in it is not a design. */
export function isBlank(design: CardDesign): boolean {
  return !design.logo && !Object.values(design.values).some(v => v.trim())
}
