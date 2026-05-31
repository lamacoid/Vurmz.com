'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { siteInfo } from '@/lib/site-info'
import { aboutContent } from '@/lib/about'
import { portfolioItems } from '@/lib/portfolio'
import TrustBar from '@/components/TrustBar'
import TrustedBy from '@/components/TrustedBy'
import PortfolioPreview from '@/components/PortfolioPreview'
import ItemScroller from '@/components/ItemScroller'

const featuredWork = [
  { src: '/portfolio/denver-map-mirror-closeup.jpg', label: 'Denver Map on Mirror', context: 'Custom art piece' },
  { src: '/portfolio/culinary-cleaver-engraved.jpg', label: 'Engraved Cleaver', context: 'Custom gift' },
  { src: '/portfolio/water-bottle-full-wrap.jpg', label: 'Full-Wrap Water Bottle', context: 'Custom tumbler' },
  { src: '/portfolio/clga-faceplate-closeup.jpg', label: 'Amp Faceplate', context: 'Custom B2B piece' },
]

const heroBgImages = portfolioItems.map((item) => ({
  src: item.src,
  alt: item.label,
}))

export default function LandingPage() {
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setBgIndex((prev) => (prev + 1) % heroBgImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#1c474e] relative overflow-hidden">
      {/* Floating account link — landing has no traditional header */}
      <Link
        href="/account"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] text-gray-400 hover:text-cream transition-colors font-medium px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 backdrop-blur-sm bg-black/20"
        aria-label="Account"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Account
      </Link>
      {/* Rotating product photo background — scoped to hero area */}
      <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none select-none overflow-hidden" aria-hidden>
        {heroBgImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
            style={{
              opacity: i === bgIndex ? 0.4 : 0,
              filter: i === bgIndex ? 'blur(0px)' : 'blur(8px)',
              transform: i === bgIndex ? 'scale(1)' : 'scale(1.08)',
            }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} sizes="100vw" />
          </div>
        ))}
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-[#1c474e]/45" />
        {/* Bottom fade so the photo dissolves into the dark page below */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #1c474e 90%)' }}
        />
      </div>

      {/* Legacy blob background — kept disabled for reference */}
      <div className="hidden" aria-hidden>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#2D9E97] blur-[120px] opacity-20" style={{ animation: 'bgblob1 12s ease-in-out infinite', top: '-10%', left: '-5%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#8DCDC8] blur-[100px] opacity-15" style={{ animation: 'bgblob2 15s ease-in-out infinite', top: '20%', right: '-10%' }} />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#4AB5AE] blur-[140px] opacity-12" style={{ animation: 'bgblob3 10s ease-in-out infinite', bottom: '-20%', left: '30%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#1F7872] blur-[90px] opacity-20" style={{ animation: 'bgblob4 14s ease-in-out infinite', top: '40%', left: '10%' }} />
        <div className="absolute w-[550px] h-[550px] rounded-full bg-[#6BB8B2] blur-[110px] opacity-15" style={{ animation: 'bgblob5 11s ease-in-out infinite', top: '10%', right: '20%' }} />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#347D77] blur-[100px] opacity-18" style={{ animation: 'bgblob6 13s ease-in-out infinite', bottom: '10%', right: '-5%' }} />
        <style>{`
          @keyframes bgblob1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(80px, 60px) scale(1.15); }
            66% { transform: translate(-40px, -30px) scale(0.9); }
          }
          @keyframes bgblob2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-60px, 40px) scale(1.1); }
            66% { transform: translate(50px, -50px) scale(0.85); }
          }
          @keyframes bgblob3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(50px, -40px) scale(0.9); }
            66% { transform: translate(-70px, 30px) scale(1.2); }
          }
          @keyframes bgblob4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-50px, -30px) scale(1.15); }
            66% { transform: translate(40px, 50px) scale(0.9); }
          }
          @keyframes bgblob5 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(60px, -45px) scale(1.1); }
            66% { transform: translate(-35px, 35px) scale(0.95); }
          }
          @keyframes bgblob6 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-45px, 50px) scale(0.85); }
            66% { transform: translate(55px, -40px) scale(1.15); }
          }
        `}</style>
      </div>

      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center pt-12 sm:pt-16 pb-6 sm:pb-8 px-4"
      >
        <div className="relative h-14 sm:h-18 mx-auto mb-4 w-[280px]">
          {/* Animated gradient visible only through the logo shape */}
          <div className="relative" style={{ WebkitMaskImage: 'url(/images/vurmz-logo-text.png)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(/images/vurmz-logo-text.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}>
            <div className="h-14 sm:h-18 w-full relative overflow-hidden">
              {/* Overlapping blurred blobs that drift */}
              <div className="absolute w-24 h-24 rounded-full bg-[#2D9E97] blur-[30px] opacity-80" style={{ animation: 'blob1 7s ease-in-out infinite', top: '-20%', left: '0%' }} />
              <div className="absolute w-20 h-20 rounded-full bg-[#8DCDC8] blur-[25px] opacity-80" style={{ animation: 'blob2 9s ease-in-out infinite', top: '-10%', left: '30%' }} />
              <div className="absolute w-28 h-28 rounded-full bg-[#4AB5AE] blur-[35px] opacity-70" style={{ animation: 'blob3 6s ease-in-out infinite', top: '-30%', left: '55%' }} />
              <div className="absolute w-20 h-20 rounded-full bg-[#A8DDD9] blur-[28px] opacity-80" style={{ animation: 'blob4 8s ease-in-out infinite', top: '0%', left: '75%' }} />
              <div className="absolute w-16 h-16 rounded-full bg-[#3A8A84] blur-[22px] opacity-90" style={{ animation: 'blob5 10s ease-in-out infinite', top: '-15%', left: '15%' }} />
              <div className="absolute w-22 h-22 rounded-full bg-[#5FBFB8] blur-[30px] opacity-70" style={{ animation: 'blob6 7.5s ease-in-out infinite', top: '-25%', left: '45%' }} />
              <div className="absolute w-18 h-18 rounded-full bg-[#1F7872] blur-[26px] opacity-80" style={{ animation: 'blob1 8.5s ease-in-out infinite reverse', top: '-5%', left: '60%' }} />
              <div className="absolute w-24 h-24 rounded-full bg-[#B5E5E1] blur-[32px] opacity-60" style={{ animation: 'blob3 9.5s ease-in-out infinite reverse', top: '-15%', left: '10%' }} />
              <div className="absolute w-16 h-16 rounded-full bg-[#6BB8B2] blur-[24px] opacity-90" style={{ animation: 'blob5 6.5s ease-in-out infinite reverse', top: '-25%', left: '40%' }} />
              <div className="absolute w-20 h-20 rounded-full bg-[#347D77] blur-[28px] opacity-75" style={{ animation: 'blob2 11s ease-in-out infinite reverse', top: '0%', left: '80%' }} />
            </div>
          </div>
          <style>{`
            @keyframes blob1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(40px, 10px) scale(1.2); }
              66% { transform: translate(-20px, -5px) scale(0.9); }
            }
            @keyframes blob2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-30px, 8px) scale(1.1); }
              66% { transform: translate(25px, -10px) scale(0.85); }
            }
            @keyframes blob3 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(20px, -12px) scale(0.9); }
              66% { transform: translate(-35px, 6px) scale(1.15); }
            }
            @keyframes blob4 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-25px, -8px) scale(1.1); }
              66% { transform: translate(15px, 12px) scale(0.95); }
            }
            @keyframes blob5 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(35px, -6px) scale(1.15); }
              66% { transform: translate(-15px, 8px) scale(0.9); }
            }
            @keyframes blob6 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(-20px, 10px) scale(0.85); }
              66% { transform: translate(30px, -8px) scale(1.2); }
            }
          `}</style>
        </div>
        <h1 className="sr-only">VURMZ — Laser Engraving in {siteInfo.address}</h1>
        <p className="text-gray-400 text-sm sm:text-base tracking-wide">
          Laser Engraving &middot; {siteInfo.address}
        </p>
      </motion.div>

      {/* Split chooser */}
      <div className="relative z-10 flex flex-col md:flex-row gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pb-3 max-w-6xl mx-auto w-full">
        {/* Shop side — coral/bone */}
        <Link
          href="/shop"
          className="group relative flex-1 flex items-center justify-center p-6 sm:p-8 min-h-[200px]"
        >
          {/* Pure radial wash — no container shape */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(ellipse 50% 55% at center, rgba(240, 230, 211, 0.28) 0%, transparent 75%)',
              opacity: 0.9,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-center max-w-sm"
          >
            <span className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-5 border border-[#B16558]/20 px-3 py-1.5 rounded-sm">
              Individuals
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0E6D3] tracking-tight mb-3">Shop</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Engraved gifts, personalized knives, custom coasters, home decor. Pricing up front.
            </p>
            <span className="inline-flex items-center gap-2 text-[#B16558] font-semibold text-sm group-hover:gap-3 transition-all">
              Browse products
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </Link>

        {/* Services side — dark teal */}
        <Link
          href="/services"
          className="group relative flex-1 flex items-center justify-center p-6 sm:p-8 min-h-[200px]"
        >
          {/* Pure radial wash — no container shape */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(ellipse 50% 55% at center, rgba(36, 59, 57, 0.45) 0%, transparent 75%), radial-gradient(ellipse 30% 35% at center, rgba(107, 184, 178, 0.20) 0%, transparent 75%)',
              opacity: 0.9,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative text-center max-w-sm"
          >
            <span className="inline-block text-[#6BB8B2] text-xs font-mono tracking-[0.25em] uppercase mb-5 border border-[#6BB8B2]/20 px-3 py-1.5 rounded-sm">
              Businesses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0E6D3] tracking-tight mb-3">Services</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Branded products, service tags, industrial marking. Custom work, quote-based, hand-delivered.
            </p>
            <span className="inline-flex items-center gap-2 text-[#6BB8B2] font-semibold text-sm group-hover:gap-3 transition-all">
              Get a quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </Link>
      </div>

      {/* Trust bar */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-3">
        <TrustBar theme="landing" variant="inline" />
      </div>

      {/* Trusted By */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4">
        <TrustedBy theme="landing" />
      </div>

      {/* What I engrave — scrolling marquee (landing only) */}
      <section className="relative z-10 py-8 sm:py-10 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-5">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.25em] uppercase mb-2">What I engrave</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight">Name it. I&apos;ll mark it.</h2>
        </div>
        <div className="relative pointer-events-none select-none" style={{ margin: '0 -20px' }}>
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #1c474e, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #1c474e, transparent)' }} />
          <ItemScroller opacityScale={0.4} />
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-8 sm:py-12 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">Portfolio</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-8">Recent Work</h2>
          </motion.div>
          <PortfolioPreview items={featuredWork} theme="landing" linkTo="/services/portfolio" />
        </div>
      </section>

      {/* Brand story teaser */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image src={aboutContent.image} alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,47,46,0.6) 0%, transparent 100%)' }} />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-cream/60 tracking-wider uppercase">{siteInfo.founder.name} &middot; Owner</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">Who I Am</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                One person, start to finish.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-6">{aboutContent.intro}</p>
              <Link href="/about" className="inline-flex items-center gap-2 text-vurmz-teal font-semibold text-sm hover:gap-3 transition-all">
                About VURMZ
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-4 py-3 flex justify-center gap-6 text-xs text-gray-500">
        <span>{siteInfo.legalName} &middot; {siteInfo.address}</span>
        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
      </div>
    </div>
  )
}
