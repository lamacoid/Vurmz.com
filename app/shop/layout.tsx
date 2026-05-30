import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CartDrawer from '@/components/shop/CartDrawer'
import FloralFrame from '@/components/shop/aub/FloralFrame'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Laser Engraving',
  description: 'Custom laser engraving in Centennial, CO. Bring your own item or tell me what you need. Knives, tumblers, cutting boards, laptops, and more. Hand-delivered across South Denver.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-aub-beige text-aub-ink-soft min-h-screen" data-theme="shop">
      <SiteHeader variant="shop" />
      {/* calm beige margin around the floral-bordered content panel */}
      <main className="min-h-screen px-3 sm:px-5 lg:px-8 pb-6 pt-3">
        <FloralFrame pattern="strawberry-thief">
          {children}
        </FloralFrame>
      </main>
      <CartDrawer />
      <SiteFooter />
    </div>
  )
}
