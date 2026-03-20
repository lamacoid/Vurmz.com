'use client'

import { useEffect, useState } from 'react'

export default function ScrollGlare() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Map scroll to glare angle and position
  const maxScroll = typeof document !== 'undefined'
    ? document.documentElement.scrollHeight - window.innerHeight
    : 3000
  const progress = Math.min(scrollY / (maxScroll || 1), 1)

  // Glare shifts diagonally as you scroll — thin highlight band
  const yOffset = -20 + progress * 140 // moves from -20% to 120%
  const angle = 135 + progress * 15 // slight angle shift 135° to 150°

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background: `linear-gradient(
          ${angle}deg,
          transparent ${yOffset - 6}%,
          rgba(196, 107, 77, 0.02) ${yOffset - 3}%,
          rgba(196, 107, 77, 0.06) ${yOffset}%,
          rgba(196, 107, 77, 0.02) ${yOffset + 3}%,
          transparent ${yOffset + 6}%
        )`,
        transition: 'background 0.3s ease-out',
      }}
    />
  )
}
