# Deployment Guide

## If Using Vercel (Recommended)

### First Time Setup
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your repository
4. Vercel auto-detects Next.js and configures everything

### Deploying Updates
Once connected, Vercel automatically deploys when you:
```bash
git push
```

That's it! Every push to main = automatic deployment.

### Preview Deployments
- Create a branch: `git checkout -b my-feature`
- Push it: `git push -u origin my-feature`
- Vercel creates a preview URL automatically
- When ready, merge to main for production

### Environment Variables
If you need to add secrets (API keys, etc.):
1. Go to Vercel dashboard > Project > Settings > Environment Variables
2. Add your variables
3. Redeploy

---

## If Using Netlify

### Build Settings
- Build command: `npm run build`
- Publish directory: `.next`
- (Or use the Next.js plugin)

---

## Manual Deployment

### Build locally
```bash
npm run build
```

### The output is in `.next/` folder

### For static export (if needed)
Add to `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
}
```

Then:
```bash
npm run build
```

Output will be in `out/` folder - upload this to any static host.

---

## Domain Setup

### Vercel
1. Dashboard > Project > Settings > Domains
2. Add `vurmz.com`
3. Update DNS at your registrar:
   - A record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`

### DNS Records Needed
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

## Checklist Before Deploying

- [ ] `npm run build` passes with no errors
- [ ] Tested locally at localhost:3000
- [ ] All prices are correct
- [ ] Contact info is correct
- [ ] All links work
- [ ] Mobile layout looks good
