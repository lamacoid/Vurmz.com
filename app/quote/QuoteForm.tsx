'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import MetalBusinessCardPreview from '@/components/MetalBusinessCardPreview'
import BrandedPenPreview from '@/components/BrandedPenPreview'
import ProductSelector from '@/components/ProductSelector'

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
  { value: 'knives', label: 'Knife Engraving' },
  { value: 'tools', label: 'Tool Marking' },
  { value: 'bottles', label: 'Bottles / Tumblers' },
  { value: 'signs', label: 'Small Signs' },
  { value: 'keychains', label: 'Keychains' },
  { value: 'asset-tags', label: 'Asset Tags' },
  { value: 'industrial-panels', label: 'ABS Panels / Industrial' },
  { value: 'other', label: 'Something Else' },
]

const turnaroundOptions = [
  { value: 'same-day', label: 'Same Day (if possible)', description: 'Rush fee may apply' },
  { value: 'next-day', label: 'Next Day', description: 'Most common' },
  { value: 'standard', label: 'Standard (3-5 days)', description: 'No rush' },
  { value: 'flexible', label: 'Flexible', description: 'Let me know the best option' },
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    productType: '',
    quantity: '',
    description: '',
    turnaround: 'next-day',
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

    // Branded pens
    if (formData.productType === 'pens' && penData) {
      return {
        productName: 'Branded Pens',
        quantity,
        pricePerUnit: penData.pricePerPen,
        total: quantity * penData.pricePerPen
      }
    }

    return null
  }

  const orderTotal = getOrderTotal()
  const isOrderWithPrice = orderTotal !== null

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
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
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

      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again or text me directly at (719) 257-3834.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-vurmz-teal/10 border border-vurmz-teal p-8 text-center">
        <div className="w-16 h-16 bg-vurmz-teal/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-vurmz-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-vurmz-dark mb-2">
          {wasOrder ? 'Order Received!' : 'Got It!'}
        </h2>
        <p className="text-gray-600 mb-6">
          {wasOrder ? (
            <>
              Your order is being reviewed. Once approved, you&apos;ll receive an email and text
              with payment instructions. We&apos;ll get started right away!
            </>
          ) : (
            <>I will review your request and get back to you today with pricing. Check your email or expect a text.</>
          )}
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
            onChange={(value) => setFormData(prev => ({ ...prev, productType: value }))}
          />

          {/* Quantity */}
          <div className="max-w-xs">
            <label htmlFor="quantity" className="block text-sm font-medium text-vurmz-dark mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 25, 50-100, not sure yet"
              className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
            />
          </div>

          {/* Metal Business Card Preview */}
          {formData.productType === 'business-cards' && (
            <MetalBusinessCardPreview onChange={handleCardDataChange} />
          )}

          {/* Branded Pen Preview */}
          {formData.productType === 'pens' && (
            <BrandedPenPreview onChange={handlePenDataChange} />
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vurmz-dark mb-1">
              {['business-cards', 'pens'].includes(formData.productType) ? 'Additional Notes' : 'Tell Me About Your Project'} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={
                formData.productType === 'business-cards'
                  ? "Any additional details, special requests, or questions about your metal business cards?"
                  : formData.productType === 'pens'
                  ? "Any additional details, special requests, or questions about your branded pens?"
                  : "What do you want engraved? Any specific text, logo, or design? Size preferences?"
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
        <div className="bg-vurmz-dark text-white p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">{orderTotal.productName}</span>
              <span>${orderTotal.pricePerUnit.toFixed(2)} each</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Quantity</span>
              <span>{orderTotal.quantity}</span>
            </div>
            <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
              <span className="font-semibold">Order Total</span>
              <span className="text-xl font-bold">${orderTotal.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm text-gray-600">
        <p>
          By submitting this order request, you authorize VURMZ to invoice you for the total amount shown upon approval.
          You will receive an email with a secure payment link once your order is accepted.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-vurmz-teal text-white px-8 py-4 font-semibold text-lg hover:bg-vurmz-teal-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading
          ? 'Submitting...'
          : (isOrderWithPrice ? `Submit Order Request - $${orderTotal?.total.toFixed(2)}` : 'Submit Order Request')
        }
      </button>

      <p className="text-sm text-gray-600 text-center">
        {isOrderWithPrice ? (
          <>
            Your order will be reviewed and you&apos;ll receive a payment link via email upon approval.
          </>
        ) : (
          <>
            I&apos;ll respond same-day with pricing. For urgent requests, text me at{' '}
            <a href="sms:+17192573834" className="text-vurmz-teal font-medium hover:underline">
              (719) 257-3834
            </a>
          </>
        )}
      </p>
    </form>
  )
}
