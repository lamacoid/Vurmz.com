import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'About | VURMZ Laser Engraving',
  description: 'VURMZ laser engraving based in Centennial, Colorado. Local business serving Denver metro.',
  keywords: [
    'VURMZ',
    'Centennial laser engraving',
    'Denver engraver',
    'local business Centennial',
    'custom engraving Denver metro',
  ],
  openGraph: {
    title: 'About | VURMZ',
    description: 'Laser engraving based in Centennial, Colorado.',
    type: 'website',
    url: 'https://www.vurmz.com/about',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/about',
  },
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-vurmz-sky mb-4">
              <MapPinIcon className="h-5 w-5" />
              <span>Centennial, Colorado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Vurmz
            </h1>
            <p className="text-xl text-gray-300">
              Local. Been here forever.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-gray-600 text-lg">
            <p className="text-vurmz-dark text-xl">
              Zach. Dad. Husband. <span className="line-through text-gray-400">Chef</span>{' '}
              <span className="text-vurmz-teal font-medium">Engraver.</span>
            </p>
            <p>
              Grew up here before it was even called Centennial. Raised my family here.
              This is home.
            </p>
            <p>
              I want to literally leave my mark on the community I've been part of my entire life.
            </p>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-vurmz-dark mb-6">
            Serving Denver Metro
          </h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {['Centennial', 'Greenwood Village', 'Cherry Hills', 'Highlands Ranch', 'Lone Tree', 'Englewood', 'Littleton', 'Denver', 'Aurora', 'Parker'].map((area) => (
              <span key={area} className="bg-white text-gray-700 px-3 py-1 text-sm border border-gray-200">
                {area}
              </span>
            ))}
          </div>
          <p className="text-gray-600">
            Free delivery on orders over $100. Pickup always available.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Started
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Text me or submit a quote request.
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
