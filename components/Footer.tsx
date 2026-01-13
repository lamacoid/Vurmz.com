import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'

const serviceAreas = [
  'Centennial',
  'Greenwood Village',
  'Cherry Hills Village',
  'Highlands Ranch',
  'Lone Tree',
  'Englewood',
  'Littleton',
  'Denver Metro',
]

export default function Footer() {
  return (
    <footer className="bg-vurmz-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/vurmz-logo-full.svg"
                alt="VURMZ LLC"
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6">
              High quality laser engraving for small businesses in Centennial and the Denver metro area.
              I believe in helping local businesses first.
            </p>
            <div className="flex flex-col gap-3 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-vurmz-teal" />
                <span>Centennial, Colorado</span>
              </div>
              <a href="sms:+17192573834" className="flex items-center gap-2 hover:text-white transition-colors">
                <PhoneIcon className="h-5 w-5 text-vurmz-powder" />
                <span>Text: (719) 257-3834</span>
              </a>
              <a href="mailto:zach@vurmz.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <EnvelopeIcon className="h-5 w-5 text-vurmz-teal" />
                <span>zach@vurmz.com</span>
              </a>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-vurmz-teal" />
                <span>Flexible hours for local businesses</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-400 hover:text-white transition-colors">
                  Start Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Why VURMZ */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Why VURMZ?</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Same-day turnaround</li>
              <li>No minimum orders</li>
              <li>Direct owner communication</li>
              <li>Local pickup and delivery</li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Service Area</h3>
            <ul className="space-y-2 text-gray-400">
              {serviceAreas.map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-vurmz-teal rounded-full" />
                  {area}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Based in south suburban Denver
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} VURMZ LLC. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
