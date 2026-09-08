import Link from 'next/link'
import Image from 'next/image'
import { listCategories, listProducts, soldUnitsFor, lowestVariantPrices } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { menuPrice, menuCase } from '@/lib/menu-format'
import { saleFrom, saleWindowOpen, liveSale, saleEndsLabel, type SaleInfo } from '@/lib/sale'
import type { Product } from '@/lib/db/repos/products'

// The Engraver's Menu: the shop laid out as a typeset menu instead of a
// photo grid. The brand book's own voice rule ("concise like a nice
// restaurant menu") made literal. Categories are menu sections with
// hairline rules, each item is one line (name, dotted leader, price) with
// a quiet one-liner under it. Reads fine with zero photography; when a
// product has a photo it joins the line as a small thumbnail. The one
// loud accent: hovering a line engraves a thin rule under the name, in the
// signature teal. Zach, 2026-08-06: "i want a teal laser." A fiber laser's
// aiming beam is not red anyway, and this is the one place on the site the
// neon swamp teal gets to be the brightest thing on screen.

function metaLine(p: Product, sale?: SaleInfo): string {
  const parts: string[] = []
  if (p.shortDescription) parts.push(menuCase(p.shortDescription))
  if (p.packSize > 1) parts.push(`pack of ${p.packSize}`)
  if (!p.oneOff && p.madeToOrder && p.leadTimeDays > 0) parts.push(`made to order, ${p.leadTimeDays} day${p.leadTimeDays === 1 ? '' : 's'}`)
  if (sale) parts.push(`launch price through ${saleEndsLabel(sale)}`)
  return parts.join(', ')
}

/**
 * A menu line. It reads as typeset text first and gains a photo second.
 *
 * `thumb` is only passed when the whole SECTION is photographed (see
 * MenuShop): a column where most squares are empty looks broken, and a
 * half-shot catalog is worse to look at than an honestly typeset one. So a
 * section turns its photos on together, and until then it stays as it was.
 */
export function MenuRow({
  p, sale, lowCents, thumb,
}: {
  p: Product
  sale?: SaleInfo
  lowCents?: number
  thumb?: { url: string; alt: string } | null
}) {
  return (
    <Link href={`/shop/p/${p.slug}`} className="group flex items-start gap-3.5 py-2.5 -mx-2 px-2 rounded-sm transition-colors hover:bg-[var(--ink)]/[0.04]">
      {thumb !== undefined && (
        <span className="relative mt-0.5 h-12 w-12 flex-shrink-0 overflow-hidden rounded-[var(--r-control)] border border-[var(--hairline)] bg-[var(--page)]">
          {thumb ? (
            <Image src={thumb.url} alt={thumb.alt} fill sizes="48px" className="object-cover" />
          ) : (
            // Photographed section, one straggler. A quiet tile keeps the
            // column aligned instead of punching a hole in it.
            <span className="absolute inset-0 bg-[var(--glass-soft)]" aria-hidden />
          )}
        </span>
      )}
      <span className="min-w-0 flex-1">
      <span className="flex items-baseline gap-2.5">
        <span className="relative font-semibold text-[var(--ink)] leading-snug underline decoration-dotted decoration-[var(--ink)]/30 underline-offset-4 group-hover:decoration-transparent transition-colors">
          {p.name}
          {/* The laser: a thin teal beam engraves under the name on hover. */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full bg-[var(--signal)] shadow-[0_0_6px_rgba(127,207,212,0.9)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
        </span>
        {/* Honest scarcity, visible: only one exists. */}
        {p.oneOff && (
          <span className="self-center flex-shrink-0 text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--eyebrow)] border border-[var(--eyebrow)]/40 rounded-sm px-1.5 py-px whitespace-nowrap">
            1 of 1
          </span>
        )}
        <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[var(--ink)]/25 min-w-[1.5rem]" aria-hidden />
        <span className="font-semibold text-[var(--eyebrow)] whitespace-nowrap">
          {/* Strikethrough only when the regular price is a real former price. */}
          {sale?.compareAt && <s className="font-normal text-[var(--ink-soft)]/70 mr-1.5">{menuPrice(p.priceCents)}</s>}
          {sale
            ? menuPrice(sale.priceCents)
            : lowCents !== undefined && lowCents < p.priceCents
              ? `from ${menuPrice(lowCents)}`
              : menuPrice(p.priceCents)}
        </span>
      </span>
      {metaLine(p, sale) && (
        <span className="block text-sm text-[var(--ink-soft)] leading-snug mt-0.5">
          {metaLine(p, sale)}
        </span>
      )}
      </span>
    </Link>
  )
}

export default async function MenuShop() {
  const [categories, products, lows] = await Promise.all([
    listCategories(),
    // No audience filter: this is the page of everything. The gift side and
    // the business packs share one menu, grouped by category, so there is a
    // single place a product has to be listed and a single place to keep
    // current. /services points here instead of holding its own copy.
    listProducts({ limit: 200, includeUnpublished: false }),
    lowestVariantPrices(),
  ])
  if (products.length === 0) return null

  // Hero photos, resolved once for every line on the menu.
  const media = await getMediaByIds(
    products.map(p => p.heroMediaId).filter((id): id is string => Boolean(id))
  )
  const thumbFor = (p: Product) => {
    const m = p.heroMediaId ? media.get(p.heroMediaId) : null
    return m?.url ? { url: m.url, alt: m.altText || p.name } : null
  }

  // The house offer gets its own box above the sections.
  const house = products.find(p => p.slug === 'engrave-your-item') ?? null
  const rest = products.filter(p => p.id !== house?.id)

  // Live sales, resolved once for the whole menu. Capped sales count real
  // orders, so a sold-out launch line quietly reverts to its regular price.
  const sales = new Map<string, SaleInfo>()
  for (const p of products) {
    const def = saleFrom(p.metadata)
    if (!def || !saleWindowOpen(def)) continue
    const sold = def.capUnits !== undefined ? await soldUnitsFor(p.id) : 0
    const live = liveSale(p.metadata, sold)
    if (live) sales.set(p.id, live)
  }
  const launchSpecials = rest.filter(p => sales.has(p.id))

  const byCat = new Map<string, Product[]>()
  for (const p of rest) {
    const key = p.categoryId ?? '_other'
    const list = byCat.get(key) ?? []
    list.push(p)
    byCat.set(key, list)
  }
  // A section earns its photo column when most of it has been shot. Until
  // then it stays typeset, which is the honest look for a catalog that has
  // not been photographed yet, and it turns on category by category as Zach
  // works through them rather than all at once.
  const shot = (items: Product[]) =>
    items.filter(p => thumbFor(p)).length >= Math.ceil(items.length / 2)

  const sections = [
    ...categories.filter(c => byCat.has(c.id)).map(c => {
      const items = byCat.get(c.id)!
      return { slug: c.slug, name: c.name, items, photos: shot(items) }
    }),
    ...(byCat.has('_other')
      ? [{ slug: 'everything-else', name: 'Everything Else', items: byCat.get('_other')!, photos: shot(byCat.get('_other')!) }]
      : []),
  ]

  return (
    <div>
      {/* Section nav: quiet anchor chips, stick under the header while browsing. */}
      <nav className="sticky top-0 z-30 bg-[var(--page)]/90 backdrop-blur border-y border-[var(--hairline)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1.5 overflow-x-auto no-scrollbar py-2.5 [mask-image:linear-gradient(to_right,#000_94%,transparent)]">
          {sections.map(s => (
            <a
              key={s.slug}
              href={`#menu-${s.slug}`}
              className="whitespace-nowrap text-xs sm:text-sm font-mono tracking-wide text-[var(--ink-soft)] hover:text-[var(--ink)] px-3 py-1.5 rounded-full border border-transparent hover:border-[var(--hairline)] transition-colors"
            >
              {s.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The menu card: a cream panel on the paper page, like the physical
            object on the table. Everything below lives on it. */}
        <div className="mt-6 mb-4 bg-[var(--surface)] border border-[var(--hairline)] rounded-sm px-5 sm:px-10 pb-2 shadow-sm">
        {/* The house offer, boxed like a menu's standing special. */}
        {house && (
          <div className="mt-8 border border-[var(--ink)]/30 rounded-sm p-1">
            <div className="border border-[var(--ink)]/15 rounded-sm px-5 py-6 text-center bg-[var(--eyebrow)]/[0.06]">
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-2">The house offer</p>
              <Link href={`/shop/p/${house.slug}`} className="group inline-block">
                <span
                  className="relative text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  Bring your thing. {menuPrice(house.priceCents)} flat.
                  <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-[var(--signal)] shadow-[0_0_6px_rgba(127,207,212,0.9)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none" />
                </span>
              </Link>
              <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-md mx-auto">
                {menuCase(house.shortDescription || 'your thing, engraved, flat within size, a little more for big or complicated')}
              </p>
              <Link
                href={`/shop/p/${house.slug}`}
                className="inline-flex items-center justify-center mt-4 px-6 h-9 border border-[var(--eyebrow)]/50 text-[var(--eyebrow)] text-sm font-semibold hover:bg-[var(--eyebrow)]/10 transition-colors puffy-btn"
              >
                Start yours
              </Link>
            </div>
          </div>
        )}

        {/* Launch specials: time-boxed and capped, stated plainly on every
            line. The box disappears by itself when the window closes. */}
        {launchSpecials.length > 0 && (
          <div className="mt-4 border border-[var(--eyebrow)]/50 rounded-sm p-1">
            <div className="border border-[var(--eyebrow)]/25 rounded-sm px-5 py-5 bg-[var(--eyebrow)]/[0.04]">
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] text-center mb-1.5">Launch specials</p>
              <p
                className="text-center text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                Early bird gets the VURMZ.
              </p>
              <div className="mt-4 divide-y divide-[var(--hairline)] max-w-lg mx-auto">
                {launchSpecials.map(p => {
                  const sale = sales.get(p.id)!
                  return (
                    <Link key={p.id} href={`/shop/p/${p.slug}`} className="group block py-2.5">
                      <span className="flex items-baseline gap-2.5">
                        <span className="relative font-semibold text-[var(--ink)] leading-snug">
                          {p.name}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-full bg-[var(--signal)] shadow-[0_0_6px_rgba(127,207,212,0.9)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
                          />
                        </span>
                        <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[var(--ink)]/25 min-w-[1.5rem]" aria-hidden />
                        <span className="font-semibold text-[var(--eyebrow)] whitespace-nowrap">
                          {sale.compareAt && <s className="font-normal text-[var(--ink-soft)]/70 mr-1.5">{menuPrice(p.priceCents)}</s>}
                          {menuPrice(sale.priceCents)}
                        </span>
                      </span>
                      <span className="block text-xs text-[var(--ink-soft)] mt-0.5">
                        Through {saleEndsLabel(sale)}{sale.capLabel ? `, ${sale.capLabel}` : ''}.
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* The menu proper: sections flow into two columns like a bifold. */}
        <div className="mt-10 columns-1 md:columns-2 gap-12">
          {sections.map(s => (
            <section key={s.slug} id={`menu-${s.slug}`} className="break-inside-avoid mb-10 scroll-mt-20">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
                <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">{s.name}</h2>
                <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
              </div>
              <div className="divide-y divide-[var(--hairline)]">
                {s.items.map(p => (
                  <MenuRow key={p.id} p={p} sale={sales.get(p.id)} lowCents={lows[p.id]} thumb={s.photos ? thumbFor(p) : undefined} />
                ))}
              </div>
            </section>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
