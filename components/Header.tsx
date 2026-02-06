'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { siteInfo, navigation, getSmsLink } from '@/lib/site-info'

const header = {
  logoUrl: '/images/vurmz-logo-full.svg',
  ctaText: 'Start Order',
  ctaLink: '/order',
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f1f1e]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={header.logoUrl}
                alt="VURMZ"
                width={120}
                height={32}
                className="h-7 sm:h-8 w-auto brightness-0 invert"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-gray-400 hover:text-white rounded-full transition-colors duration-200 hover:bg-white/[0.06]"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={getSmsLink()}
                className="text-[13px] text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-1.5"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                {siteInfo.phone}
              </a>
              <Link
                href={header.ctaLink}
                className="px-4 py-2 bg-vurmz-teal text-white font-semibold text-[13px] rounded-full hover:bg-vurmz-teal-dark transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-vurmz-teal/20"
              >
                {header.ctaText}
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-white" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-[64px] left-3 right-3 z-50 bg-[#162524] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 p-5 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-gray-300 font-medium hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-3">
              <Link
                href={header.ctaLink}
                className="px-6 py-3 bg-vurmz-teal text-white font-semibold rounded-xl text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {header.ctaText}
              </Link>
              <a
                href={getSmsLink()}
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm py-2"
              >
                <PhoneIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-16 sm:h-[72px]" />
    </>
  )
}
