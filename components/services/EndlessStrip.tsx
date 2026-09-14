'use client'
/**
 * The crawl: one faint, large line of everything the shop marks, rolling
 * across the page as texture rather than as a list to read. Materials
 * first, then items from the endless-ideas lists. Decorative, hidden from
 * screen readers, still for people who asked for reduced motion.
 */
import { useMemo } from 'react'
import { LINES } from '@/components/ItemScroller'

const MATERIALS = [
  'Anodized aluminum', 'Stainless steel', 'Brass', 'Titanium', 'Tool steel', 'Powder coat',
  'Bamboo', 'Walnut', 'Maple', 'Pine', 'Leather', 'Slate', 'ABS', 'Polycarbonate', 'Mirror',
]

// Business, hospitality, trades, sports and gear, arts. The gift lines
// stay on the shop side.
const LINE_PICKS = [0, 1, 2, 4, 7]

function interleave(...lists: string[][]): string[] {
  const out: string[] = []
  const max = Math.max(...lists.map(l => l.length))
  for (let i = 0; i < max; i++) for (const l of lists) if (l[i]) out.push(l[i])
  return out
}

export default function EndlessStrip({ className = '' }: { className?: string }) {
  const items = useMemo(() => {
    const picked = LINE_PICKS.map(i => LINES[i]?.items ?? []).filter(l => l.length)
    return interleave(MATERIALS, ...picked)
  }, [])
  const row = (
    <>
      {items.map((it, i) => (
        <span key={`${it}-${i}`} className="inline-flex items-center">
          <span className="whitespace-nowrap">{it}</span>
          <span aria-hidden className="mx-5 inline-block w-1.5 h-1.5 rounded-full bg-[var(--signal)]/70" />
        </span>
      ))}
    </>
  )
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      aria-hidden
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div
        className="flex w-max text-[length:var(--step-section)] sm:text-[46px] leading-none text-[var(--ink)]/[0.32] [animation:scroll-left_260s_linear_infinite] motion-reduce:[animation:none]"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
      >
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  )
}
