'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, SOURCING, DELIVERY, BASIC_PRICING_CARDS, LEAVE_YOUR_MARK_CARDS } from '@/lib/pricing'
import { servicesTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import SiteHero from '@/components/SiteHero'

const NAV = [
  { label: 'Custom work', href: '#custom' },
  { label: 'Stock & packs', href: '#packs' },
  { label: 'For the trades', href: '#trades' },
  { label: 'How it works', href: '#process' },
  { label: 'Contact', href: '/services/contact' },
]

type PriceCardData = {
  category: string
  packNote: string
  packTotal: string
  items: { name: string; price: string; note: string }[]
}

function PricingCard({ card }: { card: PriceCardData }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm overflow-hidden">
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
            {card.items.map(item => (
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
  )
}

export default function Home() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Laser Engraving',
    name: 'VURMZ Laser Engraving Services',
    description: 'Custom laser engraving for businesses, trades, restaurants, and individuals. Branded products, service tags, knife marking, custom gifts. Posted pricing, next-day turnaround, hand-delivered across the South Denver metro.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'VURMZ LLC',
      url: 'https://www.vurmz.com',
      telephone: siteInfo.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteInfo.city,
        addressRegion: siteInfo.stateAbbr,
        addressCountry: 'US',
      },
    },
    areaServed: siteInfo.serviceAreas.map((area) => ({ '@type': 'City', name: area })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: SIGNATURE.startingPrice, priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-vurmz-dark">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}' }} />

      {/* ═══════════ HERO ═══════════ */}
      <SiteHero
        eyebrow="Services & Pricing"
        heading="Laser Engraving Services for Businesses in the Denver Metro"
        accent="teal"
        baseColor="#1A4F48"
      >
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
          Next-day turnaround, hand-delivered across the South Denver metro. One person, start to finish.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#packs"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cta text-white font-semibold text-base rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
          >
            See pricing
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={getSmsLink()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cream text-vurmz-dark font-semibold text-base rounded-sm hover:bg-vurmz-cream-hover transition-all"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Text {siteInfo.phone}
          </a>
        </div>
      </SiteHero>

      {/* ═══════════ QUICK NAV ═══════════ */}
      <nav className="sticky top-0 z-30 bg-vurmz-dark/90 backdrop-blur border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto py-3 no-scrollbar">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap text-xs sm:text-sm font-mono tracking-wide text-gray-400 hover:text-cream px-3 py-1.5 rounded-sm hover:bg-white/[0.05] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ═══════════ SIGNATURE / CUSTOM ═══════════ */}
      <section id="custom" className="py-12 sm:py-16 bg-white/[0.02] scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vurmz-cta/10 border border-vurmz-cta/20 mb-4">
                <span className="text-xs font-semibold text-vurmz-cta tracking-wide uppercase">Signature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                Custom work, made to order.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                A gift, a tool, a one-of-a-kind piece for your business. Your idea, built and engraved. Text me a photo and I&apos;ll quote you.
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
              <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-3">Starting at</p>
              <p className="text-5xl sm:text-6xl font-bold text-cream mb-2">${SIGNATURE.startingPrice}</p>
              <p className="text-gray-500 text-sm mb-6">per piece · custom engraving</p>
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
              {SOURCING.description}
            </p>
            <a
              href={getSmsLink('I need help sourcing an item')}
              className="inline-flex items-center gap-1.5 text-xs text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group mt-3"
            >
              <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
              Tell me what you need
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STOCK & PACKS ═══════════ */}
      <section id="packs" className="py-12 sm:py-16 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vurmz-teal/10 border border-vurmz-teal/20 mb-4">
            <span className="text-xs font-semibold text-vurmz-teal tracking-wide uppercase">Stock &amp; Packs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
            Items I keep on hand.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
            Pens, coasters, keychains, metal cards — engraved with your logo or text. Plus knife and tool marking: bring yours, I&apos;ll mark them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BASIC_PRICING_CARDS.map((card) => (
              <PricingCard key={card.category} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LEAVE YOUR MARK / TRADES ═══════════ */}
      <section id="trades" className="py-12 sm:py-16 bg-white/[0.02] scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] mb-4">
            <span className="text-xs font-semibold text-cream tracking-wide uppercase">Leave Your Mark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-2">
            For the trades.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-2xl">
            Metal service tags and installer signature tiles. The kind of thing that outlasts a sticker by 20 years. HVAC, plumbing, electrical, masonry, flooring — if you do the work, people should know who did it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEAVE_YOUR_MARK_CARDS.map((card) => (
              <PricingCard key={card.category} card={card} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/services/metal-tags" className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group">
              Service tags &amp; nameplates
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services/knife-engraving" className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group">
              Knife engraving for crews
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT MOVES THE NUMBER ═══════════ */}
      <section className="py-12 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-6">
            What moves the number.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            Four things set the price of a job. Material, because steel marks differently than wood and some blanks cost more than others. Quantity, because setup is the expensive part and piece fifty costs less than piece one. Artwork, because a clean vector file is ready to run and a blurry photo of a logo needs rebuild time. And turnaround, because next-day is standard but same-day rush is possible when the schedule allows.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Send me what you&apos;re thinking and I&apos;ll give you a real number, usually within a few hours. No quote forms that go nowhere. No &ldquo;starting at&rdquo; pricing that doubles later. Free hand-delivery on orders over ${DELIVERY.freeThreshold} in the {DELIVERY.area}.
          </p>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="process" className="relative py-12 sm:py-16 bg-white/[0.02] border-t border-white/[0.06] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">The Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-10">How it works.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Text me', desc: 'Send me what you need. Photos, logos, quantities.' },
              { step: 2, title: 'I quote you', desc: 'Fast, transparent pricing. No setup fees. No surprises.' },
              { step: 3, title: 'I engrave it', desc: 'One person handles your job from setup to finish. No outsourcing, no handoffs.' },
              { step: 4, title: 'Hand-delivered', desc: `I deliver to your door across the South Denver metro. Free on orders $${DELIVERY.freeThreshold}+.` },
            ].map(s => (
              <motion.div
                key={s.step}
                className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: s.step * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-vurmz-teal/10 flex items-center justify-center mb-4">
                  <span className="text-vurmz-teal font-bold">{s.step}</span>
                </div>
                <h3 className="font-semibold text-cream mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 sm:py-12 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustedBy theme="services" />
        </div>
      </section>

      {/* ═══════════ SHOP CROSS-LINK ═══════════ */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0E6D3] rounded-sm p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#1A4F48] mb-2">Shopping for yourself?</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed max-w-lg">
                Browse engraved products with pricing up front. Knives, tumblers, coasters, home decor, and more.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all flex-shrink-0">
              Visit the Shop
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-white/[0.015]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image src="/images/zach.jpeg" alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,47,46,0.6) 0%, transparent 100%)' }} />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-cream/60 tracking-wider uppercase">{siteInfo.founder.name} &middot; Owner</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">Who I Am</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                No department.<br /><span className="text-gray-500">Just me.</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-4">
                I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. I live here, I work here, and I deliver to Centennial, Lone Tree, Highlands Ranch, and everywhere in between. You text me, I quote you, and I handle your job personally.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-vurmz-teal font-semibold text-sm hover:gap-3 transition-all">
                Learn more about VURMZ
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialCarousel testimonials={servicesTestimonials} theme="services" title="What businesses are saying" />
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="relative py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">Tell me what you need.</h2>
          <p className="text-gray-400 text-base leading-relaxed mb-7">
            Text a photo and a rough count. I quote fast and I don&apos;t charge for estimates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services/contact"
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
