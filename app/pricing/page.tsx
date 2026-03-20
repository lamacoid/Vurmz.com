import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { PRODUCTS, PRICING_DETAILS } from '@/lib/products'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Pricing | VURMZ Laser Engraving',
  description: `Laser engraving pricing for ${siteInfo.city} and the Denver metro. $50 single-piece engraving. Pre-stocked item packs. No setup fees. Free delivery.`,
}

const pricingCategories = [
  {
    category: PRICING_DETAILS.pens.category,
    packNote: PRICING_DETAILS.pens.packNote,
    packTotal: `$${PRODUCTS.pens.basePackPrice} – $${PRODUCTS.pens.fullyLoadedPackPrice}`,
    items: PRICING_DETAILS.pens.items,
  },
  {
    category: PRICING_DETAILS.businessCards.category,
    packNote: PRICING_DETAILS.businessCards.packNote,
    packTotal: `$${PRODUCTS.businessCards.matteBlackBase * PRODUCTS.businessCards.packSize} – $${PRODUCTS.businessCards.stainlessLoaded * PRODUCTS.businessCards.packSize}`,
    items: PRICING_DETAILS.businessCards.items,
  },
  {
    category: PRICING_DETAILS.coasters.category,
    packNote: PRICING_DETAILS.coasters.packNote,
    packTotal: `$${PRODUCTS.coasters.materials.wood * PRODUCTS.coasters.packSize} – $${PRODUCTS.coasters.materials.steel * PRODUCTS.coasters.packSize}`,
    items: PRICING_DETAILS.coasters.items,
  },
  {
    category: PRICING_DETAILS.keychains.category,
    packNote: PRICING_DETAILS.keychains.packNote,
    packTotal: `$${PRODUCTS.keychains.materials.acrylic * PRODUCTS.keychains.packSize} – $${PRODUCTS.keychains.materials.metal * PRODUCTS.keychains.packSize}`,
    items: PRICING_DETAILS.keychains.items,
  },
  {
    category: PRICING_DETAILS.knives.category,
    packNote: PRICING_DETAILS.knives.packNote,
    packTotal: `$${PRODUCTS.knives.base} – $${PRODUCTS.knives.fullyLoaded}`,
    items: PRICING_DETAILS.knives.items,
  },
  {
    category: PRICING_DETAILS.industrial.category,
    packNote: PRICING_DETAILS.industrial.packNote,
    packTotal: 'Quote',
    items: PRICING_DETAILS.industrial.items,
  },
]

export default function PricingPage() {
  return (
    <div className="bg-vurmz-dark">
      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-tight mb-6">
            Simple pricing.<br />
            <span className="text-gray-500">No surprises.</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Every job is different, so I&apos;ll quote you personally. Here&apos;s the baseline so you know what to expect.
          </p>
        </div>
      </section>

      {/* Custom Engraving */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
                Custom Engraving
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                Bring me your thing.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                A gift, a tool, a one-off piece for your business. Just text me a photo and I&apos;ll quote you. Most single-piece jobs start at $50. Hand-delivered.</p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-vurmz-teal">✓</span> No setup fees
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vurmz-teal">✓</span> No minimums
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vurmz-teal">✓</span> Free delivery in the South Denver metro
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-vurmz-teal">✓</span> I&apos;ll work with you until you&apos;re happy
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 sm:p-8 text-center">
              <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-3">
                Starting at
              </p>
              <p className="text-5xl sm:text-6xl font-bold text-cream mb-2">
                $50
              </p>
              <p className="text-gray-500 text-sm mb-6">
                per piece · custom engraving
              </p>
              <a
                href={getSmsLink("I have something I'd like engraved")}
                className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text me a photo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Stocked Packs */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
            Pre-Stocked Packs
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
            Items I keep on hand.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
            These are items I stock and can turn around fast. Pens, cards, coasters, ready to engrave with your logo or text.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {pricingCategories.map((category) => (
              <div key={category.category} className="bg-white/[0.03] border border-white/[0.08] rounded-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{category.category}</h3>
                    {category.packNote && <p className="text-xs text-gray-500">{category.packNote}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Pack total</p>
                    <p className="text-sm font-semibold text-vurmz-teal">{category.packTotal}</p>
                  </div>
                </div>
                <div className="px-5 py-3">
                  <table className="w-full">
                    <tbody className="divide-y divide-white/[0.04]">
                      {category.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-2">
                            <p className="text-sm text-cream/80">{item.name}</p>
                            {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                          </td>
                          <td className="py-2 text-right whitespace-nowrap">
                            <p className="text-sm font-semibold text-vurmz-teal">
                              {item.price}{!item.price.startsWith('+') && <span className="text-gray-500 font-normal text-xs">/ea</span>}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-6 text-center">
            Prices are estimates. Final pricing depends on quantity, complexity, and materials.
            {' '}<Link href="/portfolio" className="text-vurmz-teal hover:text-cream transition-colors">See examples of finished work</Link>.
          </p>
        </div>
      </section>

      {/* Recurring Orders */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">
            Do you hand out a lot of pens?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            I&apos;ll keep your stock fresh and deliver on a schedule that works for you. You don&apos;t have to think about reordering.
          </p>
          <a
            href={getSmsLink("I'm interested in recurring orders")}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Text me about recurring orders
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">
            Not sure what it&apos;ll cost?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Just text me. I quote fast and I don&apos;t charge for estimates. If it&apos;s not right, we&apos;ll adjust until it is.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              Get a Quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
