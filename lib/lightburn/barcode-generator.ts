// Barcode Generator for LightBurn Files
// Uses bwip-js to generate vector barcodes as SVG paths

import bwipjs from 'bwip-js'

// Extended bwip-js type for toSVG which exists but isn't in the types
interface BwipJsExtended {
  toSVG(options: {
    bcid: string
    text: string
    scale?: number
    height?: number
    includetext?: boolean
    textxalign?: string
  }): Promise<string>
}

const bwip = bwipjs as unknown as BwipJsExtended

export type BarcodeType = 'code128' | 'qr' | 'code39' | 'datamatrix' | 'ean13' | 'upca'

export interface BarcodeConfig {
  type: BarcodeType
  value: string
  width: number   // mm
  height: number  // mm
  includeText?: boolean
  textSize?: number // mm
}

export interface BarcodeResult {
  svg: string
  width: number
  height: number
  paths: string[] // Individual path data for LightBurn shapes
}

// Map our types to bwip-js types
const barcodeTypeMap: Record<BarcodeType, string> = {
  code128: 'code128',
  qr: 'qrcode',
  code39: 'code39',
  datamatrix: 'datamatrix',
  ean13: 'ean13',
  upca: 'upca',
}

// Generate barcode as SVG
export async function generateBarcodeSvg(config: BarcodeConfig): Promise<string> {
  const bcid = barcodeTypeMap[config.type]

  // Calculate scale - bwip-js uses mils (1/1000 inch)
  // 1 mm = 39.37 mils
  const scale = config.width * 39.37 / 100 // Approximate scale

  try {
    const svg = await bwip.toSVG({
      bcid,
      text: config.value,
      scale: Math.max(1, Math.round(scale)),
      height: config.type === 'qr' || config.type === 'datamatrix' ? undefined : 10,
      includetext: config.includeText ?? false,
      textxalign: 'center',
    })

    return svg
  } catch (error) {
    console.error('Barcode generation error:', error)
    throw new Error(`Failed to generate ${config.type} barcode: ${error}`)
  }
}

// Extract paths from SVG for LightBurn
export function extractPathsFromSvg(svg: string): string[] {
  const paths: string[] = []

  // Match all path elements
  const pathRegex = /<path[^>]*d="([^"]+)"[^>]*>/g
  let match

  while ((match = pathRegex.exec(svg)) !== null) {
    paths.push(match[1])
  }

  // Also extract rect elements and convert to paths
  const rectRegex = /<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*>/g

  while ((match = rectRegex.exec(svg)) !== null) {
    const x = parseFloat(match[1]) || 0
    const y = parseFloat(match[2]) || 0
    const w = parseFloat(match[3])
    const h = parseFloat(match[4])

    // Convert rect to path
    const path = `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`
    paths.push(path)
  }

  return paths
}

// Get SVG viewBox dimensions
export function getSvgDimensions(svg: string): { width: number; height: number } {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/)
    return {
      width: parseFloat(parts[2]) || 100,
      height: parseFloat(parts[3]) || 100,
    }
  }

  const widthMatch = svg.match(/width="([^"]+)"/)
  const heightMatch = svg.match(/height="([^"]+)"/)

  return {
    width: widthMatch ? parseFloat(widthMatch[1]) : 100,
    height: heightMatch ? parseFloat(heightMatch[1]) : 100,
  }
}

// Generate barcode and return LightBurn-ready paths
export async function generateBarcodeForLightBurn(config: BarcodeConfig): Promise<BarcodeResult> {
  const svg = await generateBarcodeSvg(config)
  const paths = extractPathsFromSvg(svg)
  const dims = getSvgDimensions(svg)

  return {
    svg,
    width: dims.width,
    height: dims.height,
    paths,
  }
}

// Generate LightBurn shape XML for a barcode
export async function generateBarcodeShapeXml(
  config: BarcodeConfig,
  x: number,
  y: number,
  cutIndex: number
): Promise<string> {
  const barcode = await generateBarcodeForLightBurn(config)

  // Calculate scale to fit target size
  const scaleX = config.width / barcode.width
  const scaleY = config.height / barcode.height
  const scale = Math.min(scaleX, scaleY)

  let xml = `    <Shape Type="Group" CutIndex="${cutIndex}">\n`
  xml += `        <XForm>${scale} 0 0 ${scale} ${x} ${y}</XForm>\n`
  xml += `        <Children>\n`

  // Add each path as a shape
  barcode.paths.forEach((pathData) => {
    xml += `            <Shape Type="Path" CutIndex="${cutIndex}">\n`
    xml += `                <XForm>1 0 0 1 0 0</XForm>\n`
    xml += `                <VertList>${convertSvgPathToLightBurnVerts(pathData)}</VertList>\n`
    xml += `            </Shape>\n`
  })

  xml += `        </Children>\n`
  xml += `    </Shape>\n`

  return xml
}

// Convert SVG path data to LightBurn VertList format
function convertSvgPathToLightBurnVerts(pathData: string): string {
  const verts: string[] = []

  // Parse SVG path commands
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || []

  let currentX = 0
  let currentY = 0

  commands.forEach(cmd => {
    const type = cmd[0].toUpperCase()
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n))

    switch (type) {
      case 'M': // Move to
        currentX = args[0]
        currentY = args[1]
        verts.push(`V${currentX} ${currentY}`)
        break

      case 'L': // Line to
        currentX = args[0]
        currentY = args[1]
        verts.push(`V${currentX} ${currentY}`)
        break

      case 'H': // Horizontal line
        currentX = args[0]
        verts.push(`V${currentX} ${currentY}`)
        break

      case 'V': // Vertical line
        currentY = args[0]
        verts.push(`V${currentX} ${currentY}`)
        break

      case 'Z': // Close path
        // Path is closed automatically in LightBurn
        break

      // Add more command types as needed
    }
  })

  return verts.join('')
}

// Validate barcode value for type
export function validateBarcodeValue(type: BarcodeType, value: string): { valid: boolean; error?: string } {
  switch (type) {
    case 'code128':
      // Code 128 can encode any ASCII character
      if (value.length === 0) {
        return { valid: false, error: 'Value cannot be empty' }
      }
      if (value.length > 48) {
        return { valid: false, error: 'Value too long (max 48 characters)' }
      }
      return { valid: true }

    case 'code39':
      // Code 39 supports A-Z, 0-9, and some special characters
      const code39Valid = /^[A-Z0-9\-. $/+%*]+$/i.test(value)
      if (!code39Valid) {
        return { valid: false, error: 'Code 39 only supports A-Z, 0-9, and -. $/+%' }
      }
      return { valid: true }

    case 'qr':
      // QR codes can encode up to ~4000 characters
      if (value.length === 0) {
        return { valid: false, error: 'Value cannot be empty' }
      }
      if (value.length > 2000) {
        return { valid: false, error: 'Value too long for reliable scanning' }
      }
      return { valid: true }

    case 'datamatrix':
      // DataMatrix can encode ~2000 characters
      if (value.length === 0) {
        return { valid: false, error: 'Value cannot be empty' }
      }
      return { valid: true }

    case 'ean13':
      // EAN-13 must be exactly 12 or 13 digits
      const ean13Valid = /^\d{12,13}$/.test(value)
      if (!ean13Valid) {
        return { valid: false, error: 'EAN-13 requires exactly 12-13 digits' }
      }
      return { valid: true }

    case 'upca':
      // UPC-A must be exactly 11 or 12 digits
      const upcaValid = /^\d{11,12}$/.test(value)
      if (!upcaValid) {
        return { valid: false, error: 'UPC-A requires exactly 11-12 digits' }
      }
      return { valid: true }

    default:
      return { valid: true }
  }
}
