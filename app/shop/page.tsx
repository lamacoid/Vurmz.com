import type { Metadata } from 'next'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import RotatingTagline from '@/components/RotatingTagline'
import MenuShop from '@/components/shop/MenuShop'

// MenuShop reads the live catalog at request time → must run on the edge.
export const runtime = 'edge'

export const metadata: Metadata = {
  alternates: { canonical: '/shop' },
}

export default function ShopHome() {
  return (
    <div>
      {/* Menu cover: centered masthead, the tagline on one plane, a double rule */}
      <section className="pt-8 sm:pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="sr-only">Custom Laser Engraving: Gifts, Knives, Tumblers &amp; More</h1>
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">
            VURMZ · Centennial, Colorado
          </p>
          <RotatingTagline
            inline
            accentColor="#C67A6F"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)]"
          />
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            Engraved goods, hand-delivered across the South Denver metro ·{' '}
            <a href={getSmsLink("Hi, I'd like to get something engraved")} className="text-[var(--eyebrow)] font-semibold hover:underline">
              Text {siteInfo.phone}
            </a>
          </p>
          <div className="mt-6 border-t-2 border-[var(--ink)]/25" aria-hidden />
          <div className="mt-[3px] mb-4 border-t border-[var(--ink)]/25" aria-hidden />
        </div>
      </section>

      {/* The menu: every good on one typeset card */}
      <MenuShop />

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
