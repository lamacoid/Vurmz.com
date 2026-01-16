'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  SparklesIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  BlurIn,
  MagneticHover,
} from '@/components/ScrollAnimations'
import { TiltCard, SpotlightCard } from '@/components/PremiumAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const easing = {
  liquid: [0.23, 1, 0.32, 1] as const,
}

const products = [
  {
    name: 'Branded Pens',
    description: 'Metal stylus pens with your logo. Perfect for client gifts, trade shows, and employee onboarding.',
    price: '$3-$7',
    unit: 'per pen',
    gradient: 'from-vurmz-teal to-vurmz-teal-light',
    features: ['Metal construction', 'Stylus tip included', 'Multiple colors available'],
  },
  {
    name: 'Metal Business Cards',
    description: 'Anodized aluminum cards that people keep. Make an impression that lasts.',
    price: 'From $5',
    unit: 'per card',
    gradient: 'from-gray-600 to-gray-800',
    features: ['Stainless or aluminum', 'QR codes available', 'Custom shapes'],
  },
  {
    name: 'Tool & Equipment Marking',
    description: 'Kitchen pans, knives, power tools. Permanent marking that identifies your stuff.',
    price: '$3-$75',
    unit: 'per item',
    gradient: 'from-vurmz-sage to-emerald-400',
    features: ['Restaurant pans', 'Professional knives', 'Power & hand tools'],
  },
  {
    name: 'Industrial Labels & Signs',
    description: 'ABS plastic signs for electrical panels, control boxes, equipment.',
    price: 'From $8',
    unit: 'per sign',
    gradient: 'from-amber-400 to-orange-400',
    features: ['Two-layer engraved plastic', 'Weather resistant', 'Custom sizes'],
  },
  {
    name: 'Cutting Boards',
    description: 'Hardwood boards with custom engraving. Walnut, maple, cherry.',
    price: '$40-$50',
    unit: 'each',
    gradient: 'from-vurmz-powder to-amber-300',
    features: ['Premium hardwoods', 'Logo or text', 'Great for gifts'],
  },
  {
    name: 'Awards & Plaques',
    description: 'Recognition awards, name plates, and custom signs.',
    price: 'From $35',
    unit: 'each',
    gradient: 'from-vurmz-sky to-blue-400',
    features: ['Wood or acrylic', 'Custom designs', 'Quick turnaround'],
  },
]

export default function ProductsPage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(heroScroll, [0, 1], [0, 100])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(140, 174, 196, 0.08) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 80% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(140, 174, 196, 0.08) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(140, 174, 196, 0.08) 0%, transparent 40%)',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing.liquid }}
          >
            <CubeIcon className="h-4 w-4 text-vurmz-teal" />
            <span className="text-sm font-medium text-gray-300">Product Catalog</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
          >
            <span className="block">Our</span>
            <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
              Products
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
          >
            Professional laser engraving for businesses. No minimums, fast turnaround, local service.
          </motion.p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <TiltCard className="h-full" intensity={6}>
                  <SpotlightCard className="relative h-full rounded-2xl bg-white border border-gray-100 overflow-hidden group">
                    {/* Gradient header */}
                    <div className={`h-2 bg-gradient-to-r ${product.gradient}`} />

                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-vurmz-dark mb-3">{product.name}</h3>
                      <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${product.gradient}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div>
                          <span className={`text-3xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                            {product.price}
                          </span>
                          <span className="text-sm text-gray-400 ml-2">{product.unit}</span>
                        </div>
                        <Link
                          href="/order"
                          className="text-vurmz-teal font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Order
                          <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Custom Projects */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 100% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurIn>
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300">Custom Work</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Something Else in Mind?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              If you do not see what you need, ask. I work with many materials and can handle most custom requests.
            </p>
          </BlurIn>
          <FadeIn delay={0.3}>
            <MagneticHover>
              <Link
                href="/order"
                className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Request Custom Quote
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticHover>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vurmz-teal via-vurmz-teal-dark to-vurmz-dark" />
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
              Ready to Order?
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-12">
              Get a quote in minutes. Same-day response guaranteed.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <MagneticHover>
              <Link
                href="/order"
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-vurmz-dark px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-2xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-vurmz-teal/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                />
                <span className="relative">Start Your Order</span>
                <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticHover>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
