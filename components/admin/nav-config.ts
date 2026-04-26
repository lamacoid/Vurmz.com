export interface NavGroup {
  label: string
  items: NavItem[]
}
export interface NavItem {
  href: string
  label: string
  icon: string
  badge?: 'inbox-unread' | 'jobs-active' | 'invoices-overdue'
  chunk?: number
}

export const adminNav: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'home' },
      { href: '/admin/analytics', label: 'Analytics', icon: 'chart' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/content/pages', label: 'Pages', icon: 'doc' },
      { href: '/admin/content/media', label: 'Media', icon: 'image' },
      { href: '/admin/content/theme', label: 'Theme', icon: 'palette' },
      { href: '/admin/content/navigation', label: 'Navigation', icon: 'menu' },
      { href: '/admin/content/settings', label: 'Site settings', icon: 'settings' },
    ],
  },
  {
    label: 'Shop',
    items: [
      { href: '/admin/products', label: 'Products', icon: 'tag' },
      { href: '/admin/orders', label: 'Orders', icon: 'cart' },
      { href: '/admin/inventory', label: 'Inventory', icon: 'box' },
    ],
  },
  {
    label: 'Services',
    items: [
      { href: '/admin/quotes', label: 'Quotes', icon: 'file-text' },
      { href: '/admin/service-jobs', label: 'Service jobs', icon: 'briefcase' },
      { href: '/admin/jobs', label: 'Jobs (legacy)', icon: 'briefcase', badge: 'jobs-active' },
      { href: '/admin/materials', label: 'Materials', icon: 'layers' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/invoices', label: 'Invoices', icon: 'file-invoice', badge: 'invoices-overdue' },
      { href: '/admin/revenue', label: 'Revenue', icon: 'dollar' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/customers', label: 'Customers', icon: 'users' },
      { href: '/admin/inbox', label: 'Inbox', icon: 'inbox', badge: 'inbox-unread' },
    ],
  },
]

export const mobileTabs: NavItem[] = [
  { href: '/admin', label: 'Home', icon: 'home' },
  { href: '/admin/inbox', label: 'Inbox', icon: 'inbox', badge: 'inbox-unread' },
  { href: '/admin/service-jobs', label: 'Jobs', icon: 'briefcase' },
  { href: '/admin/customers', label: 'People', icon: 'users' },
  { href: '/admin/products', label: 'Shop', icon: 'tag' },
]
