import { portfolioItems } from '@/lib/portfolio'
import { listItems } from '@/lib/items'
import { SITE_URL, CONTENT_UPDATED } from '@/lib/seo'

export const runtime = 'edge'

/**
 * /sitemap.xml, built per request (2026-11-15).
 *
 * It replaced the static app/sitemap.ts for three reasons. The product
 * pages live in the database, so a build-time sitemap could never list
 * them. Every entry carried "modified right now", which tells a crawler
 * nothing. And the addresses had no trailing slash, so every one of them
 * answered with a redirect to the real page.
 *
 * Priority: the homepage 1.0, the Items list and its product pages 0.9,
 * everything else 0.7. If the catalog cannot be read the sitemap still
 * returns every other page; it never fails.
 */
const CITIES = [
  'centennial', 'littleton', 'lone-tree', 'parker', 'highlands-ranch', 'englewood',
  'castle-rock', 'aurora', 'greenwood-village', 'cherry-hills', 'denver',
]

// Every public page that is not a product, a city, or a portfolio piece.
const PAGES = [
  '/engrave/',
  '/services/',
  '/services/metal-business-cards/',
  '/services/knife-engraving/',
  '/services/metal-tags/',
  '/services/live-engraving/',
  '/services/materials/',
  '/services/portfolio/',
  '/services/contact/',
  '/about/',
  '/delivery/',
  '/privacy/',
  '/terms/',
]

interface Entry { path: string; lastmod: string; priority: string; changefreq: string }

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/** YYYY-MM-DD from a stored timestamp, or the site date when it is missing or unreadable. */
function day(iso: string | null | undefined): string {
  const m = typeof iso === 'string' ? iso.match(/^\d{4}-\d{2}-\d{2}/) : null
  return m ? m[0] : CONTENT_UPDATED
}

export async function GET() {
  const entries: Entry[] = [
    { path: '/', lastmod: CONTENT_UPDATED, priority: '1.0', changefreq: 'weekly' },
    { path: '/shop/', lastmod: CONTENT_UPDATED, priority: '0.9', changefreq: 'weekly' },
  ]

  try {
    for (const p of await listItems()) {
      entries.push({ path: `/shop/p/${p.slug}/`, lastmod: day(p.updatedAt), priority: '0.9', changefreq: 'weekly' })
    }
  } catch {
    // The catalog is unreachable. Product pages are skipped this time.
  }

  for (const path of PAGES) entries.push({ path, lastmod: CONTENT_UPDATED, priority: '0.7', changefreq: 'monthly' })
  for (const c of CITIES) entries.push({ path: `/services/laser-engraving/${c}/`, lastmod: CONTENT_UPDATED, priority: '0.7', changefreq: 'monthly' })
  for (const item of portfolioItems) entries.push({ path: `/services/portfolio/${item.slug}/`, lastmod: CONTENT_UPDATED, priority: '0.7', changefreq: 'monthly' })

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.map(e =>
      `  <url><loc>${xmlEscape(SITE_URL + e.path)}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
    ).join('\n') +
    '\n</urlset>\n'

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
