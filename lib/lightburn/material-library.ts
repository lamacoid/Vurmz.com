// Parsed LightBurn Material Library from LS_Param_37Mat
// Source: /Users/zacharydemillo/Desktop/Projects/30WGweike/30W150x150library.clb
// 30W Fiber Laser Settings

export interface CutSetting {
  type: 'Scan' | 'Cut' | 'Image'
  minPower?: number
  maxPower: number
  speed: number
  frequency?: number
  numPasses?: number
  interval?: number
  angle?: number
  crossHatch?: boolean
  bidir?: boolean
  overscan?: number
  dpi?: number
  ditherMode?: string
}

export interface MaterialEntry {
  thickness?: number
  description: string
  subCategory: string
  settings: CutSetting
}

export interface Material {
  name: string
  entries: MaterialEntry[]
}

// Main material library - parsed from your .clb file
export const materialLibrary: Material[] = [
  {
    name: 'Aluminum Anodized',
    entries: [
      {
        description: 'Photo Quality',
        subCategory: 'Photo',
        settings: {
          type: 'Image',
          maxPower: 27,
          speed: 2550,
          frequency: 45000,
          numPasses: 2,
          interval: 0.0758,
          dpi: 335,
          ditherMode: 'jarvis'
        }
      },
      {
        description: 'Satin Black',
        subCategory: 'Business Cards',
        settings: {
          type: 'Scan',
          minPower: 5,
          maxPower: 53,
          speed: 2550,
          frequency: 45000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Shiny Colors',
        subCategory: 'Business Cards',
        settings: {
          type: 'Scan',
          minPower: 5,
          maxPower: 80,
          speed: 5050,
          frequency: 45000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Aluminum',
    entries: [
      {
        description: 'Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 65,
          maxPower: 75,
          speed: 1000,
          frequency: 25000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Luminous Finish',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 41,
          speed: 750,
          frequency: 45000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Deep',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 65,
          maxPower: 100,
          speed: 301,
          frequency: 30000,
          numPasses: 3,
          interval: 0.015,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Photo Quality',
        subCategory: 'Photo',
        settings: {
          type: 'Image',
          minPower: 23,
          maxPower: 46,
          speed: 240,
          frequency: 45000,
          numPasses: 2,
          interval: 0.0806,
          dpi: 315,
          ditherMode: 'jarvis'
        }
      }
    ]
  },
  {
    name: 'Stainless Steel',
    entries: [
      {
        description: 'Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 632,
          frequency: 45000,
          numPasses: 5,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Black Markings',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 99,
          frequency: 40000,
          interval: 0.015,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Luminous Finish',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 75,
          speed: 1550,
          frequency: 45000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Brass',
    entries: [
      {
        description: 'Luminous Finish',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 75,
          speed: 1480,
          frequency: 50000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Black Markings',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 198,
          frequency: 45000,
          numPasses: 2,
          interval: 0.015,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 632,
          frequency: 50000,
          numPasses: 5,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Deep',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 192,
          frequency: 45000,
          numPasses: 4,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Copper',
    entries: [
      {
        description: 'Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 156,
          frequency: 30000,
          numPasses: 2,
          interval: 0.01,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Black Markings',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 99,
          frequency: 40000,
          interval: 0.01,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Luminous Markings',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 80,
          speed: 1550,
          frequency: 45000,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'ABS Plastic',
    entries: [
      {
        description: 'Luminous Marking',
        subCategory: 'Black ABS',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 23,
          speed: 2000,
          interval: 0.06,
          angle: 90,
          crossHatch: true
        }
      },
      {
        description: 'Dark Markings',
        subCategory: 'White ABS',
        settings: {
          type: 'Scan',
          maxPower: 40,
          speed: 1666.67,
          numPasses: 3,
          interval: 0.06
        }
      }
    ]
  },
  {
    name: 'Leather',
    entries: [
      {
        description: 'Light Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 35,
          speed: 500,
          frequency: 25000,
          interval: 0.06,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Dark Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 65,
          speed: 300,
          frequency: 30000,
          interval: 0.06,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Wood',
    entries: [
      {
        description: 'Light Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 30,
          speed: 500,
          frequency: 25000,
          interval: 0.08,
          angle: 45,
          crossHatch: true
        }
      },
      {
        description: 'Dark Engrave',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 55,
          speed: 300,
          frequency: 30000,
          interval: 0.06,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Slate',
    entries: [
      {
        description: 'White Markings',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 35,
          maxPower: 100,
          speed: 800,
          frequency: 35000,
          numPasses: 2,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Ceramic Coasters',
    entries: [
      {
        description: 'White Markings',
        subCategory: 'Black',
        settings: {
          type: 'Scan',
          minPower: 16,
          maxPower: 96,
          speed: 1050,
          frequency: 35000,
          numPasses: 2,
          interval: 0.025,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Powder Coat',
    entries: [
      {
        description: 'Remove Coating',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 91,
          speed: 400,
          frequency: 45000,
          interval: 0.01,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  },
  {
    name: 'Cerakote',
    entries: [
      {
        description: 'Polish',
        subCategory: 'Default',
        settings: {
          type: 'Scan',
          minPower: 11,
          maxPower: 91,
          speed: 400,
          frequency: 45000,
          interval: 0.01,
          angle: 45,
          crossHatch: true
        }
      }
    ]
  }
]

// Helper to find material settings
export function getMaterialSettings(materialName: string, entryDescription?: string): CutSetting | null {
  const material = materialLibrary.find(m =>
    m.name.toLowerCase() === materialName.toLowerCase()
  )
  if (!material) return null

  if (entryDescription) {
    const entry = material.entries.find(e =>
      e.description.toLowerCase() === entryDescription.toLowerCase()
    )
    return entry?.settings || null
  }

  // Return first entry as default
  return material.entries[0]?.settings || null
}

// Map web app materials to library materials
export const materialMapping: Record<string, { libraryName: string; entryDesc: string }> = {
  'anodized-aluminum-thin': { libraryName: 'Aluminum Anodized', entryDesc: 'Satin Black' },
  'anodized-aluminum-thick': { libraryName: 'Aluminum Anodized', entryDesc: 'Satin Black' },
  'anodized-aluminum-black': { libraryName: 'Aluminum Anodized', entryDesc: 'Satin Black' },
  'anodized-aluminum-color': { libraryName: 'Aluminum Anodized', entryDesc: 'Shiny Colors' },
  'stainless-steel': { libraryName: 'Stainless Steel', entryDesc: 'Engrave' },
  'brass': { libraryName: 'Brass', entryDesc: 'Engrave' },
  'copper': { libraryName: 'Copper', entryDesc: 'Engrave' },
  'abs-plastic': { libraryName: 'ABS Plastic', entryDesc: 'Luminous Marking' },
  'abs-plastic-white': { libraryName: 'ABS Plastic', entryDesc: 'Dark Markings' },
  'leather': { libraryName: 'Leather', entryDesc: 'Dark Engrave' },
  'wood': { libraryName: 'Wood', entryDesc: 'Dark Engrave' },
  'slate': { libraryName: 'Slate', entryDesc: 'White Markings' },
  'ceramic': { libraryName: 'Ceramic Coasters', entryDesc: 'White Markings' },
  'powder-coat': { libraryName: 'Powder Coat', entryDesc: 'Remove Coating' },
}

export function getSettingsForWebMaterial(webMaterialId: string): CutSetting | null {
  const mapping = materialMapping[webMaterialId]
  if (!mapping) return null
  return getMaterialSettings(mapping.libraryName, mapping.entryDesc)
}
