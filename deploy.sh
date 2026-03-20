#!/bin/bash
# VURMZ deploy script — clean build + deploy to Cloudflare Pages
# Usage: ./deploy.sh

set -e

cd "$(dirname "$0")"

echo "🔪 Killing zombie build processes..."
pkill -9 -f "next-on-pages|vercel build|next build" 2>/dev/null || true
sleep 1

echo "🧹 Cleaning build artifacts..."
rm -rf .next .vercel

# Check for corrupted node_modules (duplicate dirs with spaces/numbers)
if ls node_modules/ 2>/dev/null | grep -qE ' [0-9]+$'; then
  echo "⚠️  Corrupted node_modules detected (duplicate directories). Reinstalling..."
  rm -rf node_modules
  npm install
fi

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo "🔨 Building..."
node_modules/.bin/next-on-pages

echo "🚀 Deploying to Cloudflare Pages..."
wrangler pages deploy .vercel/output/static --project-name=vurmz-website --commit-dirty=true

echo "✅ Done! Site is live."
