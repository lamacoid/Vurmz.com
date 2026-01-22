// LightBurn .lbrn2 File Generator
// Generates production-ready files for drag-and-drop into LightBurn

import { CutSetting, getSettingsForWebMaterial } from './material-library'
import { BarcodeType } from './barcode-generator'

export interface TextElement {
  text: string
  x: number
  y: number
  height: number // mm
  font?: string
  layerIndex?: number
}

export interface RectElement {
  x: number
  y: number
  width: number
  height: number
  layerIndex?: number
  cornerRadius?: number
}

export interface BarcodeElement {
  type: BarcodeType
  value: string
  x: number
  y: number
  width: number
  height: number
  layerIndex?: number
}

export interface LightBurnProject {
  name: string
  width: number  // mm
  height: number // mm
  material: string
  elements: (TextElement | RectElement | BarcodeElement)[]
  cutSettings?: CutSetting
}

// Standard industrial font - Arial Bold is universally readable
const DEFAULT_FONT = 'Arial,-1,100,5,75,0,0,0,0,0'

// Generate unique ID for shapes
let shapeIdCounter = 0
function generateShapeId(): number {
  return shapeIdCounter++
}

// Reset counter for new project
function resetShapeCounter(): void {
  shapeIdCounter = 0
}

// Generate CutSetting XML
function generateCutSettingXml(settings: CutSetting, index: number): string {
  const layerColors = [
    '0', // Black (C00)
    '255', // Red (C01)
    '65280', // Green (C02)
    '16776960', // Yellow (C03)
    '16711680', // Blue (C04)
    '16711935', // Magenta (C05)
    '65535', // Cyan (C06)
  ]

  const color = layerColors[index % layerColors.length]

  let xml = `    <CutSetting type="${settings.type}">\n`
  xml += `        <index Value="${index}"/>\n`
  xml += `        <name Value="C0${index}"/>\n`
  xml += `        <LinkPath Value=""/>\n`

  if (settings.minPower !== undefined) {
    xml += `        <minPower Value="${settings.minPower}"/>\n`
  }
  xml += `        <maxPower Value="${settings.maxPower}"/>\n`
  xml += `        <maxPower2 Value="20"/>\n`
  xml += `        <speed Value="${settings.speed}"/>\n`

  if (settings.frequency) {
    xml += `        <frequency Value="${settings.frequency}"/>\n`
  }

  xml += `        <PPI Value="0"/>\n`
  xml += `        <JumpSpeed Value="4000"/>\n`

  if (settings.numPasses && settings.numPasses > 1) {
    xml += `        <numPasses Value="${settings.numPasses}"/>\n`
  }

  xml += `        <perfLen Value="0.01"/>\n`
  xml += `        <perfSkip Value="0.01"/>\n`
  xml += `        <dotTime Value="1"/>\n`

  if (settings.type === 'Scan') {
    xml += `        <scanOpt Value="byGroup"/>\n`
  }

  if (settings.crossHatch) {
    xml += `        <crossHatch Value="1"/>\n`
  }

  xml += `        <overscan Value="${settings.overscan || 0}"/>\n`

  if (settings.interval) {
    xml += `        <interval Value="${settings.interval}"/>\n`
  }

  if (settings.angle !== undefined) {
    xml += `        <angle Value="${settings.angle}"/>\n`
  }

  xml += `        <priority Value="0"/>\n`
  xml += `        <tabCount Value="1"/>\n`
  xml += `        <tabCountMax Value="1"/>\n`

  if (settings.type === 'Image' && settings.dpi) {
    xml += `        <cellsPerInch Value="200"/>\n`
    xml += `        <ditherMode Value="${settings.ditherMode || 'jarvis'}"/>\n`
    xml += `        <dpi Value="${settings.dpi}"/>\n`
  }

  xml += `    </CutSetting>\n`

  return xml
}

// Generate Text shape XML
function generateTextXml(element: TextElement, cutIndex: number): string {
  const font = element.font || DEFAULT_FONT

  // Create text shape
  let xml = `    <Shape Type="Text" CutIndex="${cutIndex}" Font="${font}" `
  xml += `Str="${escapeXml(element.text)}" H="${element.height}" `
  xml += `LS="0" LnS="0" Ah="1" Av="1" Bold="1">\n`
  xml += `        <XForm>1 0 0 1 ${element.x} ${element.y}</XForm>\n`
  xml += `    </Shape>\n`

  return xml
}

// Generate Rectangle shape XML
function generateRectXml(element: RectElement, cutIndex: number): string {
  let xml = `    <Shape Type="Rect" CutIndex="${cutIndex}" `
  xml += `W="${element.width}" H="${element.height}" `

  if (element.cornerRadius) {
    xml += `Cr="${element.cornerRadius}" `
  }

  xml += `>\n`
  xml += `        <XForm>1 0 0 1 ${element.x} ${element.y}</XForm>\n`
  xml += `    </Shape>\n`

  return xml
}

// Escape special XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Generate barcode as path elements
// Note: Actual barcode generation requires bwip-js library
// This creates a placeholder that will be replaced with actual barcode paths
function generateBarcodeXml(element: BarcodeElement, cutIndex: number): string {
  // For now, create a group with a rectangle placeholder
  // The actual barcode paths will be generated server-side with bwip-js
  let xml = `    <Shape Type="Group" CutIndex="${cutIndex}">\n`
  xml += `        <XForm>1 0 0 1 ${element.x} ${element.y}</XForm>\n`
  xml += `        <Children>\n`

  // Barcode placeholder - will be replaced with actual bars
  xml += `            <Shape Type="Rect" CutIndex="${cutIndex}" W="${element.width}" H="${element.height}">\n`
  xml += `                <XForm>1 0 0 1 0 0</XForm>\n`
  xml += `            </Shape>\n`

  xml += `        </Children>\n`
  xml += `    </Shape>\n`

  return xml
}

// Main generator function
export function generateLightBurnFile(project: LightBurnProject): string {
  resetShapeCounter()

  // Get material settings
  const settings = project.cutSettings || getSettingsForWebMaterial(project.material)

  if (!settings) {
    throw new Error(`No settings found for material: ${project.material}`)
  }

  // Start XML document
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<LightBurnProject AppVersion="1.7.00" FormatVersion="1" '
  xml += `MaterialHeight="0" MirrorX="False" MirrorY="False">\n`

  // Add notes about the project
  xml += `    <Notes ShowOnLoad="0" Notes="Generated by VURMZ Industrial Builder&#10;Material: ${project.material}&#10;Project: ${project.name}"/>\n`

  // Add cut settings for layer 0 (main engrave layer)
  xml += generateCutSettingXml(settings, 0)

  // Add shapes
  project.elements.forEach(element => {
    const layerIndex = (element as TextElement).layerIndex || 0

    if ('text' in element) {
      xml += generateTextXml(element as TextElement, layerIndex)
    } else if ('width' in element && !('type' in element)) {
      xml += generateRectXml(element as RectElement, layerIndex)
    } else if ('type' in element && 'value' in element) {
      xml += generateBarcodeXml(element as BarcodeElement, layerIndex)
    }
  })

  // Close document
  xml += '</LightBurnProject>\n'

  return xml
}

// Generate a complete industrial label project
export interface IndustrialLabelConfig {
  templateId: string
  material: string
  width: number  // mm
  height: number // mm
  fields: Record<string, string>
  barcode?: {
    type: BarcodeType
    value: string
  }
  logo?: string // Base64 or URL
}

export function generateIndustrialLabel(config: IndustrialLabelConfig): string {
  const elements: (TextElement | RectElement | BarcodeElement)[] = []

  // Layout calculations
  const margin = 2 // mm
  const lineHeight = config.height > 30 ? 5 : 3 // mm based on label size
  let currentY = config.height - margin - lineHeight

  // Add text fields
  Object.entries(config.fields).forEach(([key, value]) => {
    if (value && value.trim()) {
      elements.push({
        text: value,
        x: margin,
        y: currentY,
        height: lineHeight,
      })
      currentY -= lineHeight * 1.5
    }
  })

  // Add barcode if specified
  if (config.barcode) {
    const barcodeWidth = config.width * 0.6
    const barcodeHeight = config.height * 0.25
    elements.push({
      type: config.barcode.type,
      value: config.barcode.value,
      x: (config.width - barcodeWidth) / 2,
      y: margin,
      width: barcodeWidth,
      height: barcodeHeight,
    })
  }

  // Create project
  const project: LightBurnProject = {
    name: config.templateId,
    width: config.width,
    height: config.height,
    material: config.material,
    elements,
  }

  return generateLightBurnFile(project)
}

// Pre-defined template generators for common industrial labels
export const templateGenerators = {
  // Equipment nameplate
  equipmentNameplate: (fields: Record<string, string>, material: string, width: number, height: number) => {
    return generateIndustrialLabel({
      templateId: 'equipment-nameplate',
      material,
      width,
      height,
      fields,
    })
  },

  // Asset tag with barcode
  assetTag: (fields: Record<string, string>, material: string, width: number, height: number, barcodeValue: string, barcodeType: BarcodeType = 'code128') => {
    return generateIndustrialLabel({
      templateId: 'asset-tag',
      material,
      width,
      height,
      fields,
      barcode: {
        type: barcodeType,
        value: barcodeValue,
      },
    })
  },

  // Valve tag (round)
  valveTag: (valveNumber: string, service: string, material: string, diameter: number) => {
    const elements: TextElement[] = [
      {
        text: service,
        x: diameter / 2,
        y: diameter * 0.65,
        height: diameter * 0.15,
      },
      {
        text: valveNumber,
        x: diameter / 2,
        y: diameter * 0.35,
        height: diameter * 0.25,
      },
    ]

    return generateLightBurnFile({
      name: 'valve-tag',
      width: diameter,
      height: diameter,
      material,
      elements,
    })
  },

  // Safety sign (DANGER/WARNING/CAUTION)
  safetySign: (signalWord: string, message: string, material: string, width: number, height: number) => {
    const elements: TextElement[] = [
      {
        text: signalWord.toUpperCase(),
        x: width / 2,
        y: height * 0.75,
        height: height * 0.2,
      },
      {
        text: message,
        x: width / 2,
        y: height * 0.4,
        height: height * 0.1,
      },
    ]

    return generateLightBurnFile({
      name: 'safety-sign',
      width,
      height,
      material,
      elements,
    })
  },

  // Control panel label
  controlPanelLabel: (fields: Record<string, string>, material: string, width: number, height: number) => {
    return generateIndustrialLabel({
      templateId: 'control-panel-label',
      material,
      width,
      height,
      fields,
    })
  },
}
