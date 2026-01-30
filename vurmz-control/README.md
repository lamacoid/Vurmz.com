# VURMZ.com Control Center

This folder contains everything you need to manage and update your website.

## Quick Reference

| What to Change | File to Edit |
|----------------|--------------|
| Prices | `lib/products.ts` |
| Phone/Email/Address | `lib/site-info.ts` |
| Navigation links | `lib/site-info.ts` |
| Homepage content | `app/page.tsx` |
| Gifts page | `app/gifts/page.tsx` |

## Running the Site Locally

```bash
cd "/Users/zacharydemillo/Desktop/WEBSITE PROJECT"
npm run dev
```

Then open http://localhost:3000

## Building for Production

```bash
npm run build
```

## File Structure

```
WEBSITE PROJECT/
├── app/                    # All pages
│   ├── page.tsx           # Homepage
│   ├── pricing/           # Pricing page
│   ├── services/          # Services page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio page
│   ├── gifts/             # Events & Gifts page (separate theme)
│   ├── order/             # Order builder
│   └── terms/             # Terms & conditions
├── lib/                   # Core configuration
│   ├── products.ts        # ALL PRICING HERE
│   └── site-info.ts       # ALL CONTACT INFO HERE
├── components/            # Reusable components
└── public/               # Images and static files
```

## Documentation in This Folder

- `PRICING.md` - How to update all pricing
- `SITE-INFO.md` - How to update contact info
- `PAGES.md` - Overview of all pages and what they do
- `products.ts.backup` - Copy of pricing file
- `site-info.ts.backup` - Copy of site info file
