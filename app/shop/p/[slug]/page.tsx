import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { portfolioItems, type PortfolioItem } from '@/lib/portfolio'
import Breadcrumbs from '@/components/Breadcrumbs'
import AddToCart from '@/components/shop/AddToCart'
import ProductGallery from '@/components/shop/ProductGallery'
import { getProductBySlug, getCategoryById, listVariants, listProductImages, soldUnitsFor } from '@/lib/db/repos/products'
import { listStockedFinishes } from '@/lib/db/repos/inventory'
import { saleFrom, saleWindowOpen, liveSale, saleEndsLabel } from '@/lib/sale'
import { getMediaById } from '@/lib/db/repos/media'
import { menuPrice, menuCase } from '@/lib/menu-format'
import { builderConfigFrom } from '@/lib/builder/types'
import { DELIVERY } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const runtime = 'edge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isPublished || product.soldAt) return { title: 'Not found' }
  return {
    title: product.name,
    description: product.description || `${product.name}, custom laser engraved by VURMZ in Centennial, CO.`,
    alternates: { canonical: `/shop/p/${slug}` },
  }
}

// The product page as one entry off the Engraver's Menu, plated on the
// same cream card as the shop. Photo-less products (most of the catalog
// until photography lands) get a clean single column instead of an empty
// square; when a product has a photo it takes the framed plate on the left.
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isPublished || product.soldAt) return notFound()

  const [category, hero, variants, galleryRows] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : null,
    product.heroMediaId ? getMediaById(product.heroMediaId) : null,
    listVariants(product.id),
    listProductImages(product.id),
  ])

  // Gallery = product_images rows; a product with only a hero photo still
  // gets a one-image gallery so both paths render the same framed plate.
  const gallery = galleryRows.length > 0
    ? galleryRows.map(g => ({ url: g.url, alt: g.altText || product.name }))
    : hero?.url
      ? [{ url: hero.url, alt: hero.altText || product.name }]
      : []

  // With pack options the header shows the lowest price as "from $X".
  const lowestCents = Math.min(product.priceCents, ...variants.map(v => v.priceCents))

  // Launch/sale pricing: same helper checkout uses, so the page can never
  // show a price the cart won't honor. Capped sales count real orders.
  const saleDef = saleFrom(product.metadata)
  const soldUnits = saleDef?.capUnits !== undefined && saleWindowOpen(saleDef) ? await soldUnitsFor(product.id) : 0
  const sale = liveSale(product.metadata, soldUnits)

  // Subtext reads like the menu line it came from. Timing lives in the
  // fulfillment notes under the button, not here, so it's never said twice.
  const metaParts: string[] = []
  if (product.shortDescription) metaParts.push(menuCase(product.shortDescription))
  if (product.packSize > 1) metaParts.push(`pack of ${product.packSize}`)
  const subtext = metaParts.join(', ')

  const timingLine =
    product.madeToOrder && product.leadTimeDays > 0
      ? `Made to order, ready in ${product.leadTimeDays} ${product.leadTimeDays === 1 ? 'day' : 'days'}.`
      : 'Most pieces ready in 24 to 72 hours.'

  const builderCfg = builderConfigFrom(product.metadata)

  // Finish chips come from the INVENTORY, not from product metadata: the
  // page offers exactly the colors Zach has counted in stock, nothing else.
  // The dormant builder materials only contribute the swatch hex when a
  // stocked finish matches one of their labels.
  const stockedFinishes = product.metadata?.engravable !== false ? await listStockedFinishes(product.id) : []
  const finishes = stockedFinishes.map(label => ({
    label,
    hex: builderCfg?.materials.find(m => m.label.trim().toLowerCase() === label.trim().toLowerCase())?.surface ?? null,
  }))

  const orderColumn = (
    <div>
      <AddToCart
        productId={product.id}
        slug={product.slug}
        name={product.name}
        priceCents={sale ? sale.priceCents : product.priceCents}
        packSize={product.packSize}
        heroUrl={gallery[0]?.url ?? null}
        oneOff={product.oneOff}
        engravable={product.metadata?.engravable !== false}
        variants={variants.map(v => ({ id: v.id, name: v.name, packSize: v.packSize, priceCents: v.priceCents }))}
        finishes={finishes}
      />

      {/* Fulfillment facts, right where the decision happens. */}
      <ul className="mt-6 pt-4 border-t border-[var(--hairline)] space-y-1.5 text-xs text-[var(--ink-soft)]">
        {builderCfg && (
          <li>
            {builderCfg.mode === 'canvas'
              ? `True size: ${builderCfg.widthIn}″ × ${builderCfg.heightIn}″`
              : `True size: ${builderCfg.widthIn}″ long`}
            {finishes.length > 1 ? ` · ${finishes.length} finishes` : ''}
          </li>
        )}
        <li>The engraving is included in the price.</li>
        <li>{timingLine}</li>
        <li>Hand-delivered in the South Denver metro, free over ${DELIVERY.freeThreshold}.</li>
      </ul>
    </div>
  )

  const detailsSection = product.description ? (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] relief-etched">The details</h2>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>
      <div className="text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-wrap">{product.description}</div>
    </div>
  ) : null

  return (
    <div className="text-[var(--ink-soft)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'VURMZ', href: '/' },
            { label: 'Shop', href: '/shop' },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
          theme="services"
        />

        {/* The plate: everything below lives on the menu card. */}
        <div className="mt-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-sm shadow-sm px-5 sm:px-10 py-8 sm:py-10">
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">
            {category ? category.name : 'From the shop'}
          </p>

          {/* The menu line, writ large: name, dotted leader, price. */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1
              className="text-3xl sm:text-4xl text-[var(--ink)] tracking-tight leading-tight relief-raised"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {product.name}
            </h1>
            {product.oneOff && (
              <span className="self-center flex-shrink-0 text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--eyebrow)] border border-[var(--eyebrow)]/40 rounded-sm px-1.5 py-px whitespace-nowrap">
                1 of 1
              </span>
            )}
            <span className="hidden sm:block flex-1 -translate-y-[6px] border-b border-dotted border-[var(--ink)]/25 min-w-[2rem]" aria-hidden />
            <span className="text-2xl sm:text-3xl font-semibold text-[var(--eyebrow)] whitespace-nowrap">
              {sale ? (
                <>
                  {/* Strikethrough only when the regular price was really charged before. */}
                  {sale.compareAt && (
                    <s className="text-xl sm:text-2xl font-normal text-[var(--ink-soft)]/70 mr-2.5">{menuPrice(product.priceCents)}</s>
                  )}
                  {menuPrice(sale.priceCents)}
                </>
              ) : variants.length > 0 && lowestCents < product.priceCents ? (
                `from ${menuPrice(lowestCents)}`
              ) : (
                menuPrice(product.priceCents)
              )}
            </span>
          </div>

          {sale && (
            <p className="text-xs font-semibold text-[var(--eyebrow)] mt-2">
              Launch price through {saleEndsLabel(sale)}{sale.capLabel ? `, ${sale.capLabel}` : ''}.
            </p>
          )}
          {subtext && <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-2xl relief-etched">{subtext}</p>}
          {product.oneOff && (
            <p className="text-xs text-[var(--ink-soft)] mt-1.5">only one exists, once it&rsquo;s gone, it&rsquo;s gone</p>
          )}

          <div className="mt-6 border-t-2 border-[var(--ink)]/25" aria-hidden />
          <div className="mt-[3px] border-t border-[var(--ink)]/25" aria-hidden />

          {gallery.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
              <div>
                <ProductGallery images={gallery} name={product.name} />
                {detailsSection}
              </div>
              <div className="lg:sticky lg:top-6 lg:self-start">{orderColumn}</div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto mt-8">
              {orderColumn}
              {detailsSection}
            </div>
          )}

          {product.slug === 'engrave-your-item' && (
            <>
              <PortfolioStrip
                title="Recent work"
                blurb={<>MacBooks and iPads, knives, tumblers, bottles. If it&rsquo;s solid and fits the bed, it marks.</>}
                slugs={RECENT_WORK_SLUGS}
              />
              <PortfolioStrip
                title="VURMZ Originals"
                blurb={<>My own designs, drawn and engraved start to finish. Want something like one of these? Say so in the instructions.</>}
                slugs={DESIGNED_HERE_SLUGS}
                portfolioLink
              />
            </>
          )}

          <p className="mt-10 pt-5 border-t border-[var(--hairline)] text-xs text-[var(--ink-soft)] text-center">
            Questions about this piece?{' '}
            <a
              href={getSmsLink(`Hi, I have a question about the ${product.name}`)}
              className="text-[var(--eyebrow)] font-semibold hover:underline"
            >
              Text {siteInfo.phone}
            </a>{' '}
            or <Link href="/shop/contact" className="text-[var(--eyebrow)] font-semibold hover:underline">send a note</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

// The house offer earns its proof, in two honest strips: things people
// brought in, and VURMZ Originals (pieces designed here start to finish,
// same "Originals" label the font book uses for house type). No overlap.
// Only shown on engrave-your-item.
const RECENT_WORK_SLUGS = [
  'macbook-personalization',
  'ipad-personalization',
  'culinary-cleaver',
  'pocket-knife',
  'branded-tumbler',
  'custom-water-bottle',
  'plastic-charger-marking',
  'clga-amp-faceplate',
]

const DESIGNED_HERE_SLUGS = [
  'denver-map-mirror',
  'eye-storm-mirror',
  'medieval-water-bottle',
  'aluminum-artwork',
]

function PortfolioStrip({ title, blurb, slugs, portfolioLink = false }: { title: string; blurb: React.ReactNode; slugs: string[]; portfolioLink?: boolean }) {
  const items = slugs
    .map(s => portfolioItems.find(p => p.slug === s))
    .filter((p): p is PortfolioItem => Boolean(p))
  if (items.length === 0) return null
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">{title}</h2>
        <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
      </div>
      <p className="text-sm text-[var(--ink-soft)] text-center mb-5 max-w-md mx-auto">{blurb}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(p => (
          <Link key={p.slug} href={`/services/portfolio/${p.slug}`} className="group block">
            <span className="block relative aspect-square overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--page)]">
              <Image
                src={p.src}
                alt={p.label}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </span>
            <span className="block mt-1.5 text-xs text-[var(--ink-soft)] leading-snug group-hover:text-[var(--ink)] transition-colors">
              {p.label}
            </span>
          </Link>
        ))}
      </div>
      {portfolioLink && (
        <p className="mt-4 text-center">
          <Link href="/services/portfolio" className="text-xs text-[var(--eyebrow)] font-semibold hover:underline">
            See the full portfolio
          </Link>
        </p>
      )}
    </div>
  )
}
