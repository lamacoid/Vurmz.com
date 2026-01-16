'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'
import dynamic from 'next/dynamic'

// Dynamic import for 3D component (avoid SSR issues with Three.js)
const Pen3D = dynamic(() => import('./builder/visualizers/Pen3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-vurmz-teal/30 border-t-vurmz-teal rounded-full animate-spin" />
        <div className="text-gray-400 text-sm">Loading 3D Preview...</div>
      </div>
    </div>
  ),
})

interface PenData {
  penStyle: 'stylus' | 'fountain'
  line1: string
  line2: string
  textStyle: 'two-lines' | 'one-line'
  font: string
  logoEnabled: boolean
  logoPlacement: 'cap' | 'barrel'
  bothSides: boolean
  penColor: string
  pricePerPen: number
}

interface BrandedPenPreviewProps {
  onChange: (data: PenData) => void
}

const MAX_CHARS_PER_LINE = 25

const penColors = [
  { value: 'black', label: 'Black', barrel: '#1a1a1a' },
  { value: 'white', label: 'White', barrel: '#f5f5f5' },
  { value: 'blue', label: 'Blue', barrel: '#2a5a9e' },
  { value: 'red', label: 'Red', barrel: '#c43a3a' },
  { value: 'pink', label: 'Pink', barrel: '#e87a9a' },
  { value: 'purple', label: 'Purple', barrel: '#6a3a8a' },
]

export default function BrandedPenPreview({ onChange }: BrandedPenPreviewProps) {
  const [penData, setPenData] = useState<PenData>({
    penStyle: 'stylus',
    line1: '',
    line2: '',
    textStyle: 'two-lines',
    font: 'arial',
    logoEnabled: false,
    logoPlacement: 'cap',
    bothSides: false,
    penColor: 'black',
    pricePerPen: 3
  })

  const calculatePrice = (data: Omit<PenData, 'pricePerPen'>) => {
    let price = 3
    if (data.textStyle === 'two-lines' && data.line2.trim().length > 0) price += 0.50
    if (data.logoEnabled) price += 2
    if (data.bothSides) price += 2
    return price
  }

  useEffect(() => {
    onChange(penData)
  }, [penData, onChange])

  const updateField = (field: keyof PenData, value: string | boolean) => {
    setPenData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'penStyle' && value === 'fountain') {
        updated.penColor = 'black'
        updated.textStyle = 'one-line'
        updated.line2 = ''
        updated.logoEnabled = false
        updated.bothSides = false
      }
      if (['logoEnabled', 'bothSides', 'penStyle', 'textStyle', 'line2'].includes(field)) {
        updated.pricePerPen = calculatePrice(updated)
      }
      return updated
    })
  }

  const isFountainPen = penData.penStyle === 'fountain'
  const selectedColor = penColors.find(c => c.value === penData.penColor) || penColors[0]
  const selectedFont = fontOptions.find(f => f.value === penData.font) || fontOptions[0]

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(106,140,140,0.12)' }}>
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-vurmz-teal/5 via-transparent to-vurmz-teal/5" />
        <h3 className="relative text-white font-bold text-lg tracking-tight">Branded Pen Designer</h3>
        <p className="relative text-gray-400 text-sm mt-1">Custom laser-engraved pens for your business</p>
      </div>

      {/* Live 3D Preview - Clean background */}
      <div className="relative p-6 border-b border-gray-100" style={{ background: 'linear-gradient(180deg, rgba(250,251,250,0.98) 0%, rgba(245,247,246,0.95) 100%)' }}>
        <Pen3D
          line1={penData.line1}
          line2={penData.line2}
          textStyle={penData.textStyle}
          penColor={selectedColor.barrel}
          isFountain={isFountainPen}
        />
        <div className="text-center text-sm text-gray-500 mt-3 font-medium">
          {isFountainPen ? 'Premium Fountain Pen' : `${selectedColor.label} Stylus Pen`}
          {penData.bothSides && ' • Both sides engraved'}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Pen Style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pen Style</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateField('penStyle', 'stylus')}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                penData.penStyle === 'stylus'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-800">Stylus Pen</div>
              <div className="text-xs text-gray-500">Soft-touch, multiple colors</div>
            </button>
            <button
              type="button"
              onClick={() => updateField('penStyle', 'fountain')}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                penData.penStyle === 'fountain'
                  ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-800">Fountain Pen</div>
              <div className="text-xs text-gray-500">Premium black anodized</div>
            </button>
          </div>
          {isFountainPen && (
            <p className="text-xs text-vurmz-teal mt-2 font-medium">
              A keepsake pen people actually keep and show off - great for referrals
            </p>
          )}
        </div>

        {/* Text Layout - only for stylus */}
        {!isFountainPen && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text Layout</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('textStyle', 'two-lines')}
                className={`p-3 border-2 rounded-xl text-center transition-all ${
                  penData.textStyle === 'two-lines'
                    ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">Two Lines</div>
              </button>
              <button
                type="button"
                onClick={() => updateField('textStyle', 'one-line')}
                className={`p-3 border-2 rounded-xl text-center transition-all ${
                  penData.textStyle === 'one-line'
                    ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">One Line</div>
              </button>
            </div>
          </div>
        )}

        {/* Text Inputs */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {penData.textStyle === 'two-lines' ? 'Line 1' : 'Text'} *
          </label>
          <input
            type="text"
            value={penData.line1}
            onChange={(e) => updateField('line1', e.target.value.slice(0, MAX_CHARS_PER_LINE))}
            placeholder={penData.textStyle === 'two-lines' ? 'ACME CORPORATION' : 'Your Business Name'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">{penData.line1.length}/{MAX_CHARS_PER_LINE} characters</p>
        </div>

        {penData.textStyle === 'two-lines' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Line 2</label>
            <input
              type="text"
              value={penData.line2}
              onChange={(e) => updateField('line2', e.target.value.slice(0, MAX_CHARS_PER_LINE))}
              placeholder="www.acme.com | (555) 123-4567"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{penData.line2.length}/{MAX_CHARS_PER_LINE} characters</p>
          </div>
        )}

        {/* Font Selection */}
        <FontSelector
          value={penData.font}
          onChange={(value) => updateField('font', value)}
          previewText={penData.line1 || 'Abc'}
        />

        {/* Pen Color - only for stylus pens */}
        {!isFountainPen && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pen Color</label>
            <div className="flex gap-2 flex-wrap">
              {penColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateField('penColor', color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    penData.penColor === color.value
                      ? 'border-vurmz-teal ring-2 ring-vurmz-teal ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.barrel }}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Selected: {selectedColor.label}</p>
          </div>
        )}

        {/* Add-ons - only for stylus pens */}
        {!isFountainPen && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Add-ons</label>

            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <input
                type="checkbox"
                checked={penData.logoEnabled}
                onChange={(e) => updateField('logoEnabled', e.target.checked)}
                className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
              />
              <PhotoIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm flex-1">Add Logo</span>
              <span className="text-xs text-vurmz-teal font-medium">+$2</span>
            </label>

            {penData.logoEnabled && (
              <div className="ml-4 pl-4 border-l-2 border-vurmz-teal/30 space-y-2">
                <p className="text-xs text-gray-600">Logo placement:</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('logoPlacement', 'cap')}
                    className={`px-3 py-1.5 text-xs font-medium border rounded-lg ${
                      penData.logoPlacement === 'cap'
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-300'
                    }`}
                  >
                    On Cap
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('logoPlacement', 'barrel')}
                    className={`px-3 py-1.5 text-xs font-medium border rounded-lg ${
                      penData.logoPlacement === 'barrel'
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-300'
                    }`}
                  >
                    On Barrel
                  </button>
                </div>
                <p className="text-xs text-gray-500 italic">Upload your logo file below</p>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <input
                type="checkbox"
                checked={penData.bothSides}
                onChange={(e) => updateField('bothSides', e.target.checked)}
                className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
              />
              <span className="text-sm flex-1">Engrave Both Sides</span>
              <span className="text-xs text-vurmz-teal font-medium">+$2</span>
            </label>
          </div>
        )}

        {/* Premium Price Summary */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #2C3533 0%, #1E2422 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
          {/* Subtle glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vurmz-teal/30 to-transparent" />

          <div className="p-5 text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Price per pen</span>
              <span className="text-2xl font-bold text-vurmz-teal">${penData.pricePerPen.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1 border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span>Base price</span>
                <span className="text-gray-400">$3.00</span>
              </div>
              {penData.logoEnabled && (
                <div className="flex justify-between">
                  <span>+ Logo ({penData.logoPlacement})</span>
                  <span className="text-gray-400">$2.00</span>
                </div>
              )}
              {penData.bothSides && (
                <div className="flex justify-between">
                  <span>+ Both Sides</span>
                  <span className="text-gray-400">$2.00</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
