'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-vurmz-light border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-vurmz-sage text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <span>Serving Centennial and Denver Metro</span>
          <a href="sms:+17192573834" className="flex items-center gap-1 hover:text-vurmz-powder transition-colors">
            <PhoneIcon className="h-4 w-4" />
            Text: (719) 257-3834
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-vurmz-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/vurmz-logo-full.svg"
              alt="VURMZ LLC - Laser Engraving"
              width={180}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-vurmz-dark hover:text-vurmz-teal font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/order"
              className="bg-vurmz-teal text-white px-6 py-2.5 font-semibold hover:bg-vurmz-teal-dark transition-colors"
            >
              Start Order
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-vurmz-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-vurmz-dark hover:text-vurmz-teal font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/order"
                className="bg-vurmz-teal text-white px-6 py-2.5 font-semibold hover:bg-vurmz-teal-dark transition-colors text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Order
              </Link>
            </div>
          </div>
        )}
        </div>
      </nav>
    </header>
  )
}
