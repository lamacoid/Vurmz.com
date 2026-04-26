'use client'

import { useState } from 'react'
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { siteInfo } from '@/lib/site-info'
import { BASIC, LEAVE_YOUR_MARK, SIGNATURE } from '@/lib/pricing'

const productOptions = [
  `${BASIC.pens.name} (pack)`,
  `${LEAVE_YOUR_MARK.serviceTags.name} (pack)`,
  `${BASIC.coasters.name} (pack)`,
  `${BASIC.keychains.name} (pack)`,
  BASIC.knives.name,
  BASIC.tools.name,
  LEAVE_YOUR_MARK.signatureTiles.name,
  `Custom Engraving ($${SIGNATURE.startingPrice}+)`,
  'Concierge Sourcing',
  'Other',
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productInterest: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json() as { error?: string; success?: boolean }

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', productInterest: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-vurmz-teal/10 border border-vurmz-teal/30 rounded-xl p-8 text-center">
        <CheckCircleIcon className="w-12 h-12 text-vurmz-teal mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Message Sent</h3>
        <p className="text-gray-400 mb-4">
          Thanks for reaching out. {siteInfo.founder.name} will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-vurmz-teal font-medium hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          maxLength={100}
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
          placeholder="Your name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            maxLength={254}
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            maxLength={30}
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
            placeholder="(555) 555-5555"
          />
        </div>
      </div>

      <div>
        <label htmlFor="productInterest" className="block text-sm font-medium text-gray-300 mb-1.5">
          What are you interested in?
        </label>
        <select
          id="productInterest"
          value={formData.productInterest}
          onChange={e => setFormData(prev => ({ ...prev, productInterest: e.target.value }))}
          className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-lg text-white focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors"
        >
          <option value="">Select a product (optional)</option>
          {productOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          maxLength={5000}
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none transition-colors resize-none"
          placeholder="Tell me about your project. What you need, quantity, timeline..."
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vurmz-cta text-white px-8 py-3 font-semibold rounded-xl hover:bg-vurmz-cta-hover transition-colors shadow-lg shadow-vurmz-cta/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
        {status !== 'sending' && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  )
}
