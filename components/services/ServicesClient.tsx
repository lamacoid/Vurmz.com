'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, SOURCING } from '@/lib/pricing'
import TrustedBy from '@/components/TrustedBy'

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
    spec: 'Brushed metal, fiber laser, recurring',
    lane: 'Plates and panels',
    href: '#lanes',
  },
  {
    src: '/portfolio/tumbler-cherry-creek-37.jpg',
    alt: 'Powder-coated tumbler engraved with a Cherry Creek business logo',
    title: 'Branded tumblers, Cherry Creek',
    spec: 'Powder-coated stainless, fiber laser',
    lane: 'Branded packs',
    href: '/shop',
  },
  {
    src: '/portfolio/culinary-cleaver-engraved.jpg',
    alt: 'Chef cleaver engraved with a name',
    title: 'Cleaver, named for the chef',
    spec: 'Knife steel, fiber laser',
    lane: 'Knife crews',
    href: '/services/knife-engraving',
  },
  {
    src: '/portfolio/engraved-hand-saw.jpg',
    alt: 'Hand saw with a name engraved on the blade',
    title: 'Name on the blade',
    spec: 'Saw steel, fiber laser',
    lane: 'Tool and gear marking',
    href: '#lanes',
  },
  {
    src: '/portfolio/water-bottle-custom-engraved.jpg',
    alt: 'Powder-coated water bottle with a custom engraving',
    title: 'Bottles for the crew',
    spec: 'Powder-coated steel, fiber laser',
    lane: 'Branded packs',
    href: '/shop',
  },
  {
    src: '/portfolio/laser-engraved-artwork.jpg',
    alt: 'Anodized aluminum panel engraved with fine line work',
    title: 'Fine detail in anodized aluminum',
    spec: 'Anodized aluminum, fiber laser',
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
    note: 'Sixteen layouts, fourteen colours. Design it on the page and the laser file writes itself.',
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
    value: 'Quoted from a photo',
    note: 'Faceplates, valve tags, control panels, signage. Send the drawing or the part.',
  },
  {
    name: 'Concierge sourcing',
    value: `${price(SOURCING.fee)} plus the item`,
    note: 'You describe it, I find the blank, engrave it, and deliver it.',
  },
  {
    name: 'Anything one-off',
    value: `from ${price(SIGNATURE.startingAt)}`,
    note: 'Bring the thing. If it is solid and fits the bed, it marks.',
    href: '/shop/p/engrave-your-item',
  },
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
              Things I make for the businesses around here.
            </h1>
            <p className="mt-5 max-w-[56ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
              I&apos;m {siteInfo.founder.name}. One laser in {siteInfo.city}. You text me a photo and a count,
              I send a number the same day and a proof photo before anything runs, and I drive it to you
              on {siteInfo.deliveryRunDay}. Prices are posted below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={getSmsLink('Hi Zach, here is what I need marked: ')}
                className="puffy-btn inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
              >
                Text {siteInfo.phone}
              </a>
              <a
                href="#account"
                className="inline-flex items-center justify-center h-[48px] px-6 rounded-[var(--r-control)] border border-[var(--ink)]/25 text-[var(--ink)] text-[length:var(--step-body)] font-semibold hover:border-[var(--ink)] transition-colors duration-[var(--t-hover)]"
              >
                What an account gets you
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

      {/* ═══════════ THE WORK ═══════════ */}
      <section id="work" className="max-w-[1280px] mx-auto px-5 sm:px-11 pb-14 scroll-mt-24">
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
