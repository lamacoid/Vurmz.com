# Pricing Guide

All pricing is controlled from ONE file: `lib/products.ts`

When you change prices here, they automatically update on:
- Homepage
- Pricing page
- Services page
- Order builder

## File Location

```
/Users/zacharydemillo/Desktop/WEBSITE PROJECT/lib/products.ts
```

## Current Pricing Structure

### Branded Pens
```typescript
pens: {
  packSize: 15,
  basePerItem: 3,      // 1 line of text = $3/pen
  withLogo: 5,         // base + logo = $5/pen
  fullyLoaded: 7.50,   // logo + 2 lines + both sides = $7.50/pen
  addOns: {
    secondLine: 0.50,
    logo: 2,
    bothSides: 2,
  },
}
```

**To change pen prices:** Edit the numbers above. Pack prices calculate automatically.

### Metal Business Cards
```typescript
businessCards: {
  packSize: 10,
  matteBlackBase: 3,    // Text only = $3/card
  matteBlackLoaded: 6,  // Text + logo + QR + back = $6/card
  stainlessBase: 15,    // Premium material = $15/card
  stainlessLoaded: 18,  // Premium fully loaded = $18/card
  addOns: {
    logo: 1,
    qrCode: 1,
    backSide: 1,
  },
}
```

### Coasters
```typescript
coasters: {
  packSize: 15,
  materials: {
    wood: 4,      // Pine, bamboo
    hardwood: 5,  // Oak, acacia
    slate: 5,
    steel: 6,     // Silver or gold
  },
}
```

### Keychains
```typescript
keychains: {
  packSize: 15,
  materials: {
    acrylic: 3,
    wood: 4,
    metal: 4,
  },
  addOns: {
    sameOnBack: 2,
    differentOnBack: 3,
  },
}
```

### Name Plates
```typescript
namePlates: {
  packSize: 5,
  sizes: {
    standard: 6,    // 3" x 1"
    large: 7.50,    // 3.5" x 1.5"
    executive: 9,   // 3.5" x 2"
    desk2x8: 8,     // 2" x 8" desk plate
    desk2x10: 10,   // 2" x 10" desk plate
  },
  attachments: {
    pin: 0,
    clip: 1,
    magnetic: 2,
  },
}
```

### Knives
```typescript
knives: {
  base: 15,
  addOns: {
    deepMark: 5,
    secondLine: 3,
  },
  fullyLoaded: 23,
}
```

### Tools
```typescript
tools: {
  base: 10,
}
```

### Industrial Labels
```typescript
industrialLabels: {
  equipmentNameplates: { min: 8, max: 15 },
  arcFlashLabels: { min: 12, max: 20 },
  valveTags: { min: 5, max: 10 },
  volumeDiscounts: {
    '10+': 0.05,   // 5% off
    '25+': 0.10,   // 10% off
    '50+': 0.15,   // 15% off
    '100+': 0.20,  // 20% off
  },
}
```

## How to Update a Price

1. Open `lib/products.ts`
2. Find the product
3. Change the number
4. Save the file
5. Run `npm run build` to verify no errors
6. Deploy

### Example: Change pen price from $7.50 to $8.00

Find this line:
```typescript
fullyLoaded: 7.50,
```

Change to:
```typescript
fullyLoaded: 8.00,
```

## Pack Size

The default promo pack size is set at the bottom of the file:

```typescript
export const PROMO_PACK_SIZE = 15
```

This affects messaging like "Packs of 15" throughout the site.

## Gifts Page Pricing

The gifts page (`app/gifts/page.tsx`) has its own hardcoded prices since it's a separate retail-focused page. To update those, edit the file directly.
