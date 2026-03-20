import { MetadataRoute } from 'next'

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
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
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
    url: `${baseUrl}/laser-engraving/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...serviceAreaPages]
}
