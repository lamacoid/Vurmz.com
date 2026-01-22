'use client'

import { useState, useEffect } from 'react'
import { QrCodeIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { fontOptions, ENGRAVING_COLOR } from '@/lib/fonts'
import FontSelector from './FontSelector'

type CardColor = 'matte-black' | 'gloss-black' | 'gloss-green' | 'gloss-red' | 'gloss-blue' | 'gloss-pink' | 'gloss-white' | 'stainless-steel'
type BackSideOption = 'large-qr' | 'large-logo' | 'custom-text'

interface CardData {
  name: string
  title: string
  business: string
  phone: string
  email: string
  website: string
  font: string
  qrEnabled: boolean
  qrValue: string
  logoEnabled: boolean
  backSideEnabled: boolean
  backSideOption: BackSideOption
  backSideText: string
  cardColor: CardColor
  layout: 'horizontal' | 'portrait'
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
    qrEnabled: false,
    qrValue: '',
    logoEnabled: false,
    backSideEnabled: false,
    backSideOption: 'large-qr',
    backSideText: '',
    cardColor: 'matte-black',
    layout: 'horizontal',
    pricePerCard: 3
  })

  const selectedFont = fontOptions.find(f => f.value === cardData.font) || fontOptions[0]

  // Calculate price whenever options change
  const calculatePrice = (data: Omit<CardData, 'pricePerCard'>) => {
    const basePrice = data.cardColor === 'stainless-steel' ? 15 : 3
    const addons = (data.qrEnabled ? 1 : 0) + (data.logoEnabled ? 1 : 0) + (data.backSideEnabled ? 1 : 0)
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
    <div className="bg-gray-50 border border-gray-200 p-6 mt-4">
      <h3 className="font-bold text-lg mb-4">Design Your Metal Business Card</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Smith"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={cardData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="CEO / Founder"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={cardData.business}
              onChange={(e) => updateField('business', e.target.value)}
              placeholder="Acme Corporation"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={cardData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={cardData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@acme.com"
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              value={cardData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="www.acme.com"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>

          {/* Font Selection - Tiles */}
          <FontSelector
            value={cardData.font}
            onChange={(value) => updateField('font', value)}
            previewText={cardData.name || 'Abc'}
          />

          {/* Card Color */}
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('cardColor', option.value)}
                  className={`px-2 py-2 text-xs font-medium border-2 transition-all relative ${
                    cardData.cardColor === option.value
                      ? 'border-vurmz-teal ring-1 ring-vurmz-teal'
                      : 'border-transparent hover:border-gray-400'
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
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('layout', 'horizontal')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  cardData.layout === 'horizontal'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-5 border-2 border-current rounded-sm" />
                  <span>Horizontal</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateField('layout', 'portrait')}
                className={`flex-1 px-3 py-2 text-sm font-medium border-2 transition-all ${
                  cardData.layout === 'portrait'
                    ? 'border-vurmz-teal bg-vurmz-teal/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-8 border-2 border-current rounded-sm" />
                  <span>Portrait</span>
                </div>
              </button>
            </div>
          </div>

          {/* Extras */}
          <div className="pt-2 border-t border-gray-200 space-y-3">
            <label className="block text-sm font-medium text-gray-700">Add-ons <span className="font-normal text-gray-500">(+$1 each per card)</span></label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.qrEnabled}
                onChange={(e) => updateField('qrEnabled', e.target.checked)}
                className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
              />
              <QrCodeIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm">QR Code</span>
              <span className="text-xs text-vurmz-teal font-medium">+$1</span>
            </label>

            {cardData.qrEnabled && (
              <div className="ml-7">
                <input
                  type="text"
                  value={cardData.qrValue}
                  onChange={(e) => updateField('qrValue', e.target.value)}
                  placeholder="URL or leave blank for phone"
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">QR codes link to your website or phone by default</p>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.logoEnabled}
                onChange={(e) => updateField('logoEnabled', e.target.checked)}
                className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
              />
              <PhotoIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Custom Logo</span>
              <span className="text-xs text-vurmz-teal font-medium">+$1</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cardData.backSideEnabled}
                onChange={(e) => updateField('backSideEnabled', e.target.checked)}
                className="w-4 h-4 text-vurmz-teal border-gray-300 rounded focus:ring-vurmz-teal"
              />
              <ArrowPathIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm">Back Side Design</span>
              <span className="text-xs text-vurmz-teal font-medium">+$1</span>
            </label>

            {cardData.backSideEnabled && (
              <div className="ml-7 space-y-2 p-3 bg-gray-50 rounded">
                <p className="text-xs font-medium text-gray-600 mb-2">Back side content:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'large-qr'}
                    onChange={() => updateField('backSideOption', 'large-qr')}
                    className="text-vurmz-teal focus:ring-vurmz-teal"
                  />
                  <QrCodeIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Large QR Code</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'large-logo'}
                    onChange={() => updateField('backSideOption', 'large-logo')}
                    className="text-vurmz-teal focus:ring-vurmz-teal"
                  />
                  <PhotoIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Large Logo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backSideOption"
                    checked={cardData.backSideOption === 'custom-text'}
                    onChange={() => updateField('backSideOption', 'custom-text')}
                    className="text-vurmz-teal focus:ring-vurmz-teal"
                  />
                  <span className="text-sm">Custom Text</span>
                </label>
                {cardData.backSideOption === 'custom-text' && (
                  <textarea
                    value={cardData.backSideText}
                    onChange={(e) => updateField('backSideText', e.target.value)}
                    placeholder="Enter text for back of card..."
                    rows={2}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none resize-none mt-1"
                  />
                )}
              </div>
            )}
          </div>

          {/* Price Calculator */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-vurmz-dark text-white p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Price per card:</span>
                <span className="text-xl font-bold">
                  ${cardData.cardColor === 'stainless-steel'
                    ? (15 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                    : (3 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                  }
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-0.5">
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              Price shown at checkout
            </p>
          </div>
        </div>

        {/* Card Preview */}
        <div className="space-y-4">
          <span className="text-sm font-medium text-gray-700">Front</span>

          {/* Front Card */}
          <div className="flex justify-center">
            <div
              className={`relative rounded-lg shadow-xl ${colors.bg} ${colors.border} border overflow-hidden transition-all duration-300 ${
                cardData.layout === 'portrait' ? 'w-[200px] h-[340px]' : 'w-[340px] h-[200px]'
              }`}
              style={{ background: colors.gradient }}
            >
              {/* Metallic shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />

              {/* Front Side */}
              <div className={`relative h-full p-5 flex flex-col ${cardData.layout === 'portrait' ? 'justify-start pt-8' : 'justify-between'}`}>
                {/* Logo placeholder */}
                {cardData.logoEnabled && (
                  <div className={`${cardData.layout === 'portrait' ? 'mx-auto mb-4' : 'absolute top-4 right-4'} w-12 h-12 border-2 border-dashed ${colors.accent} rounded flex items-center justify-center`}>
                    <span className={`text-xs ${colors.accent}`}>LOGO</span>
                  </div>
                )}

                {/* Main content */}
                <div className={`flex-1 flex flex-col ${cardData.layout === 'portrait' ? 'items-center text-center justify-start' : 'justify-center'}`}>
                  {cardData.business && (
                    <p
                      className={`text-sm font-medium ${colors.accent} tracking-wider uppercase mb-1`}
                      style={selectedFont?.style}
                    >
                      {cardData.business}
                    </p>
                  )}
                  <h4
                    className={`${cardData.layout === 'portrait' ? 'text-lg' : 'text-xl'} font-bold ${colors.text} tracking-wide`}
                    style={selectedFont?.style}
                  >
                    {cardData.name || 'Your Name'}
                  </h4>
                  {cardData.title && (
                    <p
                      className={`text-sm ${colors.accent} mt-0.5`}
                      style={selectedFont?.style}
                    >
                      {cardData.title}
                    </p>
                  )}
                </div>

                {/* Contact info */}
                <div className={`flex ${cardData.layout === 'portrait' ? 'flex-col items-center mt-auto' : 'items-end justify-between'}`}>
                  <div
                    className={`text-xs ${colors.accent} space-y-0.5 ${cardData.layout === 'portrait' ? 'text-center mb-3' : ''}`}
                    style={selectedFont?.style}
                  >
                    {cardData.phone && <p>{cardData.phone}</p>}
                    {cardData.email && <p>{cardData.email}</p>}
                    {cardData.website && <p>{cardData.website}</p>}
                  </div>

                  {/* QR Code */}
                  {cardData.qrEnabled && getQrCodeUrl() && (
                    <div className={`bg-white/90 rounded p-1 ${cardData.layout === 'portrait' ? 'w-14 h-14' : 'w-16 h-16'}`}>
                      <img
                        src={getQrCodeUrl()!}
                        alt="QR Code"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Back Card - only shown when back side is enabled */}
          {cardData.backSideEnabled && (
            <>
              <span className="text-sm font-medium text-gray-700 block mt-4">Back</span>
              <div className="flex justify-center">
                <div
                  className={`relative rounded-lg shadow-xl ${colors.bg} ${colors.border} border overflow-hidden transition-all duration-300 ${
                    cardData.layout === 'portrait' ? 'w-[200px] h-[340px]' : 'w-[340px] h-[200px]'
                  }`}
                  style={{ background: colors.gradient }}
                >
                  {/* Metallic shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />

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
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Standard size: 3.5&quot; x 2&quot; (89mm x 51mm)</p>
            <p>Laser engraved on metal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
