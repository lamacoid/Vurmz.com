'use client'

import { useState, useEffect, useCallback } from 'react'
import { QrCodeIcon, PhotoIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
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

  // Logo image stored as base64 data URL
  const [logoImage, setLogoImage] = useState<string | null>(null)

  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Read file as base64
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogoImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

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

  // Generate SVG for Lightburn export
  const generateSVG = useCallback(() => {
    // Card dimensions: 3.5" x 2" at 96 DPI
    const dpi = 96
    const isPortrait = cardData.layout === 'portrait'
    const cardWidth = isPortrait ? 2 * dpi : 3.5 * dpi
    const cardHeight = isPortrait ? 3.5 * dpi : 2 * dpi
    const cornerRadius = 8

    // Font mapping for SVG
    const fontFamily = selectedFont?.style?.fontFamily || 'Arial'

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${isPortrait ? '2in' : '3.5in'}"
     height="${isPortrait ? '3.5in' : '2in'}"
     viewBox="0 0 ${cardWidth} ${cardHeight}">
  <!-- VURMZ Metal Business Card - ${cardData.name || 'Unnamed'} -->
  <!-- Import into Lightburn: File > Import -->

  <!-- Card outline (reference - set to no output or delete) -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="${cardHeight - 2}" rx="${cornerRadius}" ry="${cornerRadius}"
        style="fill:none;stroke:#0000ff;stroke-width:0.5"/>

  <!-- Engrave layer (black = engrave in Lightburn) -->
  <g id="engrave" style="fill:#000000;">
`

    // Calculate positions based on layout
    const padding = 15
    const centerX = cardWidth / 2
    let yPos = isPortrait ? 50 : 35

    // Business name (smaller, above name)
    if (cardData.business) {
      svg += `    <text x="${isPortrait ? centerX : padding}" y="${yPos}"
           font-family="${fontFamily}" font-size="10" font-weight="500"
           ${isPortrait ? 'text-anchor="middle"' : ''}
           letter-spacing="2">${escapeXml(cardData.business.toUpperCase())}</text>\n`
      yPos += 18
    }

    // Name (large, bold)
    svg += `    <text x="${isPortrait ? centerX : padding}" y="${yPos}"
           font-family="${fontFamily}" font-size="18" font-weight="bold"
           ${isPortrait ? 'text-anchor="middle"' : ''}>${escapeXml(cardData.name || 'YOUR NAME')}</text>\n`
    yPos += 16

    // Title
    if (cardData.title) {
      svg += `    <text x="${isPortrait ? centerX : padding}" y="${yPos}"
           font-family="${fontFamily}" font-size="10"
           ${isPortrait ? 'text-anchor="middle"' : ''}>${escapeXml(cardData.title)}</text>\n`
      yPos += 14
    }

    // Contact info (bottom of card)
    const contactY = isPortrait ? cardHeight - 60 : cardHeight - 45
    let contactLine = contactY

    if (cardData.phone) {
      svg += `    <text x="${isPortrait ? centerX : padding}" y="${contactLine}"
           font-family="${fontFamily}" font-size="9"
           ${isPortrait ? 'text-anchor="middle"' : ''}>${escapeXml(cardData.phone)}</text>\n`
      contactLine += 12
    }
    if (cardData.email) {
      svg += `    <text x="${isPortrait ? centerX : padding}" y="${contactLine}"
           font-family="${fontFamily}" font-size="9"
           ${isPortrait ? 'text-anchor="middle"' : ''}>${escapeXml(cardData.email)}</text>\n`
      contactLine += 12
    }
    if (cardData.website) {
      svg += `    <text x="${isPortrait ? centerX : padding}" y="${contactLine}"
           font-family="${fontFamily}" font-size="9"
           ${isPortrait ? 'text-anchor="middle"' : ''}>${escapeXml(cardData.website)}</text>\n`
    }

    // QR Code placeholder (bottom right for horizontal, bottom center for portrait)
    if (cardData.qrEnabled) {
      const qrSize = 50
      const qrX = isPortrait ? centerX - qrSize/2 : cardWidth - qrSize - padding
      const qrY = isPortrait ? cardHeight - qrSize - 20 : cardHeight - qrSize - padding
      svg += `    <!-- QR Code area - replace with actual QR SVG -->
    <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}"
          style="fill:none;stroke:#000000;stroke-width:0.5;stroke-dasharray:2,2"/>
    <text x="${qrX + qrSize/2}" y="${qrY + qrSize/2 + 3}"
          font-family="Arial" font-size="8" text-anchor="middle">QR CODE</text>\n`
    }

    // Logo - embed actual image if uploaded
    if (cardData.logoEnabled) {
      const logoSize = 40
      const logoX = isPortrait ? centerX - logoSize/2 : cardWidth - logoSize - padding
      const logoY = isPortrait ? 80 : padding
      if (logoImage) {
        svg += `    <!-- Logo (embedded image) -->
    <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}"
           href="${logoImage}" preserveAspectRatio="xMidYMid meet"/>\n`
      } else {
        svg += `    <!-- Logo placeholder - upload logo to embed -->
    <rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}"
          style="fill:none;stroke:#000000;stroke-width:0.5;stroke-dasharray:2,2"/>
    <text x="${logoX + logoSize/2}" y="${logoY + logoSize/2 + 3}"
          font-family="Arial" font-size="7" text-anchor="middle">LOGO</text>\n`
      }
    }

    svg += `  </g>
</svg>`

    return svg
  }, [cardData, selectedFont, logoImage])

  // Download SVG file
  const downloadSVG = useCallback(() => {
    const svg = generateSVG()
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-card-${cardData.name?.replace(/\s+/g, '-').toLowerCase() || 'design'}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generateSVG, cardData.name])

  // Helper to escape XML special characters
  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(106,140,140,0.12)' }}>
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark px-6 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-vurmz-teal/5 via-transparent to-vurmz-teal/5" />
        <h3 className="relative text-white font-bold text-lg tracking-tight">Metal Business Card Designer</h3>
        <p className="relative text-gray-400 text-sm mt-1">Premium laser-engraved metal cards that people keep</p>
      </div>

      {/* Live Preview - Clean background */}
      <div className="relative p-6 border-b border-gray-100" style={{ background: 'linear-gradient(180deg, rgba(250,251,250,0.98) 0%, rgba(245,247,246,0.95) 100%)' }}>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center font-medium">Live Preview</div>
        <div className="flex justify-center">
          <div
            className={`relative rounded-lg shadow-xl ${colors.bg} ${colors.border} border overflow-hidden transition-all duration-300 ${
              cardData.layout === 'portrait' ? 'w-[160px] h-[272px]' : 'w-[272px] h-[160px]'
            }`}
            style={{ background: colors.gradient }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
            <div className={`relative h-full p-4 flex flex-col ${cardData.layout === 'portrait' ? 'justify-start pt-6' : 'justify-between'}`}>
              {cardData.logoEnabled && (
                <div className={`${cardData.layout === 'portrait' ? 'mx-auto mb-3' : 'absolute top-3 right-3'} w-8 h-8 flex items-center justify-center`}>
                  {logoImage ? (
                    <img src={logoImage} alt="Logo" className="max-w-full max-h-full object-contain" style={{ filter: cardData.cardColor === 'gloss-white' || cardData.cardColor === 'stainless-steel' ? 'none' : 'brightness(1.5) contrast(0.9)' }} />
                  ) : (
                    <div className={`w-full h-full border border-dashed ${colors.accent} rounded flex items-center justify-center`}>
                      <span className={`text-[8px] ${colors.accent}`}>LOGO</span>
                    </div>
                  )}
                </div>
              )}
              <div className={`flex-1 flex flex-col ${cardData.layout === 'portrait' ? 'items-center text-center justify-start' : 'justify-center'}`}>
                {cardData.business && <p className={`text-[9px] font-medium ${colors.accent} tracking-wider uppercase mb-0.5`} style={selectedFont?.style}>{cardData.business}</p>}
                <h4 className={`${cardData.layout === 'portrait' ? 'text-sm' : 'text-base'} font-bold ${colors.text} tracking-wide`} style={selectedFont?.style}>{cardData.name || 'Your Name'}</h4>
                {cardData.title && <p className={`text-[10px] ${colors.accent} mt-0.5`} style={selectedFont?.style}>{cardData.title}</p>}
              </div>
              <div className={`flex ${cardData.layout === 'portrait' ? 'flex-col items-center mt-auto' : 'items-end justify-between'}`}>
                <div className={`text-[8px] ${colors.accent} space-y-0.5 ${cardData.layout === 'portrait' ? 'text-center mb-2' : ''}`} style={selectedFont?.style}>
                  {cardData.phone && <p>{cardData.phone}</p>}
                  {cardData.email && <p>{cardData.email}</p>}
                  {cardData.website && <p>{cardData.website}</p>}
                </div>
                {cardData.qrEnabled && getQrCodeUrl() && (
                  <div className={`bg-white/90 rounded p-0.5 ${cardData.layout === 'portrait' ? 'w-10 h-10' : 'w-12 h-12'}`}>
                    <img src={getQrCodeUrl()!} alt="QR Code" className="w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-3">
          {colorOptions.find(c => c.value === cardData.cardColor)?.label} • {cardData.layout === 'portrait' ? 'Portrait' : 'Horizontal'}
          {cardData.backSideEnabled && ' • Double-sided'}
        </div>
      </div>

      <div className="p-6 space-y-6">
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

            {cardData.logoEnabled && (
              <div className="ml-7 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-vurmz-teal file:text-white hover:file:bg-vurmz-teal-dark"
                />
                {logoImage && (
                  <div className="flex items-center gap-2">
                    <img src={logoImage} alt="Logo preview" className="h-10 w-auto object-contain bg-gray-100 rounded p-1" />
                    <button
                      type="button"
                      onClick={() => setLogoImage(null)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">PNG or SVG with transparent background works best</p>
              </div>
            )}

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

          {/* Premium Price Calculator */}
          <div className="pt-4 border-t border-gray-100">
            <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #2C3533 0%, #1E2422 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              {/* Subtle glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vurmz-teal/30 to-transparent" />

              <div className="p-5 text-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Price per card</span>
                  <span className="text-2xl font-bold text-vurmz-teal">
                    ${cardData.cardColor === 'stainless-steel'
                      ? (15 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                      : (3 + (cardData.qrEnabled ? 1 : 0) + (cardData.logoEnabled ? 1 : 0) + (cardData.backSideEnabled ? 1 : 0)).toFixed(2)
                    }
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1 border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span>{cardData.cardColor === 'stainless-steel' ? 'Stainless Steel' : 'Metal Card'}</span>
                    <span className="text-gray-400">${cardData.cardColor === 'stainless-steel' ? '15.00' : '3.00'}</span>
                  </div>
                  {cardData.qrEnabled && (
                    <div className="flex justify-between">
                      <span>+ QR Code</span>
                      <span className="text-gray-400">$1.00</span>
                    </div>
                  )}
                  {cardData.logoEnabled && (
                    <div className="flex justify-between">
                      <span>+ Custom Logo</span>
                      <span className="text-gray-400">$1.00</span>
                    </div>
                  )}
                  {cardData.backSideEnabled && (
                    <div className="flex justify-between">
                      <span>+ Back Side</span>
                      <span className="text-gray-400">$1.00</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                {/* Logo */}
                {cardData.logoEnabled && (
                  <div className={`${cardData.layout === 'portrait' ? 'mx-auto mb-4' : 'absolute top-4 right-4'} w-12 h-12 flex items-center justify-center`}>
                    {logoImage ? (
                      <img
                        src={logoImage}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                        style={{ filter: cardData.cardColor === 'gloss-white' || cardData.cardColor === 'stainless-steel' ? 'none' : 'brightness(1.5) contrast(0.9)' }}
                      />
                    ) : (
                      <div className={`w-full h-full border-2 border-dashed ${colors.accent} rounded flex items-center justify-center`}>
                        <span className={`text-xs ${colors.accent}`}>LOGO</span>
                      </div>
                    )}
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
                        {logoImage ? (
                          <div className="w-28 h-28 flex items-center justify-center mx-auto">
                            <img
                              src={logoImage}
                              alt="Logo"
                              className="max-w-full max-h-full object-contain"
                              style={{ filter: cardData.cardColor === 'gloss-white' || cardData.cardColor === 'stainless-steel' ? 'none' : 'brightness(1.5) contrast(0.9)' }}
                            />
                          </div>
                        ) : (
                          <div className={`w-24 h-24 border-2 border-dashed ${colors.accent} rounded flex items-center justify-center mx-auto`}>
                            <PhotoIcon className={`w-12 h-12 ${colors.accent}`} />
                          </div>
                        )}
                        <p className={`text-xs ${colors.accent} mt-2`}>{logoImage ? '' : 'Upload logo above'}</p>
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
