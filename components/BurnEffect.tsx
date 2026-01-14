'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BurnMark {
  id: number
  x: number
  y: number
  size: number
  rotation: number
}

export default function BurnEffect() {
  const [isActive, setIsActive] = useState(false)
  const [burnMarks, setBurnMarks] = useState<BurnMark[]>([])
  const [showHint, setShowHint] = useState(false)
  const clickCount = useRef(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const markId = useRef(0)
  const lastMarkTime = useRef(0)

  // Secret activation: Click the logo area 5 times quickly
  const handleSecretClick = useCallback(() => {
    clickCount.current += 1

    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 2000) // Reset after 2 seconds of no clicks

    if (clickCount.current >= 5) {
      setIsActive(prev => !prev)
      setShowHint(true)
      setTimeout(() => setShowHint(false), 3000)
      clickCount.current = 0
    }
  }, [])

  // Track mouse movement and create burn marks
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      // Throttle mark creation (every 50ms)
      if (now - lastMarkTime.current < 50) return
      lastMarkTime.current = now

      const newMark: BurnMark = {
        id: markId.current++,
        x: e.clientX,
        y: e.clientY,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360,
      }

      setBurnMarks(prev => {
        const updated = [...prev, newMark]
        // Keep max 100 marks for performance
        if (updated.length > 100) {
          return updated.slice(-100)
        }
        return updated
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive])

  // Keyboard shortcut: Ctrl+Shift+F to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        setIsActive(prev => !prev)
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
      }
      // ESC to turn off
      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
        setBurnMarks([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  // Clear marks when deactivated
  useEffect(() => {
    if (!isActive) {
      // Fade out marks gradually
      const fadeOut = setTimeout(() => {
        setBurnMarks([])
      }, 2000)
      return () => clearTimeout(fadeOut)
    }
  }, [isActive])

  return (
    <>
      {/* Invisible trigger zone over logo area */}
      <div
        onClick={handleSecretClick}
        className="fixed top-0 left-0 w-40 h-20 z-50 cursor-pointer"
        style={{ background: 'transparent' }}
        title=""
      />

      {/* Hint message */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-vurmz-dark text-white px-6 py-3 rounded-full shadow-lg"
          >
            <span className="flex items-center gap-2">
              {isActive ? (
                <>
                  <span className="text-orange-400">🔥</span>
                  Burn mode activated! Press ESC to stop.
                </>
              ) : (
                <>
                  <span>✨</span>
                  Burn mode deactivated
                </>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burn marks layer */}
      <div
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
        style={{ mixBlendMode: 'multiply' }}
      >
        <AnimatePresence>
          {burnMarks.map((mark) => (
            <motion.div
              key={mark.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
              style={{
                left: mark.x - mark.size / 2,
                top: mark.y - mark.size / 2,
                width: mark.size,
                height: mark.size,
                transform: `rotate(${mark.rotation}deg)`,
              }}
            >
              {/* Burn mark SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id={`burn-${mark.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1a0f00" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#3d2517" stopOpacity="0.7" />
                    <stop offset="60%" stopColor="#5c3d2e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b6914" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse
                  cx="50"
                  cy="50"
                  rx={45 + Math.random() * 10}
                  ry={35 + Math.random() * 15}
                  fill={`url(#burn-${mark.id})`}
                />
                {/* Char detail */}
                <ellipse
                  cx="50"
                  cy="50"
                  rx="20"
                  ry="15"
                  fill="#0d0705"
                  opacity="0.6"
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fire cursor when active */}
      {isActive && (
        <style jsx global>{`
          * {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff6b35' d='M12 23c-3.866 0-7-3.134-7-7 0-2.529 1.342-4.727 3.346-5.947A7.002 7.002 0 0 1 12 2c1.996 0 3.812.835 5.092 2.175A7.002 7.002 0 0 1 19 16c0 3.866-3.134 7-7 7z'/%3E%3Cpath fill='%23ffcc02' d='M12 20c-2.21 0-4-1.79-4-4 0-1.48.8-2.77 2-3.46A4.002 4.002 0 0 1 12 8a4.002 4.002 0 0 1 2 4.54c1.2.69 2 1.98 2 3.46 0 2.21-1.79 4-4 4z'/%3E%3C/svg%3E") 16 28, auto !important;
          }
        `}</style>
      )}
    </>
  )
}
