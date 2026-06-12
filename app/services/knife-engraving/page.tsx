import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { portfolioBySlug } from '@/lib/portfolio'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: { absolute: 'Knife Engraving | VURMZ — Centennial, CO' },
  description: 'Custom knife engraving in Centennial, CO. Chef knives, pocket knives, cleavers. Names, dates, and logos marked permanently in the steel. Next-day turnaround.',
  alternates: { canonical: '/services/knife-engraving' },
  openGraph: {
    title: 'Knife Engraving | VURMZ',
    description: 'Custom knife engraving in Centennial, CO. Chef knives, pocket knives, cleavers. Names, dates, and logos marked permanently in the steel. Next-day turnaround.',
    url: `${siteInfo.url}/services/knife-engraving`,
    images: ['/portfolio/culinary-cleaver-engraved.jpg'],
  },
}

// Relevant portfolio shots: engraved cleaver + pocket knife.
const SHOWCASE = ['culinary-cleaver', 'pocket-knife']
  .map((slug) => portfolioBySlug[slug])
  .filter(Boolean)

export default function KnifeEngravingPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Knife Engraving',
    name: 'Custom Knife Engraving',
    description: 'Custom knife engraving in Centennial, CO. Chef knives, pocket knives, cleavers, and hunting knives. Names, dates, and logos marked permanently into the steel with a fiber laser. Next-day turnaround, hand-delivered across the south Denver metro.',
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
    <div className="bg-vurmz-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Knife Engraving' }]} theme="services" />
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
            In the Steel
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-tight mb-6">
            Knife Engraving
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            I spent fifteen years in professional kitchens before I picked up a laser, so I know what a knife means to the person who carries it. Chef knives, pocket knives, cleavers, hunting knives. A name on the blade, a date on the bolster, a logo on the handle plate. Fiber laser marking goes into the steel, not onto it, so it survives the sharpener and the dishwasher you shouldn&apos;t be using anyway. Bring me your knife or I&apos;ll source one. Next-day on most jobs.
          </p>
        </div>
      </section>

      {/* ═══════════ SHOWCASE ═══════════ */}
      {SHOWCASE.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-8">
              Recent knife work
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHOWCASE.map((item) => (
                <Link
                  key={item.slug}
                  href="/shop/knives"
                  className="group block"
                >
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <p className="mt-2 text-[11px] font-mono text-gray-500 tracking-[0.12em] uppercase">
                    {item.material} &middot; {item.process}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">
            Bring me your knife.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Text me a photo and what you want marked. I&apos;ll quote you fast.
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
              href={getSmsLink('I have a knife I want engraved')}
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
