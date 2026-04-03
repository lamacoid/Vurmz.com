'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// Placeholder categories — Zach will fill in real products/pricing
const categories = [
  {
    name: 'Pens',
    description: 'Metal stylus pens with your logo or text. Handed out, kept forever.',
    image: '/portfolio/pens.jpg',
    href: '/shop/pens',
    comingSoon: true,
  },
  {
    name: 'Business Cards',
    description: 'Anodized aluminum cards that people don\'t throw away.',
    image: '/portfolio/metal-business-cards.jpg',
    href: '/shop/cards',
    comingSoon: true,
  },
  {
    name: 'Coasters',
    description: 'Engraved coasters for your bar, office, or giveaways.',
    image: '/portfolio/coasters.jpg',
    href: '/shop/coasters',
    comingSoon: true,
  },
  {
    name: 'Keychains',
    description: 'Custom keychains in metal. Small, useful, branded.',
    image: '/portfolio/keychains.jpg',
    href: '/shop/keychains',
    comingSoon: true,
  },
  {
    name: 'Gifts & Awards',
    description: 'Trophies, plaques, cutting boards, and personalized keepsakes.',
    image: '/portfolio/gifts.jpg',
    href: '/shop/gifts',
    comingSoon: true,
  },
]

export default function ShopHome() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-[#B16558]/20 px-3 py-1.5 rounded-sm">
                Laser Engraved Products
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold text-[#243B39] tracking-tight leading-[0.95] mb-6"
            >
              Pick something.
              <br />
              <span className="text-[#B16558]">Make it yours.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-[#6B6259] text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
            >
              Everything ships in packs. Prices listed up front. Made in {siteInfo.city}, hand-delivered across the South Denver metro.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Product categories grid */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="group relative bg-white/60 border border-[#243B39]/8 rounded-sm overflow-hidden hover:border-[#B16558]/20 hover:shadow-lg hover:shadow-[#B16558]/5 transition-all duration-300"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-[#243B39]/[0.04] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#7A7068] text-sm font-mono">Photo coming soon</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#243B39] mb-1.5">{cat.name}</h3>
                  <p className="text-[#6B6259] text-sm leading-relaxed mb-4">{cat.description}</p>

                  {cat.comingSoon ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#7A7068] font-mono tracking-wide">
                      Pricing coming soon
                    </span>
                  ) : (
                    <Link
                      href={cat.href}
                      className="inline-flex items-center gap-1.5 text-sm text-[#B16558] font-semibold group-hover:gap-2.5 transition-all"
                    >
                      View products
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Custom work callout */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#243B39] rounded-sm p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#F0E6D3] mb-2">Need something custom?</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                Have your own item you want engraved? Need bulk orders for your business? Check out our services side for custom work and quotes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6BB8B2] text-white font-semibold text-sm rounded-sm hover:bg-[#4A9D97] transition-all"
              >
                Business Services
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href={getSmsLink()}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-[#F0E6D3] font-semibold text-sm rounded-sm hover:bg-white/10 transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text me
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
