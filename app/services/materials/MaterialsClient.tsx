'use client'

import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon, HandRaisedIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

// --- Capabilities grid ---
const CAPABILITIES = [
  {
    name: 'Tumblers & Drinkware',
    description: 'Stainless steel tumblers, water bottles, mugs, flasks, can coolers, growlers. Powder-coated or bare metal.',
    image: 'https://res.cloudinary.com/business-products/image/upload/q_auto,c_pad,b_transparent,w_300,h_300/v1669757063/products/images/large/LTM7204--30530084.png',
  },
  {
    name: 'Cutting Boards',
    description: 'Bamboo, maple, walnut, and butcher block. Any size, any design.',
    image: 'https://images.unsplash.com/photo-1682530016949-f370ce937ffa?w=600&q=80',
  },
  {
    name: 'Knives & Blades',
    description: 'Kitchen knives, pocket knives, hunting knives, multi-tools. Near the handle or on the blade.',
    image: 'https://res.cloudinary.com/business-products/image/upload/q_auto,c_pad,b_transparent,w_300,h_300/v1667529822/products/images/large/GFT014--2d5e4cf3.jpg',
  },
  {
    name: 'Leather & Leatherette',
    description: 'Wallets, journals, patches, flask wraps, portfolios, bracelets. Real or synthetic.',
    image: 'https://images.unsplash.com/photo-1485897790417-5bbfe0e37428?w=600&q=80',
  },
  {
    name: 'Glass & Crystal',
    description: 'Wine glasses, pint glasses, champagne flutes, crystal awards. Frosted engraving on any glassware.',
    image: 'https://images.unsplash.com/photo-1634832296440-b5bac2df86c3?w=600&q=80',
  },
  {
    name: 'Laptops & Devices',
    description: 'MacBooks, iPads, laptops, AirPods cases, phone cases. Permanent surface marking.',
    image: '/portfolio/macbook-engraving.jpg',
  },
  {
    name: 'Trophies & Awards',
    description: 'Acrylic, glass, crystal, and wood awards. Individual or bulk for ceremonies and recognition.',
    image: 'https://images.unsplash.com/photo-1648538836903-aa4e9ea103ac?w=600&q=80',
  },
  {
    name: 'Signs & Nameplates',
    description: 'Desk nameplates, door signs, wayfinding, and room identifiers. Plastic, metal, or wood.',
    image: 'https://res.cloudinary.com/business-products/image/upload/q_auto,c_pad,b_transparent,w_300,h_300/v1667550303/products/images/large/S-131-116SQ--6f9914ea.jpg',
  },
  {
    name: 'Industrial Tags & Labels',
    description: 'Asset tags, valve tags, equipment labels, breaker box labels, serial plates. Metal or ABS plastic.',
    image: 'https://res.cloudinary.com/business-products/image/upload/q_auto,c_pad,b_transparent,w_300,h_300/v1667557617/products/images/large/ULT202--4483a6b9.png',
  },
  {
    name: 'Promotional Products',
    description: 'Keychains, pens, bottle openers, coasters, badges, pet bowls, luggage tags. Bulk-ready.',
    image: 'https://res.cloudinary.com/business-products/image/upload/q_auto,c_pad,b_transparent,w_300,h_300/v1744731376/products/images/large/GFT100--1951abe9.png',
  },
]

// --- Three options ---
const OPTIONS = [
  {
    icon: ShoppingBagIcon,
    title: 'Shop the basics',
    description: 'Pens, anodized aluminum cards, tags, coasters, keychains, and more. Items I keep in stock and can engrave right away.',
    cta: 'Ask what\u2019s in stock',
    sms: "Hi, what do you have in stock right now?",
    type: 'sms' as const,
  },
  {
    icon: HandRaisedIcon,
    title: 'Bring your own thing',
    description: 'Have something you want engraved? Bring it. A knife, a tumbler, a laptop, a cutting board — if it\'s solid, I can mark it.',
    cta: 'Text me a photo',
    sms: "Hi, I have my own item I'd like engraved",
    type: 'sms' as const,
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'I\'ll source it',
    description: 'Tell me what you need and I\'ll find it, order it, engrave it, and deliver it. Custom projects, bulk orders, unique materials.',
    cta: 'Tell me what you need',
    sms: "Hi, I need something specific engraved — can you source the material?",
    type: 'sms' as const,
  },
]

export default function MaterialsClient() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-8 sm:pt-12 pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'VURMZ', href: '/' },
              { label: 'Services', href: '/services' },
              { label: 'Materials' },
            ]}
            theme="services"
          />

          <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-2xl">
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-block text-vurmz-teal text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-vurmz-teal/20 px-3 py-1.5 rounded-sm">
                How It Works
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold text-gray-100 tracking-tight leading-[0.95] mb-6"
            >
              Three ways to<br />
              <span className="text-vurmz-teal">get it engraved.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl"
            >
              Shop from what I have on hand, use Bring Your Own for something you already have, or tell me what you need and I&apos;ll make it happen.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Three options */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {OPTIONS.map((opt) => (
              <motion.div
                key={opt.title}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-6 flex flex-col"
              >
                <opt.icon className="w-8 h-8 text-vurmz-teal mb-4" />
                <h3 className="text-lg font-bold text-gray-100 mb-2">{opt.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-5">{opt.description}</p>
                {(() => {
                  const o = opt as { type: string; href?: string; sms?: string; cta: string }
                  return o.type === 'link' && o.href ? (
                    <Link
                      href={o.href}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-vurmz-teal text-white font-semibold text-sm rounded-sm hover:bg-vurmz-teal-dark transition-colors"
                    >
                      {o.cta}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={getSmsLink(o.sms)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-vurmz-teal text-white font-semibold text-sm rounded-sm hover:bg-vurmz-teal-dark transition-colors"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      {o.cta}
                    </a>
                  )
                })()}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight mb-2">What I can engrave</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg">
            Metal, wood, glass, acrylic, leather, plastic, stone. If it&apos;s solid, I can mark it.
          </p>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {CAPABILITIES.map((cap) => (
              <motion.div
                key={cap.name}
                variants={fadeUp}
                transition={{ duration: 0.35 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-sm overflow-hidden"
              >
                <div className="aspect-square bg-[#1a2e2c] overflow-hidden relative">
                  <Image
                    src={cap.image}
                    alt={cap.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-[13px] font-semibold text-gray-100 leading-tight">{cap.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{cap.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-8 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3">
              Not sure if I can engrave it?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Text me a photo. I&apos;ll tell you whether I can do it, what it&apos;ll look like, and what it&apos;ll cost.
            </p>
            <a
              href={getSmsLink("Hi, can you engrave this?")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vurmz-teal text-white font-semibold text-sm rounded-sm hover:bg-vurmz-teal-dark transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.founder.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
