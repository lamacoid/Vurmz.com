'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CubeIcon,
  TruckIcon,
  SparklesIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import {
  FadeIn,
  ScaleIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  BlurIn,
  MagneticHover,
} from '@/components/ScrollAnimations'
import { TiltCard, SpotlightCard } from '@/components/PremiumAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Premium easing curves
const easing = {
  smooth: [0.4, 0, 0.2, 1] as const,
  liquid: [0.23, 1, 0.32, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
}

const pricingCategories = [
  {
    category: 'Promotional Items',
    gradient: 'from-vurmz-teal to-vurmz-teal-light',
    items: [
      { name: 'Metal Stylus Pens', price: '$3-$7/pen', note: 'Price varies with upgrades' },
      { name: 'Keychains', price: 'Starting at $4/unit', note: 'Various styles' },
      { name: 'Coasters', price: 'Starting at $6/unit', note: 'Wood or metal' },
      { name: 'Bottle Openers', price: 'Starting at $5/unit', note: 'Metal' },
    ],
  },
  {
    category: 'Tool & Equipment Marking',
    gradient: 'from-vurmz-sage to-emerald-400',
    items: [
      { name: 'Kitchen Pans (existing)', price: '$3-$5/pan', note: '9th, 6th, hotel pans, sheet trays' },
      { name: 'Knife Engraving (your knife)', price: '$15/knife', note: 'Bring your own knife' },
      { name: 'Pocket Knife + Engraving', price: '$40', note: 'Basic pocket knife included' },
      { name: 'Chef Knife + Engraving', price: '$50', note: 'Basic chef knife included' },
      { name: 'Steak Knife Sets', price: '$60-$85', note: '4-piece or 6-piece sets' },
      { name: 'Power Tools', price: '$30-$75/item', note: 'Complexity varies' },
      { name: 'Hand Tools', price: '$30-$50/item', note: 'Depends on size/material' },
    ],
  },
  {
    category: 'Business Cards & Signage',
    gradient: 'from-vurmz-powder to-amber-300',
    items: [
      { name: 'Metal Business Cards', price: '$3-$6/card', note: 'Stainless steel from $15' },
      { name: 'Name Plates', price: 'Starting at $15', note: 'Desk or door mount' },
      { name: 'Custom Signs', price: 'Quote based', note: 'Size and material dependent' },
    ],
  },
  {
    category: 'Industrial Labels & Signs',
    gradient: 'from-amber-400 to-orange-400',
    items: [
      { name: 'Panel Labels (small)', price: '$8-$12/sign', note: 'Under 2" x 4"' },
      { name: 'Panel Labels (medium)', price: '$12-$20/sign', note: '2" x 4" to 4" x 6"' },
      { name: 'Equipment Signs (large)', price: '$20-$40/sign', note: 'Larger sizes' },
      { name: 'Custom Industrial Signage', price: 'Quote based', note: 'Size and quantity dependent' },
    ],
  },
  {
    category: 'Awards & Gifts',
    gradient: 'from-vurmz-sky to-blue-400',
    items: [
      { name: 'Recognition Plaques', price: 'Starting at $35', note: 'Wood or acrylic' },
      { name: 'Cutting Boards', price: '$40-$50', note: 'Hardwood (walnut, maple, cherry)' },
      { name: 'Wine Gift Boxes', price: 'Contact for pricing', note: 'Branded wooden boxes' },
      { name: 'Insulated Water Bottles', price: '$25-$40', note: 'Stainless steel' },
    ],
  },
]

const comparison = [
  { factor: 'Turnaround', vurmz: 'Next-day, same-day often possible', online: '1-3 weeks' },
  { factor: 'Minimum Order', vurmz: 'No minimum', online: '50-250 pieces typical' },
  { factor: 'Shipping', vurmz: 'Free local pickup, delivery available', online: '$15-$50+ depending on size' },
  { factor: 'Communication', vurmz: 'Direct with owner', online: 'Support tickets, chatbots' },
  { factor: 'Errors/Issues', vurmz: 'Fixed quickly, personally', online: 'Return shipping, wait for replacement' },
  { factor: 'Rush Orders', vurmz: 'Usually yes', online: 'Extra fees if available' },
]

const whyLocal = [
  { icon: ClockIcon, title: 'Fast Turnaround', desc: 'Days, not weeks', gradient: 'from-vurmz-teal to-vurmz-teal-light' },
  { icon: CubeIcon, title: 'No Minimums', desc: 'Order what you need', gradient: 'from-vurmz-powder to-amber-300' },
  { icon: UserIcon, title: 'Direct Communication', desc: 'Talk to the owner', gradient: 'from-vurmz-sage to-emerald-400' },
  { icon: TruckIcon, title: 'Local Service', desc: 'Pickup or delivery', gradient: 'from-vurmz-sky to-blue-400' },
]

export default function PricingPageContent() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(heroScroll, [0, 1], [0, 100])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  return (
    <div className="overflow-x-hidden">
      {/* ================================================================
          HERO SECTION - Premium dark with animated mesh
      ================================================================ */}
      <section ref={heroRef} className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 155, 140, 0.08) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 80% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(74, 155, 140, 0.08) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 20%, rgba(74, 155, 140, 0.08) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 155, 140, 0.08) 0%, transparent 40%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-3xl">
            {/* Glass morphism badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easing.liquid }}
            >
              <ScaleIcon className="h-4 w-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300 tracking-wide">Honest Pricing</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
            >
              <span className="block">Transparent</span>
              <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
                Pricing
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-400 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
            >
              Premium local service, honestly priced. Here&apos;s what things cost and why.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          WHY LOCAL COSTS MORE - Premium value cards
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-2 bg-vurmz-teal/5 text-vurmz-teal px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4" />
              <span>The Local Advantage</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              Why Local Costs More
            </h2>
          </BlurIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyLocal.map((item) => (
              <StaggerItem key={item.title}>
                <TiltCard className="h-full" intensity={6}>
                  <SpotlightCard className="bg-white p-8 h-full rounded-2xl border border-gray-100 text-center">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <item.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <h3 className="font-semibold text-vurmz-dark text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================
          REAL COST COMPARISON - Premium comparison cards
      ================================================================ */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              The Real Cost Comparison
            </h2>
          </BlurIn>

          <FadeIn>
            <div className="bg-gradient-to-b from-gray-50 to-white p-8 md:p-12 rounded-3xl border border-gray-100">
              <h3 className="text-2xl font-semibold text-vurmz-dark mb-10 text-center">
                Example: 50 Branded Pens
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SlideIn direction="left">
                  <TiltCard intensity={4}>
                    <SpotlightCard className="border border-gray-200 p-8 bg-white h-full rounded-2xl">
                      <h4 className="font-semibold text-gray-500 mb-6 text-lg">Online Wholesaler</h4>
                      <ul className="space-y-4 text-gray-600">
                        <li className="flex justify-between">
                          <span>100 pens @ $2.00 (minimum)</span>
                          <span className="font-medium">$200</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Setup fee</span>
                          <span className="font-medium">$25</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Shipping</span>
                          <span className="font-medium">$18</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wait time</span>
                          <span className="font-medium">2 weeks</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Extra pens you do not need</span>
                          <span className="font-medium">50</span>
                        </li>
                      </ul>
                      <div className="border-t border-gray-200 mt-6 pt-6">
                        <p className="flex justify-between font-semibold text-vurmz-dark text-lg">
                          <span>Total</span>
                          <span>$243 + hassle</span>
                        </p>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </SlideIn>

                <SlideIn direction="right">
                  <TiltCard intensity={4}>
                    <SpotlightCard className="border-2 border-vurmz-teal p-8 bg-white h-full rounded-2xl relative overflow-hidden">
                      <motion.div
                        className="absolute top-0 right-0 bg-gradient-to-r from-vurmz-teal to-vurmz-teal-light text-white px-4 py-1.5 text-sm font-medium rounded-bl-xl"
                        initial={{ x: 100 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.5, ease: easing.liquid }}
                      >
                        Better Deal
                      </motion.div>
                      <h4 className="font-semibold text-vurmz-teal mb-6 text-lg">VURMZ</h4>
                      <ul className="space-y-4 text-gray-600">
                        <li className="flex justify-between">
                          <span>50 pens @ $3</span>
                          <span className="font-medium">$150</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Setup fee</span>
                          <span className="font-medium text-vurmz-teal">$0</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Pickup in Centennial</span>
                          <span className="font-medium text-vurmz-teal">$0</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Wait time</span>
                          <span className="font-medium text-vurmz-teal">Next day</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Extra pens</span>
                          <span className="font-medium text-vurmz-teal">0</span>
                        </li>
                      </ul>
                      <div className="border-t border-vurmz-teal/30 mt-6 pt-6">
                        <p className="flex justify-between font-semibold text-vurmz-teal text-lg">
                          <span>Total</span>
                          <span>$150</span>
                        </p>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </SlideIn>
              </div>

              <motion.p
                className="text-center text-gray-600 mt-10 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, ease: easing.liquid }}
              >
                <span className="font-semibold text-vurmz-dark">Result:</span> You save $93 and get them next day.
              </motion.p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          PRICING TABLES - Premium glass cards on dark
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 100% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Product Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transparent pricing for all services. No hidden fees.
            </p>
          </BlurIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingCategories.map((category) => (
              <StaggerItem key={category.category}>
                <TiltCard className="h-full" intensity={5}>
                  <SpotlightCard className="h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                    {/* Gradient header */}
                    <div className={`bg-gradient-to-r ${category.gradient} px-6 py-5`}>
                      <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                    </div>
                    <div className="p-6">
                      <table className="w-full">
                        <tbody className="divide-y divide-white/10">
                          {category.items.map((item) => (
                            <motion.tr
                              key={item.name}
                              className="group"
                              whileHover={{ backgroundColor: 'rgba(74, 155, 140, 0.1)' }}
                            >
                              <td className="py-4">
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">{item.note}</p>
                              </td>
                              <td className="py-4 text-right">
                                <p className="font-semibold text-vurmz-teal">{item.price}</p>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <p className="text-center text-gray-400 mt-12 text-lg">
              Prices are estimates. Final pricing depends on quantity, complexity, and materials.
              <Link href="/order" className="text-vurmz-teal font-medium ml-1 hover:text-vurmz-teal-light transition-colors">
                Get an exact quote
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SERVICE COMPARISON TABLE - Premium clean section
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-vurmz-sage/10 text-vurmz-sage px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <ScaleIcon className="w-4 h-4" />
              <span>Compare</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              VURMZ vs Online Wholesalers
            </h2>
          </BlurIn>

          <FadeIn>
            <TiltCard intensity={3}>
              <SpotlightCard className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-vurmz-dark to-gray-900 text-white">
                      <th className="px-6 py-5 text-left font-semibold">Factor</th>
                      <th className="px-6 py-5 text-left font-semibold">VURMZ</th>
                      <th className="px-6 py-5 text-left font-semibold">Online Wholesaler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparison.map((row, i) => (
                      <motion.tr
                        key={row.factor}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, ease: easing.liquid }}
                        whileHover={{ backgroundColor: 'rgba(74, 155, 140, 0.05)' }}
                      >
                        <td className="px-6 py-5 font-medium text-vurmz-dark">{row.factor}</td>
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-vurmz-sage">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-vurmz-sage to-emerald-400 flex items-center justify-center flex-shrink-0">
                              <CheckCircleIcon className="h-4 w-4 text-white" />
                            </div>
                            {row.vurmz}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-500">{row.online}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </SpotlightCard>
            </TiltCard>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          VOLUME DISCOUNTS - Premium dark section
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(106,140,140,0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(106,140,140,0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(106,140,140,0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScaleIn>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              Volume Discounts Available
            </h2>
          </ScaleIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Ordering 100+ pens? Setting up recurring orders? Let me know and I will work with you on pricing.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <MagneticHover>
              <Link
                href="/order"
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-semibold text-white rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                  boxShadow: '0 20px 50px rgba(106,140,140,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
                }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                />
                <span className="relative">Request Volume Pricing</span>
                <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticHover>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION - Premium gradient
      ================================================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-vurmz-teal via-vurmz-teal-dark to-vurmz-dark" />

        {/* Animated light effects */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <ScaleIn>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              Get an Exact Quote
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-14 max-w-2xl mx-auto">
              Tell me what you need and I will send you exact pricing the same day.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <MagneticHover>
                <Link
                  href="/order"
                  className="group relative inline-flex items-center justify-center gap-3 bg-white text-vurmz-dark px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-2xl overflow-hidden"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-vurmz-teal/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <span className="relative">Request a Quote</span>
                  <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticHover>
              <MagneticHover>
                <a
                  href="sms:+17192573834"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/50 text-white px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Text (719) 257-3834
                </a>
              </MagneticHover>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
