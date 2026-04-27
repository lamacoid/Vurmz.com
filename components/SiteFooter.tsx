import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

const PRODUCTS = [
  { label: 'Gifts', href: '/shop/gifts' },
  { label: 'Knives', href: '/shop/knives' },
  { label: 'Tumblers', href: '/shop/tumblers' },
  { label: 'Coasters', href: '/shop/coasters' },
  { label: 'Keychains', href: '/shop/keychains' },
  { label: 'Art & Decor', href: '/shop/decor' },
  { label: 'Devices', href: '/shop/devices' },
]

const BUSINESS = [
  { label: 'Pricing', href: '/services/pricing' },
  { label: 'Portfolio', href: '/services/portfolio' },
  { label: 'Materials', href: '/services/materials' },
  { label: 'Contact', href: '/services/contact' },
]

const ABOUT = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function SiteFooter() {
  return (
    <footer className="bg-[#0a1716] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/images/vurmz-logo-full.svg"
              alt="VURMZ"
              width={100}
              height={28}
              className="h-7 w-auto brightness-0 invert mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Laser engraving in {siteInfo.city}, {siteInfo.state}. Hand-delivered across the South Denver metro.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4 text-vurmz-teal/60 flex-shrink-0" />
                {siteInfo.city}, {siteInfo.state}
              </div>
              <a href={getSmsLink()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <PhoneIcon className="w-4 h-4 text-vurmz-teal/60 flex-shrink-0" />
                {siteInfo.phone}
              </a>
              <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <EnvelopeIcon className="w-4 h-4 text-vurmz-teal/60 flex-shrink-0" />
                {siteInfo.email}
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2">
              {PRODUCTS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Business</h3>
            <ul className="space-y-2">
              {BUSINESS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Service Area */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2 mb-6">
              {ABOUT.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Service Area</h3>
            <div className="flex flex-wrap gap-1">
              {siteInfo.serviceAreas.map((area) => (
                <span key={area} className="text-[10px] text-gray-500 px-2 py-0.5 rounded-full border border-white/[0.06]">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slogan */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-vurmz-teal text-sm sm:text-base font-semibold tracking-wide italic">
            Let&apos;s Put Your Name On Something.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} {siteInfo.legalName} &middot; {siteInfo.city}, {siteInfo.state}
            </p>
            <div className="flex gap-4 text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
