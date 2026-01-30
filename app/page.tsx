'use client'

import Link from 'next/link'
import { ArrowRightIcon, MapPinIcon, ClockIcon, CubeIcon, UserIcon, TruckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { PRODUCTS } from '@/lib/products'

const products = [
  {
    name: PRODUCTS.pens.name,
    price: `$${PRODUCTS.pens.fullyLoaded}`,
    unit: '/pen',
    description: `Metal stylus pens with your logo. Pack of ${PRODUCTS.pens.packSize} = $${PRODUCTS.pens.fullyLoadedPackPrice}`,
  },
  {
    name: PRODUCTS.businessCards.name,
    price: `$${PRODUCTS.businessCards.matteBlackLoaded}`,
    unit: '/card',
    description: `Matte black aluminum. Stainless steel from $${PRODUCTS.businessCards.stainlessBase}.`,
  },
  {
    name: PRODUCTS.knives.name,
    price: `$${PRODUCTS.knives.base}`,
    unit: '+',
    description: PRODUCTS.knives.description,
  },
  {
    name: PRODUCTS.tools.name,
    price: `$${PRODUCTS.tools.base}`,
    unit: '+',
    description: PRODUCTS.tools.description,
  },
]

const valueProps = [
  { title: 'Fast Turnaround', description: 'Most orders ready same-day or next-day.', icon: ClockIcon },
  { title: 'No Minimums', description: 'Order 1 or 100. No forced bulk.', icon: CubeIcon },
  { title: 'Text Me Directly', description: 'One person. Quick answers, no runaround.', icon: UserIcon },
  { title: 'Local Pickup', description: `${siteInfo.city} pickup or delivery over $100.`, icon: TruckIcon },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(106,140,140,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(106,140,140,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* Teal gradient accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20" style={{
          background: 'radial-gradient(ellipse at top right, rgba(106,140,140,0.4) 0%, transparent 60%)',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-vurmz-teal/20 border border-vurmz-teal/30 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 mb-6">
                <MapPinIcon className="h-4 w-4 text-vurmz-teal" />
                <span className="text-xs sm:text-sm font-medium text-gray-300">{siteInfo.city}, {siteInfo.state}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-white leading-tight">
                Laser Engraving for Your Small Business
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-6">
                Branded pens, metal cards, tool marking, knife engraving. No minimums. Fast turnaround in South Denver metro.
              </p>

              {/* Starting prices */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-vurmz-teal/20 border border-vurmz-teal/30 text-white px-3 py-1.5 rounded-full text-sm">
                  Pens from <strong>${PRODUCTS.pens.basePerItem}</strong>
                </span>
                <span className="bg-vurmz-teal/20 border border-vurmz-teal/30 text-white px-3 py-1.5 rounded-full text-sm">
                  Cards from <strong>${PRODUCTS.businessCards.matteBlackBase}</strong>
                </span>
                <span className="bg-vurmz-teal/20 border border-vurmz-teal/30 text-white px-3 py-1.5 rounded-full text-sm">
                  Knives from <strong>${PRODUCTS.knives.base}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-vurmz-teal text-white px-6 py-4 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-vurmz-teal-dark transition-all"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Text Me for a Quote
                </a>
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-600 text-gray-300 hover:border-vurmz-teal hover:text-white transition-all"
                >
                  Build Your Order
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>

            {/* Product preview - placeholder for now */}
            <div className="hidden lg:block">
              <div className="bg-[#1f2523] rounded-2xl p-8 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">Popular Products</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.name} className="flex justify-between items-start p-4 bg-vurmz-dark rounded-lg border border-gray-700">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-vurmz-teal font-bold text-lg">{product.price}</span>
                        <span className="text-gray-400 text-sm">{product.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/pricing" className="block text-center text-vurmz-teal font-medium mt-6 hover:underline">
                  View full pricing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile product prices - shown only on mobile */}
      <section className="lg:hidden bg-[#1f2523] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Popular Products</h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.name} className="bg-vurmz-dark p-4 rounded-lg border border-gray-700">
                <p className="font-medium text-white text-sm">{product.name}</p>
                <p className="text-vurmz-teal font-bold mt-1">
                  {product.price}<span className="text-gray-400 text-xs font-normal">{product.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="block text-center text-vurmz-teal font-medium mt-4 hover:underline text-sm">
            View full pricing →
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-vurmz-dark py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">
            Why Local Beats Online
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="bg-[#1f2523] p-4 sm:p-6 rounded-lg border border-gray-700">
                <prop.icon className="h-6 w-6 sm:h-8 sm:w-8 text-vurmz-teal mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">{prop.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Text me your project details. Same-day response, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href={getSmsLink()}
              className="bg-vurmz-dark text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-vurmz-dark/80 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Text {siteInfo.phone}
            </a>
            <Link
              href="/order"
              className="border-2 border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Build Your Order Online
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
