'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Bars3Icon, XMarkIcon, PhoneIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'

/*
 * Header Component
 *
 * Design principles:
 * - Subtle glass effect that becomes more prominent on scroll
 * - Smooth, organic animations
 * - Mobile menu feels native and fluid
 * - Never jarring or mechanical
 */

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const easings = {
  liquid: [0.23, 1, 0.32, 1] as [number, number, number, number],
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  // Track scroll direction to hide/show header
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0

    // Only hide if scrolled past 100px and scrolling down
    if (latest > 100 && latest > previous) {
      setHidden(true)
    } else {
      setHidden(false)
    }

    // Add background when scrolled
    setScrolled(latest > 20)
  })

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: easings.liquid }}
      >
        {/* Background layer with glass effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: scrolled ? 1 : 0,
            backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(250, 251, 249, 0.92)',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          }}
        />

        {/* Bottom border - appears on scroll */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(106, 140, 140, 0.15), transparent)',
          }}
        />

        {/* Content */}
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Image
                  src="/images/vurmz-logo-full.svg"
                  alt="VURMZ - Laser Engraving"
                  width={130}
                  height={36}
                  className="h-9 w-auto"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: easings.liquid }}
                >
                  <Link
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors group"
                  >
                    {/* Hover background */}
                    <span className="absolute inset-0 rounded-lg bg-[var(--color-primary-wash)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative group-hover:text-[var(--color-primary)] transition-colors duration-200">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4, ease: easings.liquid }}
                className="ml-4"
              >
                <Button
                  href="/order"
                  size="md"
                  icon={<SparklesIcon className="w-4 h-4" />}
                >
                  Start Order
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              className="md:hidden relative p-2.5 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              style={{
                background: mobileMenuOpen
                  ? 'var(--color-primary-wash)'
                  : 'transparent',
              }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="h-6 w-6 text-[var(--color-primary)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="h-6 w-6 text-[var(--color-dark)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-[var(--color-dark)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-[84px] left-4 right-4 z-50 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: easings.liquid }}
              style={{
                background: 'rgba(250, 251, 249, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 16px 48px rgba(61, 68, 65, 0.12), 0 0 0 1px rgba(106, 140, 140, 0.08)',
              }}
            >
              <div className="p-6">
                {/* Navigation Links */}
                <div className="flex flex-col gap-1">
                  {navigation.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3, ease: easings.liquid }}
                    >
                      <Link
                        href={item.href}
                        className="block px-4 py-3.5 rounded-xl font-medium text-[var(--color-dark)] hover:bg-[var(--color-primary-wash)] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3, ease: easings.liquid }}
                  className="mt-4"
                >
                  <Button
                    href="/order"
                    fullWidth
                    icon={<SparklesIcon className="w-4 h-4" />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Order
                  </Button>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="mt-6 pt-6 border-t border-[rgba(106,140,140,0.1)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <a
                    href="sms:+17192573834"
                    className="flex items-center justify-center gap-2 text-[var(--color-primary)] font-medium"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>Text: (719) 257-3834</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
