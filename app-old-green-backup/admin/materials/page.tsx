'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Material {
  id: string
  name: string
  description: string | null
  costPerUnit: number
  unit: string
  quantityInStock: number
  lowStockThreshold: number
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <AdminShell title="Materials">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex justify-end">
          <button
            className="flex items-center gap-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5" />
            Add Material
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No materials found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cost</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Unit</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">In Stock</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Low Threshold</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{material.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{material.description || '-'}</td>
                    <td className="px-6 py-4 text-sm">${material.costPerUnit.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{material.unit}</td>
                    <td className="px-6 py-4 text-sm font-medium">{material.quantityInStock}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{material.lowStockThreshold}</td>
                    <td className="px-6 py-4">
                      {isLowStock(material) ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
