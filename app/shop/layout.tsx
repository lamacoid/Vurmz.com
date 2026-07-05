import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CartDrawer from '@/components/shop/CartDrawer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Precision laser engraving in Centennial, CO. Engraved gifts, tumblers, coasters, pens, and decor, or use Bring Your Own to get something you already have engraved for $35. Hand-delivered across South Denver.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--page)] text-[var(--ink-soft)]" data-theme="shop">
      {/* Ambient teal glow, fixed behind everything */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 20% 12%, rgba(60,185,178,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 85%, rgba(177,101,88,0.05) 0%, transparent 50%)',
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
