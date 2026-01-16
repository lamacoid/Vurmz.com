'use client'

import { useState, useEffect } from 'react'
import { fontOptions } from '@/lib/fonts'
import FontSelector from './FontSelector'
import ToolVisualizer from './builder/visualizers/ToolVisualizer'

type MarkingShape = 'small-rect' | 'medium-rect' | 'circle-1' | 'circle-half' | 'oval' | 'custom'

export interface ToolDesignData {
  markingShape: MarkingShape
  text: string
  text2: string
  font: string
  itemDescription: string
  quantity: number
  pricePerUnit: number
  totalPrice: number
}

interface ToolDesignerProps {
  onChange: (data: ToolDesignData) => void
}

const MARKING_SHAPES: { value: MarkingShape; label: string; description: string; price: number }[] = [
  { value: 'small-rect', label: '0.5" × 1"', description: 'Most common for tools', price: 5 },
  { value: 'circle-half', label: '0.5" Circle', description: 'Small round marking', price: 4 },
  { value: 'circle-1', label: '1" Circle', description: 'Larger round marking', price: 6 },
  { value: 'medium-rect', label: '1" × 2"', description: 'For bigger items', price: 8 },
  { value: 'oval', label: 'Oval', description: '0.75" × 1.5"', price: 6 },
  { value: 'custom', label: 'Custom', description: 'Specify size in notes', price: 0 },
]

export default function ToolDesigner({ onChange }: ToolDesignerProps) {
  const [design, setDesign] = useState<ToolDesignData>({
    markingShape: 'small-rect',
    text: '',
    text2: '',
    font: 'arial',
    itemDescription: '',
    quantity: 1,
    pricePerUnit: 5,
    totalPrice: 5,
  })

  const selectedFont = fontOptions.find(f => f.value === design.font) || fontOptions[0]

  const calculatePrice = (shape: MarkingShape, qty: number) => {
    const shapeData = MARKING_SHAPES.find(s => s.value === shape)
    const basePrice = shapeData?.price || 5
    return { pricePerUnit: basePrice, totalPrice: basePrice * qty }
  }

  const updateDesign = (updates: Partial<ToolDesignData>) => {
    setDesign(prev => {
      const updated = { ...prev, ...updates }
      const { pricePerUnit, totalPrice } = calculatePrice(updated.markingShape, updated.quantity)
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
        <h3 className="relative text-white font-bold text-lg tracking-tight">Tool & Equipment Marking</h3>
        <p className="relative text-gray-400 text-sm mt-1">Permanent laser marking for your tools</p>
      </div>

      {/* Live Preview - Clean background */}
      <div className="relative p-6 border-b border-gray-100" style={{ background: 'linear-gradient(180deg, rgba(250,251,250,0.98) 0%, rgba(245,247,246,0.95) 100%)' }}>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center font-medium">Live Preview</div>
        <ToolVisualizer
          shape={design.markingShape}
          text={design.text}
          text2={design.text2}
          font={selectedFont?.style?.fontFamily}
        />
      </div>

      <div className="p-6 space-y-6">
        {/* Marking Size/Shape */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marking Size</label>
          <div className="grid grid-cols-3 gap-2">
            {MARKING_SHAPES.map((shape) => (
              <button
                key={shape.value}
                type="button"
                onClick={() => updateDesign({ markingShape: shape.value })}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  design.markingShape === shape.value
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{shape.label}</div>
                <div className="text-xs text-gray-500">{shape.description}</div>
                {shape.price > 0 && (
                  <div className="text-xs text-vurmz-teal font-medium mt-1">${shape.price}/item</div>
                )}
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
              placeholder="Name, initials, or company"
              maxLength={design.markingShape === 'circle-half' ? 8 : 20}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              {design.text.length}/{design.markingShape === 'circle-half' ? 8 : 20} characters
            </p>
          </div>

          {design.markingShape !== 'circle-half' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line 2 (Optional)
              </label>
              <input
                type="text"
                value={design.text2}
                onChange={(e) => updateDesign({ text2: e.target.value })}
                placeholder="Phone number, department, etc."
                maxLength={15}
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded"
              />
            </div>
          )}
        </div>

        {/* Font Selection */}
        <FontSelector
          value={design.font}
          onChange={(value) => updateDesign({ font: value })}
          previewText={design.text || 'Abc'}
        />

        {/* Item Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What items are you marking?
          </label>
          <textarea
            value={design.itemDescription}
            onChange={(e) => updateDesign({ itemDescription: e.target.value })}
            placeholder="e.g., DeWalt drill, Snap-on wrench set, Lodge cast iron pan..."
            rows={2}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none rounded resize-none"
          />
        </div>

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
            <span className="w-12 text-center text-lg font-semibold">{design.quantity}</span>
            <button
              type="button"
              onClick={() => updateDesign({ quantity: design.quantity + 1 })}
              className="w-10 h-10 border border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
              +
            </button>
            <span className="text-sm text-gray-500 ml-2">items to mark</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Bring your tools:</span> Drop off or ship your items for permanent laser marking. Works on metal, anodized surfaces, and some plastics.
          </p>
        </div>

        {/* Price Summary */}
        {design.markingShape !== 'custom' && (
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Price per item:</span>
                <span className="text-lg font-bold">${design.pricePerUnit.toFixed(2)}</span>
              </div>
              {design.quantity > 1 && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-sm text-gray-300">Total ({design.quantity} items):</span>
                  <span className="text-xl font-bold text-vurmz-teal">${design.totalPrice.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {design.markingShape === 'custom' && (
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded-lg text-center">
              <span className="text-lg font-bold text-vurmz-teal">Quote Based</span>
              <p className="text-sm text-gray-400 mt-1">I&apos;ll provide a quote based on your specifications</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
