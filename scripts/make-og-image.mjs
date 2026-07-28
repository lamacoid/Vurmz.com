// Renders the Open Graph card (1200x630) for search results and link
// previews. The old og-image.jpg was a corrupted photo. This one is drawn
// from the brand system: deep teal, oatmeal wordmark, one laser-red beam.
//
// Usage: node scripts/make-og-image.mjs
// Output: public/images/og-card.jpg (new filename on purpose; scrapers cache
// the old URL, and a new URL forces a refetch)

import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const W = 1200
const H = 630

const logoSvg = await readFile('public/images/vurmz-logo-full.svg', 'utf8')

// The source fill is the legacy orange; the site recolors it in CSS, so the
// same swap happens here.
const logo = logoSvg
  .replace(/<\?xml[^>]*\?>/, '')
  .replaceAll('#FF8C42', '#DED6C3')

// The wordmark viewBox is 67.677 x 7.7 units. Scale to 760px wide.
const logoW = 760
const logoH = Math.round((7.7 / 67.677353) * logoW)

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#16525C"/>
      <stop offset="1" stop-color="#0E333A"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- The lockup already reads "VURMZ | Laser Engraving". -->
  <svg x="${(W - logoW) / 2}" y="${Math.round(H * 0.42 - logoH / 2)}" width="${logoW}" height="${logoH}"
       viewBox="17.451982 -20.402248 67.677353 7.700000">${logo.replace(/<svg[^>]*>/, '').replace('</svg>', '')}</svg>

  <!-- The laser: one thin red beam with a bright origin point. -->
  <line x1="${W / 2 - 190}" y1="${H * 0.58}" x2="${W / 2 + 190}" y2="${H * 0.58}" stroke="#FF2A2A" stroke-width="3"/>
  <circle cx="${W / 2 - 190}" cy="${H * 0.58}" r="6" fill="#FF2A2A"/>

  <text x="${W / 2}" y="${H * 0.71}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="28"
        letter-spacing="3" fill="#7FCFD4">Centennial, Colorado · Hand-delivered</text>
</svg>`

const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer()
await writeFile('public/images/og-card.jpg', jpg)
console.log(`wrote public/images/og-card.jpg (${jpg.length} bytes)`)
