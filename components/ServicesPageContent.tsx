'use client'

import {
  SparklesIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Hero, CTA, DarkSection, LightSection } from '@/components/PageSections'
import { FadeIn, StaggerContainer, StaggerItem, BlurIn } from '@/components/ScrollAnimations'
import { TiltCard, SpotlightCard } from '@/components/PremiumAnimations'

// Products/services offered
const products = [
  {
    name: 'Branded Pens',
    description: 'Metal stylus pens with your logo. Good for any business that hands things to customers.',
    price: '$3-$7',
    unit: 'per pen',
    icon: '🖊️',
  },
  {
    name: 'Tool & Equipment',
    description: 'Kitchen pans, knives, power tools, hand tools. Permanent marking that identifies your stuff.',
    price: '$3-$75',
    unit: 'per item',
    icon: '🔧',
  },
  {
    name: 'Industrial Labels',
    description: 'ABS plastic signs for electrical panels, control boxes, equipment. Two-layer engraved plastic that lasts.',
    price: 'From $8',
    unit: 'per sign',
    icon: '🏷️',
  },
  {
    name: 'Metal Business Cards',
    description: 'Anodized aluminum cards. People keep these instead of throwing them away.',
    price: 'From $5',
    unit: 'per card',
    icon: '💳',
  },
  {
    name: 'Cutting Boards',
    description: 'Hardwood boards with custom engraving. Walnut, maple, cherry.',
    price: '$40-$50',
    unit: 'each',
    icon: '🪵',
  },
  {
    name: 'Awards & Plaques',
    description: 'Recognition awards, name plates, custom signs.',
    price: 'From $35',
    unit: 'each',
    icon: '🏆',
  },
  {
    name: 'Custom Projects',
    description: 'Something else? Tell me what you need and I will let you know if I can do it.',
    price: 'Quote',
    unit: 'based',
    icon: '✨',
  },
]

// Process steps
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

export default function ServicesPageContent() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <Hero
        badge="Professional Services"
        title="Laser Engraving"
        titleAccent="Services"
        subtitle="Metal, wood, leather, glass, and more. No minimum orders. Fast turnaround with local service."
        primaryCta={{ label: 'Request a Quote', href: '/order' }}
      />

      {/* PRODUCTS/SERVICES GRID */}
      <LightSection gradient="to-gray">
        <BlurIn className="text-center mb-20">
          <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-4">
            What I Do
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            Premium Engraving Services
          </h2>
        </BlurIn>

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <TiltCard className="h-full" intensity={6}>
                <SpotlightCard
                  className="relative h-full p-8 rounded-2xl overflow-hidden group"
                  style={{
                    background: 'rgba(250, 251, 249, 1)',
                    border: '1px solid rgba(106, 140, 140, 0.12)',
                    boxShadow: '0 2px 8px rgba(61, 68, 65, 0.06)',
                  }}
                >
                  {/* Top accent line on hover */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-vurmz-teal"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />

                  {/* Icon */}
                  <div className="text-4xl mb-4">{product.icon}</div>

                  <h3
                    className="text-xl font-semibold text-vurmz-dark mb-3"
                    style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.06)' }}
                  >
                    {product.name}
                  </h3>
                  <p className="mb-6 leading-relaxed" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-vurmz-teal">
                      {product.price}
                    </span>
                    <span className="text-sm" style={{ color: 'rgba(156, 161, 157, 1)' }}>
                      {product.unit}
                    </span>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </LightSection>

      {/* PROCESS STEPS - Now light background */}
      <DarkSection>
        <FadeIn className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            How It Works
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            Simple, straightforward process
          </p>
        </FadeIn>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line - desktop only */}
          <div
            className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
            style={{ background: 'rgba(106, 140, 140, 0.3)' }}
          />

          {steps.map((step) => (
            <StaggerItem key={step.num}>
              <div className="text-center relative">
                <motion.div
                  className="w-20 h-20 bg-vurmz-teal rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ boxShadow: '0 4px 20px rgba(106, 140, 140, 0.2)' }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3
                  className="font-semibold text-xl text-vurmz-dark mb-3"
                  style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.06)' }}
                >
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </DarkSection>

      {/* CTA */}
      <CTA
        title="Get a Quote"
        subtitle="Tell me what you need. Same-day response guaranteed."
        buttonLabel="Request a Quote"
        buttonHref="/order"
      />
    </div>
  )
}
