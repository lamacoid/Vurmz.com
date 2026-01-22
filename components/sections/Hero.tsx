'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Container, Button, FadeIn } from '@/components/ui'

/*
 * Hero Section Component
 *
 * Design principles:
 * - Generous whitespace
 * - Clear visual hierarchy
 * - Subtle background orbs/gradients
 * - Staggered reveal animations
 */

interface HeroProps {
  badge?: string
  title: string
  titleAccent?: string
  subtitle?: string
  primaryCta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
}

const sizeStyles = {
  sm: 'py-16 md:py-20',
  md: 'py-20 md:py-28',
  lg: 'py-24 md:py-36',
}

// Liquid easing for smooth animations
const liquidEasing = [0.23, 1, 0.32, 1] as [number, number, number, number]
void liquidEasing // Available for animations

export default function Hero({
  badge,
  title,
  titleAccent,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
  size = 'lg',
  align = 'center',
}: HeroProps) {
  return (
    <section className={`relative overflow-hidden bg-vurmz-sage ${sizeStyles[size]}`}>

      {/* Content */}
      <Container size="lg" className="relative">
        <div className={align === 'center' ? 'text-center' : 'text-left'}>
          {/* Badge */}
          {badge && (
            <FadeIn delay={0} direction="up" distance={10}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: 'var(--color-primary-wash)',
                  border: '1px solid rgba(106, 140, 140, 0.1)',
                }}
              >
                <SparklesIcon className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm font-medium text-[var(--color-primary)]">
                  {badge}
                </span>
              </motion.div>
            </FadeIn>
          )}

          {/* Title */}
          <FadeIn delay={0.1} direction="up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-dark)] tracking-tight mb-6">
              {title}
              {titleAccent && (
                <>
                  {' '}
                  <span className="text-[var(--color-primary)]">{titleAccent}</span>
                </>
              )}
            </h1>
          </FadeIn>

          {/* Subtitle */}
          {subtitle && (
            <FadeIn delay={0.2} direction="up">
              <p
                className={`text-lg md:text-xl text-[var(--color-medium)] leading-relaxed mb-8 ${
                  align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
                }`}
              >
                {subtitle}
              </p>
            </FadeIn>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <FadeIn delay={0.3} direction="up">
              <div
                className={`flex flex-col sm:flex-row gap-4 ${
                  align === 'center' ? 'justify-center' : 'justify-start'
                }`}
              >
                {primaryCta && (
                  <Button
                    href={primaryCta.href}
                    size="lg"
                    icon={<SparklesIcon className="w-5 h-5" />}
                  >
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    href={secondaryCta.href}
                    size="lg"
                    variant="secondary"
                    iconRight={<ArrowRightIcon className="w-5 h-5" />}
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </FadeIn>
          )}

          {/* Additional Content */}
          {children && (
            <FadeIn delay={0.4} direction="up">
              <div className="mt-8">{children}</div>
            </FadeIn>
          )}
        </div>
      </Container>
    </section>
  )
}
