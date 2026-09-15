import Link from 'next/link'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { listProducts } from '@/lib/db/repos/products'
import GlassImage from '@/components/shop/GlassImage'

/**
 * The gifts, as tiles. One tile per shop category that actually has
 * something published in it, with the lowest posted price in that
 * category read live from the catalog. Photos where a category has one,
 * the name set in the display face where it does not.
 */
const ORDER = ['gifts', 'coasters', 'decor', 'keychains', 'pens', 'metal-cards']

export default async function GiftTiles() {
  const products = await listProducts({ audience: 'shop_visible', limit: 200 }).catch(() => [])
  const lowest = new Map<string, number>()
  for (const p of products) {
    if (!p.categoryId) continue
    const cur = lowest.get(p.categoryId)
    if (cur === undefined || p.priceCents < cur) lowest.set(p.categoryId, p.priceCents)
  }
  const tiles = ORDER
    .map(slug => SHOP_CATEGORIES.find(c => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map(c => ({ cat: c, low: lowest.get(`cat_${c.slug.replace(/-/g, '_')}`) }))
    .filter(t => t.low !== undefined)

  if (tiles.length === 0) return null
  const display = { fontFamily: 'var(--font-display), Georgia, serif' }

  return (
    <section className="pb-10 sm:pb-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tiles.map(({ cat, low }) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group block bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-tile)] overflow-hidden hover:border-[var(--coral)]/40 transition-colors duration-[var(--t-hover)]"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                {cat.heroImage ? (
                  <GlassImage src={cat.heroImage} alt={cat.name} depth="card" sizes="(max-width: 640px) 50vw, 33vw" className="absolute inset-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--glass)] px-4 text-center">
                    <span className="text-[var(--ink)] text-[length:var(--step-panel)] leading-tight" style={display}>{cat.name}</span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 flex items-baseline justify-between gap-3">
                {/* A photo-less tile already carries its name in the display face. */}
                <h3 className={`text-[length:var(--step-body)] font-semibold text-[var(--ink)] leading-snug ${cat.heroImage ? '' : 'sr-only'}`}>{cat.name}</h3>
                <span className="text-[length:var(--step-fine)] text-[var(--ink-soft)] tabular-nums whitespace-nowrap">from ${Math.round((low as number) / 100)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
