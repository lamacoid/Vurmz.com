'use client'

import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

/*
 * Badge Component
 *
 * Design principles:
 * - Small, informative labels
 * - Subtle colors, never loud
 * - Soft, rounded shapes
 * - Optional dot indicator
 */

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  animated?: boolean
  children: ReactNode
}

const variantStyles = {
  default: `
    bg-[var(--color-primary-wash)]
    text-[var(--color-dark)]
    border border-[rgba(106,140,140,0.08)]
  `,
  primary: `
    bg-[var(--color-primary)]
    text-white
  `,
  secondary: `
    bg-[var(--color-sage)]
    text-white
  `,
  success: `
    bg-[rgba(122,154,126,0.15)]
    text-[var(--color-success)]
    border border-[rgba(122,154,126,0.2)]
  `,
  warning: `
    bg-[rgba(196,165,90,0.15)]
    text-[#8B7335]
    border border-[rgba(196,165,90,0.2)]
  `,
  error: `
    bg-[rgba(181,122,122,0.15)]
    text-[var(--color-error)]
    border border-[rgba(181,122,122,0.2)]
  `,
  outline: `
    bg-transparent
    text-[var(--color-medium)]
    border border-[rgba(106,140,140,0.2)]
  `,
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
  lg: 'px-3 py-1.5 text-sm rounded-lg',
}

const dotSizes = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      animated = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClassName = `
      inline-flex items-center gap-1.5
      font-medium
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `

    const dotElement = dot && (
      <span
        className={`
          ${dotSizes[size]}
          rounded-full
          ${variant === 'primary' || variant === 'secondary' ? 'bg-white' : 'bg-current'}
        `}
      />
    )

    if (animated) {
      return (
        <motion.span
          ref={ref}
          className={baseClassName}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {dotElement}
          {children}
        </motion.span>
      )
    }

    return (
      <span
        ref={ref}
        className={baseClassName}
        {...props}
      >
        {dotElement}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

/*
 * Animated Badge with pulse
 */
interface PulseBadgeProps extends BadgeProps {
  pulseColor?: string
}

export const PulseBadge = forwardRef<HTMLSpanElement, PulseBadgeProps>(
  ({ children, ...props }, ref) => {
    return (
      <span ref={ref} className="relative inline-flex">
        <Badge {...props}>{children}</Badge>
        <motion.span
          className={`
            absolute inset-0 rounded-lg
            ${props.variant === 'primary' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary-wash)]'}
          `}
          animate={{
            scale: [1, 1.5],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </span>
    )
  }
)

PulseBadge.displayName = 'PulseBadge'

export default Badge
