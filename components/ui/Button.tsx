'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode, useState } from 'react'
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

/*
 * Button Component
 *
 * Design principles:
 * - Feels physical, like a clay button you could press
 * - Subtle lift and glow on hover
 * - Cosmic reveal on click - brief flash of magic behind the clay
 * - Liquid, organic motion
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variants = {
  primary: {
    base: 'bg-gradient-to-b from-[#7a9c9c] via-[var(--color-primary)] to-[var(--color-primary-dark)] text-[#ffffff] font-medium shadow-[0_6px_20px_rgba(106,140,140,0.35),0_2px_4px_rgba(0,0,0,0.1),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)]',
    hover: {
      y: -2,
      boxShadow: '0 10px 30px rgba(106, 140, 140, 0.4), 0 4px 8px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.08)',
    },
    tap: {
      y: 1,
      scale: 0.98,
      boxShadow: '0 2px 8px rgba(106, 140, 140, 0.25), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 2px 6px rgba(0,0,0,0.15)',
    },
    hasCosmic: true,
  },
  secondary: {
    base: 'bg-gradient-to-b from-white via-[#fafaf8] to-[#f0ede8] text-[var(--color-dark)] font-medium border border-[rgba(106,140,140,0.15)] shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04),inset_0_2px_0_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.04)]',
    hover: {
      y: -2,
      boxShadow: '0 8px 20px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.06)',
    },
    tap: {
      y: 1,
      scale: 0.98,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 2px 4px rgba(0,0,0,0.06)',
    },
    hasCosmic: false,
  },
  ghost: {
    base: 'bg-transparent text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary-mist)]',
    hover: { y: 0 },
    tap: { scale: 0.98 },
    hasCosmic: false,
  },
  outline: {
    base: 'bg-transparent text-[var(--color-dark)] font-medium border border-[rgba(106,140,140,0.2)]',
    hover: {
      y: -1,
      borderColor: 'rgba(106, 140, 140, 0.35)',
      boxShadow: '0 4px 12px rgba(61, 68, 65, 0.06)',
    },
    tap: { y: 0, scale: 0.98 },
    hasCosmic: false,
  },
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

// Cosmic background that reveals on click
function CosmicReveal({ isActive, size }: { isActive: boolean; size: ButtonSize }) {
  const borderRadius = size === 'sm' ? '0.5rem' : size === 'md' ? '0.75rem' : '1rem'

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
              backgroundSize: '400% 400%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
          {/* Sparkle overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.6) 0%, transparent 25%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading spinner
function Spinner({ size }: { size: ButtonSize }) {
  return (
    <motion.svg
      className={iconSizes[size]}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="32"
        opacity="0.25"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="8"
      />
    </motion.svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false)
    const variantStyles = variants[variant]
    const sizeStyles = sizes[size]

    const baseClassName = `relative inline-flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles.base} ${sizeStyles} ${fullWidth ? 'w-full' : ''} ${className}`

    const content = (
      <>
        {variantStyles.hasCosmic && <CosmicReveal isActive={isPressed} size={size} />}
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading ? (
            <Spinner size={size} />
          ) : (
            icon && <span className={iconSizes[size]}>{icon}</span>
          )}
          <span>{children}</span>
          {iconRight && !loading && (
            <span className={iconSizes[size]}>{iconRight}</span>
          )}
        </span>
      </>
    )

    const motionProps = {
      whileHover: disabled || loading ? {} : variantStyles.hover,
      whileTap: disabled || loading ? {} : variantStyles.tap,
      onTapStart: () => setIsPressed(true),
      onTap: () => setTimeout(() => setIsPressed(false), 200),
      onTapCancel: () => setIsPressed(false),
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    }

    if (href && !disabled) {
      return (
        <motion.div {...motionProps} className="inline-flex">
          <Link href={href} className={baseClassName}>
            {content}
          </Link>
        </motion.div>
      )
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        className={baseClassName}
        {...motionProps}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
