#!/bin/bash
set -euo pipefail

echo "=== SaaStainedNumbers Multi-Locale Static Export ==="

LOCALES=("en" "es" "de" "pt" "fr" "ja")

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
  if [ -d "out-final" ]; then
    rm -rf out
    mv out-final out
  fi
}
trap cleanup EXIT

echo "Removing all API routes for static export..."
rm -rf app/api

mkdir -p out-final
FIRST=true

for locale in "${LOCALES[@]}"; do
  echo ""
  echo "=== Building for locale: $locale ==="
  STATIC_EXPORT=true NEXT_PUBLIC_LOCALE=$locale npx next build

  if [ "$FIRST" = true ]; then
    # First build (English): keep everything at root
    cp -r out/* out-final/
    FIRST=false
  else
    # Non-English builds: copy HTML/XML files into locale-prefixed subdirectories
    find out -type f \( -name '*.html' -o -name '*.xml' \) | while read -r file; do
      rel="${file#out/}"
      dest="out-final/${locale}/${rel}"
      mkdir -p "$(dirname "$dest")"
      cp "$file" "$dest"
    done

    # Copy _next/static assets so locale HTML can find its CSS/JS chunks
    if [ -d "out/_next" ]; then
      cp -r out/_next out-final/
    fi

    # Copy .nojekyll and root metadata files
    for f in out/.nojekyll out/robots.txt; do
      if [ -f "$f" ]; then
        cp "$f" "out-final/${locale}/"
      fi
    done
  fi

  echo "   Done — $(find out -name 'index.html' -type f | wc -l) pages"
done

# Swap final output in
rm -rf out
mv out-final out

echo ""
echo "=== Multi-locale static export complete! ==="
echo "Output directory: ./out/"
echo ""
echo "Total page count:"
find out -name "index.html" -type f 2>/dev/null | wc -l
echo ""
echo "Per-locale breakdown:"
for locale in "${LOCALES[@]}"; do
  if [ -d "out/${locale}" ]; then
    count=$(find "out/${locale}" -name "index.html" -type f | wc -l)
    echo "  ${locale}: ${count} pages"
  else
    echo "  ${locale}: 0 pages"
  fi
done
echo ""
echo "Root (English): $(find out -maxdepth 3 -name 'index.html' -type f | wc -l) pages"
