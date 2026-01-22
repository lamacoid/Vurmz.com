# Claude Memory File

**Start every session with:**
> "Read /Users/zacharydemillo/Desktop/CLAUDE-MEMORY.md"

---

## VURMZ Website Project
**Path**: `/Users/zacharydemillo/Desktop/WEBSITE PROJECT`

### Business
- **Company**: VURMZ LLC - Laser engraving
- **Owner**: Zach
- **Location**: Centennial, CO (South Metro Denver)
- **Focus**: B2B - small businesses in South Metro Denver
- **Phone**: (719) 257-3834
- **Domain**: vurmz.com (connected to Cloudflare Pages)

### Tech Stack
- Next.js 15.5.2 + App Router
- Cloudflare Pages + D1 database
- Edge Runtime (not Node.js)
- Custom auth in `lib/auth-edge.ts`
- Framer Motion for animations
- Google Places API for address autocomplete
- Square API for invoicing

### Deploy
```bash
cd "/Users/zacharydemillo/Desktop/WEBSITE PROJECT"
npx @cloudflare/next-on-pages && npx wrangler pages deploy .vercel/output/static --project-name=vurmz-website --branch=main
```
- Cloudflare project: `vurmz-website`
- D1 database: `vurmz-quotes`
- Admin: zach@vurmz.com / admin123

---

## Design System (January 2025)

### Glass Morphism Aesthetic
- Backdrop blur: `blur(20px) saturate(180%)`
- Semi-transparent backgrounds: `rgba(255,255,255,0.95)`
- Subtle shadows: `0 4px 20px rgba(106,140,140,0.08)`
- Inset highlights: `inset 0 1px 0 rgba(255,255,255,0.8)`
- Rounded corners: `rounded-2xl` (16px)

### Color Palette
```css
--vurmz-teal: #6a8c8c       /* Primary */
--vurmz-teal-dark: #5a7a7a  /* Darker */
--vurmz-sky: #8caec4        /* Dusty sky blue */
--vurmz-dark: #2c3533       /* Dark background */
```

### Animation
- Liquid easing: `[0.23, 1, 0.32, 1] as const`
- Staggered entrance animations
- Hover micro-interactions: `scale-[1.01]`

---

## Current Structure

### Route Groups
```
/app
  /(landing)     - Splash page (no header/footer)
    /page.tsx    - Logo with watery reflection, portal entry
    /layout.tsx  - Minimal layout

  /(main)        - Main site (with header/footer)
    /layout.tsx  - Header + Footer layout
    /home/       - Homepage
    /services/   - Services
    /order/      - Order builder
    ...etc

  /admin         - Customer portal (glass aesthetic)
    /login/      - Glass login page
    /dashboard/  - Glass stats cards
    /quotes/     - Glass table with search/filter
    ...etc
```

### Key Components
- `LandingPage.tsx` - Animated watery reflection, glass buttons
- `AdminShell.tsx` - Glass header, ambient effects
- `AdminSidebar.tsx` - Dark glass navigation
- `HomePageContent.tsx` - Needs redesign for pack system

---

## Pack-Based Pricing Model (In Progress)
**Strategy:** Filter out retail, focus B2B

| Product | Pack Size | ~Price |
|---------|-----------|--------|
| Pens | 15 | $50 |
| Coasters | 15 | $50 |
| Signs | 5 | TBD |
| Tags | 5 | TBD |

**Ladder model:** Want 20? Buy 2 packs (30 items).

---

## Session Log (January 14-15, 2026)

### Current Status (Session End)
**Deployed**: https://vurmz-website.pages.dev (latest: bca30317)

**What's Working**:
- 3D Pen visualizer with Three.js (Inter fonts fixed)
- Pack-based pricing integrated into order builder
- All admin pages upgraded with glass aesthetic
- Landing page with glass transitions
- Homepage component with premium animations

**In Progress (Background Agents)**:
- Knife visualizer SVGs (Miyabi chef + Kershaw pocket)
- ISO 7010 safety icons for label designer
- Blender animation scripts

**Next Up**:
- Use Blender to create button/transition animations
- Integrate knife visualizers
- Replace emoji icons with safety SVGs

### Tools Available
- **Blender 4.3.1**: `/Applications/Blender.app` - For 3D models and animations
- **Three.js**: Already integrated for 3D pen preview
- **Framer Motion**: For UI animations (liquid easing: `[0.23, 1, 0.32, 1]`)

### Landing Page
- White background with floating logo
- Animated watery reflection (useMotionValue)
- Hover reveals glass buttons: "Enter Site" / "Customer Portal"
- Portal transition effect on navigation
- Route groups: `(landing)` for splash, `(main)` for site

### Admin Portal (All Complete)
- [x] Login page - glass card, animated inputs
- [x] AdminShell - glass header, ambient gradients
- [x] AdminSidebar - dark glass, teal accents, active indicator
- [x] Dashboard - glass stat cards, recent quotes/orders
- [x] Quotes list - glass table, search, filter dropdown
- [x] Quote detail - glass cards, colored action buttons, timeline
- [x] Orders page - glass table with status badges
- [x] Customers page - glass table with contact info
- [x] Materials page - glass table with low stock warnings
- [x] Revenue page - glass stat cards, transactions table
- [x] Settings page - glass form cards

### Homepage & Builder
- `HomePageContent.tsx` - New premium component with pack products
- `PackSelector.tsx` - Visual pack selector with quantity controls
- `lib/pack-config.ts` - Pack pricing configuration
- `Pen3D.tsx` - Three.js 3D pen with stylus/fountain modes
- `PenVisualizer.tsx` - SVG fallback pen visualizer

---

## Previous Session Notes

### Jan 11, 2026
- Fixed admin login (Cloudflare WAF rule for /api/*)
- Set up Google Places API
- Built complete quote workflow system
- Metal Business Card designer
- Square invoicing integration

### Jan 10, 2026
- Deployed to Cloudflare Pages
- Converted from Prisma to D1
- Connected vurmz.com custom domain

---

## Products/Services (B2B)
- Branded pens (15-packs)
- Metal business cards
- Industrial labels & signs (5-packs)
- Tool & equipment marking
- Awards & plaques
- Custom nametags (two-tone ABS, magnetic backs)
- Custom projects

---

## Environment Variables
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyAZC5yiaJ-GY7hmtxFzsXLF8RJdT8wKAis"
SQUARE_APPLICATION_ID="sq0idp-Fvlj8YUDUwxCAoZUtx0LGw"
SQUARE_ACCESS_TOKEN="EAAAlxgCdGj62cqqBADaKPwoRXedyA8KftzGyht3245viVRMLS4XKP_VWekNG_ys"
SQUARE_ENVIRONMENT="production"
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `/components/LandingPage.tsx` | Splash page with reflection |
| `/components/AdminShell.tsx` | Admin layout wrapper |
| `/components/AdminSidebar.tsx` | Admin navigation |
| `/app/admin/quotes/page.tsx` | Quotes list (glass table) |
| `/app/admin/quotes/[id]/page.tsx` | Quote detail (glass cards) |
| `/components/HomePageContent.tsx` | Homepage (needs redesign) |

---

## Pending Tasks

### Critical
- [ ] Redesign homepage for pack system
- [ ] Implement pack-based pricing in order builder
- [ ] Finish admin portal pages (orders, customers, materials, revenue, settings)

### Nice to Have
- [ ] Polish landing page animations
- [ ] Set up Resend for email notifications
- [ ] Set up Twilio for SMS notifications
- [ ] R2 file storage for uploads

---

## Important Files
- **Accounts Spreadsheet**: `/Users/zacharydemillo/Desktop/VURMZ-Accounts.csv`
- **Memory File**: `/Users/zacharydemillo/Desktop/CLAUDE-MEMORY.md`
- **Project**: `/Users/zacharydemillo/Desktop/WEBSITE PROJECT`
- **Catchup File**: `/Users/zacharydemillo/Desktop/WEBSITE PROJECT/CATCHUP.md`
- **Complete Reference**: `/Users/zacharydemillo/Documents/vurmz-website/VURMZ-COMPLETE-PROJECT-REFERENCE.md`

---

## Other Notes
- Zach is a chef - flexible hours, attention to detail
- Prefers Safari browser (not Chrome)
- Prefers Cloudflare over Vercel
- Using route groups for layout separation
- All admin pages use consistent glass card styling
