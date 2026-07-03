'use client'
/**
 * DesignElementPicker — a curated library of engravable design elements
 * (Benchmade's icon-library pattern). Customers browse PNG thumbnails by
 * category and pick one to add to their engraving. The source vectors stay
 * server-side; only the selected element's id/label/thumb travel with the
 * order, and Zach resolves the id to the real cut file via the admin source map.
 *
 * The library opens as a modal overlay, not an inline expansion: 500+
 * thumbnails must never push the Add-to-cart button below the fold.
 */
import { useEffect, useMemo, useState } from 'react'
import catalogRaw from '@/lib/design/catalog.json'

export interface DesignElement {
  id: string
  label: string
  category: string
  thumb: string
}

const CATALOG = catalogRaw as DesignElement[]
const CATEGORIES = Array.from(new Set(CATALOG.map(e => e.category)))

export default function DesignElementPicker({
  selected,
  onSelect,
}: {
  selected: DesignElement | null
  onSelect: (el: DesignElement | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState(CATEGORIES[0] ?? '')
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATALOG.filter(e =>
      (q ? e.label.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) : e.category === cat)
    ).slice(0, 120)
  }, [cat, query])

  // Escape closes the library; page scroll holds while it's open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (CATALOG.length === 0) return null

  function pick(el: DesignElement) {
    onSelect(el)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="mt-4 border-t border-[var(--hairline)] pt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">Add a design <span className="normal-case tracking-normal">(optional)</span></span>
        {selected ? (
          <button type="button" onClick={() => onSelect(null)} className="text-[11px] text-[#C67A6F] font-semibold hover:underline">
            Remove design
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[11px] px-3 py-1.5 border border-[var(--eyebrow)]/50 text-[var(--eyebrow)] font-semibold rounded-sm hover:bg-[var(--eyebrow)]/10 transition-colors whitespace-nowrap"
          >
            Browse {CATALOG.length} designs
          </button>
        )}
      </div>

      {selected && (
        <div className="mt-2 flex items-center gap-3 rounded-sm border border-[#7FCFD4]/30 bg-[#7FCFD4]/10 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.thumb} alt={selected.label} className="h-12 w-12 object-contain bg-[#f0ebe0] rounded-sm p-1" />
          <div className="text-xs">
            <p className="text-[var(--ink)] font-medium">{selected.label}</p>
            <p className="text-[var(--ink-soft)]">{selected.category}</p>
          </div>
        </div>
      )}

      {open && !selected && (
        <>
          <div
            className="fixed inset-0 z-[85] bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Design library"
            className="fixed z-[90] inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[8vh] sm:w-full sm:max-w-2xl max-h-[80vh] flex flex-col bg-[var(--page)] border border-[var(--hairline)] rounded-sm shadow-2xl shadow-black/40"
          >
            <header className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[var(--hairline)]">
              <div>
                <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">The design library</p>
                <p className="text-[11px] text-[var(--ink-soft)] mt-0.5">{CATALOG.length} designs, pick one and it joins your engraving</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-[var(--ink-soft)] hover:text-[var(--ink)]"
                aria-label="Close design library"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="px-4 sm:px-5 py-3 border-b border-[var(--hairline)]">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search designs (anchor, rose, skull…)"
                className="w-full bg-[var(--surface)] border border-[var(--hairline)] rounded-sm px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[#C67A6F]"
              />
              {!query && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        c === cat ? 'border-[#7FCFD4]/50 bg-[#7FCFD4]/15 text-[var(--ink)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {shown.map(el => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => pick(el)}
                    title={el.label}
                    className="aspect-square rounded-sm border border-[var(--hairline)] bg-[#f0ebe0] p-1.5 hover:border-[#7FCFD4] hover:ring-1 hover:ring-[#7FCFD4]/40 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={el.thumb} alt={el.label} loading="lazy" className="h-full w-full object-contain" />
                  </button>
                ))}
                {shown.length === 0 && <p className="col-span-full text-xs text-[var(--ink-soft)] py-4 text-center">No designs match that search.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
