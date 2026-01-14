import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Laser Engraving Services Denver Metro | VURMZ',
  description: 'Professional laser engraving services in Centennial, CO. Branded pens, custom knives, metal business cards, equipment marking, cutting boards, awards. Fast turnaround.',
  keywords: [
    'laser engraving services Denver',
    'custom engraving Centennial',
    'branded pens service',
    'knife engraving Colorado',
    'metal business card engraving',
    'equipment marking service',
    'cutting board engraving',
    'corporate awards Denver',
    'promotional products engraving',
    'tool marking service',
    'restaurant equipment engraving',
  ],
  openGraph: {
    title: 'Laser Engraving Services | VURMZ',
    description: 'Professional laser engraving in Centennial. Pens, knives, cards, equipment marking, awards. Fast turnaround.',
    type: 'website',
    url: 'https://www.vurmz.com/services',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/services',
  },
}

const products = [
  {
    name: 'Branded Pens',
    description: 'Metal stylus pens with your logo. Good for any business that hands things to customers.',
    price: '$3-$7/pen',
  },
  {
    name: 'Tool & Equipment Marking',
    description: 'Kitchen pans, knives, power tools, hand tools. Permanent marking that identifies your stuff.',
    price: '$3-$75/item',
  },
  {
    name: 'Industrial Labels & Signs',
    description: 'ABS plastic signs for electrical panels, control boxes, equipment. Two-layer engraved plastic that lasts.',
    price: 'Starting at $8/sign',
  },
  {
    name: 'Metal Business Cards',
    description: 'Anodized aluminum cards. People keep these instead of throwing them away.',
    price: 'Starting at $5/card',
  },
  {
    name: 'Cutting Boards',
    description: 'Hardwood boards with custom engraving. Walnut, maple, cherry.',
    price: '$40-$50 each',
  },
  {
    name: 'Awards & Plaques',
    description: 'Recognition awards, name plates, custom signs.',
    price: 'Starting at $35',
  },
  {
    name: 'Custom Projects',
    description: 'Something else? Tell me what you need and I will let you know if I can do it.',
    price: 'Quote based',
  },
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Laser engraving on metal, wood, leather, glass, and more. No minimum orders.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-vurmz-dark mb-12 text-center">
            What I Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.name} className="border border-gray-200 p-6 hover:border-vurmz-powder transition-colors">
                <h3 className="text-xl font-semibold text-vurmz-dark mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-vurmz-sage font-semibold">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vurmz-dark mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-vurmz-teal text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg text-vurmz-dark mb-2">Send a Quote Request</h3>
              <p className="text-gray-600 text-sm">
                Tell me what you need. Upload your logo if you have one.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vurmz-teal text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg text-vurmz-dark mb-2">Get Your Quote</h3>
              <p className="text-gray-600 text-sm">
                I respond the same day with pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vurmz-teal text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg text-vurmz-dark mb-2">Approve & Produce</h3>
              <p className="text-gray-600 text-sm">
                Review the proof, approve, and I get to work.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vurmz-teal text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg text-vurmz-dark mb-2">Pickup or Delivery</h3>
              <p className="text-gray-600 text-sm">
                Pick up in Centennial or I deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-vurmz-dark mb-8 text-center">
            Materials I Work With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border-t-4 border-t-vurmz-teal border border-gray-200">
              <h3 className="text-lg font-semibold text-vurmz-dark mb-4">Metals</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Stainless steel
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Aluminum
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Anodized aluminum
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-teal" />
                  Brass
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 border-t-4 border-t-vurmz-sage border border-gray-200">
              <h3 className="text-lg font-semibold text-vurmz-dark mb-4">Wood & Organic</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  Hardwoods (walnut, maple, cherry)
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  Bamboo
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  Leather
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-sage" />
                  Glass
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 border-t-4 border-t-vurmz-powder border border-gray-200">
              <h3 className="text-lg font-semibold text-vurmz-dark mb-4">Other</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Acrylic
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  ABS engraving plastic
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Coated metals
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-vurmz-powder" />
                  Cylindrical items
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get a Quote
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell me what you need.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-white text-vurmz-dark px-8 py-4 font-semibold hover:bg-gray-100 transition-colors"
          >
            Request a Quote
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
