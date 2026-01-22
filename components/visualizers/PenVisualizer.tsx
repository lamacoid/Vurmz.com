'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/*
 * Pen Visualizer Component
 *
 * Realistic 3D-style SVG rendering of a metal stylus pen.
 * Features:
 * - Metal body with realistic gradients
 * - Clip detail
 * - Engraving preview with proper positioning
 * - Multiple color variants
 * - Rotation capability
 */

interface PenVisualizerProps {
  text?: string
  text2?: string
  color?: 'black' | 'silver' | 'blue' | 'red' | 'gold' | 'gunmetal'
  rotation?: number
  showStylusTip?: boolean
  className?: string
}

// Metal color definitions with gradients
const metalColors = {
  black: {
    body: ['#2A2A2A', '#1A1A1A', '#0D0D0D'],
    highlight: '#4A4A4A',
    shadow: '#000000',
    engraving: '#8A8A8A',
  },
  silver: {
    body: ['#E8E8E8', '#C0C0C0', '#A0A0A0'],
    highlight: '#FFFFFF',
    shadow: '#808080',
    engraving: '#404040',
  },
  blue: {
    body: ['#3A5A8C', '#2A4A7C', '#1A3A6C'],
    highlight: '#5A7AAC',
    shadow: '#1A2A4C',
    engraving: '#A0B0C0',
  },
  red: {
    body: ['#8C3A3A', '#7C2A2A', '#6C1A1A'],
    highlight: '#AC5A5A',
    shadow: '#4C1A1A',
    engraving: '#D0A0A0',
  },
  gold: {
    body: ['#D4AF37', '#C9A227', '#B8941F'],
    highlight: '#F0D060',
    shadow: '#8A7020',
    engraving: '#5A4A20',
  },
  gunmetal: {
    body: ['#5A5A60', '#4A4A50', '#3A3A40'],
    highlight: '#7A7A80',
    shadow: '#2A2A30',
    engraving: '#A0A0A8',
  },
}

export default function PenVisualizer({
  text = '',
  text2 = '',
  color = 'black',
  rotation = 0,
  showStylusTip = true,
  className = '',
}: PenVisualizerProps) {
  const colors = metalColors[color]

  // Generate unique IDs for gradients
  const gradientId = useMemo(() => `pen-gradient-${Math.random().toString(36).substr(2, 9)}`, [])
  const clipGradientId = useMemo(() => `clip-gradient-${Math.random().toString(36).substr(2, 9)}`, [])
  const tipGradientId = useMemo(() => `tip-gradient-${Math.random().toString(36).substr(2, 9)}`, [])

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.svg
        viewBox="0 0 400 100"
        className="w-full h-auto"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <defs>
          {/* Main body gradient - cylindrical effect */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.highlight} />
            <stop offset="25%" stopColor={colors.body[0]} />
            <stop offset="50%" stopColor={colors.body[1]} />
            <stop offset="75%" stopColor={colors.body[2]} />
            <stop offset="100%" stopColor={colors.shadow} />
          </linearGradient>

          {/* Clip gradient */}
          <linearGradient id={clipGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#A0A0A0" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>

          {/* Tip gradient */}
          <linearGradient id={tipGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.body[2]} />
            <stop offset="100%" stopColor="#303030" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id="pen-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Main pen body */}
        <g filter="url(#pen-shadow)">
          {/* Pen barrel - main cylinder */}
          <rect
            x="50"
            y="35"
            width="280"
            height="30"
            rx="4"
            fill={`url(#${gradientId})`}
          />

          {/* Grip section - textured area */}
          <g>
            <rect
              x="230"
              y="35"
              width="60"
              height="30"
              rx="2"
              fill={colors.body[1]}
            />
            {/* Grip lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <line
                key={i}
                x1={235 + i * 5}
                y1="37"
                x2={235 + i * 5}
                y2="63"
                stroke={colors.shadow}
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </g>

          {/* Clip */}
          <path
            d="M 55 35 L 55 15 C 55 12 58 10 62 10 L 100 10 C 105 10 108 15 105 20 L 95 35"
            fill={`url(#${clipGradientId})`}
            stroke="#808080"
            strokeWidth="0.5"
          />

          {/* Pen tip section */}
          <polygon
            points="330,50 380,50 370,45 370,55"
            fill={`url(#${tipGradientId})`}
          />

          {/* Stylus tip (rubber) */}
          {showStylusTip && (
            <ellipse
              cx="385"
              cy="50"
              rx="8"
              ry="6"
              fill="#404040"
              stroke="#303030"
              strokeWidth="0.5"
            />
          )}

          {/* Cap ring */}
          <rect
            x="48"
            y="33"
            width="4"
            height="34"
            rx="2"
            fill="#808080"
          />

          {/* Grip ring */}
          <rect
            x="225"
            y="33"
            width="3"
            height="34"
            rx="1"
            fill="#909090"
          />

          {/* Tip ring */}
          <rect
            x="328"
            y="38"
            width="3"
            height="24"
            rx="1"
            fill="#909090"
          />
        </g>

        {/* Engraving Text - Line 1 */}
        {text && (
          <text
            x="175"
            y="47"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.engraving}
            fontSize="10"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            letterSpacing="0.5"
          >
            {text.slice(0, 25)}
          </text>
        )}

        {/* Engraving Text - Line 2 */}
        {text2 && (
          <text
            x="175"
            y="58"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors.engraving}
            fontSize="8"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="400"
            letterSpacing="0.3"
          >
            {text2.slice(0, 30)}
          </text>
        )}
      </motion.svg>

      {/* Color indicator */}
      <div className="flex justify-center mt-4 gap-2">
        <div
          className="w-3 h-3 rounded-full border border-[rgba(106,140,140,0.2)]"
          style={{ background: colors.body[1] }}
          title={color}
        />
      </div>
    </motion.div>
  )
}

/*
 * Color selector component for use with the pen visualizer
 */
interface ColorSelectorProps {
  value: PenVisualizerProps['color']
  onChange: (color: PenVisualizerProps['color']) => void
}

export function PenColorSelector({ value, onChange }: ColorSelectorProps) {
  const colors: Array<{ id: PenVisualizerProps['color']; label: string; bg: string }> = [
    { id: 'black', label: 'Black', bg: '#1A1A1A' },
    { id: 'silver', label: 'Silver', bg: '#C0C0C0' },
    { id: 'blue', label: 'Blue', bg: '#2A4A7C' },
    { id: 'red', label: 'Red', bg: '#7C2A2A' },
    { id: 'gold', label: 'Gold', bg: '#C9A227' },
    { id: 'gunmetal', label: 'Gunmetal', bg: '#4A4A50' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <motion.button
          key={color.id}
          type="button"
          className={`
            w-10 h-10 rounded-xl border-2 transition-all
            ${value === color.id
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          style={{ background: color.bg }}
          onClick={() => onChange(color.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={color.label}
        />
      ))}
    </div>
  )
}
