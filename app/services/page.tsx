export const runtime = 'edge'

import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { getD1 } from '@/lib/d1'

export const metadata: Metadata = {
  title: 'Equipment Nameplates, Data Plates & Industrial Laser Engraving',
  description: 'Laser engraved equipment nameplates, ABS panel labels, asset identification tags, valve tags, and safety placards for electrical contractors, HVAC technicians, and facilities management.',
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  enabled: boolean
  isPrimary?: boolean
  order: number
}

async function getProducts(): Promise<Product[]> {
  try {
    const db = getD1()
    const result = await db.prepare(
      "SELECT config FROM site_config WHERE id = 'main'"
    ).first() as { config: string } | null

    if (!result) return []

    const config = JSON.parse(result.config)
    const products = config.products || []

    return products
      .filter((p: Product) => p.enabled)
      .sort((a: Product, b: Product) => (a.order || 0) - (b.order || 0))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ServicesPage() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#a8c8c8] text-gray-900 py-10 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Industrial Laser Engraving Services
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl">
            Equipment nameplates, data plates, ABS panel labels, asset identification tags, valve tags, and safety placards. Fast turnaround for electrical contractors, HVAC technicians, solar installers, and facilities management.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-vurmz-dark mb-8 sm:mb-12 text-center">
            Product Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 p-4 sm:p-6 hover:border-vurmz-powder transition-colors rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-vurmz-dark mb-2 sm:mb-3">{product.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{product.description}</p>
                <p className="text-vurmz-sage font-semibold text-sm sm:text-base">{product.price}</p>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products configured. Add products in Site Manager.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-vurmz-light py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-vurmz-dark mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                1
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-vurmz-dark mb-1 sm:mb-2">Start Your Order</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Tell me what you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                2
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-vurmz-dark mb-1 sm:mb-2">Get Pricing</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Same day response.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                3
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-vurmz-dark mb-1 sm:mb-2">Approve & Produce</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Review, approve, done.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-vurmz-teal text-white flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 rounded-lg">
                4
              </div>
              <h3 className="font-semibold text-sm sm:text-base md:text-lg text-vurmz-dark mb-1 sm:mb-2">Pickup or Delivery</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Centennial pickup or delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-vurmz-dark mb-6 sm:mb-8 text-center">
            Material Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-6 border-t-4 border-t-vurmz-teal border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-vurmz-dark mb-3 sm:mb-4">Metals</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Stainless steel labels & nameplates
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Anodized aluminum nameplates
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Brass data plates
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Powder coated metals
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 border-t-4 border-t-vurmz-sage border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-vurmz-dark mb-3 sm:mb-4">Industrial Plastics</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  ABS plastic engraving (two-layer)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  UV-resistant permanent marking
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  Acrylic signage
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  High-visibility safety colors
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6 border-t-4 border-t-vurmz-powder border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-vurmz-dark mb-3 sm:mb-4">Other Materials</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Hardwoods (walnut, maple, cherry)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Glass & crystal
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Leather goods
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Cylindrical items (rotary engraving)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Order?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
            Tell me what you need.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-white text-vurmz-dark px-6 py-3 sm:px-8 sm:py-4 font-semibold hover:bg-gray-100 transition-colors rounded-lg sm:rounded-none"
          >
            Start Your Order
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
