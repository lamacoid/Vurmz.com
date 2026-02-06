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

// Hardcoded site config
const contact = {
  phone: '(719) 257-3834',
  email: 'zach@vurmz.com',
  city: 'Centennial',
  state: 'Colorado',
}

const header = {
  logoUrl: '/images/vurmz-logo-full.svg',
}

const footer = {
  copyrightText: '© VURMZ Laser Engraving. Centennial, Colorado.',
}

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

// Stagger animation config
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-vurmz-dark" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(106,140,140,0.15) 0%, transparent 60%)',
            top: '-20%',
            right: '-10%',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(106,140,140,0.1) 0%, transparent 60%)',
            bottom: '-10%',
            left: '-5%',
            filter: 'blur(40px)',
          }}
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Top glass edge */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(106,140,140,0.3) 50%, transparent 90%)',
        }}
      />

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company info - Glass card */}
          <motion.div variants={itemVariants}>
            <div
              className="p-6 rounded-3xl mb-6"
              style={{
                background: 'linear-gradient(180deg, rgba(106,140,140,0.1) 0%, rgba(106,140,140,0.05) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Image
                src={header.logoUrl}
                alt="VURMZ LLC"
                width={140}
                height={35}
                className="h-9 w-auto brightness-0 invert mb-4"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Laser engraving for small businesses. Branded products, tool marking, knife engraving, and custom goods.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: MapPinIcon, text: `${contact.city}, ${contact.state}`, color: 'vurmz-teal' },
                { icon: PhoneIcon, text: contact.phone, href: `sms:${contact.phone.replace(/[^0-9]/g, '')}`, color: 'vurmz-powder' },
                { icon: EnvelopeIcon, text: contact.email, href: `mailto:${contact.email}`, color: 'vurmz-teal' },
                { icon: ClockIcon, text: 'Flexible hours', color: 'vurmz-sage' },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, var(--${item.color}) 0%, var(--${item.color}-light, var(--${item.color})) 100%)`,
                      opacity: 0.9,
                    }}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links - Glass list */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-vurmz-teal" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-vurmz-teal/50 group-hover:bg-vurmz-teal transition-colors"
                    />
                    {link.name}
                    <ArrowUpRightIcon className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Why VURMZ - Glass badges */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-vurmz-powder" />
              Why VURMZ?
            </h3>
            <div className="flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <motion.span
                  key={benefit}
                  className="px-4 py-2 rounded-full text-xs text-gray-300"
                  style={{
                    background: 'linear-gradient(180deg, rgba(106,140,140,0.15) 0%, rgba(106,140,140,0.08) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: 'linear-gradient(180deg, rgba(106,140,140,0.25) 0%, rgba(106,140,140,0.15) 100%)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {benefit}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Service Areas - Glass tags */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-vurmz-sage" />
              Service Area
            </h3>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area, idx) => (
                <motion.span
                  key={area}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: idx === 0
                      ? 'linear-gradient(135deg, rgba(106,140,140,0.3) 0%, rgba(106,140,140,0.2) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    color: idx === 0 ? '#ffffff' : '#9ca3af',
                    boxShadow: idx === 0 ? 'inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {area}
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Based in south suburban Denver
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Section - Glass card */}
        <motion.div
          className="mt-10 sm:mt-12 md:mt-16 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(106,140,140,0.1) 0%, rgba(106,140,140,0.05) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Ready to get started?</h3>
          <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base">Same-day response guaranteed</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(106,140,140,0.9) 0%, rgba(90,122,122,0.95) 100%)',
                  boxShadow: '0 8px 30px rgba(106,140,140,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <SparklesIcon className="w-4 h-4" />
                Start Your Order
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="sms:+17192573834"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold text-sm"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <PhoneIcon className="w-4 h-4" />
                Text Me
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar - Glass */}
      <div
        className="relative border-t"
        style={{ borderColor: 'rgba(106,140,140,0.15)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {footer.copyrightText}
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-vurmz-teal transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-vurmz-teal transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
