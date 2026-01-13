'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ============================================================================
// VURMZ LABEL DESIGNER - Canvas-based visual label/sign builder
// Competes with Signs4Installers but limited to VURMZ capabilities
// ============================================================================

// Material definitions - ONLY what VURMZ actually stocks/offers
// Metal tags = fiber laser (max 4.7" x 4.7")
// Plastic labels = CO2 laser (max 12" x 24")

const MATERIALS = {
  // === METAL TAGS (Fiber Laser) ===
  'brass': {
    name: 'Solid Brass',
    category: 'metal',
    laser: 'fiber',
    maxWidth: 4.7,
    maxHeight: 4.7,
    surfaceColor: '#b5a642',
    engraveColor: '#8b7355',
    pricePerSqIn: 0.50,
    description: 'Premium brass, deep engrave'
  },
  'anodized-black': {
    name: 'Anodized Aluminum - Black',
    category: 'metal',
    laser: 'fiber',
    maxWidth: 4.7,
    maxHeight: 4.7,
    surfaceColor: '#1a1a1a',
    engraveColor: '#c0c0c0',
    pricePerSqIn: 0.35,
    description: 'Engraves bright silver'
  },
  'anodized-blue': {
    name: 'Anodized Aluminum - Blue',
    category: 'metal',
    laser: 'fiber',
    maxWidth: 4.7,
    maxHeight: 4.7,
    surfaceColor: '#1e3a5f',
    engraveColor: '#c0c0c0',
    pricePerSqIn: 0.35,
    description: 'Engraves silver on blue'
  },
  'anodized-red': {
    name: 'Anodized Aluminum - Red',
    category: 'metal',
    laser: 'fiber',
    maxWidth: 4.7,
    maxHeight: 4.7,
    surfaceColor: '#8b2020',
    engraveColor: '#c0c0c0',
    pricePerSqIn: 0.35,
    description: 'Engraves silver on red'
  },
  'anodized-gold': {
    name: 'Anodized Aluminum - Gold',
    category: 'metal',
    laser: 'fiber',
    maxWidth: 4.7,
    maxHeight: 4.7,
    surfaceColor: '#b8860b',
    engraveColor: '#c0c0c0',
    pricePerSqIn: 0.40,
    description: 'Premium look'
  },

  // === PLASTIC LABELS/SIGNS (CO2 Laser) ===
  'abs-black-white': {
    name: 'ABS Plastic - Black/White',
    category: 'plastic',
    laser: 'co2',
    maxWidth: 12,
    maxHeight: 24,
    surfaceColor: '#1a1a1a',
    engraveColor: '#ffffff',
    pricePerSqIn: 0.20,
    description: 'Most popular for labels'
  },
  'abs-white-black': {
    name: 'ABS Plastic - White/Black',
    category: 'plastic',
    laser: 'co2',
    maxWidth: 12,
    maxHeight: 24,
    surfaceColor: '#f5f5f5',
    engraveColor: '#1a1a1a',
    pricePerSqIn: 0.20,
    description: 'Clean professional look'
  },
  'abs-blue-white': {
    name: 'ABS Plastic - Blue/White',
    category: 'plastic',
    laser: 'co2',
    maxWidth: 12,
    maxHeight: 24,
    surfaceColor: '#1e3a5f',
    engraveColor: '#ffffff',
    pricePerSqIn: 0.20,
    description: 'Corporate blue'
  },
  'abs-red-white': {
    name: 'ABS Plastic - Red/White',
    category: 'plastic',
    laser: 'co2',
    maxWidth: 12,
    maxHeight: 24,
    surfaceColor: '#8b2020',
    engraveColor: '#ffffff',
    pricePerSqIn: 0.20,
    description: 'Warning/alert labels'
  },
  'abs-yellow-black': {
    name: 'ABS Plastic - Yellow/Black',
    category: 'plastic',
    laser: 'co2',
    maxWidth: 12,
    maxHeight: 24,
    surfaceColor: '#f0c020',
    engraveColor: '#1a1a1a',
    pricePerSqIn: 0.20,
    description: 'Safety/caution labels'
  }
}

// Pre-cut blank sizes (what user stocks)
const BLANK_SIZES = {
  // Small tags (fiber laser)
  '1x0.5': { width: 1, height: 0.5, name: '1" × ½"', category: 'small' },
  '1.5x0.75': { width: 1.5, height: 0.75, name: '1½" × ¾"', category: 'small' },
  '2x1': { width: 2, height: 1, name: '2" × 1"', category: 'small' },
  '3x1': { width: 3, height: 1, name: '3" × 1"', category: 'medium' },
  '3x1.5': { width: 3, height: 1.5, name: '3" × 1½"', category: 'medium' },
  // Credit card size
  '3.375x2.125': { width: 3.375, height: 2.125, name: '3⅜" × 2⅛" (Card)', category: 'medium' },
  // Medium labels
  '4x2': { width: 4, height: 2, name: '4" × 2"', category: 'medium' },
  '4x3': { width: 4, height: 3, name: '4" × 3"', category: 'medium' },
  // Round tags
  '1-round': { width: 1, height: 1, name: '1" Round', category: 'round', shape: 'round' },
  '1.5-round': { width: 1.5, height: 1.5, name: '1½" Round', category: 'round', shape: 'round' },
  '2-round': { width: 2, height: 2, name: '2" Round', category: 'round', shape: 'round' },
  // Large labels (CO2 only)
  '6x4': { width: 6, height: 4, name: '6" × 4"', category: 'large' },
  '8x4': { width: 8, height: 4, name: '8" × 4"', category: 'large' },
  '10x6': { width: 10, height: 6, name: '10" × 6"', category: 'large' },
  '12x8': { width: 12, height: 8, name: '12" × 8"', category: 'large' },
  // Custom
  'custom': { width: 0, height: 0, name: 'Custom Size', category: 'custom' }
}

// Mounting options - simplified to what's actually available
const MOUNTING_OPTIONS = {
  'none': { name: 'No Mounting (bare)', positions: [], price: 0 },
  '1-hole-top': { name: '1 Hole (Top Center)', positions: ['top-center'], price: 0 },
  '2-holes-top': { name: '2 Holes (Top Corners)', positions: ['top-left', 'top-right'], price: 0 },
  '4-holes': { name: '4 Holes (Corners)', positions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], price: 0 },
  'adhesive': { name: 'Adhesive Backing', positions: [], price: 0.50, description: '3M industrial adhesive' }
}

// Shape options
const SHAPES = {
  'rectangle': { name: 'Rectangle', cornerRadius: 0 },
  'rounded': { name: 'Rounded Rectangle', cornerRadius: 0.125 },
  'round': { name: 'Round/Oval', cornerRadius: 'full' },
  'chamfered': { name: 'Chamfered Corners', cornerRadius: 'chamfer' }
}

// Font options
const FONTS = [
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif' },
  { id: 'arial-bold', name: 'Arial Bold', family: 'Arial, sans-serif', weight: 'bold' },
  { id: 'arial-narrow', name: 'Arial Narrow', family: 'Arial Narrow, sans-serif' },
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica, sans-serif' },
  { id: 'times', name: 'Times New Roman', family: 'Times New Roman, serif' },
  { id: 'courier', name: 'Courier (Mono)', family: 'Courier New, monospace' },
  { id: 'impact', name: 'Impact', family: 'Impact, sans-serif' },
  { id: 'stencil', name: 'Stencil', family: 'Stencil, Impact, sans-serif' },
  { id: 'ocr', name: 'OCR (Machine)', family: 'OCR A Std, Courier New, monospace' }
]

// Design element types
interface TextElement {
  id: string
  type: 'text'
  content: string
  x: number // percentage from left
  y: number // percentage from top
  fontSize: number // in points, will scale
  fontId: string
  alignment: 'left' | 'center' | 'right'
  bold: boolean
}

interface ShapeElement {
  id: string
  type: 'shape'
  shapeType: 'line' | 'rect' | 'circle'
  x: number
  y: number
  width: number
  height: number
  strokeWidth: number
}

interface QRElement {
  id: string
  type: 'qr'
  value: string
  x: number
  y: number
  size: number // percentage of label width
}

interface BarcodeElement {
  id: string
  type: 'barcode'
  value: string
  x: number
  y: number
  width: number
  height: number
}

type DesignElement = TextElement | ShapeElement | QRElement | BarcodeElement

// Main data structure
export interface LabelDesignData {
  material: string
  size: string
  customWidth: number
  customHeight: number
  shape: string
  mounting: string
  holeDiameter: number
  cornerRadius: number
  elements: DesignElement[]
  quantity: number
  pricePerUnit: number
  totalPrice: number
}

interface Props {
  onChange: (data: LabelDesignData) => void
  initialQuantity?: number
}

export default function LabelDesigner({ onChange, initialQuantity = 1 }: Props) {
  // Canvas ref for interactions
  const canvasRef = useRef<SVGSVGElement>(null)

  // Design state
  const [material, setMaterial] = useState('abs-black-white')
  const [size, setSize] = useState('3x1.5')
  const [customWidth, setCustomWidth] = useState(3)
  const [customHeight, setCustomHeight] = useState(2)
  const [shape, setShape] = useState('rounded')
  const [mounting, setHoleConfig] = useState('none')
  const [holeDiameter, setHoleDiameter] = useState(0.125)
  const [cornerRadius, setCornerRadius] = useState(0.125)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [quantity, setQuantity] = useState(initialQuantity)

  // UI state
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'material' | 'size' | 'design' | 'elements'>('material')
  const [isDragging, setIsDragging] = useState(false)

  // Get current material and size info
  const mat = MATERIALS[material as keyof typeof MATERIALS]
  const sizeInfo = BLANK_SIZES[size as keyof typeof BLANK_SIZES]

  // Calculate actual dimensions
  const labelWidth = size === 'custom' ? customWidth : sizeInfo.width
  const labelHeight = size === 'custom' ? customHeight : sizeInfo.height
  const isRound = size.includes('round') || shape === 'round'

  // Filter available sizes based on material's laser constraints
  const availableSizes = Object.entries(BLANK_SIZES).filter(([key, s]) => {
    if (key === 'custom') return true
    return s.width <= mat.maxWidth && s.height <= mat.maxHeight
  })

  // Calculate price
  const calculatePrice = useCallback(() => {
    const area = labelWidth * labelHeight
    let price = area * mat.pricePerSqIn

    // Minimum price
    price = Math.max(price, 3)

    // Add-ons
    const holes = MOUNTING_OPTIONS[mounting as keyof typeof MOUNTING_OPTIONS]
    price += holes.price

    // Element add-ons
    elements.forEach(el => {
      if (el.type === 'qr') price += 1
      if (el.type === 'barcode') price += 0.75
    })

    // Volume discount
    if (quantity >= 100) price *= 0.80
    else if (quantity >= 50) price *= 0.85
    else if (quantity >= 25) price *= 0.90
    else if (quantity >= 10) price *= 0.95

    return Math.round(price * 100) / 100
  }, [labelWidth, labelHeight, mat.pricePerSqIn, mounting, elements, quantity])

  const pricePerUnit = calculatePrice()
  const totalPrice = Math.round(pricePerUnit * quantity * 100) / 100

  // Notify parent of changes
  useEffect(() => {
    onChange({
      material,
      size,
      customWidth,
      customHeight,
      shape: isRound ? 'round' : shape,
      mounting,
      holeDiameter,
      cornerRadius,
      elements,
      quantity,
      pricePerUnit,
      totalPrice
    })
  }, [material, size, customWidth, customHeight, shape, mounting, holeDiameter, cornerRadius, elements, quantity, pricePerUnit, totalPrice, onChange, isRound])

  // Add a text element
  const addTextElement = () => {
    const newElement: TextElement = {
      id: crypto.randomUUID(),
      type: 'text',
      content: 'Text',
      x: 50,
      y: 50,
      fontSize: 14,
      fontId: 'arial-bold',
      alignment: 'center',
      bold: true
    }
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
  }

  // Add QR code
  const addQRElement = () => {
    const newElement: QRElement = {
      id: crypto.randomUUID(),
      type: 'qr',
      value: 'https://vurmz.com',
      x: 80,
      y: 50,
      size: 25
    }
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
  }

  // Add shape
  const addShapeElement = (shapeType: 'line' | 'rect' | 'circle') => {
    const newElement: ShapeElement = {
      id: crypto.randomUUID(),
      type: 'shape',
      shapeType,
      x: 50,
      y: 50,
      width: 20,
      height: shapeType === 'line' ? 0 : 10,
      strokeWidth: 2
    }
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
  }

  // Update element
  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, ...updates } as DesignElement : el
    ))
  }

  // Delete element
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElement === id) setSelectedElement(null)
  }

  // Get selected element
  const selected = elements.find(el => el.id === selectedElement)

  // Preview dimensions (scale to fit)
  const previewMaxWidth = 400
  const previewMaxHeight = 250
  const scale = Math.min(previewMaxWidth / labelWidth, previewMaxHeight / labelHeight, 80)
  const previewWidth = labelWidth * scale
  const previewHeight = labelHeight * scale

  // Render hole positions
  const renderHoles = () => {
    const config = MOUNTING_OPTIONS[mounting as keyof typeof MOUNTING_OPTIONS]
    if (!config.positions.length) return null

    const holeRadius = (holeDiameter / 2) * scale
    const margin = 0.15 * scale // margin from edge

    return config.positions.map((pos, i) => {
      let cx = 0, cy = 0

      switch (pos) {
        case 'top-center':
          cx = previewWidth / 2
          cy = margin + holeRadius
          break
        case 'top-left':
          cx = margin + holeRadius + (isRound ? previewWidth * 0.15 : 0)
          cy = margin + holeRadius + (isRound ? previewHeight * 0.15 : 0)
          break
        case 'top-right':
          cx = previewWidth - margin - holeRadius - (isRound ? previewWidth * 0.15 : 0)
          cy = margin + holeRadius + (isRound ? previewHeight * 0.15 : 0)
          break
        case 'bottom-left':
          cx = margin + holeRadius + (isRound ? previewWidth * 0.15 : 0)
          cy = previewHeight - margin - holeRadius - (isRound ? previewHeight * 0.15 : 0)
          break
        case 'bottom-right':
          cx = previewWidth - margin - holeRadius - (isRound ? previewWidth * 0.15 : 0)
          cy = previewHeight - margin - holeRadius - (isRound ? previewHeight * 0.15 : 0)
          break
        case 'left':
          cx = margin + holeRadius
          cy = previewHeight / 2
          break
        case 'right':
          cx = previewWidth - margin - holeRadius
          cy = previewHeight / 2
          break
        case 'keychain':
          cx = previewWidth / 2
          cy = margin + holeRadius
          break
        case 'cable-slot':
          // Render as slot instead
          return (
            <rect
              key={i}
              x={previewWidth / 2 - 8}
              y={4}
              width={16}
              height={6}
              rx={3}
              fill="#333"
              stroke="#222"
              strokeWidth={1}
            />
          )
      }

      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={holeRadius}
          fill="#333"
          stroke="#222"
          strokeWidth={1}
        />
      )
    })
  }

  // Get label path based on shape
  const getLabelPath = () => {
    if (isRound) {
      const rx = previewWidth / 2
      const ry = previewHeight / 2
      return `M ${rx},0 A ${rx},${ry} 0 1,1 ${rx},${previewHeight} A ${rx},${ry} 0 1,1 ${rx},0`
    }

    const r = shape === 'rounded' ? Math.min(cornerRadius * scale, previewWidth / 4, previewHeight / 4) :
              shape === 'chamfered' ? Math.min(8, previewWidth / 6, previewHeight / 6) : 2

    if (shape === 'chamfered') {
      return `M ${r},0 L ${previewWidth - r},0 L ${previewWidth},${r} L ${previewWidth},${previewHeight - r} L ${previewWidth - r},${previewHeight} L ${r},${previewHeight} L 0,${previewHeight - r} L 0,${r} Z`
    }

    return `M ${r},0 L ${previewWidth - r},0 Q ${previewWidth},0 ${previewWidth},${r} L ${previewWidth},${previewHeight - r} Q ${previewWidth},${previewHeight} ${previewWidth - r},${previewHeight} L ${r},${previewHeight} Q 0,${previewHeight} 0,${previewHeight - r} L 0,${r} Q 0,0 ${r},0`
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-4">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <span className="text-vurmz-teal font-black tracking-tight">VURKSHOP</span>
          <span className="text-gray-500 text-sm font-normal ml-1">by VURMZ</span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">Design your custom labels & signs - we laser engrave them</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: 'material', label: 'Material', icon: '1' },
            { id: 'size', label: 'Size & Shape', icon: '2' },
            { id: 'design', label: 'Design', icon: '3' },
            { id: 'elements', label: 'Elements', icon: '4' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-vurmz-teal text-vurmz-teal bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}.</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel - Controls */}
        <div className="p-6 border-r border-gray-200 max-h-[600px] overflow-y-auto">

          {/* Material Selection */}
          {activeTab === 'material' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Select Material</h4>
              <div className="space-y-2">
                {Object.entries(MATERIALS).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMaterial(key)
                      // Reset size if current size exceeds new material limits
                      const currentSize = BLANK_SIZES[size as keyof typeof BLANK_SIZES]
                      if (currentSize && (currentSize.width > m.maxWidth || currentSize.height > m.maxHeight)) {
                        setSize('3x1.5')
                      }
                    }}
                    className={`w-full p-3 border-2 rounded-lg flex items-center gap-3 transition-all text-left ${
                      material === key
                        ? 'border-vurmz-teal bg-vurmz-teal/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-12 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: m.surfaceColor, color: m.engraveColor }}
                    >
                      ABC
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Max {m.maxWidth}"×{m.maxHeight}"
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size & Shape Selection */}
          {activeTab === 'size' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Select Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableSizes.map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => setSize(key)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        size === key
                          ? 'border-vurmz-teal bg-vurmz-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{s.name}</div>
                      {key !== 'custom' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {s.category === 'round' ? 'Round tag' : `${s.width}" × ${s.height}"`}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {size === 'custom' && (
                  <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width (in)</label>
                      <input
                        type="number"
                        step="0.125"
                        min="0.5"
                        max={mat.maxWidth}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Height (in)</label>
                      <input
                        type="number"
                        step="0.125"
                        min="0.5"
                        max={mat.maxHeight}
                        value={customHeight}
                        onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <p className="col-span-2 text-xs text-gray-500">
                      Max size for {mat.name}: {mat.maxWidth}" × {mat.maxHeight}"
                    </p>
                  </div>
                )}
              </div>

              {!size.includes('round') && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Shape</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(SHAPES).map(([key, s]) => (
                      <button
                        key={key}
                        onClick={() => setShape(key)}
                        className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                          shape === key
                            ? 'border-vurmz-teal bg-vurmz-teal/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>

                  {shape === 'rounded' && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Corner Radius: {cornerRadius}"
                      </label>
                      <input
                        type="range"
                        min="0.0625"
                        max="0.5"
                        step="0.0625"
                        value={cornerRadius}
                        onChange={(e) => setCornerRadius(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Mounting Holes</h4>
                <div className="space-y-2">
                  {Object.entries(MOUNTING_OPTIONS).map(([key, h]) => (
                    <button
                      key={key}
                      onClick={() => setHoleConfig(key)}
                      className={`w-full p-3 border-2 rounded-lg text-left text-sm transition-all ${
                        mounting === key
                          ? 'border-vurmz-teal bg-vurmz-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{h.name}</span>
                      {h.price > 0 && (
                        <span className="text-vurmz-teal text-xs ml-2">+${h.price.toFixed(2)}</span>
                      )}
                    </button>
                  ))}
                </div>

                {mounting !== 'none' && mounting !== 'cable-tie' && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Hole Diameter: {holeDiameter}"
                    </label>
                    <input
                      type="range"
                      min="0.0625"
                      max="0.25"
                      step="0.0625"
                      value={holeDiameter}
                      onChange={(e) => setHoleDiameter(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Design - Text Elements */}
          {activeTab === 'design' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Text Elements</h4>
                <button
                  onClick={addTextElement}
                  className="px-3 py-1.5 bg-vurmz-teal text-white text-sm font-medium rounded-lg hover:bg-vurmz-teal-dark transition-colors"
                >
                  + Add Text
                </button>
              </div>

              {elements.filter(el => el.type === 'text').length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                  Click "Add Text" to add your first text element
                </p>
              ) : (
                <div className="space-y-3">
                  {elements.filter(el => el.type === 'text').map((el) => {
                    const textEl = el as TextElement
                    return (
                      <div
                        key={el.id}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedElement === el.id
                            ? 'border-vurmz-teal bg-vurmz-teal/5'
                            : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedElement(el.id)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <input
                            type="text"
                            value={textEl.content}
                            onChange={(e) => updateElement(el.id, { content: e.target.value })}
                            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm font-medium"
                            placeholder="Enter text..."
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteElement(el.id) }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-gray-500">Font</label>
                            <select
                              value={textEl.fontId}
                              onChange={(e) => updateElement(el.id, { fontId: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                            >
                              {FONTS.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-gray-500">Size</label>
                            <input
                              type="number"
                              min="6"
                              max="72"
                              value={textEl.fontSize}
                              onChange={(e) => updateElement(el.id, { fontSize: parseInt(e.target.value) || 12 })}
                              className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-gray-500">Align</label>
                            <div className="flex gap-1 mt-1">
                              {(['left', 'center', 'right'] as const).map(align => (
                                <button
                                  key={align}
                                  onClick={() => updateElement(el.id, { alignment: align })}
                                  className={`flex-1 py-1 border rounded text-xs ${
                                    textEl.alignment === align
                                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {align[0].toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-gray-500">Position Y</label>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              value={textEl.y}
                              onChange={(e) => updateElement(el.id, { y: parseInt(e.target.value) })}
                              className="w-full mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Elements - QR, Shapes */}
          {activeTab === 'elements' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Add Elements</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={addQRElement}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-vurmz-teal hover:bg-vurmz-teal/5 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">▣</div>
                    <div className="text-sm font-medium">QR Code</div>
                    <div className="text-xs text-vurmz-teal">+$1.00</div>
                  </button>
                  <button
                    onClick={() => addShapeElement('line')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-vurmz-teal hover:bg-vurmz-teal/5 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">─</div>
                    <div className="text-sm font-medium">Line</div>
                  </button>
                  <button
                    onClick={() => addShapeElement('rect')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-vurmz-teal hover:bg-vurmz-teal/5 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">□</div>
                    <div className="text-sm font-medium">Rectangle</div>
                  </button>
                  <button
                    onClick={() => addShapeElement('circle')}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-vurmz-teal hover:bg-vurmz-teal/5 transition-all text-center"
                  >
                    <div className="text-2xl mb-1">○</div>
                    <div className="text-sm font-medium">Circle</div>
                  </button>
                </div>
              </div>

              {/* QR Elements */}
              {elements.filter(el => el.type === 'qr').length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">QR Codes</h4>
                  <div className="space-y-3">
                    {elements.filter(el => el.type === 'qr').map((el) => {
                      const qrEl = el as QRElement
                      return (
                        <div key={el.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">QR Code</span>
                            <button
                              onClick={() => deleteElement(el.id)}
                              className="text-red-500 text-xs hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            value={qrEl.value}
                            onChange={(e) => updateElement(el.id, { value: e.target.value })}
                            placeholder="URL or text to encode"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          />
                          <div className="mt-2">
                            <label className="text-xs text-gray-500">Size: {qrEl.size}%</label>
                            <input
                              type="range"
                              min="15"
                              max="40"
                              value={qrEl.size}
                              onChange={(e) => updateElement(el.id, { size: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Shape Elements */}
              {elements.filter(el => el.type === 'shape').length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Shapes</h4>
                  <div className="space-y-2">
                    {elements.filter(el => el.type === 'shape').map((el) => {
                      const shapeEl = el as ShapeElement
                      return (
                        <div key={el.id} className="p-3 border rounded-lg bg-gray-50 flex items-center justify-between">
                          <span className="text-sm">
                            {shapeEl.shapeType === 'line' ? 'Line' :
                             shapeEl.shapeType === 'rect' ? 'Rectangle' : 'Circle'}
                          </span>
                          <button
                            onClick={() => deleteElement(el.id)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Quantity</h4>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium"
                />
                {quantity >= 10 && (
                  <p className="text-xs text-green-600 mt-2">
                    {quantity >= 100 ? '20% volume discount applied!' :
                     quantity >= 50 ? '15% volume discount applied!' :
                     quantity >= 25 ? '10% volume discount applied!' :
                     '5% volume discount applied!'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="bg-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">Live Preview</span>
            <span className="text-xs text-gray-500">{labelWidth}" × {labelHeight}"</span>
          </div>

          {/* Canvas Preview */}
          <div className="bg-[repeating-linear-gradient(45deg,#e8e8e8,#e8e8e8_10px,#f0f0f0_10px,#f0f0f0_20px)] rounded-xl p-8 flex items-center justify-center min-h-[300px]">
            <svg
              ref={canvasRef}
              width={previewWidth}
              height={previewHeight}
              viewBox={`0 0 ${previewWidth} ${previewHeight}`}
              className="drop-shadow-xl"
            >
              <defs>
                <linearGradient id="labelShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
                </linearGradient>
              </defs>

              {/* Label Background */}
              <path
                d={getLabelPath()}
                fill={mat.surfaceColor}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
              />
              <path
                d={getLabelPath()}
                fill="url(#labelShine)"
              />

              {/* Holes */}
              {renderHoles()}

              {/* Design Elements */}
              {elements.map(el => {
                if (el.type === 'text') {
                  const textEl = el as TextElement
                  const font = FONTS.find(f => f.id === textEl.fontId)
                  const x = textEl.alignment === 'left' ? previewWidth * 0.08 :
                           textEl.alignment === 'right' ? previewWidth * 0.92 :
                           previewWidth / 2
                  const scaledFontSize = (textEl.fontSize / 72) * scale * 4 // Scale font size

                  return (
                    <text
                      key={el.id}
                      x={x}
                      y={previewHeight * (textEl.y / 100)}
                      textAnchor={textEl.alignment === 'left' ? 'start' : textEl.alignment === 'right' ? 'end' : 'middle'}
                      fill={mat.engraveColor}
                      fontSize={scaledFontSize}
                      fontFamily={font?.family || 'Arial'}
                      fontWeight={font?.weight || (textEl.bold ? 'bold' : 'normal')}
                      className={selectedElement === el.id ? 'cursor-move' : ''}
                      onClick={() => setSelectedElement(el.id)}
                    >
                      {textEl.content || 'Text'}
                    </text>
                  )
                }

                if (el.type === 'qr') {
                  const qrEl = el as QRElement
                  const qrSize = (qrEl.size / 100) * previewWidth
                  const qrX = (qrEl.x / 100) * previewWidth - qrSize / 2
                  const qrY = (qrEl.y / 100) * previewHeight - qrSize / 2

                  // Simplified QR placeholder
                  return (
                    <g key={el.id} onClick={() => setSelectedElement(el.id)}>
                      <rect
                        x={qrX}
                        y={qrY}
                        width={qrSize}
                        height={qrSize}
                        fill={mat.engraveColor}
                        rx={2}
                      />
                      <rect
                        x={qrX + 2}
                        y={qrY + 2}
                        width={qrSize - 4}
                        height={qrSize - 4}
                        fill={mat.surfaceColor}
                        rx={1}
                      />
                      <text
                        x={qrX + qrSize / 2}
                        y={qrY + qrSize / 2 + 3}
                        textAnchor="middle"
                        fill={mat.engraveColor}
                        fontSize={qrSize * 0.25}
                      >
                        QR
                      </text>
                    </g>
                  )
                }

                if (el.type === 'shape') {
                  const shapeEl = el as ShapeElement
                  const sx = (shapeEl.x / 100) * previewWidth
                  const sy = (shapeEl.y / 100) * previewHeight
                  const sw = (shapeEl.width / 100) * previewWidth
                  const sh = (shapeEl.height / 100) * previewHeight

                  if (shapeEl.shapeType === 'line') {
                    return (
                      <line
                        key={el.id}
                        x1={sx - sw / 2}
                        y1={sy}
                        x2={sx + sw / 2}
                        y2={sy}
                        stroke={mat.engraveColor}
                        strokeWidth={shapeEl.strokeWidth}
                        onClick={() => setSelectedElement(el.id)}
                      />
                    )
                  }

                  if (shapeEl.shapeType === 'rect') {
                    return (
                      <rect
                        key={el.id}
                        x={sx - sw / 2}
                        y={sy - sh / 2}
                        width={sw}
                        height={sh}
                        fill="none"
                        stroke={mat.engraveColor}
                        strokeWidth={shapeEl.strokeWidth}
                        onClick={() => setSelectedElement(el.id)}
                      />
                    )
                  }

                  if (shapeEl.shapeType === 'circle') {
                    return (
                      <ellipse
                        key={el.id}
                        cx={sx}
                        cy={sy}
                        rx={sw / 2}
                        ry={sh / 2}
                        fill="none"
                        stroke={mat.engraveColor}
                        strokeWidth={shapeEl.strokeWidth}
                        onClick={() => setSelectedElement(el.id)}
                      />
                    )
                  }
                }

                return null
              })}
            </svg>
          </div>

          {/* Pricing */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Price per label</span>
              <span className="text-xl font-bold text-gray-800">${pricePerUnit.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Total ({quantity} labels)</span>
              <span className="text-2xl font-bold text-vurmz-teal">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Specs Summary */}
          <div className="mt-4 p-3 bg-white rounded-lg text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Material:</span>
              <span className="font-medium text-gray-800">{mat.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium text-gray-800">{labelWidth}" × {labelHeight}"</span>
            </div>
            <div className="flex justify-between">
              <span>Shape:</span>
              <span className="font-medium text-gray-800">{isRound ? 'Round' : SHAPES[shape as keyof typeof SHAPES]?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Holes:</span>
              <span className="font-medium text-gray-800">{MOUNTING_OPTIONS[mounting as keyof typeof MOUNTING_OPTIONS]?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Elements:</span>
              <span className="font-medium text-gray-800">{elements.length} items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to generate description for quote
export function generateLabelDescription(data: LabelDesignData): string {
  const mat = MATERIALS[data.material as keyof typeof MATERIALS]
  const holes = MOUNTING_OPTIONS[data.mounting as keyof typeof MOUNTING_OPTIONS]

  let desc = `=== VURKSHOP Custom Label Order ===\n`
  desc += `Material: ${mat?.name || data.material}\n`
  desc += `Size: ${data.size === 'custom' ? `${data.customWidth}" × ${data.customHeight}"` : BLANK_SIZES[data.size as keyof typeof BLANK_SIZES]?.name}\n`
  desc += `Shape: ${data.shape}\n`
  desc += `Holes: ${holes?.name || 'None'}\n`
  desc += `Quantity: ${data.quantity}\n`
  desc += `\n--- Design Elements ---\n`

  data.elements.forEach((el, i) => {
    if (el.type === 'text') {
      const textEl = el as TextElement
      desc += `Text ${i + 1}: "${textEl.content}" (${textEl.fontId}, ${textEl.fontSize}pt)\n`
    } else if (el.type === 'qr') {
      const qrEl = el as QRElement
      desc += `QR Code: ${qrEl.value}\n`
    } else if (el.type === 'shape') {
      const shapeEl = el as ShapeElement
      desc += `Shape: ${shapeEl.shapeType}\n`
    }
  })

  desc += `\nPrice per unit: $${data.pricePerUnit.toFixed(2)}\n`
  desc += `Total: $${data.totalPrice.toFixed(2)}\n`

  return desc
}

// Generate Lightburn-ready SVG file
export function generateLabelSVG(data: LabelDesignData): string {
  const mat = MATERIALS[data.material as keyof typeof MATERIALS]
  if (!mat) return ''

  const sizeInfo = BLANK_SIZES[data.size as keyof typeof BLANK_SIZES]
  const labelWidth = data.size === 'custom' ? data.customWidth : sizeInfo?.width || 3
  const labelHeight = data.size === 'custom' ? data.customHeight : sizeInfo?.height || 2
  const isRound = data.size.includes('round') || data.shape === 'round'

  // Use inches as units (96 DPI standard)
  const dpi = 96
  const widthPx = labelWidth * dpi
  const heightPx = labelHeight * dpi

  // Build SVG with real dimensions
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${labelWidth}in"
     height="${labelHeight}in"
     viewBox="0 0 ${widthPx} ${heightPx}">
  <!-- VURKSHOP by VURMZ - ${mat.name} ${labelWidth}" x ${labelHeight}" -->
  <!-- Import into Lightburn: File > Import -->

  <!-- Label outline (for alignment reference - delete or set to no output) -->
  <g id="outline" style="stroke:#0000ff;stroke-width:0.5;fill:none;">
`

  if (isRound) {
    svg += `    <ellipse cx="${widthPx / 2}" cy="${heightPx / 2}" rx="${widthPx / 2 - 2}" ry="${heightPx / 2 - 2}"/>\n`
  } else {
    const r = data.shape === 'rounded' ? Math.min(data.cornerRadius * dpi, widthPx / 4) : 2
    svg += `    <rect x="2" y="2" width="${widthPx - 4}" height="${heightPx - 4}" rx="${r}"/>\n`
  }

  svg += `  </g>\n\n`

  // Mounting holes
  const mountConfig = MOUNTING_OPTIONS[data.mounting as keyof typeof MOUNTING_OPTIONS]
  if (mountConfig && mountConfig.positions.length > 0) {
    svg += `  <!-- Mounting holes (set to cut in Lightburn) -->\n`
    svg += `  <g id="holes" style="stroke:#ff0000;stroke-width:0.5;fill:none;">\n`

    const holeR = (data.holeDiameter / 2) * dpi
    const margin = 0.15 * dpi

    mountConfig.positions.forEach(pos => {
      let cx = 0, cy = 0
      switch (pos) {
        case 'top-center': cx = widthPx / 2; cy = margin + holeR; break
        case 'top-left': cx = margin + holeR; cy = margin + holeR; break
        case 'top-right': cx = widthPx - margin - holeR; cy = margin + holeR; break
        case 'bottom-left': cx = margin + holeR; cy = heightPx - margin - holeR; break
        case 'bottom-right': cx = widthPx - margin - holeR; cy = heightPx - margin - holeR; break
      }
      if (cx && cy) {
        svg += `    <circle cx="${cx}" cy="${cy}" r="${holeR}"/>\n`
      }
    })

    svg += `  </g>\n\n`
  }

  // Engrave elements
  svg += `  <!-- Engrave elements (set to engrave/fill in Lightburn) -->\n`
  svg += `  <g id="engrave" style="fill:#000000;">\n`

  data.elements.forEach(el => {
    if (el.type === 'text') {
      const textEl = el as TextElement
      const font = FONTS.find(f => f.id === textEl.fontId)
      const x = textEl.alignment === 'left' ? widthPx * 0.08 :
               textEl.alignment === 'right' ? widthPx * 0.92 :
               widthPx / 2
      const y = heightPx * (textEl.y / 100)
      const anchor = textEl.alignment === 'left' ? 'start' : textEl.alignment === 'right' ? 'end' : 'middle'

      svg += `    <text x="${x}" y="${y}" text-anchor="${anchor}" `
      svg += `font-family="${font?.family || 'Arial'}" `
      svg += `font-size="${textEl.fontSize}" `
      if (textEl.bold || font?.weight === 'bold') svg += `font-weight="bold" `
      svg += `>${textEl.content}</text>\n`
    }

    if (el.type === 'shape') {
      const shapeEl = el as ShapeElement
      const sx = (shapeEl.x / 100) * widthPx
      const sy = (shapeEl.y / 100) * heightPx
      const sw = (shapeEl.width / 100) * widthPx
      const sh = (shapeEl.height / 100) * heightPx

      if (shapeEl.shapeType === 'line') {
        svg += `    <line x1="${sx - sw / 2}" y1="${sy}" x2="${sx + sw / 2}" y2="${sy}" stroke="#000" stroke-width="${shapeEl.strokeWidth}"/>\n`
      } else if (shapeEl.shapeType === 'rect') {
        svg += `    <rect x="${sx - sw / 2}" y="${sy - sh / 2}" width="${sw}" height="${sh}" fill="none" stroke="#000" stroke-width="${shapeEl.strokeWidth}"/>\n`
      } else if (shapeEl.shapeType === 'circle') {
        svg += `    <ellipse cx="${sx}" cy="${sy}" rx="${sw / 2}" ry="${sh / 2}" fill="none" stroke="#000" stroke-width="${shapeEl.strokeWidth}"/>\n`
      }
    }

    if (el.type === 'qr') {
      const qrEl = el as QRElement
      const qrSize = (qrEl.size / 100) * widthPx
      const qrX = (qrEl.x / 100) * widthPx - qrSize / 2
      const qrY = (qrEl.y / 100) * heightPx - qrSize / 2
      // QR placeholder - actual QR would need to be generated
      svg += `    <!-- QR Code: ${qrEl.value} - Generate actual QR and place here -->\n`
      svg += `    <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" fill="none" stroke="#000" stroke-width="1"/>\n`
      svg += `    <text x="${qrX + qrSize / 2}" y="${qrY + qrSize / 2 + 4}" text-anchor="middle" font-size="8">QR: ${qrEl.value.slice(0, 20)}...</text>\n`
    }
  })

  svg += `  </g>\n`
  svg += `</svg>`

  return svg
}
