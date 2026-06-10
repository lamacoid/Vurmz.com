import { permanentRedirect } from 'next/navigation'

// /shop/contact is not its own page — it's a funnel into the single contact
// page at /services/contact. A 308 permanent redirect consolidates all SEO
// signal there (stronger than a canonical tag) and prevents a duplicate,
// title-less "Shop" straggler from ever rendering or being indexed.
export default function ShopContact() {
  permanentRedirect('/services/contact')
}
