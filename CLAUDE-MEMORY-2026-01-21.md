# CLAUDE MEMORY FILE - January 21, 2026 (Updated)

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
- Site Manager photo uploads now working (fixed path issue)
- Fully loaded pricing on pens ($7.50) and cards ($6/$18)
- **NEW: Site Manager "Squarespace" features:**
  - Header/Nav editing (logo URL, nav links, CTA button)
  - Footer editing (copyright text, footer links, social toggle)
  - Pages management (create/edit/delete custom pages at /p/[slug])
  - Media Library (placeholder, upload coming)
  - Header and Footer components use config from database

### What Needs Work
- Photo quality - user mentioned using scanner for flat items
- Media Library needs actual file listing/management

---

## KEY FILES

### Pages
- `app/page.tsx` - Homepage (uses SiteConfigProvider)
- `app/admin/orders/page.tsx` - Orders list
- `app/admin/site-manager/page.tsx` - Site config editor (Header, Footer, Pages, Products, etc.)
- `app/order/page.tsx` - Order builder
- `app/p/[slug]/page.tsx` - Dynamic custom pages

### Components
- `components/NameplateDesigner.tsx` - Multi-name input (5 default slots)
- `components/BrandedPenPreview.tsx` - Pen designer ($7.50 fully loaded default)
- `components/MetalBusinessCardPreview.tsx` - Card designer ($6 fully loaded default)
- `components/Header.tsx` - Glass header, uses config for logo/nav/CTA
- `components/Footer.tsx` - Uses config for links/copyright
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

---

## BACKUP

Full backup created: `/Users/zacharydemillo/Desktop/WEBSITE-BACKUP-20260120.zip`

---

## CHANGES - January 21, 2026

1. **Fixed Site Manager photo uploads** - Was displaying at wrong path (`/images/products/`) instead of R2 path (`/api/files/`). Fixed in `site-manager/page.tsx:813`. Also fixed persistence to database.
2. **Removed hero image** - Business card photo on orange background clashed with sage hero and sent mixed signals (industrial messaging vs personal business card). Hero is now text-only.
3. **Fully loaded pricing** - Pricing page and designers now show maxed-out prices by default:
   - Pens: $7.50/pen (2 lines + logo + both sides)
   - Cards: $6/card matte, $18 stainless (QR + logo + back side)
   - Designers start with all options enabled
4. **Cleaned up duplicate files** - Removed favicon 2.ico, favicon 3.ico, page 2.tsx
5. **"Squarespace" Site Manager features:**
   - Header tab: Edit logo URL, nav links (add/remove/reorder/enable/disable), CTA button text/link
   - Footer tab: Edit copyright text, footer links, toggle social media display
   - Pages tab: Create/edit/delete custom pages with title, slug, content (HTML). Pages live at /p/[slug]
   - Media tab: Placeholder for media library (upload UI exists, listing coming)
   - Updated Header.tsx to use config for nav items, logo, CTA
   - Updated Footer.tsx to use config for links, copyright, contact info
   - Created pages table in D1 database
   - Created /api/pages routes for CRUD
   - Created /app/p/[slug]/page.tsx for dynamic page rendering

---

## NEXT SESSION TODO

1. Consider scanner for flat product photos (business cards, labels)
2. Add more portfolio items (currently only 1)
3. Complete Media Library (show uploaded files, delete, copy URL)
