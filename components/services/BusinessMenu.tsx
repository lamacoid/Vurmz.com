import Link from 'next/link'
import { listProducts, soldUnitsFor, lowestVariantPrices } from '@/lib/db/repos/products'
import { saleFrom, saleWindowOpen, liveSale, type SaleInfo } from '@/lib/sale'
import { MenuRow } from '@/components/shop/MenuShop'

/**
 * The business menu: the services side is still a shop. Everything with
 * a services audience is buyable right here, same menu card as /shop,
 * same product pages (Builder, proofs, checkout) behind each line.
 */
export default async function BusinessMenu() {
  const [products, lows] = await Promise.all([
    listProducts({ limit: 100, includeUnpublished: false, audience: 'services_visible' }),
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
    <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm shadow-sm px-5 sm:px-8 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-1">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] relief-etched">Order now</h2>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>
      <p className="text-sm text-[var(--ink-soft)] text-center mb-4">
        Posted prices, designed on the page, delivered by hand. Volume pricing kicks in at 50 units.
      </p>
      <div className="sm:columns-2 sm:gap-10">
        {products.map(p => (
          <div key={p.id} className="break-inside-avoid">
            <MenuRow p={p} sale={sales.get(p.id)} lowCents={lows[p.id]} />
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--ink-soft)] text-center mt-4">
        Need a size or material that is not here?{' '}
        <Link href="/services/contact" className="underline decoration-dotted underline-offset-2 hover:text-[var(--ink)]">Tell me what you are picturing</Link> and I will quote it.
      </p>
    </div>
  )
}
