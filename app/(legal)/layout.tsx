import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

// Shared shell for the standalone pages (privacy, terms, unsubscribe) so they
// render with the normal site header/footer instead of as bare documents.
// Route group — URLs are unchanged.
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--page)] text-[var(--ink)]" data-theme="services">
      <SiteHeader variant="services" />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </div>
  )
}
