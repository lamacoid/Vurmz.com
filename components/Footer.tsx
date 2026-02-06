'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

const contact = {
  phone: '(719) 257-3834',
  email: 'zach@vurmz.com',
  city: 'Centennial',
  state: 'Colorado',
}

const header = {
  logoUrl: '/images/vurmz-logo-full.svg',
}

const quickLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Start Order', href: '/order' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const serviceAreas = [
  'Centennial', 'Greenwood Village', 'Cherry Hills', 'Highlands Ranch',
  'Lone Tree', 'Englewood', 'Littleton', 'Denver Metro',
]

export default function Footer() {
  return (
    <footer className="relative bg-[#0a1716] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src={header.logoUrl}
              alt="VURMZ"
              width={100}
              height={28}
              className="h-7 w-auto brightness-0 invert mb-4"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Laser engraving for small businesses. Branded products, tool marking, and custom goods — hand-delivered in South Denver metro.
            </p>
            <div className="space-y-2.5">
              <a
                href={`sms:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-vurmz-teal/60" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4 text-vurmz-teal/60" />
                {contact.email}
              </a>
              <span className="flex items-center gap-2.5 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4 text-vurmz-teal/60" />
                {contact.city}, {contact.state}
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Service Area</h3>
            <div className="flex flex-wrap gap-1.5">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs text-gray-500 px-2.5 py-1 rounded-full border border-white/[0.04] bg-white/[0.02]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Get Started</h3>
            <p className="text-sm text-gray-500 mb-4">
              Same-day quotes. No minimums. No obligation.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/order"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-vurmz-teal text-white text-sm font-semibold rounded-full hover:bg-vurmz-teal-dark transition-colors"
              >
                Start Your Order
              </Link>
              <a
                href={`sms:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-white/[0.08] text-gray-400 text-sm font-medium rounded-full hover:text-white hover:border-white/[0.15] transition-colors"
              >
                Text Zach
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} VURMZ LLC. {contact.city}, {contact.state}.
            </p>
            <div className="flex gap-5 text-xs">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-400 transition-colors">
                Terms
              </Link>
              <Link href="/admin/login" className="text-gray-700/50 hover:text-gray-400 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
