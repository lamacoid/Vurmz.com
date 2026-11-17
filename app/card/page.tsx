import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'
import { CARD_OFFER, SIGNATURE, DELIVERY } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

// Where the QR code on the community board cards lands. The address is
// engraved in metal, so /card has to keep working for as long as a card is
// pinned to a board somewhere. Kept out of search: the offer is for people
// who found a card.
export const metadata: Metadata = pageMeta({
  title: 'Thanks for scanning | VURMZ',
  description: `You found a VURMZ card. Send a photo of what you want engraved and the price comes back ${CARD_OFFER.percentOff}% off.`,
  path: '/card',
  noindex: true,
})

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const off = CARD_OFFER.percentOff

export default function CardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      <header className="max-w-[60ch]">
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
          <span className="block text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">You found a card</span>
          Thanks for scanning.
        </h1>
        <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          That gets you {off}% off. Send me a photo of the thing and I will send back a price with the {off}% already taken off.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 lg:gap-10 items-start">
        <CanYouEngraveThis cardOffer={off} />

        <aside className="space-y-6">
          <div className="rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--feature)] mb-3">How it works</p>
            <ol className="space-y-3 list-none p-0 m-0">
              {[
                'Send the photo here or by text. I answer with a price the same day.',
                'Drop it off anywhere in the south Denver metro, or ship it to me.',
                'It comes back engraved and hand-delivered.',
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                  <span className="w-7 h-7 flex-shrink-0 rounded-full border border-[var(--feature)]/40 text-[var(--feature)] font-mono text-[12px] flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--feature)] mb-3">The price</p>
            <p className="text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              Engraving on a piece you own starts at ${SIGNATURE.startingAt}, before your {off}%. Hand-delivered across the {DELIVERY.area}.
            </p>
            <Link href="/engrave" className="mt-3 inline-flex items-center text-[14px] text-[var(--feature)] hover:text-[var(--ink)] transition-colors">
              See what people bring me
            </Link>
          </div>
        </aside>
      </div>

      <p className="mt-12 text-[14px] text-[var(--ink-soft)]">
        Faster to talk? Text {siteInfo.founder.name} at{' '}
        <a href={getSmsLink(`Hi Zach, I scanned your card (${off}% off). Can you engrave this? `)} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{siteInfo.phone}</a>{' '}
        and say you scanned the card.
      </p>
    </div>
  )
}
