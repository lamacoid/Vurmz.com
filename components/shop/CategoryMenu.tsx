import { listProducts, soldUnitsFor, lowestVariantPrices } from '@/lib/db/repos/products'
import { saleFrom, saleWindowOpen, liveSale, type SaleInfo } from '@/lib/sale'
import { MenuRow } from '@/components/shop/MenuShop'

/**
 * A category's slice of the Engraver's Menu: the same card and rows as
 * /shop, filtered to one category. Replaced the old photo-grid so the
 * menu concept holds everywhere products are listed.
 */
export default async function CategoryMenu({ categoryId, heading, sub }: {
  categoryId: string
  heading: string
  sub?: string
}) {
  const [products, lows] = await Promise.all([
    listProducts({ categoryId, limit: 100, includeUnpublished: false, audience: 'shop_visible' }),
    lowestVariantPrices(),
  ])
  if (products.length === 0) return null

  const sales = new Map<string, SaleInfo>()
  for (const p of products) {
    const def = saleFrom(p.metadata)
    if (!def) continue
    const sold = def.capUnits !== undefined && saleWindowOpen(def) ? await soldUnitsFor(p.id) : 0
    const live = liveSale(p.metadata, sold)
    if (live) sales.set(p.id, live)
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm shadow-sm px-5 sm:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
            <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] relief-etched">{heading}</h2>
            <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
          </div>
          {sub && <p className="text-sm text-[var(--ink-soft)] text-center mb-4">{sub}</p>}
          <div className="sm:columns-2 sm:gap-10">
            {products.map(p => (
              <div key={p.id} className="break-inside-avoid">
                <MenuRow p={p} sale={sales.get(p.id)} lowCents={lows[p.id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
