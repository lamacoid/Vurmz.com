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

// Tag tokens that are noise for a human label.
const NOISE = new Set(['svg','vector','art','artistic','illustration','illustrations','clipart','design','graphic','icon','icons','image','file','cut','laser','digital','printable','instant','download','1','2','3'])

function labelFromFilename(fn) {
  const stem = fn.replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, '-')
  const toks = stem.split('-').filter(t => t && isNaN(Number(t)) && !NOISE.has(t.toLowerCase()))
  const uniq = [...new Set(toks)].slice(0, 3)
  if (uniq.length === 0) return 'Design'
  return uniq.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
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
  for (const a of picks) {
    try {
      const png = await sharp(a.absolutePath, { density: 200, limitInputPixels: false })
        .resize(THUMB, THUMB, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, palette: true })
        .toBuffer()
      const hash = createHash('sha256').update(png).digest('hex')
      const id = 'de_' + hash.slice(0, 16)
      const key = `media/${hash.slice(0, 2)}/${hash.slice(2, 4)}/${hash}.png`
      const tmp = `${OUT}/${id}.png`
      writeFileSync(tmp, png)
      catalog.push({ id, label: labelFromFilename(a.filename), category: display, thumb: `/api/media/${key}` })
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
