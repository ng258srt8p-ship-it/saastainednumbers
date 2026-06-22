# Engineering Phase 1 - Critical Fixes

## 1. Fix Hardcoded Admin Credentials
- **Status:** ✅ Done
- **File:** `lib/auth.ts`
- **Summary:** Removed the entire Credentials provider with hardcoded admin@saastainednumbers.com / admin login. Removed the `Credentials` import. Kept Google OAuth and Resend providers intact.

## 2. Fix OG Image Showing Wrong Domain
- **Status:** ✅ Done
- **File:** `app/api/og/route.tsx`
- **Summary:** Changed `saasifactory.io` to `saastainednumbers.com` in the OG image footer text.

## 3. Fix Pricing Page Showing Wrong Calculator Count
- **Status:** ✅ Done
- **File:** `app/pricing/page.tsx`
- **Summary:** Added import of `getAllCalculators` from `@/lib/registry`. Replaced hardcoded "25" with dynamic `calculatorCount` from `getAllCalculators().length` in both the features list and the paragraph.

## 4. Fix `frameborder` Attribute in Embed Snippet
- **Status:** ✅ Done
- **File:** `lib/embed.ts`
- **Summary:** Changed `frameborder="0"` to `frameBorder="0"` (JSX camelCase) in the embed iframe snippet.

## 5. Move `shadcn` to devDependencies
- **Status:** ✅ Done
- **File:** `package.json`
- **Summary:** Removed `shadcn` from `dependencies` and added it to `devDependencies`.

## 6. Fix Sitemap to Include All Calculator Pages
- **Status:** ✅ Done
- **File:** `app/sitemap.ts`
- **Summary:** The sitemap already used `getAllCalculators()` to dynamically generate all 75 calculator pages. Added the missing `/pricing` page to static pages.

## 7. Fix Footer Navigation to Include All 9 Categories
- **Status:** ✅ Done
- **File:** `app/layout.tsx`
- **Summary:** Added the missing 5 category links to the footer: AI Cost (`/ai-cost`), Side Hustle (`/side-hustle`), Personal Finance (`/personal-finance`), General Business (`/general-business`), SaaS Deepen (`/saas-deepen`).

## 8. Fix SSG Pages to Use Barrel Imports
- **Status:** ✅ Done
- **Files:** `app/[category]/[slug]/page.tsx`, `app/embed/[slug]/page.tsx`
- **Summary:** Replaced 24 manual individual calculator config imports with a single `import "@/calculators/config/_all"` barrel import in both files.

## 9. Add Preconnect Hints for External Origins
- **Status:** ✅ Done
- **File:** `app/layout.tsx`
- **Summary:** Added `<link rel="preconnect">` hints for `fonts.googleapis.com`, `fonts.gstatic.com` (with crossorigin), `server.ethicalads.io`, and `www.google-analytics.com`.

## 10. Fix Trailing Slash Inconsistency
- **Status:** ✅ Done
- **File:** `next.config.ts`
- **Summary:** Moved `trailingSlash: true` to the base configuration (always active) instead of only when `STATIC_EXPORT` is enabled.

---

## Verification

- **TypeScript:** ✅ Passes (0 errors)
- **Lint:** ✅ Passes (0 errors, 2 pre-existing warnings about Material Symbols font)
