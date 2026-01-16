'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminShell from '@/components/AdminShell'
import {
  PlusIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

interface Material {
  id: string
  name: string
  description: string | null
  costPerUnit: number
  unit: string
  quantityInStock: number
  lowStockThreshold: number
}

const glassCard = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  border: '1px solid rgba(106,140,140,0.08)',
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/materials')
      .then(res => res.json() as Promise<Material[]>)
      .then(data => {
        setMaterials(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading materials:', err)
        setLoading(false)
      })
  }, [])

  const isLowStock = (material: Material) => {
    return material.quantityInStock <= material.lowStockThreshold
  }

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return materials
    const query = searchQuery.toLowerCase()
    return materials.filter(material =>
      material.name.toLowerCase().includes(query) ||
      (material.description && material.description.toLowerCase().includes(query)) ||
      material.unit.toLowerCase().includes(query)
    )
  }, [materials, searchQuery])

  const stats = useMemo(() => {
    const totalMaterials = materials.length
    const lowStockCount = materials.filter(isLowStock).length
    const totalValue = materials.reduce((sum, m) => sum + (m.costPerUnit * m.quantityInStock), 0)
    return { totalMaterials, lowStockCount, totalValue }
  }, [materials])

  return (
    <AdminShell title="Materials">
      <div className="space-y-6">
        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: liquidEase }}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between"
        >
          {/* Search Bar */}
          <div
            className="relative flex-1 max-w-md rounded-xl overflow-hidden"
            style={glassCard}
          >
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6a8c8c]" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-[#2c3c3c] placeholder:text-[#6a8c8c]/60"
            />
          </div>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-[#2c3c3c] text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:bg-[#3d4d4d] transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Material
          </motion.button>
        </motion.div>

        {/* Materials Table/Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: liquidEase, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={glassCard}
        >
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <CubeIcon className="h-8 w-8 text-[#6a8c8c]" />
              </motion.div>
              <p className="mt-4 text-[#6a8c8c]">Loading materials...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: liquidEase }}
              className="p-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6a8c8c]/10 mb-4">
                <ArchiveBoxIcon className="h-8 w-8 text-[#6a8c8c]" />
              </div>
              <h3 className="text-lg font-medium text-[#2c3c3c] mb-2">
                {searchQuery ? 'No materials found' : 'No materials yet'}
              </h3>
              <p className="text-[#6a8c8c]">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Add your first material to get started'}
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#6a8c8c]/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Cost</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Unit</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">In Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Threshold</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#6a8c8c] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredMaterials.map((material, index) => (
                      <motion.tr
                        key={material.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.4,
                          ease: liquidEase,
                          delay: index * 0.05
                        }}
                        whileHover={{ backgroundColor: 'rgba(106,140,140,0.04)' }}
                        className="border-b border-[#6a8c8c]/5 last:border-b-0 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#2c3c3c]">{material.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6a8c8c]">
                          {material.description || <span className="italic opacity-50">No description</span>}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2c3c3c]">
                          ${material.costPerUnit.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6a8c8c]">{material.unit}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${
                            isLowStock(material) ? 'text-amber-600' : 'text-[#2c3c3c]'
                          }`}>
                            {material.quantityInStock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#6a8c8c]">{material.lowStockThreshold}</td>
                        <td className="px-6 py-4">
                          {isLowStock(material) ? (
                            <motion.span
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200/50"
                            >
                              <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                              Low Stock
                            </motion.span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/50">
                              In Stock
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {!loading && materials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: liquidEase, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div
              className="rounded-xl p-4 text-center"
              style={glassCard}
            >
              <p className="text-sm text-[#6a8c8c] mb-1">Total Materials</p>
              <p className="text-2xl font-semibold text-[#2c3c3c]">{stats.totalMaterials}</p>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={glassCard}
            >
              <p className="text-sm text-[#6a8c8c] mb-1">Low Stock Items</p>
              <p className={`text-2xl font-semibold ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {stats.lowStockCount}
              </p>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={glassCard}
            >
              <p className="text-sm text-[#6a8c8c] mb-1">Total Inventory Value</p>
              <p className="text-2xl font-semibold text-[#2c3c3c]">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </AdminShell>
  )
}
