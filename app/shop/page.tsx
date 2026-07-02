import type { Metadata } from 'next'
import Link from 'next/link'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CategoryCard from '@/components/CategoryCard'
import RotatingTagline from '@/components/RotatingTagline'
import D1ProductGrid from '@/components/shop/D1ProductGrid'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { CATALOG } from '@/lib/pricing'

// D1ProductGrid reads the live catalog at request time → must run on the edge.
export const runtime = 'edge'

// Pack-based categories (coasters, keychains) are business-only — hide from consumer shop.
const CONSUMER_CATEGORIES = SHOP_CATEGORIES.filter(cat => {
  if (cat.pricingType === 'signature') return true
  if (cat.pricingKey && cat.pricingKey in CATALOG) {
    const data = CATALOG[cat.pricingKey]
    return !('materials' in data)
  }
  return true
})

export const metadata: Metadata = {
  alternates: { canonical: '/shop' },
}

export default function ShopHome() {
  return (
    <div>
      {/* Slim brand band: the shop's dusty-coral ribbon, one line, then straight to the goods */}
      <section className="bg-[#B0675D] py-4 sm:py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="sr-only">Custom Laser Engraving: Gifts, Knives, Tumblers &amp; More</h1>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <RotatingTagline
              inline
              accentColor="#DED6C3"
              className="text-xl sm:text-2xl font-semibold tracking-tight text-white"
            />
            <p className="text-sm text-white/85">
              Hand-delivered across {siteInfo.city}.{' '}
              <a href={getSmsLink("Hi, I'd like to get something engraved")} className="text-white font-semibold underline underline-offset-2 hover:no-underline">
                Text {siteInfo.phone}
              </a>
            </p>
          </div>

          {/* Category chips: pick a lane without scrolling */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3.5 -mx-1 px-1">
            {CONSUMER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/30 bg-white/15 text-sm text-white hover:bg-white/25 transition-colors puffy-btn"
              >
                {cat.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The goods, immediately */}
      <D1ProductGrid
        heading="Ready to order"
        subheading="Prices up front. Pick one and check out."
        limit={24}
      />

      {/* Categories (rich cards, for browsers) */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] text-center mb-8">Browse by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONSUMER_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { n: 1, h: 'Text me', p: "Send a photo of what you want engraved. I'll get back to you with a quote." },
              { n: 2, h: 'I engrave it', p: 'One person handles your order start to finish. No outsourcing.' },
              { n: 3, h: 'Hand-delivered', p: 'I bring it to your door across the South Denver metro.' },
            ].map((step) => (
              <div key={step.n}>
                <div className="w-10 h-10 rounded-full bg-[#7FCFD4]/15 border border-[#7FCFD4]/20 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[#7FCFD4] font-bold">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-1">{step.h}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three options */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] text-center mb-8">Three ways to work with me</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { h: 'Bring your own', p: 'Have a knife, tumbler, laptop, or anything else? Bring it. I engrave it and hand it back.' },
              { h: 'I source it', p: 'Tell me what you want. Cutting boards, tumblers, gifts. I find it, engrave it, and deliver it.' },
              { h: 'Shop my stock', p: 'I keep pens, metal cards, tags, keychains, and other basics on hand, ready to engrave right away.' },
            ].map((opt) => (
              <div key={opt.h} className="bg-[var(--surface)] backdrop-blur-xl border border-[var(--hairline)] rounded-sm p-5">
                <h3 className="font-bold text-[var(--ink)] mb-2">{opt.h}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{opt.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-[var(--ink-soft)] text-sm mb-2">Metal, wood, glass, leather, acrylic, plastic, stone. If it&apos;s solid, I can mark it.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                'Knives', 'Tumblers', 'Water Bottles', 'Cutting Boards', 'Laptops',
                'Coasters', 'Keychains', 'Flasks', 'Wine Glasses', 'Pet Bowls',
                'Wallets', 'Pens', 'Awards', 'Signs', 'Bring Your Own',
              ].map((item) => (
                <span key={item} className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--hairline)] rounded-full text-sm text-[var(--ink-soft)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialCarousel testimonials={shopTestimonials} theme="services" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-4">Ready?</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8">
            Text me a photo of what you want engraved. I&apos;ll tell you if I can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C67A6F] text-white font-semibold text-base rounded-sm hover:bg-[#B0675D] transition-colors shadow-lg shadow-black/20"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} at {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
