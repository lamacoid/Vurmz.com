'use client'

import Link from 'next/link'
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  BlurIn,
  MagneticHover,
} from '@/components/ScrollAnimations'
import {
  TiltCard,
  SpotlightCard,
} from '@/components/PremiumAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const easing = {
  liquid: [0.23, 1, 0.32, 1] as const,
}

const serviceAreas = [
  { name: 'Centennial', primary: true },
  { name: 'Greenwood Village', primary: false },
  { name: 'Cherry Hills', primary: false },
  { name: 'Highlands Ranch', primary: false },
  { name: 'Lone Tree', primary: false },
  { name: 'Englewood', primary: false },
  { name: 'Littleton', primary: false },
  { name: 'Denver', primary: false },
  { name: 'Aurora', primary: false },
  { name: 'Parker', primary: false },
]

const services = [
  {
    title: 'Branded Merchandise',
    description: 'Pens, coasters, and promotional items with your logo permanently engraved.',
  },
  {
    title: 'Industrial Marking',
    description: 'Asset tags, safety labels, and equipment identification that withstands harsh conditions.',
  },
  {
    title: 'Custom Signage',
    description: 'Professional signs, nameplates, and plaques for offices, warehouses, and storefronts.',
  },
  {
    title: 'Business Cards',
    description: 'Metal business cards that make a lasting impression.',
  },
]

export default function AboutPageContent() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(heroScroll, [0, 1], [0, 150])
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.95])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-vurmz-dark text-white py-32 lg:py-40 relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 155, 140, 0.1) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 80% 40%, rgba(106, 140, 140, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 60%, rgba(74, 155, 140, 0.1) 0%, transparent 40%)',
                'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(106, 140, 140, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 155, 140, 0.1) 0%, transparent 40%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <motion.div
          className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <div className="max-w-4xl">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
            >
              <MapPinIcon className="h-4 w-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300 tracking-wide">Centennial, Colorado</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: easing.liquid }}
            >
              <span className="block">About</span>
              <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
                VURMZ
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easing.liquid }}
            >
              Precision laser engraving for local businesses.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-vurmz-teal/5"
            style={{ top: '10%', right: '-10%' }}
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer staggerDelay={0.15} className="space-y-8">
            <StaggerItem>
              <TiltCard intensity={3}>
                <SpotlightCard className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
                  <h2 className="text-2xl font-bold text-vurmz-dark mb-4">Who We Are</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    VURMZ is a laser engraving business based in Centennial, Colorado, owned and operated by Zach.
                    We specialize in permanent marking solutions for small and medium-sized businesses throughout
                    the Denver metro area.
                  </p>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>

            <StaggerItem>
              <FadeIn delay={0.1}>
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-semibold text-vurmz-dark mb-3">B2B Focus</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We work primarily with businesses, not retail customers. Our pack-based pricing model
                    is designed for companies that need consistent, professional branding across their
                    materials. Whether you need 15 branded pens or 50 safety labels, we handle orders
                    that make sense for your business.
                  </p>
                </div>
              </FadeIn>
            </StaggerItem>

            <StaggerItem>
              <FadeIn delay={0.2}>
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-semibold text-vurmz-dark mb-3">Attention to Detail</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    With a background in professional kitchens, I understand what precision and
                    consistency mean. Every piece that leaves our shop is inspected to ensure
                    clean lines, proper depth, and accurate positioning. Your brand deserves
                    that level of care.
                  </p>
                </div>
              </FadeIn>
            </StaggerItem>

            <StaggerItem>
              <FadeIn delay={0.3}>
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-semibold text-vurmz-dark mb-3">Local Business</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    I grew up in South Metro Denver before Centennial was even incorporated.
                    This is my community, and I take pride in helping local businesses look
                    professional. Free delivery is available on orders over $100, and pickup
                    is always an option.
                  </p>
                </div>
              </FadeIn>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Permanent marking solutions that last the life of your products.
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <motion.div
                  className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="text-xl font-semibold text-vurmz-dark mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="bg-vurmz-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(106, 140, 140, 0.12) 0%, transparent 50%)',
                'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(106, 140, 140, 0.12) 0%, transparent 50%)',
                'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(106, 140, 140, 0.12) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Serving{' '}
              <span className="bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
                South Metro Denver
              </span>
            </h2>
          </BlurIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Based in Centennial. Delivery available throughout the metro area.
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.03} className="flex flex-wrap gap-3 justify-center mb-10">
            {serviceAreas.map((area) => (
              <StaggerItem key={area.name}>
                <motion.span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border transition-all ${
                    area.primary
                      ? 'bg-gradient-to-r from-vurmz-teal to-vurmz-teal-light text-white border-transparent'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {area.name}
                </motion.span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <p className="text-gray-400">
              <span className="text-vurmz-teal font-medium">Free delivery</span> on orders over $100
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vurmz-teal via-vurmz-teal-dark to-vurmz-dark" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <ScaleIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
              Send a quote request or text me directly. I respond the same day.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticHover>
                <Link
                  href="/order"
                  className="group inline-flex items-center justify-center gap-3 bg-white text-vurmz-dark px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl"
                >
                  <span>Request a Quote</span>
                  <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticHover>
              <MagneticHover>
                <a
                  href="sms:+17192573834"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/50 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all"
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
