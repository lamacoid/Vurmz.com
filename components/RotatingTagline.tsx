'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HERO_WORDS } from '@/lib/hero-words'

/**
 * The "Let's put your ___ on something." line whose blank crossfades through
 * HERO_WORDS in place (so the lines above/below never shift). Standalone so the
 * home landing hero can use it under the animated logo; SiteHero has its own
 * copy wired into its larger layout.
 */
export default function RotatingTagline({
  accentColor = '#C67A6F',
  className = '',
  inline = false,
}: {
  /** Color of the rotating word. */
  accentColor?: string
  /** Typography/spacing for the whole line (size, color, margins). */
  className?: string
  /** One-plane variant: the whole tagline on a single line. The blank is
   *  sized to the widest word so the sentence never shifts as words cycle,
   *  which makes it read like a real fill-in-the-blank. */
  inline?: boolean
}) {
  const [w, setW] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setW((p) => (p + 1) % HERO_WORDS.length), 2400)
    return () => clearInterval(t)
  }, [])

  if (inline) {
    return (
      <span className={className} style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
        Let&apos;s put your{' '}
        <span className="relative inline-grid align-baseline text-center">
          {/* Invisible sizer: the widest word reserves the slot. */}
          <span className="invisible whitespace-nowrap italic col-start-1 row-start-1" aria-hidden>
            kid&apos;s drawing
          </span>
          <AnimatePresence initial={false}>
            <motion.span
              key={HERO_WORDS[w]}
              initial={{ opacity: 0, y: '0.4em' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-0.4em' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="col-start-1 row-start-1 italic whitespace-nowrap"
              style={{ color: accentColor }}
            >
              {HERO_WORDS[w]}
            </motion.span>
          </AnimatePresence>
        </span>{' '}
        on something.
      </span>
    )
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`font-semibold tracking-tight leading-[1.05] ${className}`}
      style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
    >
      <span className="block">Let&apos;s put your</span>
      <span className="relative block h-[1.3em] my-1">
        <AnimatePresence initial={false}>
          <motion.span
            key={HERO_WORDS[w]}
            initial={{ opacity: 0, y: '0.5em' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-0.5em' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 italic whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {HERO_WORDS[w]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="block">on something.</span>
    </motion.p>
  )
}
