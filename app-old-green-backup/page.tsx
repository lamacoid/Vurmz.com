import Link from 'next/link'
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

const valueProps = [
  {
    title: 'Same-Day Service',
    description: 'Get your order in hours, not weeks. Online competitors take 1-3 weeks.',
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
    price: '$3.00-$3.50/unit',
    description: 'Metal stylus pens with your logo.',
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
              Same-day turnaround, no minimum orders, and you talk directly to me.
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
            I am 20-35% above online wholesalers. Here is why that makes sense for your business:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-vurmz-light p-6">
              <ScaleIcon className="h-8 w-8 text-vurmz-teal mb-4" />
              <h3 className="font-semibold text-vurmz-dark mb-2">Total Cost Comparison</h3>
              <p className="text-gray-600 text-sm">
                Online: $2/pen + $50 shipping + 2 weeks wait + 100 minimum = $250 and hassle
              </p>
              <p className="text-vurmz-teal text-sm mt-2 font-medium">
                VURMZ: $3.50/pen + same day + 25 units = exactly what you need
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
  )
}
