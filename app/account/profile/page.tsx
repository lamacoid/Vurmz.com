'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Customer { id: string; name: string; email: string; phone: string | null; company: string | null }
interface PaymentMethod { id: string; brand: string | null; last4: string | null; expMonth: number | null; expYear: number | null; isDefault: boolean }
interface ReferenceImage { id: string; filename: string; url: string }
const MAX_REFS = 5
const MIN_REFS = 2

export default function ProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/profile')
    const json = (await res.json()) as { data?: { customer: Customer; paymentMethods: PaymentMethod[] } }
    if (json.data) {
      setCustomer(json.data.customer)
      setMethods(json.data.paymentMethods)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function save() {
    if (!customer) return
    setSaving(true)
    await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        company: customer.company,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  if (loading || !customer) return <div className="p-10 text-center text-gray-500 text-sm">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-cream mb-6">Profile</h1>

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5 space-y-4 mb-5">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">Email</label>
          <p className="text-sm text-cream">{customer.email}</p>
          <p className="text-[10px] text-gray-600">Email can&rsquo;t be changed. Contact Zach if you need to update.</p>
        </div>
        <Field label="Name" value={customer.name} onChange={v => setCustomer({ ...customer, name: v })} />
        <Field label="Phone" value={customer.phone ?? ''} onChange={v => setCustomer({ ...customer, phone: v })} />
        <Field label="Company" value={customer.company ?? ''} onChange={v => setCustomer({ ...customer, company: v })} />
        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} disabled={saving} className="px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md">
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-xs text-[#6BB8B2]">Saved ✓</span>}
        </div>
      </div>

      <ReferenceImages />

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3 font-semibold">Saved payment methods</p>
        {methods.length === 0 ? (
          <p className="text-xs text-gray-500">
            You haven&rsquo;t saved any cards. Cards are saved automatically when you opt-in during checkout.
          </p>
        ) : (
          <div className="space-y-2">
            {methods.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-[#1a2f2e] rounded-md px-3 py-2 border border-white/5">
                <p className="text-sm text-cream">
                  {m.brand ?? 'Card'} •••• {m.last4}
                  {m.expMonth && m.expYear && <span className="text-gray-500 ml-2 text-xs">exp {m.expMonth}/{String(m.expYear).slice(-2)}</span>}
                  {m.isDefault && <span className="ml-2 text-[10px] bg-[#6BB8B2]/20 text-[#6BB8B2] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">default</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
      />
    </div>
  )
}

function ReferenceImages() {
  const [images, setImages] = useState<ReferenceImage[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/reference-images')
    const json = (await res.json()) as { data?: { images: ReferenceImage[] } }
    setImages(json.data?.images ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function upload(list: FileList | null) {
    if (!list?.length) return
    setError(null)
    setBusy(true)
    const slotsLeft = MAX_REFS - images.length
    const queue = Array.from(list).slice(0, slotsLeft)
    for (const file of queue) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/account/reference-images', { method: 'POST', body: form })
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
        setError(j?.error?.message ?? 'Upload failed.')
        break
      }
    }
    if (inputRef.current) inputRef.current.value = ''
    setBusy(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Remove this reference image?')) return
    await fetch(`/api/account/files/${id}`, { method: 'DELETE' })
    load()
  }

  const remaining = MAX_REFS - images.length
  const belowMin = !loading && images.length < MIN_REFS
  const atMax = images.length >= MAX_REFS

  return (
    <div className="bg-[#243B39] border border-white/5 rounded-xl p-5 mb-5">
      <div className="flex items-start justify-between mb-1">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Reference images</p>
        <span className="text-[10px] text-gray-500 font-mono">{images.length} / {MAX_REFS}</span>
      </div>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Logos, brand assets, or design references Zach should keep on hand. Add {MIN_REFS}–{MAX_REFS} images. JPG, PNG, WEBP, GIF, or SVG, up to 10 MB each.
      </p>

      {loading ? (
        <p className="text-gray-500 text-xs">Loading…</p>
      ) : (
        <>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {images.map(img => (
                <div key={img.id} className="relative group aspect-square bg-[#1a2f2e] border border-white/5 rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  <button
                    onClick={() => remove(img.id)}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[11px] text-red-300 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy || atMax}
              className="px-3 h-8 bg-[#6BB8B2]/15 hover:bg-[#6BB8B2]/25 disabled:opacity-40 disabled:cursor-not-allowed text-[#6BB8B2] text-xs font-semibold rounded-md border border-[#6BB8B2]/30"
            >
              {busy ? 'Uploading…' : atMax ? 'Limit reached' : `Add image${remaining > 1 ? 's' : ''}`}
            </button>
            {belowMin && images.length === 0 && (
              <span className="text-[11px] text-gray-500">Recommended: at least {MIN_REFS}.</span>
            )}
            {belowMin && images.length > 0 && (
              <span className="text-[11px] text-gray-500">Add {MIN_REFS - images.length} more to hit the recommended minimum.</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={e => upload(e.target.files)}
          />
          {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}
        </>
      )}
    </div>
  )
}
