import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { portfolioBySlug, portfolioAlt } from '@/lib/portfolio'
import { CATALOG, BUSINESS, DELIVERY } from '@/lib/pricing'
import { pageMeta, BUSINESS_REF } from '@/lib/seo'
import Breadcrumbs from '@/components/Breadcrumbs'

/**
 * /services/metal-business-cards (2026-11-15).
 *
 * The one page about metal cards, so a search for them lands somewhere
 * that says what they are and what they cost. Every price reads from
 * lib/pricing. It claims only what is true: anodized aluminum and
 * stainless steel, engraved from the customer's logo and details. It does
 * not list stock colors, because the shelf decides those (inventory
 * drives offers), and it does not offer a metal that is not made here.
 */
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)
const cards = CATALOG.cards

const description = `Custom metal business cards in anodized aluminum and stainless steel, laser engraved in Centennial, CO. From ${price(cards.matteBlackBase)} a card. Send your logo and details.`

export const metadata: Metadata = pageMeta({
  title: 'Custom Metal Business Cards | Steel & Aluminum | VURMZ',
  description,
  path: '/services/metal-business-cards',
  image: { url: '/images/portfolio/holographic-metal-cards.jpg', alt: 'Mirror stainless metal cards marked in color by VURMZ in Centennial, Colorado' },
})

const SHOWCASE = ['holographic-metal-cards', 'aluminum-artwork', 'vurmz-nameplate']
  .map(slug => portfolioBySlug[slug])
  .filter(Boolean)

const topDiscount = Math.round(Math.max(...BUSINESS.tiers.map(t => t.discount)) * 100)
const firstDiscountTier = BUSINESS.tiers.find(t => t.discount > 0)

// Answers come from the pricing file, the terms, and the delivery page.
const FAQS = [
  {
    q: 'What do I need to send?',
    a: 'Your logo as a file, the name and details that go on the card, and how many you want. A PDF, an SVG, or a sharp image all work. I lay the card out from that.',
  },
  {
    q: 'What do metal business cards cost?',
    a: `Anodized aluminum cards start at ${price(cards.matteBlackBase)} a card, sold in packs of ${cards.pack}, so ${price(cards.matteBlackBase * cards.pack)} a pack. Stainless steel cards start at ${price(cards.stainlessBase)} a card. A logo, a QR code, or a second side is ${price(cards.addOns.logo)} each per card. There is no setup fee.`,
  },
  {
    q: 'How does the engraving look on each metal?',
    a: 'On anodized aluminum the laser removes the color and the mark comes out bright silver. On stainless steel the mark is dark, and on mirror stainless it can be marked in color.',
  },
  {
    q: 'How long does it take?',
    a: 'Most runs are ready in 24 to 72 hours once I have your artwork.',
  },
  {
    q: 'Do you ship metal business cards?',
    a: `Yes. Orders in the ${DELIVERY.area} are hand-delivered, free over $${DELIVERY.freeThreshold}. Anywhere else in the US they ship by USPS with tracking.`,
  },
  {
    q: 'Is there a discount on larger orders?',
    a: firstDiscountTier
      ? `Yes. Volume pricing starts at ${firstDiscountTier.minUnits} cards with ${Math.round(firstDiscountTier.discount * 100)}% off and goes up to ${topDiscount}% off on standing orders.`
      : 'Text me the count and I will price the run.',
  },
]

export default function MetalBusinessCardsPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Metal Business Cards',
      name: 'Custom Metal Business Cards',
      description,
      provider: BUSINESS_REF,
      areaServed: [...siteInfo.serviceAreas.map(area => ({ '@type': 'City', name: area })), { '@type': 'Country', name: 'United States' }],
      offers: [
        { '@type': 'Offer', name: `Anodized aluminum cards, pack of ${cards.pack}`, priceCurrency: 'USD', price: (cards.matteBlackBase * cards.pack).toFixed(2) },
        { '@type': 'Offer', name: 'Stainless steel card, each', priceCurrency: 'USD', price: cards.stainlessBase.toFixed(2) },
      ],
    },
    // The cards as a product, with the same prices the page shows. Made to
    // order is the honest availability: nothing here is promised from stock.
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Custom Metal Business Cards',
      description,
      image: `${siteInfo.url}/images/portfolio/holographic-metal-cards.jpg`,
      category: 'Business cards',
      material: 'Anodized aluminum or stainless steel',
      brand: { '@type': 'Brand', name: 'VURMZ' },
      offers: [
        {
          '@type': 'Offer',
          name: `Anodized aluminum cards, pack of ${cards.pack}`,
          url: `${siteInfo.url}/services/metal-business-cards/`,
          priceCurrency: 'USD',
          price: (cards.matteBlackBase * cards.pack).toFixed(2),
          availability: 'https://schema.org/MadeToOrder',
          seller: BUSINESS_REF,
        },
        {
          '@type': 'Offer',
          name: 'Stainless steel card, each',
          url: `${siteInfo.url}/services/metal-business-cards/`,
          priceCurrency: 'USD',
          price: cards.stainlessBase.toFixed(2),
          availability: 'https://schema.org/MadeToOrder',
          seller: BUSINESS_REF,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <div className="bg-[var(--page)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Business', href: '/services' }, { label: 'Metal Business Cards' }]} theme="services" />
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">Aluminum and stainless steel</p>
          <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] font-semibold text-[var(--ink)] tracking-tight leading-tight mb-6">
            Custom Metal Business Cards
          </h1>
          <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Card-size anodized aluminum and stainless steel, laser engraved with your name, your logo, and your details.
            Send me the logo and what goes on the card and I lay it out. Hand-delivered across the {DELIVERY.area}, shipped anywhere in the US.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/services/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--coral)] text-white font-semibold text-sm rounded-[var(--r-control)] hover:bg-[var(--coral-hover)] transition-colors"
            >
              Get a quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink('Hi Zach, I would like metal business cards. How many: \nLogo attached: ')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--hairline)] text-[var(--ink)] font-semibold text-sm rounded-[var(--r-control)] hover:border-[var(--ink)]/40 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Prices */}
      <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-mono text-[var(--ink-soft)] tracking-[0.2em] uppercase mb-8">What metal cards cost</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6">
              <p className="text-4xl font-semibold text-[var(--ink)] mb-1">{price(cards.matteBlackBase)}<span className="text-lg text-[var(--ink-soft)] font-normal">/card</span></p>
              <p className="text-sm font-semibold text-[var(--ink)] mb-2">Anodized aluminum</p>
              <p className="text-[var(--ink-soft)] text-sm leading-relaxed">Packs of {cards.pack}, {price(cards.matteBlackBase * cards.pack)} a pack. The mark comes out bright silver on the color.</p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6">
              <p className="text-4xl font-semibold text-[var(--ink)] mb-1">{price(cards.stainlessBase)}<span className="text-lg text-[var(--ink-soft)] font-normal">/card</span></p>
              <p className="text-sm font-semibold text-[var(--ink)] mb-2">Stainless steel</p>
              <p className="text-[var(--ink-soft)] text-sm leading-relaxed">A dark mark on brushed steel, or color on mirror stainless.</p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6">
              <p className="text-4xl font-semibold text-[var(--ink)] mb-1">+{price(cards.addOns.logo)}<span className="text-lg text-[var(--ink-soft)] font-normal">/card</span></p>
              <p className="text-sm font-semibold text-[var(--ink)] mb-2">Logo, QR code, or back side</p>
              <p className="text-[var(--ink-soft)] text-sm leading-relaxed">Each one adds {price(cards.addOns.logo)} a card. No setup fee on any of it.</p>
            </div>
          </div>
          <p className="text-[var(--ink-soft)] text-sm mt-5 max-w-2xl">
            {firstDiscountTier ? `Volume pricing starts at ${firstDiscountTier.minUnits} cards. ` : ''}
            The full list is on the{' '}
            <Link href="/services#lanes" className="text-[var(--eyebrow)] font-semibold hover:underline">business pricing page</Link>.
            A pack of ten can be ordered straight from the{' '}
            <Link href="/shop" className="text-[var(--eyebrow)] font-semibold hover:underline">item list</Link>.
          </p>
        </div>
      </section>

      {/* Work */}
      {SHOWCASE.length > 0 && (
        <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-mono text-[var(--ink-soft)] tracking-[0.2em] uppercase mb-8">Metal I have marked</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SHOWCASE.map(item => (
                <Link key={item.slug} href={`/services/portfolio/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                    <Image
                      src={item.src}
                      alt={portfolioAlt(item)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{item.label}</p>
                  <p className="text-[11px] font-mono text-[var(--ink-soft)] tracking-[0.12em] uppercase">{item.material} &middot; {item.process}</p>
                </Link>
              ))}
            </div>
            <p className="text-[var(--ink-soft)] text-sm mt-6">
              More on how each metal takes a mark on the{' '}
              <Link href="/services/materials" className="text-[var(--eyebrow)] font-semibold hover:underline">materials page</Link>,
              and more finished pieces in{' '}
              <Link href="/services/portfolio" className="text-[var(--eyebrow)] font-semibold hover:underline">the work</Link>.
            </p>
          </div>
        </section>
      )}

      {/* Questions */}
      <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[length:var(--step-section)] font-semibold text-[var(--ink)] tracking-tight mb-6">Questions about metal business cards</h2>
          <dl className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {FAQS.map(f => (
              <div key={f.q} className="py-4">
                <dt className="text-[15.5px] font-semibold text-[var(--ink)]">{f.q}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Close */}
      <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[length:var(--step-section)] font-semibold text-[var(--ink)] tracking-tight mb-4">Send the logo and a count.</h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-6">You have a price the same day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--coral)] text-white font-semibold text-sm rounded-[var(--r-control)] hover:bg-[var(--coral-hover)] transition-colors"
            >
              Get a quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink('Hi Zach, I would like metal business cards. How many: \nLogo attached: ')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--hairline)] text-[var(--ink)] font-semibold text-sm rounded-[var(--r-control)] hover:border-[var(--ink)]/40 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
