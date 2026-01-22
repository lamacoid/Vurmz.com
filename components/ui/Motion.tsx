'use client'

import { ReactNode, forwardRef, useRef, useState, createContext } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion'

/*
 * Motion System
 *
 * Design principles:
 * - Liquid, organic movement
 * - Elements feel like they have mass
 * - Never mechanical or jarring
 * - Respects user preferences (reduced motion)
 */

// ============================================
// MOTION PRESETS
// ============================================

export const easings = {
  liquid: [0.23, 1, 0.32, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
}

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
}

export const springPresets = {
  gentle: { type: 'spring', stiffness: 120, damping: 20 } as const,
  soft: { type: 'spring', stiffness: 200, damping: 25 } as const,
  snappy: { type: 'spring', stiffness: 400, damping: 30 } as const,
  bouncy: { type: 'spring', stiffness: 500, damping: 15 } as const,
}

// ============================================
// FADE IN
// ============================================

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
  className?: string
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.5,
      direction = 'up',
      distance = 20,
      once = true,
      className = '',
    },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef
    const isInView = useInView(combinedRef as React.RefObject<HTMLDivElement>, { once, margin: '-50px' })

    const directionOffset = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    }

    return (
      <motion.div
        ref={combinedRef}
        className={className}
        initial={{ opacity: 0, ...directionOffset[direction] }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionOffset[direction] }}
        transition={{
          duration,
          delay,
          ease: easings.liquid,
        }}
      >
        {children}
      </motion.div>
    )
  }
)

FadeIn.displayName = 'FadeIn'

// ============================================
// STAGGER CONTAINER
// ============================================

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  delayStart?: number
  once?: boolean
  className?: string
}

const staggerContext = createContext<{ staggerDelay: number; isInView: boolean }>({
  staggerDelay: 0.1,
  isInView: false,
})

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, staggerDelay = 0.1, delayStart = 0, once = true, className = '' }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef
    const isInView = useInView(combinedRef as React.RefObject<HTMLDivElement>, { once, margin: '-50px' })

    return (
      <staggerContext.Provider value={{ staggerDelay, isInView }}>
        <motion.div
          ref={combinedRef}
          className={className}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: staggerDelay,
                delayChildren: delayStart,
              },
            },
          }}
        >
          {children}
        </motion.div>
      </staggerContext.Provider>
    )
  }
)

StaggerContainer.displayName = 'StaggerContainer'

// ============================================
// STAGGER ITEM
// ============================================

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: easings.liquid,
            },
          },
        }}
      >
        {children}
      </motion.div>
    )
  }
)

StaggerItem.displayName = 'StaggerItem'

// ============================================
// SCALE IN
// ============================================

interface ScaleInProps {
  children: ReactNode
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, duration = 0.4, once = true, className = '' }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef
    const isInView = useInView(combinedRef as React.RefObject<HTMLDivElement>, { once, margin: '-50px' })

    return (
      <motion.div
        ref={combinedRef}
        className={className}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{
          duration,
          delay,
          ease: easings.spring,
        }}
      >
        {children}
      </motion.div>
    )
  }
)

ScaleIn.displayName = 'ScaleIn'

// ============================================
// PARALLAX
// ============================================

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
  ({ children, speed = 0.5, className = '' }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef
    const { scrollYProgress } = useScroll({
      target: combinedRef as React.RefObject<HTMLDivElement>,
      offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

    return (
      <motion.div ref={combinedRef} className={className} style={{ y: smoothY }}>
        {children}
      </motion.div>
    )
  }
)

Parallax.displayName = 'Parallax'

// ============================================
// FLOAT ANIMATION
// ============================================

interface FloatProps {
  children: ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
}

export const Float = forwardRef<HTMLDivElement, FloatProps>(
  ({ children, amplitude = 8, duration = 4, delay = 0, className = '' }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        animate={{
          y: [-amplitude, amplitude, -amplitude],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    )
  }
)

Float.displayName = 'Float'

// ============================================
// HOVER CARD (3D Tilt)
// ============================================

interface HoverCardProps {
  children: ReactNode
  intensity?: number
  className?: string
}

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  ({ children, intensity = 10, className = '' }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef

    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = (combinedRef as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      setRotateX(((y - centerY) / centerY) * -intensity)
      setRotateY(((x - centerX) / centerX) * intensity)
    }

    const handleMouseLeave = () => {
      setRotateX(0)
      setRotateY(0)
    }

    const smoothRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 })
    const smoothRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 })

    return (
      <motion.div
        ref={combinedRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        {children}
      </motion.div>
    )
  }
)

HoverCard.displayName = 'HoverCard'

// ============================================
// MAGNETIC BUTTON
// ============================================

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  ({ children, strength = 0.3, className = '' }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const combinedRef = ref || innerRef

    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = (combinedRef as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      setPosition({ x: x * strength, y: y * strength })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    const smoothX = useSpring(position.x, { stiffness: 150, damping: 15 })
    const smoothY = useSpring(position.y, { stiffness: 150, damping: 15 })

    return (
      <motion.div
        ref={combinedRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: smoothX, y: smoothY }}
      >
        {children}
      </motion.div>
    )
  }
)

Magnetic.displayName = 'Magnetic'

// ============================================
// PAGE TRANSITION
// ============================================

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: easings.liquid,
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// PRESENCE (Animate mount/unmount)
// ============================================

interface PresenceProps {
  children: ReactNode
  show: boolean
  mode?: 'sync' | 'wait' | 'popLayout'
}

export function Presence({ children, show, mode = 'sync' }: PresenceProps) {
  return (
    <AnimatePresence mode={mode}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.2,
            ease: easings.soft,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// REVEAL TEXT (Word by word)
// ============================================

interface RevealTextProps {
  text: string
  delay?: number
  staggerDelay?: number
  className?: string
}

export function RevealText({ text, delay = 0, staggerDelay = 0.03, className = '' }: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              delay: delay + i * staggerDelay,
              ease: easings.liquid,
            }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const MotionExports = {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  Parallax,
  Float,
  HoverCard,
  Magnetic,
  PageTransition,
  Presence,
  RevealText,
  easings,
  durations,
  springPresets,
}

export default MotionExports
