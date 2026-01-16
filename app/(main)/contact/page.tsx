'use client'

import Link from 'next/link'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import ServiceAreaMap from '@/components/ServiceAreaMap'
import {
  FadeIn,
  ScaleIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  BlurIn,
  MagneticHover,
} from '@/components/ScrollAnimations'
import {
  TiltCard,
  SpotlightCard,
} from '@/components/PremiumAnimations'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

// Premium easing curves with proper TypeScript typing
const easing = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  liquid: [0.23, 1, 0.32, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
}

// Contact methods data
const contactMethods = [
  {
    icon: PhoneIcon,
    title: 'Text',
    value: '(719) 257-3834',
    href: 'sms:+17192573834',
    description: 'Fastest response',
    gradient: 'from-vurmz-teal to-vurmz-teal-light',
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    value: 'zach@vurmz.com',
    href: 'mailto:zach@vurmz.com',
    description: 'For detailed inquiries',
    gradient: 'from-vurmz-powder to-amber-300',
  },
  {
    icon: MapPinIcon,
    title: 'Location',
    value: 'Centennial, Colorado',
    href: null,
    description: 'Pickup by appointment',
    gradient: 'from-vurmz-sage to-emerald-400',
  },
  {
    icon: ClockIcon,
    title: 'Availability',
    value: 'Flexible Hours',
    href: null,
    description: 'Text anytime',
    gradient: 'from-vurmz-sky to-blue-400',
  },
]

// Service areas
const serviceAreas = [
  'Centennial',
  'Greenwood Village',
  'Cherry Hills',
  'Highlands Ranch',
  'Lone Tree',
  'Englewood',
  'Littleton',
  'Denver',
  'Aurora',
  'Parker',
  'DTC',
]

// FAQ data
const faqs = [
  {
    question: 'How fast can you turn around an order?',
    answer:
      'Next-day is often possible, same-day for some orders. Standard turnaround is 3-5 days. Rush orders may have a fee.',
  },
  {
    question: 'Do you have minimum order quantities?',
    answer: 'No minimums. Need 10 pens instead of 100? No problem.',
  },
  {
    question: 'Can I bring my own items to engrave?',
    answer:
      'Absolutely. I can engrave your existing kitchen pans, tools, or other items. Just let me know what you have and I will tell you if it will work.',
  },
  {
    question: 'What file formats do you need for logos?',
    answer:
      'Vector files (SVG, AI, EPS) work best. High-resolution PNG or JPG can work too. If you only have a basic image, I can often work with it.',
  },
  {
    question: 'How do I pay?',
    answer:
      'I accept all major payment methods. For business orders, I can invoice through Square. Payment is typically due upon completion.',
  },
  {
    question: 'Do you set up recurring orders?',
    answer:
      'Yes. Many businesses order pens quarterly. I can set up automatic reorders so you never run low.',
  },
]

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={false}
    >
      <motion.button
        className="w-full p-6 flex items-center justify-between text-left group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-semibold text-white text-lg pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easing.liquid }}
          className="flex-shrink-0"
        >
          <ChevronDownIcon className="h-5 w-5 text-vurmz-teal" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easing.liquid }}
          >
            <div className="px-6 pb-6">
              <p className="text-gray-400 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ContactPage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(heroScroll, [0, 1], [0, 100])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  return (
    <div className="overflow-x-hidden">
      {/* ================================================================
          HERO SECTION - Premium with animated mesh background
      ================================================================ */}
      <section
        ref={heroRef}
        className="bg-vurmz-dark text-white py-32 relative overflow-hidden"
      >
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
          {/* Glass morphism badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing.liquid }}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 text-vurmz-teal" />
            <span className="text-sm font-medium text-gray-300">Get in Touch</span>
          </motion.div>

          {/* Main headline with gradient text */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
          >
            <span className="block">Contact</span>
            <span className="block mt-2 bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
              VURMZ
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
          >
            Text or email. I respond the same day. No chatbots, no waiting.
          </motion.p>
        </motion.div>
      </section>

      {/* ================================================================
          CONTACT INFO SECTION - Premium cards with gradient icons
      ================================================================ */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Methods */}
            <div>
              <BlurIn className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
                  Get in Touch
                </h2>
              </BlurIn>

              <StaggerContainer staggerDelay={0.1} className="space-y-4">
                {contactMethods.map((method) => (
                  <StaggerItem key={method.title}>
                    <TiltCard intensity={5}>
                      <SpotlightCard className="bg-white p-6 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-5">
                          <motion.div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center flex-shrink-0`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <method.icon className="h-7 w-7 text-white" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-vurmz-dark mb-1">
                              {method.title}
                            </h3>
                            {method.href ? (
                              <a
                                href={method.href}
                                className="text-vurmz-teal text-xl font-semibold hover:underline block"
                              >
                                {method.value}
                              </a>
                            ) : (
                              <span className="text-gray-700 text-lg font-medium block">
                                {method.value}
                              </span>
                            )}
                            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Ready to Order Card */}
              <FadeIn delay={0.4} className="mt-10">
                <TiltCard intensity={4}>
                  <SpotlightCard className="bg-gradient-to-br from-vurmz-teal/5 to-vurmz-powder/5 p-8 rounded-3xl border border-vurmz-teal/20 overflow-hidden relative">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-vurmz-teal/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative">
                      <h3 className="font-semibold text-xl text-vurmz-dark mb-3">
                        Ready to Order?
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Build your order online with instant pricing, or get a custom quote. I
                        respond the same day.
                      </p>
                      <MagneticHover>
                        <Link
                          href="/order"
                          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
                          style={{
                            background: 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                            boxShadow:
                              '0 20px 50px rgba(106,140,140,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
                          }}
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
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </FadeIn>
            </div>

            {/* Service Area */}
            <div>
              <SlideIn direction="right">
                <BlurIn className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight">
                    Service Area
                  </h2>
                </BlurIn>

                <ScaleIn>
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-8">
                    <ServiceAreaMap />
                  </div>
                </ScaleIn>

                {/* Service Areas Tags */}
                <div className="mb-8">
                  <h3 className="font-semibold text-vurmz-dark mb-4 text-lg">Serving</h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area, i) => (
                      <motion.span
                        key={area}
                        className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 text-sm rounded-xl border border-gray-100 hover:border-vurmz-teal/30 hover:bg-vurmz-teal/5 transition-colors cursor-default"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, ease: easing.liquid }}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {area}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Free Delivery Banner */}
                <TiltCard intensity={3}>
                  <SpotlightCard className="p-6 bg-gradient-to-br from-vurmz-teal/10 to-vurmz-teal/5 border border-vurmz-teal/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vurmz-teal to-vurmz-teal-light flex items-center justify-center">
                        <MapPinIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-vurmz-dark font-semibold">
                          Free delivery on orders $100+
                        </p>
                        <p className="text-sm text-gray-600">
                          In south suburban Denver. Delivery available to all Denver metro.
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ SECTION - Premium accordion with hover effects
      ================================================================ */}
      <section className="bg-vurmz-dark text-white py-32 relative overflow-hidden">
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 100% 50%, rgba(106,140,140,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse 50% 50% at 0% 50%, rgba(106,140,140,0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-vurmz-teal" />
              <span className="text-sm font-medium text-gray-300">FAQ</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Common{' '}
              <span className="bg-gradient-to-r from-vurmz-teal via-vurmz-teal-light to-vurmz-powder bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </BlurIn>

          <StaggerContainer staggerDelay={0.08} className="space-y-4">
            {faqs.map((faq) => (
              <StaggerItem key={faq.question}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION - Premium gradient with animated effects
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
              Ready to Order?
            </h2>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Build your order online or text me directly. Same-day response guaranteed.
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
                  <span className="relative">Start Your Order</span>
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
