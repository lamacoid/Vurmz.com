'use client'
/**
 * DesignElementPicker — a curated library of engravable design elements
 * (Benchmade's icon-library pattern). Customers browse PNG thumbnails by
 * category and pick one to add to their engraving. The source vectors stay
 * server-side; only the selected element's id/label/thumb travel with the
 * order, and Zach resolves the id to the real cut file via the admin source map.
 */
import { useMemo, useState } from 'react'
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

  if (CATALOG.length === 0) return null

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-gray-400">Add a design <span className="text-gray-600 normal-case tracking-normal">({CATALOG.length} to choose from)</span></span>
        {selected ? (
          <button type="button" onClick={() => onSelect(null)} className="text-[11px] text-[#C67A6F] font-semibold hover:underline">
            Remove design
          </button>
        ) : (
          <button type="button" onClick={() => setOpen(o => !o)} className="text-[11px] text-[#7FCFD4] font-semibold hover:underline">
            {open ? 'Close' : 'Browse designs'}
          </button>
        )}
      </div>

      {selected && (
        <div className="mt-2 flex items-center gap-3 rounded-sm border border-[#7FCFD4]/30 bg-[#7FCFD4]/10 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.thumb} alt={selected.label} className="h-12 w-12 object-contain bg-[#f0ebe0] rounded-sm p-1" />
          <div className="text-xs">
            <p className="text-[#DED6C3] font-medium">{selected.label}</p>
            <p className="text-gray-500">{selected.category}</p>
          </div>
        </div>
      )}

      {open && !selected && (
        <div className="mt-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search designs (anchor, rose, skull…)"
            className="w-full bg-white/[0.06] border border-white/15 rounded-sm px-3 py-2 text-sm text-[#DED6C3] placeholder:text-gray-500 outline-none focus:border-[#C67A6F]"
          />
          {!query && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    c === cat ? 'border-[#7FCFD4]/50 bg-[#7FCFD4]/15 text-[#DED6C3]' : 'border-white/10 text-gray-400 hover:text-[#DED6C3]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
            {shown.map(el => (
              <button
                key={el.id}
                type="button"
                onClick={() => { onSelect(el); setOpen(false); setQuery('') }}
                title={el.label}
                className="aspect-square rounded-sm border border-white/10 bg-[#f0ebe0] p-1.5 hover:border-[#7FCFD4] hover:ring-1 hover:ring-[#7FCFD4]/40 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={el.thumb} alt={el.label} loading="lazy" className="h-full w-full object-contain" />
              </button>
            ))}
            {shown.length === 0 && <p className="col-span-full text-xs text-gray-500 py-4 text-center">No designs match that search.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
