# Pages Overview

## Main Site (Dark Emerald Theme)

### Homepage - `/`
**File:** `app/page.tsx`

- Hero section with tagline and CTAs
- Product preview cards with prices
- "Why Local Beats Online" value props
- Bottom CTA section

### Services - `/services`
**File:** `app/services/page.tsx`

- Product categories grid
- "How It Works" process steps
- Materials list
- CTA section

### Pricing - `/pricing`
**File:** `app/pricing/page.tsx`

- "Why Premium Pricing" benefits
- "Do the Math" comparison (VURMZ vs online wholesaler)
- Detailed pricing tables by category
- VURMZ vs Online Wholesalers comparison table
- Volume discounts section

### Portfolio - `/portfolio`
**File:** `app/portfolio/page.tsx`

- Project type cards (Pens, Cards, Tools)
- Photo gallery (when photos are added)
- CTA section

### About - `/about`
**File:** `app/about/page.tsx`

- Your story and background
- CTA section

### Contact - `/contact`
**File:** `app/contact/page.tsx`

- Contact info (phone, email)
- Location info
- Service area map
- Hours
- CTA section

### Terms - `/terms`
**File:** `app/terms/page.tsx`

- Business info
- Services description
- Orders & payment policies
- Artwork & files requirements
- Turnaround & delivery
- Warranty & returns
- Liability
- Privacy

---

## Events & Gifts (Light Cream Theme)

### Gifts Homepage - `/gifts`
**File:** `app/gifts/page.tsx`
**Layout:** `app/gifts/layout.tsx`

This page has a completely different look - light cream background with elegant styling.

- Hero with elegant typography
- Wedding Party Gifts section
- Guest Favors section
- Premium/Statement Pieces
- Process steps
- FAQ section

The layout file (`app/gifts/layout.tsx`) provides a separate header and footer for this section.

---

## Order System

### Order Builder - `/order`
**File:** `app/order/page.tsx`
**Form:** `app/order/QuoteForm.tsx`

- Product selector
- Interactive preview builders for each product type
- Quote submission form

### Components in Order Builder:
- `components/MetalBusinessCardPreview.tsx` - Card designer
- `components/BrandedPenPreview.tsx` - Pen customizer
- `components/IndustrialLabelPreview.tsx` - Label designer
- `components/NametagPreview.tsx` - Name tag customizer
- `components/KnifeEngravingPreview.tsx` - Knife customizer

---

## Admin Area - `/admin`

Protected admin dashboard for managing:
- Orders
- Customers
- Site configuration

---

## Other Pages

### 404 Not Found
**File:** `app/not-found.tsx`

Custom 404 page with navigation options.

---

## Theme Colors

### Main Site (Dark Emerald)
```css
--vurmz-teal: #3CB9B2      /* Primary accent */
--vurmz-dark: #1A2F2E      /* Dark background */
--vurmz-teal-dark: #2A9D97 /* Darker teal */
```

### Gifts Page (Light Cream)
```css
Background: #FBF9F7
Text: #3D3428
Accent: #A08060 (warm gold)
```

---

## Adding a New Page

1. Create folder in `app/`: `app/newpage/`
2. Create `page.tsx` inside it
3. Add to navigation in `lib/site-info.ts`

Example minimal page:
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO.',
}

export default function NewPage() {
  return (
    <div>
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Page Title</h1>
        </div>
      </section>
    </div>
  )
}
```
