/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { listCategories, listProducts } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { money } from '@/lib/format'
import type { Product } from '@/lib/db/repos/products'

// The Engraver's Menu: the shop laid out as a typeset menu instead of a
// photo grid. The brand book's own voice rule ("concise like a nice
// restaurant menu") made literal. Categories are menu sections with
// hairline rules, each item is one line (name, dotted leader, price) with
// a quiet one-liner under it. Reads fine with zero photography; when a
// product has a photo it joins the line as a small thumbnail. The one
// loud accent: hovering a line engraves a thin laser-red rule under the
// name.

// Menus say $38, not $38.00. Cents only appear when they're real.
function menuPrice(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : money(cents)
}

function metaLine(p: Product): string {
  const parts: string[] = []
  if (p.shortDescription) parts.push(p.shortDescription)
  if (p.packSize > 1) parts.push(`pack of ${p.packSize}`)
  if (p.oneOff) parts.push('one of one')
  else if (p.madeToOrder && p.leadTimeDays > 0) parts.push(`made to order, ${p.leadTimeDays} day${p.leadTimeDays === 1 ? '' : 's'}`)
  return parts.join(' · ')
}

function MenuRow({ p, thumb }: { p: Product; thumb: string | null }) {
  return (
    <Link href={`/shop/p/${p.slug}`} className="group block py-2.5 -mx-2 px-2 rounded-sm transition-colors hover:bg-[var(--ink)]/[0.04]">
      <span className="flex items-baseline gap-2.5">
        {thumb && (
          <img src={thumb} alt="" className="h-10 w-10 self-center flex-shrink-0 rounded-sm object-cover border border-[var(--hairline)]" />
        )}
        <span className="relative font-semibold text-[var(--ink)] leading-snug underline decoration-dotted decoration-[var(--ink)]/30 underline-offset-4 group-hover:decoration-transparent transition-colors">
          {p.name}
          {/* The laser: a thin red rule engraves under the name on hover. */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full bg-[#FF2A2A] shadow-[0_0_5px_rgba(255,42,42,0.8)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
        </span>
        <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[var(--ink)]/25 min-w-[1.5rem]" aria-hidden />
        <span className="font-semibold text-[var(--eyebrow)] whitespace-nowrap">{menuPrice(p.priceCents)}</span>
      </span>
      {metaLine(p) && (
        <span className={`block text-sm text-[var(--ink-soft)] leading-snug mt-0.5 ${thumb ? 'pl-[3.125rem]' : ''}`}>
          {metaLine(p)}
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

  const heroIds = products.map(p => p.heroMediaId).filter(Boolean) as string[]
  const mediaById = await getMediaByIds(heroIds)
  const thumbFor = (p: Product) => (p.heroMediaId ? mediaById.get(p.heroMediaId)?.url ?? null : null)

  // The house offer gets its own box above the sections.
  const house = products.find(p => p.slug === 'engrave-your-item') ?? null
  const rest = products.filter(p => p.id !== house?.id)

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
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-2">The standing offer</p>
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
                {house.shortDescription || 'Your thing, engraved. Flat within size, a little more for big or complicated.'}
              </p>
              <Link href={`/shop/p/${house.slug}`} className="inline-block mt-3 text-sm font-semibold text-[var(--eyebrow)] hover:underline">
                Start yours
              </Link>
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
                  <MenuRow key={p.id} p={p} thumb={thumbFor(p)} />
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
