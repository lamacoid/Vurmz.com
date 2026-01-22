'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

/*
 * AccountForm Component
 *
 * Profile management for VURMZ customers.
 * Stores email, business info, contact details, and logo uploads.
 * Modern Scandinavian Frutiger Aero aesthetic.
 */

const liquidEasing = [0.23, 1, 0.32, 1] as [number, number, number, number]

interface User {
  email: string
  businessName: string
  phone: string
  address: string
  logos: string[]
}

interface AccountFormProps {
  user: User | null
  onSave: (user: User) => void
  onLogout: () => void
}

interface LogoUploadProps {
  index: number
  logoUrl: string | null
  onUpload: (index: number, file: File) => void
  onRemove: (index: number) => void
}

function LogoUpload({ index, logoUrl, onUpload, onRemove }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(index, file)
    }
  }, [index, onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(index, file)
    }
  }

  return (
    <motion.div
      className={`
        relative w-full aspect-[3/2] rounded-2xl overflow-hidden
        border-2 border-dashed transition-all duration-300
        ${isDragOver
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-wash)]'
          : logoUrl
            ? 'border-transparent bg-[var(--color-cream)]'
            : 'border-[rgba(106,140,140,0.2)] bg-[var(--color-cream)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-mist)]'
        }
      `}
      whileHover={{ scale: logoUrl ? 1 : 1.02 }}
      transition={{ duration: 0.3, ease: liquidEasing }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {logoUrl ? (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: liquidEasing }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={`Logo ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-[var(--color-dark)]/60 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity"
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(index)}
                className="text-white hover:text-[var(--color-error)]"
              >
                Remove
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: liquidEasing }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              className="w-12 h-12 rounded-xl bg-[var(--color-primary-wash)] flex items-center justify-center text-[var(--color-primary)]"
              animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </motion.div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-[var(--color-dark)]">
                {isDragOver ? 'Drop logo here' : `Upload Logo ${index + 1}`}
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                PNG, SVG, or JPG
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AccountForm({ user, onSave, onLogout }: AccountFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'logos'>('profile')

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [logos, setLogos] = useState<(string | null)[]>(user?.logos || [null, null])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (!isEditing) setIsEditing(true)
  }

  const handleLogoUpload = (index: number, file: File) => {
    // Create a local URL for preview (in real app, upload to server)
    const url = URL.createObjectURL(file)
    const newLogos = [...logos]
    newLogos[index] = url
    setLogos(newLogos)
    if (!isEditing) setIsEditing(true)
  }

  const handleLogoRemove = (index: number) => {
    const newLogos = [...logos]
    if (newLogos[index]) {
      URL.revokeObjectURL(newLogos[index]!)
    }
    newLogos[index] = null
    setLogos(newLogos)
    if (!isEditing) setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    onSave({
      ...formData,
      logos: logos.filter((l): l is string => l !== null),
    })

    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      email: user?.email || '',
      businessName: user?.businessName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    })
    setLogos(user?.logos?.length ? user.logos.map(l => l || null) : [null, null])
    setIsEditing(false)
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
    { id: 'logos' as const, label: 'Logos', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )},
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Account Header */}
      <FadeIn>
        <Card variant="elevated" className="mb-6 overflow-hidden">
          <div className="relative p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                  {formData.businessName?.[0]?.toUpperCase() || formData.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {formData.businessName || 'Your Business'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {formData.email || 'Set up your account'}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Tab Navigation */}
      <FadeIn delay={0.1}>
        <div className="flex gap-2 mb-6 p-1.5 bg-[var(--color-cream)] rounded-2xl border border-[rgba(106,140,140,0.1)]">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium
                transition-colors relative
                ${activeTab === tab.id
                  ? 'text-[var(--color-dark)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-dark)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-xl shadow-[var(--shadow-sm)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: liquidEasing }}
          >
            <Card variant="elevated" className="p-6">
              <StaggerContainer className="space-y-6">
                <StaggerItem>
                  <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Business Information
                  </h3>
                </StaggerItem>

                <StaggerItem>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </StaggerItem>

                <StaggerItem>
                  <Input
                    label="Business Name"
                    type="text"
                    placeholder="Your Company LLC"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z" />
                      </svg>
                    }
                  />
                </StaggerItem>

                <StaggerItem>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    }
                  />
                </StaggerItem>

                <StaggerItem>
                  <Textarea
                    label="Business Address"
                    placeholder="123 Main St, Suite 100&#10;Denver, CO 80000"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    hint="Used for delivery and invoicing"
                  />
                </StaggerItem>
              </StaggerContainer>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="logos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: liquidEasing }}
          >
            <Card variant="elevated" className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-dark)] mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Your Logos
                </h3>
                <p className="text-[var(--color-medium)] text-sm">
                  Upload up to 2 logos for quick reuse on orders. Supported formats: PNG, SVG, JPG.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0, 1].map((index) => (
                  <FadeIn key={index} delay={index * 0.1}>
                    <LogoUpload
                      index={index}
                      logoUrl={logos[index] || null}
                      onUpload={handleLogoUpload}
                      onRemove={handleLogoRemove}
                    />
                  </FadeIn>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[var(--color-primary-mist)] rounded-xl border border-[rgba(106,140,140,0.1)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-wash)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      Logo Tips
                    </p>
                    <p className="text-sm text-[var(--color-medium)] mt-0.5">
                      Vector files (SVG) work best for laser engraving. High contrast logos produce the clearest results.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save/Cancel Actions */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: liquidEasing }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-white)] border-t border-[rgba(106,140,140,0.1)] shadow-[0_-4px_20px_rgba(61,68,65,0.08)] z-40"
          >
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-medium)]">
                You have unsaved changes
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  }
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
