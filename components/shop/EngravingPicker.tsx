'use client'
/**
 * EngravingPicker — lets a customer add personalization (text + font +
 * placement/details) to a product before adding it to the cart. Reads the
 * curated font catalog from lib/fonts.ts and live-previews the text in the
 * selected face (the @font-face declarations in app/fonts.css are loaded
 * globally, so previews are real).
 */
import { fontOptions } from '@/lib/fonts'
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

  return (
    <div className="mb-5 rounded-sm border border-[var(--hairline)] bg-[var(--ink)]/[0.03] p-4 sm:p-5">
      {/* Header matches the menu's section rules: hairline, small caps, hairline. */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">The engraving</span>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>

      <input
        type="text"
        dir="auto"
        value={value.text}
        maxLength={maxLength}
        onChange={e => onChange({ ...value, text: e.target.value })}
        placeholder="Name, date, message…"
        className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[#C67A6F]"
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-[var(--ink-soft)]">Leave blank for no engraving</span>
        <span className="text-[11px] text-[var(--ink-soft)]">{value.text.length}/{maxLength}</span>
      </div>

      <div className="mt-3">
        <FontBook
          value={value.fontValue}
          onChange={v => onChange({ ...value, fontValue: v })}
          sampleText={value.text}
        />
      </div>

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

      {/* Curated design-element library */}
      <DesignElementPicker
        selected={value.element}
        onSelect={el => onChange({ ...value, element: el })}
      />

      {/* Live preview — the mark rendered in the actual selected font, light
          on a dark plate, the way a laser engraving reads. */}
      <div className="mt-3 rounded-sm border border-[var(--hairline)] bg-[#0c2529] px-4 py-5 text-center overflow-hidden">
        <div className="mb-1.5 text-left">
          <span className="text-[10px] uppercase tracking-wider text-white/50">Preview</span>
        </div>
        {value.element && (
          /* The art is black; on the dark plate the laser mark reads light, so invert it. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value.element.thumb} alt={value.element.label} className="mx-auto mb-2 h-16 w-16 object-contain invert" />
        )}
        <span dir="auto" className="text-2xl leading-tight break-words text-[#DED6C3]" style={selected.style}>
          {value.text.trim() || (value.element ? '' : 'Your text here')}
        </span>
      </div>

      <p className="mt-3 text-[11px] text-[#7FCFD4]">
        ✓ I send a proof photo for your approval before anything gets engraved.
      </p>
    </div>
  )
}
