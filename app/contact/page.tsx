import { Metadata } from 'next'
import Link from 'next/link'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import ServiceAreaMap from '@/components/ServiceAreaMap'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Zach at VURMZ for laser engraving in Centennial and Denver metro. Text (719) 257-3834 or email. Same-day response.',
}

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact
            </h1>
            <p className="text-xl text-gray-300">
              Text or email. I respond the same day.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-bold text-vurmz-dark mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-sage p-3">
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-vurmz-dark">Text</h3>
                    <a href="sms:+17192573834" className="text-vurmz-teal text-xl font-semibold hover:underline">
                      (719) 257-3834
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-powder p-3">
                    <EnvelopeIcon className="h-6 w-6 text-vurmz-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-vurmz-dark">Email</h3>
                    <a href="mailto:zach@vurmz.com" className="text-gray-600 hover:text-vurmz-teal">
                      zach@vurmz.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3">
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-vurmz-dark">Location</h3>
                    <p className="text-gray-600">
                      South suburban Denver<br />
                      Centennial, Colorado
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Pickup available by appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-vurmz-teal p-3">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-vurmz-dark">Availability</h3>
                    <div className="text-gray-600">
                      <p>Flexible hours (I work around my chef schedule)</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Text anytime. I will get back to you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-vurmz-light border border-gray-200">
                <h3 className="font-semibold text-lg text-vurmz-dark mb-3">Ready to Order?</h3>
                <p className="text-gray-600 mb-4">
                  Build your order online with instant pricing, or get a custom quote. I respond the same day.
                </p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 bg-vurmz-teal text-white px-6 py-3 font-semibold hover:bg-vurmz-teal-dark transition-colors"
                >
                  Start Your Order
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Service Area */}
            <div>
              <h2 className="text-2xl font-bold text-vurmz-dark mb-8">Service Area</h2>
              <ServiceAreaMap />

              <div className="mt-6">
                <h3 className="font-semibold text-vurmz-dark mb-3">Serving</h3>
                <div className="flex flex-wrap gap-2">
                  {['Centennial', 'Greenwood Village', 'Cherry Hills', 'Highlands Ranch', 'Lone Tree', 'Englewood', 'Littleton', 'Denver', 'Aurora', 'Parker', 'DTC'].map((area) => (
                    <span key={area} className="bg-gray-100 text-gray-700 px-3 py-1 text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-vurmz-teal/10 border border-vurmz-teal/30">
                <p className="text-sm text-vurmz-dark">
                  <strong>Free delivery</strong> on orders $100+ in south suburban Denver.
                  Delivery available to all Denver metro locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-vurmz-dark mb-8 text-center">Common Questions</h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">How fast can you turn around an order?</h3>
              <p className="text-gray-600">
                Same-day and next-day are often possible for local businesses. Standard orders are 3-5 days.
                Rush orders may have an additional fee, but I am flexible.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">How are orders structured?</h3>
              <p className="text-gray-600">
                Promotional items like pens and coasters come in packs of 15. Industrial labels and custom work are quoted per job.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">Can I bring my own items to engrave?</h3>
              <p className="text-gray-600">
                Absolutely. I can engrave your existing kitchen pans, tools, or other items. Just let me
                know what you have and I will tell you if it will work.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">What file formats do you need for logos?</h3>
              <p className="text-gray-600">
                Vector files (SVG, AI, EPS) work best. High-resolution PNG or JPG can work too.
                If you only have a basic image, I can often work with it.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">How do I pay?</h3>
              <p className="text-gray-600">
                I accept all major payment methods. For business orders, I can invoice through Square.
                Payment is typically due upon completion.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="font-semibold text-vurmz-dark mb-2">Do you set up recurring orders?</h3>
              <p className="text-gray-600">
                Yes. Many businesses order pens quarterly. I can set up automatic
                reorders so you never run low.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Build your order online or text me directly.
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
  )
}
