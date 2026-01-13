'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { MagnifyingGlassIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  city: string | null
  state: string | null
  _count: {
    quotes: number
    orders: number
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : '/api/customers'
    fetch(url)
      .then(res => res.json() as Promise<Customer[]>)
      .then(data => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading customers:', err)
        setLoading(false)
      })
  }, [search])

  return (
    <AdminShell title="Customers">
      <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none"
            />
          </div>
          <Link
            href="/admin/customers/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5" />
            Add Customer
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No customers found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Company</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Quotes</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Orders</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{customer.name}</td>
                    <td className="px-6 py-4 text-sm">{customer.company || '-'}</td>
                    <td className="px-6 py-4 text-sm">{customer.email}</td>
                    <td className="px-6 py-4 text-sm">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      {customer.city ? `${customer.city}, ${customer.state}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">{customer._count.quotes}</td>
                    <td className="px-6 py-4 text-sm">{customer._count.orders}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-gray-600 hover:text-black"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
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
