'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PACK_CONFIG, calculatePackTotal, getPackQuantityLabel } from '@/lib/pack-config'

// ============================================================================
// TYPES
// ============================================================================

interface PackSelectorProps {
  productType: 'pens' | 'coasters' | 'signs' | 'tags'
  onPackChange: (numPacks: number) => void
  initialPacks?: number
}

// ============================================================================
// ANIMATION CONFIG
// ============================================================================

// Liquid ease curve for smooth, fluid animations
const liquidEase = [0.23, 1, 0.32, 1] as const

// ============================================================================
// ICON COMPONENTS
// ============================================================================

function PenIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  )
}

function CoasterIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

function SignIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="3" y="6" width="18" height="12" rx="2" />
    </svg>
  )
}

function TagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    </svg>
  )
}

const PRODUCT_ICONS: Record<PackSelectorProps['productType'], React.FC<{ className?: string }>> = {
  pens: PenIcon,
  coasters: CoasterIcon,
  signs: SignIcon,
  tags: TagIcon,
}

// ============================================================================
// ITEM GRID VISUALIZER
// ============================================================================

interface ItemGridProps {
  count: number
  productType: PackSelectorProps['productType']
  numPacks: number
}

function ItemGrid({ count, productType, numPacks }: ItemGridProps) {
  const IconComponent = PRODUCT_ICONS[productType]

  // Grid layout calculation
  const cols = count <= 5 ? count : 5
  void cols // Prevent unused warning

  return (
    <div
      className="flex flex-wrap justify-center gap-1.5 p-3"
      style={{ maxWidth: count <= 5 ? `${count * 28}px` : '140px' }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={`${numPacks}-${i}`}
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 10 }}
          transition={{
            delay: i * 0.015,
            duration: 0.5,
            ease: liquidEase,
          }}
          className="w-5 h-5 rounded flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6a8c8c 0%, #8caec4 100%)',
            boxShadow: '0 2px 4px rgba(106,140,140,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        >
          <IconComponent className="w-3 h-3 text-white/90" />
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================================
// QUANTITY BUTTON
// ============================================================================

interface QuantityButtonProps {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}

function QuantityButton({ onClick, disabled, children }: QuantityButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      style={{
        background: disabled
          ? 'rgba(106,140,140,0.3)'
          : 'linear-gradient(135deg, #6a8c8c 0%, #8caec4 100%)',
        boxShadow: disabled
          ? 'none'
          : '0 4px 12px rgba(106,140,140,0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
      }}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.3, ease: liquidEase }}
    >
      {children}
    </motion.button>
  )
}

// ============================================================================
// MAIN PACK SELECTOR COMPONENT
// ============================================================================

export default function PackSelector({
  productType,
  onPackChange,
  initialPacks = 1,
}: PackSelectorProps) {
  const config = PACK_CONFIG[productType]
  const [numPacks, setNumPacks] = useState(initialPacks)

  // Calculate derived values
  const totalItems = numPacks * config.itemsPerPack
  const totalPrice = calculatePackTotal(productType, numPacks)
  const quantityLabel = getPackQuantityLabel(productType, numPacks)

  // Notify parent of changes
  useEffect(() => {
    onPackChange(numPacks)
  }, [numPacks, onPackChange])

  // Handle increment/decrement
  const handleDecrement = () => {
    if (numPacks > config.minPacks) {
      setNumPacks(numPacks - 1)
    }
  }

  const handleIncrement = () => {
    if (numPacks < config.maxPacks) {
      setNumPacks(numPacks + 1)
    }
  }

  // Memoize the summary string
  const summaryText = useMemo(() => {
    return `${quantityLabel} = $${totalPrice}`
  }, [quantityLabel, totalPrice])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: liquidEase }}
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        // Glass aesthetic
        background: 'linear-gradient(135deg, rgba(106,140,140,0.08) 0%, rgba(140,174,196,0.12) 50%, rgba(106,140,140,0.08) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(140,174,196,0.2)',
        boxShadow: '0 8px 32px rgba(106,140,140,0.15), inset 0 1px 1px rgba(255,255,255,0.2)',
      }}
    >
      {/* Glass highlight effect */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
      />

      {/* Product name and price per pack */}
      <div className="text-center mb-5">
        <motion.h3
          className="text-lg font-semibold mb-1"
          style={{ color: '#2c3533' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: liquidEase }}
        >
          {config.name}
        </motion.h3>
        <motion.p
          className="text-sm"
          style={{ color: '#6a8c8c' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: liquidEase }}
        >
          ${config.basePrice} per pack ({config.itemsPerPack} items)
        </motion.p>
      </div>

      {/* Visual pack icons */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: liquidEase }}
      >
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.5)',
            boxShadow: 'inset 0 2px 4px rgba(106,140,140,0.1)',
          }}
        >
          <AnimatePresence mode="wait">
            <ItemGrid
              key={numPacks}
              count={config.itemsPerPack}
              productType={productType}
              numPacks={numPacks}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quantity controls */}
      <motion.div
        className="flex items-center justify-center gap-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: liquidEase }}
      >
        {/* Minus button */}
        <QuantityButton
          onClick={handleDecrement}
          disabled={numPacks <= config.minPacks}
        >
          -
        </QuantityButton>

        {/* Pack count display */}
        <motion.div
          className="min-w-[80px] text-center"
          key={numPacks}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: liquidEase }}
        >
          <span
            className="text-4xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #6a8c8c 0%, #8caec4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {numPacks}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {numPacks === 1 ? 'pack' : 'packs'}
          </p>
        </motion.div>

        {/* Plus button */}
        <QuantityButton
          onClick={handleIncrement}
          disabled={numPacks >= config.maxPacks}
        >
          +
        </QuantityButton>
      </motion.div>

      {/* Total summary */}
      <motion.div
        className="text-center rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(106,140,140,0.15) 0%, rgba(140,174,196,0.2) 100%)',
          border: '1px solid rgba(140,174,196,0.3)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: liquidEase }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={summaryText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3, ease: liquidEase }}
            className="text-lg font-semibold"
            style={{ color: '#2c3533' }}
          >
            {summaryText}
          </motion.p>
        </AnimatePresence>

        <motion.p
          className="text-xs mt-1"
          style={{ color: '#6a8c8c' }}
        >
          Total: {totalItems} {productType}
        </motion.p>
      </motion.div>

      {/* Subtle animated background orbs */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,174,196,0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(106,140,140,0.12) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </motion.div>
  )
}
