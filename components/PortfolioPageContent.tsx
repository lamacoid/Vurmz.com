'use client'

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, SwatchIcon } from '@heroicons/react/24/outline'
import PortfolioGallery from '@/components/PortfolioGallery'
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  BlurIn,
  MagneticHover,
} from '@/components/ScrollAnimations'
import { TiltCard, SpotlightCard, CharacterReveal, MorphingGradient } from '@/components/PremiumAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Premium easing curves
const easing = {
  liquid: [0.23, 1, 0.32, 1] as const,
}

// Portfolio items - real completed work only
const portfolioItems = [
  {
    id: 'retail-1',
    title: 'Nordstrom Beauty Perfume Atomizers',
    description: 'Branded perfume atomizer cases for Nordstrom Beauty department',
    category: 'Retail',
    industry: 'Retail',
    location: 'Cherry Creek',
  },
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'Retail', label: 'Retail' },
  { id: 'Culinary', label: 'Culinary' },
  { id: 'Business Items', label: 'Business' },
  { id: 'Custom Projects', label: 'Custom' },
]

// Materials with gradient icons
const materials = [
  { name: 'Stainless Steel', gradient: 'from-gray-400 to-gray-600' },
  { name: 'Aluminum', gradient: 'from-slate-300 to-slate-500' },
  { name: 'Brass', gradient: 'from-amber-400 to-amber-600' },
  { name: 'Wood', gradient: 'from-vurmz-sage to-emerald-500' },
  { name: 'Bamboo', gradient: 'from-lime-400 to-lime-600' },
  { name: 'Acrylic', gradient: 'from-vurmz-sky to-blue-500' },
  { name: 'Leather', gradient: 'from-amber-700 to-amber-900' },
  { name: 'Glass', gradient: 'from-cyan-300 to-cyan-500' },
  { name: 'Anodized Metal', gradient: 'from-vurmz-teal to-vurmz-teal-light' },
  { name: 'Coated Metals', gradient: 'from-indigo-400 to-indigo-600' },
  { name: 'Plastic', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Stone', gradient: 'from-stone-400 to-stone-600' },
]

export default function PortfolioPageContent() {
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
          HERO SECTION - Premium with animated gradient mesh
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
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 155, 140, 0.08) 0%, transparent 40%)',
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          {/* Subtle grid pattern */}
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
          <div className="max-w-3xl">
            {/* Glass morphism badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easing.liquid }}
            >
              <SparklesIcon className="h-4 w-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300">Featured Work</span>
            </motion.div>

            {/* Gradient text heading */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
            >
              <CharacterReveal text="My Work" className="block" />
            </motion.h1>

            <motion.p
              className="text-xl text-gray-400 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: easing.liquid }}
            >
              Types of projects I handle for local businesses. Photos coming as I document more work.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          PORTFOLIO GALLERY - Premium presentation
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <PortfolioGallery items={portfolioItems} categories={categories} />
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          MATERIALS SECTION - Premium gradient icon tags
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        <MorphingGradient className="absolute inset-0 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <SwatchIcon className="w-4 h-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300">Materials</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                What I Can Engrave
              </span>
            </h2>
          </BlurIn>

          <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {materials.map((material) => (
              <StaggerItem key={material.name}>
                <TiltCard className="h-full" intensity={8}>
                  <SpotlightCard className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group">
                    {/* Gradient accent bar */}
                    <motion.div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${material.gradient}`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />

                    {/* Icon with gradient background */}
                    <motion.div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${material.gradient} flex items-center justify-center mb-4 mx-auto`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="w-4 h-4 bg-white/30 rounded-sm" />
                    </motion.div>

                    <p className="text-center text-white font-medium text-sm">
                      {material.name}
                    </p>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION - Premium gradient with shine effects
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Have a Project in Mind?
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Tell me what you need. I respond the same day with pricing and turnaround time.
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
