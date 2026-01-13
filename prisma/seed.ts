import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Define status/role constants
const UserRole = { ADMIN: 'ADMIN', EMPLOYEE: 'EMPLOYEE' } as const
const QuoteStatus = { PENDING: 'PENDING', SENT: 'SENT', APPROVED: 'APPROVED', DECLINED: 'DECLINED' } as const
const OrderStatus = { PENDING: 'PENDING', IN_PROGRESS: 'IN_PROGRESS', COMPLETED: 'COMPLETED' } as const
const DeliveryMethod = { PICKUP: 'PICKUP', LOCAL_DELIVERY: 'LOCAL_DELIVERY', SHIPPING: 'SHIPPING' } as const
const Turnaround = { SAME_DAY: 'SAME_DAY', STANDARD: 'STANDARD', NO_RUSH: 'NO_RUSH' } as const

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vurmz.com' },
    update: {},
    create: {
      email: 'admin@vurmz.com',
      password: hashedPassword,
      name: 'Zach DeMillo',
      role: UserRole.ADMIN
    }
  })
  console.log('Created admin user:', admin.email)

  // Create Denver metro customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Jennifer Martinez',
        email: 'jmartinez@cherryhillslaw.com',
        phone: '303-555-0101',
        company: 'Cherry Hills Law Group',
        address: '4500 Cherry Creek Dr S',
        city: 'Cherry Hills Village',
        state: 'CO',
        zip: '80113',
        notes: 'Prefers pickup, needs business cards and name plates'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Michael Thompson',
        email: 'mike@dtcdental.com',
        phone: '303-555-0102',
        company: 'DTC Family Dental',
        address: '8200 E Belleview Ave',
        city: 'Greenwood Village',
        state: 'CO',
        zip: '80111',
        notes: 'Monthly order for patient gifts, gate code: 1234'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Chen',
        email: 'sarah@mountainviewrealty.com',
        phone: '303-555-0103',
        company: 'Mountain View Realty',
        address: '9350 Heritage Hills Cir',
        city: 'Lone Tree',
        state: 'CO',
        zip: '80124',
        notes: 'Closing gifts for clients, needs cutting boards and wine accessories'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'David Rodriguez',
        email: 'david@thebluebonnet.com',
        phone: '303-555-0104',
        company: 'The Blue Bonnet Restaurant',
        address: '457 S Broadway',
        city: 'Denver',
        state: 'CO',
        zip: '80209',
        notes: 'Custom menus and signage, downtown delivery'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Emily Watson',
        email: 'emily@watsoncontractors.com',
        phone: '303-555-0105',
        company: 'Watson General Contractors',
        address: '7600 E Orchard Rd',
        city: 'Centennial',
        state: 'CO',
        zip: '80111',
        notes: 'Asset tags and safety signage, bulk orders'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Robert Kim',
        email: 'rkim@highlandsgolf.com',
        phone: '303-555-0106',
        company: 'Highlands Ranch Golf Club',
        address: '9000 Venneford Ranch Rd',
        city: 'Highlands Ranch',
        state: 'CO',
        zip: '80126',
        notes: 'Tournament trophies and member gifts'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Amanda Foster',
        email: 'amanda@fostersalon.com',
        phone: '303-555-0107',
        company: 'Foster Beauty Studio',
        address: '2500 E 1st Ave',
        city: 'Cherry Creek',
        state: 'CO',
        zip: '80206',
        notes: 'Product branding and gift items'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'James O\'Brien',
        email: 'james@obrienauto.com',
        phone: '303-555-0108',
        company: 'O\'Brien Auto Group',
        address: '8555 E Arapahoe Rd',
        city: 'Centennial',
        state: 'CO',
        zip: '80112',
        notes: 'VIP customer gifts and showroom signage'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Lisa Park',
        email: 'lisa@parkfinancial.com',
        phone: '303-555-0109',
        company: 'Park Financial Advisors',
        address: '5613 DTC Pkwy',
        city: 'Greenwood Village',
        state: 'CO',
        zip: '80111',
        notes: 'Executive gifts and office signage'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Tom Anderson',
        email: 'tom@andersonbrewing.com',
        phone: '303-555-0110',
        company: 'Anderson Craft Brewing',
        address: '3900 S Broadway',
        city: 'Englewood',
        state: 'CO',
        zip: '80113',
        notes: 'Tap handles, coasters, and promotional items'
      }
    })
  ])
  console.log(`Created ${customers.length} customers`)

  // Create quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        customerId: customers[0].id,
        projectDescription: '50 brass name plates for attorney offices, 2x8 inches each with names and titles',
        material: 'Brass',
        quantity: 50,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Google search'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[1].id,
        projectDescription: 'Custom bamboo toothbrush holders with dental practice logo',
        material: 'Bamboo',
        quantity: 200,
        status: QuoteStatus.SENT,
        estimatedPrice: 450.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Referral from Cherry Hills Law'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[2].id,
        projectDescription: 'Walnut cutting boards with "Welcome Home" engraving for closing gifts',
        material: 'Walnut',
        quantity: 25,
        status: QuoteStatus.APPROVED,
        estimatedPrice: 875.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Saw your work at a friend\'s house'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[3].id,
        projectDescription: 'Acrylic menu displays with restaurant logo, 8.5x11 size',
        material: 'Acrylic',
        quantity: 30,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.SAME_DAY,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Google Maps'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[4].id,
        projectDescription: 'Anodized aluminum asset tags with QR codes and serial numbers',
        material: 'Aluminum',
        quantity: 500,
        status: QuoteStatus.APPROVED,
        estimatedPrice: 1250.00,
        turnaround: Turnaround.NO_RUSH,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Industry recommendation'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[5].id,
        projectDescription: 'Crystal golf ball trophies for annual tournament',
        material: 'Crystal',
        quantity: 12,
        status: QuoteStatus.SENT,
        estimatedPrice: 720.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Previous customer'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[6].id,
        projectDescription: 'Rose gold compact mirrors with salon logo',
        material: 'Metal',
        quantity: 100,
        status: QuoteStatus.DECLINED,
        estimatedPrice: 650.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Instagram'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[7].id,
        projectDescription: 'Stainless steel keychains for VIP customers with car model engravings',
        material: 'Stainless Steel',
        quantity: 150,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Chamber of Commerce'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[8].id,
        projectDescription: 'Leather portfolio covers with embossed company logo',
        material: 'Leather',
        quantity: 20,
        status: QuoteStatus.APPROVED,
        estimatedPrice: 560.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'LinkedIn'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[9].id,
        projectDescription: 'Wooden tap handles with brewery logo and beer names',
        material: 'Maple',
        quantity: 24,
        status: QuoteStatus.SENT,
        estimatedPrice: 480.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Saw work at neighboring business'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[0].id,
        projectDescription: 'Acrylic desk nameplates for new office expansion',
        material: 'Acrylic',
        quantity: 30,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.SAME_DAY,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Previous order'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[3].id,
        projectDescription: 'Custom coasters with restaurant artwork',
        material: 'Cork',
        quantity: 500,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.NO_RUSH,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Previous order'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[5].id,
        projectDescription: 'Member name badges with magnetic backs',
        material: 'Brass',
        quantity: 200,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Previous order'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[2].id,
        projectDescription: 'Wine bottle gift boxes with custom engraving',
        material: 'Pine',
        quantity: 50,
        status: QuoteStatus.APPROVED,
        estimatedPrice: 625.00,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        howHeardAboutUs: 'Previous order'
      }
    }),
    prisma.quote.create({
      data: {
        customerId: customers[8].id,
        projectDescription: 'Glass paperweights with company anniversary design',
        material: 'Glass',
        quantity: 50,
        status: QuoteStatus.PENDING,
        turnaround: Turnaround.STANDARD,
        deliveryMethod: DeliveryMethod.PICKUP,
        howHeardAboutUs: 'Previous order'
      }
    })
  ])
  console.log(`Created ${quotes.length} quotes`)

  // Create orders
  let orderNum = 1000
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[2].id,
        quoteId: quotes[2].id,
        projectDescription: 'Walnut cutting boards with "Welcome Home" engraving for closing gifts',
        material: 'Walnut',
        quantity: 25,
        price: 875.00,
        status: OrderStatus.COMPLETED,
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        laserType: 'diode',
        productionNotes: 'Used 22W diode, 80% power, 300mm/s',
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[4].id,
        quoteId: quotes[4].id,
        projectDescription: 'Anodized aluminum asset tags with QR codes and serial numbers',
        material: 'Aluminum',
        quantity: 500,
        price: 1250.00,
        status: OrderStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.PICKUP,
        laserType: 'fiber',
        productionNotes: 'Batch 1 of 5 complete (100 tags)'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[8].id,
        quoteId: quotes[8].id,
        projectDescription: 'Leather portfolio covers with embossed company logo',
        material: 'Leather',
        quantity: 20,
        price: 560.00,
        status: OrderStatus.PENDING,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.PICKUP,
        laserType: 'co2'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[0].id,
        projectDescription: 'Emergency order: 10 brass door plates for new conference rooms',
        material: 'Brass',
        quantity: 10,
        price: 180.00,
        status: OrderStatus.PENDING,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.PICKUP,
        laserType: 'fiber',
        productionNotes: 'RUSH ORDER - Due tomorrow'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[1].id,
        projectDescription: 'Bamboo toothbrush holders - repeat order',
        material: 'Bamboo',
        quantity: 100,
        price: 225.00,
        status: OrderStatus.COMPLETED,
        dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        deliveryNotes: 'Gate code: 1234, leave at front desk',
        laserType: 'diode',
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[9].id,
        projectDescription: 'Wooden tap handles with brewery logo',
        material: 'Maple',
        quantity: 12,
        price: 240.00,
        status: OrderStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.PICKUP,
        laserType: 'diode',
        productionNotes: '6 of 12 complete'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[6].id,
        projectDescription: 'Acrylic display stands for retail',
        material: 'Acrylic',
        quantity: 15,
        price: 375.00,
        status: OrderStatus.COMPLETED,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        laserType: 'co2',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[3].id,
        projectDescription: 'Restaurant menu boards - oak with brass accents',
        material: 'Oak',
        quantity: 8,
        price: 480.00,
        status: OrderStatus.PENDING,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        deliveryNotes: 'Deliver after 2pm, ask for David',
        laserType: 'diode'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[7].id,
        projectDescription: 'Stainless steel VIP keychains',
        material: 'Stainless Steel',
        quantity: 75,
        price: 562.50,
        status: OrderStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        laserType: 'fiber',
        productionNotes: 'Waiting on final artwork approval'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[2].id,
        quoteId: quotes[13].id,
        projectDescription: 'Wine bottle gift boxes with custom engraving',
        material: 'Pine',
        quantity: 50,
        price: 625.00,
        status: OrderStatus.PENDING,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        laserType: 'diode'
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[5].id,
        projectDescription: 'Glass awards for golf tournament',
        material: 'Glass',
        quantity: 15,
        price: 450.00,
        status: OrderStatus.COMPLETED,
        dueDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.LOCAL_DELIVERY,
        laserType: 'co2',
        completedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: `VURMZ-${++orderNum}`,
        customerId: customers[4].id,
        projectDescription: 'Safety signage - aluminum plates',
        material: 'Aluminum',
        quantity: 25,
        price: 312.50,
        status: OrderStatus.COMPLETED,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveryMethod: DeliveryMethod.PICKUP,
        laserType: 'fiber',
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    })
  ])
  console.log(`Created ${orders.length} orders`)

  // Create materials inventory
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: 'Brass Sheet 12x12"',
        description: 'Polished brass sheets for name plates and signage',
        costPerUnit: 15.00,
        unit: 'sheet',
        quantityInStock: 45,
        lowStockThreshold: 20
      }
    }),
    prisma.material.create({
      data: {
        name: 'Walnut Board 8x12"',
        description: 'Premium American walnut for cutting boards and plaques',
        costPerUnit: 12.00,
        unit: 'board',
        quantityInStock: 8,
        lowStockThreshold: 15
      }
    }),
    prisma.material.create({
      data: {
        name: 'Acrylic Sheet Clear 12x12"',
        description: 'Crystal clear acrylic for displays and signage',
        costPerUnit: 8.00,
        unit: 'sheet',
        quantityInStock: 60,
        lowStockThreshold: 25
      }
    }),
    prisma.material.create({
      data: {
        name: 'Acrylic Sheet Black 12x12"',
        description: 'Black acrylic for high-contrast engraving',
        costPerUnit: 8.50,
        unit: 'sheet',
        quantityInStock: 35,
        lowStockThreshold: 20
      }
    }),
    prisma.material.create({
      data: {
        name: 'Anodized Aluminum 6x12"',
        description: 'Colored anodized aluminum for tags and labels',
        costPerUnit: 6.00,
        unit: 'sheet',
        quantityInStock: 120,
        lowStockThreshold: 50
      }
    }),
    prisma.material.create({
      data: {
        name: 'Stainless Steel 6x6"',
        description: 'Brushed stainless for durable marking',
        costPerUnit: 10.00,
        unit: 'sheet',
        quantityInStock: 28,
        lowStockThreshold: 15
      }
    }),
    prisma.material.create({
      data: {
        name: 'Maple Board 6x8"',
        description: 'Light maple wood for general engraving',
        costPerUnit: 5.00,
        unit: 'board',
        quantityInStock: 55,
        lowStockThreshold: 30
      }
    }),
    prisma.material.create({
      data: {
        name: 'Leather Square 8x8"',
        description: 'Premium vegetable-tanned leather',
        costPerUnit: 18.00,
        unit: 'piece',
        quantityInStock: 22,
        lowStockThreshold: 10
      }
    }),
    prisma.material.create({
      data: {
        name: 'Cork Sheet 12x12"',
        description: 'Natural cork for coasters',
        costPerUnit: 4.00,
        unit: 'sheet',
        quantityInStock: 5,
        lowStockThreshold: 20
      }
    }),
    prisma.material.create({
      data: {
        name: 'Glass Blank 4x6"',
        description: 'Optical quality glass for awards',
        costPerUnit: 22.00,
        unit: 'piece',
        quantityInStock: 18,
        lowStockThreshold: 10
      }
    })
  ])
  console.log(`Created ${materials.length} materials`)

  // Create portfolio items
  const portfolioItems = await Promise.all([
    prisma.portfolioItem.create({
      data: {
        title: 'Corporate Name Plates',
        description: 'Custom brass name plates for a Cherry Hills law firm',
        imageUrl: '/images/portfolio/nameplates.jpg',
        category: 'corporate',
        industry: 'Legal',
        location: 'Cherry Hills Village',
        featured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Restaurant Menu Boards',
        description: 'Handcrafted oak menu boards with laser-engraved artwork',
        imageUrl: '/images/portfolio/menuboards.jpg',
        category: 'hospitality',
        industry: 'Restaurant',
        location: 'Downtown Denver',
        featured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Real Estate Closing Gifts',
        description: 'Personalized cutting boards for a Lone Tree realty company',
        imageUrl: '/images/portfolio/cuttingboards.jpg',
        category: 'corporate',
        industry: 'Real Estate',
        location: 'Lone Tree',
        featured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Brewery Tap Handles',
        description: 'Custom maple tap handles with detailed logo engraving',
        imageUrl: '/images/portfolio/taphandles.jpg',
        category: 'hospitality',
        industry: 'Brewery',
        location: 'Englewood',
        featured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Industrial Asset Tags',
        description: 'Durable aluminum QR-coded asset tags for construction company',
        imageUrl: '/images/portfolio/assettags.jpg',
        category: 'industrial',
        industry: 'Construction',
        location: 'Centennial',
        featured: false
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Golf Tournament Awards',
        description: 'Crystal awards with precision laser etching',
        imageUrl: '/images/portfolio/golfawards.jpg',
        category: 'corporate',
        industry: 'Sports/Recreation',
        location: 'Highlands Ranch',
        featured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Dental Practice Gifts',
        description: 'Branded bamboo items for patient appreciation',
        imageUrl: '/images/portfolio/dentalgifts.jpg',
        category: 'corporate',
        industry: 'Medical',
        location: 'Greenwood Village',
        featured: false
      }
    }),
    prisma.portfolioItem.create({
      data: {
        title: 'Auto Dealership Keychains',
        description: 'Stainless steel keychains with car model engravings',
        imageUrl: '/images/portfolio/keychains.jpg',
        category: 'corporate',
        industry: 'Automotive',
        location: 'Centennial',
        featured: false
      }
    })
  ])
  console.log(`Created ${portfolioItems.length} portfolio items`)

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Jennifer M.',
        company: 'Cherry Hills Law Group',
        location: 'Cherry Hills Village',
        content: 'VURMZ has been our go-to for all office signage. The quality is impeccable and the turnaround is always faster than expected. True local service!',
        rating: 5,
        featured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Sarah C.',
        company: 'Mountain View Realty',
        location: 'Lone Tree',
        content: 'My clients love the personalized closing gifts. VURMZ delivers beautiful work and has become an essential part of my business. Highly recommend!',
        rating: 5,
        featured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'David R.',
        company: 'The Blue Bonnet Restaurant',
        location: 'Denver',
        content: 'The menu boards they created for us are stunning. They really captured the essence of our restaurant. Fast delivery right to our door in Denver!',
        rating: 5,
        featured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Tom A.',
        company: 'Anderson Craft Brewing',
        location: 'Englewood',
        content: 'Our custom tap handles are the talk of the taproom. Great local business to work with - they even delivered the same week!',
        rating: 5,
        featured: false
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Emily W.',
        company: 'Watson General Contractors',
        location: 'Centennial',
        content: 'We needed 500 asset tags with QR codes. VURMZ handled the bulk order professionally and the quality is perfect. Will definitely order again.',
        rating: 5,
        featured: false
      }
    })
  ])
  console.log(`Created ${testimonials.length} testimonials`)

  // Create default settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'VURMZ LLC',
      phone: '(303) 555-0199',
      email: 'info@vurmz.com',
      address: '7800 E Orchard Rd, Suite 200',
      city: 'Centennial',
      state: 'CO',
      zip: '80016',
      serviceRadius: 15,
      minOrderFreeDelivery: 100,
      deliveryFee: 15,
      salesTaxRate: 0.0875,
      businessHours: 'Mon-Fri 9am-6pm, Sat by appointment'
    }
  })
  console.log('Created default settings')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
