'use client'

import { useState, useEffect } from 'react'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'
import { PRODUCTS } from '@/lib/products'

// Knife exclusive font - Spacetime (metal marking only)
const SPACETIME_FONT = {
  value: 'spacetime',
  label: 'Spacetime',
  style: { fontFamily: 'spacetime-regular, sans-serif' }
}

type KnifeStyle = 'chef' | 'paring' | 'santoku' | 'utility' | 'bread' | 'cleaver' | 'custom'
type MarkingStyle = 'deep' | 'surface'

interface KnifeData {
  line1: string
  line2: string
  font: string
  markingStyle: MarkingStyle
  knifeStyle: KnifeStyle
  customDescription: string
  pricePerKnife: number
}

interface KnifeEngravingPreviewProps {
  onChange: (data: KnifeData) => void
}

const KNIFE_STYLES: { value: KnifeStyle; label: string }[] = [
  { value: 'chef', label: "Chef's Knife" },
  { value: 'santoku', label: 'Santoku' },
  { value: 'paring', label: 'Paring Knife' },
  { value: 'utility', label: 'Utility Knife' },
  { value: 'bread', label: 'Bread Knife' },
  { value: 'cleaver', label: 'Cleaver' },
  { value: 'custom', label: 'Other / Custom' },
]

export default function KnifeEngravingPreview({ onChange }: KnifeEngravingPreviewProps) {
  const [data, setData] = useState<KnifeData>({
    line1: '',
    line2: '',
    font: 'spacetime',
    markingStyle: 'surface',
    knifeStyle: 'chef',
    customDescription: '',
    pricePerKnife: 15
  })

  const selectedFont = data.font === 'spacetime'
    ? SPACETIME_FONT
    : (fontOptions.find(f => f.value === data.font) || fontOptions[0])

  const calculatePrice = () => {
    let price = PRODUCTS.knives.base
    if (data.markingStyle === 'deep') price += PRODUCTS.knives.addOns.deepMark
    if (data.line2) price += PRODUCTS.knives.addOns.secondLine
    return price
  }

  useEffect(() => {
    const newPrice = calculatePrice()
    if (newPrice !== data.pricePerKnife) {
      setData(prev => ({ ...prev, pricePerKnife: newPrice }))
    }
  }, [data.markingStyle, data.line2])

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const updateField = (field: keyof KnifeData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Knife Preview */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <div className="p-8">
          {/* Knife blade visualization */}
          <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
            {/* Blade shape */}
            <svg viewBox="0 0 400 100" className="w-full">
              {/* Blade */}
              <path
                d="M 20 50 Q 40 20, 350 30 Q 380 35, 380 50 Q 380 65, 350 70 Q 40 80, 20 50 Z"
                fill="url(#bladeGradient)"
                stroke="#666"
                strokeWidth="1"
              />
              {/* Handle */}
              <rect x="0" y="35" width="30" height="30" rx="3" fill="#4a3728" />
              <rect x="2" y="37" width="26" height="26" rx="2" fill="#5d4a3a" />

              <defs>
                <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e8e8e8" />
                  <stop offset="50%" stopColor="#c0c0c0" />
                  <stop offset="100%" stopColor="#a0a0a0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Engraving text overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingLeft: '60px', paddingRight: '40px' }}
            >
              {data.line1 && (
                <p
                  className="text-center truncate w-full"
                  style={{
                    ...selectedFont.style,
                    fontSize: data.line2 ? '14px' : '18px',
                    color: data.markingStyle === 'deep' ? '#1a1a1a' : '#888',
                    textShadow: data.markingStyle === 'surface' ? '0 0 1px rgba(255,255,255,0.5)' : 'none',
                    letterSpacing: '1px'
                  }}
                >
                  {data.line1}
                </p>
              )}
              {data.line2 && (
                <p
                  className="text-center truncate w-full mt-0.5"
                  style={{
                    ...selectedFont.style,
                    fontSize: '11px',
                    color: data.markingStyle === 'deep' ? '#1a1a1a' : '#888',
                    textShadow: data.markingStyle === 'surface' ? '0 0 1px rgba(255,255,255,0.5)' : 'none',
                    letterSpacing: '0.5px'
                  }}
                >
                  {data.line2}
                </p>
              )}
              {!data.line1 && !data.line2 && (
                <p className="text-gray-500 text-sm italic">Your text here</p>
              )}
            </div>
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
          <span className="text-white/60 text-xs">per knife</span>
          <span className="ml-2 text-white font-bold">${data.pricePerKnife}</span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        {/* Knife Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Knife Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {KNIFE_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => updateField('knifeStyle', style.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  data.knifeStyle === style.value
                    ? 'bg-[#6a8c8c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {data.knifeStyle === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe your knife</label>
            <input
              type="text"
              value={data.customDescription}
              onChange={(e) => updateField('customDescription', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6a8c8c]/20 focus:border-[#6a8c8c] outline-none"
              placeholder="Brand, model, or description..."
            />
          </div>
        )}

        {/* Engraving Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Line 1 (Main Text)</label>
          <input
            type="text"
            value={data.line1}
            onChange={(e) => updateField('line1', e.target.value)}
            maxLength={25}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6a8c8c]/20 focus:border-[#6a8c8c] outline-none"
            placeholder="Name, initials, or text..."
          />
          <p className="text-xs text-gray-400 mt-1">{data.line1.length}/25 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Line 2 (Optional) +$3</label>
          <input
            type="text"
            value={data.line2}
            onChange={(e) => updateField('line2', e.target.value)}
            maxLength={30}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6a8c8c]/20 focus:border-[#6a8c8c] outline-none"
            placeholder="Date, message, etc..."
          />
        </div>

        {/* Marking Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marking Style</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateField('markingStyle', 'surface')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.markingStyle === 'surface'
                  ? 'border-[#6a8c8c] bg-[#6a8c8c]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">Surface Marking</div>
              <div className="text-xs text-gray-500 mt-1">Frosted, subtle, elegant</div>
            </button>
            <button
              onClick={() => updateField('markingStyle', 'deep')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.markingStyle === 'deep'
                  ? 'border-[#6a8c8c] bg-[#6a8c8c]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">Deep Engraving +$5</div>
              <div className="text-xs text-gray-500 mt-1">Dark, permanent, premium</div>
            </button>
          </div>
        </div>

        {/* Font Selector with Spacetime */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>

          {/* Spacetime exclusive option */}
          <button
            onClick={() => updateField('font', 'spacetime')}
            className={`w-full mb-3 p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
              data.font === 'spacetime'
                ? 'border-[#6a8c8c] bg-[#6a8c8c]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span style={{ fontFamily: 'spacetime-regular, sans-serif', fontSize: '18px' }}>
              Spacetime
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              Metal Exclusive
            </span>
          </button>

          <FontSelector
            value={data.font === 'spacetime' ? 'arial' : data.font}
            onChange={(font) => updateField('font', font)}
            previewText={data.line1 || 'Preview'}
          />
        </div>
      </div>
    </div>
  )
}
