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
  const [saveError, setSaveError] = useState<string | null>(null)

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
    setSaveError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          company: customer.company,
        }),
      })
      if (!res.ok) {
        setSaveError('Could not save your profile. Check the fields and try again.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } catch {
      setSaveError('Network error — your profile was not saved.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !customer) return <div className="p-10 text-center text-[var(--ink-soft)] text-sm">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-6">Profile</h1>

      <div className="bg-[var(--page)] border border-white/5 rounded-xl p-5 space-y-4 mb-5">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Email</label>
          <p className="text-sm text-[var(--ink)]">{customer.email}</p>
          <p className="text-[10px] text-gray-600">Email can&rsquo;t be changed. Contact Zach if you need to update.</p>
        </div>
        <Field label="Name" value={customer.name} onChange={v => setCustomer({ ...customer, name: v })} />
        <Field label="Phone" value={customer.phone ?? ''} onChange={v => setCustomer({ ...customer, phone: v })} />
        <Field label="Company" value={customer.company ?? ''} onChange={v => setCustomer({ ...customer, company: v })} />
        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} disabled={saving} className="px-4 h-9 bg-[#C67A6F] hover:bg-[#B0675D] text-white text-sm font-semibold rounded-md">
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-xs text-[#7FCFD4]">Saved ✓</span>}
          {saveError && <span className="text-xs text-red-400">{saveError}</span>}
        </div>
      </div>

      <Addresses />

      <ReferenceImages />

      <div className="bg-[var(--page)] border border-white/5 rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-3 font-semibold">Saved payment methods</p>
        {methods.length === 0 ? (
          <p className="text-xs text-[var(--ink-soft)]">
            You haven&rsquo;t saved any cards. Cards are saved automatically when you opt-in during checkout.
          </p>
        ) : (
          <div className="space-y-2">
            {methods.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-[var(--page)] rounded-md px-3 py-2 border border-white/5">
                <p className="text-sm text-[var(--ink)]">
                  {m.brand ?? 'Card'} •••• {m.last4}
                  {m.expMonth && m.expYear && <span className="text-[var(--ink-soft)] ml-2 text-xs">exp {m.expMonth}/{String(m.expYear).slice(-2)}</span>}
                  {m.isDefault && <span className="ml-2 text-[10px] bg-[#7FCFD4]/20 text-[#7FCFD4] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">default</span>}
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
      <label className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[var(--page)] border border-white/5 rounded-md px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#7FCFD4]"
      />
    </div>
  )
}

interface Address {
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

type AddressDraft = Omit<Address, 'id' | 'isDefault'>

const emptyDraft: AddressDraft = {
  label: 'Home', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US', phone: '',
}

function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/addresses')
    const json = (await res.json()) as { data?: { addresses: Address[] } }
    setAddresses(json.data?.addresses ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function startAdd() {
    setError(null)
    setEditingId(null)
    setDraft(emptyDraft)
    setAdding(true)
  }

  function startEdit(a: Address) {
    setError(null)
    setAdding(false)
    setEditingId(a.id)
    setDraft({
      label: a.label, line1: a.line1, line2: a.line2 ?? '',
      city: a.city, state: a.state, postalCode: a.postalCode,
      country: a.country, phone: a.phone ?? '',
    })
  }

  function cancel() {
    setAdding(false)
    setEditingId(null)
    setError(null)
  }

  async function save() {
    setError(null)
    if (!draft.line1.trim() || !draft.city.trim() || !draft.state.trim() || !draft.postalCode.trim()) {
      setError('Street, city, state, and ZIP are required.')
      return
    }
    setBusy(true)
    const payload = {
      label: draft.label.trim() || 'Address',
      line1: draft.line1.trim(),
      line2: (draft.line2 ?? '').trim() || null,
      city: draft.city.trim(),
      state: draft.state.trim(),
      postalCode: draft.postalCode.trim(),
      country: (draft.country || 'US').toUpperCase(),
      phone: (draft.phone ?? '').trim() || null,
    }
    const url = editingId ? `/api/account/addresses/${editingId}` : '/api/account/addresses'
    const method = editingId ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setBusy(false)
    if (!res.ok) { setError('Could not save address. Check the fields and try again.'); return }
    setAdding(false)
    setEditingId(null)
    load()
  }

  async function setDefault(id: string) {
    await fetch(`/api/account/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    })
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this address?')) return
    await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="bg-[var(--page)] border border-white/5 rounded-xl p-5 mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Shipping addresses</p>
        {!adding && !editingId && (
          <button onClick={startAdd} className="text-xs text-[#7FCFD4] hover:underline">+ Add address</button>
        )}
      </div>

      {loading ? (
        <p className="text-[var(--ink-soft)] text-xs">Loading…</p>
      ) : (
        <>
          {addresses.length === 0 && !adding && (
            <p className="text-xs text-[var(--ink-soft)]">No saved addresses yet.</p>
          )}

          <div className="space-y-2">
            {addresses.map(a => (
              editingId === a.id ? (
                <AddressForm
                  key={a.id}
                  draft={draft}
                  setDraft={setDraft}
                  onCancel={cancel}
                  onSave={save}
                  busy={busy}
                  error={error}
                  saveLabel="Save"
                />
              ) : (
                <div key={a.id} className="bg-[var(--page)] rounded-md px-3 py-3 border border-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--ink)] font-semibold">
                        {a.label}
                        {a.isDefault && <span className="ml-2 text-[10px] bg-[#7FCFD4]/20 text-[#7FCFD4] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">default</span>}
                      </p>
                      <p className="text-xs text-[var(--ink-soft)] mt-1 leading-relaxed">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                        {a.city}, {a.state} {a.postalCode}{a.country && a.country !== 'US' ? ` · ${a.country}` : ''}
                        {a.phone && <><br />{a.phone}</>}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 text-[11px]">
                      {!a.isDefault && (
                        <button onClick={() => setDefault(a.id)} className="text-[#7FCFD4] hover:underline">Set default</button>
                      )}
                      <button onClick={() => startEdit(a)} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">Edit</button>
                      <button onClick={() => remove(a.id)} className="text-[var(--ink-soft)] hover:text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {adding && (
            <div className="mt-2">
              <AddressForm
                draft={draft}
                setDraft={setDraft}
                onCancel={cancel}
                onSave={save}
                busy={busy}
                error={error}
                saveLabel="Add address"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AddressForm({
  draft, setDraft, onCancel, onSave, busy, error, saveLabel,
}: {
  draft: AddressDraft
  setDraft: (d: AddressDraft) => void
  onCancel: () => void
  onSave: () => void
  busy: boolean
  error: string | null
  saveLabel: string
}) {
  const upd = (patch: Partial<AddressDraft>) => setDraft({ ...draft, ...patch })
  return (
    <div className="bg-[var(--page)] rounded-md p-3 border border-[#7FCFD4]/20 space-y-3">
      <FormField label="Label" value={draft.label} onChange={v => upd({ label: v })} />
      <FormField label="Street address" value={draft.line1} onChange={v => upd({ line1: v })} />
      <FormField label="Apt / Suite (optional)" value={draft.line2 ?? ''} onChange={v => upd({ line2: v })} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" value={draft.city} onChange={v => upd({ city: v })} />
        <FormField label="State" value={draft.state} onChange={v => upd({ state: v })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="ZIP" value={draft.postalCode} onChange={v => upd({ postalCode: v })} />
        <FormField label="Country" value={draft.country} onChange={v => upd({ country: v.toUpperCase().slice(0, 2) })} />
      </div>
      <FormField label="Phone (optional)" value={draft.phone ?? ''} onChange={v => upd({ phone: v })} />
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      <div className="flex items-center gap-2 pt-1">
        <button onClick={onSave} disabled={busy} className="px-3 h-8 bg-[#C67A6F] hover:bg-[#B0675D] disabled:opacity-60 text-white text-xs font-semibold rounded-md">
          {busy ? 'Saving…' : saveLabel}
        </button>
        <button onClick={onCancel} disabled={busy} className="px-3 h-8 text-[var(--ink-soft)] hover:text-[var(--ink)] text-xs">
          Cancel
        </button>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[var(--page)] border border-white/5 rounded-md px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[#7FCFD4]"
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
    <div className="bg-[var(--page)] border border-white/5 rounded-xl p-5 mb-5">
      <div className="flex items-start justify-between mb-1">
        <p className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Reference images</p>
        <span className="text-[10px] text-[var(--ink-soft)] font-mono">{images.length} / {MAX_REFS}</span>
      </div>
      <p className="text-xs text-[var(--ink-soft)] mb-4 leading-relaxed">
        Logos, brand assets, or design references Zach should keep on hand. Add {MIN_REFS}–{MAX_REFS} images. JPG, PNG, WEBP, GIF, or SVG, up to 10 MB each.
      </p>

      {loading ? (
        <p className="text-[var(--ink-soft)] text-xs">Loading…</p>
      ) : (
        <>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {images.map(img => (
                <div key={img.id} className="relative group aspect-square bg-[var(--page)] border border-white/5 rounded-md overflow-hidden">
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
              className="px-3 h-8 bg-[#7FCFD4]/15 hover:bg-[#7FCFD4]/25 disabled:opacity-40 disabled:cursor-not-allowed text-[#7FCFD4] text-xs font-semibold rounded-md border border-[#7FCFD4]/30"
            >
              {busy ? 'Uploading…' : atMax ? 'Limit reached' : `Add image${remaining > 1 ? 's' : ''}`}
            </button>
            {belowMin && images.length === 0 && (
              <span className="text-[11px] text-[var(--ink-soft)]">Recommended: at least {MIN_REFS}.</span>
            )}
            {belowMin && images.length > 0 && (
              <span className="text-[11px] text-[var(--ink-soft)]">Add {MIN_REFS - images.length} more to hit the recommended minimum.</span>
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
