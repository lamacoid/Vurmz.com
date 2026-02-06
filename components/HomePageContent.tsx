'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRightIcon,
  SparklesIcon,
  CubeIcon,
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
import { getSmsLink } from '@/lib/site-info'

// Premium easing
const easing = {
  liquid: [0.23, 1, 0.32, 1] as const,
}

const trustMetrics = [
  { value: '24hr', label: 'Same-Day Turnaround', icon: ClockIcon },
  { value: '100%', label: 'Local Ownership', icon: MapPinIcon },
  { value: 'Free', label: 'Hand-Delivered', icon: TruckIcon },
  { value: '1', label: 'One Person, Not a Callcenter', icon: ChatBubbleLeftRightIcon },
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
            <span className="block">Your Neighborhood</span>
            <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
              Laser Engraving Shop
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
          >
            Same-day turnaround. Hand-delivered to your desk. No minimums, no runaround.
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
          MEDIA SHOWCASE - Portfolio examples
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

          {/* Portfolio grid with actual images and product categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Metal Business Cards - Real Images */}
            <FadeIn delay={0.1}>
              <div className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-all">
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src="/portfolio/metal-business-card-original.png"
                    alt="Metal Business Card Original"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-vurmz-dark mb-2">Metal Business Cards</h3>
                  <p className="text-gray-600 text-sm">Anodized aluminum. Stand out from the stack.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-all">
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src="/portfolio/metal-business-card.png"
                    alt="Metal Business Card"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-vurmz-dark mb-2">Metal Business Cards</h3>
                  <p className="text-gray-600 text-sm">Precision engraving on premium metals.</p>
                </div>
              </div>
            </FadeIn>

            {/* Product Category Placeholders */}
            <FadeIn delay={0.3}>
              <Link href="/portfolio" className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-vurmz-teal transition-all flex flex-col">
                <div className="aspect-[4/3] bg-gradient-to-br from-vurmz-teal/10 to-vurmz-teal/5 flex items-center justify-center">
                  <div className="text-center">
                    <SparklesIcon className="h-12 w-12 text-vurmz-teal/50 mx-auto mb-2" />
                    <span className="text-gray-400 text-sm">Branded Pens</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-vurmz-dark mb-2">Branded Pens</h3>
                    <p className="text-gray-600 text-sm">Metal stylus pens with your logo.</p>
                  </div>
                  <div className="text-vurmz-teal text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    See examples →
                  </div>
                </div>
              </Link>
            </FadeIn>

            <FadeIn delay={0.4}>
              <a href={getSmsLink("Can you show me examples of industrial labels?")} className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-vurmz-teal transition-all flex flex-col">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100/50 to-orange-100/30 flex items-center justify-center">
                  <div className="text-center">
                    <CubeIcon className="h-12 w-12 text-amber-600/50 mx-auto mb-2" />
                    <span className="text-gray-400 text-sm">Industrial Labels</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-vurmz-dark mb-2">Industrial Labels</h3>
                    <p className="text-gray-600 text-sm">Panels, control boxes, equipment marking.</p>
                  </div>
                  <div className="text-vurmz-teal text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Text for samples →
                  </div>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.5}>
              <a href={getSmsLink("Can you show me examples of knife engraving?")} className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-vurmz-teal transition-all flex flex-col">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100/50 to-gray-100/30 flex items-center justify-center">
                  <div className="text-center">
                    <SparklesIcon className="h-12 w-12 text-slate-600/50 mx-auto mb-2" />
                    <span className="text-gray-400 text-sm">Knife Engraving</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-vurmz-dark mb-2">Knife Engraving</h3>
                    <p className="text-gray-600 text-sm">Chef knives, kitchen tools, cutlery.</p>
                  </div>
                  <div className="text-vurmz-teal text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Text for samples →
                  </div>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.6}>
              <Link href="/portfolio" className="group h-full rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:border-vurmz-teal transition-all flex flex-col">
                <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100/50 to-green-100/30 flex items-center justify-center">
                  <div className="text-center">
                    <CubeIcon className="h-12 w-12 text-emerald-600/50 mx-auto mb-2" />
                    <span className="text-gray-400 text-sm">Tool Marking</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-vurmz-dark mb-2">Tool Marking</h3>
                    <p className="text-gray-600 text-sm">Identify your equipment and tools.</p>
                  </div>
                  <div className="text-vurmz-teal text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    See examples →
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>

          <FadeIn delay={0.7} className="mt-12 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-vurmz-teal text-white rounded-xl font-semibold hover:bg-vurmz-teal-dark transition-colors"
            >
              View Full Portfolio
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </FadeIn>
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
              Why Local Beats Online
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
