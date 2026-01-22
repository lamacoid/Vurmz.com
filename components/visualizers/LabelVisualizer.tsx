'use client'

import { motion } from 'framer-motion'

/*
 * Label/Sign Visualizer Component
 *
 * Industrial labels and safety signs with ISO 7010 compliant icons.
 * Features:
 * - Two-layer engraved plastic simulation
 * - Multiple sizes
 * - Safety icon library
 * - Mounting hole options
 */

interface LabelVisualizerProps {
  text?: string
  text2?: string
  icon?: string
  size?: 'small' | 'medium' | 'large'
  shape?: 'rectangle' | 'rounded' | 'circle'
  colorScheme?: 'black-white' | 'yellow-black' | 'red-white' | 'blue-white' | 'green-white'
  mountingHoles?: boolean
  className?: string
}

const colorSchemes = {
  'black-white': {
    background: '#1A1A1A',
    foreground: '#FFFFFF',
    border: '#333333',
  },
  'yellow-black': {
    background: '#F7C948',
    foreground: '#1A1A1A',
    border: '#D4A730',
  },
  'red-white': {
    background: '#CC3333',
    foreground: '#FFFFFF',
    border: '#AA2222',
  },
  'blue-white': {
    background: '#2563EB',
    foreground: '#FFFFFF',
    border: '#1D4ED8',
  },
  'green-white': {
    background: '#16A34A',
    foreground: '#FFFFFF',
    border: '#15803D',
  },
}

const sizes = {
  small: { width: 120, height: 60, fontSize: 10, iconSize: 24 },
  medium: { width: 200, height: 80, fontSize: 14, iconSize: 36 },
  large: { width: 300, height: 100, fontSize: 18, iconSize: 48 },
}

// ISO 7010 Safety Icons (simplified SVG paths)
const safetyIcons: Record<string, { path: string; viewBox: string; category: string }> = {
  warning: {
    path: 'M12 2L2 20h20L12 2zm0 4l7 12H5l7-12zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z',
    viewBox: '0 0 24 24',
    category: 'warning',
  },
  electrical: {
    path: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z',
    viewBox: '0 0 24 24',
    category: 'warning',
  },
  hot: {
    path: 'M12 2C8 2 6 5 6 8c0 4 6 10 6 10s6-6 6-10c0-3-2-6-6-6zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
    viewBox: '0 0 24 24',
    category: 'warning',
  },
  noEntry: {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm4-6h-2v6h-2v-6H9V9h6v2z',
    viewBox: '0 0 24 24',
    category: 'prohibition',
  },
  eyeProtection: {
    path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    viewBox: '0 0 24 24',
    category: 'mandatory',
  },
  exit: {
    path: 'M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
    viewBox: '0 0 24 24',
    category: 'safety',
  },
  firstAid: {
    path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
    viewBox: '0 0 24 24',
    category: 'safety',
  },
  fire: {
    path: 'M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 7.21 5 9.88 2.11-2.69 5-7 5-9.88 0-2.76-2.24-5-5-5zm0 12.25c-1.24-1.76-3-4.75-3-7.25 0-1.66 1.34-3 3-3s3 1.34 3 3c0 2.5-1.76 5.49-3 7.25z',
    viewBox: '0 0 24 24',
    category: 'fire',
  },
}

export default function LabelVisualizer({
  text = '',
  text2 = '',
  icon,
  size = 'medium',
  shape = 'rectangle',
  colorScheme = 'black-white',
  mountingHoles = false,
  className = '',
}: LabelVisualizerProps) {
  const colors = colorSchemes[colorScheme]
  const dimensions = sizes[size]
  const selectedIcon = icon ? safetyIcons[icon] : null

  const borderRadius = shape === 'rounded' ? 8 : shape === 'circle' ? dimensions.width / 2 : 4

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        width={dimensions.width}
        height={shape === 'circle' ? dimensions.width : dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${shape === 'circle' ? dimensions.width : dimensions.height}`}
        className="drop-shadow-lg"
      >
        <defs>
          {/* Engraved texture effect */}
          <filter id="engraved" x="-10%" y="-10%" width="120%" height="120%">
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

        {/* Background */}
        {shape === 'circle' ? (
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.width / 2 - 2}
            fill={colors.background}
            stroke={colors.border}
            strokeWidth="2"
          />
        ) : (
          <rect
            x="2"
            y="2"
            width={dimensions.width - 4}
            height={dimensions.height - 4}
            rx={borderRadius}
            fill={colors.background}
            stroke={colors.border}
            strokeWidth="2"
          />
        )}

        {/* Mounting holes */}
        {mountingHoles && shape !== 'circle' && (
          <>
            <circle cx="12" cy={dimensions.height / 2} r="3" fill="#404040" stroke="#303030" strokeWidth="0.5" />
            <circle cx={dimensions.width - 12} cy={dimensions.height / 2} r="3" fill="#404040" stroke="#303030" strokeWidth="0.5" />
          </>
        )}

        {/* Content */}
        <g filter="url(#engraved)">
          {/* Icon */}
          {selectedIcon && (
            <g
              transform={`translate(${selectedIcon ? 16 : dimensions.width / 2 - dimensions.iconSize / 2}, ${(shape === 'circle' ? dimensions.width : dimensions.height) / 2 - dimensions.iconSize / 2})`}
            >
              <svg
                width={dimensions.iconSize}
                height={dimensions.iconSize}
                viewBox={selectedIcon.viewBox}
              >
                <path d={selectedIcon.path} fill={colors.foreground} />
              </svg>
            </g>
          )}

          {/* Text */}
          {text && (
            <text
              x={selectedIcon ? 16 + dimensions.iconSize + 12 : dimensions.width / 2}
              y={(shape === 'circle' ? dimensions.width : dimensions.height) / 2 - (text2 ? 6 : 0)}
              textAnchor={selectedIcon ? 'start' : 'middle'}
              dominantBaseline="middle"
              fill={colors.foreground}
              fontSize={dimensions.fontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {text}
            </text>
          )}

          {/* Second line */}
          {text2 && (
            <text
              x={selectedIcon ? 16 + dimensions.iconSize + 12 : dimensions.width / 2}
              y={(shape === 'circle' ? dimensions.width : dimensions.height) / 2 + dimensions.fontSize - 2}
              textAnchor={selectedIcon ? 'start' : 'middle'}
              dominantBaseline="middle"
              fill={colors.foreground}
              fontSize={dimensions.fontSize * 0.75}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="400"
              opacity="0.9"
            >
              {text2}
            </text>
          )}
        </g>
      </svg>

      {/* Size indicator */}
      <div className="text-center mt-2 text-xs text-[var(--color-muted)]">
        {size} • {colorScheme.replace('-', ' on ')}
      </div>
    </motion.div>
  )
}

/*
 * Icon selector for labels
 */
interface IconSelectorProps {
  value?: string
  onChange: (icon: string | undefined) => void
}

export function LabelIconSelector({ value, onChange }: IconSelectorProps) {
  const icons = Object.entries(safetyIcons)

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* No icon option */}
      <motion.button
        type="button"
        className={`
          p-3 rounded-lg border-2 transition-all
          ${!value
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
            : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
          }
        `}
        onClick={() => onChange(undefined)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-xs text-[var(--color-muted)]">None</span>
      </motion.button>

      {icons.map(([key, iconData]) => (
        <motion.button
          key={key}
          type="button"
          className={`
            p-3 rounded-lg border-2 transition-all
            ${value === key
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(key)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={key}
        >
          <svg
            className="w-6 h-6 mx-auto"
            viewBox={iconData.viewBox}
            fill="currentColor"
          >
            <path d={iconData.path} />
          </svg>
        </motion.button>
      ))}
    </div>
  )
}

/*
 * Color scheme selector
 */
interface ColorSchemeSelectorProps {
  value: LabelVisualizerProps['colorScheme']
  onChange: (scheme: LabelVisualizerProps['colorScheme']) => void
}

export function LabelColorSelector({ value, onChange }: ColorSchemeSelectorProps) {
  const schemes: Array<{
    id: LabelVisualizerProps['colorScheme']
    label: string
  }> = [
    { id: 'black-white', label: 'Black/White' },
    { id: 'yellow-black', label: 'Warning' },
    { id: 'red-white', label: 'Danger' },
    { id: 'blue-white', label: 'Mandatory' },
    { id: 'green-white', label: 'Safety' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {schemes.map((scheme) => {
        const colors = colorSchemes[scheme.id!]
        return (
          <motion.button
            key={scheme.id}
            type="button"
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              border-2 transition-all
              ${value === scheme.id
                ? 'border-[var(--color-primary)]'
                : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
              }
            `}
            onClick={() => onChange(scheme.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-4 h-4 rounded border"
              style={{
                background: colors.background,
                borderColor: colors.border,
              }}
            />
            <span className="text-sm text-[var(--color-dark)]">{scheme.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
