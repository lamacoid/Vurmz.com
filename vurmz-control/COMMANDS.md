# Quick Commands

Run these from the project folder:
```bash
cd "/Users/zacharydemillo/Desktop/WEBSITE PROJECT"
```

## Development

### Start dev server
```bash
npm run dev
```
Opens at http://localhost:3000

### Build for production
```bash
npm run build
```
Run this before deploying to check for errors.

### Start production server
```bash
npm run start
```

## Git Commands

### See what changed
```bash
git status
```

### Save your changes
```bash
git add .
git commit -m "Description of what you changed"
```

### Push to GitHub
```bash
git push
```

### Undo all unsaved changes (careful!)
```bash
git checkout .
```

### See recent commits
```bash
git log --oneline -10
```

## Common Tasks

### Update pricing
1. Edit `lib/products.ts`
2. Run `npm run build` to verify
3. Commit and push

### Update contact info
1. Edit `lib/site-info.ts`
2. Run `npm run build` to verify
3. Commit and push

### Add a new page
1. Create `app/newpage/page.tsx`
2. Add to nav in `lib/site-info.ts`
3. Run `npm run build` to verify
4. Commit and push

## Troubleshooting

### Build fails
```bash
npm run build
```
Read the error message - it will tell you the file and line number.

### Port 3000 already in use
```bash
npx kill-port 3000
npm run dev
```

### Need to reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Check TypeScript errors
```bash
npx tsc --noEmit
```
