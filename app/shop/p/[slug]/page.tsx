import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import AddToCart from '@/components/shop/AddToCart'
import GlassImage from '@/components/shop/GlassImage'
import { getProductBySlug, getCategoryById } from '@/lib/db/repos/products'
import { getMediaById } from '@/lib/db/repos/media'

export const runtime = 'edge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isPublished || product.soldAt) return { title: 'Not found' }
  return {
    title: product.name,
    description: product.description || `${product.name} — custom laser engraved by VURMZ in Centennial, CO.`,
    alternates: { canonical: `/shop/p/${slug}` },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isPublished || product.soldAt) return notFound()

  const [category, hero] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : null,
    product.heroMediaId ? getMediaById(product.heroMediaId) : null,
  ])

  const price = (product.priceCents / 100).toFixed(2)

  return (
    <div className="text-[var(--ink-soft)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'VURMZ', href: '/' },
            { label: 'Shop', href: '/shop' },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
          theme="services"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          <div className="group relative aspect-square bg-[var(--surface)] border border-[var(--hairline)] rounded-sm overflow-hidden">
            {hero?.url ? (
              <GlassImage src={hero.url} alt={hero.altText || product.name} depth="product" plain className="absolute inset-0" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-sm">No image yet</div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3 text-[var(--ink)]">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-5">{product.shortDescription}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-[#C67A6F]">${price}</span>
              {product.oneOff ? (
                <span className="text-sm text-[var(--ink-soft)]">one of a kind</span>
              ) : product.packSize > 1 ? (
                <span className="text-sm text-[var(--ink-soft)]">pack of {product.packSize}</span>
              ) : (
                <span className="text-sm text-[var(--ink-soft)]">each</span>
              )}
            </div>

            {product.oneOff && (
              <div className="inline-flex items-center gap-2 text-xs bg-[#C67A6F]/15 text-[#C67A6F] border border-[#C67A6F]/30 px-3 py-1.5 rounded-sm mb-6">
                Only one available — once it&rsquo;s gone, it&rsquo;s gone.
              </div>
            )}

            {product.madeToOrder && product.leadTimeDays > 0 && (
              <div className="inline-flex items-center gap-2 text-xs bg-[var(--surface)] text-[var(--ink)] px-3 py-1.5 rounded-sm mb-6">
                Made to order · ready in {product.leadTimeDays} {product.leadTimeDays === 1 ? 'day' : 'days'}
              </div>
            )}

            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              packSize={product.packSize}
              heroUrl={hero?.url ?? null}
              oneOff={product.oneOff}
              engravable={product.metadata?.engravable !== false}
            />

            {product.description && (
              <div className="mt-10 pt-8 border-t border-[var(--hairline)]">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-3">Details</h2>
                <div className="prose prose-sm prose-invert text-[var(--ink-soft)] whitespace-pre-wrap">{product.description}</div>
              </div>
            )}

            <div className="mt-10 text-xs text-[var(--ink-soft)]">
              Questions? <Link href="/shop/contact" className="text-[#C67A6F] hover:underline">Get in touch</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
