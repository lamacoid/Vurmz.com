import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { PRODUCTS, PROMO_PACK_SIZE } from '@/lib/products'
import { siteInfo } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Laser Engraving Services | Pens, Cards, Labels | VURMZ Centennial CO',
  description: `Laser engraving for small businesses in South Denver metro. Branded pens, metal cards, tool marking, knife engraving, and custom products. Fast turnaround in ${siteInfo.city}.`,
}

const products = [
  {
    id: '1',
    name: PRODUCTS.pens.name,
    description: 'Metal stylus pens with your logo. Perfect for clients, trade shows, and staff gifts.',
    price: `$${PRODUCTS.pens.fullyLoaded}/pen (pack of ${PROMO_PACK_SIZE})`,
  },
  {
    id: '2',
    name: PRODUCTS.businessCards.name,
    description: PRODUCTS.businessCards.description,
    price: `From $${PRODUCTS.businessCards.matteBlackLoaded}/card`,
  },
  {
    id: '3',
    name: PRODUCTS.tools.name,
    description: 'Permanent marking on power tools and equipment. Prevent theft, identify your gear.',
    price: `From $${PRODUCTS.tools.base}/tool`,
  },
  {
    id: '4',
    name: PRODUCTS.knives.name,
    description: PRODUCTS.knives.description,
    price: `From $${PRODUCTS.knives.base}/knife`,
  },
  {
    id: '5',
    name: `${PRODUCTS.coasters.name} & ${PRODUCTS.keychains.name}`,
    description: 'Bamboo coasters, metal keychains, and other promotional items with your logo.',
    price: `From $${PRODUCTS.coasters.materials.wood}/piece`,
  },
  {
    id: '6',
    name: 'Custom Projects',
    description: 'Awards, plaques, signage, industrial labels, and anything else you can imagine.',
    price: 'Quote',
  },
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-vurmz-dark text-white py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(60,185,178,0.12) 0%, transparent 60%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Professional Engraving Services
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
            Same-day turnaround on branded pens, metal business cards, tool marking, knife engraving, and custom projects. Local pickup or hand-delivered.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24 bg-[#0d1b1a] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10 sm:mb-14 text-center">
            Product Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-6 sm:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-vurmz-teal/20 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.description}</p>
                <p className="text-vurmz-teal font-semibold text-sm">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-vurmz-dark py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">How It Works</h2>
            <p className="text-gray-500 text-base sm:text-lg">Four steps. Usually done same-day.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Text or Email Your Project', desc: 'Direct message to Zach. No forms, no runaround.' },
              { step: '02', title: 'Same-Day Quote', desc: 'Exact pricing by end of business.' },
              { step: '03', title: 'Approve & Produce', desc: 'Review, approve, done.' },
              { step: '04', title: 'Pickup or Delivery', desc: `${siteInfo.city} pickup or free delivery.` },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-vurmz-teal/30 text-4xl sm:text-5xl font-bold tracking-tighter mb-3">{item.step}</div>
                <h3 className="font-semibold text-sm sm:text-base text-white mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-16 sm:py-24 bg-[#0d1b1a] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10 sm:mb-14 text-center">
            Materials We Work With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                title: 'Metals',
                items: ['Stainless steel', 'Anodized aluminum', 'Brass', 'Powder coated metals'],
              },
              {
                title: 'Plastics & Acrylics',
                items: ['Two-layer ABS plastic', 'UV-resistant materials', 'Acrylic signage', 'High-visibility colors'],
              },
              {
                title: 'Other Materials',
                items: ['Hardwoods & bamboo', 'Glass & crystal', 'Leather goods', 'Cylindrical items'],
              },
            ].map((category) => (
              <div key={category.title} className="p-6 sm:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2.5">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-gray-400 text-sm">
                      <CheckIcon className="h-4 w-4 text-vurmz-teal/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-dark py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(60,185,178,0.15) 0%, transparent 60%)',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-8">
            Tell me what you need. Same-day quote guaranteed.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-vurmz-teal text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-vurmz-teal-dark transition-all shadow-lg shadow-vurmz-teal/20"
          >
            Start Your Order
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
