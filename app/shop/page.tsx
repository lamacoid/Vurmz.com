import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { lowestVariantPrices, type Product } from '@/lib/db/repos/products'
import { listItems, RUN_SIZE } from '@/lib/items'
import { menuPrice, menuCase } from '@/lib/menu-format'
import { SIGNATURE } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

// The list reads the live catalog at request time, so this runs on the edge.
export const runtime = 'edge'

export const metadata: Metadata = pageMeta({
  title: 'Engraved Coasters, Pens, Cards and Tags | VURMZ, Centennial',
  description: 'Coasters, pens, metal cards, tags, and keychains kept in stock to engrave. Posted prices with engraving included. Hand-delivered across the south Denver metro.',
  path: '/shop',
})

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

/**
 * Items, streamlined 2026-11-11. One short list instead of a store: the
 * blanks that business orders and small gifts actually use. Everything else
 * is "bring your own thing" on /engrave or a quoted lane on /services.
 * Which products show is decided by category here, never by hiding rows in
 * the database, so widening or narrowing the list is a one-line change.
 */
// The rule itself lives in lib/items.ts, shared with the product pages and the sitemap.

async function loadItems(): Promise<{ products: Product[]; lowest: Record<string, number> }> {
  try {
    const [products, lowest] = await Promise.all([listItems(), lowestVariantPrices()])
    return { products, lowest }
  } catch {
    // The list never takes the page down. An empty list falls back to the text line.
    return { products: [], lowest: {} }
  }
}

function Row({ p, lowest }: { p: Product; lowest: Record<string, number> }) {
  const low = lowest[p.id]
  const from = low !== undefined && low < p.priceCents
  return (
    <li>
      <Link href={`/shop/p/${p.slug}`} className="group flex flex-col gap-0.5 py-4 border-b border-[var(--hairline)]">
        <span className="flex items-baseline gap-3">
          <span className="text-[16px] font-semibold text-[var(--ink)] group-hover:text-[var(--feature)] transition-colors">{p.name}</span>
          <span className="flex-1 -translate-y-[4px] border-b border-dotted border-[var(--ink)]/25 min-w-[1.5rem]" aria-hidden />
          <span className="text-[16px] font-semibold text-[var(--eyebrow)] whitespace-nowrap tabular-nums">
            {from ? `from ${menuPrice(low)}` : menuPrice(p.priceCents)}
          </span>
        </span>
        {p.shortDescription && (
          <span className="text-[13.5px] leading-snug text-[var(--ink-soft)]">{menuCase(p.shortDescription)}</span>
        )}
      </Link>
    </li>
  )
}

function Group({ title, note, items, lowest }: { title: string; note: string; items: Product[]; lowest: Record<string, number> }) {
  if (items.length === 0) return null
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-2 border-b-2 border-[var(--ink)]/25">
        <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>{title}</h2>
        <p className="text-[13px] text-[var(--ink-soft)]">{note}</p>
      </div>
      <ul className="list-none p-0 m-0">
        {items.map(p => <Row key={p.id} p={p} lowest={lowest} />)}
      </ul>
    </section>
  )
}

export default async function ItemsPage() {
  const { products, lowest } = await loadItems()
  const byPrice = (a: Product, b: Product) => a.priceCents - b.priceCents
  const singles = products.filter(p => p.packSize < RUN_SIZE).sort(byPrice)
  const runs = products.filter(p => p.packSize >= RUN_SIZE).sort(byPrice)

  // The list as data, in the order the page shows it.
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Items to engrave',
    itemListElement: [...singles, ...runs].map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${siteInfo.url}/shop/p/${p.slug}/`,
    })),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      {products.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      )}
      <header className="max-w-[58ch]">
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
          <span className="block text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">Coasters, pens, metal cards, and tags</span>
          What I keep to engrave.
        </h1>
        <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          Pick one, tell me what goes on it, and attach a logo if you have one. The engraving is in the price.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="mt-10 text-[15px] leading-relaxed text-[var(--ink-soft)]">
          The list is not loading right now. Text {siteInfo.founder.name} at{' '}
          <a href={getSmsLink('Hi Zach, what do you have in stock to engrave?')} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{siteInfo.phone}</a>{' '}
          and I will tell you what is on the shelf.
        </p>
      ) : (
        <>
          <Group
            title="Singles and sets"
            note={singles.every(p => !p.madeToOrder) ? 'In stock. At your door in a day or two.' : 'Engraving included.'}
            items={singles}
            lowest={lowest}
          />
          <Group title="By the pack" note="One logo across the run." items={runs} lowest={lowest} />
        </>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link href="/engrave" className="group rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--feature)]/40 p-5 transition-colors">
          <p className="text-[length:var(--step-body)] text-[var(--ink)]" style={display}>Already own the thing?</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Knife, tool, tumbler, laptop. Send a photo and get a price. Most pieces are ${SIGNATURE.startingAt}.
          </p>
          <span className="mt-3 inline-block text-[14px] font-semibold text-[#B0675D]">Engrave your stuff</span>
        </Link>
        <Link href="/services" className="group rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--feature)]/40 p-5 transition-colors">
          <p className="text-[length:var(--step-body)] text-[var(--ink)]" style={display}>Ordering for a business?</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Labels, knife crews, plates, and volume pricing are posted on the business page.
          </p>
          <span className="mt-3 inline-block text-[14px] font-semibold text-[#B0675D]">Business pricing</span>
        </Link>
      </div>

      <p className="mt-10 text-[14px] text-[var(--ink-soft)]">
        Not on the list? Text {siteInfo.founder.name} at{' '}
        <a href={getSmsLink('Hi Zach, do you have ')} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{siteInfo.phone}</a>.
      </p>
    </div>
  )
}
