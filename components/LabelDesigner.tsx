'use client'

import { useState, useEffect } from 'react'
import { SafetyIcon, iconDefinitions, type SafetyIconId } from './builder/icons/SafetyIcons'

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
  { id: '1x0.5', name: '1" × ½"', width: 1, height: 0.5 },
  { id: '1.5x0.75', name: '1½" × ¾"', width: 1.5, height: 0.75 },
  { id: '2x1', name: '2" × 1"', width: 2, height: 1 },
  { id: '3x1', name: '3" × 1"', width: 3, height: 1 },
  { id: '3x1.5', name: '3" × 1½"', width: 3, height: 1.5 },
  { id: '1-round', name: '1" Round', width: 1, height: 1 },
  { id: '1.5-round', name: '1½" Round', width: 1.5, height: 1.5 },
  { id: '2-round', name: '2" Round', width: 2, height: 2 },
]

const SIGN_SIZES = [
  { id: '4x2', name: '4" × 2"', width: 4, height: 2 },
  { id: '6x2', name: '6" × 2"', width: 6, height: 2 },
  { id: '6x4', name: '6" × 4"', width: 6, height: 4 },
  { id: '8x4', name: '8" × 4"', width: 8, height: 4 },
  { id: '8x6', name: '8" × 6"', width: 8, height: 6 },
  { id: '10x6', name: '10" × 6"', width: 10, height: 6 },
  { id: '12x8', name: '12" × 8"', width: 12, height: 8 },
  { id: '12x12', name: '12" × 12"', width: 12, height: 12 },
  { id: 'custom', name: 'Custom (up to 12"×12")', width: 0, height: 0 },
]

const MOUNTING_OPTIONS = [
  { id: 'none', name: 'No holes' },
  { id: '1-hole', name: '1 hole (top center)' },
  { id: '2-holes', name: '2 holes (top corners)' },
  { id: '4-holes', name: '4 holes (all corners)' },
  { id: 'adhesive', name: 'Adhesive backing (+$0.50/ea)' },
]

// Map icon IDs for the label designer (subset of available icons)
const LABEL_ICONS = [
  { id: 'none', name: 'No icon', isoId: null },
  { id: 'warning', name: 'Warning', isoId: 'warning-general' as SafetyIconId },
  { id: 'electrical', name: 'Electrical', isoId: 'warning-electric' as SafetyIconId },
  { id: 'hot', name: 'Hot Surface', isoId: 'warning-hot' as SafetyIconId },
  { id: 'toxic', name: 'Toxic', isoId: 'warning-toxic' as SafetyIconId },
  { id: 'biohazard', name: 'Biohazard', isoId: 'warning-biohazard' as SafetyIconId },
  { id: 'radiation', name: 'Radiation', isoId: 'warning-radiation' as SafetyIconId },
  { id: 'laser', name: 'Laser', isoId: 'warning-laser' as SafetyIconId },
  { id: 'no-entry', name: 'No Entry', isoId: 'no-entry' as SafetyIconId },
  { id: 'no-smoking', name: 'No Smoking', isoId: 'no-smoking' as SafetyIconId },
  { id: 'eye-protection', name: 'Eye Protection', isoId: 'wear-eye' as SafetyIconId },
  { id: 'hard-hat', name: 'Hard Hat', isoId: 'wear-helmet' as SafetyIconId },
  { id: 'first-aid', name: 'First Aid', isoId: 'first-aid' as SafetyIconId },
  { id: 'exit', name: 'Exit', isoId: 'exit' as SafetyIconId },
  { id: 'fire-extinguisher', name: 'Fire Extinguisher', isoId: 'fire-extinguisher' as SafetyIconId },
]

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
  const [icon, setIcon] = useState('none')
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(initialQuantity)

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

  // Calculate price
  const calculatePrice = () => {
    let basePrice = productType === 'tag' ? 3 : 5 // Minimum prices

    // Area-based pricing
    const areaPrice = area * (productType === 'tag' ? 0.50 : 0.35)
    basePrice = Math.max(basePrice, areaPrice)

    // Mounting add-on
    if (mounting === 'adhesive') basePrice += 0.50

    // Volume discount
    if (quantity >= 100) basePrice *= 0.80
    else if (quantity >= 50) basePrice *= 0.85
    else if (quantity >= 25) basePrice *= 0.90
    else if (quantity >= 10) basePrice *= 0.95

    return Math.round(basePrice * 100) / 100
  }

  const pricePerUnit = calculatePrice()
  const totalPrice = Math.round(pricePerUnit * quantity * 100) / 100

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
      pricePerUnit,
      totalPrice
    })
  }, [productType, material, size, customWidth, customHeight, mounting, icon, text, quantity, pricePerUnit, totalPrice, onChange])

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-4">
        <h3 className="text-white font-bold text-lg">
          Tag & Sign Designer
        </h3>
        <p className="text-gray-400 text-sm mt-1">Custom engraved tags & signs</p>
      </div>

      {/* Live Preview */}
      <div className="bg-gray-100 p-6 border-b border-gray-200">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 text-center">Live Preview</div>
        <div className="flex justify-center">
          <div
            className="relative flex flex-col items-center justify-center transition-all duration-300"
            style={{
              width: `${Math.min(width * 25, 300)}px`,
              height: `${Math.min(height * 25, 300)}px`,
              minWidth: '120px',
              minHeight: '60px',
              backgroundColor: selectedMaterial.color,
              borderRadius: size.includes('round') ? '50%' : '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(0,0,0,0.2)',
            }}
          >
            {/* Mounting holes visualization */}
            {mounting === '1-hole' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-100 border border-gray-400" />
            )}
            {mounting === '2-holes' && (
              <>
                <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-gray-100 border border-gray-400" />
                <div className="absolute top-2 right-3 w-3 h-3 rounded-full bg-gray-100 border border-gray-400" />
              </>
            )}
            {mounting === '4-holes' && (
              <>
                <div className="absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-400" />
                <div className="absolute top-2 right-3 w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-400" />
                <div className="absolute bottom-2 left-3 w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-400" />
                <div className="absolute bottom-2 right-3 w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-400" />
              </>
            )}

            {/* Icon */}
            {icon !== 'none' && (
              <div className="mb-1">
                {LABEL_ICONS.find(i => i.id === icon)?.isoId && (
                  <SafetyIcon
                    icon={LABEL_ICONS.find(i => i.id === icon)!.isoId!}
                    size={Math.min(height * 12, 40)}
                  />
                )}
              </div>
            )}

            {/* Text preview */}
            <div
              className="text-center px-3 font-bold leading-tight"
              style={{
                color: selectedMaterial.engraveColor,
                fontSize: text.length > 30 ? '10px' : text.length > 15 ? '12px' : '14px',
                maxWidth: '90%',
                wordBreak: 'break-word',
                textShadow: selectedMaterial.color === '#1a1a1a' ? '0 0 1px rgba(255,255,255,0.3)' : 'none',
              }}
            >
              {text || (productType === 'tag' ? 'YOUR TEXT HERE' : 'YOUR SIGN TEXT')}
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-gray-500">
          {width}" × {height}" • {selectedMaterial.name}
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
              <div className="text-xs text-gray-500">Larger signs up to 12"×12"</div>
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
                <span className="text-sm font-medium text-gray-700">{s.name}</span>
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
            Safety/Warning Icon <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {LABEL_ICONS.map((ico) => (
              <button
                key={ico.id}
                type="button"
                onClick={() => setIcon(ico.id)}
                className={`p-2 border-2 rounded-lg flex items-center justify-center transition-all ${
                  icon === ico.id
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={ico.name}
              >
                {ico.isoId ? (
                  <SafetyIcon icon={ico.isoId} size={28} />
                ) : (
                  <span className="text-gray-400 text-sm">None</span>
                )}
              </button>
            ))}
          </div>
          {icon !== 'none' && (
            <p className="text-xs text-vurmz-teal mt-2 font-medium">
              {LABEL_ICONS.find(i => i.id === icon)?.name} icon will be engraved on your {productType}
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

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium"
          />
          {quantity >= 10 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              {quantity >= 100 ? '20% volume discount!' :
               quantity >= 50 ? '15% volume discount!' :
               quantity >= 25 ? '10% volume discount!' :
               '5% volume discount!'}
            </p>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {productType === 'tag' ? 'Tag' : 'Sign'} ({width}" × {height}")
            </span>
            <span className="font-medium">${pricePerUnit.toFixed(2)} each</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Quantity</span>
            <span className="font-medium">× {quantity}</span>
          </div>
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

  const iconInfo = LABEL_ICONS.find(i => i.id === data.icon)

  let desc = `=== ${data.productType === 'tag' ? 'Tag' : 'Sign'} Order ===\n`
  desc += `Type: ${data.productType === 'tag' ? 'Tag/Label' : 'Sign'}\n`
  desc += `Material: ${materialName}\n`
  desc += `Size: ${width}" × ${height}"\n`
  desc += `Mounting: ${MOUNTING_OPTIONS.find(m => m.id === data.mounting)?.name || 'None'}\n`
  if (data.icon && data.icon !== 'none' && iconInfo) {
    desc += `Safety Icon: ${iconInfo.name}\n`
  }
  desc += `Quantity: ${data.quantity}\n`
  desc += `\nText/Content:\n${data.text || '(Not specified)'}\n`
  desc += `\nPrice per unit: $${data.pricePerUnit.toFixed(2)}\n`
  desc += `Total: $${data.totalPrice.toFixed(2)}\n`

  return desc
}

// Simplified - no SVG export needed for this version
export function generateLabelSVG(data: LabelDesignData): string {
  return `<!-- Tag/Sign order - SVG will be created during production -->`
}
