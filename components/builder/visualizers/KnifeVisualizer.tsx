'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

type KnifeType = 'pocket' | 'chef' | 'steak-set' | 'kitchen-set'
type EngravingLocation = 'blade' | 'handle' | 'both'

interface KnifeVisualizerProps {
  type: KnifeType
  bladeText?: string
  handleText?: string
  engravingLocation: EngravingLocation
  font?: string
  setSize?: number
}

// Custom easing curve
const premiumEasing = [0.23, 1, 0.32, 1] as const

// ============================================
// MIYABI SG2 8" CHEF KNIFE - Japanese Gyuto
// ============================================
// Characteristics: Curved belly for rocking motion,
// pointed tip, thin spine tapering to razor edge,
// D-shaped pakkawood handle with metal bolster

const MIYABI_BLADE = `
  M 12,58
  C 18,56 35,48 65,40
  Q 95,32 140,26
  L 185,22
  Q 200,20 210,20
  L 218,20
  Q 225,20 228,24
  L 230,30
  Q 228,36 220,38
  L 180,43
  Q 140,48 90,54
  Q 50,60 25,62
  L 12,58
  Z
`

const MIYABI_SPINE = `
  M 12,58
  C 18,56 35,48 65,40
  Q 95,32 140,26
  L 185,22
  Q 200,20 210,20
  L 218,20
`

const MIYABI_EDGE = `
  M 230,30
  Q 228,36 220,38
  L 180,43
  Q 140,48 90,54
  Q 50,60 25,62
  L 12,58
`

// D-shaped pakkawood handle with contoured ergonomic profile
const MIYABI_HANDLE = `
  M 228,22
  Q 235,18 248,18
  L 285,20
  Q 305,22 315,30
  Q 322,38 320,45
  Q 316,54 300,58
  L 255,58
  Q 240,56 232,50
  Q 226,44 228,36
  L 228,22
  Z
`

// Bolster (metal collar between blade and handle)
const MIYABI_BOLSTER = `
  M 226,24
  L 232,22
  Q 238,22 240,26
  L 240,52
  Q 238,56 232,56
  L 226,54
  Q 222,50 222,38
  Q 222,26 226,24
  Z
`

// ============================================
// KERSHAW TACTICAL FOLDER - Pocket Knife
// ============================================
// Characteristics: Clip point blade, flipper tab,
// textured G10 handle scales, pocket clip, pivot

const KERSHAW_BLADE = `
  M 18,44
  L 45,38
  Q 80,32 100,30
  L 118,30
  Q 125,30 128,34
  L 130,40
  Q 130,46 125,50
  L 118,52
  Q 100,54 80,52
  L 45,48
  L 18,46
  Z
`

const KERSHAW_BLADE_SPINE = `
  M 18,44
  L 45,38
  Q 80,32 100,30
  L 118,30
`

const KERSHAW_BLADE_EDGE = `
  M 130,40
  Q 130,46 125,50
  L 118,52
  Q 100,54 80,52
  L 45,48
  L 18,46
`

// Handle scales with ergonomic contour
const KERSHAW_HANDLE = `
  M 128,30
  L 145,26
  Q 175,22 210,24
  L 250,28
  Q 268,34 270,45
  Q 270,58 252,64
  L 210,68
  Q 175,70 145,68
  L 128,64
  Q 118,58 118,45
  Q 118,34 128,30
  Z
`

// Textured grip pattern paths
const KERSHAW_TEXTURE = `
  M 150,30 L 150,62
  M 165,27 L 165,65
  M 180,25 L 180,67
  M 195,24 L 195,68
  M 210,25 L 210,67
  M 225,28 L 225,64
  M 240,32 L 240,60
  M 252,38 L 252,54
`

// Jimping (grip notches on spine)
const KERSHAW_JIMPING = `
  M 132,30 L 134,26
  M 138,29 L 140,25
  M 144,28 L 146,24
`

// ============================================
// STEAK KNIFE - Classic serrated profile
// ============================================

const STEAK_BLADE = `
  M 8,32
  L 55,26
  Q 75,24 85,26
  L 92,30
  Q 94,35 92,40
  Q 85,44 75,44
  L 55,42
  L 8,38
  Z
`

const STEAK_HANDLE = `
  M 94,28
  Q 100,26 110,26
  L 145,28
  Q 162,32 165,40
  Q 162,48 145,52
  L 110,54
  Q 100,54 94,52
  L 94,28
  Z
`

// ============================================
// COMPONENT
// ============================================

export default function KnifeVisualizer({
  type,
  bladeText = '',
  handleText = '',
  engravingLocation,
  font = 'Inter, sans-serif',
  setSize = 4,
}: KnifeVisualizerProps) {
  const showBlade = engravingLocation === 'blade' || engravingLocation === 'both'
  const showHandle = engravingLocation === 'handle' || engravingLocation === 'both'

  // Unique ID for gradients to prevent conflicts
  const uniqueId = useMemo(() => Math.random().toString(36).substring(7), [])

  // Steak/Kitchen Set View
  if (type === 'steak-set' || type === 'kitchen-set') {
    const count = type === 'steak-set' ? setSize : 4
    return (
      <div className="w-full">
        <svg viewBox="0 0 320 220" className="w-full max-w-md mx-auto">
          <defs>
            {/* Premium steel gradient for steak knives */}
            <linearGradient id={`steakSteel-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fafafa"/>
              <stop offset="15%" stopColor="#e8e8e8"/>
              <stop offset="40%" stopColor="#d0d0d0"/>
              <stop offset="60%" stopColor="#e0e0e0"/>
              <stop offset="85%" stopColor="#c8c8c8"/>
              <stop offset="100%" stopColor="#a8a8a8"/>
            </linearGradient>

            {/* Walnut wood handle gradient */}
            <linearGradient id={`steakWood-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b4423"/>
              <stop offset="25%" stopColor="#5c3d1e"/>
              <stop offset="50%" stopColor="#4a3218"/>
              <stop offset="75%" stopColor="#3d2812"/>
              <stop offset="100%" stopColor="#2f1f0e"/>
            </linearGradient>

            {/* Wood grain pattern */}
            <pattern id={`steakGrain-${uniqueId}`} patternUnits="userSpaceOnUse" width="40" height="8">
              <path d="M0,4 Q10,2 20,4 Q30,6 40,4" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" fill="none"/>
              <path d="M0,6 Q10,8 20,6 Q30,4 40,6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" fill="none"/>
            </pattern>

            {/* Glass shadow effect */}
            <filter id={`steakShadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2"/>
            </filter>

            {/* Bolster metal gradient */}
            <linearGradient id={`steakBolster-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c0c0c0"/>
              <stop offset="50%" stopColor="#909090"/>
              <stop offset="100%" stopColor="#a8a8a8"/>
            </linearGradient>
          </defs>

          <g filter={`url(#steakShadow-${uniqueId})`}>
            {Array.from({ length: count }).map((_, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, x: -30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: premiumEasing
                }}
              >
                <g transform={`translate(${i * 38}, ${i * 28})`}>
                  {/* Blade */}
                  <path
                    d={STEAK_BLADE}
                    fill={`url(#steakSteel-${uniqueId})`}
                    stroke="#888"
                    strokeWidth="0.5"
                  />

                  {/* Edge highlight */}
                  <path
                    d="M 8,38 L 55,42 Q 75,44 92,40"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="0.6"
                    strokeOpacity="0.5"
                  />

                  {/* Handle base */}
                  <path
                    d={STEAK_HANDLE}
                    fill={`url(#steakWood-${uniqueId})`}
                  />

                  {/* Wood grain overlay */}
                  <path
                    d={STEAK_HANDLE}
                    fill={`url(#steakGrain-${uniqueId})`}
                  />

                  {/* Bolster */}
                  <rect
                    x="91"
                    y="28"
                    width="5"
                    height="24"
                    fill={`url(#steakBolster-${uniqueId})`}
                    rx="0.5"
                  />

                  {/* Rivets */}
                  <circle cx="115" cy="40" r="2" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3"/>
                  <circle cx="140" cy="40" r="2" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3"/>
                </g>
              </motion.g>
            ))}
          </g>

          {/* Set label text */}
          {bladeText && showBlade && (
            <motion.text
              x="160"
              y="200"
              textAnchor="middle"
              fill="#555"
              fontSize="12"
              fontFamily={font}
              fontWeight="500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {bladeText}
            </motion.text>
          )}
        </svg>
        <p className="text-center text-sm text-gray-500 mt-2">
          {count}-piece {type === 'steak-set' ? 'steak knife' : 'kitchen'} set
        </p>
      </div>
    )
  }

  // Single knife (chef or pocket)
  const isChef = type === 'chef'

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.svg
          key={type}
          viewBox={isChef ? "0 0 360 100" : "0 0 300 100"}
          className="w-full max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <defs>
            {/* ========== PREMIUM STEEL GRADIENTS ========== */}

            {/* Japanese VG10/SG2 steel - bright, mirror polish */}
            <linearGradient id={`miyabiSteel-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="8%" stopColor="#f8f8f8"/>
              <stop offset="25%" stopColor="#e8e8e8"/>
              <stop offset="45%" stopColor="#d4d4d4"/>
              <stop offset="55%" stopColor="#e0e0e0"/>
              <stop offset="75%" stopColor="#d8d8d8"/>
              <stop offset="90%" stopColor="#c8c8c8"/>
              <stop offset="100%" stopColor="#b0b0b0"/>
            </linearGradient>

            {/* American tactical steel - satin/stonewash finish */}
            <linearGradient id={`kershawSteel-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8"/>
              <stop offset="20%" stopColor="#d8d8d8"/>
              <stop offset="40%" stopColor="#c8c8c8"/>
              <stop offset="60%" stopColor="#d0d0d0"/>
              <stop offset="80%" stopColor="#c0c0c0"/>
              <stop offset="100%" stopColor="#a8a8a8"/>
            </linearGradient>

            {/* ========== WOOD HANDLE GRADIENTS ========== */}

            {/* Pakkawood handle - rich brown laminate */}
            <linearGradient id={`pakkawood-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5a3d2b"/>
              <stop offset="20%" stopColor="#4d3324"/>
              <stop offset="40%" stopColor="#3f2a1d"/>
              <stop offset="60%" stopColor="#4a3020"/>
              <stop offset="80%" stopColor="#3a2618"/>
              <stop offset="100%" stopColor="#2d1e12"/>
            </linearGradient>

            {/* Wood grain pattern for pakkawood */}
            <pattern id={`woodGrain-${uniqueId}`} patternUnits="userSpaceOnUse" width="60" height="12" patternTransform="rotate(-5)">
              <path d="M0,3 Q15,1 30,3 Q45,5 60,3" stroke="rgba(0,0,0,0.12)" strokeWidth="0.4" fill="none"/>
              <path d="M0,6 Q15,8 30,6 Q45,4 60,6" stroke="rgba(255,220,180,0.06)" strokeWidth="0.3" fill="none"/>
              <path d="M0,9 Q15,7 30,9 Q45,11 60,9" stroke="rgba(0,0,0,0.08)" strokeWidth="0.3" fill="none"/>
            </pattern>

            {/* G10 tactical handle - dark textured composite */}
            <linearGradient id={`g10Handle-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a3a3a"/>
              <stop offset="25%" stopColor="#2d2d2d"/>
              <stop offset="50%" stopColor="#222222"/>
              <stop offset="75%" stopColor="#2a2a2a"/>
              <stop offset="100%" stopColor="#1a1a1a"/>
            </linearGradient>

            {/* ========== METAL ACCENTS ========== */}

            {/* Stainless bolster/guard */}
            <linearGradient id={`bolster-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8a8a8"/>
              <stop offset="30%" stopColor="#d0d0d0"/>
              <stop offset="50%" stopColor="#e8e8e8"/>
              <stop offset="70%" stopColor="#c8c8c8"/>
              <stop offset="100%" stopColor="#a0a0a0"/>
            </linearGradient>

            {/* Pivot screw metal */}
            <radialGradient id={`pivot-${uniqueId}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor="#888888"/>
              <stop offset="50%" stopColor="#606060"/>
              <stop offset="100%" stopColor="#404040"/>
            </radialGradient>

            {/* ========== EFFECTS ========== */}

            {/* Glass-like shadow */}
            <filter id={`glassShadow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.15"/>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1"/>
            </filter>

            {/* Engraving inset effect */}
            <filter id={`engrave-${uniqueId}`} x="-5%" y="-5%" width="110%" height="110%">
              <feOffset in="SourceAlpha" dx="0.5" dy="0.5" result="shadow"/>
              <feGaussianBlur in="shadow" stdDeviation="0.3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Edge highlight */}
            <linearGradient id={`edgeShine-${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Main knife group with glass shadow */}
          <g filter={`url(#glassShadow-${uniqueId})`}>
            <AnimatePresence mode="wait">
              {isChef ? (
                // ========== MIYABI CHEF KNIFE ==========
                <motion.g
                  key="miyabi"
                  initial={{ opacity: 0, scale: 0.95, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.5, ease: premiumEasing }}
                >
                  {/* Blade body */}
                  <motion.path
                    d={MIYABI_BLADE}
                    fill={`url(#miyabiSteel-${uniqueId})`}
                    stroke="#999"
                    strokeWidth="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: premiumEasing }}
                  />

                  {/* Spine line (darker) */}
                  <motion.path
                    d={MIYABI_SPINE}
                    fill="none"
                    stroke="#a0a0a0"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: premiumEasing }}
                  />

                  {/* Edge highlight (razor edge shine) */}
                  <motion.path
                    d={MIYABI_EDGE}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: premiumEasing }}
                  />

                  {/* Bolster */}
                  <motion.path
                    d={MIYABI_BOLSTER}
                    fill={`url(#bolster-${uniqueId})`}
                    stroke="#888"
                    strokeWidth="0.3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: premiumEasing }}
                  />

                  {/* Bolster highlight */}
                  <motion.ellipse
                    cx="232"
                    cy="32"
                    rx="4"
                    ry="6"
                    fill="rgba(255,255,255,0.3)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  />

                  {/* Handle base */}
                  <motion.path
                    d={MIYABI_HANDLE}
                    fill={`url(#pakkawood-${uniqueId})`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: premiumEasing }}
                  />

                  {/* Wood grain overlay */}
                  <motion.path
                    d={MIYABI_HANDLE}
                    fill={`url(#woodGrain-${uniqueId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />

                  {/* Handle highlight (D-shape contour) */}
                  <motion.path
                    d="M 248,20 Q 290,22 310,32"
                    fill="none"
                    stroke="rgba(255,220,180,0.15)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  />

                  {/* End cap accent */}
                  <motion.ellipse
                    cx="318"
                    cy="42"
                    rx="3"
                    ry="10"
                    fill="#2f1f0e"
                    stroke="#1a1208"
                    strokeWidth="0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  />

                  {/* Engraving area indicator - Blade */}
                  {showBlade && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {/* Engraving zone highlight */}
                      <rect
                        x="80"
                        y="32"
                        width="80"
                        height="16"
                        fill="rgba(0,200,200,0.08)"
                        rx="2"
                        stroke="rgba(0,200,200,0.3)"
                        strokeWidth="0.5"
                        strokeDasharray="3,2"
                      />

                      {/* Blade engraving text */}
                      <text
                        x="120"
                        y="44"
                        textAnchor="middle"
                        fill="#555"
                        fontSize="10"
                        fontFamily={font}
                        fontWeight="500"
                        filter={`url(#engrave-${uniqueId})`}
                      >
                        {bladeText || 'BLADE TEXT'}
                      </text>
                    </motion.g>
                  )}

                  {/* Engraving area indicator - Handle */}
                  {showHandle && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {/* Engraving zone highlight */}
                      <rect
                        x="252"
                        y="30"
                        width="48"
                        height="18"
                        fill="rgba(0,200,200,0.08)"
                        rx="2"
                        stroke="rgba(0,200,200,0.3)"
                        strokeWidth="0.5"
                        strokeDasharray="3,2"
                      />

                      {/* Handle engraving text */}
                      <text
                        x="276"
                        y="43"
                        textAnchor="middle"
                        fill="#c9a67a"
                        fontSize="8"
                        fontFamily={font}
                        fontWeight="500"
                      >
                        {handleText || 'HANDLE'}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              ) : (
                // ========== KERSHAW POCKET KNIFE ==========
                <motion.g
                  key="kershaw"
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.5, ease: premiumEasing }}
                >
                  {/* Blade body */}
                  <motion.path
                    d={KERSHAW_BLADE}
                    fill={`url(#kershawSteel-${uniqueId})`}
                    stroke="#888"
                    strokeWidth="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: premiumEasing }}
                  />

                  {/* Blade spine */}
                  <motion.path
                    d={KERSHAW_BLADE_SPINE}
                    fill="none"
                    stroke="#a0a0a0"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />

                  {/* Edge shine */}
                  <motion.path
                    d={KERSHAW_BLADE_EDGE}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.6"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  {/* Jimping on spine */}
                  <motion.path
                    d={KERSHAW_JIMPING}
                    fill="none"
                    stroke="#777"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />

                  {/* Handle scales */}
                  <motion.path
                    d={KERSHAW_HANDLE}
                    fill={`url(#g10Handle-${uniqueId})`}
                    stroke="#444"
                    strokeWidth="0.5"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: premiumEasing }}
                  />

                  {/* Handle texture lines */}
                  <motion.path
                    d={KERSHAW_TEXTURE}
                    fill="none"
                    stroke="#444"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  />

                  {/* Handle highlight */}
                  <motion.path
                    d="M 145,28 Q 200,26 250,32"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  />

                  {/* Flipper tab */}
                  <motion.path
                    d="M 125,30 L 135,26 L 138,30 Q 136,34 130,34 L 125,30 Z"
                    fill="#606060"
                    stroke="#505050"
                    strokeWidth="0.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  />

                  {/* Pivot circle (outer) */}
                  <motion.circle
                    cx="135"
                    cy="47"
                    r="8"
                    fill={`url(#pivot-${uniqueId})`}
                    stroke="#555"
                    strokeWidth="0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                  />

                  {/* Pivot circle (inner detail) */}
                  <motion.circle
                    cx="135"
                    cy="47"
                    r="4"
                    fill="#707070"
                    stroke="#606060"
                    strokeWidth="0.3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  />

                  {/* Pivot center dot */}
                  <motion.circle
                    cx="135"
                    cy="47"
                    r="1.5"
                    fill="#888"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.55, type: 'spring' }}
                  />

                  {/* Pocket clip */}
                  <motion.g
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                  >
                    <path
                      d="M 255,32 Q 255,22 262,18 L 282,18 L 282,24 L 265,24 Q 260,26 260,32"
                      fill="#505050"
                      stroke="#404040"
                      strokeWidth="0.5"
                    />
                    {/* Clip highlight */}
                    <path
                      d="M 262,20 L 278,20"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  </motion.g>

                  {/* Lanyard hole */}
                  <motion.circle
                    cx="262"
                    cy="58"
                    r="4"
                    fill="#1a1a1a"
                    stroke="#333"
                    strokeWidth="0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  />

                  {/* Engraving area indicator - Blade */}
                  {showBlade && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {/* Engraving zone highlight */}
                      <rect
                        x="38"
                        y="34"
                        width="55"
                        height="14"
                        fill="rgba(0,200,200,0.08)"
                        rx="2"
                        stroke="rgba(0,200,200,0.3)"
                        strokeWidth="0.5"
                        strokeDasharray="3,2"
                      />

                      {/* Blade engraving text */}
                      <text
                        x="65"
                        y="45"
                        textAnchor="middle"
                        fill="#666"
                        fontSize="8"
                        fontFamily={font}
                        fontWeight="500"
                        filter={`url(#engrave-${uniqueId})`}
                      >
                        {bladeText || 'BLADE'}
                      </text>
                    </motion.g>
                  )}

                  {/* Engraving area indicator - Handle */}
                  {showHandle && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {/* Engraving zone highlight */}
                      <rect
                        x="168"
                        y="38"
                        width="60"
                        height="18"
                        fill="rgba(0,200,200,0.08)"
                        rx="2"
                        stroke="rgba(0,200,200,0.3)"
                        strokeWidth="0.5"
                        strokeDasharray="3,2"
                      />

                      {/* Handle engraving text */}
                      <text
                        x="198"
                        y="51"
                        textAnchor="middle"
                        fill="#909090"
                        fontSize="7"
                        fontFamily={font}
                        fontWeight="500"
                      >
                        {handleText || 'HANDLE TEXT'}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </motion.svg>
      </AnimatePresence>

      {/* Label */}
      <motion.p
        className="text-center text-sm text-gray-500 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isChef ? 'Miyabi SG2 8" Chef Knife' : 'Kershaw Tactical Folder'}
      </motion.p>
    </div>
  )
}
