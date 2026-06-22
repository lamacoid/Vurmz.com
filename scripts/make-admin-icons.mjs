// Generates the VURMZ Admin PWA icons (deep-teal square, oatmeal "V", laser-red
// dot = the live back office). Path-only SVG so there's no font dependency.
// This is a utility icon for the admin dock app, NOT the brand mark — replace
// once the brand identity work locks a real mark.
//
//   node scripts/make-admin-icons.mjs
//
// Outputs public/icons/admin-{192,512}.png and admin-maskable-512.png.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const OUT = 'public/icons'
mkdirSync(OUT, { recursive: true })

const BG = '#143E38'        // admin shell teal
const MARK = '#DED6C3'      // oatmeal
const DOT = '#FF2A2A'       // laser red
const V = 'M156 150 L226 150 L256 330 L286 150 L356 150 L296 400 L216 400 Z'

function svg({ inset = 0, bleed = true } = {}) {
  const s = 512
  const scale = 1 - inset
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <rect width="${s}" height="${s}" rx="${bleed ? 0 : 96}" fill="${BG}"/>
    <g transform="translate(${s / 2},${s / 2}) scale(${scale}) translate(${-s / 2},${-s / 2})">
      <path d="${V}" fill="${MARK}"/>
      <circle cx="356" cy="150" r="24" fill="${DOT}"/>
    </g>
  </svg>`
}

const any = Buffer.from(svg())
const mask = Buffer.from(svg({ inset: 0.2 })) // maskable safe-zone padding

await sharp(any).resize(512, 512).png().toFile(`${OUT}/admin-512.png`)
await sharp(any).resize(192, 192).png().toFile(`${OUT}/admin-192.png`)
await sharp(mask).resize(512, 512).png().toFile(`${OUT}/admin-maskable-512.png`)
console.log('Wrote admin-192.png, admin-512.png, admin-maskable-512.png to', OUT)
