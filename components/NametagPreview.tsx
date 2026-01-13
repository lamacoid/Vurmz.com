'use client'

import { useState, useEffect } from 'react'
import { fontOptions, ENGRAVING_COLOR } from '@/lib/fonts'
import FontSelector from './FontSelector'

interface NametagData {
  name: string
  title: string
  company: string
  shape: 'rectangle' | 'rounded' | 'oval'
  badgeColor: string
  font: string
  size: 'standard' | 'large'
  attachment: 'pin' | 'magnetic' | 'clip'
  pricePerTag: number
}

interface NametagPreviewProps {
  onChange: (data: NametagData) => void
}

const MAX_CHARS_NAME = 20
const MAX_CHARS_TITLE = 25
const MAX_CHARS_COMPANY = 30

const badgeColors = [
  { value: 'black', label: 'Black', bg: '#1a1a1a', engraving: '#e0e0e0' },
  { value: 'white', label: 'White', bg: '#f5f5f5', engraving: '#1a1a1a' },
  { value: 'blue', label: 'Blue', bg: '#1e3a5f', engraving: '#e0e0e0' },
  { value: 'red', label: 'Red', bg: '#8b2635', engraving: '#f0d080' },
  { value: 'green', label: 'Green', bg: '#2d5a3c', engraving: '#e0e0e0' },
  { value: 'gold', label: 'Gold', bg: '#c9a227', engraving: '#1a1a1a' },
  { value: 'silver', label: 'Silver', bg: '#b8b8b8', engraving: '#1a1a1a' },
  { value: 'burgundy', label: 'Burgundy', bg: '#722f37', engraving: '#f0d080' },
]

const shapes = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'oval', label: 'Oval' },
]

const sizes = [
  { value: 'standard', label: 'Standard (3" x 1")', multiplier: 1 },
  { value: 'large', label: 'Large (3.5" x 1.5")', multiplier: 1.25 },
]

const attachments = [
  { value: 'pin', label: 'Safety Pin', price: 0 },
  { value: 'magnetic', label: 'Magnetic', price: 2 },
  { value: 'clip', label: 'Swivel Clip', price: 1 },
]

export default function NametagPreview({ onChange }: NametagPreviewProps) {
  const [data, setData] = useState<NametagData>({
    name: '',
    title: '',
    company: '',
    shape: 'rounded',
    badgeColor: 'black',
    font: 'arial',
    size: 'standard',
    attachment: 'magnetic',
    pricePerTag: 8,
  })

  const calculatePrice = (d: Omit<NametagData, 'pricePerTag'>) => {
    let price = 6 // Base price
    const sizeMultiplier = sizes.find(s => s.value === d.size)?.multiplier || 1
    const attachmentPrice = attachments.find(a => a.value === d.attachment)?.price || 0
    price = price * sizeMultiplier + attachmentPrice
    return Math.round(price * 100) / 100
  }

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const updateField = (field: keyof NametagData, value: string) => {
    setData(prev => {
      const updated = { ...prev, [field]: value }
      if (['size', 'attachment'].includes(field)) {
        updated.pricePerTag = calculatePrice(updated)
      }
      return updated
    })
  }

  const selectedColor = badgeColors.find(c => c.value === data.badgeColor) || badgeColors[0]
  const selectedFont = fontOptions.find(f => f.value === data.font) || fontOptions[0]
  const isLarge = data.size === 'large'

  const getTextStyle = () => selectedFont?.style || { fontFamily: 'Arial, sans-serif' }

  // SVG dimensions based on size
  const svgWidth = isLarge ? 280 : 240
  const svgHeight = isLarge ? 120 : 80
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 mt-4">
      <h3 className="font-bold text-lg mb-4">Design Your Nametag</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value.slice(0, MAX_CHARS_NAME))}
              placeholder="John Smith"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{data.name.length}/{MAX_CHARS_NAME} characters</p>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title/Position
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateField('title', e.target.value.slice(0, MAX_CHARS_TITLE))}
              placeholder="Sales Manager"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{data.title.length}/{MAX_CHARS_TITLE} characters</p>
          </div>

          {/* Company Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => updateField('company', e.target.value.slice(0, MAX_CHARS_COMPANY))}
              placeholder="ACME Corporation"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{data.company.length}/{MAX_CHARS_COMPANY} characters</p>
          </div>

          {/* Font Selection */}
          <FontSelector
            value={data.font}
            onChange={(value) => updateField('font', value)}
            previewText={data.name || 'Abc'}
          />

          {/* Shape Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
            <div className="flex gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => updateField('shape', shape.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                    data.shape === shape.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
            <div className="flex gap-2 flex-wrap">
              {badgeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateField('badgeColor', color.value)}
                  className={`w-10 h-10 rounded border-2 transition-all ${
                    data.badgeColor === color.value
                      ? 'border-vurmz-teal ring-2 ring-vurmz-teal ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.bg }}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Selected: {selectedColor.label}</p>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => updateField('size', size.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                    data.size === size.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Attachment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
            <div className="flex gap-2 flex-wrap">
              {attachments.map((att) => (
                <button
                  key={att.value}
                  type="button"
                  onClick={() => updateField('attachment', att.value)}
                  className={`px-4 py-2 text-sm font-medium border-2 transition-all ${
                    data.attachment === att.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {att.label}
                  {att.price > 0 && <span className="text-xs text-vurmz-teal ml-1">+${att.price}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculator */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Price per nametag:</span>
                <span className="text-xl font-bold">${data.pricePerTag.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Base (laser engraved plastic)</span>
                  <span>$6.00</span>
                </div>
                {data.size === 'large' && (
                  <div className="flex justify-between">
                    <span>+ Large size</span>
                    <span>$1.50</span>
                  </div>
                )}
                {data.attachment === 'magnetic' && (
                  <div className="flex justify-between">
                    <span>+ Magnetic backing</span>
                    <span>$2.00</span>
                  </div>
                )}
                {data.attachment === 'clip' && (
                  <div className="flex justify-between">
                    <span>+ Swivel clip</span>
                    <span>$1.00</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <span className="text-sm font-medium text-gray-700">Preview</span>

          {/* Nametag SVG */}
          <div className="flex justify-center py-8 bg-gray-100 rounded-lg">
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="drop-shadow-lg">
              <defs>
                {/* Gradient for shine effect */}
                <linearGradient id="nametagShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                </linearGradient>
              </defs>

              {/* Badge Shape */}
              {data.shape === 'rectangle' && (
                <>
                  <rect x="4" y="4" width={svgWidth - 8} height={svgHeight - 8} rx="2" fill={selectedColor.bg} />
                  <rect x="4" y="4" width={svgWidth - 8} height={svgHeight - 8} rx="2" fill="url(#nametagShine)" />
                </>
              )}
              {data.shape === 'rounded' && (
                <>
                  <rect x="4" y="4" width={svgWidth - 8} height={svgHeight - 8} rx="12" fill={selectedColor.bg} />
                  <rect x="4" y="4" width={svgWidth - 8} height={svgHeight - 8} rx="12" fill="url(#nametagShine)" />
                </>
              )}
              {data.shape === 'oval' && (
                <>
                  <ellipse cx={centerX} cy={centerY} rx={(svgWidth - 16) / 2} ry={(svgHeight - 16) / 2} fill={selectedColor.bg} />
                  <ellipse cx={centerX} cy={centerY} rx={(svgWidth - 16) / 2} ry={(svgHeight - 16) / 2} fill="url(#nametagShine)" />
                </>
              )}

              {/* Text Content */}
              <g style={getTextStyle()}>
                {data.company && (
                  <text
                    x={centerX}
                    y={isLarge ? 28 : 20}
                    textAnchor="middle"
                    fill={selectedColor.engraving}
                    fontSize={isLarge ? '10' : '8'}
                    opacity="0.8"
                    letterSpacing="1"
                  >
                    {data.company.toUpperCase()}
                  </text>
                )}
                <text
                  x={centerX}
                  y={data.company ? (isLarge ? 58 : 42) : (isLarge ? 50 : 38)}
                  textAnchor="middle"
                  fill={selectedColor.engraving}
                  fontSize={isLarge ? '18' : '14'}
                  fontWeight="bold"
                >
                  {data.name || 'Your Name'}
                </text>
                {data.title && (
                  <text
                    x={centerX}
                    y={data.company ? (isLarge ? 80 : 58) : (isLarge ? 75 : 55)}
                    textAnchor="middle"
                    fill={selectedColor.engraving}
                    fontSize={isLarge ? '11' : '9'}
                    opacity="0.9"
                  >
                    {data.title}
                  </text>
                )}
              </g>

              {/* Attachment indicator */}
              {data.attachment === 'magnetic' && (
                <g>
                  <rect x={svgWidth - 30} y={svgHeight - 20} width="22" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
                  <text x={svgWidth - 19} y={svgHeight - 11} textAnchor="middle" fill={selectedColor.engraving} fontSize="6" opacity="0.5">MAG</text>
                </g>
              )}
              {data.attachment === 'pin' && (
                <circle cx={svgWidth - 16} cy={svgHeight - 14} r="5" fill="rgba(255,255,255,0.3)" />
              )}
              {data.attachment === 'clip' && (
                <rect x={svgWidth - 28} y={svgHeight - 18} width="18" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
              )}
            </svg>
          </div>

          {/* Badge specs */}
          <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
            <p>Durable two-tone plastic</p>
            <p>Laser engraved for permanent marking</p>
            <p>Professional finish, scratch-resistant</p>
          </div>

          {/* Example layouts */}
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded">
            <p className="text-xs font-medium text-gray-700 mb-2">Common Uses:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>Employee badges</li>
              <li>Conference/event nametags</li>
              <li>Volunteer identification</li>
              <li>Hospitality staff</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
