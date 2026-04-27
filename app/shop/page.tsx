'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { shopTestimonials } from '@/lib/testimonials'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import ItemScroller from '@/components/ItemScroller'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

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
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30 [&_*]:!text-[#6BB8B2]" aria-hidden>
          <ItemScroller />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-bold text-[#243B39] tracking-tight leading-[0.95] mb-6"
            >
              Laser engraving<br />
              <span className="text-[#6BB8B2]">in {siteInfo.city}.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-[#6B6259] text-lg sm:text-xl leading-relaxed mb-8 max-w-lg mx-auto"
            >
              Tell me what you want engraved. Bring your own item, or I&apos;ll find it for you. I engrave it and hand-deliver it across South Denver.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getSmsLink("Hi, I'd like to get something engraved")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6BB8B2] text-white font-semibold text-base rounded-sm hover:bg-[#4A9D97] transition-colors shadow-lg shadow-[#6BB8B2]/20"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                Text me — {siteInfo.phone}
              </a>
            </motion.div>

            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="text-[#7A7068] text-sm mt-4">
              No forms, no wait.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono text-[#6BB8B2] tracking-[0.2em] uppercase mb-8">Recent work</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORK.map((item) => (
              <div key={item.label} className="aspect-square rounded-sm overflow-hidden relative group">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#243B39] text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#6BB8B2]/10 flex items-center justify-center mb-3 mx-auto">
                <span className="text-[#6BB8B2] font-bold">1</span>
              </div>
              <h3 className="font-semibold text-[#243B39] mb-1">Text me</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">Send a photo of what you want engraved. I&apos;ll get back to you with a quote.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-[#6BB8B2]/10 flex items-center justify-center mb-3 mx-auto">
                <span className="text-[#6BB8B2] font-bold">2</span>
              </div>
              <h3 className="font-semibold text-[#243B39] mb-1">I engrave it</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">One person handles your order start to finish. No outsourcing.</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-[#6BB8B2]/10 flex items-center justify-center mb-3 mx-auto">
                <span className="text-[#6BB8B2] font-bold">3</span>
              </div>
              <h3 className="font-semibold text-[#243B39] mb-1">Hand-delivered</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">I bring it to your door across the South Denver metro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three options */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#243B39] text-center mb-10">Three ways to work with me</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white/50 border border-[#243B39]/8 rounded-sm p-5">
              <h3 className="font-bold text-[#243B39] mb-2">Bring your own</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">Have a knife, tumbler, laptop, or anything else? Bring it. I engrave it and hand it back.</p>
            </div>
            <div className="bg-white/50 border border-[#243B39]/8 rounded-sm p-5">
              <h3 className="font-bold text-[#243B39] mb-2">I source it</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">Tell me what you want. Cutting boards, tumblers, gifts — I find it, engrave it, and deliver it.</p>
            </div>
            <div className="bg-white/50 border border-[#243B39]/8 rounded-sm p-5">
              <h3 className="font-bold text-[#243B39] mb-2">Shop my stock</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">I keep pens, metal cards, tags, keychains, and other basics on hand — ready to engrave right away.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-[#6B6259] text-sm mb-2">Metal, wood, glass, leather, acrylic, plastic, stone — if it&apos;s solid, I can mark it.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                'Knives', 'Tumblers', 'Water Bottles', 'Cutting Boards', 'Laptops',
                'Coasters', 'Keychains', 'Flasks', 'Wine Glasses', 'Pet Bowls',
                'Wallets', 'Pens', 'Awards', 'Signs', 'Your Own Item',
              ].map((item) => (
                <span key={item} className="px-3 py-1.5 bg-[#243B39]/[0.05] border border-[#243B39]/8 rounded-full text-sm text-[#243B39]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialCarousel testimonials={shopTestimonials} theme="shop" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#243B39] mb-4">
            Ready?
          </h2>
          <p className="text-[#6B6259] text-base leading-relaxed mb-8">
            Text me a photo of what you want engraved. I&apos;ll tell you if I can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6BB8B2] text-white font-semibold text-base rounded-sm hover:bg-[#4A9D97] transition-colors shadow-lg shadow-[#6BB8B2]/20"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} — {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
