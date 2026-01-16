'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import MetalBusinessCardPreview from '@/components/MetalBusinessCardPreview'
import BrandedPenPreview from '@/components/BrandedPenPreview'
import LabelDesigner, { LabelDesignData, generateLabelDescription, generateLabelSVG } from '@/components/LabelDesigner'
import KnifeDesigner, { KnifeDesignData } from '@/components/KnifeDesigner'
import ProductSelector from '@/components/ProductSelector'
import PackSelector from '@/components/PackSelector'
import { motionVariants } from '@/lib/builder-tokens'
import { PACK_CONFIG, calculatePackTotal, getPackQuantityLabel, type ProductType as PackProductType } from '@/lib/pack-config'

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant / Culinary' },
  { value: 'medical', label: 'Medical / Dental Practice' },
  { value: 'trades', label: 'Tradesperson / Contractor' },
  { value: 'general', label: 'Other Small Business' },
  { value: 'personal', label: 'Personal / Gift' },
]

const productTypes = [
  { value: 'pens', label: 'Branded Pens' },
  { value: 'business-cards', label: 'Metal Business Cards' },
  { value: 'tags-labels', label: 'Tags, Labels & Nametags' },
  { value: 'knives', label: 'Knife Engraving' },
  { value: 'tools', label: 'Tool Marking' },
  { value: 'keychains', label: 'Keychains' },
  { value: 'keys', label: 'Key Marking' },
  { value: 'other', label: 'Something Else' },
]

const turnaroundOptions = [
  { value: 'rush', label: 'Rush (Next Day)', description: 'Rush fee may apply' },
  { value: 'standard', label: 'Standard (2 Days)', description: 'Most common' },
  { value: 'flexible', label: 'Flexible (3-5 days)', description: 'No rush, whenever works' },
]

const deliveryOptions = [
  { value: 'pickup', label: 'I will pick up in Centennial', description: 'South suburban Denver' },
  { value: 'delivery', label: 'Deliver to me', description: 'Free on orders $100+' },
  { value: 'discuss', label: 'Let us discuss', description: 'Not sure yet' },
]

const howHeardOptions = [
  'Google Search',
  'Google Maps',
  'Referral from another business',
  'Saw your work somewhere',
  'Previous customer',
  'Social Media',
  'Other',
]

interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

export default function QuoteForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [wasOrder, setWasOrder] = useState(false)
  const [orderInfo, setOrderInfo] = useState<{
    orderNumber: string
    paymentUrl: string
    total: number
  } | null>(null)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
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

  // Pack-based pricing state
  const [packData, setPackData] = useState<{
    productType: PackProductType
    numPacks: number
  } | null>(null)

  const handlePackChange = useCallback((productType: PackProductType, numPacks: number) => {
    setPackData({ productType, numPacks })
    // Auto-update quantity based on packs
    const config = PACK_CONFIG[productType]
    setFormData(prev => ({ ...prev, quantity: String(numPacks * config.itemsPerPack) }))
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    productType: '',
    quantity: '',
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
  const handleCardDataChange = useCallback((data: any) => {
    setCardData(data)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePenDataChange = useCallback((data: any) => {
    setPenData(data)
  }, [])

  const handleLabelDesignChange = useCallback((data: LabelDesignData) => {
    setLabelDesignData(data)
  }, [])

  const handleKnifeDesignChange = useCallback((data: KnifeDesignData) => {
    setKnifeDesignData(data)
  }, [])

  // Calculate order total for products with known pricing
  const getOrderTotal = () => {
    const quantity = parseInt(formData.quantity, 10)
    if (isNaN(quantity) || quantity <= 0) return null

    // Metal business cards
    if (formData.productType === 'business-cards' && cardData) {
      return {
        productName: 'Metal Business Cards',
        quantity,
        pricePerUnit: cardData.pricePerCard,
        total: quantity * cardData.pricePerCard
      }
    }

    // Branded pens - now uses pack-based pricing
    if (formData.productType === 'pens' && packData && packData.productType === 'pens') {
      const config = PACK_CONFIG.pens
      const total = calculatePackTotal('pens', packData.numPacks)
      return {
        productName: 'Branded Pens',
        quantity: packData.numPacks * config.itemsPerPack,
        pricePerUnit: config.basePrice / config.itemsPerPack,
        total,
        packInfo: getPackQuantityLabel('pens', packData.numPacks)
      }
    }

    // Labels & Signs (from LabelDesigner)
    if (formData.productType === 'tags-labels' && labelDesignData) {
      return {
        productName: 'Custom Labels/Signs',
        quantity: labelDesignData.quantity,
        pricePerUnit: labelDesignData.pricePerUnit,
        total: labelDesignData.totalPrice
      }
    }

    // Knife engraving
    if (formData.productType === 'knives' && knifeDesignData) {
      return {
        productName: `${knifeDesignData.knifeType === 'pocket' ? 'Pocket' : 'Chef'} Knife Engraving`,
        quantity: knifeDesignData.quantity,
        pricePerUnit: knifeDesignData.pricePerUnit,
        total: knifeDesignData.totalPrice
      }
    }

    return null
  }

  const orderTotal = getOrderTotal()
  const isOrderWithPrice = orderTotal !== null

  // Products that have designers and require pricing
  const productsRequiringPrice = ['pens', 'business-cards', 'tags-labels', 'knives']
  const requiresPricing = productsRequiringPrice.includes(formData.productType)

  // Check if designer content is filled in (at minimum, the text/name to engrave)
  const hasDesignerContent = () => {
    if (formData.productType === 'pens' && penData) {
      return penData.line1.trim().length > 0
    }
    if (formData.productType === 'business-cards' && cardData) {
      return cardData.name.trim().length > 0
    }
    if (formData.productType === 'tags-labels' && labelDesignData) {
      return labelDesignData.text.trim().length > 0
    }
    if (formData.productType === 'knives' && knifeDesignData) {
      return knifeDesignData.bladeText.trim().length > 0 || knifeDesignData.handleText.trim().length > 0
    }
    return true
  }

  const canSubmit = !requiresPricing || (isOrderWithPrice && hasDesignerContent())

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles: UploadedFile[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'image/webp']

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Maximum file size is 10MB.`)
        return
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not a supported file type. Use JPG, PNG, SVG, or PDF.`)
        return
      }
      validFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      })
    })

    if (uploadedFiles.length + validFiles.length > 5) {
      setError('Maximum 5 files allowed.')
      return
    }

    setUploadedFiles(prev => [...prev, ...validFiles])
    setError('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create FormData for file upload
      const submitData = new FormData()

      // For designer products, provide default description if none given
      const descriptionOrDefault = formData.description.trim() ||
        (['business-cards', 'pens', 'tags-labels', 'knives'].includes(formData.productType)
          ? 'See design specifications below.'
          : formData.description)

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'description') {
          submitData.append(key, descriptionOrDefault)
        } else {
          submitData.append(key, value)
        }
      })
      uploadedFiles.forEach(file => {
        submitData.append('files', file.file)
      })

      // Include card data if business cards selected
      if (formData.productType === 'business-cards' && cardData) {
        submitData.append('cardData', JSON.stringify(cardData))
      }

      // Include pen data if pens selected
      if (formData.productType === 'pens' && penData) {
        submitData.append('penData', JSON.stringify(penData))
      }

      // Include pack data if using pack-based pricing
      if (packData) {
        submitData.append('packData', JSON.stringify(packData))
        submitData.append('packLabel', getPackQuantityLabel(packData.productType, packData.numPacks))
      }

      // Include label design data if selected
      if (formData.productType === 'tags-labels' && labelDesignData) {
        submitData.append('labelDesignData', JSON.stringify(labelDesignData))
        // Include human-readable description
        submitData.append('labelDescription', generateLabelDescription(labelDesignData))
        // Include Lightburn-ready SVG file
        const svgContent = generateLabelSVG(labelDesignData)
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' })
        submitData.append('designFile', svgBlob, `label-design-${Date.now()}.svg`)
      }

      // Include knife design data if selected
      if (formData.productType === 'knives' && knifeDesignData) {
        submitData.append('knifeDesignData', JSON.stringify(knifeDesignData))
        // Include human-readable description
        const knifeDescription = `${knifeDesignData.knifeType === 'pocket' ? 'Pocket' : 'Chef'} Knife - ${
          knifeDesignData.engravingLocation === 'both' ? 'Blade & Handle' :
          knifeDesignData.engravingLocation === 'blade' ? 'Blade' : 'Handle'
        } Engraving. ${knifeDesignData.bladeText ? `Blade: "${knifeDesignData.bladeText}"` : ''} ${knifeDesignData.handleText ? `Handle: "${knifeDesignData.handleText}"` : ''} Qty: ${knifeDesignData.quantity}`
        submitData.append('knifeDescription', knifeDescription)
      }

      // Include calculated price for orders with known pricing
      if (orderTotal) {
        submitData.append('calculatedPrice', orderTotal.total.toString())
        submitData.append('isOrder', 'true')
        setWasOrder(true)
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        body: submitData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit quote request')
      }

      const result = await response.json() as {
        success: boolean
        isOrder?: boolean
        orderNumber?: string
        paymentUrl?: string
        total?: number
      }

      if (result.isOrder && result.paymentUrl && result.orderNumber && result.total) {
        setOrderInfo({
          orderNumber: result.orderNumber,
          paymentUrl: result.paymentUrl,
          total: result.total
        })
      }

      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again or text me directly at (719) 257-3834.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    // Order with payment link
    if (orderInfo?.paymentUrl) {
      return (
        <div className="bg-vurmz-teal/10 border border-vurmz-teal p-8 text-center">
          <div className="w-16 h-16 bg-vurmz-teal/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-vurmz-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-vurmz-dark mb-2">
            Order Received!
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            Order Number: <span className="font-bold">{orderInfo.orderNumber}</span>
          </p>
          <p className="text-gray-600 mb-6">
            I&apos;ll start working on your order as soon as payment is received.
          </p>

          <a
            href={orderInfo.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-vurmz-teal text-white px-8 py-4 font-bold text-lg hover:bg-vurmz-teal-dark transition-colors mb-4"
          >
            Pay Now - ${orderInfo.total.toFixed(2)}
          </a>

          <p className="text-sm text-gray-500 mb-6">
            Secure payment powered by Square
          </p>

          <button
            onClick={() => router.push('/')}
            className="text-vurmz-teal hover:underline"
          >
            Return Home
          </button>
        </div>
      )
    }

    // Quote request (no immediate payment)
    return (
      <div className="bg-vurmz-teal/10 border border-vurmz-teal p-8 text-center">
        <div className="w-16 h-16 bg-vurmz-teal/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-vurmz-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-vurmz-dark mb-2">
          Got It!
        </h2>
        <p className="text-gray-600 mb-6">
          I will review your request and get back to you today with pricing. Check your email or expect a text.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-vurmz-teal text-white px-6 py-3 font-semibold hover:bg-vurmz-teal-dark transition-colors"
        >
          Return Home
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4">
          {error}
        </div>
      )}

      {/* Contact Info */}
      <div>
        <h2 className="text-xl font-bold text-vurmz-dark mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-vurmz-dark mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-vurmz-dark mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Best number to reach you"
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-vurmz-dark mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-vurmz-dark mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-vurmz-dark mb-1">
          What type of business? <span className="text-red-500">*</span>
        </label>
        <select
          id="businessType"
          name="businessType"
          required
          value={formData.businessType}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none bg-white"
        >
          <option value="">Select...</option>
          {businessTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Project Details */}
      <div>
        <h2 className="text-xl font-bold text-vurmz-dark mb-4">What Do You Need?</h2>
        <div className="space-y-4">
          {/* Product Tiles */}
          <ProductSelector
            value={formData.productType}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              productType: value,
            }))}
          />

          {/* Quantity - hidden for designer products and pack-based products */}
          {!['tags-labels', 'knives', 'pens'].includes(formData.productType) && (
            <div className="max-w-xs">
              <label htmlFor="quantity" className="block text-sm font-medium text-vurmz-dark mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                required={!['tags-labels', 'knives', 'pens'].includes(formData.productType)}
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 25, 50-100, not sure yet"
                className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>
          )}

          {/* Product Designers with Liquid Transitions */}
          <AnimatePresence mode="wait">
            {formData.productType === 'business-cards' && (
              <motion.div
                key="business-cards"
                variants={motionVariants.productMorph}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MetalBusinessCardPreview onChange={handleCardDataChange} />
              </motion.div>
            )}

            {formData.productType === 'pens' && (
              <motion.div
                key="pens"
                variants={motionVariants.productMorph}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Pack Selector for quantity-based pricing */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-vurmz-dark mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-vurmz-teal/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-vurmz-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </span>
                    How Many Pens?
                  </h3>
                  <PackSelector
                    productType="pens"
                    onPackChange={(numPacks) => handlePackChange('pens', numPacks)}
                    initialPacks={1}
                  />
                </div>
                {/* Pen customization */}
                <BrandedPenPreview onChange={handlePenDataChange} />
              </motion.div>
            )}

            {formData.productType === 'tags-labels' && (
              <motion.div
                key="tags-labels"
                variants={motionVariants.productMorph}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <LabelDesigner
                  onChange={handleLabelDesignChange}
                  initialQuantity={parseInt(formData.quantity, 10) || 1}
                />
              </motion.div>
            )}

            {formData.productType === 'knives' && (
              <motion.div
                key="knives"
                variants={motionVariants.productMorph}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <KnifeDesigner onChange={handleKnifeDesignChange} />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vurmz-dark mb-1">
              {['business-cards', 'pens', 'tags-labels', 'knives'].includes(formData.productType) ? 'Additional Notes (Optional)' : 'Tell Me About Your Project'} {!['business-cards', 'pens', 'tags-labels', 'knives'].includes(formData.productType) && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="description"
              name="description"
              required={!['business-cards', 'pens', 'tags-labels', 'knives'].includes(formData.productType)}
              rows={['business-cards', 'pens', 'tags-labels', 'knives'].includes(formData.productType) ? 3 : 4}
              value={formData.description}
              onChange={handleChange}
              placeholder={
                formData.productType === 'business-cards'
                  ? "Any special requests? Questions about your order? (Optional)"
                  : formData.productType === 'pens'
                  ? "Any special requests? Questions about your order? (Optional)"
                  : formData.productType === 'tags-labels'
                  ? "Need different text on each label? Special instructions? (Optional)"
                  : formData.productType === 'knives'
                  ? "Describe your knife - brand, style, blade material. Any special requests? (Optional)"
                  : "What do you want engraved? Any specific text, logo, or design? Size preferences? Bringing your own items?"
              }
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h2 className="text-xl font-bold text-vurmz-dark mb-4">Upload Logo or Design</h2>
        <p className="text-sm text-gray-600 mb-4">
          Have a logo or design file? Upload it here. Accepted formats: JPG, PNG, SVG, PDF (max 10MB each, up to 5 files)
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-vurmz-teal bg-vurmz-teal/5'
              : 'border-gray-300 hover:border-vurmz-teal'
          }`}
        >
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-gray-400">
            No file? No problem. You can send it later.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.svg,.pdf,.webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <DocumentIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-vurmz-dark">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Turnaround */}
      <div>
        <h2 className="text-xl font-bold text-vurmz-dark mb-4">When Do You Need It?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {turnaroundOptions.map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                formData.turnaround === option.value
                  ? 'border-vurmz-teal bg-vurmz-teal/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="turnaround"
                value={option.value}
                checked={formData.turnaround === option.value}
                onChange={handleChange}
                className="mt-1 accent-vurmz-teal"
              />
              <div>
                <span className="font-medium text-vurmz-dark">{option.label}</span>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div>
        <h2 className="text-xl font-bold text-vurmz-dark mb-4">Pickup or Delivery?</h2>
        <div className="space-y-3">
          {deliveryOptions.map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                formData.deliveryMethod === option.value
                  ? 'border-vurmz-teal bg-vurmz-teal/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={option.value}
                checked={formData.deliveryMethod === option.value}
                onChange={handleChange}
                className="mt-1 accent-vurmz-teal"
              />
              <div>
                <span className="font-medium text-vurmz-dark">{option.label}</span>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Delivery Address - shows when delivery is selected */}
        {formData.deliveryMethod === 'delivery' && (
          <div className="mt-4">
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-vurmz-dark mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
              value={formData.deliveryAddress}
              onChange={(address) => setFormData(prev => ({ ...prev, deliveryAddress: address }))}
              placeholder="Start typing your address..."
              required={formData.deliveryMethod === 'delivery'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Free delivery on orders $100+ in south suburban Denver
            </p>
          </div>
        )}
      </div>

      {/* How did you hear */}
      <div>
        <label htmlFor="howHeardAboutUs" className="block text-sm font-medium text-vurmz-dark mb-1">
          How did you find me?
        </label>
        <select
          id="howHeardAboutUs"
          name="howHeardAboutUs"
          value={formData.howHeardAboutUs}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none bg-white"
        >
          <option value="">Select...</option>
          {howHeardOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Order Summary (for products with known pricing) */}
      {isOrderWithPrice && orderTotal && (
        <div className="bg-gradient-to-br from-vurmz-dark via-gray-800 to-vurmz-dark text-white p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-vurmz-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-bold">Order Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{orderTotal.productName}</span>
              <span className="font-medium">${orderTotal.pricePerUnit.toFixed(2)} each</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Quantity</span>
              <span className="font-medium">
                {'packInfo' in orderTotal && orderTotal.packInfo
                  ? orderTotal.packInfo
                  : `${orderTotal.quantity} units`}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-600 pt-3 mt-3">
              <span className="font-semibold text-base">Total</span>
              <span className="text-2xl font-bold text-vurmz-teal">${orderTotal.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className={`w-full px-8 py-4 font-bold text-lg rounded-lg transition-all ${
            loading || !canSubmit
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-vurmz-teal text-white hover:bg-vurmz-teal-dark hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : isOrderWithPrice ? (
            `Submit Order - $${orderTotal?.total.toFixed(2)}`
          ) : (
            'Submit Quote Request'
          )}
        </button>

        {/* Validation Message */}
        {!canSubmit && requiresPricing && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              {!hasDesignerContent()
                ? 'Add text or elements in the designer above to continue.'
                : 'Enter a valid quantity to see pricing.'}
            </span>
          </div>
        )}

        {/* Helper Text */}
        <p className="text-sm text-gray-500 text-center">
          {isOrderWithPrice ? (
            "You'll receive a payment link via email after review."
          ) : !requiresPricing ? (
            <>
              Same-day response with pricing. Text{' '}
              <a href="sms:+17192573834" className="text-vurmz-teal font-medium hover:underline">
                (719) 257-3834
              </a>{' '}
              for urgent requests.
            </>
          ) : null}
        </p>
      </div>
    </form>
  )
}
