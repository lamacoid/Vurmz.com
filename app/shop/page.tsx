import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, SOURCING, DELIVERY } from '@/lib/pricing'
import RotatingTagline from '@/components/RotatingTagline'
import MenuShop from '@/components/shop/MenuShop'

// MenuShop reads the live catalog at request time → must run on the edge.
export const runtime = 'edge'

export const metadata: Metadata = {
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
  'The odd thing you are holding',
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
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)]"
          />
          <p className="text-sm text-[var(--ink-soft)] mt-3">
            Engraved goods, hand-delivered across the South Denver metro ·{' '}
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
              Anything solid takes a mark: metal, wood, glass, leather, acrylic, plastic, stone.
              Your thing engraved is ${SIGNATURE.startingAt} flat within size, a little more for big
              or complicated. Do not have it yet? I will source it, engrave it and deliver it for a
              ${SOURCING.fee} finder&apos;s fee plus the item.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE WORK ═══════════ */}
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

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { n: 1, h: 'Text me', p: "Send a photo of what you want engraved. I'll get back to you with a quote." },
              { n: 2, h: 'I engrave it', p: 'One person handles your order start to finish. No outsourcing.' },
              { n: 3, h: 'Hand-delivered', p: `I bring it to your door across the South Denver metro. Free over $${DELIVERY.freeThreshold}.` },
            ].map(step => (
              <div key={step.n}>
                <div className="w-10 h-10 rounded-full bg-[#7FCFD4]/15 border border-[#7FCFD4]/20 flex items-center justify-center mb-3 mx-auto">
                  <span className="text-[#7FCFD4] font-bold">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-1">{step.h}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-4">Ready?</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-8">
            Text me a photo of what you want engraved. I&apos;ll tell you if I can do it, what it&apos;ll cost, and when it&apos;ll be done.
          </p>
          <a
            href={getSmsLink("Hi, I'd like to get something engraved")}
            className="puffy-btn inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C67A6F] text-white font-semibold text-base rounded-sm hover:bg-[#B0675D] transition-colors"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            Text {siteInfo.founder.name} at {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
