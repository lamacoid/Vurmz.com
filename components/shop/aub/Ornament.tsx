/**
 * Aubusson-style decorative SVG ornaments used as section dividers, corner
 * flourishes, and rule decorations. Stroke uses currentColor so callers can
 * tint with `text-aub-burgundy`, `text-aub-ochre`, etc.
 */
import React from 'react'

type Variant = 'divider' | 'fleur' | 'rule-double' | 'corner'

export default function Ornament({
  variant = 'divider',
  className = '',
  width,
  height,
}: {
  variant?: Variant
  className?: string
  width?: number | string
  height?: number | string
}) {
  if (variant === 'divider') {
    // Horizontal botanical scroll: leaf-vine-leaf
    return (
      <svg
        viewBox="0 0 240 24"
        width={width ?? '240'}
        height={height ?? '24'}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <line x1="0" y1="12" x2="80" y2="12" />
        <line x1="160" y1="12" x2="240" y2="12" />
        {/* center medallion */}
        <circle cx="120" cy="12" r="3" fill="currentColor" />
        <path d="M120 5 C 115 5 112 8 112 12 C 112 16 115 19 120 19 C 125 19 128 16 128 12 C 128 8 125 5 120 5 Z" />
        {/* side leaves */}
        <path d="M80 12 C 88 6 96 6 104 12 C 96 9 90 11 88 12 Z" fill="currentColor" />
        <path d="M160 12 C 152 6 144 6 136 12 C 144 9 150 11 152 12 Z" fill="currentColor" />
      </svg>
    )
  }
  if (variant === 'fleur') {
    return (
      <svg
        viewBox="0 0 32 32"
        width={width ?? '32'}
        height={height ?? '32'}
        className={className}
        fill="currentColor"
      >
        <path d="M16 2 C 13 8 10 11 6 12 C 10 13 13 16 16 22 C 19 16 22 13 26 12 C 22 11 19 8 16 2 Z" />
        <path d="M16 22 L 16 30 M 12 28 L 20 28" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  if (variant === 'rule-double') {
    return (
      <svg
        viewBox="0 0 240 8"
        width={width ?? '100%'}
        height={height ?? '8'}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <line x1="0" y1="1" x2="240" y2="1" />
        <line x1="0" y1="7" x2="240" y2="7" />
        <circle cx="120" cy="4" r="1.4" fill="currentColor" />
      </svg>
    )
  }
  // corner — for hero / plate frames
  return (
    <svg
      viewBox="0 0 48 48"
      width={width ?? '48'}
      height={height ?? '48'}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M2 14 L 2 2 L 14 2" />
      <path d="M6 18 C 10 14 14 10 18 6" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}
