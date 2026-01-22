'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Container, Button, FadeIn, Float } from '@/components/ui'

/*
 * CTA (Call to Action) Section Component
 *
 * Design principles:
 * - Stands out while remaining cohesive
 * - Clear, compelling messaging
 * - Primary and secondary action options
 * - Subtle background treatment
 */

interface CTAProps {
  title: string
  subtitle?: string
  // Support both object format and individual props
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'default' | 'contained'
}

export default function CTA({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = 'default',
}: CTAProps) {
  // Normalize props - support both formats
  const primary = {
    label: primaryCta?.label || primaryLabel || 'Start Your Order',
    href: primaryCta?.href || primaryHref || '/order',
  }
  const secondary = secondaryCta || (secondaryLabel ? { label: secondaryLabel, href: secondaryHref || 'sms:+17192573834' } : null)
  if (variant === 'contained') {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background with subtle sage tint */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg,
                var(--color-cream) 0%,
                rgba(106, 140, 140, 0.04) 30%,
                rgba(106, 140, 140, 0.06) 70%,
                var(--color-cream) 100%
              )
            `,
          }}
        />

        {/* Floating orb */}
        <Float amplitude={10} duration={8}>
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.02]"
            style={{
              background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)',
              top: '-20%',
              right: '-10%',
              filter: 'blur(60px)',
            }}
          />
        </Float>

        <Container size="md" className="relative">
          <FadeIn>
            <div
              className="p-10 md:p-12 rounded-3xl text-center"
              style={{
                background: 'var(--color-white)',
                border: '1px solid rgba(106, 140, 140, 0.08)',
                boxShadow: `
                  0 4px 8px rgba(61, 68, 65, 0.03),
                  0 8px 16px rgba(61, 68, 65, 0.04),
                  0 16px 32px rgba(61, 68, 65, 0.03)
                `,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg text-[var(--color-medium)] mb-8 max-w-xl mx-auto">
                  {subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href={primary.href}
                  size="lg"
                  icon={<SparklesIcon className="w-5 h-5" />}
                >
                  {primary.label}
                </Button>
                {secondary && (
                  <Button
                    href={secondary.href}
                    size="lg"
                    variant="secondary"
                    icon={<PhoneIcon className="w-5 h-5" />}
                  >
                    {secondary.label}
                  </Button>
                )}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    )
  }

  // Default variant - full width
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              var(--color-cream) 0%,
              rgba(106, 140, 140, 0.05) 50%,
              var(--color-cream) 100%
            )
          `,
        }}
      />

      {/* Decorative elements */}
      <Float amplitude={15} duration={10}>
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)',
            top: '10%',
            left: '-10%',
            filter: 'blur(40px)',
          }}
        />
      </Float>

      <Float amplitude={12} duration={8} delay={1}>
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, var(--color-sky) 0%, transparent 60%)',
            bottom: '10%',
            right: '-5%',
            filter: 'blur(30px)',
          }}
        />
      </Float>

      <Container className="relative text-center">
        <FadeIn>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: 'var(--color-primary-wash)',
              border: '1px solid rgba(106, 140, 140, 0.1)',
            }}
          >
            <SparklesIcon className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-sm font-medium text-[var(--color-primary)]">
              Get Started
            </span>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-dark)] mb-4">
            {title}
          </h2>
        </FadeIn>

        {subtitle && (
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[var(--color-medium)] mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href={primary.href}
              size="lg"
              icon={<SparklesIcon className="w-5 h-5" />}
            >
              {primary.label}
            </Button>
            {secondary && (
              <Button
                href={secondary.href}
                size="lg"
                variant="secondary"
                icon={<PhoneIcon className="w-5 h-5" />}
              >
                {secondary.label}
              </Button>
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
