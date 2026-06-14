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
    <div className="text-gray-300 min-h-screen">
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
          <div className="group relative aspect-square bg-white/[0.04] border border-white/10 rounded-sm overflow-hidden">
            {hero?.url ? (
              <GlassImage src={hero.url} alt={hero.altText || product.name} depth="product" plain className="absolute inset-0" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No image yet</div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3 text-[#E7DFCB]">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-gray-300 text-base leading-relaxed mb-5">{product.shortDescription}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-[#D96C5C]">${price}</span>
              {product.oneOff ? (
                <span className="text-sm text-gray-400">one of a kind</span>
              ) : product.packSize > 1 ? (
                <span className="text-sm text-gray-400">pack of {product.packSize}</span>
              ) : (
                <span className="text-sm text-gray-400">each</span>
              )}
            </div>

            {product.oneOff && (
              <div className="inline-flex items-center gap-2 text-xs bg-[#D96C5C]/15 text-[#D96C5C] border border-[#D96C5C]/30 px-3 py-1.5 rounded-sm mb-6">
                Only one available — once it&rsquo;s gone, it&rsquo;s gone.
              </div>
            )}

            {product.madeToOrder && product.leadTimeDays > 0 && (
              <div className="inline-flex items-center gap-2 text-xs bg-white/[0.06] text-gray-200 px-3 py-1.5 rounded-sm mb-6">
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
              <div className="mt-10 pt-8 border-t border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Details</h2>
                <div className="prose prose-sm prose-invert text-gray-300 whitespace-pre-wrap">{product.description}</div>
              </div>
            )}

            <div className="mt-10 text-xs text-gray-400">
              Questions? <Link href="/shop/contact" className="text-[#D96C5C] hover:underline">Get in touch</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
