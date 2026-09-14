import { CATALOG } from './pricing'


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
  pricingKey?: keyof typeof CATALOG
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
    tagline: 'The gift that stays on the desk.',
    cardDescription: 'An anniversary, a retirement, a thank-you that should outlast the card it came with. The object you choose, marked once, properly.',
    description: 'Engraved gifts and keepsakes from a one-person laser shop in Centennial, Colorado. Cutting boards, knives, coasters, jewelry, the piece you already have. A proof photo before it runs. Hand-delivered across the south Denver metro.',
    heroImage: '/portfolio/culinary-cleaver-engraved.jpg',
    galleryImages: [
      '/portfolio/culinary-cleaver-engraved.jpg',
      '/portfolio/engraved-hand-saw.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
    ],
    pricingType: 'signature',
    smsMessage: 'Hi Zach, I have a gift in mind. Here is the idea: ',
    faqs: [
      { question: 'What can be engraved?', answer: 'Metal, wood, glass, leather, slate, acrylic, most hard plastics. If it is solid, it very likely marks. Send a photo and I will tell you how it will look on that material before you decide.' },
      { question: 'Can you mark something I already own?', answer: 'Yes. That is the house offer, your own piece engraved. This page is for pieces I supply.' },
      { question: 'I know what I want but I do not have it.', answer: 'Happy to source. Name the piece and I find it, buy it, engrave it, and bring it to you. The item is billed at cost plus $45 for the errand, and a deposit holds it.' },
      { question: 'How long does it take?', answer: 'Most pieces are ready within three days. If there is a date, tell me and I will say plainly whether it works.' },
      { question: 'Will I see it before it is made?', answer: 'Always. You approve a proof photo before anything is cut. Nothing runs on a guess.' },
    ],
    relatedCategories: ['bring-your-own', 'tumblers', 'decor'],
    howItWorks: [
      'Send a photo of the piece, or describe the gift and the occasion',
      'I send a number and a proof of the layout',
      'It is engraved and brought to your door',
    ],
  },
  {
    slug: 'bring-your-own',
    name: 'Your Own Piece',
    shortName: 'Your Piece',
    tagline: 'The thing you already love, marked.',
    cardDescription: 'A knife, a watch back, a laptop, a flask, the tool your father carried. Bring it or ship it and it comes back engraved, with a proof photo before I touch it.',
    description: 'Engrave your own piece in Centennial, Colorado. Knives, laptops, watches, flasks, tools, heirlooms: what you bring, marked by one person with a laser. Proof before it runs. Hand-delivered across the south Denver metro.',
    heroImage: '/portfolio/macbook-engraving.jpg',
    galleryImages: [
      '/portfolio/pocket-knife-engraved.jpg',
      '/portfolio/macbook-engraving.jpg',
      '/portfolio/culinary-cleaver-engraved.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
      '/portfolio/plastic-marking-charger.jpg',
    ],
    pricingType: 'signature',
    smsMessage: 'Hi Zach, I have a piece I would like engraved. Here is a photo: ',
    faqs: [
      { question: 'What can you engrave?', answer: 'Knives, laptops and tablets, tumblers and flasks, tools, lighters, watch backs, instruments, the thing your grandfather left you. Metal, wood, glass, leather, slate, acrylic, plastic. Send a photo and I will say how it will mark.' },
      { question: 'What does the price cover?', answer: 'One piece, one placement, your words or one design from the library, within a palm-sized mark. That is most jobs. Larger marks, both sides, deep marking, full wraps, or a logo I have to redraw run a little more, and I confirm any extra on the proof before anything runs.' },
      { question: 'How do I get it to you?', answer: 'Drop it off anywhere in the south Denver metro, or ship it. Add your text or design here and say what is coming in the instructions.' },
      { question: 'Will engraving harm it?', answer: 'No. The mark is in the surface. It does not weaken a blade or reach a laptop\'s internals. On a knife I test on the spine first, and you approve a photo before the real thing is touched.' },
      { question: 'What about a warranty?', answer: 'Apple does not void a warranty for cosmetic engraving; other makers vary. The mark never touches the internals.' },
    ],
    relatedCategories: ['gifts', 'tumblers', 'decor'],
    howItWorks: [
      'Add your words or a design and tell me what you are bringing',
      'Pay to hold the slot; I confirm anything extra on the proof',
      'Drop it off or ship it; it comes back engraved within the week',
    ],
    materialNote: 'Metal, wood, glass, leather, slate, acrylic, plastic. If it is solid, it marks.',
  },
  {
    slug: 'tumblers',
    name: 'Tumblers & Bottles',
    shortName: 'Tumblers',
    tagline: 'The one that comes home from the office.',
    cardDescription: 'Powder-coated stainless, engraved through the coat to bright steel. Yeti, Stanley, Hydro Flask, or the one you carry. A mark that is part of the cup, not on it.',
    description: 'Engraved tumblers and water bottles in Centennial, Colorado. Powder-coated stainless marked through to bare steel, full wraps available, your own bottle or one I supply. Hand-delivered across the south Denver metro.',
    heroImage: '/portfolio/water-bottle-full-wrap.jpg',
    galleryImages: [
      '/portfolio/water-bottle-full-wrap.jpg',
      '/portfolio/water-bottle-custom-engraved.jpg',
      '/portfolio/tumbler-cherry-creek-37.jpg',
    ],
    pricingType: 'signature',
    smsMessage: 'Hi Zach, I would like a tumbler or bottle engraved. Here is the idea: ',
    faqs: [
      { question: 'Can you engrave the one I already have?', answer: 'Yes. That is your own piece, engraved. Send a photo and I will tell you how the coating will mark.' },
      { question: 'How does a powder-coated tumbler mark?', answer: 'The laser lifts the coating to the bare steel underneath, so the mark is bright metal against the color. It does not peel, fade, or wash off. It is the most asked-for look.' },
      { question: 'Do you do full wraps?', answer: 'Yes. A design around the whole cup is possible. Send the art and I will quote it.' },
      { question: 'I want a particular brand.', answer: 'Happy to source. Name it and I find it, engrave it, and bring it. The item is billed at cost plus $45 for the errand.' },
    ],
    relatedCategories: ['coasters', 'gifts'],
    howItWorks: [
      'Send a photo of the bottle, or name the one you want',
      'I send a number and a proof of the layout',
      'Engraved and brought to your door',
    ],
    materialNote: 'Your own bottle, or one I source. Full wraps available.',
  },
  {
    slug: 'coasters',
    name: 'Coasters',
    shortName: 'Coasters',
    tagline: 'The detail that gets noticed.',
    cardDescription: 'Natural slate, solid pine, brushed or gold stainless. A monogram, a family name, the coordinates of the house. Sets of four, made to match.',
    description: 'Engraved coasters in Centennial, Colorado. Natural slate, solid pine, brushed and gold stainless steel, in sets of four made to match. A proof before they run. Hand-delivered across the south Denver metro.',
    heroImage: '/portfolio/denver-map-glass-coaster.jpg',
    galleryImages: [
      '/portfolio/denver-map-glass-coaster.jpg',
      '/portfolio/denver-map-mirror-closeup.jpg',
    ],
    pricingType: 'basic',
    pricingKey: 'coasters',
    smsMessage: 'Hi Zach, I am interested in a set of engraved coasters. Here is the idea: ',
    faqs: [
      { question: 'Which materials?', answer: 'Natural slate, cork-backed, with a sheared stone edge. Solid pine, softened edges. Brushed stainless, or stainless in a mirror gold. Each set is one material.' },
      { question: 'What goes on them?', answer: 'A monogram, a family name and a year, a logo, a map of the neighborhood, the coordinates of the house. Anything you can send as an image, or a design from the library.' },
      { question: 'For a wedding or a party?', answer: 'Yes. Coasters are the favour people take home and use. Names and a date on slate is the one I make most.' },
      { question: 'For a restaurant, a bar, or an office?', answer: `Business sets start at ${CATALOG.coasters.pack} and are priced on the services side, with a proof of the first one before the run.` },
    ],
    relatedCategories: ['keychains', 'gifts'],
    howItWorks: [
      'Send the design or the idea',
      'I send a number and a proof',
      'Engraved and brought to your door',
    ],
  },
  {
    slug: 'keychains',
    name: 'Keychains',
    shortName: 'Keychains',
    tagline: 'Small, carried every day.',
    cardDescription: 'Aluminum bar keychains and AirTag holders, engraved with a name, a date, or a mark. The one on the keys they never lose.',
    description: 'Engraved keychains in Centennial, Colorado. Aluminum bar keychains and AirTag holders marked with a name, a date, or a design. Hand-delivered across the south Denver metro.',
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'keychains',
    smsMessage: 'Hi Zach, I am interested in an engraved keychain. Here is the idea: ',
    faqs: [
      { question: 'What goes on it?', answer: 'A name, initials, a date, a short line, a logo, or a design from the library. Both sides if you like.' },
      { question: 'Can I send a logo?', answer: 'Yes. SVG, PDF, or a sharp PNG. Plain text works too.' },
      { question: 'For a wedding, a team, or a company?', answer: 'Yes. Sets made to match, with a proof of the first one before the rest are cut.' },
    ],
    relatedCategories: ['coasters', 'gifts'],
    howItWorks: [
      'Send the words or the design',
      'I send a number and a proof',
      'Engraved and brought to your door',
    ],
  },
  {
    slug: 'decor',
    name: 'Art & Home Decor',
    shortName: 'Decor',
    tagline: 'One piece, made for one wall.',
    cardDescription: 'A map of Denver on a beveled mirror. A photograph burned into walnut. Your own drawing on a panel. Pieces that exist once.',
    description: 'Engraved art and home decor in Centennial, Colorado. Maps on mirror, photographs on wood, custom pieces on metal and slate, made one at a time. Hand-delivered across the south Denver metro.',
    heroImage: '/portfolio/eye-storm-hexagonal-mirror.jpg',
    galleryImages: [
      '/portfolio/eye-storm-hexagonal-mirror.jpg',
      '/portfolio/denver-map-mirror-closeup.jpg',
      '/portfolio/laser-engraved-artwork.jpg',
    ],
    pricingType: 'signature',
    smsMessage: 'Hi Zach, I am interested in a custom piece for the wall. Here is the idea: ',
    faqs: [
      { question: 'What surfaces?', answer: 'Mirror, wood, metal, slate, glass, leather, acrylic. Flat and solid is all it needs to be.' },
      { question: 'How does a mirror mark?', answer: 'From the back. The silvering is removed where the design goes, leaving clear glass in the mirror. It can be backed with any color or material, or left clear. The Denver map is made this way.' },
      { question: 'How large can a piece be?', answer: 'Most wall pieces are no trouble. For something very large, send the size and I will tell you the best way to do it.' },
      { question: 'Can you work from my own art or a photo?', answer: 'Yes. A drawing, a photograph, a sketch on a napkin. I prepare the file and you approve a proof before it runs.' },
    ],
    relatedCategories: ['gifts', 'tumblers'],
    howItWorks: [
      'Send a photo, a drawing, or describe the piece',
      'I send a number and we settle the design on a proof',
      'Made and brought to your door',
    ],
    materialNote: 'Wood panels in several sizes are kept in stock, so a piece can start the day the design is settled.',
  },
  {
    slug: 'pens',
    name: 'Pens',
    shortName: 'Pens',
    tagline: 'The pen that stays in the pocket.',
    cardDescription: 'A weighted soft-touch pen with a stylus tip, the name or the mark set into the barrel. One for a desk, or a matched set for a team.',
    description: 'Engraved pens in Centennial, Colorado. Weighted soft-touch stylus pens marked with a name or a logo, singly or in matched sets. Hand-delivered across the south Denver metro.',
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'pens',
    smsMessage: 'Hi Zach, I am interested in engraved pens. Here is the idea: ',
    faqs: [
      { question: 'Can I order one?', answer: 'Yes. One pen, engraved, is on the menu. Matched sets are on the menu too, and larger runs are priced on the services side.' },
      { question: 'What goes on the pen?', answer: 'A name, a company, a short line, or a logo. One clean line reads best on a barrel.' },
      { question: 'Which colors?', answer: 'Charcoal, grey, sage, powder blue, blush, cream, as stock allows. Say your preference in the notes.' },
      { question: 'For a company, on a schedule?', answer: 'Yes. A standing account keeps a team in pens without anyone reordering. That lives on the services side.' },
    ],
    relatedCategories: ['metal-cards', 'gifts'],
    howItWorks: [
      'Choose one or a set and add the words',
      'I set the barrels to match',
      'Brought to your door',
    ],
  },
  {
    slug: 'metal-cards',
    name: 'Metal Cards',
    shortName: 'Metal Cards',
    tagline: 'The card that is still on the desk a year later.',
    cardDescription: 'Anodized aluminum in fourteen colors, engraved to bright metal. Design it on the page, sixteen layouts, a logo, a QR code, and the laser file writes itself.',
    description: 'Engraved metal business cards in Centennial, Colorado. Anodized aluminum, fourteen colors, designed on the page with sixteen layouts, a logo, and a QR code. Hand-delivered across the south Denver metro.',
    heroImage: null,
    galleryImages: [],
    pricingType: 'basic',
    pricingKey: 'cards',
    smsMessage: 'Hi Zach, I am interested in metal cards. Here is the idea: ',
    faqs: [
      { question: 'What goes on a card?', answer: 'Name, title, contact lines, a logo, a QR code, front and back. The laser lifts the anodize to bright metal, so fine detail reads sharply.' },
      { question: 'Which layouts?', answer: 'Sixteen, on the card page: eight for business, eight for membership, gift, referral, warranty, and the rest. You type, the card shows you.' },
      { question: 'Can I order one?', answer: 'Yes. The single wallet card is exactly that. Packs of ten are for handing out.' },
      { question: 'Do the QR codes scan?', answer: 'Yes. Every code is tested before it leaves. Link it to a site, a booking page, or a contact card.' },
    ],
    relatedCategories: ['pens', 'gifts'],
    howItWorks: [
      'Design the card on the page',
      'I engrave and check every card',
      'Brought to your door',
    ],
  },
]

export function getCategoryBySlug(slug: string): ShopCategory | undefined {
  return SHOP_CATEGORIES.find(c => c.slug === slug)
}

export function getCategoriesBySlugs(slugs: string[]): ShopCategory[] {
  return slugs.map(s => SHOP_CATEGORIES.find(c => c.slug === s)).filter(Boolean) as ShopCategory[]
}
