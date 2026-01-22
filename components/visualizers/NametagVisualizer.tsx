'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

/*
 * Nametag/Badge Visualizer Component
 *
 * Realistic preview of name badges for conferences, workplaces, events.
 * Features:
 * - Multiple styles (engraved plastic, metal, badge holder)
 * - Name + title layout
 * - Color options
 * - Pin/magnetic/clip attachment indicators
 */

interface NametagVisualizerProps {
  name?: string
  title?: string
  company?: string
  style?: 'engraved' | 'metal' | 'badge-holder' | 'premium'
  color?: 'black' | 'white' | 'navy' | 'burgundy' | 'forest' | 'gold'
  attachment?: 'pin' | 'magnetic' | 'clip' | 'lanyard'
  size?: 'small' | 'standard' | 'large'
  className?: string
}

const colorStyles = {
  black: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    accent: '#E0E0E0',
    border: '#333333',
  },
  white: {
    background: '#FFFFFF',
    text: '#1A1A1A',
    accent: '#505050',
    border: '#E0E0E0',
  },
  navy: {
    background: '#1E3A5F',
    text: '#FFFFFF',
    accent: '#A0B8D0',
    border: '#2A4A70',
  },
  burgundy: {
    background: '#5C1A2A',
    text: '#FFFFFF',
    accent: '#D0A0A8',
    border: '#6C2A3A',
  },
  forest: {
    background: '#1A3D2E',
    text: '#FFFFFF',
    accent: '#A0C8B0',
    border: '#2A4D3E',
  },
  gold: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #C9A227 50%, #D4AF37 100%)',
    text: '#1A1A1A',
    accent: '#5A4A20',
    border: '#B8941F',
  },
}

const sizeConfigs = {
  small: { width: 200, height: 60, nameFontSize: 14, titleFontSize: 10 },
  standard: { width: 280, height: 80, nameFontSize: 18, titleFontSize: 12 },
  large: { width: 340, height: 100, nameFontSize: 22, titleFontSize: 14 },
}

export default function NametagVisualizer({
  name = '',
  title = '',
  company = '',
  style = 'engraved',
  color = 'black',
  attachment = 'magnetic',
  size = 'standard',
  className = '',
}: NametagVisualizerProps) {
  const colorStyle = colorStyles[color]
  const dimensions = sizeConfigs[size]

  const gradientId = useMemo(
    () => `nametag-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  if (style === 'badge-holder') {
    return (
      <BadgeHolderStyle
        name={name}
        title={title}
        company={company}
        dimensions={dimensions}
        className={className}
      />
    )
  }

  if (style === 'premium') {
    return (
      <PremiumMetalStyle
        name={name}
        title={title}
        dimensions={dimensions}
        className={className}
      />
    )
  }

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="drop-shadow-lg"
      >
        <defs>
          {/* Subtle gradient overlay for depth */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="nametag-shadow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
          </filter>

          {/* Engraved text effect */}
          <filter id="engraved-name" x="-5%" y="-20%" width="110%" height="140%">
            <feOffset dx="0" dy="1" in="SourceAlpha" result="shadow" />
            <feGaussianBlur stdDeviation="0.5" in="shadow" result="blur" />
            <feFlood floodColor="#000000" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#nametag-shadow)">
          {/* Main badge body */}
          <rect
            x="2"
            y="2"
            width={dimensions.width - 4}
            height={dimensions.height - 4}
            rx="6"
            fill={colorStyle.background}
            stroke={colorStyle.border}
            strokeWidth="1"
          />

          {/* Gradient overlay */}
          <rect
            x="2"
            y="2"
            width={dimensions.width - 4}
            height={dimensions.height - 4}
            rx="6"
            fill={`url(#${gradientId})`}
          />

          {/* Metal style extra effects */}
          {style === 'metal' && (
            <>
              {/* Brushed metal lines */}
              {Array.from({ length: Math.floor(dimensions.height / 3) }).map((_, i) => (
                <line
                  key={i}
                  x1="4"
                  y1={4 + i * 3}
                  x2={dimensions.width - 4}
                  y2={4 + i * 3}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  opacity="0.05"
                />
              ))}
              {/* Corner bevels */}
              <rect
                x="2"
                y="2"
                width={dimensions.width - 4}
                height={dimensions.height - 4}
                rx="6"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity="0.1"
              />
            </>
          )}
        </g>

        {/* Name text */}
        <g filter="url(#engraved-name)">
          {name && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2 - (title || company ? 6 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={colorStyle.text}
              fontSize={dimensions.nameFontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {name}
            </text>
          )}

          {/* Title text */}
          {title && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2 + dimensions.nameFontSize / 2 + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={colorStyle.accent}
              fontSize={dimensions.titleFontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="400"
            >
              {title}
            </text>
          )}

          {/* Company text */}
          {company && !title && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2 + dimensions.nameFontSize / 2 + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={colorStyle.accent}
              fontSize={dimensions.titleFontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="400"
            >
              {company}
            </text>
          )}
        </g>

        {/* Attachment indicator */}
        {attachment === 'pin' && (
          <g>
            <circle
              cx={dimensions.width - 16}
              cy="16"
              r="4"
              fill="#A0A0A0"
              stroke="#808080"
              strokeWidth="0.5"
            />
            <circle cx={dimensions.width - 16} cy="16" r="1.5" fill="#606060" />
          </g>
        )}

        {attachment === 'magnetic' && (
          <g>
            <rect
              x={dimensions.width - 24}
              y="10"
              width="12"
              height="12"
              rx="2"
              fill="#505050"
              stroke="#404040"
              strokeWidth="0.5"
            />
            <text
              x={dimensions.width - 18}
              y="17"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#A0A0A0"
              fontSize="6"
              fontWeight="bold"
            >
              M
            </text>
          </g>
        )}
      </svg>

      {/* Info indicator */}
      <div className="text-center mt-2 text-xs text-[var(--color-muted)]">
        {style} • {color} • {attachment}
      </div>
    </motion.div>
  )
}

/*
 * Badge holder style (conference/event style)
 */
function BadgeHolderStyle({
  name,
  title,
  company,
  dimensions,
  className,
}: {
  name: string
  title: string
  company: string
  dimensions: typeof sizeConfigs.standard
  className: string
}) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height + 30}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height + 30}`}
        className="drop-shadow-lg"
      >
        <defs>
          <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Lanyard attachment */}
        <g>
          <rect
            x={dimensions.width / 2 - 15}
            y="0"
            width="30"
            height="12"
            rx="3"
            fill="#606060"
          />
          <rect
            x={dimensions.width / 2 - 8}
            y="4"
            width="16"
            height="4"
            rx="2"
            fill="#404040"
          />
        </g>

        {/* Badge holder (clear plastic) */}
        <g filter="url(#badge-shadow)">
          <rect
            x="4"
            y="16"
            width={dimensions.width - 8}
            height={dimensions.height + 10}
            rx="4"
            fill="rgba(255,255,255,0.95)"
            stroke="#E0E0E0"
            strokeWidth="1"
          />

          {/* Plastic sheen */}
          <rect
            x="4"
            y="16"
            width={dimensions.width - 8}
            height={dimensions.height + 10}
            rx="4"
            fill="linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)"
          />
        </g>

        {/* Badge content */}
        {name && (
          <text
            x={dimensions.width / 2}
            y={40 + (title || company ? 0 : 10)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1A1A1A"
            fontSize={dimensions.nameFontSize}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="700"
          >
            {name}
          </text>
        )}

        {title && (
          <text
            x={dimensions.width / 2}
            y={40 + dimensions.nameFontSize + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#505050"
            fontSize={dimensions.titleFontSize}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="500"
          >
            {title}
          </text>
        )}

        {company && (
          <text
            x={dimensions.width / 2}
            y={dimensions.height + 16}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#707070"
            fontSize={dimensions.titleFontSize - 2}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="400"
          >
            {company}
          </text>
        )}
      </svg>

      <div className="text-center mt-2 text-xs text-[var(--color-muted)]">
        badge holder • lanyard
      </div>
    </motion.div>
  )
}

/*
 * Premium metal style (executive)
 */
function PremiumMetalStyle({
  name,
  title,
  dimensions,
  className,
}: {
  name: string
  title: string
  dimensions: typeof sizeConfigs.standard
  className: string
}) {
  const gradientId = useMemo(
    () => `premium-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="drop-shadow-xl"
      >
        <defs>
          {/* Premium gold gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0E68C" />
            <stop offset="20%" stopColor="#D4AF37" />
            <stop offset="40%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="80%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          {/* Deep shadow */}
          <filter id="premium-shadow" x="-15%" y="-15%" width="130%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
          </filter>

          {/* Engraved effect */}
          <filter id="premium-engrave" x="-5%" y="-20%" width="110%" height="140%">
            <feOffset dx="0.5" dy="1" in="SourceAlpha" result="shadow" />
            <feGaussianBlur stdDeviation="0.5" in="shadow" result="blur" />
            <feFlood floodColor="#000000" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#premium-shadow)">
          {/* Main body with gold gradient */}
          <rect
            x="2"
            y="2"
            width={dimensions.width - 4}
            height={dimensions.height - 4}
            rx="4"
            fill={`url(#${gradientId})`}
            stroke="#8B7500"
            strokeWidth="1.5"
          />

          {/* Inner bevel highlight */}
          <rect
            x="6"
            y="6"
            width={dimensions.width - 12}
            height={dimensions.height - 12}
            rx="2"
            fill="none"
            stroke="#FFE55C"
            strokeWidth="0.5"
            opacity="0.5"
          />

          {/* Decorative corner accents */}
          <path
            d={`M 10,10 L 10,20 M 10,10 L 20,10`}
            stroke="#8B7500"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d={`M ${dimensions.width - 10},10 L ${dimensions.width - 10},20 M ${dimensions.width - 10},10 L ${dimensions.width - 20},10`}
            stroke="#8B7500"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d={`M 10,${dimensions.height - 10} L 10,${dimensions.height - 20} M 10,${dimensions.height - 10} L 20,${dimensions.height - 10}`}
            stroke="#8B7500"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d={`M ${dimensions.width - 10},${dimensions.height - 10} L ${dimensions.width - 10},${dimensions.height - 20} M ${dimensions.width - 10},${dimensions.height - 10} L ${dimensions.width - 20},${dimensions.height - 10}`}
            stroke="#8B7500"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {/* Engraved text */}
        <g filter="url(#premium-engrave)">
          {name && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2 - (title ? 6 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3D2E00"
              fontSize={dimensions.nameFontSize}
              fontFamily="'Times New Roman', serif"
              fontWeight="600"
              letterSpacing="2"
            >
              {name.toUpperCase()}
            </text>
          )}

          {title && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2 + dimensions.nameFontSize / 2 + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#5D4E10"
              fontSize={dimensions.titleFontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontStyle="italic"
              fontWeight="400"
            >
              {title}
            </text>
          )}
        </g>
      </svg>

      <div className="text-center mt-2 text-xs text-[var(--color-muted)]">
        premium • gold • executive
      </div>
    </motion.div>
  )
}

/*
 * Style selector for nametags
 */
interface StyleSelectorProps {
  value: NametagVisualizerProps['style']
  onChange: (style: NametagVisualizerProps['style']) => void
}

export function NametagStyleSelector({ value, onChange }: StyleSelectorProps) {
  const styles: Array<{
    id: NametagVisualizerProps['style']
    label: string
    description: string
  }> = [
    { id: 'engraved', label: 'Engraved', description: 'Classic plastic' },
    { id: 'metal', label: 'Metal', description: 'Brushed finish' },
    { id: 'badge-holder', label: 'Badge', description: 'Event style' },
    { id: 'premium', label: 'Premium', description: 'Executive gold' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {styles.map((styleOption) => (
        <motion.button
          key={styleOption.id}
          type="button"
          className={`
            p-3 rounded-lg text-left
            border-2 transition-all
            ${value === styleOption.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(styleOption.id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="font-medium text-sm text-[var(--color-dark)]">
            {styleOption.label}
          </div>
          <div className="text-xs text-[var(--color-muted)] mt-0.5">
            {styleOption.description}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

/*
 * Color selector for nametags
 */
interface ColorSelectorProps {
  value: NametagVisualizerProps['color']
  onChange: (color: NametagVisualizerProps['color']) => void
}

export function NametagColorSelector({ value, onChange }: ColorSelectorProps) {
  const colors: Array<{
    id: NametagVisualizerProps['color']
    label: string
    bg: string
  }> = [
    { id: 'black', label: 'Black', bg: '#1A1A1A' },
    { id: 'white', label: 'White', bg: '#FFFFFF' },
    { id: 'navy', label: 'Navy', bg: '#1E3A5F' },
    { id: 'burgundy', label: 'Burgundy', bg: '#5C1A2A' },
    { id: 'forest', label: 'Forest', bg: '#1A3D2E' },
    { id: 'gold', label: 'Gold', bg: '#D4AF37' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((colorOption) => (
        <motion.button
          key={colorOption.id}
          type="button"
          className={`
            w-8 h-8 rounded-lg border-2 transition-all
            ${value === colorOption.id
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          style={{ background: colorOption.bg }}
          onClick={() => onChange(colorOption.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={colorOption.label}
        />
      ))}
    </div>
  )
}
