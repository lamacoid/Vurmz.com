This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy (Cloudflare Pages)

The site deploys to Cloudflare Pages (`vurmz-website`) via GitHub Actions —
see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It runs on
every push:

- push to `main` → production deploy
- push to `site-split` → preview deploy

The workflow builds with `@cloudflare/next-on-pages` and ships with
`wrangler pages deploy`. (This replaces the Cloudflare Pages GitHub App
auto-deploy, which stopped triggering builds on push.)

### Required GitHub Actions secrets

Add these under **Settings → Secrets and variables → Actions** before the
workflow can deploy:

| Secret | What it is |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token with the **Cloudflare Pages: Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account ID that owns `vurmz-website` |

Until both are set, the deploy step will fail. You can still deploy manually with
`npm run pages:deploy`.
