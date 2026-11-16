import Link from 'next/link'
import { pageMeta, BUSINESS_REF } from '@/lib/seo'
import Image from 'next/image'
import { Metadata } from 'next'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { CATALOG } from '@/lib/pricing'
import { portfolioBySlug, portfolioAlt } from '@/lib/portfolio'
import Breadcrumbs from '@/components/Breadcrumbs'

/**
 * Custom metal tags, 2026-11-12. Zach: the page was "just too specific.
 * I don't have exactly the things listed. Just list small steel and
 * aluminum custom tagging. Tell me what you need and we'll figure it
 * out." So: no named tag types, no stock sizes, no pack of ten with an
 * adhesive back, no trades list. What it is, what helps price it, some
 * metal work, and a way to say what you need.
 */

const description = 'Custom metal tags in steel and aluminum, laser marked in Centennial, CO. Tell me what you need and we will figure it out. Most runs ready in 24 to 72 hours.'

export const metadata: Metadata = pageMeta({
  title: 'Custom Metal Tags, Steel and Aluminum | VURMZ, Centennial',
  description: description,
  path: '/services/metal-tags',
  image: { url: '/portfolio/clga-faceplate-closeup.jpg', alt: 'A laser engraved metal faceplate made by VURMZ' },
})

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// Metal only: the shop plate, a faceplate, an anodized panel.
const SHOWCASE = ['vurmz-nameplate', 'clga-amp-faceplate', 'aluminum-artwork']
  .map((slug) => portfolioBySlug[slug])
  .filter(Boolean)

// What helps me price it. Nothing here is required.
const HELPS = [
  { h: 'What it goes on', p: 'A machine, a tool, a key, a bag, a product you make.' },
  { h: 'About how big', p: 'A rough size is enough. A photo next to a ruler is better.' },
  { h: 'What it should say', p: 'A name, a number, a logo, a code. Send the file if you have one.' },
  { h: 'How many', p: 'One or a few hundred. A guess is fine.' },
]

export default function MetalTagsPage() {
  const sms = getSmsLink('Hi Zach, I need some custom metal tags. What they go on: \nAbout how big: \nWhat they say: \nHow many: ')

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Custom Metal Tags',
    name: 'Custom Metal Tags in Steel and Aluminum',
    description: 'Small custom tags in steel and aluminum, laser marked to order for businesses across the south Denver metro. Most runs ready in 24 to 72 hours, hand-delivered.',
    provider: BUSINESS_REF,
    areaServed: siteInfo.serviceAreas.map((area) => ({ '@type': 'City', name: area })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: CATALOG.serviceTags.aluminumBase, priceCurrency: 'USD' },
    },
  }

  return (
    <div className="bg-[var(--page)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ═══════════ WHAT IT IS ═══════════ */}
      <section className="pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Business', href: '/services' }, { label: 'Metal tags' }]} theme="services" />
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">
            Custom tags
          </p>
          <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] text-[var(--ink)] tracking-tight leading-tight mb-6 max-w-[20ch]" style={display}>
            Small steel and aluminum tags, made to what you need.
          </h1>
          <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-2xl">
            I make small custom tags in steel and aluminum. Tell me what you need and we will figure it out.
            The mark is in the metal, so it does not peel or wipe off.
          </p>
          <p className="mt-5 text-[13px] font-mono tracking-wide text-[var(--eyebrow)]">
            No setup fee. No minimum. Aluminum from ${CATALOG.serviceTags.aluminumBase} a tag, steel from ${CATALOG.serviceTags.stainlessBase}.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href={sms}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-[var(--coral)] text-white font-semibold text-[15px] rounded-[var(--r-control)] hover:bg-[var(--coral-hover)] transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
            <Link
              href="/services#quote"
              className="inline-flex items-center justify-center h-12 px-7 border border-[var(--hairline)] hover:border-[var(--glass-edge)] text-[var(--ink)] font-semibold text-[15px] rounded-[var(--r-control)] transition-colors"
            >
              Or send it here
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT HELPS ═══════════ */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-6 sm:p-8">
            <h2 className="text-[length:var(--step-panel)] text-[var(--ink)]" style={display}>What helps me give you a price</h2>
            <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">Send what you know. We sort out the rest together.</p>
            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {HELPS.map((h) => (
                <div key={h.h} className="py-3.5 border-t border-[var(--hairline)]">
                  <dt className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">{h.h}</dt>
                  <dd className="mt-0.5 text-[length:var(--step-row)] leading-relaxed text-[var(--ink-soft)]">{h.p}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ═══════════ SHOWCASE ═══════════ */}
      {SHOWCASE.length > 0 && (
        <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
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
                      alt={portfolioAlt(item)}
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

      {/* ═══════════ CLOSE ═══════════ */}
      <section className="py-14 sm:py-[72px] border-t border-[var(--hairline)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[length:var(--step-section)] text-[var(--ink)] tracking-tight mb-4" style={display}>
            Tell me what you need.
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-6">
            A photo and a rough count is plenty. You have a number today.
          </p>
          <a
            href={sms}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-[var(--coral)] text-white font-semibold text-[15px] rounded-[var(--r-control)] hover:bg-[var(--coral-hover)] transition-colors"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Text {siteInfo.phone}
          </a>
        </div>
      </section>
    </div>
  )
}
