'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'
import { motion } from 'framer-motion'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  TruckIcon,
  LockClosedIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

interface Settings {
  id: string
  businessName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  serviceRadius: number
  minOrderFreeDelivery: number
  deliveryFee: number
  salesTaxRate: number
  businessHours: string
}

const liquidEase = [0.23, 1, 0.32, 1] as const

const glassCard = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  border: '1px solid rgba(106,140,140,0.08)',
}

const inputStyle = {
  background: 'rgba(106,140,140,0.04)',
  border: '1px solid rgba(106,140,140,0.12)',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)


  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json() as Promise<Settings>)
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading settings:', err)
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return
    const { name, value, type } = e.target
    setSettings({
      ...settings,
      [name]: type === 'number' ? parseFloat(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    setSaveSuccess(false)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Settings">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
        </div>
      </AdminShell>
    )
  }

  if (!settings) {
    return (
      <AdminShell title="Settings">
        <div className="py-20 text-center text-red-500">Failed to load settings</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Settings">
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: liquidEase }}
            className="rounded-2xl p-6"
            style={glassCard}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(106,140,140,0.1)', border: '1px solid rgba(106,140,140,0.15)' }}
              >
                <BuildingOfficeIcon className="h-5 w-5 text-[#6a8c8c]" />
              </div>
              <h2 className="font-semibold text-gray-800">Business Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Business Hours</label>
                <input
                  type="text"
                  name="businessHours"
                  value={settings.businessHours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
            className="rounded-2xl p-6"
            style={glassCard}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(140,174,196,0.1)', border: '1px solid rgba(140,174,196,0.15)' }}
              >
                <MapPinIcon className="h-5 w-5 text-[#8caec4]" />
              </div>
              <h2 className="font-semibold text-gray-800">Address</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={settings.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={settings.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={settings.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery & Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: liquidEase }}
            className="rounded-2xl p-6"
            style={glassCard}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <TruckIcon className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-800">Delivery & Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Service Radius (miles)</label>
                <input
                  type="number"
                  name="serviceRadius"
                  value={settings.serviceRadius}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Min Order for Free Delivery</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="minOrderFreeDelivery"
                    value={settings.minOrderFreeDelivery}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={settings.deliveryFee}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Sales Tax Rate</label>
                <input
                  type="number"
                  step="0.0001"
                  name="salesTaxRate"
                  value={settings.salesTaxRate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                  style={inputStyle}
                />
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
          >
            <button
              type="submit"
              disabled={saving}
              className="relative px-8 py-3.5 rounded-xl text-white font-medium overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)',
                boxShadow: '0 4px 12px rgba(106,140,140,0.25)',
              }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving...
                </span>
              ) : saveSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5" />
                  Saved!
                </span>
              ) : (
                'Save Settings'
              )}
            </button>
          </motion.div>
        </form>

        {/* Authentication Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: liquidEase }}
          className="rounded-2xl p-6"
          style={glassCard}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="p-2.5 rounded-xl"
              style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.15)' }}
            >
              <LockClosedIcon className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-800">Authentication</h2>
          </div>
          <p className="text-sm text-gray-600">
            Admin login uses magic links sent to your email. No password required — just enter your admin email at the login screen and check your inbox for a secure link.
          </p>
        </motion.div>
      </div>
    </AdminShell>
  )
}
