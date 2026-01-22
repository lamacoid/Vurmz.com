'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'

export interface CoasterData {
  material: 'wood' | 'slate' | 'steel-gold' | 'steel-silver'
  shape: 'round' | 'square'
  text: string
  font: string
  logoEnabled: boolean
  pricePerCoaster: number
}

interface CoasterDesignerProps {
  onChange: (data: CoasterData) => void
}

const MAX_CHARS = 25

const materials = [
  {
    value: 'wood',
    label: 'Natural Wood',
    basePrice: 4,
    bg: '#8B5A2B',
    engravingColor: '#3d2817',
    shapes: ['round', 'square'],
    description: 'Warm natural look'
  },
  {
    value: 'slate',
    label: 'Natural Slate',
    basePrice: 5,
    bg: '#4a5568',
    engravingColor: '#a0aec0',
    shapes: ['round', 'square'],
    description: 'Elegant stone finish'
  },
  {
    value: 'steel-gold',
    label: 'Steel (Gold)',
    basePrice: 6,
    bg: '#d4af37',
    engravingColor: '#1a1a1a',
    shapes: ['round'],
    description: 'Premium gold finish'
  },
  {
    value: 'steel-silver',
    label: 'Steel (Silver)',
    basePrice: 6,
    bg: '#c0c0c0',
    engravingColor: '#1a1a1a',
    shapes: ['round'],
    description: 'Classic silver finish'
  },
]

const shapes = [
  { value: 'round', label: 'Round', icon: '○' },
  { value: 'square', label: 'Square', icon: '□' },
]

export default function CoasterDesigner({ onChange }: CoasterDesignerProps) {
  const [data, setData] = useState<CoasterData>({
    material: 'wood',
    shape: 'round',
    text: '',
    font: 'arial',
    logoEnabled: false,
    pricePerCoaster: 4,
  })

  const calculatePrice = (d: Omit<CoasterData, 'pricePerCoaster'>) => {
    const materialConfig = materials.find(m => m.value === d.material)
    return materialConfig?.basePrice || 4
  }

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const updateField = (field: keyof CoasterData, value: string | boolean) => {
    setData(prev => {
      const updated = { ...prev, [field]: value }

      // When changing material, check if current shape is valid
      if (field === 'material') {
        const newMaterial = materials.find(m => m.value === value)
        if (newMaterial && !newMaterial.shapes.includes(prev.shape)) {
          updated.shape = newMaterial.shapes[0] as 'round' | 'square'
        }
      }

      if (['material'].includes(field)) {
        updated.pricePerCoaster = calculatePrice(updated)
      }
      return updated
    })
  }

  const selectedMaterial = materials.find(m => m.value === data.material) || materials[0]
  const selectedFont = fontOptions.find(f => f.value === data.font) || fontOptions[0]
  const availableShapes = shapes.filter(s => selectedMaterial.shapes.includes(s.value))

  const getTextStyle = () => selectedFont?.style || { fontFamily: 'Arial, sans-serif' }

  // SVG dimensions
  const size = 140
  const center = size / 2

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-lg mb-4 text-vurmz-dark">Design Your Coasters</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Material Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
            <div className="grid grid-cols-2 gap-2">
              {materials.map(mat => (
                <button
                  key={mat.value}
                  type="button"
                  onClick={() => updateField('material', mat.value)}
                  className={`p-3 text-left border-2 rounded-xl transition-all ${
                    data.material === mat.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: mat.bg }}
                    />
                    <div>
                      <div className="font-medium text-sm">{mat.label}</div>
                      <div className="text-xs text-gray-500">${mat.basePrice}/ea</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shape Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
            <div className="flex gap-2">
              {availableShapes.map(shape => (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => updateField('shape', shape.value)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    data.shape === shape.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{shape.icon}</span>
                  {shape.label}
                </button>
              ))}
            </div>
            {selectedMaterial.shapes.length === 1 && (
              <p className="text-xs text-gray-500 mt-1">
                Stainless steel is only available in round
              </p>
            )}
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text / Monogram
            </label>
            <input
              type="text"
              value={data.text}
              onChange={(e) => updateField('text', e.target.value.slice(0, MAX_CHARS))}
              placeholder="JDS or THE SMITHS"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{data.text.length}/{MAX_CHARS} characters</p>
          </div>

          {/* Font Selection */}
          <FontSelector
            value={data.font}
            onChange={(value) => updateField('font', value)}
            previewText={data.text || 'Abc'}
          />

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
                <div className="font-medium text-gray-800">Custom Logo/Design</div>
                <div className="text-xs text-gray-500">Upload your design after ordering</div>
              </div>
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            </label>
          </div>

          {/* Price Display */}
          <div className="bg-vurmz-teal/10 rounded-xl p-4 border border-vurmz-teal/20">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700">Price per coaster:</span>
                <div className="text-xs text-gray-500">{selectedMaterial.label}</div>
              </div>
              <span className="text-2xl font-bold text-vurmz-teal">${data.pricePerCoaster}</span>
            </div>
            <div className="text-xs text-vurmz-teal/70 mt-2 font-medium">
              Pack of 15 = ${data.pricePerCoaster * 15}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500 mb-3">Preview (4&quot; coaster)</p>
          <div className="bg-white rounded-xl p-8 shadow-inner border border-gray-100">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="drop-shadow-lg"
            >
              {/* Coaster shape */}
              {data.shape === 'round' ? (
                <>
                  <circle
                    cx={center}
                    cy={center}
                    r={center - 2}
                    fill={selectedMaterial.bg}
                  />
                  {/* Texture for wood/slate */}
                  {(data.material === 'wood' || data.material === 'slate') && (
                    <circle
                      cx={center}
                      cy={center}
                      r={center - 10}
                      fill="none"
                      stroke={selectedMaterial.engravingColor}
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  )}
                </>
              ) : (
                <>
                  <rect
                    x="2"
                    y="2"
                    width={size - 4}
                    height={size - 4}
                    rx="8"
                    fill={selectedMaterial.bg}
                  />
                  {/* Texture for wood/slate */}
                  {(data.material === 'wood' || data.material === 'slate') && (
                    <rect
                      x="12"
                      y="12"
                      width={size - 24}
                      height={size - 24}
                      rx="4"
                      fill="none"
                      stroke={selectedMaterial.engravingColor}
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  )}
                </>
              )}

              {/* Text or Logo */}
              {data.logoEnabled ? (
                <g>
                  <rect
                    x={center - 25}
                    y={center - 20}
                    width="50"
                    height="40"
                    rx="4"
                    fill={selectedMaterial.engravingColor}
                    opacity="0.3"
                  />
                  <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={selectedMaterial.engravingColor}
                    fontSize="10"
                    opacity="0.7"
                  >
                    YOUR LOGO
                  </text>
                </g>
              ) : (
                <text
                  x={center}
                  y={center}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={selectedMaterial.engravingColor}
                  style={{
                    ...getTextStyle(),
                    fontSize: data.text.length > 10 ? '14px' : data.text.length > 5 ? '18px' : '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {data.text || 'ABC'}
                </text>
              )}
            </svg>
          </div>
          <p className="text-xs text-gray-400 mt-3">Actual size: 4&quot; diameter</p>
        </div>
      </div>
    </div>
  )
}
