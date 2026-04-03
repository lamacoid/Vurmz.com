'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a2f2e] flex items-center justify-center">
      <div className="text-center px-4">
        <Image
          src="/images/vurmz-logo-full.svg"
          alt="VURMZ"
          width={180}
          height={48}
          className="h-12 w-auto mx-auto mb-12 brightness-0 invert"
          priority
        />
        <p className="text-gray-400 text-sm mb-10">Choose your experience</p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/shop"
            className="px-10 py-5 bg-white/10 border border-white/20 text-cream rounded-sm hover:bg-white/20 transition-all text-lg font-semibold"
          >
            Shop
          </Link>
          <Link
            href="/services"
            className="px-10 py-5 bg-white/10 border border-white/20 text-cream rounded-sm hover:bg-white/20 transition-all text-lg font-semibold"
          >
            Services
          </Link>
        </div>
      </div>
    </div>
  )
}
