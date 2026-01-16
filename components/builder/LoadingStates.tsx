'use client'

import { motion } from 'framer-motion'

// ============================================================================
// PREMIUM LOADING STATES
// Elegant skeleton loaders and spinners for enterprise UX
// ============================================================================

// Premium shimmer animation
const shimmer = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear' as const,
    },
  },
}

// ============================================================================
// SKELETON BASE - Reusable skeleton with shimmer
// ============================================================================

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Skeleton({ className = '', rounded = 'md' }: SkeletonProps) {
  const radiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${radiusMap[rounded]} ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
        }}
        variants={shimmer}
        initial="initial"
        animate="animate"
      />
    </div>
  )
}

// ============================================================================
// BUILDER SKELETON - Full builder loading state
// ============================================================================

export function BuilderSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
      {/* Header skeleton */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40 mb-2" rounded="lg" />
            <Skeleton className="h-4 w-56" rounded="lg" />
          </div>
          <Skeleton className="h-8 w-20" rounded="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Controls skeleton */}
        <div className="p-6 space-y-6">
          {/* Section 1 */}
          <div>
            <Skeleton className="h-3 w-24 mb-3" rounded="lg" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-12" rounded="xl" />
              <Skeleton className="h-12" rounded="xl" />
              <Skeleton className="h-12" rounded="xl" />
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <Skeleton className="h-3 w-20 mb-3" rounded="lg" />
            <div className="flex gap-3">
              <Skeleton className="h-14 w-14" rounded="full" />
              <Skeleton className="h-14 w-14" rounded="full" />
              <Skeleton className="h-14 w-14" rounded="full" />
              <Skeleton className="h-14 w-14" rounded="full" />
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <Skeleton className="h-3 w-28 mb-3" rounded="lg" />
            <Skeleton className="h-12 w-full" rounded="xl" />
          </div>

          {/* Section 4 */}
          <div>
            <Skeleton className="h-3 w-16 mb-3" rounded="lg" />
            <Skeleton className="h-12 w-full" rounded="xl" />
          </div>
        </div>

        {/* Preview skeleton */}
        <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="w-full max-w-xs">
              <Skeleton className="h-64 w-full mb-4" rounded="xl" />
              <Skeleton className="h-20 w-full" rounded="xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PRODUCT GRID SKELETON - Loading state for product selection
// ============================================================================

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5">
          <Skeleton className="w-14 h-14 mb-4" rounded="xl" />
          <Skeleton className="h-5 w-24 mb-2" rounded="lg" />
          <Skeleton className="h-3 w-32 mb-3" rounded="lg" />
          <Skeleton className="h-6 w-16" rounded="lg" />
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// SPINNER - Premium loading spinner
// ============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      className={`${sizeMap[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full text-vurmz-teal"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

// ============================================================================
// DOTS LOADER - Animated dots for inline loading
// ============================================================================

interface DotsLoaderProps {
  className?: string
}

export function DotsLoader({ className = '' }: DotsLoaderProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-vurmz-teal"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

// ============================================================================
// PROGRESS BAR - Determinate progress indicator
// ============================================================================

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  progress,
  className = '',
  showLabel = false,
}: ProgressBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-vurmz-teal to-vurmz-teal-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 top-3 text-xs text-gray-500">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}

// ============================================================================
// PULSE LOADER - Pulsing circle for background loading
// ============================================================================

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulseLoader({ size = 'md', className = '' }: PulseLoaderProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full bg-vurmz-teal/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-vurmz-teal/40"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <div className="absolute inset-4 rounded-full bg-vurmz-teal" />
    </div>
  )
}

// ============================================================================
// LOADING OVERLAY - Full-screen or container loading state
// ============================================================================

interface LoadingOverlayProps {
  message?: string
  className?: string
}

export function LoadingOverlay({
  message = 'Loading...',
  className = '',
}: LoadingOverlayProps) {
  return (
    <motion.div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PulseLoader size="lg" />
      <motion.p
        className="mt-4 text-sm text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  )
}
