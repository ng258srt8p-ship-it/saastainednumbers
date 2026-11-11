#!/bin/bash
set -euo pipefail

echo "=== SaaStainedNumbers Production Deploy (Cloudflare Workers, static assets) ==="

# NEXT_PUBLIC_OPENROUTER_API_KEY is optional: the AI-insights calls fall back
# to the rule-based engine when absent. Export it here if you want keyed builds.
if [ -f ".env.local" ]; then
  set -a; source .env.local; set +a
fi

echo ""
echo "=== Building static export (all locales) ==="
NODE_ENV=production bash scripts/build-static.sh

# og-default.png is committed under public/ and copied by the build;
# regenerate with: node scripts/gen-og-default.mjs

echo ""
echo "=== Deploying to Cloudflare Workers ==="
npx --yes wrangler deploy

echo ""
echo "=== Deploy complete! ==="
