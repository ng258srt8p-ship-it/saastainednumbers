#!/bin/bash
# Build WebCalc with OpenRouter API key for the AI chat widget
set -e
cd "$(dirname "$0")/.."

# Check if API key is provided
if [ -z "$NEXT_PUBLIC_OPENROUTER_API_KEY" ]; then
  echo "⚠️  Warning: NEXT_PUBLIC_OPENROUTER_API_KEY not set in environment"
  echo "   Using fallback method (base64 encoded key)"
  export NEXT_PUBLIC_OPENROUTER_API_KEY='sk-or-v1-...'
else
  echo "✓ Using provided OpenRouter API key"
fi

# Backup and remove API routes (they break static export)
cp -r app/api .api-backup 2>/dev/null || true
rm -rf app/api app/privacy-policy 2>/dev/null || true

# Build
npx next build

# Restore
mv .api-backup app/api 2>/dev/null || true
git checkout app/privacy-policy/route.ts 2>/dev/null || true

echo "Build complete. API key is baked into the static export."
echo "OpenRouter API key: ${NEXT_PUBLIC_OPENROUTER_API_KEY:0:20}..."