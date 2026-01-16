import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Branding & Custom Knife Engraving | VURMZ',
  description: 'Laser engraving for Denver restaurants from a working chef. Branded steak knives, chef knives for staff gifts, logo pens, metal business cards. Put your brand in their hand.',
  keywords: [
    'restaurant branding Denver',
    'custom steak knives',
    'branded chef knives',
    'restaurant logo engraving',
    'custom knife engraving Colorado',
    'restaurant equipment tags',
    'branded pens restaurants',
    'metal business cards Denver',
    'steakhouse knife sets',
    'kitchen equipment marking',
    'restaurant promotional products',
    'chef knife personalization',
    'Centennial laser engraving',
    'Denver restaurant supplies',
  ],
  openGraph: {
    title: 'Restaurant Branding | VURMZ Laser Engraving',
    description: '15 years cooking in Colorado, currently a chef in Cherry Creek. Laser engraving for restaurants—steak knives, equipment tags, branded items. Denver metro.',
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vurmz.com/restaurants',
    siteName: 'VURMZ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Branding | VURMZ',
    description: 'Chef-owned laser engraving for Denver restaurants. Steak knives, chef knives, pens, cards, tags.',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/restaurants',
  },
}

// JSON-LD structured data for local business + service
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.vurmz.com/#business',
      name: 'VURMZ',
      description: 'Laser engraving for restaurants from a working chef. Custom knife engraving, equipment tags, branded promotional products.',
      url: 'https://www.vurmz.com',
      telephone: '+1-719-257-3834',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Centennial',
        addressRegion: 'CO',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.5807,
        longitude: -104.8772,
      },
      areaServed: [
        { '@type': 'City', name: 'Denver' },
        { '@type': 'City', name: 'Centennial' },
        { '@type': 'City', name: 'Greenwood Village' },
        { '@type': 'City', name: 'Cherry Hills Village' },
        { '@type': 'City', name: 'Highlands Ranch' },
        { '@type': 'City', name: 'Lone Tree' },
        { '@type': 'City', name: 'Parker' },
        { '@type': 'City', name: 'Littleton' },
      ],
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://www.vurmz.com/restaurants#service',
      name: 'Restaurant Branding & Custom Knife Engraving',
      provider: { '@id': 'https://www.vurmz.com/#business' },
      serviceType: 'Laser Engraving',
      description: 'Custom laser engraving for restaurants including branded steak knives, chef knives, equipment tags, pens, and metal business cards.',
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 39.5807,
          longitude: -104.8772,
        },
        geoRadius: '50 mi',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Restaurant Branding Products',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Branded Steak Knife Set',
              description: '6-piece steak knife set with custom logo engraving',
            },
            price: '85.00',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Personalized Chef Knife',
              description: 'Chef knife with custom engraving on blade or handle',
            },
            price: '50.00',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Restaurant Starter Kit',
              description: '25 pens, 25 metal business cards, 6-piece steak knife set',
            },
            price: '199.00',
            priceCurrency: 'USD',
          },
        ],
      },
    },
  ],
}

const PRODUCTS = [
  {
    name: 'Steak Knife Sets',
    description: 'Guest keepsakes or retail sales. Your logo on every blade.',
    price: 'From $60',
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <polygon points="8,28 32,20 32,32" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
        <rect x="32" y="22" width="12" height="8" rx="1" fill="#5c4033" stroke="#3d2817" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: 'Chef Knives',
    description: 'Staff loyalty gifts. Personalized for your kitchen team.',
    price: 'From $50',
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <polygon points="4,32 36,18 36,34" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
        <rect x="36" y="22" width="10" height="8" rx="1" fill="#5c4033" stroke="#3d2817" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: 'Branded Pens',
    description: 'For check signing. They take it home, they remember you.',
    price: 'From $3',
    icon: (
      <svg viewBox="0 0 48 24" className="w-12 h-6">
        <polygon points="0,12 8,8 8,16" fill="#c0c0c0" />
        <rect x="8" y="9" width="1.5" height="6" fill="#e0e0e0" />
        <rect x="10" y="8" width="28" height="8" rx="1" fill="#1a1a1a" />
        <ellipse cx="42" cy="12" rx="3" ry="3" fill="#333" />
      </svg>
    ),
  },
  {
    name: 'Metal Business Cards',
    description: 'Make an impression. Managers, owners, catering contacts.',
    price: 'From $3',
    icon: (
      <svg viewBox="0 0 40 28" className="w-10 h-7">
        <rect x="2" y="2" width="36" height="24" rx="2" fill="#1a1a1a" />
        <rect x="6" y="8" width="16" height="2" fill="#666" rx="1" />
        <rect x="6" y="12" width="12" height="1.5" fill="#555" rx="0.5" />
      </svg>
    ),
  },
  {
    name: 'Equipment Tags',
    description: 'Mark every pan, container, and tool. Reduce loss, show pride.',
    price: 'From $5',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <path d="M4 8 L20 8 L28 16 L20 24 L4 24 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <circle cx="10" cy="16" r="3" fill="#444" stroke="#333" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: 'Kitchen Knife Sets',
    description: 'Full chef set with your brand. Opening gift or annual bonus.',
    price: 'From $120',
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <polygon points="2,28 28,16 28,30" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" />
        <rect x="28" y="20" width="8" height="6" rx="1" fill="#5c4033" />
        <polygon points="14,36 30,30 30,38" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" />
        <rect x="30" y="32" width="6" height="4" rx="1" fill="#5c4033" />
      </svg>
    ),
  },
]

const USE_CASES = [
  {
    title: 'Guest Takeaways',
    description: 'Steak knives they take home. Every dinner party, they show your brand.',
  },
  {
    title: 'Staff Retention',
    description: 'Personalized chef knives for your kitchen team. They stay longer when they feel valued.',
  },
  {
    title: 'Check Presentation',
    description: 'Branded pens leave with every guest. Low cost, high impression.',
  },
  {
    title: 'Equipment Tracking',
    description: 'Engraved tags on pans, containers, tools. Know what\'s yours, reduce theft.',
  },
  {
    title: 'Catering & Events',
    description: 'Metal business cards for your catering manager. Close bigger deals.',
  },
  {
    title: 'Retail Sales',
    description: 'Sell branded knife sets to loyal customers. New revenue stream.',
  },
]

export default function RestaurantsPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-vurmz-teal font-medium mb-4 tracking-wider uppercase">Restaurant Branding</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Put Your Brand<br />In Their Hand
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            From kitchen to table. Custom laser engraving on knives, pens, cards, and more.
            Every touchpoint is a branding opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order?type=restaurant"
              className="bg-vurmz-teal text-white px-8 py-4 font-bold text-lg hover:bg-vurmz-teal-dark transition-colors"
            >
              Start Your Order
            </Link>
            <a
              href="sms:+17192573834"
              className="border-2 border-white text-white px-8 py-4 font-bold text-lg hover:bg-white hover:text-vurmz-dark transition-colors"
            >
              Text Me: (719) 257-3834
            </a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything Your Restaurant Needs</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            All custom engraved with your logo, name, or design. Local Denver pickup or delivery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.name}
                className="border border-gray-200 p-6 hover:border-vurmz-teal hover:shadow-lg transition-all group"
              >
                <div className="mb-4 text-gray-400 group-hover:text-vurmz-teal transition-colors">
                  {product.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <p className="text-vurmz-teal font-bold">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How Restaurants Use This</h2>
          <p className="text-gray-600 text-center mb-12">Real ways to put your brand to work</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className="bg-white p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <p className="text-vurmz-teal font-medium mb-2 tracking-wider uppercase">Background</p>
              <h2 className="text-3xl font-bold mb-4">15 Years Cooking in Colorado</h2>
              <p className="text-gray-600 mb-4">
                I&apos;m currently working as a chef in Cherry Creek. I know what restaurant equipment
                goes through—commercial dishwashers, high heat, grease, constant handling.
              </p>
              <p className="text-gray-600 mb-4">
                When you need something for an event or opening, waiting two weeks isn&apos;t an option.
                Next-day delivery is often possible.
              </p>
              <p className="text-gray-600">
                Text me directly.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-64">
              <div className="bg-gray-100 p-6 text-center">
                <p className="font-bold text-vurmz-dark text-lg">Zach DeMillo</p>
                <p className="text-sm text-gray-600">VURMZ</p>
                <p className="text-sm text-gray-500 mt-2">Centennial, CO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Package */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-vurmz-dark text-white p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-vurmz-teal font-medium mb-2 tracking-wider uppercase">Bundle & Save</p>
              <h2 className="text-3xl font-bold mb-4">Restaurant Starter Kit</h2>
              <p className="text-gray-300 max-w-xl mx-auto">
                Everything you need to start branding your restaurant experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 border border-gray-700 rounded">
                <p className="text-2xl font-bold text-vurmz-teal">25</p>
                <p className="text-gray-300">Branded Pens</p>
              </div>
              <div className="text-center p-4 border border-gray-700 rounded">
                <p className="text-2xl font-bold text-vurmz-teal">25</p>
                <p className="text-gray-300">Metal Business Cards</p>
              </div>
              <div className="text-center p-4 border border-gray-700 rounded">
                <p className="text-2xl font-bold text-vurmz-teal">6pc</p>
                <p className="text-gray-300">Steak Knife Set</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-2">
                <span className="line-through">$260 if purchased separately</span>
              </p>
              <p className="text-4xl font-bold text-vurmz-teal mb-6">$199</p>
              <Link
                href="/order?package=restaurant-starter"
                className="inline-block bg-vurmz-teal text-white px-8 py-4 font-bold text-lg hover:bg-vurmz-teal-dark transition-colors"
              >
                Get the Starter Kit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Local Focus */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Denver Metro Restaurant Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Based in Centennial, serving restaurants across south suburban Denver.
            Fast turnaround, local delivery, and I actually answer my phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white px-6 py-4 border border-gray-200">
              <p className="font-bold text-vurmz-dark">Quick Response</p>
              <p className="text-sm text-gray-600">Usually within hours</p>
            </div>
            <div className="bg-white px-6 py-4 border border-gray-200">
              <p className="font-bold text-vurmz-dark">Free Local Delivery</p>
              <p className="text-sm text-gray-600">Orders over $100</p>
            </div>
            <div className="bg-white px-6 py-4 border border-gray-200">
              <p className="font-bold text-vurmz-dark">Rush Available</p>
              <p className="text-sm text-gray-600">Need it tomorrow? Ask.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Brand Your Restaurant?</h2>
          <p className="text-gray-600 mb-8">
            Start with a quick text or jump straight to the order form.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-vurmz-teal text-white px-8 py-4 font-bold text-lg hover:bg-vurmz-teal-dark transition-colors"
            >
              Start Your Order
            </Link>
            <a
              href="sms:+17192573834"
              className="border-2 border-vurmz-dark text-vurmz-dark px-8 py-4 font-bold text-lg hover:bg-vurmz-dark hover:text-white transition-colors"
            >
              Text: (719) 257-3834
            </a>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
