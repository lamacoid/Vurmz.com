'use client'
/**
 * EngravingPicker — lets a customer add personalization (text + font +
 * placement/details) to a product before adding it to the cart. Reads the
 * curated font catalog from lib/fonts.ts. The text input itself is set in
 * the selected face (the @font-face declarations in app/fonts.css are
 * loaded globally, so what you type is the real font): the form responds,
 * it never simulates the engraved result.
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
        style={selected.style}
        className="w-full bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2.5 text-xl leading-snug text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[#C67A6F]"
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

      <p className="mt-3 text-[11px] text-[#7FCFD4]">
        ✓ I send a proof photo for your approval before anything gets engraved.
      </p>
    </div>
  )
}
