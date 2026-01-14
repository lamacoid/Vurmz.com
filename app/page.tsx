import Link from 'next/link'
import { Metadata } from 'next'
import {
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UserIcon,
  CubeIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import ServiceAreaMap from '@/components/ServiceAreaMap'

export const metadata: Metadata = {
  title: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
  description: 'Local laser engraving for Denver metro businesses. Fast turnaround, no minimums, local delivery. Pens, knives, business cards, equipment marking, awards. Serving Centennial, Greenwood Village, Cherry Hills, Highlands Ranch.',
  keywords: [
    'laser engraving Centennial',
    'laser engraving Denver',
    'custom engraving Colorado',
    'fast turnaround engraving',
    'no minimum order engraving',
    'branded pens Denver',
    'equipment marking Colorado',
    'metal business cards',
    'corporate gifts Denver',
    'promotional products Centennial',
    'local engraving service',
    'Greenwood Village engraving',
    'Cherry Hills laser',
    'Highlands Ranch engraving',
  ],
  openGraph: {
    title: 'VURMZ | Custom Laser Engraving in Centennial, Colorado',
    description: 'Local laser engraving for Denver metro businesses. Fast turnaround, no minimums. Pens, knives, business cards, equipment marking.',
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vurmz.com',
    siteName: 'VURMZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VURMZ | Laser Engraving Centennial CO',
    description: 'Fast laser engraving for Denver metro businesses. No minimums, local delivery.',
  },
  alternates: {
    canonical: 'https://www.vurmz.com',
  },
}

// JSON-LD structured data: LocalBusiness + FAQ Schema for voice search and featured snippets
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.vurmz.com/#business',
      name: 'VURMZ',
      description: 'Custom laser engraving for Denver metro businesses. Fast turnaround, no minimums, local pickup and delivery.',
      url: 'https://www.vurmz.com',
      telephone: '+1-719-257-3834',
      email: 'hello@vurmz.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Centennial',
        addressRegion: 'CO',
        postalCode: '80112',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.5807,
        longitude: -104.8772,
      },
      areaServed: [
        { '@type': 'City', name: 'Centennial', sameAs: 'https://en.wikipedia.org/wiki/Centennial,_Colorado' },
        { '@type': 'City', name: 'Denver' },
        { '@type': 'City', name: 'Greenwood Village' },
        { '@type': 'City', name: 'Cherry Hills Village' },
        { '@type': 'City', name: 'Highlands Ranch' },
        { '@type': 'City', name: 'Lone Tree' },
        { '@type': 'City', name: 'Parker' },
        { '@type': 'City', name: 'Littleton' },
        { '@type': 'City', name: 'Englewood' },
        { '@type': 'City', name: 'Aurora' },
      ],
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '14:00',
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Laser Engraving Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Branded Pens' }, priceSpecification: { '@type': 'PriceSpecification', price: '3.00', priceCurrency: 'USD', unitText: 'per pen' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Metal Business Cards' }, priceSpecification: { '@type': 'PriceSpecification', price: '5.00', priceCurrency: 'USD', unitText: 'per card' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Equipment Marking' }, priceSpecification: { '@type': 'PriceSpecification', price: '3.00', priceCurrency: 'USD', unitText: 'starting price' } },
        ],
      },
      sameAs: [],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.vurmz.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where can I get pens engraved near me in Denver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VURMZ offers custom pen engraving in Centennial, serving all of Denver metro. Fast turnaround with no minimum order. Local pickup in Centennial or delivery to your business.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I prevent restaurant equipment theft?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Laser engraving your restaurant name and phone number on pans, containers, and equipment makes theft less appealing and stolen items easier to identify. VURMZ specializes in restaurant equipment marking with durable engravings that survive commercial dishwashers.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the minimum order for custom engraving?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VURMZ has no minimum order. Need just 5 pens or 1 knife engraved? No problem. Online wholesalers typically require 50-250 piece minimums. Local service means you order exactly what you need.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast can I get custom engraved items in Denver?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VURMZ offers next-day delivery for most orders. Online competitors typically take 1-3 weeks plus shipping. Rush orders available when you need items for an event or opening.',
          },
        },
        {
          '@type': 'Question',
          name: 'What makes metal business cards stand out?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Metal business cards are kept instead of thrown away. Made from anodized aluminum, they feel premium and memorable. Perfect for real estate agents, restaurant owners, and anyone who wants their card to make an impression.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you engrave my own knives or tools?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, VURMZ can engrave items you provide. Bring your own chef knives, pocket knives, power tools, or equipment. We also supply knives and pens if you need them.',
          },
        },
      ],
    },
  ],
}

const valueProps = [
  {
    title: 'Next-Day Delivery',
    description: 'Get your order in days, not weeks. Online competitors take 1-3 weeks.',
    icon: ClockIcon,
    color: 'teal',
  },
  {
    title: 'No Minimums',
    description: 'Order exactly what you need. Online wholesalers require 50-250 pieces.',
    icon: CubeIcon,
    color: 'powder',
  },
  {
    title: 'Direct Communication',
    description: 'Talk to me directly. No corporate bureaucracy or automated systems.',
    icon: UserIcon,
    color: 'sage',
  },
  {
    title: 'Local Pickup & Delivery',
    description: 'Pick up in Centennial or I deliver within the service area.',
    icon: MapPinIcon,
    color: 'powder',
  },
]

const products = [
  {
    name: 'Branded Pens',
    price: '$3-$7/pen',
    description: 'Metal stylus pens with your logo. Price varies with upgrades.',
  },
  {
    name: 'Tool & Equipment Marking',
    price: '$3-$75/item',
    description: 'Pans, knives, power tools. Permanent marking.',
  },
  {
    name: 'Industrial Labels & Signs',
    price: 'Starting at $8/sign',
    description: 'ABS plastic for panels and equipment.',
  },
  {
    name: 'Metal Business Cards',
    price: 'Starting at $5/card',
    description: 'Anodized aluminum. People keep these.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
      {/* Hero Section */}
      <section className="relative bg-vurmz-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-vurmz-dark via-vurmz-dark to-[#2a3533]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-vurmz-powder mb-4">
              <MapPinIcon className="h-5 w-5" />
              <span className="font-medium">Centennial, Colorado</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              High Quality Laser Engraving in Centennial
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Serving small businesses in South Metro Denver with quality engraving, fast.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Fast turnaround, no minimum orders, and you talk directly to me.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/order"
                className="bg-vurmz-teal text-white px-8 py-4 font-semibold text-lg hover:bg-vurmz-teal-dark transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Your Order
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href="sms:+17192573834"
                className="border-2 border-vurmz-powder text-vurmz-powder px-8 py-4 font-semibold text-lg hover:bg-vurmz-powder hover:text-vurmz-dark transition-colors inline-flex items-center justify-center"
              >
                Text (719) 257-3834
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why VURMZ vs Online Wholesalers */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-vurmz-dark mb-4">
              Why Local Beats Online
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className={`bg-white p-6 border border-gray-200 border-t-4 ${prop.color === 'teal' ? 'border-t-vurmz-teal' : prop.color === 'powder' ? 'border-t-vurmz-powder' : 'border-t-vurmz-sage'}`}>
                <div className={`w-12 h-12 flex items-center justify-center mb-4 ${prop.color === 'teal' ? 'bg-vurmz-teal/10' : prop.color === 'powder' ? 'bg-vurmz-powder/20' : 'bg-vurmz-sage/10'}`}>
                  <prop.icon className={`h-6 w-6 ${prop.color === 'teal' ? 'text-vurmz-teal' : prop.color === 'powder' ? 'text-vurmz-powder' : 'text-vurmz-sage'}`} />
                </div>
                <h3 className="text-lg font-semibold text-vurmz-dark mb-2">{prop.title}</h3>
                <p className="text-gray-600 text-sm">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products with Pricing */}
      <section className="bg-vurmz-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Products
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transparent pricing. Premium quality. Get exactly what you need, when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.name} className="border border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-vurmz-teal text-xl font-bold mb-3">{product.price}</p>
                <p className="text-gray-400 text-sm">{product.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-vurmz-powder font-semibold hover:text-white transition-colors"
            >
              View Full Pricing
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Local Service Area */}
      <section className="bg-vurmz-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <ServiceAreaMap />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-6">
                Based in Centennial
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                South suburban Denver. Easy pickup or delivery available.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-vurmz-teal" />
                  <span className="text-gray-700">Pickup available in Centennial</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-vurmz-powder" />
                  <span className="text-gray-700">Delivery to Denver Metro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-vurmz-sage" />
                  <span className="text-gray-700">Same-day response</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-vurmz-teal font-semibold hover:text-vurmz-teal-dark transition-colors"
              >
                Get Directions
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-vurmz-sage/10 text-vurmz-sage px-4 py-2 text-sm font-medium mb-6">
            Honest About Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-6">
            Premium Service at Fair Prices
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Prices run 20-35% above online wholesalers. Here's why that makes sense:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-vurmz-light p-6">
              <ScaleIcon className="h-8 w-8 text-vurmz-teal mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Total Cost Comparison</h3>
              <p className="text-gray-600 text-sm">
                Online: $2/pen + $50 shipping + 2 weeks wait + 100 minimum = $250 and hassle
              </p>
              <p className="text-vurmz-teal text-sm mt-2 font-medium">
                VURMZ: $3.50/pen + next day + 25 units = what you actually need
              </p>
            </div>
            <div className="bg-vurmz-light p-6">
              <ClockIcon className="h-8 w-8 text-vurmz-powder mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Time Is Money</h3>
              <p className="text-gray-600 text-sm">
                Your time spent managing online orders, tracking shipments, and dealing with errors
                has a cost. I eliminate that hassle.
              </p>
            </div>
            <div className="bg-vurmz-light p-6">
              <UserIcon className="h-8 w-8 text-vurmz-sage mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Real Accountability</h3>
              <p className="text-gray-600 text-sm">
                Something wrong? Text me directly. No support tickets, no chatbots,
                no waiting.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-vurmz-teal text-white px-8 py-4 font-semibold hover:bg-vurmz-teal-dark transition-colors"
          >
            See Full Pricing
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-vurmz-teal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Build your order online or text me directly. Same-day response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-white text-vurmz-dark px-8 py-4 font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Your Order
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
    </>
  )
}
