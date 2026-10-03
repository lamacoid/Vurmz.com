import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'
import { getCategoryBySlug } from '@/lib/categories'
import { SIGNATURE, DELIVERY, SOURCING } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: { absolute: 'Already own the thing? Engrave it | VURMZ, Centennial CO' },
  description: `Knife, tool, laptop, flask, the odd piece of metal from your garage. Send a photo and get a number the same day. One piece from $${SIGNATURE.startingAt}, hand-delivered across the south Denver metro.`,
  alternates: { canonical: '/engrave' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// What people actually hand me. Specific on purpose: a category name tells
// nobody whether their thing qualifies. A flask does.
const BRING = [
  'Knives, yours or a gift',
  'Tumblers and water bottles',
  'Laptop lids and tablet backs',
  'Cutting boards',
  'Flasks and glasses',
  'Hand tools and saws',
  'Wallets and leather',
  'Pet bowls and collar tags',
  'Mirrors and glass',
  'Lighters and pocket carry',
  'Awards and plaques',
  'The thing that is not on this list',
]

const PROOF = [
  { src: '/portfolio/macbook-engraving.jpg', alt: 'A MacBook lid engraved with a columbine' },
  { src: '/portfolio/pocket-knife-engraved.jpg', alt: 'A pocket knife with an engraved bolster' },
  { src: '/portfolio/water-bottle-custom-engraved.jpg', alt: 'A powder-coated water bottle, engraved' },
  { src: '/portfolio/engraved-hand-saw.jpg', alt: 'A hand saw with an engraved blade' },
]

export default function EngravePage() {
  const faqs = (getCategoryBySlug('bring-your-own')?.faqs ?? [])
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      <header className="max-w-[60ch]">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">Engrave your stuff</p>
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
          Already own the thing?
        </h1>
        <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          Knife. Tool. Laptop. Flask. Weird piece of metal from your garage. Send me a photo and I will tell you if I can mark it and what it costs.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 lg:gap-10 items-start">
        <CanYouEngraveThis />

        <aside className="space-y-6">
          <div className="rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--feature)] mb-3">The price</p>
            <p className="text-[length:var(--step-section)] leading-none text-[var(--ink)]" style={display}>${SIGNATURE.startingAt}</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              One piece, one placement, your words or one design from the library, within a palm-sized mark. That is most jobs.
              Larger marks, both sides, deep marking, full wraps, or a logo I have to redraw run a little more. I confirm any extra before anything runs.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              Most pieces are back within the week. Hand-delivered across the {DELIVERY.area}, free over ${DELIVERY.freeThreshold}.
            </p>
            <Link href="/shop/p/engrave-your-item" className="mt-4 inline-flex items-center text-[14px] text-[var(--feature)] hover:text-[var(--ink)] transition-colors">
              Know what you want already? Order it now.
            </Link>
          </div>

          <div className="room rounded-[var(--r-panel)] border border-[var(--glass-edge)] p-5 sm:p-6 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(ellipse 80% 70% at 10% 0%, rgba(127,207,212,0.18) 0%, transparent 60%)' }}>
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-3">Do not have it yet?</p>
            <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">Tell me what you want. I go get it.</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              I order it, mark it, and bring it to you. One delivery instead of three: no box to wait on, no handoff, no second trip. The piece at its price, plus ${SOURCING.reserveFee}.
            </p>
            <Link href="/shop/reserve" className="mt-3 inline-flex items-center text-[14px] font-semibold text-[var(--eyebrow)] hover:underline">
              What I find for people
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PROOF.map(p => (
              <div key={p.src} className="relative aspect-square rounded-[var(--r-tile)] overflow-hidden border border-[var(--hairline)]">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover" />
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)] mb-4" style={display}>What people bring me</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
            {BRING.map(item => (
              <li key={item} className="text-[15px] leading-snug text-[var(--ink-soft)] flex gap-2.5">
                <span className="text-[var(--feature)] flex-shrink-0" aria-hidden>·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
            Metal, wood, glass, leather, slate, acrylic, plastic. If it is solid, it takes a mark.
          </p>
        </div>
        <div>
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)] mb-4" style={display}>Getting it to me</h2>
          <ol className="space-y-3 list-none p-0 m-0">
            {[
              'Send the photo here or by text. I answer with a number the same day.',
              'Drop it off anywhere in the south Denver metro, or ship it to me.',
              'It comes back engraved, by one person, start to finish.',
            ].map((s, i) => (
              <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                <span className="w-7 h-7 flex-shrink-0 rounded-full border border-[var(--feature)]/40 text-[var(--feature)] font-mono text-[12px] flex items-center justify-center">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="mt-14 max-w-[70ch]">
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)] mb-4" style={display}>Questions I get</h2>
          <dl className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {faqs.map(f => (
              <div key={f.question} className="py-4">
                <dt className="text-[15.5px] font-semibold text-[var(--ink)]">{f.question}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <p className="mt-12 text-[14px] text-[var(--ink-soft)]">
        Faster to talk? Text {siteInfo.founder.name} at{' '}
        <a href={getSmsLink('Hi Zach, can you engrave this? ')} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{siteInfo.phone}</a>.
      </p>
    </div>
  )
}
