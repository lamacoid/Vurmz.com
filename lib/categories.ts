import { BASIC, SIGNATURE } from './pricing'

export interface CategoryFAQ {
  question: string
  answer: string
}

export interface ShopCategory {
  slug: string
  name: string
  shortName: string
  tagline: string
  /** Short, location-keyword-free blurb shown under the title on the /shop card. */
  cardDescription?: string
  /** Optional related service-page link surfaced on the /shop card. */
  serviceLink?: { label: string; href: string }
  description: string
  heroImage: string | null
  galleryImages: string[]
  pricingType: 'signature' | 'basic'
  pricingKey?: keyof typeof BASIC
  smsMessage: string
  faqs: CategoryFAQ[]
  relatedCategories: string[]
  howItWorks: [string, string, string]
  materialNote?: string
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: 'gifts',
    name: 'Gifts & Keepsakes',
    shortName: 'Gifts',
    tagline: 'The kind of gift people actually keep.',
    cardDescription: 'Anniversaries, retirements, the gift for the person who has everything. Engraving turns an object into a record.',
    description: `Custom laser engraved gifts in ${SIGNATURE.startingPrice > 0 ? `Centennial, CO. Starting at $${SIGNATURE.startingPrice}` : 'Centennial, CO'}. Cutting boards, plaques, trophies, and personalized keepsakes. Hand-delivered in South Denver.`,
    heroImage: '/portfolio/culinary-cleaver-engraved.jpg',
    galleryImages: [
      '/portfolio/culinary-cleaver-engraved.jpg',
      '/portfolio/engraved-hand-saw.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
    ],
    pricingType: 'signature',
    smsMessage: "Hi, I'm interested in a custom engraved gift",
    faqs: [
      { question: 'What items can you engrave?', answer: 'Wood, metal, glass, acrylic, leather, and more. If you can hold it, I can probably engrave it. Text me a photo and I\'ll tell you right away.' },
      { question: 'Can you personalize something I already have?', answer: 'Yes — bringing your own object to mark is the Bring Your Own service ($35). This category is for gifts and keepsakes I make for you.' },
      { question: 'How long does it take?', answer: 'Most custom gift orders are done within a few days. Rush orders are often possible — just let me know your timeline.' },
      { question: "What if I don't have the item yet?", answer: "I can source it for you. There's a $25 flat finder's fee plus the cost of the item. I'll find exactly what you need." },
      { question: 'How do I know what it will look like?', answer: "Tell me what you want and I'll make sure we're on the same page before I engrave. I get it right." },
    ],
    relatedCategories: ['bring-your-own', 'tumblers', 'decor'],
    howItWorks: [
      'Text me a photo of the item or describe what you want',
      "I'll quote you",
      'I engrave it and hand-deliver across South Denver',
    ],
  },
  {
    slug: 'bring-your-own',
    name: 'Bring Your Own',
    shortName: 'Your Item',
    tagline: 'Your thing. Marked for good.',
    cardDescription: 'A knife, a laptop, a tumbler, a tool, an heirloom — bring it or ship it and I engrave it. $35 flat within size, a little more for the big or complicated.',
    description: `Bring your own item engraving in Centennial, CO. Knives, laptops, tumblers, flasks, tools, heirlooms — anything you bring, marked permanently. $${SIGNATURE.startingPrice} flat within size. Hand-delivered by VURMZ.`,
    heroImage: '/portfolio/macbook-engraving.jpg',
    galleryImages: [
      '/portfolio/pocket-knife-engraved.jpg',
      '/portfolio/macbook-engraving.jpg',
      '/portfolio/culinary-cleaver-engraved.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
      '/portfolio/plastic-marking-charger.jpg',
    ],
    pricingType: 'signature',
    smsMessage: "Hi, I've got something I'd like engraved",
    faqs: [
      { question: 'What can you engrave?', answer: 'If it\'s solid and fits the bed, it marks. Knives, laptops and tablets, tumblers and flasks, tools, lighters, watches, pet tags, instruments, the thing your grandfather left you. Metal, wood, glass, leather, acrylic, slate, plastic.' },
      { question: 'What does $35 cover?', answer: 'One item, one spot, your text or one design from the library, within a palm-sized mark. That covers most jobs. Bigger marks, both sides, deep marking, full wraps, or a logo I have to rebuild add a little — I confirm any extra on the proof before anything runs.' },
      { question: 'How do I get it to you?', answer: 'Drop it off in the South Denver metro or ship it in. Add your text or design here, pay the $35 to lock it in, and tell me what\'s coming in the instructions.' },
      { question: 'Will engraving hurt it?', answer: 'No. The mark is surface-level and permanent — it won\'t weaken a blade\'s edge or a laptop\'s shell. On a knife I test on the spine first. You approve a proof photo before I touch the real thing.' },
      { question: 'Can you engrave a laptop without voiding the warranty?', answer: 'Apple doesn\'t void warranties for cosmetic engraving; other makers vary. The mark is surface-level and never touches the internals.' },
    ],
    relatedCategories: ['gifts', 'tumblers', 'decor'],
    howItWorks: [
      'Add your text or a design and tell me what you\'re bringing',
      'Pay $35 to lock it in — I confirm anything extra on the proof',
      'Drop off or ship it; engraved and back fast',
    ],
    materialNote: 'Metal, wood, glass, leather, acrylic, slate, plastic. If it\'s solid and fits the bed, it marks. Bed handles pieces up to 24" x 16".',
  },
  {
    slug: 'tumblers',
    name: 'Tumblers & Bottles',
    shortName: 'Tumblers',
    tagline: 'Your name on the cup nobody borrows.',
    cardDescription: 'Powder-coated tumblers, water bottles, flasks. The coating burns away clean and the mark never washes off, peels, or fades.',
    description: `Custom engraved tumblers and water bottles in Centennial, CO. Starting at $${SIGNATURE.startingPrice}. Stainless steel, powder-coated, full-wrap available. Hand-delivered by VURMZ.`,
    heroImage: '/portfolio/water-bottle-full-wrap.jpg',
    galleryImages: [
      '/portfolio/water-bottle-full-wrap.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
      '/portfolio/tumbler-cherry-creek-37.jpg',
    ],
    pricingType: 'signature',
    smsMessage: "Hi, I'd like a tumbler or bottle engraved",
    faqs: [
      { question: 'Can you engrave a tumbler I already have?', answer: 'Yes — that\'s the Bring Your Own service ($35). This category is for tumblers I source and engrave for you, start to finish.' },
      { question: 'What about powder-coated tumblers?', answer: 'Laser engraving on powder-coated tumblers reveals the bare steel underneath for a clean, two-tone look. It\'s the most popular style.' },
      { question: 'Do you do full-wrap engraving?', answer: 'Yes. Full-wrap designs that cover the entire surface are available. Text me your design and I\'ll quote it.' },
      { question: "What if I don't have a tumbler?", answer: "I can source one for you. $25 finder's fee plus the cost of the tumbler. I'll find exactly what you need." },
    ],
    relatedCategories: ['coasters', 'gifts'],
    howItWorks: [
      'Text me a photo of your tumbler or tell me what you need',
      "I'll quote you",
      'I engrave it and hand-deliver across South Denver',
    ],
    materialNote: 'I source the tumbler and engrave it. Full-wrap available. Already have one? See Bring Your Own.',
  },
  {
    slug: 'coasters',
    name: 'Coasters',
    shortName: 'Coasters',
    tagline: 'The detail that gets noticed.',
    description: `Laser engraved coasters in Centennial, CO. Wood, slate, or steel. Starting at $${BASIC.coasters.materials.wood}/ea in packs of ${BASIC.coasters.packSize}. Wedding favors, gifts, home decor. Hand-delivered by VURMZ.`,
    heroImage: '/portfolio/denver-map-glass-coaster.jpg',
    galleryImages: [
      '/portfolio/denver-map-glass-coaster.jpg',
      '/portfolio/denver-map-mirror-closeup.jpg',
    ],
    pricingType: 'basic',
    pricingKey: 'coasters',
    smsMessage: "Hi, I'm interested in engraved coasters",
    faqs: [
      { question: 'What materials are available?', answer: `Pine/bamboo ($${BASIC.coasters.materials.wood}/ea), oak/acacia ($${BASIC.coasters.materials.hardwood}/ea), natural slate ($${BASIC.coasters.materials.slate}/ea), or stainless steel ($${BASIC.coasters.materials.steel}/ea). All in packs of ${BASIC.coasters.packSize}.` },
      { question: 'Are these good for wedding favors?', answer: 'Yes. Coasters are one of the most popular wedding favors I make. Names, date, a short message. They\'re functional keepsakes people actually use.' },
      { question: 'Can I order mixed materials?', answer: 'Each pack is one material. If you want different materials, that\'s separate packs. Text me what you\'re thinking and I\'ll work it out.' },
      { question: 'Can I do a custom design?', answer: 'Yes. Logos, maps, artwork, monograms — anything you can send me as an image, I can engrave.' },
    ],
    relatedCategories: ['keychains', 'gifts'],
    howItWorks: [
      'Text me your design or idea',
      `I'll quote you (packs of ${BASIC.coasters.packSize}, from $${BASIC.coasters.materials.wood}/ea)`,
      'I engrave and hand-deliver across South Denver',
    ],
  },
  {
    slug: 'keychains',
    name: 'Keychains',
    shortName: 'Keychains',
    tagline: 'Small, useful, giftable.',
    description: `Laser engraved keychains in Centennial, CO. Metal, wood, or acrylic. Starting at $${BASIC.keychains.materials.acrylic}/ea in packs of ${BASIC.keychains.packSize}. Hand-delivered by VURMZ.`,
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'keychains',
    smsMessage: "Hi, I'm interested in engraved keychains",
    faqs: [
      { question: 'What materials are available?', answer: `Acrylic ($${BASIC.keychains.materials.acrylic}/ea), wood ($${BASIC.keychains.materials.wood}/ea), or metal ($${BASIC.keychains.materials.metal}/ea). All in packs of ${BASIC.keychains.packSize}.` },
      { question: 'Can I engrave on both sides?', answer: `Yes. Same design on back is +$${BASIC.keychains.addOns.sameOnBack}/ea. Different design on back is +$${BASIC.keychains.addOns.differentOnBack}/ea.` },
      { question: 'Can I add a logo?', answer: 'Yes. Send me your logo as a PNG, SVG, or AI file and I\'ll engrave it. Simple text works too.' },
      { question: 'Are these good for events?', answer: 'Yes. Keychains are great for wedding favors, party gifts, corporate giveaways, and promotional items.' },
    ],
    relatedCategories: ['coasters', 'gifts'],
    howItWorks: [
      'Text me your design or idea',
      `I'll quote you (packs of ${BASIC.keychains.packSize}, from $${BASIC.keychains.materials.acrylic}/ea)`,
      'I engrave and hand-deliver across South Denver',
    ],
  },
  {
    slug: 'decor',
    name: 'Art & Home Decor',
    shortName: 'Decor',
    tagline: 'One-of-a-kind pieces for your walls.',
    cardDescription: 'Maps on mirrors, photos on slate, custom pieces on wood and metal. If you can send me an image, I can probably make it permanent.',
    description: `Custom laser engraved art and home decor in Centennial, CO. Starting at $${SIGNATURE.startingPrice}. Mirrors, metal artwork, custom pieces. Hand-delivered by VURMZ.`,
    heroImage: '/portfolio/eye-storm-hexagonal-mirror.jpg',
    galleryImages: [
      '/portfolio/eye-storm-hexagonal-mirror.jpg',
      '/portfolio/denver-map-mirror-closeup.jpg',
      '/portfolio/laser-engraved-artwork.jpg',
    ],
    pricingType: 'signature',
    smsMessage: "Hi, I'm interested in custom engraved art or decor",
    faqs: [
      { question: 'What surfaces can you engrave?', answer: 'Metal, wood, glass, mirror, acrylic, leather, slate. If it\'s flat and solid, I can probably engrave it.' },
      { question: 'Can you engrave on mirrors?', answer: 'Yes. Mirror engraving creates a frosted look where the laser hits. It\'s striking and popular for custom pieces.' },
      { question: 'How large can the piece be?', answer: 'My laser bed handles pieces up to 24" x 16". For larger pieces, text me and we\'ll figure out the best approach.' },
      { question: 'Got a piece you want engraved?', answer: 'If you\'re bringing your own surface to mark, that\'s the Bring Your Own service ($35). This category is for custom art and decor I make for you.' },
      { question: 'Do you do custom artwork?', answer: 'Yes. Send me your design, photo, or even a rough sketch and I\'ll create the engraving file.' },
    ],
    relatedCategories: ['gifts', 'tumblers'],
    howItWorks: [
      'Text me a photo or describe the piece you want',
      "I'll quote you and we'll confirm the design",
      'I engrave it and hand-deliver across South Denver',
    ],
    materialNote: 'I keep wood panels in a variety of sizes in stock. Bring an idea, leave with art — no waiting on materials.',
  },
  {
    slug: 'pens',
    name: 'Branded Pens',
    shortName: 'Pens',
    tagline: 'The giveaway people actually keep.',
    cardDescription: 'Soft-touch metal stylus pens with your name or logo etched clean. Buy one or a pack of 15.',
    description: `Laser engraved pens in Centennial, CO. Soft-touch metal stylus pens from $${BASIC.pens.basePerItem}/pen in packs of ${BASIC.pens.packSize}, singles available. Hand-delivered by VURMZ.`,
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'pens',
    smsMessage: "Hi, I'm interested in engraved pens",
    faqs: [
      { question: 'How many pens do I have to order?', answer: `One. The single pen is for testing the waters or gifting. Packs of ${BASIC.pens.packSize} get you the $${BASIC.pens.basePerItem}/pen rate.` },
      { question: 'What goes on the pen?', answer: 'A name, a business name, a phone number, a short line of text, or a logo. One line engraves clean. Logos and both-sides marking are add-ons.' },
      { question: 'What colors are there?', answer: 'I stock a rotating range of barrel colors. Tell me your preference in the order notes and I will match it as close as stock allows.' },
      { question: 'Do you do recurring orders?', answer: 'Yes. If you burn through pens, I can keep your stock fresh on a schedule. You do not have to think about reordering.' },
    ],
    relatedCategories: ['metal-cards', 'gifts'],
    howItWorks: [
      'Pick single or pack and add your text in the engraving box',
      'I engrave the barrels to match',
      'Hand-delivered across South Denver',
    ],
  },
  {
    slug: 'metal-cards',
    name: 'Metal Business Cards',
    shortName: 'Metal Cards',
    tagline: 'The card they keep on the desk.',
    cardDescription: 'Anodized aluminum and stainless steel, engraved with your name, logo, or QR code. Cards that do not bend, fade, or get thrown out.',
    description: `Metal business cards in Centennial, CO. Anodized aluminum from $${BASIC.cards.matteBlackBase}/card in packs of ${BASIC.cards.packSize}, stainless steel from $${BASIC.cards.stainlessBase}. Singles available. Hand-delivered by VURMZ.`,
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'cards',
    smsMessage: "Hi, I'm interested in metal business cards",
    faqs: [
      { question: 'What can you put on a card?', answer: 'Name, title, phone, email, logo, QR code. Front and back. The laser strips the anodize to a bright mark, so fine detail reads sharp.' },
      { question: 'Aluminum or stainless?', answer: `Anodized aluminum is light, comes in colors, and starts at $${BASIC.cards.matteBlackBase}/card. Stainless is heavier and reads premium at $${BASIC.cards.stainlessBase}/card. Both outlive paper by decades.` },
      { question: 'Can I order just one?', answer: 'Yes. The single wallet card in the shop is exactly that. Packs of 10 are for handing out.' },
      { question: 'Do QR codes actually scan?', answer: 'Yes. I test every QR before it leaves. Link it to your site, your booking page, or your contact card.' },
    ],
    relatedCategories: ['pens', 'gifts'],
    howItWorks: [
      'Send me your info or logo, or add text in the engraving box',
      'I engrave and QA every card',
      'Hand-delivered across South Denver',
    ],
  },
]

export function getCategoryBySlug(slug: string): ShopCategory | undefined {
  return SHOP_CATEGORIES.find(c => c.slug === slug)
}

export function getCategoriesBySlugs(slugs: string[]): ShopCategory[] {
  return slugs.map(s => SHOP_CATEGORIES.find(c => c.slug === s)).filter(Boolean) as ShopCategory[]
}
