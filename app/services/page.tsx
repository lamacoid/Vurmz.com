'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { BASIC, MARKING, TRADES, SIGNATURE, SOURCING } from '@/lib/pricing'
import { servicesTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import SiteHero from '@/components/SiteHero'

// Headline pricing pulled from the single source of truth so it never drifts.
const PACKS = [
  { name: 'Branded Pens', price: `From $${BASIC.pens.basePerItem}/pen`, sub: `Packs of ${BASIC.pens.packSize} · text, logo, both sides`, href: '/shop/pens' },
  { name: 'Metal Business Cards', price: `From $${BASIC.cards.matteBlackBase}/card`, sub: `Packs of ${BASIC.cards.packSize} · aluminum or stainless`, href: '/shop/metal-cards' },
  { name: 'Coasters', price: `From $${BASIC.coasters.materials.wood}/ea`, sub: `Packs of ${BASIC.coasters.packSize} · wood, slate, steel`, href: '/shop/coasters' },
  { name: 'Keychains', price: `From $${BASIC.keychains.materials.acrylic}/ea`, sub: `Packs of ${BASIC.keychains.packSize} · acrylic, wood, metal`, href: '/shop/keychains' },
]
const TRADES_SVC = [
  { name: 'Metal Service Tags', price: `$${TRADES.serviceTags.range[0]}–$${TRADES.serviceTags.range[1]}`, sub: 'Pack of 10 · stainless or anodized, 3M backing', href: '/services/metal-tags' },
  { name: 'Knife Engraving', price: `$${MARKING.knife.base}/knife`, sub: `Crews ${MARKING.knife.crew.minQty}+ at $${MARKING.knife.crew.perKnife} · full kitchen ${MARKING.knife.fullKitchen.minQty}+ at $${MARKING.knife.fullKitchen.perKnife}`, href: '/services/knife-engraving' },
  { name: 'Tool & Jobsite Marking', price: `From $${MARKING.tool.jobsite.perPiece}/tool`, sub: `$${MARKING.tool.base} single · crews ${MARKING.tool.crew.minQty}+ at $${MARKING.tool.crew.perPiece}`, href: '/services/pricing' },
  { name: 'Signature Tiles', price: 'Quote', sub: 'Your logo, set into the work you install', href: '/services/pricing' },
]
const CUSTOM = [
  { name: 'Custom & Signature Work', price: `From $${SIGNATURE.startingPrice}`, sub: 'One-off pieces — your idea, built and engraved', href: '/services/pricing' },
  { name: 'Concierge Sourcing', price: `$${SOURCING.fee} + cost`, sub: 'I find it, buy it, engrave it, deliver it', href: '/services/pricing' },
]

function PriceCard({ name, price, sub, href }: { name: string; price: string; sub: string; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 bg-white/[0.03] border border-white/[0.08] rounded-sm px-5 py-4 hover:border-vurmz-teal/40 hover:bg-white/[0.05] transition-colors"
    >
      <div className="min-w-0">
        <h3 className="font-semibold text-cream text-sm flex items-center gap-1.5">
          {name}
          <ArrowRightIcon className="w-3.5 h-3.5 text-vurmz-teal opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{sub}</p>
      </div>
      <span className="text-vurmz-teal font-bold text-sm whitespace-nowrap flex-shrink-0">{price}</span>
    </Link>
  )
}

const NAV = [
  { label: 'Branded packs', href: '#packs' },
  { label: 'For the trades', href: '#trades' },
  { label: 'Custom work', href: '#custom' },
  { label: 'Full pricing', href: '/services/pricing' },
  { label: 'Contact', href: '/services/contact' },
]

export default function Home() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Laser Engraving',
    name: 'VURMZ Laser Engraving Services',
    description: 'Custom laser engraving for businesses, trades, restaurants, and individuals. Branded products, service tags, knife marking, custom gifts. Next-day turnaround, hand-delivered across the South Denver metro.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* ═══════════ HERO (shared) ═══════════ */}
      <SiteHero
        eyebrow="For Your Work"
        heading="Laser Engraving Services for Businesses in the Denver Metro"
        accent="teal"
        baseColor="#235158"
      >
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-xl mx-auto">
          Posted pricing, next-day turnaround, hand-to-hand delivery across the South Denver metro. One person, start to finish.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#packs"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cta text-white font-semibold text-base rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
          >
            See services &amp; pricing
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

      {/* ═══════════ PRICING OVERVIEW ═══════════ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Branded packs */}
          <div id="packs" className="scroll-mt-16">
            <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-2">Branded Packs</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-2">Stock items, your logo.</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              Items I keep on hand, engraved with your brand and delivered on a schedule that matches how fast you go through them.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACKS.map((c) => <PriceCard key={c.name} {...c} />)}
            </div>
          </div>

          {/* Trades */}
          <div id="trades" className="scroll-mt-16">
            <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-2">For the Trades</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-2">Leave your mark.</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              If you do the work, people should know who did it. Stickers fall off — a fiber-laser mark in steel outlives the equipment. HVAC, plumbing, electrical, kitchens.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRADES_SVC.map((c) => <PriceCard key={c.name} {...c} />)}
            </div>
          </div>

          {/* Custom */}
          <div id="custom" className="scroll-mt-16">
            <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-2">Custom Work</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-2">Bring me the idea.</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              One-off pieces, awards, signage — your idea, built and engraved. Don&apos;t have the item? I&apos;ll source it for you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CUSTOM.map((c) => <PriceCard key={c.name} {...c} />)}
            </div>
          </div>

          {/* Full pricing CTA */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-cream mb-1">Want every number?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Full price breakdowns, add-ons, and pack totals — all on one page. No setup fees, free delivery over $100.</p>
            </div>
            <Link
              href="/services/pricing"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all flex-shrink-0"
            >
              See full pricing
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS (B2B) ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-white/[0.015] border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">The Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-10">How it works.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Text me', desc: 'Send me what you need. Photos, logos, quantities.' },
              { step: 2, title: 'I quote you', desc: 'Fast, transparent pricing. No setup fees. No surprises.' },
              { step: 3, title: 'I engrave it', desc: 'One person handles your job from setup to finish. No outsourcing, no handoffs.' },
              { step: 4, title: 'Hand-delivered', desc: 'I deliver to your door across the South Denver metro. Free on orders $100+.' },
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
              <h3 className="text-xl font-bold text-[#235158] mb-2">Shopping for yourself?</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed max-w-lg">
                Browse engraved products with pricing up front. Knives, tumblers, coasters, home decor, and more.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#B16558] text-white font-semibold text-sm rounded-sm hover:bg-[#954E44] transition-all flex-shrink-0">
              Visit the Shop
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT (two-column) ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-white/[0.015]">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/zach.jpeg"
                alt={`${siteInfo.founder.name}, owner of VURMZ`}
                fill
                className="object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(26,47,46,0.6) 0%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-cream/60 tracking-wider uppercase">
                  {siteInfo.founder.name} &middot; Owner
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
                Who I Am
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                No department.
                <br />
                <span className="text-gray-500">Just me.</span>
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
