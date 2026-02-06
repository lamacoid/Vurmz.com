'use client'

import { useState, useEffect } from 'react'
import { SafetyIcon, type SafetyIconId, categorizedIcons as safetyCategorizedIcons, iconCategories as safetyIconCategories } from './builder/icons/SafetyIcons'
import { IndustrialIcon, industrialCategorizedIcons, industrialIconCategories } from './builder/icons/IndustrialIcons'

// Simple 2D Tag/Sign Preview
function TagSignPreview({
  type,
  width,
  height,
  material,
  text,
  isRound,
}: {
  type: 'tag' | 'sign'
  width: number
  height: number
  material: { color: string; engraveColor: string }
  text: string
  isRound: boolean
}) {
  // Scale dimensions for SVG (max 200px wide)
  const scale = Math.min(200 / width, 150 / height, 40)
  const svgWidth = width * scale
  const svgHeight = height * scale

  return (
    <svg
      viewBox={`0 0 ${svgWidth + 20} ${svgHeight + 20}`}
      className="w-full max-w-xs mx-auto"
      style={{ maxHeight: '180px' }}
    >
      {isRound ? (
        <circle
          cx={(svgWidth + 20) / 2}
          cy={(svgHeight + 20) / 2}
          r={Math.min(svgWidth, svgHeight) / 2}
          fill={material.color}
          stroke="#555"
          strokeWidth="1"
        />
      ) : (
        <rect
          x="10"
          y="10"
          width={svgWidth}
          height={svgHeight}
          rx="4"
          fill={material.color}
          stroke="#555"
          strokeWidth="1"
        />
      )}
      <text
        x={(svgWidth + 20) / 2}
        y={(svgHeight + 20) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={material.engraveColor}
        fontSize={Math.min(14, svgHeight / 3)}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {text || (type === 'tag' ? 'YOUR TEXT' : 'YOUR SIGN')}
      </text>
    </svg>
  )
}

// ============================================================================
// Tag & Sign Designer
// ============================================================================

const TAG_MATERIALS = [
  { id: 'anodized-black', name: 'Anodized Aluminum - Black', color: '#1a1a1a', engraveColor: '#c0c0c0' },
  { id: 'anodized-blue', name: 'Anodized Aluminum - Blue', color: '#1e3a5f', engraveColor: '#c0c0c0' },
  { id: 'anodized-red', name: 'Anodized Aluminum - Red', color: '#8b2020', engraveColor: '#c0c0c0' },
  { id: 'anodized-gold', name: 'Anodized Aluminum - Gold', color: '#b8860b', engraveColor: '#c0c0c0' },
  { id: 'brass', name: 'Solid Brass', color: '#b5a642', engraveColor: '#8b7355' },
  { id: 'abs-black-white', name: 'ABS Plastic - Black/White', color: '#1a1a1a', engraveColor: '#ffffff' },
]

const SIGN_MATERIALS = [
  { id: 'anodized-black', name: 'Anodized Aluminum - Black', color: '#1a1a1a', engraveColor: '#c0c0c0' },
  { id: 'anodized-blue', name: 'Anodized Aluminum - Blue', color: '#1e3a5f', engraveColor: '#c0c0c0' },
  { id: 'aluminum', name: 'Brushed Aluminum', color: '#d4d4d4', engraveColor: '#333333' },
  { id: 'stainless', name: 'Stainless Steel', color: '#c0c0c0', engraveColor: '#333333' },
  { id: 'abs-black-white', name: 'ABS Plastic - Black/White', color: '#1a1a1a', engraveColor: '#ffffff' },
  { id: 'abs-white-black', name: 'ABS Plastic - White/Black', color: '#f5f5f5', engraveColor: '#1a1a1a' },
  { id: 'wood', name: 'Wood', color: '#8b6914', engraveColor: '#3d2914' },
]

const TAG_SIZES = [
  { id: '1x0.5', name: '1" × ½"', width: 1, height: 0.5, price: 3 },
  { id: '1.5x0.75', name: '1½" × ¾"', width: 1.5, height: 0.75, price: 3 },
  { id: '2x1', name: '2" × 1"', width: 2, height: 1, price: 4 },
  { id: '3x1', name: '3" × 1"', width: 3, height: 1, price: 5 },
  { id: '3x1.5', name: '3" × 1½"', width: 3, height: 1.5, price: 6 },
  { id: '1-round', name: '1" Round', width: 1, height: 1, price: 3 },
  { id: '1.5-round', name: '1½" Round', width: 1.5, height: 1.5, price: 4 },
  { id: '2-round', name: '2" Round', width: 2, height: 2, price: 5 },
]

const SIGN_SIZES = [
  { id: '4x2', name: '4" × 2"', width: 4, height: 2, price: 8 },
  { id: '6x2', name: '6" × 2"', width: 6, height: 2, price: 10 },
  { id: '6x4', name: '6" × 4"', width: 6, height: 4, price: 14 },
  { id: '8x4', name: '8" × 4"', width: 8, height: 4, price: 18 },
  { id: '8x6', name: '8" × 6"', width: 8, height: 6, price: 24 },
  { id: '10x6', name: '10" × 6"', width: 10, height: 6, price: 30 },
  { id: '12x8', name: '12" × 8"', width: 12, height: 8, price: 40 },
  { id: '12x12', name: '12" × 12"', width: 12, height: 12, price: 50 },
  { id: 'custom', name: 'Custom (up to 12"×12")', width: 0, height: 0, price: 0 },
]

const MOUNTING_OPTIONS = [
  { id: 'none', name: 'No holes' },
  { id: '1-hole', name: '1 hole (top center)' },
  { id: '2-holes', name: '2 holes (top corners)' },
  { id: '4-holes', name: '4 holes (all corners)' },
  { id: 'adhesive', name: 'Adhesive backing (+$0.50/ea)' },
]

// Combined icon categories for the picker
const ICON_CATEGORIES = {
  none: { label: 'None', color: '#666', bgColor: '#f5f5f5', description: 'No symbol' },
  // Safety categories (ISO 7010)
  ...safetyIconCategories,
  // Industrial categories
  ...industrialIconCategories,
}

// Icon type for unified handling
type IconType = 'none' | 'safety' | 'industrial'
interface SelectedIcon {
  type: IconType
  id: string
  name: string
}

// Get name for an icon ID
function getIconName(iconType: IconType, iconId: string): string {
  if (iconType === 'none') return 'No icon'
  if (iconType === 'safety') {
    for (const icons of Object.values(safetyCategorizedIcons)) {
      const found = icons.find(i => i.id === iconId)
      if (found) return found.name
    }
  }
  if (iconType === 'industrial') {
    for (const icons of Object.values(industrialCategorizedIcons)) {
      const found = icons.find(i => i.id === iconId)
      if (found) return found.name
    }
  }
  return ''
}

// Add-on pricing configuration
const ADD_ON_PRICING = {
  tag: {
    icon: 0.50,      // Safety/warning symbol
    qrCode: 1.00,    // QR code
    logo: 1.50,      // Custom logo/graphic
    extraLine: 0.50, // Additional line of text
  },
  sign: {
    icon: 1.00,
    qrCode: 2.00,
    logo: 3.00,
    extraLine: 0,    // Free on signs (more space)
  },
}

export interface LabelDesignData {
  productType: 'tag' | 'sign'
  material: string
  size: string
  customWidth: number
  customHeight: number
  mounting: string
  icon: string
  text: string
  quantity: number
  // Add-ons
  hasQrCode: boolean
  hasLogo: boolean
  hasExtraLine: boolean
  extraLineText: string
  // Delivery
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress: string
  deliveryFee: number
  // Pricing
  pricePerUnit: number
  totalPrice: number
}

interface Props {
  onChange: (data: LabelDesignData) => void
  initialQuantity?: number
}

export default function LabelDesigner({ onChange, initialQuantity = 1 }: Props) {
  const [productType, setProductType] = useState<'tag' | 'sign'>('tag')
  const [material, setMaterial] = useState('anodized-black')
  const [size, setSize] = useState('3x1.5')
  const [customWidth, setCustomWidth] = useState(6)
  const [customHeight, setCustomHeight] = useState(4)
  const [mounting, setMounting] = useState('none')
  const [iconType, setIconType] = useState<IconType>('none')
  const [iconId, setIconId] = useState('none')
  const [iconCategory, setIconCategory] = useState<string>('none')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(Math.max(10, initialQuantity))
  // Add-ons
  const [hasQrCode, setHasQrCode] = useState(false)
  const [hasLogo, setHasLogo] = useState(false)
  const [hasExtraLine, setHasExtraLine] = useState(false)
  const [extraLineText, setExtraLineText] = useState('')
  // Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')

  // For backward compatibility
  const icon = iconType === 'none' ? 'none' : `${iconType}:${iconId}`

  const materials = productType === 'tag' ? TAG_MATERIALS : SIGN_MATERIALS
  const sizes = productType === 'tag' ? TAG_SIZES : SIGN_SIZES
  const selectedMaterial = materials.find(m => m.id === material) || materials[0]
  const selectedSize = sizes.find(s => s.id === size)

  // Reset material and size when switching product type
  useEffect(() => {
    if (productType === 'tag') {
      setMaterial('anodized-black')
      setSize('3x1.5')
    } else {
      setMaterial('anodized-black')
      setSize('6x4')
    }
  }, [productType])

  // Calculate dimensions
  const width = size === 'custom' ? customWidth : (selectedSize?.width || 3)
  const height = size === 'custom' ? customHeight : (selectedSize?.height || 1.5)
  const area = width * height

  // Calculate price - $0.77/sq.in with minimum
  const calculatePrice = () => {
    const addOns = ADD_ON_PRICING[productType]
    const PRICE_PER_SQ_IN = 0.77
    const minPrice = productType === 'tag' ? 2 : 5

    // Area-based pricing: $0.77/sq.in
    let basePrice = Math.max(minPrice, Math.round(area * PRICE_PER_SQ_IN * 100) / 100)

    // Mounting add-on
    if (mounting === 'adhesive') basePrice += 0.50

    // Optional add-ons
    if (iconType !== 'none') basePrice += addOns.icon
    if (hasQrCode) basePrice += addOns.qrCode
    if (hasLogo) basePrice += addOns.logo
    if (hasExtraLine && extraLineText.trim()) basePrice += addOns.extraLine

    // Volume discount (applied after add-ons)
    if (quantity >= 100) basePrice *= 0.80
    else if (quantity >= 50) basePrice *= 0.85
    else if (quantity >= 25) basePrice *= 0.90
    else if (quantity >= 10) basePrice *= 0.95

    return Math.round(basePrice * 100) / 100
  }

  const pricePerUnit = calculatePrice()
  const subtotal = Math.round(pricePerUnit * quantity * 100) / 100
  // Delivery: free over $100, $15 flat fee under
  const deliveryFee = deliveryMethod === 'delivery' && subtotal < 100 ? 15 : 0
  const totalPrice = Math.round((subtotal + deliveryFee) * 100) / 100

  // Notify parent of changes
  useEffect(() => {
    onChange({
      productType,
      material,
      size,
      customWidth,
      customHeight,
      mounting,
      icon,
      text,
      quantity,
      hasQrCode,
      hasLogo,
      hasExtraLine,
      extraLineText,
      deliveryMethod,
      deliveryAddress,
      deliveryFee,
      pricePerUnit,
      totalPrice
    })
  }, [productType, material, size, customWidth, customHeight, mounting, icon, text, quantity, hasQrCode, hasLogo, hasExtraLine, extraLineText, deliveryMethod, deliveryAddress, deliveryFee, pricePerUnit, totalPrice, onChange])

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-4">
        <h3 className="text-white font-bold text-lg">
          Tag & Sign Designer
        </h3>
        <p className="text-gray-400 text-sm mt-1">Custom engraved tags & signs</p>
      </div>

      {/* Live Preview */}
      <div className="p-4 border-b border-gray-200">
        <TagSignPreview
          type={productType}
          width={width}
          height={height}
          material={selectedMaterial}
          text={text}
          isRound={size.includes('round')}
        />
        <div className="text-center mt-2 text-xs text-gray-500">
          {width}&quot; × {height}&quot; • {selectedMaterial.name}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Type Toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What do you need?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProductType('tag')}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                productType === 'tag'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🏷️</div>
              <div className="font-semibold text-gray-800">Tags</div>
              <div className="text-xs text-gray-500">Small labels, ID tags, keytags</div>
            </button>
            <button
              type="button"
              onClick={() => setProductType('sign')}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                productType === 'sign'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🪧</div>
              <div className="font-semibold text-gray-800">Signs</div>
              <div className="text-xs text-gray-500">Larger signs up to 12&quot;×12&quot;</div>
            </button>
          </div>
        </div>

        {/* Material Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((mat) => (
              <button
                key={mat.id}
                type="button"
                onClick={() => setMaterial(mat.id)}
                className={`p-3 border-2 rounded-lg flex items-center gap-3 text-left transition-all ${
                  material === mat.id
                    ? 'border-vurmz-teal bg-vurmz-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: mat.color, color: mat.engraveColor }}
                >
                  Ab
                </div>
                <span className="text-sm font-medium text-gray-700">{mat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.id)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  size === s.id
                    ? 'border-vurmz-teal bg-vurmz-teal/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium text-gray-700">{s.name}</div>
                {s.price > 0 && (
                  <div className="text-xs text-gray-500 mt-0.5">${s.price}/ea</div>
                )}
                {s.id === 'custom' && (
                  <div className="text-xs text-gray-500 mt-0.5">Quote</div>
                )}
              </button>
            ))}
          </div>

          {size === 'custom' && (
            <div className="mt-3 grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Width (inches)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Height (inches)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mounting */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mounting</label>
          <select
            value={mounting}
            onChange={(e) => setMounting(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
          >
            {MOUNTING_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Safety/Warning Icon */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Safety/Warning Symbol <span className="font-normal text-gray-500">(optional)</span>
          </label>

          {/* Current selection display / toggle button */}
          <button
            type="button"
            onClick={() => setShowIconPicker(!showIconPicker)}
            className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 text-left transition-all ${
              iconType !== 'none'
                ? 'border-vurmz-teal bg-vurmz-teal/5'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              {iconType === 'none' ? (
                <span className="text-gray-400 text-xs">None</span>
              ) : iconType === 'safety' ? (
                <SafetyIcon icon={iconId as SafetyIconId} size={36} />
              ) : (
                <IndustrialIcon icon={iconId} size={36} />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {iconType === 'none' ? 'No symbol selected' : getIconName(iconType, iconId)}
              </div>
              <div className="text-xs text-gray-500">
                {showIconPicker ? 'Click to close' : 'Click to choose from 50+ industrial symbols'}
              </div>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Icon Picker Panel */}
          {showIconPicker && (
            <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden bg-white">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => { setIconCategory('none'); setIconType('none'); setIconId('none'); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    iconCategory === 'none'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  None
                </button>

                {/* Safety Icon Categories */}
                <div className="w-full text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 pt-2">ISO 7010 Safety</div>
                {Object.entries(safetyIconCategories).map(([key, cat]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIconCategory(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      iconCategory === key
                        ? 'text-white'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: iconCategory === key ? cat.color : undefined,
                      color: iconCategory === key ? 'white' : cat.color,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}

                {/* Industrial Icon Categories */}
                <div className="w-full text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 pt-2">Industrial</div>
                {Object.entries(industrialIconCategories).map(([key, cat]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIconCategory(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      iconCategory === key
                        ? 'text-white'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: iconCategory === key ? cat.color : undefined,
                      color: iconCategory === key ? 'white' : cat.color,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Icon Grid */}
              <div className="p-3">
                {iconCategory === 'none' ? (
                  <div className="text-center text-gray-500 py-6">
                    <div className="text-4xl mb-2">✓</div>
                    <div className="font-medium">No symbol selected</div>
                    <div className="text-sm">Choose a category above to browse symbols</div>
                  </div>
                ) : safetyCategorizedIcons[iconCategory as keyof typeof safetyCategorizedIcons] ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {safetyCategorizedIcons[iconCategory as keyof typeof safetyCategorizedIcons].map((ico) => (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => {
                          setIconType('safety')
                          setIconId(ico.id)
                          setShowIconPicker(false)
                        }}
                        className={`p-2 border-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                          iconType === 'safety' && iconId === ico.id
                            ? 'border-vurmz-teal bg-vurmz-teal/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={ico.name}
                      >
                        <SafetyIcon icon={ico.id as SafetyIconId} size={32} />
                        <span className="text-[10px] text-gray-600 text-center leading-tight">{ico.name}</span>
                      </button>
                    ))}
                  </div>
                ) : industrialCategorizedIcons[iconCategory as keyof typeof industrialCategorizedIcons] ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {industrialCategorizedIcons[iconCategory as keyof typeof industrialCategorizedIcons].map((ico) => (
                      <button
                        key={ico.id}
                        type="button"
                        onClick={() => {
                          setIconType('industrial')
                          setIconId(ico.id)
                          setShowIconPicker(false)
                        }}
                        className={`p-2 border-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                          iconType === 'industrial' && iconId === ico.id
                            ? 'border-vurmz-teal bg-vurmz-teal/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={ico.name}
                      >
                        <ico.Component size={32} />
                        <span className="text-[10px] text-gray-600 text-center leading-tight">{ico.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6">Select a category</div>
                )}
              </div>
            </div>
          )}

          {iconType !== 'none' && !showIconPicker && (
            <p className="text-xs text-vurmz-teal mt-2 font-medium">
              {getIconName(iconType, iconId)} symbol will be engraved on your {productType}
            </p>
          )}
        </div>

        {/* Text/Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What text do you need engraved?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={productType === 'tag'
              ? "e.g., Equipment ID numbers, names, serial numbers..."
              : "e.g., Room numbers, warning text, company name..."
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Need different text on each? Just describe what you need and I&apos;ll follow up.
          </p>
        </div>

        {/* Optional Add-ons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Optional Extras
          </label>
          <div className="space-y-2">
            {/* QR Code */}
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-vurmz-teal/50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={hasQrCode}
                onChange={(e) => setHasQrCode(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-vurmz-teal focus:ring-vurmz-teal"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">QR Code</div>
                <div className="text-xs text-gray-500">Link to website, contact info, etc.</div>
              </div>
              <span className="text-sm font-medium text-vurmz-teal">
                +${ADD_ON_PRICING[productType].qrCode.toFixed(2)}
              </span>
            </label>

            {/* Custom Logo */}
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-vurmz-teal/50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={hasLogo}
                onChange={(e) => setHasLogo(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-vurmz-teal focus:ring-vurmz-teal"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">Custom Logo/Graphic</div>
                <div className="text-xs text-gray-500">Upload your logo after ordering</div>
              </div>
              <span className="text-sm font-medium text-vurmz-teal">
                +${ADD_ON_PRICING[productType].logo.toFixed(2)}
              </span>
            </label>

            {/* Extra Line (only for tags where it costs extra) */}
            {ADD_ON_PRICING[productType].extraLine > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <label className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={hasExtraLine}
                    onChange={(e) => setHasExtraLine(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-vurmz-teal focus:ring-vurmz-teal"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Additional Text Line</div>
                    <div className="text-xs text-gray-500">Second line of text</div>
                  </div>
                  <span className="text-sm font-medium text-vurmz-teal">
                    +${ADD_ON_PRICING[productType].extraLine.toFixed(2)}
                  </span>
                </label>
                {hasExtraLine && (
                  <div className="px-3 pb-3">
                    <input
                      type="text"
                      value={extraLineText}
                      onChange={(e) => setExtraLineText(e.target.value)}
                      placeholder="Enter second line text..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Show icon pricing note */}
          {iconType !== 'none' && (
            <p className="text-xs text-gray-500 mt-2">
              ISO 7010 safety symbol: +${ADD_ON_PRICING[productType].icon.toFixed(2)}/ea
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum order: 10 pieces</p>
          {quantity >= 25 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              {quantity >= 100 ? '20% volume discount!' :
               quantity >= 50 ? '15% volume discount!' :
               '10% volume discount!'}
            </p>
          )}
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup or Delivery</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Pickup (Free)
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                deliveryMethod === 'delivery'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Local Delivery
            </button>
          </div>
          {deliveryMethod === 'pickup' && (
            <p className="text-xs text-gray-500 mt-2">Pickup in Centennial, CO - address provided after order</p>
          )}
          {deliveryMethod === 'delivery' && (
            <>
              <p className="text-xs text-gray-500 mt-2">
                {subtotal >= 100 ? 'Free delivery!' : `$15 delivery fee (free over $100)`}
              </p>
              <input
                type="text"
                placeholder="Delivery address (Denver metro)"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 text-sm"
              />
            </>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {productType === 'tag' ? 'Tag' : 'Sign'} ({width}&quot; × {height}&quot;)
            </span>
            <span className="font-medium">${pricePerUnit.toFixed(2)} each</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Quantity</span>
            <span className="font-medium">× {quantity}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {deliveryMethod === 'delivery' && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Delivery</span>
              <span className="font-medium">{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-800">Estimated Total</span>
            <span className="text-2xl font-bold text-vurmz-teal">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to generate description for quote
export function generateLabelDescription(data: LabelDesignData): string {
  const width = data.size === 'custom' ? data.customWidth :
    (data.productType === 'tag' ? TAG_SIZES : SIGN_SIZES).find(s => s.id === data.size)?.width || 0
  const height = data.size === 'custom' ? data.customHeight :
    (data.productType === 'tag' ? TAG_SIZES : SIGN_SIZES).find(s => s.id === data.size)?.height || 0

  const materials = data.productType === 'tag' ? TAG_MATERIALS : SIGN_MATERIALS
  const materialName = materials.find(m => m.id === data.material)?.name || data.material

  // Parse icon info from the new format: "type:id" or "none"
  let iconName = ''
  if (data.icon && data.icon !== 'none') {
    const [iconType, iconId] = data.icon.includes(':') ? data.icon.split(':') : ['', data.icon]
    iconName = getIconName(iconType as IconType || 'safety', iconId)
  }

  let desc = `=== ${data.productType === 'tag' ? 'Tag' : 'Sign'} Order ===\n`
  desc += `Type: ${data.productType === 'tag' ? 'Tag/Label' : 'Sign'}\n`
  desc += `Material: ${materialName}\n`
  desc += `Size: ${width}" × ${height}"\n`
  desc += `Mounting: ${MOUNTING_OPTIONS.find(m => m.id === data.mounting)?.name || 'None'}\n`

  // Add-ons
  const addOns: string[] = []
  if (iconName) addOns.push(`ISO 7010 Symbol: ${iconName}`)
  if (data.hasQrCode) addOns.push('QR Code')
  if (data.hasLogo) addOns.push('Custom Logo')
  if (data.hasExtraLine && data.extraLineText) addOns.push(`Extra Line: "${data.extraLineText}"`)

  if (addOns.length > 0) {
    desc += `Add-ons: ${addOns.join(', ')}\n`
  }

  desc += `Quantity: ${data.quantity}\n`

  // Delivery info
  desc += `\nFulfillment: ${data.deliveryMethod === 'delivery' ? 'Local Delivery' : 'Pickup'}\n`
  if (data.deliveryMethod === 'delivery' && data.deliveryAddress) {
    desc += `Delivery Address: ${data.deliveryAddress}\n`
  }

  desc += `\nText/Content:\n${data.text || '(Not specified)'}\n`
  desc += `\nPrice per unit: $${data.pricePerUnit.toFixed(2)}\n`
  if (data.deliveryFee > 0) {
    desc += `Delivery Fee: $${data.deliveryFee.toFixed(2)}\n`
  }
  desc += `Total: $${data.totalPrice.toFixed(2)}\n`

  return desc
}

// Simplified - no SVG export needed for this version
export function generateLabelSVG(): string {
  return `<!-- Tag/Sign order - SVG will be created during production -->`
}
