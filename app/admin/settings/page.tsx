'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      alert('Settings saved!')
    } catch (err) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    setPasswordSaving(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await res.json() as { success?: boolean; error?: string; message?: string }

      if (!res.ok) {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' })
      } else {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <AdminShell title="Settings">
      {loading ? (
        <div className="text-gray-500">Loading settings...</div>
      ) : !settings ? (
        <div className="text-red-500">Failed to load settings</div>
      ) : (
        <>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {/* Business Info */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Hours</label>
                <input
                  type="text"
                  name="businessHours"
                  value={settings.businessHours}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={settings.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={settings.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={settings.zip}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Pricing */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Radius (miles)</label>
                <input
                  type="number"
                  name="serviceRadius"
                  value={settings.serviceRadius}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Order for Free Delivery ($)</label>
                <input
                  type="number"
                  name="minOrderFreeDelivery"
                  value={settings.minOrderFreeDelivery}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Fee ($)</label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sales Tax Rate</label>
                <input
                  type="number"
                  step="0.0001"
                  name="salesTaxRate"
                  value={settings.salesTaxRate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Password Change Section */}
        <form onSubmit={handlePasswordChange} className="max-w-2xl mt-8">
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            {passwordMessage && (
              <div className={`mb-4 p-3 text-sm ${
                passwordMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="mt-4 bg-vurmz-teal text-white px-6 py-2 font-semibold hover:bg-vurmz-teal-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {passwordSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
        </>
      )}
    </AdminShell>
  )
}
