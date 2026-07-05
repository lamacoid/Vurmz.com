'use client'
/**
 * FontBook: the font picker as a type-specimen book. Every face is shown
 * set in itself (the honest way to choose type), grouped under the same
 * small-caps section rules as the menu. Replaces the native select, which
 * cannot render its options in their own faces.
 *
 * The specimen list only mounts when opened, so the catalog's font files
 * (especially the heavy CJK ones) download on demand, never with the page.
 * Latin faces preview the customer's own text once they've typed some;
 * world scripts always preview a native greeting, because a Latin sample
 * would fall back to a system face and misrepresent the font.
 */
import { useEffect, useRef, useState } from 'react'
import {
  fontOptions,
  fontsByCategory,
  categoryLabels,
  FONT_CATEGORY_ORDER,
  type FontCategory,
  type FontOption,
} from '@/lib/fonts'

const NATIVE_SAMPLE: Partial<Record<FontCategory, string>> = {
  arabic: 'أهلاً وسهلاً',
  hebrew: 'שלום',
  japanese: 'こんにちは',
  korean: '안녕하세요',
  chinese: '你好',
}

export default function FontBook({
  value,
  onChange,
  sampleText,
}: {
  value: string
  onChange: (v: string) => void
  /** The customer's own text; when present, Latin faces preview it. */
  sampleText?: string
}) {
  const [open, setOpen] = useState(false)
  const selectedRef = useRef<HTMLButtonElement>(null)
  const selected = fontOptions.find(f => f.value === value) ?? fontOptions[0]
  const sample = (sampleText ?? '').trim().slice(0, 26)

  // Opening the book lands you on the face you already have.
  useEffect(() => {
    if (open) selectedRef.current?.scrollIntoView({ block: 'center' })
  }, [open])

  function specimen(o: FontOption): string {
    return NATIVE_SAMPLE[o.category] ?? (sample || o.label)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-left outline-none focus:border-[#C67A6F] transition-colors"
      >
        <span className="min-w-0">
          <span className="block text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">Font</span>
          <span dir="auto" className="block text-base leading-snug text-[var(--ink)] truncate" style={selected.style}>
            {selected.label}
          </span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`w-3 h-3 flex-shrink-0 text-[var(--ink-soft)] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Font"
          className="mt-1.5 max-h-80 overflow-y-auto rounded-sm border border-[var(--hairline)] bg-[var(--page)] overscroll-contain"
        >
          {FONT_CATEGORY_ORDER.map(cat => {
            const opts = fontsByCategory[cat]
            if (!opts || opts.length === 0) return null
            return (
              <div key={cat}>
                <div className="sticky top-0 z-10 bg-[var(--page)]/95 backdrop-blur px-3 pt-2.5 pb-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--eyebrow)] whitespace-nowrap">
                    {categoryLabels[cat]}
                  </span>
                  <span className="flex-1 border-t border-[var(--ink)]/15" aria-hidden />
                </div>
                {opts.map(o => {
                  const isSel = o.value === value
                  const spec = specimen(o)
                  return (
                    <button
                      key={o.value}
                      ref={isSel ? selectedRef : undefined}
                      type="button"
                      role="option"
                      aria-selected={isSel}
                      onClick={() => {
                        onChange(o.value)
                        setOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 border-l-2 transition-colors ${
                        isSel
                          ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10'
                          : 'border-transparent hover:bg-[var(--ink)]/[0.04]'
                      }`}
                    >
                      {/* Name in system type only when the specimen isn't the name itself. */}
                      {spec !== o.label && (
                        <span className="block text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{o.label}</span>
                      )}
                      <span dir="auto" className="block text-lg leading-snug text-[var(--ink)] truncate" style={o.style}>
                        {spec}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
