'use client'
/**
 * EngravingPicker: lets a customer add personalization to a product before
 * adding it to the cart. One choice first: words, a design from the
 * library, or a file of their own. Only that path's controls show after
 * (progressive disclosure, 2026-09-30). The text input is set in the
 * selected face (app/fonts.css loads every face globally), so what you
 * type is the real font: the form responds, it never simulates the piece.
 */
import { useState, type ReactNode } from 'react'
import { fontOptions } from '@/lib/fonts'
import { plateFor, GRAIN } from '@/lib/plate'
import DesignElementPicker, { type DesignElement } from './DesignElementPicker'
import FontBook from './FontBook'

export interface EngravingValue {
  text: string
  fontValue: string
  /** Free-text placement/design instructions, e.g. "centered on the blade, ~1in". */
  placement: string
  /** Optional design element chosen from the curated library. */
  element: DesignElement | null
}

type Mode = 'text' | 'design' | 'file'

const MODES: Array<{ key: Mode; label: string; hint: string }> = [
  { key: 'text', label: 'Text', hint: 'A name, a date, a line. You pick the face.' },
  { key: 'file', label: 'Logo or artwork', hint: 'Your own file. SVG or PDF is best.' },
  { key: 'design', label: 'Choose a design', hint: 'From the library. Add text if you want.' },
]

export default function EngravingPicker({
  value,
  onChange,
  maxLength = 120,
  productName = '',
  finishHex = null,
  fileSlot,
}: {
  value: EngravingValue
  onChange: (v: EngravingValue) => void
  maxLength?: number
  /** Names the material, so the preview plate is honest to it. */
  productName?: string
  /** The finish chip the customer picked, when the product has them. */
  finishHex?: string | null
  /** The file attach control, rendered inside the "My own file" path. */
  fileSlot?: ReactNode
}) {
  // Start on whichever path already has something in it; otherwise wait
  // for the choice.
  const [mode, setMode] = useState<Mode | null>(value.element ? 'design' : value.text ? 'text' : null)
  const selected = fontOptions.find(f => f.value === value.fontValue) ?? fontOptions[0]
  const plate = plateFor(productName, finishHex)
  const shown = value.text.trim()
  const size = Math.max(20, Math.min(56, 400 / Math.max(6, shown.length || 10)))
  const bright = /^#[C-F]/i.test(plate.ink)

  const preview = (
    <div
      className="relative rounded-[var(--r-tile)] overflow-hidden aspect-[16/9] mb-3"
      style={{ background: plate.bg, boxShadow: `inset 0 0 0 1px ${plate.edge}` }}
      aria-hidden
    >
      {plate.grain && plate.grain !== 'none' && (
        <div className="absolute inset-0 opacity-[0.22] pointer-events-none" style={{ backgroundImage: GRAIN[plate.grain] }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
        {value.element && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.element.thumb}
            alt=""
            className="h-[42%] w-auto max-w-[30%] object-contain"
            style={{ filter: bright ? 'invert(1) brightness(1.4)' : 'brightness(0.25)', opacity: 0.9, mixBlendMode: bright ? 'screen' : 'multiply' }}
          />
        )}
        {(mode === 'text' || shown) && (
          <p
            className="text-center leading-tight break-words max-w-full"
            style={{ ...selected.style, color: plate.ink, fontSize: `${size}px`, opacity: shown ? 1 : 0.5, textShadow: bright ? '0 0 8px rgba(255,255,255,0.3)' : '0 1px 0 rgba(255,255,255,0.15)' }}
          >
            {shown || 'Your words here'}
          </p>
        )}
      </div>
      <span className="absolute left-3 bottom-2 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: plate.ink, opacity: 0.6 }}>
        {plate.mark}
      </span>
    </div>
  )

  const textControls = (
    <>
      <input
        type="text"
        dir="auto"
        value={value.text}
        maxLength={maxLength}
        onChange={e => onChange({ ...value, text: e.target.value })}
        placeholder={mode === 'design' ? 'Words with the design, or leave blank' : 'Name, date, message…'}
        style={selected.style}
        className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2.5 text-xl leading-snug text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[#C67A6F]"
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-[var(--ink-soft)]">{mode === 'design' ? 'Optional' : 'Leave blank for no words'}</span>
        <span className="text-[11px] text-[var(--ink-soft)]">{value.text.length}/{maxLength}</span>
      </div>
      {(mode === 'text' || shown) && (
        <div className="mt-3">
          <FontBook value={value.fontValue} onChange={v => onChange({ ...value, fontValue: v })} sampleText={value.text} />
        </div>
      )}
    </>
  )

  const placement = (
    <label className="block mt-3">
      <span className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Placement &amp; details</span>
      <input
        type="text"
        value={value.placement}
        maxLength={200}
        onChange={e => onChange({ ...value, placement: e.target.value })}
        placeholder="e.g. centered, about 1 inch, or match my logo"
        className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[#C67A6F]"
      />
      <span className="text-[11px] text-[var(--ink-soft)] block mt-1">Not sure? Leave it blank and I&apos;ll pick the spot that looks best.</span>
    </label>
  )

  return (
    <div className="mb-5 rounded-sm border border-[var(--hairline)] bg-[var(--ink)]/[0.03] p-4 sm:p-5">
      {/* Header matches the menu's section rules: hairline, small caps, hairline. */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">The engraving</span>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>

      {/* The one choice, first. */}
      <div className="grid grid-cols-3 gap-2 mb-4" role="radiogroup" aria-label="What goes on it">
        {MODES.map(m => {
          const on = mode === m.key
          return (
            <button
              key={m.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(m.key)}
              className={`text-left rounded-sm border px-3 py-2.5 transition-colors ${on ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10' : 'border-[var(--hairline)] hover:border-[var(--ink)]/40'}`}
            >
              <span className={`block text-sm font-semibold ${on ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>{m.label}</span>
              <span className="block text-[11px] leading-snug text-[var(--ink-soft)] mt-0.5">{m.hint}</span>
            </button>
          )
        })}
      </div>

      {mode === null && (
        <p className="text-[12px] text-[var(--ink-soft)]">Pick one to start. Nothing chosen means the piece stays plain.</p>
      )}

      {mode === 'text' && (
        <>
          {preview}
          {textControls}
          {placement}
        </>
      )}

      {mode === 'design' && (
        <>
          {preview}
          <DesignElementPicker selected={value.element} onSelect={el => onChange({ ...value, element: el })} />
          <div className="mt-3">{textControls}</div>
          {placement}
        </>
      )}

      {mode === 'file' && (
        <>
          {fileSlot}
          {placement}
        </>
      )}

      {mode !== null && (
        <p className="mt-3 text-[11px] text-[#7FCFD4]">
          Questions first? Text me.
        </p>
      )}
    </div>
  )
}
