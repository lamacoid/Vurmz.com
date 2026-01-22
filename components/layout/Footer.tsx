'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline'
import { Button, Container, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui'

/*
 * Footer Component
 *
 * Design principles:
 * - Warm, inviting feel
 * - Clear information hierarchy
 * - Subtle animations on scroll into view
 * - Cohesive with overall design language
 */

const serviceAreas = [
  'Centennial',
  'Greenwood Village',
  'Cherry Hills',
  'Highlands Ranch',
  'Lone Tree',
  'Englewood',
  'Littleton',
  'Denver Metro',
]

const quickLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Start Order', href: '/order' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const benefits = [
  'Same-day turnaround',
  'No minimum orders',
  'Direct owner communication',
  'Local pickup & delivery',
]

const contactInfo = [
  {
    icon: MapPinIcon,
    label: 'Location',
    value: 'Centennial, Colorado',
    href: null,
  },
  {
    icon: PhoneIcon,
    label: 'Text',
    value: '(719) 257-3834',
    href: 'sms:+17192573834',
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'zach@vurmz.com',
    href: 'mailto:zach@vurmz.com',
  },
  {
    icon: ClockIcon,
    label: 'Hours',
    value: 'Flexible hours',
    href: null,
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, var(--color-cream) 0%, var(--color-white) 100%)`,
        }}
      />

      {/* Top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(106, 140, 140, 0.1) 50%, transparent 90%)',
        }}
      />

      {/* Main Footer Content */}
      <div className="relative">
        <Container>
          <div className="py-16 lg:py-20">
            <StaggerContainer
              staggerDelay={0.08}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
            >
              {/* Company Info */}
              <StaggerItem className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Logo */}
                  <Link href="/" className="inline-block">
                    <Image
                      src="/images/vurmz-logo-full.svg"
                      alt="VURMZ LLC"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>

                  <p className="text-sm text-[var(--color-medium)] leading-relaxed max-w-xs">
                    Premium laser engraving for small businesses in Centennial and the Denver metro area.
                  </p>

                  {/* Contact Items */}
                  <div className="space-y-3">
                    {contactInfo.map((item) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-3 group"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'var(--color-primary)',
                            boxShadow: '0 2px 8px rgba(106, 140, 140, 0.2)',
                          }}
                        >
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-[var(--color-medium)] hover:text-[var(--color-primary)] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm text-[var(--color-medium)]">
                            {item.value}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </StaggerItem>

              {/* Quick Links */}
              <StaggerItem>
                <div>
                  <h3 className="font-semibold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[var(--color-primary)]" />
                    Quick Links
                  </h3>
                  <ul className="space-y-2.5">
                    {quickLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-sm text-[var(--color-medium)] hover:text-[var(--color-primary)] transition-colors"
                        >
                          <span
                            className="w-1 h-1 rounded-full bg-[var(--color-primary)] opacity-40 group-hover:opacity-100 transition-opacity"
                          />
                          <span>{link.name}</span>
                          <ArrowUpRightIcon
                            className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>

              {/* Why VURMZ */}
              <StaggerItem>
                <div>
                  <h3 className="font-semibold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[var(--color-sky)]" />
                    Why VURMZ?
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {benefits.map((benefit) => (
                      <motion.span
                        key={benefit}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-medium)]"
                        style={{
                          background: 'var(--color-white)',
                          border: '1px solid rgba(106, 140, 140, 0.1)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: '0 4px 12px rgba(61, 68, 65, 0.08)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {benefit}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </StaggerItem>

              {/* Service Areas */}
              <StaggerItem>
                <div>
                  <h3 className="font-semibold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-[var(--color-sage)]" />
                    Service Area
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {serviceAreas.map((area, i) => (
                      <motion.span
                        key={area}
                        className="px-2.5 py-1 rounded-md text-xs"
                        style={{
                          background: i === 0 ? 'var(--color-primary)' : 'var(--color-white)',
                          color: i === 0 ? 'white' : 'var(--color-medium)',
                          border: i === 0 ? 'none' : '1px solid rgba(106, 140, 140, 0.1)',
                          boxShadow: i === 0 ? '0 2px 8px rgba(106, 140, 140, 0.2)' : 'none',
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {area}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-3">
                    Based in south suburban Denver
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* CTA Section */}
            <FadeIn delay={0.3} className="mt-16">
              <div
                className="p-8 rounded-2xl text-center"
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(106, 140, 140, 0.08)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-2">
                  Ready to get started?
                </h3>
                <p className="text-[var(--color-medium)] mb-6">
                  Same-day response guaranteed
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button href="/order" icon={<SparklesIcon className="w-4 h-4" />}>
                    Start Your Order
                  </Button>
                  <Button href="sms:+17192573834" variant="secondary" icon={<PhoneIcon className="w-4 h-4" />}>
                    Text Me
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div
        className="relative py-6"
        style={{
          borderTop: '1px solid rgba(106, 140, 140, 0.08)',
        }}
      >
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--color-muted)]">
              &copy; {currentYear} VURMZ LLC. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
