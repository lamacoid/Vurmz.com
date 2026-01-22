'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { FadeIn, ScaleIn, MagneticHover } from '@/components/ScrollAnimations'

// Muted natural tones - Scandinavian clay aesthetic
const COLORS = {
  teal: 'rgba(106, 140, 140, 1)',         // #6A8C8C
  tealDark: 'rgba(90, 122, 122, 1)',      // #5A7A7A
  tealLight: 'rgba(138, 172, 172, 1)',    // #8AACAC
  tealSoft: 'rgba(106, 140, 140, 0.08)',
  tealSubtle: 'rgba(106, 140, 140, 0.04)',
  sky: 'rgba(140, 174, 196, 1)',          // #8CAEC4
  skySubtle: 'rgba(140, 174, 196, 0.06)',
  sage: 'rgba(138, 154, 142, 1)',         // #8A9A8E
  sageSubtle: 'rgba(138, 154, 142, 0.06)',
  clay: 'rgba(196, 181, 165, 1)',         // #C4B5A5
  claySubtle: 'rgba(196, 181, 165, 0.08)',
  cream: 'rgba(247, 245, 240, 1)',        // #F7F5F0
  warmWhite: 'rgba(250, 251, 249, 1)',    // #FAFBF9
  dark: 'rgba(61, 68, 65, 1)',            // #3D4441
}

// Soft clay shadows
const SHADOWS = {
  sm: '0 2px 8px rgba(61, 68, 65, 0.06), 0 1px 3px rgba(61, 68, 65, 0.08)',
  md: '0 4px 16px rgba(61, 68, 65, 0.08), 0 2px 6px rgba(61, 68, 65, 0.06)',
  lg: '0 8px 32px rgba(61, 68, 65, 0.10), 0 4px 12px rgba(61, 68, 65, 0.06)',
  button: '0 4px 20px rgba(106, 140, 140, 0.2)',
}

const easing = {
  liquid: [0.23, 1, 0.32, 1] as const,
}

// ============================================
// HERO SECTION - Light, warm, Scandinavian
// ============================================
interface HeroProps {
  badge?: string
  badgeIcon?: React.ComponentType<{ className?: string }>
  title: string
  titleAccent: string
  subtitle: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function Hero({ badge, badgeIcon: BadgeIcon, title, titleAccent, subtitle, primaryCta, secondaryCta }: HeroProps) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={heroRef}
      className="py-32 md:py-40 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${COLORS.warmWhite} 0%, ${COLORS.cream} 50%, ${COLORS.warmWhite} 100%)`,
      }}
    >
      {/* Subtle watercolor orbs - very soft */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.tealSubtle} 0%, transparent 70%)`,
            top: '-15%',
            right: '-5%',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.skySubtle} 0%, transparent 70%)`,
            bottom: '-10%',
            left: '-5%',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.claySubtle} 0%, transparent 70%)`,
            top: '30%',
            left: '20%',
          }}
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {badge && (
          <motion.div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
            style={{
              background: COLORS.warmWhite,
              border: `1px solid rgba(106, 140, 140, 0.15)`,
              boxShadow: SHADOWS.sm,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: easing.liquid }}
          >
            {BadgeIcon && <BadgeIcon className="h-4 w-4 text-vurmz-teal" />}
            <span className="text-sm font-medium text-vurmz-dark">{badge}</span>
          </motion.div>
        )}

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing.liquid }}
        >
          <span
            className="block text-vurmz-dark"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            {title}
          </span>
          <span
            className="block mt-2"
            style={{
              background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.sage} 50%, ${COLORS.sky} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {titleAccent}
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-vurmz-dark-muted max-w-2xl leading-relaxed mb-12"
          style={{ color: 'rgba(90, 95, 92, 1)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easing.liquid }}
        >
          {subtitle}
        </motion.p>

        {(primaryCta || secondaryCta) && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: easing.liquid }}
          >
            {primaryCta && (
              <MagneticHover>
                <Link
                  href={primaryCta.href}
                  className="group relative inline-flex items-center justify-center gap-3 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
                    boxShadow: SHADOWS.button,
                  }}
                >
                  <span className="relative">{primaryCta.label}</span>
                  <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticHover>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-semibold text-lg text-vurmz-dark transition-all"
                style={{
                  background: COLORS.warmWhite,
                  border: `1px solid rgba(106, 140, 140, 0.2)`,
                  boxShadow: SHADOWS.sm,
                }}
              >
                {secondaryCta.label}
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

// ============================================
// CTA SECTION - Soft warm gradient, light
// ============================================
interface CTAProps {
  title: string
  subtitle: string
  buttonLabel: string
  buttonHref: string
}

export function CTA({ title, subtitle, buttonLabel, buttonHref }: CTAProps) {
  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, rgba(106, 140, 140, 0.06) 50%, ${COLORS.warmWhite} 100%)`,
      }}
    >
      {/* Subtle orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.tealSoft} 0%, transparent 60%)`,
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScaleIn>
          <h2
            className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-vurmz-dark"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            {title}
          </h2>
        </ScaleIn>

        <FadeIn delay={0.2}>
          <p className="text-xl mb-12" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            {subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <MagneticHover>
            <Link
              href={buttonHref}
              className="group relative inline-flex items-center justify-center gap-3 text-white px-12 py-5 rounded-2xl font-semibold text-lg transition-all overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
                boxShadow: SHADOWS.button,
              }}
            >
              <span className="relative">{buttonLabel}</span>
              <ArrowRightIcon className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticHover>
        </FadeIn>
      </div>
    </section>
  )
}

// ============================================
// ACCENT SECTION - Soft cream/sage tint (LIGHT, not dark!)
// ============================================
interface DarkSectionProps {
  children: React.ReactNode
  className?: string
}

export function DarkSection({ children, className = '' }: DarkSectionProps) {
  return (
    <section
      className={`py-32 relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(180deg, ${COLORS.cream} 0%, rgba(138, 154, 142, 0.06) 30%, rgba(106, 140, 140, 0.08) 70%, ${COLORS.cream} 100%)`,
      }}
    >
      {/* Subtle floating orb */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${COLORS.sageSubtle} 0%, transparent 70%)`,
          top: '10%',
          right: '-8%',
        }}
        animate={{ x: [0, -15, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

// ============================================
// LIGHT SECTION - Clean warm white
// ============================================
interface LightSectionProps {
  children: React.ReactNode
  className?: string
  gradient?: 'none' | 'to-gray' | 'from-gray'
}

export function LightSection({ children, className = '', gradient = 'none' }: LightSectionProps) {
  const bgStyle = gradient === 'to-gray'
    ? { background: `linear-gradient(180deg, ${COLORS.warmWhite} 0%, ${COLORS.cream} 100%)` }
    : gradient === 'from-gray'
    ? { background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.warmWhite} 100%)` }
    : { background: COLORS.warmWhite }

  return (
    <section className={`py-32 ${className}`} style={bgStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
