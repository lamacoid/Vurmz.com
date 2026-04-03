import Link from 'next/link'
import Image from 'next/image'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { siteInfo } from '@/lib/site-info'

export default function ShopFooter() {
  return (
    <footer className="bg-[#243B39] border-t border-[#243B39]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {/* Brand */}
          <div>
            <Image
              src="/images/vurmz-logo-full.svg"
              alt="VURMZ"
              width={100}
              height={28}
              className="h-7 w-auto brightness-0 invert mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Laser engraved products, made in {siteInfo.city}, {siteInfo.state}. Hand-delivered throughout the South Denver metro.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4 text-[#6BB8B2]/60" />
                <span>{siteInfo.city}, {siteInfo.state}</span>
              </div>
              <a
                href={`tel:${siteInfo.phoneClean}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-[#6BB8B2]/60" />
                {siteInfo.phone}
              </a>
              <a
                href={`mailto:${siteInfo.email}`}
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4 text-[#6BB8B2]/60" />
                {siteInfo.email}
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="/services/portfolio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Delivery Area</h3>
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
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} {siteInfo.legalName}. {siteInfo.city}, {siteInfo.state}.
            </p>
            <div className="flex gap-5 text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
