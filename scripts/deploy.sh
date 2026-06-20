#!/bin/bash
set -euo pipefail

echo "=== SaaStainedNumbers Production Deploy ==="

# Source the API key from .env.local
if [ -f ".env.local" ]; then
  export "$(grep -E "^NEXT_PUBLIC_OPENROUTER_API_KEY=" .env.local)"
fi

if [ -z "${NEXT_PUBLIC_OPENROUTER_API_KEY:-}" ]; then
  echo "ERROR: NEXT_PUBLIC_OPENROUTER_API_KEY not found in .env.local"
  echo "Create .env.local with: NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-..."
  exit 1
fi

echo "API key found ✓"

# Step 1: Build static export with the key
echo ""
echo "=== Building static export ==="
export NEXT_PUBLIC_OPENROUTER_API_KEY
bash scripts/build-static.sh

# Step 2: Copy Cloudflare Functions
echo ""
echo "=== Setting up Cloudflare Functions ==="
cp -r functions out/functions

# Step 3: Install wrangler if needed
if ! command -v wrangler &>/dev/null; then
  echo "Installing wrangler..."
  npm install --save-dev wrangler
fi

# Step 4: Deploy to Cloudflare Pages
echo ""
echo "=== Deploying to Cloudflare Pages ==="
echo "Project: saastainednumbers"
echo ""
echo "You may be prompted to log in to Cloudflare."
echo "Use your Cloudflare account credentials or API token."
echo ""
npx wrangler pages deploy out --project-name=saastainednumbers

echo ""
echo "=== Deploy complete! ==="
echo "Your keyed build is now live."
