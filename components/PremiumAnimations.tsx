'use client'

import { useRef, useState, useEffect, ReactNode, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

// 3D Tilt Card - Like Apple's product cards
export function TiltCard({
  children,
  className = '',
  intensity = 15,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)'
            : 'none',
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  )
}

// Text Scramble Effect - Characters decode into final text
export function TextScramble({
  text,
  className = '',
  duration = 1.5,
  delay = 0,
}: {
  text: string
  className?: string
  duration?: number
  delay?: number
}) {
  const [displayText, setDisplayText] = useState('')
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView) return

    let iteration = 0
    const totalIterations = duration * 30 // 30fps
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration / (totalIterations / text.length)) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iteration += 1

      if (iteration >= totalIterations) {
        setDisplayText(text)
        clearInterval(interval)
      }
    }, 1000 / 30)

    const timeout = setTimeout(() => clearInterval(interval), (delay + duration) * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isInView, text, duration, delay])

  return (
    <span ref={ref} className={className}>
      {displayText || text.replace(/./g, ' ')}
    </span>
  )
}

// Spotlight Effect - Gradient that follows the cursor
export function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isHovered
            ? `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(74, 155, 140, 0.15), transparent 60%)`
            : 'none',
        }}
        transition={{ duration: 0.2 }}
      />
      {children}
    </div>
  )
}

// Character-by-Character Reveal
export function CharacterReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.3,
            delay: delay + i * 0.03,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// Hover Glow Button
export function GlowButton({
  children,
  className = '',
  href,
  onClick,
}: {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Glow effect */}
      <motion.span
        className="absolute inset-0"
        animate={{
          boxShadow: isHovered
            ? '0 0 40px rgba(74, 155, 140, 0.6), 0 0 80px rgba(74, 155, 140, 0.4), 0 0 120px rgba(74, 155, 140, 0.2)'
            : '0 0 0px rgba(74, 155, 140, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Shimmer effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </Component>
  )
}

// Animated Counter with Formatting
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 2,
}: {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }
    animate()
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

// Floating Elements Animation
export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 3,
}: {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Morphing Background Gradient
export function MorphingGradient({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, #4A9B8C 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, #4A9B8C 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, #4A9B8C 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, #4A9B8C 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, #4A9B8C 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.1 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// Line Draw Animation
export function LineDrawSVG({
  className = '',
  width = 200,
  height = 2,
}: {
  className?: string
  width?: number
  height?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <motion.line
        x1="0"
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke="currentColor"
        strokeWidth={height}
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </svg>
  )
}

// Laser Etch Text Animation - Like a galvo laser etching text
export function LaserEtch({
  text,
  className = '',
  speed = 0.04,
  glowColor = 'rgba(255, 140, 0, 0.8)',
}: {
  text: string
  className?: string
  speed?: number
  glowColor?: string
}) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [activeChar, setActiveChar] = useState(-1)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView) return

    let charIndex = 0
    const interval = setInterval(() => {
      if (charIndex <= text.length) {
        setDisplayedChars(charIndex)
        setActiveChar(charIndex - 1)
        charIndex++
      } else {
        setActiveChar(-1)
        clearInterval(interval)
      }
    }, speed * 1000)

    return () => clearInterval(interval)
  }, [isInView, text, speed])

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => {
        const isVisible = i < displayedChars
        const isEtching = i === activeChar

        return (
          <motion.span
            key={i}
            className="inline-block relative"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isVisible ? 1 : 0,
            }}
            transition={{ duration: 0.05 }}
          >
            {/* Laser glow effect on active character */}
            {isEtching && (
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
                  color: 'white',
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.1, repeat: 2 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            )}
            {/* The actual character */}
            <span className={isEtching ? 'text-white' : ''}>
              {char === ' ' ? '\u00A0' : char}
            </span>
            {/* Cross-hatch fill effect */}
            {isEtching && (
              <motion.span
                className="absolute inset-0 overflow-hidden pointer-events-none"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'overlay' }}>
                  <defs>
                    <pattern id={`hatch-${i}`} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke="orange" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#hatch-${i})`} />
                </svg>
              </motion.span>
            )}
          </motion.span>
        )
      })}
    </span>
  )
}

// Laser Etch by Word - Faster word-by-word version
export function LaserEtchWords({
  text,
  className = '',
  wordDelay = 0.12,
}: {
  text: string
  className?: string
  wordDelay?: number
}) {
  const [visibleWords, setVisibleWords] = useState(0)
  const [activeWord, setActiveWord] = useState(-1)
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const words = text.split(' ')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView) return

    let wordIndex = 0
    const interval = setInterval(() => {
      if (wordIndex <= words.length) {
        setVisibleWords(wordIndex)
        setActiveWord(wordIndex - 1)
        wordIndex++
      } else {
        setActiveWord(-1)
        clearInterval(interval)
      }
    }, wordDelay * 1000)

    return () => clearInterval(interval)
  }, [isInView, words.length, wordDelay])

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => {
        const isVisible = i < visibleWords
        const isEtching = i === activeWord

        return (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em] relative"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 5,
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Laser spark/glow on active word */}
            {isEtching && (
              <>
                {/* Bright flash */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    textShadow: '0 0 30px rgba(255, 140, 0, 1), 0 0 60px rgba(255, 100, 0, 0.8)',
                    color: 'white',
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {word}
                </motion.span>
                {/* Scan line effect */}
                <motion.span
                  className="absolute left-0 top-0 h-full w-[2px] bg-orange-400"
                  style={{ boxShadow: '0 0 10px rgba(255, 140, 0, 1)' }}
                  initial={{ x: 0 }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              </>
            )}
            {word}
          </motion.span>
        )
      })}
    </span>
  )
}

// Reveal Mask Animation
export function RevealMask({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {children}
      </motion.div>
      {/* Mask overlay that slides up */}
      <motion.div
        className="absolute inset-0 bg-vurmz-dark"
        initial={{ y: 0 }}
        animate={isInView ? { y: '-100%' } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </div>
  )
}
