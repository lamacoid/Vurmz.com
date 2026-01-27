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
  title: 'Pricing',
  description: 'Transparent laser engraving pricing for Centennial and Denver metro businesses. Premium service at fair prices. No hidden fees, no surprises.',
}

// Hardcoded pricing
const pricingCategories = [
  {
    category: 'Branded Pens',
    items: [
      { name: 'Metal Stylus Pen', price: '$7.50/pen', note: 'Fully loaded: logo, 2 lines text, both sides' },
      { name: 'Pack of 15', price: '$112.50', note: 'Most popular for small businesses' },
      { name: 'Pack of 30', price: '$210', note: '$7/pen - volume discount' },
    ],
  },
  {
    category: 'Metal Business Cards',
    items: [
      { name: 'Matte Black Aluminum', price: '$6/card', note: 'Logo + text, single side' },
      { name: 'Matte Black (both sides)', price: '$9/card', note: 'Logo + text + QR code' },
      { name: 'Stainless Steel', price: '$18/card', note: 'Premium finish, both sides' },
    ],
  },
  {
    category: 'Tool & Knife Marking',
    items: [
      { name: 'Chef Knife', price: '$15-25', note: 'Name, logo, or custom text' },
      { name: 'Power Tool', price: '$10-20', note: 'Company name + phone for theft prevention' },
      { name: 'Hand Tool Set', price: '$5/tool', note: 'Minimum 5 tools' },
    ],
  },
  {
    category: 'Custom Projects',
    items: [
      { name: 'Coasters (bamboo)', price: '$4/each', note: 'Pack of 15 = $60' },
      { name: 'Keychains', price: '$5/each', note: 'Metal or wood options' },
      { name: 'Awards & Plaques', price: 'Quote', note: 'Depends on size and material' },
      { name: 'Industrial Labels', price: 'Quote', note: 'ABS, aluminum, stainless' },
    ],
  },
]

const comparison = [
  {
    factor: 'Turnaround',
    vurmz: 'Same-day or next-day',
    online: '1-3 weeks',
  },
  {
    factor: 'Order Size',
    vurmz: 'Packs of 15 for promo items',
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
    vurmz: 'Fixed same day, personally',
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
      <section className="bg-vurmz-dark text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              What Things Cost
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              I charge more per item than online wholesalers. Here is why that ends up costing you less.
            </p>
          </div>
        </div>
      </section>

      {/* Why Premium Pricing */}
      <section className="bg-[#1f2523] py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              What You Get for the Premium
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-vurmz-dark p-4 sm:p-6 border border-gray-700 border-t-4 border-t-vurmz-teal text-center rounded-lg">
              <ClockIcon className="h-8 w-8 sm:h-10 sm:w-10 text-vurmz-teal mx-auto mb-2 sm:mb-4" />
              <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Hours, Not Weeks</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Same-day turnaround available</p>
            </div>
            <div className="bg-vurmz-dark p-4 sm:p-6 border border-gray-700 border-t-4 border-t-vurmz-teal text-center rounded-lg">
              <CubeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-vurmz-teal mx-auto mb-2 sm:mb-4" />
              <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Buy What You Use</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Packs of 15. No 100+ forced bulk.</p>
            </div>
            <div className="bg-vurmz-dark p-4 sm:p-6 border border-gray-700 border-t-4 border-t-vurmz-teal text-center rounded-lg">
              <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-vurmz-teal mx-auto mb-2 sm:mb-4" />
              <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Text Me Directly</h3>
              <p className="text-gray-400 text-xs sm:text-sm">One person. One number.</p>
            </div>
            <div className="bg-vurmz-dark p-4 sm:p-6 border border-gray-700 border-t-4 border-t-vurmz-teal text-center rounded-lg">
              <TruckIcon className="h-8 w-8 sm:h-10 sm:w-10 text-vurmz-teal mx-auto mb-2 sm:mb-4" />
              <h3 className="font-semibold text-white mb-1 sm:mb-2 text-sm sm:text-base">Pickup or Delivery</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Free delivery over $100</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Cost Comparison */}
      <section className="py-10 sm:py-12 md:py-16 bg-vurmz-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            Do the Math
          </h2>

          <div className="bg-[#1f2523] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 rounded-lg border border-gray-700">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6">You need some pens with your logo. Here are your options:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="border border-gray-600 p-4 sm:p-6 bg-vurmz-dark rounded-lg">
                <h4 className="font-semibold text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Online Wholesaler</h4>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
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
                    <span>Pens you do not need</span>
                    <span>85+</span>
                  </li>
                </ul>
                <div className="border-t border-gray-600 mt-4 pt-4">
                  <p className="flex justify-between font-semibold text-gray-300">
                    <span>Total</span>
                    <span>$243 + hassle</span>
                  </p>
                </div>
              </div>

              <div className="border-2 border-vurmz-teal p-4 sm:p-6 bg-vurmz-dark rounded-lg">
                <h4 className="font-semibold text-vurmz-teal mb-3 sm:mb-4 text-sm sm:text-base">VURMZ</h4>
                <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                  <li className="flex justify-between">
                    <span>15 fully loaded pens (logo, 2 lines, both sides)</span>
                    <span>$112.50</span>
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
                    <span>Same day</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Extra pens</span>
                    <span>0</span>
                  </li>
                </ul>
                <div className="border-t border-vurmz-teal mt-4 pt-4">
                  <p className="flex justify-between font-semibold text-vurmz-teal">
                    <span>Total</span>
                    <span>$112.50</span>
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-4 sm:mt-6 text-sm sm:text-base">
              <span className="font-semibold text-white">Result:</span> 15 fully loaded pens, same day, $112.50. When you run out, order 15 more.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="bg-[#1f2523] py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 sm:mb-12 text-center">
            Product Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {pricingCategories.map((category) => (
              <div key={category.category} className="bg-vurmz-dark border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-vurmz-teal text-white px-4 sm:px-6 py-3 sm:py-4">
                  <h3 className="text-base sm:text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-700">
                      {category.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-2 sm:py-3">
                            <p className="font-medium text-white text-sm sm:text-base">{item.name}</p>
                            <p className="text-xs sm:text-sm text-gray-400">{item.note}</p>
                          </td>
                          <td className="py-2 sm:py-3 text-right">
                            <p className="font-semibold text-vurmz-teal text-sm sm:text-base">{item.price}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-6 sm:mt-8 text-sm sm:text-base">
            Prices are estimates. Final pricing depends on quantity, complexity, and materials.
            <Link href="/order" className="text-vurmz-teal font-medium ml-1 hover:underline">
              Start your order for exact pricing
            </Link>
          </p>

          <div className="mt-8 sm:mt-10 bg-vurmz-dark border border-vurmz-teal/30 rounded-xl p-6 sm:p-8 text-center">
            <p className="text-lg sm:text-xl text-white font-medium mb-2">
              Special project?
            </p>
            <p className="text-gray-400 mb-4">
              If you can describe it, I can probably engrave it. Let&apos;s figure it out together.
            </p>
            <a
              href="sms:+17192573834"
              className="inline-flex items-center gap-2 text-vurmz-teal font-semibold hover:underline"
            >
              Text (719) 257-3834
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="py-10 sm:py-12 md:py-16 bg-vurmz-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            VURMZ vs Online Wholesalers
          </h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-vurmz-teal text-white">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Factor</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">VURMZ</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Online Wholesaler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-[#1f2523]">
                {comparison.map((row) => (
                  <tr key={row.factor}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-white text-xs sm:text-sm md:text-base">{row.factor}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="flex items-center gap-1 sm:gap-2 text-vurmz-teal text-xs sm:text-sm md:text-base">
                        <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        {row.vurmz}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs sm:text-sm md:text-base">{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="bg-vurmz-dark text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Volume Discounts Available
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            Ordering 100+ pens? Setting up recurring orders? Let me know and I will work with you on pricing.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-vurmz-teal text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold hover:bg-vurmz-teal-dark transition-colors rounded-lg sm:rounded-none"
          >
            Request Volume Pricing
            <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Order?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
            Build your order online or text me directly. Same-day response.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/order"
              className="bg-vurmz-dark text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-vurmz-dark/80 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Start Your Order
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <a
              href="sms:+17192573834"
              className="border-2 border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center rounded-xl"
            >
              Text (719) 257-3834
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
