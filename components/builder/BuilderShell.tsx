'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { motionVariants, shadows } from '@/lib/builder-tokens'

interface BuilderShellProps {
  children: ReactNode
  preview: ReactNode
  productKey: string
  title?: string
  price?: number
  priceLabel?: string
}

export default function BuilderShell({
  children,
  preview,
  productKey,
  title,
  price,
  priceLabel = 'per unit',
}: BuilderShellProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200" style={{ boxShadow: shadows.card }}>
      {/* Header - Clean, no branding */}
      {title && (
        <div
          className="px-6 py-4 border-b border-gray-100"
          style={{ background: 'linear-gradient(180deg, #FAFBFA 0%, #F5F7F6 100%)' }}
        >
          <h3 className="text-lg font-semibold text-vurmz-dark">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Controls Panel */}
        <motion.div
          className="p-6 border-r border-gray-100 bg-white"
          variants={motionVariants.staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={productKey}
              variants={motionVariants.productMorph}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Preview Panel */}
        <div
          className="p-6 min-h-[400px] flex flex-col"
          style={{ background: 'linear-gradient(180deg, #F5F7F6 0%, #E8ECEA 100%)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={productKey}
                variants={motionVariants.productMorph}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {preview}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Price Footer */}
          {price !== undefined && (
            <motion.div
              className="mt-6 pt-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Price</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-vurmz-dark">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{priceLabel}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable control section component
export function BuilderSection({
  title,
  children
}: {
  title: string
  children: ReactNode
}) {
  return (
    <motion.div
      className="mb-6"
      variants={motionVariants.staggerItem}
    >
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h4>
      {children}
    </motion.div>
  )
}

// Reusable option button
export function BuilderOption({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${selected
          ? 'bg-vurmz-teal/10 text-vurmz-teal border-vurmz-teal ring-1 ring-vurmz-teal'
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
        }
        border
        ${className}
      `}
      variants={motionVariants.optionHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      {children}
    </motion.button>
  )
}

// Color swatch option
export function BuilderColorOption({
  color,
  label,
  selected,
  onClick,
}: {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200
        ${selected
          ? 'bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
          : 'hover:bg-gray-50'
        }
      `}
      variants={motionVariants.optionHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      title={label}
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gray-600 truncate max-w-[60px]">{label}</span>
    </motion.button>
  )
}
