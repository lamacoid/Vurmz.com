'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './icons'

// Marketplace-style listing form (modeled on the Facebook Marketplace
// "Item for sale" flow): photo first, a small labeled Required set, a live
// preview of the listing as it will appear, and every technical field
// tucked into one collapsed "More details" section with working defaults.
// The draft shape and save payload are unchanged from the old spec-sheet
// form, so the API and both /new and /[id] pages work as before.

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
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function ProductForm({ initial }: { initial: ProductDraft }) {
  const router = useRouter()
  const [draft, setDraft] = useState<ProductDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [priceStr, setPriceStr] = useState(initial.priceCents ? centsToDollars(initial.priceCents) : '')
  const [moreOpen, setMoreOpen] = useState(false)
  // Gallery: ordered media ids; the first one is the main photo (heroMediaId).
  const [imageIds, setImageIds] = useState<string[]>(initial.heroMediaId ? [initial.heroMediaId] : [])
  // Additional pack-size options ("Pack of 15 at $60"), edited as strings.
  const [variantRows, setVariantRows] = useState<Array<{ name: string; packStr: string; priceStr: string }>>([])
  // Slug is set automatically from the title while creating, until it's
  // edited by hand in More details. Existing products never auto-change
  // (their URL may be live).
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id))

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(j => {
      const parsed = j as { data?: { categories: Category[] } }
      setCategories(parsed.data?.categories ?? [])
    })
    fetch('/api/admin/media?limit=500').then(r => r.json()).then(j => {
      const parsed = j as { data?: { items: MediaItem[] } }
      setMedia(parsed.data?.items ?? [])
    })
    // Existing products: load their saved gallery and pack options.
    if (initial.id) {
      fetch(`/api/admin/products/${initial.id}`).then(r => r.json()).then(j => {
        const parsed = j as { data?: { variants?: Array<{ name: string; packSize: number; priceCents: number }>; images?: Array<{ mediaId: string }> } }
        const imgs = parsed.data?.images ?? []
        if (imgs.length > 0) setImageIds(imgs.map(i => i.mediaId))
        setVariantRows(
          (parsed.data?.variants ?? []).map(v => ({
            name: v.name,
            packStr: String(v.packSize),
            priceStr: centsToDollars(v.priceCents),
          }))
        )
      })
    }
  }, [initial.heroMediaId, initial.id])

  function field<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  function setName(v: string) {
    setDraft(prev => ({ ...prev, name: v, slug: slugTouched ? prev.slug : slugify(v) }))
  }

  const priceCents = dollarsToCents(priceStr)
  const mediaById = useMemo(() => new Map(media.map(m => [m.id, m])), [media])
  const heroMedia = imageIds.length > 0 ? mediaById.get(imageIds[0]) ?? null : null
  // The unit price ties price and pack size together: change one, the other
  // recalculates through it, and it prefills new pack-size options.
  const unitCents = draft.packSize > 0 ? priceCents / draft.packSize : priceCents

  function onPackSizeChange(newPack: number) {
    const prevPack = draft.packSize
    const cents = dollarsToCents(priceStr)
    field('packSize', newPack)
    if (cents > 0 && prevPack > 0 && newPack > 0 && newPack !== prevPack) {
      setPriceStr(centsToDollars(Math.round((cents / prevPack) * newPack)))
    }
  }

  const missing: string[] = []
  if (!draft.name.trim()) missing.push('a title')
  if (priceCents <= 0) missing.push('a price')
  const readyToPublish = missing.length === 0

  const categoryName = useMemo(
    () => categories.find(c => c.id === draft.categoryId)?.name ?? null,
    [categories, draft.categoryId]
  )

  async function save(publish: boolean | null) {
    setSaving(true)
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      priceCents,
      heroMediaId: imageIds[0] ?? null,
      imageIds,
      variants: draft.oneOff
        ? []
        : variantRows
            .map(r => {
              const packSize = parseInt(r.packStr, 10) || 0
              const cents = dollarsToCents(r.priceStr)
              return { name: r.name.trim() || `Pack of ${packSize}`, packSize, priceCents: cents }
            })
            .filter(v => v.packSize > 0 && v.priceCents > 0),
      ...(publish === null ? {} : { isPublished: publish }),
    }
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
      if (publish !== null) field('isPublished', publish)
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
    if (!confirm('Delete this listing? It can be restored within 30 days.')) return
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
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">{draft.id ? (draft.name || 'Edit listing') : 'New listing'}</h1>
        </div>
        {draft.id && (
          <p className={`text-xs font-semibold ${draft.isPublished ? 'text-[var(--a-accent)]' : 'text-amber-300'}`}>
            {draft.isPublished ? '● Live on the site' : '● Hidden, only you can see it'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ── The form (photo first, then the required basics) ── */}
        <div className="space-y-4">
          {/* Photos: multiple slots, first one is the main photo everywhere. */}
          {imageIds.length > 0 ? (
            <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
              <div className="flex flex-wrap gap-3">
                {imageIds.map((id, i) => {
                  const m = mediaById.get(id)
                  return (
                    <div key={id} className="w-24">
                      <div className="relative w-24 h-24 bg-[var(--a-bg)] rounded-lg overflow-hidden border border-[var(--a-line)]">
                        {m ? <img src={m.url} alt={m.altText} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                        {i === 0 && (
                          <span className="absolute top-1 left-1 text-[9px] font-semibold uppercase tracking-wide bg-[var(--a-accent)] text-black rounded px-1.5 py-px">Main</span>
                        )}
                        <button
                          onClick={() => setImageIds(prev => prev.filter(x => x !== id))}
                          aria-label="Remove photo"
                          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 hover:bg-black/80 rounded text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-center gap-1 mt-1">
                        <button
                          onClick={() => setImageIds(prev => { const a = [...prev]; if (i > 0) { [a[i-1], a[i]] = [a[i], a[i-1]] } return a })}
                          disabled={i === 0}
                          aria-label="Move left"
                          className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[var(--a-ink)]"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setImageIds(prev => { const a = [...prev]; if (i < a.length - 1) { [a[i+1], a[i]] = [a[i], a[i+1]] } return a })}
                          disabled={i === imageIds.length - 1}
                          aria-label="Move right"
                          className="px-2 py-0.5 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[var(--a-ink)]"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  )
                })}
                {imageIds.length < 12 && (
                  <button
                    onClick={() => setMediaPickerOpen(true)}
                    className="w-24 h-24 border-2 border-dashed border-[var(--a-line)] hover:border-[var(--a-accent)]/50 rounded-lg flex flex-col items-center justify-center text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] transition-colors"
                  >
                    <Icon name="image" className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium">Add</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[var(--a-ink-faint)] mt-2">The first photo is the main one. Use the arrows to reorder.</p>
            </div>
          ) : (
            <button
              onClick={() => setMediaPickerOpen(true)}
              className="w-full h-36 border-2 border-dashed border-[var(--a-line)] hover:border-[var(--a-accent)]/50 rounded-xl flex flex-col items-center justify-center text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] transition-colors bg-[var(--a-panel)]/40"
            >
              <Icon name="image" className="w-7 h-7 mb-1.5" />
              <span className="text-sm font-medium">Add photos</span>
              <span className="text-[11px] mt-0.5">Listings with photos sell. Add as many angles as you have.</span>
            </button>
          )}

          {/* Required */}
          <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] font-semibold">Required</p>
              <p className="text-[11px] text-[var(--a-ink-faint)]">Title, price, and where it shows. That&apos;s it.</p>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Title</label>
              <input
                value={draft.name}
                onChange={e => setName(e.target.value)}
                placeholder="Slate Coasters (Set of 4)"
                className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Price</label>
                <div className="flex items-center bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md focus-within:border-[var(--a-accent)]">
                  <span className="pl-3 text-[var(--a-ink-faint)] text-sm">$</span>
                  <input
                    value={priceStr}
                    onChange={e => setPriceStr(e.target.value)}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="flex-1 min-w-0 bg-transparent px-2 py-2.5 text-sm text-[var(--a-ink)] outline-none"
                  />
                </div>
                {draft.packSize > 1 && priceCents > 0 && (
                  <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">
                    This is the price for the whole pack. <span className="text-[var(--a-accent)] font-semibold">${(unitCents / 100).toFixed(2)} each</span>
                  </p>
                )}
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Category</label>
                <select
                  value={draft.categoryId ?? ''}
                  onChange={e => field('categoryId', e.target.value || null)}
                  className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                >
                  <option value="">No category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1.5">Where it shows</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['shop','services','both'] as const).map(a => {
                  const active = draft.audience === a
                  const labels: Record<typeof a, string> = { shop: 'Shop', services: 'Business page', both: 'Both' }
                  return (
                    <button
                      key={a}
                      onClick={() => field('audience', a)}
                      className={`h-9 text-xs font-semibold rounded-md border transition-colors ${
                        active
                          ? 'bg-[var(--a-accent)]/20 border-[var(--a-accent)] text-[var(--a-accent)]'
                          : 'bg-white/5 border-[var(--a-line)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]'
                      }`}
                    >
                      {labels[a]}
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-[var(--a-ink-faint)] mt-1.5">
                Shop is the public store for individuals. Business page is where bulk buyers look.
              </p>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Description</label>
              <textarea
                value={draft.description}
                onChange={e => field('description', e.target.value)}
                rows={5}
                placeholder="What it is, what you engrave on it, what makes it worth having."
                className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
              />
            </div>
          </div>

          {/* More details (collapsed) */}
          <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl">
            <button
              onClick={() => setMoreOpen(o => !o)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--a-ink)]">More details</p>
                <p className="text-[11px] text-[var(--a-ink-faint)]">Packs, one-offs, turnaround, shipping weight. All optional, all have working defaults.</p>
              </div>
              <Icon name="chevron" className={`w-4 h-4 text-[var(--a-ink-faint)] transition-transform ${moreOpen ? 'rotate-90' : ''}`} />
            </button>
            {moreOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-[var(--a-line)] pt-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Card one-liner</label>
                  <input
                    value={draft.shortDescription}
                    onChange={e => field('shortDescription', e.target.value)}
                    placeholder="Short line shown on the shop grid (about 80 characters)."
                    className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Pack size</label>
                    <input
                      type="number"
                      min={1}
                      value={draft.oneOff ? 1 : draft.packSize}
                      disabled={draft.oneOff}
                      onChange={e => onPackSizeChange(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)] disabled:opacity-50"
                    />
                    <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">{draft.oneOff ? 'One-off, locked to 1.' : 'Changing this recalculates the price from the per-item rate.'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Shipping weight (grams)</label>
                    <input
                      type="number"
                      min={0}
                      value={draft.weightGrams}
                      onChange={e => field('weightGrams', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                    />
                    <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">Only matters if it ships. 0 is fine for local.</p>
                  </div>
                </div>

                {/* More pack sizes: one listing, several quantities. */}
                {!draft.oneOff && (
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">More pack sizes</label>
                    <p className="text-[10px] text-[var(--a-ink-faint)] mb-2">
                      Sell the same thing in more than one quantity. The customer picks the size on the product page.
                      New sizes price themselves from the per-item rate; change the price if you want to reward bigger packs.
                    </p>
                    <div className="space-y-2">
                      {variantRows.map((row, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={row.packStr}
                            placeholder="Qty"
                            onChange={e => {
                              const packStr = e.target.value
                              const pack = parseInt(packStr, 10) || 0
                              setVariantRows(prev => prev.map((r, j) => j === i
                                ? {
                                    packStr,
                                    name: !r.name || /^Pack of \d+$/.test(r.name) ? (pack > 0 ? `Pack of ${pack}` : '') : r.name,
                                    priceStr: r.priceStr === '' && pack > 0 && unitCents > 0 ? centsToDollars(Math.round(unitCents * pack)) : r.priceStr,
                                  }
                                : r))
                            }}
                            className="w-20 bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-2 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                          />
                          <input
                            value={row.name}
                            placeholder={row.packStr ? `Pack of ${row.packStr}` : 'Name'}
                            onChange={e => setVariantRows(prev => prev.map((r, j) => j === i ? { ...r, name: e.target.value } : r))}
                            className="flex-1 min-w-0 bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-2 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                          />
                          <div className="flex items-center bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md focus-within:border-[var(--a-accent)] w-28">
                            <span className="pl-2 text-[var(--a-ink-faint)] text-sm">$</span>
                            <input
                              value={row.priceStr}
                              placeholder="0.00"
                              inputMode="decimal"
                              onChange={e => setVariantRows(prev => prev.map((r, j) => j === i ? { ...r, priceStr: e.target.value } : r))}
                              className="flex-1 min-w-0 bg-transparent px-1 py-2 text-sm text-[var(--a-ink)] outline-none"
                            />
                          </div>
                          <button
                            onClick={() => setVariantRows(prev => prev.filter((_, j) => j !== i))}
                            aria-label="Remove pack size"
                            className="px-2 py-2 text-xs text-red-300 hover:text-red-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    {variantRows.length < 8 && (
                      <button
                        onClick={() => setVariantRows(prev => [...prev, { name: '', packStr: '', priceStr: '' }])}
                        className="mt-2 text-xs px-3 h-8 bg-white/5 hover:bg-white/10 rounded-md text-[var(--a-ink)] border border-[var(--a-line)]"
                      >
                        + Add a pack size
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5">
                    <input type="checkbox" checked={draft.madeToOrder} onChange={e => field('madeToOrder', e.target.checked)} />
                    <span className="text-sm text-[var(--a-ink)]">Made to order</span>
                  </label>
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={draft.leadTimeDays}
                      onChange={e => field('leadTimeDays', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
                    />
                    <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">Days to make it.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={draft.oneOff}
                      onChange={e => {
                        const v = e.target.checked
                        setDraft(prev => ({ ...prev, oneOff: v, packSize: v ? 1 : prev.packSize }))
                      }}
                    />
                    <span className="text-sm text-[var(--a-ink)]">One-off: only one exists</span>
                  </label>
                  {draft.oneOff && (
                    <p className="text-[10px] text-[var(--a-ink-faint)] leading-snug">
                      The shop hides it automatically the moment it sells.
                    </p>
                  )}
                  {draft.oneOff && draft.id && (
                    draft.soldAt ? (
                      <div className="flex items-center justify-between bg-[var(--a-cta)]/15 border border-[var(--a-cta)]/30 rounded-md px-3 py-2">
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
                          if (!confirm('Mark this one-off as sold? It disappears from the shop.')) return
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
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Web address</label>
                  <div className="flex items-center bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md focus-within:border-[var(--a-accent)]">
                    <span className="pl-3 text-[var(--a-ink-faint)] text-xs whitespace-nowrap">vurmz.com/shop/p/</span>
                    <input
                      value={draft.slug}
                      onChange={e => { setSlugTouched(true); field('slug', slugify(e.target.value)) }}
                      className="flex-1 min-w-0 bg-transparent px-1 py-2 text-sm text-[var(--a-ink)] outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">Set automatically from the title. Only change it if you have a reason.</p>
                </div>

                {draft.id && (
                  <button
                    onClick={remove}
                    disabled={deleting}
                    className="text-xs text-red-300 hover:text-red-200"
                  >
                    {deleting ? 'Deleting…' : 'Delete this listing'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Actions: the words say exactly what happens */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {draft.isPublished && draft.id ? (
                <>
                  <button
                    onClick={() => save(null)}
                    disabled={saving || !readyToPublish}
                    className="px-5 h-10 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  <button
                    onClick={() => save(false)}
                    disabled={saving}
                    className="px-4 h-10 bg-white/5 hover:bg-white/10 text-[var(--a-ink)] text-sm font-semibold rounded-md border border-[var(--a-line)]"
                  >
                    Hide from site
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => save(true)}
                    disabled={saving || !readyToPublish}
                    className="px-5 h-10 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md"
                  >
                    {saving ? 'Publishing…' : 'Publish'}
                  </button>
                  <button
                    onClick={() => save(false)}
                    disabled={saving || !draft.name.trim()}
                    className="px-4 h-10 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[var(--a-ink)] text-sm font-semibold rounded-md border border-[var(--a-line)]"
                  >
                    Save as draft
                  </button>
                </>
              )}
            </div>
            {!readyToPublish && (
              <p className="text-[11px] text-[var(--a-ink-faint)]">
                Add {missing.join(' and ')} to publish. A draft only needs a title.
              </p>
            )}
          </div>
        </div>

        {/* ── Live preview: how the listing looks to a customer ── */}
        <div className="lg:sticky lg:top-6">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] font-semibold mb-2">Preview</p>
          <div className="rounded-xl overflow-hidden border border-[var(--a-line)] bg-[#DED6C3] text-[#16525C]">
            <div className="aspect-square bg-[#FFFDF8] flex items-center justify-center overflow-hidden">
              {heroMedia ? (
                <img src={heroMedia.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-mono text-[#4F5D5B]">Photo coming soon</span>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold leading-snug">{draft.name || 'Listing title'}</p>
              <p className="text-sm text-[#4F5D5B] mt-1 leading-relaxed">
                {draft.shortDescription || (draft.description ? draft.description.slice(0, 90) + (draft.description.length > 90 ? '…' : '') : 'Description will appear here.')}
              </p>
              <p className="font-bold mt-2">
                {priceCents > 0 ? `$${centsToDollars(priceCents)}` : 'Price'}
                {draft.packSize > 1 && !draft.oneOff && <span className="font-normal text-sm text-[#4F5D5B]"> · pack of {draft.packSize}</span>}
              </p>
              {categoryName && <p className="text-[11px] text-[#4F5D5B] mt-1">in {categoryName}</p>}
            </div>
          </div>
          <p className="text-[11px] text-[var(--a-ink-faint)] mt-2 leading-snug">
            How it looks in the {draft.audience === 'services' ? 'business catalog' : 'shop'}.{' '}
            {draft.id && !draft.isPublished ? 'Hidden right now, customers cannot see it.' : ''}
          </p>
        </div>
      </div>

      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setMediaPickerOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--a-line)]">
              <p className="text-sm font-semibold text-[var(--a-ink)]">Choose a photo</p>
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
                      onClick={() => {
                        setImageIds(prev => (prev.includes(m.id) ? prev : [...prev, m.id]))
                        setMediaPickerOpen(false)
                      }}
                      className="aspect-square bg-[var(--a-panel)] border border-[var(--a-line)] hover:border-[var(--a-accent)]/40 rounded-lg overflow-hidden"
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
