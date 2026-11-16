// SEO audit. Renders every customer page and reports what a crawler sees:
// title and description length, canonical, share tags, H1 count, images
// with no alt. Run: node scripts/seo-audit.mjs https://www.vurmz.com
// (or http://localhost:3000 with the dev server up). Zero issues is the bar.
import { readFileSync } from 'node:fs'
const base = process.argv[2] || 'http://localhost:3000'
const repo = new URL('..', import.meta.url).pathname.replace(/\/$/, '').replace(/%20/g, ' ')
const slugs = [...readFileSync(`${repo}/lib/portfolio.ts`, 'utf8').matchAll(/slug: '([^']+)'/g)].map(m => m[1])
const cities = ['centennial','littleton','lone-tree','parker','highlands-ranch','englewood','castle-rock','aurora','greenwood-village','cherry-hills','denver']
const get = async p => { const r = await fetch(base + p, { redirect: 'follow' }); return { status: r.status, html: await r.text() } }
const shop = await get('/shop/')
const products = [...new Set([...shop.html.matchAll(/href="(\/shop\/p\/[^"]+)"/g)].map(m => m[1].replace(/\/?$/, '/')))]
const paths = ['/', '/engrave/', '/shop/', '/services/', '/services/knife-engraving/', '/services/metal-tags/', '/services/materials/', '/services/portfolio/', '/services/contact/', '/services/live-engraving/', '/services/metal-business-cards/', '/about/', '/delivery/', '/privacy/', '/terms/', '/shop/p/engrave-your-item/',
  ...cities.map(c => `/services/laser-engraving/${c}/`), ...slugs.map(s => `/services/portfolio/${s}/`), ...products]
const meta = (h, attr, name) => { const m = h.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, 'i')) || h.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, 'i')); return m ? m[1] : null }
const dec = s => (s || '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
const rows = []
for (const p of [...new Set(paths)]) {
  const { status, html } = await get(p)
  const head = html
  const title = dec((head.match(/<title>([^<]*)<\/title>/) || [])[1])
  const desc = dec(meta(head, 'name', 'description'))
  const canon = (head.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/) || [])[1] || null
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '')
  const h1s = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map(m => m[0])
  const noAlt = imgs.filter(i => !/\balt=/.test(i)).length
  const emptyAlt = imgs.filter(i => /\balt=""/.test(i)).length
  rows.push({ p, status, title, tl: title.length, desc, dl: (desc || '').length, canon, ogt: dec(meta(head, 'property', 'og:title')), ogd: meta(head, 'property', 'og:description') ? 'y' : '-', ogu: meta(head, 'property', 'og:url'), ogi: meta(head, 'property', 'og:image'), ogty: meta(head, 'property', 'og:type'), tw: meta(head, 'name', 'twitter:card'), twt: dec(meta(head, 'name', 'twitter:title')), h1n: h1s.length, h1: h1s[0] || '', imgs: imgs.length, noAlt, emptyAlt })
}
const want = p => 'https://www.vurmz.com' + (p === '/' ? '' : p.replace(/\/$/, ''))
if (process.argv[3] === 'json') { console.log(JSON.stringify(rows)); process.exit(0) }
let bad = 0
for (const r of rows) {
  const issues = []
  if (r.status !== 200) issues.push(`status ${r.status}`)
  if (!r.title) issues.push('no title'); else if (r.tl > 60) issues.push(`title ${r.tl}`)
  if (!r.desc) issues.push('no desc'); else if (r.dl > 160) issues.push(`desc ${r.dl}`); else if (r.dl < 70) issues.push(`desc short ${r.dl}`)
  if (!r.canon) issues.push('no canonical'); else if (r.canon.replace(/\/$/, '') !== want(r.p)) issues.push(`canonical ${r.canon}`)
  if (!r.ogu) issues.push('no og:url'); else if (r.ogu.replace(/\/$/, '') !== want(r.p)) issues.push(`og:url ${r.ogu}`)
  if (r.ogt && r.ogt !== r.title) issues.push('og:title differs')
  if (!r.ogi) issues.push('no og:image')
  if (!r.tw) issues.push('no twitter')
  if (r.h1n !== 1) issues.push(`h1 x${r.h1n}`)
  if (r.noAlt) issues.push(`${r.noAlt} img no alt`)
  if (/—/.test(r.title + r.desc)) issues.push('em-dash')
  if (issues.length) bad++
  console.log(`${issues.length ? 'FIX ' : 'ok  '}${r.p.padEnd(52)} ${String(r.tl).padStart(3)}/${String(r.dl).padStart(3)}  ${issues.join('; ')}`)
}
console.log(`\n${rows.length} pages, ${bad} with issues`)
