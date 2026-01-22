'use client'

import Link from 'next/link'
import { ArrowRightIcon, MapPinIcon, ClockIcon, CubeIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline'
import { useSiteConfig } from '@/components/SiteConfigProvider'

const valueProps = [
  { title: 'Hours, Not Weeks', description: 'Same-day and next-day turnaround.', icon: ClockIcon },
  { title: 'Buy What You Use', description: 'No forced bulk. Reorder when ready.', icon: CubeIcon },
  { title: 'Text Me Directly', description: 'One person. Questions answered in minutes.', icon: UserIcon },
  { title: 'Pickup or Delivery', description: 'Centennial pickup or free delivery over $100.', icon: TruckIcon },
]

export default function HomePage() {
  const config = useSiteConfig()
  const { contact, content } = config

  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-sage text-white py-16 sm:py-24 md:py-32 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 mb-6 sm:mb-8">
              <MapPinIcon className="h-4 w-4 text-white/70" />
              <span className="text-xs sm:text-sm font-medium text-white/80">{contact.city}, {contact.state}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight text-vurmz-dark leading-tight">
              {content.heroTitle}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-vurmz-dark/70 max-w-2xl leading-relaxed mb-8 sm:mb-10 md:mb-12">
              {content.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-vurmz-dark text-white px-6 py-4 sm:px-8 sm:py-5 md:px-10 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-vurmz-dark/90 transition-all"
              >
                {content.ctaText}
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-5 md:px-10 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg border-2 border-vurmz-dark text-vurmz-dark hover:bg-vurmz-dark hover:text-white transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-vurmz-light py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-vurmz-dark mb-8 sm:mb-12 text-center">
            Why Local Beats Online
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                <prop.icon className="h-6 w-6 sm:h-8 sm:w-8 text-vurmz-teal mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-vurmz-dark mb-1 sm:mb-2">{prop.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Order?</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {content.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/order"
              className="bg-white text-vurmz-dark px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-none"
            >
              {content.ctaText}
              <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <a
              href={`sms:${contact.phone.replace(/[^0-9]/g, '')}`}
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg hover:bg-white hover:text-vurmz-teal transition-colors inline-flex items-center justify-center rounded-lg sm:rounded-none"
            >
              Text {contact.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
