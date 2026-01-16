'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Photorealistic 3D preview
const PlasticSign3D = dynamic(() => import('./builder/visualizers/PlasticSign3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[260px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-vurmz-teal/30 border-t-vurmz-teal rounded-full animate-spin" />
        <div className="text-gray-400 text-sm">Loading 3D Preview...</div>
      </div>
    </div>
  ),
})

// ============================================================================
// PREMIUM INDUSTRIAL LABELS, TAGS & NAMETAGS DESIGNER
// Comprehensive designer for all tag/label products with premium UX
// ============================================================================

// Tag/Label Types with specific configurations
const TAG_TYPES = {
  'nametag': {
    name: 'Professional Nametags',
    description: 'Employee badges, event tags, hospitality staff',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <line x1="6" y1="11" x2="18" y2="11" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    ),
    materials: ['plastic-black', 'plastic-blue', 'plastic-red', 'plastic-green', 'plastic-gold', 'plastic-silver', 'plastic-burgundy', 'plastic-white'],
    defaultSize: 'nametag-standard',
    hasShapes: true,
    hasAttachment: true,
    connectorRequired: false
  },
  'valve-tag': {
    name: 'Valve Tags',
    description: 'Brass tags with compliant connectors for industrial valve ID',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="14" r="8" />
        <circle cx="12" cy="6" r="2" />
        <line x1="12" y1="8" x2="12" y2="10" />
      </svg>
    ),
    materials: ['brass', 'stainless', 'anodized-black'],
    defaultSize: '1.5-round',
    hasShapes: false,
    hasAttachment: false,
    connectorRequired: true
  },
  'asset-tag': {
    name: 'Asset Tags',
    description: 'Equipment tracking, inventory management, property ID',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="7" width="18" height="10" rx="1" />
        <line x1="7" y1="10" x2="17" y2="10" />
        <line x1="7" y1="13" x2="14" y2="13" />
        <circle cx="6" cy="12" r="2" />
      </svg>
    ),
    materials: ['anodized-black', 'anodized-blue', 'anodized-red', 'anodized-gold', 'stainless'],
    defaultSize: '3.375x2.125',
    hasShapes: false,
    hasAttachment: true,
    connectorRequired: false
  },
  'cable-tag': {
    name: 'Cable & Wire Tags',
    description: 'Small tags for cable identification and organization',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="4" width="8" height="4" rx="1" />
        <line x1="12" y1="8" x2="12" y2="20" strokeWidth="3" />
        <circle cx="12" cy="4" r="1" fill="currentColor" />
      </svg>
    ),
    materials: ['anodized-black', 'anodized-blue', 'stainless', 'brass'],
    defaultSize: '1x0.5',
    hasShapes: false,
    hasAttachment: false,
    connectorRequired: false
  },
  'equipment-label': {
    name: 'Equipment Labels',
    description: 'Permanent labels for machinery, control panels, warnings',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="1" />
        <text x="12" y="14" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold">!</text>
        <circle cx="4" cy="8" r="1" fill="currentColor" />
        <circle cx="20" cy="8" r="1" fill="currentColor" />
        <circle cx="4" cy="16" r="1" fill="currentColor" />
        <circle cx="20" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    materials: ['anodized-black', 'anodized-blue', 'anodized-red', 'stainless', 'plastic-black', 'plastic-yellow'],
    defaultSize: '4x2',
    hasShapes: false,
    hasAttachment: true,
    connectorRequired: false
  },
  'safety-tag': {
    name: 'Safety & Warning Tags',
    description: 'High-visibility compliance tags, lockout/tagout',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
        <line x1="12" y1="8" x2="12" y2="13" strokeWidth="2" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    materials: ['anodized-red', 'anodized-yellow', 'plastic-red', 'plastic-yellow', 'stainless'],
    defaultSize: '3x2',
    hasShapes: false,
    hasAttachment: false,
    connectorRequired: false
  },
  'custom': {
    name: 'Custom Tag/Label',
    description: 'Specify your own dimensions and requirements',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    materials: ['anodized-black', 'anodized-blue', 'anodized-red', 'anodized-gold', 'anodized-yellow', 'stainless', 'brass', 'plastic-black', 'plastic-white'],
    defaultSize: 'custom',
    hasShapes: false,
    hasAttachment: true,
    connectorRequired: false
  }
}

// Materials with visual properties and pricing
const MATERIALS = {
  'brass': { name: 'Solid Brass', color: '#B5A642', textColor: '#2a1810', highlight: '#d4c36a', priceMultiplier: 1.5, description: 'Premium, corrosion-resistant' },
  'anodized-black': { name: 'Anodized Aluminum - Black', color: '#1a1a1a', textColor: '#c0c0c0', highlight: '#333', priceMultiplier: 1.0, description: 'Professional, durable' },
  'anodized-blue': { name: 'Anodized Aluminum - Blue', color: '#1e3a5f', textColor: '#c0c0c0', highlight: '#2a4a7f', priceMultiplier: 1.0, description: 'Professional, durable' },
  'anodized-red': { name: 'Anodized Aluminum - Red', color: '#8b0000', textColor: '#f0d080', highlight: '#a52a2a', priceMultiplier: 1.0, description: 'High visibility' },
  'anodized-gold': { name: 'Anodized Aluminum - Gold', color: '#DAA520', textColor: '#1a1a1a', highlight: '#f0d060', priceMultiplier: 1.2, description: 'Premium look' },
  'anodized-yellow': { name: 'Anodized Aluminum - Yellow', color: '#f0c020', textColor: '#1a1a1a', highlight: '#ffe040', priceMultiplier: 1.0, description: 'Safety/warning' },
  'stainless': { name: 'Stainless Steel', color: '#C0C0C0', textColor: '#1a1a1a', highlight: '#e0e0e0', priceMultiplier: 2.0, description: 'Maximum durability' },
  'plastic-black': { name: 'Two-Tone Plastic - Black/White', color: '#1a1a1a', textColor: '#ffffff', highlight: '#333', priceMultiplier: 0.8, description: 'Economical, professional' },
  'plastic-white': { name: 'Two-Tone Plastic - White/Black', color: '#f5f5f5', textColor: '#1a1a1a', highlight: '#fff', priceMultiplier: 0.8, description: 'Clean, professional' },
  'plastic-blue': { name: 'Two-Tone Plastic - Blue/White', color: '#1e3a5f', textColor: '#ffffff', highlight: '#2a5a9f', priceMultiplier: 0.8, description: 'Corporate look' },
  'plastic-red': { name: 'Two-Tone Plastic - Red/White', color: '#8b2635', textColor: '#ffffff', highlight: '#a54050', priceMultiplier: 0.8, description: 'Bold, attention-getting' },
  'plastic-green': { name: 'Two-Tone Plastic - Green/White', color: '#2d5a3c', textColor: '#ffffff', highlight: '#3d7a5c', priceMultiplier: 0.8, description: 'Natural, professional' },
  'plastic-gold': { name: 'Two-Tone Plastic - Gold/Black', color: '#c9a227', textColor: '#1a1a1a', highlight: '#e0b840', priceMultiplier: 0.9, description: 'Elegant, upscale' },
  'plastic-silver': { name: 'Two-Tone Plastic - Silver/Black', color: '#b8b8b8', textColor: '#1a1a1a', highlight: '#d0d0d0', priceMultiplier: 0.85, description: 'Modern, professional' },
  'plastic-burgundy': { name: 'Two-Tone Plastic - Burgundy/Gold', color: '#722f37', textColor: '#f0d080', highlight: '#8a4050', priceMultiplier: 0.85, description: 'Classic, sophisticated' },
  'plastic-yellow': { name: 'Two-Tone Plastic - Yellow/Black', color: '#f0c020', textColor: '#1a1a1a', highlight: '#ffe040', priceMultiplier: 0.8, description: 'High visibility' }
}

// Size options
const SIZES = {
  // Nametag sizes
  'nametag-standard': { name: '3" × 1" (Standard)', width: 3, height: 1, shape: 'rectangle', basePrice: 6 },
  'nametag-large': { name: '3.5" × 1.5" (Large)', width: 3.5, height: 1.5, shape: 'rectangle', basePrice: 7.5 },
  'nametag-executive': { name: '3.5" × 2" (Executive)', width: 3.5, height: 2, shape: 'rectangle', basePrice: 9 },
  // Round sizes (for valve tags)
  '1-round': { name: '1" Round', width: 1, height: 1, shape: 'round', basePrice: 3 },
  '1.5-round': { name: '1.5" Round', width: 1.5, height: 1.5, shape: 'round', basePrice: 4 },
  '2-round': { name: '2" Round', width: 2, height: 2, shape: 'round', basePrice: 5 },
  '2.5-round': { name: '2.5" Round', width: 2.5, height: 2.5, shape: 'round', basePrice: 6 },
  // Credit card size
  '3.375x2.125': { name: '3.375" × 2.125" (Credit Card)', width: 3.375, height: 2.125, shape: 'rectangle', basePrice: 5 },
  // Rectangle sizes
  '1x0.5': { name: '1" × 0.5"', width: 1, height: 0.5, shape: 'rectangle', basePrice: 2 },
  '2x1': { name: '2" × 1"', width: 2, height: 1, shape: 'rectangle', basePrice: 3 },
  '3x1': { name: '3" × 1"', width: 3, height: 1, shape: 'rectangle', basePrice: 4 },
  '3x2': { name: '3" × 2"', width: 3, height: 2, shape: 'rectangle', basePrice: 5 },
  '4x2': { name: '4" × 2"', width: 4, height: 2, shape: 'rectangle', basePrice: 6 },
  '4x3': { name: '4" × 3"', width: 4, height: 3, shape: 'rectangle', basePrice: 8 },
  '6x4': { name: '6" × 4"', width: 6, height: 4, shape: 'rectangle', basePrice: 12 },
  'custom': { name: 'Custom Size', width: 0, height: 0, shape: 'rectangle', basePrice: 0 }
}

// Nametag shapes
const NAMETAG_SHAPES = {
  'rectangle': { name: 'Rectangle', corners: 2 },
  'rounded': { name: 'Rounded Rectangle', corners: 12 },
  'oval': { name: 'Oval', corners: 'oval' },
  'arch-top': { name: 'Arch Top', corners: 'arch' },
  'clipped-corners': { name: 'Clipped Corners', corners: 'clip' },
  'custom': { name: 'Custom Shape', corners: 0 }
}

// Connectors for valve tags
const CONNECTORS = {
  'none': { name: 'No Connector', price: 0 },
  'ball-chain-6': { name: 'Ball Chain (6")', price: 0.50 },
  'ball-chain-12': { name: 'Ball Chain (12")', price: 0.75 },
  'wire-loop': { name: 'S-Hook Wire Loop', price: 0.75 },
  'zip-tie-hole': { name: 'Zip Tie Hole (no hardware)', price: 0 },
  'brass-s-hook': { name: 'Brass S-Hook', price: 1.25 },
  'stainless-cable': { name: 'Stainless Steel Cable Loop', price: 2.00 }
}

// Attachments for tags/labels
const ATTACHMENTS = {
  'none': { name: 'No Attachment', price: 0, description: 'Holes only' },
  'pin': { name: 'Safety Pin', price: 0, description: 'Standard backing' },
  'magnetic': { name: 'Magnetic Back', price: 2.50, description: 'No holes in clothing' },
  'clip': { name: 'Swivel Clip', price: 1.00, description: 'ID badge style' },
  'adhesive-permanent': { name: 'Permanent Adhesive', price: 0.75, description: '3M industrial adhesive' },
  'adhesive-removable': { name: 'Removable Adhesive', price: 1.00, description: 'Repositionable' },
  'velcro': { name: 'Industrial Velcro', price: 1.50, description: 'Hook & loop' }
}

// Font options
const FONTS = [
  { id: 'arial', name: 'Arial', style: 'Arial, sans-serif', weight: 'normal' },
  { id: 'arial-bold', name: 'Arial Bold', style: 'Arial, sans-serif', weight: 'bold' },
  { id: 'helvetica', name: 'Helvetica', style: 'Helvetica Neue, Helvetica, sans-serif', weight: 'normal' },
  { id: 'times', name: 'Times New Roman', style: 'Times New Roman, serif', weight: 'normal' },
  { id: 'georgia', name: 'Georgia', style: 'Georgia, serif', weight: 'normal' },
  { id: 'courier', name: 'Courier (Monospace)', style: 'Courier New, monospace', weight: 'normal' },
  { id: 'ocr', name: 'OCR-A (Machine Readable)', style: 'OCR A Std, Courier New, monospace', weight: 'normal' },
  { id: 'stencil', name: 'Stencil', style: 'Stencil, Impact, sans-serif', weight: 'bold' },
  { id: 'impact', name: 'Impact', style: 'Impact, sans-serif', weight: 'normal' },
  { id: 'script', name: 'Script (Elegant)', style: 'Brush Script MT, cursive', weight: 'normal' }
]

// Data interface
export interface IndustrialTagData {
  tagType: string
  material: string
  size: string
  customWidth: string
  customHeight: string
  nametagShape: string
  connector: string
  attachment: string
  // Text content
  line1: string
  line2: string
  line3: string
  line4: string
  font: string
  // Extras
  includeBarcode: boolean
  barcodeValue: string
  includeQR: boolean
  qrValue: string
  includeLogo: boolean
  logoPosition: 'left' | 'right' | 'top' | 'center'
  includeSerialPlaceholder: boolean
  serialPrefix: string
  serialStartNumber: string
  // Layout
  holePosition: 'top' | 'top-center' | 'left' | 'none'
  textAlignment: 'left' | 'center' | 'right'
  // Notes
  notes: string
  // Calculated
  pricePerUnit: number
}

interface Props {
  onChange: (data: IndustrialTagData) => void
  quantity?: number
}

export default function IndustrialTagPreview({ onChange, quantity = 1 }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<IndustrialTagData>(() => getDefaultIndustrialTagData())

  const steps = [
    { id: 'type', label: 'Type', icon: '1' },
    { id: 'material', label: 'Material & Size', icon: '2' },
    { id: 'content', label: 'Content', icon: '3' },
    { id: 'extras', label: 'Extras', icon: '4' }
  ]

  const tagType = TAG_TYPES[data.tagType as keyof typeof TAG_TYPES] || TAG_TYPES['asset-tag']
  const material = MATERIALS[data.material as keyof typeof MATERIALS] || MATERIALS['anodized-black']
  const sizeInfo = SIZES[data.size as keyof typeof SIZES] || SIZES['3.375x2.125']
  const connector = CONNECTORS[data.connector as keyof typeof CONNECTORS] || CONNECTORS['none']
  const attachment = ATTACHMENTS[data.attachment as keyof typeof ATTACHMENTS] || ATTACHMENTS['none']

  // Calculate dimensions
  const width = data.size === 'custom' ? parseFloat(data.customWidth) || 3 : sizeInfo.width
  const height = data.size === 'custom' ? parseFloat(data.customHeight) || 2 : sizeInfo.height

  // Calculate price
  const calculatePrice = useCallback(() => {
    let basePrice = data.size === 'custom'
      ? Math.max(3, (width * height) * 1.5)
      : sizeInfo.basePrice

    basePrice *= material.priceMultiplier

    if (data.includeBarcode) basePrice += 1
    if (data.includeQR) basePrice += 1
    if (data.includeLogo) basePrice += 1.50
    if (data.includeSerialPlaceholder) basePrice += 0.50

    basePrice += connector.price
    basePrice += attachment.price

    return Math.round(basePrice * 100) / 100
  }, [data, width, height, sizeInfo.basePrice, material.priceMultiplier, connector.price, attachment.price])

  const pricePerTag = calculatePrice()
  const totalPrice = pricePerTag * quantity

  // Update parent on changes
  useEffect(() => {
    onChange({ ...data, pricePerUnit: pricePerTag })
  }, [data, pricePerTag, onChange])

  const update = (updates: Partial<IndustrialTagData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  // Get available sizes for selected tag type
  const getAvailableSizes = () => {
    if (data.tagType === 'nametag') {
      return Object.entries(SIZES).filter(([key]) => key.startsWith('nametag') || key === 'custom')
    }
    if (data.tagType === 'valve-tag') {
      return Object.entries(SIZES).filter(([key]) => key.includes('round') || key === 'custom')
    }
    return Object.entries(SIZES).filter(([key]) => !key.includes('round') && !key.startsWith('nametag'))
  }

  // Get available materials for selected tag type
  const getAvailableMaterials = () => {
    const type = TAG_TYPES[data.tagType as keyof typeof TAG_TYPES]
    if (!type) return Object.entries(MATERIALS)
    return Object.entries(MATERIALS).filter(([key]) => type.materials.includes(key))
  }

  // Preview scale
  const maxPreviewWidth = 320
  const maxPreviewHeight = 200
  const scale = Math.min(maxPreviewWidth / width, maxPreviewHeight / height, 100)

  // Get shape path for nametag
  const getNametagPath = (w: number, h: number, shape: string) => {
    const shapeInfo = NAMETAG_SHAPES[shape as keyof typeof NAMETAG_SHAPES]
    if (!shapeInfo) return `M 2 2 h ${w - 4} v ${h - 4} h -${w - 4} Z`

    if (shapeInfo.corners === 'oval') {
      return `M ${w/2} 2 a ${w/2 - 2} ${h/2 - 2} 0 1 1 0 ${h - 4} a ${w/2 - 2} ${h/2 - 2} 0 1 1 0 -${h - 4}`
    }
    if (shapeInfo.corners === 'arch') {
      const archHeight = Math.min(h * 0.3, w * 0.15)
      return `M 4 ${h - 2} v -${h - archHeight - 4} q 0 -${archHeight} ${w/2 - 4} -${archHeight} q ${w/2 - 4} 0 ${w/2 - 4} ${archHeight} v ${h - archHeight - 4} Z`
    }
    if (shapeInfo.corners === 'clip') {
      const clip = 8
      return `M ${clip + 2} 2 h ${w - clip*2 - 4} l ${clip} ${clip} v ${h - clip - 4} h -${w - 4} v -${h - clip - 4} Z`
    }
    const r = typeof shapeInfo.corners === 'number' ? shapeInfo.corners : 4
    return `M ${r + 2} 2 h ${w - r*2 - 4} a ${r} ${r} 0 0 1 ${r} ${r} v ${h - r*2 - 4} a ${r} ${r} 0 0 1 -${r} ${r} h -${w - r*2 - 4} a ${r} ${r} 0 0 1 -${r} -${r} v -${h - r*2 - 4} a ${r} ${r} 0 0 1 ${r} -${r}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-vurmz-teal">VURMZ</span>
          <span className="text-gray-400">|</span>
          Tag & Label Designer
        </h3>
        <p className="text-gray-400 text-sm mt-1">Professional-grade custom identification products</p>
      </div>

      {/* Step Progress */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                currentStep === idx
                  ? 'bg-vurmz-teal text-white shadow-md'
                  : currentStep > idx
                  ? 'bg-vurmz-teal/20 text-vurmz-teal'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === idx ? 'bg-white text-vurmz-teal' : 'bg-current/20'
              }`}>
                {currentStep > idx ? '✓' : step.icon}
              </span>
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: Configuration */}
        <div className="p-6 border-r border-gray-200">
          {/* Step 0: Tag Type */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-semibold text-lg text-gray-800">What are you making?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(TAG_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => {
                      update({
                        tagType: key,
                        size: type.defaultSize,
                        material: type.materials[0],
                        connector: type.connectorRequired ? 'brass-s-hook' : 'none',
                        attachment: type.hasAttachment ? 'none' : 'none',
                        nametagShape: key === 'nametag' ? 'rounded' : data.nametagShape
                      })
                    }}
                    className={`group p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                      data.tagType === key
                        ? 'border-vurmz-teal bg-vurmz-teal/5 shadow-md'
                        : 'border-gray-200 hover:border-vurmz-teal/50 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mb-2 transition-colors ${
                      data.tagType === key ? 'text-vurmz-teal' : 'text-gray-400 group-hover:text-vurmz-teal'
                    }`}>
                      {type.icon}
                    </div>
                    <div className="font-semibold text-gray-800">{type.name}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Material & Size */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Material */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Select Material</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {getAvailableMaterials().map(([key, mat]) => (
                    <button
                      key={key}
                      onClick={() => update({ material: key })}
                      className={`w-full p-3 border-2 rounded-lg flex items-center gap-3 transition-all ${
                        data.material === key
                          ? 'border-vurmz-teal bg-vurmz-teal/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-300 shadow-inner"
                        style={{
                          background: `linear-gradient(135deg, ${mat.highlight} 0%, ${mat.color} 50%, ${mat.color} 100%)`
                        }}
                      />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm text-gray-800">{mat.name}</div>
                        <div className="text-xs text-gray-500">{mat.description}</div>
                      </div>
                      {mat.priceMultiplier !== 1 && (
                        <div className={`text-xs font-semibold px-2 py-1 rounded ${
                          mat.priceMultiplier > 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {mat.priceMultiplier > 1 ? `+${((mat.priceMultiplier - 1) * 100).toFixed(0)}%` : `${((1 - mat.priceMultiplier) * 100).toFixed(0)}% off`}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Select Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableSizes().map(([key, size]) => (
                    <button
                      key={key}
                      onClick={() => update({ size: key })}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        data.size === key
                          ? 'border-vurmz-teal bg-vurmz-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{size.name}</div>
                      {key !== 'custom' && (
                        <div className="text-xs text-vurmz-teal font-semibold mt-1">
                          ${size.basePrice.toFixed(2)} base
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {data.size === 'custom' && (
                  <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width (inches)</label>
                      <input
                        type="number"
                        step="0.125"
                        min="0.5"
                        max="12"
                        value={data.customWidth}
                        onChange={(e) => update({ customWidth: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                        placeholder="3.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Height (inches)</label>
                      <input
                        type="number"
                        step="0.125"
                        min="0.5"
                        max="12"
                        value={data.customHeight}
                        onChange={(e) => update({ customHeight: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                        placeholder="2.0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Nametag Shape */}
              {data.tagType === 'nametag' && (
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Badge Shape</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(NAMETAG_SHAPES).map(([key, shape]) => (
                      <button
                        key={key}
                        onClick={() => update({ nametagShape: key })}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          data.nametagShape === key
                            ? 'border-vurmz-teal bg-vurmz-teal/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{shape.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hole Position (non-nametag) */}
              {data.tagType !== 'nametag' && !tagType.connectorRequired && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mounting Hole</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'No Hole' },
                      { id: 'top-center', label: 'Top Center' },
                      { id: 'top', label: 'Top Corner' },
                      { id: 'left', label: 'Left Side' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => update({ holePosition: opt.id as IndustrialTagData['holePosition'] })}
                        className={`p-2 border rounded-lg text-sm transition-all ${
                          data.holePosition === opt.id
                            ? 'border-vurmz-teal bg-vurmz-teal/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-semibold text-lg text-gray-800">Text Content</h4>

              {/* Font */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <select
                  value={data.font}
                  onChange={(e) => update({ font: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                >
                  {FONTS.map(font => (
                    <option key={font.id} value={font.id} style={{ fontFamily: font.style }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Lines */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {data.tagType === 'nametag' ? 'Name' : 'Line 1 (Primary)'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={data.line1}
                  onChange={(e) => update({ line1: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                  placeholder={data.tagType === 'nametag' ? 'John Smith' : 'VALVE 001'}
                  maxLength={30}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">{data.line1.length}/30</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {data.tagType === 'nametag' ? 'Title/Position' : 'Line 2'}
                </label>
                <input
                  type="text"
                  value={data.line2}
                  onChange={(e) => update({ line2: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                  placeholder={data.tagType === 'nametag' ? 'Sales Manager' : 'MAIN WATER'}
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {data.tagType === 'nametag' ? 'Company' : 'Line 3'}
                </label>
                <input
                  type="text"
                  value={data.line3}
                  onChange={(e) => update({ line3: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                  placeholder={data.tagType === 'nametag' ? 'ACME Corporation' : 'BLDG A - FLOOR 2'}
                  maxLength={30}
                />
              </div>

              {data.tagType !== 'nametag' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line 4</label>
                  <input
                    type="text"
                    value={data.line4}
                    onChange={(e) => update({ line4: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal"
                    placeholder="DO NOT CLOSE"
                    maxLength={30}
                  />
                </div>
              )}

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => update({ textAlignment: align })}
                      className={`flex-1 px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                        data.textAlignment === align
                          ? 'border-vurmz-teal bg-vurmz-teal/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sequential Numbers */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.includeSerialPlaceholder}
                    onChange={(e) => update({ includeSerialPlaceholder: e.target.checked })}
                    className="w-5 h-5 text-vurmz-teal rounded border-gray-300 focus:ring-vurmz-teal"
                  />
                  <div>
                    <span className="font-medium text-sm">Sequential Numbers</span>
                    <span className="text-xs text-vurmz-teal font-semibold ml-2">+$0.50/ea</span>
                    <div className="text-xs text-gray-500 mt-0.5">Each tag gets a unique number</div>
                  </div>
                </label>
                {data.includeSerialPlaceholder && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Prefix</label>
                      <input
                        type="text"
                        value={data.serialPrefix}
                        onChange={(e) => update({ serialPrefix: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        placeholder="AST-"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start #</label>
                      <input
                        type="text"
                        value={data.serialStartNumber}
                        onChange={(e) => update({ serialStartNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        placeholder="001"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Extras */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Barcodes/QR */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-3">Data Elements</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.includeBarcode}
                      onChange={(e) => update({ includeBarcode: e.target.checked })}
                      className="w-5 h-5 mt-0.5 text-vurmz-teal rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Barcode</span>
                        <span className="text-xs text-vurmz-teal font-semibold">+$1.00</span>
                      </div>
                      {data.includeBarcode && (
                        <input
                          type="text"
                          value={data.barcodeValue}
                          onChange={(e) => update({ barcodeValue: e.target.value })}
                          className="mt-2 w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          placeholder="Barcode value (or 'SERIAL')"
                        />
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.includeQR}
                      onChange={(e) => update({ includeQR: e.target.checked })}
                      className="w-5 h-5 mt-0.5 text-vurmz-teal rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">QR Code</span>
                        <span className="text-xs text-vurmz-teal font-semibold">+$1.00</span>
                      </div>
                      {data.includeQR && (
                        <input
                          type="text"
                          value={data.qrValue}
                          onChange={(e) => update({ qrValue: e.target.value })}
                          className="mt-2 w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          placeholder="URL or data"
                        />
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.includeLogo}
                      onChange={(e) => update({ includeLogo: e.target.checked })}
                      className="w-5 h-5 mt-0.5 text-vurmz-teal rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Company Logo</span>
                        <span className="text-xs text-vurmz-teal font-semibold">+$1.50</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Upload with your order</div>
                      {data.includeLogo && (
                        <div className="mt-2 flex gap-2">
                          {(['left', 'center', 'right', 'top'] as const).map(pos => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => update({ logoPosition: pos })}
                              className={`px-2 py-1 text-xs rounded border ${
                                data.logoPosition === pos
                                  ? 'border-vurmz-teal bg-vurmz-teal/10'
                                  : 'border-gray-300'
                              }`}
                            >
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Connector (valve tags) */}
              {tagType.connectorRequired && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Connector</h4>
                  <div className="space-y-2">
                    {Object.entries(CONNECTORS).filter(([key]) => key !== 'none' || !tagType.connectorRequired).map(([key, conn]) => (
                      <button
                        key={key}
                        onClick={() => update({ connector: key })}
                        className={`w-full p-3 border-2 rounded-lg text-left text-sm transition-all ${
                          data.connector === key
                            ? 'border-vurmz-teal bg-vurmz-teal/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium">{conn.name}</span>
                        {conn.price > 0 && (
                          <span className="text-vurmz-teal text-xs ml-2">+${conn.price.toFixed(2)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachment */}
              {tagType.hasAttachment && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {data.tagType === 'nametag' ? 'Badge Attachment' : 'Mounting'}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(ATTACHMENTS)
                      .filter(([key]) => {
                        if (data.tagType === 'nametag') {
                          return ['pin', 'magnetic', 'clip'].includes(key)
                        }
                        return !['pin', 'clip'].includes(key)
                      })
                      .map(([key, att]) => (
                        <button
                          key={key}
                          onClick={() => update({ attachment: key })}
                          className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                            data.attachment === key
                              ? 'border-vurmz-teal bg-vurmz-teal/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{att.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{att.description}</span>
                            </div>
                            {att.price > 0 && (
                              <span className="text-vurmz-teal text-xs font-semibold">+${att.price.toFixed(2)}</span>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  value={data.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal resize-none"
                  placeholder="Any special requirements, custom layouts, or additional details..."
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                className="px-6 py-2 bg-vurmz-teal text-white text-sm font-semibold rounded-lg hover:bg-vurmz-teal-dark transition-colors"
              >
                Continue →
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                Complete! Scroll down to see your design.
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-gray-50 p-4">
          {/* 3D Preview */}
          <PlasticSign3D
            type={data.tagType === 'nametag' ? 'nametag' : 'tag'}
            shape={sizeInfo.shape === 'round' || data.size.includes('round') ? 'round' : data.nametagShape === 'rounded' ? 'rounded' : 'rectangle'}
            width={width}
            height={height}
            material={data.material}
            line1={data.line1 || (data.tagType === 'nametag' ? 'Your Name' : 'LINE 1')}
            line2={data.line2}
            line3={data.line3}
            line4={data.line4}
            textAlignment={data.textAlignment}
            hasHole={data.holePosition !== 'none'}
            holePosition={data.holePosition}
          />

          {/* Attachment Indicator */}
          {data.attachment !== 'none' && (
            <div className="mt-3 text-center text-xs text-gray-600">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-sm">
                {data.attachment === 'magnetic' && '🧲'}
                {data.attachment === 'pin' && '📌'}
                {data.attachment === 'clip' && '🔗'}
                {attachment.name}
              </span>
            </div>
          )}

          {/* Connector for valve tags */}
          {tagType.connectorRequired && data.connector !== 'none' && (
            <div className="mt-3 text-center text-xs text-gray-600">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-sm">
                ⛓️ {connector.name}
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Price per unit</span>
              <span className="text-xl font-bold text-gray-800">${pricePerTag.toFixed(2)}</span>
            </div>
            {quantity > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Total ({quantity} units)</span>
                <span className="text-2xl font-bold text-vurmz-teal">${totalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Quick Specs */}
          <div className="mt-4 p-3 bg-white rounded-lg text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium text-gray-800">{tagType.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Material:</span>
              <span className="font-medium text-gray-800">{material.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium text-gray-800">{width}&quot; × {height}&quot;</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// Default data factory
export function getDefaultIndustrialTagData(): IndustrialTagData {
  return {
    tagType: 'asset-tag',
    material: 'anodized-black',
    size: '3.375x2.125',
    customWidth: '',
    customHeight: '',
    nametagShape: 'rounded',
    connector: 'none',
    attachment: 'none',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    font: 'arial-bold',
    includeBarcode: false,
    barcodeValue: '',
    includeQR: false,
    qrValue: '',
    includeLogo: false,
    logoPosition: 'left',
    includeSerialPlaceholder: false,
    serialPrefix: '',
    serialStartNumber: '001',
    holePosition: 'top-center',
    textAlignment: 'center',
    notes: '',
    pricePerUnit: 5
  }
}

// Generate description for quote
export function generateIndustrialTagDescription(data: IndustrialTagData, quantity: number): string {
  const tagType = TAG_TYPES[data.tagType as keyof typeof TAG_TYPES]
  const material = MATERIALS[data.material as keyof typeof MATERIALS]
  const sizeInfo = SIZES[data.size as keyof typeof SIZES]
  const connector = CONNECTORS[data.connector as keyof typeof CONNECTORS]
  const attachment = ATTACHMENTS[data.attachment as keyof typeof ATTACHMENTS]

  const width = data.size === 'custom' ? data.customWidth : sizeInfo?.width
  const height = data.size === 'custom' ? data.customHeight : sizeInfo?.height

  let desc = `=== ${tagType?.name || data.tagType} ===\n`
  desc += `Qty: ${quantity}\n`
  desc += `Size: ${width}" × ${height}"\n`
  desc += `Material: ${material?.name || data.material}\n`

  if (data.tagType === 'nametag' && data.nametagShape !== 'rectangle') {
    desc += `Shape: ${NAMETAG_SHAPES[data.nametagShape as keyof typeof NAMETAG_SHAPES]?.name || data.nametagShape}\n`
  }

  if (data.connector !== 'none') desc += `Connector: ${connector?.name}\n`
  if (data.attachment !== 'none') desc += `Attachment: ${attachment?.name}\n`
  if (data.holePosition !== 'none') desc += `Hole: ${data.holePosition}\n`

  desc += `\n--- Content ---\n`
  if (data.tagType === 'nametag') {
    if (data.line1) desc += `Name: ${data.line1}\n`
    if (data.line2) desc += `Title: ${data.line2}\n`
    if (data.line3) desc += `Company: ${data.line3}\n`
  } else {
    if (data.line1) desc += `Line 1: ${data.line1}\n`
    if (data.line2) desc += `Line 2: ${data.line2}\n`
    if (data.line3) desc += `Line 3: ${data.line3}\n`
    if (data.line4) desc += `Line 4: ${data.line4}\n`
  }
  desc += `Font: ${FONTS.find(f => f.id === data.font)?.name || data.font}\n`
  desc += `Alignment: ${data.textAlignment}\n`

  if (data.includeSerialPlaceholder) {
    const endNum = parseInt(data.serialStartNumber || '1') + quantity - 1
    desc += `\nSequential: ${data.serialPrefix}${data.serialStartNumber} to ${data.serialPrefix}${String(endNum).padStart(3, '0')}\n`
  }
  if (data.includeBarcode) desc += `Barcode: ${data.barcodeValue || 'TBD'}\n`
  if (data.includeQR) desc += `QR Code: ${data.qrValue || 'TBD'}\n`
  if (data.includeLogo) desc += `Logo: Yes (${data.logoPosition} position)\n`

  if (data.notes) desc += `\nNotes: ${data.notes}\n`

  return desc
}
