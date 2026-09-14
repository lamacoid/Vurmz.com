// Writes a laser SVG and a preview SVG for every card template with sample
// data, so the writer can be eyeballed without the site running.
//   npx tsx scripts/designer-smoke.ts <outdir>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { cardLaserSvg } from '../lib/designer/card-laser'
import { FONT_FILES } from '../lib/designer/font-files.generated'
import { CARD_TEMPLATES } from '../lib/designer/templates.generated'
import { sampleValues, samplePersonFor, previewSvg } from '../lib/designer/card'

const ROOT = new URL('../public', import.meta.url).pathname.replace(/%20/g, ' ')
const load = async (family: string) => {
  const p = FONT_FILES[family]; if (!p) return null
  const b = readFileSync(ROOT + p); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer
}
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#e33"/><rect x="35" y="35" width="30" height="30" fill="#fff"/></svg>`

async function main() {
  const out = process.argv[2] ?? '/tmp/designer-smoke'
  mkdirSync(out, { recursive: true })
  for (const t of CARD_TEMPLATES) {
    const person = samplePersonFor(t.key)
    const design = { kind: 'card' as const, templateKey: t.key, materialKey: 'black-matte', nameFont: 'zen-kurenaido', values: sampleValues(t, person), logo: t.slots.some(s => s.name === 'emblem') ? { key: 'x', filename: 'logo.svg', mime: 'image/svg+xml' } : undefined }
    const r = await cardLaserSvg(design, load, async () => ({ mime: 'image/svg+xml', bytes: new TextEncoder().encode(logoSvg).buffer as ArrayBuffer }))
    writeFileSync(`${out}/${t.key}.laser.svg`, r.svg)
    writeFileSync(`${out}/${t.key}.preview.svg`, previewSvg(design, { logoHref: 'data:image/svg+xml;base64,' + Buffer.from(logoSvg).toString('base64') }))
    console.log(t.key.padEnd(12), String(r.svg.length).padStart(7), 'bytes', r.notes.join(' | '))
  }
}
main().catch(e => { console.error(e); process.exit(1) })
