'use client'
/**
 * The card designer. Not a drawing tool: the customer picks a layout and a
 * colour, types into named fields, drops a logo, and watches the card. The
 * preview is the same record the laser file is written from, in the true
 * mark colour for the material. Nothing to drag, nothing to learn.
 *
 * Hands up a CardDesign (or null while blank). Autosaves to this browser.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import FontBook from '@/components/shop/FontBook'
import {
  CARD_TEMPLATES, DEFAULT_NAME_FONT, availableWidth, familyForFontValue, isBlank, previewSvg, samplePersonFor, sampleValues,
  slotLabel, templateByKey, type CardDesign, type CardMaterial, type DesignerTemplate,
} from '@/lib/designer/card'

const MIN_TEXT_MM = 2.12
const LOGO_MAX = 10 * 1024 * 1024
const LOGO_TYPES = new Set(['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'])
const LOCAL_LOGO_MAX = 300 * 1024
const TOKEN_KEY = 'vurmz:design-token'
const SAVE_DEBOUNCE_MS = 1800

interface LocalLogo { svg?: string; href?: string }

function storageKey(productId: string) { return `vurmz:design:card:${productId}` }

function blankDesign(templateKey: string, materialKey: string): CardDesign {
  return { kind: 'card', templateKey, materialKey, nameFont: DEFAULT_NAME_FONT, values: {} }
}

/** Shrink any live-text slot that runs past its room, the same rule the laser writer applies. */
function fitLiveText(root: HTMLElement, template: DesignerTemplate) {
  const texts = root.querySelectorAll<SVGTextElement>('svg text[data-slot]')
  texts.forEach(el => {
    const slot = template.slots.find(s => s.name === el.getAttribute('data-slot'))
    if (!slot || slot.kind !== 'text' || !slot.sizeMm) return
    el.setAttribute('font-size', String(slot.sizeMm))
    let w: number
    try { w = el.getBBox().width } catch { return }
    const avail = availableWidth(slot, template)
    if (w > avail && w > 0) el.setAttribute('font-size', String(Math.max(MIN_TEXT_MM, slot.sizeMm * (avail / w))))
  })
}

function Preview({ design, logo, placeholders, className, id }: { design: CardDesign; logo?: LocalLogo; placeholders?: Record<string, string>; className?: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const template = templateByKey(design.templateKey) ?? CARD_TEMPLATES[0]
  const svg = useMemo(() => previewSvg(design, { logoSvg: logo?.svg, logoHref: logo?.href, placeholders, id }), [design, logo, placeholders, id])
  useLayoutEffect(() => {
    if (!ref.current) return
    fitLiveText(ref.current, template)
    // Fonts arrive after first paint; refit once they do.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    let cancelled = false
    fonts?.ready.then(() => { if (!cancelled && ref.current) fitLiveText(ref.current, template) })
    return () => { cancelled = true }
  }, [svg, template])
  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}

export default function CardDesigner({
  productId,
  materials,
  onChange,
}: {
  productId: string
  /** The colours on offer, stocked ones first. */
  materials: CardMaterial[]
  onChange: (design: CardDesign | null) => void
}) {
  const [design, setDesign] = useState<CardDesign>(() => blankDesign(CARD_TEMPLATES[0].key, materials[0]?.key ?? 'black-matte'))
  const [logo, setLogo] = useState<LocalLogo | undefined>()
  const [logoError, setLogoError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [restored, setRestored] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'offline'>('idle')
  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState<'idle' | 'sent' | 'kept'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)
  const saveTimer = useRef<number | null>(null)

  // A saved design named in the URL (from the account's Designs list, any
  // device) wins over this browser's copy.
  useEffect(() => {
    const m = window.location.hash.match(/design=(dsg_[a-z0-9]{24})/)
    if (!m) return
    let token: string | null = null
    try { token = localStorage.getItem(TOKEN_KEY) } catch { /* no storage */ }
    fetch(`/api/designs/${m[1]}${token ? `?token=${token}` : ''}`)
      .then(r => (r.ok ? r.json() : null) as Promise<{ data?: { design: { design: CardDesign } } } | null>)
      .then(j => {
        const d = j?.data?.design.design
        if (d && d.kind === 'card' && templateByKey(d.templateKey)) {
          if (!materials.some(mm => mm.key === d.materialKey)) d.materialKey = materials[0]?.key ?? 'black-matte'
          setDesign({ ...d, id: m[1] })
          setRestored(true)
        }
      })
      .catch(() => {})
  }, [materials])

  // Restore this browser's last design for the product.
  useEffect(() => {
    if (window.location.hash.includes('design=')) return
    try {
      const raw = localStorage.getItem(storageKey(productId))
      if (raw) {
        const saved = JSON.parse(raw) as { design: CardDesign; logo?: LocalLogo }
        if (saved.design?.kind === 'card' && templateByKey(saved.design.templateKey)) {
          if (!materials.some(m => m.key === saved.design.materialKey)) saved.design.materialKey = materials[0]?.key ?? 'black-matte'
          setDesign(saved.design)
          if (saved.logo) setLogo(saved.logo)
          setRestored(!isBlank(saved.design))
        }
      }
    } catch { /* no storage, no restore */ }
  }, [productId, materials])

  // Save and hand up on every change: this browser at once, the server a
  // moment later. The server row is what lands in Zach's Designs room.
  useEffect(() => {
    onChange(isBlank(design) ? null : design)
    try {
      const small = logo && (logo.svg?.length ?? logo.href?.length ?? 0) <= LOCAL_LOGO_MAX ? logo : undefined
      localStorage.setItem(storageKey(productId), JSON.stringify({ design, logo: small }))
    } catch { /* fine */ }
    if (isBlank(design)) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(async () => {
      setSaveState('saving')
      let token: string | null = null
      try { token = localStorage.getItem(TOKEN_KEY) } catch { /* fine */ }
      try {
        const res = await fetch('/api/designs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token ?? undefined, productId, design: { ...design, id: design.id } }),
        })
        const j = (await res.json()) as { ok?: boolean; data?: { id: string; token: string | null } }
        if (!res.ok || !j.ok || !j.data) { setSaveState('offline'); return }
        if (j.data.token) { try { localStorage.setItem(TOKEN_KEY, j.data.token) } catch { /* fine */ } }
        if (j.data.id !== design.id) setDesign(d => ({ ...d, id: j.data!.id }))
        setSaveState('saved')
      } catch {
        setSaveState('offline')
      }
    }, SAVE_DEBOUNCE_MS)
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current) }
  }, [design, logo, productId, onChange])

  async function keepByEmail() {
    const e = email.trim()
    if (!e || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return
    let token: string | null = null
    try { token = localStorage.getItem(TOKEN_KEY) } catch { /* fine */ }
    if (!token) return
    setEmailState('sent')
    try {
      const res = await fetch('/api/designs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, email: e }) })
      setEmailState(res.ok ? 'kept' : 'idle')
    } catch { setEmailState('idle') }
  }

  const template = templateByKey(design.templateKey) ?? CARD_TEMPLATES[0]
  const material = materials.find(m => m.key === design.materialKey) ?? materials[0]
  const person = samplePersonFor(template.key)
  const placeholders = useMemo(() => sampleValues(template, person), [template, person])
  // Fields in the order a person thinks, not the order the template draws.
  const FIELD_ORDER = ['name', 'title', 'company', 'contact-1', 'contact-2', 'contact-3', 'url', 'tagline', 'value', 'date', 'place', 'monogram']
  const textSlots = template.slots
    .filter(s => s.kind === 'text' && !(s.name === 'monogram' && (design.logo || logo)))
    .sort((a, b) => (FIELD_ORDER.indexOf(a.name) + 1 || 99) - (FIELD_ORDER.indexOf(b.name) + 1 || 99))
  const hasEmblem = template.slots.some(s => s.name === 'emblem')

  function setValue(name: string, v: string) {
    setDesign(d => ({ ...d, values: { ...d.values, [name]: v.slice(0, 120) } }))
  }

  async function onLogoFile(file: File | null) {
    setLogoError(null)
    if (!file) return
    if (!LOGO_TYPES.has(file.type)) { setLogoError('SVG is best. PNG, JPG, or WEBP also work.'); return }
    if (file.size > LOGO_MAX) { setLogoError('Max 10 MB.'); return }
    // Local preview first, so the card responds before the upload lands.
    if (file.type === 'image/svg+xml') setLogo({ svg: await file.text() })
    else setLogo({ href: await new Promise<string>(res => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file) }) })
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/checkout/upload', { method: 'POST', body: fd })
      const json = (await res.json()) as { ok?: boolean; data?: { key?: string; filename?: string }; error?: { message?: string } }
      if (!res.ok || !json.ok || !json.data?.key) {
        setLogo(undefined)
        setLogoError(json.error?.message ?? 'Upload failed. Try again, or text me the file.')
        return
      }
      setDesign(d => ({ ...d, logo: { key: json.data!.key!, filename: json.data!.filename ?? file.name, mime: file.type } }))
    } catch {
      setLogo(undefined)
      setLogoError('Upload failed. Try again, or text me the file.')
    } finally {
      setUploading(false)
    }
  }

  function removeLogo() {
    setLogo(undefined)
    setDesign(d => { const { logo: _drop, ...rest } = d; return rest })
    if (fileRef.current) fileRef.current.value = ''
  }

  function startOver() {
    setLogo(undefined)
    setDesign(blankDesign(template.key, material?.key ?? 'black-matte'))
    setRestored(false)
  }

  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 h-9 px-3.5 rounded-[var(--r-control)] border text-[length:var(--step-row)] transition-colors duration-[var(--t-hover)] ${
      active ? 'border-[1.5px] border-[var(--signal)] bg-[var(--glass)] text-[var(--ink)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)]'
    }`

  return (
    <div className="mb-6">
      {/* The card. */}
      <div className="rounded-[var(--r-panel)] bg-[var(--page)] border border-[var(--hairline)] p-5 sm:p-8">
        <Preview id="main" design={design} logo={logo} placeholders={placeholders} className="mx-auto max-w-[520px] [&_svg]:block [&_svg]:drop-shadow-[0_10px_18px_rgba(18,63,71,0.18)]" />
        <p className="mt-4 text-center text-[length:var(--step-fine)] text-[var(--ink-soft)]">
          {template.label} on {material?.label.toLowerCase()}. The mark is the colour the laser leaves on this card.
          {restored && <> <button type="button" onClick={startOver} className="text-[var(--eyebrow)] font-semibold hover:underline">Start over</button></>}
        </p>
      </div>

      {/* Layouts. */}
      <div className="mt-6">
        <span className="block text-[length:var(--step-eyebrow)] font-mono uppercase tracking-[0.2em] text-[var(--eyebrow)] mb-3">Layout</span>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x">
          {CARD_TEMPLATES.map(t => {
            const active = t.key === template.key
            const sample: CardDesign = { ...design, templateKey: t.key, values: {}, logo: undefined }
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setDesign(d => ({ ...d, templateKey: t.key }))}
                aria-pressed={active}
                className={`snap-start flex-shrink-0 w-[132px] text-left rounded-[var(--r-tile)] p-1.5 border transition-colors duration-[var(--t-hover)] ${active ? 'border-[1.5px] border-[var(--signal)] bg-[var(--glass)]' : 'border-transparent hover:border-[var(--hairline)]'}`}
              >
                <Preview id={`t-${t.key}`} design={sample} placeholders={sampleValues(t, samplePersonFor(t.key))} className="[&_svg]:block [&_svg]:rounded-[3px]" />
                <span className={`block mt-1.5 text-[length:var(--step-fine)] ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Colour. */}
      {materials.length > 1 && (
        <div className="mt-5">
          <span className="block text-[length:var(--step-eyebrow)] font-mono uppercase tracking-[0.2em] text-[var(--eyebrow)] mb-3">Card</span>
          <div className="flex flex-wrap gap-2">
            {materials.map(m => (
              <button key={m.key} type="button" onClick={() => setDesign(d => ({ ...d, materialKey: m.key }))} aria-pressed={m.key === material?.key} className={chip(m.key === material?.key)}>
                <span aria-hidden className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: m.surface }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The words. */}
      <div className="mt-5">
        <span className="block text-[length:var(--step-eyebrow)] font-mono uppercase tracking-[0.2em] text-[var(--eyebrow)] mb-3">On the card</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {textSlots.map(slot => {
            const wide = slot.name === 'name' || slot.name === 'company' || slot.name === 'tagline'
            return (
              <label key={slot.name} className={`block ${wide ? 'sm:col-span-2' : ''}`}>
                <span className="block text-[length:var(--step-fine)] text-[var(--ink-soft)] mb-1">{slotLabel(template, slot)}</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={design.values[slot.name] ?? ''}
                    onChange={e => setValue(slot.name, e.target.value)}
                    placeholder={placeholders[slot.name] ?? ''}
                    maxLength={120}
                    className="flex-1 min-w-0 h-11 px-3.5 rounded-[var(--r-control)] border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink)] text-[length:var(--step-body)] placeholder:text-[var(--ink-soft)]/60 focus:outline-none focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal-dim)]"
                    style={slot.name === 'name' ? { fontFamily: `'${familyForFontValue(design.nameFont)}', sans-serif` } : undefined}
                  />
                </div>
                {slot.name === 'name' && (
                  <div className="mt-2">
                    <FontBook value={design.nameFont} onChange={v => setDesign(d => ({ ...d, nameFont: v }))} sampleText={design.values.name} />
                  </div>
                )}
              </label>
            )
          })}
        </div>
      </div>

      {/* The logo. */}
      {hasEmblem && (
        <div className="mt-5">
          <span className="block text-[length:var(--step-eyebrow)] font-mono uppercase tracking-[0.2em] text-[var(--eyebrow)] mb-3">Logo</span>
          {design.logo ? (
            <div className="flex items-center justify-between gap-3 h-11 px-3.5 rounded-[var(--r-control)] border border-[var(--signal)] bg-[var(--glass)] text-[length:var(--step-row)] text-[var(--ink)]">
              <span className="truncate">{design.logo.filename}{uploading ? ', uploading' : ''}</span>
              <button type="button" onClick={removeLogo} className="text-[var(--eyebrow)] font-semibold hover:underline flex-shrink-0">Remove</button>
            </div>
          ) : (
            <label className="flex items-center justify-between gap-3 h-11 px-3.5 rounded-[var(--r-control)] border border-dashed border-[var(--hairline)] text-[length:var(--step-row)] text-[var(--ink-soft)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)] cursor-pointer">
              <span>{uploading ? 'Uploading' : 'Add your logo'}</span>
              <span className="text-[length:var(--step-fine)]">SVG best, PNG or JPG fine</span>
              <input ref={fileRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp" className="sr-only" onChange={e => onLogoFile(e.target.files?.[0] ?? null)} />
            </label>
          )}
          <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">Shown one tone, the way the laser marks it. Light parts of a logo stay bare card.</p>
          {logoError && <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--error)]">{logoError}</p>}
        </div>
      )}

      <p className="mt-5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">
        {saveState === 'saved' ? 'Saved.' : saveState === 'saving' ? 'Saving.' : saveState === 'offline' ? 'Saved on this device.' : 'Saves as you go.'}{' '}
        When you order, the file for the laser is made from exactly this. You approve a proof photo before anything runs.
      </p>
      {saveState === 'saved' && !isBlank(design) && emailState !== 'kept' && (
        <form onSubmit={e => { e.preventDefault(); keepByEmail() }} className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Leave an email and I keep this for you"
            className="flex-1 min-w-0 h-10 px-3.5 rounded-[var(--r-control)] border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink)] text-[length:var(--step-row)] placeholder:text-[var(--ink-soft)]/60 focus:outline-none focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal-dim)]"
          />
          <button type="submit" disabled={emailState === 'sent'} className="h-10 px-4 rounded-[var(--r-control)] border border-[var(--ink)]/25 text-[var(--ink)] text-[length:var(--step-row)] font-semibold hover:border-[var(--ink)] disabled:opacity-60">Keep it</button>
        </form>
      )}
      {emailState === 'kept' && <p className="mt-2 text-[length:var(--step-fine)] text-[var(--ink)]">Kept. Come back to it any time.</p>}
    </div>
  )
}

