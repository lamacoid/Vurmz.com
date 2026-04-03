'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

const shopNav = [
  { name: 'Products', href: '/shop' },
  { name: 'Contact', href: '/shop/contact' },
]

export default function ShopHeader() {
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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F0E6D3]/95 backdrop-blur-2xl border-b border-[#243B39]/10 shadow-sm'
            : 'bg-[#F0E6D3]'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/shop" className="flex-shrink-0">
              <Image
                src="/images/vurmz-logo-full.svg"
                alt="VURMZ"
                width={120}
                height={32}
                className="h-7 sm:h-8 w-auto"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {shopNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-[#6B6259] hover:text-[#B16558] rounded-full transition-colors duration-200 hover:bg-[#243B39]/[0.04]"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/services"
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#7A7068] hover:text-[#6BB8B2] rounded-full transition-colors duration-200"
              >
                Business Services
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={getSmsLink()}
                className="text-[13px] text-[#6B6259] hover:text-[#243B39] transition-colors font-medium flex items-center gap-1.5"
              >
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                {siteInfo.phone}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 -mr-2 rounded-full hover:bg-[#243B39]/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-[#243B39]" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-[#5C534A]" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-[64px] left-3 right-3 z-50 bg-[#F0E6D3] border border-[#243B39]/10 rounded-2xl shadow-2xl shadow-black/10 p-5">
            <div className="flex flex-col gap-1">
              {shopNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-[#5C534A] font-medium hover:text-[#B16558] hover:bg-[#243B39]/[0.04] rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/services"
                className="px-4 py-3 text-[#7A7068] font-medium hover:text-[#6BB8B2] hover:bg-[#243B39]/[0.04] rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Business Services
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-[#243B39]/10">
              <a
                href={getSmsLink()}
                className="flex items-center justify-center gap-2 text-[#6B6259] hover:text-[#243B39] transition-colors text-sm py-2"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
