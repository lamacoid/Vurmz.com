import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CartDrawer from '@/components/shop/CartDrawer'
import RoomTheme from '@/components/shop/RoomTheme'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Precision laser engraving in Centennial, CO. Engraved gifts, tumblers, coasters, pens, and decor, or use Bring Your Own to get something you already have engraved for $35. Hand-delivered across South Denver.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="room relative min-h-screen" data-theme="shop">
      <RoomTheme />
      {/* The room's light: a soft signal-teal bloom, fixed behind everything */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(127,207,212,0.10) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 90%, rgba(13,47,53,0.8) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-[1]">
        <SiteHeader variant="shop" />
        <div className="min-h-screen">{children}</div>
        <CartDrawer />
        <SiteFooter />
      </div>
    </div>
  )
}
