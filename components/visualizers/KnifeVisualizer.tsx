'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/*
 * Knife Visualizer Component
 *
 * Realistic SVG silhouettes of knives.
 * Knife types:
 * - Miyabi SG2 8" Chef (Japanese gyuto profile)
 * - Kershaw Pocket Knife (tactical folder)
 *
 * Features:
 * - Realistic blade gradients
 * - Wood/material handle textures
 * - Accurate engraving positioning
 * - Multiple knife type support
 */

interface KnifeVisualizerProps {
  type?: 'chef' | 'pocket'
  text?: string
  text2?: string
  engravingPosition?: 'blade' | 'handle'
  className?: string
}

export default function KnifeVisualizer({
  type = 'chef',
  text = '',
  text2 = '',
  engravingPosition = 'blade',
  className = '',
}: KnifeVisualizerProps) {
  if (type === 'pocket') {
    return <PocketKnife text={text} className={className} />
  }

  return <ChefKnife text={text} text2={text2} engravingPosition={engravingPosition} className={className} />
}

/*
 * Miyabi SG2 8" Chef Knife
 * Japanese gyuto profile with D-shaped pakkawood handle
 */
function ChefKnife({
  text,
  text2,
  engravingPosition,
  className,
}: {
  text: string
  text2?: string
  engravingPosition: 'blade' | 'handle'
  className: string
}) {
  const bladeGradientId = useMemo(
    () => `chef-blade-${Math.random().toString(36).substr(2, 9)}`,
    []
  )
  const handleGradientId = useMemo(
    () => `chef-handle-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg viewBox="0 0 500 120" className="w-full h-auto">
        <defs>
          {/* Blade gradient - steel with subtle color variation */}
          <linearGradient id={bladeGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0F0F0" />
            <stop offset="15%" stopColor="#E0E0E0" />
            <stop offset="50%" stopColor="#D8D8D8" />
            <stop offset="85%" stopColor="#C8C8C8" />
            <stop offset="100%" stopColor="#B0B0B0" />
          </linearGradient>

          {/* Handle gradient - pakkawood (dark brown) */}
          <linearGradient id={handleGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A3528" />
            <stop offset="30%" stopColor="#3A2A20" />
            <stop offset="70%" stopColor="#2A1A15" />
            <stop offset="100%" stopColor="#201510" />
          </linearGradient>

          {/* Wood grain pattern */}
          <pattern
            id="wood-grain"
            patternUnits="userSpaceOnUse"
            width="100"
            height="4"
          >
            <line
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="#1A1008"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>

          {/* Drop shadow */}
          <filter id="knife-shadow" x="-5%" y="-20%" width="110%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter="url(#knife-shadow)">
          {/* Blade - Japanese gyuto profile */}
          <path
            d={`
              M 40,55
              C 60,50 100,35 180,30
              L 320,30
              C 360,30 380,35 400,45
              L 420,55
              L 400,65
              C 380,70 340,75 280,75
              L 100,75
              C 70,75 50,70 40,65
              Z
            `}
            fill={`url(#${bladeGradientId})`}
            stroke="#A0A0A0"
            strokeWidth="0.5"
          />

          {/* Blade edge highlight */}
          <path
            d={`
              M 45,62
              C 65,67 85,70 100,72
              L 280,72
              C 340,72 375,68 398,62
            `}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Spine */}
          <path
            d={`
              M 180,30
              L 320,30
              C 360,30 380,35 400,45
            `}
            fill="none"
            stroke="#C0C0C0"
            strokeWidth="0.5"
          />

          {/* Bolster (metal between blade and handle) */}
          <rect
            x="35"
            y="50"
            width="15"
            height="20"
            rx="2"
            fill="#909090"
            stroke="#707070"
            strokeWidth="0.5"
          />

          {/* Handle - D-shaped pakkawood */}
          <path
            d={`
              M 20,50
              C 15,55 10,58 10,62
              C 10,70 15,78 25,80
              L 35,80
              L 35,40
              L 25,40
              C 15,42 10,48 10,55
              Z
            `}
            fill={`url(#${handleGradientId})`}
            stroke="#1A1008"
            strokeWidth="0.5"
          />

          {/* Handle wood grain overlay */}
          <path
            d={`
              M 20,50
              C 15,55 10,58 10,62
              C 10,70 15,78 25,80
              L 35,80
              L 35,40
              L 25,40
              C 15,42 10,48 10,55
              Z
            `}
            fill="url(#wood-grain)"
          />

          {/* Handle rivets */}
          <circle cx="22" cy="52" r="2" fill="#606060" />
          <circle cx="22" cy="68" r="2" fill="#606060" />
        </g>

        {/* Engraving on blade */}
        {engravingPosition === 'blade' && text && (
          <text
            x="220"
            y="55"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#707070"
            fontSize="12"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            letterSpacing="1"
          >
            {text.slice(0, 20)}
          </text>
        )}

        {/* Second line on blade */}
        {engravingPosition === 'blade' && text2 && (
          <text
            x="220"
            y="68"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#808080"
            fontSize="9"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="400"
          >
            {text2.slice(0, 25)}
          </text>
        )}
      </svg>

      {/* Label */}
      <div className="text-center mt-3 text-xs text-[var(--color-muted)]">
        Miyabi SG2 8&quot; Chef Knife
      </div>
    </motion.div>
  )
}

/*
 * Kershaw Pocket Knife
 * Tactical folder with clip point blade
 */
function PocketKnife({
  text,
  className,
}: {
  text: string
  className: string
}) {
  const bladeGradientId = useMemo(
    () => `pocket-blade-${Math.random().toString(36).substr(2, 9)}`,
    []
  )
  const handleGradientId = useMemo(
    () => `pocket-handle-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg viewBox="0 0 400 100" className="w-full h-auto">
        <defs>
          {/* Blade gradient - tactical steel */}
          <linearGradient id={bladeGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A0A0A0" />
            <stop offset="50%" stopColor="#909090" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>

          {/* Handle gradient - textured G10 */}
          <linearGradient id={handleGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#383838" />
            <stop offset="50%" stopColor="#282828" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>

          {/* Texture pattern for handle */}
          <pattern
            id="g10-texture"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="4" height="4" fill="transparent" />
            <circle cx="2" cy="2" r="0.5" fill="#404040" opacity="0.5" />
          </pattern>

          <filter id="pocket-shadow" x="-5%" y="-20%" width="110%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter="url(#pocket-shadow)">
          {/* Blade - clip point profile */}
          <path
            d={`
              M 175,40
              L 320,35
              L 350,42
              L 345,50
              L 175,55
              Z
            `}
            fill={`url(#${bladeGradientId})`}
            stroke="#606060"
            strokeWidth="0.5"
          />

          {/* Blade edge */}
          <path
            d="M 180,53 L 340,48"
            fill="none"
            stroke="#B0B0B0"
            strokeWidth="0.5"
          />

          {/* Pivot circle */}
          <circle
            cx="175"
            cy="48"
            r="8"
            fill="#505050"
            stroke="#404040"
            strokeWidth="0.5"
          />
          <circle cx="175" cy="48" r="3" fill="#303030" />

          {/* Handle body */}
          <path
            d={`
              M 40,38
              L 175,38
              L 175,62
              L 40,62
              C 30,62 25,58 25,50
              C 25,42 30,38 40,38
              Z
            `}
            fill={`url(#${handleGradientId})`}
            stroke="#101010"
            strokeWidth="0.5"
          />

          {/* Handle texture overlay */}
          <path
            d={`
              M 40,38
              L 175,38
              L 175,62
              L 40,62
              C 30,62 25,58 25,50
              C 25,42 30,38 40,38
              Z
            `}
            fill="url(#g10-texture)"
          />

          {/* Flipper tab */}
          <rect
            x="168"
            y="35"
            width="14"
            height="6"
            rx="1"
            fill="#505050"
          />

          {/* Pocket clip */}
          <path
            d={`
              M 50,38
              L 50,25
              C 50,22 55,20 60,20
              L 130,20
              C 135,20 137,23 135,28
              L 130,38
            `}
            fill="none"
            stroke="#606060"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Liner lock (visible line) */}
          <line
            x1="100"
            y1="38"
            x2="100"
            y2="62"
            stroke="#404040"
            strokeWidth="0.5"
          />
        </g>

        {/* Engraving on blade */}
        {text && (
          <text
            x="260"
            y="46"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#505050"
            fontSize="10"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
            letterSpacing="0.5"
          >
            {text.slice(0, 15)}
          </text>
        )}
      </svg>

      {/* Label */}
      <div className="text-center mt-3 text-xs text-[var(--color-muted)]">
        Kershaw Pocket Knife
      </div>
    </motion.div>
  )
}

/*
 * Knife type selector
 */
interface KnifeTypeSelectorProps {
  value: KnifeVisualizerProps['type']
  onChange: (type: KnifeVisualizerProps['type']) => void
}

export function KnifeTypeSelector({ value, onChange }: KnifeTypeSelectorProps) {
  const types: Array<{
    id: KnifeVisualizerProps['type']
    label: string
    description: string
  }> = [
    { id: 'chef', label: 'Chef Knife', description: 'Miyabi SG2 8"' },
    { id: 'pocket', label: 'Pocket Knife', description: 'Kershaw Folder' },
  ]

  return (
    <div className="flex gap-3">
      {types.map((knifeType) => (
        <motion.button
          key={knifeType.id}
          type="button"
          className={`
            flex-1 p-4 rounded-xl text-left
            border-2 transition-all
            ${value === knifeType.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(knifeType.id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="font-medium text-[var(--color-dark)]">
            {knifeType.label}
          </div>
          <div className="text-xs text-[var(--color-muted)] mt-0.5">
            {knifeType.description}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
