'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioItems } from '@/lib/portfolio'
import { HERO_WORDS as WORDS } from '@/lib/hero-words'

// The fill-in-the-blank ("Let's put your ___ on something.") shares HERO_WORDS
// with the home-hero RotatingTagline so the list stays identical everywhere.

const heroBg = portfolioItems.map((i) => ({ src: i.src, alt: i.label }))

interface SiteHeroProps {
  /** Small label above the headline, e.g. "Individuals" / "Businesses". */
  eyebrow?: string
  /** Unique, descriptive H1 for this page. When set, this becomes the page's
   *  real <h1> and the rotating brand tagline is demoted to a styled <p> so
   *  every page carries its own page-specific heading for SEO. */
  heading?: string
  /** Accent for the eyebrow + rotating word. Shop = coral, Services = teal. */
  accent?: 'coral' | 'teal'
  /** The page's own background teal, so the hero dissolves into it with no seam. */
  baseColor?: string
  /** Page-specific subcopy + CTAs rendered under the shared headline. */
  children?: React.ReactNode
}

/**
 * The shared brand hero: rotating portfolio photos behind frosted teal glass,
 * with the "Let's put your ___ on something" line whose blank cycles through
 * WORDS. Used at the top of the main pages so they share one format.
 *
 * Pulls up under the fixed SiteHeader via the negative top margin.
 */
export default function SiteHero({ eyebrow, heading, accent = 'coral', baseColor = '#16525C', children }: SiteHeroProps) {
  const [bg, setBg] = useState(0)
  const [w, setW] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setBg((p) => (p + 1) % heroBg.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setW((p) => (p + 1) % WORDS.length), 2400)
    return () => clearInterval(t)
  }, [])

  const accentColor = accent === 'teal' ? '#7FCFD4' : '#C67A6F'

  // When a page-specific heading is supplied it owns the <h1>, so the rotating
  // brand tagline drops to a <p> (same big typography, just demoted in markup).
  const Tagline = heading ? motion.p : motion.h1

  return (
    <section className="relative overflow-hidden -mt-[92px] sm:-mt-[100px] pt-[108px] sm:pt-[120px] pb-8 sm:pb-10">
      {/* Rotating portfolio photos behind frosted teal glass */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        {heroBg.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
            style={{
              opacity: i === bg ? 0.4 : 0,
              filter: i === bg ? 'blur(0px)' : 'blur(8px)',
              transform: i === bg ? 'scale(1)' : 'scale(1.08)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0" style={{ backgroundColor: `${baseColor}73` }} />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: `linear-gradient(to bottom, transparent 0%, ${baseColor} 90%)` }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-mono tracking-[0.25em] uppercase mb-6 border px-3 py-1.5 rounded-sm"
            style={{ color: accentColor, borderColor: `${accentColor}4D` }}
          >
            {eyebrow}
          </motion.span>
        )}

        {heading && (
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[var(--feature-ink)] font-semibold tracking-tight text-xl sm:text-2xl mb-4"
          >
            {heading}
          </motion.h1>
        )}

        <Tagline
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[var(--feature-ink)] font-semibold tracking-tight leading-[1.05] text-2xl sm:text-3xl lg:text-4xl"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          <span className="block">Let&apos;s put your</span>
          {/* Fixed-height, full-width line: the word crossfades IN PLACE so the
              lines above and below never shift, and the word stays centered
              regardless of its length. */}
          <span className="relative block h-[1.3em] my-1">
            <AnimatePresence initial={false}>
              <motion.span
                key={WORDS[w]}
                initial={{ opacity: 0, y: '0.5em' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-0.5em' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 italic whitespace-nowrap"
                style={{ color: accentColor }}
              >
                {WORDS[w]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="block">on something.</span>
        </Tagline>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-7"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
