import { MetadataRoute } from 'next'
import { portfolioItems } from '@/lib/portfolio'

const serviceAreaSlugs = [
  'centennial',
  'littleton',
  'lone-tree',
  'parker',
  'highlands-ranch',
  'englewood',
  'castle-rock',
  'aurora',
  'greenwood-village',
  'cherry-hills',
  'denver',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vurmz.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const serviceAreaPages: MetadataRoute.Sitemap = serviceAreaSlugs.map((slug) => ({
    url: `${baseUrl}/services/laser-engraving/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const shopCategorySlugs = ['gifts', 'knives', 'tumblers', 'coasters', 'keychains', 'decor', 'devices']
  const shopCategoryPages: MetadataRoute.Sitemap = shopCategorySlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const portfolioPages: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
    url: `${baseUrl}/services/portfolio/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...serviceAreaPages, ...shopCategoryPages, ...portfolioPages]
}
