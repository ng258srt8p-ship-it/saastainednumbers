#!/bin/bash
# Pre-commit compliance hooks for SaaStainedNumbers.com
# This script runs before git commits to ensure compliance requirements are met

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Running compliance checks before commit..."

# Check if we're in a build directory
if [ ! -d "out" ]; then
  echo "$YELLOW⚠️  No 'out' directory found. Building static version...$NC"
  # Check if next is available
  if command -v npx &> /dev/null; then
    if npx next build --dry-run 2>/dev/null; then
      echo "$YELLOW🔄 Building static version...$NC"
      # Actually build the static version
      STATIC_EXPORT=true npx next build 2>/dev/null || {
        echo "$RED❌ Static build failed. Please fix build errors before committing.$NC"
        exit 1
      }
    else
      echo "$YELLOW⚠️  Static build available. Ensure 'out' directory is up to date.$NC"
    fi
  else
    echo "$YELLOW⚠️  Next.js not found. Skipping static build validation.$NC"
  fi
fi

# Run compliance validation if validator is available
if [ -f "scripts/validate-compliance.js" ]; then
  echo "$GREEN🔍 Running compliance validation...$NC"
  node scripts/validate-compliance.js
  
  if [ $? -ne 0 ]; then
    echo "$RED❌ Compliance validation failed. Please fix compliance issues before committing.$NC"
    exit 1
  fi
else
  echo "$YELLOW⚠️  Compliance validator not found. Skipping validation.$NC"
fi

echo "$GREEN✅ All compliance checks passed! Ready to commit.$NC"