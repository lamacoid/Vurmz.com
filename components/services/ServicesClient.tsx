'use client'

import Link from 'next/link'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, SOURCING, SHOP_RATE } from '@/lib/pricing'
import TrustedBy from '@/components/TrustedBy'
import OnSite from '@/components/services/OnSite'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'

/**
 * /services, rebuilt 2026-09-30 as a procurement funnel. Need something
 * marked? Send a photo, a count, and the logo or the words; a price comes
 * back the same day. Then the table a buyer scans, the posted prices, and
 * the standing account. Every number reads from lib/pricing.ts.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const glass = 'rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)]'
const eyebrow = 'text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]'

// $3 stays $3, $7.5 becomes $7.50. Prices are written as people say them.
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// The table a buyer scans before reading anything else.
const TABLE: Array<[string, string]> = [
  ['Setup fees', 'None'],
  ['Turnaround', '72 hours on most runs'],
  ['Local delivery', 'Yes. Hand-delivered, south Denver metro'],
  ['Who does the work', 'Zach'],
  ['Small orders', 'Yes. Ten pens is a run'],
  ['Logo stays on file', 'Yes. A reorder is a text with a count'],
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
    note: 'Sixteen layouts, fourteen colors. Design it on the page.',
    href: '/shop/p/anodized-aluminum-wallet-card',
  },
  {
    name: 'Branded pens',
    value: `${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen`,
    note: `Soft-touch stylus pens, packs of ${CATALOG.pens.pack}.`,
    href: '/shop/business',
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
    note: `${SHOP_RATE.minimumMinutes} minute minimum, material quoted. Faceplates, valve tags, control panels, signage.`,
  },
  {
    name: 'Happy to source',
    value: `${price(SOURCING.reserveFee)} plus the piece`,
    note: 'Name the piece. I find it, mark it, and bring it.',
    href: '/shop/reserve',
  },
  {
    name: 'Anything one-off',
    value: `from ${price(SIGNATURE.startingAt)}`,
    note: 'Bring the thing. If it is solid and fits the bed, it marks.',
    href: '/engrave',
  },
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
    description: 'Equipment labels, knife crews, metal cards, branded packs, plates and panels, and one-off marking for businesses in the South Denver metro. Posted prices, one person start to finish, delivered weekly.',
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Need something marked? */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-10">
        <p className={`${eyebrow} mb-3`}>For a business</p>
        <h1 className="text-[length:var(--step-display)] sm:text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] text-[var(--ink)] max-w-[16ch]" style={display}>
          Need something marked?
        </h1>
        <p className="mt-5 max-w-[50ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          Send a photo, how many, and your logo or the words. I send you a price the same day.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={getSmsLink('Hi Zach, I need something marked. What: \nHow many: \nLogo or words: ')}
            className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[15px] font-semibold transition-colors"
          >
            Text {siteInfo.founder.name}
          </a>
          <a href="#quote" className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] border border-[var(--hairline)] hover:border-[var(--glass-edge)] text-[var(--ink)] text-[15px] font-semibold transition-colors">
            Or send it here
          </a>
        </div>
      </section>

      {/* The table, then the form. */}
      <section id="quote" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 lg:gap-10 items-start scroll-mt-28">
        <dl className={`${glass} divide-y divide-[var(--hairline)]`}>
          {TABLE.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 px-4 sm:px-5 py-3.5">
              <dt className="text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--eyebrow)] pt-0.5">{k}</dt>
              <dd className="text-[14.5px] leading-relaxed text-[var(--ink)]">{v}</dd>
            </div>
          ))}
        </dl>
        <CanYouEngraveThis variant="business" compact />
      </section>

      {/* Posted prices. */}
      <section id="lanes" className="room relative overflow-hidden scroll-mt-28" style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 15% 0%, rgba(127,207,212,0.16) 0%, transparent 55%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
            <h2 className="text-[length:var(--step-section)] leading-tight text-[var(--ink)]" style={display}>Posted prices</h2>
            <p className="text-[13px] text-[var(--ink-soft)]">Volume pricing below. No setup fees on anything.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {LANES.map((row, i) => {
              const inner = (
                <span className={`flex flex-col gap-0.5 py-3.5 border-b border-[var(--hairline)] ${i >= LANES.length - 1 ? 'md:border-b-0' : ''}`}>
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[15.5px] font-semibold text-[var(--ink)]">{row.name}</span>
                    <span className="text-[15.5px] text-[var(--eyebrow)] font-semibold whitespace-nowrap tabular-nums">{row.value}</span>
                  </span>
                  {row.note && <span className="text-[13px] leading-snug text-[var(--ink-soft)]">{row.note}</span>}
                </span>
              )
              return row.href ? (
                <Link key={row.name} href={row.href} className="block group">{inner}</Link>
              ) : (
                <div key={row.name}>{inner}</div>
              )
            })}
          </div>
          <p className="mt-6 text-[13.5px] text-[var(--ink-soft)]">
            What marks, and how it looks on each material:{' '}
            <Link href="/services/materials" className="text-[var(--eyebrow)] hover:text-[var(--ink)] transition-colors">the materials list</Link>.
          </p>
        </div>
      </section>

      {/* On site. */}
      <section id="onsite" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-mt-28">
        <OnSite />
      </section>

      {/* The account. */}
      <section id="account" className="room relative overflow-hidden scroll-mt-28" style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 90% 100%, rgba(127,207,212,0.14) 0%, transparent 60%)' }}>
        <div id="business" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className={`${eyebrow} mb-3`}>The account</p>
          <h2 className="text-[length:var(--step-section)] leading-[1.05] text-[var(--ink)] max-w-[24ch]" style={display}>
            Same thing every month? Set it up once.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            Labels, crews, cards, packs. After the first run it is a text with a count.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ACCOUNT_TERMS(standingDiscount).map(t => (
              <div key={t.h} className={`${glass} p-5`}>
                <p className="text-[length:var(--step-body)] text-[var(--ink)]" style={display}>{t.h}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{t.p}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {BUSINESS_TIER_CARDS.map(tier => (
              <div key={tier.name} className={`rounded-[var(--r-tile)] p-4 border ${tier.freeDelivery ? 'border-[var(--glass-edge)] bg-[var(--surface)]' : 'border-[var(--hairline)] bg-[var(--surface)]'}`}>
                <p className="text-[15px] font-semibold text-[var(--ink)]">{tier.name}</p>
                <p className="text-[12px] font-mono text-[var(--ink-soft)] mb-2">{tier.range}</p>
                <p className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>{tier.discount}</p>
                {tier.freeDelivery && (
                  <p className="mt-1.5 text-[12px] leading-snug text-[var(--ink-soft)]">Free delivery any size, NET-{BUSINESS.netTermsDays}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] text-[var(--ink-soft)]">
            Counted in real units, not packs. Ten packs of {CATALOG.pens.pack} pens is {CATALOG.pens.pack * 10} units.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/account" className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[15px] font-semibold transition-colors">
              Open an account
            </Link>
            <a href={getSmsLink('Hi Zach, I would like to set up a standing account for: ')} className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--r-control)] border border-[var(--hairline)] hover:border-[var(--glass-edge)] text-[var(--ink)] text-[15px] font-semibold transition-colors">
              Or text me and I set it up
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {siteInfo.serviceAreas.map(area => (
              <span key={area} className="px-3 py-1 border border-[var(--hairline)] rounded-full text-[12.5px] text-[var(--ink-soft)]">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Who trusts it. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <TrustedBy theme="services" />
      </section>

      {/* Close. */}
      <section className="border-t border-[var(--hairline)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <p className="text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>
            Send a photo and a count. You will have a real number today.
          </p>
          <a href={getSmsLink('Hi Zach, here is what I need marked: ')} className="sm:ml-auto inline-flex items-center justify-center whitespace-nowrap h-12 px-7 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[15px] font-semibold transition-colors">
            Text {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
