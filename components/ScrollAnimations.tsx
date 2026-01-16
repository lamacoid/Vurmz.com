'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView, MotionValue } from 'framer-motion'

// Fade up on scroll into view
export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = ''
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale up dramatically on scroll
export function ScaleIn({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from side
export function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  className = ''
}: {
  children: ReactNode
  direction?: 'left' | 'right'
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const x = direction === 'left' ? -100 : 100

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = ''
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax effect - moves slower/faster than scroll
export function Parallax({
  children,
  speed = 0.5,
  className = ''
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Text reveal - words fade in one by one
export function TextReveal({
  text,
  className = ''
}: {
  text: string
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const words = text.split(' ')

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Counter animation
export function CountUp({
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  className = ''
}: {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useRef(0)

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <CountUpNumber end={end} duration={duration} />
          </motion.span>
        )}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

function CountUpNumber({ end, duration }: { end: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        if (!ref.current) return
        const start = 0
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / (duration * 1000), 1)
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress)
          const current = Math.floor(eased * end)
          if (ref.current) {
            ref.current.textContent = current.toString()
          }
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else if (ref.current) {
            ref.current.textContent = end.toString()
          }
        }
        animate()
      }}
    >
      0
    </motion.span>
  )
}

// Sticky scroll section - content changes as you scroll through
export function StickyScroll({
  children,
  height = '200vh',
  className = ''
}: {
  children: (progress: MotionValue<number>) => ReactNode
  height?: string
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  return (
    <div ref={ref} style={{ height }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </div>
  )
}

// Zoom in as you scroll
export function ScrollZoom({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Blur in effect
export function BlurIn({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect (for buttons/cards)
export function MagneticHover({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Rotating words
export function RotatingWords({
  words,
  className = ''
}: {
  words: string[]
  className?: string
}) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        animate={{ y: [0, -100 * (words.length - 1) + '%'] }}
        transition={{
          duration: words.length * 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          times: words.map((_, i) => i / words.length)
        }}
      >
        {words.map((word, i) => (
          <span key={i} className="block">
            {word}
          </span>
        ))}
      </motion.span>
    </span>
  )
}
