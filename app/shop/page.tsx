'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import { portfolioItems } from '@/lib/portfolio'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CategoryCard from '@/components/CategoryCard'
import GlassImage from '@/components/shop/GlassImage'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { BASIC } from '@/lib/pricing'

// Pack-based categories (coasters, keychains) are business-only — hide from consumer shop.
const CONSUMER_CATEGORIES = SHOP_CATEGORIES.filter(cat => {
  if (cat.pricingType === 'signature') return true
  if (cat.pricingKey && cat.pricingKey in BASIC) {
    const data = BASIC[cat.pricingKey]
    return !('materials' in data)
  }
  return true
})

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// Rotating hero background — the same portfolio photos as the landing page.
const heroBgImages = portfolioItems.map((item) => ({ src: item.src, alt: item.label }))

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

export default function ShopHome() {
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setBgIndex((prev) => (prev + 1) % heroBgImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* Hero — rotating portfolio photos behind frosted teal glass */}
      <section className="relative overflow-hidden -mt-[92px] sm:-mt-[100px] pt-[124px] sm:pt-[148px] pb-10 sm:pb-14">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          {heroBgImages.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
              style={{
                opacity: i === bgIndex ? 0.4 : 0,
                filter: i === bgIndex ? 'blur(0px)' : 'blur(8px)',
                transform: i === bgIndex ? 'scale(1)' : 'scale(1.08)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
            </div>
          ))}
          {/* Teal glass film for legibility */}
          <div className="absolute inset-0 bg-[#1c474e]/45" />
          {/* Bottom fade — photo dissolves into the dark page */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #1c474e 90%)' }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-[#B16558]/30 px-3 py-1.5 rounded-sm"
            >
              Individuals
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-bold text-[#F0E6D3] tracking-tight leading-[0.98] mb-6"
            >
              Laser engraving<br />
              <span className="text-[#6BB8B2]">in {siteInfo.city}.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 max-w-lg mx-auto"
            >
              Tell me what you want engraved. Bring your own item, or I&apos;ll find it for you. I engrave it and hand-deliver it across South Denver.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getSmsLink("Hi, I'd like to get something engraved")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B16558] text-white font-semibold text-base rounded-sm hover:bg-[#954E44] transition-colors shadow-lg shadow-black/20"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                Text me — {siteInfo.phone}
              </a>
            </motion.div>

            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="text-gray-400 text-sm mt-4">
              No forms, no wait.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio grid — every photo behind the glass */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono text-[#6BB8B2] tracking-[0.2em] uppercase mb-6">Recent work</p>
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

      {/* Categories */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">Shop by category</h2>
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
                <div className="w-10 h-10 rounded-full bg-[#6BB8B2]/15 border border-[#6BB8B2]/20 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[#6BB8B2] font-bold">{step.n}</span>
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
                'Wallets', 'Pens', 'Awards', 'Signs', 'Your Own Item',
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B16558] text-white font-semibold text-base rounded-sm hover:bg-[#954E44] transition-colors shadow-lg shadow-black/20"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} — {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
