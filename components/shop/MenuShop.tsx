import Link from 'next/link'
import { listCategories, listProducts, soldUnitsFor } from '@/lib/db/repos/products'
import { menuPrice, menuCase } from '@/lib/menu-format'
import { saleFrom, saleWindowOpen, liveSale, saleEndsLabel, type SaleInfo } from '@/lib/sale'
import type { Product } from '@/lib/db/repos/products'

// The Engraver's Menu: the shop laid out as a typeset menu instead of a
// photo grid. The brand book's own voice rule ("concise like a nice
// restaurant menu") made literal. Categories are menu sections with
// hairline rules, each item is one line (name, dotted leader, price) with
// a quiet one-liner under it. Reads fine with zero photography; when a
// product has a photo it joins the line as a small thumbnail. The one
// loud accent: hovering a line engraves a thin laser-red rule under the
// name.

function metaLine(p: Product, sale?: SaleInfo): string {
  const parts: string[] = []
  if (p.shortDescription) parts.push(menuCase(p.shortDescription))
  if (p.packSize > 1) parts.push(`pack of ${p.packSize}`)
  if (!p.oneOff && p.madeToOrder && p.leadTimeDays > 0) parts.push(`made to order, ${p.leadTimeDays} day${p.leadTimeDays === 1 ? '' : 's'}`)
  if (sale) parts.push(`launch price through ${saleEndsLabel(sale)}`)
  return parts.join(', ')
}

// Deliberately photo-free: the menu stays typeset (Zach's call, and it
// reads like a real menu because of it). Photos live on the product page.
function MenuRow({ p, sale }: { p: Product; sale?: SaleInfo }) {
  return (
    <Link href={`/shop/p/${p.slug}`} className="group block py-2.5 -mx-2 px-2 rounded-sm transition-colors hover:bg-[var(--ink)]/[0.04]">
      <span className="flex items-baseline gap-2.5">
        <span className="relative font-semibold text-[var(--ink)] leading-snug underline decoration-dotted decoration-[var(--ink)]/30 underline-offset-4 group-hover:decoration-transparent transition-colors relief-raised">
          {p.name}
          {/* The laser: a thin red rule engraves under the name on hover. */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full bg-[#FF2A2A] shadow-[0_0_5px_rgba(255,42,42,0.8)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
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
          {menuPrice(sale ? sale.priceCents : p.priceCents)}
        </span>
      </span>
      {metaLine(p, sale) && (
        <span className="block text-sm text-[var(--ink-soft)] leading-snug mt-0.5 relief-etched">
          {metaLine(p, sale)}
        </span>
      )}
    </Link>
  )
}

export default async function MenuShop() {
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ limit: 200, includeUnpublished: false, audience: 'shop_visible' }),
  ])
  if (products.length === 0) return null

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
  const sections = [
    ...categories.filter(c => byCat.has(c.id)).map(c => ({ slug: c.slug, name: c.name, items: byCat.get(c.id)! })),
    ...(byCat.has('_other') ? [{ slug: 'everything-else', name: 'Everything Else', items: byCat.get('_other')! }] : []),
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
                  <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-[#FF2A2A] shadow-[0_0_5px_rgba(255,42,42,0.8)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none" />
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
                            className="absolute -bottom-0.5 left-0 h-px w-full bg-[#FF2A2A] shadow-[0_0_5px_rgba(255,42,42,0.8)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
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
                <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] relief-etched">{s.name}</h2>
                <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
              </div>
              <div className="divide-y divide-[var(--hairline)]">
                {s.items.map(p => (
                  <MenuRow key={p.id} p={p} sale={sales.get(p.id)} />
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
