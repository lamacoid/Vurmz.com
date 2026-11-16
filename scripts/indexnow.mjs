#!/usr/bin/env node
/**
 * Tell Bing the site changed (IndexNow).
 *
 *   node scripts/indexnow.mjs                 every page in the live sitemap
 *   node scripts/indexnow.mjs /engrave/ /shop/   only these pages
 *   node scripts/indexnow.mjs --dry           show what would be sent
 *
 * Run it after a deploy that changed page content. It reads the key from
 * lib/indexnow.ts, checks the key file is live first (a ping without it is
 * rejected), then submits. The page list comes from the live sitemap, so it
 * is always the real set of pages.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'lib/indexnow.ts'), 'utf8')
const pick = (name) => {
  const m = src.match(new RegExp(`export const ${name} = '([^']+)'`))
  if (!m) throw new Error(`Could not read ${name} from lib/indexnow.ts`)
  return m[1]
}
const KEY = pick('INDEXNOW_KEY')
const HOST = pick('INDEXNOW_HOST')
const ENDPOINT = pick('INDEXNOW_ENDPOINT')
const SITE = `https://${HOST}`
const KEY_URL = `${SITE}/${KEY}.txt`

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const paths = args.filter(a => !a.startsWith('--'))

async function main() {
  // 1. The key file must be live and match, or the ping is rejected.
  const keyRes = await fetch(KEY_URL, { redirect: 'manual' })
  const keyBody = keyRes.status === 200 ? (await keyRes.text()).trim() : ''
  if (keyRes.status !== 200 || keyBody !== KEY) {
    console.error(`Key file check failed: ${KEY_URL} answered ${keyRes.status}${keyBody && keyBody !== KEY ? ' with the wrong contents' : ''}.`)
    console.error('Deploy first, then run this again.')
    process.exit(1)
  }
  console.log(`Key file is live: ${KEY_URL}`)

  // 2. The pages to submit.
  let urls
  if (paths.length) {
    urls = paths.map(p => new URL(p, SITE).toString())
  } else {
    const res = await fetch(`${SITE}/sitemap.xml`)
    if (!res.ok) throw new Error(`Sitemap answered ${res.status}`)
    urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'))
  }
  urls = [...new Set(urls)].filter(u => new URL(u).hostname === HOST)
  if (!urls.length) throw new Error('No pages to submit.')
  console.log(`${urls.length} pages${dry ? ' (dry run, nothing sent)' : ''}:`)
  for (const u of urls) console.log(`  ${u}`)
  if (dry) return

  // 3. Submit.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_URL, urlList: urls }),
  })
  const text = (await res.text()).trim()
  const meaning = {
    200: 'Received.',
    202: 'Received. The key file is still being checked.',
    400: 'Rejected: malformed request.',
    403: 'Rejected: key file not found or does not match.',
    422: 'Rejected: an address does not belong to this site, or the key does not match.',
    429: 'Rejected: too many requests. Try again later.',
  }[res.status] ?? 'Unexpected answer.'
  console.log(`IndexNow answered ${res.status}. ${meaning}${text ? ` ${text}` : ''}`)
  if (res.status !== 200 && res.status !== 202) process.exit(1)
}

main().catch(e => { console.error(e.message); process.exit(1) })
