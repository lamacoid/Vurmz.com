export const runtime = 'edge'

import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getD1 } from '@/lib/d1'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'View laser engraving work for local businesses in Centennial and Denver metro.',
}

interface PortfolioItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  industry: string | null
  location: string | null
  featured: number
}

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const db = getD1()
    const result = await db.prepare(`
      SELECT * FROM portfolio_items
      ORDER BY featured DESC, created_at DESC
    `).all()

    return (result.results || []) as unknown as PortfolioItem[]
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return []
  }
}

const projectTypes = [
  {
    title: 'Industrial Labels & Tags',
    description: 'ABS panel labels, asset tags, equipment identification for contractors and manufacturers',
  },
  {
    title: 'Metal Business Cards',
    description: 'Anodized aluminum cards that make a lasting impression',
  },
  {
    title: 'Branded Pens',
    description: 'Metal stylus pens with your logo for trade shows, clients, and staff',
  },
  {
    title: 'Chef Knives & Kitchen Tools',
    description: 'Personal chef knives, bamboo boards, restaurant pan marking',
  },
  {
    title: 'Awards & Recognition',
    description: 'Acrylic awards, plaques, and custom trophies for employee recognition',
  },
  {
    title: 'Trade Tool Marking',
    description: 'Prevent theft with permanent marking on power tools and equipment',
  },
]

export default async function PortfolioPage() {
  const items = await getPortfolioItems()

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
              Examples of my laser engraving work for local businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {item.featured === 1 && (
                      <div className="absolute top-2 right-2 bg-vurmz-teal text-white text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-vurmz-teal font-medium uppercase tracking-wide">{item.category}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 mb-12 sm:mb-16">
              <p className="text-gray-500 mb-4">Portfolio coming soon. Check back for examples of my work.</p>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 text-vurmz-teal font-medium hover:underline"
              >
                Start your project now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">What I Make</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projectTypes.map((project) => (
              <div key={project.title} className="bg-white border border-gray-200 p-4 sm:p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{project.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I Can Do */}
      <section className="bg-vurmz-light py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-vurmz-dark mb-6 sm:mb-8 text-center">
            What I Can Engrave
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
                className="bg-white border border-gray-200 p-3 sm:p-4 text-center text-gray-700 text-sm sm:text-base"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
            Tell me what you need. I respond the same day with pricing and turnaround time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/order"
              className="bg-white text-vurmz-dark px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-none"
            >
              Start Your Order
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <a
              href="sms:+17192573834"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white hover:text-vurmz-teal transition-colors inline-flex items-center justify-center rounded-lg sm:rounded-none"
            >
              Text (719) 257-3834
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
