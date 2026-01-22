'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Container,
  Section,
  Card,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from '@/components/ui'

/*
 * Features Section Component
 *
 * Design principles:
 * - Clean grid layout
 * - Staggered reveal animations
 * - Interactive cards with subtle 3D tilt
 * - Consistent icon styling
 */

interface Feature {
  icon: ReactNode
  title: string
  description: string
}

interface FeaturesProps {
  badge?: string
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'cards' | 'minimal'
}

const columnStyles = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function Features({
  badge,
  title,
  subtitle,
  features,
  columns = 3,
  variant = 'cards',
}: FeaturesProps) {
  return (
    <Section spacing="lg" background="gradient">
      <Container>
        {/* Header */}
        {(badge || title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {badge && (
              <FadeIn direction="up" distance={10}>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-wash)] mb-4">
                  {badge}
                </span>
              </FadeIn>
            )}
            {title && (
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-dark)] mb-4">
                  {title}
                </h2>
              </FadeIn>
            )}
            {subtitle && (
              <FadeIn delay={0.2}>
                <p className="text-lg text-[var(--color-medium)] max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </FadeIn>
            )}
          </div>
        )}

        {/* Features Grid */}
        <StaggerContainer
          staggerDelay={0.08}
          className={`grid gap-6 lg:gap-8 ${columnStyles[columns]}`}
        >
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              {variant === 'cards' ? (
                <HoverCard intensity={5}>
                  <Card variant="elevated" padding="lg" className="h-full">
                    <FeatureContent feature={feature} />
                  </Card>
                </HoverCard>
              ) : variant === 'minimal' ? (
                <div className="p-6">
                  <FeatureContent feature={feature} />
                </div>
              ) : (
                <Card variant="default" padding="lg" className="h-full">
                  <FeatureContent feature={feature} />
                </Card>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  )
}

function FeatureContent({ feature }: { feature: Feature }) {
  return (
    <>
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: 'var(--color-primary)',
          boxShadow: '0 4px 12px rgba(106, 140, 140, 0.2)',
        }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="w-6 h-6 text-white">{feature.icon}</div>
      </motion.div>
      <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-2">
        {feature.title}
      </h3>
      <p className="text-[var(--color-medium)] leading-relaxed">
        {feature.description}
      </p>
    </>
  )
}

/*
 * Stats Section - A variant for displaying statistics
 */

interface Stat {
  value: string
  label: string
  icon?: ReactNode
}

interface StatsProps {
  stats: Stat[]
  title?: string
}

export function Stats({ stats, title }: StatsProps) {
  return (
    <Section spacing="md" background="cream">
      <Container size="lg">
        {title && (
          <FadeIn className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              {title}
            </h2>
          </FadeIn>
        )}

        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div
                className="text-center p-6 rounded-2xl"
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(106, 140, 140, 0.08)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {stat.icon && (
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-wash)] flex items-center justify-center mx-auto mb-3">
                    <div className="w-5 h-5 text-[var(--color-primary)]">{stat.icon}</div>
                  </div>
                )}
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-dark)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  {stat.label}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  )
}
