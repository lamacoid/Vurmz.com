'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { fontOptions, ENGRAVING_COLOR } from '@/lib/fonts'
import FontSelector from './FontSelector'

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
    logoEnabled: true,
    logoPlacement: 'cap',
    bothSides: true,
    penColor: 'black',
    pricePerPen: 7.50
  })

  // Calculate price whenever options change
  // Base: $3/pen, Second line: +$0.50, Logo: +$2, Both sides: +$2
  const calculatePrice = (data: Omit<PenData, 'pricePerPen'>) => {
    let price = 3 // Base price
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

      // When switching to fountain pen, reset options
      if (field === 'penStyle' && value === 'fountain') {
        updated.penColor = 'black'
        updated.textStyle = 'one-line'
        updated.line2 = ''
        updated.logoEnabled = false
        updated.bothSides = false
      }

      if (['logoEnabled', 'bothSides', 'penStyle', 'line2', 'textStyle'].includes(field)) {
        updated.pricePerPen = calculatePrice(updated)
      }
      return updated
    })
  }

  const isFountainPen = penData.penStyle === 'fountain'

  const selectedColor = penColors.find(c => c.value === penData.penColor) || penColors[0]
  const selectedFont = fontOptions.find(f => f.value === penData.font) || fontOptions[0]

  const getTextStyle = () => {
    return selectedFont?.style || { fontFamily: 'Arial, sans-serif' }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 mt-4">
      <h3 className="font-bold text-lg mb-4">Design Your Branded Pen</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Pen Style Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pen Style</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('penStyle', 'stylus')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  penData.penStyle === 'stylus'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Stylus Pen
              </button>
              <button
                type="button"
                onClick={() => updateField('penStyle', 'fountain')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  penData.penStyle === 'fountain'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Fountain Pen
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isFountainPen
                ? 'Slim black anodized, empty refillable, single line engraving'
                : 'Metal body with soft-touch finish, stylus tip, multiple colors'}
            </p>
          </div>

          {/* Text Style Toggle - only for stylus pens */}
          {!isFountainPen && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Layout</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateField('textStyle', 'two-lines')}
                  className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                    penData.textStyle === 'two-lines'
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Two Lines
                </button>
                <button
                  type="button"
                  onClick={() => updateField('textStyle', 'one-line')}
                  className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                    penData.textStyle === 'one-line'
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  One Large Line
                </button>
              </div>
            </div>
          )}

          {/* Text Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {penData.textStyle === 'two-lines' ? 'Line 1' : 'Text'} *
            </label>
            <input
              type="text"
              value={penData.line1}
              onChange={(e) => updateField('line1', e.target.value.slice(0, MAX_CHARS_PER_LINE))}
              placeholder={penData.textStyle === 'two-lines' ? 'ACME CORPORATION' : 'Your Business Name'}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{penData.line1.length}/{MAX_CHARS_PER_LINE} characters</p>
          </div>

          {penData.textStyle === 'two-lines' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line 2</label>
              <input
                type="text"
                value={penData.line2}
                onChange={(e) => updateField('line2', e.target.value.slice(0, MAX_CHARS_PER_LINE))}
                placeholder="www.acme.com | (555) 123-4567"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{penData.line2.length}/{MAX_CHARS_PER_LINE} characters</p>
            </div>
          )}

          {/* Font Selection - Tiles */}
          <FontSelector
            value={penData.font}
            onChange={(value) => updateField('font', value)}
            previewText={penData.line1 || 'Abc'}
          />

          {/* Pen Color - only for stylus pens */}
          {!isFountainPen && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pen Color</label>
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
            <div className="pt-2 border-t border-gray-200 space-y-3">
              <label className="block text-sm font-medium text-gray-700">Add-ons</label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={penData.logoEnabled}
                  onChange={(e) => updateField('logoEnabled', e.target.checked)}
                  className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
                />
                <PhotoIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm">Add Logo</span>
                <span className="text-xs text-vurmz-teal font-medium">+$2</span>
              </label>

              {penData.logoEnabled && (
                <div className="ml-7 space-y-2">
                  <p className="text-xs text-gray-600">Logo placement:</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('logoPlacement', 'cap')}
                      className={`px-3 py-1.5 text-xs font-medium border rounded ${
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
                      className={`px-3 py-1.5 text-xs font-medium border rounded ${
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

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={penData.bothSides}
                  onChange={(e) => updateField('bothSides', e.target.checked)}
                  className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
                />
                <span className="text-sm">Engrave Both Sides</span>
                <span className="text-xs text-vurmz-teal font-medium">+$2</span>
              </label>
            </div>
          )}

          {/* Price Calculator */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Price per pen:</span>
                <span className="text-xl font-bold">${penData.pricePerPen.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Base (2 lines, basic font)</span>
                  <span>$3.00</span>
                </div>
                {penData.logoEnabled && (
                  <div className="flex justify-between">
                    <span>+ Logo ({penData.logoPlacement})</span>
                    <span>$2.00</span>
                  </div>
                )}
                {penData.bothSides && (
                  <div className="flex justify-between">
                    <span>+ Both Sides</span>
                    <span>$2.00</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pen Preview */}
        <div className="space-y-4">
          <span className="text-sm font-medium text-gray-700">Preview</span>

          {/* Pen SVG */}
          <div className="flex justify-center py-8">
            {isFountainPen ? (
              /* Fountain Pen SVG - slim, elegant, black anodized */
              <svg width="340" height="40" viewBox="0 0 340 40" className="drop-shadow-lg">
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="blackAnodized" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3a3a3a" />
                    <stop offset="50%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <linearGradient id="goldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#b8960c" />
                    <stop offset="100%" stopColor="#8b7355" />
                  </linearGradient>
                </defs>

                {/* Nib (fountain pen tip) */}
                <polygon points="0,20 25,16 25,24" fill="url(#goldAccent)" />
                <line x1="0" y1="20" x2="20" y2="20" stroke="#1a1a1a" strokeWidth="0.5" />

                {/* Grip section */}
                <rect x="25" y="14" width="40" height="12" rx="1" fill="url(#blackAnodized)" />

                {/* Gold accent ring */}
                <rect x="65" y="13" width="3" height="14" fill="url(#goldAccent)" />

                {/* Main barrel - slim */}
                <rect x="68" y="12" width="220" height="16" rx="2" fill="url(#blackAnodized)" />
                {/* Barrel highlight */}
                <rect x="68" y="12" width="220" height="5" rx="2" fill="rgba(255,255,255,0.1)" />

                {/* Text on barrel */}
                <text
                  x="178"
                  y="23"
                  textAnchor="middle"
                  fill="#c0c0c0"
                  fontSize="9"
                  fontWeight="bold"
                  style={getTextStyle()}
                >
                  {penData.line1 || 'YOUR BUSINESS'}
                </text>

                {/* Gold accent ring at end */}
                <rect x="288" y="13" width="3" height="14" fill="url(#goldAccent)" />

                {/* Cap end */}
                <rect x="291" y="14" width="30" height="12" rx="2" fill="url(#blackAnodized)" />

                {/* Clip */}
                <path d="M 305 12 L 305 6 L 330 6 L 330 9 L 308 9 L 308 12" fill="url(#goldAccent)" />
              </svg>
            ) : (
              /* Stylus Pen SVG */
              <svg width="340" height="50" viewBox="0 0 340 50" className="drop-shadow-lg">
                {/* Chrome tip (cone shape) */}
                <polygon points="0,25 30,15 30,35" fill="url(#chromeGradient)" />

                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f0f0f0" />
                    <stop offset="50%" stopColor="#c0c0c0" />
                    <stop offset="100%" stopColor="#909090" />
                  </linearGradient>
                </defs>

                {/* Chrome accent rings (2 thin rings) */}
                <rect x="30" y="14" width="3" height="22" fill="#e8e8e8" />
                <rect x="35" y="14" width="3" height="22" fill="#e8e8e8" />

                {/* Main barrel */}
                <rect x="38" y="12" width="250" height="26" rx="2" fill={selectedColor.barrel} />
                {/* Barrel highlight (soft touch sheen) */}
                <rect x="38" y="12" width="250" height="8" rx="2" fill="rgba(255,255,255,0.15)" />

                {/* Text on barrel */}
                <g style={getTextStyle()}>
                  {penData.textStyle === 'two-lines' ? (
                    <>
                      <text
                        x="163"
                        y="22"
                        textAnchor="middle"
                        fill={ENGRAVING_COLOR}
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {penData.line1 || 'YOUR BUSINESS NAME'}
                      </text>
                      <text
                        x="163"
                        y="34"
                        textAnchor="middle"
                        fill={ENGRAVING_COLOR}
                        fontSize="7"
                        opacity="0.8"
                      >
                        {penData.line2 || 'www.yourbusiness.com'}
                      </text>
                    </>
                  ) : (
                    <text
                      x="163"
                      y="30"
                      textAnchor="middle"
                      fill={ENGRAVING_COLOR}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {penData.line1 || 'YOUR BUSINESS'}
                    </text>
                  )}
                </g>

                {/* Logo on barrel (near back) */}
                {penData.logoEnabled && penData.logoPlacement === 'barrel' && (
                  <g>
                    <rect x="240" y="16" width="24" height="18" fill="rgba(255,255,255,0.2)" rx="2" />
                    <text x="252" y="28" textAnchor="middle" fill={ENGRAVING_COLOR} fontSize="7" fontWeight="bold" opacity="0.7">LOGO</text>
                  </g>
                )}

                {/* Chrome clip (on top of barrel) */}
                <path d="M 280 12 L 280 5 L 320 5 L 320 8 L 283 8 L 283 12" fill="url(#chromeGradient)" />

                {/* Chrome end cap */}
                <rect x="288" y="14" width="8" height="22" rx="1" fill="#d0d0d0" />

                {/* Stylus tip (black rubber, at back) */}
                <ellipse cx="306" cy="25" rx="10" ry="8" fill="#2a2a2a" />
                <rect x="296" y="17" width="10" height="16" fill="#2a2a2a" />

                {/* Logo on cap area (front section) */}
                {penData.logoEnabled && penData.logoPlacement === 'cap' && (
                  <g>
                    <rect x="50" y="16" width="24" height="18" fill="rgba(255,255,255,0.2)" rx="2" />
                    <text x="62" y="28" textAnchor="middle" fill={ENGRAVING_COLOR} fontSize="7" fontWeight="bold" opacity="0.7">LOGO</text>
                  </g>
                )}
              </svg>
            )}
          </div>

          {/* Both sides indicator - only for stylus pens */}
          {!isFountainPen && penData.bothSides && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Back side (same text, opposite side of barrel)</p>
              <div className="flex justify-center py-4 bg-gray-100 rounded">
                <svg width="200" height="30" viewBox="0 0 200 30" className="opacity-70">
                  <rect x="0" y="5" width="200" height="20" rx="2" fill={selectedColor.barrel} />
                  <rect x="0" y="5" width="200" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
                  <text
                    x="100"
                    y="19"
                    textAnchor="middle"
                    fill={ENGRAVING_COLOR}
                    fontSize={penData.textStyle === 'two-lines' ? '7' : '9'}
                    fontWeight="bold"
                    style={getTextStyle()}
                  >
                    {penData.line1 || 'YOUR BUSINESS'}
                  </text>
                </svg>
              </div>
            </div>
          )}

          {/* Pen specs */}
          <div className="text-center text-xs text-gray-500 mt-4">
            {isFountainPen ? (
              <>
                <p>Slim black anodized metal body</p>
                <p>Empty refillable fountain pen</p>
                <p>Laser engraved for permanent marking</p>
              </>
            ) : (
              <>
                <p>Metal body with soft-touch finish</p>
                <p>Stylus tip for touchscreens</p>
                <p>Laser engraved for permanent marking</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
