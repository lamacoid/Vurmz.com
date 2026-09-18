import Link from 'next/link'
import { listProducts } from '@/lib/db/repos/products'
import GlassImage from '@/components/shop/GlassImage'
import { SIGNATURE } from '@/lib/pricing'

/**
 * The four doors (BRAND/01-FOUNDATION, "The position"): your stuff, knives
 * and gear, business marking, the odd project. Not the inventory categories.
 * Each door names what it is for and its honest starting number, read from
 * lib/pricing or the live catalog so a tile can never drift from a price.
 * The fifth door, the reserve, is the frosted one below this grid.
 */
interface Door {
  key: string
  name: string
  line: string
  href: string
  image: string
  /** Static starting price, or null to read the lowest live price in these categories. */
  from: number | null
  categoryIds?: string[]
  packsOnly?: boolean
}

const DOORS: Door[] = [
  {
    key: 'yours',
    name: 'Your stuff',
    line: 'The thing you already own, marked. Knives, laptops, flasks, tools, heirlooms.',
    href: '/shop/bring-your-own',
    image: '/portfolio/macbook-engraving.jpg',
    from: SIGNATURE.startingAt,
  },
  {
    key: 'knives',
    name: 'Knives and gear',
    line: 'Blades, multitools, the pocket and the kitchen. Yours, or one I find for you.',
    href: '/services/knife-engraving',
    image: '/portfolio/culinary-cleaver-engraved.jpg',
    // The shop side of a knife is your own piece; the cheap crew lane lives on services.
    from: SIGNATURE.startingAt,
  },
  {
    key: 'business',
    name: 'Business marking',
    line: 'Tags, plates, pens, cards, coasters. The run that repeats, priced by the pack.',
    href: '/services',
    image: '/portfolio/tumbler-cherry-creek-37.jpg',
    // The floor is a pack, never a single pen: only pack listings count.
    from: null,
    categoryIds: ['cat_pens', 'cat_metal_cards', 'cat_labels_tags', 'cat_coasters'],
    packsOnly: true,
  },
  {
    key: 'odd',
    name: 'The odd project',
    line: 'The faceplate, the mirror, the map, the thing nobody else will take. Send a photo.',
    href: '/services/portfolio',
    image: '/portfolio/eye-storm-hexagonal-mirror.jpg',
    // An odd project is quoted; the house price is the honest floor.
    from: SIGNATURE.startingAt,
  },
]

export default async function GiftTiles() {
  const products = await listProducts({ audience: 'shop_visible', limit: 200 }).catch(() => [])
  const fromFor = (d: Door): number | null => {
    if (d.from != null) return d.from
    const ids = new Set(d.categoryIds ?? [])
    const cents = products
      .filter(p => p.categoryId && ids.has(p.categoryId) && (!d.packsOnly || p.packSize > 1))
      .map(p => p.priceCents)
    return cents.length ? Math.round(Math.min(...cents) / 100) : null
  }
  const display = { fontFamily: 'var(--font-display), Georgia, serif' }

  return (
    <section className="pb-10 sm:pb-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {DOORS.map(d => {
            const from = fromFor(d)
            return (
              <Link
                key={d.key}
                href={d.href}
                className="group block bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-tile)] overflow-hidden hover:border-[var(--coral)]/40 transition-colors duration-[var(--t-hover)]"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <GlassImage src={d.image} alt={d.name} depth="card" sizes="(max-width: 640px) 100vw, 50vw" className="absolute inset-0" />
                </div>
                <div className="px-4 sm:px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[length:var(--step-panel)] text-[var(--ink)] leading-tight" style={display}>{d.name}</h3>
                    {from != null && (
                      <span className="text-[length:var(--step-fine)] text-[var(--ink-soft)] tabular-nums whitespace-nowrap">from ${from}</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[length:var(--step-row)] leading-snug text-[var(--ink-soft)]">{d.line}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
