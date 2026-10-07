'use client'
/* eslint-disable @next/next/no-img-element */
/**
 * "Can you engrave this?": a photo and two lines, and a number comes back
 * by text the same day. Photos go through the guest upload (the private
 * checkout/ prefix on R2), the request lands in the inbox with the photo
 * keys attached, and Zach gets the email with admin links to each file.
 * Phone or email, either one is enough.
 *
 * The business variant asks for a count and a logo instead of the words,
 * and takes SVG and PDF, because that is what a logo arrives as.
 */
import { useEffect, useRef, useState } from 'react'
import { designById, sheetFor } from '@/lib/design/sheet'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE } from '@/lib/pricing'

interface Shot { key: string; filename: string; preview: string | null }

const MAX_FILES = 3
const MAX_SIZE = 10 * 1024 * 1024
const ACCEPT_PHOTO = 'image/jpeg,image/png,image/webp,image/gif'
const ACCEPT_BUSINESS = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf,.svg,.pdf'

export default function CanYouEngraveThis({ compact = false, variant = 'personal' }: { compact?: boolean; variant?: 'personal' | 'business' }) {
  const business = variant === 'business'
  const [shots, setShots] = useState<Shot[]>([])
  const [uploading, setUploading] = useState(false)
  const [item, setItem] = useState('')
  const [words, setWords] = useState('')
  const [count, setCount] = useState('')
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Arriving from the design wall: name the design in the message.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('design')
    if (!id) return
    const el = designById(id)
    if (el) setWords(prev => prev || `${sheetFor(el.category).name} design ${el.label.replace(/^\D+/, '')} from the wall (${el.id})`)
  }, [])

  async function addFiles(list: FileList | null) {
    if (!list) return
    setError('')
    const room = MAX_FILES - shots.length
    const files = Array.from(list).slice(0, Math.max(0, room))
    if (files.length === 0) return
    setUploading(true)
    try {
      for (const f of files) {
        if (f.size > MAX_SIZE) { setError('Each file has to be under 10 MB.'); continue }
        const fd = new FormData()
        fd.append('file', f)
        const res = await fetch('/api/checkout/upload', { method: 'POST', body: fd })
        const data = await res.json() as { ok: boolean; data?: { key: string; filename: string }; error?: { message?: string } }
        if (!res.ok || !data.ok || !data.data) { setError(data.error?.message || 'That file did not upload. Try again.'); continue }
        const preview = /^image\/(jpeg|png|webp|gif)$/.test(f.type) ? URL.createObjectURL(f) : null
        setShots(prev => [...prev, { key: data.data!.key, filename: data.data!.filename, preview }])
      }
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!phone.trim() && !email.trim()) { setError('A phone number or an email, so I can send the price back.'); return }
    if (shots.length === 0 && !item.trim()) { setError('A photo, or at least tell me what the thing is.'); return }
    setStatus('sending')
    const message = (business
      ? [
          'Business quote.',
          company.trim() ? `Company: ${company.trim()}` : '',
          item.trim() ? `What: ${item.trim()}` : '',
          count.trim() ? `How many: ${count.trim()}` : '',
          words.trim() ? `Logo or words: ${words.trim()}` : '',
        ]
      : [
          'Can you engrave this?',
          item.trim() ? `What it is: ${item.trim()}` : '',
          words.trim() ? `What to put on it: ${words.trim()}` : '',
        ]
    ).concat(shots.length ? `${shots.length} file${shots.length === 1 ? '' : 's'} attached.` : 'No photo.').filter(Boolean).join('\n')
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message,
          productInterest: business ? 'Business / Recurring Order' : `Custom Engraving ($${SIGNATURE.startingAt}+)`,
          website,
          attachments: shots.map(s => ({ key: s.key, filename: s.filename })),
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'It did not send. Text me the photo instead.')
    }
  }

  const field = 'w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-control)] px-3.5 py-3 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/70 outline-none focus:border-[var(--eyebrow)] transition-colors'
  const label = 'block text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--ink-soft)] mb-1.5'
  const smsText = business ? 'Hi Zach, I need something marked for my business. ' : 'Hi Zach, can you engrave this? '

  if (status === 'done') {
    return (
      <div className="rounded-[var(--r-panel)] border border-[var(--glass-edge)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-[length:var(--step-panel)] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>Got it.</p>
        <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">
          I will look at it and send a {business ? 'price' : 'number'} back today, usually within the hour. If it is faster, text me at{' '}
          <a href={getSmsLink()} className="text-[var(--eyebrow)] hover:text-[var(--ink)]">{siteInfo.phone}</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className={`rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}>
      {/* The photo, first. */}
      <div>
        <span className={label}>{business ? 'A photo of the thing, or the logo' : 'The photo'}</span>
        <div className="flex flex-wrap gap-3">
          {shots.map(s => (
            <div key={s.key} className="relative w-24 h-24 rounded-[var(--r-tile)] overflow-hidden border border-[var(--hairline)] bg-[var(--glass-soft)]">
              {s.preview ? (
                <img src={s.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="block p-2 text-[11px] leading-snug text-[var(--ink-soft)] break-all">{s.filename}</span>
              )}
              <button
                type="button"
                onClick={() => setShots(prev => prev.filter(x => x.key !== s.key))}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[var(--surface)]/90 text-white text-xs leading-none"
                aria-label="Remove file"
              >
                ×
              </button>
            </div>
          ))}
          {shots.length < MAX_FILES && (
            <label className={`w-24 h-24 rounded-[var(--r-tile)] border border-dashed border-[var(--glass-edge)] hover:border-[var(--eyebrow)] flex flex-col items-center justify-center text-center text-[12px] text-[var(--eyebrow)] cursor-pointer transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className="text-2xl leading-none mb-1">+</span>
              {uploading ? 'Uploading' : shots.length ? 'Another' : business ? 'Add a file' : 'Add a photo'}
              <input ref={fileRef} type="file" accept={business ? ACCEPT_BUSINESS : ACCEPT_PHOTO} multiple capture={business ? undefined : 'environment'} className="sr-only" onChange={e => addFiles(e.target.files)} />
            </label>
          )}
        </div>
        <p className="mt-1.5 text-[12px] text-[var(--ink-soft)]/80">
          {business ? 'Up to three. A phone photo of the part is fine. SVG or PDF for the logo, if you have it.' : 'Up to three. Phone photos are fine. Show me the spot you want marked.'}
        </p>
      </div>

      {business ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cyet-item" className={label}>What is it</label>
            <input id="cyet-item" className={field} maxLength={120} value={item} onChange={e => setItem(e.target.value)} placeholder="Pens. Labels. Our knives." />
          </div>
          <div>
            <label htmlFor="cyet-count" className={label}>How many</label>
            <input id="cyet-count" className={field} maxLength={60} value={count} onChange={e => setCount(e.target.value)} placeholder="25. About 100. Not sure yet." />
          </div>
          <div>
            <label htmlFor="cyet-words" className={label}>Your logo, or the words</label>
            <input id="cyet-words" className={field} maxLength={200} value={words} onChange={e => setWords(e.target.value)} placeholder="Logo attached. Or: the shop name and a number." />
          </div>
        </div>
      ) : (
        <div className={`mt-4 grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
          <div>
            <label htmlFor="cyet-item" className={label}>What is it</label>
            <input id="cyet-item" className={field} maxLength={120} value={item} onChange={e => setItem(e.target.value)} placeholder="A chef's knife. A Yeti. My dad's hammer." />
          </div>
          <div>
            <label htmlFor="cyet-words" className={label}>What goes on it</label>
            <input id="cyet-words" className={field} maxLength={200} value={words} onChange={e => setWords(e.target.value)} placeholder="A name and a date. Our logo. Not sure yet." />
          </div>
        </div>
      )}

      <div className={`mt-4 grid grid-cols-1 ${business ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
        {business && (
          <div>
            <label htmlFor="cyet-company" className={label}>Business</label>
            <input id="cyet-company" className={field} maxLength={100} value={company} onChange={e => setCompany(e.target.value)} placeholder="The shop's name" />
          </div>
        )}
        <div>
          <label htmlFor="cyet-name" className={label}>Your name</label>
          <input id="cyet-name" className={field} required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="First name is fine" />
        </div>
        <div>
          <label htmlFor="cyet-phone" className={label}>Phone</label>
          <input id="cyet-phone" className={field} type="tel" maxLength={30} value={phone} onChange={e => setPhone(e.target.value)} placeholder="I text the price back" />
        </div>
        <div>
          <label htmlFor="cyet-email" className={label}>Email, if you prefer</label>
          <input id="cyet-email" className={field} type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="cyet-website">Website (leave blank)</label>
        <input id="cyet-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
      </div>

      {error && <p className="mt-3 text-sm text-[var(--error)]">{error}</p>}

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <button
          type="submit"
          disabled={status === 'sending' || uploading}
          className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[15px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending' : business ? 'Send it, get a price' : 'Send it, get a number'}
        </button>
        <a href={getSmsLink(smsText)} className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
          Or text it to <span className="text-[var(--eyebrow)]">{siteInfo.phone}</span>
        </a>
      </div>
    </form>
  )
}
