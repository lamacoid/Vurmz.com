import { Metadata } from 'next'
import Image from 'next/image'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact VURMZ | Centennial CO Laser Engraving',
  description: `Contact ${siteInfo.founder.name} at ${siteInfo.name} for laser engraving in ${siteInfo.city} and Denver metro. Text ${siteInfo.phone} or email.`,
}

const faqItems = [
  {
    question: 'How fast can you turn around an order?',
    answer: 'Turnaround depends on the job. Rush orders are often possible for local businesses. Standard orders are 3-5 days. I am flexible.',
  },
  {
    question: 'How are orders structured?',
    answer: 'Promotional items like pens and coasters come in packs of 15. Industrial labels and custom work are quoted per job.',
  },
  {
    question: 'Can I bring my own items to engrave?',
    answer: 'Absolutely. I can engrave your existing kitchen pans, tools, or other items. Just let me know what you have and I will tell you if it will work.',
  },
  {
    question: 'What file formats do you need for logos?',
    answer: 'Vector files (SVG, AI, EPS) work best. High-resolution PNG or JPG can work too. If you only have a basic image, I can often work with it.',
  },
  {
    question: 'How do I pay?',
    answer: 'I accept all major payment methods. For business orders, I can invoice through Square. Payment is typically due upon completion.',
  },
  {
    question: 'Do you set up recurring orders?',
    answer: 'Yes. Many businesses order pens quarterly. I can set up automatic reorders so you never run low.',
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

      {/* Hero */}
      <section className="bg-vurmz-dark text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let&apos;s Talk
            </h1>
            <p className="text-xl text-gray-300">
              Send a message, text, or call. You get Zach directly.
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
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-cream">Text or Call</h3>
                    <a href={getSmsLink()} className="text-vurmz-teal text-xl font-semibold hover:underline">
                      {siteInfo.phone}
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Fastest way to reach Zach</p>
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
            <a href="http://nordstrom.com/store/cherry-creek" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-sm font-medium text-cream/40 hover:text-cream/60 transition-colors">
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
