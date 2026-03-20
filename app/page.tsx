'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState as useStateHook, useEffect as useEffectHook, useCallback } from 'react'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import NewsletterSignup from '@/components/NewsletterSignup'
import ItemScroller from '@/components/ItemScroller'
import { portfolioItems } from '@/lib/portfolio'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const heroImages = portfolioItems.map((item) => ({
  src: item.src,
  alt: item.label,
}))


const heroWords = [
  { text: 'your name', on: 'something', color: 'text-vurmz-teal' },
  { text: 'your brand', on: 'something', color: 'text-vurmz-cta' },
  { text: 'a memory', on: 'something', color: 'text-vurmz-teal' },
  { text: 'your logo', on: 'something', color: 'text-vurmz-cta' },
  { text: 'something permanent', on: 'something', color: 'text-vurmz-teal' },
  { text: 'your brand', on: 'their hand', color: 'text-vurmz-cta', note: 'customized pens', connector: 'in' },
  { text: 'your mark', on: 'something', color: 'text-vurmz-cta' },
  { text: 'your business card', on: 'metal', color: 'text-vurmz-cta', note: 'metal business cards' },
  { text: 'your favorite thing', on: 'your other favorite thing', color: 'text-vurmz-teal' },
  { text: 'your socials', on: 'something', color: 'text-vurmz-cta' },
  { text: 'something ', on: 'your thing', color: 'text-vurmz-teal' },
  { text: 'your name', on: 'your work', color: 'text-vurmz-cta', note: 'stainless steel & anodized aluminum service/maintenance tags' },
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useStateHook(0)
  const [wordIndex, setWordIndex] = useStateHook(0)
  const [jitter, setJitter] = useStateHook(false)

  useEffectHook(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const cycleWord = useCallback(() => {
    setJitter(true)
    setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length)
      setJitter(false)
    }, 200)
  }, [])

  useEffectHook(() => {
    const interval = setInterval(cycleWord, 5000)
    return () => clearInterval(interval)
  }, [cycleWord])

  return (
    <div className="bg-vurmz-dark">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 flex items-center overflow-hidden">
        {/* Cycling portfolio background */}
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
            style={{
              opacity: i === heroIndex ? 0.15 : 0,
              filter: i === heroIndex ? 'blur(0px) hue-rotate(0deg)' : 'blur(8px) hue-rotate(30deg)',
              transform: i === heroIndex ? 'scale(1)' : 'scale(1.1)',
            }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
          </div>
        ))}
        <div className="absolute inset-0 bg-vurmz-dark/70" />

        {/* Glassy glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
          }}
        />
        <div
          className="absolute top-0 left-[20%] w-[60%] h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-block text-vurmz-teal text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-vurmz-teal/20 px-3 py-1.5 rounded-sm">
                Laser Engraving &middot; {siteInfo.city}, {siteInfo.stateAbbr}
              </span>
            </motion.div>

            {/* Heading — massive, high contrast */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream tracking-tight leading-[0.95] mb-6 min-h-[4.5em] sm:min-h-[3.5em] lg:min-h-[3em]"
            >
              Let&apos;s put <span className={`inline-block transition-all duration-200 ${heroWords[wordIndex].color} ${jitter ? 'translate-x-[2px] translate-y-[-1px] blur-[0.5px]' : ''}`}>{heroWords[wordIndex].text}</span> {heroWords[wordIndex].connector || 'on'} <span className={`inline-block transition-all duration-200 ${jitter ? 'translate-x-[-1px] translate-y-[1px] blur-[0.5px]' : ''}`}>{heroWords[wordIndex].on}</span>.
              {heroWords[wordIndex].note && (
                <span className="block text-sm font-normal text-gray-500 mt-2 tracking-normal leading-normal italic">
                  {heroWords[wordIndex].note}
                </span>
              )}
            </motion.h1>

            {/* Sub — restrained, high legibility */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              Laser engraving for restaurants, contractors, corporate teams, and small businesses across the South Denver metro. Small batches, same-week turnaround, hand-delivered to your door.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cta text-white font-semibold text-base rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                Get a Quote
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getSmsLink()}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-vurmz-cream text-vurmz-dark font-semibold text-base rounded-sm hover:bg-vurmz-cream-hover transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT I DO — scrolling items ═══════════ */}
      <section className="relative py-12 sm:py-16 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight">
            The possibilities are endless.
          </h2>
        </div>

        <div className="relative pointer-events-none select-none" style={{ margin: '0 -20px' }}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

          <ItemScroller />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                I keep a small selection of items ready to engrave, but your business is unique. If you have something specific in mind, message me and we&apos;ll figure it out together.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
                >
                  View pricing
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wide hover:text-cream transition-colors group"
                >
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  Text me
                </a>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-5">
              <p className="text-sm font-semibold text-cream mb-1">Do you hand out a lot of pens?</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                I can set up recurring orders so you never run out. I&apos;ll keep your stock fresh and deliver on schedule.
              </p>
              <a
                href={getSmsLink("I'm interested in recurring orders")}
                className="inline-flex items-center gap-1.5 text-xs text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
              >
                Tell me more
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <section className="py-8 sm:py-10 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-5 text-center">
            Trusted by
          </p>
        </div>
        <div className="relative">
          <div className="flex items-center justify-center gap-12 sm:gap-16 logo-scroll">
            <a href="http://nordstrom.com/store/cherry-creek" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-sm font-medium text-cream/40 hover:text-cream/60 transition-colors">
              Nordstrom Beauty
            </a>
            <a href="http://countylineguitaramps.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-opacity">
              <Image
                src="/images/clients/county-line-guitar-amps.svg"
                alt="County Line Guitar Amps"
                width={120}
                height={36}
                className="opacity-40 brightness-0 invert"
              />
            </a>
            {/* Add more logos here — once there are enough, the row will scroll automatically */}
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT (two-column) ═══════════ */}
      <section className="relative py-12 sm:py-16">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/zach.jpeg"
                alt={`${siteInfo.founder.name}, owner of VURMZ`}
                fill
                className="object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(26,47,46,0.6) 0%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-cream/60 tracking-wider uppercase">
                  {siteInfo.founder.name} &middot; Owner
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
                Who I Am
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                No department.
                <br />
                <span className="text-gray-500">Just me.</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. I live here, I work here, and I deliver to Centennial, Lone Tree, Highlands Ranch, and everywhere in between. You text me, I quote you in minutes, and I handle your job personally.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SAMPLES ═══════════ */}
      <section className="relative py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
              <Image
                src="/portfolio/clga-faceplate-standing.jpg"
                alt="Sample engraved faceplate"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
                Before You Commit
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                I&apos;ll make you samples first.
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-6">
                Every material reacts differently to the laser. Before I run your full order, I&apos;ll engrave a few test pieces so you can see exactly how your design looks on the real thing. We dial in fonts, depth, and spacing until it&apos;s right.
              </p>
              <a
                href={getSmsLink("I'd like to see some samples")}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text me for samples
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ NEWSLETTER ═══════════ */}
      <NewsletterSignup variant="full" />
    </div>
  )
}
