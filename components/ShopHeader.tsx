'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

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
        className={`sticky top-7 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F0E6D3]/95 backdrop-blur-2xl border-b border-[#243B39]/10 shadow-sm'
            : 'bg-[#F0E6D3]'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[72px]">
            <Link href="/" className="flex-shrink-0">
              <Image src="/images/vurmz-logo-full-teal.svg" alt="VURMZ" width={120} height={32} className="h-7 sm:h-8 w-auto" priority />
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-[13px] font-medium text-[#7A7068] hover:text-[#6BB8B2] transition-colors">
                Business Services
              </Link>
              <a
                href={getSmsLink("Hi, I'd like to get something engraved")}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#6BB8B2] text-white font-semibold text-[13px] rounded-sm hover:bg-[#4A9D97] transition-colors"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text me — {siteInfo.phone}
              </a>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3 -mr-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#243B39]/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 text-[#243B39]" />
                ) : (
                  <Bars3Icon className="h-5 w-5 text-[#5C534A]" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-[92px] left-3 right-3 z-50 bg-[#F0E6D3] border border-[#243B39]/10 rounded-2xl shadow-2xl shadow-black/10 p-5">
            <div className="flex flex-col gap-2">
              <Link href="/services" className="px-4 py-3 text-[#7A7068] font-medium hover:text-[#6BB8B2] rounded-xl transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Business Services
              </Link>
              <div className="border-t border-[#243B39]/8 my-1 mx-4" />
              <a
                href={getSmsLink("Hi, I'd like to get something engraved")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#6BB8B2] text-white font-semibold text-sm rounded-xl"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text me — {siteInfo.phone}
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
