'use client'

import { useState, useEffect } from 'react'
import { QrCodeIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { fontOptions, ENGRAVING_COLOR } from '@/lib/fonts'
import FontSelector from './FontSelector'
import { PRODUCTS } from '@/lib/products'

type CardColor = 'matte-black' | 'gloss-black' | 'gloss-green' | 'gloss-red' | 'gloss-blue' | 'gloss-pink' | 'gloss-white' | 'stainless-steel'
type BackSideOption = 'large-qr' | 'large-logo' | 'custom-text'
type MarkingStyle = 'deep' | 'surface'
type CardTemplate = 'classic' | 'centered' | 'minimal' | 'bold' | 'logo-focus' | 'modern'

// Business card exclusive font - Spacetime
const SPACETIME_FONT = {
  value: 'spacetime',
  label: 'Spacetime',
  style: { fontFamily: 'spacetime-regular, sans-serif' }
}

interface CardData {
  name: string
  title: string
  business: string
  phone: string
  email: string
  website: string
  font: string
  markingStyle: MarkingStyle
  qrEnabled: boolean
  qrValue: string
  logoEnabled: boolean
  backSideEnabled: boolean
  backSideOption: BackSideOption
  backSideText: string
  cardColor: CardColor
  layout: 'horizontal' | 'portrait'
  template: CardTemplate
  pricePerCard: number
}

interface MetalBusinessCardPreviewProps {
  onChange: (data: CardData) => void
}

export default function MetalBusinessCardPreview({ onChange }: MetalBusinessCardPreviewProps) {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    title: '',
    business: '',
    phone: '',
    email: '',
    website: '',
    font: 'arial',
    markingStyle: 'deep',
    qrEnabled: true,
    qrValue: '',
    logoEnabled: true,
    backSideEnabled: true,
    backSideOption: 'large-qr',
    backSideText: '',
    cardColor: 'matte-black',
    layout: 'horizontal',
    template: 'classic',
    pricePerCard: 6
  })

  // Get selected font - check for Spacetime first, then regular fonts
  const selectedFont = cardData.font === 'spacetime'
    ? SPACETIME_FONT
    : (fontOptions.find(f => f.value === cardData.font) || fontOptions[0])

  // Calculate price from centralized source
  const calculatePrice = (data: Omit<CardData, 'pricePerCard'>) => {
    const basePrice = data.cardColor === 'stainless-steel'
      ? PRODUCTS.businessCards.stainlessBase
      : PRODUCTS.businessCards.matteBlackBase
    const addons =
      (data.qrEnabled ? PRODUCTS.businessCards.addOns.qrCode : 0) +
      (data.logoEnabled ? PRODUCTS.businessCards.addOns.logo : 0) +
      (data.backSideEnabled ? PRODUCTS.businessCards.addOns.backSide : 0)
    return basePrice + addons
  }

  useEffect(() => {
    onChange(cardData)
  }, [cardData, onChange])

  const updateField = (field: keyof CardData, value: string | boolean) => {
    setCardData(prev => {
      const updated = { ...prev, [field]: value }
      // Recalculate price when relevant fields change
      if (['cardColor', 'qrEnabled', 'logoEnabled', 'backSideEnabled'].includes(field)) {
        updated.pricePerCard = calculatePrice(updated)
      }
      return updated
    })
  }

  const cardColors: Record<CardColor, { bg: string; text: string; accent: string; border: string; gradient: string; qrColor: string }> = {
    'matte-black': {
      bg: 'bg-zinc-900',
      text: 'text-zinc-200',
      accent: 'text-zinc-400',
      border: 'border-zinc-800',
      gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)',
      qrColor: 'CCCCCC'
    },
    'gloss-black': {
      bg: 'bg-black',
      text: 'text-white',
      accent: 'text-zinc-300',
      border: 'border-zinc-700',
      gradient: 'linear-gradient(135deg, #000000 0%, #1f1f1f 30%, #000000 60%, #2a2a2a 100%)',
      qrColor: 'FFFFFF'
    },
    'gloss-green': {
      bg: 'bg-emerald-600',
      text: 'text-white',
      accent: 'text-emerald-100',
      border: 'border-emerald-500',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 30%, #059669 60%, #34d399 100%)',
      qrColor: 'FFFFFF'
    },
    'gloss-red': {
      bg: 'bg-red-600',
      text: 'text-white',
      accent: 'text-red-100',
      border: 'border-red-500',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 30%, #dc2626 60%, #f87171 100%)',
      qrColor: 'FFFFFF'
    },
    'gloss-blue': {
      bg: 'bg-blue-600',
      text: 'text-white',
      accent: 'text-blue-100',
      border: 'border-blue-500',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 30%, #2563eb 60%, #60a5fa 100%)',
      qrColor: 'FFFFFF'
    },
    'gloss-pink': {
      bg: 'bg-pink-500',
      text: 'text-white',
      accent: 'text-pink-100',
      border: 'border-pink-400',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 30%, #ec4899 60%, #f9a8d4 100%)',
      qrColor: 'FFFFFF'
    },
    'gloss-white': {
      bg: 'bg-white',
      text: 'text-zinc-800',
      accent: 'text-zinc-600',
      border: 'border-zinc-300',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 30%, #ffffff 60%, #e4e4e7 100%)',
      qrColor: '333333'
    },
    'stainless-steel': {
      bg: 'bg-zinc-400',
      text: 'text-zinc-900',
      accent: 'text-zinc-700',
      border: 'border-zinc-500',
      gradient: 'linear-gradient(135deg, #a1a1aa 0%, #d4d4d8 20%, #a1a1aa 40%, #e4e4e7 60%, #a1a1aa 80%, #d4d4d8 100%)',
      qrColor: '333333'
    }
  }

  const colors = cardColors[cardData.cardColor]

  // Generate QR code URL using a free QR API
  const getQrCodeUrl = () => {
    const value = cardData.qrValue || cardData.website || `tel:${cardData.phone}`
    if (!value) return null
    // Using QR Server API (free, no expiry)
    return `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(value)}&bgcolor=transparent&color=${colors.qrColor}`
  }

  const templateOptions: { value: CardTemplate; label: string; description: string }[] = [
    { value: 'classic', label: 'Classic', description: 'Traditional business card layout' },
    { value: 'centered', label: 'Centered', description: 'Everything centered and balanced' },
    { value: 'minimal', label: 'Minimal', description: 'Clean and simple' },
    { value: 'bold', label: 'Bold', description: 'Large name emphasis' },
    { value: 'logo-focus', label: 'Logo Focus', description: 'Logo takes center stage' },
    { value: 'modern', label: 'Modern', description: 'Contemporary asymmetric design' },
  ]

  const colorOptions: { value: CardColor; label: string; className: string; premium?: boolean }[] = [
    { value: 'matte-black', label: 'Matte Black', className: 'bg-zinc-900 text-white' },
    { value: 'gloss-black', label: 'Gloss Black', className: 'bg-black text-white' },
    { value: 'gloss-green', label: 'Gloss Green', className: 'bg-emerald-600 text-white' },
    { value: 'gloss-red', label: 'Gloss Red', className: 'bg-red-600 text-white' },
    { value: 'gloss-blue', label: 'Gloss Blue', className: 'bg-blue-600 text-white' },
    { value: 'gloss-pink', label: 'Gloss Pink', className: 'bg-pink-500 text-white' },
    { value: 'gloss-white', label: 'Gloss White', className: 'bg-white text-zinc-800 border border-zinc-300' },
    { value: 'stainless-steel', label: 'Stainless Steel', className: 'bg-gradient-to-r from-zinc-400 to-zinc-300 text-zinc-800', premium: true },
  ]

  return (
    <div className="bg-[#FAF7F2] border border-[#D4C8B8] p-6 mt-4">
      <h3 className="font-bold text-lg mb-4 text-[#3D3428]">Design Your Metal Business Card</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Name *</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Smith"
                className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Title</label>
              <input
                type="text"
                value={cardData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="CEO / Founder"
                className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Business Name</label>
            <input
              type="text"
              value={cardData.business}
              onChange={(e) => updateField('business', e.target.value)}
              placeholder="Acme Corporation"
              className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Phone</label>
              <input
                type="tel"
                value={cardData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@acme.com"
                className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C4A3A] mb-1">Website</label>
            <input
              type="text"
              value={cardData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="www.acme.com"
              className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
            />
          </div>

          {/* Font Selection - with Spacetime exclusive */}
          <div>
            <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Font Style</label>
            {/* Spacetime - Business Card Exclusive */}
            <button
              type="button"
              onClick={() => updateField('font', 'spacetime')}
              className={`w-full mb-2 p-3 border-2 rounded-lg text-left transition-all ${
                cardData.font === 'spacetime'
                  ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                  : 'border-[#E0D6C8] hover:border-[#D4C8B8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium" style={SPACETIME_FONT.style}>Spacetime</span>
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Exclusive</span>
                </div>
                <span className="text-sm" style={SPACETIME_FONT.style}>{cardData.name || 'Abc'}</span>
              </div>
            </button>
            {/* Regular font selector */}
            <FontSelector
              value={cardData.font === 'spacetime' ? 'arial' : cardData.font}
              onChange={(value) => updateField('font', value)}
              previewText={cardData.name || 'Abc'}
            />
          </div>

          {/* Marking Style - Deep vs Surface */}
          <div className="pt-2 border-t border-[#E0D6C8]">
            <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Marking Style</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('markingStyle', 'deep')}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  cardData.markingStyle === 'deep'
                    ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                    : 'border-[#E0D6C8] hover:border-[#D4C8B8]'
                }`}
              >
                <div className="font-medium text-sm text-[#5C4A3A]">Deep Engraving</div>
                <div className="text-xs text-[#8B7355]">Dark, permanent, premium</div>
              </button>
              <button
                type="button"
                onClick={() => updateField('markingStyle', 'surface')}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  cardData.markingStyle === 'surface'
                    ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                    : 'border-[#E0D6C8] hover:border-[#D4C8B8]'
                }`}
              >
                <div className="font-medium text-sm text-[#5C4A3A]">Surface Marking</div>
                <div className="text-xs text-[#8B7355]">Frosted, subtle, elegant</div>
              </button>
            </div>
          </div>

          {/* Card Color */}
          <div className="pt-2 border-t border-[#E0D6C8]">
            <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Card Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('cardColor', option.value)}
                  className={`px-2 py-2 text-xs font-medium border-2 transition-all relative ${
                    cardData.cardColor === option.value
                      ? 'border-[#7EB8C9] ring-1 ring-[#7EB8C9]'
                      : 'border-transparent hover:border-[#D4C8B8]'
                  } ${option.className}`}
                >
                  {option.label}
                  {option.premium && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-950 text-[8px] px-1 rounded">
                      PREMIUM
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div className="pt-2 border-t border-[#E0D6C8]">
            <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Layout</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('layout', 'horizontal')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  cardData.layout === 'horizontal'
                    ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                    : 'border-[#D4C8B8] hover:border-[#C4B8A8]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-[#5C4A3A]">
                  <div className="w-8 h-5 border-2 border-current rounded-sm" />
                  <span>Horizontal</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateField('layout', 'portrait')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  cardData.layout === 'portrait'
                    ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                    : 'border-[#D4C8B8] hover:border-[#C4B8A8]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-[#5C4A3A]">
                  <div className="w-5 h-8 border-2 border-current rounded-sm" />
                  <span>Portrait</span>
                </div>
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="pt-2 border-t border-[#E0D6C8]">
            <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Template Style</label>
            <div className="grid grid-cols-3 gap-2">
              {templateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('template', option.value)}
                  className={`px-2 py-2 text-xs font-medium border-2 transition-all text-center ${
                    cardData.template === option.value
                      ? 'border-[#7EB8C9] bg-[#7EB8C9]/10'
                      : 'border-[#E0D6C8] hover:border-[#D4C8B8]'
                  }`}
                >
                  <div className="font-medium text-[#5C4A3A]">{option.label}</div>
                  <div className="text-[10px] text-[#8B7355] mt-0.5">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="pt-2 border-t border-[#E0D6C8] space-y-3">
            <label className="block text-sm font-medium text-[#5C4A3A]">Add-ons <span className="font-normal text-[#8B7355]">(+$1 each per card)</span></label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.qrEnabled}
                onChange={(e) => updateField('qrEnabled', e.target.checked)}
                className="w-4 h-4 text-[#7EB8C9] border-[#D4C8B8] rounded focus:ring-[#7EB8C9]"
              />
              <QrCodeIcon className="h-5 w-5 text-[#8B7355]" />
              <span className="text-sm text-[#5C4A3A]">QR Code</span>
              <span className="text-xs text-[#7EB8C9] font-medium">+$1</span>
            </label>

            {cardData.qrEnabled && (
              <div className="ml-7">
                <input
                  type="text"
                  value={cardData.qrValue}
                  onChange={(e) => updateField('qrValue', e.target.value)}
                  placeholder="URL or leave blank for phone"
                  className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none"
                />
                <p className="text-xs text-[#8B7355] mt-1">QR codes link to your website or phone by default</p>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.logoEnabled}
                onChange={(e) => updateField('logoEnabled', e.target.checked)}
                className="w-4 h-4 text-[#7EB8C9] border-[#D4C8B8] rounded focus:ring-[#7EB8C9]"
              />
              <PhotoIcon className="h-5 w-5 text-[#8B7355]" />
              <span className="text-sm text-[#5C4A3A]">Custom Logo</span>
              <span className="text-xs text-[#7EB8C9] font-medium">+$1</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.backSideEnabled}
                onChange={(e) => updateField('backSideEnabled', e.target.checked)}
                className="w-4 h-4 text-[#7EB8C9] border-[#D4C8B8] rounded focus:ring-[#7EB8C9]"
              />
              <ArrowPathIcon className="h-5 w-5 text-[#8B7355]" />
              <span className="text-sm text-[#5C4A3A]">Back Side Design</span>
              <span className="text-xs text-[#7EB8C9] font-medium">+$1</span>
            </label>

            {cardData.backSideEnabled && (
              <div className="ml-7 space-y-2 p-3 bg-[#F5F0E8] rounded">
                <p className="text-xs font-medium text-[#6B5A48] mb-2">Back side content:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'large-qr'}
                    onChange={() => updateField('backSideOption', 'large-qr')}
                    className="text-[#7EB8C9] focus:ring-[#7EB8C9]"
                  />
                  <QrCodeIcon className="h-4 w-4 text-[#8B7355]" />
                  <span className="text-sm text-[#5C4A3A]">Large QR Code</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'large-logo'}
                    onChange={() => updateField('backSideOption', 'large-logo')}
                    className="text-[#7EB8C9] focus:ring-[#7EB8C9]"
                  />
                  <PhotoIcon className="h-4 w-4 text-[#8B7355]" />
                  <span className="text-sm text-[#5C4A3A]">Large Logo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'custom-text'}
                    onChange={() => updateField('backSideOption', 'custom-text')}
                    className="text-[#7EB8C9] focus:ring-[#7EB8C9]"
                  />
                  <span className="text-sm text-[#5C4A3A]">Custom Text</span>
                </label>
                {cardData.backSideOption === 'custom-text' && (
                  <textarea
                    value={cardData.backSideText}
                    onChange={(e) => updateField('backSideText', e.target.value)}
                    placeholder="Enter text for back of card..."
                    rows={2}
                    className="w-full border border-[#D4C8B8] px-3 py-2 text-sm focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none resize-none mt-1"
                  />
                )}
              </div>
            )}
          </div>

          {/* Price Calculator */}
          <div className="pt-3 border-t border-[#E0D6C8]">
            <div className="bg-[#7EB8C9] text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/80">Price per card:</span>
                <span className="text-xl font-bold">
                  ${cardData.cardColor === 'stainless-steel'
                    ? (15 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                    : (3 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                  }
                </span>
              </div>
              <div className="text-xs text-white/70 space-y-0.5">
                <div className="flex justify-between">
                  <span>{cardData.cardColor === 'stainless-steel' ? 'Stainless Steel' : 'Metal Card'}</span>
                  <span>${cardData.cardColor === 'stainless-steel' ? '15.00' : '3.00'}</span>
                </div>
                {cardData.qrEnabled && (
                  <div className="flex justify-between">
                    <span>+ QR Code</span>
                    <span>$1.00</span>
                  </div>
                )}
                {cardData.logoEnabled && (
                  <div className="flex justify-between">
                    <span>+ Custom Logo</span>
                    <span>$1.00</span>
                  </div>
                )}
                {cardData.backSideEnabled && (
                  <div className="flex justify-between">
                    <span>+ Back Side</span>
                    <span>$1.00</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-[#8B7355] mt-2 text-center">
              Price shown at checkout
            </p>
          </div>
        </div>

        {/* Card Preview */}
        <div className="space-y-4">
          <span className="text-sm font-medium text-[#5C4A3A]">Front</span>

          {/* Front Card */}
          <div className="flex justify-center">
            <div
              className={`relative rounded-lg shadow-xl ${colors.bg} ${colors.border} border overflow-hidden transition-all duration-300 ${
                cardData.layout === 'portrait' ? 'w-[200px] h-[340px]' : 'w-[340px] h-[200px]'
              }`}
              style={{ background: colors.gradient }}
            >
              {/* Template: Classic */}
              {cardData.template === 'classic' && (
                <div className={`relative h-full p-5 flex flex-col ${cardData.layout === 'portrait' ? 'justify-start pt-8' : 'justify-between'}`}>
                  {cardData.logoEnabled && (
                    <div className={`${cardData.layout === 'portrait' ? 'mx-auto mb-4' : 'absolute top-4 right-4'} w-12 h-12 border-2 border-dashed ${colors.accent} rounded flex items-center justify-center`}>
                      <span className={`text-xs ${colors.accent}`}>LOGO</span>
                    </div>
                  )}
                  <div className={`flex-1 flex flex-col ${cardData.layout === 'portrait' ? 'items-center text-center justify-start' : 'justify-center'}`}>
                    {cardData.business && (
                      <p className={`text-sm font-medium ${colors.accent} tracking-wider uppercase mb-1`} style={selectedFont?.style}>
                        {cardData.business}
                      </p>
                    )}
                    <h4 className={`${cardData.layout === 'portrait' ? 'text-lg' : 'text-xl'} font-bold ${colors.text} tracking-wide`} style={selectedFont?.style}>
                      {cardData.name || 'Your Name'}
                    </h4>
                    {cardData.title && (
                      <p className={`text-sm ${colors.accent} mt-0.5`} style={selectedFont?.style}>
                        {cardData.title}
                      </p>
                    )}
                  </div>
                  <div className={`flex ${cardData.layout === 'portrait' ? 'flex-col items-center mt-auto' : 'items-end justify-between'}`}>
                    <div className={`text-xs ${colors.accent} space-y-0.5 ${cardData.layout === 'portrait' ? 'text-center mb-3' : ''}`} style={selectedFont?.style}>
                      {cardData.phone && <p>{cardData.phone}</p>}
                      {cardData.email && <p>{cardData.email}</p>}
                      {cardData.website && <p>{cardData.website}</p>}
                    </div>
                    {cardData.qrEnabled && getQrCodeUrl() && (
                      <div className={`bg-white/90 rounded p-1 ${cardData.layout === 'portrait' ? 'w-14 h-14' : 'w-16 h-16'}`}>
                        <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Template: Centered */}
              {cardData.template === 'centered' && (
                <div className="relative h-full p-5 flex flex-col items-center justify-center text-center">
                  {cardData.logoEnabled && (
                    <div className="w-10 h-10 border-2 border-dashed rounded flex items-center justify-center mb-3" style={{ borderColor: colors.accent.includes('text-') ? undefined : colors.accent }}>
                      <span className={`text-xs ${colors.accent}`}>LOGO</span>
                    </div>
                  )}
                  {cardData.business && (
                    <p className={`text-xs font-medium ${colors.accent} tracking-wider uppercase mb-1`} style={selectedFont?.style}>
                      {cardData.business}
                    </p>
                  )}
                  <h4 className={`text-xl font-bold ${colors.text} tracking-wide`} style={selectedFont?.style}>
                    {cardData.name || 'Your Name'}
                  </h4>
                  {cardData.title && (
                    <p className={`text-sm ${colors.accent} mt-1`} style={selectedFont?.style}>
                      {cardData.title}
                    </p>
                  )}
                  <div className={`text-xs ${colors.accent} space-y-0.5 mt-3`} style={selectedFont?.style}>
                    {cardData.phone && <p>{cardData.phone}</p>}
                    {cardData.email && <p>{cardData.email}</p>}
                    {cardData.website && <p>{cardData.website}</p>}
                  </div>
                  {cardData.qrEnabled && getQrCodeUrl() && (
                    <div className="bg-white/90 rounded p-1 w-12 h-12 mt-2">
                      <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Template: Minimal */}
              {cardData.template === 'minimal' && (
                <div className="relative h-full p-6 flex flex-col justify-center">
                  <h4 className={`text-2xl font-bold ${colors.text} tracking-wide mb-4`} style={selectedFont?.style}>
                    {cardData.name || 'Your Name'}
                  </h4>
                  <div className={`text-xs ${colors.accent} space-y-1`} style={selectedFont?.style}>
                    {cardData.phone && <p>{cardData.phone}</p>}
                    {cardData.email && <p>{cardData.email}</p>}
                  </div>
                  {cardData.qrEnabled && getQrCodeUrl() && (
                    <div className="absolute bottom-4 right-4 bg-white/90 rounded p-1 w-12 h-12">
                      <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Template: Bold */}
              {cardData.template === 'bold' && (
                <div className="relative h-full p-5 flex flex-col justify-center">
                  <h4 className={`text-3xl font-black ${colors.text} tracking-tight leading-tight`} style={selectedFont?.style}>
                    {cardData.name || 'Your Name'}
                  </h4>
                  {cardData.title && (
                    <p className={`text-base ${colors.accent} mt-1 font-medium`} style={selectedFont?.style}>
                      {cardData.title}
                    </p>
                  )}
                  <div className="flex items-end justify-between mt-auto pt-4">
                    <div className={`text-xs ${colors.accent} space-y-0.5`} style={selectedFont?.style}>
                      {cardData.phone && <p>{cardData.phone}</p>}
                      {cardData.email && <p>{cardData.email}</p>}
                    </div>
                    {cardData.qrEnabled && getQrCodeUrl() && (
                      <div className="bg-white/90 rounded p-1 w-14 h-14">
                        <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                      </div>
                    )}
                  </div>
                  {cardData.logoEnabled && (
                    <div className={`absolute top-4 right-4 w-10 h-10 border-2 border-dashed rounded flex items-center justify-center ${colors.accent.replace('text-', 'border-')}`}>
                      <span className={`text-xs ${colors.accent}`}>LOGO</span>
                    </div>
                  )}
                </div>
              )}

              {/* Template: Logo Focus */}
              {cardData.template === 'logo-focus' && (
                <div className="relative h-full p-5 flex flex-col items-center justify-center text-center">
                  <div className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center mb-3 ${colors.accent.replace('text-', 'border-')}`}>
                    <span className={`text-sm ${colors.accent}`}>LOGO</span>
                  </div>
                  {cardData.business && (
                    <p className={`text-sm font-bold ${colors.text} tracking-wider uppercase`} style={selectedFont?.style}>
                      {cardData.business}
                    </p>
                  )}
                  <p className={`text-xs ${colors.accent} mt-2`} style={selectedFont?.style}>
                    {cardData.name || 'Your Name'}
                  </p>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4">
                    <span className={`text-[10px] ${colors.accent}`} style={selectedFont?.style}>{cardData.phone}</span>
                    <span className={`text-[10px] ${colors.accent}`} style={selectedFont?.style}>{cardData.website}</span>
                  </div>
                  {cardData.qrEnabled && getQrCodeUrl() && (
                    <div className="absolute bottom-3 right-3 bg-white/90 rounded p-0.5 w-10 h-10">
                      <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Template: Modern */}
              {cardData.template === 'modern' && (
                <div className="relative h-full">
                  <div className={`absolute top-0 left-0 w-1/3 h-full ${cardData.cardColor === 'gloss-white' || cardData.cardColor === 'stainless-steel' ? 'bg-black/10' : 'bg-white/5'}`} />
                  <div className="relative h-full p-5 flex">
                    <div className="w-1/3 flex flex-col justify-center items-center">
                      {cardData.logoEnabled && (
                        <div className={`w-14 h-14 border-2 border-dashed rounded flex items-center justify-center ${colors.accent.replace('text-', 'border-')}`}>
                          <span className={`text-xs ${colors.accent}`}>LOGO</span>
                        </div>
                      )}
                      {cardData.qrEnabled && getQrCodeUrl() && (
                        <div className="bg-white/90 rounded p-1 w-12 h-12 mt-2">
                          <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 flex flex-col justify-center pl-4">
                      <h4 className={`text-xl font-bold ${colors.text} tracking-wide`} style={selectedFont?.style}>
                        {cardData.name || 'Your Name'}
                      </h4>
                      {cardData.title && (
                        <p className={`text-sm ${colors.accent} mt-0.5`} style={selectedFont?.style}>
                          {cardData.title}
                        </p>
                      )}
                      {cardData.business && (
                        <p className={`text-xs ${colors.accent} mt-2 font-medium tracking-wider uppercase`} style={selectedFont?.style}>
                          {cardData.business}
                        </p>
                      )}
                      <div className={`text-xs ${colors.accent} space-y-0.5 mt-3`} style={selectedFont?.style}>
                        {cardData.phone && <p>{cardData.phone}</p>}
                        {cardData.email && <p>{cardData.email}</p>}
                        {cardData.website && <p>{cardData.website}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Card - only shown when back side is enabled */}
          {cardData.backSideEnabled && (
            <>
              <span className="text-sm font-medium text-[#5C4A3A] block mt-4">Back</span>
              <div className="flex justify-center">
                <div
                  className={`relative rounded-lg shadow-xl ${colors.bg} ${colors.border} border overflow-hidden transition-all duration-300 ${
                    cardData.layout === 'portrait' ? 'w-[200px] h-[340px]' : 'w-[340px] h-[200px]'
                  }`}
                  style={{ background: colors.gradient }}
                >
                  {/* Back Side Content */}
                  <div className="relative h-full p-5 flex items-center justify-center">
                    {cardData.backSideOption === 'large-qr' && (
                      <div className="text-center">
                        {getQrCodeUrl() ? (
                          <div className="bg-white/90 rounded p-2 w-24 h-24 mx-auto">
                            <img
                              src={getQrCodeUrl()!.replace('size=80x80', 'size=150x150')}
                              alt="QR Code"
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className={`w-24 h-24 border-2 border-dashed ${colors.accent} rounded flex items-center justify-center mx-auto`}>
                            <QrCodeIcon className={`w-12 h-12 ${colors.accent}`} />
                          </div>
                        )}
                        <p className={`text-xs ${colors.accent} mt-2`}>Large QR Code</p>
                      </div>
                    )}

                    {cardData.backSideOption === 'large-logo' && (
                      <div className="text-center">
                        <div className={`w-24 h-24 border-2 border-dashed ${colors.accent} rounded flex items-center justify-center mx-auto`}>
                          <PhotoIcon className={`w-12 h-12 ${colors.accent}`} />
                        </div>
                        <p className={`text-xs ${colors.accent} mt-2`}>Your Logo</p>
                      </div>
                    )}

                    {cardData.backSideOption === 'custom-text' && (
                      <div className={`text-center ${colors.text} px-4`}>
                        <p
                          className={`text-sm whitespace-pre-wrap ${cardData.backSideText ? '' : colors.accent}`}
                          style={selectedFont?.style}
                        >
                          {cardData.backSideText || 'Your custom text here'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Card specs */}
          <div className="text-center text-xs text-[#8B7355] mt-4">
            <p>Standard size: 3.5&quot; x 2&quot; (89mm x 51mm)</p>
            <p>Laser engraved on metal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
