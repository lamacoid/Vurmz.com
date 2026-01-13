import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ServiceAreaMap from '@/components/ServiceAreaMap'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Zach, owner of VURMZ LLC. Colorado native, Centennial local, chef, and laser engraver. Self-taught and obsessed with the craft.',
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
                  I grew up in Colorado and have been in Centennial since it was still unincorporated Arapahoe County. This is home.
                </p>
                <p>
                  Chef by trade. Been in kitchens for 15 years. Time to try something new and my own. I stumbled into laser engraving, fell down a very deep hole, taught myself everything, and developed a genuine love for the work. When I get into something, I go hard. So here we are.
                </p>
                <p>
                  I live here with my wife and son. Running VURMZ lets me do work I care about while staying close to home.
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

      {/* Service Area */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-vurmz-dark mb-6">
                Service Area
              </h2>
              <p className="text-gray-600 mb-6">
                Based in Centennial. Serving all of south suburban Denver and the metro area.
              </p>
              <div>
                <h3 className="font-semibold text-vurmz-dark mb-3">Serving:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Centennial', 'Greenwood Village', 'Cherry Hills', 'Highlands Ranch', 'Lone Tree', 'Englewood', 'Littleton', 'Denver', 'Aurora', 'Parker'].map((area) => (
                    <span key={area} className="bg-gray-200 text-gray-700 px-3 py-1 text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ServiceAreaMap />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get a Quote
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Text or send a quote request. I respond the same day.
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
