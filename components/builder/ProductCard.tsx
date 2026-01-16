'use client'

import { ReactNode, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// ============================================================================
// PREMIUM PRODUCT CARD
// Apple-quality interactive card with 3D tilt, magnetic hover, and glass effects
// ============================================================================

interface ProductCardProps {
  title: string
  description?: string
  price?: string
  icon: ReactNode
  selected?: boolean
  onClick: () => void
  badge?: string
  disabled?: boolean
  className?: string
}

// Premium easing
const springConfig = { stiffness: 400, damping: 30 }
const smoothSpring = { stiffness: 150, damping: 20 }

export default function ProductCard({
  title,
  description,
  price,
  icon,
  selected = false,
  onClick,
  badge,
  disabled = false,
  className = '',
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring values
  const springX = useSpring(mouseX, smoothSpring)
  const springY = useSpring(mouseY, smoothSpring)

  // Transform mouse position to rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])

  // Spotlight position
  const spotlightX = useTransform(springX, [-0.5, 0.5], [0, 100])
  const spotlightY = useTransform(springY, [-0.5, 0.5], [0, 100])

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || disabled) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  // Reset on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`product-card-premium relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => !disabled && onClick()}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      <motion.div
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer
          transition-colors duration-300
          ${selected
            ? 'bg-gradient-to-br from-vurmz-teal/10 via-vurmz-teal/5 to-transparent'
            : 'bg-white hover:bg-gray-50/80'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: selected
            ? '0 0 0 2px #6A8C8C, 0 8px 32px rgba(106,140,140,0.2), 0 4px 12px rgba(0,0,0,0.05)'
            : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={springConfig}
      >
        {/* Spotlight overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${spotlightX.get()}% ${spotlightY.get()}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
              : 'none',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Glass border effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: selected ? '1px solid rgba(106,140,140,0.3)' : '1px solid rgba(0,0,0,0.06)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div className="relative p-5">
          {/* Badge */}
          {badge && (
            <motion.div
              className="absolute -top-1 -right-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(106,140,140,0.4)',
              }}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
            >
              {badge}
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            className={`
              w-14 h-14 rounded-xl flex items-center justify-center mb-4
              ${selected
                ? 'bg-vurmz-teal/10 text-vurmz-teal'
                : 'bg-gray-100 text-gray-600'
              }
            `}
            animate={{
              scale: isHovered ? 1.08 : 1,
              rotate: isHovered ? 3 : 0,
            }}
            transition={springConfig}
          >
            <div className="w-7 h-7">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3 className={`
            font-semibold text-base tracking-tight mb-1
            ${selected ? 'text-vurmz-teal' : 'text-gray-900'}
          `}>
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              {description}
            </p>
          )}

          {/* Price */}
          {price && (
            <motion.div
              className={`
                inline-flex items-baseline gap-1 px-2.5 py-1 rounded-lg text-sm font-medium
                ${selected
                  ? 'bg-vurmz-teal/10 text-vurmz-teal'
                  : 'bg-gray-100 text-gray-700'
                }
              `}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={springConfig}
            >
              <span className="text-xs opacity-70">from</span>
              <span>{price}</span>
            </motion.div>
          )}

          {/* Selection indicator */}
          <motion.div
            className="absolute bottom-4 right-4"
            initial={false}
            animate={{
              scale: selected ? 1 : 0,
              opacity: selected ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                boxShadow: '0 2px 8px rgba(106,140,140,0.4)',
              }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Bottom glow on selection */}
        {selected && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #6A8C8C 50%, transparent 100%)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Card glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl"
        style={{
          background: selected
            ? 'radial-gradient(circle at 50% 50%, rgba(106,140,140,0.15) 0%, transparent 70%)'
            : 'none',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: selected ? 1.1 : 1,
          opacity: selected ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// ============================================================================
// PRODUCT GRID - Premium grid layout for product cards
// ============================================================================

interface ProductGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function ProductGrid({
  children,
  columns = 4,
  className = '',
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <motion.div
      className={`grid ${gridCols[columns]} gap-4 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// PRODUCT CARD SKELETON - Loading state
// ============================================================================

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-gray-100 p-5 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-gray-200 mb-4" />
      <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
      <div className="h-6 w-16 bg-gray-200 rounded" />
    </div>
  )
}
