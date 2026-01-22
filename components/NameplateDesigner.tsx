'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'

// Spacetime font - exclusive for metal products (brass, stainless, knives)
const SPACETIME_FONT = {
  value: 'spacetime',
  label: 'Spacetime',
  style: { fontFamily: 'spacetime-regular, sans-serif' }
}

interface NameEntry {
  id: number
  line1: string
  line2: string
}

export interface NameplateData {
  material: 'abs' | 'brass' | 'stainless'
  size: '2x8' | '2x10'
  names: NameEntry[]
  textStyle: 'one-line' | 'two-lines'
  font: string
  plateColor: string
  logoEnabled: boolean
  pricePerPlate: number
  quantity: number
}

interface NameplateDesignerProps {
  onChange: (data: NameplateData) => void
}

const MAX_CHARS_LINE1 = 30
const MAX_CHARS_LINE2 = 35
const MAX_NAMES = 15

// Material options with pricing
const materials = [
  {
    value: 'abs',
    label: 'ABS Plastic',
    description: 'Durable engraved plastic',
    priceAdd: 0,
    hasColorOptions: true,
  },
  {
    value: 'brass',
    label: 'Solid Brass',
    description: 'Premium engraved brass',
    priceAdd: 8,
    hasColorOptions: false,
    bg: '#b5a642',
    text: '#3d2914',
  },
  {
    value: 'stainless',
    label: 'Stainless Steel',
    description: 'Professional SS finish',
    priceAdd: 8,
    hasColorOptions: false,
    bg: '#c0c0c0',
    text: '#1a1a1a',
  },
]

// ABS color options
const plateColors = [
  { value: 'black-silver', label: 'Black/Silver', bg: '#1a1a1a', text: '#c0c0c0' },
  { value: 'black-gold', label: 'Black/Gold', bg: '#1a1a1a', text: '#d4af37' },
  { value: 'silver-black', label: 'Silver/Black', bg: '#c0c0c0', text: '#1a1a1a' },
  { value: 'gold-black', label: 'Gold/Black', bg: '#d4af37', text: '#1a1a1a' },
  { value: 'walnut', label: 'Walnut/Gold', bg: '#5c4033', text: '#d4af37' },
  { value: 'white-black', label: 'White/Black', bg: '#f5f5f5', text: '#1a1a1a' },
  { value: 'blue-silver', label: 'Blue/Silver', bg: '#1e3a5f', text: '#c0c0c0' },
  { value: 'burgundy-gold', label: 'Burgundy/Gold', bg: '#722f37', text: '#d4af37' },
]

const sizes = [
  { value: '2x8', label: '2" × 8"', basePrice: 8, width: 8, height: 2 },
  { value: '2x10', label: '2" × 10"', basePrice: 10, width: 10, height: 2 },
]

// Default 5 empty name entries
const createDefaultNames = (): NameEntry[] => [
  { id: 1, line1: '', line2: '' },
  { id: 2, line1: '', line2: '' },
  { id: 3, line1: '', line2: '' },
  { id: 4, line1: '', line2: '' },
  { id: 5, line1: '', line2: '' },
]

export default function NameplateDesigner({ onChange }: NameplateDesignerProps) {
  const [data, setData] = useState<NameplateData>({
    material: 'abs',
    size: '2x8',
    names: createDefaultNames(),
    textStyle: 'two-lines',
    font: 'arial',
    plateColor: 'black-silver',
    logoEnabled: false,
    pricePerPlate: 8,
    quantity: 5,
  })

  const [previewIndex, setPreviewIndex] = useState(0)

  // Calculate price: base + material + $2 for logo
  const calculatePrice = (d: Omit<NameplateData, 'pricePerPlate'>) => {
    const sizeConfig = sizes.find(s => s.value === d.size)
    const materialConfig = materials.find(m => m.value === d.material)
    let price = sizeConfig?.basePrice || 8
    price += materialConfig?.priceAdd || 0
    if (d.logoEnabled) price += 2
    return price
  }

  useEffect(() => {
    const filledNames = data.names.filter(n => n.line1.trim() !== '')
    onChange({ ...data, quantity: filledNames.length || 1 })
  }, [data, onChange])

  const updateField = (field: keyof NameplateData, value: string | boolean | NameEntry[]) => {
    setData(prev => {
      const updated = { ...prev, [field]: value }
      if (['size', 'logoEnabled', 'material'].includes(field)) {
        updated.pricePerPlate = calculatePrice(updated)
      }
      return updated
    })
  }

  const updateName = (id: number, field: 'line1' | 'line2', value: string) => {
    setData(prev => ({
      ...prev,
      names: prev.names.map(n =>
        n.id === id ? { ...n, [field]: value } : n
      )
    }))
  }

  const addName = () => {
    if (data.names.length >= MAX_NAMES) return
    const newId = Math.max(...data.names.map(n => n.id)) + 1
    setData(prev => ({
      ...prev,
      names: [...prev.names, { id: newId, line1: '', line2: '' }]
    }))
  }

  const removeName = (id: number) => {
    if (data.names.length <= 1) return
    setData(prev => ({
      ...prev,
      names: prev.names.filter(n => n.id !== id)
    }))
    if (previewIndex >= data.names.length - 1) {
      setPreviewIndex(Math.max(0, data.names.length - 2))
    }
  }

  const selectedMaterial = materials.find(m => m.value === data.material) || materials[0]
  const selectedColor = plateColors.find(c => c.value === data.plateColor) || plateColors[0]
  const selectedFont = data.font === 'spacetime'
    ? SPACETIME_FONT
    : (fontOptions.find(f => f.value === data.font) || fontOptions[0])
  const selectedSize = sizes.find(s => s.value === data.size) || sizes[0]

  // Get display colors based on material
  const displayBg = selectedMaterial.hasColorOptions ? selectedColor.bg : (selectedMaterial as typeof materials[1]).bg
  const displayText = selectedMaterial.hasColorOptions ? selectedColor.text : (selectedMaterial as typeof materials[1]).text

  const getTextStyle = () => selectedFont?.style || { fontFamily: 'Arial, sans-serif' }

  // SVG dimensions (scaled for preview)
  const scale = 30
  const svgWidth = selectedSize.width * scale
  const svgHeight = selectedSize.height * scale
  const centerX = svgWidth / 2

  // Current preview name
  const previewName = data.names[previewIndex] || data.names[0]
  const filledCount = data.names.filter(n => n.line1.trim() !== '').length

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-lg mb-4 text-vurmz-dark">Design Your Name Plates</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Material Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
            <div className="grid grid-cols-3 gap-2">
              {materials.map(mat => (
                <button
                  key={mat.value}
                  type="button"
                  onClick={() => updateField('material', mat.value)}
                  className={`p-3 text-center border-2 rounded-xl transition-all ${
                    data.material === mat.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1 border border-gray-300"
                    style={{ backgroundColor: mat.hasColorOptions ? '#1a1a1a' : (mat as typeof materials[1]).bg }}
                  />
                  <div className="font-medium text-sm">{mat.label}</div>
                  <div className="text-xs text-gray-500">
                    {mat.priceAdd > 0 ? `+$${mat.priceAdd}` : 'Standard'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plate Size</label>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map(size => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => updateField('size', size.value)}
                  className={`px-4 py-3 text-sm font-medium border-2 rounded-xl transition-all ${
                    data.size === size.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-dark'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{size.label}</div>
                  <div className="text-xs text-gray-500">${size.basePrice}/plate</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Style Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Layout</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('textStyle', 'one-line')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-all ${
                  data.textStyle === 'one-line'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Name Only
              </button>
              <button
                type="button"
                onClick={() => updateField('textStyle', 'two-lines')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-all ${
                  data.textStyle === 'two-lines'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Name + Title
              </button>
            </div>
          </div>

          {/* Names List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Names ({filledCount} plate{filledCount !== 1 ? 's' : ''})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {data.names.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`p-3 border rounded-lg transition-all ${
                    previewIndex === idx ? 'border-vurmz-teal bg-vurmz-teal/5' : 'border-gray-200'
                  }`}
                  onClick={() => setPreviewIndex(idx)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      value={entry.line1}
                      onChange={(e) => updateName(entry.id, 'line1', e.target.value.slice(0, MAX_CHARS_LINE1))}
                      placeholder="Name"
                      className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                    />
                    {data.names.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeName(entry.id); }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {data.textStyle === 'two-lines' && (
                    <div className="flex items-center gap-2">
                      <span className="w-6"></span>
                      <input
                        type="text"
                        value={entry.line2}
                        onChange={(e) => updateName(entry.id, 'line2', e.target.value.slice(0, MAX_CHARS_LINE2))}
                        placeholder="Title / Department"
                        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {data.names.length < MAX_NAMES && (
              <button
                type="button"
                onClick={addName}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-vurmz-teal hover:text-vurmz-teal transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                Add Another Name
              </button>
            )}
          </div>

          {/* Font Selection */}
          <div>
            {/* Spacetime - Metal exclusive (brass/stainless only) */}
            {(data.material === 'brass' || data.material === 'stainless') && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <button
                  type="button"
                  onClick={() => updateField('font', 'spacetime')}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    data.font === 'spacetime'
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium" style={SPACETIME_FONT.style}>Spacetime</span>
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Metal Exclusive</span>
                    </div>
                    <span className="text-sm" style={SPACETIME_FONT.style}>{previewName.line1 || 'Abc'}</span>
                  </div>
                </button>
              </div>
            )}
            <FontSelector
              value={data.font === 'spacetime' ? 'arial' : data.font}
              onChange={(value) => updateField('font', value)}
              previewText={previewName.line1 || 'Abc'}
            />
          </div>

          {/* Plate Color - only for ABS */}
          {selectedMaterial.hasColorOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plate Color</label>
              <div className="grid grid-cols-4 gap-2">
                {plateColors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField('plateColor', color.value)}
                    className={`relative p-1 rounded-lg border-2 transition-all ${
                      data.plateColor === color.value
                        ? 'border-vurmz-teal ring-2 ring-vurmz-teal/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={color.label}
                  >
                    <div
                      className="h-8 rounded flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      Abc
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Selected: {selectedColor.label}</p>
            </div>
          )}

          {/* Logo Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-vurmz-teal/50 transition-all">
              <input
                type="checkbox"
                checked={data.logoEnabled}
                onChange={(e) => updateField('logoEnabled', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-vurmz-teal focus:ring-vurmz-teal"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">Add Logo/Graphic</div>
                <div className="text-xs text-gray-500">+$2 per plate - Upload after ordering</div>
              </div>
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            </label>
          </div>

          {/* Price Display */}
          <div className="bg-vurmz-teal/10 rounded-xl p-4 border border-vurmz-teal/20">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Price per plate:</span>
              <span className="text-xl font-bold text-vurmz-teal">${data.pricePerPlate}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-vurmz-teal/20">
              <span className="text-gray-700">Total ({filledCount} plate{filledCount !== 1 ? 's' : ''}):</span>
              <span className="text-2xl font-bold text-vurmz-teal">${data.pricePerPlate * (filledCount || 1)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedSize.label} • {selectedMaterial.label} {data.logoEnabled ? '+ logo' : ''}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-start pt-4">
          <p className="text-sm text-gray-500 mb-3">
            Preview: Plate #{previewIndex + 1}
            {previewName.line1 && <span className="text-vurmz-teal ml-1">({previewName.line1})</span>}
          </p>
          <div className="bg-white rounded-xl p-6 shadow-inner border border-gray-100 flex items-center justify-center">
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="drop-shadow-md"
            >
              {/* Plate background */}
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                rx="4"
                fill={displayBg}
              />

              {/* Beveled edge effect */}
              <rect
                x="2"
                y="2"
                width={svgWidth - 4}
                height={svgHeight - 4}
                rx="3"
                fill="none"
                stroke={displayText}
                strokeWidth="0.5"
                opacity="0.3"
              />

              {/* Text */}
              {data.textStyle === 'one-line' ? (
                <text
                  x={centerX}
                  y={svgHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={displayText}
                  style={{
                    ...getTextStyle(),
                    fontSize: (previewName.line1 || '').length > 20 ? '16px' : '20px',
                    fontWeight: 'bold',
                  }}
                >
                  {previewName.line1 || 'Enter Name'}
                </text>
              ) : (
                <>
                  <text
                    x={centerX}
                    y={svgHeight * 0.38}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={displayText}
                    style={{
                      ...getTextStyle(),
                      fontSize: (previewName.line1 || '').length > 15 ? '14px' : '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {previewName.line1 || 'Enter Name'}
                  </text>
                  <text
                    x={centerX}
                    y={svgHeight * 0.68}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={displayText}
                    style={{
                      ...getTextStyle(),
                      fontSize: (previewName.line2 || '').length > 20 ? '10px' : '12px',
                    }}
                  >
                    {previewName.line2 || 'Title / Department'}
                  </text>
                </>
              )}

              {/* Logo placeholder */}
              {data.logoEnabled && (
                <g opacity="0.5">
                  <rect
                    x={svgWidth - 45}
                    y={(svgHeight - 30) / 2}
                    width="35"
                    height="30"
                    rx="2"
                    fill={displayText}
                    opacity="0.2"
                  />
                  <text
                    x={svgWidth - 27}
                    y={svgHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={displayText}
                    fontSize="8"
                  >
                    LOGO
                  </text>
                </g>
              )}
            </svg>
          </div>
          <p className="text-xs text-gray-400 mt-3">Actual size: {selectedSize.label}</p>

          {/* Preview selector */}
          {filledCount > 1 && (
            <div className="mt-4 flex gap-1 flex-wrap justify-center">
              {data.names.map((n, idx) => n.line1.trim() && (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    previewIndex === idx
                      ? 'bg-vurmz-teal text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
