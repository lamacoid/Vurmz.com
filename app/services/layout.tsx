import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ScrollGlare from '@/components/ScrollGlare'

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--page)] text-[var(--ink)]" data-theme="services">
      <SiteHeader variant="services" />
      <div className="min-h-screen">
        {children}
      </div>
      <SiteFooter />
      <ScrollGlare />
    </div>
  )
}
