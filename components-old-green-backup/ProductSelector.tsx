'use client'

import { useState, useEffect } from 'react'

// Custom SVG icon for pen with accurate details (chrome tip, accent rings, stylus tip)
function PenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} style={{ width: '100%', height: '24px' }}>
      {/* Chrome tip */}
      <polygon points="0,12 8,8 8,16" fill="url(#chrome)" />
      {/* Accent rings near grip */}
      <rect x="8" y="9" width="1.5" height="6" fill="#e0e0e0" />
      <rect x="10" y="9" width="1.5" height="6" fill="#e0e0e0" />
      {/* Barrel */}
      <rect x="12" y="8" width="28" height="8" rx="1" fill="#1a1a1a" />
      {/* Chrome end */}
      <rect x="40" y="9" width="2" height="6" fill="#c0c0c0" />
      {/* Stylus tip */}
      <ellipse cx="45" cy="12" rx="3" ry="3" fill="#333" />
      {/* Gradient */}
      <defs>
        <linearGradient id="chrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Custom SVG for metal business card
function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={className} style={{ width: '100%', height: '22px' }}>
      <rect x="2" y="2" width="36" height="24" rx="2" fill="#1a1a1a" />
      <rect x="2" y="2" width="36" height="6" fill="rgba(255,255,255,0.1)" rx="2" />
      <rect x="6" y="8" width="16" height="2" fill="#666" rx="1" />
      <rect x="6" y="12" width="12" height="1.5" fill="#555" rx="0.5" />
      <rect x="28" y="16" width="6" height="6" fill="#444" rx="1" />
    </svg>
  )
}

interface ProductOption {
  value: string
  label: string
  icon: React.ReactNode
}

const products: ProductOption[] = [
  { value: 'pens', label: 'Pens', icon: <PenIcon /> },
  { value: 'business-cards', label: 'Metal Cards', icon: <CardIcon /> },
  { value: 'nametags', label: 'Nametags', icon: <span className="text-2xl">📛</span> },
  { value: 'knives', label: 'Knives', icon: <span className="text-2xl">🔪</span> },
  { value: 'tools', label: 'Tool Marking', icon: <span className="text-2xl">🔧</span> },
  { value: 'keychains', label: 'Keychains', icon: <span className="text-2xl">🔑</span> },
  { value: 'keys', label: 'Key Marking', icon: <span className="text-2xl">🗝️</span> },
  { value: 'industrial-labels', label: 'Industrial Labels & Tags', icon: <span className="text-2xl">🏷️</span> },
]

const industrialTypes = [
  { value: 'control-panels', label: 'Control Panels' },
  { value: 'asset-tags', label: 'Asset Tags' },
  { value: 'valve-tags', label: 'Valve Tags' },
]

const industrialMaterials = [
  { value: 'brass', label: 'Brass' },
  { value: 'anodized-aluminum', label: 'Anodized Aluminum' },
  { value: 'plastic', label: 'Plastic (Two-Tone)' },
]

interface ProductSelectorProps {
  value: string
  onChange: (value: string) => void
  onIndustrialChange?: (type: string, material: string) => void
  industrialType?: string
  industrialMaterial?: string
}

export default function ProductSelector({
  value,
  onChange,
  onIndustrialChange,
  industrialType = '',
  industrialMaterial = ''
}: ProductSelectorProps) {
  const isOther = value === 'other'
  const isIndustrial = value === 'industrial-labels'

  return (
    <div>
      <label className="block text-sm font-medium text-vurmz-dark mb-3">
        What would you like engraved? <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {products.map((product) => (
          <button
            key={product.value}
            type="button"
            onClick={() => onChange(product.value)}
            className={`relative flex flex-col items-center justify-center p-3 h-20 border-2 rounded-lg transition-all ${
              value === product.value
                ? 'border-vurmz-teal bg-vurmz-teal/10 ring-2 ring-vurmz-teal shadow-md'
                : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="mb-1">{product.icon}</div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {product.label}
            </span>
          </button>
        ))}

        {/* Custom "?" tile with clay/sculpted look */}
        <button
          type="button"
          onClick={() => onChange('other')}
          className={`relative flex flex-col items-center justify-center p-3 h-20 border-2 rounded-lg transition-all overflow-hidden ${
            isOther
              ? 'border-vurmz-teal ring-2 ring-vurmz-teal shadow-md'
              : 'border-gray-200 hover:border-gray-400'
          }`}
          style={{
            background: 'linear-gradient(145deg, #c9a67a 0%, #b8956a 40%, #a6845c 100%)',
          }}
        >
          {/* Clay texture - lumpy/organic feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 25% 20%, rgba(255,255,255,0.35) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 75% 80%, rgba(0,0,0,0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(139,105,20,0.1) 0%, transparent 70%),
                radial-gradient(ellipse 30% 20% at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%),
                radial-gradient(ellipse 25% 15% at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)
              `,
            }}
          />
          {/* Subtle crack/texture lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.1) 45%, transparent 50%),
                linear-gradient(-45deg, transparent 60%, rgba(0,0,0,0.08) 65%, transparent 70%)
              `,
            }}
          />
          {/* Question mark with pressed/embossed clay effect */}
          <span
            className="relative text-3xl font-bold mb-1"
            style={{
              color: '#6b5222',
              textShadow: `
                1.5px 1.5px 0px rgba(255,255,255,0.5),
                -0.5px -0.5px 0px rgba(0,0,0,0.3),
                2px 3px 6px rgba(0,0,0,0.25)
              `,
              fontFamily: 'Georgia, serif',
            }}
          >
            ?
          </span>
          <span
            className="relative text-xs font-medium text-center leading-tight"
            style={{
              color: '#5a4420',
              textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.4)',
            }}
          >
            Other
          </span>
        </button>
      </div>

      {/* Industrial Labels & Tags sub-options */}
      {isIndustrial && onIndustrialChange && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-vurmz-dark mb-2">
              Type of Label/Tag <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {industrialTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onIndustrialChange(type.value, industrialMaterial)}
                  className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                    industrialType === type.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-vurmz-dark mb-2">
              Material <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {industrialMaterials.map((mat) => (
                <button
                  key={mat.value}
                  type="button"
                  onClick={() => onIndustrialChange(industrialType, mat.value)}
                  className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                    industrialMaterial === mat.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected product indicator */}
      {value && (
        <p className="text-sm text-vurmz-teal mt-2 font-medium">
          {isOther
            ? 'Something else - tell us about it below'
            : isIndustrial && industrialType && industrialMaterial
            ? `Selected: ${industrialTypes.find(t => t.value === industrialType)?.label} (${industrialMaterials.find(m => m.value === industrialMaterial)?.label})`
            : isIndustrial
            ? 'Industrial Labels & Tags - select type and material above'
            : `Selected: ${products.find(p => p.value === value)?.label || value}`
          }
        </p>
      )}

      {/* Bring your own materials notice */}
      <div className="mt-4 p-4 bg-vurmz-powder/30 border border-vurmz-powder rounded-lg">
        <p className="text-sm text-vurmz-dark">
          <strong>Have your own items to engrave?</strong> I can engrave materials you provide -
          bring your own knives, tools, pans, or other items. Just select the closest category
          above and describe what you have in the notes section.
        </p>
      </div>
    </div>
  )
}
