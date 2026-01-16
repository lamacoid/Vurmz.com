'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
import {
  StepIndicator,
  ProductCard,
  ProductGrid,
  Spinner,
  PulseLoader,
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
    price: 'From $3/pen',
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
    price: 'From $5/card',
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
    value: 'tags-labels',
    label: 'Tags & Labels',
    description: 'Industrial signs and labels',
    price: 'From $8/sign',
    hasDesigner: true,
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
      <span className="text-4xl font-serif text-amber-700">?</span>
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

  // Designer data
  const [cardData, setCardData] = useState<{
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
  } | null>(null)

  const [penData, setPenData] = useState<{
    line1: string
    line2: string
    textStyle: string
    font: string
    logoEnabled: boolean
    logoPlacement: string
    bothSides: boolean
    penColor: string
    pricePerPen: number
  } | null>(null)

  const [labelDesignData, setLabelDesignData] = useState<LabelDesignData | null>(null)
  const [knifeDesignData, setKnifeDesignData] = useState<KnifeDesignData | null>(null)
  const [toolDesignData, setToolDesignData] = useState<ToolDesignData | null>(null)
  const [keychainDesignData, setKeychainDesignData] = useState<KeychainDesignData | null>(null)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardDataChange = useCallback((data: any) => setCardData(data), [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePenDataChange = useCallback((data: any) => setPenData(data), [])
  const handleLabelDesignChange = useCallback((data: LabelDesignData) => setLabelDesignData(data), [])
  const handleKnifeDesignChange = useCallback((data: KnifeDesignData) => setKnifeDesignData(data), [])
  const handleToolDesignChange = useCallback((data: ToolDesignData) => setToolDesignData(data), [])
  const handleKeychainDesignChange = useCallback((data: KeychainDesignData) => setKeychainDesignData(data), [])

  // Calculate order total
  const getOrderTotal = () => {
    const qty = parseInt(quantity, 10)
    if (selectedProduct === 'business-cards' && cardData && !isNaN(qty) && qty > 0) {
      return { productName: 'Metal Business Cards', quantity: qty, pricePerUnit: cardData.pricePerCard, total: qty * cardData.pricePerCard }
    }
    if (selectedProduct === 'pens' && penData && !isNaN(qty) && qty > 0) {
      return { productName: 'Branded Pens', quantity: qty, pricePerUnit: penData.pricePerPen, total: qty * penData.pricePerPen }
    }
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
        if (selectedProduct === 'pens') return penData && penData.line1.trim().length > 0 && parseInt(quantity, 10) > 0
        if (selectedProduct === 'business-cards') return cardData && cardData.name.trim().length > 0 && parseInt(quantity, 10) > 0
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
        const svgBlob = new Blob([generateLabelSVG(labelDesignData)], { type: 'image/svg+xml' })
        submitData.append('designFile', svgBlob, `label-design-${Date.now()}.svg`)
      }
      if (selectedProduct === 'knives' && knifeDesignData) submitData.append('knifeDesignData', JSON.stringify(knifeDesignData))
      if (selectedProduct === 'tools' && toolDesignData) submitData.append('toolDesignData', JSON.stringify(toolDesignData))
      if (selectedProduct === 'keychains' && keychainDesignData) submitData.append('keychainDesignData', JSON.stringify(keychainDesignData))
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
            className="w-20 h-20 bg-vurmz-teal/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckIcon className="w-10 h-10 text-vurmz-teal" />
          </motion.div>
          <h2 className="text-3xl font-bold text-vurmz-dark mb-4">
            Order Received!
          </h2>
          <p className="text-gray-600 mb-8">
            I&apos;ll review your request and get back to you today with confirmation.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-vurmz-teal text-white px-8 py-4 font-semibold hover:bg-vurmz-teal-dark transition-all"
          >
            Return Home
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Progress Header - Premium */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
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
                className="hidden md:flex items-center gap-4 bg-gradient-to-r from-vurmz-dark via-gray-800 to-vurmz-dark text-white px-6 py-3 rounded-2xl shadow-xl"
                style={{
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05) inset',
                }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Order Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-vurmz-teal to-vurmz-teal-light bg-clip-text text-transparent">
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
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-vurmz-dark mb-4 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  What can I make for you?
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-500 max-w-lg mx-auto"
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
                      onClick={() => setSelectedProduct(product.value)}
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
                <h1 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-2">
                  Design Your {selectedProductData?.label}
                </h1>
                <p className="text-gray-500">Customize your order below</p>
              </div>

              {/* Quantity for non-designer products or pens/cards */}
              {(selectedProduct === 'pens' || selectedProduct === 'business-cards' || !selectedProductData?.hasDesigner) && (
                <div className="max-w-xs mx-auto mb-8">
                  <label className="block text-sm font-medium text-vurmz-dark mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="How many?"
                    className="w-full border-2 border-gray-200 px-4 py-3 text-center text-lg font-medium rounded-xl focus:border-vurmz-teal focus:ring-0 outline-none transition-all"
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
                      <label className="block text-sm font-medium text-vurmz-dark mb-2">
                        Describe Your Project
                      </label>
                      <textarea
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What do you want engraved? Include details about size, material, and any specific requirements."
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal focus:ring-0 outline-none transition-all resize-none"
                      />

                      {/* File upload */}
                      <div className="mt-6">
                        <p className="text-sm text-gray-600 mb-3">
                          Have a logo or reference image? Upload it here.
                        </p>
                        <div
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files) }}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                          onDragLeave={() => setIsDragging(false)}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all rounded-xl ${
                            isDragging ? 'border-vurmz-teal bg-vurmz-teal/5' : 'border-gray-300 hover:border-vurmz-teal'
                          }`}
                        >
                          <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">Drop files here or click to browse</p>
                          <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,.svg,.pdf,.webp" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, i) => (
                              <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-vurmz-dark">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
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
                <h1 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-2">
                  Your Details
                </h1>
                <p className="text-gray-500">How can I reach you?</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-vurmz-dark mb-2">Your Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vurmz-dark mb-2">Phone *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Best number to reach you" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vurmz-dark mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-vurmz-dark mb-2">Business Name</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal outline-none transition-all" />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-vurmz-dark mb-2">Type of Business *</label>
                  <select name="businessType" required value={formData.businessType} onChange={handleChange} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-vurmz-teal outline-none transition-all bg-white">
                    <option value="">Select...</option>
                    {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Turnaround */}
                <div>
                  <label className="block text-sm font-medium text-vurmz-dark mb-3">When do you need it?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {turnaroundOptions.map(opt => (
                      <motion.label
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.turnaround === opt.value ? 'border-vurmz-teal bg-vurmz-teal/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input type="radio" name="turnaround" value={opt.value} checked={formData.turnaround === opt.value} onChange={handleChange} className="sr-only" />
                        <span className="font-semibold text-vurmz-dark">{opt.label}</span>
                        <span className="text-sm text-vurmz-teal">{opt.sublabel}</span>
                        <span className="text-xs text-gray-500">{opt.note}</span>
                        {formData.turnaround === opt.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-vurmz-teal rounded-full flex items-center justify-center">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <label className="block text-sm font-medium text-vurmz-dark mb-3">Pickup or Delivery?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {deliveryOptions.map(opt => (
                      <motion.label
                        key={opt.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.deliveryMethod === opt.value ? 'border-vurmz-teal bg-vurmz-teal/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input type="radio" name="deliveryMethod" value={opt.value} checked={formData.deliveryMethod === opt.value} onChange={handleChange} className="sr-only" />
                        <span className="font-semibold text-vurmz-dark">{opt.label}</span>
                        <span className="text-sm text-vurmz-teal">{opt.sublabel}</span>
                        <span className="text-xs text-gray-500">{opt.note}</span>
                        {formData.deliveryMethod === opt.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-vurmz-teal rounded-full flex items-center justify-center">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                      <label className="block text-sm font-medium text-vurmz-dark mb-2">Delivery Address</label>
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
                <h1 className="text-3xl md:text-4xl font-bold text-vurmz-dark mb-2">
                  Review Your Order
                </h1>
                <p className="text-gray-500">Make sure everything looks good</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Order Summary Card */}
                <motion.div
                  className="bg-gradient-to-br from-vurmz-dark via-gray-800 to-vurmz-dark text-white p-8 rounded-2xl shadow-2xl"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-vurmz-teal/20 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-vurmz-teal" />
                    </span>
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product</span>
                      <span className="font-medium">{selectedProductData?.label}</span>
                    </div>

                    {orderTotal && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantity</span>
                          <span className="font-medium">{orderTotal.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price per unit</span>
                          <span className="font-medium">${orderTotal.pricePerUnit.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Total</span>
                            <span className="text-3xl font-bold text-vurmz-teal">${orderTotal.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-400">Turnaround</span>
                      <span className="font-medium">{turnaroundOptions.find(t => t.value === formData.turnaround)?.label}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery</span>
                      <span className="font-medium">{deliveryOptions.find(d => d.value === formData.deliveryMethod)?.label}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Info Summary */}
                <motion.div
                  className="bg-white border border-gray-200 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-semibold text-vurmz-dark mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.name}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                    {formData.email && <div><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.email}</span></div>}
                    {formData.businessName && <div><span className="text-gray-500">Business:</span> <span className="font-medium">{formData.businessName}</span></div>}
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
      <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <motion.button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              whileHover={currentStep > 0 ? { x: -4 } : undefined}
              whileTap={currentStep > 0 ? { scale: 0.95 } : undefined}
              className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-vurmz-dark hover:bg-gray-100'
              }`}
            >
              <ArrowLeftIcon className={`w-5 h-5 transition-transform ${currentStep > 0 ? 'group-hover:-translate-x-1' : ''}`} />
              <span>Back</span>
            </motion.button>

            {/* Progress indicator - mobile */}
            <div className="md:hidden text-sm text-gray-500">
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
                className={`group relative flex items-center gap-3 px-8 py-4 font-semibold rounded-2xl transition-all overflow-hidden ${
                  canProceed()
                    ? 'text-white shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={canProceed() ? {
                  background: 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                  boxShadow: '0 8px 32px rgba(106,140,140,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset',
                } : undefined}
              >
                {/* Shine effect */}
                {canProceed() && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                )}
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
                className="group relative flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-2xl shadow-xl overflow-hidden"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #8A9C9C 0%, #7A8A8A 100%)'
                    : 'linear-gradient(135deg, #6A8C8C 0%, #5A7A7A 100%)',
                  boxShadow: '0 8px 32px rgba(106,140,140,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset',
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
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
