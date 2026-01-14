'use client'

import { useState, useEffect } from 'react'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'
import KnifeVisualizer from './builder/visualizers/KnifeVisualizer'

type KnifeType = 'pocket' | 'chef' | 'steak-set' | 'kitchen-set'
type EngravingLocation = 'blade' | 'handle' | 'both'

export interface KnifeDesignData {
  knifeType: KnifeType
  knifeSource: 'bring-own' | 'basic' | 'premium'
  engravingLocation: EngravingLocation
  bladeText: string
  handleText: string
  font: string
  quantity: number
  setSize: number // 4 or 6 for steak sets
  pricePerUnit: number
  totalPrice: number
}

interface KnifeDesignerProps {
  onChange: (data: KnifeDesignData) => void
}

const KNIFE_TYPES: { value: KnifeType; label: string; description: string }[] = [
  { value: 'pocket', label: 'Pocket Knife', description: 'Folding knives, multi-tools' },
  { value: 'chef', label: 'Chef Knife', description: 'Single kitchen knife' },
  { value: 'steak-set', label: 'Steak Knife Set', description: '4 or 6 piece sets' },
  { value: 'kitchen-set', label: 'Kitchen Knife Set', description: '3-5 piece chef sets' },
]

const ENGRAVING_LOCATIONS: { value: EngravingLocation; label: string }[] = [
  { value: 'blade', label: 'Blade Only' },
  { value: 'handle', label: 'Handle Only' },
  { value: 'both', label: 'Both Blade & Handle' },
]

// Pricing
const ENGRAVING_ONLY_PRICE = 15 // Customer brings their own knife
const BASIC_POCKET_PRICE = 40 // Basic pocket knife + engraving
const BASIC_CHEF_PRICE = 50 // Basic chef knife + engraving
const BOTH_SIDES_ADDON = 10 // Extra for engraving both blade and handle
const STEAK_SET_4_PRICE = 60 // 4-piece steak knife set
const STEAK_SET_6_PRICE = 85 // 6-piece steak knife set
const KITCHEN_SET_PRICE = 120 // Kitchen knife set (3-5 pieces)

type KnifeSource = 'bring-own' | 'basic' | 'premium'

const KNIFE_SOURCES: { value: KnifeSource; label: string; description: string }[] = [
  { value: 'bring-own', label: 'I have a knife', description: 'Engraving only' },
  { value: 'basic', label: 'Include knife', description: 'Quality stainless steel' },
  { value: 'premium', label: 'Premium/Custom', description: 'Source specialty knife' },
]

export default function KnifeDesigner({ onChange }: KnifeDesignerProps) {
  const [design, setDesign] = useState<KnifeDesignData>({
    knifeType: 'pocket',
    knifeSource: 'bring-own',
    engravingLocation: 'blade',
    bladeText: '',
    handleText: '',
    font: 'arial',
    quantity: 1,
    setSize: 4,
    pricePerUnit: ENGRAVING_ONLY_PRICE,
    totalPrice: ENGRAVING_ONLY_PRICE,
  })

  const selectedFont = fontOptions.find(f => f.value === design.font) || fontOptions[0]

  // Calculate price
  const calculatePrice = (data: Omit<KnifeDesignData, 'pricePerUnit' | 'totalPrice'>) => {
    // Sets have fixed pricing (always include knives)
    if (data.knifeType === 'steak-set') {
      return data.setSize === 6 ? STEAK_SET_6_PRICE : STEAK_SET_4_PRICE
    }
    if (data.knifeType === 'kitchen-set') {
      return KITCHEN_SET_PRICE
    }

    // Individual knives - price depends on source
    let price = ENGRAVING_ONLY_PRICE

    if (data.knifeSource === 'basic') {
      price = data.knifeType === 'pocket' ? BASIC_POCKET_PRICE : BASIC_CHEF_PRICE
    } else if (data.knifeSource === 'premium') {
      return 0 // Quote-based, show as "Get Quote"
    }

    if (data.engravingLocation === 'both') {
      price += BOTH_SIDES_ADDON
    }
    return price
  }

  // Update design and notify parent
  const updateDesign = (updates: Partial<KnifeDesignData>) => {
    setDesign(prev => {
      const updated = { ...prev, ...updates }
      updated.pricePerUnit = calculatePrice(updated)
      updated.totalPrice = updated.pricePerUnit * updated.quantity
      return updated
    })
  }

  // Notify parent on change
  useEffect(() => {
    onChange(design)
  }, [design, onChange])

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-4">
        <h3 className="text-white font-bold text-lg">Knife Engraving Designer</h3>
        <p className="text-gray-400 text-sm mt-1">Custom engraving for chef and pocket knives</p>
      </div>

      {/* Live Preview */}
      <div className="bg-gray-100 p-6 border-b border-gray-200">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 text-center">Live Preview</div>
        <KnifeVisualizer
          type={design.knifeType}
          bladeText={design.bladeText}
          handleText={design.handleText}
          engravingLocation={design.engravingLocation}
          font={selectedFont?.style?.fontFamily}
          setSize={design.setSize}
        />
      </div>

      <div className="p-6 space-y-6">
        {/* Form Section */}
        <div className="space-y-4">
          {/* Knife Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Knife Type</label>
            <div className="grid grid-cols-2 gap-3">
              {KNIFE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateDesign({ knifeType: type.value })}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    design.knifeType === type.value
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Knife Source - only for individual knives */}
          {!['steak-set', 'kitchen-set'].includes(design.knifeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Knife Source</label>
              <div className="grid grid-cols-3 gap-2">
                {KNIFE_SOURCES.map((source) => (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => updateDesign({ knifeSource: source.value })}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      design.knifeSource === source.value
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{source.label}</div>
                    <div className="text-xs text-gray-500">{source.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engraving Location */}
          {!['steak-set', 'kitchen-set'].includes(design.knifeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engraving Location</label>
              <div className="flex gap-2">
                {ENGRAVING_LOCATIONS.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => updateDesign({ engravingLocation: loc.value })}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-2 rounded-lg transition-all ${
                      design.engravingLocation === loc.value
                        ? 'border-vurmz-teal bg-vurmz-teal/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Steak/Kitchen Set - Set Size Selector */}
          {design.knifeType === 'steak-set' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Size</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateDesign({ setSize: 4 })}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all ${
                    design.setSize === 4
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">4 Piece</div>
                  <div className="text-sm text-gray-500">${STEAK_SET_4_PRICE}</div>
                </button>
                <button
                  type="button"
                  onClick={() => updateDesign({ setSize: 6 })}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all ${
                    design.setSize === 6
                      ? 'border-vurmz-teal bg-vurmz-teal/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">6 Piece</div>
                  <div className="text-sm text-gray-500">${STEAK_SET_6_PRICE}</div>
                </button>
              </div>
            </div>
          )}

          {/* Set Text Input - for knife sets */}
          {['steak-set', 'kitchen-set'].includes(design.knifeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engraving Text
              </label>
              <input
                type="text"
                value={design.bladeText}
                onChange={(e) => updateDesign({ bladeText: e.target.value })}
                placeholder="Name, initials, or family name"
                maxLength={20}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Engraved on each knife blade</p>
            </div>
          )}

          {/* Blade Text - individual knives only */}
          {!['steak-set', 'kitchen-set'].includes(design.knifeType) && (design.engravingLocation === 'blade' || design.engravingLocation === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blade Text
              </label>
              <input
                type="text"
                value={design.bladeText}
                onChange={(e) => updateDesign({ bladeText: e.target.value })}
                placeholder="Name, initials, or short text"
                maxLength={30}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
              />
              <p className="text-xs text-gray-500 mt-1">{design.bladeText.length}/30 characters</p>
            </div>
          )}

          {/* Handle Text - individual knives only */}
          {!['steak-set', 'kitchen-set'].includes(design.knifeType) && (design.engravingLocation === 'handle' || design.engravingLocation === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Handle Text
              </label>
              <input
                type="text"
                value={design.handleText}
                onChange={(e) => updateDesign({ handleText: e.target.value })}
                placeholder="Name, initials, logo text"
                maxLength={20}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
              />
              <p className="text-xs text-gray-500 mt-1">{design.handleText.length}/20 characters</p>
            </div>
          )}

          {/* Font Selection */}
          <FontSelector
            value={design.font}
            onChange={(value) => updateDesign({ font: value })}
            previewText={design.bladeText || design.handleText || 'Abc'}
          />

          {/* Quantity - only for individual knives */}
          {!['steak-set', 'kitchen-set'].includes(design.knifeType) && (
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
                <span className="w-12 text-center text-lg font-semibold">{design.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateDesign({ quantity: design.quantity + 1 })}
                  className="w-10 h-10 border border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Info Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              {['steak-set', 'kitchen-set'].includes(design.knifeType) ? (
                <>
                  <span className="font-medium">Knives included:</span> Price includes quality stainless steel knives with engraving.
                </>
              ) : design.knifeSource === 'bring-own' ? (
                <>
                  <span className="font-medium">Bring your knife:</span> Drop off or ship your knife for custom engraving.
                </>
              ) : design.knifeSource === 'basic' ? (
                <>
                  <span className="font-medium">Knife included:</span> Quality stainless steel {design.knifeType === 'pocket' ? 'pocket knife' : 'chef knife'} with your custom engraving.
                </>
              ) : (
                <>
                  <span className="font-medium">Premium sourcing:</span> Tell me what knife you want - Wüsthof, Shun, custom Damascus, etc. I&apos;ll source it and engrave.
                </>
              )}
            </p>
          </div>

          {/* Price Summary */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded-lg">
              {design.knifeType === 'steak-set' ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Steak Knife Set ({design.setSize} piece):</span>
                    <span className="text-2xl font-bold text-vurmz-teal">${design.pricePerUnit.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Includes knives + custom engraving
                  </div>
                </>
              ) : design.knifeType === 'kitchen-set' ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Kitchen Knife Set:</span>
                    <span className="text-2xl font-bold text-vurmz-teal">${KITCHEN_SET_PRICE.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Chef, paring, utility knives + engraving
                  </div>
                </>
              ) : design.knifeSource === 'premium' ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Premium Knife + Engraving:</span>
                    <span className="text-xl font-bold text-vurmz-teal">Get Quote</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Describe the knife you want in the notes below
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">
                      {design.knifeSource === 'basic' ? 'Knife + Engraving:' : 'Engraving Only:'}
                    </span>
                    <span className="text-xl font-bold">${design.pricePerUnit.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    {design.knifeSource === 'basic' ? (
                      <div className="flex justify-between">
                        <span>{design.knifeType === 'pocket' ? 'Pocket knife' : 'Chef knife'} + engraving</span>
                        <span>${(design.knifeType === 'pocket' ? BASIC_POCKET_PRICE : BASIC_CHEF_PRICE).toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span>Engraving only</span>
                        <span>${ENGRAVING_ONLY_PRICE.toFixed(2)}</span>
                      </div>
                    )}
                    {design.engravingLocation === 'both' && (
                      <div className="flex justify-between">
                        <span>+ Both sides</span>
                        <span>${BOTH_SIDES_ADDON.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  {design.quantity > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center">
                      <span className="text-sm text-gray-300">Total ({design.quantity}):</span>
                      <span className="text-xl font-bold text-vurmz-teal">${design.totalPrice.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Popular engraving ideas */}
        <div className="space-y-4">
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Popular Engravings:</p>
            <div className="flex flex-wrap gap-2">
              {['Name', 'Initials', 'Date', 'To/From', 'Logo'].map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => {
                    const canEngraveBlade = design.engravingLocation === 'blade' || design.engravingLocation === 'both'
                    const canEngraveHandle = design.engravingLocation === 'handle' || design.engravingLocation === 'both'
                    if (canEngraveBlade && !design.bladeText) {
                      updateDesign({ bladeText: idea })
                    } else if (canEngraveHandle && !design.handleText) {
                      updateDesign({ handleText: idea })
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
