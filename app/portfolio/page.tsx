import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import PortfolioGallery from '@/components/PortfolioGallery'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'View laser engraving work for local businesses in Centennial and Denver metro.',
}

// Portfolio items organized by category
// Replace placeholder images with real photos as they become available
const portfolioItems = [
  // Culinary Work
  {
    id: 'culinary-1',
    title: 'Restaurant Pan Set',
    description: 'Full hotel pan set with restaurant name and number for theft prevention',
    category: 'Culinary',
    industry: 'Fine Dining',
    location: 'Cherry Hills Village',
  },
  {
    id: 'culinary-2',
    title: 'Custom Chef Knife',
    description: 'Personal chef knife with name and custom icon',
    category: 'Culinary',
    industry: 'Corporate Kitchen',
    location: 'Denver',
  },
  {
    id: 'culinary-3',
    title: 'Bamboo Cutting Boards',
    description: 'Set of 10 branded cutting boards for kitchen gifts',
    category: 'Culinary',
    industry: 'Catering Company',
    location: 'Greenwood Village',
  },
  {
    id: 'culinary-4',
    title: 'Wine Gift Boxes',
    description: 'Wooden wine boxes with restaurant branding for VIP gifts',
    category: 'Culinary',
    industry: 'Steakhouse',
    location: 'Lone Tree',
  },
  // Medical/Dental
  {
    id: 'medical-1',
    title: 'Dental Practice Pens',
    description: '100 metal stylus pens with practice logo',
    category: 'Medical/Dental',
    industry: 'Dental Practice',
    location: 'Centennial',
  },
  {
    id: 'medical-2',
    title: 'Staff Recognition Awards',
    description: 'Custom acrylic awards for employee anniversaries',
    category: 'Medical/Dental',
    industry: 'Medical Office',
    location: 'Englewood',
  },
  {
    id: 'medical-3',
    title: 'Instrument Marking',
    description: 'Surgical instrument identification marking',
    category: 'Medical/Dental',
    industry: 'Surgical Center',
    location: 'Highlands Ranch',
  },
  // Trade Tools
  {
    id: 'tools-1',
    title: 'Power Tool Set',
    description: 'DeWalt power tool set with company name and phone',
    category: 'Trade Tools',
    industry: 'General Contractor',
    location: 'Littleton',
  },
  {
    id: 'tools-2',
    title: 'Branded Tape Measures',
    description: '25 tape measures with contractor branding',
    category: 'Trade Tools',
    industry: 'Electrician',
    location: 'Aurora',
  },
  {
    id: 'tools-3',
    title: 'Hand Tool Collection',
    description: 'Complete hand tool set marked for job site identification',
    category: 'Trade Tools',
    industry: 'Plumber',
    location: 'Parker',
  },
  // Business Items
  {
    id: 'business-1',
    title: 'Metal Business Cards',
    description: 'Anodized aluminum cards for real estate agent',
    category: 'Business Items',
    industry: 'Real Estate',
    location: 'Cherry Creek',
  },
  {
    id: 'business-2',
    title: 'Promotional Keychains',
    description: '50 stainless steel keychains for insurance agency',
    category: 'Business Items',
    industry: 'Insurance',
    location: 'Greenwood Village',
  },
  {
    id: 'business-3',
    title: 'Desk Name Plates',
    description: 'Engraved aluminum name plates for law firm',
    category: 'Business Items',
    industry: 'Legal',
    location: 'Denver Tech Center',
  },
  {
    id: 'business-4',
    title: 'Branded Water Bottles',
    description: 'Insulated bottles for gym grand opening',
    category: 'Business Items',
    industry: 'Fitness',
    location: 'Centennial',
  },
  // Industrial Labels
  {
    id: 'industrial-1',
    title: 'Electrical Panel Labels',
    description: 'ABS plastic labels for breaker panel identification',
    category: 'Industrial',
    industry: 'Electrical Contractor',
    location: 'Aurora',
  },
  {
    id: 'industrial-2',
    title: 'Control Box Signage',
    description: 'Warning and identification signs for industrial equipment',
    category: 'Industrial',
    industry: 'Manufacturing',
    location: 'Commerce City',
  },
  {
    id: 'industrial-3',
    title: 'Equipment Labels',
    description: 'Asset tags and identification plates for machinery',
    category: 'Industrial',
    industry: 'HVAC Contractor',
    location: 'Littleton',
  },
  // Custom Projects
  {
    id: 'custom-1',
    title: 'Wedding Favors',
    description: 'Custom coasters for local wedding venue',
    category: 'Custom Projects',
    industry: 'Event Venue',
    location: 'Highlands Ranch',
  },
  {
    id: 'custom-2',
    title: 'Memorial Plaque',
    description: 'Brass memorial plaque for community organization',
    category: 'Custom Projects',
    industry: 'Non-Profit',
    location: 'Centennial',
  },
  {
    id: 'custom-3',
    title: 'Anniversary Gifts',
    description: 'Custom wooden boxes for company anniversary gifts',
    category: 'Custom Projects',
    industry: 'Corporate',
    location: 'Denver',
  },
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'Culinary', label: 'Culinary' },
  { id: 'Medical/Dental', label: 'Medical/Dental' },
  { id: 'Trade Tools', label: 'Trade Tools' },
  { id: 'Industrial', label: 'Industrial' },
  { id: 'Business Items', label: 'Business Items' },
  { id: 'Custom Projects', label: 'Custom Projects' },
]

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              My Work
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Real projects for real local businesses. Every piece represents a relationship with a Centennial or Denver metro business owner.
            </p>
            <p className="text-gray-400">
              Photos coming soon as I build my portfolio. In the meantime, here is a sample of the types of projects I handle.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGallery items={portfolioItems} categories={categories} />
        </div>
      </section>

      {/* What I Can Do */}
      <section className="bg-vurmz-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-vurmz-dark mb-8 text-center">
            What I Can Engrave
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Stainless Steel',
              'Aluminum',
              'Brass',
              'Wood',
              'Bamboo',
              'Acrylic',
              'Leather',
              'Glass',
              'Anodized Metal',
              'Coated Metals',
              'Plastic',
              'Stone',
            ].map((material) => (
              <div
                key={material}
                className="bg-white border border-gray-200 p-4 text-center text-gray-700"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Professional Equipment for Professional Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="border border-gray-700 p-6">
              <h3 className="font-semibold text-vurmz-teal mb-2">30W Fiber Laser</h3>
              <p className="text-gray-400 text-sm">
                Gweike Cloud G2 Pro for precision metal engraving
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="font-semibold text-vurmz-teal mb-2">50W CO2 Laser</h3>
              <p className="text-gray-400 text-sm">
                With rotary for pens, bottles, and cylindrical items
              </p>
            </div>
            <div className="border border-gray-700 p-6">
              <h3 className="font-semibold text-vurmz-teal mb-2">22W Diode Laser</h3>
              <p className="text-gray-400 text-sm">
                Reality Falcon 2 for wood cutting and engraving
              </p>
            </div>
          </div>
          <p className="text-gray-400">
            $35,000 invested in professional-grade equipment because quality requires the right tools.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-teal text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell me what you need. I respond the same day with pricing and turnaround time.
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
