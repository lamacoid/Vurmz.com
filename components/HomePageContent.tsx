'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  SparklesIcon,
  CubeIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
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

// Premium easing
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
  },
  {
    name: 'Metal Business Cards',
    description: 'Anodized aluminum cards that people keep. Make an impression that lasts.',
    price: 'From $5',
    unit: 'per card',
    gradient: 'from-gray-600 to-gray-800',
  },
  {
    name: 'Tool & Equipment',
    description: 'Kitchen pans, knives, power tools. Permanent marking that identifies your stuff.',
    price: '$3-$75',
    unit: 'per item',
    gradient: 'from-vurmz-sage to-emerald-400',
  },
  {
    name: 'Industrial Labels',
    description: 'ABS plastic signs for electrical panels, control boxes, equipment.',
    price: 'From $8',
    unit: 'per sign',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    name: 'Cutting Boards',
    description: 'Hardwood boards with custom engraving. Walnut, maple, cherry.',
    price: '$40-$50',
    unit: 'each',
    gradient: 'from-vurmz-powder to-amber-300',
  },
  {
    name: 'Custom Projects',
    description: 'Something else? Tell me what you need.',
    price: 'Quote',
    unit: 'based',
    gradient: 'from-vurmz-sky to-blue-400',
  },
]

const trustMetrics = [
  { value: '48hr', label: 'Average Turnaround', icon: ClockIcon },
  { value: '100%', label: 'Local Ownership', icon: MapPinIcon },
  { value: '$100+', label: 'Free Delivery', icon: TruckIcon },
  { value: '1-on-1', label: 'Direct Communication', icon: ChatBubbleLeftRightIcon },
]

const serviceAreas = [
  'Centennial', 'Littleton', 'Lone Tree', 'Parker',
  'Highlands Ranch', 'Englewood', 'Castle Rock', 'Aurora',
  'Greenwood Village', 'Cherry Hills', 'Denver'
]

export default function HomePageContent() {
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
          HERO - Premium dark with animated mesh
      ================================================================ */}
      <section ref={heroRef} className="bg-vurmz-dark text-white py-32 md:py-40 relative overflow-hidden">
        {/* Animated gradient mesh */}
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
          {/* Grid pattern */}
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
            <MapPinIcon className="h-4 w-4 text-vurmz-teal" />
            <span className="text-sm font-medium text-gray-300">Centennial, Colorado</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
          >
            <span className="block">Equipment Labels</span>
            <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
              &amp; Industrial Engraving
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
          >
            Pens, business cards, knives, signs, and more. No minimum orders. Fast turnaround for Denver metro businesses.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: easing.liquid }}
          >
            <MagneticHover>
              <Link
                href="/order"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-vurmz-teal to-vurmz-teal-dark text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-vurmz-teal-dark hover:to-vurmz-teal transition-all shadow-2xl overflow-hidden"
                style={{ boxShadow: '0 20px 50px rgba(106, 140, 140, 0.3)' }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                />
                <span className="relative">Start Your Order</span>
                <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticHover>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-semibold text-lg border border-white/20 text-white hover:bg-white/5 transition-all"
            >
              View Services
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================
          MEDIA SHOWCASE - For photos/videos
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              See the Work
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Real examples of precision laser engraving for local businesses.
            </p>
          </BlurIn>

          {/* Placeholder grid for photos/videos - replace with actual media */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Photo/Video {i}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ================================================================
          TRUST METRICS - Light section with cards
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-2 bg-vurmz-sage/10 text-vurmz-sage px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Why Local</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              The VURMZ Difference
            </h2>
          </BlurIn>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustMetrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <TiltCard className="h-full" intensity={5}>
                  <SpotlightCard className="bg-white h-full rounded-2xl overflow-hidden border border-gray-100 p-8 text-center">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-vurmz-teal to-vurmz-teal-dark rounded-2xl flex items-center justify-center mx-auto mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ boxShadow: '0 10px 30px rgba(106,140,140,0.2)' }}
                    >
                      <metric.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold text-vurmz-dark mb-2">{metric.value}</div>
                    <div className="text-gray-500 text-sm">{metric.label}</div>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================
          SERVICE AREAS - Dark section
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(140,174,196,0.08) 0%, transparent 50%)',
                'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(140,174,196,0.08) 0%, transparent 50%)',
                'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(140,174,196,0.08) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Serving Denver Metro</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Local pickup in Centennial. Free delivery on orders over $100.
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.05} className="flex flex-wrap justify-center gap-3 mb-16">
            {serviceAreas.map((area) => (
              <StaggerItem key={area}>
                <motion.span
                  className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-gray-300"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  {area}
                </motion.span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                Owned and operated by Zach, a Centennial native. Precision, consistency, and attention to detail aren&apos;t buzzwords—they&apos;re how I run my business.
              </p>
              <p className="text-gray-400">
                Text me directly at{' '}
                <a href="sms:+17192573834" className="text-vurmz-teal hover:underline font-medium">(719) 257-3834</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          CTA - Premium gradient section
      ================================================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* Premium gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-vurmz-teal via-vurmz-teal-dark to-vurmz-dark" />

        {/* Animated light */}
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
              Ready to Start?
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
                {/* Shine effect */}
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
