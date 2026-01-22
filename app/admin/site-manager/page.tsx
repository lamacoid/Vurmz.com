'use client'

export const runtime = 'edge'

import { useState, useEffect, useCallback } from 'react'
import {
  PhotoIcon,
  SwatchIcon,
  DocumentTextIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CubeIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  ClockIcon,
  StarIcon,
  Bars3Icon,
  RectangleGroupIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'

type Tab = 'header' | 'footer' | 'pages' | 'products' | 'industries' | 'photos' | 'media' | 'portfolio' | 'colors' | 'content' | 'contact' | 'seo' | 'social' | 'testimonials' | 'hours'

interface Product {
  id: string
  name: string
  description: string
  price: string
  enabled: boolean
  hasDesigner: boolean
  isIndustrial?: boolean
  isCustom?: boolean
  order: number
  photoUrl?: string
}

interface PhotoSlot {
  id: string
  name: string
  description: string
  filename: string | null
  uploadedAt: string | null
}

interface Industry {
  id: string
  name: string
  icon: string
  enabled: boolean
}

interface Testimonial {
  id: string
  name: string
  company: string
  text: string
  enabled: boolean
}

interface SEOConfig {
  siteTitle: string
  siteDescription: string
  ogImage: string
  keywords: string
  favicon?: string
}

interface SocialLinks {
  instagram: string
  facebook: string
  google: string
  linkedin: string
  yelp: string
}

interface BusinessHours {
  display: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface NavItem {
  id: string
  label: string
  href: string
  enabled: boolean
  order: number
}

interface FooterLink {
  id: string
  label: string
  href: string
  enabled: boolean
}

interface HeaderConfig {
  logoUrl: string
  navItems: NavItem[]
  ctaText: string
  ctaLink: string
}

interface FooterConfig {
  copyrightText: string
  showSocial: boolean
  links: FooterLink[]
}

interface MediaItem {
  id: string
  filename: string
  url: string
  uploadedAt: string
  size?: number
}

interface PortfolioItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string
  industry: string | null
  location: string | null
  featured: number
  created_at?: string
}

interface SiteConfig {
  header: HeaderConfig
  footer: FooterConfig
  colors: {
    primary: string
    primaryDark: string
    secondary: string
    accent: string
    dark: string
    light: string
  }
  content: {
    heroTitle: string
    heroSubtitle: string
    tagline: string
    ctaText: string
    footerText: string
  }
  contact: {
    phone: string
    email: string
    address: string
    city: string
    state: string
  }
  products: Product[]
  photos: PhotoSlot[]
  media: MediaItem[]
  industries: Industry[]
  testimonials: Testimonial[]
  seo: SEOConfig
  social: SocialLinks
  hours: BusinessHours
}

const ICON_OPTIONS = [
  { value: 'bolt', label: 'Bolt (Electrical)' },
  { value: 'fire', label: 'Fire (HVAC)' },
  { value: 'wrench', label: 'Wrench (Plumbing)' },
  { value: 'building', label: 'Building' },
  { value: 'office', label: 'Office' },
  { value: 'home', label: 'Home' },
  { value: 'scale', label: 'Scale (Legal)' },
  { value: 'utensils', label: 'Restaurant' },
  { value: 'heart', label: 'Heart (Medical/Nonprofit)' },
  { value: 'car', label: 'Car/Truck' },
  { value: 'scissors', label: 'Scissors (Salon)' },
  { value: 'academic', label: 'Academic' },
  { value: 'key', label: 'Key' },
  { value: 'rocket', label: 'Rocket (Startup)' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'dumbbell', label: 'Fitness' },
]

export default function SiteManagerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('header')
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingIndustry, setEditingIndustry] = useState<string | null>(null)
  const [draggedIndustry, setDraggedIndustry] = useState<string | null>(null)
  const [dragOverIndustry, setDragOverIndustry] = useState<string | null>(null)
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [pages, setPages] = useState<Array<{
    id: string
    slug: string
    title: string
    content: string | null
    enabled: number
    show_in_nav: number
    nav_order: number
  }>>([])
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null)
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    industry: '',
    location: '',
    featured: false
  })
  const [uploadingPortfolioImage, setUploadingPortfolioImage] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<Array<{
    key: string
    filename: string
    url: string
    size: number
    uploaded: string
  }>>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  // Load pages
  useEffect(() => {
    const loadPages = async () => {
      try {
        const res = await fetch('/api/pages')
        const data = await res.json()
        if (Array.isArray(data)) setPages(data)
      } catch {
        // Ignore
      }
    }
    loadPages()
  }, [])

  // Load portfolio items
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio')
        const data = await res.json() as { items?: PortfolioItem[] }
        if (data.items) setPortfolioItems(data.items)
      } catch {
        // Ignore
      }
    }
    loadPortfolio()
  }, [])

  // Load media files when media tab is selected
  const loadMediaFiles = useCallback(async () => {
    setLoadingMedia(true)
    try {
      const res = await fetch('/api/files/list')
      const data = await res.json() as { files?: Array<{ key: string; filename: string; url: string; size: number; uploaded: string }> }
      if (data.files) setMediaFiles(data.files)
    } catch {
      // Ignore
    }
    setLoadingMedia(false)
  }, [])

  useEffect(() => {
    if (activeTab === 'media') {
      loadMediaFiles()
    }
  }, [activeTab, loadMediaFiles])

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/admin/site-config')
        const data = await res.json() as SiteConfig
        setConfig(data)
      } catch {
        // Use defaults if load fails
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  // Save config
  const saveConfig = async (updates: Partial<SiteConfig>) => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const updated = await res.json() as SiteConfig
        setConfig(updated)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    }
    setSaving(false)
  }

  // Handle photo upload
  const handlePhotoUpload = useCallback(async (slotId: string, file: File) => {
    setUploadingSlot(slotId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slotId', slotId)

      const res = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json() as { filename: string }
        // Update local state and save to database
        const updatedPhotos = config?.photos.map(p =>
          p.id === slotId
            ? { ...p, filename: data.filename, uploadedAt: new Date().toISOString() }
            : p
        ) || []

        setConfig(prev => prev ? { ...prev, photos: updatedPhotos } : null)

        // Persist to database
        await saveConfig({ photos: updatedPhotos })
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploadingSlot(null)
  }, [config, saveConfig])

  // Handle favicon upload
  const handleFaviconUpload = useCallback(async (file: File) => {
    setUploadingFavicon(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload-favicon', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json() as { filename: string; path: string }
        // Update local state
        setConfig(prev => prev ? {
          ...prev,
          seo: { ...prev.seo, favicon: data.path }
        } : null)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (err) {
      console.error('Favicon upload failed:', err)
      setSaveStatus('error')
    }
    setUploadingFavicon(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Failed to load configuration</p>
      </div>
    )
  }

  const tabs = [
    { id: 'header' as Tab, name: 'Header', icon: Bars3Icon },
    { id: 'footer' as Tab, name: 'Footer', icon: RectangleGroupIcon },
    { id: 'pages' as Tab, name: 'Pages', icon: DocumentTextIcon },
    { id: 'products' as Tab, name: 'Products', icon: CubeIcon },
    { id: 'industries' as Tab, name: 'Industries', icon: UserGroupIcon },
    { id: 'testimonials' as Tab, name: 'Reviews', icon: StarIcon },
    { id: 'photos' as Tab, name: 'Photos', icon: PhotoIcon },
    { id: 'media' as Tab, name: 'Media', icon: FolderIcon },
    { id: 'portfolio' as Tab, name: 'Portfolio', icon: PhotoIcon },
    { id: 'colors' as Tab, name: 'Colors', icon: SwatchIcon },
    { id: 'content' as Tab, name: 'Content', icon: DocumentTextIcon },
    { id: 'contact' as Tab, name: 'Contact', icon: PhoneIcon },
    { id: 'hours' as Tab, name: 'Hours', icon: ClockIcon },
    { id: 'social' as Tab, name: 'Social', icon: ShareIcon },
    { id: 'seo' as Tab, name: 'SEO', icon: MagnifyingGlassIcon },
  ]

  // Product management functions
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    if (!config) return
    const products = [...config.products]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= products.length) return

    // Swap
    [products[index], products[newIndex]] = [products[newIndex], products[index]]
    // Update order values
    products.forEach((p, i) => p.order = i)

    setConfig({ ...config, products })
    saveConfig({ products })
  }

  const toggleProduct = (id: string) => {
    if (!config) return
    const products = config.products.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    )
    setConfig({ ...config, products })
    saveConfig({ products })
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (!config) return
    const products = config.products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    )
    setConfig({ ...config, products })
  }

  const deleteProduct = (id: string) => {
    if (!config) return
    if (!confirm('Delete this product? This cannot be undone.')) return
    const products = config.products.filter(p => p.id !== id)
    products.forEach((p, i) => p.order = i)
    setConfig({ ...config, products })
    saveConfig({ products })
  }

  const addProduct = () => {
    if (!config) return
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'New Product',
      description: 'Description here',
      price: 'Quote based',
      enabled: false,
      hasDesigner: false,
      order: config.products.length,
    }
    const products = [...config.products, newProduct]
    setConfig({ ...config, products })
    setEditingProduct(newProduct.id)
  }

  // Industry management functions
  const toggleIndustry = (id: string) => {
    if (!config || !config.industries) return
    const industries = config.industries.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    )
    setConfig({ ...config, industries })
    saveConfig({ industries })
  }

  const updateIndustry = (id: string, updates: Partial<Industry>) => {
    if (!config || !config.industries) return
    const industries = config.industries.map(i =>
      i.id === id ? { ...i, ...updates } : i
    )
    setConfig({ ...config, industries })
  }

  const deleteIndustry = (id: string) => {
    if (!config || !config.industries) return
    if (!confirm('Delete this industry?')) return
    const industries = config.industries.filter(i => i.id !== id)
    setConfig({ ...config, industries })
    saveConfig({ industries })
  }

  const addIndustry = () => {
    if (!config) return
    const industries = config.industries || []
    const newIndustry: Industry = {
      id: `industry-${Date.now()}`,
      name: 'New Industry',
      icon: 'building',
      enabled: false,
    }
    const updated = [...industries, newIndustry]
    setConfig({ ...config, industries: updated })
    setEditingIndustry(newIndustry.id)
  }

  // Drag and drop for industries
  const handleIndustryDragStart = (id: string) => {
    setDraggedIndustry(id)
  }

  const handleIndustryDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== draggedIndustry) {
      setDragOverIndustry(id)
    }
  }

  const handleIndustryDragEnd = () => {
    if (!config || !draggedIndustry || !dragOverIndustry) {
      setDraggedIndustry(null)
      setDragOverIndustry(null)
      return
    }

    const industries = [...(config.industries || [])]
    const draggedIndex = industries.findIndex(i => i.id === draggedIndustry)
    const dropIndex = industries.findIndex(i => i.id === dragOverIndustry)

    if (draggedIndex !== -1 && dropIndex !== -1) {
      const [removed] = industries.splice(draggedIndex, 1)
      industries.splice(dropIndex, 0, removed)
      setConfig({ ...config, industries })
      saveConfig({ industries })
    }

    setDraggedIndustry(null)
    setDragOverIndustry(null)
  }

  const completedPhotos = config.photos?.filter(p => p.filename).length || 0
  const totalPhotos = config.photos?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Site Manager</h1>
              <p className="text-sm text-gray-500 mt-1">Control your website appearance and content</p>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircleIcon className="w-4 h-4" />
                  Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-600 text-sm">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  Error saving
                </span>
              )}
              {saving && (
                <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#6A8C8C] text-[#6A8C8C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
                {tab.id === 'photos' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    completedPhotos === totalPhotos
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {completedPhotos}/{totalPhotos}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                <p className="text-sm text-gray-500">Manage products shown on the order page. Drag to reorder.</p>
              </div>
              <button
                onClick={addProduct}
                className="flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {config.products
                .sort((a, b) => a.order - b.order)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl border p-4 transition-all ${
                      product.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
                    } ${editingProduct === product.id ? 'ring-2 ring-[#6A8C8C]' : ''}`}
                  >
                    {editingProduct === product.id ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                            <input
                              type="text"
                              value={product.price}
                              onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={product.hasDesigner}
                              onChange={(e) => updateProduct(product.id, { hasDesigner: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            Has built-in designer
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={product.isIndustrial || false}
                              onChange={(e) => updateProduct(product.id, { isIndustrial: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            Industrial (separate builder)
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              saveConfig({ products: config.products })
                              setEditingProduct(null)
                            }}
                            className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center gap-4">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveProduct(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUpIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveProduct(index, 'down')}
                            disabled={index === config.products.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Product info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            {product.hasDesigner && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Designer</span>
                            )}
                            {product.isIndustrial && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Industrial</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{product.description}</p>
                          <p className="text-sm text-[#6A8C8C] font-medium">{product.price}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleProduct(product.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.enabled
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={product.enabled ? 'Visible' : 'Hidden'}
                          >
                            {product.enabled ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => setEditingProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {config.products.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products yet. Add your first product to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Industries Tab */}
        {activeTab === 'industries' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Industries We Serve</h2>
                <p className="text-sm text-gray-500">Manage the industries shown on the home page.</p>
              </div>
              <button
                onClick={addIndustry}
                className="flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Industry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(config.industries || []).map((industry) => (
                <div
                  key={industry.id}
                  draggable={editingIndustry !== industry.id}
                  onDragStart={() => handleIndustryDragStart(industry.id)}
                  onDragOver={(e) => handleIndustryDragOver(e, industry.id)}
                  onDragEnd={handleIndustryDragEnd}
                  className={`bg-white rounded-xl border p-4 transition-all cursor-grab active:cursor-grabbing ${
                    industry.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'
                  } ${editingIndustry === industry.id ? 'ring-2 ring-[#6A8C8C] cursor-default' : ''} ${
                    dragOverIndustry === industry.id ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
                  } ${draggedIndustry === industry.id ? 'opacity-50' : ''}`}
                >
                  {editingIndustry === industry.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={industry.name}
                          onChange={(e) => updateIndustry(industry.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                        <select
                          value={industry.icon}
                          onChange={(e) => updateIndustry(industry.id, { icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          {ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            saveConfig({ industries: config.industries })
                            setEditingIndustry(null)
                          }}
                          className="px-3 py-1.5 bg-[#6A8C8C] text-white rounded-lg text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndustry(null)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A8C8C]/10 flex items-center justify-center">
                          <span className="text-xs text-[#6A8C8C] font-medium">{industry.icon.slice(0, 2)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{industry.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleIndustry(industry.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            industry.enabled
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={industry.enabled ? 'Visible' : 'Hidden'}
                        >
                          {industry.enabled ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingIndustry(industry.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteIndustry(industry.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!config.industries || config.industries.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No industries yet. Add industries to show on the home page.</p>
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Product Photos</h2>
              <p className="text-sm text-gray-500">Upload photos for each product. They are auto-processed with a warm, clean look.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {config.photos.map(slot => (
                <div
                  key={slot.id}
                  className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
                    slot.filename
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-[#6A8C8C]'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePhotoUpload(slot.id, file)
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />

                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
                    {slot.filename ? (
                      <img
                        src={`/api/files/${slot.filename}?t=${slot.uploadedAt}`}
                        alt={slot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PhotoIcon className="w-10 h-10 text-gray-300" />
                    )}

                    {uploadingSlot === slot.id && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <ArrowPathIcon className="w-6 h-6 text-[#6A8C8C] animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{slot.name}</h3>
                      <p className="text-xs text-gray-500">{slot.description}</p>
                    </div>
                    {slot.filename && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Brand Colors</h2>
              <p className="text-sm text-gray-500">Customize your site color palette. Changes apply site-wide.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(config.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => {
                          const newColors = { ...config.colors, [key]: e.target.value }
                          setConfig({ ...config, colors: newColors })
                        }}
                        className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          const newColors = { ...config.colors, [key]: e.target.value }
                          setConfig({ ...config, colors: newColors })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ colors: config.colors })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Colors'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Preview</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: config.colors.primary }}>
                  Primary Button
                </div>
                <div className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: config.colors.secondary }}>
                  Secondary
                </div>
                <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: config.colors.accent, color: config.colors.dark }}>
                  Accent
                </div>
                <div className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: config.colors.dark }}>
                  Dark
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Site Content</h2>
              <p className="text-sm text-gray-500">Edit headlines, taglines, and key text on your site.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={config.content.heroTitle}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, heroTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                <textarea
                  value={config.content.heroSubtitle}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, heroSubtitle: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={config.content.tagline}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, tagline: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={config.content.ctaText}
                    onChange={(e) => setConfig({
                      ...config,
                      content: { ...config.content, ctaText: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                  <input
                    type="text"
                    value={config.content.footerText}
                    onChange={(e) => setConfig({
                      ...config,
                      content: { ...config.content, footerText: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ content: config.content })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Content'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              <p className="text-sm text-gray-500">Update your contact details displayed on the site.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={config.contact.phone}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, phone: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, email: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address / Location</label>
                <input
                  type="text"
                  value={config.contact.address}
                  onChange={(e) => setConfig({
                    ...config,
                    contact: { ...config.contact, address: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={config.contact.city}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, city: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={config.contact.state}
                    onChange={(e) => setConfig({
                      ...config,
                      contact: { ...config.contact, state: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ contact: config.contact })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Contact Info'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-500">Manage testimonials shown on the home page.</p>
              </div>
              <button
                onClick={() => {
                  const testimonials = config.testimonials || []
                  const newTestimonial: Testimonial = {
                    id: `t-${Date.now()}`,
                    name: 'Customer Name',
                    company: 'Company',
                    text: 'Testimonial text here...',
                    enabled: false,
                  }
                  setConfig({ ...config, testimonials: [...testimonials, newTestimonial] })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Review
              </button>
            </div>

            <div className="space-y-4">
              {(config.testimonials || []).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-xl border p-5 ${testimonial.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <textarea
                        value={testimonial.text}
                        onChange={(e) => {
                          const testimonials = config.testimonials.map(t =>
                            t.id === testimonial.id ? { ...t, text: e.target.value } : t
                          )
                          setConfig({ ...config, testimonials })
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                        placeholder="What did they say?"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => {
                            const testimonials = config.testimonials.map(t =>
                              t.id === testimonial.id ? { ...t, name: e.target.value } : t
                            )
                            setConfig({ ...config, testimonials })
                          }}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={testimonial.company}
                          onChange={(e) => {
                            const testimonials = config.testimonials.map(t =>
                              t.id === testimonial.id ? { ...t, company: e.target.value } : t
                            )
                            setConfig({ ...config, testimonials })
                          }}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="Company"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const testimonials = config.testimonials.map(t =>
                            t.id === testimonial.id ? { ...t, enabled: !t.enabled } : t
                          )
                          setConfig({ ...config, testimonials })
                          saveConfig({ testimonials })
                        }}
                        className={`p-2 rounded-lg transition-colors ${testimonial.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {testimonial.enabled ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm('Delete this review?')) return
                          const testimonials = config.testimonials.filter(t => t.id !== testimonial.id)
                          setConfig({ ...config, testimonials })
                          saveConfig({ testimonials })
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(config.testimonials || []).length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => saveConfig({ testimonials: config.testimonials })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Reviews'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hours Tab */}
        {activeTab === 'hours' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Business Hours</h2>
              <p className="text-sm text-gray-500">Set your availability.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Text (shown in header)</label>
                <input
                  type="text"
                  value={config.hours?.display || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    hours: { ...config.hours, display: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="e.g., Flexible hours for local businesses"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium text-gray-700 capitalize">{day}</span>
                    <input
                      type="text"
                      value={(config.hours as unknown as Record<string, string>)?.[day] || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        hours: { ...config.hours, [day]: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="9am - 5pm"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ hours: config.hours })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Hours'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              <p className="text-sm text-gray-500">Add your social media profiles. Leave blank to hide.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              {[
                { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/vurmz' },
                { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/vurmz' },
                { key: 'google', label: 'Google Business', placeholder: 'https://g.page/vurmz' },
                { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/vurmz' },
                { key: 'yelp', label: 'Yelp', placeholder: 'https://yelp.com/biz/vurmz' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type="url"
                    value={(config.social as unknown as Record<string, string>)?.[key] || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      social: { ...config.social, [key]: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ social: config.social })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
              <p className="text-sm text-gray-500">Optimize how your site appears in search results and social shares.</p>
            </div>

            {/* Favicon Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Site Favicon</h3>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    {config.seo?.favicon ? (
                      <img
                        src={`${config.seo.favicon}?t=${Date.now()}`}
                        alt="Current favicon"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">No favicon</span>
                    )}
                  </div>
                  {uploadingFavicon && (
                    <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                      <ArrowPathIcon className="w-6 h-6 text-[#6A8C8C] animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a square image (PNG, SVG, or ICO). It will appear in browser tabs and bookmarks.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                    <PhotoIcon className="w-4 h-4" />
                    Upload Favicon
                    <input
                      type="file"
                      accept="image/png,image/svg+xml,image/x-icon,.ico,.svg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFaviconUpload(file)
                      }}
                      className="hidden"
                    />
                  </label>
                  {config.seo?.favicon && (
                    <p className="text-xs text-gray-500 mt-2">Current: {config.seo.favicon}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                <input
                  type="text"
                  value={config.seo?.siteTitle || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    seo: { ...config.seo, siteTitle: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="VURMZ | Laser Engraving in Centennial, Colorado"
                />
                <p className="text-xs text-gray-500 mt-1">Shows in browser tab and search results</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={config.seo?.siteDescription || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    seo: { ...config.seo, siteDescription: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
                  placeholder="Professional laser engraving services..."
                />
                <p className="text-xs text-gray-500 mt-1">Shows in search results. Keep under 160 characters.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={config.seo?.keywords || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    seo: { ...config.seo, keywords: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  placeholder="laser engraving, Centennial Colorado, equipment nameplates..."
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for search engines</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => saveConfig({ seo: config.seo })}
                  disabled={saving}
                  className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Tab */}
        {activeTab === 'header' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Header & Navigation</h2>
              <p className="text-sm text-gray-500">Customize your site header, logo, and navigation links.</p>
            </div>

            <div className="space-y-6">
              {/* Logo */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Logo</h3>
                <div className="flex items-center gap-4">
                  <div className="w-40 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {config.header?.logoUrl ? (
                      <img src={config.header.logoUrl} alt="Logo" className="h-8 object-contain" />
                    ) : (
                      <span className="text-gray-400 text-sm">No logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={config.header?.logoUrl || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        header: { ...prev.header, logoUrl: e.target.value }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="/images/logo.svg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Path to your logo image</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">CTA Button</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={config.header?.ctaText || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        header: { ...prev.header, ctaText: e.target.value }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Start Order"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={config.header?.ctaLink || ''}
                      onChange={(e) => setConfig(prev => prev ? {
                        ...prev,
                        header: { ...prev.header, ctaLink: e.target.value }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="/order"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Navigation Links</h3>
                  <button
                    onClick={() => {
                      const navItems = config.header?.navItems || []
                      const newItem: NavItem = {
                        id: `nav-${Date.now()}`,
                        label: 'New Link',
                        href: '/',
                        enabled: true,
                        order: navItems.length,
                      }
                      setConfig(prev => prev ? {
                        ...prev,
                        header: { ...prev.header, navItems: [...navItems, newItem] }
                      } : null)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#6A8C8C] text-white rounded-lg text-sm font-medium"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {(config.header?.navItems || [])
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${item.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              const navItems = [...(config.header?.navItems || [])]
                              if (index > 0) {
                                [navItems[index], navItems[index - 1]] = [navItems[index - 1], navItems[index]]
                                navItems.forEach((n, i) => n.order = i)
                                setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                              }
                            }}
                            disabled={index === 0}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUpIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const navItems = [...(config.header?.navItems || [])]
                              if (index < navItems.length - 1) {
                                [navItems[index], navItems[index + 1]] = [navItems[index + 1], navItems[index]]
                                navItems.forEach((n, i) => n.order = i)
                                setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                              }
                            }}
                            disabled={index === (config.header?.navItems || []).length - 1}
                            className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const navItems = (config.header?.navItems || []).map(n =>
                              n.id === item.id ? { ...n, label: e.target.value } : n
                            )
                            setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                          }}
                          className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                          placeholder="Label"
                        />

                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const navItems = (config.header?.navItems || []).map(n =>
                              n.id === item.id ? { ...n, href: e.target.value } : n
                            )
                            setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                          }}
                          className="w-32 px-2 py-1 border border-gray-200 rounded text-sm font-mono"
                          placeholder="/path"
                        />

                        <button
                          onClick={() => {
                            const navItems = (config.header?.navItems || []).map(n =>
                              n.id === item.id ? { ...n, enabled: !n.enabled } : n
                            )
                            setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                          }}
                          className={`p-1.5 rounded ${item.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          {item.enabled ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => {
                            const navItems = (config.header?.navItems || []).filter(n => n.id !== item.id)
                            setConfig(prev => prev ? { ...prev, header: { ...prev.header, navItems } } : null)
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <button
                onClick={() => saveConfig({ header: config.header })}
                disabled={saving}
                className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Header'}
              </button>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
              <p className="text-sm text-gray-500">Customize your site footer content and links.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Copyright Text</h3>
                <input
                  type="text"
                  value={config.footer?.copyrightText || ''}
                  onChange={(e) => setConfig(prev => prev ? {
                    ...prev,
                    footer: { ...prev.footer, copyrightText: e.target.value }
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="© 2026 Your Company. All rights reserved."
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Footer Links</h3>
                  <button
                    onClick={() => {
                      const links = config.footer?.links || []
                      const newLink: FooterLink = {
                        id: `link-${Date.now()}`,
                        label: 'New Link',
                        href: '/',
                        enabled: true,
                      }
                      setConfig(prev => prev ? {
                        ...prev,
                        footer: { ...prev.footer, links: [...links, newLink] }
                      } : null)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#6A8C8C] text-white rounded-lg text-sm font-medium"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {(config.footer?.links || []).map((link) => (
                    <div
                      key={link.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${link.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                    >
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const links = (config.footer?.links || []).map(l =>
                            l.id === link.id ? { ...l, label: e.target.value } : l
                          )
                          setConfig(prev => prev ? { ...prev, footer: { ...prev.footer, links } } : null)
                        }}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                        placeholder="Label"
                      />

                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const links = (config.footer?.links || []).map(l =>
                            l.id === link.id ? { ...l, href: e.target.value } : l
                          )
                          setConfig(prev => prev ? { ...prev, footer: { ...prev.footer, links } } : null)
                        }}
                        className="w-32 px-2 py-1 border border-gray-200 rounded text-sm font-mono"
                        placeholder="/path"
                      />

                      <button
                        onClick={() => {
                          const links = (config.footer?.links || []).map(l =>
                            l.id === link.id ? { ...l, enabled: !l.enabled } : l
                          )
                          setConfig(prev => prev ? { ...prev, footer: { ...prev.footer, links } } : null)
                        }}
                        className={`p-1.5 rounded ${link.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {link.enabled ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          const links = (config.footer?.links || []).filter(l => l.id !== link.id)
                          setConfig(prev => prev ? { ...prev, footer: { ...prev.footer, links } } : null)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.footer?.showSocial ?? true}
                    onChange={(e) => setConfig(prev => prev ? {
                      ...prev,
                      footer: { ...prev.footer, showSocial: e.target.checked }
                    } : null)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Show social media links in footer</span>
                </label>
              </div>

              <button
                onClick={() => saveConfig({ footer: config.footer })}
                disabled={saving}
                className="px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Footer'}
              </button>
            </div>
          </div>
        )}

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
              <p className="text-sm text-gray-500">Upload and manage images for use across your site.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <FolderIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Drag and drop images here, or click to upload</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium cursor-pointer hover:bg-[#5A7A7A] transition-colors">
                  {uploadingMedia ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )}
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files
                      if (!files) return
                      setUploadingMedia(true)
                      for (const file of Array.from(files)) {
                        const formData = new FormData()
                        formData.append('file', file)
                        try {
                          await fetch('/api/files/upload', {
                            method: 'POST',
                            body: formData,
                          })
                        } catch (err) {
                          console.error('Upload failed:', err)
                        }
                      }
                      setUploadingMedia(false)
                      loadMediaFiles()
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {loadingMedia ? (
                <div className="text-center py-8">
                  <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
                  <p className="text-gray-500 mt-2">Loading media...</p>
                </div>
              ) : mediaFiles.length > 0 ? (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Your Files ({mediaFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaFiles.map((file) => (
                      <div key={file.key} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`https://vurmz.com${file.url}`)
                              setSaveStatus('saved')
                              setTimeout(() => setSaveStatus('idle'), 2000)
                            }}
                            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                            title="Copy URL"
                          >
                            <DocumentTextIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this file?')) return
                              try {
                                await fetch(`/api/files/${file.key}`, { method: 'DELETE' })
                                loadMediaFiles()
                              } catch (err) {
                                console.error('Delete failed:', err)
                              }
                            }}
                            className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{file.filename}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No files uploaded yet. Upload images above to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
              <p className="text-sm text-gray-500">Create and manage custom pages for your site.</p>
            </div>

            <div className="space-y-6">
              {/* Create New Page */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Create New Page</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={newPageTitle}
                      onChange={(e) => {
                        setNewPageTitle(e.target.value)
                        setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="About Us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm mr-1">/</span>
                      <input
                        type="text"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                        placeholder="about-us"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!newPageTitle || !newPageSlug) return
                    try {
                      const res = await fetch('/api/pages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newPageTitle, slug: newPageSlug }),
                      })
                      if (res.ok) {
                        const data = await res.json() as { id: string; slug: string; title: string }
                        setPages(prev => [...prev, { id: data.id, slug: data.slug, title: data.title, content: '', enabled: 1, show_in_nav: 0, nav_order: 0 }])
                        setNewPageTitle('')
                        setNewPageSlug('')
                      }
                    } catch (err) {
                      console.error('Failed to create page:', err)
                    }
                  }}
                  disabled={!newPageTitle || !newPageSlug}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Page
                </button>
              </div>

              {/* Existing Pages */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Your Pages</h3>
                {pages.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No custom pages yet. Create one above.</p>
                ) : (
                  <div className="space-y-3">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${page.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                      >
                        <div className="flex-1">
                          {editingPage === page.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={page.title}
                                onChange={(e) => setPages(prev => prev.map(p =>
                                  p.id === page.id ? { ...p, title: e.target.value } : p
                                ))}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              />
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400 text-sm">/</span>
                                <input
                                  type="text"
                                  value={page.slug}
                                  onChange={(e) => setPages(prev => prev.map(p =>
                                    p.id === page.id ? { ...p, slug: e.target.value } : p
                                  ))}
                                  className="w-32 px-2 py-1 border border-gray-200 rounded text-sm font-mono"
                                />
                              </div>
                              <textarea
                                value={page.content || ''}
                                onChange={(e) => setPages(prev => prev.map(p =>
                                  p.id === page.id ? { ...p, content: e.target.value } : p
                                ))}
                                rows={6}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                placeholder="Page content (HTML or plain text)"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900">{page.title}</p>
                              <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={page.show_in_nav === 1}
                              onChange={(e) => setPages(prev => prev.map(p =>
                                p.id === page.id ? { ...p, show_in_nav: e.target.checked ? 1 : 0 } : p
                              ))}
                              className="rounded border-gray-300"
                            />
                            <span className="text-gray-600">Nav</span>
                          </label>

                          <button
                            onClick={() => setPages(prev => prev.map(p =>
                              p.id === page.id ? { ...p, enabled: p.enabled ? 0 : 1 } : p
                            ))}
                            className={`p-1.5 rounded ${page.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          >
                            {page.enabled ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => {
                              if (editingPage === page.id) {
                                // Save changes
                                fetch(`/api/pages/${page.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(page),
                                })
                                setEditingPage(null)
                              } else {
                                setEditingPage(page.id)
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            {editingPage === page.id ? <CheckCircleIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={async () => {
                              if (confirm('Delete this page?')) {
                                await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
                                setPages(prev => prev.filter(p => p.id !== page.id))
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Pages will be accessible at vurmz.com/p/[slug]. Enable &quot;Nav&quot; to add the page to site navigation.
              </p>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
              <p className="text-sm text-gray-500">Manage portfolio items displayed on your site.</p>
            </div>

            <div className="space-y-6">
              {/* Add New Portfolio Item */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Add New Portfolio Item</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newPortfolio.title}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Metal Business Cards"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Business Cards"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newPortfolio.description}
                    onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Anodized aluminum cards for local contractor..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry (optional)</label>
                    <input
                      type="text"
                      value={newPortfolio.industry}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="HVAC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                    <input
                      type="text"
                      value={newPortfolio.location}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Denver, CO"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="flex items-center gap-4">
                    {newPortfolio.image_url ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img src={newPortfolio.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setNewPortfolio(prev => ({ ...prev, image_url: '' }))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        {uploadingPortfolioImage ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <PhotoIcon className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingPortfolioImage(true)
                            try {
                              const formData = new FormData()
                              formData.append('file', file)
                              const res = await fetch('/api/files/upload', {
                                method: 'POST',
                                body: formData,
                              })
                              if (res.ok) {
                                const data = await res.json() as { url: string }
                                setNewPortfolio(prev => ({ ...prev, image_url: data.url }))
                              }
                            } catch (err) {
                              console.error('Upload failed:', err)
                            }
                            setUploadingPortfolioImage(false)
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPortfolio.featured}
                      onChange={(e) => setNewPortfolio(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Featured item</span>
                  </label>
                </div>
                <button
                  onClick={async () => {
                    if (!newPortfolio.title || !newPortfolio.image_url || !newPortfolio.category) return
                    try {
                      const res = await fetch('/api/portfolio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newPortfolio),
                      })
                      if (res.ok) {
                        const data = await res.json() as { id: string }
                        setPortfolioItems(prev => [{
                          id: data.id,
                          title: newPortfolio.title,
                          description: newPortfolio.description || null,
                          image_url: newPortfolio.image_url,
                          category: newPortfolio.category,
                          industry: newPortfolio.industry || null,
                          location: newPortfolio.location || null,
                          featured: newPortfolio.featured ? 1 : 0,
                        }, ...prev])
                        setNewPortfolio({
                          title: '',
                          description: '',
                          image_url: '',
                          category: '',
                          industry: '',
                          location: '',
                          featured: false
                        })
                        setSaveStatus('saved')
                        setTimeout(() => setSaveStatus('idle'), 2000)
                      }
                    } catch (err) {
                      console.error('Failed to create portfolio item:', err)
                      setSaveStatus('error')
                    }
                  }}
                  disabled={!newPortfolio.title || !newPortfolio.image_url || !newPortfolio.category}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6A8C8C] text-white rounded-lg font-medium hover:bg-[#5A7A7A] transition-colors disabled:opacity-50"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Portfolio Item
                </button>
              </div>

              {/* Existing Portfolio Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Your Portfolio ({portfolioItems.length} items)</h3>
                {portfolioItems.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No portfolio items yet. Add one above.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200"
                      >
                        <div className="aspect-square bg-gray-100">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        {item.featured === 1 && (
                          <div className="absolute top-2 left-2 bg-[#6A8C8C] text-white text-xs px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingPortfolio(editingPortfolio === item.id ? null : item.id)}
                            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this portfolio item?')) return
                              try {
                                await fetch(`/api/portfolio/${item.id}`, { method: 'DELETE' })
                                setPortfolioItems(prev => prev.filter(p => p.id !== item.id))
                                setSaveStatus('saved')
                                setTimeout(() => setSaveStatus('idle'), 2000)
                              } catch (err) {
                                console.error('Failed to delete:', err)
                                setSaveStatus('error')
                              }
                            }}
                            className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-[#6A8C8C] font-medium uppercase">{item.category}</p>
                          <p className="font-medium text-gray-900 text-sm truncate">{item.title}</p>
                        </div>
                        {editingPortfolio === item.id && (
                          <div className="absolute inset-0 bg-white p-4 overflow-auto">
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => setPortfolioItems(prev => prev.map(p =>
                                    p.id === item.id ? { ...p, title: e.target.value } : p
                                  ))}
                                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                                <input
                                  type="text"
                                  value={item.category}
                                  onChange={(e) => setPortfolioItems(prev => prev.map(p =>
                                    p.id === item.id ? { ...p, category: e.target.value } : p
                                  ))}
                                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  value={item.description || ''}
                                  onChange={(e) => setPortfolioItems(prev => prev.map(p =>
                                    p.id === item.id ? { ...p, description: e.target.value } : p
                                  ))}
                                  rows={2}
                                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                                />
                              </div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={item.featured === 1}
                                  onChange={(e) => setPortfolioItems(prev => prev.map(p =>
                                    p.id === item.id ? { ...p, featured: e.target.checked ? 1 : 0 } : p
                                  ))}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700">Featured</span>
                              </label>
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/portfolio/${item.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(item),
                                      })
                                      setEditingPortfolio(null)
                                      setSaveStatus('saved')
                                      setTimeout(() => setSaveStatus('idle'), 2000)
                                    } catch (err) {
                                      console.error('Failed to update:', err)
                                      setSaveStatus('error')
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-[#6A8C8C] text-white rounded text-sm font-medium hover:bg-[#5A7A7A]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingPortfolio(null)}
                                  className="px-3 py-1.5 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
