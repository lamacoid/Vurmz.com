'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './icons'

export interface ProductDraft {
  id?: string
  slug: string
  name: string
  shortDescription: string
  description: string
  categoryId: string | null
  audience: 'shop' | 'services' | 'both'
  priceCents: number
  packSize: number
  isPublished: boolean
  madeToOrder: boolean
  leadTimeDays: number
  weightGrams: number
  heroMediaId: string | null
  oneOff: boolean
  soldAt?: string | null
  metadata: Record<string, unknown>
}

interface Category { id: string; slug: string; name: string }
interface MediaItem { id: string; url: string; altText: string; filename: string }

function centsToDollars(cents: number) { return (cents / 100).toFixed(2) }
function dollarsToCents(d: string) {
  const n = parseFloat(d.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export default function ProductForm({ initial }: { initial: ProductDraft }) {
  const router = useRouter()
  const [draft, setDraft] = useState<ProductDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [heroMedia, setHeroMedia] = useState<MediaItem | null>(null)
  const [priceStr, setPriceStr] = useState(centsToDollars(initial.priceCents))

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(j => {
      const parsed = j as { data?: { categories: Category[] } }
      setCategories(parsed.data?.categories ?? [])
    })
    fetch('/api/admin/media?limit=500').then(r => r.json()).then(j => {
      const parsed = j as { data?: { items: MediaItem[] } }
      const items = parsed.data?.items ?? []
      setMedia(items)
      if (initial.heroMediaId) {
        const h = items.find(m => m.id === initial.heroMediaId)
        if (h) setHeroMedia(h)
      }
    })
  }, [initial.heroMediaId])

  function field<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    setSaving(true)
    const payload = { ...draft, priceCents: dollarsToCents(priceStr) }
    try {
      const url = draft.id ? `/api/admin/products/${draft.id}` : '/api/admin/products'
      const method = draft.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as { ok?: boolean; data?: { product?: { id: string } }; error?: { details?: unknown } }
      if (!res.ok || !json.ok) {
        alert('Save failed: ' + JSON.stringify(json.error ?? {}, null, 2))
        setSaving(false)
        return
      }
      if (!draft.id && json.data?.product?.id) {
        router.replace(`/admin/products/${json.data.product.id}`)
      }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!draft.id) return
    if (!confirm('Delete this product? Can be restored within 30 days.')) return
    setDeleting(true)
    await fetch(`/api/admin/products/${draft.id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push('/admin/products')} className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] mb-1 flex items-center gap-1">
            <Icon name="chevron" className="w-3 h-3 rotate-180" /> Products
          </button>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">{draft.name || 'New product'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {draft.id && (
            <button
              onClick={remove}
              disabled={deleting}
              className="px-3 h-9 text-xs text-red-300 bg-red-900/20 hover:bg-red-900/40 rounded-md border border-red-900/40"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !draft.name || !draft.slug}
            className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <Section title="Basics">
            <FieldText label="Name" value={draft.name} onChange={v => field('name', v)} placeholder="Branded Pen Pack (15)" />
            <FieldText
              label="Slug"
              value={draft.slug}
              onChange={v => field('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="branded-pen-pack"
              hint="URL path: vurmz.com/shop/{category}/{slug}"
            />
            <FieldText
              label="Short description"
              value={draft.shortDescription}
              onChange={v => field('shortDescription', v)}
              placeholder="One-liner shown on product cards."
              hint="About 80 characters. Shown on shop grid."
            />
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Full description</label>
              <textarea
                value={draft.description}
                onChange={e => field('description', e.target.value)}
                rows={6}
                placeholder="Markdown supported. Details, specs, what's included…"
                className="w-full bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
              />
            </div>
          </Section>

          <Section title="Pricing & pack">
            <div className="grid grid-cols-2 gap-3">
              <FieldText label="Price" value={priceStr} onChange={setPriceStr} prefix="$" hint={draft.oneOff ? 'Price for the single item.' : 'Pack price, not per-item.'} />
              <FieldNum
                label="Pack size"
                value={draft.oneOff ? 1 : draft.packSize}
                onChange={v => field('packSize', v)}
                min={1}
                hint={draft.oneOff ? 'One-off — locked to 1.' : 'Units per pack.'}
              />
            </div>
          </Section>

          <Section title="One-off / unique item">
            <label className="flex items-center gap-2 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2.5">
              <input
                type="checkbox"
                checked={draft.oneOff}
                onChange={e => {
                  const v = e.target.checked
                  setDraft(prev => ({ ...prev, oneOff: v, packSize: v ? 1 : prev.packSize }))
                }}
              />
              <span className="text-sm text-[var(--a-ink)]">This is a one-off — only one exists.</span>
            </label>
            {draft.oneOff && (
              <p className="text-[10px] text-[var(--a-ink-faint)] leading-snug">
                Pack size is forced to 1. The shop will hide this item automatically once it sells.
              </p>
            )}
            {draft.oneOff && draft.id && (
              draft.soldAt ? (
                <div className="flex items-center justify-between bg-[#C46B4D]/15 border border-[#C46B4D]/30 rounded-md px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-[var(--a-cta)]">Sold</p>
                    <p className="text-[10px] text-[var(--a-ink-soft)]">on {new Date(draft.soldAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm('Mark this item as available again?')) return
                      await fetch(`/api/admin/products/${draft.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sold: false, isPublished: true }),
                      })
                      setDraft(prev => ({ ...prev, soldAt: null, isPublished: true }))
                    }}
                    className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink)]"
                  >
                    Un-sell
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    if (!confirm('Mark this one-off as sold? It will be hidden from the shop.')) return
                    await fetch(`/api/admin/products/${draft.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ sold: true }),
                    })
                    setDraft(prev => ({ ...prev, soldAt: new Date().toISOString(), isPublished: false }))
                  }}
                  className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink)]"
                >
                  Mark sold
                </button>
              )
            )}
          </Section>

          <Section title="Fulfillment">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2.5">
                <input type="checkbox" checked={draft.madeToOrder} onChange={e => field('madeToOrder', e.target.checked)} />
                <span className="text-sm text-[var(--a-ink)]">Made to order</span>
              </label>
              <FieldNum label="Lead time (days)" value={draft.leadTimeDays} onChange={v => field('leadTimeDays', v)} min={0} />
            </div>
            <FieldNum label="Shipping weight (grams)" value={draft.weightGrams} onChange={v => field('weightGrams', v)} min={0} hint="Used for shipping rate calculation." />
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Section title="Status">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.isPublished} onChange={e => field('isPublished', e.target.checked)} />
              <span className="text-sm text-[var(--a-ink)]">Published (visible on the site)</span>
            </label>
          </Section>

          <Section title="Show on">
            <div className="grid grid-cols-3 gap-1.5">
              {(['shop','services','both'] as const).map(a => {
                const active = draft.audience === a
                const labels: Record<typeof a, string> = { shop: 'Shop', services: 'Services', both: 'Both' }
                return (
                  <button
                    key={a}
                    onClick={() => field('audience', a)}
                    className={`h-8 text-xs font-semibold rounded-md border transition-colors ${
                      active
                        ? a === 'services'
                          ? 'bg-[#7FCFD4]/20 border-[#7FCFD4] text-[var(--a-accent)]'
                          : a === 'both'
                          ? 'bg-[#DED6C3]/10 border-[#DED6C3]/30 text-[#DED6C3]'
                          : 'bg-[#C46B4D]/20 border-[var(--a-cta)] text-[var(--a-cta)]'
                        : 'bg-white/5 border-[var(--a-line)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]'
                    }`}
                  >
                    {labels[a]}
                  </button>
                )
              })}
            </div>
            <p className="text-[10px] text-[var(--a-ink-faint)] mt-2 leading-snug">
              Shop = B2C public catalog. Services = B2B page. Both = shows everywhere.
            </p>
          </Section>

          <Section title="Category">
            <select
              value={draft.categoryId ?? ''}
              onChange={e => field('categoryId', e.target.value || null)}
              className="w-full bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
            >
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Section>

          <Section title="Main image">
            {heroMedia ? (
              <div>
                <div className="aspect-square w-full bg-[var(--a-bg)] rounded-lg overflow-hidden border border-[var(--a-line)]">
                  <img src={heroMedia.url} alt={heroMedia.altText} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setMediaPickerOpen(true)} className="flex-1 text-xs h-8 bg-white/5 hover:bg-white/10 rounded-md text-[var(--a-ink)]">Change</button>
                  <button onClick={() => { field('heroMediaId', null); setHeroMedia(null) }} className="flex-1 text-xs h-8 bg-white/5 hover:bg-white/10 rounded-md text-red-300">Remove</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setMediaPickerOpen(true)}
                className="w-full aspect-square border-2 border-dashed border-[var(--a-line)] hover:border-[#7FCFD4]/40 rounded-lg flex flex-col items-center justify-center text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] transition-colors"
              >
                <Icon name="image" className="w-6 h-6 mb-1" />
                <span className="text-xs">Select image</span>
              </button>
            )}
          </Section>
        </div>
      </div>

      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setMediaPickerOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--a-line)]">
              <p className="text-sm font-semibold text-[var(--a-ink)]">Choose image</p>
              <button onClick={() => setMediaPickerOpen(false)} className="p-1 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]"><Icon name="x" className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {media.length === 0 ? (
                <p className="text-sm text-[var(--a-ink-faint)] text-center py-8">No images yet. Upload some in the <a href="/admin/content/media" className="text-[var(--a-accent)] hover:underline">media library</a>.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {media.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { field('heroMediaId', m.id); setHeroMedia(m); setMediaPickerOpen(false) }}
                      className="aspect-square bg-[var(--a-panel)] border border-[var(--a-line)] hover:border-[#7FCFD4]/40 rounded-lg overflow-hidden"
                    >
                      <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function FieldText({ label, value, onChange, placeholder, prefix, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string; hint?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">{label}</label>
      <div className="flex items-center bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md focus-within:border-[#7FCFD4]">
        {prefix && <span className="pl-3 text-[var(--a-ink-faint)] text-sm">{prefix}</span>}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--a-ink)] outline-none"
        />
      </div>
      {hint && <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">{hint}</p>}
    </div>
  )
}

function FieldNum({ label, value, onChange, min, hint }: { label: string; value: number; onChange: (v: number) => void; min?: number; hint?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
      />
      {hint && <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">{hint}</p>}
    </div>
  )
}
