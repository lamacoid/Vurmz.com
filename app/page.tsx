'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import NewsletterSignup from '@/components/NewsletterSignup'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

export default function Home() {
  return (
    <div className="bg-vurmz-dark">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 flex items-center overflow-hidden">
        {/* Raw texture — concrete grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Refined — clean diagonal accent line */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 49.5%, rgba(60,185,178,0.07) 49.5%, rgba(60,185,178,0.07) 50.5%, transparent 50.5%)',
          }}
        />

        {/* Subtle teal glow from bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(60,185,178,0.08) 0%, transparent 70%)',
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
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[0.95] mb-6"
            >
              Let&apos;s put <span className="text-vurmz-teal">your name</span> on something<Link href="/laser-sim.html" className="inline-block w-[0.3em] h-[0.3em] rounded-full bg-white/80 hover:bg-vurmz-teal hover:shadow-[0_0_8px_rgba(60,185,178,0.6)] transition-all duration-300 align-baseline translate-y-[-0.15em] ml-[0.05em] cursor-default" aria-label="Secret simulator" />
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-gray-300 font-medium text-base rounded-sm hover:bg-white/5 hover:border-white/25 hover:text-white transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SERVICES + CTA (two-column) ═══════════ */}
      <section className="relative py-12 sm:py-16 border-t border-white/[0.06]">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.015) 100%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Left — What I Do */}
            <div>
              <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-6">
                What I Do
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
                {['Pens', 'Business Cards', 'Labels', 'Knives', 'Coasters', 'Keychains'].map((item) => (
                  <span
                    key={item}
                    className="text-lg sm:text-xl lg:text-2xl font-light text-white/80 hover:text-vurmz-teal transition-colors duration-300 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                I keep a small selection of items ready to engrave, but your business is unique. If you have something specific in mind, message me and we&apos;ll figure it out together.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-white transition-colors group"
                >
                  View pricing
                  <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wide hover:text-white transition-colors group"
                >
                  <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                  Text me
                </a>
              </div>
            </div>

            {/* Right — CTA */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-3">
                  Trusted by
                </p>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-white/50">Nordstrom Beauty</span>
                  <Image
                    src="/images/clients/county-line-guitar-amps.svg"
                    alt="County Line Guitar Amps"
                    width={120}
                    height={36}
                    className="opacity-50 brightness-0 invert"
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
                Let&apos;s work together, {siteInfo.city}.
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
                >
                  Get a Quote
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-gray-300 font-medium text-sm rounded-sm hover:bg-white/5 hover:border-white/25 hover:text-white transition-all"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Text {siteInfo.phone}
                </a>
              </div>
            </div>
          </motion.div>
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
                <span className="text-xs font-mono text-white/60 tracking-wider uppercase">
                  {siteInfo.founder.name} &middot; Owner
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
                Who I Am
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-4">
                No department.
                <br />
                <span className="text-gray-500">Just me.</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed">
                I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. I live here, I work here, and I deliver here — Centennial, Lone Tree, Highlands Ranch, and everywhere in between. You text me, I quote you in minutes, and I handle your job personally. No middlemen, no runaround.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ NEWSLETTER ═══════════ */}
      <NewsletterSignup variant="full" />
    </div>
  )
}
