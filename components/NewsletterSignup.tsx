'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

interface NewsletterSignupProps {
  /** 'full' = homepage section with heading, 'compact' = footer inline */
  variant?: 'full' | 'compact'
  /** 'services' = dark bg teal accent, 'shop' = dark card on cream page with coral accent */
  theme?: 'services' | 'shop'
}

export default function NewsletterSignup({ variant = 'full', theme = 'services' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName: firstName || undefined }),
      })

      const data: { error?: string } = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
      setFirstName('')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  // ─── COMPACT: Footer version ───
  if (variant === 'compact') {
    return (
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Stay in the loop
        </h3>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-vurmz-teal"
            >
              <CheckIcon className="w-4 h-4" />
              <span>You&apos;re on the list!</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-2.5"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="flex-1 min-w-0 bg-white/[0.06] border border-white/10 rounded-sm px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-vurmz-teal/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 bg-vurmz-teal text-white text-sm font-semibold rounded-sm hover:bg-vurmz-teal-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? '...' : 'Sign up'}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-xs text-red-400">{errorMsg}</p>
              )}
              <p className="text-xs text-gray-600">
                Very infrequent updates. No spam.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── FULL: Homepage section ───
  const isShopTheme = theme === 'shop'

  return (
    <section className={`relative py-12 sm:py-16 ${isShopTheme ? '' : 'border-t border-white/[0.06]'}`}>
      {isShopTheme ? (
        <div className="absolute inset-0 bg-[#1A4F48] rounded-sm mx-4 sm:mx-6 lg:mx-8" />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(60,185,178,0.03) 50%, transparent 100%)' }} />
      )}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
            Newsletter
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            See what I&apos;m making
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
            New products, new materials, and behind-the-scenes looks at what&apos;s coming off the laser. I only send emails when there&apos;s something worth sharing. Maybe a few times a year.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-3 py-4"
              >
                <div className="w-10 h-10 rounded-full bg-vurmz-teal/20 flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-vurmz-teal" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">You&apos;re in!</p>
                  <p className="text-gray-400 text-sm">Check your inbox for a welcome from me.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className="sm:w-40 bg-white/[0.06] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-vurmz-teal/40 transition-colors"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 bg-white/[0.06] border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-vurmz-teal/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`group inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-sm transition-all disabled:opacity-50 ${
                      isShopTheme
                        ? 'bg-[#E95C4E] text-white hover:bg-[#D24A3D] shadow-lg shadow-[#E95C4E]/20'
                        : 'bg-vurmz-cta text-white hover:bg-vurmz-cta-hover shadow-lg shadow-vurmz-cta/20'
                    }`}
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    {status === 'loading' ? 'Signing up...' : 'Subscribe'}
                  </button>
                </div>

                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                <p className="text-xs text-gray-600">
                  Unsubscribe anytime. I keep your info private.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
