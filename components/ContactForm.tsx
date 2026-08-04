'use client'

import { useEffect, useState } from 'react'
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { siteInfo } from '@/lib/site-info'
import { CONTACT_PRODUCT_OPTIONS } from '@/lib/pricing'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productInterest: '',
    message: '',
    // Honeypot — real users leave it empty; bots fill every field
    website: '',
  })

  // The services configurator links here with the job it just priced.
  // Read after mount from window rather than useSearchParams: this form
  // also sits on the statically prerendered homepage, and that hook would
  // opt the whole page out of prerendering (it fails the build outright).
  // Product must match a real option or the select would carry a value the
  // API discards; the message is free text they can edit before sending.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const product = params.get('product') ?? ''
    const message = params.get('message') ?? ''
    if (!product && !message) return
    setFormData(prev => ({
      ...prev,
      productInterest: (CONTACT_PRODUCT_OPTIONS as readonly string[]).includes(product) ? product : prev.productInterest,
      message: message || prev.message,
    }))
  }, [])
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json() as { error?: string; success?: boolean }

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', productInterest: '', message: '', website: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-[var(--feature)]/10 border border-vurmz-teal/30 rounded-xl p-8 text-center">
        <CheckCircleIcon className="w-12 h-12 text-[var(--eyebrow)] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--ink)] mb-2">Message Sent</h3>
        <p className="text-[var(--ink-soft)] mb-4">
          Thanks for reaching out. {siteInfo.founder.name} will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-[var(--eyebrow)] font-medium hover:text-[var(--ink)] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          maxLength={100}
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-soft)] focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
          placeholder="Your name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            maxLength={254}
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-soft)] focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            maxLength={30}
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-soft)] focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
            placeholder="(555) 555-5555"
          />
        </div>
      </div>

      <div>
        <label htmlFor="productInterest" className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
          What are you interested in?
        </label>
        <select
          id="productInterest"
          value={formData.productInterest}
          onChange={e => setFormData(prev => ({ ...prev, productInterest: e.target.value }))}
          className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
        >
          <option value="">Select a product (optional)</option>
          {CONTACT_PRODUCT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          maxLength={5000}
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] rounded-lg text-[var(--ink)] placeholder-[var(--ink-soft)] focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors resize-none"
          placeholder="Tell me about your project. What you need, quantity, timeline..."
        />
      </div>

      {/* Honeypot — hidden from users, catches bots that fill every field */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vurmz-cta text-white px-8 py-3 font-semibold hover:bg-vurmz-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed puffy-btn"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
        {status !== 'sending' && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  )
}
