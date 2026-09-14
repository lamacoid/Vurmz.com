import type { Metadata } from 'next'
import { siteInfo } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import OnSite from '@/components/services/OnSite'

export const metadata: Metadata = {
  title: { absolute: 'Live Engraving for Events in Denver | VURMZ' },
  description: 'Live laser engraving at your event or store in the Denver metro. One person, one machine, names on the piece while the guest watches. Half day, full day, or per piece for retail.',
  alternates: { canonical: '/services/live-engraving' },
  openGraph: {
    title: 'Live Engraving for Events in Denver | VURMZ',
    description: 'Live laser engraving at your event or store. Half day, full day, or per piece for retail activations.',
    url: `${siteInfo.url}/services/live-engraving`,
    images: ['/portfolio/clga-faceplate-closeup.jpg'],
  },
}

export default function LiveEngravingPage() {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink-soft)]">
      <section className="pt-24 sm:pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Live engraving' }]} theme="landing" />
          <div className="mt-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] px-5 sm:px-10 py-8 sm:py-10">
            <h1 className="sr-only">Live engraving for events in Denver</h1>
            <OnSite standalone />
          </div>
        </div>
      </section>
    </div>
  )
}
