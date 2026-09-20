import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import RotatingTagline from '@/components/RotatingTagline'
import ShopDoors from '@/components/shop/ShopDoors'
import { SOURCING, SIGNATURE } from '@/lib/pricing'
import HowItWorks from '@/components/HowItWorks'

// The doors count the live catalog at request time, so this runs on the edge.
export const runtime = 'edge'

export const metadata: Metadata = {
  title: { absolute: 'Engraved Coasters, Boards, Cards and Tags | VURMZ Shop' },
  description: 'The VURMZ menu: engraved coasters, cutting boards, metal cards, tags, and your own piece, made one at a time in Centennial and hand-delivered across the south Denver metro.',
  alternates: { canonical: '/shop' },
}

// What people actually hand me. Drawn from real jobs, not a wish list, and
// deliberately specific: a category name ("drinkware") tells nobody whether
// their thing qualifies. A flask does.
const BRING = [
  'Knives, yours or a gift',
  'Tumblers and water bottles',
  'Laptop lids and tablet backs',
  'Cutting boards',
  'Flasks and wine glasses',
  'Hand tools and saws',
  'Wallets and leather',
  'Pet bowls and collar tags',
  'Mirrors and glass',
  'Lighters and pocket carry',
  'Awards and plaques',
  'The one thing that is not on this list',
]

// Real pieces, captioned by the material and process recorded in
// lib/portfolio.ts. No invented specs.
const WORK = [
  {
    src: '/portfolio/tumbler-cherry-creek-37.jpg',
    alt: 'Engraved 20 oz tumbler for a Cherry Creek business',
    title: 'Branded tumbler',
    spec: 'Powder-coated stainless, coating removed',
  },
  {
    src: '/portfolio/denver-map-mirror-closeup.jpg',
    alt: 'Denver metro street map engraved on a beveled mirror',
    title: 'Denver map on mirror',
    spec: 'Beveled mirror glass, silvering removed',
  },
  {
    src: '/portfolio/pocket-knife-engraved.jpg',
    alt: 'Pocket knife with an engraved pattern on the bolster',
    title: 'Pocket knife',
    spec: 'Stainless folding blade, annealed',
  },
  {
    src: '/portfolio/water-bottle-custom-engraved.jpg',
    alt: 'Custom engraved water bottle',
    title: 'Water bottle',
    spec: 'Powder-coated steel, coating removed',
  },
]

export default function ShopHome() {
  return (
    <div>
      {/* Menu cover: centered masthead, the tagline on one plane, a double rule */}
      <section className="pt-8 sm:pt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="sr-only">Custom Laser Engraving: Gifts, Knives, Tumblers &amp; More</h1>
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">
            VURMZ · Centennial, Colorado
          </p>
          <RotatingTagline
            inline
            accentColor="#7FCFD4"
            className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] text-white/95"
          />
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            On the shelf, made to order, or found for you. Brought to your door across the south Denver metro ·{' '}
            <a href={getSmsLink("Hi, I'd like to get something engraved")} className="text-[var(--eyebrow)] font-semibold hover:underline">
              Text {siteInfo.phone}
            </a>
          </p>
          <p className="text-[13px] text-[var(--ink-soft)] mt-1.5">
            Stocked pieces in a day or two. One person, start to finish.
          </p>
          <div className="mt-6 border-t-2 border-white/20" aria-hidden />
          <div className="mt-[3px] mb-4 border-t border-white/20" aria-hidden />
        </div>
      </section>

      {/* The house offer, first: your own piece. */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop/bring-your-own" className="group grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] rounded-[var(--r-band)] border border-[#7FCFD4]/35 bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)]">
            <div className="p-6 sm:p-8">
              <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4] mb-3">Your stuff</p>
              <p className="text-[length:var(--step-section)] leading-[1.05] text-white/95" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                Your own piece, engraved. ${SIGNATURE.startingAt}.
              </p>
              <p className="mt-3 max-w-[52ch] text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/80">
                The thing you already own, marked. One piece, one placement, your words or a design, back within the week. A little more for the large or the intricate.
              </p>
              <span className="mt-5 inline-flex items-center h-10 px-5 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold group-hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]">Start yours</span>
            </div>
            <div className="relative min-h-[200px] md:min-h-0">
              <Image src="/portfolio/macbook-engraving.jpg" alt="A MacBook lid engraved with a columbine" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#123F47] via-[#123F47]/30 to-transparent md:bg-gradient-to-r" aria-hidden />
            </div>
          </Link>
        </div>
      </section>

      {/* The doors. Each opens on its own page, one list, cheapest to dearest. */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShopDoors houseSlug="engrave-your-item" />
          <p className="mt-10 text-[length:var(--step-row)] text-[#DED6C3]/70">
            Anything marked <span className="text-[#7FCFD4]">found for you</span> is a piece I go and buy at its price, plus ${SOURCING.reserveFee} to find it, mark it, and bring it.
            Not on the list? Tell me what you are looking for and I will source it.{' '}
            <Link href="/shop/reserve" className="text-[#7FCFD4] hover:text-white transition-colors">The reserve, in full.</Link>
          </p>
        </div>
      </section>

      {/* ═══════════ BRING YOUR OWN ═══════════
          The glass panel, same treatment as the trades page: a plain list of
          what people hand me, no prices, because the answer is one price. */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/12 rounded-[var(--r-panel)] p-6 sm:p-7">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#7FCFD4] mb-4">
              What people bring me
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5 list-none p-0 m-0">
              {BRING.map(item => (
                <li key={item} className="text-[15px] leading-snug text-[var(--ink-soft)] flex gap-2.5">
                  <span className="text-[var(--eyebrow)] flex-shrink-0" aria-hidden>·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Anything solid takes a mark: metal, wood, glass, leather, slate, acrylic, plastic. Your own
              piece is one price within a palm-sized mark, a little more for the large or the intricate,
              and it is back in your hands within the week. Do not have the piece yet? Happy to source:
              named, found, engraved, and brought to you, the piece at its price plus ${SOURCING.reserveFee}.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE WORK ═══════════
      <section className="pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)]">
              Off the machine
            </p>
            <Link href="/services/portfolio" className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
              See the rest of the work
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WORK.map(w => (
              <figure key={w.src} className="m-0">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[var(--feature-deep)]">
                  <Image src={w.src} alt={w.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
                <figcaption className="mt-2.5">
                  <p className="text-[14.5px] font-semibold leading-snug text-[var(--ink)]">{w.title}</p>
                  <p className="text-[12.5px] font-mono tracking-[0.06em] text-[var(--ink-soft)]">{w.spec}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[length:var(--step-section)] font-semibold text-[var(--ink)] mb-4">Ready?</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8">
            Text me a photo of what you want engraved. I&apos;ll tell you if I can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="puffy-btn inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-lead)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} at {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
