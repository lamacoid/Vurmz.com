'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  industry: string
  location: string
  imageUrl?: string
}

interface Category {
  id: string
  label: string
}

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  categories: Category[]
}

export default function PortfolioGallery({ items, categories }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-vurmz-teal text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-gray-500 text-sm mb-6 text-center">
        Showing {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'}
        {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
      </p>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative">
            {/* Image Container */}
            <div className="aspect-square bg-gray-200 overflow-hidden relative">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">
                      {item.category === 'Culinary' && '🍴'}
                      {item.category === 'Medical/Dental' && '⚕️'}
                      {item.category === 'Trade Tools' && '🔧'}
                      {item.category === 'Business Items' && '💼'}
                      {item.category === 'Custom Projects' && '✨'}
                    </div>
                    <p className="text-sm">Photo coming soon</p>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-vurmz-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  href="/order"
                  className="bg-vurmz-teal text-white px-6 py-3 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 inline-flex items-center gap-2"
                >
                  Want something like this?
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Item Info */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-vurmz-teal/10 text-vurmz-teal px-2 py-1">
                  {item.category}
                </span>
              </div>
              <h3 className="font-semibold text-vurmz-dark mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{item.industry}</span>
                <span>•</span>
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No projects in this category yet.</p>
          <Link
            href="/order"
            className="text-vurmz-teal font-medium hover:underline"
          >
            Be the first - request a quote
          </Link>
        </div>
      )}
    </div>
  )
}
