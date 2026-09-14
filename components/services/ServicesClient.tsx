'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, SOURCING, SHOP_RATE } from '@/lib/pricing'
import TrustedBy from '@/components/TrustedBy'
import ItemScroller from '@/components/ItemScroller'
import OnSite from '@/components/services/OnSite'

/**
 * /services, rebuilt 2026-09-13: the work first, the terms as the close.
 * A trades buyer believes a photo of a finished plate before a price, and
 * a recurring account is the relationship this page is selling. The card
 * configurator that used to lead here is gone: the card has its own
 * designer on the shop side now. Every number reads from lib/pricing.ts.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// $3 stays $3, $7.5 becomes $7.50. Prices are written as people say them.
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// Real business jobs, stated by material and process. Each points at the
// lane it belongs to so the photo and the posted price sit one tap apart.
const WORK: { src: string; alt: string; title: string; spec: string; lane: string; href: string }[] = [
  {
    src: '/portfolio/clga-faceplate-closeup.jpg',
    alt: 'Engraved amp faceplate for County Line Guitar Amps',
    title: 'Amp faceplates, County Line Guitar Amps',
    spec: 'Brushed metal, engraved, recurring',
    lane: 'Plates and panels',
    href: '#lanes',
  },
  {
    src: '/portfolio/tumbler-cherry-creek-37.jpg',
    alt: 'Powder-coated tumbler engraved with a Cherry Creek business logo',
    title: 'Branded tumblers, Cherry Creek',
    spec: 'Powder-coated stainless, coating removed',
    lane: 'Branded packs',
    href: '/shop',
  },
  {
    src: '/portfolio/culinary-cleaver-engraved.jpg',
    alt: 'Chef cleaver engraved with a name',
    title: 'Cleaver, named for the chef',
    spec: 'Knife steel, annealed',
    lane: 'Knife crews',
    href: '/services/knife-engraving',
  },
  {
    src: '/portfolio/engraved-hand-saw.jpg',
    alt: 'Hand saw with a name engraved on the blade',
    title: 'Name on the blade',
    spec: 'Saw steel, annealed',
    lane: 'Tool and gear marking',
    href: '#lanes',
  },
  {
    src: '/portfolio/water-bottle-custom-engraved.jpg',
    alt: 'Powder-coated water bottle with a custom engraving',
    title: 'Bottles for the crew',
    spec: 'Powder-coated steel, coating removed',
    lane: 'Branded packs',
    href: '/shop',
  },
  {
    src: '/portfolio/laser-engraved-artwork.jpg',
    alt: 'Anodized aluminum panel engraved with fine line work',
    title: 'Fine detail in anodized aluminum',
    spec: 'Anodized aluminum, engraved',
    lane: 'Plates and panels',
    href: '#lanes',
  },
]

// The lanes, posted. Values read from the catalog so a row can never
// drift from the real price. Quoted lanes say so instead of inventing one.
const LANES: { name: string; value: string; note?: string; href?: string }[] = [
  {
    name: 'Equipment labels',
    value: `${price(CATALOG.serviceTags.aluminumBase * CATALOG.serviceTags.pack)} per ${CATALOG.serviceTags.pack}`,
    note: `Anodized aluminum, 3M backed. Stainless ${price(CATALOG.serviceTags.stainlessBase)} each.`,
    href: '/services/metal-tags',
  },
  {
    name: 'Knife crews',
    value: `${price(CATALOG.knife.base)} a knife`,
    note: `${price(CATALOG.knife.crew.perKnife)} at ${CATALOG.knife.crew.minQty} or more, ${price(CATALOG.knife.fullKitchen.perKnife)} for a full kitchen. I pick up and return.`,
    href: '/services/knife-engraving',
  },
  {
    name: 'Metal cards',
    value: `${price(CATALOG.cards.matteBlackBase * CATALOG.cards.pack)} per ${CATALOG.cards.pack}`,
    note: 'Sixteen layouts, fourteen colors. Design it on the page and the laser file writes itself.',
    href: '/shop/p/anodized-aluminum-wallet-card',
  },
  {
    name: 'Branded pens',
    value: `${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen`,
    note: `Soft-touch stylus pens, packs of ${CATALOG.pens.pack}.`,
    href: '/shop#menu-pens',
  },
  {
    name: 'Tool and gear marking',
    value: `${price(CATALOG.tool.base)} a piece`,
    note: `${price(CATALOG.tool.jobsite.perPiece)} each at ${CATALOG.tool.jobsite.minQty} or more. Your name on what walks off jobsites.`,
  },
  {
    name: 'Installer signature tiles',
    value: `${price(CATALOG.signatureTiles.perTile)} a tile`,
    note: 'Your mark on the install, left with the customer.',
    href: '/services/metal-tags',
  },
  {
    name: 'Plates and panels',
    value: `${price(SHOP_RATE.hourly)} an hour`,
    note: `${SHOP_RATE.minimumMinutes} minute minimum, material quoted. Faceplates, valve tags, control panels, signage. Send the drawing or the part.`,
  },
  {
    name: 'Happy to source',
    value: `from ${price(SOURCING.feeUnder100)} plus the item`,
    note: 'Name the piece. I find it, engrave it, and bring it. The item at cost.',
    href: '/shop#source',
  },
  {
    name: 'Anything one-off',
    value: `from ${price(SIGNATURE.startingAt)}`,
    note: 'Bring the thing. If it is solid and fits the bed, it marks.',
    href: '/shop/p/engrave-your-item',
  },
]

// What I need to quote a job. Five things, in the order I ask for them.
const BRIEF = [
  { h: 'A photo of the thing', p: 'The part, the blank, or a link to the product. If it is one of mine, the name is enough.' },
  { h: 'How many', p: 'Ten knives, 150 pens, one faceplate. A range is fine if you are still deciding. Every piece across your account counts toward the volume price.' },
  { h: 'The artwork, or the words', p: 'A vector file is best: SVG, PDF, or AI. A sharp PNG works. No file? Send the words and pick a font. I will set it.' },
  { h: 'Where it goes and how big', p: 'A marked-up photo, a drawing, or a size in inches. "Centered, about two inches wide" is fine to start.' },
  { h: 'When you need it', p: `Most jobs are ready in 24 to 72 hours. The delivery run is ${siteInfo.deliveryRunDay}. Name the date and I will tell you straight whether it works.` },
]
const BRIEF_SMS = 'Hi Zach. What: \nHow many: \nArtwork or words: \nWhere and how big: \nNeeded by: '

// What comes back, in order. Real steps, real timing.
const RETURNS = [
  { when: 'Same day', h: 'A number', p: 'The price for that count, delivery included where it applies. No setup fee, ever.' },
  { when: 'Before it runs', h: 'A proof photo', p: 'The first piece, marked, photographed. Nothing else is cut until you say go.' },
  { when: '24 to 72 hrs', h: 'The run', p: 'Same file, same settings, every piece. A batch of 200 matches piece one.' },
  { when: 'The run day', h: 'Hand delivery', p: `Free over $${DELIVERY.freeThreshold}, free at any size on an account. Or pickup, or shipped if you are far.` },
  { when: 'After', h: 'Your files on record', p: 'Logo, layout, settings. The reorder is a text with a count.' },
]

// What precision means in this shop. Claims kept to what the machines
// and the proof process actually deliver.
const PRECISION = [
  { h: 'The mark is in the material, not on it', p: 'The laser changes the surface itself. Nothing is printed, glued, or coated, so there is nothing to peel, fade, or rub off.' },
  { h: 'From your file, line for line', p: 'Vector art reproduces as drawn: logos, serials, QR codes, part numbers. Text stays legible down to six point.' },
  { h: 'Placed to your drawing', p: 'You give a position and a size, in inches or millimeters, and that is where it lands. Same fixture, same spot, across the batch.' },
  { h: 'Repeatable', p: 'One file, saved with the settings that ran it. The reorder six months from now matches the first run.' },
  { h: 'Proven before it runs', p: 'The first piece is photographed and approved by you before the rest are touched. A wrong mark on metal is permanent, so it is never a surprise.' },
]

// Materials and their true marks, from the shop's own material truths.
// Anything not settled stays off this list.
const MATERIALS = [
  { name: 'Anodized aluminum', mark: 'Dye removed to bare silver metal, whatever the color. Cards, tags, plant markers, laptop lids.' },
  { name: 'Stainless steel', mark: 'Annealed: a matte dark mark in the surface, nothing removed. Knives, labels, coasters, flatware.' },
  { name: 'Powder-coated metal', mark: 'Coating stripped to bare steel. Tumblers, bottles, painted panels.' },
  { name: 'Brushed and raw metals', mark: 'Engraved or annealed to a dark mark. Faceplates, brass, titanium, tool steel.' },
  { name: 'Plastics', mark: 'A light, permanent mark in ABS, polycarbonate, and most hard plastics. Chargers, housings, sign stock.' },
  { name: 'Wood and bamboo', mark: 'A clean burn, darker with more power. Boards, panels, signs, coasters.' },
  { name: 'Leather', mark: 'A dark, slightly recessed mark. Patches, wallets, tags.' },
  { name: 'Slate', mark: 'A pale frost where the surface is removed. Coasters and small signs.' },
  { name: 'Mirror', mark: 'Silvering removed from the back. Reads as frosted glass from the front.' },
]

// What a standing account is. Every line is a real term from lib/pricing.
const ACCOUNT_TERMS = (standingDiscount: string) => [
  { h: 'Your logo on file', p: 'Upload it once. Every reorder is a text message and a count.' },
  { h: `Free delivery, every ${siteInfo.deliveryRunDay}`, p: `Any size, anywhere in the ${DELIVERY.area}. The run is the same day each week.` },
  { h: `NET-${BUSINESS.netTermsDays} terms`, p: 'Invoice after delivery. Pay on your schedule, not at checkout.' },
  { h: `${standingDiscount} on standing orders`, p: 'Counted in real units across the account, and the tier holds between reorders.' },
  { h: 'A proof before every run', p: 'A photo of the first piece, approved by you, before the rest are cut.' },
  { h: 'One person, start to finish', p: 'You text me. I quote it, make it, and hand it to you.' },
]

export default function ServicesClient() {
  const standing = BUSINESS.tiers.find(t => t.name === 'Standing')
  const standingDiscount = standing ? `${Math.round(standing.discount * 100)}% off` : '15% off'

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Laser Engraving',
    name: 'VURMZ Laser Engraving for Business',
    description: 'Equipment labels, knife crews, metal cards, branded packs, plates and panels, and one-off marking for businesses in the South Denver metro. Posted prices, proof before every run, delivered weekly.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'VURMZ LLC',
      url: 'https://www.vurmz.com',
      telephone: siteInfo.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteInfo.city,
        addressRegion: siteInfo.stateAbbr,
        addressCountry: 'US',
      },
    },
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
      <section className="max-w-[1280px] mx-auto px-5 sm:px-11 pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)] mb-3.5">
              For your business
            </p>
            <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.1] text-[var(--ink)]" style={display}>
              Precision laser engraving and marking<br className="hidden sm:block" /> for the businesses of the south Denver metro.
            </h1>
            <p className="mt-5 max-w-[56ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
              Tell me what you need marked. Send a photo and a count: a number the same day, a proof photo
              before anything runs, delivery on {siteInfo.deliveryRunDay}. I&apos;m {siteInfo.founder.name},
              one shop in {siteInfo.city}, run by me.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={getSmsLink('Hi Zach, here is what I need marked: ')}
                className="puffy-btn inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
              >
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
              <span className="flex justify-between py-[7px] border-b border-[var(--hairline)]">
                <span>Next delivery run</span>
                <span className="text-[var(--ink)] font-semibold">{siteInfo.deliveryRunDay.slice(0, 3)}</span>
              </span>
              <span className="flex justify-between py-[7px] border-b border-[var(--hairline)]">
                <span>Typical turnaround</span>
                <span className="text-[var(--ink)] font-semibold">72 hrs</span>
              </span>
              <span className="flex justify-between py-[7px] border-b border-[var(--hairline)]">
                <span>Setup fees</span>
                <span className="text-[var(--ink)] font-semibold">None</span>
              </span>
              <span className="flex justify-between py-[7px]">
                <span>Proof before it runs</span>
                <span className="text-[var(--ink)] font-semibold">Always</span>
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ THE BRIEF ═══════════
          The heart of the page. Not what they should want: what I need to
          quote it, and what they get back. Real information, in order. */}
      <section id="brief" className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>What I need from you</h2>
            <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">Five things. One text message covers all of them.</p>
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
            <a
              href={getSmsLink(BRIEF_SMS)}
              className="puffy-btn mt-6 inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
            >
              Start the text. The five lines are already in it
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

      {/* ═══════════ PRECISION ═══════════
          What the laser does to each material. Only facts that
          are settled: how a material marks comes from the shop's own
          material truths, never a guess. */}
      <section id="precision" className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14 scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
          <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>Precision, and what it means here</h2>
          <Link href="/services/materials" className="text-[length:var(--step-row)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-[var(--t-hover)]">
            The full materials list
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <div className="space-y-5">
              {PRECISION.map(pt => (
                <div key={pt.h} className="border-t border-[var(--hairline)] pt-4 first:border-t-0 first:pt-0">
                  <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{pt.h}</p>
                  <p className="mt-1 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{pt.p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-3">What marks, and how it looks</p>
            <div className="text-[length:var(--step-row)]">
              {MATERIALS.map((m, i) => (
                <div key={m.name} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-4 py-2.5 ${i < MATERIALS.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                  <span className="font-semibold text-[var(--ink)] leading-snug">{m.name}</span>
                  <span className="leading-snug text-[var(--ink-soft)]">{m.mark}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[length:var(--step-fine)] leading-relaxed text-[var(--ink-soft)]">
              Glass, acrylic, and anything not on this list: text me a photo first. If it is solid and fits the bed, it probably marks, and I will tell you how before you commit.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ THE WORK ═══════════
          The photos sit over the same faint "endless ideas" marquee the
          homepage runs behind its recent work. */}
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
        <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-11">
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

      {/* ═══════════ THE LANES, POSTED ═══════════ */}
      <section id="lanes" className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14 scroll-mt-24">
        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>Posted prices</h2>
            <p className="text-[length:var(--step-fine)] text-[var(--ink-soft)]">Volume pricing below. No setup fees on anything.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {LANES.map((row, i) => {
              const inner = (
                <span className={`flex flex-col gap-0.5 py-3 border-b border-[var(--hairline)] ${i >= LANES.length - 1 ? 'md:border-b-0' : ''}`}>
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{row.name}</span>
                    <span className="text-[length:var(--step-body)] text-[var(--eyebrow)] font-semibold whitespace-nowrap">{row.value}</span>
                  </span>
                  {row.note && <span className="text-[length:var(--step-fine)] leading-snug text-[var(--ink-soft)]">{row.note}</span>}
                </span>
              )
              return row.href ? (
                <Link key={row.name} href={row.href} className="block group">
                  {inner}
                </Link>
              ) : (
                <div key={row.name}>{inner}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ ON SITE ═══════════ */}
      <section id="onsite" className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14 scroll-mt-24">
        <OnSite />
      </section>

      {/* ═══════════ THE ACCOUNT ═══════════
          The relationship this page sells. Deep teal is a surface on the
          paper, the one dark block on the page. */}
      <section id="account" className="scroll-mt-24">
        <div id="business" className="bg-[var(--feature-deep)] text-[var(--feature-ink)]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-11 py-14 sm:py-[72px]">
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.28em] uppercase text-[var(--feature-soft)] mb-3.5">The account</p>
            <h2 className="text-[length:var(--step-section)] leading-[1.1] max-w-[24ch]" style={display}>
              A standing account with a laser.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--feature-soft)]">
              For the shops that need the same thing every month: labels, crews, cards, packs. Set it up once
              and it runs on a text.
            </p>

            <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {ACCOUNT_TERMS(standingDiscount).map(t => (
                <div key={t.h} className="border-t border-[var(--feature-ink)]/20 pt-4">
                  <p className="text-[length:var(--step-lead)] font-semibold">{t.h}</p>
                  <p className="mt-1 text-[length:var(--step-row)] leading-relaxed text-[var(--feature-soft)]">{t.p}</p>
                </div>
              ))}
            </div>

            {/* The ladder, flat. */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BUSINESS_TIER_CARDS.map(tier => (
                <div key={tier.name} className={`rounded-[var(--r-tile)] p-4 border ${tier.freeDelivery ? 'border-[var(--signal)] bg-[var(--feature)]' : 'border-[var(--feature-ink)]/15 bg-[var(--feature)]'}`}>
                  <p className="text-[length:var(--step-body)] font-semibold">{tier.name}</p>
                  <p className="text-[length:var(--step-fine)] font-mono text-[var(--feature-soft)] mb-2">{tier.range}</p>
                  <p className="text-[length:var(--step-panel)] font-semibold">{tier.discount}</p>
                  {tier.freeDelivery && (
                    <p className="mt-1.5 text-[length:var(--step-fine)] leading-snug text-[var(--feature-soft)]">Free delivery any size, NET-{BUSINESS.netTermsDays}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[length:var(--step-fine)] text-[var(--feature-soft)]">
              Counted in real units, not packs: ten packs of {CATALOG.pens.pack} pens is {CATALOG.pens.pack * 10} units.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/account"
                className="puffy-btn inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
              >
                Open an account
              </Link>
              <a
                href={getSmsLink('Hi Zach, I would like to set up a standing account for: ')}
                className="inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] border border-[var(--feature-ink)]/30 text-[var(--feature-ink)] text-[length:var(--step-body)] font-semibold hover:border-[var(--signal)] transition-colors duration-[var(--t-hover)]"
              >
                Or text me and I set it up
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-[7px]">
              {siteInfo.serviceAreas.map(area => (
                <span key={area} className="px-[11px] py-[5px] border border-[var(--feature-ink)]/20 rounded-full text-[length:var(--step-fine)] font-medium text-[var(--feature-soft)]">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHO ═══════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-11 py-14">
        <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-6 items-center max-w-[720px]">
          <div className="relative aspect-square rounded-[var(--r-tile)] overflow-hidden">
            <Image src="/images/zach.jpeg" alt={`${siteInfo.founder.name}, owner of VURMZ`} fill sizes="150px" className="object-cover" />
          </div>
          <div>
            <p className="mb-1.5 text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>
              No department. Just me.
            </p>
            <p className="mb-3 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">
              Recurring work for County Line Guitar Amps and Nordstrom Beauty at Cherry Creek. One person handles
              your job from the first text to the delivery.
            </p>
            <Link href="/about" className="text-[length:var(--step-row)] font-semibold text-[var(--ink)] border-b-[1.5px] border-[var(--coral)] pb-0.5">
              About VURMZ
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <section className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14">
        <TrustedBy theme="services" />
      </section>

      {/* ═══════════ CLOSING BAND ═══════════ */}
      <section className="bg-[var(--feature)] text-[var(--feature-ink)]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-11 py-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <p className="text-[length:var(--step-panel)] leading-tight" style={display}>
            Send a photo and a count. You will have a real number today.
          </p>
          <a
            href={getSmsLink('Hi Zach, here is what I need marked: ')}
            className="puffy-btn sm:ml-auto inline-flex items-center justify-center whitespace-nowrap px-6 py-3.5 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
          >
            Text {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
