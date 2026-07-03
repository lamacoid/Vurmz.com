'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, SOURCING, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, INDIVIDUAL_PRICING_CARDS, TRADES_PRICING_CARDS } from '@/lib/pricing'
import { servicesTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import SiteHero from '@/components/SiteHero'

const NAV = [
  { label: 'Custom work', href: '#custom' },
  { label: 'Stock & packs', href: '#packs' },
  { label: 'For the trades', href: '#trades' },
  { label: 'Volume & standing orders', href: '#business' },
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
    <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--hairline)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">{card.category}</h3>
          <p className="text-xs text-[var(--ink-soft)]">{card.packNote}</p>
        </div>
        {card.packTotal && (
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--eyebrow)]">{card.packTotal}</p>
            <p className="text-[10px] text-[var(--ink-soft)]">pack total</p>
          </div>
        )}
      </div>
      <div className="px-5 py-3">
        <table className="w-full">
          <tbody className="divide-y divide-[var(--hairline)]">
            {card.items.map(item => (
              <tr key={item.name}>
                <td className="py-2">
                  <p className="text-sm text-[var(--ink)]/80">{item.name}</p>
                  {item.note && <p className="text-xs text-[var(--ink-soft)]">{item.note}</p>}
                </td>
                <td className="py-2 text-right whitespace-nowrap">
                  <p className="text-sm font-semibold text-[var(--eyebrow)]">{item.price}</p>
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
      priceSpecification: { '@type': 'PriceSpecification', minPrice: SIGNATURE.startingAt, priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-[var(--page)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}' }} />

      {/* ═══════════ HERO ═══════════ */}
      <SiteHero
        eyebrow="Services & Pricing"
        heading="Laser Engraving Services for Businesses in the Denver Metro"
        accent="teal"
        baseColor="#16525C"
      >
        <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
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
      <nav className="sticky top-0 z-30 bg-[var(--page)]/90 backdrop-blur border-y border-[var(--hairline)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto py-3 no-scrollbar">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap text-xs sm:text-sm font-mono tracking-wide text-[var(--ink-soft)] hover:text-[var(--ink)] px-3 py-1.5 rounded-sm hover:bg-[var(--surface)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ═══════════ SIGNATURE / CUSTOM ═══════════ */}
      <section id="custom" className="py-12 sm:py-16 bg-[var(--surface)] scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vurmz-cta/10 border border-vurmz-cta/20 mb-4">
                <span className="text-xs font-semibold text-vurmz-cta tracking-wide uppercase">Signature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-4">
                Custom work, made to order.
              </h2>
              <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-4">
                A gift, a tool, a one-of-a-kind piece for your business. Your idea, built and engraved. Text me a photo and I&apos;ll quote you.
              </p>
              <ul className="space-y-2 text-[var(--ink-soft)] text-sm">
                {SIGNATURE.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-vurmz-cta">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6 sm:p-8 text-center">
              <p className="text-xs font-mono text-[var(--ink-soft)] tracking-[0.2em] uppercase mb-3">Starting at</p>
              <p className="text-5xl sm:text-6xl font-bold text-[var(--ink)] mb-2">${SIGNATURE.startingAt}</p>
              <p className="text-[var(--ink-soft)] text-sm mb-6">per piece · custom engraving</p>
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
          <div className="mt-8 bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-2">Don&apos;t have the item yet?</h3>
            <p className="text-[var(--ink-soft)] text-sm leading-relaxed">
              {SOURCING.description}
            </p>
            <a
              href={getSmsLink('I need help sourcing an item')}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--eyebrow)] font-mono tracking-wide hover:text-[var(--ink)] transition-colors group mt-3"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--feature)]/10 border border-vurmz-teal/20 mb-4">
            <span className="text-xs font-semibold text-[var(--eyebrow)] tracking-wide uppercase">Stock &amp; Packs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-2">
            Items I keep on hand.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8 max-w-2xl">
            Pens, coasters, keychains, metal cards, engraved with your logo or text. Plus knife and tool marking: bring yours, I&apos;ll mark them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDIVIDUAL_PRICING_CARDS.map((card) => (
              <PricingCard key={card.category} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LEAVE YOUR MARK / TRADES ═══════════ */}
      <section id="trades" className="py-12 sm:py-16 bg-[var(--surface)] scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-white/[0.1] mb-4">
            <span className="text-xs font-semibold text-[var(--ink)] tracking-wide uppercase">Leave Your Mark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-2">
            For the trades.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8 max-w-2xl">
            Metal service tags and installer signature tiles. The kind of thing that outlasts a sticker by 20 years. HVAC, plumbing, electrical, masonry, flooring: if you do the work, people should know who did it.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRADES_PRICING_CARDS.map((card) => (
              <PricingCard key={card.category} card={card} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/services/metal-tags" className="inline-flex items-center gap-2 text-sm text-[var(--eyebrow)] font-mono tracking-wide hover:text-[var(--ink)] transition-colors group">
              Service tags &amp; nameplates
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services/knife-engraving" className="inline-flex items-center gap-2 text-sm text-[var(--eyebrow)] font-mono tracking-wide hover:text-[var(--ink)] transition-colors group">
              Knife engraving for crews
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ VOLUME & STANDING ORDERS ═══════════ */}
      <section id="business" className="py-12 sm:py-16 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--feature)]/10 border border-vurmz-teal/20 mb-4">
            <span className="text-xs font-semibold text-[var(--eyebrow)] tracking-wide uppercase">Volume &amp; Standing Orders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-2">
            Real quantities get real discounts.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8 max-w-2xl">
            Pens, coasters, keychains, metal cards, and service tags all step down in price as the order gets bigger. No setup fee, no design fee, ever, that&apos;s a screen-printing and embroidery cost and it doesn&apos;t apply to a laser.
          </p>
          <p className="text-[13px] font-mono tracking-wide text-[var(--eyebrow)] mb-8">
            No setup fee. No minimums. No shipping. Proof before it runs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {BUSINESS_TIER_CARDS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-sm border p-6 ${tier.name.startsWith('Standing') ? 'bg-[var(--feature)]/10 border-vurmz-teal/30' : 'bg-[var(--surface)] border-[var(--hairline)]'}`}
              >
                <p className={`text-sm font-semibold mb-1 ${tier.name.startsWith('Standing') ? 'text-[var(--eyebrow)]' : 'text-[var(--ink)]'}`}>{tier.name}</p>
                <p className="text-xs text-[var(--ink-soft)] font-mono mb-4">{tier.range}</p>
                <p className="text-2xl font-bold text-[var(--ink)] mb-3">{tier.discount}</p>
                {(tier.freeDelivery || tier.netTerms) && (
                  <ul className="space-y-1">
                    {tier.freeDelivery && <li className="text-xs text-[var(--ink-soft)]">✓ Free delivery, any size</li>}
                    {tier.netTerms && <li className="text-xs text-[var(--ink-soft)]">✓ NET-{BUSINESS.netTermsDays} terms available</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-5 sm:p-6 mb-8">
            <p className="text-[var(--ink-soft)] text-sm leading-relaxed">
              Tiers are based on the real quantity, not the number of packs. Standing orders (any recurring or scheduled account) get Standing-tier terms between reorders too. Choose &quot;Send me an invoice&quot; at checkout to pay within {BUSINESS.netTermsDays} days, no card required up front.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/services/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              Get a Quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink('Hi, I want to talk about a recurring or bulk order')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT MOVES THE NUMBER ═══════════ */}
      <section className="py-12 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-6">
            What moves the number.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-4">
            Four things set the price of a job. Material, because steel marks differently than wood and some blanks cost more than others. Quantity, because setup is the expensive part and piece fifty costs less than piece one. Artwork, because a clean vector file is ready to run and a blurry photo of a logo needs rebuild time. And turnaround, because next-day is standard but same-day rush is possible when the schedule allows.
          </p>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed">
            Send me what you&apos;re thinking and I&apos;ll get you a real number, usually within a few hours. Free hand-delivery on orders over ${DELIVERY.freeThreshold} in the {DELIVERY.area}.
          </p>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="process" className="relative py-12 sm:py-16 bg-[var(--surface)] border-t border-[var(--hairline)] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">The Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-10">How it works.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Text me', desc: 'Send me what you need. Photos, logos, quantities.' },
              { step: 2, title: 'I quote you', desc: 'Fast, transparent pricing. No setup fees. No surprises.' },
              { step: 3, title: 'I engrave it', desc: 'One person handles your job from setup to finish. No outsourcing, no handoffs.' },
              { step: 4, title: 'Hand-delivered', desc: `I deliver to your door across the South Denver metro. Free on orders $${DELIVERY.freeThreshold}+.` },
            ].map(s => (
              <motion.div
                key={s.step}
                className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: s.step * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--feature)]/10 flex items-center justify-center mb-4">
                  <span className="text-[var(--eyebrow)] font-bold">{s.step}</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-1">{s.title}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 sm:py-12 border-t border-[var(--hairline)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustedBy theme="services" />
        </div>
      </section>

      {/* ═══════════ SHOP CROSS-LINK ═══════════ */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--surface)] rounded-sm p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2">Shopping for yourself?</h3>
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
      <section className="relative py-12 sm:py-16 bg-[var(--surface)]">
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
                <span className="text-xs font-mono text-[var(--ink)]/60 tracking-wider uppercase">{siteInfo.founder.name} &middot; Owner</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">Who I Am</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-4">
                No department.<br /><span className="text-[var(--ink-soft)]">Just me.</span>
              </h2>
              <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-4">
                I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. I live here, I work here, and I deliver to Centennial, Lone Tree, Highlands Ranch, and everywhere in between. You text me, I quote you, and I handle your job personally.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[var(--eyebrow)] font-semibold text-sm hover:gap-3 transition-all">
                Learn more about VURMZ
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialCarousel testimonials={servicesTestimonials} theme="services" title="What businesses are saying" />
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="relative py-14 sm:py-20 border-t border-[var(--hairline)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-4">Tell me what you need.</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-7">
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
