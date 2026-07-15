'use client'
/**
 * The Builder panel: material chips, the canvas, and the tools. Owns the
 * submission state and reports it up to AddToCart, which carries it into
 * the cart item's metadata. Konva can't render on the server, so the
 * canvas itself loads dynamically.
 */
import { useEffect, useRef, useState } from 'react'
import { fontOptions } from '@/lib/fonts'
import DesignElementPicker from '@/components/shop/DesignElementPicker'
import FontBook from '@/components/shop/FontBook'
import type { BuilderConfig, CanvasBuilderConfig, SilhouetteBuilderConfig, BuilderSubmission, PlacedElement } from '@/lib/builder/types'
import type BuilderCanvasComponent from './BuilderCanvas'
import type SilhouetteBuilderComponent from './SilhouetteBuilder'
import type Preview3DComponent from './Preview3D'

// next/dynamic is off-limits in this file: its module-scope async-chunk
// reference is exactly what next-on-pages leaves undefined in the edge
// bundle, which threw during SSR and silently dropped the entire
// AddToCart subtree from the served HTML (the buy box only appeared
// after hydration). Loading inside an effect keeps the import() out of
// the server evaluation path entirely; the Konva canvas is client-only
// regardless.
function useClientOnly<T>(load: () => Promise<{ default: T }>): T | null {
  const [comp, setComp] = useState<T | null>(null)
  useEffect(() => {
    let alive = true
    load().then(m => { if (alive) setComp(() => m.default) })
    return () => { alive = false }
  }, [load])
  return comp
}
const loadBuilderCanvas = () => import('./BuilderCanvas')
const loadSilhouetteBuilder = () => import('./SilhouetteBuilder')
const loadPreview3D = () => import('./Preview3D')
/** Never resolves: keeps three.js entirely out of the bundle path for
 *  products without a 3D model. */
const loadNothing = () => new Promise<{ default: typeof Preview3DComponent }>(() => {})

let elementCounter = 0
function newElementId() { return `el_${++elementCounter}_${Math.random().toString(36).slice(2, 7)}` }

export default function BuilderPanel({ config, onChange }: {
  config: BuilderConfig
  onChange: (v: BuilderSubmission | null) => void
}) {
  if (config.mode === 'silhouette') return <SilhouettePanel config={config} onChange={onChange} />
  return <CanvasPanel config={config} onChange={onChange} />
}

function CanvasPanel({ config, onChange }: {
  config: CanvasBuilderConfig
  onChange: (v: BuilderSubmission | null) => void
}) {
  const BuilderCanvas = useClientOnly<typeof BuilderCanvasComponent>(loadBuilderCanvas)
  const Preview3D = useClientOnly<typeof Preview3DComponent>(config.model3d ? loadPreview3D : loadNothing)
  const [view, setView] = useState<'flat' | '3d'>('flat')
  const [value, setValue] = useState<BuilderSubmission>({
    mode: 'canvas',
    materialKey: config.materials[0]?.key ?? '',
    widthIn: config.widthIn,
    heightIn: config.heightIn,
    elements: [],
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** Local object URLs for uploaded images, keyed by element id. Preview
   *  only; the order carries the R2 key, never these. */
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function update(v: BuilderSubmission) {
    const m = config.materials.find(x => x.key === v.materialKey) ?? config.materials[0]
    setValue({
      ...v,
      materialLabel: m?.label,
      surface: m?.surface,
      mark: m?.mark,
      markColor: m?.markColor,
      shape: config.shape,
      cornerRadiusIn: config.cornerRadiusIn,
    })
  }

  /** Async-safe patch: uploads finish after state has moved on. */
  function patchById(id: string, patch: Partial<PlacedElement>) {
    setValue(prev => ({ ...prev, elements: prev.elements.map(e => (e.id === id ? { ...e, ...patch } : e)) }))
  }

  // What rides the cart. Uploads only count once their R2 key is home, so
  // an order can never reference a file that never finished uploading.
  useEffect(() => {
    const sendable = value.elements.filter(e => e.kind !== 'upload' || !!e.uploadUrl)
    onChange(sendable.length > 0 ? { ...value, elements: sendable } : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const selected = value.elements.find(e => e.id === selectedId) ?? null

  async function addUpload(file: File) {
    setUploadError(null)
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.type)) {
      setUploadError('JPG, PNG, WEBP, GIF, or SVG here. Other formats can go in the order instructions.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Max file size is 10 MB.')
      return
    }
    const url = URL.createObjectURL(file)
    const dims = await new Promise<{ w: number; h: number } | null>(resolve => {
      const img = new window.Image()
      img.onload = () => resolve({ w: img.naturalWidth || 300, h: img.naturalHeight || 300 })
      img.onerror = () => resolve(null)
      img.src = url
    })
    if (!dims) {
      URL.revokeObjectURL(url)
      setUploadError('That file would not open as an image.')
      return
    }
    const wIn = Math.min(config.widthIn * 0.5, 1.4)
    const hIn = Math.min(config.heightIn * 0.85, wIn * (dims.h / dims.w))
    const el: PlacedElement = {
      id: newElementId(),
      kind: 'upload',
      xIn: (config.widthIn - wIn) / 2,
      yIn: (config.heightIn - hIn) / 2,
      wIn,
      hIn,
      rotationDeg: 0,
    }
    setPreviews(p => ({ ...p, [el.id]: url }))
    update({ ...value, elements: [...value.elements, el] })
    setSelectedId(el.id)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/checkout/upload/', { method: 'POST', body: form })
      const json = (await res.json()) as { ok?: boolean; data?: { key?: string }; error?: { message?: string } }
      if (!json?.ok || !json.data?.key) throw new Error(json?.error?.message || 'upload failed')
      patchById(el.id, { uploadUrl: json.data.key })
    } catch {
      setUploadError('The upload did not go through, so this image will not ride the order yet. Remove it and try again.')
    }
  }

  function addText() {
    const el: PlacedElement = {
      id: newElementId(),
      kind: 'text',
      text: 'Your text',
      fontValue: 'zen-kurenaido',
      xIn: config.widthIn * 0.15,
      yIn: config.heightIn * 0.4,
      wIn: config.widthIn * 0.7,
      hIn: Math.min(0.4, config.heightIn * 0.2),
      rotationDeg: 0,
    }
    update({ ...value, elements: [...value.elements, el] })
    setSelectedId(el.id)
  }

  function addDesign(d: { id: string; label: string; thumb: string }) {
    const side = Math.min(config.widthIn, config.heightIn) * 0.45
    const el: PlacedElement = {
      id: newElementId(),
      kind: 'design',
      designId: d.id,
      designLabel: d.label,
      designThumb: d.thumb,
      xIn: (config.widthIn - side) / 2,
      yIn: (config.heightIn - side) / 2,
      wIn: side,
      hIn: side,
      rotationDeg: 0,
    }
    update({ ...value, elements: [...value.elements, el] })
    setSelectedId(el.id)
  }

  /** Drop a pre-built layout onto the canvas. Replaces whatever is there:
   *  templates are a starting point, and picking one mid-design reads as
   *  "start over with this layout". */
  function applyTemplate(t: NonNullable<CanvasBuilderConfig['templates']>[number]) {
    const els: PlacedElement[] = t.elements.map(e => ({ ...e, id: newElementId() }))
    update({ ...value, elements: els })
    setSelectedId(els.find(e => e.kind === 'text')?.id ?? els[0]?.id ?? null)
  }

  function patchSelected(patch: Partial<PlacedElement>) {
    if (!selected) return
    update({ ...value, elements: value.elements.map(e => (e.id === selected.id ? { ...e, ...patch } : e)) })
  }

  function removeSelected() {
    if (!selected) return
    update({ ...value, elements: value.elements.filter(e => e.id !== selected.id) })
    setSelectedId(null)
  }

  return (
    <div className="mb-5 rounded-sm border border-[var(--hairline)] bg-[var(--ink)]/[0.03] p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">Design it</span>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>

      {/* Flat edits, 3D shows it on the real thing. */}
      {config.model3d && (
        <div className="mb-3 flex gap-1.5">
          {(['flat', '3d'] as const).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`px-3.5 py-1.5 rounded-sm border text-xs transition-colors ${
                view === v
                  ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
                  : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {v === 'flat' ? 'Design' : 'See it in 3D'}
            </button>
          ))}
        </div>
      )}

      {/* Material / finish */}
      {config.materials.length > 1 && (
        <div className="mb-3">
          <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Color &amp; finish</span>
          <div className="flex flex-wrap gap-1.5">
            {config.materials.map(m => (
              <button
                key={m.key}
                type="button"
                onClick={() => update({ ...value, materialKey: m.key })}
                aria-pressed={value.materialKey === m.key}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs transition-colors ${
                  value.materialKey === m.key
                    ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
                    : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <span aria-hidden className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: m.surface }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Templates: a filled-in starting point beats a blank canvas. */}
      {(config.templates?.length ?? 0) > 0 && (
        <div className="mb-3">
          <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Start from a layout</span>
          <div className="flex flex-wrap gap-1.5">
            {config.templates!.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => applyTemplate(t)}
                className="px-3 py-1.5 rounded-sm border border-[var(--hairline)] text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--eyebrow)]/50 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The canvas (or the 3D view of it) */}
      {view === '3d' && config.model3d ? (
        Preview3D ? (
          <Preview3D modelUrl={config.model3d} config={config} value={value} previews={previews} />
        ) : (
          <div className="aspect-[4/3] bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />
        )
      ) : BuilderCanvas ? (
        <BuilderCanvas config={config} value={value} onChange={update} selectedId={selectedId} onSelect={setSelectedId} previews={previews} />
      ) : (
        <div className="aspect-[3.375/2.125] bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />
      )}

      {/* Tools */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addText}
          className="text-[11px] px-3 py-1.5 border border-[var(--eyebrow)]/50 text-[var(--eyebrow)] font-semibold rounded-sm hover:bg-[var(--eyebrow)]/10 transition-colors"
        >
          + Add text
        </button>
        <DesignPickerButton onPick={addDesign} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-[11px] px-3 py-1.5 border border-[var(--eyebrow)]/50 text-[var(--eyebrow)] font-semibold rounded-sm hover:bg-[var(--eyebrow)]/10 transition-colors"
        >
          + Your logo or image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) addUpload(f)
            e.target.value = ''
          }}
        />
        {selected && (
          <button type="button" onClick={removeSelected} className="text-[11px] px-3 py-1.5 text-[#C67A6F] font-semibold hover:underline">
            Remove selected
          </button>
        )}
      </div>
      {uploadError && <p className="mt-1.5 text-[11px] text-[#8A4943]">{uploadError}</p>}

      {/* Selected element editor */}
      {selected && selected.kind === 'text' && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            dir="auto"
            value={selected.text ?? ''}
            maxLength={120}
            onChange={e => patchSelected({ text: e.target.value })}
            placeholder="Your text"
            className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#C67A6F]"
          />
          <FontBook
            value={selected.fontValue ?? 'zen-kurenaido'}
            onChange={v => patchSelected({ fontValue: v })}
            sampleText={selected.text ?? ''}
          />
        </div>
      )}
      {selected && (
        <p className="mt-1.5 text-[10px] text-[var(--ink-soft)]">
          {selected.kind === 'text' ? 'Text' : selected.designLabel} · {selected.wIn.toFixed(1)}&Prime; × {selected.hIn.toFixed(1)}&Prime; · drag to move, corners to resize
        </p>
      )}

      <p className="mt-3 text-[11px] text-[#7FCFD4]">
        ✓ I match your layout as closely as the material allows and send a proof photo before anything runs.
      </p>
    </div>
  )
}

/** The library button reuses the existing modal picker. */
function DesignPickerButton({ onPick }: { onPick: (d: { id: string; label: string; thumb: string }) => void }) {
  const [chosen, setChosen] = useState<{ id: string; label: string; category: string; thumb: string } | null>(null)
  return (
    <DesignElementPicker
      selected={chosen}
      onSelect={el => {
        if (el) { onPick(el); setChosen(null) }
      }}
    />
  )
}


/** Silhouette mode: guided zones. Pick a layout, type into each zone. */
function SilhouettePanel({ config, onChange }: {
  config: SilhouetteBuilderConfig
  onChange: (v: BuilderSubmission | null) => void
}) {
  const SilhouetteBuilder = useClientOnly<typeof SilhouetteBuilderComponent>(loadSilhouetteBuilder)
  const [materialKey, setMaterialKey] = useState(config.materials[0]?.key ?? '')
  const [layoutKey, setLayoutKey] = useState(config.layouts[0]?.key ?? '')
  const [fontValue, setFontValue] = useState('zen-kurenaido')
  const [texts, setTexts] = useState<string[]>([])

  const layout = config.layouts.find(l => l.key === layoutKey) ?? config.layouts[0]
  const textZones = layout.zones.filter(z => z.kind === 'text')
  const material = config.materials.find(m => m.key === materialKey) ?? config.materials[0]
  // Konva needs a bare family name, not the CSS stack, or it falls back to serif.
  const fontFamily = ((fontOptions.find(f => f.value === fontValue)?.style.fontFamily as string) ?? 'sans-serif')
    .split(',')[0].replace(/["']/g, '').trim()

  function emit(nextTexts: string[], nextMaterial = materialKey, nextLayout = layoutKey, nextFont = fontValue) {
    const lay = config.layouts.find(l => l.key === nextLayout) ?? config.layouts[0]
    const zones = lay.zones.filter(z => z.kind === 'text')
    const filled = zones
      .map((z, i) => ({ z, t: (nextTexts[i] ?? '').trim() }))
      .filter(x => x.t)
    if (filled.length === 0) { onChange(null); return }
    const m = config.materials.find(x => x.key === nextMaterial) ?? config.materials[0]
    onChange({
      mode: 'silhouette',
      materialKey: nextMaterial,
      materialLabel: m?.label,
      surface: m?.surface,
      mark: m?.mark,
      markColor: m?.markColor,
      outlinePath: config.outlinePath,
      layoutKey: nextLayout,
      widthIn: config.widthIn,
      heightIn: config.heightIn,
      elements: filled.map(({ z, t }, i) => ({
        id: `zone_${i}`,
        kind: 'text' as const,
        xIn: z.xIn, yIn: z.yIn, wIn: z.wIn, hIn: z.hIn,
        rotationDeg: 0,
        text: t.slice(0, 120),
        fontValue: nextFont,
      })),
    })
  }

  return (
    <div className="mb-5 rounded-sm border border-[var(--hairline)] bg-[var(--ink)]/[0.03] p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">Design it</span>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>

      {config.materials.length > 1 && (
        <div className="mb-3">
          <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Color</span>
          <div className="flex flex-wrap gap-1.5">
            {config.materials.map(m => (
              <button
                key={m.key}
                type="button"
                onClick={() => { setMaterialKey(m.key); emit(texts, m.key) }}
                aria-pressed={materialKey === m.key}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs transition-colors ${
                  materialKey === m.key
                    ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
                    : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <span aria-hidden className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: m.surface }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {config.layouts.length > 1 && (
        <div className="mb-3">
          <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">Layout</span>
          <div className="flex flex-wrap gap-1.5">
            {config.layouts.map(l => (
              <button
                key={l.key}
                type="button"
                onClick={() => { setLayoutKey(l.key); emit(texts, materialKey, l.key) }}
                aria-pressed={layoutKey === l.key}
                className={`px-3 py-1.5 rounded-sm border text-xs transition-colors ${
                  layoutKey === l.key
                    ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
                    : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {SilhouetteBuilder ? (
        <SilhouetteBuilder config={config} materialKey={materialKey} layoutKey={layoutKey} texts={texts} fontFamily={fontFamily} />
      ) : (
        <div className="h-16 bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />
      )}

      <div className="mt-3 space-y-2">
        {textZones.map((z, i) => (
          <input
            key={`${layoutKey}_${i}`}
            type="text"
            dir="auto"
            value={texts[i] ?? ''}
            maxLength={60}
            onChange={e => {
              const next = [...texts]; next[i] = e.target.value
              setTexts(next); emit(next)
            }}
            placeholder={textZones.length > 1 ? `Line ${i + 1}` : 'Name, phone, or message'}
            className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#C67A6F]"
          />
        ))}
        <FontBook
          value={fontValue}
          onChange={v => { setFontValue(v); emit(texts, materialKey, layoutKey, v) }}
          sampleText={texts.find(t => (t ?? '').trim()) ?? ''}
        />
      </div>

      <p className="mt-3 text-[11px] text-[#7FCFD4]">
        ✓ The red zone is where the laser marks. I send a proof photo before anything runs.
      </p>
    </div>
  )
}
