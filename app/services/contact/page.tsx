import { Metadata } from 'next'
import Image from 'next/image'
import { MapPinIcon, ChatBubbleLeftIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import ContactForm from '@/components/ContactForm'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: { absolute: 'Contact | VURMZ Laser Engraving — Centennial, CO' },
  description: `Contact ${siteInfo.founder.name} at ${siteInfo.name} for laser engraving in ${siteInfo.city} and Denver metro. Text ${siteInfo.phone} or email.`,
  alternates: { canonical: '/services/contact' },
}

const faqItems = [
  {
    question: 'How fast can you turn around an order?',
    answer: 'Next-day on most jobs. Same-day is usually possible on stock items. Bigger runs and custom sourcing take longer. Tell me the deadline and I will tell you if it is doable.',
  },
  {
    question: 'How are orders structured?',
    answer: 'Stock items like pens, coasters, and keychains come in packs of 15. Custom work on your item starts at $50. Industrial labels and trades work are quoted per job.',
  },
  {
    question: 'Can I bring my own items to engrave?',
    answer: 'Yes. Knives, tumblers, laptops, cutting boards, leather, glass, whatever you have. Text me a photo and I will tell you if it will mark.',
  },
  {
    question: 'What file formats do you need for logos?',
    answer: 'Vector files (SVG, AI, EPS) are ideal. High-resolution PNG or JPG works too. If all you have is a rough image, send it. I can usually clean it up.',
  },
  {
    question: 'How do I pay?',
    answer: 'Cash, card, or Square invoice for business orders. Payment is due at delivery.',
  },
  {
    question: 'Do you set up recurring orders?',
    answer: 'Yes. If you hand out pens or business cards regularly, I can keep your stock fresh on a schedule that matches your burn rate. You do not have to think about reordering.',
  },
]

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      }
    }))
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-vurmz-dark pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Contact' }]} theme="services" />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-vurmz-dark text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let&apos;s Talk
            </h1>
            <p className="text-xl text-gray-300">
              Send a message or a text. You get Zach directly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-10 bg-[#1f2523]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-cream mb-6">Send a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-cream mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3 rounded-lg">
                    <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-cream">Text Me</h3>
                    <a href={getSmsLink()} className="text-vurmz-teal text-xl font-semibold hover:underline">
                      {siteInfo.phone}
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Fastest way to reach Zach — text only</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-cream">Email</h3>
                    <a href={`mailto:${siteInfo.email}`} className="text-gray-400 hover:text-vurmz-teal transition-colors">
                      {siteInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-cream">Location</h3>
                    <p className="text-gray-400">
                      South suburban Denver<br />
                      {siteInfo.city}, {siteInfo.state}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Pickup available by appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-cream">Availability</h3>
                    <p className="text-gray-400">Flexible hours</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Text anytime. I will get back to you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Area */}
              <div className="mt-10">
                <h3 className="font-semibold text-cream mb-3">Service Area</h3>
                <div className="flex flex-wrap gap-2">
                  {siteInfo.serviceAreas.map((area) => (
                    <span key={area} className="bg-vurmz-dark border border-gray-700 text-gray-300 px-3 py-1 text-sm rounded">
                      {area}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-vurmz-teal/10 border border-vurmz-teal/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong className="text-cream">Free delivery</strong> on orders $100+ in south suburban Denver.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-vurmz-dark py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-cream mb-6 text-center">Common Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="bg-[#1f2523] p-6 border border-gray-700 rounded-lg">
                <h3 className="font-semibold text-cream mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 sm:py-10 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-5 text-center">
            Trusted by
          </p>
        </div>
        <div className="relative">
          <div className="flex items-center justify-center gap-12 sm:gap-16">
            <a href="https://www.nordstrom.com/store-details/nordstrom-cherry-creek-shopping-center" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-sm font-medium text-cream/40 hover:text-cream/60 transition-colors">
              Nordstrom Beauty
            </a>
            <a href="http://countylineguitaramps.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <Image
                src="/images/clients/county-line-guitar-amps.svg"
                alt="County Line Guitar Amps"
                width={120}
                height={36}
                className="opacity-40 brightness-0 invert"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
