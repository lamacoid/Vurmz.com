import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChatBubbleLeftIcon, ArrowRightIcon, PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { SHOP_CATEGORIES, getCategoryBySlug, getCategoriesBySlugs } from '@/lib/categories'
import { BASIC, BASIC_PRICING_CARDS, SIGNATURE } from '@/lib/pricing'
import { siteInfo, getSmsLink, getPhoneLink } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryCard from '@/components/CategoryCard'
import AccordionFAQ from '@/components/AccordionFAQ'
import D1ProductGrid from '@/components/shop/D1ProductGrid'
import { getCategoryBySlug as getD1CategoryBySlug } from '@/lib/db/repos/products'

export const runtime = 'edge'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params
  const cat = getCategoryBySlug(slug)
  if (!cat) return {}
  return {
    title: cat.name,
    description: cat.description,
    openGraph: {
      title: cat.name,
      description: cat.description,
      ...(cat.heroImage ? { images: [{ url: `https://www.vurmz.com${cat.heroImage}`, width: 1200, height: 630, alt: cat.name }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: cat.name,
      description: cat.description,
      ...(cat.heroImage ? { images: [`https://www.vurmz.com${cat.heroImage}`] } : {}),
    },
  }
}

export default async function ShopCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const cat = getCategoryBySlug(slug)
  if (!cat) notFound()

  const related = getCategoriesBySlugs(cat.relatedCategories)
  const d1Cat = await getD1CategoryBySlug(slug).catch(() => null)

  // Get pricing card if basic type
  const pricingCard = cat.pricingKey
    ? BASIC_PRICING_CARDS.find(c => c.category === BASIC[cat.pricingKey!].name)
    : null

  // Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cat.name,
    description: cat.description,
    brand: { '@type': 'Brand', name: 'VURMZ' },
    image: cat.heroImage ? `https://www.vurmz.com${cat.heroImage}` : undefined,
    offers: cat.pricingType === 'basic' && cat.pricingKey ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'LocalBusiness', name: siteInfo.legalName },
    } : {
      '@type': 'Offer',
      price: String(SIGNATURE.startingPrice),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'LocalBusiness', name: siteInfo.legalName },
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cat.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-8 sm:pt-12 pb-10 sm:pb-14">
        {cat.heroImage && (
          <div className="absolute inset-0 overflow-hidden">
            <Image src={cat.heroImage} alt="" fill className="object-cover blur-2xl opacity-[0.08]" />
          </div>
        )}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Shop', href: '/shop' }, { label: cat.name }]} theme="shop" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-4 border border-[#B16558]/20 px-3 py-1.5 rounded-sm">
                {cat.shortName}
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#235158] tracking-tight leading-tight mb-4">
                {cat.name}
              </h1>
              <p className="text-[#6B6259] text-base sm:text-lg leading-relaxed mb-6">{cat.tagline}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={getSmsLink(cat.smsMessage)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#B16558] text-white font-semibold text-sm rounded-sm hover:bg-[#954E44] transition-all"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Text to order
                </a>
                <a
                  href={getPhoneLink()}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#235158]/15 text-[#235158] font-semibold text-sm rounded-sm hover:border-[#B16558]/30 transition-all"
                >
                  <PhoneIcon className="w-4 h-4" />
                  Call {siteInfo.phone}
                </a>
              </div>
            </div>
            {cat.heroImage && (
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image src={cat.heroImage} alt={cat.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live catalog — D1-backed products in this category */}
      {d1Cat && (
        <D1ProductGrid
          categoryId={d1Cat.id}
          heading="Shop ready to order"
          subheading="In-stock packs with prices up front. Pick and checkout."
        />
      )}

      {/* Pricing */}
      <section className="py-12 sm:py-16 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#B16558] tracking-[0.2em] uppercase mb-4">Pricing</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#235158] tracking-tight mb-8">What it costs.</h2>

          {cat.pricingType === 'signature' && (
            <div className="bg-white/60 border border-[#235158]/8 rounded-sm p-6 sm:p-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-[#B16558]">${SIGNATURE.startingPrice}+</span>
                <span className="text-[#6B6259] text-sm">Custom engraving on your item</span>
              </div>
              <ul className="space-y-2">
                {SIGNATURE.includes.map(item => (
                  <li key={item} className="flex items-center gap-2 text-[#6B6259] text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B16558]/40 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pricingCard && (
            <div className="bg-white/60 border border-[#235158]/8 rounded-sm p-6 sm:p-8">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-lg font-bold text-[#235158]">{pricingCard.category}</h3>
                {pricingCard.packTotal && <span className="text-[#B16558] font-bold text-sm">{pricingCard.packTotal}</span>}
              </div>
              <p className="text-[#7A7068] text-xs font-mono mb-4">{pricingCard.packNote}</p>
              <div className="space-y-2">
                {pricingCard.items.map(item => (
                  <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-[#235158]/5 last:border-0">
                    <div>
                      <span className="text-[#235158] text-sm">{item.name}</span>
                      {item.note && <span className="text-[#7A7068] text-xs ml-2">{item.note}</span>}
                    </div>
                    <span className="text-[#B16558] font-semibold text-sm">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[#7A7068] text-sm mt-6">
            Questions about pricing?{' '}
            <a href={getSmsLink('Hi, I have a question about pricing')} className="text-[#B16558] font-medium hover:underline">Text me</a>.
          </p>
        </div>
      </section>

      {/* Gallery */}
      {cat.galleryImages.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-mono text-[#B16558] tracking-[0.2em] uppercase mb-4">Examples</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#235158] tracking-tight mb-8">See the work.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.galleryImages.map(img => (
                <div key={img} className="relative aspect-square rounded-sm overflow-hidden group">
                  <Image src={img} alt={cat.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {cat.galleryImages.length === 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/40 border border-[#235158]/8 rounded-sm p-8 text-center">
              <p className="text-[#6B6259] text-sm mb-3">More photos coming soon.</p>
              <a href={getSmsLink('Hi, I have a question about this category')} className="text-[#B16558] font-semibold text-sm hover:underline">Text me for details</a>
            </div>
          </div>
        </section>
      )}

      {/* How to order */}
      <section className="py-12 sm:py-16 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#B16558] tracking-[0.2em] uppercase mb-4">How to Order</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#235158] tracking-tight mb-8">Three steps.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cat.howItWorks.map((step, i) => (
              <div key={i}>
                <div className="w-8 h-8 rounded-full bg-[#B16558]/10 flex items-center justify-center mb-3">
                  <span className="text-[#B16558] font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-[#235158] text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material note */}
      {cat.materialNote && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#235158] rounded-sm p-6 sm:p-8">
              <p className="text-[#F0E6D3] text-sm font-medium leading-relaxed">{cat.materialNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#B16558] tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#235158] tracking-tight mb-8">Common questions.</h2>
          <AccordionFAQ faqs={cat.faqs} theme="shop" />
        </div>
      </section>

      {/* Related categories */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-white/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[#235158] tracking-tight mb-6">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(r => (
                <CategoryCard key={r.slug} category={r} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantee */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 bg-white/60 border border-[#235158]/8 rounded-sm p-6">
            <ShieldCheckIcon className="w-8 h-8 text-[#B16558] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#235158] text-sm mb-1">Satisfaction promise</h3>
              <p className="text-[#6B6259] text-sm leading-relaxed">
                One person handles your order from start to finish. I don&apos;t deliver until it&apos;s right. If something&apos;s off, I fix it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#235158] rounded-sm p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-bold text-[#F0E6D3] mb-4">Ready to order?</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">Text me what you want and I&apos;ll get back to you with a quote.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getSmsLink(cat.smsMessage)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B16558] text-white font-semibold text-sm rounded-sm hover:bg-[#954E44] transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text to order
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-[#F0E6D3] font-semibold text-sm rounded-sm hover:bg-white/10 transition-all"
              >
                See all products
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-gray-400 font-medium text-sm rounded-sm hover:bg-white/10 transition-all"
              >
                Need custom work?
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
