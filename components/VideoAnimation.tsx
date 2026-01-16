'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface VideoAnimationProps {
  src: string
  className?: string
  loop?: boolean
  autoPlay?: boolean
  muted?: boolean
  playOnHover?: boolean
  playWhenVisible?: boolean
  poster?: string
}

/**
 * VideoAnimation - Plays Blender-rendered animations
 *
 * Available animations in /public/videos/:
 * - vurmz-logo-spin0001-0120.mp4 - Logo rotation animation
 * - vurmz-logo-pulse0001-0120.mp4 - Logo breathing/pulse effect
 * - vurmz-logo-water0001-0120.mp4 - Water reflection animation
 * - laser-loading.mp4 - Laser beam loading indicator
 * - glass-shimmer.mp4 - Glass button shimmer effect
 * - water-splash.mp4 - Water droplet transition
 * - floating-particles.mp4 - Ambient floating particles
 * - engraving-reveal.mp4 - Laser engraving text reveal
 */
export default function VideoAnimation({
  src,
  className = '',
  loop = true,
  autoPlay = true,
  muted = true,
  playOnHover = false,
  playWhenVisible = false,
  poster,
}: VideoAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(videoRef, { once: false, amount: 0.3 })

  // Play when scrolled into view
  useEffect(() => {
    if (playWhenVisible && videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {
          // Autoplay may be blocked, that's okay
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isInView, playWhenVisible])

  const handleMouseEnter = () => {
    if (playOnHover && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (playOnHover && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        loop={loop}
        autoPlay={autoPlay && !playOnHover && !playWhenVisible}
        muted={muted}
        playsInline
        poster={poster}
        style={{ background: 'transparent' }}
      />
    </motion.div>
  )
}

// Loader animation component using the laser loading video
export function LaserLoader({ className = '' }: { className?: string }) {
  return (
    <VideoAnimation
      src="/videos/laser-loading.mp4"
      className={`h-8 ${className}`}
      loop
      autoPlay
    />
  )
}

// Animated logo for splash/loading screens
export function AnimatedLogo({ className = '' }: { className?: string }) {
  return (
    <VideoAnimation
      src="/videos/vurmz-logo-spin0001-0120.mp4"
      className={`w-64 h-32 ${className}`}
      loop
      autoPlay
    />
  )
}
