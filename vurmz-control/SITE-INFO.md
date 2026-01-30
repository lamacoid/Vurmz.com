# Site Info Guide

All contact info and business details are in ONE file: `lib/site-info.ts`

When you change info here, it automatically updates on ALL pages.

## File Location

```
/Users/zacharydemillo/Desktop/WEBSITE PROJECT/lib/site-info.ts
```

## Current Settings

### Business Identity
```typescript
name: 'VURMZ',
legalName: 'VURMZ LLC',
tagline: 'Laser engraving for small business.',
```

### Contact Info
```typescript
phone: '(719) 257-3834',      // Display format
phoneClean: '7192573834',     // For sms: and tel: links
email: 'zach@vurmz.com',
```

### Location
```typescript
city: 'Centennial',
state: 'Colorado',
stateAbbr: 'CO',
address: 'Centennial, CO',
```

### Founder Info
```typescript
founder: {
  name: 'Zach',
  fullName: 'Zach DeMillo',
},
```

### Website URL
```typescript
url: 'https://vurmz.com',
```

### Service Areas
```typescript
serviceAreas: [
  'Centennial',
  'Littleton',
  'Lone Tree',
  'Parker',
  'Highlands Ranch',
  'Englewood',
  'Castle Rock',
  'Aurora',
  'Greenwood Village',
  'Cherry Hills',
  'Denver',
],
```

## Navigation Menu

The main navigation is also controlled here:

```typescript
export const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Events & Gifts', href: '/gifts' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]
```

To add a new page to the nav, add a new entry. To remove, delete the line.

## How to Update

### Change Phone Number

1. Open `lib/site-info.ts`
2. Find these lines:
```typescript
phone: '(719) 257-3834',
phoneClean: '7192573834',
```
3. Update BOTH:
   - `phone` = how it displays (with formatting)
   - `phoneClean` = numbers only (for links)

### Change Email

Find and update:
```typescript
email: 'zach@vurmz.com',
```

### Change Location

Update these fields:
```typescript
city: 'Centennial',
state: 'Colorado',
stateAbbr: 'CO',
```

### Add Social Media

Currently empty, but ready to use:
```typescript
social: {
  instagram: '',    // Add your handle: '@vurmz'
  facebook: '',     // Add your page URL
  linkedin: '',     // Add your profile URL
},
```

## Helper Functions

The file exports these useful functions:

```typescript
getSmsLink()        // Returns: sms:7192573834
getSmsLink('Hi!')   // Returns: sms:7192573834?body=Hi!
getPhoneLink()      // Returns: tel:7192573834
getEmailLink()      // Returns: mailto:zach@vurmz.com
```

These are used throughout the site for clickable links.
