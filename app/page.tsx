'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Split hero */}
      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        {/* Shop side — coral/bone */}
        <Link
          href="/shop"
          className="group relative flex-1 flex items-center justify-center p-8 sm:p-12 bg-[#F0E6D3] overflow-hidden transition-all duration-500 hover:flex-[1.15]"
        >
          {/* Subtle texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative text-center max-w-sm"
          >
            <span className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-[#B16558]/20 px-3 py-1.5 rounded-sm">
              Individuals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#243B39] tracking-tight mb-4">
              Shop
            </h2>
            <p className="text-[#6B6259] text-base leading-relaxed mb-8">
              Browse engraved products with pricing up front. Pens, coasters, keychains, cards — ready to order in packs.
            </p>
            <span className="inline-flex items-center gap-2 text-[#B16558] font-semibold text-sm group-hover:gap-3 transition-all">
              Browse products
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Hover glow */}
          <div className="absolute inset-0 bg-[#B16558]/0 group-hover:bg-[#B16558]/[0.03] transition-colors duration-500 pointer-events-none" />
        </Link>

        {/* Divider — vertical on desktop, horizontal on mobile */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Desktop vertical line */}
          <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-[#243B39]/20 to-transparent" />
          {/* Mobile horizontal line */}
          <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-[#243B39]/20 to-transparent" />
          {/* Center logo */}
          <div className="absolute bg-white rounded-full p-3 shadow-lg shadow-black/10 z-20">
            <Image
              src="/images/vurmz-logo-full.svg"
              alt="VURMZ"
              width={80}
              height={22}
              className="h-5 w-auto"
              priority
            />
          </div>
        </div>

        {/* Services side — dark teal */}
        <Link
          href="/services"
          className="group relative flex-1 flex items-center justify-center p-8 sm:p-12 bg-[#243B39] overflow-hidden transition-all duration-500 hover:flex-[1.15]"
        >
          {/* Subtle ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(60, 185, 178, 0.06) 0%, transparent 60%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-center max-w-sm"
          >
            <span className="inline-block text-[#6BB8B2] text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-[#6BB8B2]/20 px-3 py-1.5 rounded-sm">
              Businesses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0E6D3] tracking-tight mb-4">
              Services
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Custom laser engraving for your business. Branded products, service tags, industrial marking. Quote-based, hand-delivered.
            </p>
            <span className="inline-flex items-center gap-2 text-[#6BB8B2] font-semibold text-sm group-hover:gap-3 transition-all">
              Get a quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          {/* Hover glow */}
          <div className="absolute inset-0 bg-[#6BB8B2]/0 group-hover:bg-[#6BB8B2]/[0.03] transition-colors duration-500 pointer-events-none" />
        </Link>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#1a2f2e] border-t border-white/10 px-4 py-3 flex justify-center gap-6 text-xs text-gray-500">
        <span>VURMZ LLC &middot; Centennial, CO</span>
        <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
      </div>
    </div>
  )
}
