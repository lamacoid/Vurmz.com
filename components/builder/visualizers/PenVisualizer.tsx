'use client'

import { motion } from 'framer-motion'

// Premium pen color configurations
type PenColorKey = 'matte-black' | 'chrome' | 'teal' | 'navy' | 'burgundy' | 'forest'

interface ColorPalette {
  base: string
  light: string
  dark: string
  highlight: string
  shadow: string
  engrave: string
  engraveHighlight: string
}

const penColorPalettes: Record<PenColorKey, ColorPalette> = {
  'matte-black': {
    base: '#1a1a1a',
    light: '#3d3d3d',
    dark: '#0a0a0a',
    highlight: 'rgba(255,255,255,0.12)',
    shadow: 'rgba(0,0,0,0.5)',
    engrave: '#c0c0c0',
    engraveHighlight: 'rgba(255,255,255,0.25)'
  },
  'chrome': {
    base: '#c0c0c0',
    light: '#f0f0f0',
    dark: '#888888',
    highlight: 'rgba(255,255,255,0.5)',
    shadow: 'rgba(0,0,0,0.25)',
    engrave: '#333333',
    engraveHighlight: 'rgba(255,255,255,0.1)'
  },
  'teal': {
    base: '#6a8c8c',
    light: '#8cb0b0',
    dark: '#4a6a6a',
    highlight: 'rgba(255,255,255,0.22)',
    shadow: 'rgba(0,0,0,0.35)',
    engrave: '#d0e8e8',
    engraveHighlight: 'rgba(255,255,255,0.15)'
  },
  'navy': {
    base: '#2a3d5a',
    light: '#4a6080',
    dark: '#1a2840',
    highlight: 'rgba(255,255,255,0.18)',
    shadow: 'rgba(0,0,0,0.4)',
    engrave: '#a0c0e0',
    engraveHighlight: 'rgba(255,255,255,0.12)'
  },
  'burgundy': {
    base: '#6a2a3a',
    light: '#8a4050',
    dark: '#4a1a28',
    highlight: 'rgba(255,255,255,0.18)',
    shadow: 'rgba(0,0,0,0.4)',
    engrave: '#e8c0c8',
    engraveHighlight: 'rgba(255,255,255,0.12)'
  },
  'forest': {
    base: '#2a4a3a',
    light: '#3d6a50',
    dark: '#1a3028',
    highlight: 'rgba(255,255,255,0.18)',
    shadow: 'rgba(0,0,0,0.4)',
    engrave: '#b8d8c8',
    engraveHighlight: 'rgba(255,255,255,0.12)'
  }
}

interface PenVisualizerProps {
  line1?: string
  line2?: string
  textStyle?: 'one-line' | 'two-lines'
  penColor?: PenColorKey
  font?: string
  className?: string
}

// Custom easing curve
const premiumEasing = [0.23, 1, 0.32, 1] as const

export default function PenVisualizer({
  line1 = '',
  line2 = '',
  textStyle = 'two-lines',
  penColor = 'matte-black',
  font = 'Arial, sans-serif',
  className = ''
}: PenVisualizerProps) {
  const colors = penColorPalettes[penColor] || penColorPalettes['matte-black']

  // Generate unique IDs for this instance
  const instanceId = Math.random().toString(36).substring(7)

  return (
    <div className={`w-full flex flex-col items-center py-8 ${className}`}>
      <motion.svg
        width="420"
        height="120"
        viewBox="0 0 420 120"
        className="max-w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: premiumEasing }}
      >
        <defs>
          {/* Chrome metallic gradient for accents */}
          <linearGradient id={`chrome-${instanceId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="8%" stopColor="#f5f5f5"/>
            <stop offset="25%" stopColor="#e0e0e0"/>
            <stop offset="45%" stopColor="#c8c8c8"/>
            <stop offset="55%" stopColor="#b0b0b0"/>
            <stop offset="75%" stopColor="#c0c0c0"/>
            <stop offset="92%" stopColor="#d8d8d8"/>
            <stop offset="100%" stopColor="#a0a0a0"/>
          </linearGradient>

          {/* Premium barrel gradient with 3D depth */}
          <linearGradient id={`barrel-${instanceId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.light}/>
            <stop offset="15%" stopColor={colors.base}/>
            <stop offset="45%" stopColor={colors.dark}/>
            <stop offset="55%" stopColor={colors.dark}/>
            <stop offset="85%" stopColor={colors.base}/>
            <stop offset="100%" stopColor={colors.light}/>
          </linearGradient>

          {/* Top highlight reflection - glass aesthetic */}
          <linearGradient id={`topHighlight-${instanceId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.highlight}/>
            <stop offset="40%" stopColor="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>

          {/* Stylus tip rubber gradient */}
          <radialGradient id={`stylusTip-${instanceId}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#4a4a4a"/>
            <stop offset="40%" stopColor="#2d2d2d"/>
            <stop offset="100%" stopColor="#1a1a1a"/>
          </radialGradient>

          {/* Pen tip metal cone gradient */}
          <linearGradient id={`tipCone-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b0b0b0"/>
            <stop offset="30%" stopColor="#e0e0e0"/>
            <stop offset="50%" stopColor="#f5f5f5"/>
            <stop offset="70%" stopColor="#d0d0d0"/>
            <stop offset="100%" stopColor="#a0a0a0"/>
          </linearGradient>

          {/* Etched engraving effect - inset shadow */}
          <filter id={`etchedText-${instanceId}`} x="-10%" y="-30%" width="120%" height="160%">
            <feOffset dx="0" dy="0.5" in="SourceAlpha" result="shadowOffset"/>
            <feGaussianBlur in="shadowOffset" stdDeviation="0.3" result="shadowBlur"/>
            <feFlood floodColor={colors.engraveHighlight} result="shadowColor"/>
            <feComposite in="shadowColor" in2="shadowBlur" operator="in" result="dropShadow"/>
            <feMerge>
              <feMergeNode in="dropShadow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Soft shadow underneath pen */}
          <filter id={`penShadow-${instanceId}`} x="-10%" y="-20%" width="120%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.25"/>
          </filter>

          {/* Subtle inner shadow for depth */}
          <filter id={`innerShadow-${instanceId}`} x="-5%" y="-5%" width="110%" height="110%">
            <feOffset dx="0" dy="1" in="SourceAlpha" result="offset"/>
            <feGaussianBlur in="offset" stdDeviation="1" result="blur"/>
            <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow"/>
            <feFlood floodColor={colors.shadow} result="color"/>
            <feComposite in="color" in2="innerShadow" operator="in"/>
          </filter>

          {/* Glass reflection gradient - sky blue accent */}
          <linearGradient id={`glassReflect-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(140,174,196,0.15)"/>
            <stop offset="50%" stopColor="rgba(106,140,140,0.08)"/>
            <stop offset="100%" stopColor="rgba(140,174,196,0.12)"/>
          </linearGradient>
        </defs>

        {/* Main pen group with shadow */}
        <g filter={`url(#penShadow-${instanceId})`}>
          {/* Chrome pointed writing tip */}
          <motion.polygon
            points="8,60 48,48 48,72"
            fill={`url(#tipCone-${instanceId})`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: premiumEasing, delay: 0.1 }}
          />
          {/* Tip highlight line */}
          <motion.line
            x1="12"
            y1="60"
            x2="44"
            y2="60"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          {/* First chrome accent ring */}
          <motion.g
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.4, ease: premiumEasing, delay: 0.15 }}
          >
            <rect x="48" y="44" width="8" height="32" fill={`url(#chrome-${instanceId})`} rx="1"/>
            <rect x="49" y="44" width="6" height="12" fill="rgba(255,255,255,0.35)" rx="1"/>
          </motion.g>

          {/* Second chrome accent ring */}
          <motion.g
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.4, ease: premiumEasing, delay: 0.2 }}
          >
            <rect x="58" y="44" width="8" height="32" fill={`url(#chrome-${instanceId})`} rx="1"/>
            <rect x="59" y="44" width="6" height="12" fill="rgba(255,255,255,0.35)" rx="1"/>
          </motion.g>

          {/* Main barrel body - premium finish */}
          <motion.g
            initial={{ opacity: 0, scaleX: 0.95 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, ease: premiumEasing, delay: 0.25 }}
          >
            {/* Base barrel shape */}
            <rect x="66" y="38" width="240" height="44" fill={`url(#barrel-${instanceId})`} rx="5"/>

            {/* Top highlight reflection */}
            <rect x="66" y="38" width="240" height="16" fill={`url(#topHighlight-${instanceId})`} rx="5"/>

            {/* Glass aesthetic overlay */}
            <rect x="66" y="38" width="240" height="44" fill={`url(#glassReflect-${instanceId})`} rx="5"/>

            {/* Subtle edge definition */}
            <rect x="66" y="38" width="240" height="44" fill="none" stroke={colors.shadow} strokeWidth="0.5" rx="5"/>
          </motion.g>

          {/* Engraved text area with etched effect */}
          <motion.g
            style={{ fontFamily: font }}
            filter={`url(#etchedText-${instanceId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: premiumEasing, delay: 0.5 }}
          >
            {textStyle === 'two-lines' ? (
              <>
                {/* Line 1 - larger, primary text */}
                <text
                  x="186"
                  y="55"
                  textAnchor="middle"
                  fill={colors.engrave}
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="0.8"
                >
                  {line1 || 'YOUR BUSINESS NAME'}
                </text>
                {/* Line 2 - smaller, secondary text */}
                <text
                  x="186"
                  y="72"
                  textAnchor="middle"
                  fill={colors.engrave}
                  fontSize="9"
                  opacity="0.85"
                  letterSpacing="0.4"
                >
                  {line2 || 'www.yourbusiness.com'}
                </text>
              </>
            ) : (
              /* Single line - centered, prominent */
              <text
                x="186"
                y="65"
                textAnchor="middle"
                fill={colors.engrave}
                fontSize="15"
                fontWeight="600"
                letterSpacing="0.8"
              >
                {line1 || 'YOUR BUSINESS'}
              </text>
            )}
          </motion.g>

          {/* Premium pocket clip - chrome finish */}
          <motion.g
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: premiumEasing, delay: 0.4 }}
          >
            <path
              d="M 306 38 Q 306 24 314 18 L 358 18 L 358 26 Q 354 30 316 30 Q 308 30 308 38"
              fill={`url(#chrome-${instanceId})`}
              stroke="rgba(150,150,150,0.4)"
              strokeWidth="0.5"
            />
            {/* Clip highlight */}
            <path
              d="M 306 38 Q 306 24 314 18 L 358 18 L 358 22 Q 354 26 318 26 Q 310 26 309 35"
              fill="rgba(255,255,255,0.35)"
            />
          </motion.g>

          {/* Chrome ring before cap section */}
          <motion.g
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.4, ease: premiumEasing, delay: 0.35 }}
          >
            <rect x="306" y="40" width="10" height="40" fill={`url(#chrome-${instanceId})`} rx="1"/>
            <rect x="307" y="40" width="8" height="14" fill="rgba(255,255,255,0.35)" rx="1"/>
          </motion.g>

          {/* Cap/click mechanism section */}
          <motion.g
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: premiumEasing, delay: 0.4 }}
          >
            <rect x="316" y="42" width="65" height="36" fill={`url(#barrel-${instanceId})`} rx="4"/>
            <rect x="316" y="42" width="65" height="13" fill={`url(#topHighlight-${instanceId})`} rx="4"/>
            <rect x="316" y="42" width="65" height="36" fill={`url(#glassReflect-${instanceId})`} rx="4"/>
          </motion.g>

          {/* Stylus rubber tip - soft touch finish */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: premiumEasing, delay: 0.5 }}
          >
            <ellipse cx="392" cy="60" rx="14" ry="14" fill={`url(#stylusTip-${instanceId})`}/>
            {/* Subtle highlight on rubber tip */}
            <ellipse cx="388" cy="56" rx="6" ry="5" fill="rgba(255,255,255,0.08)"/>
          </motion.g>
        </g>
      </motion.svg>

      {/* Subtle floating shadow underneath - glass aesthetic */}
      <motion.div
        className="w-80 h-4 mx-auto -mt-2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(106,140,140,0.15) 0%, transparent 70%)',
          filter: 'blur(8px)'
        }}
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: premiumEasing, delay: 0.6 }}
      />
    </div>
  )
}

// Export color options for use in parent components
export const penColorOptions: { value: PenColorKey; label: string; hex: string }[] = [
  { value: 'matte-black', label: 'Matte Black', hex: '#1a1a1a' },
  { value: 'chrome', label: 'Chrome', hex: '#c0c0c0' },
  { value: 'teal', label: 'Teal', hex: '#6a8c8c' },
  { value: 'navy', label: 'Navy', hex: '#2a3d5a' },
  { value: 'burgundy', label: 'Burgundy', hex: '#6a2a3a' },
  { value: 'forest', label: 'Forest', hex: '#2a4a3a' }
]

export type { PenColorKey, PenVisualizerProps }
