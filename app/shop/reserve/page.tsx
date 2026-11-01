import type { Metadata } from 'next'
import Link from 'next/link'
import ReserveList from '@/components/shop/ReserveList'
import { RESERVE_CATEGORIES } from '@/lib/sourcing'
import { SOURCING, SIGNATURE, ONSITE } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: { absolute: 'The Reserve | VURMZ' },
  description: 'The chef knife, the pocket knife, the skillet, the board, the wallet, the cooler: found, engraved with your words, and hand-delivered across the south Denver metro.',
  alternates: { canonical: '/shop/reserve' },
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const panel = 'rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)]'

// The page's other offers. Every number is read from lib/pricing so this
// page can never drift from the posted terms.
const OFFERS = [
  {
    h: 'The laser, at your table',
    p: `A half day on site from ${usd(ONSITE.halfDay)}. Client dinners, launches, the holiday party. Guests watch their piece marked and take it home.`,
    cta: 'How a day on site works',
    href: '/services/live-engraving',
  },
  {
    h: 'Jewelry and watches',
    p: `Rings, pendants, case backs, bracelets. Names, dates, coordinates, a line of handwriting. From ${usd(SIGNATURE.jewelryFrom)}.`,
    cta: 'Send a photo',
    href: getSmsLink('Hi Zach. I have a piece of jewelry to mark: '),
  },
  {
    h: 'Cards for the office',
    p: 'Anodized aluminum, designed here on the site, so you see the layout before a single card is cut. Sets of ten and up.',
    cta: 'Design a set',
    href: '/shop/business',
  },
]

export default function ReservePage() {
  return (
    <div className="pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link href="/shop" className="text-[length:var(--step-fine)] font-mono tracking-[0.18em] uppercase text-[var(--feature)] hover:text-[var(--ink)] transition-colors">
          All categories
        </Link>

        <header className="mt-6 max-w-[62ch]">
          <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
            The reserve
          </h1>
          <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            Pieces I go and buy for you: a chef knife, a folder, a skillet, a board, a wallet,
            a cooler, the ones I would buy myself. I source it, mark it with your words, and
            bring it to your door, receipt in the box.
          </p>
          <p className="mt-3 font-mono text-[length:var(--step-fine)] tracking-[0.04em] text-[var(--ink-soft)]">
            Piece at cost. {usd(SOURCING.reserveFee)} for everything else: finding it, marking it, bringing it.
          </p>
        </header>

        <div className="mt-8">
          <ReserveList />
        </div>

        <div className={`mt-8 ${panel} p-5 sm:p-8`}>
          <p className="text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>
            Not on the list? Good.
          </p>
          <p className="mt-3 max-w-[64ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
            Most of what I source is something a customer named: a particular steel, a watch, a bigger board, a piece from a maker I have not listed, the everyday brands too.
            Tell me what you are looking for and I will find it. The piece is at cost, what it costs to buy, receipt in the box. The {usd(SOURCING.reserveFee)} is the fee on top, and it covers finding it, engraving it, and delivering it.
            A deposit holds the piece before I buy, fully returned if you change your mind before then.
          </p>
          <a
            href={getSmsLink('Hi Zach. I am looking for a ')}
            className="puffy-btn mt-6 inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
          >
            Tell me what you are looking for
          </a>
        </div>

        <p className="mt-12 text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-5">
          Also here
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFERS.map(o => (
            <div key={o.h} className={`${panel} p-5 sm:p-6 flex flex-col`}>
              <h2 className="text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>{o.h}</h2>
              <p className="mt-2.5 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)] flex-1">{o.p}</p>
              <Link href={o.href} className="mt-5 inline-flex items-center gap-2 text-[length:var(--step-body)] font-semibold text-[var(--feature)] hover:text-[var(--ink)] transition-colors duration-[var(--t-hover)]">
                {o.cta}
                <span aria-hidden>&rsaquo;</span>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[56ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
          Same hands, same care, same delivery run as everything else I make. Made and delivered from {siteInfo.city}.
        </p>
        <p className="mt-6 max-w-[64ch] text-[11px] leading-relaxed text-[var(--ink-soft)]/80">
          VURMZ is an independent engraver, not affiliated with or endorsed by any maker named here. Engraving a piece may void its maker&apos;s warranty. The deposit, cancellation, and guarantee terms are in the <Link href="/terms" className="underline decoration-[var(--hairline)] hover:text-[var(--ink)]">terms</Link>.
          {RESERVE_CATEGORIES.some(c => c.photo) && (
            <>
              {' '}Photographs by{' '}
              {RESERVE_CATEGORIES.filter(c => c.photo).map((c, i, arr) => (
                <span key={c.key}>
                  <a href={c.photo!.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--hairline)] hover:text-[var(--ink)]">{c.photo!.credit}</a>
                  {i < arr.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
