'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Bars3Icon, XMarkIcon, PhoneIcon, SparklesIcon, MapPinIcon } from '@heroicons/react/24/outline'

// Hardcoded site config
const contact = {
  phone: '(719) 257-3834',
  email: 'zach@vurmz.com',
  city: 'Centennial',
  state: 'Colorado',
}

const header = {
  logoUrl: '/images/vurmz-logo-full.svg',
  ctaText: 'Start Order',
  ctaLink: '/order',
}

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

// Weather icons mapping
const weatherIcons: Record<number, string> = {
  0: '☀️', // Clear
  1: '🌤️', 2: '⛅', 3: '☁️', // Partly cloudy
  45: '🌫️', 48: '🌫️', // Fog
  51: '🌧️', 53: '🌧️', 55: '🌧️', // Drizzle
  61: '🌧️', 63: '🌧️', 65: '🌧️', // Rain
  71: '🌨️', 73: '🌨️', 75: '🌨️', // Snow
  80: '🌧️', 81: '🌧️', 82: '🌧️', // Showers
  95: '⛈️', 96: '⛈️', 99: '⛈️', // Thunderstorm
}

// Premium easing
const glassSpring = { type: 'spring' as const, stiffness: 300, damping: 30 }

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null)
  const { scrollY } = useScroll()

  // Track scroll for glass intensity
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  // Fetch weather for Centennial, CO (39.58, -104.87)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=39.58&longitude=-104.87&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America/Denver'
        )
        const data = await res.json() as { current?: { temperature_2m: number; weather_code: number } }
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          })
        }
      } catch {
        // Weather fetch failed, that's fine
      }
    }
    fetchWeather()
  }, [])

  // Format today's date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const headerOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95])

  return (
    <>
      {/* Top info bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-vurmz-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop top bar */}
          <div className="hidden sm:flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-slate-300" />
                {contact.city}, {contact.state}
              </span>
              <span className="text-white/70">{dateStr}</span>
              {weather && (
                <span className="flex items-center gap-1">
                  <span>{weatherIcons[weather.code] || '🌤️'}</span>
                  <span>{weather.temp}°F</span>
                </span>
              )}
            </div>
            <a href={`sms:${contact.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1.5 hover:text-slate-300 transition-colors font-medium">
              <PhoneIcon className="h-4 w-4" />
              Text: {contact.phone}
            </a>
          </div>
          {/* Mobile top bar */}
          <div className="sm:hidden flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <span>{dateStr}</span>
              {weather && (
                <span className="flex items-center gap-1">
                  <span>{weatherIcons[weather.code] || '🌤️'}</span>
                  <span>{weather.temp}°</span>
                </span>
              )}
            </div>
            <a href={`sms:${contact.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" />
              {contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Tempered Glass Header */}
      <motion.header
        className="fixed top-[36px] left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Top accent bar - thin glass line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-vurmz-teal/60 to-transparent" />

        {/* Main header glass panel - dark */}
        <motion.div
          className="relative"
          style={{
            background: scrolled
              ? 'linear-gradient(180deg, rgba(44,53,51,0.95) 0%, rgba(44,53,51,0.9) 100%)'
              : 'linear-gradient(180deg, rgba(44,53,51,0.85) 0%, rgba(44,53,51,0.8) 100%)',
          }}
        >
          {/* Glass effect layers */}
          <div
            className="absolute inset-0 backdrop-blur-2xl"
            style={{
              background: scrolled
                ? 'rgba(44,53,51,0.9)'
                : 'rgba(44,53,51,0.8)',
            }}
          />

          {/* Inner glass highlight - top edge reflection */}
          <div
            className="absolute inset-x-0 top-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 10%, rgba(106,140,140,0.4) 50%, transparent 90%)',
            }}
          />

          {/* Subtle teal tint overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(106,140,140,0.08) 0%, transparent 100%)',
            }}
          />

          {/* Content */}
          <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo with glass glow */}
              <Link href="/" className="relative group">
                <motion.div
                  className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle, rgba(106,140,140,0.15) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
                <Image
                  src={header.logoUrl}
                  alt="VURMZ LLC - Laser Engraving"
                  width={160}
                  height={45}
                  className="h-10 w-auto relative brightness-0 invert"
                  priority
                />
              </Link>

              {/* Desktop navigation - glass pills */}
              <div className="hidden md:flex items-center gap-2">
                {navigation.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="relative px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                    >
                      {/* Hover glass pill */}
                      <motion.span
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'linear-gradient(180deg, rgba(106,140,140,0.2) 0%, rgba(106,140,140,0.1) 100%)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)',
                        }}
                        layoutId="nav-pill"
                        transition={glassSpring}
                      />
                      <span className="relative">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* CTA Button - Premium glass */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Link
                    href={header.ctaLink}
                    className="relative ml-4 group"
                  >
                    <motion.div
                      className="relative px-7 py-3 rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(106,140,140,0.9) 0%, rgba(90,122,122,0.95) 100%)',
                        boxShadow: '0 4px 20px rgba(106,140,140,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      {/* Glass shine */}
                      <div
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                        }}
                      />
                      {/* Animated shine sweep */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                      />
                      <span className="relative text-white font-semibold text-sm flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        {header.ctaText}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Mobile menu button - glass */}
              <motion.button
                type="button"
                className="md:hidden relative p-3 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(180deg, rgba(106,140,140,0.2) 0%, rgba(106,140,140,0.1) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
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
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bars3Icon className="h-6 w-6 text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>

          {/* Bottom edge - subtle teal line */}
          <div
            className="absolute inset-x-0 bottom-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, rgba(106,140,140,0.3) 50%, transparent 95%)',
            }}
          />
        </motion.div>
      </motion.header>

      {/* Mobile Menu - Full glass panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              className="fixed top-[118px] left-4 right-4 z-50 rounded-3xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 25px 50px rgba(106,140,140,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {/* Inner glass highlight */}
              <div
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,1) 50%, transparent 90%)',
                }}
              />

              {/* Teal tint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(106,140,140,0.05) 0%, transparent 50%)',
                }}
              />

              <div className="relative p-6">
                <div className="flex flex-col gap-2">
                  {navigation.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="block px-5 py-4 rounded-2xl text-gray-700 font-medium hover:text-vurmz-teal transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          background: 'linear-gradient(180deg, rgba(106,140,140,0.05) 0%, transparent 100%)',
                        }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <Link
                      href={header.ctaLink}
                      className="block text-center px-6 py-4 rounded-2xl text-white font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(106,140,140,0.95) 0%, rgba(90,122,122,1) 100%)',
                        boxShadow: '0 4px 20px rgba(106,140,140,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      {header.ctaText}
                    </Link>
                  </motion.div>
                </div>

                {/* Contact info */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-200/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <a
                    href="sms:+17192573834"
                    className="flex items-center justify-center gap-2 text-vurmz-teal font-medium"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    Text: (719) 257-3834
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header + info bar */}
      <div className="h-[116px]" />
    </>
  )
}
