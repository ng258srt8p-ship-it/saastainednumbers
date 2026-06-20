#!/bin/bash
# Build WebCalc with OpenRouter API key for the AI chat widget
set -e
cd "$(dirname "$0")/.."

# Bake the API key into the static export
export NEXT_PUBLIC_OPENROUTER_API_KEY='sk-or-v1-...'

# Backup and remove API routes (they break static export)
cp -r app/api .api-backup 2>/dev/null
rm -rf app/api app/privacy-policy 2>/dev/null

# Build
npx next build

# Restore
mv .api-backup app/api 2>/dev/null || true
git checkout app/privacy-policy/route.ts 2>/dev/null || true

echo "Build complete. API key is baked into the static export."
