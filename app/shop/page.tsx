import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import RotatingTagline from '@/components/RotatingTagline'
import ShopDoors from '@/components/shop/ShopDoors'
import { SOURCING, SIGNATURE } from '@/lib/pricing'
import { SHELF, DOORS } from '@/lib/shop-doors'
import HowItWorks from '@/components/HowItWorks'

// The doors count the live catalog at request time, so this runs on the edge.
export const runtime = 'edge'

export const metadata: Metadata = {
  title: { absolute: 'Engraved Coasters, Boards, Cards and Tags | VURMZ Shop' },
  description: 'The VURMZ shop: engraved coasters, cutting boards, knives, tumblers, tags, and your own piece, made one at a time in Centennial and hand-delivered across the south Denver metro.',
  alternates: { canonical: '/shop' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// The full list, in one line under the doors. The doors are the six
// that matter; this is everything.
const EVERYTHING = [
  { name: 'Your own piece', href: '/engrave' },
  ...[SHELF, ...DOORS].map(d => ({ name: d.name, href: `/shop/${d.key}` })),
  { name: 'The reserve', href: '/shop/reserve' },
]

export default function ShopHome() {
  return (
    <div>
      {/* Masthead */}
      <section className="pt-8 sm:pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="sr-only">Custom Laser Engraving: Gifts, Knives, Tumblers &amp; More</h1>
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">
            VURMZ · Centennial, Colorado
          </p>
          <RotatingTagline
            inline
            accentColor="#C67A6F"
            className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] text-[var(--ink)]"
          />
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            In stock, made to order, or found for you. Brought to your door across the south Denver metro ·{' '}
            <a href={getSmsLink("Hi, I'd like to get something engraved")} className="text-[var(--eyebrow)] font-semibold hover:underline">
              Text {siteInfo.phone}
            </a>
          </p>
          <div className="mt-6 border-t-2 border-[var(--hairline)]" aria-hidden />
          <div className="mt-[3px] mb-4 border-t border-[var(--hairline)]" aria-hidden />
        </div>
      </section>

      {/* Already own it: the house offer, first. */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/engrave" className="group grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] rounded-[var(--r-band)] border border-[var(--feature)]/40 bg-[var(--surface)] hover:bg-[var(--glass-soft)] overflow-hidden transition-colors duration-[var(--t-hover)]">
            <div className="p-6 sm:p-8">
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">Already own it?</p>
              <p className="text-[length:var(--step-section)] leading-[1.05] text-[var(--ink)]" style={display}>
                Your own piece, engraved. ${SIGNATURE.startingAt}.
              </p>
              <p className="mt-3 max-w-[52ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
                Knife, tool, laptop, flask. Send a photo and I tell you if I can mark it and what it costs. Back within the week.
              </p>
              <span className="mt-5 inline-flex items-center h-10 px-5 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold group-hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]">Send a photo</span>
            </div>
            <div className="relative min-h-[200px] md:min-h-0">
              <Image src="/portfolio/macbook-engraving.jpg" alt="A MacBook lid engraved with a columbine" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/30 to-transparent" aria-hidden />
            </div>
          </Link>
        </div>
      </section>

      {/* The doors. Each opens on its own page, one list, cheapest to dearest. */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopDoors houseSlug="engrave-your-item" />
          <p className="mt-8 text-[length:var(--step-row)] text-[var(--ink-soft)]">
            Everything:{' '}
            {EVERYTHING.map((e, i) => (
              <span key={e.href}>
                <Link href={e.href} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{e.name.toLowerCase()}</Link>
                {i < EVERYTHING.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>
          <p className="mt-4 text-[length:var(--step-row)] text-[var(--ink-soft)]">
            Anything marked <span className="text-[var(--feature)]">found for you</span> is a piece I go and buy at its price, plus ${SOURCING.reserveFee} to find it, mark it, and bring it.
            Not on the list? Tell me what you are looking for and I will source it.
          </p>
        </div>
      </section>

      <HowItWorks />

      {/* Close */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[length:var(--step-section)] text-[var(--ink)] mb-3" style={display}>Not sure what to get?</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-6">
            Text me who it is for and what they are into. I will point you at the right thing, or find it.
          </p>
          <a
            href={getSmsLink("Hi Zach, I'm looking for a gift for ")}
            className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[15px] font-semibold transition-colors"
          >
            Text {siteInfo.founder.name} at {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
