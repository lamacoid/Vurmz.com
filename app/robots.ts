import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/checkout/', '/admin/'],
      },
    ],
    sitemap: 'https://www.vurmz.com/sitemap.xml',
  }
}
