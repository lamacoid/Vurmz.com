'use client'

import Link from 'next/link'
import { BUSINESS_REF } from '@/lib/seo'
import Image from 'next/image'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, SOURCING, SHOP_RATE, ONSITE } from '@/lib/pricing'
import TrustedBy from '@/components/TrustedBy'
import ItemScroller from '@/components/ItemScroller'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'
import IdeaBoard from '@/components/services/IdeaBoard'

/**
 * /services, 2026-11-12. This is the September 19 page (the brief, what
 * comes back, precision and materials, the work, posted prices, on site,
 * the account) brought back after the later rounds cut it to a rate
 * sheet and then to almost nothing. Zach: "retain previous version
 * before we did all the simplifying, then simplify that by like 30
 * percent." Each block keeps its place and loses about a third: five
 * brief items to four, five precision points to three, nine materials to
 * six, nine lanes to six, the event rate card to three rows with a link.
 * Gone entirely: the "just me" block (no solo framing) and the proof
 * line (no proof language). Added: the idea board he asked for, and the
 * quote form the later page gained. Every number reads from lib/pricing.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const eyebrow = 'text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)]'
const panel = 'bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8'
const wrap = 'max-w-[1280px] mx-auto px-5 sm:px-11'
const coralBtn = 'puffy-btn inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]'
const bloom = { backgroundImage: 'radial-gradient(ellipse 70% 60% at 15% 0%, rgba(127,207,212,0.16) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(13,47,53,0.85) 0%, transparent 60%)' }

// $3 stays $3, $7.5 becomes $7.50. Prices are written as people say them.
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)
const usd = (n: number) => `$${n.toLocaleString('en-US')}`

// Real business jobs, stated by client, material, and process. Each
// points at the lane it belongs to so the photo and the price sit one
// tap apart.
const WORK: { src: string; alt: string; title: string; spec: string; lane: string; href: string }[] = [
  { src: '/portfolio/wolverines-knife.jpg', alt: 'KA-BAR knife engraved with the Colorado Wolverines logo', title: 'Five KA-BARs, Colorado Wolverines', spec: 'Coated steel, marked through the coating', lane: 'Knives and tools', href: '/services/knife-engraving' },
  { src: '/portfolio/clga-faceplate-closeup.jpg', alt: 'Engraved amp faceplate for County Line Guitar Amps', title: 'Amp faceplates, County Line Guitar Amps', spec: 'Brushed metal, engraved, recurring', lane: 'Plates and panels', href: '#lanes' },
  { src: '/images/portfolio/integrity-backflow-coaster.jpg', alt: 'Slate coaster engraved with the Integrity Backflow logo', title: 'Logo coasters, Integrity Backflow', spec: 'Natural slate', lane: 'Branded packs', href: '/shop' },
  { src: '/portfolio/three-willows-coasters.jpg', alt: 'Slate coasters engraved for Three Willows Ranch', title: 'Coasters, Three Willows Ranch', spec: 'Slate, both sides', lane: 'Branded packs', href: '/shop' },
  { src: '/portfolio/culinary-cleaver-engraved.jpg', alt: 'Chef cleaver engraved with a name', title: 'Cleaver, named for the chef', spec: 'Knife steel, annealed', lane: 'Knives and tools', href: '/services/knife-engraving' },
  { src: '/portfolio/tumbler-cherry-creek-37.jpg', alt: 'Powder-coated tumbler engraved with a Cherry Creek business logo', title: 'Branded tumblers, Cherry Creek', spec: 'Powder-coated stainless, coating removed', lane: 'Anything one-off', href: '/engrave' },
]

// The lanes, posted. Values read from the catalog so a row can never
// drift from the real price.
const LANES: { name: string; value: string; note?: string; href?: string }[] = [
  {
    name: 'Custom metal tags',
    value: `from ${price(CATALOG.serviceTags.aluminumBase)} a tag`,
    note: `Small steel and aluminum tags. Tell me what you need and we will figure it out. Steel from ${price(CATALOG.serviceTags.stainlessBase)}.`,
    href: '/services/metal-tags',
  },
  {
    name: 'Knives and tools',
    value: `${price(CATALOG.tool.base)} a piece`,
    note: `${price(CATALOG.tool.crew.perPiece)} each at ${CATALOG.tool.crew.minQty} or more, ${price(CATALOG.tool.jobsite.perPiece)} at ${CATALOG.tool.jobsite.minQty} or more. I pick up and return.`,
    href: '/services/knife-engraving',
  },
  {
    name: 'Metal cards',
    value: `${price(CATALOG.cards.matteBlackBase * CATALOG.cards.pack)} per ${CATALOG.cards.pack}`,
    note: 'Anodized aluminum and stainless steel, card size. Send your logo and the details, I lay it out.',
    href: '/services/metal-business-cards',
  },
  {
    name: 'Branded pens',
    value: `${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen`,
    note: `Soft-touch stylus pens, packs of ${CATALOG.pens.pack}.`,
    href: '/shop',
  },
  {
    name: 'Plates and panels',
    value: `${price(SHOP_RATE.hourly)} an hour`,
    note: `${SHOP_RATE.minimumMinutes} minute minimum, material quoted. Faceplates, valve tags, control panels, signage.`,
  },
  {
    name: 'Anything one-off',
    value: `from ${price(SIGNATURE.startingAt)}`,
    note: 'Bring the thing. If it is solid and fits the bed, it marks.',
    href: '/engrave',
  },
]

// What I need to quote a job, in the order I ask for it.
const BRIEF = [
  { h: 'A photo of the thing', p: 'The part, the blank, or a link to the product.' },
  { h: 'How many', p: 'Ten knives, 150 pens, one faceplate. A range is fine if you are still deciding.' },
  { h: 'The artwork, or the words', p: 'SVG, PDF, or AI is best. A sharp PNG works. No file? Send the words and I set them.' },
  { h: 'When you need it', p: `Most jobs are ready in 24 to 72 hours. The delivery run is ${siteInfo.deliveryRunDay}.` },
]
const BRIEF_SMS = 'Hi Zach. What: \nHow many: \nArtwork or words: \nNeeded by: '

// What comes back, in order.
const RETURNS = [
  { when: 'Same day', h: 'A number', p: 'The price for that count, delivery included where it applies. No setup fee.' },
  { when: '24 to 72 hrs', h: 'The run', p: 'Same file, same settings, every piece. A batch of 200 matches piece one.' },
  { when: 'The run day', h: 'Hand delivery', p: `Free over $${DELIVERY.freeThreshold}, free at any size on an account. Your files stay on record for the reorder.` },
]

// What precision means here. Claims kept to what the work delivers.
const PRECISION = [
  { h: 'The mark is in the material, not on it', p: 'The laser changes the surface itself. Nothing is printed, glued, or coated, so there is nothing to peel, fade, or rub off.' },
  { h: 'From your file, line for line', p: 'Vector art reproduces as drawn: logos, serials, QR codes, part numbers. Text stays legible down to six point.' },
  { h: 'Placed where you say, the same every time', p: 'Give a position and a size and that is where it lands. The file is saved with its settings, so the reorder in six months matches the first run.' },
]

// Materials and their true marks, from the shop's own material truths.
const MATERIALS = [
  { name: 'Anodized aluminum', mark: 'Dye removed to bare silver metal, whatever the color. Cards, tags, laptop lids.' },
  { name: 'Stainless and tool steel', mark: 'Annealed to a dark mark in the surface, nothing removed. Knives, labels, tools.' },
  { name: 'Powder-coated metal', mark: 'Coating stripped to bare steel. Tumblers, bottles, painted panels.' },
  { name: 'Wood and bamboo', mark: 'A clean burn, darker with more power. Boards, signs, coasters.' },
  { name: 'Leather', mark: 'A dark, slightly recessed mark. Patches, wallets, tags.' },
  { name: 'Slate', mark: 'A pale frost where the surface is removed. Coasters and small signs.' },
]

// What a standing account is. Every line is a real term from lib/pricing.
const ACCOUNT_TERMS = (standingDiscount: string) => [
  { h: 'Your logo on file', p: 'Upload it once. Every reorder is a text and a count.' },
  { h: `Free delivery, every ${siteInfo.deliveryRunDay}`, p: `Any size, anywhere in the ${DELIVERY.area}.` },
  { h: `NET-${BUSINESS.netTermsDays} terms`, p: 'Invoice after delivery.' },
  { h: `${standingDiscount} on standing orders`, p: 'Counted in real units across the account. The tier holds between reorders.' },
]

export default function ServicesClient() {
  const standing = BUSINESS.tiers.find(t => t.name === 'Standing')
  const standingDiscount = standing ? `${Math.round(standing.discount * 100)}% off` : '15% off'

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Laser Engraving',
    name: 'VURMZ Laser Engraving for Business',
    description: 'Custom metal tags, knife crews, metal cards, branded packs, plates and panels, and one-off marking for businesses in the South Denver metro. Posted prices, delivered weekly.',
    provider: BUSINESS_REF,
    areaServed: siteInfo.serviceAreas.map(area => ({ '@type': 'City', name: area })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: SIGNATURE.startingAt, priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-[var(--page)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* ═══════════ MASTHEAD ═══════════ */}
      <section className={`${wrap} pt-8 sm:pt-12 pb-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
          <div>
            <p className={`${eyebrow} mb-3.5`}>For your business</p>
            <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.1] text-[var(--ink)]" style={display}>
              Precision laser engraving and marking<br className="hidden sm:block" /> for the businesses of the south Denver metro.
            </h1>
            <p className="mt-5 max-w-[56ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
              Tell me what you need marked. Send a photo and a count: a number the same day, delivery on {siteInfo.deliveryRunDay}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={getSmsLink('Hi Zach, here is what I need marked: ')} className={coralBtn}>
                Text {siteInfo.phone}
              </a>
              <a
                href="#brief"
                className="inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] border border-[var(--ink)]/25 text-[var(--ink)] text-[length:var(--step-body)] font-semibold hover:border-[var(--ink)] transition-colors duration-[var(--t-hover)]"
              >
                What I need from you
              </a>
            </div>
          </div>

          <div className="bg-[var(--glass)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-5">
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-3">This week</p>
            <div className="text-[length:var(--step-row)] text-[var(--ink-soft)]">
              {[
                ['Next delivery run', siteInfo.deliveryRunDay.slice(0, 3)],
                ['Typical turnaround', '24 to 72 hrs'],
                ['Setup fees', 'None'],
              ].map(([k, v], i, a) => (
                <span key={k} className={`flex justify-between py-[7px] ${i < a.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                  <span>{k}</span>
                  <span className="text-[var(--ink)] font-semibold">{v}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE BRIEF ═══════════
          What I need to quote it, and what comes back. */}
      <section id="brief" className={`${wrap} pb-14 scroll-mt-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className={panel}>
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>What I need from you</h2>
            <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">Four things. One text covers all of them.</p>
            <ol className="mt-5 space-y-4 list-none p-0 m-0">
              {BRIEF.map((b, i) => (
                <li key={b.h} className="grid grid-cols-[28px_1fr] gap-3">
                  <span className="w-7 h-7 rounded-full border-[1.5px] border-[var(--signal)] bg-[var(--glass)] grid place-items-center font-mono text-[length:var(--step-fine)] text-[var(--ink)]">{i + 1}</span>
                  <span>
                    <span className="block text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{b.h}</span>
                    <span className="block text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{b.p}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={getSmsLink(BRIEF_SMS)} className={`${coralBtn} mt-6`}>
              Start the text. The four lines are in it
            </a>
          </div>

          <div className="bg-[var(--glass)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>What you get back</h2>
            <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">In this order, every time.</p>
            <div className="mt-5 text-[length:var(--step-row)] text-[var(--ink-soft)]">
              {RETURNS.map((r, i) => (
                <div key={r.h} className={`grid grid-cols-[92px_1fr] gap-4 py-3 ${i < RETURNS.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                  <span className="font-mono text-[length:var(--step-fine)] text-[var(--ink)] pt-0.5">{r.when}</span>
                  <span>
                    <span className="block text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{r.h}</span>
                    <span className="block leading-relaxed">{r.p}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE IDEA BOARD ═══════════
          Pick what you run, get things worth putting a name on. */}
      <section id="ideas" className={`${wrap} pb-14 scroll-mt-24`}>
        <IdeaBoard />
      </section>

      {/* ═══════════ THE WORK ═══════════
          The photos sit over the same faint marquee the homepage runs
          behind its recent work. */}
      <section id="work" className="relative overflow-hidden py-4 mb-10 scroll-mt-24">
        <div
          className="absolute inset-0 pointer-events-none select-none flex flex-col justify-center"
          aria-hidden
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)',
          }}
        >
          <ItemScroller opacityScale={0.22} />
        </div>
        <div className={`relative z-10 ${wrap}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>The work</h2>
            <Link href="/services/portfolio" className="text-[length:var(--step-row)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-[var(--t-hover)]">
              See the rest of it
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {WORK.map(w => (
              <figure key={w.src} className="m-0">
                <div className="relative aspect-[4/3] rounded-[var(--r-tile)] overflow-hidden bg-[var(--feature-deep)]">
                  <Image src={w.src} alt={w.alt} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <figcaption className="mt-2.5">
                  <p className="text-[length:var(--step-row)] font-semibold leading-snug text-[var(--ink)]">{w.title}</p>
                  <p className="text-[length:var(--step-fine)] font-mono tracking-[0.04em] text-[var(--ink-soft)]">{w.spec}</p>
                  <Link href={w.href} className="inline-block mt-1 text-[length:var(--step-fine)] text-[var(--ink)] border-b border-[var(--signal)] hover:border-[var(--ink)] transition-colors duration-[var(--t-hover)]">
                    {w.lane}
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRECISION ═══════════
          What the laser does, and how each material takes it. */}
      <section id="precision" className={`${wrap} pb-14 scroll-mt-24`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>Precision, and what it means here</h2>
          <Link href="/services/materials" className="text-[length:var(--step-row)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-[var(--t-hover)]">
            The full materials list
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className={panel}>
            <div className="space-y-5">
              {PRECISION.map(pt => (
                <div key={pt.h} className="border-t border-[var(--hairline)] pt-4 first:border-t-0 first:pt-0">
                  <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{pt.h}</p>
                  <p className="mt-1 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{pt.p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={panel}>
            <p className={`${eyebrow} mb-3`}>What marks, and how it looks</p>
            <div className="text-[length:var(--step-row)]">
              {MATERIALS.map((m, i) => (
                <div key={m.name} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-4 py-2.5 ${i < MATERIALS.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                  <span className="font-semibold text-[var(--ink)] leading-snug">{m.name}</span>
                  <span className="leading-snug text-[var(--ink-soft)]">{m.mark}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[length:var(--step-fine)] leading-relaxed text-[var(--ink-soft)]">
              Brass, plastics, mirror, and anything not on this list: text me a photo first.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE LANES, POSTED ═══════════ */}
      <section id="lanes" className={`${wrap} pb-14 scroll-mt-24`}>
        <div className={panel}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>Posted prices</h2>
            <p className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">No setup fees on anything.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {LANES.map(row => {
              const inner = (
                <span className="flex flex-col gap-0.5 py-3 border-b border-[var(--hairline)]">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{row.name}</span>
                    <span className="text-[length:var(--step-body)] text-[var(--eyebrow)] font-semibold whitespace-nowrap">{row.value}</span>
                  </span>
                  {row.note && <span className="text-[length:var(--step-fine)] leading-snug text-[var(--ink-soft)]">{row.note}</span>}
                </span>
              )
              return row.href ? (
                <Link key={row.name} href={row.href} className="block group">{inner}</Link>
              ) : (
                <div key={row.name}>{inner}</div>
              )
            })}
          </div>
          <p className="mt-4 text-[length:var(--step-fine)] leading-relaxed text-[var(--ink-soft)]">
            Installer signature tiles are {price(CATALOG.signatureTiles.perTile)} each. Need a specific piece? I buy it at cost and add {price(SOURCING.reserveFee)}.
            Pens, cards, tags, coasters, and keychains are{' '}
            <Link href="/shop" className="font-semibold text-[var(--eyebrow)] hover:underline">on the shelf</Link>.
          </p>
        </div>
      </section>

      {/* ═══════════ ON SITE ═══════════
          The three numbers. The full rate card has its own page. */}
      <section id="onsite" className={`${wrap} pb-14 scroll-mt-24`}>
        <div className={`${panel} grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center`}>
          <div>
            <p className={`${eyebrow} mb-2`}>VURMZ on site</p>
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>The laser comes to you.</h2>
            <p className="mt-2 max-w-[52ch] text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
              A launch, a holiday event at the store, a member-guest, a wedding. Guests give a name and watch it go into the metal.
            </p>
            <Link href="/services/live-engraving" className="inline-block mt-4 text-[length:var(--step-row)] font-semibold text-[var(--ink)] border-b-[1.5px] border-[var(--coral)] pb-0.5">
              All the on-site rates
            </Link>
          </div>
          <div className="text-[length:var(--step-row)]">
            {[
              ['Half day', usd(ONSITE.halfDay), 'Up to four hours on site'],
              ['Full day', usd(ONSITE.fullDay), 'Up to eight hours'],
              ['Per piece, for a store', `${usd(ONSITE.perPieceRetail)} a piece`, `${ONSITE.perPieceMinimum} piece minimum. You set the guest price.`],
            ].map(([k, v, note], i, a) => (
              <div key={k} className={`flex flex-col py-2.5 ${i < a.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold text-[var(--ink)]">{k}</span>
                  <span className="text-[var(--eyebrow)] font-semibold whitespace-nowrap">{v}</span>
                </span>
                <span className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ THE ACCOUNT ═══════════
          The relationship this page sells. The one teal room on the page;
          the client logos sit in it because they are light silhouettes. */}
      <section id="account" className="room relative overflow-hidden scroll-mt-24" style={bloom}>
        <div id="business" className={`${wrap} py-14 sm:py-[72px]`}>
          <p className={`${eyebrow} mb-3.5`}>The account</p>
          <h2 className="text-[length:var(--step-section)] leading-[1.1] max-w-[24ch] text-[var(--ink)]" style={display}>
            A standing account with a laser.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            For the shops that need the same thing every month: labels, crews, cards, packs. Set it up once and it runs on a text.
          </p>

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {ACCOUNT_TERMS(standingDiscount).map(t => (
              <div key={t.h} className="border-t border-[var(--glass-edge)] pt-4">
                <p className="text-[length:var(--step-lead)] font-semibold text-[var(--ink)]">{t.h}</p>
                <p className="mt-1 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{t.p}</p>
              </div>
            ))}
          </div>

          {/* The ladder, flat. */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {BUSINESS_TIER_CARDS.map(tier => (
              <div key={tier.name} className={`rounded-[var(--r-tile)] p-4 border bg-[var(--surface)] ${tier.freeDelivery ? 'border-[var(--glass-edge)]' : 'border-[var(--hairline)]'}`}>
                <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{tier.name}</p>
                <p className="text-[length:var(--step-fine)] font-mono text-[var(--ink-soft)] mb-2">{tier.range}</p>
                <p className="text-[length:var(--step-panel)] font-semibold text-[var(--ink)]">{tier.discount}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/account" className={coralBtn}>Open an account</Link>
            <a
              href={getSmsLink('Hi Zach, I would like to set up a standing account for: ')}
              className="inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] border border-[var(--glass-edge)] text-[var(--ink)] text-[length:var(--step-body)] font-semibold hover:border-[var(--ink)] transition-colors duration-[var(--t-hover)]"
            >
              Or text me and I set it up
            </a>
          </div>

          <div className="mt-12 pt-9 border-t border-[var(--hairline)]">
            <TrustedBy theme="services" />
          </div>
        </div>
      </section>

      {/* ═══════════ THE FORM ═══════════
          For anyone who would rather not text. */}
      <section id="quote" className={`${wrap} py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-12 items-start scroll-mt-24`}>
        <div>
          <p className={`${eyebrow} mb-3`}>Rather not text?</p>
          <h2 className="text-[length:var(--step-section)] leading-[1.05] text-[var(--ink)]" style={display}>Send it here.</h2>
          <p className="mt-4 max-w-[40ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            A photo of the part or your logo, what it is, and how many. I answer the same day.
          </p>
        </div>
        <CanYouEngraveThis variant="business" compact />
      </section>

      {/* ═══════════ CLOSING BAND ═══════════ */}
      <section className="bg-[var(--feature)] text-[var(--feature-ink)]">
        <div className={`${wrap} py-8 flex flex-col sm:flex-row sm:items-center gap-5`}>
          <p className="text-[length:var(--step-panel)] leading-tight" style={display}>
            Send a photo and a count. You will have a real number today.
          </p>
          <a href={getSmsLink('Hi Zach, here is what I need marked: ')} className={`${coralBtn} sm:ml-auto whitespace-nowrap`}>
            Text {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
