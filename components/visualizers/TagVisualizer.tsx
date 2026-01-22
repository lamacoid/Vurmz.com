'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

/*
 * Industrial Tag Visualizer Component
 *
 * Realistic preview of industrial metal tags.
 * Features:
 * - Multiple materials (aluminum, stainless, brass)
 * - Various shapes (rectangle, rounded, circle, cable tag)
 * - Attachment holes
 * - QR code support
 * - Serial number engraving
 */

interface TagVisualizerProps {
  text?: string
  text2?: string
  text3?: string
  qrValue?: string
  material?: 'aluminum' | 'stainless' | 'brass' | 'black-aluminum'
  shape?: 'rectangle' | 'rounded' | 'circle' | 'cable'
  size?: 'small' | 'medium' | 'large'
  hole?: 'left' | 'center' | 'both' | 'none'
  className?: string
}

const materialStyles = {
  aluminum: {
    background: 'linear-gradient(135deg, #E8E8E8 0%, #D4D4D4 30%, #E0E0E0 60%, #C8C8C8 100%)',
    engraving: '#404040',
    border: '#B0B0B0',
    hole: '#A0A0A0',
    holeInner: '#888888',
  },
  stainless: {
    background: 'linear-gradient(135deg, #F0F0F0 0%, #D8D8D8 25%, #E8E8E8 50%, #C4C4C4 75%, #E0E0E0 100%)',
    engraving: '#505050',
    border: '#A0A0A0',
    hole: '#909090',
    holeInner: '#707070',
  },
  brass: {
    background: 'linear-gradient(135deg, #D4A84B 0%, #C49A3D 30%, #DDB85C 60%, #B8922E 100%)',
    engraving: '#5A4A20',
    border: '#9A7A28',
    hole: '#A08030',
    holeInner: '#806020',
  },
  'black-aluminum': {
    background: 'linear-gradient(135deg, #2A2A2A 0%, #1E1E1E 30%, #282828 60%, #1A1A1A 100%)',
    engraving: '#A0A0A0',
    border: '#404040',
    hole: '#383838',
    holeInner: '#282828',
  },
}

const sizeConfigs = {
  small: { width: 100, height: 50, fontSize: 8, holeRadius: 4 },
  medium: { width: 160, height: 80, fontSize: 12, holeRadius: 6 },
  large: { width: 220, height: 100, fontSize: 14, holeRadius: 8 },
}

export default function TagVisualizer({
  text = '',
  text2 = '',
  text3 = '',
  qrValue,
  material = 'aluminum',
  shape = 'rounded',
  size = 'medium',
  hole = 'left',
  className = '',
}: TagVisualizerProps) {
  const style = materialStyles[material]
  const dimensions = sizeConfigs[size]

  const patternId = useMemo(
    () => `tag-pattern-${Math.random().toString(36).substr(2, 9)}`,
    []
  )
  const gradientId = useMemo(
    () => `tag-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  )

  // Adjust dimensions for shape
  const actualWidth = shape === 'circle' ? dimensions.height : dimensions.width
  const actualHeight = shape === 'cable' ? dimensions.height * 0.6 : dimensions.height
  const borderRadius =
    shape === 'rounded' ? 8 :
    shape === 'circle' ? actualWidth / 2 :
    shape === 'cable' ? actualHeight / 2 :
    4

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        width={actualWidth}
        height={actualHeight}
        viewBox={`0 0 ${actualWidth} ${actualHeight}`}
        className="drop-shadow-lg"
      >
        <defs>
          {/* Metal gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
          </linearGradient>

          {/* Brushed metal texture */}
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="4" height="4" fill="transparent" />
            <line x1="0" y1="2" x2="4" y2="2" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.1" />
          </pattern>

          {/* Shadow filter */}
          <filter id="tag-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>

          {/* Engraved effect */}
          <filter id="engraved-text" x="-5%" y="-5%" width="110%" height="110%">
            <feOffset dx="0" dy="0.5" in="SourceAlpha" result="shadow" />
            <feGaussianBlur stdDeviation="0.3" in="shadow" result="blur" />
            <feFlood floodColor="#FFFFFF" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="highlight" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="highlight" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#tag-shadow)">
          {/* Main tag body */}
          {shape === 'circle' ? (
            <circle
              cx={actualWidth / 2}
              cy={actualHeight / 2}
              r={actualWidth / 2 - 2}
              fill={style.background}
              stroke={style.border}
              strokeWidth="1"
            />
          ) : shape === 'cable' ? (
            <rect
              x="2"
              y="2"
              width={actualWidth - 4}
              height={actualHeight - 4}
              rx={borderRadius}
              fill={style.background}
              stroke={style.border}
              strokeWidth="1"
            />
          ) : (
            <rect
              x="2"
              y="2"
              width={actualWidth - 4}
              height={actualHeight - 4}
              rx={borderRadius}
              fill={style.background}
              stroke={style.border}
              strokeWidth="1"
            />
          )}

          {/* Brushed texture overlay */}
          {shape === 'circle' ? (
            <circle
              cx={actualWidth / 2}
              cy={actualHeight / 2}
              r={actualWidth / 2 - 2}
              fill={`url(#${patternId})`}
            />
          ) : (
            <rect
              x="2"
              y="2"
              width={actualWidth - 4}
              height={actualHeight - 4}
              rx={borderRadius}
              fill={`url(#${patternId})`}
            />
          )}

          {/* Highlight overlay */}
          {shape === 'circle' ? (
            <circle
              cx={actualWidth / 2}
              cy={actualHeight / 2}
              r={actualWidth / 2 - 2}
              fill={`url(#${gradientId})`}
            />
          ) : (
            <rect
              x="2"
              y="2"
              width={actualWidth - 4}
              height={actualHeight - 4}
              rx={borderRadius}
              fill={`url(#${gradientId})`}
            />
          )}

          {/* Attachment holes */}
          {hole !== 'none' && (
            <>
              {(hole === 'left' || hole === 'both') && (
                <g>
                  <circle
                    cx={shape === 'circle' ? actualWidth / 2 : dimensions.holeRadius + 8}
                    cy={shape === 'circle' ? dimensions.holeRadius + 6 : actualHeight / 2}
                    r={dimensions.holeRadius}
                    fill={style.hole}
                    stroke={style.holeInner}
                    strokeWidth="1"
                  />
                  <circle
                    cx={shape === 'circle' ? actualWidth / 2 : dimensions.holeRadius + 8}
                    cy={shape === 'circle' ? dimensions.holeRadius + 6 : actualHeight / 2}
                    r={dimensions.holeRadius - 2}
                    fill="#505050"
                  />
                </g>
              )}
              {(hole === 'both' && shape !== 'circle') && (
                <g>
                  <circle
                    cx={actualWidth - dimensions.holeRadius - 8}
                    cy={actualHeight / 2}
                    r={dimensions.holeRadius}
                    fill={style.hole}
                    stroke={style.holeInner}
                    strokeWidth="1"
                  />
                  <circle
                    cx={actualWidth - dimensions.holeRadius - 8}
                    cy={actualHeight / 2}
                    r={dimensions.holeRadius - 2}
                    fill="#505050"
                  />
                </g>
              )}
              {hole === 'center' && shape !== 'circle' && (
                <g>
                  <circle
                    cx={actualWidth / 2}
                    cy={8 + dimensions.holeRadius}
                    r={dimensions.holeRadius}
                    fill={style.hole}
                    stroke={style.holeInner}
                    strokeWidth="1"
                  />
                  <circle
                    cx={actualWidth / 2}
                    cy={8 + dimensions.holeRadius}
                    r={dimensions.holeRadius - 2}
                    fill="#505050"
                  />
                </g>
              )}
            </>
          )}
        </g>

        {/* Engraved text */}
        <g filter="url(#engraved-text)">
          {/* Main text */}
          {text && (
            <text
              x={hole === 'left' ? actualWidth / 2 + 10 : actualWidth / 2}
              y={shape === 'circle' ? actualHeight / 2 : actualHeight / 2 - (text2 ? 8 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={style.engraving}
              fontSize={dimensions.fontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {text}
            </text>
          )}

          {/* Secondary text */}
          {text2 && shape !== 'circle' && (
            <text
              x={hole === 'left' ? actualWidth / 2 + 10 : actualWidth / 2}
              y={actualHeight / 2 + 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={style.engraving}
              fontSize={dimensions.fontSize * 0.75}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="400"
              opacity="0.8"
            >
              {text2}
            </text>
          )}

          {/* Tertiary text (serial number style) */}
          {text3 && shape !== 'circle' && (
            <text
              x={hole === 'left' ? actualWidth / 2 + 10 : actualWidth / 2}
              y={actualHeight / 2 + 18}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={style.engraving}
              fontSize={dimensions.fontSize * 0.6}
              fontFamily="'SF Mono', 'Fira Code', monospace"
              fontWeight="400"
              opacity="0.6"
            >
              {text3}
            </text>
          )}
        </g>

        {/* QR Code */}
        {qrValue && shape !== 'circle' && shape !== 'cable' && (
          <foreignObject
            x={actualWidth - 45}
            y={actualHeight / 2 - 17}
            width="34"
            height="34"
          >
            <div className="bg-white p-0.5 rounded">
              <QRCodeSVG
                value={qrValue}
                size={30}
                level="M"
                bgColor="white"
                fgColor="#1A1A1A"
              />
            </div>
          </foreignObject>
        )}
      </svg>

      {/* Size indicator */}
      <div className="text-center mt-2 text-xs text-[var(--color-muted)]">
        {size} • {material.replace('-', ' ')} • {shape}
      </div>
    </motion.div>
  )
}

/*
 * Material selector for tags
 */
interface MaterialSelectorProps {
  value: TagVisualizerProps['material']
  onChange: (material: TagVisualizerProps['material']) => void
}

export function TagMaterialSelector({ value, onChange }: MaterialSelectorProps) {
  const materials: Array<{
    id: TagVisualizerProps['material']
    label: string
    preview: string
  }> = [
    {
      id: 'aluminum',
      label: 'Aluminum',
      preview: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
    },
    {
      id: 'stainless',
      label: 'Stainless',
      preview: 'linear-gradient(135deg, #F0F0F0, #D0D0D0)',
    },
    {
      id: 'brass',
      label: 'Brass',
      preview: 'linear-gradient(135deg, #D4A84B, #B8922E)',
    },
    {
      id: 'black-aluminum',
      label: 'Black',
      preview: 'linear-gradient(135deg, #2A2A2A, #1A1A1A)',
    },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {materials.map((mat) => (
        <motion.button
          key={mat.id}
          type="button"
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            border-2 transition-all
            ${value === mat.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(mat.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="w-4 h-4 rounded border"
            style={{ background: mat.preview }}
          />
          <span className="text-sm text-[var(--color-dark)]">{mat.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

/*
 * Shape selector for tags
 */
interface ShapeSelectorProps {
  value: TagVisualizerProps['shape']
  onChange: (shape: TagVisualizerProps['shape']) => void
}

export function TagShapeSelector({ value, onChange }: ShapeSelectorProps) {
  const shapes: Array<{
    id: TagVisualizerProps['shape']
    label: string
    icon: React.ReactNode
  }> = [
    {
      id: 'rectangle',
      label: 'Rectangle',
      icon: <rect x="4" y="6" width="16" height="12" rx="1" fill="currentColor" />,
    },
    {
      id: 'rounded',
      label: 'Rounded',
      icon: <rect x="4" y="6" width="16" height="12" rx="4" fill="currentColor" />,
    },
    {
      id: 'circle',
      label: 'Circle',
      icon: <circle cx="12" cy="12" r="8" fill="currentColor" />,
    },
    {
      id: 'cable',
      label: 'Cable',
      icon: <rect x="2" y="8" width="20" height="8" rx="4" fill="currentColor" />,
    },
  ]

  return (
    <div className="flex gap-2">
      {shapes.map((shapeOption) => (
        <motion.button
          key={shapeOption.id}
          type="button"
          className={`
            p-3 rounded-lg border-2 transition-all
            ${value === shapeOption.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(shapeOption.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={shapeOption.label}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g className="text-[var(--color-medium)]">
              {shapeOption.icon}
            </g>
          </svg>
        </motion.button>
      ))}
    </div>
  )
}
