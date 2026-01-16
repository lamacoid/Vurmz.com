// Complete product catalog for VURMZ with business use cases
export const PRODUCT_CATALOG = {
  pens: {
    id: 'pens',
    name: 'Branded Pens',
    packSize: 15,
    startingPrice: 89,
    description: 'Premium metal stylus pens with your logo permanently engraved.',
    businessUses: [
      'Client gifts and thank-you gestures',
      'Trade show giveaways',
      'Employee onboarding kits',
      'Office supplies with company branding',
      'Realtor closing gifts',
      'Conference swag bags',
    ],
    idealFor: ['offices', 'realtors', 'insurance agents', 'banks', 'law firms', 'accountants', 'consultants'],
  },
  'business-cards': {
    id: 'business-cards',
    name: 'Metal Business Cards',
    packSize: 25,
    startingPrice: 125,
    description: 'Stainless steel business cards that make a lasting impression.',
    businessUses: [
      'Executive networking',
      'High-end client meetings',
      'VIP customer appreciation',
      'Premium brand positioning',
    ],
    idealFor: ['luxury brands', 'executives', 'real estate', 'finance', 'architects', 'designers'],
  },
  coasters: {
    id: 'coasters',
    name: 'Custom Coasters',
    packSize: 15,
    startingPrice: 75,
    description: 'Laser-engraved coasters for bars, restaurants, and offices.',
    businessUses: [
      'Restaurant table branding',
      'Bar promotional items',
      'Brewery merchandise',
      'Corporate office lounges',
      'Event giveaways',
    ],
    idealFor: ['restaurants', 'bars', 'breweries', 'coffee shops', 'wineries', 'hotels', 'event venues'],
  },
  'tags-labels': {
    id: 'tags-labels',
    name: 'Tags & Labels',
    packSize: 5,
    startingPrice: 45,
    description: 'Durable industrial tags, safety labels, and asset tags.',
    businessUses: [
      'Equipment identification',
      'Safety/warning labels',
      'Asset tracking tags',
      'Valve and pipe markers',
      'Control panel labels',
    ],
    idealFor: ['manufacturers', 'warehouses', 'construction', 'utilities', 'facilities management', 'hvac'],
  },
  knives: {
    id: 'knives',
    name: 'Custom Knife Engraving',
    packSize: 1,
    startingPrice: 35,
    description: 'Personalized engraving on chef knives, pocket knives, and steak sets.',
    businessUses: [
      'Restaurant chef personalization',
      'Culinary school graduation gifts',
      'Groomsmen gifts',
      'Corporate executive gifts',
      'Anniversary/retirement recognition',
    ],
    idealFor: ['restaurants', 'catering', 'culinary schools', 'gift shops', 'corporate gifting'],
  },
  tools: {
    id: 'tools',
    name: 'Tool Marking',
    packSize: 10,
    startingPrice: 50,
    description: 'Permanent marking on wrenches, pliers, and hand tools.',
    businessUses: [
      'Tool theft prevention',
      'Job site organization',
      'Company fleet marking',
      'Equipment tracking',
    ],
    idealFor: ['contractors', 'mechanics', 'plumbers', 'electricians', 'construction companies'],
  },
  keychains: {
    id: 'keychains',
    name: 'Custom Keychains',
    packSize: 15,
    startingPrice: 60,
    description: 'Branded metal keychains for promotion and gifts.',
    businessUses: [
      'Promotional giveaways',
      'Customer appreciation gifts',
      'Event merchandise',
      'New home closing gifts',
    ],
    idealFor: ['car dealerships', 'real estate', 'hotels', 'property management', 'automotive'],
  },
  keys: {
    id: 'keys',
    name: 'Key Marking',
    packSize: 10,
    startingPrice: 30,
    description: 'Identification marking on keys for organization.',
    businessUses: [
      'Master key identification',
      'Rental property management',
      'Fleet vehicle organization',
      'Office key tracking',
    ],
    idealFor: ['property managers', 'hotels', 'automotive', 'facilities', 'schools'],
  },
  signs: {
    id: 'signs',
    name: 'Custom Signage',
    packSize: 5,
    startingPrice: 149,
    description: 'Professional signs, nameplates, and plaques.',
    businessUses: [
      'Office door nameplates',
      'Storefront signage',
      'Award plaques',
      'Directional signs',
      'Memorial plaques',
    ],
    idealFor: ['offices', 'retail stores', 'schools', 'churches', 'government', 'medical offices'],
  },
} as const

export type ProductId = keyof typeof PRODUCT_CATALOG

export interface ProductSuggestion {
  productId: ProductId
  productName: string
  reason: string
  suggestedUse: string
  startingPrice: number
}

export interface SuggestionResponse {
  catalogSuggestions: ProductSuggestion[]
  customProjectIdea: {
    title: string
    description: string
    whyItWorks: string
  }
}
