import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  theme: 'shop' | 'services' | 'landing'
}

const themeStyles = {
  shop: { text: 'text-[#7A7068]', active: 'text-[#D96C5C]', separator: 'text-[#7A7068]/40' },
  services: { text: 'text-gray-500', active: 'text-vurmz-teal', separator: 'text-gray-600' },
  landing: { text: 'text-gray-500', active: 'text-gray-300', separator: 'text-gray-600' },
}

export default function Breadcrumbs({ items, theme }: BreadcrumbsProps) {
  const styles = themeStyles[theme]
  const baseUrl = 'https://www.vurmz.com'

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs font-mono tracking-wide">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <span className={styles.separator}>/</span>}
                {item.href && !isLast ? (
                  <Link href={item.href} className={`${styles.text} hover:${styles.active} transition-colors`}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? styles.active : styles.text}>{item.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
