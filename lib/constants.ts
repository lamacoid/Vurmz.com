// Status and role constants
export const UserRole = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
} as const

export const QuoteStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED'
} as const

export const OrderStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const

export const DeliveryMethod = {
  PICKUP: 'PICKUP',
  LOCAL_DELIVERY: 'LOCAL_DELIVERY',
  SHIPPING: 'SHIPPING'
} as const

export const Turnaround = {
  SAME_DAY: 'SAME_DAY',
  STANDARD: 'STANDARD',
  NO_RUSH: 'NO_RUSH'
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]
export type QuoteStatusType = typeof QuoteStatus[keyof typeof QuoteStatus]
export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus]
export type DeliveryMethodType = typeof DeliveryMethod[keyof typeof DeliveryMethod]
export type TurnaroundType = typeof Turnaround[keyof typeof Turnaround]

// Display labels
export const QuoteStatusLabels: Record<string, string> = {
  PENDING: 'Pending Review',
  SENT: 'Quote Sent',
  APPROVED: 'Approved',
  DECLINED: 'Declined'
}

export const OrderStatusLabels: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Production',
  COMPLETED: 'Completed'
}

export const DeliveryMethodLabels: Record<string, string> = {
  PICKUP: 'Customer Pickup',
  LOCAL_DELIVERY: 'Local Delivery',
  SHIPPING: 'Shipping'
}

export const TurnaroundLabels: Record<string, string> = {
  SAME_DAY: 'Same Day (Rush)',
  STANDARD: 'Standard (3-5 days)',
  NO_RUSH: 'No Rush (1-2 weeks)'
}

// Service areas in Denver metro
export const ServiceAreas = [
  'Centennial',
  'Cherry Hills Village',
  'Cherry Creek',
  'Greenwood Village',
  'Highlands Ranch',
  'Lone Tree',
  'Englewood',
  'Littleton',
  'Aurora',
  'Denver',
  'Denver Tech Center',
  'Parker',
  'Castle Rock',
  'Lakewood',
  'Arvada'
]

// Industries we serve
export const Industries = [
  'Legal',
  'Medical & Dental',
  'Real Estate',
  'Restaurant & Hospitality',
  'Corporate',
  'Construction',
  'Automotive',
  'Brewery & Distillery',
  'Retail',
  'Sports & Recreation'
]

// Material categories
export const MaterialCategories = [
  'Wood',
  'Metal',
  'Acrylic',
  'Leather',
  'Glass',
  'Plastic',
  'Cork',
  'Stone'
]
