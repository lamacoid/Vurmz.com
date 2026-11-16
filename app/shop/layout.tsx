import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CartDrawer from '@/components/shop/CartDrawer'

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
