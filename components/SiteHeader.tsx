'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import CartButton from '@/components/shop/CartButton'

const NAV_LINKS = [
  // Pricing lives ON the services page now — no separate nav item.
  { label: 'Shop', href: '/shop' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/services/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/services/contact' },
]

export default function SiteHeader({ variant = 'services' }: { variant?: 'shop' | 'services' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isShop = variant === 'shop'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Shop now shares the landing/services dark teal scheme, but keeps its coral accent.
  const headerBg = isShop
    ? scrolled ? 'bg-[#16525C]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/10' : 'bg-transparent'
    : scrolled ? 'bg-[#16525C]/90 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/10' : 'bg-transparent'

  const textColor = isShop ? 'text-gray-300' : 'text-gray-400'
  const hoverColor = isShop ? 'hover:text-[#C67A6F]' : 'hover:text-vurmz-cta'
  const logoFilter = 'brightness-0 invert'
  const logoSrc = '/images/vurmz-logo-full.svg'

  const mobileBg = isShop ? 'bg-[#102f33] border-white/10' : 'bg-[#162524] border-white/10'
  const mobileText = isShop ? 'text-gray-300' : 'text-gray-300'
  const mobileHover = isShop ? 'hover:text-[#C67A6F] hover:bg-white/[0.06]' : 'hover:text-vurmz-cta hover:bg-white/[0.06]'
  const menuIcon = isShop ? 'text-gray-300' : 'text-gray-300'

  return (
    <>
      <header className={`fixed top-7 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[72px]">
            <Link href="/" className="flex-shrink-0">
              <Image src={logoSrc} alt="VURMZ" width={120} height={32} className={`h-7 sm:h-8 w-auto ${logoFilter}`} priority />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-[13px] font-medium ${textColor} ${hoverColor} rounded-full transition-colors duration-200`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {isShop && <CartButton />}
              <Link
                href="/account"
                className={`inline-flex items-center gap-1.5 text-[13px] ${textColor} ${hoverColor} transition-colors font-medium`}
                aria-label="Account"
              >
                <UserIcon className="w-4 h-4" />
                <span>Account</span>
              </Link>
              <a
                href={getSmsLink()}
                aria-label={`Text ${siteInfo.phone}`}
                className="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0B93F6] hover:bg-[#0A84FF] pl-2.5 pr-3.5 py-1.5 text-[13px] font-semibold text-white shadow-sm shadow-black/20 transition-colors"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                {siteInfo.phone}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 -mr-2 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className={`h-5 w-5 ${menuIcon}`} />
              ) : (
                <Bars3Icon className={`h-5 w-5 ${menuIcon}`} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className={`fixed top-[92px] left-3 right-3 z-50 ${mobileBg} border rounded-2xl shadow-2xl p-5 max-h-[calc(100vh-108px)] overflow-y-auto`}>
            <div className="flex flex-col gap-1 mb-3 pb-3 border-b border-white/10">
              <Link
                href="/account"
                className={`px-4 py-3 ${mobileText} font-medium ${mobileHover} rounded-xl transition-colors flex items-center gap-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className="w-4 h-4" />
                Account
              </Link>
              {isShop && (
                <div className={`px-4 py-3 ${mobileText} font-medium ${mobileHover} rounded-xl transition-colors`}>
                  <CartButton />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 ${mobileText} font-medium ${mobileHover} rounded-xl transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href={getSmsLink()}
                className={`flex items-center justify-center gap-2 ${textColor} text-sm py-2`}
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-[92px] sm:h-[100px]" />
    </>
  )
}
