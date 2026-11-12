import { siteInfo } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, SHOP_RATE } from '@/lib/pricing'

export const runtime = 'edge'

/**
 * /llms.txt: the business in plain text for AI assistants (ChatGPT,
 * Perplexity, Claude, and the rest). Every number reads from lib/pricing
 * and lib/site-info, so this file can never disagree with the pages.
 * Facts only. No claims the pages do not make.
 */
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

export function GET() {
  const u = siteInfo.url
  const lines = [
    '# VURMZ Laser Engraving',
    '',
    `> VURMZ is a laser engraving shop in ${siteInfo.city}, ${siteInfo.state} (south Denver metro). It engraves items people already own and makes branded and marked goods for local businesses. Prices are posted, quotes come back the same day, and finished work is hand-delivered.`,
    '',
    '## Facts',
    `- Business: ${siteInfo.legalName}, ${siteInfo.fullAddress}`,
    `- Phone and text: ${siteInfo.phone} (texting a photo is the fastest way to get a price)`,
    `- Email: ${siteInfo.email}`,
    `- Website: ${u}`,
    `- Service area: ${siteInfo.serviceAreas.join(', ')}`,
    '- Materials: metal, anodized aluminum, stainless steel, wood, glass, leather, slate, acrylic, plastic',
    '- Turnaround: most work in 24 to 72 hours',
    `- Delivery: hand-delivered in the ${DELIVERY.area}, free over $${DELIVERY.freeThreshold}`,
    '',
    '## Engrave something you already own',
    `- One piece, one placement: from ${price(SIGNATURE.startingAt)}`,
    `- Knives: ${price(CATALOG.knife.base)} a knife, ${price(CATALOG.knife.crew.perKnife)} each at ${CATALOG.knife.crew.minQty} or more, ${price(CATALOG.knife.fullKitchen.perKnife)} each at ${CATALOG.knife.fullKitchen.minQty} or more`,
    `- Tools and gear: ${price(CATALOG.tool.base)} a piece, ${price(CATALOG.tool.crew.perPiece)} each at ${CATALOG.tool.crew.minQty} or more, ${price(CATALOG.tool.jobsite.perPiece)} each at ${CATALOG.tool.jobsite.minQty} or more`,
    '- Common items: pocket knives, chef knives, tumblers, water bottles, laptops, tablets, flasks, cutting boards, hand tools, lighters',
    `- How: send a photo at ${u}/engrave/ or by text, get a price the same day, drop it off or ship it`,
    '',
    '## For businesses',
    `- Equipment labels and service tags: ${price(CATALOG.serviceTags.aluminumBase * CATALOG.serviceTags.pack)} per ${CATALOG.serviceTags.pack} in anodized aluminum, stainless ${price(CATALOG.serviceTags.stainlessBase)} each`,
    `- Metal business cards: ${price(CATALOG.cards.matteBlackBase * CATALOG.cards.pack)} per ${CATALOG.cards.pack}`,
    `- Branded pens: ${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen, packs of ${CATALOG.pens.pack}`,
    `- Coasters by the pack: ${price(CATALOG.coasters.perItem[0])} to ${price(CATALOG.coasters.perItem[1])} each, packs of ${CATALOG.coasters.pack}`,
    `- Plates, panels, faceplates, valve tags, signage: ${price(SHOP_RATE.hourly)} an hour, ${SHOP_RATE.minimumMinutes} minute minimum, material quoted`,
    '- No setup fees. Small orders are fine. Logos stay on file for reorders.',
    `- Standing accounts: NET-${BUSINESS.netTermsDays} terms, free delivery every ${siteInfo.deliveryRunDay}, volume discounts up to ${Math.round(Math.max(...BUSINESS.tiers.map(t => t.discount)) * 100)}%`,
    '',
    '## Pages',
    `- [Engrave your stuff](${u}/engrave/): photo quote form and prices for customer-owned items`,
    `- [Business pricing](${u}/services/): posted prices and standing accounts`,
    `- [Knife engraving](${u}/services/knife-engraving/): single knives and kitchen crews`,
    `- [Metal tags and labels](${u}/services/metal-tags/): equipment labels and service tags`,
    `- [Materials](${u}/services/materials/): what marks and how it looks on each material`,
    `- [Items](${u}/shop/): the short list of stocked items to engrave`,
    `- [The work](${u}/services/portfolio/): photos of finished pieces`,
    `- [About](${u}/about/)`,
    `- [Contact](${u}/services/contact/)`,
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
