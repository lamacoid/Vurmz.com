import type { Metadata } from 'next'
import Link from 'next/link'
import FlashSheet from '@/components/designs/FlashSheet'
import { CATALOG, SHEETS } from '@/lib/design/sheet'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: { absolute: `${CATALOG.length} engraving designs, the wall | VURMZ` },
  description: `Browse ${CATALOG.length} designs ready to engrave: botanicals, animals, skulls, gothic, outdoors, symbols, geometric, emblems, frames, home, food and drink, holidays. Pick one and put it on your own thing or on something from the shop.`,
  alternates: { canonical: '/designs' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

export default function DesignsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      <header className="max-w-[64ch]">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">The wall</p>
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
          {CATALOG.length} designs, ready to engrave.
        </h1>
        <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          Browse it like flash on a shop wall. Pick a sheet, find the one, and put it on your own thing or on something from the shop. Every design marks clean in metal, wood, slate, leather, and glass.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-soft)]">
          Monograms and names are set in type, not drawn, so they live on the product page: pick a face there. Have your own artwork? <Link href="/engrave" className="text-[var(--feature)] hover:underline">Send it with a photo of the piece.</Link>
        </p>
      </header>

      <div className="mt-8">
        <FlashSheet />
      </div>

      <section className="mt-16 pt-8 border-t border-[var(--hairline)] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)] mb-3" style={display}>How a design gets onto a piece</h2>
          <ol className="space-y-2 list-none p-0 m-0 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
            <li>1. Pick it here, or on the product page under Choose a design.</li>
            <li>2. Add words if you want them. The design and the words share the mark.</li>
            <li>3. Tell me where it goes, or leave that to me.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)] mb-3" style={display}>The sheets</h2>
          <p className="text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
            {SHEETS.map(s => s.name).join(', ')}. Not on the wall? Describe it, or text {siteInfo.founder.name} at{' '}
            <a href={getSmsLink('Hi Zach, I am looking for a design: ')} className="text-[var(--feature)] hover:underline">{siteInfo.phone}</a>, and I will draw it or find it.
          </p>
        </div>
      </section>
    </div>
  )
}
