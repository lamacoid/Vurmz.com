import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { SIGNATURE, BASIC_PRICING_CARDS, LEAVE_YOUR_MARK_CARDS } from '@/lib/products'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Pricing | VURMZ Laser Engraving',
  description: `Laser engraving pricing for ${siteInfo.city} and the Denver metro. Two tiers: Basic stock items and Signature custom work starting at $${SIGNATURE.startingPrice}. No setup fees. Free delivery.`,
}

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
            Two tiers.<br />
            <span className="text-gray-500">One standard.</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Everything I do falls into one of two categories. Basic covers stock items and straightforward marking. Signature is custom work on your item — the stuff that ends up in my portfolio.
          </p>
        </div>
      </section>

      {/* ═══ SIGNATURE ═══ */}
      <section className="py-12 sm:py-16 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vurmz-cta/10 border border-vurmz-cta/20 mb-4">
                <span className="text-xs font-semibold text-vurmz-cta tracking-wide uppercase">Signature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                Bring me your thing.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                A gift, a tool, a one-of-a-kind piece for your business. This is custom work — I engrave your item, your way. Text me a photo and I&apos;ll quote you.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm">
                {SIGNATURE.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-vurmz-cta">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 sm:p-8 text-center">
              <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-3">
                Starting at
              </p>
              <p className="text-5xl sm:text-6xl font-bold text-cream mb-2">
                ${SIGNATURE.startingPrice}
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

          {/* Concierge */}
          <div className="mt-8 bg-white/[0.03] border border-white/[0.08] rounded-sm p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-cream mb-2">Don&apos;t have the item yet?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              I offer concierge sourcing. Tell me what you want — I&apos;ll find it, buy it, engrave it, and deliver it. You don&apos;t have to lift a finger. $25 flat finders fee + cost of item.
            </p>
            <a
              href={getSmsLink("I need help sourcing an item")}
              className="inline-flex items-center gap-1.5 text-xs text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group mt-3"
            >
              <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
              Tell me what you need
            </a>
          </div>
        </div>
      </section>

      {/* ═══ BASIC ═══ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vurmz-teal/10 border border-vurmz-teal/20 mb-4">
            <span className="text-xs font-semibold text-vurmz-teal tracking-wide uppercase">Basic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
            Stock items &amp; marking.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
            Items I keep on hand, ready to engrave with your logo or text. Plus knife and tool marking — bring yours, I&apos;ll mark them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BASIC_PRICING_CARDS.map((card) => (
              <div key={card.category} className="bg-white/[0.03] border border-white/[0.08] rounded-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{card.category}</h3>
                    <p className="text-xs text-gray-500">{card.packNote}</p>
                  </div>
                  {card.packTotal && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-vurmz-teal">{card.packTotal}</p>
                      <p className="text-[10px] text-gray-500">pack total</p>
                    </div>
                  )}
                </div>
                <div className="px-5 py-3">
                  <table className="w-full">
                    <tbody className="divide-y divide-white/[0.04]">
                      {card.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-2">
                            <p className="text-sm text-cream/80">{item.name}</p>
                            {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                          </td>
                          <td className="py-2 text-right whitespace-nowrap">
                            <p className="text-sm font-semibold text-vurmz-teal">{item.price}</p>
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
            {' '}<Link href="/portfolio" className="text-vurmz-teal hover:text-cream transition-colors">See examples</Link>.
          </p>
        </div>
      </section>

      {/* ═══ LEAVE YOUR MARK ═══ */}
      <section className="py-12 sm:py-16 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] mb-4">
            <span className="text-xs font-semibold text-cream tracking-wide uppercase">Leave Your Mark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
            For the trades.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
            Metal service tags, installer signature tiles. The kind of thing that outlasts a sticker by about 20 years. HVAC, plumbing, electrical, masonry, flooring — if you do the work, people should know who did it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEAVE_YOUR_MARK_CARDS.map((card) => (
              <div key={card.category} className="bg-white/[0.03] border border-white/[0.08] rounded-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{card.category}</h3>
                    <p className="text-xs text-gray-500">{card.packNote}</p>
                  </div>
                  {card.packTotal && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-vurmz-teal">{card.packTotal}</p>
                      <p className="text-[10px] text-gray-500">pack total</p>
                    </div>
                  )}
                </div>
                <div className="px-5 py-3">
                  <table className="w-full">
                    <tbody className="divide-y divide-white/[0.04]">
                      {card.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-2">
                            <p className="text-sm text-cream/80">{item.name}</p>
                            {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                          </td>
                          <td className="py-2 text-right whitespace-nowrap">
                            <p className="text-sm font-semibold text-vurmz-teal">{item.price}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href={getSmsLink("I'm interested in service tags or signature tiles")}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text me about Leave Your Mark
            </a>
          </div>
        </div>
      </section>

      {/* Recurring Orders */}
      <section className="py-12 sm:py-16 bg-white/[0.02]">
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
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">
            Not sure what it&apos;ll cost?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Just text me. I quote fast and I don&apos;t charge for estimates.
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
