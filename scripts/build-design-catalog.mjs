// Curate design elements from Zach's organizer library and render license-safe
// PNG thumbnails. The source vectors NEVER ship — only raster previews go to R2
// (served like any product photo); the id→source-path map stays gitignored for
// admin use. Run: node scripts/build-design-catalog.mjs [perCategory]
//
// Output:
//   /tmp/vurmz-design-thumbs/<id>.png     (upload these to R2)
//   /tmp/vurmz-design-thumbs/manifest.json (id → r2 key + temp file)
//   lib/design/catalog.json                (client-safe: id,label,category,thumb)
//   vurmz-control/design-sources.json      (gitignored: id → absolute source path)
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const LIB = '/Users/zacharydemillo/Library/Application Support/com.vurmz.library/library.json'
const OUT = '/tmp/vurmz-design-thumbs'
const PER_CAT = parseInt(process.argv[2] || '28', 10)
const THUMB = 240

// Clean, on-brand categories → customer-facing group names. Skip the unsorted
// "99-Downloads-To-Sort" and "NeedsManualReview" buckets entirely.
const CATEGORIES = [
  ['01-Animals-Wildlife', 'Animals'],
  ['02-Flowers-Plants', 'Florals & Botanical'],
  ['03-Coasters-Decor', 'Home & Decor'],
  ['05-Holiday-Seasonal', 'Holiday & Seasonal'],
  ['06-Food-Party', 'Food & Drink'],
  ['07-Frames-Borders', 'Frames & Borders'],
  ['08-Gothic-Dark', 'Gothic'],
  ['09-Heraldry-Emblems', 'Emblems & Crests'],
]

// Customer-facing labels are "<Noun> N" — bundle filenames are repetitive
// auto-tags, and in a visual picker the thumbnail is the real selector.
const LABEL_NOUN = {
  'Animals': 'Animal', 'Florals & Botanical': 'Floral', 'Home & Decor': 'Decor',
  'Holiday & Seasonal': 'Holiday', 'Food & Drink': 'Food & Drink',
  'Frames & Borders': 'Border', 'Gothic': 'Gothic', 'Emblems & Crests': 'Emblem',
}

// Tiled diagonal "VURMZ" watermark, baked into every preview so thumbnails
// can't be casually lifted for digital reuse. Mid-gray at low opacity reads on
// the cream picker chips and survives the dark-preview inversion.
function watermarkSvg(w, h) {
  const marks = []
  for (let y = 14; y < h + 30; y += 56) {
    for (let x = -20; x < w + 30; x += 92) {
      marks.push(`<text x="${x}" y="${y}" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="700" fill="#808080" fill-opacity="0.32" transform="rotate(-28 ${x} ${y})">VURMZ</text>`)
    }
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${marks.join('')}</svg>`)
}

// Evenly sample n items across a list so we get variety, not the first n.
function spread(arr, n) {
  if (arr.length <= n) return arr
  const step = arr.length / n
  return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)])
}

const lib = JSON.parse(readFileSync(LIB, 'utf8'))
mkdirSync(OUT, { recursive: true })

const catalog = []   // client-safe
const sources = {}   // id → absolute path (gitignored)
const manifest = []  // id → r2 key + temp png
let n = 0, fail = 0

for (const [catPath, display] of CATEGORIES) {
  const items = lib.assets.filter(a =>
    (a.categoryPath || '').startsWith(catPath) &&
    (a.fileExtension || '').toLowerCase() === 'svg'
  )
  const picks = spread(items, PER_CAT)
  let idx = 0
  for (const a of picks) {
    try {
      // Stable id from the SOURCE file content — restyling thumbnails
      // (watermark tweaks etc.) must not rotate ids stored on past orders.
      const srcHash = createHash('sha256').update(readFileSync(a.absolutePath)).digest('hex')
      const id = 'de_' + srcHash.slice(0, 16)
      if (sources[id]) continue // skip duplicate source content
      const base = await sharp(a.absolutePath, { density: 200, limitInputPixels: false })
        .resize(THUMB, THUMB, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
      const meta = await sharp(base).metadata()
      const png = await sharp(base)
        .composite([{ input: watermarkSvg(meta.width, meta.height) }])
        .png({ compressionLevel: 9 })
        .toBuffer()
      const pngHash = createHash('sha256').update(png).digest('hex')
      const key = `media/${pngHash.slice(0, 2)}/${pngHash.slice(2, 4)}/${pngHash}.png`
      const tmp = `${OUT}/${id}.png`
      writeFileSync(tmp, png)
      idx++
      catalog.push({ id, label: `${LABEL_NOUN[display] ?? display} ${idx}`, category: display, thumb: `/api/media/${key}` })
      sources[id] = a.absolutePath
      manifest.push({ id, key, tmp })
      n++
    } catch (e) {
      fail++
    }
  }
  console.log(`${display}: ${catalog.filter(c => c.category === display).length}`)
}

writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest))
mkdirSync('lib/design', { recursive: true })
writeFileSync('lib/design/catalog.json', JSON.stringify(catalog, null, 0))
writeFileSync('vurmz-control/design-sources.json', JSON.stringify(sources, null, 2))
console.log(`\n${n} thumbnails rendered (${fail} failed). Catalog: ${catalog.length} elements across ${CATEGORIES.length} categories.`)
console.log(`Next: upload ${manifest.length} thumbs to R2 from ${OUT}/manifest.json`)
