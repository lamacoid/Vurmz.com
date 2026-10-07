'use client'
/* eslint-disable @next/next/no-img-element */
/**
 * The flash sheet. Every design in the library on dark plates, filtered
 * by sheet, searchable, one click opens the plate large with the ways to
 * use it. The thumbnails are black art on a clear ground, so on the dark
 * plate they are inverted to cream, the way a mark reads on steel.
 */
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CATALOG, SHEETS, SUBS, sheetFor, countBySheet, type DesignElement } from '@/lib/design/sheet'

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const INK = { filter: 'invert(1) sepia(0.3) saturate(0.5) brightness(1.02)' }

export default function FlashSheet({ initialSheet = '' }: { initialSheet?: string }) {
  const [sheet, setSheetRaw] = useState<string>(initialSheet)
  const [sub, setSub] = useState<string>('')
  const setSheet = (k: string) => { setSheetRaw(k); setSub('') }
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<DesignElement | null>(null)
  const [copied, setCopied] = useState(false)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CATALOG.filter(e => {
      if (sheet && e.category !== sheet) return false
      if (sub && e.sub !== sub) return false
      if (!q) return true
      return e.label.toLowerCase().includes(q) || (e.sub ?? '').toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.id.endsWith(q)
    })
  }, [sheet, sub, query])

  // Escape closes the plate; page scroll holds while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  // Deep links: /designs?sheet=Gothic or #de_xxx open straight to it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('sheet')
    if (s) {
      const match = SHEETS.find(x => x.name.toLowerCase() === s.toLowerCase() || x.key.toLowerCase() === s.toLowerCase())
      if (match) setSheet(match.key)
    }
    const hash = window.location.hash.replace('#', '')
    if (hash.startsWith('de_')) {
      const el = CATALOG.find(e => e.id === hash)
      if (el) setOpen(el)
    }
  }, [])

  async function copyId(id: string) {
    try { await navigator.clipboard.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1400) } catch { /* clipboard blocked; the number is on screen */ }
  }

  const current = sheet ? sheetFor(sheet) : null

  return (
    <div>
      {/* The sheets, as a row of tabs with counts. */}
      <div className="sticky top-[92px] sm:top-[100px] z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[var(--page)]/90 backdrop-blur-md border-b border-[var(--hairline)]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSheet('')}
            className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${!sheet ? 'border-[var(--feature)] bg-[var(--feature)] text-white' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)]/40'}`}
          >
            Everything <span className="font-mono text-[11px] opacity-70 ml-1">{CATALOG.length}</span>
          </button>
          {SHEETS.map(s => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSheet(s.key)}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${sheet === s.key ? 'border-[var(--feature)] bg-[var(--feature)] text-white' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)]/40'}`}
            >
              {s.name} <span className="font-mono text-[11px] opacity-70 ml-1">{countBySheet[s.key] ?? 0}</span>
            </button>
          ))}
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search the wall"
            aria-label="Search designs"
            className="ml-auto w-full sm:w-56 bg-[var(--surface)] border border-[var(--hairline)] rounded-full px-4 py-1.5 text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-soft)] outline-none focus:border-[var(--feature)]"
          />
        </div>
      </div>

      {/* Sub-sheets, when a sheet is open. */}
      {current && (SUBS[current.key]?.length ?? 0) > 1 && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => setSub('')} className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${!sub ? 'border-[var(--ink)]/60 text-[var(--ink)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
            All {current.name.toLowerCase()}
          </button>
          {SUBS[current.key].map(x => (
            <button key={x.name} type="button" onClick={() => setSub(x.name)} className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${sub === x.name ? 'border-[var(--ink)]/60 text-[var(--ink)]' : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
              {x.name} <span className="font-mono text-[10.5px] opacity-70 ml-0.5">{x.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* The sheet heading. */}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-[length:var(--step-section)] leading-tight text-[var(--ink)]" style={display}>
          {sub ? sub : current ? current.name : query ? 'Search' : 'Everything on the wall'}
        </h2>
        <p className="text-[13px] font-mono tracking-[0.06em] text-[var(--ink-soft)] tabular-nums">
          {shown.length} {shown.length === 1 ? 'design' : 'designs'}
        </p>
      </div>
      {current?.line && !sub && <p className="mt-1.5 text-[length:var(--step-row)] text-[var(--ink-soft)] max-w-[60ch]">{current.line}</p>}

      {/* The plates. */}
      <ul className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 list-none p-0 m-0">
        {shown.map(el => (
          <li key={el.id} id={el.id}>
            <button
              type="button"
              onClick={() => setOpen(el)}
              title={el.label}
              className="group block w-full aspect-square rounded-[var(--r-tile)] bg-[#123F47] border border-[#16525C] hover:border-[#7FCFD4] p-2.5 sm:p-3 transition-colors"
            >
              <img src={el.thumb} alt={el.label} loading="lazy" decoding="async" className="h-full w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" style={el.dark ? undefined : INK} />
            </button>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="col-span-full py-10 text-center text-[var(--ink-soft)]">
            Nothing on the wall by that name. Try a sheet, or <Link href="/engrave" className="text-[var(--feature)] hover:underline">send me what you have in mind</Link>.
          </li>
        )}
      </ul>

      {/* One plate, large. */}
      {open && (
        <>
          <div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(null)} aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${sheetFor(open.category).name} design`}
            className="fixed z-[90] inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[8vh] sm:w-full sm:max-w-3xl max-h-[84vh] overflow-y-auto bg-[var(--page)] border border-[var(--hairline)] rounded-[var(--r-panel)] shadow-2xl shadow-black/40"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_280px]">
              <div className="bg-[#123F47] p-8 sm:p-12 flex items-center justify-center aspect-square sm:aspect-auto sm:min-h-[420px]">
                <img src={open.thumb} alt={open.label} className="max-h-full max-w-full object-contain" style={{ ...(open.dark ? {} : INK), width: 320, height: 320 }} />
              </div>
              <div className="p-5 sm:p-6 flex flex-col">
                <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">{sheetFor(open.category).name} · {open.sub}</p>
                <p className="mt-1 text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>{open.label}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                  Marks clean on metal, wood, slate, leather, and glass. On a knife or a tumbler it sits beside your words; on a board or a coaster it can carry the piece on its own.
                </p>
                <p className="mt-3 text-[12px] font-mono text-[var(--ink-soft)]">
                  Design no. <span className="text-[var(--ink)]">{open.id.replace('de_', '').slice(0, 8)}</span>
                  <button type="button" onClick={() => copyId(open.id)} className="ml-2 text-[var(--feature)] hover:underline">{copied ? 'copied' : 'copy'}</button>
                </p>
                <div className="mt-auto pt-5 flex flex-col gap-2">
                  <Link href={`/engrave?design=${open.id}`} className="inline-flex items-center justify-center h-11 px-5 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[14.5px] font-semibold transition-colors">
                    Put it on my own thing
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => { try { sessionStorage.setItem('vurmz:design', open.id) } catch { /* private mode */ } }}
                    className="inline-flex items-center justify-center h-11 px-5 rounded-[var(--r-control)] border border-[var(--ink)]/25 hover:border-[var(--ink)] text-[var(--ink)] text-[14.5px] font-semibold transition-colors"
                  >
                    Put it on something from the shop
                  </Link>
                  <button type="button" onClick={() => setOpen(null)} className="mt-1 text-[13px] text-[var(--ink-soft)] hover:text-[var(--ink)]">Back to the wall</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
