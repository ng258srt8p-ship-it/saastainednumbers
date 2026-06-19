# Canvas-to-Dashboard Refactor & Site Fixes Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the broken React-based Canvas with a performant vanilla-JS custom calculator Dashboard (collections + presets), fix navigation/footer bugs, and clean up project file structure.

**Architecture:** Keep Next.js as the app framework for all other pages. The new Dashboard will be a standalone page (`/dashboard`) that loads a vanilla JS/TS bundle (no React runtime) — it fetches calculator metadata from a JSON API endpoint, renders a grid of calculator cards, and persists user collections in `localStorage`. This eliminates React's flakiness (stale closures, history sync bugs) from the heavy-interaction page.

**Tech Stack:** Next.js 16 (server pages only), vanilla TypeScript + ES modules for the interactive dashboard, Tailwind CSS for styling (consistent with rest of site), localStorage for persistence.

---

## Phase 1: Quick Fixes — Navigation & Footer

### Task 1.1: Add Calculators link to desktop navigation

**Objective:** The desktop nav only shows "Canvas". Add "Calculators", "Dashboard", "Pricing", "Blog" links like the production site.

**Files:**
- Modify: `components/Nav.tsx`

**Step 1: Fix Nav.tsx**

The current Nav.tsx has `links` object with all i18n keys but only renders `links.canvas`. Change the desktop nav `div` to render all links:

```tsx
<div className="hidden md:flex items-center gap-1">
  <Link
    href="/calculators"
    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {links.calculators}
  </Link>
  <Link
    href="/dashboard"
    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {links.dashboard}
  </Link>
  <Link
    href="/pricing"
    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {links.pricing}
  </Link>
  <Link
    href="/blog"
    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    {links.blog}
  </Link>
  <Link
    href="/canvas"
    data-testid="canvas-nav-link"
    className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
  >
    {links.canvas}
  </Link>
  <CurrencySwitcher />
  <LocaleSwitcher locale={locale as Locale} />
</div>
```

**Step 2: Verify**

Run: `curl -s http://localhost:3000 | grep -o "Calculators\|Dashboard\|Pricing\|Blog\|Canvas"`
Expected: All 5 links present in the HTML.

**Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "fix(nav): add missing Calculators link to desktop navigation"
```

---

### Task 1.2: Fix footer "contact.title" i18n rendering

**Objective:** Line 154 of `app/layout.tsx` renders `t("contact.title")` which outputs the literal key "contact.title" because the key doesn't exist in i18n JSON files.

**Files:**
- Modify: `app/layout.tsx:154`

**Step 1: Fix the i18n key**

Change line 154 from:
```tsx
<Link href="/contact" className="...">{t("contact.title")}</Link>
```
to:
```tsx
<Link href="/contact" className="...">Contact</Link>
```
(or add `"contact": {"title": "Contact"}` to all locale JSON files)

Better fix: add the i18n key to each locale file so it's properly translated.

**Step 2: Verify**

Run: `curl -s http://localhost:3000 | grep -o "contact\.title"`
Expected: No match — should show "Contact" or the translated equivalent.

**Step 3: Commit**

```bash
git add app/layout.tsx i18n/*/common.json
git commit -m "fix(footer): resolve contact.title i18n key rendering"
```

---

### Task 1.3: Fix footer rendering position

**Objective:** Footer renders in the middle of short pages because the body/main layout doesn't push it to the bottom.

**Files:**
- Modify: `app/layout.tsx`:66-68 (or the layout structure)

**Step 1: Check layout structure**

Current layout:
```html
<body className="h-full flex flex-col">
  <nav>...</nav>
  <main className="flex-1 flex flex-col min-h-0">{children}</main>
  <footer>...</footer>
</body>
```

The `flex-1` on `main` should push the footer to the bottom. If the footer is in the middle, some page's children might have `min-h-0` and `flex-1` on a sub-element that doesn't fill the space.

**Root cause investigation:** Check if the issue is on pages where the main content's inner div has `flex-1` instead of the main element properly filling.

**Fix:** Ensure the main element has `min-h-0` and all child flex elements have proper flex properties:
```jsx
<main id="main-content" className="flex-1 flex flex-col min-h-0">
  {children}
</main>
```

If children have `flex flex-col min-h-0` with content that doesn't fill, the flex stays collapsed. Change to:
```html
<main id="main-content" className="flex-1 flex flex-col">
  <div className="flex-1">{children}</div>
  <footer>...</footer>
</main>
```

Actually, the simplest fix: move the `<FooterShow>` INSIDE `<main>` at the end, so the footer is naturally at the bottom of the flex column. Or use `mt-auto` on the footer wrapper.

**Step 2: Implement fix**

Wrap the footer in a container with `mt-auto`:
```tsx
<FooterShow>
  <footer className="mt-auto border-t ...">
```

This pushes the footer to the bottom of the flex container regardless of content height.

**Step 3: Verify**

Navigate to a short page (e.g., `/pricing`) and check the footer renders at the bottom of the viewport, not in the middle.

**Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "fix(footer): push to bottom with mt-auto on flex layout"
```

---

## Phase 2: File Structure Cleanup

### Task 2.1: Move loose top-level files into organized directories

**Objective:** Clean up the 20+ loose files at the project root (`.md`, `.mjs`, `.png`, `.sh`, `.json`, etc.)

**Files to move/create:**
- Create: `docs/audits/` directory
- Create: `docs/planning/` directory
- Create: `scripts/` directory

**Step 1: Move audit/analysis docs to `docs/audits/`**
```bash
mkdir -p docs/audits docs/planning scripts
git mv canvas-audit.md docs/audits/
git mv canvas-flaws.md docs/audits/
git mv GOAL_GUIDE.md docs/planning/
git mv HERMES_ROADMAP.md docs/planning/
git mv UI\ Enhancements.md docs/planning/
git mv specs/ docs/planning/
```

**Step 2: Move scripts to `scripts/`**
```bash
git mv build-static.sh scripts/
git mv add-ja-locales.mjs scripts/
git mv ga4-setup.applescript scripts/
git mv ga4-mark-key-events.applescript scripts/
git mv ga4-setup.mjs scripts/
git mv ga4-diagnostic.mjs scripts/
git mv trigger-events.mjs scripts/
git mv trigger-affiliate.mjs scripts/
```

**Step 3: Remove obsolete/temp files**
```bash
git rm batch_1_results.json
git rm mock_output.txt
git rm "## Error Type.html"
git rm saastainednumbers-live.png
git rm Screenshot\ 2026-05-26\ at\ 1.44.19\u200dPM.png
git rm Gemini_Generated_Image.png
git rm ga4-01-realtime.png ga4-02-admin-events.png ga4-admin-events.png ga4-diagnostic-detail.png ga4-event-calculate_tool.png ga4-event-compare_scenario.png
```

**Step 4: Update references**

Check if any remaining code imports from moved files (e.g., `specs/` imports). Update paths.

**Step 5: Commit**

```bash
git commit -m "chore: reorganize project root — move docs, scripts, remove temp files"
```

---

### Task 2.2: Remove dead code

**Objective:** Remove unused functions/files identified in canvas-flaws.md (dead engine, unused exports in canvasNodes.ts, etc.)

**Files:**
- Delete: `canvas/engine/graph.ts` (270 lines of dead code, never imported)
- Delete: `canvas/nodes/CableEdge.tsx` (check if still used)
- Modify: `components/canvas/canvasNodes.ts` (remove dead exports)

**Step 1: Check usage of each file**

```bash
# Check if canvas/engine/graph.ts is imported anywhere
grep -r "canvas/engine/graph" --include="*.ts" --include="*.tsx" .
# Check if CableEdge is imported
grep -r "CableEdge" --include="*.ts" --include="*.tsx" components/canvas/ app/canvas/
```

**Step 2: Delete dead files that are safe to remove**

For each file confirmed unused, `git rm` it.

**Step 3: Remove dead exports from canvasNodes.ts**

Functions to remove (confirmed unused from canvas-flaws.md):
- `buildAllNodes()`
- `generateRackNodes(category)`
- `buildDefaultCables(nodes)`
- `handleNodeConnect(connection)`
- `executeNode(node)`

**Step 4: Commit**

```bash
git commit -m "chore: remove dead code — unused graph engine, CableEdge component, canvasNodes exports"
```

---

### Task 2.3: Consolidate canvas components

**Objective:** Move canvas node components into the `components/canvas/` directory instead of `canvas/nodes/`

**Files:**
- Move: `canvas/nodes/SkeuomorphicCalculatorNode.tsx` → `components/canvas/`
- Move: `canvas/nodes/MasterAggregatorNode.tsx` → `components/canvas/`
- Move: `canvas/nodes/CableEdge.tsx` → `components/canvas/` (if kept)
- Update: imports in `SaaSCanvas.tsx` and `CanvasWorkspace.tsx`

**Step 1:** Move files and update import paths:

```bash
git mv canvas/nodes/SkeuomorphicCalculatorNode.tsx components/canvas/
git mv canvas/nodes/MasterAggregatorNode.tsx components/canvas/
```

**Step 2:** Update import paths in all files that reference `@/canvas/nodes/...`

Search: `grep -r "canvas/nodes" --include="*.tsx" --include="*.ts" .`
Replace: `"@/canvas/nodes/..."` → `"@/components/canvas/..."`

**Step 3:** Delete empty `canvas/` directory structure if everything has been moved.

**Step 4:** Commit

```bash
git commit -m "chore: consolidate canvas node components into components/canvas/"
```

---

## Phase 3: Research — What SaaS Users Need From a Calculator Dashboard

### Task 3.1: Analyze user workflow

**Objective:** Understand what a customer visiting a SaaS calculator site needs from a dashboard/canvas page.

**Target user personas:**
1. **SaaS Founder / Solo Builder** — Needs to quickly calculate multiple metrics side-by-side (MRR, CAC, LTV, churn) to evaluate their business health. Desires a "command center" view.
2. **Startup Analyst / CFO** — Pre-built collections of related metrics (e.g., "Unit Economics Bundle": CAC + LTV + Payback Period). Wants to compare scenarios.
3. **Agency / Consultant** — Needs to run the same set of calculations for multiple clients. Wants to save/load configurations.
4. **Blog Reader / Casual Visitor** — Lands on a calculator page, wants to explore related metrics.

**Key needs synthesized:**
1. **Multi-calculator view** — See several calculators at once without tab-hopping
2. **Saved collections** — Name and save groups of calculators (e.g., "Monthly Checkup", "Fundraising Package")
3. **Input linking/sharing** — Change MRR in one calculator and have it update in another (the original "cable" concept, but simpler)
4. **Presets / Templates** — "Startup Health Check" (MRR + Churn + CAC + LTV), "Pricing Analysis" (ARPU + Gross Margin + MRR Growth)
5. **Export / Share** — Download results as CSV or share a snapshot link
6. **Quick entry** — Minimal friction, no account required, everything local-first

**Deliverable:** This analysis is for planning context. No code changes needed — it informs Phase 4 design.

---

## Phase 4: Dashboard Refactor (Vanilla JS, No React)

### Task 4.1: Create calculator metadata API endpoint

**Objective:** Expose all calculator configs as JSON so the vanilla JS dashboard can fetch them without importing React modules.

**Files:**
- Create: `app/api/calculators/route.ts`

**Step 1: Write the API route**

```typescript
import { getAllCalculators } from "@/lib/registry";
import { NextResponse } from "next/server";

export async function GET() {
  const calculators = getAllCalculators().map((calc) => ({
    slug: calc.slug,
    category: calc.category,
    title: calc.meta.title,
    description: calc.meta.description,
    inputs: calc.inputs.map((i) => ({
      id: i.id,
      label: i.label,
      type: i.type,
      defaultValue: i.defaultValue,
      min: i.min,
      max: i.max,
    })),
    outputs: calc.outputs.map((o) => ({
      id: o.id,
      label: o.label,
      type: o.type,
      isPrimary: o.isPrimary,
    })),
  }));

  return NextResponse.json(calculators);
}
```

**Step 2: Test the endpoint**

Run: `curl -s http://localhost:3000/api/calculators | jq '. | length'`
Expected: `75` (or the current count of registered calculators)

**Step 3: Commit**

```bash
git add app/api/calculators/route.ts
git commit -m "feat(api): add calculator metadata endpoint for dashboard"
```

---

### Task 4.2: Create vanilla JS dashboard page (server shell)

**Objective:** Create the Next.js page shell that serves the vanilla HTML/CSS/JS for the new dashboard. No React components in the interactive area.

**Files:**
- Modify: `app/dashboard/page.tsx` — replace React client component with inline script/link to vanilla JS bundle
- Create: `app/dashboard/dashboard.js` — vanilla JS module
- Create: `app/dashboard/dashboard.css` — dashboard-specific styles

**Step 1: Rewrite the server page**

```tsx
// app/dashboard/page.tsx — Server component only, no "use client"
import type { Metadata } from "next";
import { getTranslations } from "@/lib/getTranslations";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Build custom calculator collections — your SaaS metrics command center.",
};

export default async function DashboardPage() {
  const { t, locale } = await getTranslations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("nav.dashboard")}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Build custom collections, save presets, run scenarios.
      </p>
      <div id="dashboard-root" className="mt-8" />
      <script src="/dashboard/dashboard.js" type="module" />
      <link rel="stylesheet" href="/dashboard/dashboard.css" />
    </div>
  );
}
```

**Step 2: Move dashboard files to `public/dashboard/`**

Since we can't use JSX in vanilla JS files served through Next.js's public directory:
```bash
mkdir -p public/dashboard
```

Create `public/dashboard/dashboard.js` — the vanilla JS module.
Create `public/dashboard/dashboard.css` — the styling.

The `script` tag with `/dashboard/dashboard.js` will be served from `public/dashboard/dashboard.js` as a static file.

**Step 3: Commit**

```bash
git add app/dashboard/page.tsx public/dashboard/dashboard.js public/dashboard/dashboard.css
git commit -m "feat(dashboard): server shell for vanilla JS dashboard page"
```

---

### Task 4.3: Implement vanilla JS calculator picker

**Objective:** Users can browse/search all 75+ calculators and add them to their collection.

**File:** `public/dashboard/dashboard.js`

**Step 1: Fetch calculator metadata on page load**

```javascript
// dashboard.js — vanilla JS, no framework
const state = {
  calculators: [],
  collection: [],
  collections: JSON.parse(localStorage.getItem("dashboard-collections") || "[]"),
  activeCollection: null,
};

async function init() {
  const res = await fetch("/api/calculators");
  state.calculators = await res.json();
  render();
}
```

**Step 2: Render calculator picker UI**

A searchable grid of calculator cards grouped by category. Clicking a card adds it to the current collection.

```javascript
function renderPicker() {
  const root = document.getElementById("dashboard-root");
  // render search input, category filters, calculator cards
}
```

**Step 3: Verify**

Load `/dashboard` — calculator picker should render with all calculators searchable.

**Step 4: Commit**

```bash
git add public/dashboard/dashboard.js public/dashboard/dashboard.css
git commit -m "feat(dashboard): implement calculator picker with search"
```

---

### Task 4.4: Implement collection management

**Objective:** Users can create named collections, add/remove calculators, and save to localStorage.

**File:** `public/dashboard/dashboard.js`

**Step 1: Collection CRUD operations**

```javascript
function saveCollections() {
  localStorage.setItem("dashboard-collections", JSON.stringify(state.collections));
}

function createCollection(name) {
  const collection = { id: crypto.randomUUID(), name, calculators: [], createdAt: Date.now() };
  state.collections.push(collection);
  state.activeCollection = collection.id;
  saveCollections();
  render();
}

function deleteCollection(id) { /* ... */ }
function addCalculatorToCollection(collectionId, slug) { /* ... */ }
function removeCalculatorFromCollection(collectionId, slug) { /* ... */ }
```

**Step 2: Render collection sidebar/list**

Show saved collections. Click to activate. "New Collection" button.

**Step 3: Verify**

Create a collection, add 3 calculators, refresh page — collection should persist.

**Step 4: Commit**

```bash
git add public/dashboard/dashboard.js
git commit -m "feat(dashboard): collection CRUD with localStorage persistence"
```

---

### Task 4.5: Implement preset/quick-start templates

**Objective:** Provide pre-built collections that users can one-click load.

**File:** `public/dashboard/dashboard.js`

**Step 1: Define presets**

```javascript
const PRESETS = [
  {
    name: "Startup Health Check",
    description: "MRR + Churn + CAC + LTV — the essential 4",
    calculators: ["mrr-calculator", "churn-calculator", "cac-calculator", "ltv-calculator"],
  },
  {
    name: "Unit Economics Deep Dive",
    description: "CAC, LTV, payback, gross margin, contribution margin",
    calculators: ["cac-calculator", "ltv-calculator", "payback-period-calculator", "gross-margin-calculator", "contribution-margin-calculator"],
  },
  {
    name: "Growth Efficiency",
    description: "Quick ratio, magic number, rule of 40, burn multiple",
    calculators: ["quick-ratio-calculator", "magic-number-calculator", "rule-of-40-calculator", "burn-rate-calculator"],
  },
  {
    name: "Revenue Breakdown",
    description: "MRR, ARPU, NRR, MRR growth, ACV",
    calculators: ["mrr-calculator", "arpu-calculator", "nrr-calculator", "mrr-growth-rate-calculator", "acv-calculator"],
  },
  {
    name: "Startup Fundraising Prep",
    description: "Valuation, revenue per employee, capital efficiency, TAM/SAM/SOM",
    calculators: ["business-valuation-calculator", "revenue-per-employee-calculator", "saas-capital-efficiency-calculator", "tam-sam-som-calculator"],
  },
];
```

**Step 2: Render preset cards**

Show preset grid with "Load Preset" button. Clicking replaces the current collection.

**Step 3: Commit**

```bash
git add public/dashboard/dashboard.js
git commit -m "feat(dashboard): add 5 preset calculator collections"
```

---

### Task 4.6: Implement inline calculator rendering

**Objective:** Calculators in a collection render inline — user can input values and see results without leaving the dashboard.

**File:** `public/dashboard/dashboard.js`

**Step 1: Inline calculator component**

Each calculator in a collection renders as a card with:
- Title, description
- Input fields (number inputs with labels)
- Output values (computed in real-time, no server round-trip)

```javascript
function renderCalculatorCard(calc) {
  const card = document.createElement("div");
  card.className = "rounded-xl border p-4 bg-white dark:bg-gray-800";
  // ... render inputs, outputs
  return card;
}
```

**Step 2: Engine computation (client-side)**

The engines are pure math functions. Since we can't import them directly (they're in the Next.js bundle), we need to either:
- **Option A:** Create a separate engine computation API endpoint
- **Option B:** Embed the engine logic in the JS file (simplified versions)
- **Option C:** Use a Web Worker that imports the engine modules

For simplicity, Option B: create a lightweight inline computation that matches the engine outputs for the most common calculators. For calculators with complex engines, fetch from an API endpoint.

```javascript
// Inline computation for common calculators
function compute(slug, inputs) {
  switch (slug) {
    case "mrr-calculator":
      return { mrr: inputs.customers * inputs.arpu, arr: inputs.customers * inputs.arpu * 12 };
    case "churn-calculator":
      return { monthlyChurn: inputs.churnedCustomers / inputs.startingCustomers, ... };
    // ... more
  }
}
```

**Better approach — Option C:** Use a Web Worker that imports a pre-computed engine bundle:

```javascript
// dashboard.js
const worker = new Worker("/dashboard/engine-worker.js");
worker.postMessage({ slug: "mrr-calculator", inputs: { customers: 100, arpu: 50 } });
worker.onmessage = (e) => { /* update UI */ };
```

The Web Worker can be generated at build time by bundling the engine functions.

**Step 3: Verify**

Open dashboard, add MRR calculator, type values into input fields — outputs should update instantly.

**Step 4: Commit**

```bash
git add public/dashboard/dashboard.js public/dashboard/dashboard.css
git commit -m "feat(dashboard): inline calculator rendering with client-side computation"
```

---

### Task 4.7: Style dashboard consistently with site theme

**Objective:** Dashboard UI matches the existing site design (dark/light mode, typography, colors).

**File:** `public/dashboard/dashboard.css`

**Step 1: Define CSS variables matching the site's Tailwind theme**

```css
:root {
  --color-brand: #008387;
  --color-brand-light: #0d9488;
  --color-bg: #ffffff;
  --color-bg-card: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #030712;
    --color-bg-card: #1f2937;
    --color-text: #f3f4f6;
    --color-text-secondary: #9ca3af;
    --color-border: #374151;
  }
}
```

**Step 2: Match card styles to existing calculator cards**

Use the same rounded corners, shadows, border treatments as the calculator card components.

**Step 3: Verify**

Switch between light/dark mode — dashboard should respect the user's preference consistently.

**Step 4: Commit**

```bash
git add public/dashboard/dashboard.css
git commit -m "style(dashboard): match site theme with CSS variables"
```

---

### Task 4.8: Remove old React Canvas page

**Objective:** Once the new dashboard is verified working, remove the old React Canvas code.

**Files to delete:**
- `app/canvas/` (entire directory)
- `components/canvas/` (entire directory)
- `canvas/` (entire directory, if anything remains)
- Update: Nav.tsx to remove "Canvas" link or redirect to Dashboard

**Step 1: Remove canvas app directory**
```bash
rm -rf app/canvas/
```

**Step 2: Remove canvas components**
```bash
rm -rf components/canvas/
```

**Step 3: Update navigation**

In `Nav.tsx`, change the Canvas link to point to `/dashboard` instead:
```tsx
<Link href="/dashboard" ...>{t("nav.dashboard")}</Link>
```

Remove the Canvas entry from Nav.tsx `links` object.

**Step 4: Remove canvas test files**
```bash
rm -rf tests/e2e/canvas-*.spec.ts
```

**Step 5: Commit**

```bash
git commit -m "feat: replace React Canvas with vanilla JS Dashboard"
```

---

## Phase 5: Validation

### Task 5.1: Run full test suite

**Objective:** Verify all existing tests still pass after the changes.

**Step 1: Run e2e tests**

```bash
npx playwright test ./tests/e2e/ --reporter=list
```

Expected: All non-canvas tests pass (canvas-specific tests were removed).

**Step 2: Run unit tests**

```bash
npx vitest run
```

Expected: All tests pass.

**Step 3: Run build**

```bash
npm run build
```

Expected: 0 TypeScript errors, static export succeeds.

**Step 4: Manual smoke test**

Check each page loads correctly:
- `/` — Homepage
- `/calculators` — Calculator listing
- `/dashboard` — New vanilla JS dashboard (calculator picker, collections, presets)
- `/pricing` — Pricing page
- `/blog` — Blog listing
- `/contact` — Contact page (footer link fixed)

**Step 5: Commit**

```bash
git commit -m "chore: update test references after dashboard refactor"
```

---

## Phase 6: Risks, Tradeoffs & Open Questions

### Risks

1. **Vanilla JS complexity** — Building a non-trivial interactive UI (calculator rendering, state management, localStorage sync) in vanilla JS requires careful code organization. Without a framework, there's no built-in reactivity — must manually update DOM on state change.
   - **Mitigation:** Use a simple render-loop pattern: update `state` → call `render()` which clears and re-renders the relevant section.

2. **Engine duplication** — Client-side computation must match the server-side engine logic. If a calculator's formula changes, both the server engine and the dashboard's inline computation must be updated.
   - **Mitigation:** Phase 4 Task 6 uses a Web Worker approach to share engine code. If that's too complex, at minimum have the dashboard call an API endpoint for computation.

3. **SEO impact** — The dashboard is behind a client-rendered JS bundle. It won't be indexed by search engines.
   - **Acceptable:** This is an authenticated/personal tool page. SEO is irrelevant for `/dashboard`.

4. **Bundle size** — The engine worker bundle for 75+ calculators could be large.
   - **Mitigation:** Only bundle engines that are actually needed (lazy-load on demand).

### Tradeoffs

| Approach | Pro | Con |
|----------|-----|-----|
| Vanilla JS (chosen) | No React runtime overhead, no stale closure bugs | More manual DOM work |
| Web Worker for engines | Accurate computation, shares server logic | More complex build pipeline |
| Inline simple engines | Simple, no build step | May diverge from server engines |
| localStorage (chosen) | No backend needed, zero setup | Data doesn't sync across devices |
| API endpoint for computation | Always accurate | Latency on every input change |

### Open Questions

1. **Should dashboard state persist across devices?** Currently localStorage-only (no account). Could add cloud sync later via the existing NextAuth setup, but that requires sign-in.
2. **How to handle the "input linking" concept?** The old Canvas had cables between nodes. In the dashboard, this could be "share a value" between two calculator cards (e.g., MRR value flows into MRR Growth Rate calculator). Implement as a simple dropdown: "Use output from: [dropdown of other calculators in collection]".
3. **Export format?** CSV is the minimum viable. Should we also support JSON (for re-import) and PDF (for sharing)?
4. **Should calculators within a collection auto-save input values?** Yes — save each card's input values to localStorage so the user doesn't lose work on page refresh.

---

## Summary of All Files Changed

| Phase | File | Action |
|-------|------|--------|
| 1.1 | `components/Nav.tsx` | Modify — add missing desktop nav links |
| 1.2 | `app/layout.tsx` | Modify — fix contact.title i18n key |
| 1.2 | `i18n/*/common.json` | Modify — add contact.title key |
| 1.3 | `app/layout.tsx` | Modify — add `mt-auto` to footer |
| 2.1 | Root level | Move/delete 20+ loose files |
| 2.2 | `canvas/engine/graph.ts` | Delete — dead code |
| 2.2 | `components/canvas/canvasNodes.ts` | Modify — remove dead exports |
| 2.3 | `canvas/nodes/*.tsx` | Move to `components/canvas/` |
| 2.3 | `SaaSCanvas.tsx`, `CanvasWorkspace.tsx` | Modify — update import paths |
| 4.1 | `app/api/calculators/route.ts` | Create — metadata API endpoint |
| 4.2 | `app/dashboard/page.tsx` | Rewrite — server shell for vanilla JS |
| 4.2 | `public/dashboard/dashboard.js` | Create — vanilla JS dashboard |
| 4.2 | `public/dashboard/dashboard.css` | Create — dashboard styles |
| 4.3-6 | `public/dashboard/dashboard.js` | Modify — add calculator picker, collections, presets, inline rendering |
| 4.8 | `app/canvas/` | Delete — entire directory |
| 4.8 | `components/canvas/` | Delete — entire directory |
| 4.8 | `canvas/` | Delete — entire directory |
| 4.8 | `tests/e2e/canvas-*.spec.ts` | Delete — old canvas tests |

---

## Verification Checklist

- [ ] Desktop nav shows: Calculators, Dashboard, Pricing, Blog, Canvas
- [ ] Footer shows "Contact" not "contact.title"
- [ ] Footer sits at bottom of viewport on short pages
- [ ] Project root is clean — docs in `docs/`, scripts in `scripts/`
- [ ] No dead code imported anywhere
- [ ] `/api/calculators` returns 75+ calculator configs as JSON
- [ ] `/dashboard` loads without React errors
- [ ] Calculator picker renders with search and category filter
- [ ] Collections can be created, named, and saved to localStorage
- [ ] Collections persist across page refresh
- [ ] Preset templates load correctly
- [ ] Inline calculator inputs update outputs in real-time
- [ ] Dark/light mode respects system preference
- [ ] `npm run build` passes with 0 errors
- [ ] Old Canvas routes (`/canvas`) return 404 or redirect to `/dashboard`
