import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { portfolioBySlug } from '@/lib/portfolio'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: { absolute: 'Metal Service Tags & Equipment Nameplates | VURMZ — Centennial, CO' },
  description: 'Engraved metal service tags, serial plates, and equipment nameplates for trades in the Denver metro. Durable fiber laser marking, next-day turnaround, hand-delivered.',
  alternates: { canonical: '/services/metal-tags' },
  openGraph: {
    title: 'Metal Service Tags & Equipment Nameplates | VURMZ',
    description: 'Engraved metal service tags, serial plates, and equipment nameplates for trades in the Denver metro. Durable fiber laser marking, next-day turnaround, hand-delivered.',
    url: `${siteInfo.url}/services/metal-tags`,
    images: ['/portfolio/clga-faceplate-closeup.jpg'],
  },
}

// Relevant portfolio shots: brushed-metal faceplate, anodized panel, asset marking.
const SHOWCASE = ['clga-amp-faceplate', 'aluminum-artwork', 'plastic-charger-marking']
  .map((slug) => portfolioBySlug[slug])
  .filter(Boolean)

export default function MetalTagsPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Metal Service Tags & Equipment Nameplates',
    name: 'Engraved Metal Service Tags & Equipment Nameplates',
    description: 'Fiber-laser engraved service tags, serial plates, QC tags, and equipment nameplates for HVAC, electrical, plumbing, and trade shops across the south Denver metro. Durable, next-day turnaround, hand-delivered.',
    provider: {
      '@type': 'LocalBusiness',
      name: siteInfo.legalName,
      url: siteInfo.url,
      telephone: siteInfo.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteInfo.city,
        addressRegion: siteInfo.stateAbbr,
        addressCountry: 'US',
      },
    },
    areaServed: siteInfo.serviceAreas.map((area) => ({ '@type': 'City', name: area })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-[var(--page)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Metal Service Tags' }]} theme="services" />
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">
            For the Trades
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-6">
            Metal Service Tags &amp; Equipment Nameplates
          </h1>
          <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-2xl">
            Stickers fall off. Sharpie wipes away. A fiber-laser mark in stainless or anodized aluminum outlives the equipment it&apos;s on. I make service tags, serial plates, QC tags, and nameplates for HVAC techs, electricians, plumbers, and shops across the south Denver metro. Phone number, license number, QR code, logo, whatever your tag needs to carry. Standard sizes or cut to spec. Order ten or order five hundred. Next-day turnaround on most runs, hand-delivered.
          </p>
        </div>
      </section>

      {/* ═══════════ SHOWCASE ═══════════ */}
      {SHOWCASE.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-[var(--hairline)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-mono text-[var(--ink-soft)] tracking-[0.2em] uppercase mb-8">
              Recent metal work
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SHOWCASE.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/portfolio/${item.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-2 text-[11px] font-mono text-[var(--ink-soft)] tracking-[0.12em] uppercase">
                    {item.material} &middot; {item.process}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-[var(--hairline)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-4">
            Tell me what your tag needs to carry.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-6">
            Text me the details and a rough count. I&apos;ll quote you fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              Get a Quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink('I need metal service tags or nameplates')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
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
