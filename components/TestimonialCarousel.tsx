'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { Testimonial } from '@/lib/testimonials'

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  theme: 'shop' | 'services'
  title?: string
}

const themeStyles = {
  shop: {
    card: 'bg-white/60 border border-[#235158]/8',
    quote: 'text-[#E95C4E]',
    name: 'text-[#235158]',
    role: 'text-[#6B6259]',
    dot: 'bg-[#E95C4E]',
    dotInactive: 'bg-[#235158]/15',
    arrow: 'text-[#6B6259] hover:text-[#E95C4E]',
    heading: 'text-[#235158]',
    eyebrow: 'text-[#E95C4E]',
  },
  services: {
    card: 'bg-white/[0.03] border border-white/[0.06]',
    quote: 'text-vurmz-teal',
    name: 'text-cream',
    role: 'text-gray-400',
    dot: 'bg-vurmz-teal',
    dotInactive: 'bg-white/10',
    arrow: 'text-gray-500 hover:text-vurmz-teal',
    heading: 'text-cream',
    eyebrow: 'text-vurmz-teal',
  },
}

export default function TestimonialCarousel({ testimonials, theme, title = 'What people are saying' }: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0)
  const styles = themeStyles[theme]

  const next = useCallback(() => setCurrent(i => (i + 1) % testimonials.length), [testimonials.length])
  const prev = useCallback(() => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length), [testimonials.length])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <div>
      <p className={`text-xs font-mono tracking-[0.2em] uppercase mb-4 ${styles.eyebrow}`}>Testimonials</p>
      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-8 ${styles.heading}`}>{title}</h2>

      <div className="relative max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`${styles.card} rounded-sm p-8 sm:p-10`}
          >
            <span className={`text-4xl font-serif leading-none ${styles.quote}`}>&ldquo;</span>
            <blockquote className={`text-base sm:text-lg leading-relaxed mt-2 mb-6 ${theme === 'shop' ? 'text-[#235158]' : 'text-gray-300'}`}>
              {t.quote}
            </blockquote>
            <div>
              <p className={`font-semibold text-sm ${styles.name}`}>{t.name}</p>
              {(t.role || t.location) && (
                <p className={`text-xs mt-0.5 ${styles.role}`}>
                  {[t.role, t.location].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {testimonials.length > 1 && (
          <>
            <button onClick={prev} className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 hidden sm:block ${styles.arrow} transition-colors`} aria-label="Previous testimonial">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={next} className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 hidden sm:block ${styles.arrow} transition-colors`} aria-label="Next testimonial">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? styles.dot : styles.dotInactive}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
