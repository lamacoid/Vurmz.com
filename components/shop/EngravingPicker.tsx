'use client'
/**
 * EngravingPicker — lets a customer add personalization (text + font +
 * placement/details) to a product before adding it to the cart. Reads the
 * curated font catalog from lib/fonts.ts and live-previews the text in the
 * selected face (the @font-face declarations in app/fonts.css are loaded
 * globally, so previews are real).
 */
import { useState } from 'react'
import { fontsByCategory, categoryLabels, fontOptions, type FontCategory } from '@/lib/fonts'
import DesignElementPicker, { type DesignElement } from './DesignElementPicker'

export interface EngravingValue {
  text: string
  fontValue: string
  /** Free-text placement/design instructions, e.g. "centered on the blade, ~1in". */
  placement: string
  /** Optional design element chosen from the curated library. */
  element: DesignElement | null
}

// VURMZ Originals first, then the rest in a sensible browse order.
const CATEGORY_ORDER: FontCategory[] = [
  'vurmz',
  'professional-sans',
  'professional-serif',
  'script',
  'industrial',
  'display',
  'monospace',
  'fun',
  'western',
  'gothic',
]

export default function EngravingPicker({
  value,
  onChange,
  maxLength = 120,
}: {
  value: EngravingValue
  onChange: (v: EngravingValue) => void
  maxLength?: number
}) {
  const selected = fontOptions.find(f => f.value === value.fontValue) ?? fontOptions[0]
  // Preview the mark on light vs dark "material" — Benchmade's contrast toggle.
  const [darkPreview, setDarkPreview] = useState(true)

  return (
    <div className="mb-5 rounded-sm border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#F0E6D3]">Add engraving</span>
        <span className="text-[11px] text-gray-500">optional</span>
      </div>

      <input
        type="text"
        value={value.text}
        maxLength={maxLength}
        onChange={e => onChange({ ...value, text: e.target.value })}
        placeholder="Name, date, message…"
        className="w-full bg-white/[0.06] border border-white/15 rounded-sm px-3 py-2.5 text-sm text-[#F0E6D3] placeholder:text-gray-500 outline-none focus:border-[#E95C4E]"
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-gray-500">Leave blank for no engraving</span>
        <span className="text-[11px] text-gray-500">{value.text.length}/{maxLength}</span>
      </div>

      <label className="block mt-3">
        <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Font</span>
        <select
          value={value.fontValue}
          onChange={e => onChange({ ...value, fontValue: e.target.value })}
          className="w-full bg-white/[0.06] border border-white/15 rounded-sm px-3 py-2.5 text-sm text-[#F0E6D3] outline-none focus:border-[#E95C4E]"
        >
          {CATEGORY_ORDER.map(cat => {
            const opts = fontsByCategory[cat]
            if (!opts || opts.length === 0) return null
            return (
              <optgroup key={cat} label={categoryLabels[cat]}>
                {opts.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </optgroup>
            )
          })}
        </select>
      </label>

      <label className="block mt-3">
        <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Placement &amp; details</span>
        <input
          type="text"
          value={value.placement}
          maxLength={200}
          onChange={e => onChange({ ...value, placement: e.target.value })}
          placeholder="e.g. centered on the blade, about 1 inch, match my logo"
          className="w-full bg-white/[0.06] border border-white/15 rounded-sm px-3 py-2.5 text-sm text-[#F0E6D3] placeholder:text-gray-500 outline-none focus:border-[#E95C4E]"
        />
        <span className="text-[11px] text-gray-500 block mt-1">Not sure? Leave it blank and I&apos;ll pick the spot that looks best.</span>
      </label>

      {/* Curated design-element library */}
      <DesignElementPicker
        selected={value.element}
        onSelect={el => onChange({ ...value, element: el })}
      />

      {/* Live preview — renders in the actual selected font, on light/dark "material" */}
      <div className={`mt-3 rounded-sm border px-4 py-5 text-center overflow-hidden transition-colors ${darkPreview ? 'border-white/10 bg-[#0c2529]' : 'border-black/10 bg-[#e9e2d4]'}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[10px] uppercase tracking-wider ${darkPreview ? 'text-gray-500' : 'text-gray-600'}`}>Preview</span>
          <button
            type="button"
            onClick={() => setDarkPreview(d => !d)}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${darkPreview ? 'border-white/15 text-gray-400' : 'border-black/15 text-gray-600'}`}
          >
            {darkPreview ? 'On dark' : 'On light'}
          </button>
        </div>
        {value.element && (
          /* The art is black; on dark "material" the laser mark reads light, so
             invert it there. On light material it stays black. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value.element.thumb} alt={value.element.label} className={`mx-auto mb-2 h-16 w-16 object-contain ${darkPreview ? 'invert' : ''}`} />
        )}
        <span className={`text-2xl leading-tight break-words ${darkPreview ? 'text-[#F0E6D3]' : 'text-[#1a2f2e]'}`} style={selected.style}>
          {value.text.trim() || (value.element ? '' : 'Your text here')}
        </span>
      </div>

      <p className="mt-3 text-[11px] text-[#6BB8B2]">
        ✓ I send a proof photo for your approval before anything gets engraved.
      </p>
    </div>
  )
}
