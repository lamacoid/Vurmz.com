'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CubeIcon,
  UserIcon,
  TruckIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { PRODUCTS } from '@/lib/products'
import { motion } from 'framer-motion'

const products = [
  {
    name: PRODUCTS.pens.name,
    price: `$${PRODUCTS.pens.basePerItem}`,
    unit: '/ea',
    description: `Metal stylus pens with your logo`,
    highlight: false,
  },
  {
    name: PRODUCTS.businessCards.name,
    price: `$${PRODUCTS.businessCards.matteBlackBase}`,
    unit: '/ea',
    description: `Matte black aluminum cards`,
    highlight: true,
  },
  {
    name: PRODUCTS.knives.name,
    price: `$${PRODUCTS.knives.base}`,
    unit: '+',
    description: PRODUCTS.knives.description,
    highlight: false,
  },
  {
    name: PRODUCTS.coasters.name,
    price: `$${PRODUCTS.coasters.materials.wood}`,
    unit: '/ea',
    description: 'Wood, slate, or steel with your logo',
    highlight: false,
  },
  {
    name: PRODUCTS.tools.name,
    price: `$${PRODUCTS.tools.base}`,
    unit: '+',
    description: PRODUCTS.tools.description,
    highlight: false,
  },
  {
    name: PRODUCTS.keychains.name,
    price: `$${PRODUCTS.keychains.materials.acrylic}`,
    unit: '/ea',
    description: 'Metal or wood with your logo',
    highlight: false,
  },
]

const valueProps = [
  {
    title: 'Same-Day Turnaround',
    description: 'Morning order, afternoon pickup. No waiting weeks.',
    icon: ClockIcon,
    stat: '24hr',
  },
  {
    title: 'No Minimums',
    description: 'Need 1 or 500? Same quality, same speed.',
    icon: CubeIcon,
    stat: '1+',
  },
  {
    title: 'Direct to Owner',
    description: 'Text Zach directly. No tickets, no runaround.',
    icon: UserIcon,
    stat: 'SMS',
  },
  {
    title: 'Free Delivery',
    description: `Hand-delivered across the ${siteInfo.city} area.`,
    icon: TruckIcon,
    stat: 'Free',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function HomePage() {
  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center bg-vurmz-dark overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(60,185,178,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 60% 80% at 80% 20%, rgba(123,200,212,0.1) 0%, transparent 50%),
                radial-gradient(ellipse 50% 60% at 60% 80%, rgba(125,170,140,0.08) 0%, transparent 50%)
              `,
            }}
          />
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Animated gradient line accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(60,185,178,0.5), transparent)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-8 text-[13px] text-gray-400 border border-white/[0.08] bg-white/[0.03]">
                <MapPinIcon className="h-3.5 w-3.5 text-vurmz-teal" />
                <span>{siteInfo.city}, {siteInfo.state}</span>
                <span className="text-white/20">|</span>
                <span className="text-vurmz-teal">Same-day turnaround</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Laser engraving,{' '}
              <span className="text-glass-gradient">delivered to your door.</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Branded pens, metal business cards, knife engraving, tool marking &mdash; hand-delivered across South Denver metro. No minimums.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href={getSmsLink()}
                className="group inline-flex items-center justify-center gap-2.5 bg-vurmz-teal text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-vurmz-teal-dark transition-all shadow-lg shadow-vurmz-teal/20 hover:shadow-vurmz-teal/30"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Text Me for a Quote
              </a>
              <Link
                href="/order"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-base border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/[0.25] hover:bg-white/[0.04] transition-all"
              >
                Build Your Order
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Price pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { label: 'Pens', price: `$${PRODUCTS.pens.basePerItem}` },
                { label: 'Cards', price: `$${PRODUCTS.businessCards.matteBlackBase}` },
                { label: 'Knives', price: `$${PRODUCTS.knives.base}` },
                { label: 'Coasters', price: `$${PRODUCTS.coasters.materials.wood}` },
              ].map((item) => (
                <span
                  key={item.label}
                  className="text-[13px] text-gray-500 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]"
                >
                  {item.label} from <span className="text-gray-300 font-medium">{item.price}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-5 h-8 rounded-full border border-white/[0.15] flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-white/40"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <section className="bg-[#0d1b1a] py-16 sm:py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {valueProps.map((prop, i) => (
              <motion.div
                key={prop.title}
                className="group relative p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="text-2xl sm:text-3xl font-bold text-vurmz-teal mb-1 tracking-tight">{prop.stat}</div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5">{prop.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{prop.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS GRID ============ */}
      <section className="bg-vurmz-dark py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              What we engrave
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto">
              From branded pens to industrial labels. All made in {siteInfo.city}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                className={`group relative p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:border-vurmz-teal/30 ${
                  product.highlight
                    ? 'border-vurmz-teal/20 bg-gradient-to-b from-vurmz-teal/[0.06] to-transparent'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white">{product.name}</h3>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-vurmz-teal font-bold text-lg">{product.price}</span>
                    <span className="text-gray-500 text-sm">{product.unit}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-vurmz-teal transition-colors font-medium"
            >
              View full pricing
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="bg-[#0d1b1a] py-16 sm:py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Four steps. Usually done same-day.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Text or email', desc: 'Tell Zach what you need. Photos welcome.' },
              { step: '02', title: 'Get a quote', desc: 'Exact pricing within hours, not days.' },
              { step: '03', title: 'Approve & produce', desc: 'Approve the proof. We start right away.' },
              { step: '04', title: 'Pickup or delivery', desc: `Free hand-delivery in ${siteInfo.city}.` },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="text-vurmz-teal/30 text-4xl sm:text-5xl font-bold tracking-tighter mb-3">{item.step}</div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-vurmz-dark py-16 sm:py-24 relative overflow-hidden">
        {/* Gradient accent */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(60,185,178,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl mb-8 max-w-xl mx-auto">
              Text Zach. Get a quote in minutes. No obligation, no sales pitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={getSmsLink()}
                className="group inline-flex items-center justify-center gap-2.5 bg-vurmz-teal text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-vurmz-teal-dark transition-all shadow-lg shadow-vurmz-teal/20"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Text {siteInfo.phone}
              </a>
              <Link
                href="/order"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/[0.25] transition-all"
              >
                Build Your Order
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
