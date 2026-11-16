import { siteInfo } from '@/lib/site-info'
import { SIGNATURE, CATALOG, DELIVERY, BUSINESS, SHOP_RATE } from '@/lib/pricing'

export const runtime = 'edge'

/**
 * /llms.txt: the business in plain text for AI assistants (ChatGPT,
 * Perplexity, Claude, and the rest). Every number reads from lib/pricing
 * and lib/site-info, so this file can never disagree with the pages.
 * Facts only. No claims the pages do not make.
 *
 * This is a route, not a file in public/, on purpose: a static file would
 * go stale the first time a price changed, and an assistant would quote
 * the old number to a customer. The sections follow the outline Zach
 * supplied on 2026-11-15 (what VURMZ does, who it serves, key pages,
 * contact). Three things in that outline were left out because the site
 * does not offer them or the pages do not exist: titanium cards, the word
 * "premium", and the /products, /quote, and /faq addresses (those now
 * redirect to the real pages).
 */
const price = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

export function GET() {
  const u = siteInfo.url
  const cards = CATALOG.cards
  const lines = [
    '# VURMZ',
    '',
    `> VURMZ is a custom laser engraving shop in ${siteInfo.city}, ${siteInfo.state}, in the south Denver metro. It engraves metal, wood, slate, leather, glass, acrylic, and more. It engraves items people already own, and it makes metal business cards, custom metal tags, coins and tokens, and branded goods for local businesses. Prices are posted, quotes come back the same day, and finished work is hand-delivered or shipped.`,
    '',
    '## What VURMZ does',
    `- Bring your own thing: engraving on an item the customer already owns, from ${price(SIGNATURE.startingAt)} a piece`,
    `- Metal business cards in anodized aluminum and stainless steel, from ${price(cards.matteBlackBase)} a card`,
    '- Custom laser engraving on metal, wood, slate, leather, glass, and acrylic',
    '- Knife engraving for single knives and whole kitchen crews',
    '- Custom metal tags in steel and aluminum, made to order',
    '- Custom coins and tokens',
    '- Branded goods for businesses: pens, coasters, plates, panels, and signage',
    '- Personalized gifts: coasters, plaques, signs, keychains, and one-of-a-kind pieces',
    '',
    '## Who VURMZ serves',
    '- Local businesses that want their name or logo on cards, tags, tools, and gifts, with small runs welcome',
    '- People who want a personal piece engraved, either their own item or something from the item list',
    '- South Denver metro customers who want it back the same week, hand-delivered',
    '- Customers anywhere in the US ordering metal business cards and other small engraved goods by mail',
    '',
    '## Facts',
    `- Business: ${siteInfo.legalName}, ${siteInfo.fullAddress}`,
    `- Phone and text: ${siteInfo.phone} (texting a photo is the fastest way to get a price)`,
    `- Email: ${siteInfo.email}`,
    `- Website: ${u}`,
    `- Service area: ${siteInfo.serviceAreas.join(', ')}`,
    '- Materials: stainless steel, anodized aluminum, brass, wood, glass, leather, slate, acrylic, plastic',
    '- Turnaround: most work in 24 to 72 hours',
    `- Delivery: hand-delivered in the ${DELIVERY.area}, free over $${DELIVERY.freeThreshold}. Pickup by arrangement in ${siteInfo.city}. Shipping anywhere in the US by USPS.`,
    '',
    '## Prices: engraving something you already own',
    `- One piece, one placement: from ${price(SIGNATURE.startingAt)}`,
    `- Knives: ${price(CATALOG.knife.base)} a knife, ${price(CATALOG.knife.crew.perKnife)} each at ${CATALOG.knife.crew.minQty} or more, ${price(CATALOG.knife.fullKitchen.perKnife)} each at ${CATALOG.knife.fullKitchen.minQty} or more`,
    `- Tools and gear: ${price(CATALOG.tool.base)} a piece, ${price(CATALOG.tool.crew.perPiece)} each at ${CATALOG.tool.crew.minQty} or more, ${price(CATALOG.tool.jobsite.perPiece)} each at ${CATALOG.tool.jobsite.minQty} or more`,
    '- Common items: pocket knives, chef knives, tumblers, water bottles, laptops, tablets, flasks, cutting boards, hand tools, lighters',
    `- How: send a photo at ${u}/engrave/ or by text, get a price the same day, drop it off or ship it`,
    '',
    '## Prices: for businesses',
    `- Metal business cards: anodized aluminum ${price(cards.matteBlackBase)} a card (${price(cards.matteBlackBase * cards.pack)} per ${cards.pack}), stainless steel ${price(cards.stainlessBase)} a card. A logo, QR code, or back side is ${price(cards.addOns.logo)} each per card.`,
    `- Custom metal tags: small steel and aluminum tags made to order, from ${price(CATALOG.serviceTags.aluminumBase)} a tag in aluminum and ${price(CATALOG.serviceTags.stainlessBase)} in steel`,
    `- Branded pens: ${price(CATALOG.pens.perItem[0])} to ${price(CATALOG.pens.perItem[1])} a pen, packs of ${CATALOG.pens.pack}`,
    `- Coasters by the pack: ${price(CATALOG.coasters.perItem[0])} to ${price(CATALOG.coasters.perItem[1])} each, packs of ${CATALOG.coasters.pack}`,
    `- Plates, panels, faceplates, and signage: ${price(SHOP_RATE.hourly)} an hour, ${SHOP_RATE.minimumMinutes} minute minimum, material quoted`,
    '- No setup fees. Small orders are fine. Logos stay on file for reorders.',
    `- Standing accounts: NET-${BUSINESS.netTermsDays} terms, free delivery every ${siteInfo.deliveryRunDay}, volume discounts up to ${Math.round(Math.max(...BUSINESS.tiers.map(t => t.discount)) * 100)}%`,
    '',
    '## Key pages',
    `- [Homepage](${u}/)`,
    `- [Metal business cards](${u}/services/metal-business-cards/): materials, prices, and how to order`,
    `- [Engrave your own item](${u}/engrave/): photo quote form and prices for customer-owned items`,
    `- [Business pricing](${u}/services/): posted prices and standing accounts`,
    `- [Knife engraving](${u}/services/knife-engraving/): single knives and kitchen crews`,
    `- [Custom metal tags](${u}/services/metal-tags/): small steel and aluminum tags, made to order`,
    `- [Items](${u}/shop/): the short list of stocked items to engrave`,
    `- [Materials](${u}/services/materials/): what marks and how it looks on each material`,
    `- [The work](${u}/services/portfolio/): photos of finished pieces`,
    `- [Get a quote, and common questions](${u}/services/contact/)`,
    `- [Delivery and shipping](${u}/delivery/)`,
    `- [About](${u}/about/)`,
    '',
    '## Contact',
    `- Location: ${siteInfo.city}, ${siteInfo.state} (Denver metro)`,
    `- Phone and text: ${siteInfo.phone}`,
    `- Email: ${siteInfo.email}`,
    `- Website: ${u}`,
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
