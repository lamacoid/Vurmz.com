'use client'

import { useState, useEffect } from 'react'
import FontSelector from './FontSelector'
import { fontOptions } from '@/lib/fonts'

type KeychainShape = 'rectangle' | 'oval' | 'dog-tag' | 'bottle-opener' | 'round'

export interface KeychainDesignData {
  shape: KeychainShape
  color: string
  text: string
  text2: string
  font: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
}

interface KeychainDesignerProps {
  onChange: (data: KeychainDesignData) => void
}

const KEYCHAIN_SHAPES: { value: KeychainShape; label: string; price: number }[] = [
  { value: 'rectangle', label: 'Rectangle', price: 4 },
  { value: 'oval', label: 'Oval', price: 4 },
  { value: 'round', label: 'Round', price: 4 },
  { value: 'dog-tag', label: 'Dog Tag', price: 5 },
  { value: 'bottle-opener', label: 'Bottle Opener', price: 6 },
]

const KEYCHAIN_COLORS: { value: string; label: string; hex: string }[] = [
  { value: 'black', label: 'Black', hex: '#1a1a1a' },
  { value: 'silver', label: 'Silver', hex: '#c0c0c0' },
  { value: 'copper', label: 'Copper', hex: '#b87333' },
  { value: 'gold', label: 'Gold', hex: '#ffd700' },
  { value: 'teal', label: 'Teal', hex: '#4a9b8c' },
]

export default function KeychainDesigner({ onChange }: KeychainDesignerProps) {
  const [design, setDesign] = useState<KeychainDesignData>({
    shape: 'rectangle',
    color: '#1a1a1a',
    text: '',
    text2: '',
    font: 'arial',
    quantity: 1,
    pricePerUnit: 4,
    totalPrice: 4,
  })


  const calculatePrice = (shape: KeychainShape, qty: number) => {
    const shapeData = KEYCHAIN_SHAPES.find(s => s.value === shape)
    const basePrice = shapeData?.price || 4
    // Bulk discount
    let pricePerUnit = basePrice
    if (qty >= 25) pricePerUnit = basePrice * 0.85
    else if (qty >= 10) pricePerUnit = basePrice * 0.9
    return { pricePerUnit, totalPrice: pricePerUnit * qty }
  }

  const updateDesign = (updates: Partial<KeychainDesignData>) => {
    setDesign(prev => {
      const updated = { ...prev, ...updates }
      const { pricePerUnit, totalPrice } = calculatePrice(updated.shape, updated.quantity)
      return { ...updated, pricePerUnit, totalPrice }
    })
  }

  useEffect(() => {
    onChange(design)
  }, [design, onChange])

  const selectedFont = fontOptions.find(f => f.value === design.font)
  const getTextStyle = () => selectedFont?.style || { fontFamily: 'Arial, sans-serif' }

  // Simple SVG preview for keychain shapes
  const renderKeychainPreview = () => {
    const w = 180
    const h = 100
    const cx = w / 2
    const cy = h / 2 + 8
    const engravingColor = design.color === '#ffd700' || design.color === '#c0c0c0' ? '#333' : '#f0f0f0'

    const shapeElement = () => {
      switch (design.shape) {
        case 'oval':
          return <ellipse cx={cx} cy={cy} rx="70" ry="35" fill={design.color} />
        case 'round':
          return <circle cx={cx} cy={cy} r="38" fill={design.color} />
        case 'dog-tag':
          return <path d={`M ${cx-35} ${cy-40} L ${cx+35} ${cy-40} L ${cx+35} ${cy+30} L ${cx} ${cy+45} L ${cx-35} ${cy+30} Z`} fill={design.color} />
        case 'bottle-opener':
          return (
            <g>
              <rect x={cx-35} y={cy-35} width="70" height="70" rx="8" fill={design.color} />
              <circle cx={cx} cy={cy+12} r="12" fill="transparent" stroke={engravingColor} strokeWidth="2" />
            </g>
          )
        default: // rectangle
          return <rect x={cx-40} y={cy-25} width="80" height="50" rx="6" fill={design.color} />
      }
    }

    return (
      <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} className="mx-auto">
        {/* Ring hole */}
        <circle cx={cx} cy="12" r="6" fill="transparent" stroke={design.color} strokeWidth="3" />
        <circle cx={cx} cy="12" r="3" fill="#e5e5e5" />
        {/* Keychain body */}
        {shapeElement()}
        {/* Text */}
        <text
          x={cx}
          y={design.text2 ? cy - 6 : cy + 4}
          textAnchor="middle"
          fill={engravingColor}
          style={{ ...getTextStyle(), fontSize: design.text.length > 10 ? '10px' : '13px', fontWeight: 600 }}
        >
          {design.text || 'YOUR TEXT'}
        </text>
        {design.text2 && (
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill={engravingColor}
            style={{ ...getTextStyle(), fontSize: '9px' }}
          >
            {design.text2}
          </text>
        )}
      </svg>
    )
  }

  return (
    <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(139,115,85,0.08)' }}>
      {/* Header */}
      <div className="bg-[#C4B8A8] px-6 py-5">
        <h3 className="text-[#5C4A3A] font-bold text-lg tracking-tight">Custom Keychain Designer</h3>
        <p className="text-[#7A6A58] text-sm mt-1">Anodized aluminum with laser engraving</p>
      </div>

      {/* Simple Preview */}
      <div className="p-8 bg-[#F5F0E8] border-b border-[#E0D6C8]">
        {renderKeychainPreview()}
        <p className="text-center text-[#A89070] text-xs mt-3">Preview</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Shape Selection */}
        <div>
          <label className="block text-sm font-medium text-[#6B5A48] mb-2">Shape</label>
          <div className="grid grid-cols-5 gap-2">
            {KEYCHAIN_SHAPES.map((shape) => (
              <button
                key={shape.value}
                type="button"
                onClick={() => updateDesign({ shape: shape.value })}
                className={`p-3 border-2 rounded-xl text-center transition-all ${
                  design.shape === shape.value
                    ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                    : 'border-[#D4C8B8] hover:border-[#B8A898]'
                }`}
              >
                <div className="font-medium text-xs text-[#5C4A3A]">{shape.label}</div>
                <div className="text-xs text-[#7EB8C9] mt-1">${shape.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-[#6B5A48] mb-2">Color</label>
          <div className="flex gap-3">
            {KEYCHAIN_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => updateDesign({ color: color.hex })}
                className={`flex flex-col items-center gap-1 transition-all ${
                  design.color === color.hex ? 'scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 ${
                    design.color === color.hex ? 'border-[#7EB8C9] ring-2 ring-[#7EB8C9]/30' : 'border-[#D4C8B8]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-[#6B5A48]">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Lines */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#6B5A48] mb-1">
              Line 1 (Primary)
            </label>
            <input
              type="text"
              value={design.text}
              onChange={(e) => updateDesign({ text: e.target.value })}
              placeholder="Name, logo text, or message"
              maxLength={15}
              className="w-full border border-[#D4C8B8] bg-white px-3 py-2 text-sm text-[#5C4A3A] focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none rounded-lg"
            />
            <p className="text-xs text-[#A89070] mt-1">{design.text.length}/15 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B5A48] mb-1">
              Line 2 (Optional)
            </label>
            <input
              type="text"
              value={design.text2}
              onChange={(e) => updateDesign({ text2: e.target.value })}
              placeholder="Phone, date, or tagline"
              maxLength={20}
              className="w-full border border-[#D4C8B8] bg-white px-3 py-2 text-sm text-[#5C4A3A] focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none rounded-lg"
            />
          </div>
        </div>

        {/* Font Selection */}
        <FontSelector
          value={design.font}
          onChange={(value) => updateDesign({ font: value })}
          previewText={design.text || 'Abc'}
        />

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-[#6B5A48] mb-1">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateDesign({ quantity: Math.max(1, design.quantity - 1) })}
              className="w-10 h-10 border border-[#D4C8B8] rounded-lg font-bold text-lg text-[#6B5A48] hover:bg-[#EDE6DB]"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={design.quantity}
              onChange={(e) => updateDesign({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-20 text-center text-lg font-semibold border border-[#D4C8B8] rounded-lg py-2 text-[#5C4A3A]"
            />
            <button
              type="button"
              onClick={() => updateDesign({ quantity: design.quantity + 1 })}
              className="w-10 h-10 border border-[#D4C8B8] rounded-lg font-bold text-lg text-[#6B5A48] hover:bg-[#EDE6DB]"
            >
              +
            </button>
          </div>

          {/* Bulk discount notice */}
          <div className="mt-2 text-xs text-[#A89070]">
            <span className={design.quantity >= 10 ? 'text-[#7EB8C9] font-medium' : ''}>
              10+ units: 10% off
            </span>
            {' | '}
            <span className={design.quantity >= 25 ? 'text-[#7EB8C9] font-medium' : ''}>
              25+ units: 15% off
            </span>
          </div>
        </div>

        {/* Popular ideas */}
        <div className="p-3 bg-[#F5F0E8] border border-[#E0D6C8] rounded-xl">
          <p className="text-sm font-medium text-[#6B5A48] mb-2">Popular Ideas:</p>
          <div className="flex flex-wrap gap-2">
            {['Business Logo', 'Pet Name', 'Phone #', 'Team Name', 'Anniversary'].map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => {
                  if (!design.text) updateDesign({ text: idea })
                }}
                className="px-3 py-1 text-xs bg-white border border-[#D4C8B8] hover:border-[#7EB8C9] rounded-full text-[#6B5A48] transition-colors"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="pt-3 border-t border-[#E0D6C8]">
          <div className="bg-[#7EB8C9] text-white p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/80">Price per keychain:</span>
              <span className="text-lg font-bold">${design.pricePerUnit.toFixed(2)}</span>
            </div>
            {design.quantity > 1 && (
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-sm text-white/80">Total ({design.quantity} keychains):</span>
                <span className="text-xl font-bold">${design.totalPrice.toFixed(2)}</span>
              </div>
            )}
            {design.quantity >= 10 && (
              <div className="text-xs text-white/90 mt-2">
                Bulk discount applied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
