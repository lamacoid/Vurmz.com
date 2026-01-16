'use client'

import { motion } from 'framer-motion'

// ============================================================================
// PREMIUM STEP INDICATOR
// Apple-quality progress indicator with smooth animations
// ============================================================================

interface Step {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  allowNavigation?: boolean
  className?: string
}

const springConfig = { type: 'spring' as const, stiffness: 400, damping: 35 }

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  allowNavigation = true,
  className = '',
}: StepIndicatorProps) {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className={`step-indicator-premium ${className}`}>
      {/* Progress bar background */}
      <div className="relative">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 rounded-full" />

        {/* Active progress */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-vurmz-teal to-vurmz-teal-light -translate-y-1/2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{
            boxShadow: '0 0 8px rgba(106, 140, 140, 0.4)',
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isClickable = allowNavigation && index <= currentStep

            return (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={`
                  relative flex flex-col items-center gap-2
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
                whileHover={isClickable ? { scale: 1.05 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
              >
                {/* Step circle */}
                <motion.div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-colors duration-300
                    ${isCompleted || isCurrent
                      ? 'bg-vurmz-teal text-white'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                    }
                  `}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    boxShadow: isCurrent
                      ? '0 0 0 4px rgba(106, 140, 140, 0.2), 0 4px 12px rgba(106, 140, 140, 0.3)'
                      : isCompleted
                        ? '0 2px 8px rgba(106, 140, 140, 0.2)'
                        : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                  transition={springConfig}
                >
                  {isCompleted ? (
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, ...springConfig }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}

                  {/* Pulse ring for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-vurmz-teal"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  )}
                </motion.div>

                {/* Step label */}
                <motion.span
                  className={`
                    text-xs font-medium whitespace-nowrap
                    ${isCurrent ? 'text-vurmz-teal' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                  `}
                  animate={{
                    fontWeight: isCurrent ? 600 : 500,
                  }}
                >
                  {step.label}
                </motion.span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPACT STEP INDICATOR - Minimal version for tight spaces
// ============================================================================

interface CompactStepIndicatorProps {
  total: number
  current: number
  className?: string
}

export function CompactStepIndicator({
  total,
  current,
  className = '',
}: CompactStepIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => {
        const isCompleted = index < current
        const isCurrent = index === current

        return (
          <motion.div
            key={index}
            className={`
              h-1.5 rounded-full transition-colors duration-300
              ${isCompleted || isCurrent ? 'bg-vurmz-teal' : 'bg-gray-200'}
            `}
            initial={{ width: isCurrent ? 24 : 8 }}
            animate={{
              width: isCurrent ? 24 : 8,
              opacity: isCompleted || isCurrent ? 1 : 0.5,
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          />
        )
      })}

      <span className="ml-2 text-xs text-gray-500">
        {current + 1} of {total}
      </span>
    </div>
  )
}

// ============================================================================
// BREADCRUMB STEP INDICATOR - Text-based navigation
// ============================================================================

interface BreadcrumbStepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function BreadcrumbStepIndicator({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: BreadcrumbStepIndicatorProps) {
  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = index <= currentStep

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}

            <motion.button
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={`
                text-sm font-medium transition-colors duration-200
                ${isCurrent
                  ? 'text-vurmz-teal'
                  : isCompleted
                    ? 'text-gray-700 hover:text-vurmz-teal cursor-pointer'
                    : 'text-gray-400 cursor-default'
                }
              `}
              whileHover={isClickable && !isCurrent ? { x: 2 } : undefined}
            >
              {step.label}
            </motion.button>
          </div>
        )
      })}
    </nav>
  )
}
