'use client'

import { useState, useEffect } from 'react'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'
import dynamic from 'next/dynamic'

// Dynamic import for 3D component (avoid SSR issues with Three.js)
const Keychain3D = dynamic(() => import('./builder/visualizers/Keychain3D'), {
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

  const selectedFont = fontOptions.find(f => f.value === design.font) || fontOptions[0]

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

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(106,140,140,0.12)' }}>
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-vurmz-teal/5 via-transparent to-vurmz-teal/5" />
        <h3 className="relative text-white font-bold text-lg tracking-tight">Custom Keychain Designer</h3>
        <p className="relative text-gray-400 text-sm mt-1">Anodized aluminum with laser engraving</p>
      </div>

      {/* Live 3D Preview - Clean background */}
      <div className="relative p-6 border-b border-gray-100" style={{ background: 'linear-gradient(180deg, rgba(250,251,250,0.98) 0%, rgba(245,247,246,0.95) 100%)' }}>
        <Keychain3D
          shape={design.shape}
          text={design.text || 'YOUR TEXT'}
          secondLine={design.text2}
          materialColor={
            KEYCHAIN_COLORS.find(c => c.hex === design.color)?.value || 'black'
          }
        />
      </div>

      <div className="p-6 space-y-6">
        {/* Shape Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
          <div className="grid grid-cols-5 gap-2">
            {KEYCHAIN_SHAPES.map((shape) => (
              <button
                key={shape.value}
                type="button"
                onClick={() => updateDesign({ shape: shape.value })}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  design.shape === shape.value
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-xs">{shape.label}</div>
                <div className="text-xs text-vurmz-teal mt-1">${shape.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
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
                    design.color === color.hex ? 'border-vurmz-teal ring-2 ring-vurmz-teal/30' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-gray-600">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Lines */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line 1 (Primary)
            </label>
            <input
              type="text"
              value={design.text}
              onChange={(e) => updateDesign({ text: e.target.value })}
              placeholder="Name, logo text, or message"
              maxLength={15}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
            />
            <p className="text-xs text-gray-500 mt-1">{design.text.length}/15 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line 2 (Optional)
            </label>
            <input
              type="text"
              value={design.text2}
              onChange={(e) => updateDesign({ text2: e.target.value })}
              placeholder="Phone, date, or tagline"
              maxLength={20}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateDesign({ quantity: Math.max(1, design.quantity - 1) })}
              className="w-10 h-10 border border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={design.quantity}
              onChange={(e) => updateDesign({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-20 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2"
            />
            <button
              type="button"
              onClick={() => updateDesign({ quantity: design.quantity + 1 })}
              className="w-10 h-10 border border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Bulk discount notice */}
          <div className="mt-2 text-xs text-gray-500">
            <span className={design.quantity >= 10 ? 'text-vurmz-teal font-medium' : ''}>
              10+ units: 10% off
            </span>
            {' | '}
            <span className={design.quantity >= 25 ? 'text-vurmz-teal font-medium' : ''}>
              25+ units: 15% off
            </span>
          </div>
        </div>

        {/* Popular ideas */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Popular Ideas:</p>
          <div className="flex flex-wrap gap-2">
            {['Business Logo', 'Pet Name', 'Phone #', 'Team Name', 'Anniversary'].map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => {
                  if (!design.text) updateDesign({ text: idea })
                }}
                className="px-3 py-1 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-full text-gray-600 transition-colors"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="pt-3 border-t border-gray-200">
          <div className="bg-vurmz-dark text-white p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Price per keychain:</span>
              <span className="text-lg font-bold">${design.pricePerUnit.toFixed(2)}</span>
            </div>
            {design.quantity > 1 && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                <span className="text-sm text-gray-300">Total ({design.quantity} keychains):</span>
                <span className="text-xl font-bold text-vurmz-teal">${design.totalPrice.toFixed(2)}</span>
              </div>
            )}
            {design.quantity >= 10 && (
              <div className="text-xs text-vurmz-teal mt-2">
                Bulk discount applied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
