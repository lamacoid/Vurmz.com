'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'

/*
 * Metal Business Card Visualizer
 *
 * Realistic preview of a metal business card.
 * Features:
 * - True-to-size preview (3.5" x 2" aspect ratio)
 * - Metal texture simulation (brushed/polished)
 * - QR code integration
 * - Logo placement preview
 * - Multiple finish options
 */

interface CardVisualizerProps {
  text?: string
  text2?: string
  text3?: string
  logoUrl?: string
  qrValue?: string
  finish?: 'brushed' | 'polished' | 'matte'
  material?: 'stainless' | 'aluminum-black' | 'aluminum-gold' | 'copper'
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const materialStyles = {
  stainless: {
    background: 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 25%, #E5E5E5 50%, #C8C8C8 75%, #E0E0E0 100%)',
    engraving: '#505050',
    border: '#B0B0B0',
  },
  'aluminum-black': {
    background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 50%, #252525 100%)',
    engraving: '#909090',
    border: '#404040',
  },
  'aluminum-gold': {
    background: 'linear-gradient(135deg, #D4AF37 0%, #C9A227 25%, #D9B43A 50%, #C19A22 75%, #D4AF37 100%)',
    engraving: '#5A4A20',
    border: '#8A7020',
  },
  copper: {
    background: 'linear-gradient(135deg, #C87533 0%, #B87333 25%, #D4853D 50%, #A66328 75%, #C87533 100%)',
    engraving: '#4A2810',
    border: '#8A5020',
  },
}

const finishOverlays = {
  brushed: `
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 1px,
      rgba(255,255,255,0.03) 1px,
      rgba(255,255,255,0.03) 2px
    )
  `,
  polished: `
    linear-gradient(
      135deg,
      rgba(255,255,255,0.2) 0%,
      transparent 30%,
      transparent 70%,
      rgba(255,255,255,0.1) 100%
    )
  `,
  matte: 'none',
}

export default function CardVisualizer({
  text = '',
  text2 = '',
  text3 = '',
  logoUrl,
  qrValue,
  finish = 'brushed',
  material = 'stainless',
  orientation = 'horizontal',
  className = '',
}: CardVisualizerProps) {
  const [imageError, setImageError] = useState(false)
  const style = materialStyles[material]

  // Card dimensions (3.5" x 2" ratio)
  const width = orientation === 'horizontal' ? 350 : 200
  const height = orientation === 'horizontal' ? 200 : 350

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, rotateY: -10 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="relative rounded-lg overflow-hidden"
        style={{
          width,
          height,
          background: style.background,
          boxShadow: `
            0 10px 30px rgba(0,0,0,0.15),
            0 5px 15px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
          border: `1px solid ${style.border}`,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          rotateY: 5,
          rotateX: -2,
          boxShadow: `
            0 15px 40px rgba(0,0,0,0.2),
            0 8px 20px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Finish overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: finishOverlays[finish] }}
        />

        {/* Corner cut (realistic metal card detail) */}
        <div
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${style.border} 50%)`,
            opacity: 0.3,
          }}
        />

        {/* Content container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top section - Logo or main text */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {text && (
                <div
                  className="text-lg font-semibold tracking-wide"
                  style={{ color: style.engraving }}
                >
                  {text}
                </div>
              )}
              {text2 && (
                <div
                  className="text-sm mt-1"
                  style={{ color: style.engraving, opacity: 0.8 }}
                >
                  {text2}
                </div>
              )}
            </div>

            {/* Logo */}
            {logoUrl && !imageError && (
              <div className="w-16 h-16 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  style={{ filter: 'grayscale(100%) contrast(1.2)' }}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </div>

          {/* Bottom section - Contact info and QR */}
          <div className="flex justify-between items-end">
            <div>
              {text3 && (
                <div
                  className="text-xs"
                  style={{ color: style.engraving, opacity: 0.7 }}
                >
                  {text3}
                </div>
              )}
            </div>

            {/* QR Code */}
            {qrValue && (
              <div
                className="p-1 rounded"
                style={{ background: 'rgba(255,255,255,0.9)' }}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={50}
                  level="M"
                  bgColor="transparent"
                  fgColor="#1A1A1A"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subtle edge highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        />
      </motion.div>

      {/* Size indicator */}
      <div className="text-center mt-3 text-xs text-[var(--color-muted)]">
        3.5&quot; × 2&quot; • {material.replace('-', ' ')} • {finish}
      </div>
    </motion.div>
  )
}

/*
 * Material selector for card visualizer
 */
interface MaterialSelectorProps {
  value: CardVisualizerProps['material']
  onChange: (material: CardVisualizerProps['material']) => void
}

export function CardMaterialSelector({ value, onChange }: MaterialSelectorProps) {
  const materials: Array<{
    id: CardVisualizerProps['material']
    label: string
    preview: string
  }> = [
    {
      id: 'stainless',
      label: 'Stainless Steel',
      preview: 'linear-gradient(135deg, #E0E0E0, #C0C0C0)',
    },
    {
      id: 'aluminum-black',
      label: 'Black Aluminum',
      preview: 'linear-gradient(135deg, #2A2A2A, #1A1A1A)',
    },
    {
      id: 'aluminum-gold',
      label: 'Gold Aluminum',
      preview: 'linear-gradient(135deg, #D4AF37, #C9A227)',
    },
    {
      id: 'copper',
      label: 'Copper',
      preview: 'linear-gradient(135deg, #C87533, #B87333)',
    },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {materials.map((mat) => (
        <motion.button
          key={mat.id}
          type="button"
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            border-2 transition-all flex items-center gap-2
            ${value === mat.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
              : 'border-[rgba(106,140,140,0.15)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(mat.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="w-4 h-4 rounded"
            style={{ background: mat.preview }}
          />
          <span className="text-[var(--color-dark)]">{mat.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

/*
 * Finish selector for card visualizer
 */
interface FinishSelectorProps {
  value: CardVisualizerProps['finish']
  onChange: (finish: CardVisualizerProps['finish']) => void
}

export function CardFinishSelector({ value, onChange }: FinishSelectorProps) {
  const finishes: Array<{
    id: CardVisualizerProps['finish']
    label: string
  }> = [
    { id: 'brushed', label: 'Brushed' },
    { id: 'polished', label: 'Polished' },
    { id: 'matte', label: 'Matte' },
  ]

  return (
    <div className="flex gap-2">
      {finishes.map((fin) => (
        <motion.button
          key={fin.id}
          type="button"
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            border-2 transition-all
            ${value === fin.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)] text-[var(--color-primary)]'
              : 'border-[rgba(106,140,140,0.15)] text-[var(--color-medium)] hover:border-[rgba(106,140,140,0.3)]'
            }
          `}
          onClick={() => onChange(fin.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {fin.label}
        </motion.button>
      ))}
    </div>
  )
}
