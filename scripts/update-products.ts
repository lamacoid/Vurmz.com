// Run with: npx wrangler d1 execute vurmz-quotes --remote --file=scripts/update-products.sql

const newProducts = [
  {
    id: "equipment-nameplates",
    name: "Equipment Nameplates & Data Plates",
    description: "Laser engraved anodized aluminum and stainless steel nameplates. Rating plates, serial number plates, specification plates for industrial equipment.",
    price: "Quote per job",
    enabled: true,
    hasDesigner: false,
    isIndustrial: true,
    isPrimary: true,
    order: 0
  },
  {
    id: "abs-panel-labels",
    name: "ABS Control Panel Labels",
    description: "Two-layer engraved ABS plastic for control panels, breaker boxes, and electrical enclosures. UV-resistant permanent marking.",
    price: "Quote per job",
    enabled: true,
    hasDesigner: false,
    isIndustrial: true,
    isPrimary: true,
    order: 1
  },
  {
    id: "asset-tags",
    name: "Asset Identification Tags",
    description: "Serialized asset tags for equipment tracking. Anodized aluminum or stainless steel with barcodes, QR codes, or sequential numbering.",
    price: "Quote per job",
    enabled: true,
    hasDesigner: false,
    isIndustrial: true,
    isPrimary: true,
    order: 2
  },
  {
    id: "valve-tags",
    name: "Valve Tags & Pipe Markers",
    description: "Durable valve identification tags, cable labels, and wire markers. Built for facilities management and maintenance departments.",
    price: "Quote per job",
    enabled: true,
    hasDesigner: false,
    isIndustrial: true,
    isPrimary: true,
    order: 3
  },
  {
    id: "safety-signage",
    name: "Safety & Compliance Signage",
    description: "Safety labels, warning placards, OSHA compliant labels, arc flash labels. Permanent laser engraved marking.",
    price: "Quote per job",
    enabled: true,
    hasDesigner: false,
    isIndustrial: true,
    isPrimary: true,
    order: 4
  },
  {
    id: "metal-business-cards",
    name: "Anodized Aluminum Business Cards",
    description: "Laser engraved metal business cards for contractors and facility managers. Built-in designer.",
    price: "Built-in designer",
    enabled: true,
    hasDesigner: true,
    isIndustrial: false,
    isPrimary: false,
    order: 5
  },
  {
    id: "awards",
    name: "Awards & Recognition",
    description: "Acrylic, crystal, glass, and wood awards. Plaques, recognition pieces, engraved nameplates.",
    price: "Quote based",
    enabled: true,
    hasDesigner: false,
    isIndustrial: false,
    isPrimary: false,
    order: 6
  },
  {
    id: "tool-marking",
    name: "Tool & Equipment Marking",
    description: "Permanent marking for power tools, hand tools, and equipment. Asset identification and theft deterrent.",
    price: "Quote based",
    enabled: true,
    hasDesigner: false,
    isIndustrial: false,
    isPrimary: false,
    order: 7
  },
  {
    id: "promotional",
    name: "Promotional Items",
    description: "Laser engraved pens, coasters, keychains. Available in packs of 15 for small business.",
    price: "From $45/pack of 15",
    enabled: true,
    hasDesigner: false,
    isIndustrial: false,
    isPrimary: false,
    order: 8
  }
];

console.log(JSON.stringify(newProducts));
