// Finished work — portfolio page, detail pages, and hero rotation.
//
// Each entry has:
//   slug         — URL slug; powers /services/portfolio/[slug]
//   src          — hero image
//   label        — short title
//   context      — one-line summary (used on grid cards + meta description)
//   material     — what was engraved on
//   process      — machine + technique, shown in the caption (e.g. "fiber laser")
//   customerType — Business / Personal / Trade / Restaurant / Maker / Custom
//   leadTimeDays — turnaround in days
//   tags         — material + customer-type tags for filtering
//   story        — 1-2 paragraphs shown on detail page (Zach voice)

export interface PortfolioItem {
  slug: string
  src: string
  label: string
  context: string
  material: string
  process: string
  customerType: 'Business' | 'Personal' | 'Trade' | 'Restaurant' | 'Maker' | 'Custom'
  leadTimeDays: number
  tags: string[]
  story: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: 'denver-map-mirror',
    src: '/portfolio/denver-map-mirror-closeup.jpg',
    label: 'Denver Metro Map on Mirror',
    context: 'Engraved from a vintage map file onto beveled mirror glass',
    material: 'Beveled mirror glass',
    process: 'fiber ablation',
    customerType: 'Personal',
    leadTimeDays: 3,
    tags: ['glass', 'art', 'personal'],
    story: 'A vintage Denver street map laser-engraved onto a beveled mirror. The reflective surface makes the map feel like it floats. Mirror engraving needs careful power tuning — too hot and the silvering lifts; too cold and the lines disappear. This one took two test passes to dial in. Hand-delivered locally.',
  },
  {
    slug: 'clga-amp-faceplate',
    src: '/portfolio/clga-faceplate-closeup.jpg',
    label: 'Amp Faceplate for County Line Guitar Amps',
    context: 'Custom branded faceplate for a Denver-area amp builder',
    material: 'Brushed metal',
    process: 'fiber laser',
    customerType: 'Business',
    leadTimeDays: 4,
    tags: ['metal', 'business', 'branded-product'],
    story: 'County Line Guitar Amps builds tube amps in Denver. They needed branded faceplates for a small production run with sharp, durable logo marking. Brushed metal takes engraving cleanly and ages well — the marks won\'t fade or peel. Recurring order; we run a fresh batch when their builds catch up.',
  },
  {
    slug: 'medieval-water-bottle',
    src: '/portfolio/water-bottle-full-wrap.jpg',
    label: 'Full-Wrap Medieval Water Bottle',
    context: 'Detailed medieval scene wrapped 360° on stainless steel',
    material: 'Stainless steel (powder-coated)',
    process: 'fiber laser',
    customerType: 'Personal',
    leadTimeDays: 2,
    tags: ['metal', 'personal', 'detailed'],
    story: 'A 360° wrap of a medieval battle scene on a stainless steel water bottle. Full-wraps require a rotary attachment that spins the bottle in sync with the laser. The detail in the figures was the test — fine line work on curved metal is unforgiving. Came out crisp.',
  },
  {
    slug: 'macbook-personalization',
    src: '/portfolio/macbook-engraving.jpg',
    label: 'MacBook Lid Engraving',
    context: 'Direct engraving on premium aluminum',
    material: 'Anodized aluminum (MacBook lid)',
    process: 'fiber laser',
    customerType: 'Personal',
    leadTimeDays: 1,
    tags: ['metal', 'tech', 'personal'],
    story: 'Personalize a MacBook directly on the lid — name, monogram, quote, whatever. Anodized aluminum etches to a clean white-on-grey contrast that doesn\'t fade. We mask off everything else and run shallow so the laptop\'s structural integrity is untouched. Same-day if you can drop it off.',
  },
  {
    slug: 'culinary-cleaver',
    src: '/portfolio/culinary-cleaver-engraved.jpg',
    label: 'Engraved Culinary Cleaver',
    context: 'Kitchen knife personalized as a gift',
    material: 'Stainless steel cleaver',
    process: 'fiber laser',
    customerType: 'Restaurant',
    leadTimeDays: 2,
    tags: ['metal', 'kitchen', 'gift'],
    story: 'A cleaver engraved with the chef\'s name. Knife steel varies — some take engraving easily, some need deep marking to show through finishes. I always test on the spine before touching the bevel. If you run a kitchen, I can do crew pickups: drop a stack of knives, get them back the next day.',
  },
  {
    slug: 'eye-storm-mirror',
    src: '/portfolio/eye-storm-hexagonal-mirror.jpg',
    label: 'Custom Art on Hexagonal Mirror',
    context: 'Original design engraved onto hexagonal beveled mirror',
    material: 'Beveled hexagonal mirror',
    process: 'fiber ablation',
    customerType: 'Personal',
    leadTimeDays: 4,
    tags: ['glass', 'art', 'personal', 'detailed'],
    story: 'Custom art engraved into a hexagonal mirror. The piece was supplied; we mapped the design to the surface and ran a low-power pass to translate fine line work without breaking through the silver. Mirrored work has a 3D feel because the engraving catches light differently than a print would.',
  },
  {
    slug: 'pocket-knife',
    src: '/portfolio/pocket-knife-engraved.jpg',
    label: 'Engraved Pocket Knife',
    context: 'Geometric pattern on a folding blade',
    material: 'Stainless steel folding blade',
    process: 'fiber laser',
    customerType: 'Personal',
    leadTimeDays: 1,
    tags: ['metal', 'personal', 'gift'],
    story: 'Geometric pattern wrapped around the bolster of a folding pocket knife. Knives like this come in often — graduation gifts, Father\'s Day, retirements. Single-piece flat-rate. Bring your blade or pick from the shop.',
  },
  {
    slug: 'ipad-personalization',
    src: '/portfolio/columbine-macbook-engraving.jpg',
    label: 'MacBook Engraving',
    context: 'Personalization on the back panel',
    material: 'Anodized aluminum (iPad back)',
    process: 'fiber laser',
    customerType: 'Personal',
    leadTimeDays: 1,
    tags: ['metal', 'tech', 'personal'],
    story: 'iPad back panel engraving — same process as a MacBook lid, smaller surface. Apple won\'t do this; we will. Stays clean through years of use. Most iPads we run are personal gifts.',
  },
  {
    slug: 'branded-tumbler',
    src: '/portfolio/tumbler-cherry-creek-37.jpg',
    label: 'Branded Tumbler for Local Business',
    context: 'Logo engraving on a powder-coated stainless tumbler',
    material: 'Powder-coated stainless steel',
    process: 'fiber laser',
    customerType: 'Business',
    leadTimeDays: 2,
    tags: ['metal', 'business', 'branded-product'],
    story: 'Branded tumbler for a Cherry Creek business. Powder-coated stainless engraves to a bright color contrast where the laser removes the coating to expose the metal underneath. Holds up to dishwashers, doesn\'t peel. We do these in packs for businesses kitting client gifts or employee swag.',
  },
  {
    slug: 'custom-water-bottle',
    src: '/portfolio/water-bottle-custom-engraved.jpg',
    label: 'Custom Water Bottle',
    context: 'Logo engraving on powder-coated steel',
    material: 'Powder-coated steel',
    process: 'fiber laser',
    customerType: 'Business',
    leadTimeDays: 2,
    tags: ['metal', 'business', 'branded-product'],
    story: 'Same powder-coated approach as the tumblers, taller form factor. Bottles hold up well to engraving since the curve is gentle and the coating is consistent. Clean color reveal under the mark.',
  },
  {
    slug: 'plastic-charger-marking',
    src: '/portfolio/plastic-marking-charger.jpg',
    label: 'Owner-Marked Charger Brick',
    context: 'Asset marking on an Apple charger',
    material: 'Polycarbonate (Apple charger)',
    process: 'fiber marking',
    customerType: 'Personal',
    leadTimeDays: 1,
    tags: ['plastic', 'asset-marking', 'personal'],
    story: 'Marked an Apple charger so the owner stops losing it to housemates. Plastic marking is a different beast — the laser doesn\'t cut, it bleaches the surface. Works clean on white plastics like this one. Tiny, simple, satisfies a real problem.',
  },
  {
    slug: 'aluminum-artwork',
    src: '/portfolio/laser-engraved-artwork.jpg',
    label: 'Fine-Detail Aluminum Artwork',
    context: 'Anodized aluminum panel with fine line work',
    material: 'Anodized aluminum',
    process: 'fiber laser',
    customerType: 'Maker',
    leadTimeDays: 3,
    tags: ['metal', 'art', 'detailed'],
    story: 'A piece showcasing what anodized aluminum can do at high resolution. The laser strips the anodization to a contrasting white, so fine line work and shading translate directly. This was a personal piece to test the upper limit of detail; the file is preserved for clients who want similar.',
  },
]

// Map for fast lookup by slug
export const portfolioBySlug: Record<string, PortfolioItem> = Object.fromEntries(
  portfolioItems.map((p) => [p.slug, p]),
)
