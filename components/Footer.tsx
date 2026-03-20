import Link from 'next/link'
import Image from 'next/image'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { siteInfo, navigation } from '@/lib/site-info'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function Footer() {
  return (
    <footer className="relative bg-[#0a1716] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/vurmz-logo-full.svg"
              alt="VURMZ"
              width={100}
              height={28}
              className="h-7 w-auto brightness-0 invert mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Laser engraving for small businesses in {siteInfo.city}, {siteInfo.state}. Branded products, industrial marking, and custom goods, hand-delivered throughout the South Denver metro.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4 text-vurmz-teal/60" />
                <span>{siteInfo.city}, {siteInfo.state}</span>
              </div>
              <a
                href={`tel:${siteInfo.phoneClean}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-vurmz-teal/60" />
                {siteInfo.phone}
              </a>
              <a
                href={`mailto:${siteInfo.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4 text-vurmz-teal/60" />
                {siteInfo.email}
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
              {siteInfo.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs text-gray-400 px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.06]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterSignup variant="compact" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs space-y-1 sm:space-y-0">
              <p>
                &copy; {new Date().getFullYear()} {siteInfo.legalName}. Based in {siteInfo.city}, {siteInfo.state}.
              </p>
              <p className="sm:hidden text-gray-700/70">
                NAP: {siteInfo.phone} | {siteInfo.city}, {siteInfo.state}
              </p>
            </div>

            <div className="flex gap-5 text-xs items-center">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <span className="text-gray-700">·</span>
              <span className="text-gray-700 italic">Powered by a complete and utter mystery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
