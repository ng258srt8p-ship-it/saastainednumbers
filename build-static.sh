#!/bin/bash
set -euo pipefail

echo "=== SaaStainedNumbers Static Export ==="

# Ensure API routes exist before backing up
if [ -d "app/api" ]; then
  echo "Backing up app/api..."
  rm -rf .api-backup
  cp -r app/api .api-backup
fi

# Restore backup function — runs even on failure
cleanup() {
  echo ""
  echo "Restoring API routes..."
  if [ -d ".api-backup" ]; then
    rm -rf app/api
    cp -r .api-backup app/api
    rm -rf .api-backup
    echo "API routes restored."
  fi
}
trap cleanup EXIT

echo "Removing all API routes for static export..."
rm -rf app/api

echo ""
echo "Building static export..."
STATIC_EXPORT=true npx next build

echo ""
echo "=== Static export complete! ==="
echo "Output directory: ./out/"
echo ""
echo "Page count:"
if ls out/**/index.html &>/dev/null 2>&1; then
  find out -name "index.html" -type f 2>/dev/null | wc -l
else
  echo "N/A"
fi
echo ""
echo "To deploy: rsync -avz out/ user@server:/var/www/saastainednumbers.com/"
