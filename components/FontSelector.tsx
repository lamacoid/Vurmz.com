'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { fontOptions, fontsByCategory, categoryLabels } from '@/lib/fonts'

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
  previewText?: string
  size?: 'default' | 'large'
}

export default function FontSelector({
  value,
  onChange,
  previewText = 'Your Text',
  size = 'default',
}: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedFont = fontOptions.find(f => f.value === value) || fontOptions[0]

  const isLarge = size === 'large'

  return (
    <div className="relative">
      <label className={`block font-medium text-gray-700 mb-3 ${isLarge ? 'text-base' : 'text-sm'}`}>
        Font Style
      </label>

      {/* Selected Font Display - Premium Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left rounded-2xl border-2 transition-all ${
          isOpen
            ? 'border-vurmz-teal bg-vurmz-teal/5'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        } ${isLarge ? 'p-5' : 'p-4'}`}
        whileTap={{ scale: 0.99 }}
        style={{
          boxShadow: isOpen
            ? '0 4px 20px rgba(106,140,140,0.15)'
            : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`text-gray-500 mb-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
              {selectedFont?.label || 'Select a font'}
            </div>
            <div
              className={`text-gray-900 ${isLarge ? 'text-3xl' : 'text-2xl'}`}
              style={selectedFont?.style}
            >
              {previewText}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className={`text-gray-400 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute z-50 w-full mt-2 rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{
                maxHeight: '400px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              }}
            >
              <div className="overflow-y-auto max-h-[380px] p-2">
                {Object.entries(fontsByCategory).map(([category, fonts]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur-sm">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </div>
                    <div className="space-y-1">
                      {fonts.map((font) => (
                        <motion.button
                          key={font.value}
                          type="button"
                          onClick={() => {
                            onChange(font.value)
                            setIsOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                            value === font.value
                              ? 'bg-vurmz-teal/10 border border-vurmz-teal/30'
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 mb-0.5">{font.label}</div>
                            <div
                              className={`text-xl truncate ${
                                value === font.value ? 'text-vurmz-teal' : 'text-gray-900'
                              }`}
                              style={font.style}
                            >
                              {previewText}
                            </div>
                          </div>
                          {value === font.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-vurmz-teal flex items-center justify-center flex-shrink-0 ml-3"
                            >
                              <CheckIcon className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Custom option */}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <motion.button
                    type="button"
                    onClick={() => {
                      onChange('custom')
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                      value === 'custom'
                        ? 'bg-vurmz-teal/10 border border-vurmz-teal/30'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Custom Request</div>
                      <div className="text-gray-600">Other - describe in notes</div>
                    </div>
                    {value === 'custom' && (
                      <div className="w-6 h-6 rounded-full bg-vurmz-teal flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
