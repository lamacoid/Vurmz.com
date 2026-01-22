'use client'

import { useState, useMemo } from 'react'
import {
  templateCategories,
  getTemplatesByCategory,
  getTemplateById,
  getComplianceInfo,
  complianceStandards,
  type Template,
  type TemplateCategory,
  type TemplateField,
} from '@/lib/industrial-templates'
import {
  ArrowLeftIcon,
  CheckIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QrCodeIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

type Step = 'category' | 'template' | 'customize' | 'contact' | 'review'

type BarcodeType = 'code128' | 'qr' | 'code39' | 'datamatrix' | 'none'

interface FormData {
  [key: string]: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  company: string
  notes: string
}

interface BarcodeConfig {
  enabled: boolean
  type: BarcodeType
  value: string
}

interface LogoConfig {
  enabled: boolean
  file: File | null
  preview: string | null
}

type VariableDataMode = 'none' | 'sequential' | 'custom'

interface SequentialConfig {
  startNumber: number
  prefix: string
  suffix: string
  padding: number // e.g., 3 means 001, 002, 003
  fieldId: string // which field to apply it to
}

interface CustomVariableConfig {
  fieldId: string
  values: string[] // one per item in quantity
}

export default function IndustrialBuilder() {
  const [step, setStep] = useState<Step>('category')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [quantity, setQuantity] = useState(1)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })
  const [barcodeConfig, setBarcodeConfig] = useState<BarcodeConfig>({
    enabled: false,
    type: 'code128',
    value: '',
  })
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    enabled: false,
    file: null,
    preview: null,
  })
  const [variableDataMode, setVariableDataMode] = useState<VariableDataMode>('none')
  const [sequentialConfig, setSequentialConfig] = useState<SequentialConfig>({
    startNumber: 1,
    prefix: '',
    suffix: '',
    padding: 3,
    fieldId: '',
  })
  const [customVariableConfig, setCustomVariableConfig] = useState<CustomVariableConfig>({
    fieldId: '',
    values: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const categoryTemplates = useMemo(() => {
    if (!selectedCategory) return []
    return getTemplatesByCategory(selectedCategory)
  }, [selectedCategory])

  const complianceInfo = useMemo(() => {
    if (!selectedTemplate) return []
    return getComplianceInfo(selectedTemplate.compliance)
  }, [selectedTemplate])

  const handleCategorySelect = (categoryId: TemplateCategory) => {
    setSelectedCategory(categoryId)
    setSelectedTemplate(null)
    setFormData({})
    setSelectedSize(null)
    setSelectedMaterial(null)
    setStep('template')
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    // Set default values
    const defaults: FormData = {}
    template.fields.forEach(field => {
      if (field.defaultValue) {
        defaults[field.id] = field.defaultValue
      }
    })
    setFormData(defaults)
    // Set recommended size and material (filter out hidden)
    const recommendedSize = template.sizes.find(s => s.recommended) || template.sizes[0]
    const visibleMaterials = template.materials.filter(m => !m.hidden)
    const recommendedMaterial = visibleMaterials.find(m => m.recommended) || visibleMaterials[0]
    setSelectedSize(recommendedSize.id)
    setSelectedMaterial(recommendedMaterial.id)
    setStep('customize')
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleBack = () => {
    switch (step) {
      case 'template':
        setStep('category')
        setSelectedCategory(null)
        break
      case 'customize':
        setStep('template')
        setSelectedTemplate(null)
        break
      case 'contact':
        setStep('customize')
        break
      case 'review':
        setStep('contact')
        break
    }
  }

  const isFormValid = useMemo(() => {
    if (!selectedTemplate) return false
    return selectedTemplate.fields
      .filter(f => f.required)
      .every(f => formData[f.id]?.trim())
  }, [selectedTemplate, formData])

  const handleAddToOrder = () => {
    setStep('contact')
  }

  const isCustomerInfoValid = useMemo(() => {
    return customerInfo.name.trim() && customerInfo.email.trim() && customerInfo.email.includes('@')
  }, [customerInfo])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, SVG, or WebP image')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file must be under 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogoConfig({
        enabled: true,
        file,
        preview: event.target?.result as string,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleLogoRemove = () => {
    setLogoConfig({
      enabled: false,
      file: null,
      preview: null,
    })
  }

  const handleSubmitOrder = async () => {
    if (!selectedTemplate || !selectedSize || !selectedMaterial) return

    setIsSubmitting(true)
    setSubmitError(null)

    const size = selectedTemplate.sizes.find(s => s.id === selectedSize)

    // Build variable data config for the API
    const variableData = variableDataMode === 'none' ? undefined : {
      mode: variableDataMode,
      sequential: variableDataMode === 'sequential' ? {
        fieldId: sequentialConfig.fieldId,
        startNumber: sequentialConfig.startNumber,
        padding: sequentialConfig.padding,
        prefix: sequentialConfig.prefix,
        suffix: sequentialConfig.suffix,
      } : undefined,
      custom: variableDataMode === 'custom' ? {
        fieldId: customVariableConfig.fieldId,
        values: customVariableConfig.values.slice(0, quantity),
      } : undefined,
    }

    try {
      const response = await fetch('/api/generate-lightburn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: selectedTemplate.id,
          material: selectedMaterial,
          width: size?.width || 100,
          height: size?.height || 50,
          fields: formData,
          barcode: barcodeConfig.enabled && barcodeConfig.value ? {
            type: barcodeConfig.type === 'none' ? 'code128' : barcodeConfig.type,
            value: barcodeConfig.value,
          } : undefined,
          logo: logoConfig.preview || undefined,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          quantity,
          variableData,
        }),
      })

      if (!response.ok) {
        const data = await response.json() as { error?: string }
        throw new Error(data.error || 'Failed to submit order')
      }

      setSubmitSuccess(true)
      setStep('review')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step !== 'category' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Industrial Label Builder</h1>
                <p className="text-sm text-gray-500">
                  {step === 'category' && 'Select a product category'}
                  {step === 'template' && `${templateCategories.find(c => c.id === selectedCategory)?.name}`}
                  {step === 'customize' && selectedTemplate?.name}
                  {step === 'contact' && 'Your Contact Information'}
                  {step === 'review' && 'Order Submitted'}
                </p>
              </div>
            </div>
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {['category', 'template', 'customize', 'contact', 'review'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-[#5a7a7a] text-white' :
                    ['category', 'template', 'customize', 'contact', 'review'].indexOf(step) > i
                      ? 'bg-[#5a7a7a]/20 text-[#5a7a7a]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {['category', 'template', 'customize', 'contact', 'review'].indexOf(step) > i ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 4 && <div className={`w-8 h-0.5 ${
                    ['category', 'template', 'customize', 'contact', 'review'].indexOf(step) > i
                      ? 'bg-[#5a7a7a]/20' : 'bg-gray-200'
                  }`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selection */}
        {step === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templateCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-white border border-gray-200 p-6 text-left hover:border-[#5a7a7a] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-[#5a7a7a]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#5a7a7a]/20 transition-colors">
                  <svg className="h-6 w-6 text-[#5a7a7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Template Selection */}
        {step === 'template' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="bg-white border border-gray-200 p-6 text-left hover:border-[#5a7a7a] hover:shadow-md transition-all"
              >
                {/* Mini preview */}
                <div
                  className="h-24 mb-4 rounded border flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: template.previewStyle.backgroundColor,
                    color: template.previewStyle.textColor,
                    borderColor: template.previewStyle.borderColor || template.previewStyle.backgroundColor,
                  }}
                >
                  {template.previewStyle.headerColor && (
                    <div
                      className="absolute top-0 left-0 right-0 py-1 text-xs text-center font-bold"
                      style={{
                        backgroundColor: template.previewStyle.headerColor,
                        color: template.previewStyle.headerTextColor,
                      }}
                    >
                      {template.name.includes('DANGER') ? 'DANGER' :
                       template.name.includes('WARNING') ? 'WARNING' :
                       template.name.includes('CAUTION') ? 'CAUTION' : 'PREVIEW'}
                    </div>
                  )}
                  <span className="text-xs opacity-60">{template.layout.toUpperCase()} LAYOUT</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                {template.compliance.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[#5a7a7a]">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>{template.compliance.map(c => complianceStandards[c as keyof typeof complianceStandards]?.name.split(' ')[0]).join(', ')}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Customize Template */}
        {step === 'customize' && selectedTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              {/* Compliance Info */}
              {complianceInfo.length > 0 && (
                <div className="bg-[#5a7a7a]/5 border border-[#5a7a7a]/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-[#5a7a7a]" />
                    <span className="font-semibold text-gray-900">Compliance Standards</span>
                  </div>
                  <div className="space-y-2">
                    {complianceInfo.map(info => (
                      <div key={info.name} className="text-sm">
                        <span className="font-medium text-gray-700">{info.name}</span>
                        <span className="text-gray-500"> - {info.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fields */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Fill In Your Information</h3>
                <div className="space-y-4">
                  {selectedTemplate.fields.map(field => (
                    <FieldInput
                      key={field.id}
                      field={field}
                      value={formData[field.id] || ''}
                      onChange={(value) => handleFieldChange(field.id, value)}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Select Size</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedTemplate.sizes.map(size => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 border rounded-lg text-sm text-center transition-colors ${
                        selectedSize === size.id
                          ? 'border-[#5a7a7a] bg-[#5a7a7a]/5 text-[#5a7a7a]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{size.label}</div>
                      {size.recommended && (
                        <div className="text-xs text-[#5a7a7a] mt-1">Recommended</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Select Material</h3>
                <div className="space-y-3">
                  {selectedTemplate.materials.filter(m => !m.hidden).map(material => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        selectedMaterial === material.id
                          ? 'border-[#5a7a7a] bg-[#5a7a7a]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{material.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{material.description}</div>
                          <div className="text-xs text-[#5a7a7a] mt-1">{material.durability}</div>
                        </div>
                        {selectedMaterial === material.id && (
                          <CheckIcon className="h-5 w-5 text-[#5a7a7a]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Variable Data - Only shown when quantity > 1 */}
              {quantity > 1 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Variable Data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Make each tag unique with sequential numbers or different text
                  </p>

                  {/* Mode Selection */}
                  <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#5a7a7a] transition-colors">
                      <input
                        type="radio"
                        name="variableMode"
                        checked={variableDataMode === 'none'}
                        onChange={() => setVariableDataMode('none')}
                        className="w-4 h-4 text-[#5a7a7a]"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Same on all</div>
                        <div className="text-xs text-gray-500">All {quantity} tags will be identical</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#5a7a7a] transition-colors">
                      <input
                        type="radio"
                        name="variableMode"
                        checked={variableDataMode === 'sequential'}
                        onChange={() => setVariableDataMode('sequential')}
                        className="w-4 h-4 text-[#5a7a7a]"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Sequential Numbers</div>
                        <div className="text-xs text-gray-500">001, 002, 003... or A-001, A-002...</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#5a7a7a] transition-colors">
                      <input
                        type="radio"
                        name="variableMode"
                        checked={variableDataMode === 'custom'}
                        onChange={() => setVariableDataMode('custom')}
                        className="w-4 h-4 text-[#5a7a7a]"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Custom List</div>
                        <div className="text-xs text-gray-500">Different text on each tag (names, serials, etc.)</div>
                      </div>
                    </label>
                  </div>

                  {/* Sequential Config */}
                  {variableDataMode === 'sequential' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apply to Field</label>
                        <select
                          value={sequentialConfig.fieldId}
                          onChange={(e) => setSequentialConfig(prev => ({ ...prev, fieldId: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">Select a field...</option>
                          {selectedTemplate.fields.map(field => (
                            <option key={field.id} value={field.id}>{field.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Number</label>
                          <input
                            type="number"
                            value={sequentialConfig.startNumber}
                            onChange={(e) => setSequentialConfig(prev => ({ ...prev, startNumber: parseInt(e.target.value) || 1 }))}
                            min="1"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Digits (padding)</label>
                          <select
                            value={sequentialConfig.padding}
                            onChange={(e) => setSequentialConfig(prev => ({ ...prev, padding: parseInt(e.target.value) }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          >
                            <option value="1">1 (1, 2, 3...)</option>
                            <option value="2">2 (01, 02, 03...)</option>
                            <option value="3">3 (001, 002, 003...)</option>
                            <option value="4">4 (0001, 0002...)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prefix (optional)</label>
                          <input
                            type="text"
                            value={sequentialConfig.prefix}
                            onChange={(e) => setSequentialConfig(prev => ({ ...prev, prefix: e.target.value }))}
                            placeholder="e.g., ASSET-"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Suffix (optional)</label>
                          <input
                            type="text"
                            value={sequentialConfig.suffix}
                            onChange={(e) => setSequentialConfig(prev => ({ ...prev, suffix: e.target.value }))}
                            placeholder="e.g., -2024"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                      {sequentialConfig.fieldId && (
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Preview:</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: Math.min(5, quantity) }, (_, i) => {
                              const num = sequentialConfig.startNumber + i
                              const formatted = String(num).padStart(sequentialConfig.padding, '0')
                              return (
                                <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                  {sequentialConfig.prefix}{formatted}{sequentialConfig.suffix}
                                </span>
                              )
                            })}
                            {quantity > 5 && <span className="px-2 py-1 text-gray-400 text-sm">...+{quantity - 5} more</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom Variable Config */}
                  {variableDataMode === 'custom' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apply to Field</label>
                        <select
                          value={customVariableConfig.fieldId}
                          onChange={(e) => setCustomVariableConfig(prev => ({ ...prev, fieldId: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="">Select a field...</option>
                          {selectedTemplate.fields.map(field => (
                            <option key={field.id} value={field.id}>{field.label}</option>
                          ))}
                        </select>
                      </div>
                      {customVariableConfig.fieldId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enter {quantity} values (one per line)
                          </label>
                          <textarea
                            value={customVariableConfig.values.join('\n')}
                            onChange={(e) => setCustomVariableConfig(prev => ({
                              ...prev,
                              values: e.target.value.split('\n')
                            }))}
                            placeholder={`Value for tag 1\nValue for tag 2\nValue for tag 3\n...`}
                            rows={Math.min(10, quantity)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {customVariableConfig.values.filter(v => v.trim()).length} of {quantity} values entered
                            {customVariableConfig.values.filter(v => v.trim()).length < quantity && (
                              <span className="text-amber-600 ml-1">
                                - Missing {quantity - customVariableConfig.values.filter(v => v.trim()).length}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Barcode Option */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <QrCodeIcon className="h-5 w-5 text-[#5a7a7a]" />
                    <h3 className="font-semibold text-gray-900">Add Barcode</h3>
                  </div>
                  <button
                    onClick={() => setBarcodeConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      barcodeConfig.enabled ? 'bg-[#5a7a7a]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      barcodeConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {barcodeConfig.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Barcode Type</label>
                      <select
                        value={barcodeConfig.type}
                        onChange={(e) => setBarcodeConfig(prev => ({ ...prev, type: e.target.value as BarcodeType }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="code128">Code 128 (Standard)</option>
                        <option value="code39">Code 39 (Industrial)</option>
                        <option value="qr">QR Code</option>
                        <option value="datamatrix">DataMatrix</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {barcodeConfig.type === 'code128' && 'Best for general purpose, supports all ASCII characters'}
                        {barcodeConfig.type === 'code39' && 'Common in industrial/manufacturing, A-Z, 0-9'}
                        {barcodeConfig.type === 'qr' && 'Great for URLs, longer text, or mobile scanning'}
                        {barcodeConfig.type === 'datamatrix' && 'High density, small footprint, common in electronics'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={barcodeConfig.value}
                        onChange={(e) => setBarcodeConfig(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={
                          barcodeConfig.type === 'qr' ? 'https://example.com or text' :
                          barcodeConfig.type === 'code39' ? 'ABC-123' : 'Enter value to encode'
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is the data encoded in the barcode (e.g., asset ID, serial number, URL)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo Upload */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PhotoIcon className="h-5 w-5 text-[#5a7a7a]" />
                    <h3 className="font-semibold text-gray-900">Add Logo</h3>
                  </div>
                </div>

                {logoConfig.preview ? (
                  <div className="relative">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={logoConfig.preview}
                        alt="Logo preview"
                        className="max-h-24 mx-auto object-contain"
                      />
                    </div>
                    <button
                      onClick={handleLogoRemove}
                      className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-600" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {logoConfig.file?.name}
                    </p>
                  </div>
                ) : (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#5a7a7a] hover:bg-gray-50 transition-colors">
                      <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload your logo
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, SVG, or WebP (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  Optional: Your company logo will be engraved on the label
                </p>
              </div>

              {/* Add to Order Button */}
              <button
                onClick={handleAddToOrder}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                  isFormValid
                    ? 'bg-[#5a7a7a] text-white hover:bg-[#4a6a6a]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to Order
              </button>
            </div>

            {/* Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Live Preview</h3>
                <TemplatePreview
                  template={selectedTemplate}
                  formData={formData}
                  size={selectedTemplate.sizes.find(s => s.id === selectedSize)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        {step === 'contact' && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Contact Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={customerInfo.company}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your company name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions or questions..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a]"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{selectedTemplate.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{selectedTemplate.sizes.find(s => s.id === selectedSize)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">{selectedTemplate.materials.find(m => m.id === selectedMaterial)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                {variableDataMode !== 'none' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variable Data:</span>
                    <span className="font-medium">
                      {variableDataMode === 'sequential' && sequentialConfig.fieldId && (
                        <>Sequential ({sequentialConfig.prefix}{String(sequentialConfig.startNumber).padStart(sequentialConfig.padding, '0')}{sequentialConfig.suffix} - {sequentialConfig.prefix}{String(sequentialConfig.startNumber + quantity - 1).padStart(sequentialConfig.padding, '0')}{sequentialConfig.suffix})</>
                      )}
                      {variableDataMode === 'custom' && customVariableConfig.fieldId && (
                        <>{customVariableConfig.values.filter(v => v.trim()).length} unique values</>
                      )}
                    </span>
                  </div>
                )}
                {barcodeConfig.enabled && barcodeConfig.value && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Barcode:</span>
                    <span className="font-medium">{barcodeConfig.type.toUpperCase()} - {barcodeConfig.value}</span>
                  </div>
                )}
                {logoConfig.preview && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Logo:</span>
                    <div className="flex items-center gap-2">
                      <img src={logoConfig.preview} alt="Logo" className="h-6 object-contain" />
                      <span className="font-medium text-green-600">Attached</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={!isCustomerInfoValid || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                isCustomerInfoValid && !isSubmitting
                  ? 'bg-[#5a7a7a] text-white hover:bg-[#4a6a6a]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting Order...
                </span>
              ) : (
                'Submit Order'
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              I&apos;ll receive your order instantly and get back to you with pricing shortly.
            </p>
          </div>
        )}

        {/* Review / Success */}
        {step === 'review' && selectedTemplate && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
              <p className="text-gray-600 mb-2">
                {quantity}x {selectedTemplate.name} - {selectedTemplate.sizes.find(s => s.id === selectedSize)?.label}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                I&apos;ve received your order and will reach out shortly with pricing and timeline.
                Check your email ({customerInfo.email}) for confirmation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setStep('category')
                    setSelectedCategory(null)
                    setSelectedTemplate(null)
                    setFormData({})
                    setCustomerInfo({ name: '', email: '', phone: '', company: '', notes: '' })
                    setBarcodeConfig({ enabled: false, type: 'code128', value: '' })
                    setLogoConfig({ enabled: false, file: null, preview: null })
                    setVariableDataMode('none')
                    setSequentialConfig({ startNumber: 1, prefix: '', suffix: '', padding: 3, fieldId: '' })
                    setCustomVariableConfig({ fieldId: '', values: [] })
                    setQuantity(1)
                    setSubmitSuccess(false)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Create Another Order
                </button>
                <a
                  href="sms:+17192573834"
                  className="px-6 py-3 bg-[#5a7a7a] text-white rounded-lg font-medium hover:bg-[#4a6a6a] transition-colors"
                >
                  Text Me Directly
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Field Input Component
function FieldInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a] focus:border-transparent"
        >
          <option value="">Select...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : field.type === 'multiline' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a] focus:border-transparent"
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5a7a7a] focus:border-transparent"
        />
      )}
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <InformationCircleIcon className="h-3 w-3" />
          {field.helpText}
        </p>
      )}
    </div>
  )
}

// Template Preview Component
function TemplatePreview({
  template,
  formData,
  size,
}: {
  template: Template
  formData: FormData
  size?: { width: number; height: number; label: string }
}) {
  // Scale factor to fit preview in container
  const maxPreviewWidth = 400
  const maxPreviewHeight = 300
  const aspectRatio = size ? size.width / size.height : 1

  let previewWidth: number
  let previewHeight: number

  if (aspectRatio > maxPreviewWidth / maxPreviewHeight) {
    previewWidth = maxPreviewWidth
    previewHeight = maxPreviewWidth / aspectRatio
  } else {
    previewHeight = maxPreviewHeight
    previewWidth = maxPreviewHeight * aspectRatio
  }

  // Render preview based on template type
  const renderPreviewContent = () => {
    switch (template.id) {
      case 'arc-flash-label':
        return <ArcFlashPreview formData={formData} />
      case 'danger-sign':
      case 'warning-sign':
      case 'caution-sign':
        return <HazardSignPreview template={template} formData={formData} />
      case 'breaker-schedule':
        return <BreakerSchedulePreview formData={formData} />
      case 'disconnect-switch':
      case 'motor-starter':
      case 'control-panel-id':
        return <PanelLabelPreview template={template} formData={formData} />
      case 'valve-id-round':
        return <RoundValvePreview formData={formData} />
      default:
        return <GenericPreview template={template} formData={formData} />
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
        style={{
          width: previewWidth,
          height: previewHeight,
          borderRadius: template.layout === 'square' && template.id.includes('round') ? '50%' : '4px',
        }}
      >
        <div
          className="w-full h-full flex flex-col"
          style={{
            backgroundColor: template.previewStyle.backgroundColor,
            color: template.previewStyle.textColor,
          }}
        >
          {renderPreviewContent()}
        </div>
      </div>
      {size && (
        <p className="text-sm text-gray-500 mt-3">Actual size: {size.label}</p>
      )}
    </div>
  )
}

// Specialized Preview Components
function ArcFlashPreview({ formData }: { formData: FormData }) {
  return (
    <div className="h-full flex flex-col text-xs">
      {/* Header */}
      <div className="bg-[#FF8200] text-black py-2 px-3 text-center">
        <div className="font-bold text-sm">⚡ WARNING</div>
        <div className="font-bold">ARC FLASH HAZARD</div>
      </div>
      {/* Content */}
      <div className="flex-1 p-3 space-y-1 bg-white text-black">
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Equipment:</span>
          <span className="font-medium">{formData.equipmentId || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Voltage:</span>
          <span className="font-medium">{formData.voltage || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Arc Flash Boundary:</span>
          <span className="font-medium">{formData.arcFlashBoundary || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Incident Energy:</span>
          <span className="font-medium">{formData.incidentEnergy || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">PPE Category:</span>
          <span className="font-medium">{formData.ppeCategory || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Analysis Date:</span>
          <span className="font-medium">{formData.analysisDate || '—'}</span>
        </div>
      </div>
    </div>
  )
}

function HazardSignPreview({ template, formData }: { template: Template; formData: FormData }) {
  const signalWord = template.name.split(' ')[0].toUpperCase()
  const message = formData.customMessage || formData.hazardMessage || 'HAZARD MESSAGE'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="py-3 px-4 text-center"
        style={{
          backgroundColor: template.previewStyle.headerColor,
          color: template.previewStyle.headerTextColor,
        }}
      >
        <div className="font-bold text-lg">{signalWord}</div>
      </div>
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <div className="font-bold text-black text-base">{message}</div>
          {formData.additionalInfo && (
            <div className="text-gray-600 text-sm mt-2">{formData.additionalInfo}</div>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakerSchedulePreview({ formData }: { formData: FormData }) {
  return (
    <div className="h-full flex flex-col p-2 text-xs bg-white text-black">
      <div className="text-center font-bold border-b border-black pb-1 mb-2">
        <div className="text-sm">{formData.panelName || 'PANEL'}</div>
        <div className="text-xs text-gray-600">{formData.voltage || 'VOLTAGE'}</div>
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-0.5">CKT</th>
              <th className="text-left py-0.5">DESCRIPTION</th>
              <th className="text-right py-0.5">CKT</th>
            </tr>
          </thead>
          <tbody>
            {[1, 3, 5, 7].map(n => (
              <tr key={n} className="border-b border-gray-200">
                <td className="py-0.5">{n}</td>
                <td className="py-0.5 text-gray-400">___________</td>
                <td className="text-right py-0.5">{n + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {formData.location && (
        <div className="text-center text-xs text-gray-500 mt-1 pt-1 border-t border-gray-200">
          {formData.location}
        </div>
      )}
    </div>
  )
}

function PanelLabelPreview({ template, formData }: { template: Template; formData: FormData }) {
  const mainField = formData.panelName || formData.equipmentName || formData.motorName || 'LABEL'

  return (
    <div
      className="h-full flex flex-col items-center justify-center p-3"
      style={{
        backgroundColor: template.previewStyle.headerColor || template.previewStyle.backgroundColor,
        color: template.previewStyle.headerTextColor || template.previewStyle.textColor,
      }}
    >
      <div className="font-bold text-lg">{mainField}</div>
      {formData.voltage && (
        <div className="text-sm opacity-90 mt-1">{formData.voltage}</div>
      )}
      {formData.amperage && (
        <div className="text-sm opacity-90">{formData.amperage}</div>
      )}
      {formData.description && (
        <div className="text-xs opacity-80 mt-2">{formData.description}</div>
      )}
    </div>
  )
}

function RoundValvePreview({ formData }: { formData: FormData }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#FFD100] text-black rounded-full p-2">
      <div className="text-xs font-medium">{formData.service || 'SVC'}</div>
      <div className="font-bold text-base">{formData.valveNumber || 'V-000'}</div>
    </div>
  )
}


function GenericPreview({ template, formData }: { template: Template; formData: FormData }) {
  const fields = template.fields.slice(0, 4)

  return (
    <div className="h-full flex flex-col p-3">
      {template.previewStyle.headerColor && (
        <div
          className="py-1 px-2 text-center text-xs font-bold mb-2"
          style={{
            backgroundColor: template.previewStyle.headerColor,
            color: template.previewStyle.headerTextColor,
          }}
        >
          {template.name.toUpperCase()}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center space-y-1">
        {fields.map(field => (
          <div key={field.id} className="text-xs">
            <span className="opacity-60">{field.label}: </span>
            <span className="font-medium">{formData[field.id] || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
