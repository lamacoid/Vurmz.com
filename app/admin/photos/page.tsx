'use client'

import { useState, useCallback } from 'react'
import { CheckCircleIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface PhotoSlot {
  id: string
  name: string
  description: string
  filename: string
  category: 'product' | 'detail' | 'lifestyle'
}

const photoSlots: PhotoSlot[] = [
  // Product Cards (Priority)
  { id: 'pens', name: 'Branded Pens', description: 'Metal stylus pens with engraving, fanned out or in holder', filename: 'product-pens.jpg', category: 'product' },
  { id: 'cards', name: 'Metal Business Cards', description: 'Stack of black anodized cards showing engraved text', filename: 'product-cards.jpg', category: 'product' },
  { id: 'nameplates', name: 'Name Plates', description: 'Desk nameplate with stand OR door plate mounted', filename: 'product-nameplates.jpg', category: 'product' },
  { id: 'coasters', name: 'Custom Coasters', description: 'Wood, slate, and/or stainless steel with logo', filename: 'product-coasters.jpg', category: 'product' },
  { id: 'industrial', name: 'Industrial Labels', description: 'Panel label, valve tag, or assorted nameplates', filename: 'product-industrial.jpg', category: 'product' },
  { id: 'knives', name: 'Knife Engraving', description: 'Chef knife blade or pocket knife handle with engraving', filename: 'product-knives.jpg', category: 'product' },
  { id: 'tools', name: 'Tool Marking', description: 'Drill or power tool with company name marked', filename: 'product-tools.jpg', category: 'product' },
  { id: 'keychains', name: 'Keychains', description: 'Assorted styles showing engraved designs', filename: 'product-keychains.jpg', category: 'product' },
  // Detail Shots
  { id: 'closeup', name: 'Engraving Close-up', description: 'Shows precision and quality of the engraving', filename: 'detail-closeup.jpg', category: 'detail' },
  { id: 'qr', name: 'QR Code', description: 'On a card or coaster, showing it is scannable', filename: 'detail-qr.jpg', category: 'detail' },
  { id: 'barcode', name: 'Barcode on Tag', description: 'Shows industrial capability', filename: 'detail-barcode.jpg', category: 'detail' },
  // Lifestyle
  { id: 'life-card', name: 'Card Handoff', description: 'Business card being handed to someone', filename: 'lifestyle-card.jpg', category: 'lifestyle' },
  { id: 'life-desk', name: 'Nameplate on Desk', description: 'In a real office setting', filename: 'lifestyle-desk.jpg', category: 'lifestyle' },
  { id: 'life-coaster', name: 'Coaster with Drink', description: 'Actually being used', filename: 'lifestyle-coaster.jpg', category: 'lifestyle' },
  { id: 'life-valve', name: 'Valve Tag Installed', description: 'Attached to actual valve or pipe', filename: 'lifestyle-valve.jpg', category: 'lifestyle' },
]

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

interface SlotState {
  status: UploadStatus
  preview?: string
  error?: string
}

export default function PhotoUploadPage() {
  const [slotStates, setSlotStates] = useState<Record<string, SlotState>>({})
  const [completedSlots, setCompletedSlots] = useState<Set<string>>(new Set())

  const handleUpload = useCallback(async (slotId: string, file: File) => {
    // Update state to uploading
    setSlotStates(prev => ({
      ...prev,
      [slotId]: { status: 'uploading', preview: URL.createObjectURL(file) }
    }))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slotId', slotId)

      const response = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json() as { error?: string }
        throw new Error(data.error || 'Upload failed')
      }

      setSlotStates(prev => ({
        ...prev,
        [slotId]: { status: 'done', preview: prev[slotId]?.preview }
      }))
      setCompletedSlots(prev => new Set([...prev, slotId]))
    } catch (error) {
      setSlotStates(prev => ({
        ...prev,
        [slotId]: { status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
      }))
    }
  }, [])

  const handleDrop = useCallback((slotId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(slotId, file)
    }
  }, [handleUpload])

  const handleFileSelect = useCallback((slotId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(slotId, file)
    }
  }, [handleUpload])

  const completedCount = completedSlots.size
  const totalCount = photoSlots.length
  const progressPct = (completedCount / totalCount) * 100

  const renderCategory = (category: 'product' | 'detail' | 'lifestyle', title: string, badge?: string) => {
    const slots = photoSlots.filter(s => s.category === category)
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {badge && (
            <span className="px-3 py-1 bg-[#6A8C8C] text-white text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map(slot => {
            const state = slotStates[slot.id] || { status: 'idle' }
            const isComplete = completedSlots.has(slot.id)

            return (
              <div
                key={slot.id}
                onDrop={handleDrop(slot.id)}
                onDragOver={(e) => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer group
                  ${isComplete ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-[#6A8C8C] hover:bg-gray-50'}
                  ${state.status === 'uploading' ? 'border-[#6A8C8C] bg-[#6A8C8C]/5' : ''}
                  ${state.status === 'error' ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect(slot.id)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {/* Preview or Placeholder */}
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {state.preview ? (
                    <img src={state.preview} alt={slot.name} className="w-full h-full object-cover" />
                  ) : (
                    <PhotoIcon className="w-12 h-12 text-gray-300" />
                  )}

                  {/* Overlay states */}
                  {state.status === 'uploading' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <ArrowPathIcon className="w-8 h-8 text-[#6A8C8C] animate-spin" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{slot.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{slot.description}</p>
                  </div>
                  {isComplete && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>

                {state.status === 'error' && (
                  <p className="text-xs text-red-500 mt-2">{state.error}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Photos</h1>
          <p className="text-gray-600">
            Drag and drop photos onto each slot. They are auto-processed with the warm preset.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedCount} of {totalCount} complete</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6A8C8C] to-[#5a7a7a] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Photo Slots by Category */}
        {renderCategory('product', 'Product Cards', 'Priority')}
        {renderCategory('detail', 'Detail Shots')}
        {renderCategory('lifestyle', 'Lifestyle Shots')}

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-amber-800 mb-2">Photo Tips</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Clean white, black, or wood background works best</li>
            <li>• Natural light near a window is ideal</li>
            <li>• Make sure engraved text is sharp and readable</li>
            <li>• Photos are auto-processed: warmth, sharpening, and web optimization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
