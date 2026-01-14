'use client'

import { motion } from 'framer-motion'

type KnifeType = 'pocket' | 'chef' | 'steak-set' | 'kitchen-set'
type EngravingLocation = 'blade' | 'handle' | 'both'

interface KnifeVisualizerProps {
  type: KnifeType
  bladeText?: string
  handleText?: string
  engravingLocation: EngravingLocation
  font?: string
  setSize?: number // 4 or 6 for steak sets
}

// Miyabi SG2 8" Chef Knife - Japanese gyuto profile
// Characteristics: Curved belly, pointed tip, thin spine, D-shaped handle
const MIYABI_BLADE = `
  M 15,55
  C 25,52 45,42 80,35
  Q 130,25 175,22
  L 195,21
  Q 205,21 210,25
  L 212,30
  Q 210,38 195,40
  L 70,52
  Q 40,58 20,60
  L 15,55
  Z
`

const MIYABI_HANDLE = `
  M 212,25
  Q 218,23 228,23
  L 270,25
  Q 285,27 290,33
  Q 292,42 288,48
  L 228,50
  Q 218,50 212,45
  L 212,30
  Z
`

// Kershaw-style tactical folder
// Characteristics: Clip point blade, flipper tab, textured handle scales
const KERSHAW_BLADE_CLOSED = `
  M 20,42
  L 85,35
  Q 105,33 115,37
  L 120,42
  L 115,47
  Q 105,51 85,49
  L 20,44
  Z
`

const KERSHAW_HANDLE = `
  M 120,35
  L 135,33
  Q 170,31 200,33
  L 235,37
  Q 250,42 250,48
  Q 250,54 235,58
  L 200,62
  Q 170,64 135,62
  L 120,60
  Q 115,52 115,47
  Q 115,42 120,35
  Z
`

const KERSHAW_TEXTURE = `
  M 140,38 L 140,58
  M 155,36 L 155,60
  M 170,35 L 170,61
  M 185,35 L 185,61
  M 200,36 L 200,60
  M 215,38 L 215,58
  M 230,40 L 230,56
`

// Steak knife silhouette (simpler, more uniform)
const STEAK_BLADE = `
  M 10,30
  L 70,25
  Q 85,24 90,28
  L 90,35
  Q 85,38 70,38
  L 10,34
  Z
`

const STEAK_HANDLE = `
  M 90,26
  L 95,25
  Q 110,24 130,25
  L 150,28
  Q 158,32 158,35
  Q 158,38 150,42
  L 130,45
  Q 110,46 95,45
  L 90,44
  L 90,26
  Z
`

export default function KnifeVisualizer({
  type,
  bladeText = '',
  handleText = '',
  engravingLocation,
  font = 'Inter',
  setSize = 4,
}: KnifeVisualizerProps) {
  const showBlade = engravingLocation === 'blade' || engravingLocation === 'both'
  const showHandle = engravingLocation === 'handle' || engravingLocation === 'both'

  // Steak set or kitchen set - show multiple knives
  if (type === 'steak-set' || type === 'kitchen-set') {
    const count = type === 'steak-set' ? setSize : 4
    return (
      <div className="w-full">
        <svg viewBox="0 0 300 200" className="w-full max-w-md mx-auto">
          <defs>
            <linearGradient id="steakSteel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8"/>
              <stop offset="40%" stopColor="#d0d0d0"/>
              <stop offset="100%" stopColor="#a8a8a8"/>
            </linearGradient>
            <linearGradient id="steakHandle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c4033"/>
              <stop offset="50%" stopColor="#4a3428"/>
              <stop offset="100%" stopColor="#3d2817"/>
            </linearGradient>
          </defs>

          {Array.from({ length: count }).map((_, i) => (
            <g key={i} transform={`translate(${i * 35}, ${i * 25})`}>
              <motion.path
                d={STEAK_BLADE}
                fill="url(#steakSteel)"
                stroke="#888"
                strokeWidth="0.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              />
              <motion.path
                d={STEAK_HANDLE}
                fill="url(#steakHandle)"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.05 }}
              />
              {/* Bolster */}
              <motion.rect
                x="88"
                y="27"
                width="4"
                height="16"
                fill="#a0a0a0"
                rx="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.1 }}
              />
            </g>
          ))}

          {/* Text label */}
          {bladeText && showBlade && (
            <text
              x="150"
              y="180"
              textAnchor="middle"
              fill="#666"
              fontSize="11"
              fontFamily={font}
            >
              {bladeText}
            </text>
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
      <svg viewBox={isChef ? "0 0 320 90" : "0 0 280 80"} className="w-full max-w-md mx-auto">
        <defs>
          {/* Steel blade gradient */}
          <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f0f0"/>
            <stop offset="30%" stopColor="#d8d8d8"/>
            <stop offset="60%" stopColor="#e0e0e0"/>
            <stop offset="100%" stopColor="#b0b0b0"/>
          </linearGradient>

          {/* Handle wood gradient */}
          <linearGradient id="handleWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c4033"/>
            <stop offset="50%" stopColor="#4a3428"/>
            <stop offset="100%" stopColor="#3d2817"/>
          </linearGradient>

          {/* Kershaw handle (dark G10) */}
          <linearGradient id="kershawHandle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a"/>
            <stop offset="50%" stopColor="#2a2a2a"/>
            <stop offset="100%" stopColor="#1a1a1a"/>
          </linearGradient>

          {/* Edge highlight */}
          <linearGradient id="edgeHighlight" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {isChef ? (
          // Miyabi SG2 Chef Knife
          <g>
            {/* Blade */}
            <motion.path
              d={MIYABI_BLADE}
              fill="url(#bladeSteel)"
              stroke="#999"
              strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Edge highlight line */}
            <motion.path
              d="M 15,55 Q 40,58 70,52 L 195,40"
              fill="none"
              stroke="#fff"
              strokeWidth="0.8"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            {/* Handle */}
            <motion.path
              d={MIYABI_HANDLE}
              fill="url(#handleWood)"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            {/* Bolster */}
            <motion.rect
              x="209"
              y="27"
              width="6"
              height="20"
              fill="#a8a8a8"
              rx="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />

            {/* Blade engraving text */}
            {showBlade && bladeText && (
              <motion.text
                x="110"
                y="42"
                textAnchor="middle"
                fill="#666"
                fontSize="9"
                fontFamily={font}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {bladeText}
              </motion.text>
            )}

            {/* Handle engraving text */}
            {showHandle && handleText && (
              <motion.text
                x="250"
                y="40"
                textAnchor="middle"
                fill="#c9a67a"
                fontSize="8"
                fontFamily={font}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {handleText}
              </motion.text>
            )}
          </g>
        ) : (
          // Kershaw Pocket Knife
          <g>
            {/* Blade */}
            <motion.path
              d={KERSHAW_BLADE_CLOSED}
              fill="url(#bladeSteel)"
              stroke="#888"
              strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Handle */}
            <motion.path
              d={KERSHAW_HANDLE}
              fill="url(#kershawHandle)"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            {/* Handle texture lines */}
            <motion.path
              d={KERSHAW_TEXTURE}
              fill="none"
              stroke="#444"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />

            {/* Pivot screw */}
            <motion.circle
              cx="125"
              cy="47"
              r="5"
              fill="#555"
              stroke="#666"
              strokeWidth="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            />
            <motion.circle
              cx="125"
              cy="47"
              r="2"
              fill="#777"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            />

            {/* Flipper tab */}
            <motion.rect
              x="115"
              y="33"
              width="8"
              height="5"
              fill="#666"
              rx="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />

            {/* Pocket clip */}
            <motion.path
              d="M 240,38 L 255,36 L 255,58 L 240,60"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />

            {/* Blade engraving text */}
            {showBlade && bladeText && (
              <motion.text
                x="65"
                y="44"
                textAnchor="middle"
                fill="#666"
                fontSize="8"
                fontFamily={font}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {bladeText}
              </motion.text>
            )}

            {/* Handle engraving text */}
            {showHandle && handleText && (
              <motion.text
                x="185"
                y="50"
                textAnchor="middle"
                fill="#888"
                fontSize="7"
                fontFamily={font}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {handleText}
              </motion.text>
            )}
          </g>
        )}
      </svg>

      {/* Label */}
      <p className="text-center text-sm text-gray-500 mt-3">
        {isChef ? 'Chef Knife (Miyabi style)' : 'Pocket Knife (Kershaw style)'}
      </p>
    </div>
  )
}
