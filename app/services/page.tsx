'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState as useStateHook, useEffect as useEffectHook } from 'react'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { servicesTestimonials } from '@/lib/testimonials'
import NewsletterSignup from '@/components/NewsletterSignup'
import ItemScroller from '@/components/ItemScroller'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import { portfolioItems } from '@/lib/portfolio'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const heroImages = portfolioItems.map((item) => ({
  src: item.src,
  alt: item.label,
}))

const heroWords = [
  'brand',
  'logo',
  'name',
  'mark',
  'story',
  'crew',
  'knife',
  'tumbler',
  'sign',
  'gift',
  'mirror',
  'merch',
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useStateHook(0)
  const [wordIndex, setWordIndex] = useStateHook(0)

  useEffectHook(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffectHook(() => {
    const interval = setInterval(() => setWordIndex((prev) => (prev + 1) % heroWords.length), 2200)
    return () => clearInterval(interval)
  }, [])

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
      priceSpecification: { '@type': 'PriceSpecification', minPrice: 50, priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-vurmz-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 flex items-center overflow-hidden">
        {/* Cycling portfolio background */}
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
            style={{
              opacity: i === heroIndex ? 0.15 : 0,
              filter: i === heroIndex ? 'blur(0px) hue-rotate(0deg)' : 'blur(8px) hue-rotate(30deg)',
              transform: i === heroIndex ? 'scale(1)' : 'scale(1.1)',
            }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
          </div>
        ))}
        <div className="absolute inset-0 bg-vurmz-dark/70" />

        {/* Glassy glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
          }}
        />
        <div
          className="absolute top-0 left-[20%] w-[60%] h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-block text-vurmz-teal text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-vurmz-teal/20 px-3 py-1.5 rounded-sm">
                Laser Engraving &middot; {siteInfo.city}, {siteInfo.stateAbbr}
              </span>
            </motion.div>

            {/* Heading — massive, high contrast */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream tracking-tight leading-[0.95] mb-6"
            >
              Put your{' '}
              <span className="inline-block relative align-baseline">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={heroWords[wordIndex]}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {heroWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{' '}
              <span className="text-vurmz-cta">on something</span>.
            </motion.h1>

            {/* Sub — restrained, high legibility */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              Next-day turnaround. Hand-to-hand delivery across the South Denver metro. One person, start to finish.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/services/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cta text-white font-semibold text-base rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                Get a Quote
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getSmsLink()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cream text-vurmz-dark font-semibold text-base rounded-sm hover:bg-vurmz-cream-hover transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT I DO — scrolling items ═══════════ */}
      <section className="relative py-12 sm:py-16 overflow-hidden bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.25em] uppercase mb-2">What I engrave</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight">
            Name it. I&apos;ll mark it.
          </h2>
        </div>

        <div className="relative pointer-events-none select-none" style={{ margin: '0 -20px' }}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

          <ItemScroller />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Stock items like pens, cards, and coasters come in packs. Custom work on your own items starts at $50. Don&apos;t have the item? I&apos;ll source it for you. Next-day turnaround, hand-delivered.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/services/pricing"
                  className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
                >
                  View pricing
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wide hover:text-cream transition-colors group"
                >
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  Text me
                </a>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-5">
              <p className="text-sm font-semibold text-cream mb-1">Do you hand out a lot of pens?</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                I can set up recurring orders so you never run out. I&apos;ll keep your stock fresh and deliver on schedule.
              </p>
              <a
                href={getSmsLink("I'm interested in recurring orders")}
                className="inline-flex items-center gap-1.5 text-xs text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
              >
                Tell me more
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS (B2B) ═══════════ */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">The Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-10">How it works.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Text or call', desc: 'Send me what you need. Photos, logos, quantities.' },
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

      {/* ═══════════ LEAVE YOUR MARK ═══════════ */}
      <section className="relative py-12 sm:py-16 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
              For the Trades
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
              Leave your mark.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Metal service tags, installer signature tiles. If you do the work, people should know who did it. HVAC, plumbing, electrical, masonry, flooring.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/services/pricing"
                className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
              >
                See pricing
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getSmsLink("I'm interested in service tags")}
                className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wide hover:text-cream transition-colors group"
              >
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                Text me
              </a>
            </div>
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
              <h3 className="text-xl font-bold text-[#243B39] mb-2">Shopping for yourself?</h3>
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

    </div>
  )
}
