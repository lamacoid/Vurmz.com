import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import PortfolioGallery from '@/components/PortfolioGallery'

export const metadata: Metadata = {
  title: 'Portfolio | Laser Engraving Examples Denver Metro',
  description: 'Laser engraving projects for Denver businesses. Chef knives, restaurant equipment, branded pens, metal business cards, awards, and custom work.',
  keywords: [
    'laser engraving examples',
    'Denver engraving portfolio',
    'custom knife engraving photos',
    'restaurant equipment marking',
    'branded pen examples',
    'metal business card samples',
    'Centennial laser work',
    'corporate gifts Denver',
  ],
  openGraph: {
    title: 'Portfolio | VURMZ Laser Engraving',
    description: 'Laser engraving projects for Denver metro businesses. Knives, pens, cards, equipment marking.',
    type: 'website',
    url: 'https://www.vurmz.com/portfolio',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/portfolio',
  },
}

// Portfolio items - real completed work only
const portfolioItems = [
  {
    id: 'retail-1',
    title: 'Nordstrom Beauty Perfume Atomizers',
    description: 'Branded perfume atomizer cases for Nordstrom Beauty department',
    category: 'Retail',
    industry: 'Retail',
    location: 'Cherry Creek',
  },
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'Retail', label: 'Retail' },
  { id: 'Culinary', label: 'Culinary' },
  { id: 'Business Items', label: 'Business' },
  { id: 'Custom Projects', label: 'Custom' },
]

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              My Work
            </h1>
            <p className="text-xl text-gray-300">
              Types of projects I handle for local businesses. Photos coming as I document more work.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGallery items={portfolioItems} categories={categories} />
        </div>
      </section>

      {/* What I Can Do */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-vurmz-dark mb-8 text-center">
            What I Can Engrave
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
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
            ].map((material) => (
              <div
                key={material}
                className="bg-white border border-gray-200 p-4 text-center text-gray-700"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell me what you need. I respond the same day with pricing and turnaround time.
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
