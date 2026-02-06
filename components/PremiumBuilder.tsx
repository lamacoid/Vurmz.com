'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import MetalBusinessCardPreview from '@/components/MetalBusinessCardPreview'
import BrandedPenPreview from '@/components/BrandedPenPreview'
import LabelDesigner, { LabelDesignData, generateLabelDescription, generateLabelSVG } from '@/components/LabelDesigner'
import KnifeDesigner, { KnifeDesignData } from '@/components/KnifeDesigner'
import ToolDesigner, { ToolDesignData } from '@/components/ToolDesigner'
import KeychainDesigner, { KeychainDesignData } from '@/components/KeychainDesigner'
import NameplateDesigner, { NameplateData } from '@/components/NameplateDesigner'
import CoasterDesigner, { CoasterData } from '@/components/CoasterDesigner'
import { PACK_CONFIG, getPackPrice } from '@/lib/pack-config'

// Type definitions for designer data
interface CardData {
  name: string
  title: string
  business: string
  phone: string
  email: string
  website: string
  qrEnabled: boolean
  qrValue: string
  logoEnabled: boolean
  backSideEnabled: boolean
  backSideOption: string
  backSideText: string
  cardColor: string
  layout: string
  pricePerCard: number
}

interface PenData {
  line1: string
  line2: string
  textStyle: string
  font: string
  logoEnabled: boolean
  logoPlacement: string
  bothSides: boolean
  penColor: string
  pricePerPen: number
}
import {
  StepIndicator,
  ProductCard,
  ProductGrid,
  Spinner,
} from '@/components/builder'

// Step definitions
const STEPS = [
  { id: 'product', label: 'Choose Product' },
  { id: 'design', label: 'Design' },
  { id: 'details', label: 'Your Details' },
  { id: 'review', label: 'Review' },
]

// Product definitions with premium icons
const products = [
  {
    value: 'pens',
    label: 'Branded Pens',
    description: 'Metal stylus pens with your logo',
    price: 'Pack of 15 from $45',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 48 24" className="w-16 h-8">
        <polygon points="0,12 8,8 8,16" fill="url(#chrome-pen-premium)" />
        <rect x="8" y="9" width="1.5" height="6" fill="#e0e0e0" />
        <rect x="10" y="9" width="1.5" height="6" fill="#e0e0e0" />
        <rect x="12" y="8" width="28" height="8" rx="1" fill="#1a1a1a" />
        <rect x="40" y="9" width="2" height="6" fill="#c0c0c0" />
        <ellipse cx="45" cy="12" rx="3" ry="3" fill="#333" />
        <defs>
          <linearGradient id="chrome-pen-premium" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f0f0" />
            <stop offset="50%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#909090" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    value: 'business-cards',
    label: 'Metal Business Cards',
    description: 'Premium anodized aluminum cards',
    price: 'Pack of 15 from $75',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 40 28" className="w-14 h-10">
        <rect x="2" y="2" width="36" height="24" rx="2" fill="#1a1a1a" />
        <rect x="2" y="2" width="36" height="6" fill="rgba(255,255,255,0.1)" rx="2" />
        <rect x="6" y="10" width="16" height="2" fill="#666" rx="1" />
        <rect x="6" y="14" width="12" height="1.5" fill="#555" rx="0.5" />
        <rect x="28" y="16" width="6" height="6" fill="#444" rx="1" />
      </svg>
    ),
  },
  {
    value: 'nameplates',
    label: 'Name Plates',
    description: 'Desk & door name plates',
    price: 'Pack of 5 from $40',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 48 16" className="w-16 h-6">
        <rect x="0" y="0" width="48" height="16" rx="1" fill="#1a1a1a" />
        <rect x="2" y="2" width="44" height="12" rx="0.5" fill="none" stroke="#c0c0c0" strokeWidth="0.5" opacity="0.3" />
        <text x="24" y="10" textAnchor="middle" fill="#c0c0c0" fontSize="6" fontFamily="Arial">JOHN SMITH</text>
      </svg>
    ),
  },
  {
    value: 'coasters',
    label: 'Custom Coasters',
    description: 'Wood, slate, or stainless steel',
    price: 'Pack of 15 from $60',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <circle cx="16" cy="16" r="14" fill="#8B5A2B" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#3d2817" strokeWidth="0.5" opacity="0.5" />
        <text x="16" y="18" textAnchor="middle" fill="#3d2817" fontSize="8" fontWeight="bold">ABC</text>
      </svg>
    ),
  },
  {
    value: 'tags-labels',
    label: 'Industrial Labels',
    description: 'Nameplates, panel labels, valve tags, safety signage',
    price: 'Quote per job',
    hasDesigner: false,
    isIndustrial: true,
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <path d="M4 8 L20 8 L28 16 L20 24 L4 24 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <circle cx="10" cy="16" r="3" fill="#444" stroke="#333" strokeWidth="1" />
        <rect x="15" y="13" width="8" height="2" fill="#666" rx="1" />
        <rect x="15" y="17" width="6" height="1.5" fill="#555" rx="0.5" />
      </svg>
    ),
  },
  {
    value: 'knives',
    label: 'Knife Engraving',
    description: 'Chef & pocket knives',
    price: 'From $15/knife',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 48 24" className="w-16 h-8">
        <path d="M2 12 L28 6 L28 12 L2 12 Z" fill="#c0c0c0" stroke="#999" strokeWidth="0.5" />
        <line x1="2" y1="12" x2="28" y2="12" stroke="#888" strokeWidth="1" />
        <rect x="28" y="8" width="16" height="8" rx="1" fill="#4a3728" />
        <rect x="27" y="7" width="2" height="10" fill="#c0c0c0" rx="0.5" />
      </svg>
    ),
  },
  {
    value: 'tools',
    label: 'Tool Marking',
    description: 'Power tools & equipment',
    price: 'From $4/item',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <path d="M4 6 L12 6 L14 10 L14 14 L12 18 L4 18 L2 14 L2 10 Z" fill="#666" stroke="#555" strokeWidth="1" />
        <rect x="4" y="10" width="4" height="4" fill="#1a1a1a" />
        <rect x="14" y="10" width="14" height="4" rx="1" fill="#666" />
      </svg>
    ),
  },
  {
    value: 'keychains',
    label: 'Keychains',
    description: 'Custom branded keychains',
    price: 'From $4/unit',
    hasDesigner: true,
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <circle cx="8" cy="10" r="6" fill="none" stroke="#c0c0c0" strokeWidth="2" />
        <rect x="14" y="6" width="14" height="10" rx="2" fill="#1a1a1a" />
        <circle cx="17" cy="11" r="1.5" fill="#444" />
        <rect x="20" y="9" width="6" height="1.5" fill="#666" rx="0.5" />
      </svg>
    ),
  },
  {
    value: 'other',
    label: 'Something Else',
    description: 'Custom projects welcome',
    price: 'Quote based',
    hasDesigner: false,
    icon: (
      <span className="text-4xl font-serif" style={{ color: '#A89070' }}>?</span>
    ),
    isCustom: true,
  },
]

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant / Culinary' },
  { value: 'medical', label: 'Medical / Dental Practice' },
  { value: 'trades', label: 'Tradesperson / Contractor' },
  { value: 'general', label: 'Other Small Business' },
  { value: 'personal', label: 'Personal / Gift' },
]

const turnaroundOptions = [
  { value: 'rush', label: 'Rush', sublabel: 'Next Day', note: 'Rush fee may apply' },
  { value: 'standard', label: 'Standard', sublabel: '2 Days', note: 'Most common' },
  { value: 'flexible', label: 'Flexible', sublabel: '3-5 Days', note: 'No rush' },
]

const deliveryOptions = [
  { value: 'pickup', label: 'Pickup', sublabel: 'Centennial', note: 'South suburban Denver' },
  { value: 'delivery', label: 'Delivery', sublabel: 'To You', note: 'Free on orders $100+' },
]

interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

// Animation variants with proper typing
type BezierCurve = [number, number, number, number]
const liquidEase: BezierCurve = [0.25, 0.4, 0.25, 1]

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: liquidEase } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
}

export default function PremiumBuilder() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Current step
  const [currentStep, setCurrentStep] = useState(0)

  // Form state
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Product data
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [numPacks, setNumPacks] = useState(1)

  // Designer data
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [penData, setPenData] = useState<PenData | null>(null)

  const [labelDesignData, setLabelDesignData] = useState<LabelDesignData | null>(null)
  const [knifeDesignData, setKnifeDesignData] = useState<KnifeDesignData | null>(null)
  const [toolDesignData, setToolDesignData] = useState<ToolDesignData | null>(null)
  const [keychainDesignData, setKeychainDesignData] = useState<KeychainDesignData | null>(null)
  const [nameplateData, setNameplateData] = useState<NameplateData | null>(null)
  const [coasterData, setCoasterData] = useState<CoasterData | null>(null)

  // Contact & delivery
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    description: '',
    turnaround: 'standard',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    howHeardAboutUs: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCardDataChange = useCallback((data: CardData) => setCardData(data), [])
  const handlePenDataChange = useCallback((data: PenData) => setPenData(data), [])
  const handleLabelDesignChange = useCallback((data: LabelDesignData) => setLabelDesignData(data), [])
  const handleKnifeDesignChange = useCallback((data: KnifeDesignData) => setKnifeDesignData(data), [])
  const handleToolDesignChange = useCallback((data: ToolDesignData) => setToolDesignData(data), [])
  const handleKeychainDesignChange = useCallback((data: KeychainDesignData) => setKeychainDesignData(data), [])
  const handleNameplateChange = useCallback((data: NameplateData) => setNameplateData(data), [])
  const handleCoasterChange = useCallback((data: CoasterData) => setCoasterData(data), [])

  // Calculate order total
  const getOrderTotal = () => {
    // Pack-based products (pens and business cards)
    if (selectedProduct === 'pens' && penData) {
      const config = PACK_CONFIG['pens']
      const totalItems = numPacks * config.itemsPerPack
      const packPrice = getPackPrice('pens', penData.pricePerPen)
      const total = packPrice * numPacks
      return {
        productName: 'Branded Pens',
        quantity: totalItems,
        numPacks,
        itemsPerPack: config.itemsPerPack,
        pricePerUnit: penData.pricePerPen,
        packPrice,
        total
      }
    }
    if (selectedProduct === 'business-cards' && cardData) {
      const config = PACK_CONFIG['business-cards']
      const totalItems = numPacks * config.itemsPerPack
      const packPrice = getPackPrice('business-cards', cardData.pricePerCard)
      const total = packPrice * numPacks
      return {
        productName: 'Metal Business Cards',
        quantity: totalItems,
        numPacks,
        itemsPerPack: config.itemsPerPack,
        pricePerUnit: cardData.pricePerCard,
        packPrice,
        total
      }
    }
    if (selectedProduct === 'nameplates' && nameplateData) {
      const filledNames = nameplateData.names.filter(n => n.line1.trim().length > 0)
      const quantity = filledNames.length || 1
      const total = nameplateData.pricePerPlate * quantity
      return {
        productName: 'Name Plates',
        quantity,
        numPacks: 1,
        itemsPerPack: quantity,
        pricePerUnit: nameplateData.pricePerPlate,
        packPrice: total,
        total
      }
    }
    if (selectedProduct === 'coasters' && coasterData) {
      const config = PACK_CONFIG['coasters']
      const totalItems = numPacks * config.itemsPerPack
      const packPrice = getPackPrice('coasters', coasterData.pricePerCoaster)
      const total = packPrice * numPacks
      return {
        productName: 'Custom Coasters',
        quantity: totalItems,
        numPacks,
        itemsPerPack: config.itemsPerPack,
        pricePerUnit: coasterData.pricePerCoaster,
        packPrice,
        total
      }
    }
    // Non-pack products
    if (selectedProduct === 'tags-labels' && labelDesignData) {
      return { productName: 'Custom Labels/Signs', quantity: labelDesignData.quantity, pricePerUnit: labelDesignData.pricePerUnit, total: labelDesignData.totalPrice }
    }
    if (selectedProduct === 'knives' && knifeDesignData) {
      return { productName: `${knifeDesignData.knifeType === 'pocket' ? 'Pocket' : 'Chef'} Knife Engraving`, quantity: knifeDesignData.quantity, pricePerUnit: knifeDesignData.pricePerUnit, total: knifeDesignData.totalPrice }
    }
    if (selectedProduct === 'tools' && toolDesignData && toolDesignData.markingShape !== 'custom') {
      return { productName: 'Tool Marking', quantity: toolDesignData.quantity, pricePerUnit: toolDesignData.pricePerUnit, total: toolDesignData.totalPrice }
    }
    if (selectedProduct === 'keychains' && keychainDesignData) {
      return { productName: 'Custom Keychains', quantity: keychainDesignData.quantity, pricePerUnit: keychainDesignData.pricePerUnit, total: keychainDesignData.totalPrice }
    }
    return null
  }

  const orderTotal = getOrderTotal()
  const selectedProductData = products.find(p => p.value === selectedProduct)

  // File handling
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const validFiles: UploadedFile[] = []
    const maxSize = 10 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'image/webp']

    Array.from(files).forEach(file => {
      if (file.size > maxSize) { setError(`${file.name} is too large (max 10MB)`); return }
      if (!allowedTypes.includes(file.type)) { setError(`${file.name} is not supported`); return }
      validFiles.push({ name: file.name, size: file.size, type: file.type, file })
    })

    if (uploadedFiles.length + validFiles.length > 5) { setError('Maximum 5 files'); return }
    setUploadedFiles(prev => [...prev, ...validFiles])
    setError('')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Navigation
  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedProduct !== ''
      case 1:
        if (!selectedProductData?.hasDesigner) return formData.description.trim().length > 0
        if (selectedProduct === 'pens') return penData && penData.line1.trim().length > 0 && numPacks >= 1
        if (selectedProduct === 'business-cards') return cardData && cardData.name.trim().length > 0 && numPacks >= 1
        if (selectedProduct === 'nameplates') return nameplateData && nameplateData.names.some(n => n.line1.trim().length > 0)
        if (selectedProduct === 'coasters') return coasterData && (coasterData.text.trim().length > 0 || coasterData.logoEnabled) && numPacks >= 1
        if (selectedProduct === 'tags-labels') return labelDesignData && labelDesignData.text.trim().length > 0
        if (selectedProduct === 'knives') return knifeDesignData && (knifeDesignData.bladeText.trim().length > 0 || knifeDesignData.handleText.trim().length > 0)
        if (selectedProduct === 'tools') return toolDesignData && toolDesignData.text.trim().length > 0
        if (selectedProduct === 'keychains') return keychainDesignData && keychainDesignData.text.trim().length > 0
        return true
      case 2: return formData.name.trim() && formData.phone.trim() && formData.businessType
      default: return true
    }
  }

  const nextStep = () => {
    // Redirect to industrial builder for industrial products
    if (currentStep === 0 && selectedProduct === 'tags-labels') {
      router.push('/order/industrial')
      return
    }
    if (canProceed() && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const submitData = new FormData()
      Object.entries({ ...formData, productType: selectedProduct, quantity }).forEach(([k, v]) => submitData.append(k, v))
      uploadedFiles.forEach(f => submitData.append('files', f.file))

      if (selectedProduct === 'business-cards' && cardData) submitData.append('cardData', JSON.stringify(cardData))
      if (selectedProduct === 'pens' && penData) submitData.append('penData', JSON.stringify(penData))
      if (selectedProduct === 'tags-labels' && labelDesignData) {
        submitData.append('labelDesignData', JSON.stringify(labelDesignData))
        submitData.append('labelDescription', generateLabelDescription(labelDesignData))
        const svgBlob = new Blob([generateLabelSVG()], { type: 'image/svg+xml' })
        submitData.append('designFile', svgBlob, `label-design-${Date.now()}.svg`)
      }
      if (selectedProduct === 'knives' && knifeDesignData) submitData.append('knifeDesignData', JSON.stringify(knifeDesignData))
      if (selectedProduct === 'tools' && toolDesignData) submitData.append('toolDesignData', JSON.stringify(toolDesignData))
      if (selectedProduct === 'keychains' && keychainDesignData) submitData.append('keychainDesignData', JSON.stringify(keychainDesignData))
      if (selectedProduct === 'nameplates' && nameplateData) submitData.append('nameplateData', JSON.stringify(nameplateData))
      if (selectedProduct === 'coasters' && coasterData) submitData.append('coasterData', JSON.stringify(coasterData))
      if (orderTotal) {
        submitData.append('calculatedPrice', orderTotal.total.toString())
        submitData.append('isOrder', 'true')
      }

      const response = await fetch('/api/quotes', { method: 'POST', body: submitData })
      if (!response.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or text (719) 257-3834.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(126, 184, 201, 0.2)' }}
          >
            <CheckIcon className="w-10 h-10" style={{ color: '#7EB8C9' }} />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#5C4A3A' }}>
            Order Received!
          </h2>
          <p className="mb-8" style={{ color: '#6B5A48' }}>
            I&apos;ll review your request and get back to you today with confirmation.
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-white px-8 py-4 font-semibold transition-all"
            style={{ backgroundColor: '#7EB8C9' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A9BB0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7EB8C9'}
          >
            Return Home
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #FAF7F2, #FFFFFF)' }}>
      {/* Progress Header - Premium */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl" style={{ backgroundColor: 'rgba(250, 247, 242, 0.9)', borderBottom: '1px solid #E0D6C8', boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-8">
            {/* Premium Step Indicator */}
            <div className="flex-1 max-w-2xl">
              <StepIndicator
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={(index) => index < currentStep && setCurrentStep(index)}
                allowNavigation={true}
              />
            </div>

            {/* Order total (if applicable) - Premium */}
            {orderTotal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-4 text-white px-6 py-3 rounded-2xl"
                style={{
                  background: '#3D3428',
                  boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)',
                }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: '#9A8F82' }}>Order Total</span>
                  <span className="text-2xl font-bold" style={{ color: '#7EB8C9' }}>
                    ${orderTotal.total.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection - Premium */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-center mb-14">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                  style={{ color: '#5C4A3A' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  What can I make for you?
                </motion.h1>
                <motion.p
                  className="text-xl max-w-lg mx-auto"
                  style={{ color: '#8B7355' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                >
                  Select a product and I&apos;ll help you design something beautiful
                </motion.p>
              </div>

              <ProductGrid columns={3}>
                {products.map((product) => (
                  <motion.div
                    key={product.value}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <ProductCard
                      title={product.label}
                      description={product.description}
                      price={product.price}
                      icon={product.icon}
                      selected={selectedProduct === product.value}
                      onClick={() => {
                        // Navigate directly to industrial builder for industrial products
                        if (product.isIndustrial) {
                          router.push('/order/industrial')
                          return
                        }
                        setSelectedProduct(product.value)
                      }}
                      badge={product.hasDesigner && !product.isCustom ? 'Designer' : undefined}
                    />
                  </motion.div>
                ))}
              </ProductGrid>
            </motion.div>
          )}

          {/* Step 2: Design */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#5C4A3A' }}>
                  Design Your {selectedProductData?.label}
                </h1>
                <p style={{ color: '#8B7355' }}>Customize your order below</p>
              </div>

              {/* Pack selector for pack-based products */}
              {(selectedProduct === 'pens' || selectedProduct === 'business-cards' || selectedProduct === 'nameplates' || selectedProduct === 'coasters') && (
                <div className="max-w-md mx-auto mb-8">
                  <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(to bottom right, #FAF7F2, #FFFFFF)', border: '2px solid #D4C8B8', boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)' }}>
                    <div className="text-center mb-4">
                      <span className="text-sm font-medium uppercase tracking-wide" style={{ color: '#7EB8C9' }}>
                        Sold in packs of {PACK_CONFIG[selectedProduct as 'pens' | 'business-cards' | 'nameplates' | 'coasters'].itemsPerPack}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-4">
                      <button
                        type="button"
                        onClick={() => setNumPacks(Math.max(1, numPacks - 1))}
                        disabled={numPacks <= 1}
                        className="w-12 h-12 rounded-xl text-white font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        style={{ backgroundColor: '#7EB8C9' }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#5A9BB0')}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7EB8C9'}
                      >
                        -
                      </button>
                      <div className="text-center min-w-[100px]">
                        <div className="text-4xl font-bold" style={{ color: '#5C4A3A' }}>{numPacks}</div>
                        <div className="text-sm" style={{ color: '#8B7355' }}>{numPacks === 1 ? 'pack' : 'packs'}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNumPacks(Math.min(selectedProduct === 'nameplates' ? 20 : 10, numPacks + 1))}
                        disabled={numPacks >= (selectedProduct === 'nameplates' ? 20 : 10)}
                        className="w-12 h-12 rounded-xl text-white font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        style={{ backgroundColor: '#7EB8C9' }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#5A9BB0')}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7EB8C9'}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-center">
                      <div className="text-lg" style={{ color: '#6B5A48' }}>
                        = <span className="font-bold" style={{ color: '#5C4A3A' }}>{numPacks * PACK_CONFIG[selectedProduct as 'pens' | 'business-cards' | 'nameplates' | 'coasters'].itemsPerPack}</span> {
                          selectedProduct === 'pens' ? 'pens' :
                          selectedProduct === 'business-cards' ? 'cards' :
                          selectedProduct === 'nameplates' ? 'plates' : 'coasters'
                        }
                      </div>
                      {orderTotal && (
                        <div className="text-2xl font-bold mt-2" style={{ color: '#7EB8C9' }}>
                          ${orderTotal.total.toFixed(2)}
                        </div>
                      )}
                      {orderTotal && (
                        <div className="text-xs mt-1" style={{ color: '#8B7355' }}>
                          ${orderTotal.pricePerUnit.toFixed(2)} each × {orderTotal.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity for non-designer products */}
              {!selectedProductData?.hasDesigner && (
                <div className="max-w-xs mx-auto mb-8">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="How many?"
                    className="w-full px-4 py-3 text-center text-lg font-medium rounded-xl focus:ring-0 outline-none transition-all"
                    style={{ border: '2px solid #D4C8B8' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'}
                  />
                </div>
              )}

              {/* Product-specific designers */}
              <AnimatePresence mode="wait">
                {selectedProduct === 'business-cards' && (
                  <motion.div key="cards-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <MetalBusinessCardPreview onChange={handleCardDataChange} />
                  </motion.div>
                )}

                {selectedProduct === 'pens' && (
                  <motion.div key="pens-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <BrandedPenPreview onChange={handlePenDataChange} />
                  </motion.div>
                )}

                {selectedProduct === 'nameplates' && (
                  <motion.div key="nameplates-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <NameplateDesigner onChange={handleNameplateChange} />
                  </motion.div>
                )}

                {selectedProduct === 'coasters' && (
                  <motion.div key="coasters-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <CoasterDesigner onChange={handleCoasterChange} />
                  </motion.div>
                )}

                {selectedProduct === 'tags-labels' && (
                  <motion.div key="labels-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <LabelDesigner onChange={handleLabelDesignChange} initialQuantity={1} />
                  </motion.div>
                )}

                {selectedProduct === 'knives' && (
                  <motion.div key="knives-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <KnifeDesigner onChange={handleKnifeDesignChange} />
                  </motion.div>
                )}

                {selectedProduct === 'tools' && (
                  <motion.div key="tools-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <ToolDesigner onChange={handleToolDesignChange} />
                  </motion.div>
                )}

                {selectedProduct === 'keychains' && (
                  <motion.div key="keychains-designer" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <KeychainDesigner onChange={handleKeychainDesignChange} />
                  </motion.div>
                )}

                {/* Non-designer products */}
                {!selectedProductData?.hasDesigner && (
                  <motion.div key="description" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                    <div className="max-w-2xl mx-auto">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>
                        Describe Your Project
                      </label>
                      <textarea
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What do you want engraved? Include details about size, material, and any specific requirements."
                        className="w-full px-4 py-3 rounded-xl focus:ring-0 outline-none transition-all resize-none"
                        style={{ border: '2px solid #D4C8B8' }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'}
                      />

                      {/* File upload */}
                      <div className="mt-6">
                        <p className="text-sm mb-3" style={{ color: '#6B5A48' }}>
                          Have a logo or reference image? Upload it here.
                        </p>
                        <div
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files) }}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                          onDragLeave={() => setIsDragging(false)}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed p-8 text-center cursor-pointer transition-all rounded-xl"
                          style={{
                            borderColor: isDragging ? '#7EB8C9' : '#D4C8B8',
                            backgroundColor: isDragging ? 'rgba(126, 184, 201, 0.05)' : 'transparent'
                          }}
                        >
                          <CloudArrowUpIcon className="h-10 w-10 mx-auto mb-3" style={{ color: '#9A8F82' }} />
                          <p style={{ color: '#6B5A48' }}>Drop files here or click to browse</p>
                          <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,.svg,.pdf,.webp" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, i) => (
                              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: '#F5F0E8' }}>
                                <div className="flex items-center gap-3">
                                  <DocumentIcon className="h-5 w-5" style={{ color: '#9A8F82' }} />
                                  <div>
                                    <p className="text-sm font-medium" style={{ color: '#5C4A3A' }}>{file.name}</p>
                                    <p className="text-xs" style={{ color: '#8B7355' }}>{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500" style={{ color: '#9A8F82' }}>
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#5C4A3A' }}>
                  Your Details
                </h1>
                <p style={{ color: '#8B7355' }}>How can I reach you?</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Your Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none transition-all" style={{ border: '2px solid #D4C8B8' }} onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'} onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Phone *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Best number to reach you" className="w-full px-4 py-3 rounded-xl outline-none transition-all" style={{ border: '2px solid #D4C8B8' }} onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'} onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none transition-all" style={{ border: '2px solid #D4C8B8' }} onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'} onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none transition-all" style={{ border: '2px solid #D4C8B8' }} onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'} onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'} />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Type of Business *</label>
                  <select name="businessType" required value={formData.businessType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-white" style={{ border: '2px solid #D4C8B8' }} onFocus={(e) => e.currentTarget.style.borderColor = '#7EB8C9'} onBlur={(e) => e.currentTarget.style.borderColor = '#D4C8B8'}>
                    <option value="">Select...</option>
                    {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Turnaround */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#5C4A3A' }}>When do you need it?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {turnaroundOptions.map(opt => (
                      <motion.label
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                        style={{
                          borderColor: formData.turnaround === opt.value ? '#7EB8C9' : '#D4C8B8',
                          backgroundColor: formData.turnaround === opt.value ? 'rgba(126, 184, 201, 0.05)' : 'transparent'
                        }}
                      >
                        <input type="radio" name="turnaround" value={opt.value} checked={formData.turnaround === opt.value} onChange={handleChange} className="sr-only" />
                        <span className="font-semibold" style={{ color: '#5C4A3A' }}>{opt.label}</span>
                        <span className="text-sm" style={{ color: '#7EB8C9' }}>{opt.sublabel}</span>
                        <span className="text-xs" style={{ color: '#8B7355' }}>{opt.note}</span>
                        {formData.turnaround === opt.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7EB8C9' }}>
                            <CheckIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#5C4A3A' }}>Pickup or Delivery?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {deliveryOptions.map(opt => (
                      <motion.label
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                        style={{
                          borderColor: formData.deliveryMethod === opt.value ? '#7EB8C9' : '#D4C8B8',
                          backgroundColor: formData.deliveryMethod === opt.value ? 'rgba(126, 184, 201, 0.05)' : 'transparent'
                        }}
                      >
                        <input type="radio" name="deliveryMethod" value={opt.value} checked={formData.deliveryMethod === opt.value} onChange={handleChange} className="sr-only" />
                        <span className="font-semibold" style={{ color: '#5C4A3A' }}>{opt.label}</span>
                        <span className="text-sm" style={{ color: '#7EB8C9' }}>{opt.sublabel}</span>
                        <span className="text-xs" style={{ color: '#8B7355' }}>{opt.note}</span>
                        {formData.deliveryMethod === opt.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7EB8C9' }}>
                            <CheckIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3A' }}>Delivery Address</label>
                      <AddressAutocomplete
                        value={formData.deliveryAddress}
                        onChange={(addr) => setFormData(prev => ({ ...prev, deliveryAddress: addr }))}
                        placeholder="Start typing your address..."
                        required
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#5C4A3A' }}>
                  Review Your Order
                </h1>
                <p style={{ color: '#8B7355' }}>Make sure everything looks good</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Order Summary Card */}
                <motion.div
                  className="text-white p-8 rounded-2xl"
                  style={{ backgroundColor: '#3D3428', boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)' }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(126, 184, 201, 0.2)' }}>
                      <CheckIcon className="w-4 h-4" style={{ color: '#7EB8C9' }} />
                    </span>
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span style={{ color: '#9A8F82' }}>Product</span>
                      <span className="font-medium">{selectedProductData?.label}</span>
                    </div>

                    {orderTotal && (
                      <>
                        {'numPacks' in orderTotal && 'packPrice' in orderTotal ? (
                          <>
                            <div className="flex justify-between">
                              <span style={{ color: '#9A8F82' }}>Packs</span>
                              <span className="font-medium">{(orderTotal as { numPacks: number; itemsPerPack: number }).numPacks} × {(orderTotal as { numPacks: number; itemsPerPack: number }).itemsPerPack} = {orderTotal.quantity} {selectedProduct === 'pens' ? 'pens' : 'cards'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: '#9A8F82' }}>Price per {selectedProduct === 'pens' ? 'pen' : 'card'}</span>
                              <span className="font-medium">${orderTotal.pricePerUnit.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: '#9A8F82' }}>Pack price</span>
                              <span className="font-medium">${(orderTotal as { packPrice: number }).packPrice.toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span style={{ color: '#9A8F82' }}>Quantity</span>
                              <span className="font-medium">{orderTotal.quantity} units</span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{ color: '#9A8F82' }}>Price per unit</span>
                              <span className="font-medium">${orderTotal.pricePerUnit.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="pt-4 mt-4" style={{ borderTop: '1px solid #5C4A3A' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Total</span>
                            <span className="text-3xl font-bold" style={{ color: '#7EB8C9' }}>${orderTotal.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between">
                      <span style={{ color: '#9A8F82' }}>Turnaround</span>
                      <span className="font-medium">{turnaroundOptions.find(t => t.value === formData.turnaround)?.label}</span>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: '#9A8F82' }}>Delivery</span>
                      <span className="font-medium">{deliveryOptions.find(d => d.value === formData.deliveryMethod)?.label}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Info Summary */}
                <motion.div
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: '#FAF7F2', border: '1px solid #E0D6C8', boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-semibold mb-4" style={{ color: '#5C4A3A' }}>Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span style={{ color: '#8B7355' }}>Name:</span> <span className="font-medium" style={{ color: '#5C4A3A' }}>{formData.name}</span></div>
                    <div><span style={{ color: '#8B7355' }}>Phone:</span> <span className="font-medium" style={{ color: '#5C4A3A' }}>{formData.phone}</span></div>
                    {formData.email && <div><span style={{ color: '#8B7355' }}>Email:</span> <span className="font-medium" style={{ color: '#5C4A3A' }}>{formData.email}</span></div>}
                    {formData.businessName && <div><span style={{ color: '#8B7355' }}>Business:</span> <span className="font-medium" style={{ color: '#5C4A3A' }}>{formData.businessName}</span></div>}
                  </div>
                </motion.div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">{error}</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - Premium */}
      <div className="sticky bottom-0 z-40 backdrop-blur-2xl" style={{ backgroundColor: 'rgba(250, 247, 242, 0.9)', borderTop: '1px solid #E0D6C8' }}>
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <motion.button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              whileHover={currentStep > 0 ? { x: -4 } : undefined}
              whileTap={currentStep > 0 ? { scale: 0.95 } : undefined}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all"
              style={{
                color: currentStep === 0 ? '#D4C8B8' : '#6B5A48',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeftIcon className={`w-5 h-5 transition-transform ${currentStep > 0 ? 'group-hover:-translate-x-1' : ''}`} />
              <span>Back</span>
            </motion.button>

            {/* Progress indicator - mobile */}
            <div className="md:hidden text-sm" style={{ color: '#8B7355' }}>
              Step {currentStep + 1} of {STEPS.length}
            </div>

            {/* Continue/Submit Button */}
            {currentStep < STEPS.length - 1 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                whileHover={canProceed() ? { scale: 1.02, y: -2 } : undefined}
                whileTap={canProceed() ? { scale: 0.98 } : undefined}
                className="group relative flex items-center gap-3 px-8 py-4 font-semibold rounded-2xl transition-all overflow-hidden"
                style={canProceed() ? {
                  backgroundColor: '#7EB8C9',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)',
                } : {
                  backgroundColor: '#E0D6C8',
                  color: '#9A8F82',
                  cursor: 'not-allowed'
                }}
              >
                <span className="relative">Continue</span>
                <ArrowRightIcon className={`relative w-5 h-5 transition-transform ${canProceed() ? 'group-hover:translate-x-1' : ''}`} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : undefined}
                whileTap={!loading ? { scale: 0.98 } : undefined}
                className="group relative flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: loading ? '#A8C8D0' : '#7EB8C9',
                  boxShadow: '0 2px 8px rgba(139, 115, 85, 0.06)',
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">
                      {orderTotal ? `Submit Order — $${orderTotal.total.toFixed(2)}` : 'Submit Quote Request'}
                    </span>
                    <CheckIcon className="relative w-5 h-5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
