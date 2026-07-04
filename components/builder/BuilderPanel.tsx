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
import type { CanvasBuilderConfig, BuilderSubmission, PlacedElement } from '@/lib/builder/types'

const BuilderCanvas = dynamic(() => import('./BuilderCanvas'), {
  ssr: false,
  loading: () => <div className="aspect-[3.375/2.125] bg-[var(--ink)]/[0.05] rounded-sm animate-pulse" />,
})

const FONT_ORDER: FontCategory[] = [
  'vurmz', 'professional-sans', 'professional-serif', 'script', 'industrial',
  'display', 'monospace', 'fun', 'western', 'gothic',
  'arabic', 'hebrew', 'japanese', 'korean', 'chinese',
]

let elementCounter = 0
function newElementId() { return `el_${++elementCounter}_${Math.random().toString(36).slice(2, 7)}` }

export default function BuilderPanel({ config, onChange }: {
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
