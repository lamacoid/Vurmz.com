import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon, WrenchScrewdriverIcon, CreditCardIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Laser engraving work for local businesses in South Denver metro. Branded pens, metal cards, tool marking, knife engraving.',
}

const projectTypes = [
  {
    title: 'Branded Pens',
    description: 'Metal stylus pens with your logo. Perfect for trade shows, client gifts, and staff.',
    icon: SparklesIcon,
  },
  {
    title: 'Metal Business Cards',
    description: 'Anodized aluminum or stainless steel. Stand out from the stack.',
    icon: CreditCardIcon,
  },
  {
    title: 'Tool & Knife Marking',
    description: 'Permanent marking for chefs, tradesmen, and anyone who values their tools.',
    icon: WrenchScrewdriverIcon,
  },
]

const materials = [
  'Stainless Steel',
  'Aluminum',
  'Brass',
  'Wood',
  'Bamboo',
  'Acrylic',
  'Leather',
  'Glass',
  'Anodized Metal',
  'Coated Metals',
  'Plastic',
  'Stone',
]

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Portfolio
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Photos coming soon. In the meantime, text me for examples of specific products.
            </p>
          </div>
        </div>
      </section>

      {/* What I Make */}
      <section className="py-10 sm:py-12 md:py-16 bg-vurmz-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center">What I Make</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectTypes.map((type) => (
              <div key={type.title} className="bg-[#1f2523] p-6 rounded-lg border border-gray-700 text-center">
                <type.icon className="h-10 w-10 text-vurmz-teal mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">{type.title}</h3>
                <p className="text-gray-400 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="bg-[#1f2523] py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
            Materials I Can Engrave
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {materials.map((material) => (
              <div
                key={material}
                className="bg-vurmz-dark border border-gray-700 p-3 sm:p-4 text-center text-gray-300 text-sm rounded-lg"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
            Text me what you need. Same-day response with pricing and turnaround.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href={getSmsLink()}
              className="bg-vurmz-dark text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-vurmz-dark/80 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Text {siteInfo.phone}
            </a>
            <Link
              href="/order"
              className="border-2 border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Build Your Order
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
