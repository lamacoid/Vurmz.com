'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Point {
  x: number
  y: number
}

interface BurnLine {
  id: number
  points: Point[]
}

export default function BurnEffect() {
  const [isActive, setIsActive] = useState(false)
  const [burnLines, setBurnLines] = useState<BurnLine[]>([])
  const [currentLine, setCurrentLine] = useState<Point[]>([])
  const [showHint, setShowHint] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const clickCount = useRef(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)
  const lineId = useRef(0)

  // Secret activation: Click the logo area 5 times quickly
  const handleSecretClick = useCallback(() => {
    clickCount.current += 1

    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 2000)

    if (clickCount.current >= 5) {
      setIsActive(prev => !prev)
      setShowHint(true)
      setTimeout(() => setShowHint(false), 3000)
      clickCount.current = 0
    }
  }, [])

  // Track mouse for drawing burn lines
  useEffect(() => {
    if (!isActive) return

    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true)
      setCurrentLine([{ x: e.clientX, y: e.clientY }])
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return
      setCurrentLine(prev => [...prev, { x: e.clientX, y: e.clientY }])
    }

    const handleMouseUp = () => {
      if (isDrawing && currentLine.length > 1) {
        setBurnLines(prev => [
          ...prev,
          { id: lineId.current++, points: currentLine }
        ])
      }
      setIsDrawing(false)
      setCurrentLine([])
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isActive, isDrawing, currentLine])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        setIsActive(prev => !prev)
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
      }
      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
        setBurnLines([])
        setCurrentLine([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  // Clear lines when deactivated
  useEffect(() => {
    if (!isActive) {
      const fadeOut = setTimeout(() => {
        setBurnLines([])
        setCurrentLine([])
      }, 2000)
      return () => clearTimeout(fadeOut)
    }
  }, [isActive])

  // Convert points to SVG path
  const pointsToPath = (points: Point[]): string => {
    if (points.length < 2) return ''
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    return path
  }

  return (
    <>
      {/* Invisible trigger zone over logo area */}
      <div
        onClick={handleSecretClick}
        className="fixed top-0 left-0 w-40 h-20 z-50 cursor-pointer"
        style={{ background: 'transparent' }}
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
                  Click and drag to burn! Press ESC to clear.
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

      {/* Burn lines layer */}
      <svg
        className="fixed inset-0 pointer-events-none z-40 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Outer glow filter */}
          <filter id="burn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Completed burn lines */}
        <AnimatePresence>
          {burnLines.map((line) => (
            <motion.g
              key={line.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Outer glow */}
              <path
                d={pointsToPath(line.points)}
                fill="none"
                stroke="#ff8c00"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
                filter="url(#burn-glow)"
              />
              {/* Middle amber layer */}
              <path
                d={pointsToPath(line.points)}
                fill="none"
                stroke="#8b4513"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
              {/* Core burn line - dark */}
              <path
                d={pointsToPath(line.points)}
                fill="none"
                stroke="#3d1f00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          ))}
        </AnimatePresence>

        {/* Current line being drawn */}
        {currentLine.length > 1 && (
          <g>
            {/* Outer glow */}
            <path
              d={pointsToPath(currentLine)}
              fill="none"
              stroke="#ff8c00"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
              filter="url(#burn-glow)"
            />
            {/* Middle amber layer */}
            <path
              d={pointsToPath(currentLine)}
              fill="none"
              stroke="#8b4513"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            {/* Core burn line */}
            <path
              d={pointsToPath(currentLine)}
              fill="none"
              stroke="#3d1f00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hot tip indicator */}
            <circle
              cx={currentLine[currentLine.length - 1].x}
              cy={currentLine[currentLine.length - 1].y}
              r="6"
              fill="#ff4500"
              opacity="0.9"
            >
              <animate
                attributeName="r"
                values="4;8;4"
                dur="0.3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.5;0.9"
                dur="0.3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>

      {/* Laser head cursor when active */}
      {isActive && (
        <style jsx global>{`
          * {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='40' viewBox='0 0 32 40'%3E%3C!-- Laser head body --%3E%3Crect x='8' y='0' width='16' height='20' rx='2' fill='%23444444'/%3E%3Crect x='10' y='2' width='12' height='4' fill='%23666666'/%3E%3C!-- Lens/nozzle --%3E%3Crect x='11' y='18' width='10' height='6' fill='%23333333'/%3E%3Ccircle cx='16' cy='21' r='3' fill='%23222222'/%3E%3Ccircle cx='16' cy='21' r='1.5' fill='%23111111'/%3E%3C!-- Laser beam --%3E%3Cline x1='16' y1='24' x2='16' y2='38' stroke='%23ff3300' stroke-width='2' opacity='0.9'/%3E%3Cline x1='16' y1='24' x2='16' y2='38' stroke='%23ff6600' stroke-width='4' opacity='0.4'/%3E%3C!-- Hot spot --%3E%3Ccircle cx='16' cy='38' r='3' fill='%23ff4400' opacity='0.8'/%3E%3Ccircle cx='16' cy='38' r='1.5' fill='%23ffffff' opacity='0.9'/%3E%3C/svg%3E") 16 38, crosshair !important;
          }
        `}</style>
      )}
    </>
  )
}
