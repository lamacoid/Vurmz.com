import Link from 'next/link'
import { HomeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-vurmz-light">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-8xl font-bold text-vurmz-teal/20">404</span>
        </div>
        <h1 className="text-3xl font-bold text-vurmz-dark mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page got lost in the laser smoke.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-vurmz-teal text-white px-6 py-3 font-semibold hover:bg-vurmz-teal-dark transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 border-2 border-vurmz-teal text-vurmz-teal px-6 py-3 font-semibold hover:bg-vurmz-teal hover:text-white transition-colors"
          >
            Start an Order
          </Link>
          <a
            href={getSmsLink()}
            className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-vurmz-teal px-6 py-3 font-medium transition-colors"
          >
            <PhoneIcon className="w-5 h-5" />
            Text Us
          </a>
        </div>
      </div>
    </div>
  )
}
