import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen" data-theme="shop">
      <SiteHeader variant="shop" />
      <div className="min-h-screen">{children}</div>
      <SiteFooter />
    </div>
  )
}
