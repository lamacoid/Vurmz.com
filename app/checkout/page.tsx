'use client'
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/store'
import SquarePayment from '@/components/shop/SquarePayment'

interface FulfillmentOption {
  method: 'ship' | 'hand_deliver' | 'pickup' | 'uber_direct' | 'invoice_later'
  label: string
  priceCents: number
  eta: string
  description: string
  disabled?: boolean
  windows?: Array<{ key: string; label: string }>
}

interface SquareConfig { applicationId: string; locationId: string; environment: 'sandbox' | 'production' }

interface SavedAddress {
  id: string
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function CheckoutPage() {
  const { items, clear, subtotalCents } = useCart()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({ name: '', line1: '', line2: '', city: '', state: 'CO', postalCode: '', phone: '' })
  const [notes, setNotes] = useState('')
  // Guest-friendly file attachments (photo/logo) — uploaded immediately to
  // /api/checkout/upload, keys submitted with the order. `warning` is local
  // UX only (low-contrast advice) and is stripped from the order payload.
  const [attachments, setAttachments] = useState<Array<{ key: string; filename: string; warning?: string }>>([])
  const [uploading, setUploading] = useState(false)
  const [options, setOptions] = useState<FulfillmentOption[]>([])
  const [chosenMethod, setChosenMethod] = useState<FulfillmentOption['method'] | null>(null)
  const [handDeliveryWindow, setHandDeliveryWindow] = useState<string>('')
  const [handDeliveryNote, setHandDeliveryNote] = useState<string>('')
  const [squareConfig, setSquareConfig] = useState<SquareConfig | null>(null)
  const [squareChecked, setSquareChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Account prefill (logged-in customers only). Guests keep a blank form.
  const [loggedIn, setLoggedIn] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [saveAddress, setSaveAddress] = useState(false)

  // Load square config once
  useEffect(() => {
    fetch('/api/checkout/config').then(r => r.json()).then(j => {
      const parsed = j as { data?: { square: SquareConfig | null } }
      setSquareConfig(parsed.data?.square ?? null)
      setSquareChecked(true)
    }).catch(() => setSquareChecked(true))
  }, [])

  // Prefill from the customer's account, if signed in. /api/account/me 401s for
  // guests, in which case we leave the form blank and the guest flow is untouched.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const meRes = await fetch('/api/account/me')
        if (!meRes.ok) return
        const me = (await meRes.json()) as { data?: { customer: { name: string; email: string; phone: string | null } } }
        if (cancelled || !me.data) return
        setLoggedIn(true)
        const c = me.data.customer
        setEmail(prev => prev || c.email || '')
        setAddress(a => ({ ...a, name: a.name || c.name || '', phone: a.phone || c.phone || '' }))

        const addrRes = await fetch('/api/account/addresses')
        if (!addrRes.ok || cancelled) return
        const addrJson = (await addrRes.json()) as { data?: { addresses: SavedAddress[] } }
        if (cancelled) return
        const list = addrJson.data?.addresses ?? []
        setSavedAddresses(list)
        // Pre-select the default address (or the most recent) and populate fields.
        const def = list.find(a => a.isDefault) ?? list[0]
        if (def) {
          setSelectedAddressId(def.id)
          setAddress(prev => ({
            name: prev.name || c.name || '',
            line1: def.line1,
            line2: def.line2 ?? '',
            city: def.city,
            state: def.state,
            postalCode: def.postalCode,
            phone: def.phone ?? prev.phone ?? '',
          }))
        }
      } catch {}
    })()
    return () => { cancelled = true }
  }, [])

  function selectSavedAddress(a: SavedAddress) {
    setSelectedAddressId(a.id)
    setAddress(prev => ({
      name: prev.name,
      line1: a.line1,
      line2: a.line2 ?? '',
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      phone: a.phone ?? prev.phone ?? '',
    }))
  }

  function enterNewAddress() {
    setSelectedAddressId(null)
    setAddress(prev => ({ name: prev.name, line1: '', line2: '', city: '', state: 'CO', postalCode: '', phone: prev.phone }))
  }

  const refreshQuote = useCallback(async () => {
    if (items.length === 0) return
    try {
      const res = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, qty: i.qty })),
          address: address.postalCode ? { postalCode: address.postalCode, state: address.state } : undefined,
        }),
      })
      const json = (await res.json()) as { ok?: boolean; data?: { fulfillmentOptions: FulfillmentOption[] } }
      if (json.ok && json.data) {
        setOptions(json.data.fulfillmentOptions)
        if (chosenMethod == null && json.data.fulfillmentOptions.length) {
          setChosenMethod(json.data.fulfillmentOptions[0].method)
        }
      }
    } catch {}
  }, [items, address.postalCode, address.state, chosenMethod])

  useEffect(() => { refreshQuote() }, [refreshQuote])

  const chosen = options.find(o => o.method === chosenMethod) ?? null
  const totalCents = subtotalCents + (chosen?.priceCents ?? 0)
  const needsAddress = chosenMethod === 'ship' || chosenMethod === 'hand_deliver' || chosenMethod === 'uber_direct'
  const paymentMethodAvailable = Boolean(squareConfig)

  function idempotencyKey() {
    // RFC-4122-ish
    const r = crypto.getRandomValues(new Uint8Array(16))
    r[6] = (r[6] & 0x0f) | 0x40
    r[8] = (r[8] & 0x3f) | 0x80
    const h = Array.from(r).map(b => b.toString(16).padStart(2, '0')).join('')
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
  }

  // Lasers mark in one tone: a logo needs to read as near black-and-white.
  // Vector files (SVG/PDF) are inherently fine; for raster images we sample a
  // downscaled luminance histogram and warn (never block) when the 10th-90th
  // percentile spread is narrow — i.e. the image is mostly midtones.
  async function checkRasterContrast(file: File): Promise<string | undefined> {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return undefined
    try {
      const bmp = await createImageBitmap(file)
      const scale = Math.min(1, 128 / Math.max(bmp.width, bmp.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bmp.width * scale))
      canvas.height = Math.max(1, Math.round(bmp.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) return undefined
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const lums: number[] = []
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3] / 255
        // Composite on white — transparent pixels won't be marked.
        const r = data[i] * a + 255 * (1 - a)
        const g = data[i + 1] * a + 255 * (1 - a)
        const b = data[i + 2] * a + 255 * (1 - a)
        lums.push(0.2126 * r + 0.7152 * g + 0.0722 * b)
      }
      lums.sort((x, y) => x - y)
      const spread = lums[Math.floor(lums.length * 0.9)] - lums[Math.floor(lums.length * 0.1)]
      if (spread < 90) {
        return 'This image reads low-contrast for laser marking. I can usually clean it up — or if you have an SVG or PDF version, that engraves best.'
      }
    } catch {
      // Analysis is best-effort; never stop an upload over it.
    }
    return undefined
  }

  async function uploadAttachment(file: File) {
    if (attachments.length >= 3) { setError('Up to 3 files per order'); return }
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/checkout/upload', { method: 'POST', body: fd })
      const json = (await res.json()) as { ok?: boolean; data?: { key: string; filename: string }; error?: { message?: string; code?: string } }
      if (!res.ok || !json.ok || !json.data) {
        setError(json.error?.message ?? 'Upload failed — try again or text me the file.')
        return
      }
      const uploaded = json.data
      const warning = await checkRasterContrast(file)
      setAttachments(prev => [...prev, { key: uploaded.key, filename: uploaded.filename, warning }])
    } catch {
      setError('Upload failed — try again or text me the file.')
    } finally {
      setUploading(false)
    }
  }

  async function submitOrder(paymentMethod: 'square' | 'invoice_later', sourceId?: string) {
    if (!chosenMethod) { setError('Choose a fulfillment option'); return }
    if (!email) { setError('Email required'); return }
    if (needsAddress && (!address.line1 || !address.city || !address.postalCode)) {
      setError('Address required for this fulfillment method')
      return
    }
    if (chosenMethod === 'hand_deliver' && !handDeliveryWindow) {
      setError('Pick a delivery window')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: items.map(i => {
            const eng = i.metadata?.engraving as { text?: string; fontValue?: string; fontLabel?: string; placement?: string } | undefined
            return {
              productId: i.productId,
              qty: i.qty,
              personalization: eng?.text
                ? { text: eng.text, fontValue: eng.fontValue ?? '', fontLabel: eng.fontLabel ?? '', placement: eng.placement || undefined }
                : undefined,
            }
          }),
          fulfillmentMethod: chosenMethod,
          address: needsAddress ? {
            name: address.name || email.split('@')[0],
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            phone: address.phone || null,
            country: 'US',
          } : null,
          notes,
          attachments: attachments.length ? attachments.map(a => ({ key: a.key, filename: a.filename })) : undefined,
          handDelivery: chosenMethod === 'hand_deliver' ? {
            window: handDeliveryWindow || undefined,
            note: handDeliveryNote || undefined,
          } : undefined,
          payment: {
            method: paymentMethod,
            sourceId,
            idempotencyKey: paymentMethod === 'square' ? idempotencyKey() : undefined,
          },
        }),
      })
      const json = (await res.json()) as { ok?: boolean; data?: { order: { number: string } }; error?: { code?: string; message?: string } }
      if (!res.ok || !json.ok) {
        setError(json.error?.message ?? json.error?.code ?? 'Order failed')
        setSubmitting(false)
        return
      }
      // Save the entered address to the account if the customer opted in.
      // Fire-and-forget — we're navigating away and it must not block success.
      if (loggedIn && saveAddress && selectedAddressId === null && needsAddress && address.line1) {
        fetch('/api/account/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: 'Shipping',
            line1: address.line1,
            line2: address.line2 || null,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: 'US',
            phone: address.phone || null,
          }),
        }).catch(() => {})
      }
      clear()
      router.push(`/checkout/success?n=${encodeURIComponent(json.data!.order.number)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setSubmitting(false)
    }
  }

  const canCheckout = useMemo(() => !!email && !!chosenMethod && !submitting, [email, chosenMethod, submitting])

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link href="/shop" className="inline-flex text-[#C67A6F] hover:underline">← Back to shop</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/shop" className="text-sm text-[#6B6259] hover:text-[var(--ink)]">← Continue shopping</Link>
        <h1 className="text-3xl font-bold mt-2">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Form */}
        <div className="space-y-8">
          <Section title="1 · Contact">
            <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
          </Section>

          <Section title="2 · Fulfillment">
            {address.postalCode.length === 5 && (
              <p className="text-xs text-[#6B6259] mb-2">ZIP recognized — options updated.</p>
            )}
            <div className="grid grid-cols-1 gap-2">
              {options.map(opt => (
                <div key={opt.method}>
                  <label
                    className={`flex items-start gap-3 rounded-sm border p-3 cursor-pointer ${
                      chosenMethod === opt.method
                        ? 'border-[#C67A6F] bg-[#C67A6F]/5'
                        : 'border-[#16525C]/12 bg-white/60 hover:border-[#16525C]/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={chosenMethod === opt.method}
                      onChange={() => setChosenMethod(opt.method)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-sm">{opt.label}</span>
                        <span className="text-sm font-semibold">{opt.priceCents === 0 ? 'Free' : money(opt.priceCents)}</span>
                      </div>
                      <p className="text-xs text-[#6B6259] mt-0.5">{opt.description} · {opt.eta}</p>
                    </div>
                  </label>

                  {opt.method === 'hand_deliver' && chosenMethod === 'hand_deliver' && opt.windows && opt.windows.length > 0 && (
                    <div className="mt-2 ml-7 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#7A7068] mb-1.5 font-semibold">Preferred window</p>
                        <div className="flex flex-wrap gap-1.5">
                          {opt.windows.map(w => (
                            <button
                              key={w.key}
                              type="button"
                              onClick={() => setHandDeliveryWindow(w.key)}
                              className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                                handDeliveryWindow === w.key
                                  ? 'border-[#C67A6F] bg-[#C67A6F] text-white'
                                  : 'border-[#16525C]/15 bg-white/70 text-[var(--ink)] hover:border-[#C67A6F]/50'
                              }`}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#7A7068] block mb-1 font-semibold">
                          Delivery note <span className="font-normal normal-case text-[#9A8F86]">(gate code, parking, leave-with, etc.)</span>
                        </label>
                        <textarea
                          value={handDeliveryNote}
                          onChange={e => setHandDeliveryNote(e.target.value.slice(0, 500))}
                          rows={2}
                          placeholder="e.g. Gate code 1234, leave with front desk if I'm not home."
                          className="w-full bg-white/70 border border-[#16525C]/12 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#C67A6F]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {needsAddress && (
            <Section title="3 · Address">
              {loggedIn && savedAddresses.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#7A7068] font-semibold">Use a saved address</p>
                  {savedAddresses.map(a => (
                    <label
                      key={a.id}
                      className={`flex items-start gap-3 rounded-sm border p-3 cursor-pointer ${
                        selectedAddressId === a.id
                          ? 'border-[#C67A6F] bg-[#C67A6F]/5'
                          : 'border-[#16525C]/12 bg-white/60 hover:border-[#16525C]/25'
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === a.id}
                        onChange={() => selectSavedAddress(a)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold">
                          {a.label}
                          {a.isDefault && <span className="ml-2 text-[10px] uppercase tracking-wider text-[#C67A6F]">default</span>}
                        </span>
                        <p className="text-xs text-[#6B6259] mt-0.5 truncate">
                          {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}
                  <label
                    className={`flex items-center gap-3 rounded-sm border p-3 cursor-pointer ${
                      selectedAddressId === null
                        ? 'border-[#C67A6F] bg-[#C67A6F]/5'
                        : 'border-[#16525C]/12 bg-white/60 hover:border-[#16525C]/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === null}
                      onChange={() => enterNewAddress()}
                    />
                    <span className="text-sm font-semibold">Enter a new address</span>
                  </label>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Full name" value={address.name} onChange={v => setAddress(a => ({ ...a, name: v }))} colSpan={2} />
                <Input label="Street" value={address.line1} onChange={v => setAddress(a => ({ ...a, line1: v }))} colSpan={2} />
                <Input label="Apt / Suite" value={address.line2} onChange={v => setAddress(a => ({ ...a, line2: v }))} colSpan={2} />
                <Input label="City" value={address.city} onChange={v => setAddress(a => ({ ...a, city: v }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="State" value={address.state} onChange={v => setAddress(a => ({ ...a, state: v.toUpperCase().slice(0, 2) }))} />
                  <Input label="ZIP" value={address.postalCode} onChange={v => setAddress(a => ({ ...a, postalCode: v.replace(/[^0-9-]/g, '').slice(0, 10) }))} />
                </div>
                <Input label="Phone" value={address.phone} onChange={v => setAddress(a => ({ ...a, phone: v }))} colSpan={2} />
              </div>
              {loggedIn && selectedAddressId === null && (
                <label className="flex items-center gap-2 mt-3 text-sm text-[#6B6259] cursor-pointer">
                  <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} />
                  Save this address to my account
                </label>
              )}
            </Section>
          )}

          <Section title={needsAddress ? '4 · Engraving instructions' : '3 · Engraving instructions'}>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Placement, sizes, finishes, links to inspiration — anything I should know before I make your proof…"
              className="w-full bg-white/70 border border-[#16525C]/12 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#C67A6F]"
            />
            <p className="mt-2 text-xs text-[var(--ink)] font-medium">
              ✓ I always send a proof photo before I engrave. Nothing runs until you approve it.
            </p>

            {/* Photo / logo attachments — works for guests, no account needed */}
            <div className="mt-3">
              <p className="text-xs text-[#6B6259] mb-2">
                Have a logo or design? Attach it here — up to 3 files, 10 MB each. <span className="font-medium text-[var(--ink)]">SVG or PDF engraves best</span> (crisp lines, high contrast). Photos and PNG/JPG work too — I&apos;ll clean them up if needed. No file? Just describe it above and we&apos;ll nail it down on the proof.
              </p>
              {attachments.length > 0 && (
                <ul className="space-y-1 mb-2">
                  {attachments.map(a => (
                    <li key={a.key} className="text-sm bg-white/70 border border-[#16525C]/12 rounded-sm px-3 py-1.5">
                      <div className="flex items-center justify-between">
                        <span className="truncate">📎 {a.filename}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(prev => prev.filter(x => x.key !== a.key))}
                          className="text-[#C67A6F] text-xs font-semibold ml-3 hover:underline flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                      {a.warning && (
                        <p className="text-xs text-[#8a6d1a] mt-1">⚠ {a.warning}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {attachments.length < 3 && (
                <label className={`inline-flex items-center gap-2 px-4 py-2 border border-[#16525C]/20 rounded-sm text-sm cursor-pointer hover:border-[#C67A6F] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,.svg,.pdf"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) uploadAttachment(f)
                      e.target.value = ''
                    }}
                  />
                  {uploading ? 'Uploading…' : '+ Attach a photo or logo'}
                </label>
              )}
            </div>
          </Section>

          <Section title="Payment">
            {!squareChecked ? (
              <p className="text-sm text-[#6B6259]">Loading…</p>
            ) : paymentMethodAvailable && chosenMethod !== 'invoice_later' ? (
              <SquarePayment
                config={squareConfig!}
                amountCents={totalCents}
                onToken={(token) => submitOrder('square', token)}
                onError={(msg) => setError(msg)}
              />
            ) : (
              <div>
                <p className="text-sm text-[#6B6259] mb-3">
                  {paymentMethodAvailable
                    ? `"${chosen?.label}" is invoice-based. I'll follow up with a Square invoice once I review the order.`
                    : 'Online payment is not yet configured — I\'ll send you a Square invoice after confirming your order.'}
                </p>
                <button
                  onClick={() => submitOrder('invoice_later')}
                  disabled={!canCheckout}
                  className="w-full h-11 bg-[#C67A6F] hover:bg-[#B0675D] disabled:opacity-60 text-white text-sm font-semibold rounded-sm"
                >
                  {submitting ? 'Placing order…' : 'Place order · pay by invoice'}
                </button>
              </div>
            )}
            {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
          </Section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start bg-white/70 border border-[#16525C]/12 rounded-sm p-5">
          <p className="text-[11px] uppercase tracking-wider text-[#7A7068] mb-3 font-semibold">Summary</p>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.productId} className="flex gap-3 items-start">
                <div className="w-14 h-14 bg-white border border-[#16525C]/10 rounded-sm overflow-hidden flex-shrink-0">
                  {item.heroUrl ? <img src={item.heroUrl} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-[#6B6259]">{item.packSize > 1 ? `${item.qty} × pack of ${item.packSize}` : `Qty ${item.qty}`}</p>
                  {(() => {
                    const eng = item.metadata?.engraving as { text?: string; fontLabel?: string } | undefined
                    return eng?.text ? (
                      <p className="text-[11px] text-[#C67A6F] truncate">✎ “{eng.text}”{eng.fontLabel ? ` · ${eng.fontLabel}` : ''}</p>
                    ) : null
                  })()}
                </div>
                <p className="text-sm font-semibold">{money(item.priceCents * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#16525C]/10 mt-4 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-[#6B6259]">Subtotal</span><span>{money(subtotalCents)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B6259]">{chosen?.label ?? 'Delivery'}</span><span>{chosen ? money(chosen.priceCents) : '—'}</span></div>
            <div className="flex justify-between text-base font-bold pt-2"><span>Total</span><span>{money(totalCents)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#7A7068] mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  colSpan,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  colSpan?: 1 | 2
}) {
  return (
    <label className={`block ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <span className="text-[11px] uppercase tracking-wider text-[#7A7068] block mb-1">{label}{required && ' *'}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/70 border border-[#16525C]/12 rounded-sm px-3 py-2 text-sm outline-none focus:border-[#C67A6F]"
      />
    </label>
  )
}
