import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CartDrawer from '@/components/shop/CartDrawer'
import type { Metadata } from 'next'
import { SIGNATURE } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Precision laser engraving in Centennial, CO. Engraved gifts, tumblers, coasters, pens, and decor, or bring your own thing and have it engraved from $${SIGNATURE.startingAt}. Hand-delivered across South Denver.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen" data-theme="shop">
      <div className="relative z-[1]">
        <SiteHeader variant="shop" />
        <div className="min-h-screen">{children}</div>
        <CartDrawer />
        <SiteFooter />
      </div>
    </div>
  )
}
