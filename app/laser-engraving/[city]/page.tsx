import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

// ---------------------------------------------------------------------------
// City data: slug, display name, and unique local copy per service area
// ---------------------------------------------------------------------------

interface CityData {
  slug: string
  name: string
  paragraphs: string[]
  neighborhoods: string
}

const cityData: Record<string, CityData> = {
  centennial: {
    slug: 'centennial',
    name: 'Centennial',
    neighborhoods: 'Southglenn, The Streets at SouthGlenn, and neighborhoods along Arapahoe Road',
    paragraphs: [
      'VURMZ is based right here in Centennial. I can meet you at your location, hand-deliver your order, and turn jobs around in days. If you run a restaurant near The Streets at SouthGlenn, a dental office along Arapahoe Road, or anything in between, I am right down the road.',
      'Every engraving job is handled personally by Zach, from quoting to production to delivery. No middlemen, no outsourced labor. I live here, I work here, and I want your stuff to look good.',
      'From branded pens for your front desk to engraved knives for your kitchen, laser engraving does not fade, peel, or wash off. Your brand stays sharp year after year.',
      'I am flexible on order sizes. One-off gift or a recurring quarterly order, just text me a photo of what you want engraved and I will have a quote back to you in minutes.',
    ],
  },
  littleton: {
    slug: 'littleton',
    name: 'Littleton',
    neighborhoods: 'downtown Littleton along Main Street, the Riverwalk, and Columbine Valley',
    paragraphs: [
      'Littleton has one of the best downtowns in the Denver metro. I work with shops, restaurants, and offices throughout Littleton, from Main Street boutiques to offices along Santa Fe Drive.',
      'If you are near the Littleton Riverwalk or in the Columbine Valley area, I can meet you locally to pick up items or hand-deliver finished orders. Direct handoff from the person who engraved your order.',
      'Laser engraving works on metal, wood, acrylic, leather, glass, and more. Branded pens for your register, engraved coasters for your tasting room, custom metal business cards. Whatever you need for your Littleton business, I can make it happen.',
      'Most single-piece custom engraving starts at $50, and bulk orders on stocked items like pens, keychains, and coasters come in ready-to-go packs. No setup fees, no minimums, and free delivery throughout the south Denver metro.',
    ],
  },
  'lone-tree': {
    slug: 'lone-tree',
    name: 'Lone Tree',
    neighborhoods: 'Park Meadows, RidgeGate, Lincoln Station, and the Charles Schwab campus area',
    paragraphs: [
      'Lone Tree has a mix of corporate offices at RidgeGate and shops and restaurants around Park Meadows. I deliver engraved items directly to your Lone Tree office or storefront.',
      'Metal business cards for your team, branded pens for a conference at the Lone Tree Arts Center, custom awards for an event at the Gaylord Rockies. You text me, I quote you, and I hand-deliver the finished product.',
      'Same-week turnaround is standard on most stocked items. I am flexible on rush orders for local clients. If you need 50 engraved pens by Friday, just say the word.',
      'Every item is engraved on professional-grade laser equipment. The results are permanent and clean. No fading, no peeling, just a mark that lasts as long as the item itself.',
    ],
  },
  parker: {
    slug: 'parker',
    name: 'Parker',
    neighborhoods: 'Mainstreet Parker, the PACE Center, Stroh Ranch, and Stonegate neighborhoods',
    paragraphs: [
      'Parker is growing fast, and I work with restaurants, offices, contractors, and retailers here. Custom engraving on everything from branded pens to industrial equipment labels.',
      'If you are in the Mainstreet Parker district, near the PACE Center, or along Parker Road, I deliver directly to your location. Quick handoff from the person who actually did your job.',
      'Many of my Parker clients order quarterly packs of branded pens, coasters, or keychains to keep their offices stocked. It makes a real impression on customers.',
      'Laser engraving is the most durable form of branding you can get. Unlike printed labels or vinyl decals, an engraved logo is permanent. It is etched into the material itself.',
    ],
  },
  'highlands-ranch': {
    slug: 'highlands-ranch',
    name: 'Highlands Ranch',
    neighborhoods: 'Town Center, Highlands Ranch Backcountry Wilderness, and the business parks along Broadway and Lucent',
    paragraphs: [
      'Highlands Ranch is packed with local businesses, and I do laser engraving for a lot of them. From the shops at Town Center to the offices along Broadway and Lucent Boulevard.',
      'I work with restaurants, real estate agents, contractors, dental offices, fitness studios, and corporate teams across Highlands Ranch. Branded giveaway items for community events, engraved equipment labels for construction crews, you name it. I deliver to your door.',
      'You text me, I quote you, and I get it done. No phone trees, no ticket systems. Just a direct line to the person doing your engraving.',
      'If you have never tried laser engraving for your business, I do samples before you commit to a full order. I will engrave a few test pieces on your chosen material so you can see and feel the results. No obligation.',
    ],
  },
  englewood: {
    slug: 'englewood',
    name: 'Englewood',
    neighborhoods: 'the CityCenter Englewood district, South Broadway, and neighborhoods near Swedish Medical Center',
    paragraphs: [
      'Englewood is right in the heart of the south Denver metro. From the shops along South Broadway to the offices near CityCenter Englewood, I do custom engraving with free local delivery.',
      'If you run a restaurant, brewery, or retail shop in the South Broadway corridor, engraved coasters, pint glasses, and metal business cards are a solid way to stand out. Laser engraving is permanent. It does not peel off or fade like printed stuff.',
      'Englewood also has a lot of medical and professional offices. Engraved pens, nameplates, and awards are a practical way to get your brand in front of patients, clients, and staff. I handle everything from design to delivery.',
      'Pricing is straightforward. Most custom single-piece jobs start at $35, and I stock pens, keychains, coasters, and metal business cards in ready-to-engrave packs. Text me what you need and I will reply with a quote, usually within minutes.',
    ],
  },
  'castle-rock': {
    slug: 'castle-rock',
    name: 'Castle Rock',
    neighborhoods: 'historic downtown Castle Rock, the Outlets at Castle Rock, Meadows, and Miller Activity Complex',
    paragraphs: [
      'Castle Rock sits between Denver and Colorado Springs, and I deliver hand-engraved orders directly to businesses here. No shipping required.',
      'If you run a shop in historic downtown Castle Rock, a restaurant near the Outlets, or a business along I-25 and Meadows Parkway, I bring finished orders directly to you. Fast turnaround, and you deal with one person from start to finish.',
      'Castle Rock has breweries, outdoor outfitters, real estate offices, and construction companies. Engraved pens on a closing table, branded coasters at a taproom, custom knives as corporate gifts. That stuff gets noticed.',
      'I am flexible on order sizes and happy to do sample runs before you commit. Text me and we will figure it out together.',
    ],
  },
  aurora: {
    slug: 'aurora',
    name: 'Aurora',
    neighborhoods: 'Southlands, the Anschutz Medical Campus area, Tollgate Crossing, and Smoky Hill neighborhoods',
    paragraphs: [
      'Aurora is the largest city in the east Denver metro. From corporate offices near the Anschutz Medical Campus to restaurants and shops at Southlands, I do laser engraving with personal delivery across Aurora.',
      'Aurora businesses cover everything: medical, aerospace, food service, construction, retail, tech. Laser engraving gives you a durable way to brand your tools, gifts, promo items, and signage. Unlike printed labels, engraved marks are permanent.',
      'I serve clients throughout Aurora, including the Southlands area, Tollgate Crossing, Smoky Hill, and along E-470 and Quincy Avenue. Delivery is free on orders over $100, and I am happy to meet locally for pickups and drop-offs.',
      'Single engraved gift or a recurring bulk order of branded pens and business cards, either way it is easy. Text me a photo or description of what you want and I will have a quote back to you in minutes.',
    ],
  },
  'greenwood-village': {
    slug: 'greenwood-village',
    name: 'Greenwood Village',
    neighborhoods: 'the Denver Tech Center, Fiddler\'s Green, Orchard Road, and Greenwood Plaza',
    paragraphs: [
      'Greenwood Village is the heart of the Denver Tech Center. Corporate headquarters, law firms, financial advisors, tech companies. I do laser engraving for businesses here, from engraved metal business cards to branded executive gifts.',
      'If your office is near Fiddler\'s Green, Greenwood Plaza, or along Orchard Road, I deliver finished orders directly to your building. No shipping to coordinate. I hand it to you personally.',
      'Corporate gifting is one of the most common things I do in Greenwood Village. Engraved pens, knives, tumblers, and leather goods work great as client gifts, employee recognition awards, and conference giveaways.',
      'VURMZ is a one-person operation. Your project gets my full attention, your timeline is respected, and you talk directly to the person doing the work.',
    ],
  },
  'cherry-hills': {
    slug: 'cherry-hills',
    name: 'Cherry Hills',
    neighborhoods: 'Cherry Hills Village, the Glenmoor Country Club area, and neighborhoods along University Boulevard and Quincy Avenue',
    paragraphs: [
      'Cherry Hills Village is one of Colorado\'s most well-known communities. I do laser engraving for businesses and individuals here, with personal delivery to your Cherry Hills address.',
      'Engraved metal business cards, personalized gifts for a private event, branded items for clients. I take my time on every job and deliver it myself.',
      'Cherry Hills is minutes from my Centennial workshop, so turnaround is fast. Same-week delivery is standard on most stocked items, and I can handle rush orders with advance notice.',
      'I test every job on sample material first, so you see the result before I run the full order. Clean, permanent engraving on every piece.',
    ],
  },
  denver: {
    slug: 'denver',
    name: 'Denver',
    neighborhoods: 'RiNo, LoDo, Capitol Hill, Cherry Creek, Baker, South Broadway, and the Denver Tech Center',
    paragraphs: [
      'I serve restaurants in RiNo, boutiques in Cherry Creek, offices in LoDo, breweries in Baker, and shops along South Broadway. Personal delivery from Centennial.',
      'Branded pens for your coworking space, engraved coasters for your taproom, metal business cards for your real estate team, custom awards for a corporate event. I do all of it.',
      'You text me what you want, I quote you in minutes, and I deliver to your Denver location, typically within the same week. No online portals, no automated confirmations. Just a direct line to the person doing your engraving.',
      'Laser engraving gives your brand a permanent, tactile quality that printed labels and vinyl stickers cannot match. When someone picks up your pen or holds your business card, they can feel it. That sticks with people.',
    ],
  },
}

// Services list shared across all city pages
const services = [
  { name: 'Branded Pens', description: 'Metal stylus pens engraved with your logo and contact info.' },
  { name: 'Metal Business Cards', description: 'Matte black or stainless steel cards with your info engraved.' },
  { name: 'Coasters & Barware', description: 'Wood, slate, or steel coasters engraved for restaurants and breweries.' },
  { name: 'Keychains & Promotional Items', description: 'Acrylic or metal keychains perfect for giveaways and events.' },
  { name: 'Knife & Tool Engraving', description: 'Custom text or logos on kitchen knives, multitools, and blades.' },
  { name: 'Industrial Labels & Nameplates', description: 'ABS panel labels, equipment tags, and compliance nameplates.' },
  { name: 'Custom Gifts & Awards', description: 'Trophies, cutting boards, tumblers, and personalized keepsakes.' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCityFromSlug(slug: string): CityData | undefined {
  return cityData[slug]
}

// ---------------------------------------------------------------------------
// Static params — generates a page for every city in the data map
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(cityData).map((slug) => ({ city: slug }))
}

// ---------------------------------------------------------------------------
// Metadata — unique title + description per city
// ---------------------------------------------------------------------------

type Props = {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityFromSlug(slug)
  if (!city) return {}

  const title = `Laser Engraving in ${city.name}, CO`
  const description = `Professional laser engraving in ${city.name}, Colorado. Branded pens, metal business cards, custom gifts, industrial labels, and more. No minimums, same-week turnaround, hand-delivered by VURMZ.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | VURMZ`,
      description,
      url: `${siteInfo.url}/laser-engraving/${city.slug}`,
    },
    alternates: {
      canonical: `${siteInfo.url}/laser-engraving/${city.slug}`,
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCityFromSlug(slug)
  if (!city) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteInfo.legalName,
    alternateName: 'VURMZ Laser Engraving',
    description: `Professional laser engraving services in ${city.name}, Colorado. Branded pens, metal business cards, equipment labels, custom gifts. Hand-delivered by VURMZ.`,
    url: `${siteInfo.url}/laser-engraving/${city.slug}`,
    telephone: siteInfo.phone,
    email: siteInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Centennial',
      addressRegion: 'CO',
      postalCode: '80112',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteInfo.coordinates.lat,
      longitude: siteInfo.coordinates.lng,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    priceRange: '$$',
    openingHours: 'Mo-Sa 08:00-18:00',
    founder: {
      '@type': 'Person',
      name: siteInfo.founder.fullName,
    },
  }

  return (
    <div className="bg-vurmz-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">
            Service Area &middot; {city.name}, {siteInfo.stateAbbr}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-tight mb-6">
            Laser Engraving in {city.name}, Colorado
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            Laser engraving for businesses and individuals in {city.name} and the surrounding area. Hand-delivered by {siteInfo.founder.name} from {siteInfo.name} in Centennial.
          </p>
        </div>
      </section>

      {/* ═══════════ ABOUT THE AREA ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {city.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-gray-400 text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
            What I Offer
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-8">
            Services available in {city.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-5"
              >
                <h3 className="text-sm font-semibold text-cream mb-1">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-4">
            Ready to get started in {city.name}?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Text or call {siteInfo.founder.name} for a free quote. Most quotes are returned within minutes, and orders are delivered the same week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              Get a Quote
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink(`Hi Zach, I'm in ${city.name} and interested in laser engraving`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ LINKS ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
            >
              View portfolio
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-vurmz-teal font-mono tracking-wide hover:text-cream transition-colors group"
            >
              View pricing
              <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink()}
              className="inline-flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wide hover:text-cream transition-colors group"
            >
              <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
              Text me
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ OTHER SERVICE AREAS ═══════════ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase mb-4">
            Other Areas We Serve
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(cityData)
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/laser-engraving/${c.slug}`}
                  className="bg-white/[0.03] border border-white/[0.08] text-gray-300 px-3 py-1.5 text-sm rounded-sm hover:border-vurmz-teal/40 hover:text-cream transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
