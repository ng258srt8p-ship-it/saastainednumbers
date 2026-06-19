# Homepage, Dashboard & Canvas Refactor Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task with two-stage review.

**Goal:** (1) Revert homepage category gallery to consistent card styling matching the existing Popular section, (2) remove Dashboard entirely from the app, (3) completely rewrite Canvas as a calculator customization workspace using a different technology stack.

**Architecture:**
- Homepage gets a visual consistency pass: the "Browse by Category" grid (section 02) adopts the same card layout as the "Popular Calculators" section instead of the Mobbin gradient‑thumbnail cards.
- Dashboard and all its assets are deleted cleanly with no dangling imports.
- Canvas is rebuilt using a lightweight own‑framework approach (vanilla React + HTML5 Drag & Drop API) instead of the heavy `@xyflow/react` dependency. The new Canvas is a two‑panel layout: a *calculator catalog* sidebar (all available calculators grouped by category) and a *workspace grid* where users drag calculators to create a personalized dashboard. Each placed calculator renders as a live, interactive calculator node that can be removed or repositioned.

**Tech Stack:** Next.js 16, Tailwind CSS v4, React (no xyflow, no additional libraries for DnD — native HTML5 Drag & Drop), Framer Motion (for smooth drag feedback and item animations).

---

### Task 1: Revert Homepage Category Gallery to Consistent Card Style

**Objective:** Make the "Browse by Category" grid cards match the exact card style of the "Popular Calculators" section, with the same `h3` class the user specified.

**Files:**
- Modify: `app/page.tsx` — sections 02 (categories) and 04 (by the numbers) card styles

**Context:** Current state of the homepage:
- **Popular section** (lines 134–166): Uses cards with `className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"` and `h3 className="mt-2 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors flex items-center gap-2"`
- **Category section** (lines 176–213): Uses Mobbin gradient-thumbnail cards (h-24 gradient div + CategoryIcon) — this is what needs to be replaced
- **By the Numbers section** (lines 272–288): Uses `rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-center` — should be updated to match the Popular card style

#### Step 1: Identify the exact card markup to use as template

The canonical card from the Popular section (lines 140–161):
```tsx
<Link
  key={slug}
  href={`/${category}/${slug}`}
  className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
>
  <span className="text-xs font-medium uppercase tracking-wider text-brand-500 dark:text-brand-400">
    {t("category." + getCategoryTranslationKey(calc.category))}
  </span>
  <h3 className="mt-2 font-heading text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors flex items-center gap-2">
    {resolved.meta.title}
    {calc.isNew && (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0">
        <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}>star</span>
        {t("common.new")}
      </span>
    )}
  </h3>
  <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{resolved.meta.description}</p>
  <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
    {t("home.openCalculator")}
  </span>
</Link>
```

#### Step 2: Rewrite section 02 (Categories)

Replace the current Mobbin gradient-thumbnail grid (lines 176–213 of `app/page.tsx`) with cards matching the template above. Each card shows:
- Category name as a label (like Popular shows calc category)
- Category title as the h3 (like Popular shows calc title)
- Category description as the p (like Popular shows calc description)
- Count badge (preserve the count badge)
- Hover shimmer effect

The grid should remain `sm:grid-cols-2 lg:grid-cols-3` with `gap-6`.

#### Step 3: Update section 04 (By the Numbers)

Update the statistics cards (lines 272–288) to use `rounded-xl` instead of `rounded-2xl` for consistency with the Popular card style, and match border/shadow classes exactly.

#### Step 4: Remove Mobbin button classes

If `mobbin-btn-*` classes are referenced in the homepage (line 218), replace with equivalent Tailwind utility classes directly inline to eliminate dependency on the custom CSS class.

#### Step 5: Verify

Run `npx next build` and `npx next dev` — confirm no errors. Load homepage and verify:
- All categories render as consistent cards matching the Popular section style
- "By the Numbers" cards match the card border/shadow/rounded style
- No build errors

---

### Task 2: Delete Dashboard Entirely

**Objective:** Remove the Dashboard page, its nav links (both desktop and mobile), and all its assets. No dangling imports or dead files.

**Files:**
- Delete: `app/dashboard/` (entire directory)
- Delete: `public/css/dashboard.css`
- Delete: `public/js/dashboard.js`
- Delete: `public/dashboard/dashboard.css`
- Delete: `public/dashboard/dashboard.js`
- Modify: `components/Nav.tsx` — remove Dashboard link
- Modify: `components/MobileNav.tsx` — remove Dashboard link
- Remove: `lib/insights-engine.ts` (if only used by dashboard — verify first)
- Remove: `posthog.ts` (if only used by dashboard — verify first)

#### Step 1: Verify other files import Dashboard

Run a search for any file that imports from `@/app/dashboard`, `dashboard-shell`, `dashboard-client`, or references the `/dashboard` route:

```bash
cd /Users/georgetozer/Development/WebCalc
grep -r "dashboard" --include="*.ts" --include="*.tsx" --include="*.js" \
  --exclude-dir="node_modules" --exclude-dir=".next" --exclude-dir="tests" \
  | grep -v "dashboard-root\|dashboard.css\|dashboard.js" | grep -v "//.*dashboard"
```

Expected results: only Nav.tsx and MobileNav.tsx should reference "dashboard".

#### Step 2: Remove Dashboard link from Nav.tsx

Current Nav structure (around lines 33–59):
```tsx
<Link href="/calculators" ...>{links.calculators}</Link>
<Link href="/dashboard" ...>{links.dashboard}</Link>       ← DELETE
<Link href="/pricing" ...>{links.pricing}</Link>
<Link href="/blog" ...>{links.blog}</Link>
<Link href="/canvas" ...>{links.canvas}</Link>
```

Delete the Dashboard `<Link>` and its associated whitespace.

Also remove the `dashboard: t("nav.dashboard")` entry from the translations object at the top of the component.

#### Step 3: Remove Dashboard link from MobileNav.tsx

Current structure:
```tsx
{ label: t.dashboard ?? "Dashboard", href: "/dashboard" },  ← DELETE
```

Delete this line.

#### Step 4: Delete Dashboard files

```bash
rm -rf app/dashboard/
rm public/css/dashboard.css
rm public/js/dashboard.js
rm public/dashboard/dashboard.css
rm public/dashboard/dashboard.js
```

#### Step 5: Check for other Dashboard references

Check `app/layout.tsx`, `components/ShowWhenNotEmbed.tsx`, and any other files that might import or reference dashboard components.

#### Step 6: Verify build

Run `npx next build` — expected: 0 errors, 0 warnings (dashboard pages removed from page count).

---

### Task 3: Rewrite Canvas Page — Calculator Customization Workspace

**Objective:** Rebuild `/canvas` as a simple, lightweight drag-and-drop workspace where users browse all available calculators and drag them onto a grid to create a personalized calculator dashboard. No `@xyflow/react`. Use vanilla React + HTML5 Drag and Drop API.

**New Canvas Architecture:**
- **Left panel:** Calculator catalog sidebar — calculators grouped by category, each shown as a small card with icon + name, draggable
- **Right panel (workspace):** A CSS Grid (auto-fill, responsive) where dropped calculators render as live interactive calculator nodes
- **Persistence:** Saved to localStorage
- **Remove from workspace:** Click an "×" button on each placed calculator node

**Files:**
- Delete: `components/canvas/CanvasContext.tsx`
- Delete: `components/canvas/CanvasWorkspace.tsx`
- Delete: `components/canvas/SaaSCanvas.tsx`
- Delete: `components/canvas/SkeuomorphicCalculatorNode.tsx`
- Delete: `components/canvas/MasterAggregatorNode.tsx`
- Delete: `components/canvas/CableEdgePatch.tsx`
- Delete: `components/canvas/FullscreenCanvasPanel.tsx`
- Delete: `components/canvas/CanvasHelp.tsx`
- Delete: `components/canvas/CanvasTour.tsx`
- Delete: `components/canvas/canvasNodes.ts`
- Delete: `components/canvas/graphEngine.ts`
- Delete: `app/canvas/layout.tsx` (old dark bg layout)
- Delete: `app/canvas/error.tsx`
- Delete: `app/canvas/meta.ts`
- Rewrite: `app/canvas/page.tsx` (the new Canvas page)
- Create: `components/canvas/CalculatorCatalog.tsx` (catalog sidebar)
- Create: `components/canvas/CalculatorWorkspace.tsx` (drop grid)
- Create: `components/canvas/CanvasCalculatorNode.tsx` (single calculator in workspace)
- Delete: `@xyflow/react` from package.json dependencies

#### Step 1: Delete old Canvas component files

Remove all 11 files inside `components/canvas/` (keep directory for new files).

```bash
rm -rf components/canvas/*
```

#### Step 2: Rewrite `app/canvas/page.tsx` — Main Canvas Page

The new Canvas page is a client component with a two‑panel layout:

```tsx
"use client";

import { useState } from "react";
import { CalculatorCatalog } from "@/components/canvas/CalculatorCatalog";
import { CalculatorWorkspace } from "@/components/canvas/CalculatorWorkspace";

export default function CanvasPage() {
  const [workspaceCalculators, setWorkspaceCalculators] = useState<string[]>([]);

  const addCalculator = (slug: string) => {
    setWorkspaceCalculators(prev => prev.includes(slug) ? prev : [...prev, slug]);
  };

  const removeCalculator = (slug: string) => {
    setWorkspaceCalculators(prev => prev.filter(s => s !== slug));
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Catalog sidebar */}
      <CalculatorCatalog onAddCalculator={addCalculator} addedSlugs={workspaceCalculators} />
      {/* Drop workspace */}
      <CalculatorWorkspace
        slugs={workspaceCalculators}
        onRemoveCalculator={removeCalculator}
      />
    </div>
  );
}
```

#### Step 3: Create `components/canvas/CalculatorCatalog.tsx`

This is the left sidebar — shows all calculators grouped by category. Each calculator is a small draggable card:

```tsx
"use client";

import { useMemo } from "react";
import { getAllCalculators, getAllKnownCategories, CATEGORY_META, getCategoryTranslationKey } from "@/lib/registry";
import { resolveLocaleConfig } from "@/lib/resolve-calculator-locale";

interface CalculatorCatalogProps {
  onAddCalculator: (slug: string) => void;
  addedSlugs: string[];
}

export function CalculatorCatalog({ onAddCalculator, addedSlugs }: CalculatorCatalogProps) {
  const allCalculators = useMemo(() => getAllCalculators(), []);
  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, typeof allCalculators> = {};
    for (const calc of allCalculators) {
      if (!map[calc.category]) map[calc.category] = [];
      map[calc.category].push(calc);
    }
    return map;
  }, [allCalculators]);

  const handleDragStart = (e: React.DragEvent, slug: string) => {
    e.dataTransfer.setData("text/plain", slug);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="w-72 lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto shrink-0">
      <div className="p-4">
        <h2 className="font-heading text-base font-bold text-gray-900 dark:text-gray-100">
          Calculator Catalog
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Drag calculators onto the workspace
        </p>
      </div>
      <div className="px-2 pb-4 space-y-4">
        {Object.entries(grouped).map(([category, calcs]) => (
          <div key={category}>
            <h3 className="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              {category.replace(/-/g, " ")}
            </h3>
            <div className="space-y-0.5">
              {calcs.map(calc => {
                const isAdded = addedSlugs.includes(calc.slug);
                return (
                  <button
                    key={calc.slug}
                    draggable={!isAdded}
                    onDragStart={(e) => handleDragStart(e, calc.slug)}
                    onClick={() => !isAdded && onAddCalculator(calc.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      isAdded
                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 cursor-default"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <span className="text-xs">{/* CategoryIcon or emoji */}</span>
                    <span className="truncate">{calc.name}</span>
                    {isAdded && <span className="ml-auto text-[10px] text-brand-500">✓ Added</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
```

**Important implementation notes:**
- Use `getAllCalculators()` from `@/lib/registry` — this returns all 75+ calculators
- Each calculator in the catalog has `slug`, `name`, `category` from the registry
- Dragged items use `dataTransfer.setData("text/plain", slug)` — the slug is the identifier
- Already-added calculators show "✓ Added" and are not draggable but are clickable to focus in workspace

#### Step 4: Create `components/canvas/CalculatorWorkspace.tsx`

The right panel — a responsive CSS Grid showing the user's selected calculators as live interactive widgets:

```tsx
"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalculatorWidget } from "./CalculatorWidget";

interface CalculatorWorkspaceProps {
  slugs: string[];
  onRemoveCalculator: (slug: string) => void;
}

export function CalculatorWorkspace({ slugs, onRemoveCalculator }: CalculatorWorkspaceProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData("text/plain");
    if (slug) {
      // Signal parent to add
      const event = new CustomEvent("canvas:addCalculator", { detail: { slug } });
      window.dispatchEvent(event);
    }
  };

  return (
    <main
      className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {slugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" ...>...</svg>
          </div>
          <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Workspace is Empty
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Drag calculators from the catalog on the left to start building your personalized dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
          <AnimatePresence>
            {slugs.map((slug, index) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                layout
              >
                <CalculatorWidget slug={slug} onRemove={() => onRemoveCalculator(slug)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
```

The workspace listens for drop events and dispatches a custom event back to the page component (or we can use a simpler approach — pass an `onDrop` callback up through context or directly).

#### Step 5: Create `components/canvas/CalculatorWidget.tsx`

A live calculator widget that renders in the workspace. It renders a simplified card with the calculator's inputs and outputs:

```tsx
"use client";

import { useMemo, useState } from "react";
import { getAllCalculators } from "@/lib/registry";
import { getEngine } from "@/calculators/engine";
import { CalculatorInput } from "@/calculators/ui/CalculatorInput";

interface CalculatorWidgetProps {
  slug: string;
  onRemove: () => void;
}

export function CalculatorWidget({ slug, onRemove }: CalculatorWidgetProps) {
  const [values, setValues] = useState<Record<string, number>>({});

  // Find calculator config
  const calc = useMemo(() => {
    return getAllCalculators().find(c => c.slug === slug);
  }, [slug]);

  if (!calc) return null;

  const engine = getEngine(slug);
  const inputs = calc.inputs || [];
  const outputs = engine(values);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-heading text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {calc.name || slug}
        </h3>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label={`Remove ${calc.name || slug}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Inputs */}
      <div className="px-4 py-3 space-y-3">
        {inputs.slice(0, 4).map(input => (
          <CalculatorInput
            key={input.id}
            input={input}
            value={values[input.id] ?? input.default ?? 0}
            onChange={(v) => setValues(prev => ({ ...prev, [input.id]: v }))}
          />
        ))}
        {inputs.length > 4 && (
          <p className="text-xs text-gray-400">+ {inputs.length - 4} more inputs</p>
        )}
      </div>

      {/* Outputs */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
        {Object.entries(outputs).slice(0, 4).map(([key, value]) => (
          <div key={key}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{key}</p>
            <p className="font-numbers text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatOutput(value)}
            </p>
          </div>
        ))}
      </div>

      {/* Click to view full */}
      <a
        href={`/${calc.category}/${calc.slug}`}
        className="block px-4 py-2 text-xs text-center text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl transition-colors"
      >
        Open Full Calculator →
      </a>
    </div>
  );
}

function formatOutput(value: number | string): string {
  if (typeof value === "string") return value;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}
```

#### Step 6: Update `app/canvas/layout.tsx`

Simplify — no dark bg from the old xyflow era. Just pass through:
```tsx
export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col min-h-0">{children}</div>;
}
```

#### Step 7: Remove `@xyflow/react` from dependencies

In `package.json`:
```json
"dependencies": {
  ...
  // "@xyflow/react": "^12.11.0",  ← DELETE THIS LINE
  ...
}
```

Then run `npm uninstall @xyflow/react`.

#### Step 8: Verify build

```bash
npx next build
```

Expected: 0 errors. Page count should decrease by 3 (dashboard pages removed, canvas simplified to 1 page).

---

### Task 4: Final Cleanup & Verification

**Objective:** Verify all three tasks are complete with no regressions.

#### Step 1: Verify homepage renders correctly

```bash
# Start dev server
npx next dev > /tmp/verify.log 2>&1 &
sleep 10
# Load homepage, check category cards use correct h3 class
curl -sL http://localhost:3000/ | grep -c "group-hover:text-brand-600"
# Expected: > 0 (categories now use this class)
```

#### Step 2: Verify Dashboard is gone

```bash
curl -sL -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard 2>/dev/null
# Expected: 404
```

#### Step 3: Verify Canvas loads

```bash
curl -sL -o /dev/null -w "%{http_code}" http://localhost:3000/canvas 2>/dev/null
# Expected: 200
```

#### Step 4: Check for dangling imports

```bash
grep -r "from.*dashboard" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next
# Expected: nothing
grep -r "@xyflow/react" --include="*.json" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next
# Expected: nothing (uninstalled)
```

#### Step 5: Run e2e tests

```bash
npx playwright test ./tests/e2e/homepage.spec.ts ./tests/e2e/pricing.spec.ts ./tests/e2e/blog.spec.ts --workers=2 --reporter=list
```

Expected: all tests pass (dashboard tests removed by Task 2).

---

## Files Changed Summary

| Task | Action | File |
|---|---|---|
| T1 | Modify | `app/page.tsx` (category gallery + stats cards) |
| T2 | Delete | `app/dashboard/` directory |
| T2 | Delete | `public/css/dashboard.css` |
| T2 | Delete | `public/js/dashboard.js` |
| T2 | Delete | `public/dashboard/*` |
| T2 | Modify | `components/Nav.tsx` (remove Dashboard link + translation) |
| T2 | Modify | `components/MobileNav.tsx` (remove Dashboard link) |
| T3 | Delete | `components/canvas/CanvasContext.tsx` |
| T3 | Delete | `components/canvas/CanvasWorkspace.tsx` |
| T3 | Delete | `components/canvas/SaaSCanvas.tsx` |
| T3 | Delete | `components/canvas/SkeuomorphicCalculatorNode.tsx` |
| T3 | Delete | `components/canvas/MasterAggregatorNode.tsx` |
| T3 | Delete | `components/canvas/CableEdgePatch.tsx` |
| T3 | Delete | `components/canvas/FullscreenCanvasPanel.tsx` |
| T3 | Delete | `components/canvas/CanvasHelp.tsx` |
| T3 | Delete | `components/canvas/CanvasTour.tsx` |
| T3 | Delete | `components/canvas/canvasNodes.ts` |
| T3 | Delete | `components/canvas/graphEngine.ts` |
| T3 | Modify | `app/canvas/layout.tsx` (simplify) |
| T3 | Delete | `app/canvas/error.tsx` |
| T3 | Delete | `app/canvas/meta.ts` |
| T3 | Rewrite | `app/canvas/page.tsx` |
| T3 | Create | `components/canvas/CalculatorCatalog.tsx` |
| T3 | Create | `components/canvas/CalculatorWorkspace.tsx` |
| T3 | Create | `components/canvas/CalculatorWidget.tsx` |
| T3 | Modify | `package.json` (remove `@xyflow/react`) |
| T4 | Verify | Build, HTTP checks, e2e tests |

## Risks & Tradeoffs

1. **Dashboard data persistence:** The dashboard used `localStorage` via a vanilla JS module. The new Canvas can optionally adopt localStorage to persist the user's selected calculators — not in scope for this plan but easy to add later.
2. **Calculator engines:** The Canvas widget uses the same pure-TS engine functions as the calculator pages (`@/calculators/engine`), so results are identical. The widget only shows a subset of inputs/outputs — the "Open Full Calculator" link handles complex cases.
3. **Drag and Drop browser support:** HTML5 DnD is supported in all modern browsers. No polyfill needed.
4. **Removed CalculatorIcon dependency:** In the catalog, you may need to import `CategoryIcon` or use inline emoji/SVGs for each calculator. Alternatively, simply use a text-based list without icons for simplicity.
5. **Page count decrease:** After removing Dashboard (3 pages) and Canvas (2 pages consumed by xyflow SPA), the total page count drops by ~2 (depends on static/dynamic splits).
