# CLAUDE MEMORY FILE - January 22, 2026

## Project: VURMZ Website
**Owner:** Zach DeMillo
**Business:** Laser engraving in Centennial, Colorado
**Live URL:** vurmz.com
**Stack:** Next.js + Cloudflare Pages + D1 Database + R2 Storage

---

## CURRENT STATE

### What's Working
- Homepage connected to Site Manager (edit content at /admin/site-manager)
- Orders showing in /admin/orders (fixed customer column mismatch)
- Site config API working (fixed config vs config_data column)
- Nameplate designer now has 5 name slots (can add up to 15)
- Text-only hero (cleaner, on-message for industrial focus)
- Dark blue info bar at top (slate-700)
- Dusty sage hero background
- Site Manager photo uploads working (R2 path)
- Fully loaded pricing on pens ($7.50) and cards ($6/$18)
- **Site Manager "Squarespace" features:**
  - Header/Nav editing (logo URL, nav links, CTA button)
  - Footer editing (copyright text, footer links, social toggle)
  - Pages management (create/edit/delete custom pages at /p/[slug])
  - Media Library (placeholder, upload coming)
  - Header and Footer components use config from database
- **Mobile-optimized main pages** (homepage, services, pricing, footer)

### What Needs Work
- Photo quality - user mentioned using scanner for flat items
- Media Library needs actual file listing/management
- **Email hub / campaign manager** (user requested)

---

## KEY FILES

### Pages
- `app/page.tsx` - Homepage (uses SiteConfigProvider, mobile optimized)
- `app/services/page.tsx` - Services page (mobile optimized)
- `app/pricing/page.tsx` - Pricing page (mobile optimized)
- `app/admin/orders/page.tsx` - Orders list
- `app/admin/site-manager/page.tsx` - Site config editor (Header, Footer, Pages, Products, etc.)
- `app/order/page.tsx` - Order builder
- `app/p/[slug]/page.tsx` - Dynamic custom pages

### Components
- `components/NameplateDesigner.tsx` - Multi-name input (5 default slots)
- `components/BrandedPenPreview.tsx` - Pen designer ($7.50 fully loaded default)
- `components/MetalBusinessCardPreview.tsx` - Card designer ($6 fully loaded default)
- `components/Header.tsx` - Glass header, uses config for logo/nav/CTA
- `components/Footer.tsx` - Uses config for links/copyright (mobile optimized)
- `components/SiteConfigProvider.tsx` - Site config context (includes header, footer)

### API Routes
- `app/api/orders/route.ts` - Orders CRUD (uses business_name not company)
- `app/api/admin/site-config/route.ts` - Site config (uses "config" column)
- `app/api/admin/upload-photo/route.ts` - Photo uploads to R2
- `app/api/pages/route.ts` - Pages CRUD
- `app/api/pages/[id]/route.ts` - Individual page operations

### Config
- `wrangler.toml` - Cloudflare config
- `.env` - Local environment variables

---

## DATABASE (D1: vurmz-quotes)

### Tables
- orders, customers, quotes, users, materials, invoices
- portfolio_items, testimonials, settings, site_config, messages
- **pages** (id, slug, title, content, enabled, show_in_nav, nav_order)

### Column Gotchas
- customers table: `business_name` (not `company`)
- site_config table: `config` (not `config_data`)

---

## DEPLOYMENT

```bash
# Build
cd "/Users/zacharydemillo/Desktop/WEBSITE PROJECT"
rm -rf .next .vercel/output
npx @cloudflare/next-on-pages

# Deploy
npx wrangler pages deploy .vercel/output/static --project-name=vurmz-website
```

---

## USER PREFERENCES

- Keep old green backup folders (app-old-green-backup, components-old-green-backup)
- Industrial focus: "Equipment Labels & Industrial Engraving"
- Target customers: electrical contractors, HVAC, plumbing, facilities
- Prefers simple, clean design - rejected 3D/prismatic effects
- Wants things "seamlessly linked" and easy to manage
- Phone: (719) 257-3834
- Prefers continuous work without pausing for questions ("less pausing please")

---

## BACKUP

Full backup created: `/Users/zacharydemillo/Desktop/WEBSITE-BACKUP-20260120.zip`

---

## CHANGES - January 22, 2026

1. **Mobile optimization for main site pages:**
   - **Homepage** (`app/page.tsx`):
     - Hero: responsive padding `py-16 sm:py-24 md:py-32 lg:py-40`
     - H1: responsive text `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`
     - Value props: 2-column grid on mobile `grid-cols-2`
     - Buttons: responsive sizing, rounded corners on mobile
   - **Services page** (`app/services/page.tsx`):
     - Hero: responsive padding and text sizes
     - Products grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
     - Process steps: `grid-cols-2 md:grid-cols-4` with smaller step boxes on mobile
     - Materials cards: responsive padding and text
     - CTA: responsive padding, text, and button sizing
   - **Pricing page** (`app/pricing/page.tsx`):
     - Hero: responsive padding and text
     - Value props: 2-column grid on mobile
     - "Do the Math" comparison: responsive padding and text
     - Pricing tables: responsive card padding and text sizes
     - Comparison table: horizontal scroll on mobile with `min-w-[500px]`
     - Volume discounts and CTA sections: responsive everything
   - **Footer** (`components/Footer.tsx`):
     - Main content: responsive padding `py-12 sm:py-16 md:py-20`
     - Grid gaps: `gap-8 sm:gap-10 md:gap-12`
     - CTA card: responsive padding and rounded corners
     - Buttons: responsive sizing

2. **User requested email hub / campaign manager feature:**
   - Send emails to individual customers from admin
   - Mass email / newsletter campaigns
   - Campaign management (create, schedule, track)
   - Would integrate with Resend (already in project)

---

## NEXT SESSION TODO

1. Build email hub / campaign manager in Site Manager
2. Complete Media Library (show uploaded files, delete, copy URL)
3. Consider scanner for flat product photos
4. Add more portfolio items
