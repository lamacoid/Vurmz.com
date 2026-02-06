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

// Products from centralized data
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
      <section className="relative bg-vurmz-dark text-white py-10 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20" style={{
          background: 'radial-gradient(ellipse at top right, rgba(106,140,140,0.4) 0%, transparent 60%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Professional Engraving Services — Right in Your Neighborhood
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl">
            Same-day turnaround on branded pens, metal business cards, tool marking, knife engraving, and custom projects. Local pickup or hand-delivered to your office.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#1f2523]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">
            Product Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-vurmz-dark border border-gray-700 p-4 sm:p-6 hover:border-vurmz-teal transition-colors rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{product.name}</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">{product.description}</p>
                <p className="text-vurmz-teal font-semibold text-sm sm:text-base">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-vurmz-dark py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                1
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2">Text or Email Your Project</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Direct message to Zach. No forms, no runaround.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                2
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2">Same-Day Quote</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Exact pricing by end of business.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                3
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2">Approve & Produce</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Review, approve, done.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                4
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2">Pickup or Delivery</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {siteInfo.city} pickup or delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#1f2523]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            Materials I Work With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-vurmz-dark p-4 sm:p-6 border-t-4 border-t-vurmz-teal border border-gray-700 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Metals</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Stainless steel
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Anodized aluminum
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Brass
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Powder coated metals
                </li>
              </ul>
            </div>
            <div className="bg-vurmz-dark p-4 sm:p-6 border-t-4 border-t-vurmz-teal border border-gray-700 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Plastics & Acrylics</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Two-layer ABS plastic
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  UV-resistant materials
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Acrylic signage
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  High-visibility colors
                </li>
              </ul>
            </div>
            <div className="bg-vurmz-dark p-4 sm:p-6 border-t-4 border-t-vurmz-teal border border-gray-700 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Other Materials</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Hardwoods & bamboo
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Glass & crystal
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Leather goods
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Cylindrical items
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Order?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
            Tell me what you need.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-vurmz-dark text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold hover:bg-vurmz-dark/80 transition-colors rounded-xl"
          >
            Start Your Order
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
