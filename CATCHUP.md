# VURMZ Website - Project Catchup

## Overview
B2B website for VURMZ LLC, a laser engraving business based in Centennial, Colorado serving the Denver metro area. Premium glass-morphism design with liquid animations.

## Tech Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glass Design System
- **Database**: Cloudflare D1 (SQLite) with Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Deployment**: Cloudflare Pages

## Design System

### Colors
```css
--vurmz-teal: #6a8c8c       /* Primary teal */
--vurmz-teal-dark: #5a7a7a  /* Darker teal */
--vurmz-sky: #8caec4        /* Dusty sky blue */
--vurmz-dark: #2c3533       /* Dark background */
```

### Glass Aesthetic
- Backdrop blur with `blur(20px) saturate(180%)`
- Semi-transparent backgrounds: `rgba(255,255,255,0.95)`
- Subtle shadows: `0 4px 20px rgba(106,140,140,0.08)`
- Inset highlights: `inset 0 1px 0 rgba(255,255,255,0.8)`
- Rounded corners: `rounded-2xl` (16px)

### Animation
- Liquid easing: `[0.23, 1, 0.32, 1]`
- Staggered entrance animations
- Hover micro-interactions with `scale-[1.01]`

## Project Structure
```
/app
  /(landing)
    /page.tsx              - Splash landing page (logo + portal entry)
    /layout.tsx            - Minimal layout (no header/footer)

  /(main)
    /layout.tsx            - Main layout with Header/Footer
    /home/page.tsx         - Homepage (needs redesign for pack system)
    /services/page.tsx     - Services listing
    /portfolio/page.tsx    - Portfolio gallery
    /about/page.tsx        - About page
    /contact/page.tsx      - Contact info & FAQ
    /order/page.tsx        - Order builder with product configurator
    /pricing/page.tsx      - Pricing page
    /restaurants/page.tsx  - Restaurant industry page

  /admin
    /login/page.tsx        - Glass login page
    /dashboard/page.tsx    - Admin dashboard with stats
    /quotes/page.tsx       - Quote management (glass table)
    /quotes/[id]/page.tsx  - Quote detail view
    /orders/page.tsx       - Order management
    /customers/page.tsx    - Customer list
    /materials/page.tsx    - Materials inventory
    /revenue/page.tsx      - Revenue tracking
    /settings/page.tsx     - Settings

/components
  LandingPage.tsx          - Animated landing with watery reflection
  Header.tsx               - Main site header
  Footer.tsx               - Site footer
  AdminShell.tsx           - Glass admin layout wrapper
  AdminSidebar.tsx         - Dark glass admin navigation
  HomePageContent.tsx      - Homepage content (needs redesign)

  /builder                 - Product builder components
    BuilderShell.tsx       - Unified builder wrapper
    BrandedPenPreview.tsx  - Pen configurator
    MetalBusinessCardPreview.tsx - Card configurator
    LabelDesigner.tsx      - Label/sign designer
    KnifeDesigner.tsx      - Knife engraving preview
    IndustrialTagPreview.tsx - Industrial tag builder
    NametagPreview.tsx     - Nametag builder

/lib
  prisma.ts                - Prisma client
  auth.ts                  - NextAuth config
```

## Database Models
- **User** - Admin accounts
- **Customer** - Business clients
- **Quote** - Quote requests with status workflow
- **Order** - Jobs/orders
- **Material** - Inventory with low stock alerts
- **PortfolioItem** - Gallery items
- **Testimonial** - Customer reviews

## Key Features

### Landing Page
- Floating logo with animated watery reflection
- Hover reveals glass buttons: "Enter Site" / "Customer Portal"
- Portal transition effect when navigating

### Admin Portal (Customer Portal)
- Premium glass card aesthetic
- Status-based workflow: New → Quoted → Accepted → In Progress → Complete
- Quick contact buttons (Google Voice text/call, email)
- Timeline tracking
- Square invoice integration

### Product Builder
- Unified builder for all products
- Real-time preview visualizers
- Font selection
- Color options
- Size variants

## Pricing Model (In Progress)
**Pack-Based System:**
- Pens & Coasters: 15 per pack (~$50)
- Signs & Tags: 5 per pack
- "Ladder model" - want 20? Buy 2 packs (30 items)
- Filters out retail customers, focuses on B2B

## Quote Workflow
1. **New** - Customer submits request
2. **Quoted** - Admin sets price, sends quote link
3. **Pending Approval** - Customer places order
4. **Accepted** - Admin starts work
5. **In Progress** - Work underway
6. **Complete** - Ready for pickup/delivery, invoice sent

## Deployment
```bash
# Build for Cloudflare Pages
npx @cloudflare/next-on-pages

# Deploy
wrangler pages deploy .vercel/output/static
```

## Development
```bash
cd /Users/zacharydemillo/Desktop/WEBSITE\ PROJECT
npm run dev
# Runs on http://localhost:3000
```

## Admin Login
- URL: http://localhost:3000/admin/login
- Production: https://www.vurmz.com/admin/login

## Assets
- Logo: `/public/images/vurmz-logo-full.svg`
- Logo contains "VURMZ" text

## Current Status (January 2025)

### Completed
- [x] Landing page with glass aesthetic and watery reflection
- [x] Admin login page upgrade (glass cards)
- [x] AdminShell and AdminSidebar upgrade (dark glass)
- [x] Admin dashboard upgrade (glass stats cards)
- [x] Admin quotes list page (glass table with search/filter)
- [x] Admin quote detail page (glass cards, action buttons)

### In Progress
- [ ] Admin orders page upgrade
- [ ] Admin customers page upgrade
- [ ] Admin materials page upgrade
- [ ] Admin revenue page upgrade
- [ ] Admin settings page upgrade

### Planned
- [ ] Pack-based pricing system implementation
- [ ] Homepage redesign for pack system
- [ ] Order builder update for pack quantities
- [ ] Landing page animation polish

## Notes
- Using route groups: `(landing)` for splash, `(main)` for main site
- All admin pages use consistent glass card styling
- Framer Motion for smooth liquid animations
- Status badges use color-coded backgrounds with borders
