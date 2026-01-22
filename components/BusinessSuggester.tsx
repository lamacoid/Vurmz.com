'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { SuggestionResponse } from '@/lib/product-catalog'

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function BusinessSuggester() {
  const [businessType, setBusinessType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessType.trim() || isLoading) return

    setIsLoading(true)
    setError('')
    setSuggestions(null)

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType: businessType.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      const data = await response.json() as SuggestionResponse
      setSuggestions(data)
    } catch {
      setError('Could not generate suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSuggestions(null)
    setBusinessType('')
    setError('')
  }

  return (
    <div
      className="rounded-3xl p-8 md:p-12 backdrop-blur-xl border relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(106, 140, 140, 0.1) 0%, rgba(140, 174, 196, 0.05) 100%)',
        borderColor: 'rgba(140, 174, 196, 0.15)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Decorative gradient */}
      <motion.div
        className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] opacity-30 pointer-events-none"
        style={{ background: '#8caec4', transform: 'translate(30%, -30%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        {!suggestions ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: liquidEase }}
            className="relative z-10"
          >
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ background: 'rgba(140, 174, 196, 0.15)', color: '#8caec4' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI-Powered Recommendations
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                What kind of business are you?
              </h3>
              <p className="text-slate-400 max-w-lg mx-auto">
                Tell me about your business and I&apos;ll suggest the perfect laser-engraved products for you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g., restaurant, real estate agent, construction company..."
                  className="flex-1 px-6 py-4 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8caec4]/50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(140, 174, 196, 0.2)',
                  }}
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!businessType.trim() || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6a8c8c 0%, #8caec4 100%)',
                    boxShadow: '0 10px 30px rgba(106, 140, 140, 0.3)',
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Thinking...
                    </span>
                  ) : (
                    'Get Suggestions'
                  )}
                </motion.button>
              </div>
              {error && (
                <p className="mt-4 text-red-400 text-center text-sm">{error}</p>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: liquidEase }}
            className="relative z-10"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Perfect for <span style={{ color: '#8caec4' }}>{businessType}</span>
              </h3>
              <p className="text-slate-400">Here&apos;s what I recommend:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* Catalog suggestions */}
              {suggestions.catalogSuggestions.map((suggestion, i) => (
                <motion.div
                  key={suggestion.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: liquidEase }}
                  className="rounded-2xl p-6 border"
                  style={{
                    background: 'rgba(106, 140, 140, 0.1)',
                    borderColor: 'rgba(140, 174, 196, 0.2)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{ background: 'rgba(140, 174, 196, 0.2)', color: '#8caec4' }}
                    >
                      From Catalog
                    </span>
                    <span className="text-lg font-bold" style={{ color: '#8caec4' }}>
                      ${suggestion.startingPrice}+
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{suggestion.productName}</h4>
                  <p className="text-slate-400 text-sm mb-3">{suggestion.reason}</p>
                  <p className="text-slate-500 text-xs italic">&ldquo;{suggestion.suggestedUse}&rdquo;</p>
                </motion.div>
              ))}

              {/* Custom project idea */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: liquidEase }}
                className="rounded-2xl p-6 border"
                style={{
                  background: 'linear-gradient(135deg, rgba(140, 174, 196, 0.15) 0%, rgba(106, 140, 140, 0.1) 100%)',
                  borderColor: 'rgba(140, 174, 196, 0.3)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                  >
                    Custom Project
                  </span>
                  <span className="text-lg font-bold text-white">Quote</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{suggestions.customProjectIdea.title}</h4>
                <p className="text-slate-400 text-sm mb-3">{suggestions.customProjectIdea.description}</p>
                <p className="text-slate-500 text-xs italic">{suggestions.customProjectIdea.whyItWorks}</p>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6a8c8c 0%, #8caec4 100%)',
                    boxShadow: '0 10px 30px rgba(106, 140, 140, 0.3)',
                  }}
                >
                  Start Your Order
                </motion.button>
              </Link>
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl font-semibold border"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(140, 174, 196, 0.2)',
                  color: '#8caec4',
                }}
              >
                Try Another Business
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
