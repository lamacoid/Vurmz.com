'use client'
/**
 * The Builder panel: material chips, the canvas, and the tools. Owns the
 * submission state and reports it up to AddToCart, which carries it into
 * the cart item's metadata. Konva can't render on the server, so the
 * canvas itself loads dynamically.
 */
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { fontsByCategory, categoryLabels, type FontCategory } from '@/lib/fonts'
import DesignElementPicker from '@/components/shop/DesignElementPicker'
import type { BuilderConfig, CanvasBuilderConfig, SilhouetteBuilderConfig, BuilderSubmission, PlacedElement } from '@/lib/builder/types'

const BuilderCanvas = dynamic(() => import('./BuilderCanvas'), {
  ssr: false,
  loading: () => <div className="aspect-[3.375/2.125] bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />,
})
const SilhouetteBuilder = dynamic(() => import('./SilhouetteBuilder'), {
  ssr: false,
  loading: () => <div className="h-16 bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />,
})

const FONT_ORDER: FontCategory[] = [
  'vurmz', 'professional-sans', 'professional-serif', 'script', 'industrial',
  'display', 'monospace', 'fun', 'western', 'gothic',
  'arabic', 'hebrew', 'japanese', 'korean', 'chinese',
]

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
  const [value, setValue] = useState<BuilderSubmission>({
    mode: 'canvas',
    materialKey: config.materials[0]?.key ?? '',
    widthIn: config.widthIn,
    heightIn: config.heightIn,
    elements: [],
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function update(v: BuilderSubmission) {
    const m = config.materials.find(x => x.key === v.materialKey) ?? config.materials[0]
    const snap: BuilderSubmission = {
      ...v,
      materialLabel: m?.label,
      surface: m?.surface,
      mark: m?.mark,
      shape: config.shape,
      cornerRadiusIn: config.cornerRadiusIn,
    }
    setValue(snap)
    onChange(snap.elements.length > 0 ? snap : null)
  }

  const selected = value.elements.find(e => e.id === selectedId) ?? null

  function addText() {
    const el: PlacedElement = {
      id: newElementId(),
      kind: 'text',
      text: 'Your text',
      fontValue: 'kerf',
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

      {/* The canvas */}
      <BuilderCanvas config={config} value={value} onChange={update} selectedId={selectedId} onSelect={setSelectedId} />

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
        {selected && (
          <button type="button" onClick={removeSelected} className="text-[11px] px-3 py-1.5 text-[#C67A6F] font-semibold hover:underline">
            Remove selected
          </button>
        )}
      </div>

      {/* Selected element editor */}
      {selected && selected.kind === 'text' && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            dir="auto"
            value={selected.text ?? ''}
            maxLength={120}
            onChange={e => patchSelected({ text: e.target.value })}
            placeholder="Your text"
            className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#C67A6F]"
          />
          <select
            value={selected.fontValue ?? 'kerf'}
            onChange={e => patchSelected({ fontValue: e.target.value })}
            className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#C67A6F]"
          >
            {FONT_ORDER.map(cat => {
              const opts = fontsByCategory[cat]
              if (!opts || opts.length === 0) return null
              return (
                <optgroup key={cat} label={categoryLabels[cat]}>
                  {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </optgroup>
              )
            })}
          </select>
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
  const [materialKey, setMaterialKey] = useState(config.materials[0]?.key ?? '')
  const [layoutKey, setLayoutKey] = useState(config.layouts[0]?.key ?? '')
  const [fontValue, setFontValue] = useState('kerf')
  const [texts, setTexts] = useState<string[]>([])

  const layout = config.layouts.find(l => l.key === layoutKey) ?? config.layouts[0]
  const textZones = layout.zones.filter(z => z.kind === 'text')
  const material = config.materials.find(m => m.key === materialKey) ?? config.materials[0]
  const fontFamily = (fontsByCategory && (() => {
    for (const cat of FONT_ORDER) {
      const hit = fontsByCategory[cat]?.find(f => f.value === fontValue)
      if (hit) return (hit.style.fontFamily as string) ?? 'sans-serif'
    }
    return 'sans-serif'
  })()) as string

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

      <SilhouetteBuilder config={config} materialKey={materialKey} layoutKey={layoutKey} texts={texts} fontFamily={fontFamily} />

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
        <select
          value={fontValue}
          onChange={e => { setFontValue(e.target.value); emit(texts, materialKey, layoutKey, e.target.value) }}
          className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[#C67A6F]"
        >
          {FONT_ORDER.map(cat => {
            const opts = fontsByCategory[cat]
            if (!opts || opts.length === 0) return null
            return (
              <optgroup key={cat} label={categoryLabels[cat]}>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </optgroup>
            )
          })}
        </select>
      </div>

      <p className="mt-3 text-[11px] text-[#7FCFD4]">
        ✓ The red zone is where the laser marks. I send a proof photo before anything runs.
      </p>
    </div>
  )
}
