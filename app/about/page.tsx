import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Zach, owner of VURMZ LLC. Colorado native, Centennial local, chef, and laser engraver serving the Denver metro area.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-vurmz-powder mb-4">
              <MapPinIcon className="h-5 w-5" />
              <span>Centennial, Colorado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-300">
              I am Zach. Colorado native, chef, husband, dad. I run VURMZ out of Centennial.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-vurmz-dark mb-6">My Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Born and raised in Colorado. Been in Centennial since it was still unincorporated Arapahoe County. This is home.
                </p>
                <p>
                  I&apos;ve spent 15+ years as a chef in Denver kitchens. Great work, and I&apos;ve learned something valuable along the way: it matters when someone actually knows your name. When they remember what you need. When you&apos;re not just another ticket.
                </p>
                <p>
                  That&apos;s why I started VURMZ. Too many businesses are stuck ordering from massive companies that don&apos;t know them, don&apos;t care about their timeline, and require minimum orders of 100 when you only need 12. I wanted to offer something different.
                </p>
                <p>
                  I taught myself laser engraving and quickly developed a genuine appreciation for the craft. I operate three laser systems with different technologies so I can handle any surface—and I continue to expand my capabilities as I grow. Now I get to do work I enjoy, for people I actually know, right here where I live with my wife and son.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/images/zach.jpeg"
                alt="Zach and his son in the Colorado mountains"
                fill
                className="object-cover"
              />
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
  )
}
