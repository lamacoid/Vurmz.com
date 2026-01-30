'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

const giftNav = [
  { name: 'Weddings', href: '#wedding-party' },
  { name: 'Favors', href: '#favors' },
  { name: 'Premium', href: '#premium' },
]

function GiftsHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F7]/95 backdrop-blur-md border-b border-[#E8E0D8]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/gifts" className="flex items-center gap-2">
            <span className="text-xl font-medium text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              VURMZ
            </span>
            <span className="text-xs text-[#A08060] tracking-wider uppercase">Gifts</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {giftNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-[#6B5A48] hover:text-[#3D3428] transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/"
              className="text-sm text-[#A08060] hover:text-[#3D3428] transition-colors"
            >
              Business →
            </Link>
          </nav>

          {/* CTA */}
          <a
            href={getSmsLink('Hi! I\'m interested in custom gifts.')}
            className="hidden md:inline-flex px-5 py-2 bg-[#3D3428] text-white text-sm rounded-full hover:bg-[#2D2418] transition-all"
          >
            Text me
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#3D3428]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8E0D8]">
            <div className="flex flex-col gap-4">
              {giftNav.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#6B5A48] hover:text-[#3D3428]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Link
                href="/"
                className="text-[#A08060] hover:text-[#3D3428]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Business Services →
              </Link>
              <a
                href={getSmsLink('Hi! I\'m interested in custom gifts.')}
                className="inline-flex justify-center px-5 py-2 bg-[#3D3428] text-white text-sm rounded-full"
              >
                Text {siteInfo.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function GiftsFooter() {
  return (
    <footer className="bg-[#F5EDE6] border-t border-[#E0D6C8]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#3D3428] font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              VURMZ Gifts
            </p>
            <p className="text-sm text-[#6B5A48]/70 mt-1">
              Custom engraved gifts in {siteInfo.city}, {siteInfo.state}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href={getSmsLink()} className="text-[#6B5A48] hover:text-[#3D3428] transition-colors">
              {siteInfo.phone}
            </a>
            <a href={`mailto:${siteInfo.email}`} className="text-[#6B5A48] hover:text-[#3D3428] transition-colors">
              {siteInfo.email}
            </a>
          </div>

          <Link
            href="/"
            className="text-sm text-[#A08060] hover:text-[#3D3428] transition-colors"
          >
            vurmz.com →
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E0D6C8] text-center">
          <p className="text-xs text-[#6B5A48]/50">
            © {new Date().getFullYear()} {siteInfo.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function GiftsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F7]">
      <GiftsHeader />
      <main className="flex-1">{children}</main>
      <GiftsFooter />
    </div>
  )
}
