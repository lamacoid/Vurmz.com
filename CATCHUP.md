# VURMZ Website - Project Catchup

## Overview
B2B website for VURMZ LLC, a laser engraving business based in Centennial, Colorado serving the Denver metro area.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **Icons**: Heroicons

## Theme
- **Primary**: Teal (`teal-600`, `teal-700`, `teal-900`)
- **Header**: Light beige (`stone-100`)
- **Footer**: Dark teal (`teal-900`)

## Project Structure
```
/app
  /page.tsx              - Homepage
  /services/page.tsx     - Services listing
  /portfolio/page.tsx    - Portfolio gallery
  /about/page.tsx        - About page
  /contact/page.tsx      - Contact info & FAQ
  /quote/page.tsx        - Quote request form
  /quote/QuoteForm.tsx   - Quote form component
  /admin
    /login/page.tsx      - Admin login
    /dashboard/page.tsx  - Admin dashboard
    /quotes/page.tsx     - Quote management
    /orders/page.tsx     - Order management
    /customers/page.tsx  - Customer list
    /materials/page.tsx  - Materials inventory
    /settings/page.tsx   - Settings

/components
  Header.tsx             - Site header (beige bg, teal accents)
  Footer.tsx             - Site footer (teal-900 bg)
  AdminShell.tsx         - Admin layout wrapper
  AdminSidebar.tsx       - Admin navigation (teal-900 bg)
  Providers.tsx          - NextAuth session provider

/lib
  prisma.ts              - Prisma client
  auth.ts                - NextAuth config

/prisma
  schema.prisma          - Database schema
  seed.ts                - Seed data (Denver metro customers)
```

## Database Models
- User (admin accounts)
- Customer (business clients)
- Quote (quote requests)
- Order (jobs/orders)
- Material (inventory)
- PortfolioItem (gallery items)
- Testimonial (customer reviews)

## Key Features
- Public pages with SEO metadata
- Quote request form with material/turnaround options
- Admin dashboard with stats
- Customer management
- Order tracking
- Material inventory with low stock alerts

## Dev Server
```bash
cd /Users/zacharydemillo/vurmz-website
npm run dev
# Runs on http://localhost:3000
```

## Admin Login
- URL: http://localhost:3000/admin/login
- Demo: admin@vurmz.com / admin123

## Recent Changes
- Applied teal color theme throughout
- Header background changed to light beige (stone-100)
- Removed duplicate "VURMZ" text from header (logo already contains it)
- Increased logo size for better clarity
- Updated all pages/components to use teal accent colors

## Logo
- Located at: `/public/images/vurmz_logo.png`
- Logo contains "VURMZ" text, so no additional text needed next to it
