import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BurnEffect from '@/components/BurnEffect'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BurnEffect />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
