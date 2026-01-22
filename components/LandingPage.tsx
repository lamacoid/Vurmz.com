'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  useRouter() // Navigation hook available for future use

  // Animated ripple effect for reflection
  const ripple = useMotionValue(0)
  const rippleY = useTransform(ripple, [0, 1], [0, 3])
  const rippleBlur = useTransform(ripple, [0, 0.5, 1], [4, 6, 4])
  const rippleOpacity = useTransform(ripple, [0, 0.5, 1], [0.18, 0.22, 0.18])

  // Continuous subtle ripple animation
  useEffect(() => {
    const controls = animate(ripple, [0, 1], {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    })
    return () => controls.stop()
  }, [ripple])

  const handleNavigation = useCallback((path: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      window.location.href = path
    }, 900)
  }, [])

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden">
      {/* Glass transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Frosted glass expanding from center */}
            <motion.div
              className="absolute inset-0"
              initial={{
                clipPath: 'circle(0% at 50% 45%)',
              }}
              animate={{
                clipPath: 'circle(150% at 50% 45%)',
              }}
              transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
              }}
            />
            {/* Tempered glass green tint */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background: 'linear-gradient(180deg, rgba(106,140,140,0.1) 0%, rgba(140,174,196,0.08) 100%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 30%, rgba(106,140,140,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isTransitioning ? 0.92 : 1,
          opacity: isTransitioning ? 0 : 1,
          filter: isTransitioning ? 'blur(10px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="relative cursor-pointer select-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Soft glow */}
          <motion.div
            className="absolute -inset-16 rounded-full"
            animate={{
              opacity: isHovered ? 0.6 : 0.15,
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            style={{
              background: 'radial-gradient(circle, rgba(106,140,140,0.15) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />

          <Image
            src="/images/vurmz-logo-full.svg"
            alt="VURMZ"
            width={600}
            height={180}
            className="h-20 md:h-28 lg:h-36 w-auto relative"
            priority
            draggable={false}
          />
        </motion.div>

        {/* Dynamic watery reflection - flipped upside down */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ height: '70px', marginTop: '2px' }}
        >
          {/* Outer div handles the vertical flip */}
          <div style={{ transform: 'scaleY(-1)' }}>
            {/* Inner motion div handles animated effects */}
            <motion.div
              style={{
                y: rippleY,
                filter: useTransform(rippleBlur, (v) => `blur(${v}px)`),
                opacity: rippleOpacity,
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
              }}
            >
              <Image
                src="/images/vurmz-logo-full.svg"
                alt=""
                width={600}
                height={180}
                className="h-20 md:h-28 lg:h-36 w-auto"
                aria-hidden="true"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Water surface shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'linear-gradient(90deg, transparent 0%, rgba(106,140,140,0.03) 25%, transparent 50%, rgba(140,174,196,0.03) 75%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(140,174,196,0.03) 25%, transparent 50%, rgba(106,140,140,0.03) 75%, transparent 100%)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Glass buttons */}
        <motion.div
          className="flex gap-5 mt-16"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 12,
          }}
          transition={{
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            delay: isHovered ? 0.15 : 0,
          }}
        >
          {/* Enter Site - tempered glass green button */}
          <motion.button
            onClick={() => handleNavigation('/home')}
            className="relative px-10 py-3.5 rounded-full text-sm font-medium tracking-wide overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(106,140,140,0.85) 0%, rgba(90,122,122,0.9) 100%)',
              color: 'white',
              boxShadow: '0 4px 30px rgba(106,140,140,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 8px 40px rgba(106,140,140,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Glass shine */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}
            />
            <span className="relative z-10">Enter Site</span>
          </motion.button>

          {/* Customer Portal - transparent glass button */}
          <motion.button
            onClick={() => handleNavigation('/admin/login')}
            className="relative px-10 py-3.5 rounded-full text-sm font-medium tracking-wide overflow-hidden"
            style={{
              background: 'rgba(106,140,140,0.08)',
              color: '#5a7a7a',
              boxShadow: '0 2px 20px rgba(106,140,140,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
              border: '1px solid rgba(106,140,140,0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            whileHover={{
              scale: 1.04,
              background: 'rgba(106,140,140,0.12)',
              boxShadow: '0 4px 30px rgba(106,140,140,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
              borderColor: 'rgba(106,140,140,0.25)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Glass shine */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
              }}
            />
            <span className="relative z-10">Customer Portal</span>
          </motion.button>
        </motion.div>

        {/* Hint */}
        <motion.p
          className="mt-20 text-[10px] text-gray-300/70 tracking-[0.25em] uppercase font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0 : 0.8 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          Hover to continue
        </motion.p>
      </motion.div>

      {/* Ambient corner glows */}
      <div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,174,196,0.05) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(106,140,140,0.04) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
