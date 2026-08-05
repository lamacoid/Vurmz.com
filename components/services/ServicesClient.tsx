'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, BUSINESS_TIER_CARDS, SOURCING } from '@/lib/pricing'
import TradesConfigurator from '@/components/services/TradesConfigurator'
import TrustedBy from '@/components/TrustedBy'

/**
 * /services, the trades side: "three decisions, one number."
 * One question at a time, posted prices, one coral action per screen.
 * Everything not configured is stated flat: the posted list, the delivery
 * card, the owner card, one closing CTA. Numbers come from lib/pricing.ts.
 * The trades voice is matter-of-fact; the shop's gift voice stays on /shop.
 */

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// $3 stays $3, $7.5 becomes $7.50. Prices are written as people say them.
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// What people actually do with a metal card. Suggestions, not products:
// nothing here is priced differently, it is the same card with different
// words on it. Adhesive-backed equipment labels are a separate product at
// a separate price and are deliberately not in this list.
const USES = [
  'A contact card that survives a toolbox',
  'QR to your reviews page',
  'QR to your scheduling link',
  'Membership or VIP card',
  'Gift card that is worth keeping',
  'Referral card for a shop you trade work with',
  'Warranty card left with the install',
  'Spec or cut sheet, in their hand',
]

// Four real jobs, trades side only. Captions state material and process,
// nothing more; the gift work stays on /shop and /services/portfolio.
const WORK = [
  {
    src: '/portfolio/clga-faceplate-closeup.jpg',
    alt: 'Engraved amp faceplate for County Line Guitar Amps',
    title: 'Amp faceplate, County Line Guitar Amps',
    spec: 'Brushed metal, fiber laser',
  },
  {
    src: '/portfolio/engraved-hand-saw.jpg',
    alt: 'Hand saw with a name engraved on the blade',
    title: 'Name on the blade',
    spec: 'Saw steel, fiber laser',
  },
  {
    src: '/portfolio/laser-engraved-artwork.jpg',
    alt: 'Anodized aluminum panel engraved with fine line work',
    title: 'Fine-detail panel',
    spec: 'Anodized aluminum, fiber laser',
  },
  {
    src: '/portfolio/culinary-cleaver-engraved.jpg',
    alt: 'Chef cleaver engraved with a name',
    title: 'Cleaver, named for the chef',
    spec: 'Knife steel, fiber laser',
  },
]

// Everything else, posted. Values read from the catalog so the rows can
// never drift from the real prices.
const POSTED: { name: string; value: string; href?: string }[] = [
  {
    name: 'Tool and gear marking',
    value: `${price(CATALOG.tool.base)}, or ${price(CATALOG.tool.jobsite.perPiece)} each at ${CATALOG.tool.jobsite.minQty}+`,
  },
  {
    name: 'Knife marking, crews',
    value: `${price(CATALOG.knife.base)}, ${price(CATALOG.knife.crew.perKnife)} at ${CATALOG.knife.crew.minQty}+, ${price(CATALOG.knife.fullKitchen.perKnife)} at ${CATALOG.knife.fullKitchen.minQty}+`,
    href: '/services/knife-engraving',
  },
  {
    name: 'Equipment labels, 3M backed',
    value: `${price(CATALOG.serviceTags.aluminumBase * CATALOG.serviceTags.pack)} per ${CATALOG.serviceTags.pack}, stainless ${price(CATALOG.serviceTags.stainlessBase)} each`,
    href: '/services/metal-tags',
  },
  {
    name: 'Cards in stainless',
    value: `${price(CATALOG.cards.stainlessBase)} each, ${price(CATALOG.cards.stainlessLoaded)} fully loaded`,
  },
  {
    name: 'Branded pens',
    value: `${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} each, packs of ${CATALOG.pens.pack}`,
  },
  {
    name: 'Installer signature tiles',
    value: `${price(CATALOG.signatureTiles.perTile)} per tile`,
    href: '/services/metal-tags',
  },
  {
    name: 'Concierge sourcing',
    value: `${price(SOURCING.fee)} flat, plus the item`,
  },
  {
    name: 'Anything one-off',
    value: `from ${price(SIGNATURE.startingAt)}`,
  },
]

export default function ServicesClient() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Laser Engraving',
    name: 'VURMZ Laser Engraving Services',
    description: 'Precision laser engraving for businesses, trades, restaurants, and individuals. Branded products, service tags, knife marking, custom gifts. Posted pricing, next-day turnaround, hand-delivered across the South Denver metro.',
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

      {/* ═══════════ INTRO ROW ═══════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-11 pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-xs font-mono tracking-[0.28em] uppercase text-[var(--eyebrow)] mb-3.5">
              Metal cards, plates and marking for the trades
            </p>
            <h1 className="text-[34px] sm:text-[44px] leading-[1.1] font-semibold tracking-[-0.02em] text-[var(--ink)]" style={display}>
              Engraved to spec, most jobs<br className="hidden sm:block" /> in your hands inside three days.
            </h1>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-[var(--ink-soft)]">
              I&apos;m {siteInfo.founder.name}. I run one laser out of {siteInfo.city} and I mark panels, plates,
              valves, asset tags and gear for shops across the south metro. Prices are posted below.
              Nothing runs until you approve a proof.
            </p>
          </div>

          <div className="bg-[rgba(127,207,212,.18)] border border-[var(--hairline)] rounded-sm p-5">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-3">This week</p>
            <div className="text-[14.5px] text-[var(--ink-soft)]">
              <span className="flex justify-between py-[7px] border-b border-[var(--hairline)]">
                <span>Next delivery run</span>
                <span className="text-[var(--ink)] font-semibold">{siteInfo.deliveryRunDay.slice(0, 3)}</span>
              </span>
              <span className="flex justify-between py-[7px] border-b border-[var(--hairline)]">
                <span>Typical turnaround</span>
                <span className="text-[var(--ink)] font-semibold">72 hrs</span>
              </span>
              <span className="flex justify-between py-[7px]">
                <span>Setup fees</span>
                <span className="text-[var(--ink)] font-semibold">None</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE DECISION PANEL ═══════════ */}
      <section id="price" className="max-w-6xl mx-auto px-5 sm:px-11 pb-11 scroll-mt-24">
        <TradesConfigurator />
      </section>

      {/* ═══════════ WHAT THEY GET USED FOR ═══════════
          Same card, different words on it. No prices here on purpose. */}
      <section className="max-w-6xl mx-auto px-5 sm:px-11 pb-11">
        <div className="bg-[rgba(127,207,212,.18)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-4">
            What people put on them
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2.5 list-none p-0 m-0">
            {USES.map(use => (
              <li key={use} className="text-[15px] leading-snug text-[var(--ink-soft)] flex gap-2.5">
                <span className="text-[#C67A6F] flex-shrink-0" aria-hidden>&middot;</span>
                {use}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Need it stuck to a panel or a valve instead? Those are equipment labels, a different
            blank with 3M backing, {price(CATALOG.serviceTags.aluminumBase)} each in packs
            of {CATALOG.serviceTags.pack}. Same laser, same proof.{' '}
            <Link href="/services/metal-tags" className="text-[var(--ink)] underline decoration-[#C67A6F] decoration-[1.5px] underline-offset-2">
              The labels lane
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════ THE WORK ═══════════
          A trades buyer wants to see a plate before believing a price. Four
          real jobs, stated by material and process. */}
      <section className="max-w-6xl mx-auto px-5 sm:px-11 pb-11">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)]">
            Off the machine
          </p>
          <Link
            href="/services/portfolio"
            className="text-[14px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            See the rest of the work
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WORK.map(w => (
            <figure key={w.src} className="m-0">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[var(--feature-deep)]">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2.5">
                <p className="text-[14.5px] font-semibold leading-snug text-[var(--ink)]">{w.title}</p>
                <p className="text-[12.5px] font-mono tracking-[0.06em] text-[var(--ink-soft)]">{w.spec}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ═══════════ POSTED PRICES + LOCAL PROOF ═══════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-11 pb-11">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
            <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-4">
              Everything else, posted
            </p>
            <div className="text-[15px] text-[var(--ink-soft)]">
              {POSTED.map((row, i) => {
                const inner = (
                  <span className={`flex flex-wrap justify-between items-baseline gap-x-4 py-2.5 ${i < POSTED.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}>
                    <span className="text-[var(--ink)] font-semibold">{row.name}</span>
                    <span>{row.value}</span>
                  </span>
                )
                return row.href ? (
                  <Link key={row.name} href={row.href} className="block hover:text-[var(--ink)] transition-colors">
                    {inner}
                  </Link>
                ) : (
                  <div key={row.name}>{inner}</div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[rgba(127,207,212,.18)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
              <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-3.5">
                I drive it to you
              </p>
              <p className="mb-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Free hand-delivery over ${DELIVERY.freeThreshold} anywhere in the {DELIVERY.area}.
                Standing accounts get it free at any size, with NET-{BUSINESS.netTermsDays} terms.
              </p>
              <div className="flex flex-wrap gap-[7px]">
                {siteInfo.serviceAreas.map(area => (
                  <span
                    key={area}
                    className="px-[11px] py-[5px] bg-[var(--surface)] border border-[var(--hairline)] rounded-full text-[13.5px] font-medium text-[var(--ink)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[132px_1fr] gap-5 items-center bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-5 sm:p-6">
              <div className="relative aspect-square rounded-sm overflow-hidden">
                <Image
                  src="/images/zach.jpeg"
                  alt={`${siteInfo.founder.name}, owner of VURMZ`}
                  fill
                  sizes="132px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="mb-1.5 text-[19px] leading-tight font-semibold text-[var(--ink)]" style={display}>
                  No department. Just me.
                </p>
                <p className="mb-3 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
                  You text me, I quote you, I engrave it, and I hand it to you. Recurring work for
                  County Line Guitar Amps and Nordstrom Beauty at Cherry Creek.
                </p>
                <Link
                  href="/services/portfolio"
                  className="text-[14.5px] font-semibold text-[var(--ink)] border-b-[1.5px] border-[#C67A6F] pb-0.5"
                >
                  See the work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VOLUME LADDER ═══════════
          The configurator shows the tier you land on; this states the whole
          ladder flat. The homepage B2B card links straight here. */}
      <section id="business" className="max-w-6xl mx-auto px-5 sm:px-11 pb-11 scroll-mt-24">
        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--eyebrow)] mb-4">
            Volume, posted
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {BUSINESS_TIER_CARDS.map(tier => (
              <div key={tier.name} className={`rounded-sm p-4 ${tier.freeDelivery ? 'bg-[rgba(127,207,212,.18)]' : 'bg-[var(--page)]'}`}>
                <p className="text-[15px] font-semibold text-[var(--ink)]">{tier.name}</p>
                <p className="text-[13px] font-mono text-[var(--ink-soft)] mb-2.5">{tier.range}</p>
                <p className="text-[20px] font-semibold text-[var(--ink)]">{tier.discount}</p>
                {tier.freeDelivery && (
                  <p className="mt-2 text-[13px] leading-snug text-[var(--ink-soft)]">
                    Free delivery any size, NET-{BUSINESS.netTermsDays} available
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Counted in real units, not packs: 10 packs of 15 pens is 150 units. A standing account
            holds its tier between reorders.
          </p>
        </div>
      </section>

      {/* ═══════════ ORDER NOW ═══════════
          The services side is still a shop, but it does not keep its own copy
          of the catalog. Everything lives on one menu; these are the doors
          into the parts a business walks in for. */}
      <section id="order" className="max-w-6xl mx-auto px-5 sm:px-11 pb-11 scroll-mt-24">
        <div className="bg-[rgba(127,207,212,.18)] border border-[var(--hairline)] rounded-sm p-6 sm:p-7">
          <p className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--ink)] mb-3">
            Order now
          </p>
          <p className="mb-5 max-w-[60ch] text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Everything I make is on one menu, posted prices and all. Buy it there, or send me the
            job above and I will quote it.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Metal cards', href: '/shop#menu-metal-cards' },
              { label: 'Labels and tags', href: '/shop#menu-labels-tags' },
              { label: 'Branded pens', href: '/shop#menu-pens' },
              { label: 'Coasters', href: '/shop#menu-coasters' },
              { label: 'The whole menu', href: '/shop' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-[11px] rounded-sm border border-[var(--ink)]/20 bg-[var(--surface)] text-[15px] font-medium text-[var(--ink)] hover:border-[#C67A6F] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TRUSTED BY ═══════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-11 pb-12">
        <TrustedBy theme="services" />
      </section>

      {/* ═══════════ CLOSING BAND ═══════════ */}
      <section className="bg-[var(--feature)] text-[var(--feature-ink)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-11 py-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <p className="text-[22px] leading-tight font-semibold" style={display}>
            Send a photo and a count. You will have a real number today.
          </p>
          <a
            href={getSmsLink('Hi Zach, here is what I need marked: ')}
            className="puffy-btn sm:ml-auto inline-flex items-center justify-center whitespace-nowrap px-6 py-3.5 rounded-sm bg-vurmz-cta text-white text-[15px] font-semibold hover:bg-vurmz-cta-hover transition-colors"
          >
            Text {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
