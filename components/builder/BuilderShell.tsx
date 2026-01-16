'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ============================================================================
// PREMIUM BUILDER SHELL v2.0
// Enterprise-grade wrapper with Apple-level polish
// ============================================================================

// Premium easing curves - matches Apple's animation philosophy
const easing = {
  smooth: [0.4, 0, 0.2, 1] as const,
  liquid: [0.23, 1, 0.32, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  spring: { type: 'spring', stiffness: 400, damping: 30 } as const,
}

// Premium shadow system
const shadows = {
  subtle: '0 1px 3px rgba(44, 53, 51, 0.04)',
  card: '0 4px 20px rgba(44, 53, 51, 0.06), 0 1px 3px rgba(44, 53, 51, 0.04)',
  elevated: '0 12px 40px rgba(44, 53, 51, 0.1), 0 4px 12px rgba(44, 53, 51, 0.05)',
  glow: '0 0 40px rgba(106, 140, 140, 0.15)',
}

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing.liquid,
      staggerChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
}

const contentVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.liquid,
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    filter: 'blur(4px)',
    transition: { duration: 0.25 }
  }
}

const previewVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.liquid,
      delay: 0.1,
    }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(8px)',
    transition: { duration: 0.3 }
  }
}

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easing.smooth }
  }
}

// ============================================================================
// MAIN SHELL COMPONENT
// ============================================================================

interface BuilderShellProps {
  children: ReactNode
  preview: ReactNode
  productKey: string
  title?: string
  subtitle?: string
  price?: number
  priceLabel?: string
  quantity?: number
  showQuantity?: boolean
  onQuantityChange?: (qty: number) => void
}

export default function BuilderShell({
  children,
  preview,
  productKey,
  title,
  subtitle,
  price,
  priceLabel = 'per unit',
  quantity = 1,
  showQuantity = false,
  onQuantityChange,
}: BuilderShellProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Subtle mouse-follow glow effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const glowY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const total = (price || 0) * quantity

  return (
    <motion.div
      ref={containerRef}
      className="builder-shell-v2 relative"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium container with layered styling */}
      <div
        className="relative overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: shadows.elevated }}
      >
        {/* Subtle animated gradient glow on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.5 : 0,
            background: `radial-gradient(600px circle at ${glowX.get()}px ${glowY.get()}px, rgba(106,140,140,0.06), transparent 40%)`,
          }}
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-vurmz-teal/40 to-transparent" />

        {/* Header */}
        {title && (
          <motion.div
            className="relative px-6 py-5 border-b border-gray-100/80"
            style={{
              background: 'linear-gradient(180deg, rgba(250,251,250,0.9) 0%, rgba(245,247,246,0.7) 100%)',
              backdropFilter: 'blur(8px)',
            }}
            variants={staggerItem}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                )}
              </div>

              {/* Mini price indicator in header */}
              {price !== undefined && (
                <motion.div
                  className="flex items-baseline gap-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-gray-400 uppercase tracking-wide">from</span>
                  <span className="text-lg font-bold text-vurmz-teal">${price.toFixed(2)}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Controls Panel */}
          <div className="relative p-6 lg:border-r border-gray-100/60 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={`controls-${productKey}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview Panel - Clean, minimal background for floating 3D products */}
          <div
            className="relative min-h-[420px] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(250,251,250,0.95) 0%, rgba(245,247,246,0.9) 50%, rgba(240,242,241,0.85) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Preview content */}
            <div className="flex-1 flex items-center justify-center p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${productKey}`}
                  variants={previewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {preview}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Premium price footer */}
            {price !== undefined && (
              <motion.div
                className="relative mx-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: easing.liquid }}
              >
                <div
                  className="rounded-xl p-4 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #2C3533 0%, #1E2422 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Quantity controls */}
                  {showQuantity && onQuantityChange && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                      <span className="text-sm text-gray-400">Quantity</span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-medium transition-colors"
                          whileTap={{ scale: 0.92 }}
                        >
                          −
                        </motion.button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 h-8 text-center text-white bg-white/10 rounded-lg border-0 focus:ring-2 focus:ring-vurmz-teal/50"
                          min={1}
                        />
                        <motion.button
                          onClick={() => onQuantityChange(quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-medium transition-colors"
                          whileTap={{ scale: 0.92 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Price display */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide block">
                        {quantity > 1 ? 'Price per unit' : priceLabel}
                      </span>
                      <motion.span
                        key={price}
                        className="text-xl font-bold"
                        initial={{ scale: 1.05, color: '#6A8C8C' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        transition={{ duration: 0.25 }}
                      >
                        ${price.toFixed(2)}
                      </motion.span>
                    </div>

                    {quantity > 1 && (
                      <div className="text-right">
                        <span className="text-xs text-gray-400 uppercase tracking-wide block">Total</span>
                        <motion.span
                          key={total}
                          className="text-2xl font-bold text-vurmz-teal"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, ease: easing.bounce }}
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// BUILDER SECTION - Consistent section styling with animations
// ============================================================================

interface BuilderSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function BuilderSection({
  title,
  description,
  children,
  className = '',
}: BuilderSectionProps) {
  return (
    <motion.div
      className={`builder-section ${className}`}
      variants={staggerItem}
    >
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  )
}

// ============================================================================
// BUILDER OPTION - Premium selectable button with micro-interactions
// ============================================================================

interface BuilderOptionProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function BuilderOption({
  selected,
  onClick,
  children,
  className = '',
  disabled = false,
}: BuilderOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-4 py-2.5 rounded-xl text-sm font-medium
        border-2 transition-all duration-200 text-left
        ${selected
          ? 'border-vurmz-teal bg-vurmz-teal/5 text-vurmz-teal'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        boxShadow: selected ? shadows.glow : shadows.subtle,
      }}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={easing.spring}
    >
      {/* Selection checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-vurmz-teal flex items-center justify-center shadow-md"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.25, ease: easing.bounce }}
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

// ============================================================================
// BUILDER COLOR OPTION - Premium color swatch with animation
// ============================================================================

interface BuilderColorOptionProps {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}

export function BuilderColorOption({
  color,
  label,
  selected,
  onClick,
}: BuilderColorOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200
        ${selected ? 'bg-gray-100' : 'hover:bg-gray-50'}
      `}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={easing.spring}
      title={label}
    >
      {/* Color swatch */}
      <div className="relative">
        <motion.div
          className="w-10 h-10 rounded-full shadow-md"
          style={{
            backgroundColor: color,
            border: color === '#ffffff' || color === '#f5f5f5' ? '2px solid #e5e7eb' : '2px solid transparent',
          }}
          animate={{
            boxShadow: selected
              ? `0 0 0 3px rgba(106,140,140,0.3), 0 4px 12px rgba(0,0,0,0.15)`
              : '0 2px 8px rgba(0,0,0,0.1)',
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Selection ring */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-vurmz-teal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <span className={`text-xs font-medium ${selected ? 'text-vurmz-teal' : 'text-gray-600'}`}>
        {label}
      </span>
    </motion.button>
  )
}

// ============================================================================
// BUILDER INPUT - Premium text input with animations
// ============================================================================

interface BuilderInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  label?: string
  hint?: string
  className?: string
}

export function BuilderInput({
  value,
  onChange,
  placeholder,
  maxLength,
  label,
  hint,
  className = '',
}: BuilderInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`builder-input ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-xl text-sm
            border-2 transition-all duration-200
            ${isFocused
              ? 'border-vurmz-teal ring-4 ring-vurmz-teal/10'
              : 'border-gray-200 hover:border-gray-300'
            }
            outline-none
          `}
        />
      </motion.div>

      {(maxLength || hint) && (
        <div className="flex items-center justify-between mt-1.5 px-1">
          {hint && <span className="text-xs text-gray-400">{hint}</span>}
          {maxLength && (
            <span className={`text-xs ${value.length >= maxLength ? 'text-amber-500' : 'text-gray-400'}`}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// BUILDER DIVIDER - Visual separator
// ============================================================================

export function BuilderDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative py-2 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-100" />
      </div>
    </div>
  )
}
