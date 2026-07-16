import ServicesClient from '@/components/services/ServicesClient'
import BusinessMenu from '@/components/services/BusinessMenu'

// The business menu reads live D1 at request time; the rest of the page
// is the existing client experience, receiving the menu as a slot.
export const runtime = 'edge'

export default function ServicesPage() {
  return <ServicesClient businessMenu={<BusinessMenu />} />
}
