import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import RotatingTagline from '@/components/RotatingTagline'
import MenuShop from '@/components/shop/MenuShop'
import { SOURCED, deliveredPrice } from '@/lib/sourcing'
import { SOURCING } from '@/lib/pricing'
import HowItWorks from '@/components/HowItWorks'

// MenuShop reads the live catalog at request time → must run on the edge.
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
    spec: 'Powder-coated stainless, fiber laser',
  },
  {
    src: '/portfolio/denver-map-mirror-closeup.jpg',
    alt: 'Denver metro street map engraved on a beveled mirror',
    title: 'Denver map on mirror',
    spec: 'Beveled mirror glass, fiber ablation',
  },
  {
    src: '/portfolio/pocket-knife-engraved.jpg',
    alt: 'Pocket knife with an engraved pattern on the bolster',
    title: 'Pocket knife',
    spec: 'Stainless folding blade, fiber laser',
  },
  {
    src: '/portfolio/water-bottle-custom-engraved.jpg',
    alt: 'Custom engraved water bottle',
    title: 'Water bottle',
    spec: 'Powder-coated steel, fiber laser',
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
            accentColor="#C67A6F"
            className="text-[length:var(--step-section)] font-semibold text-[var(--ink)]"
          />
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            Made to order, one at a time, and brought to your door across the south Denver metro ·{' '}
            <a href={getSmsLink("Hi, I'd like to get something engraved")} className="text-[var(--eyebrow)] font-semibold hover:underline">
              Text {siteInfo.phone}
            </a>
          </p>
          <p className="text-[13px] text-[var(--ink-soft)] mt-1.5">
            Most pieces in 24 to 72 hours. You approve a proof photo before anything runs.
          </p>
          <div className="mt-6 border-t-2 border-[var(--ink)]/25" aria-hidden />
          <div className="mt-[3px] mb-4 border-t border-[var(--ink)]/25" aria-hidden />
        </div>
      </section>

      {/* Everything I make, on one typeset card. Gift side and business packs
          both: this is the only catalog, so there is one place to keep current. */}
      <MenuShop />

      {/* ═══════════ BRING YOUR OWN ═══════════
          The glass panel, same treatment as the trades page: a plain list of
          what people hand me, no prices, because the answer is one price. */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[rgba(127,207,212,.18)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-4">
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
              and you see a proof before it runs. Do not have the piece yet? Happy to source, for a fee:
              named, found, engraved, and brought to you, the item at cost.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ HAPPY TO SOURCE ═══════════
          The offer in Zach's words. Name the piece, it arrives engraved.
          The list is real retail on a real day; the number is delivered. */}
      <section id="source" className="pb-10 sm:pb-14 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-2">Happy to source, for a fee</p>
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
              Name the piece. It arrives engraved.
            </h2>
            <p className="mt-2 max-w-[62ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
              I go and get it, engrave it, and bring it to your door. The item at cost with the receipt, the engraving,
              and a fee for the errand: ${SOURCING.feeUnder100} under $100, ${SOURCING.feeUnder300} to $300, twenty percent above that.
              A few I make often, with what they come to delivered:
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {SOURCED.map((it, i) => (
                <div key={it.name} className={`flex flex-col py-2.5 border-b border-[var(--hairline)] ${i >= SOURCED.length - 2 ? 'sm:border-b-0' : ''}`}>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{it.name}</span>
                    <span className="text-[length:var(--step-body)] text-[var(--eyebrow)] font-semibold whitespace-nowrap">${deliveredPrice(it)}</span>
                  </span>
                  <span className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">{it.material}. {it.where}.</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[length:var(--step-fine)] leading-relaxed text-[var(--ink-soft)]">
              Anything else, name it. A deposit for the item and half the service holds it before I buy; the balance when you
              approve the proof photo. Cancel before I buy and it is all returned. After engraving, it is yours.
              Glass and crystal are the one thing I do not mark.
            </p>
            <a
              href={getSmsLink('Hi Zach. Happy to source: I would like a ')}
              className="puffy-btn mt-5 inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
            >
              Name the piece
            </a>
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
