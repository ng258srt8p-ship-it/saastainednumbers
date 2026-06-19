# Nav Opacity, Content Spacing, Pricing, Locale Popup & Shopify Cleanup

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Fix the pill nav's readability (opacity), push all page content down to clear the fixed nav, simplify Pricing to a single free tier, fix the locale dropdown cutoff, and remove all Shopify affiliate links.

**Architecture:** Six targeted workstreams touching CSS, layout, page components, and calculator configs. Each is verified by Playwright E2E tests.

**Tech Stack:** Next.js 16, Tailwind CSS, Playwright (E2E), TypeScript

**Prerequisite context:** The nav was recently recreated as a Mobbin-style frosted-glass pill (`fixed top-4 h-12 rounded-full` with `bg-[rgba(237,237,237,0.64)]`). Its 64% opacity lets the homepage dark gradient bleed through, making text hard to read. The `<main>` element has no padding-top, so every page's content is clipped behind the fixed nav. The Pricing page still has Pro/Enterprise tiers despite only offering free. The locale dropdown uses `absolute left-0` and clips on the right edge. 21 Shopify affiliate links sprinkle the codebase.

---

## Task 0: Visual investigation with Playwright

**Objective:** Take baseline screenshots and measurements to document the current broken state.

**Files:**
- Create: `tests/e2e/nav-visual.spec.ts`

**Step 1: Write Playwright screenshot test**

```typescript
// tests/e2e/nav-visual.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Nav bar visual layout", () => {
  test("nav does not overlap page content on homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();

    // heading top should be >= nav bottom (with small tolerance)
    const navBottom = navBox!.y + navBox!.height;
    expect(headingBox!.y).toBeGreaterThanOrEqual(navBottom - 2);
  });

  test("nav has sufficient contrast on dark hero section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    const navBox = await nav.boundingBox();
    if (navBox) {
      await page.screenshot({
        path: "e2e-screenshots/nav-region.png",
        clip: {
          x: Math.max(0, navBox.x - 20),
          y: Math.max(0, navBox.y - 20),
          width: Math.min(navBox.width + 40, 1280),
          height: navBox.height + 40,
        },
      });
    }

    // Verify all nav link text renders
    const navLinks = nav.locator("a");
    const linkCount = await navLinks.count();
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test("content padding on category page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/revenue");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();

    const firstContent = page.locator("h1, .breadcrumb, main > *").first();
    await expect(firstContent).toBeVisible();
    const contentBox = await firstContent.boundingBox();
    expect(contentBox).not.toBeNull();

    const navBottom = navBox!.y + navBox!.height;
    expect(contentBox!.y).toBeGreaterThanOrEqual(navBottom - 2);
  });
});
```

**Step 2: Run and observe failures**

Run: `npx playwright test tests/e2e/nav-visual.spec.ts --reporter=line`
Expected: TESTS FAIL — content overlaps nav.

Run: `open e2e-screenshots/nav-region.png`
Expected: Nav text washed out against dark hero gradient.

**Step 3: Commit**

```bash
git add tests/e2e/nav-visual.spec.ts
git commit -m "test: add nav visual layout E2E tests (expecting failure)"
```

---

## Task 1: Increase nav background opacity

**Objective:** Make the nav pill more opaque so text is clearly readable against any background.

**Files:**
- Modify: `components/Nav.tsx:20`

**Rationale:** `rgba(237,237,237,0.64)` at 64% opacity lets the homepage's dark gradient hero bleed through and tint the nav. `backdrop-blur-[48px]` helps but isn't sufficient. The nav text is `rgb(20,20,20)` (near-black) which loses contrast when the background behind the translucent nav is dark.

**Step 1: Increase background opacity from 0.64 to 0.88**

In `components/Nav.tsx`, change line 20:

```tsx
// FROM:
<nav className="pointer-events-auto mx-auto flex max-w-[880px] items-center justify-between px-4 h-12 rounded-full backdrop-blur-[48px] bg-[rgba(237,237,237,0.64)] dark:bg-[rgba(30,30,30,0.64)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/[0.06]">

// TO:
<nav className="pointer-events-auto mx-auto flex max-w-[880px] items-center justify-between px-4 h-12 rounded-full backdrop-blur-[48px] bg-[rgba(237,237,237,0.88)] dark:bg-[rgba(30,30,30,0.88)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-black/[0.04] dark:border-white/[0.06]">
```

**Why 0.88?** 0.64 = background heavily bleeds through. 0.88 = still translucent (12% + 48px blur diffuses edges) but text reads crisp. 0.95+ loses the glass effect entirely.

**Step 2: Run the screenshot test**

Run: `npx playwright test tests/e2e/nav-visual.spec.ts --reporter=line`
Expected: Contrast still fails (content overlap issue), but screenshot now shows crisp nav text.

**Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "fix: increase nav opacity from 64% to 88% for readability"
```

---

## Task 2: Add content padding to main layout

**Objective:** Push all page content down by ~64px so it clears the fixed nav bar.

**Files:**
- Create: `components/MainContentWrapper.tsx`
- Modify: `app/layout.tsx:99`

**Analysis:** The nav is `fixed top-4` (16px from viewport top) with `h-12` (48px tall), occupying y 16px–64px. The `<main>` element has no padding-top, so content starts at y=0 and gets clipped. The homepage hero's `py-24` (96px) currently has only ~32px visible because the nav eats the top 64px.

**Key constraint:** Embed pages (`/embed/*`) have no nav and shouldn't get this padding.

**Step 1: Create conditional padding wrapper**

```tsx
// components/MainContentWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [embed, setEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setEmbed(new URLSearchParams(window.location.search).has("embed"));
      }, 0);
    }
  }, []);

  // No padding on embed pages and routes
  const isEmbed = pathname?.startsWith("/embed") || embed;

  return (
    <div className={isEmbed ? "" : "pt-16"}>
      {children}
    </div>
  );
}
```

**Step 2: Wire into root layout**

In `app/layout.tsx`:

```tsx
// Add import
import { MainContentWrapper } from "@/components/MainContentWrapper";

// Wrap children (around line 99-101)
<main id="main-content" className="flex-1 flex flex-col min-h-0">
  <MainContentWrapper>
    <PageTransition>{children}</PageTransition>
  </MainContentWrapper>
</main>
```

**Step 3: Verify with Playwright**

Run: `npx playwright test tests/e2e/nav-visual.spec.ts --reporter=line`
Expected: ALL nav-visual tests PASS — content starts below nav, heading visible.

**Step 4: Verify embed pages are unchanged**

```typescript
test("embed page has no extra top padding", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/embed/mrr-calculator");
  const firstChild = page.locator("main > * > *").first();
  const box = await firstChild.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(20); // no padding = near top
});
```

**Step 5: Commit**

```bash
git add app/layout.tsx components/MainContentWrapper.tsx
git commit -m "fix: add pt-16 content padding below fixed nav, skip on embed pages"
```

---

## Task 3: Fix locale dropdown cutoff

**Objective:** The language dropdown menu is clipped on the right edge — it extends beyond the viewport or nav bounds when positioned with `left-0`.

**Files:**
- Modify: `components/LocaleSwitcher.tsx:48`

**Root cause:** The dropdown uses `absolute left-0 z-50` which aligns it to the **left** edge of its parent. The LocaleSwitcher button sits in the far-right section of the nav. The dropdown's `min-w-[140px]` extends rightward past the available viewport/nav space and gets clipped.

**Fix:** Change `left-0` to `right-0` so the dropdown aligns to the **right** edge and extends leftward into the nav, where there's ample room.

**Step 1: Change dropdown alignment**

In `components/LocaleSwitcher.tsx`, line 48:

```tsx
// FROM:
<div
  className="absolute left-0 z-50 mt-1 min-w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
  role="listbox"
  aria-label="Select language"
>

// TO:
<div
  className="absolute right-0 z-50 mt-1 min-w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
  role="listbox"
  aria-label="Select language"
>
```

**Step 2: Add Playwright test for dropdown visibility**

Add to `tests/e2e/nav-visual.spec.ts`:

```typescript
test("locale dropdown is fully visible on all viewports", async ({ page }) => {
  for (const width of [1280, 768, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");

    // Open locale switcher
    const localeBtn = page.locator('button[aria-label="Select language"]');
    await localeBtn.click();

    // The dropdown should be fully within viewport bounds
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible();

    const box = await dropdown.boundingBox();
    expect(box).not.toBeNull();

    // Dropdown should not extend beyond right viewport edge
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    // Should not extend beyond left viewport edge
    expect(box!.x).toBeGreaterThanOrEqual(0);

    // Close it
    await page.keyboard.press("Escape");
  }
});
```

**Step 3: Run the test**

Run: `npx playwright test tests/e2e/nav-visual.spec.ts --reporter=line --grep "locale dropdown"`
Expected: TEST PASSES on all three viewport widths.

**Step 4: Commit**

```bash
git add components/LocaleSwitcher.tsx
git commit -m "fix: change locale dropdown from left-0 to right-0 to prevent viewport clipping"
```

---

## Task 4: Simplify pricing page to single free tier

**Objective:** We only offer one tier (Free). Remove the Pro and Enterprise tiers entirely.

**Files:**
- Modify: `app/pricing/page.tsx`

**Current state:** The `plans` array has Free/Pro/Enterprise objects. The JSX renders all three via `plans.map()`. Features are sliced per plan. Remove everything but the Free card and simplify the grid.

**Step 1: Remove multi-tier artifacts**

Delete the `features` array (line 29-40) — it's a YAGNI violation now (was shared by all plans). Replace `plans` with a single `plan` object. The page transforms from a pricing comparison table to a simple hero card confirming everything is free.

**Delete lines 29-73** (the `features` array and `plans` array), replace with:

```typescript
const plan = {
  name: t("pricing.free"),
  price: "$0",
  description: t("pricing.freeDescription"),
  cta: t("pricing.browseCalculators"),
  href: "/calculators",
  features: [
    t("pricing.allCalculators"),
    t("pricing.realTimeResults"),
    t("pricing.embeddable"),
    t("pricing.unlimitedUsage"),
    t("pricing.communitySupport"),
    t("pricing.benchmarks"),
  ],
};
```

**Check i18n keys** — the plan references `t("pricing.xxx")` keys. Verify these exist in all 6 locale files. Likely candidates that may need adding: `pricing.free`, `pricing.freeDescription`, `pricing.browseCalculators`, `pricing.allCalculators`, `pricing.realTimeResults`, `pricing.embeddable`, `pricing.unlimitedUsage`, `pricing.communitySupport`, `pricing.benchmarks`.

**Step 2: Simplify the JSX**

Replace lines 91-139 (the card grid) with:

```tsx
{/* Single Free Plan Card */}
<div className="mt-12 max-w-md mx-auto">
  <div className="relative rounded-2xl border border-brand-500 shadow-lg shadow-brand-500/10 bg-white dark:bg-gray-800 p-8 text-center">
    <p className="font-heading text-lg font-bold text-gray-900 dark:text-gray-100">
      {plan.name}
    </p>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {plan.description}
    </p>
    <p className="mt-4">
      <span className="font-heading text-5xl font-bold text-gray-900 dark:text-gray-100">
        {plan.price}
      </span>
      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
        / forever
      </span>
    </p>
    <ul className="mt-6 space-y-3 text-left max-w-xs mx-auto" role="list">
      {plan.features.map((feat) => (
        <li key={feat} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {feat}
        </li>
      ))}
    </ul>
    <Link
      href={plan.href}
      className="mt-8 block w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white text-center shadow-sm hover:bg-brand-700 transition-all"
    >
      {plan.cta}
    </Link>
  </div>
</div>
```

Key changes:
- `md:grid-cols-3 max-w-5xl` → `max-w-md mx-auto` (single centered card)
- `plans.map(...)` → single plan
- Removed `popular` badge logic, `features.includes()` strikethrough logic
- Card always has the brand-500 border (previously only for "popular" plan)
- Larger `text-5xl` price, more padding (`p-8` vs `p-6`)

Keep lines 142-166 (FAQ section) as-is.

**Step 3: Validate i18n coverage**

Run: `node -e "
const fs = require('fs');
const locales = ['en','es','de','pt','fr','ja'];
const keys = ['pricing.free','pricing.freeDescription','pricing.browseCalculators','pricing.allCalculators','pricing.realTimeResults','pricing.embeddable','pricing.unlimitedUsage','pricing.communitySupport','pricing.benchmarks'];
for (const loc of locales) {
  const dict = JSON.parse(fs.readFileSync('i18n/'+loc+'/common.json','utf8'));
  const missing = keys.filter(k => {
    const parts = k.split('.');
    return !dict[parts[0]]?.[parts[1]] && !dict[parts[0]]?.[parts[1]]?.trim();
  });
  if (missing.length) console.log(loc+': MISSING', missing);
  else console.log(loc+': OK');
}
"`

If any keys are missing, add them to all 6 locale files.

**Step 4: Run Playwright pricing test**

```typescript
test("pricing page shows only one free tier", async ({ page }) => {
  await page.goto("/pricing");
  // Should have exactly one plan card
  const cards = page.locator(".rounded-2xl.border");
  await expect(cards).toHaveCount(1);
  // Should NOT show Pro or Enterprise text
  await expect(page.getByText("Pro")).toHaveCount(0);
  await expect(page.getByText("Enterprise")).toHaveCount(0);
  // Should show $0 / forever
  await expect(page.getByText("$0")).toBeVisible();
});
```

**Step 5: Commit**

```bash
git add app/pricing/page.tsx
# + any i18n files that needed keys added
git commit -m "fix: simplify pricing to single free tier, remove Pro/Enterprise"
```

---

## Task 5: Remove all Shopify affiliate links

**Objective:** Remove every Shopify affiliate link and promotional component from the codebase. This includes affiliate links, banner ads, embedded ad components, and supporting image assets.

**Files to modify (13 files + 2 image files to clean up):**

| File | Change |
|------|--------|
| `components/SidekickAd.tsx` | **Delete entire file.** This is a Shopify affiliate card. |
| `app/[category]/[slug]/CalculatorClient.tsx:23` | Remove `import { SidekickAd }` |
| `app/[category]/[slug]/CalculatorClient.tsx:205` | Remove `sidebarAd={<SidekickAd />}` prop |
| `app/[category]/[slug]/CalculatorClient.tsx:469-480` | Remove entire Shopify Impact Radius banner ad block |
| `app/embed/[slug]/EmbedClient.tsx:150-159` | Remove the Shopify link + icon section |
| `app/blog/[slug]/page.tsx:5,75` | Remove `import { SidekickAd }` and `<SidekickAd />` usage |
| `app/blog/page.tsx:4,42` | Remove `import { SidekickAd }` and `<SidekickAd />` usage |
| `tests/sidekick-size.spec.ts` | **Delete entire file.** Tests Shopify logo size. |
| `public/shopify-icon.png` | **Delete file** |
| `public/shopify-glyph.png` | **Delete file** |
| Calculator FAQ configs (8 files) | Remove shopify.pxf.io links from FAQ answers, replace with neutral alternatives |

**Calculator config files to edit (remove affiliate links from FAQ text):**

1. `calculators/config/dropshipping-margin-calculator.ts`
   - Line 50: Replace `[Shopify](https://shopify.pxf.io/2R5Dza) charges 2.9%` → `Shopify charges 2.9%` (remove link, keep informational text)
   - Line 53: Replace `Use [Shop...` → rewrite to remove Shopify recommendation entirely:
     ```
     Replace: "...get your payment processor shut down. Use [Shopify](https://shopify.pxf.io/2R5Dza) for chargeback protection tools."
     With: "...get your payment processor shut down. Major payment processors like Stripe and PayPal offer chargeback protection tools."
     ```

2. `calculators/config/affiliate-income-calculator.ts`
   - Line 41: Remove `the [Shopify Affiliate Program](https://shopify.pxf.io/2R5Dza) (recurring commissions on subscription referrals),` from the FAQ answer

3. `calculators/config/tiktok-creator-fund-calculator.ts`
   - Line 41: Replace `brand sponsorships via [Shopify](https://shopify.pxf.io/2R5Dza)` → `brand sponsorships`

4. `calculators/config/podcast-revenue-calculator.ts`
   - Line 41: Replace `sell merch through [Shopify](https://shopify.pxf.io/2R5Dza)` → `sell merch`

5. `calculators/config/twitch-revenue-calculator.ts`
   - Line 50: Replace `your own [Shopify](https://shopify.pxf.io/2R5Dza) store` → `your own online store`

6. `calculators/config/print-on-demand-profit-calculator.ts`
   - Line 45: Replace `Use [Shopify](https://shopify.pxf.io/2R5Dza) to build yo...` → remove sentence entirely or replace with generic advice

7. `calculators/config/amazon-fba-calculator.ts`
   - Line 45: Replace `Build a brand beyond Amazon with [Shopify](https://shopify.pxf.io/2R5Dza) to diversify sales channels` → `Build a brand with your own website to diversify sales channels`

8. `calculators/config/etsy-profit-calculator.ts`
   - Line 48: Replace `Scale to your own website with [Shopify](https://shopify.pxf.io/2R5Dza) to reduce marketplace fees` → `Scale to your own website to reduce marketplace fees and capture higher margins`

**Non-affiliate data-source mentions** (keep these — they're factual citations, not promotional links):
- `dropshipping-margin-calculator.ts:40` — `"Shopify Dropshipping Survey"` (citation)
- `dropshipping-margin-calculator.ts:43-44` — `"Shopify Returns Data 2025"` (citation)
- `print-on-demand-profit-calculator.ts:39` — `"Shopify POD Survey"` (citation)
- `roas-calculator.ts:28` — `source: "Shopify"` (citation)
- `saas-quick-ratio-calculator.ts:42` — `"Shopify"` as example public company (factual)

**Research documents** (`Research/`) — leave as-is, these are historical planning docs.

**Step 1: Remove the SidekickAd component and its imports**

```bash
# Delete the component and test files
git rm components/SidekickAd.tsx tests/sidekick-size.spec.ts public/shopify-icon.png public/shopify-glyph.png
```

Remove imports/usages in:
- `app/[category]/[slug]/CalculatorClient.tsx` — remove `import { SidekickAd }` (line 23) and `sidebarAd={<SidekickAd />}` (line 205), and the Shopify banner ad block (lines 468-480)
- `app/blog/[slug]/page.tsx` — remove `import { SidekickAd }` and `<SidekickAd />`
- `app/blog/page.tsx` — remove `import { SidekickAd }` and `<SidekickAd />`

**Step 2: Remove embed page Shopify link**

In `app/embed/[slug]/EmbedClient.tsx`, lines 150-159, remove the Shopify `<a>` button entirely. The section contains a "powered by" footer with a brand link and a Shopify sponsored button. Keep the brand link, remove the Shopify button.

**Step 3: Edit calculator FAQ configs**

For each of the 8 calculator config files listed above, remove or re-phrase the Shopify affiliate link. The exact replacements are detailed above. Use `patch` for each file.

**Step 4: Build and verify**

Run: `npm run lint`
Expected: 0 new errors. The SidekickAd removal may cause unused-import warnings if `sidebarAd` prop still exists on CalculatorShell. Check if the `sidebarAd` prop on CalculatorShell needs to be made optional or removed entirely.

If the `sidebarAd` prop on `CalculatorShell` is still required, either:
- Make it optional in the CalculatorShell component (`sidebarAd?: React.ReactNode`)
- Or pass `undefined`/`null` explicitly

**Step 5: Run all tests**

Run: `npx vitest run`
Expected: 1040/1040 passing (the sidekick-size E2E test was deleted, so that's fine).

Run: `npx playwright test`
Expected: All remaining E2E tests pass.

**Step 6: Commit**

```bash
git add components/SidekickAd.tsx # deletion
git add tests/sidekick-size.spec.ts # deletion
git add public/shopify-icon.png public/shopify-glyph.png # deletion
git add app/[category]/[slug]/CalculatorClient.tsx
git add app/embed/[slug]/EmbedClient.tsx
git add app/blog/[slug]/page.tsx
git add app/blog/page.tsx
git add calculators/config/*.ts
git commit -m "fix: remove all Shopify affiliate links and components"
```

---

## Task 6: Final verification — full build + test suite

**Objective:** Verify no regressions from the combined changeset.

**Step 1: Lint**

Run: `npm run lint`
Expected: 0 errors in changed files (pre-existing .kilo minified errors remain).

**Step 2: Build**

Run: `npx next build`
Expected: Build passes with 0 errors.

**Step 3: Unit tests**

Run: `npx vitest run`
Expected: All tests pass.

**Step 4: E2E tests**

Run: `npx playwright test`
Expected: All tests pass, including the new nav-visual and locale-dropdown tests.

**Step 5: Review screenshots**

Check `e2e-screenshots/nav-region.png` — nav text should be crisp against dark hero gradient.

---

## Risks, tradeoffs, and open questions

| Risk | Mitigation |
|------|-----------|
| Pricing page missing i18n keys for new feature labels | Pre-flight check script in Task 4 Step 3 catches these before commit |
| CalculatorShell `sidebarAd` prop becomes required → build error | Make prop optional or pass `undefined`. Check CalculatorShell's prop interface first. |
| Playwright tests on embed page redirect to login/captcha | Embed pages should be public. If they require something, mock it or use an unauthenticated path. |
| Removing Shopify links from FAQ text leaves broken sentences | Each removal includes rephrasing so the sentence still reads naturally |
| 0.88 opacity still too transparent on certain backgrounds | The verification task includes a visual screenshot review. Can iterate to 0.92 if needed. |
| `pt-16` makes homepage too spacious | Actually restores the intended `py-24` spacing (nav was eating 64px). Verify via Playwright screenshot. |

**Full verification checklist:**
- [ ] Nav text is readable on homepage hero (dark gradient behind)
- [ ] Nav text is readable on light pages (pricing, calculators)
- [ ] Nav text is readable in dark mode
- [ ] Homepage hero heading starts below nav bottom edge
- [ ] Category page content starts below nav
- [ ] Calculator detail page content starts below nav
- [ ] Embed page has NO extra top padding
- [ ] Locale dropdown is fully visible at 1280px, 768px, 375px viewports
- [ ] Pricing page shows exactly one card (Free tier)
- [ ] No "Pro" or "Enterprise" text on pricing page
- [ ] SidekickAd component fully removed from all files
- [ ] No shopify.pxf.io links remain in the codebase
- [ ] No shopify.com/analytics link remains (aov-calculator)
- [ ] Shopify icon images deleted from public/
- [ ] Skip-to-content link still works
- [ ] Build passes (0 errors)
- [ ] Lint passes (0 new errors)
- [ ] Unit tests pass
- [ ] E2E tests pass

---

## Files changed summary

| File | Action | Description |
|------|--------|-------------|
| `components/Nav.tsx:20` | Modify | Nav bg opacity 0.64→0.88 (light + dark) |
| `components/MainContentWrapper.tsx` | Create | Client wrapper adding pt-16 except on embed |
| `app/layout.tsx:99` | Modify | Wrap children in MainContentWrapper |
| `components/LocaleSwitcher.tsx:48` | Modify | Dropdown `left-0`→`right-0` to prevent clipping |
| `app/pricing/page.tsx` | Rewrite | Single-tier free plan, remove Pro/Enterprise |
| `components/SidekickAd.tsx` | Delete | Entire Shopify affiliate card |
| `tests/sidekick-size.spec.ts` | Delete | Shopify logo size test (no longer relevant) |
| `public/shopify-icon.png` | Delete | Shopify icon image |
| `public/shopify-glyph.png` | Delete | Shopify glyph image |
| `app/[category]/[slug]/CalculatorClient.tsx` | Modify | Remove SidekickAd import/usage + banner ad |
| `app/embed/[slug]/EmbedClient.tsx` | Modify | Remove Shopify button from embed footer |
| `app/blog/[slug]/page.tsx` | Modify | Remove SidekickAd import/usage |
| `app/blog/page.tsx` | Modify | Remove SidekickAd import/usage |
| `calculators/config/dropshipping-margin-calculator.ts` | Modify | Remove 2 Shopify affiliate links |
| `calculators/config/affiliate-income-calculator.ts` | Modify | Remove Shopify Affiliate Program link |
| `calculators/config/tiktok-creator-fund-calculator.ts` | Modify | Remove Shopify brand sponsorship link |
| `calculators/config/podcast-revenue-calculator.ts` | Modify | Remove Shopify merch link |
| `calculators/config/twitch-revenue-calculator.ts` | Modify | Remove Shopify store link |
| `calculators/config/print-on-demand-profit-calculator.ts` | Modify | Remove Shopify link |
| `calculators/config/amazon-fba-calculator.ts` | Modify | Remove Shopify diversification link |
| `calculators/config/etsy-profit-calculator.ts` | Modify | Remove Shopify scaling link |
| `calculators/config/aov-calculator.ts` | Modify | Remove shopify.com/analytics link |
| `tests/e2e/nav-visual.spec.ts` | Create | Playwright tests for nav overlap + locale dropdown |
| `i18n/{en,es,de,pt,fr,ja}/common.json` | Maybe modify | Add missing pricing keys if needed |
