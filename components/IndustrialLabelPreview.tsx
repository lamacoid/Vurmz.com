'use client'

import { useState, useEffect } from 'react'
import { fontOptions, ENGRAVING_COLOR } from '@/lib/fonts'
import FontSelector from './FontSelector'

interface IndustrialLabelData {
  labelType: 'control-panels' | 'asset-tags' | 'valve-tags'
  material: 'brass' | 'anodized-aluminum' | 'plastic'
  // Control Panel specific
  panelSize: string
  warningText: string
  equipmentId: string
  // Asset Tag specific
  companyName: string
  assetPrefix: string
  startNumber: string
  includePhone: boolean
  phoneNumber: string
  // Valve Tag specific
  valveId: string
  valveDescription: string
  valveShape: 'round' | 'octagon'
  valveSize: string
  // Common
  font: string
  plasticColors: string
  pricePerUnit: number
}

interface IndustrialLabelPreviewProps {
  labelType: 'control-panels' | 'asset-tags' | 'valve-tags'
  material: 'brass' | 'anodized-aluminum' | 'plastic'
  onChange: (data: IndustrialLabelData) => void
}

const panelSizes = [
  { value: '1x3', label: '1" x 3"', price: 8 },
  { value: '2x4', label: '2" x 4"', price: 12 },
  { value: '3x5', label: '3" x 5"', price: 18 },
  { value: '4x6', label: '4" x 6"', price: 25 },
]

const valveSizes = [
  { value: '1.5', label: '1.5"', price: 6 },
  { value: '2', label: '2"', price: 8 },
  { value: '2.5', label: '2.5"', price: 10 },
  { value: '3', label: '3"', price: 12 },
]

const plasticColorOptions = [
  { value: 'black-white', label: 'Black/White', bg: '#1a1a1a', text: '#ffffff' },
  { value: 'white-black', label: 'White/Black', bg: '#f5f5f5', text: '#1a1a1a' },
  { value: 'red-white', label: 'Red/White', bg: '#cc3333', text: '#ffffff' },
  { value: 'blue-white', label: 'Blue/White', bg: '#2a5a9e', text: '#ffffff' },
  { value: 'yellow-black', label: 'Yellow/Black', bg: '#f0c020', text: '#1a1a1a' },
  { value: 'orange-black', label: 'Orange/Black', bg: '#e07020', text: '#1a1a1a' },
]

const materialColors = {
  brass: { bg: '#b8860b', text: '#1a1a1a', highlight: '#d4af37' },
  'anodized-aluminum': { bg: '#2a2a2a', text: '#c0c0c0', highlight: '#404040' },
  plastic: { bg: '#1a1a1a', text: '#ffffff', highlight: '#333' },
}

export default function IndustrialLabelPreview({ labelType, material, onChange }: IndustrialLabelPreviewProps) {
  const [data, setData] = useState<IndustrialLabelData>({
    labelType,
    material,
    panelSize: '2x4',
    warningText: 'DANGER',
    equipmentId: 'PANEL-001',
    companyName: '',
    assetPrefix: 'ASSET',
    startNumber: '001',
    includePhone: false,
    phoneNumber: '',
    valveId: 'V-01',
    valveDescription: 'MAIN WATER',
    valveShape: 'round',
    valveSize: '2',
    font: 'arial',
    plasticColors: 'black-white',
    pricePerUnit: 12,
  })

  useEffect(() => {
    setData(prev => ({ ...prev, labelType, material }))
  }, [labelType, material])

  const calculatePrice = () => {
    let price = 0

    if (labelType === 'control-panels') {
      const size = panelSizes.find(s => s.value === data.panelSize)
      price = size?.price || 12
    } else if (labelType === 'asset-tags') {
      price = 5 // Base price for asset tags
      if (data.includePhone) price += 1
    } else if (labelType === 'valve-tags') {
      const size = valveSizes.find(s => s.value === data.valveSize)
      price = size?.price || 8
    }

    // Material adjustments
    if (material === 'brass') price += 3

    return price
  }

  useEffect(() => {
    const price = calculatePrice()
    const updatedData = { ...data, pricePerUnit: price }
    onChange(updatedData)
  }, [data])

  const updateField = (field: keyof IndustrialLabelData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const selectedFont = fontOptions.find(f => f.value === data.font) || fontOptions[0]
  const getTextStyle = () => selectedFont?.style || { fontFamily: 'Arial, sans-serif' }

  const getColors = () => {
    if (material === 'plastic') {
      const colors = plasticColorOptions.find(c => c.value === data.plasticColors)
      return { bg: colors?.bg || '#1a1a1a', text: colors?.text || '#fff' }
    }
    return materialColors[material]
  }

  const colors = getColors()

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 mt-4">
      <h3 className="font-bold text-lg mb-4">
        Design Your {labelType === 'control-panels' ? 'Control Panel' : labelType === 'asset-tags' ? 'Asset Tag' : 'Valve Tag'}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Plastic Color Selection */}
          {material === 'plastic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Combination</label>
              <div className="grid grid-cols-3 gap-2">
                {plasticColorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField('plasticColors', color.value)}
                    className={`p-2 border-2 rounded transition-all ${
                      data.plasticColors === color.value
                        ? 'border-vurmz-teal ring-2 ring-vurmz-teal'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="h-6 rounded flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      ABC
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">{color.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CONTROL PANELS */}
          {labelType === 'control-panels' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Panel Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {panelSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => updateField('panelSize', size.value)}
                      className={`px-3 py-2 text-sm font-medium border-2 rounded transition-all ${
                        data.panelSize === size.value
                          ? 'border-vurmz-teal bg-vurmz-teal/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warning/Header Text</label>
                <input
                  type="text"
                  value={data.warningText}
                  onChange={(e) => updateField('warningText', e.target.value.toUpperCase())}
                  placeholder="DANGER"
                  maxLength={20}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment ID / Description</label>
                <input
                  type="text"
                  value={data.equipmentId}
                  onChange={(e) => updateField('equipmentId', e.target.value.toUpperCase())}
                  placeholder="PANEL-001"
                  maxLength={30}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
              </div>
            </>
          )}

          {/* ASSET TAGS */}
          {labelType === 'asset-tags' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => updateField('companyName', e.target.value.toUpperCase())}
                  placeholder="ACME CORP"
                  maxLength={25}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Prefix</label>
                  <input
                    type="text"
                    value={data.assetPrefix}
                    onChange={(e) => updateField('assetPrefix', e.target.value.toUpperCase())}
                    placeholder="ASSET"
                    maxLength={10}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting #</label>
                  <input
                    type="text"
                    value={data.startNumber}
                    onChange={(e) => updateField('startNumber', e.target.value)}
                    placeholder="001"
                    maxLength={6}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.includePhone}
                  onChange={(e) => updateField('includePhone', e.target.checked)}
                  className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
                />
                <span className="text-sm">Include Phone Number</span>
                <span className="text-xs text-vurmz-teal font-medium">+$1</span>
              </label>

              {data.includePhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={data.phoneNumber}
                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                    placeholder="(555) 123-4567"
                    maxLength={15}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                  />
                </div>
              )}
            </>
          )}

          {/* VALVE TAGS */}
          {labelType === 'valve-tags' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('valveShape', 'round')}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-2 rounded transition-all ${
                      data.valveShape === 'round'
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Round
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('valveShape', 'octagon')}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-2 rounded transition-all ${
                      data.valveShape === 'octagon'
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Octagon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {valveSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => updateField('valveSize', size.value)}
                      className={`px-3 py-2 text-sm font-medium border-2 rounded transition-all ${
                        data.valveSize === size.value
                          ? 'border-vurmz-teal bg-vurmz-teal/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valve ID</label>
                <input
                  type="text"
                  value={data.valveId}
                  onChange={(e) => updateField('valveId', e.target.value.toUpperCase())}
                  placeholder="V-01"
                  maxLength={10}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={data.valveDescription}
                  onChange={(e) => updateField('valveDescription', e.target.value.toUpperCase())}
                  placeholder="MAIN WATER"
                  maxLength={20}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
              </div>
            </>
          )}

          {/* Font Selection */}
          <FontSelector
            value={data.font}
            onChange={(value) => updateField('font', value)}
            previewText={labelType === 'control-panels' ? data.warningText : labelType === 'asset-tags' ? data.assetPrefix : data.valveId}
          />

          {/* Price */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Price per unit:</span>
                <span className="text-xl font-bold">${data.pricePerUnit.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-400">
                <p>Material: {material === 'brass' ? 'Brass' : material === 'anodized-aluminum' ? 'Anodized Aluminum' : 'Two-Tone Plastic'}</p>
                {labelType === 'control-panels' && <p>Size: {panelSizes.find(s => s.value === data.panelSize)?.label}</p>}
                {labelType === 'valve-tags' && <p>Size: {valveSizes.find(s => s.value === data.valveSize)?.label}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <span className="text-sm font-medium text-gray-700">Preview</span>

          <div className="flex justify-center items-center py-8 bg-gray-100 rounded-lg min-h-[200px]">
            {/* CONTROL PANEL PREVIEW */}
            {labelType === 'control-panels' && (
              <svg
                width={data.panelSize === '1x3' ? 180 : data.panelSize === '2x4' ? 220 : data.panelSize === '3x5' ? 260 : 300}
                height={data.panelSize === '1x3' ? 60 : data.panelSize === '2x4' ? 100 : data.panelSize === '3x5' ? 140 : 180}
                viewBox={`0 0 ${data.panelSize === '1x3' ? 180 : data.panelSize === '2x4' ? 220 : data.panelSize === '3x5' ? 260 : 300} ${data.panelSize === '1x3' ? 60 : data.panelSize === '2x4' ? 100 : data.panelSize === '3x5' ? 140 : 180}`}
                className="drop-shadow-lg"
              >
                {/* Panel background */}
                <rect
                  x="2" y="2"
                  width={data.panelSize === '1x3' ? 176 : data.panelSize === '2x4' ? 216 : data.panelSize === '3x5' ? 256 : 296}
                  height={data.panelSize === '1x3' ? 56 : data.panelSize === '2x4' ? 96 : data.panelSize === '3x5' ? 136 : 176}
                  rx="4"
                  fill={colors.bg}
                  stroke={material === 'brass' ? '#8b6914' : '#444'}
                  strokeWidth="2"
                />
                {/* Highlight */}
                <rect
                  x="4" y="4"
                  width={data.panelSize === '1x3' ? 172 : data.panelSize === '2x4' ? 212 : data.panelSize === '3x5' ? 252 : 292}
                  height="12"
                  rx="3"
                  fill="rgba(255,255,255,0.15)"
                />
                {/* Mounting holes */}
                <circle cx="12" cy="12" r="3" fill="#333" />
                <circle cx={data.panelSize === '1x3' ? 168 : data.panelSize === '2x4' ? 208 : data.panelSize === '3x5' ? 248 : 288} cy="12" r="3" fill="#333" />
                <circle cx="12" cy={data.panelSize === '1x3' ? 48 : data.panelSize === '2x4' ? 88 : data.panelSize === '3x5' ? 128 : 168} r="3" fill="#333" />
                <circle cx={data.panelSize === '1x3' ? 168 : data.panelSize === '2x4' ? 208 : data.panelSize === '3x5' ? 248 : 288} cy={data.panelSize === '1x3' ? 48 : data.panelSize === '2x4' ? 88 : data.panelSize === '3x5' ? 128 : 168} r="3" fill="#333" />

                {/* Warning Text */}
                <text
                  x={data.panelSize === '1x3' ? 90 : data.panelSize === '2x4' ? 110 : data.panelSize === '3x5' ? 130 : 150}
                  y={data.panelSize === '1x3' ? 30 : data.panelSize === '2x4' ? 45 : data.panelSize === '3x5' ? 55 : 70}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={data.panelSize === '1x3' ? 14 : data.panelSize === '2x4' ? 18 : data.panelSize === '3x5' ? 22 : 26}
                  fontWeight="bold"
                  style={getTextStyle()}
                >
                  {data.warningText || 'DANGER'}
                </text>
                {/* Equipment ID */}
                <text
                  x={data.panelSize === '1x3' ? 90 : data.panelSize === '2x4' ? 110 : data.panelSize === '3x5' ? 130 : 150}
                  y={data.panelSize === '1x3' ? 48 : data.panelSize === '2x4' ? 70 : data.panelSize === '3x5' ? 95 : 120}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={data.panelSize === '1x3' ? 10 : data.panelSize === '2x4' ? 12 : data.panelSize === '3x5' ? 14 : 16}
                  style={getTextStyle()}
                >
                  {data.equipmentId || 'PANEL-001'}
                </text>
              </svg>
            )}

            {/* ASSET TAG PREVIEW */}
            {labelType === 'asset-tags' && (
              <svg width="200" height="100" viewBox="0 0 200 100" className="drop-shadow-lg">
                {/* Tag background */}
                <rect x="2" y="2" width="196" height="96" rx="4"
                  fill={colors.bg}
                  stroke={material === 'brass' ? '#8b6914' : '#444'}
                  strokeWidth="2"
                />
                {/* Highlight */}
                <rect x="4" y="4" width="192" height="10" rx="3" fill="rgba(255,255,255,0.15)" />

                {/* Company Name */}
                <text
                  x="100"
                  y="30"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="12"
                  fontWeight="bold"
                  style={getTextStyle()}
                >
                  {data.companyName || 'ACME CORP'}
                </text>

                {/* Asset Number */}
                <text
                  x="100"
                  y="58"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="18"
                  fontWeight="bold"
                  style={getTextStyle()}
                >
                  {data.assetPrefix || 'ASSET'}-{data.startNumber || '001'}
                </text>

                {/* Phone if enabled */}
                {data.includePhone && (
                  <text
                    x="100"
                    y="82"
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize="10"
                    style={getTextStyle()}
                  >
                    {data.phoneNumber || '(555) 123-4567'}
                  </text>
                )}

                {/* Mounting hole */}
                <circle cx="20" cy="50" r="5" fill="#333" />
              </svg>
            )}

            {/* VALVE TAG PREVIEW */}
            {labelType === 'valve-tags' && (
              <svg
                width={parseInt(data.valveSize) * 60}
                height={parseInt(data.valveSize) * 60 + 20}
                viewBox={`0 0 ${parseInt(data.valveSize) * 60} ${parseInt(data.valveSize) * 60 + 20}`}
                className="drop-shadow-lg"
              >
                {data.valveShape === 'round' ? (
                  <>
                    {/* Round tag */}
                    <circle
                      cx={parseInt(data.valveSize) * 30}
                      cy={parseInt(data.valveSize) * 30 + 10}
                      r={parseInt(data.valveSize) * 28}
                      fill={colors.bg}
                      stroke={material === 'brass' ? '#8b6914' : '#444'}
                      strokeWidth="2"
                    />
                    {/* Highlight */}
                    <ellipse
                      cx={parseInt(data.valveSize) * 30}
                      cy={parseInt(data.valveSize) * 20}
                      rx={parseInt(data.valveSize) * 20}
                      ry={parseInt(data.valveSize) * 8}
                      fill="rgba(255,255,255,0.12)"
                    />
                    {/* Hole for chain */}
                    <circle
                      cx={parseInt(data.valveSize) * 30}
                      cy="12"
                      r="5"
                      fill="#333"
                    />
                  </>
                ) : (
                  <>
                    {/* Octagon tag */}
                    <polygon
                      points={(() => {
                        const cx = parseInt(data.valveSize) * 30
                        const cy = parseInt(data.valveSize) * 30 + 10
                        const r = parseInt(data.valveSize) * 28
                        const points = []
                        for (let i = 0; i < 8; i++) {
                          const angle = (Math.PI / 8) + (i * Math.PI / 4)
                          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
                        }
                        return points.join(' ')
                      })()}
                      fill={colors.bg}
                      stroke={material === 'brass' ? '#8b6914' : '#444'}
                      strokeWidth="2"
                    />
                    {/* Hole for chain */}
                    <circle
                      cx={parseInt(data.valveSize) * 30}
                      cy="12"
                      r="5"
                      fill="#333"
                    />
                  </>
                )}

                {/* Valve ID */}
                <text
                  x={parseInt(data.valveSize) * 30}
                  y={parseInt(data.valveSize) * 25 + 10}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={parseInt(data.valveSize) * 8}
                  fontWeight="bold"
                  style={getTextStyle()}
                >
                  {data.valveId || 'V-01'}
                </text>

                {/* Description */}
                <text
                  x={parseInt(data.valveSize) * 30}
                  y={parseInt(data.valveSize) * 38 + 10}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={parseInt(data.valveSize) * 5}
                  style={getTextStyle()}
                >
                  {data.valveDescription || 'MAIN WATER'}
                </text>
              </svg>
            )}
          </div>

          {/* Material info */}
          <div className="text-center text-xs text-gray-500 mt-4">
            {material === 'brass' && (
              <>
                <p>Solid brass construction</p>
                <p>Corrosion resistant, professional finish</p>
              </>
            )}
            {material === 'anodized-aluminum' && (
              <>
                <p>Anodized aluminum</p>
                <p>Lightweight, durable, weather resistant</p>
              </>
            )}
            {material === 'plastic' && (
              <>
                <p>Two-tone engraving plastic (ABS)</p>
                <p>Top layer engraves to reveal contrasting color</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
