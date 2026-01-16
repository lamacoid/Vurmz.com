'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  SwatchIcon,
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
    description: 'Metal stylus pens with your logo. Good for any business that hands things to customers.',
    price: '$3-$7',
    unit: 'per pen',
    gradient: 'from-vurmz-teal to-vurmz-teal-light',
  },
  {
    name: 'Tool & Equipment',
    description: 'Kitchen pans, knives, power tools, hand tools. Permanent marking that identifies your stuff.',
    price: '$3-$75',
    unit: 'per item',
    gradient: 'from-vurmz-sage to-emerald-400',
  },
  {
    name: 'Industrial Labels',
    description: 'ABS plastic signs for electrical panels, control boxes, equipment. Two-layer engraved plastic that lasts.',
    price: 'From $8',
    unit: 'per sign',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    name: 'Metal Business Cards',
    description: 'Anodized aluminum cards. People keep these instead of throwing them away.',
    price: 'From $5',
    unit: 'per card',
    gradient: 'from-gray-600 to-gray-800',
  },
  {
    name: 'Cutting Boards',
    description: 'Hardwood boards with custom engraving. Walnut, maple, cherry.',
    price: '$40-$50',
    unit: 'each',
    gradient: 'from-vurmz-powder to-amber-300',
  },
  {
    name: 'Awards & Plaques',
    description: 'Recognition awards, name plates, custom signs.',
    price: 'From $35',
    unit: 'each',
    gradient: 'from-vurmz-sky to-blue-400',
  },
  {
    name: 'Custom Projects',
    description: 'Something else? Tell me what you need and I will let you know if I can do it.',
    price: 'Quote',
    unit: 'based',
    gradient: 'from-purple-400 to-pink-400',
  },
]

const steps = [
  {
    num: 1,
    title: 'Send Request',
    desc: 'Tell me what you need. Upload your logo if you have one.',
    icon: SparklesIcon,
  },
  {
    num: 2,
    title: 'Get Quote',
    desc: 'I respond the same day with pricing.',
    icon: CubeIcon,
  },
  {
    num: 3,
    title: 'Approve',
    desc: 'Review the proof, approve, and I get to work.',
    icon: CheckIcon,
  },
  {
    num: 4,
    title: 'Receive',
    desc: 'Pick up in Centennial or I deliver.',
    icon: WrenchScrewdriverIcon,
  },
]

const materials = [
  {
    title: 'Metals',
    gradient: 'from-vurmz-teal to-vurmz-teal-light',
    items: ['Stainless steel', 'Aluminum', 'Anodized aluminum', 'Brass', 'Copper'],
  },
  {
    title: 'Wood & Organic',
    gradient: 'from-vurmz-sage to-emerald-400',
    items: ['Hardwoods (walnut, maple, cherry)', 'Bamboo', 'Leather', 'Cork', 'Glass'],
  },
  {
    title: 'Plastics & Other',
    gradient: 'from-vurmz-powder to-amber-300',
    items: ['Acrylic', 'ABS engraving plastic', 'Coated metals', 'Powder-coated surfaces'],
  },
]

export default function ServicesPageContent() {
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
      <section ref={heroRef} className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Animated gradient mesh */}
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
            <WrenchScrewdriverIcon className="h-4 w-4 text-vurmz-teal" />
            <span className="text-sm font-medium text-gray-300">Professional Services</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
          >
            <span className="block">Laser Engraving</span>
            <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
              Services
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
          >
            Metal, wood, leather, glass, and more. No minimum orders. Fast turnaround with local service.
          </motion.p>
        </motion.div>
      </section>

      {/* ================================================================
          PRODUCTS - Premium grid with gradient cards
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-2 bg-vurmz-teal/5 text-vurmz-teal px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4" />
              <span>What I Do</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
              Premium Engraving Services
            </h2>
          </BlurIn>

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <StaggerItem key={product.name}>
                <TiltCard className="h-full" intensity={6}>
                  <SpotlightCard className="relative h-full p-8 rounded-2xl bg-white border border-gray-100 overflow-hidden group">
                    {/* Hover gradient accent */}
                    <motion.div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient}`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />

                    <h3 className="text-xl font-semibold text-vurmz-dark mb-4">{product.name}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>

                    <div className="flex items-baseline gap-2">
                      <motion.span
                        className={`text-3xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {product.price}
                      </motion.span>
                      <span className="text-sm text-gray-400">{product.unit}</span>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================
          PROCESS - Premium steps with connected line
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Background gradient */}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            <p className="text-gray-400 mt-4 text-lg">Simple, straightforward process</p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-teal" />

            {steps.map((step, i) => (
              <StaggerItem key={step.num}>
                <div className="text-center relative">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-vurmz-teal to-vurmz-teal-dark rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      boxShadow: '0 10px 40px rgba(106,140,140,0.3)',
                    }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="font-semibold text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
              Get a Quote
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-12">
              Tell me what you need. Same-day response guaranteed.
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
                <span className="relative">Request a Quote</span>
                <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticHover>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
