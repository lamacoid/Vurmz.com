import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CubeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Laser Engraving Pricing | No Hidden Fees | VURMZ',
  description: 'Transparent laser engraving prices for Denver metro. Pens from $3, equipment marking from $3, business cards from $5. No setup fees for repeat customers. No minimums.',
  keywords: [
    'laser engraving prices Denver',
    'engraving cost Centennial',
    'custom pen pricing',
    'equipment marking cost',
    'metal business card price',
    'knife engraving cost',
    'no minimum engraving',
    'affordable laser engraving Colorado',
    'transparent engraving pricing',
    'corporate gift pricing Denver',
  ],
  openGraph: {
    title: 'Pricing | VURMZ Laser Engraving',
    description: 'Transparent pricing. No hidden fees. Pens from $3, equipment marking from $3. Denver metro.',
    type: 'website',
    url: 'https://www.vurmz.com/pricing',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/pricing',
  },
}

const pricingCategories = [
  {
    category: 'Promotional Items',
    items: [
      { name: 'Metal Stylus Pens', price: '$3-$7/pen', note: 'Price varies with upgrades' },
      { name: 'Keychains', price: 'Starting at $4/unit', note: 'Various styles' },
      { name: 'Coasters', price: 'Starting at $6/unit', note: 'Wood or metal' },
      { name: 'Bottle Openers', price: 'Starting at $5/unit', note: 'Metal' },
    ],
  },
  {
    category: 'Tool & Equipment Marking',
    items: [
      { name: 'Kitchen Pans (existing)', price: '$3-$5/pan', note: '9th, 6th, hotel pans, sheet trays' },
      { name: 'Knife Engraving (your knife)', price: '$15/knife', note: 'Bring your own knife' },
      { name: 'Pocket Knife + Engraving', price: '$40', note: 'Basic pocket knife included' },
      { name: 'Chef Knife + Engraving', price: '$50', note: 'Basic chef knife included' },
      { name: 'Steak Knife Sets', price: '$60-$85', note: '4-piece or 6-piece sets' },
      { name: 'Power Tools', price: '$30-$75/item', note: 'Complexity varies' },
      { name: 'Hand Tools', price: '$30-$50/item', note: 'Depends on size/material' },
    ],
  },
  {
    category: 'Business Cards & Signage',
    items: [
      { name: 'Metal Business Cards', price: '$3-$6/card', note: 'Stainless steel from $15' },
      { name: 'Name Plates', price: 'Starting at $15', note: 'Desk or door mount' },
      { name: 'Custom Signs', price: 'Quote based', note: 'Size and material dependent' },
    ],
  },
  {
    category: 'Industrial Labels & Signs',
    items: [
      { name: 'Panel Labels (small)', price: '$8-$12/sign', note: 'Under 2" x 4"' },
      { name: 'Panel Labels (medium)', price: '$12-$20/sign', note: '2" x 4" to 4" x 6"' },
      { name: 'Equipment Signs (large)', price: '$20-$40/sign', note: 'Larger sizes' },
      { name: 'Custom Industrial Signage', price: 'Quote based', note: 'Size and quantity dependent' },
    ],
  },
  {
    category: 'Awards & Gifts',
    items: [
      { name: 'Recognition Plaques', price: 'Starting at $35', note: 'Wood or acrylic' },
      { name: 'Cutting Boards', price: '$40-$50', note: 'Hardwood (walnut, maple, cherry)' },
      { name: 'Wine Gift Boxes', price: 'Contact for pricing', note: 'Branded wooden boxes' },
      { name: 'Insulated Water Bottles', price: '$25-$40', note: 'Stainless steel' },
    ],
  },
]

const comparison = [
  {
    factor: 'Turnaround',
    vurmz: 'Next-day, same-day often possible',
    online: '1-3 weeks',
  },
  {
    factor: 'Minimum Order',
    vurmz: 'No minimum',
    online: '50-250 pieces typical',
  },
  {
    factor: 'Shipping',
    vurmz: 'Free local pickup, delivery available',
    online: '$15-$50+ depending on size',
  },
  {
    factor: 'Communication',
    vurmz: 'Direct with owner',
    online: 'Support tickets, chatbots',
  },
  {
    factor: 'Errors/Issues',
    vurmz: 'Fixed quickly, personally',
    online: 'Return shipping, wait for replacement',
  },
  {
    factor: 'Rush Orders',
    vurmz: 'Usually yes',
    online: 'Extra fees if available',
  },
]

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Premium local service, honestly priced. Here's what things cost and why.
            </p>
          </div>
        </div>
      </section>

      {/* Why Premium Pricing */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-vurmz-dark mb-4">
              Why Local Costs More
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200 border-t-4 border-t-vurmz-teal text-center">
              <ClockIcon className="h-10 w-10 text-vurmz-teal mx-auto mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Fast Turnaround</h3>
              <p className="text-gray-600 text-sm">Days, not weeks</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 border-t-4 border-t-vurmz-powder text-center">
              <CubeIcon className="h-10 w-10 text-vurmz-powder mx-auto mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">No Minimums</h3>
              <p className="text-gray-600 text-sm">Order what you need</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 border-t-4 border-t-vurmz-sage text-center">
              <UserIcon className="h-10 w-10 text-vurmz-sage mx-auto mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Direct Communication</h3>
              <p className="text-gray-600 text-sm">Talk to the owner</p>
            </div>
            <div className="bg-white p-6 border border-gray-200 border-t-4 border-t-vurmz-powder text-center">
              <TruckIcon className="h-10 w-10 text-vurmz-powder mx-auto mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Local Service</h3>
              <p className="text-gray-600 text-sm">Pickup or delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Cost Comparison */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-vurmz-dark mb-8 text-center">
            The Real Cost Comparison
          </h2>

          <div className="bg-vurmz-light p-8 mb-8">
            <h3 className="text-xl font-semibold text-vurmz-dark mb-6">Example: 50 Branded Pens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-300 p-6 bg-white">
                <h4 className="font-semibold text-gray-500 mb-4">Online Wholesaler</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>100 pens @ $2.00 (minimum)</span>
                    <span>$200</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Setup fee</span>
                    <span>$25</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Shipping</span>
                    <span>$18</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wait time</span>
                    <span>2 weeks</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Extra pens you do not need</span>
                    <span>50</span>
                  </li>
                </ul>
                <div className="border-t border-gray-300 mt-4 pt-4">
                  <p className="flex justify-between font-semibold text-vurmz-dark">
                    <span>Total</span>
                    <span>$243 + hassle</span>
                  </p>
                </div>
              </div>

              <div className="border-2 border-vurmz-teal p-6 bg-white">
                <h4 className="font-semibold text-vurmz-teal mb-4">VURMZ</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>50 pens @ $3.50</span>
                    <span>$175</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Setup fee</span>
                    <span>$0</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pickup in Centennial</span>
                    <span>$0</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Wait time</span>
                    <span>Next day</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Extra pens</span>
                    <span>0</span>
                  </li>
                </ul>
                <div className="border-t border-vurmz-teal mt-4 pt-4">
                  <p className="flex justify-between font-semibold text-vurmz-teal">
                    <span>Total</span>
                    <span>$175</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              <span className="font-semibold">Result:</span> You save $68 and get them next day.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-vurmz-dark mb-12 text-center">
            Product Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingCategories.map((category) => (
              <div key={category.category} className="bg-white border border-gray-200">
                <div className="bg-vurmz-dark text-white px-6 py-4">
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {category.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-3">
                            <p className="font-medium text-vurmz-dark">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.note}</p>
                          </td>
                          <td className="py-3 text-right">
                            <p className="font-semibold text-vurmz-teal">{item.price}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Prices are estimates. Final pricing depends on quantity, complexity, and materials.
            <Link href="/order" className="text-vurmz-teal font-medium ml-1 hover:underline">
              Get an exact quote
            </Link>
          </p>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-vurmz-dark mb-8 text-center">
            VURMZ vs Online Wholesalers
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-vurmz-dark text-white">
                  <th className="px-6 py-4 text-left font-semibold">Factor</th>
                  <th className="px-6 py-4 text-left font-semibold">VURMZ</th>
                  <th className="px-6 py-4 text-left font-semibold">Online Wholesaler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparison.map((row) => (
                  <tr key={row.factor}>
                    <td className="px-6 py-4 font-medium text-vurmz-dark">{row.factor}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-vurmz-sage">
                        <CheckCircleIcon className="h-5 w-5" />
                        {row.vurmz}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Volume Discounts Available
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ordering 100+ pens? Setting up recurring orders? Let me know and I will work with you on pricing.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-vurmz-teal text-white px-8 py-4 font-semibold hover:bg-vurmz-teal-dark transition-colors"
          >
            Request Volume Pricing
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get an Exact Quote
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell me what you need and I will send you exact pricing the same day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-white text-vurmz-dark px-8 py-4 font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Request a Quote
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href="sms:+17192573834"
              className="border-2 border-white text-white px-8 py-4 font-semibold text-lg hover:bg-white hover:text-vurmz-teal transition-colors inline-flex items-center justify-center"
            >
              Text (719) 257-3834
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
