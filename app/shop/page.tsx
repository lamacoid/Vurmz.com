import type { Metadata } from 'next'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CategoryCard from '@/components/CategoryCard'
import GlassImage from '@/components/shop/GlassImage'
import SiteHero from '@/components/SiteHero'
import D1ProductGrid from '@/components/shop/D1ProductGrid'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { BASIC } from '@/lib/pricing'

// D1ProductGrid reads the live catalog at request time → must run on the edge.
export const runtime = 'edge'

// Pack-based categories (coasters, keychains) are business-only — hide from consumer shop.
const CONSUMER_CATEGORIES = SHOP_CATEGORIES.filter(cat => {
  if (cat.pricingType === 'signature') return true
  if (cat.pricingKey && cat.pricingKey in BASIC) {
    const data = BASIC[cat.pricingKey]
    return !('materials' in data)
  }
  return true
})

const WORK = [
  { src: '/portfolio/culinary-cleaver-engraved.jpg', label: 'Knife Engraving' },
  { src: '/portfolio/water-bottle-full-wrap.jpg', label: 'Full-Wrap Bottle' },
  { src: '/portfolio/eye-storm-hexagonal-mirror.jpg', label: 'Custom Mirror Art' },
  { src: '/portfolio/pocket-knife-engraved.jpg', label: 'Pocket Knife' },
  { src: '/portfolio/denver-map-glass-coaster.jpg', label: 'Glass Coaster' },
  { src: '/portfolio/macbook-engraving.jpg', label: 'MacBook Engraving' },
  { src: '/portfolio/engraved-hand-saw.jpg', label: 'Hand Saw' },
  { src: '/portfolio/water-bottle-custom-engraved.jpg', label: 'Water Bottle' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/shop' },
}

export default function ShopHome() {
  return (
    <div>
      {/* Shared brand hero */}
      <SiteHero
        eyebrow="For You"
        heading="Custom Laser Engraving — Gifts, Knives, Tumblers & More"
        accent="coral"
        baseColor="#1A4F48"
      >
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-lg mx-auto">
          Engraved gifts, custom coasters, home decor — or hit Bring Your Own and I&apos;ll
          mark the thing you already love. Hand-delivered across {siteInfo.city}.
        </p>
        <a
          href={getSmsLink("Hi, I'd like to get something engraved")}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D96C5C] text-white font-semibold text-base rounded-sm hover:bg-[#C25A4B] transition-colors shadow-lg shadow-black/20"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          Text me — {siteInfo.phone}
        </a>
        <p className="text-gray-400 text-sm mt-4">No forms, no wait.</p>
      </SiteHero>

      {/* Portfolio grid — every photo behind the glass */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono text-[#2FE6C4] tracking-[0.2em] uppercase mb-6">Recent work</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORK.map((item) => (
              <div key={item.label} className="group relative aspect-square rounded-sm overflow-hidden">
                <GlassImage
                  src={item.src}
                  alt={item.label}
                  depth="card"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium drop-shadow">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop ready to order — the live buy-now catalog (all categories) */}
      <D1ProductGrid
        heading="Shop ready to order"
        subheading="In-stock and made-to-order, prices up front. Pick one and check out."
        limit={24}
      />

      {/* Categories */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">Browse by category</h2>
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
          <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { n: 1, h: 'Text me', p: "Send a photo of what you want engraved. I'll get back to you with a quote." },
              { n: 2, h: 'I engrave it', p: 'One person handles your order start to finish. No outsourcing.' },
              { n: 3, h: 'Hand-delivered', p: 'I bring it to your door across the South Denver metro.' },
            ].map((step) => (
              <div key={step.n}>
                <div className="w-10 h-10 rounded-full bg-[#2FE6C4]/15 border border-[#2FE6C4]/20 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[#2FE6C4] font-bold">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[#F0E6D3] mb-1">{step.h}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three options */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">Three ways to work with me</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { h: 'Bring your own', p: 'Have a knife, tumbler, laptop, or anything else? Bring it. I engrave it and hand it back.' },
              { h: 'I source it', p: 'Tell me what you want. Cutting boards, tumblers, gifts — I find it, engrave it, and deliver it.' },
              { h: 'Shop my stock', p: 'I keep pens, metal cards, tags, keychains, and other basics on hand — ready to engrave right away.' },
            ].map((opt) => (
              <div key={opt.h} className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-sm p-5">
                <h3 className="font-bold text-[#F0E6D3] mb-2">{opt.h}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{opt.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">Metal, wood, glass, leather, acrylic, plastic, stone — if it&apos;s solid, I can mark it.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                'Knives', 'Tumblers', 'Water Bottles', 'Cutting Boards', 'Laptops',
                'Coasters', 'Keychains', 'Flasks', 'Wine Glasses', 'Pet Bowls',
                'Wallets', 'Pens', 'Awards', 'Signs', 'Bring Your Own',
              ].map((item) => (
                <span key={item} className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-sm text-gray-300">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E6D3] mb-4">Ready?</h2>
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Text me a photo of what you want engraved. I&apos;ll tell you if I can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D96C5C] text-white font-semibold text-base rounded-sm hover:bg-[#C25A4B] transition-colors shadow-lg shadow-black/20"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} — {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
