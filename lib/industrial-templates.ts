// Industrial Labeling Templates with Compliance Standards
// References: OSHA 29 CFR 1910.145, NFPA 70E, ANSI Z535, ASME A13.1, NEC 408.4

// =============================================================================
// COMPLIANCE STANDARDS REFERENCE
// =============================================================================

export const complianceStandards = {
  OSHA_1910_145: {
    name: 'OSHA 29 CFR 1910.145',
    description: 'Specifications for Accident Prevention Signs and Tags',
    requirements: {
      signalWords: ['DANGER', 'CAUTION', 'WARNING', 'NOTICE', 'SAFETY FIRST'],
      readability: 'Readable at minimum 5 feet',
      colors: {
        DANGER: { background: '#C8102E', text: '#FFFFFF' },
        WARNING: { background: '#FF8200', text: '#000000' },
        CAUTION: { background: '#FFD100', text: '#000000' },
        NOTICE: { background: '#0072CE', text: '#FFFFFF' },
        SAFETY: { background: '#007A33', text: '#FFFFFF' },
      }
    }
  },
  NFPA_70E: {
    name: 'NFPA 70E Article 130.5(H)',
    description: 'Arc Flash Labeling Requirements',
    requirements: {
      requiredFields: [
        'Nominal System Voltage',
        'Arc Flash Boundary',
        'Available Incident Energy OR Arc Flash PPE Category',
        'Working Distance',
        'Date of Analysis'
      ],
      optionalFields: [
        'Shock Hazard Information',
        'Limited Approach Boundary',
        'Restricted Approach Boundary'
      ]
    }
  },
  ANSI_Z535: {
    name: 'ANSI Z535.4',
    description: 'Product Safety Signs and Labels',
    requirements: {
      signalWordPanel: 'Required for hazard severity',
      symbolPanel: 'Safety symbol recommended',
      messagePanel: 'Hazard description and avoidance',
      colors: {
        DANGER: { header: '#C8102E', symbol: '#C8102E' },
        WARNING: { header: '#FF8200', symbol: '#000000' },
        CAUTION: { header: '#FFD100', symbol: '#000000' },
      }
    }
  },
  ASME_A13_1: {
    name: 'ASME A13.1',
    description: 'Pipe Marking Color Codes',
    requirements: {
      colors: {
        flammable: { background: '#FFD100', text: '#000000', label: 'Flammable (Yellow/Black)' },
        oxidizer: { background: '#FFD100', text: '#000000', label: 'Oxidizer (Yellow/Black)' },
        toxic: { background: '#FF8200', text: '#000000', label: 'Toxic/Corrosive (Orange/Black)' },
        fireQuench: { background: '#C8102E', text: '#FFFFFF', label: 'Fire Quenching (Red/White)' },
        water: { background: '#007A33', text: '#FFFFFF', label: 'Water (Green/White)' },
        compressedAir: { background: '#0072CE', text: '#FFFFFF', label: 'Compressed Air (Blue/White)' },
        userDefined: { background: '#7F7F7F', text: '#FFFFFF', label: 'User Defined (Gray/White)' },
      },
      arrowDirection: 'Required to indicate flow direction'
    }
  },
  NEC_408_4: {
    name: 'NEC 408.4(A)',
    description: 'Circuit Directory Requirements',
    requirements: {
      legibility: 'Legible and permanent',
      description: 'Must describe load served',
      location: 'Located on door or inside panel',
      durability: 'Must not be handwritten (per AHJ interpretation)'
    }
  }
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type TemplateCategory =
  | 'control-panel'
  | 'equipment-nameplate'
  | 'asset-tag'
  | 'valve-tag'
  | 'safety-signage'
  | 'wire-marker'

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'multiline'

export interface TemplateField {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  required: boolean
  maxLength?: number
  options?: { value: string; label: string }[]
  defaultValue?: string
  validation?: RegExp
  helpText?: string
}

export interface TemplateSize {
  id: string
  label: string
  width: number  // in inches
  height: number // in inches
  recommended?: boolean
}

export interface TemplateMaterial {
  id: string
  label: string
  description: string
  durability: string
  recommended?: boolean
  hidden?: boolean
}

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  subcategory?: string
  description: string
  compliance: string[]
  fields: TemplateField[]
  sizes: TemplateSize[]
  materials: TemplateMaterial[]
  layout: 'horizontal' | 'vertical' | 'square'
  previewStyle: {
    backgroundColor: string
    textColor: string
    borderColor?: string
    headerColor?: string
    headerTextColor?: string
  }
  icons?: {
    id: string
    label: string
    svg: string
  }[]
}

// =============================================================================
// MATERIALS CATALOG
// =============================================================================

export const materials: Record<string, TemplateMaterial> = {
  anodizedAluminumThin: {
    id: 'anodized-aluminum-thin',
    label: 'Anodized Aluminum (Standard)',
    description: 'Thin anodized aluminum with adhesive backing. Sits nearly flush. Available in multiple colors.',
    durability: 'Indoor/Outdoor - 20+ years',
    recommended: true,
  },
  anodizedAluminumThick: {
    id: 'anodized-aluminum-thick',
    label: 'Anodized Aluminum (Premium)',
    description: 'Heavy-duty 4x thickness anodized aluminum. Premium look and feel, lightweight.',
    durability: 'Indoor/Outdoor - 25+ years',
  },
  stainlessSteel: {
    id: 'stainless-steel',
    label: 'Stainless Steel',
    description: '304 stainless steel with laser marking. Chemical and corrosion resistant.',
    durability: 'Harsh environments - 25+ years',
  },
  absPlastic: {
    id: 'abs-plastic',
    label: 'ABS Plastic (Two-Layer)',
    description: 'Two-layer engraved ABS. Top layer removed to reveal contrasting color.',
    durability: 'Indoor - 15+ years',
    recommended: true,
  },
  rigidVinyl: {
    id: 'rigid-vinyl',
    label: 'Rigid Vinyl',
    description: 'UV-resistant rigid vinyl with adhesive backing.',
    durability: 'Indoor/Covered outdoor - 10+ years',
    hidden: true, // Not currently offered
  },
  brass: {
    id: 'brass',
    label: 'Brass',
    description: 'Solid brass with laser engraving. Traditional appearance.',
    durability: 'Indoor - 30+ years',
  },
}

// Standard credit card size: 3.375" x 2.125" (85.6mm x 53.98mm)
export const CREDIT_CARD_SIZE = { width: 3.375, height: 2.125, label: 'Credit Card Size (3.375" x 2.125")' }

// =============================================================================
// CONTROL PANEL LABEL TEMPLATES
// =============================================================================

export const controlPanelTemplates: Template[] = [
  {
    id: 'breaker-schedule',
    name: 'Breaker Schedule Label',
    category: 'control-panel',
    subcategory: 'Electrical Panels',
    description: 'Circuit directory for electrical panels. NEC 408.4(A) compliant with permanent, legible circuit descriptions.',
    compliance: ['NEC_408_4'],
    layout: 'vertical',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#000000',
    },
    fields: [
      { id: 'panelName', label: 'Panel Designation', type: 'text', placeholder: 'e.g., Panel A', required: true, maxLength: 20 },
      { id: 'voltage', label: 'Voltage', type: 'select', required: true, options: [
        { value: '120/240V', label: '120/240V Single Phase' },
        { value: '120/208V', label: '120/208V Three Phase' },
        { value: '277/480V', label: '277/480V Three Phase' },
      ]},
      { id: 'circuits', label: 'Circuit Count', type: 'select', required: true, options: [
        { value: '20', label: '20 Circuits' },
        { value: '30', label: '30 Circuits' },
        { value: '42', label: '42 Circuits' },
      ]},
      { id: 'location', label: 'Panel Location', type: 'text', placeholder: 'e.g., Electrical Room 101', required: false, maxLength: 30 },
    ],
    sizes: [
      { id: 'standard', label: '4" x 6"', width: 4, height: 6, recommended: true },
      { id: 'large', label: '5" x 8"', width: 5, height: 8 },
    ],
    materials: [materials.absPlastic, materials.anodizedAluminum],
  },
  {
    id: 'disconnect-switch',
    name: 'Disconnect Switch Label',
    category: 'control-panel',
    subcategory: 'Disconnects',
    description: 'Equipment disconnect identification. Includes voltage, amperage, and equipment served.',
    compliance: ['NEC_408_4', 'OSHA_1910_145'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFD100',
      textColor: '#000000',
      headerColor: '#C8102E',
      headerTextColor: '#FFFFFF',
    },
    fields: [
      { id: 'equipmentName', label: 'Equipment Served', type: 'text', placeholder: 'e.g., RTU-1', required: true, maxLength: 30 },
      { id: 'voltage', label: 'Voltage', type: 'text', placeholder: 'e.g., 480V 3PH', required: true, maxLength: 15 },
      { id: 'amperage', label: 'Amperage', type: 'text', placeholder: 'e.g., 60A', required: true, maxLength: 10 },
      { id: 'circuitId', label: 'Circuit/Breaker', type: 'text', placeholder: 'e.g., Panel A, Breaker 15', required: false, maxLength: 25 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125, recommended: true },
      { id: 'small', label: '2" x 4"', width: 2, height: 4 },
      { id: 'medium', label: '3" x 5"', width: 3, height: 5 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.absPlastic, materials.stainlessSteel],
  },
  {
    id: 'motor-starter',
    name: 'Motor Starter Label',
    category: 'control-panel',
    subcategory: 'Motor Controls',
    description: 'Motor starter/VFD identification with electrical specifications and equipment served.',
    compliance: ['NEC_408_4'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#0072CE',
    },
    fields: [
      { id: 'motorName', label: 'Motor/Equipment', type: 'text', placeholder: 'e.g., Supply Fan SF-1', required: true, maxLength: 30 },
      { id: 'hp', label: 'Horsepower', type: 'text', placeholder: 'e.g., 10 HP', required: true, maxLength: 10 },
      { id: 'voltage', label: 'Voltage', type: 'text', placeholder: 'e.g., 480V 3PH', required: true, maxLength: 15 },
      { id: 'fla', label: 'FLA', type: 'text', placeholder: 'e.g., 14A', required: true, maxLength: 10 },
      { id: 'starterType', label: 'Starter Type', type: 'select', required: false, options: [
        { value: 'DOL', label: 'Direct On-Line (DOL)' },
        { value: 'VFD', label: 'Variable Frequency Drive' },
        { value: 'Soft', label: 'Soft Starter' },
        { value: 'Star-Delta', label: 'Star-Delta' },
      ]},
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125, recommended: true },
      { id: 'standard', label: '2" x 4"', width: 2, height: 4 },
      { id: 'large', label: '3" x 5"', width: 3, height: 5 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.absPlastic],
  },
  {
    id: 'control-panel-id',
    name: 'Control Panel ID Label',
    category: 'control-panel',
    subcategory: 'Panel Identification',
    description: 'Main identification label for control panels, MCC buckets, and junction boxes.',
    compliance: ['NEC_408_4'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#0072CE',
      textColor: '#FFFFFF',
    },
    fields: [
      { id: 'panelName', label: 'Panel Name', type: 'text', placeholder: 'e.g., MCC-1A', required: true, maxLength: 20 },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Chiller Plant Controls', required: false, maxLength: 40 },
      { id: 'voltage', label: 'Voltage', type: 'text', placeholder: 'e.g., 480V', required: true, maxLength: 10 },
      { id: 'fedFrom', label: 'Fed From', type: 'text', placeholder: 'e.g., MDP Breaker 5', required: false, maxLength: 30 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125 },
      { id: 'small', label: '2" x 6"', width: 2, height: 6, recommended: true },
      { id: 'medium', label: '3" x 8"', width: 3, height: 8 },
      { id: 'large', label: '4" x 10"', width: 4, height: 10 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.absPlastic, materials.stainlessSteel],
  },
]

// =============================================================================
// EQUIPMENT NAMEPLATE TEMPLATES
// =============================================================================

export const equipmentNameplateTemplates: Template[] = [
  {
    id: 'equipment-rating-plate',
    name: 'Equipment Rating Plate',
    category: 'equipment-nameplate',
    subcategory: 'Rating Plates',
    description: 'Standard equipment rating plate with manufacturer info, model, serial, and electrical specifications.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#C0C0C0',
      textColor: '#000000',
      borderColor: '#000000',
    },
    fields: [
      { id: 'manufacturer', label: 'Manufacturer', type: 'text', placeholder: 'Company Name', required: true, maxLength: 30 },
      { id: 'model', label: 'Model Number', type: 'text', placeholder: 'e.g., XYZ-1000', required: true, maxLength: 25 },
      { id: 'serial', label: 'Serial Number', type: 'text', placeholder: 'e.g., SN-12345', required: true, maxLength: 25 },
      { id: 'voltage', label: 'Voltage', type: 'text', placeholder: 'e.g., 120V', required: false, maxLength: 15 },
      { id: 'amperage', label: 'Amperage', type: 'text', placeholder: 'e.g., 15A', required: false, maxLength: 10 },
      { id: 'phase', label: 'Phase', type: 'select', required: false, options: [
        { value: '1PH', label: 'Single Phase' },
        { value: '3PH', label: 'Three Phase' },
      ]},
      { id: 'mfgDate', label: 'Mfg Date', type: 'text', placeholder: 'e.g., 2024', required: false, maxLength: 10 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125, recommended: true },
      { id: 'small', label: '2" x 3"', width: 2, height: 3 },
      { id: 'medium', label: '3" x 4"', width: 3, height: 4 },
      { id: 'large', label: '4" x 6"', width: 4, height: 6 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel, materials.brass],
  },
  {
    id: 'hvac-unit-tag',
    name: 'HVAC Unit Tag',
    category: 'equipment-nameplate',
    subcategory: 'HVAC Equipment',
    description: 'Rooftop unit, air handler, and HVAC equipment identification tag.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#007A33',
      headerColor: '#007A33',
      headerTextColor: '#FFFFFF',
    },
    fields: [
      { id: 'unitTag', label: 'Unit Tag', type: 'text', placeholder: 'e.g., RTU-1', required: true, maxLength: 15 },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Office Area AC', required: false, maxLength: 30 },
      { id: 'tonnage', label: 'Tonnage/Capacity', type: 'text', placeholder: 'e.g., 10 Ton', required: false, maxLength: 15 },
      { id: 'serves', label: 'Area Served', type: 'text', placeholder: 'e.g., Floors 1-3', required: false, maxLength: 25 },
      { id: 'electrical', label: 'Electrical', type: 'text', placeholder: 'e.g., 480V/3PH/60A', required: false, maxLength: 20 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125, recommended: true },
      { id: 'small', label: '2" x 4"', width: 2, height: 4 },
      { id: 'medium', label: '3" x 5"', width: 3, height: 5 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
  {
    id: 'pump-tag',
    name: 'Pump Identification Tag',
    category: 'equipment-nameplate',
    subcategory: 'Mechanical Equipment',
    description: 'Pump identification with specifications and service information.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#0072CE',
      headerColor: '#0072CE',
      headerTextColor: '#FFFFFF',
    },
    fields: [
      { id: 'pumpTag', label: 'Pump Tag', type: 'text', placeholder: 'e.g., CWP-1', required: true, maxLength: 15 },
      { id: 'service', label: 'Service', type: 'text', placeholder: 'e.g., Chilled Water', required: true, maxLength: 25 },
      { id: 'gpm', label: 'Flow (GPM)', type: 'text', placeholder: 'e.g., 500 GPM', required: false, maxLength: 15 },
      { id: 'head', label: 'Head (ft)', type: 'text', placeholder: 'e.g., 75 ft', required: false, maxLength: 15 },
      { id: 'hp', label: 'Motor HP', type: 'text', placeholder: 'e.g., 15 HP', required: false, maxLength: 10 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125, recommended: true },
      { id: 'small', label: '2" x 4"', width: 2, height: 4 },
      { id: 'medium', label: '3" x 5"', width: 3, height: 5 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
]

// =============================================================================
// ASSET TAG TEMPLATES
// =============================================================================

export const assetTagTemplates: Template[] = [
  {
    id: 'asset-id-barcode',
    name: 'Asset ID Tag with Barcode',
    category: 'asset-tag',
    subcategory: 'Barcode Tags',
    description: 'Asset identification tag with barcode or QR code for inventory tracking.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderColor: '#000000',
    },
    fields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your Company', required: true, maxLength: 30 },
      { id: 'assetNumber', label: 'Asset Number', type: 'text', placeholder: 'e.g., 001234', required: true, maxLength: 15 },
      { id: 'barcodeType', label: 'Code Type', type: 'select', required: true, options: [
        { value: 'code128', label: 'Barcode (Code 128)' },
        { value: 'qr', label: 'QR Code' },
        { value: 'none', label: 'Number Only' },
      ]},
      { id: 'assetType', label: 'Asset Type', type: 'text', placeholder: 'e.g., Computer', required: false, maxLength: 20 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125 },
      { id: 'small', label: '0.75" x 2"', width: 0.75, height: 2, recommended: true },
      { id: 'medium', label: '1" x 3"', width: 1, height: 3 },
      { id: 'large', label: '1.5" x 4"', width: 1.5, height: 4 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
  {
    id: 'sequential-asset-tag',
    name: 'Sequential Asset Tags',
    category: 'asset-tag',
    subcategory: 'Numbered Tags',
    description: 'Sequentially numbered asset tags for bulk equipment identification.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFD100',
      textColor: '#000000',
    },
    fields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your Company', required: true, maxLength: 25 },
      { id: 'prefix', label: 'Number Prefix', type: 'text', placeholder: 'e.g., ASSET-', required: false, maxLength: 10 },
      { id: 'startNumber', label: 'Starting Number', type: 'number', placeholder: '001', required: true },
      { id: 'quantity', label: 'Quantity', type: 'select', required: true, options: [
        { value: '25', label: '25 Tags' },
        { value: '50', label: '50 Tags' },
        { value: '100', label: '100 Tags' },
        { value: '250', label: '250 Tags' },
      ]},
    ],
    sizes: [
      { id: 'small', label: '0.5" x 1.5"', width: 0.5, height: 1.5 },
      { id: 'medium', label: '0.75" x 2"', width: 0.75, height: 2, recommended: true },
      { id: 'large', label: '1" x 3"', width: 1, height: 3 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
  {
    id: 'property-tag',
    name: 'Property Of Tag',
    category: 'asset-tag',
    subcategory: 'Property Tags',
    description: 'Property identification and theft deterrent tag.',
    compliance: [],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#C8102E',
      textColor: '#FFFFFF',
    },
    fields: [
      { id: 'companyName', label: 'Property Of', type: 'text', placeholder: 'Company Name', required: true, maxLength: 30 },
      { id: 'contactInfo', label: 'Contact/Phone', type: 'text', placeholder: 'e.g., (555) 123-4567', required: false, maxLength: 20 },
      { id: 'assetNumber', label: 'Asset #', type: 'text', placeholder: 'Optional', required: false, maxLength: 15 },
    ],
    sizes: [
      { id: 'small', label: '0.5" x 1.5"', width: 0.5, height: 1.5 },
      { id: 'medium', label: '0.75" x 2"', width: 0.75, height: 2, recommended: true },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
]

// =============================================================================
// VALVE TAG TEMPLATES
// =============================================================================

export const valveTagTemplates: Template[] = [
  {
    id: 'valve-id-round',
    name: 'Round Valve Tag',
    category: 'valve-tag',
    subcategory: 'Standard Valve Tags',
    description: 'Standard round valve identification tag with service and valve number.',
    compliance: ['ASME_A13_1'],
    layout: 'square',
    previewStyle: {
      backgroundColor: '#FFD100',
      textColor: '#000000',
    },
    fields: [
      { id: 'valveNumber', label: 'Valve Number', type: 'text', placeholder: 'e.g., HW-101', required: true, maxLength: 10 },
      { id: 'service', label: 'Service', type: 'select', required: true, options: [
        { value: 'HW', label: 'Hot Water (HW)' },
        { value: 'CW', label: 'Cold Water (CW)' },
        { value: 'CHW', label: 'Chilled Water (CHW)' },
        { value: 'HHW', label: 'Heating Hot Water (HHW)' },
        { value: 'STM', label: 'Steam (STM)' },
        { value: 'COND', label: 'Condensate (COND)' },
        { value: 'GAS', label: 'Natural Gas (GAS)' },
        { value: 'AIR', label: 'Compressed Air (AIR)' },
        { value: 'OTHER', label: 'Other' },
      ]},
      { id: 'customService', label: 'Custom Service', type: 'text', placeholder: 'If Other selected', required: false, maxLength: 15 },
    ],
    sizes: [
      { id: '1.5inch', label: '1.5" Round', width: 1.5, height: 1.5, recommended: true },
      { id: '2inch', label: '2" Round', width: 2, height: 2 },
      { id: '3inch', label: '3" Round', width: 3, height: 3 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel, materials.brass],
  },
  {
    id: 'valve-id-rectangle',
    name: 'Rectangle Valve Tag',
    category: 'valve-tag',
    subcategory: 'Standard Valve Tags',
    description: 'Rectangle valve tag with additional space for description.',
    compliance: ['ASME_A13_1'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#007A33',
      textColor: '#FFFFFF',
    },
    fields: [
      { id: 'valveNumber', label: 'Valve Number', type: 'text', placeholder: 'e.g., CW-201', required: true, maxLength: 10 },
      { id: 'service', label: 'Service', type: 'text', placeholder: 'e.g., Chilled Water', required: true, maxLength: 20 },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'e.g., AHU-1 Supply', required: false, maxLength: 25 },
      { id: 'normalPosition', label: 'Normal Position', type: 'select', required: false, options: [
        { value: 'NO', label: 'Normally Open (NO)' },
        { value: 'NC', label: 'Normally Closed (NC)' },
      ]},
    ],
    sizes: [
      { id: 'small', label: '1" x 3"', width: 1, height: 3, recommended: true },
      { id: 'medium', label: '1.5" x 4"', width: 1.5, height: 4 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel, materials.brass],
  },
]

// =============================================================================
// SAFETY SIGNAGE TEMPLATES
// =============================================================================

export const safetySignageTemplates: Template[] = [
  {
    id: 'arc-flash-label',
    name: 'Arc Flash Warning Label',
    category: 'safety-signage',
    subcategory: 'Electrical Safety',
    description: 'NFPA 70E compliant arc flash hazard label with all required fields.',
    compliance: ['NFPA_70E', 'OSHA_1910_145', 'ANSI_Z535'],
    layout: 'vertical',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerColor: '#FF8200',
      headerTextColor: '#000000',
    },
    fields: [
      { id: 'equipmentId', label: 'Equipment ID', type: 'text', placeholder: 'e.g., MCC-1', required: true, maxLength: 20 },
      { id: 'voltage', label: 'Nominal Voltage', type: 'text', placeholder: 'e.g., 480V', required: true, maxLength: 15 },
      { id: 'arcFlashBoundary', label: 'Arc Flash Boundary', type: 'text', placeholder: 'e.g., 42 inches', required: true, maxLength: 15, helpText: 'Distance from equipment' },
      { id: 'incidentEnergy', label: 'Incident Energy', type: 'text', placeholder: 'e.g., 4.2 cal/cm²', required: true, maxLength: 20 },
      { id: 'workingDistance', label: 'Working Distance', type: 'text', placeholder: 'e.g., 18 inches', required: true, maxLength: 15 },
      { id: 'ppeCategory', label: 'PPE Category', type: 'select', required: true, options: [
        { value: '1', label: 'Category 1 (4 cal/cm²)' },
        { value: '2', label: 'Category 2 (8 cal/cm²)' },
        { value: '3', label: 'Category 3 (25 cal/cm²)' },
        { value: '4', label: 'Category 4 (40 cal/cm²)' },
      ]},
      { id: 'limitedApproach', label: 'Limited Approach', type: 'text', placeholder: 'e.g., 3 ft 6 in', required: false, maxLength: 15 },
      { id: 'restrictedApproach', label: 'Restricted Approach', type: 'text', placeholder: 'e.g., 1 ft', required: false, maxLength: 15 },
      { id: 'analysisDate', label: 'Date of Analysis', type: 'text', placeholder: 'e.g., January 2024', required: true, maxLength: 20 },
    ],
    sizes: [
      { id: 'standard', label: '4" x 6"', width: 4, height: 6, recommended: true },
      { id: 'large', label: '5" x 7"', width: 5, height: 7 },
    ],
    materials: [materials.absPlastic],
    icons: [
      { id: 'arc-flash', label: 'Arc Flash Symbol', svg: 'M12 2L2 22h20L12 2zm0 4l7.5 14h-15L12 6z' },
    ],
  },
  {
    id: 'danger-sign',
    name: 'Custom DANGER Sign',
    category: 'safety-signage',
    subcategory: 'Custom Safety Signs',
    description: 'Permanent laser-engraved metal DANGER sign. For custom messages, harsh environments, or where stickers fail.',
    compliance: ['OSHA_1910_145', 'ANSI_Z535'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerColor: '#C8102E',
      headerTextColor: '#FFFFFF',
    },
    fields: [
      { id: 'hazardMessage', label: 'Hazard Message', type: 'text', placeholder: 'e.g., LASER RADIATION - CLASS IV', required: true, maxLength: 50 },
      { id: 'additionalInfo', label: 'Additional Info', type: 'text', placeholder: 'Optional second line', required: false, maxLength: 40 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125 },
      { id: 'small', label: '3.5" x 5"', width: 3.5, height: 5 },
      { id: 'medium', label: '7" x 10"', width: 7, height: 10, recommended: true },
      { id: 'large', label: '10" x 14"', width: 10, height: 14 },
    ],
    materials: [materials.absPlastic, materials.anodizedAluminumThin, materials.anodizedAluminumThick],
  },
  {
    id: 'warning-sign',
    name: 'Custom WARNING Sign',
    category: 'safety-signage',
    subcategory: 'Custom Safety Signs',
    description: 'Permanent laser-engraved metal WARNING sign. For custom messages, harsh environments, or where stickers fail.',
    compliance: ['OSHA_1910_145', 'ANSI_Z535'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerColor: '#FF8200',
      headerTextColor: '#000000',
    },
    fields: [
      { id: 'hazardMessage', label: 'Warning Message', type: 'text', placeholder: 'e.g., CHEMICAL STORAGE - PPE REQUIRED', required: true, maxLength: 50 },
      { id: 'additionalInfo', label: 'Additional Info', type: 'text', placeholder: 'Optional second line', required: false, maxLength: 40 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125 },
      { id: 'small', label: '3.5" x 5"', width: 3.5, height: 5 },
      { id: 'medium', label: '7" x 10"', width: 7, height: 10, recommended: true },
      { id: 'large', label: '10" x 14"', width: 10, height: 14 },
    ],
    materials: [materials.absPlastic, materials.anodizedAluminumThin, materials.anodizedAluminumThick],
  },
  {
    id: 'caution-sign',
    name: 'Custom CAUTION Sign',
    category: 'safety-signage',
    subcategory: 'Custom Safety Signs',
    description: 'Permanent laser-engraved metal CAUTION sign. For custom messages, harsh environments, or where stickers fail.',
    compliance: ['OSHA_1910_145', 'ANSI_Z535'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      headerColor: '#FFD100',
      headerTextColor: '#000000',
    },
    fields: [
      { id: 'hazardMessage', label: 'Hazard Message', type: 'text', placeholder: 'e.g., WATCH YOUR STEP', required: true, maxLength: 50 },
      { id: 'additionalInfo', label: 'Additional Info', type: 'text', placeholder: 'Optional second line', required: false, maxLength: 40 },
    ],
    sizes: [
      { id: 'credit-card', label: 'Credit Card (3.375" x 2.125")', width: 3.375, height: 2.125 },
      { id: 'small', label: '3.5" x 5"', width: 3.5, height: 5 },
      { id: 'medium', label: '7" x 10"', width: 7, height: 10, recommended: true },
      { id: 'large', label: '10" x 14"', width: 10, height: 14 },
    ],
    materials: [materials.absPlastic, materials.anodizedAluminumThin, materials.anodizedAluminumThick],
  },
  {
    id: 'lockout-tagout',
    name: 'Lockout/Tagout Tag',
    category: 'safety-signage',
    subcategory: 'LOTO Tags',
    description: 'OSHA 29 CFR 1910.147 compliant lockout/tagout tag for energy isolation.',
    compliance: ['OSHA_1910_145'],
    layout: 'vertical',
    previewStyle: {
      backgroundColor: '#C8102E',
      textColor: '#FFFFFF',
    },
    fields: [
      { id: 'tagType', label: 'Tag Type', type: 'select', required: true, options: [
        { value: 'DANGER-LOCKED-OUT', label: 'DANGER - LOCKED OUT' },
        { value: 'DANGER-DO-NOT-OPERATE', label: 'DANGER - DO NOT OPERATE' },
        { value: 'DANGER-DO-NOT-REMOVE', label: 'DANGER - DO NOT REMOVE' },
      ]},
      { id: 'reason', label: 'Reason', type: 'text', placeholder: 'e.g., Equipment under repair', required: false, maxLength: 30 },
      { id: 'authorizedBy', label: 'Authorized By', type: 'text', placeholder: 'Name field', required: true, maxLength: 25 },
      { id: 'department', label: 'Department', type: 'text', placeholder: 'Department field', required: false, maxLength: 20 },
      { id: 'dateField', label: 'Date', type: 'text', placeholder: 'Date field', required: true, maxLength: 15 },
    ],
    sizes: [
      { id: 'standard', label: '3" x 5.75"', width: 3, height: 5.75, recommended: true },
    ],
    materials: [materials.absPlastic],
  },
]

// =============================================================================
// WIRE MARKER TEMPLATES
// =============================================================================

export const wireMarkerTemplates: Template[] = [
  {
    id: 'wire-marker-tag',
    name: 'Wire/Cable ID Tag',
    category: 'wire-marker',
    subcategory: 'Wire Identification',
    description: 'Durable engraved tags for wire and cable identification. Attach with ball chain, zip tie, or cable clip.',
    compliance: ['NEC_408_4'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#C0C0C0',
      textColor: '#000000',
    },
    fields: [
      { id: 'wireId', label: 'Wire ID/Circuit', type: 'text', placeholder: 'e.g., L1, N, GND', required: true, maxLength: 15 },
      { id: 'destination', label: 'From/To', type: 'text', placeholder: 'e.g., Panel A - Ckt 5', required: false, maxLength: 25 },
      { id: 'attachment', label: 'Attachment Method', type: 'select', required: true, options: [
        { value: 'split-ring', label: 'Split Ring (Standard)' },
        { value: 'wire-loop', label: 'Wire Loop' },
        { value: 'ball-chain', label: 'Ball Chain (Premium)' },
        { value: 'zip-tie', label: 'Zip Tie Mount' },
        { value: 'none', label: 'Tag Only (no hardware)' },
      ]},
    ],
    sizes: [
      { id: 'small', label: '0.75" x 0.5"', width: 0.75, height: 0.5 },
      { id: 'medium', label: '1" x 0.625"', width: 1, height: 0.625, recommended: true },
      { id: 'large', label: '1.5" x 0.75"', width: 1.5, height: 0.75 },
    ],
    materials: [materials.anodizedAluminumThin, materials.stainlessSteel, materials.brass],
  },
  {
    id: 'cable-tag',
    name: 'Cable Identification Tag',
    category: 'wire-marker',
    subcategory: 'Cable Tags',
    description: 'Durable cable tags for larger conductors and cable bundles.',
    compliance: ['NEC_408_4'],
    layout: 'horizontal',
    previewStyle: {
      backgroundColor: '#FFD100',
      textColor: '#000000',
    },
    fields: [
      { id: 'cableId', label: 'Cable ID', type: 'text', placeholder: 'e.g., FDR-1', required: true, maxLength: 15 },
      { id: 'source', label: 'Source', type: 'text', placeholder: 'e.g., MDP', required: true, maxLength: 20 },
      { id: 'destination', label: 'Destination', type: 'text', placeholder: 'e.g., Panel A', required: true, maxLength: 20 },
      { id: 'cableSpec', label: 'Cable Spec', type: 'text', placeholder: 'e.g., 3/C #10 AWG', required: false, maxLength: 15 },
    ],
    sizes: [
      { id: 'small', label: '0.75" x 2.5"', width: 0.75, height: 2.5, recommended: true },
      { id: 'medium', label: '1" x 3"', width: 1, height: 3 },
    ],
    materials: [materials.anodizedAluminumThin, materials.anodizedAluminumThick, materials.stainlessSteel],
  },
]

// =============================================================================
// COMBINED TEMPLATE CATALOG
// =============================================================================

export const allTemplates: Template[] = [
  ...controlPanelTemplates,
  ...equipmentNameplateTemplates,
  ...assetTagTemplates,
  ...valveTagTemplates,
  ...safetySignageTemplates,
  ...wireMarkerTemplates,
]

export const templateCategories: { id: TemplateCategory; name: string; description: string; icon: string }[] = [
  {
    id: 'control-panel',
    name: 'Control Panel Labels',
    description: 'Breaker schedules, disconnect labels, motor starter IDs, panel identification',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  },
  {
    id: 'equipment-nameplate',
    name: 'Equipment Nameplates',
    description: 'Rating plates, HVAC unit tags, pump tags, motor nameplates',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    id: 'asset-tag',
    name: 'Asset Tags',
    description: 'Barcode tags, sequential numbering, property identification',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  },
  {
    id: 'valve-tag',
    name: 'Valve Tags & Pipe Markers',
    description: 'Round/rectangle valve tags, ASME A13.1 pipe markers',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    id: 'safety-signage',
    name: 'Safety & Compliance',
    description: 'Arc flash labels, DANGER/WARNING/CAUTION signs, LOTO tags',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  {
    id: 'wire-marker',
    name: 'Wire & Cable Markers',
    description: 'Wire wraps, cable tags, conductor identification',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
]

// Helper function to get templates by category
export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return allTemplates.filter(t => t.category === category)
}

// Helper function to get template by ID
export function getTemplateById(id: string): Template | undefined {
  return allTemplates.find(t => t.id === id)
}

// Helper function to get compliance info
export function getComplianceInfo(codes: string[]): typeof complianceStandards[keyof typeof complianceStandards][] {
  return codes.map(code => complianceStandards[code as keyof typeof complianceStandards]).filter(Boolean)
}

// Get ASME A13.1 color for pipe contents
export function getPipeColor(contents: string): { background: string; text: string } {
  const contentLower = contents.toLowerCase()
  const colors = complianceStandards.ASME_A13_1.requirements.colors

  if (contentLower.includes('gas') || contentLower.includes('fuel') || contentLower.includes('oil')) {
    return colors.flammable
  }
  if (contentLower.includes('toxic') || contentLower.includes('corrosive') || contentLower.includes('acid')) {
    return colors.toxic
  }
  if (contentLower.includes('fire') || contentLower.includes('sprinkler')) {
    return colors.fireQuench
  }
  if (contentLower.includes('water') && !contentLower.includes('chilled') && !contentLower.includes('hot')) {
    return colors.water
  }
  if (contentLower.includes('air') || contentLower.includes('compressed')) {
    return colors.compressedAir
  }
  // Default for chilled water, hot water, steam, condensate = yellow/black (process fluids)
  return colors.flammable
}
