'use client'
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import CategoryCard from '@/components/CategoryCard'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { portfolioItems } from '@/lib/portfolio'
import Ornament from '@/components/shop/aub/Ornament'
import Plate from '@/components/shop/aub/Plate'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}
const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// "Let's put your [WORD] on something." Single rotating word.
// Each must read cleanly in that exact frame.
const HERO_WORDS = [
  'name',
  'brand',
  'logo',
  'mark',
  'monogram',
  'signature',
  'initials',
  'emblem',
  'crest',
  'stamp',
  'insignia',
]

const HERO_IMAGES = portfolioItems.map((item) => ({ src: item.src, alt: item.label }))

const PORTFOLIO = [
  { src: '/portfolio/culinary-cleaver-engraved.jpg',      label: 'Cleaver',        caption: 'Plate i.'    },
  { src: '/portfolio/water-bottle-full-wrap.jpg',         label: 'Full-Wrap',      caption: 'Plate ii.'   },
  { src: '/portfolio/eye-storm-hexagonal-mirror.jpg',     label: 'Mirror Art',     caption: 'Plate iii.'  },
  { src: '/portfolio/pocket-knife-engraved.jpg',          label: 'Pocket Knife',   caption: 'Plate iv.'   },
  { src: '/portfolio/denver-map-glass-coaster.jpg',       label: 'Glass Coaster',  caption: 'Plate v.'    },
  { src: '/portfolio/macbook-engraving.jpg',              label: 'MacBook',        caption: 'Plate vi.'   },
  { src: '/portfolio/engraved-hand-saw.jpg',              label: 'Hand Saw',       caption: 'Plate vii.'  },
  { src: '/portfolio/water-bottle-custom-engraved.jpg',   label: 'Water Bottle',   caption: 'Plate viii.' },
]

const KEEPSAKES = [
  'Knives', 'Tumblers', 'Water Bottles', 'Cutting Boards', 'Laptops',
  'Coasters', 'Keychains', 'Flasks', 'Wine Glasses', 'Pet Bowls',
  'Wallets', 'Pens', 'Awards', 'Signs', 'Your Own Item',
]

export default function ShopHome() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setHeroIndex((p) => (p + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(id)
  }, [])
  // Word advances every 2.4 seconds.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const wordIndex = tick % HERO_WORDS.length

  return (
    <div className="text-aub-ink-soft">
      {/* ─────────── Hero (rotating portfolio + rotating word) ─────────── */}
      <section className="relative overflow-hidden">
        {/* Cycling portfolio background, cream-tinted */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {HERO_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
              style={{
                opacity: i === heroIndex ? 0.22 : 0,
                transform: i === heroIndex ? 'scale(1)' : 'scale(1.05)',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover sepia"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          {/* Warm cream wash over imagery */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(240,230,211,0.45) 0%, rgba(240,230,211,0.88) 75%, var(--aub-cream) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-aub-smallcaps text-[11px] text-aub-burgundy mb-6"
            >
              Laser Engraving &middot; {siteInfo.city}, {siteInfo.stateAbbr}
            </motion.p>

            {/* Editorial headline: one coherent display serif voice. Rotating
                word is the same family, italic + terracotta, inline. */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-aub-display text-aub-burgundy text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            >
              Let&apos;s put your{' '}
              <span className="relative inline-block align-baseline">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={HERO_WORDS[wordIndex]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="inline-block italic text-aub-terracotta whitespace-nowrap"
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{' '}
              on something.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-aub-body text-aub-ink-soft text-base sm:text-lg leading-relaxed mt-6 max-w-xl"
            >
              Next-day turnaround. Hand-to-hand delivery across the South
              Denver metro. One person, start to finish.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <a
                href={getSmsLink("Hi, I'd like to put something on an item")}
                className="
                  inline-flex items-center gap-3 px-7 py-3.5
                  bg-aub-burgundy text-aub-cream-warm
                  font-aub-smallcaps text-[12px]
                  border border-aub-burgundy-dk
                  shadow-[0_3px_0_var(--aub-burgundy-dk),0_10px_24px_-10px_rgba(42,26,20,0.35)]
                  hover:bg-aub-burgundy-dk transition-colors
                  active:translate-y-px active:shadow-[0_2px_0_var(--aub-burgundy-dk)]
                "
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text &mdash; {siteInfo.phone}
              </a>
              <a
                href="/services/contact"
                className="
                  inline-flex items-center gap-3 px-7 py-3.5
                  bg-transparent text-aub-burgundy
                  font-aub-smallcaps text-[12px]
                  border border-aub-burgundy/50
                  hover:bg-aub-burgundy/[0.06] hover:border-aub-burgundy
                  transition-colors
                "
              >
                Get a Quote
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────── Intro ─────────── */}
      <section className="pb-16 sm:pb-20 pt-4">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="font-aub-body text-[17px] sm:text-[18px] leading-[1.7] text-aub-ink-soft max-w-2xl">
            Vurmz is the kind of shop where a thing comes in and leaves with
            its name on it. A pocket knife your grandfather gave you. A tumbler
            for the morning ritual. A laptop that&apos;s yours for the next eight
            years. I engrave, etch, and mark objects so they keep being yours
            after you stop holding them. Metal, wood, glass, leather, acrylic,
            stone &mdash; if it&apos;s solid, I can mark it.
          </p>
        </div>
      </section>

      {/* ─────────── Recent work ─────────── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-aub-display text-aub-burgundy text-3xl sm:text-4xl mb-10">
            Recent work
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {PORTFOLIO.map((p) => (
              <Plate
                key={p.src}
                src={p.src}
                alt={p.label}
                label={p.label}
                caption={p.caption}
                aspect="square"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Shop by category ─────────── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-aub-display text-aub-burgundy text-3xl sm:text-4xl mb-10">
            Shop by category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHOP_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── How it works ─────────── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-aub-display text-aub-burgundy text-3xl sm:text-4xl mb-10">
            How it works
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { n: '1', t: 'Text me', d: 'Send a photo of what you want engraved. I respond with a quote, fast.' },
              { n: '2', t: 'I engrave it', d: 'One person handles your order start to finish. No outsourcing, no committees.' },
              { n: '3', t: 'Hand-delivered', d: 'I bring it to your door across the South Denver metro.' },
            ].map((s) => (
              <li key={s.n}>
                <div className="font-aub-smallcaps text-aub-terracotta text-[11px] mb-2">Step {s.n}</div>
                <h3 className="font-aub-display text-aub-burgundy text-xl mb-2">{s.t}</h3>
                <p className="font-aub-body text-aub-ink-soft text-[15px] leading-relaxed">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── Three ways to work with me ─────────── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-aub-display text-aub-burgundy text-3xl sm:text-4xl mb-10">
            Three ways to work with me
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { t: 'Bring your own', d: 'A knife, a tumbler, a laptop, anything. Bring it. I engrave it and hand it back.' },
              { t: 'I source it',   d: 'Tell me what you want. Cutting boards, tumblers, gifts &mdash; I find it, engrave it, deliver it.' },
              { t: 'Shop my stock', d: 'Pens, metal cards, tags, keychains, and other basics &mdash; ready to engrave today.' },
            ].map((o) => (
              <div
                key={o.t}
                className="bg-aub-cream-warm border border-aub-rule p-6 shadow-[0_1px_0_rgba(42,26,20,0.05)]"
              >
                <h3 className="font-aub-display text-aub-burgundy text-xl mb-3">{o.t}</h3>
                <p
                  className="font-aub-body text-aub-ink-soft text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: o.d }}
                />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <p className="font-aub-display text-aub-burgundy text-xl mb-4">
              Things people keep
            </p>
            <div className="flex flex-wrap gap-2">
              {KEEPSAKES.map((k) => (
                <span
                  key={k}
                  className="font-aub-smallcaps text-[10px] px-3 py-1.5 bg-aub-cream-warm border border-aub-rule text-aub-ink-soft"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Testimonials ─────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <TestimonialCarousel testimonials={shopTestimonials} theme="shop" />
        </div>
      </section>

      {/* ─────────── Final CTA ─────────── */}
      <section className="pb-20 sm:pb-28 pt-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-aub-display text-aub-burgundy text-4xl sm:text-5xl mb-4">
            Ready?
          </h2>
          <p className="font-aub-body text-aub-ink-soft text-[17px] leading-relaxed mb-8 max-w-xl">
            Text me a photo of what you want engraved. I&apos;ll tell you if I
            can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="
              inline-flex items-center gap-3 px-7 py-3.5
              bg-aub-burgundy text-aub-cream-warm
              font-aub-smallcaps text-[12px]
              border border-aub-burgundy-dk
              shadow-[0_3px_0_var(--aub-burgundy-dk),0_10px_24px_-10px_rgba(42,26,20,0.35)]
              hover:bg-aub-burgundy-dk transition-colors
            "
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Text {siteInfo.founder.name} &mdash; {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
