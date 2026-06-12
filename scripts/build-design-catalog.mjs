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
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

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
  ['04-Patterns-Designs', 'Patterns & Shapes', 35],
  ['05-Holiday-Seasonal', 'Holiday & Seasonal'],
  ['06-Food-Party', 'Food & Drink'],
  ['07-Frames-Borders', 'Frames & Borders'],
  ['08-Gothic-Dark', 'Gothic'],
  ['09-Heraldry-Emblems', 'Emblems & Crests'],
  ['11-Anatomy-Medical', 'Bones & Anatomy', 30],
]

// Zach-approved directory sources (2026-06-12) — the organized veins inside
// the otherwise-skipped downloads bucket, ingested by direct filesystem walk.
const DL = '/Users/zacharydemillo/Projects/VURMZ/Business/Design Library'
const HUB = `${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized`
const DIR_SOURCES = [
  // "Generic crap sells" expansion (Zach, 2026-06-12): clipart, patterns, bones.
  [`${HUB}/07-Icons-Clipart`, 'Symbols & Clipart', 60],
  [`${HUB}/06-Patterns-Textures`, 'Patterns & Shapes', 45],
  [`${HUB}/05-Anatomy-Medical`, 'Bones & Anatomy', 30],
  [`${HUB}/10-Occult-Mystical/Death-Plague-Coloring-Collection`, 'Bones & Anatomy', 15, /\.(svg|png)$/i],
  [`${HUB}/08-Tattoo-Art`, 'Gothic', 20],
  // Expand florals: his sorted floral tree + the organized nature hub (incl. Columbine, the Colorado state flower)
  [`${DL}/02-Flowers-Plants/Individual-Flowers`, 'Florals & Botanical', 36],
  [`${DL}/02-Flowers-Plants/Floral-Arrangements`, 'Florals & Botanical', 14],
  [`${DL}/02-Flowers-Plants/Wreaths`, 'Florals & Botanical', 14],
  [`${DL}/02-Flowers-Plants/Herbs`, 'Florals & Botanical', 8],
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/03-Nature-Flowers-Plants/ColumbineFlower1`, 'Florals & Botanical', 6],
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/03-Nature-Flowers-Plants/ColumbineFlower2`, 'Florals & Botanical', 6],
  // New category for a Colorado shop
  // These three bundles are PNG-only — still engravable art, ingest as raster.
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/03-Nature-Flowers-Plants/Mountain-Silhouettes`, 'Mountains & Outdoors', 16, /\.png$/i],
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/03-Nature-Flowers-Plants/Outdoor-Nature-Bundle-1-74`, 'Mountains & Outdoors', 10, /\.png$/i],
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/03-Nature-Flowers-Plants/Outdoor-Nature-Bundle-75-150`, 'Mountains & Outdoors', 10, /\.png$/i],
  [`${DL}/02-Flowers-Plants/Trees-Nature`, 'Mountains & Outdoors', 8],
  [`${DL}/99-Downloads-To-Sort/DESIGN ASSETS/SVG Files/Nature-Outdoor`, 'Mountains & Outdoors', 8],
  // Gothic top-up from the mystical sets
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/10-Occult-Mystical/WitchyBundleFiles`, 'Gothic', 12],
  [`${DL}/99-Downloads-To-Sort/All Vurmz Asset Download Hub/_Organized/10-Occult-Mystical/eye_of_providence`, 'Gothic', 6],
]

// Removed after the 2026-06-12 trademark/quality visual screen — never re-add.
const DENYLIST = new Set([
  'de_108ba0e51302996a', 'de_4750181ff2fda97a', 'de_d312a24091e3a664',
  'de_0b1cd8eebb53552d', 'de_7d4c86e7255206e6', 'de_3863562831f3f6d8',
  'de_a25bff11bed27b24', 'de_5c64d41c04127335', 'de_8f0139d636d7c627',
  'de_7b67c16e4bbcc00b', 'de_d8fc2ee66969f2fe', 'de_f270783fc69b57ea',
  'de_25a4ea77c74b6baf',
  // 2nd screen round: cathedral misfiled in florals, 3 dog heads (await Pets)
  'de_83a0554ba1741935', 'de_d79fc06b8d257921', 'de_6deccdf247c03e4c',
  'de_5a9ab54c5c4ca5d2',
  // 3rd screen round: lab/dental clipart, emoji icons, misfiled items
  'de_0ade73dea1e5d3d4',
  'de_1fba8286dbbc7f87',
  'de_234b04f8083fe33b',
  'de_25a206f6de7c18b4',
  'de_288cb97e424cb30e',
  'de_3d3ac02879f36cbe',
  'de_42d003ee9ba46c23',
  'de_45405db2e7eee8ac',
  'de_4e1b8717057ba170',
  'de_5df86acc84987dc0',
  'de_626c222f4d5b4927',
  'de_6956303d7c67956f',
  'de_8749871122f7475f',
  'de_8975efc8a85c32ca',
  'de_8f831042669e705d',
  'de_8f89edc844e46f31',
  'de_9f32a5724587b704',
  'de_ab647abdadc23e52',
  'de_c5fdf1a5f09e7977',
  'de_d65131162af58cfa',
  'de_f2323b85d4156198',
  'de_f930d45167ba6fbe',
  'de_fa5316fec631767e',
])

function walkSvgs(dir, extRe = /\.svg$/i) {
  const out = []
  let entries = []
  try { entries = readdirSync(dir) } catch { return out }
  for (const e of entries) {
    if (e.startsWith('.') || e.startsWith('__MACOSX')) continue
    const p = join(dir, e)
    let st
    try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) out.push(...walkSvgs(p, extRe))
    else if (extRe.test(e)) out.push(p)
  }
  return out
}

// Customer-facing labels are "<Noun> N" — bundle filenames are repetitive
// auto-tags, and in a visual picker the thumbnail is the real selector.
const LABEL_NOUN = {
  'Animals': 'Animal', 'Florals & Botanical': 'Floral', 'Home & Decor': 'Decor',
  'Holiday & Seasonal': 'Holiday', 'Food & Drink': 'Food & Drink',
  'Frames & Borders': 'Border', 'Gothic': 'Gothic', 'Emblems & Crests': 'Emblem',
  'Mountains & Outdoors': 'Mountain',
  'Bones & Anatomy': 'Bones', 'Patterns & Shapes': 'Pattern', 'Symbols & Clipart': 'Clipart',
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

const labelCounters = {}

async function ingest(absPath, display) {
  // Stable id from the SOURCE file content — restyling thumbnails
  // (watermark tweaks etc.) must not rotate ids stored on past orders.
  const srcHash = createHash('sha256').update(readFileSync(absPath)).digest('hex')
  const id = 'de_' + srcHash.slice(0, 16)
  if (sources[id] || DENYLIST.has(id)) return false
  const base = await sharp(absPath, { density: 200, limitInputPixels: false })
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
  const base1 = LABEL_NOUN[display] ?? display
  labelCounters[base1] = (labelCounters[base1] ?? 0) + 1
  catalog.push({ id, label: `${base1} ${labelCounters[base1]}`, category: display, thumb: `/api/media/${key}` })
  sources[id] = absPath
  manifest.push({ id, key, tmp })
  n++
  return true
}

for (const [catPath, display, count] of CATEGORIES) {
  const items = lib.assets.filter(a =>
    (a.categoryPath || '').startsWith(catPath) &&
    (a.fileExtension || '').toLowerCase() === 'svg'
  )
  for (const a of spread(items, count ?? PER_CAT)) {
    try { await ingest(a.absolutePath, display) } catch { fail++ }
  }
  console.log(`${display}: ${catalog.filter(c => c.category === display).length}`)
}

for (const [dir, display, take, extRe] of DIR_SOURCES) {
  const files = walkSvgs(dir, extRe)
  let added = 0
  for (const f of spread(files, take)) {
    try { if (await ingest(f, display)) added++ } catch { fail++ }
  }
  console.log(`+${added} ${display}  <- ${dir.split('/').slice(-2).join('/')} (${files.length} found)`)
}

writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest))
mkdirSync('lib/design', { recursive: true })
writeFileSync('lib/design/catalog.json', JSON.stringify(catalog, null, 0))
writeFileSync('vurmz-control/design-sources.json', JSON.stringify(sources, null, 2))
console.log(`\n${n} thumbnails rendered (${fail} failed). Catalog: ${catalog.length} elements across ${CATEGORIES.length} categories.`)
console.log(`Next: upload ${manifest.length} thumbs to R2 from ${OUT}/manifest.json`)
