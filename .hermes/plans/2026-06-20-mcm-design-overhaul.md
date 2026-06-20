# MCM (Mid-Century Modern) Design System Overhaul

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Transform saastainednumbers.com from its current Mobbin/soft-card aesthetic into a premium Mid-Century Modern design system with asymmetric grids, bold geometric borders, serif typography, and high-contrast color blocking — achieving 100% MCM compliance across all 75 calculator pages, homepage, category pages, and navigation.

**Architecture:** Replace Tailwind utility classes and CSS custom properties in `globals.css` with MCM design tokens. Update `CalculatorShell.tsx`, `CalculatorClient.tsx`, `page.tsx`, `Nav.tsx`, and all shared UI components to use the new system. No new dependencies — pure CSS + Tailwind class updates.

**Tech Stack:** Next.js 16.2.6, React, TypeScript, Tailwind CSS v4, CSS custom properties

---

## Current State (Investigation Findings)

### What exists today:
- **Mobbin-style** utility classes: `.mobbin-card`, `.mobbin-card-hover`, `.mobbin-input`, `.mobbin-btn-primary`, `.mobbin-btn-secondary`
- **Soft rounded corners**: `rounded-xl`, `rounded-2xl`, `rounded-lg` everywhere
- **Subtle shadows**: `shadow-sm`, `elevation-1` through `elevation-4`
- **Gradient hero**: `bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950`
- **Card-based layout**: Calculator shell uses `rounded-2xl border border-gray-200 bg-card-bg p-4 sm:p-6 shadow-sm`
- **CalculatorShell.tsx**: Single-column with optional sidebar ad slot, max-w-4xl
- **Nav.tsx**: Floating pill-shaped nav with backdrop blur, rounded-full
- **Homepage**: Symmetric 3-column grids, centered sections
- **Brand colors**: Teal (#008387) primary, Navy (#143562) secondary

### What MCM requires:
- **Sharp edges**: Zero border-radius on cards, buttons, inputs (or minimal 2px max)
- **Bold borders**: 2-3px solid black/dark borders instead of shadows for depth
- **Asymmetric grids**: Offset columns, intentional asymmetry
- **Serif headings**: Mix of serif display font for headings + clean sans-serif body
- **Color blocking**: Solid geometric color sections, not gradients
- **Flat design**: No shadows — borders and color define hierarchy
- **Geometric accents**: Bold circles, triangles, lines as decorative elements
- **High contrast**: Black/white/brand with bold accent pops

---

## Task 1: MCM Design Tokens in globals.css

**Objective:** Replace Mobbin-style tokens and add MCM design tokens to the CSS foundation.

**Files:**
- Modify: `app/globals.css`

**Step 1: Add MCM tokens to :root and .dark**

Replace the existing `:root` and `.dark` CSS custom property blocks with MCM equivalents. Keep the `@theme` block intact (Tailwind v4 needs it). Remove all `.mobbin-*` utility classes.

Key changes:
- `--border-radius-card: 0` (sharp edges)
- `--border-radius-btn: 2px` (near-sharp)
- `--border-radius-input: 2px`
- `--border-strong: 2px solid #111827` (bold black borders)
- `--border-strong-dark: 2px solid #f1f5f9`
- Remove all `--elevation-*` shadow tokens
- Add MCM accent palette: `--mcm-mustard: #E8A317`, `--mcm-burnt-orange: #CC5500`, `--mcm-teal: #008387`, `--mcm-navy: #143562`, `--mcm-cream: #F5F0E8`
- Add `--mcm-font-display` for serif headings (use system serif stack: `Georgia, 'Times New Roman', serif`)

**Step 2: Remove all `.mobbin-*` utility classes**

Delete `.mobbin-card`, `.mobbin-card-hover`, `.mobbin-input`, `.mobbin-btn-primary`, `.mobbin-btn-secondary`, `.mobbin-section`, `.mobbin-label` from `@layer base`.

**Step 3: Add MCM utility classes**

Add new `.mcm-*` classes:
```css
.mcm-card {
  border: 2px solid var(--text-primary, #111827);
  background: var(--bg-primary, #fff);
  padding: 1.5rem;
  /* no border-radius, no shadow */
}
.mcm-btn-primary {
  border: 2px solid #111827;
  background: var(--mcm-teal);
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
  transition: background 0.15s;
}
.mcm-btn-primary:hover {
  background: var(--mcm-navy);
}
```

**Step 4: Verify build passes**

Run: `cd /Users/georgetozer/Development/WebCalc && npx next build`
Expected: Build succeeds (CSS changes only, no TS errors)

**Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): add MCM design tokens, remove Mobbin utility classes"
```

---

## Task 2: MCM Navigation Bar

**Objective:** Transform the floating pill-shaped nav into a sharp, bold MCM navigation bar.

**Files:**
- Modify: `components/Nav.tsx`

**Step 1: Update Nav container styling**

Replace the floating pill shape (`rounded-full backdrop-blur bg-[rgba(...)]`) with a sharp, full-width MCM bar:
- Remove `rounded-full`, `backdrop-blur-[48px]`, `bg-[rgba(237,237,237,0.88)]`
- Add: `bg-white dark:bg-gray-950 border-b-2 border-black dark:border-white`
- Remove `max-w-[880px]` — make it full-width
- Remove `fixed top-4 left-1/2 -translate-x-1/2` — make it `sticky top-0`
- Remove the animated border-radius transition

**Step 2: Update nav link styling**

Replace soft hover states with bold MCM interaction:
- Links: `text-sm font-bold uppercase tracking-wider` (not `font-semibold tracking-[0.2px]`)
- Hover: `hover:bg-[#008387] hover:text-white` (color block hover, not subtle tint)
- Active: `bg-[#143562] text-white`

**Step 3: Update logo styling**

- Remove gradient text (`bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text text-transparent`)
- Use solid color: `text-[#143562] dark:text-white`
- Keep the SVG logo triangles (they're already geometric/MCM-compatible)

**Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat(design): MCM navigation — sharp edges, bold borders, uppercase links"
```

---

## Task 3: MCM CalculatorShell Layout

**Objective:** Redesign the calculator page shell with asymmetric layout, bold borders, and MCM section styling.

**Files:**
- Modify: `calculators/ui/CalculatorShell.tsx`

**Step 1: Update header section**

Replace soft header with bold MCM header:
- `h1`: Add `font-[var(--mcm-font-display)]` (serif), remove `tracking-tight`, add `uppercase tracking-wider`
- Description: Keep as-is but add `border-l-4 border-[#008387] pl-4`

**Step 2: Update calculator card container**

Replace `rounded-2xl border border-gray-200 bg-card-bg p-4 sm:p-6 shadow-sm` with:
- `border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-950 p-6`
- No border-radius, no shadow

**Step 3: Update content section styling**

Replace `prose prose-invert max-w-none` with MCM-styled content:
- Add `border-t-2 border-gray-900 dark:border-gray-100 pt-8 mt-8`
- Section headings: Add left border accent `border-l-4 border-[#008387] pl-4`

**Step 4: Update FAQ section**

Replace soft `<details>` styling with bold MCM accordion:
- Borders: `border-2 border-gray-900 dark:border-gray-100` (not `border border-gray-200`)
- Summary: `font-bold uppercase tracking-wider text-sm`
- Remove `rounded-lg`

**Step 5: Update related calculators grid**

Replace soft cards with bold MCM cards:
- Remove `rounded-xl`, `shadow-sm`, `hover:shadow-md`, `hover:-translate-y-0.5`
- Add `border-2 border-gray-900 dark:border-gray-100`
- Hover: `hover:bg-[#008387] hover:text-white hover:border-[#008387]`

**Step 6: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add calculators/ui/CalculatorShell.tsx
git commit -m "feat(design): MCM calculator shell — sharp borders, serif headings, asymmetric layout"
```

---

## Task 4: MCM CalculatorClient Content Sections

**Objective:** Restyle all inline content sections (intro, howToUse, formula, benchmarks, FAQ) with MCM design.

**Files:**
- Modify: `app/[category]/[slug]/CalculatorClient.tsx`

**Step 1: Update intro section**

Replace `text-lg leading-relaxed text-gray-700 dark:text-gray-300` with MCM-styled intro:
- Add `border-l-4 border-[#E8A317] pl-6 py-2` (mustard accent bar)
- Keep font size but add `font-[var(--mcm-font-display)]` for first sentence if possible

**Step 2: Update "How to Use" section**

Replace ordered list styling:
- `<h2>`: Add `uppercase tracking-wider text-sm font-bold border-b-2 border-gray-900 dark:border-gray-100 pb-2`
- `<ol>`: Replace `list-decimal pl-5` with custom counter using MCM numbering (bold numbers, clean spacing)
- List items: Add `border-l-2 border-gray-200 dark:border-gray-700 pl-4`

**Step 3: Update Formula section**

Replace the soft highlighted box with bold MCM formula block:
- Remove `rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50`
- Add `border-2 border-gray-900 dark:border-gray-100 bg-[#F5F0E8] dark:bg-gray-900 p-6`
- Formula text: Keep `font-mono` but add `text-lg font-bold`
- Remove `rounded-lg` from inner code block

**Step 4: Update Benchmarks table**

Replace soft table with bold MCM table:
- Table header: `border-b-2 border-gray-900 dark:border-gray-100 font-bold uppercase text-xs tracking-wider`
- Table rows: `border-b border-gray-200 dark:border-gray-700`
- Remove soft hover states

**Step 5: Update FAQ accordions**

Replace soft FAQ styling with bold MCM:
- `details`: `border-2 border-gray-900 dark:border-gray-100` (not `rounded-lg border border-gray-200`)
- `summary`: `font-bold uppercase tracking-wider text-sm`
- Remove `rounded-lg`
- Chevron: Keep but ensure it contrasts

**Step 6: Update related calculators cards**

Same as CalculatorShell task — ensure consistency:
- `border-2 border-gray-900 dark:border-gray-100`
- Remove `rounded-xl`, `shadow-sm`
- Hover: color block transition

**Step 7: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 8: Commit**

```bash
git add app/\[category\]/\[slug\]/CalculatorClient.tsx
git commit -m "feat(design): MCM content sections — bold borders, serif headings, mustard accents"
```

---

## Task 5: MCM Homepage Redesign

**Objective:** Transform the homepage with asymmetric grids, bold color blocking, and MCM typography.

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update hero section**

Replace gradient hero with bold MCM color block:
- Remove `bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950`
- Add solid `bg-[#143562]` (navy) with geometric decorative elements
- Remove `bg-[radial-gradient(...)]` overlay
- Add bold geometric accents (SVG triangles/circles positioned absolutely)
- Heading: Use serif font, `uppercase tracking-wider`, remove `tracking-tight`
- Stats bar: Replace soft grid with bold bordered sections

**Step 2: Update section styling**

For each section (Popular, Categories, How It Works, By The Numbers, CTA):
- Section backgrounds: Alternate between `bg-white` and `bg-[#F5F0E8]` (cream) instead of `bg-gray-50`
- Section labels: Replace soft `SectionLabel` with bold `border-b-2 border-[#008387] pb-2 inline-block`
- Headings: Add `uppercase tracking-wider` and serif font

**Step 3: Update calculator cards**

Replace soft cards in Popular and Categories sections:
- Remove `rounded-xl border border-gray-100 bg-white p-6 shadow-sm`
- Add `border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-950 p-6`
- Remove `hover:shadow-md hover:-translate-y-0.5`
- Add `hover:bg-[#008387] hover:text-white hover:border-[#008387]` color block hover

**Step 4: Update CTA section**

Replace gradient CTA with bold color block:
- Remove `bg-gradient-to-r from-brand-900 to-brand-800`
- Add solid `bg-[#008387]` with geometric accent
- Button: Sharp edges, bold border, uppercase

**Step 5: Update "How It Works" steps**

Replace soft circles with bold geometric shapes:
- Remove `rounded-full bg-brand-100`
- Add `border-2 border-gray-900 w-14 h-14 flex items-center justify-center`
- Use Roman numerals in bold serif font

**Step 6: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat(design): MCM homepage — asymmetric grids, color blocking, serif typography"
```

---

## Task 6: MCM Shared UI Components

**Objective:** Update ResultCard, InputSlider, and other shared calculator UI components with MCM styling.

**Files:**
- Modify: `calculators/ui/ResultCard.tsx`
- Modify: `calculators/ui/InputSlider.tsx`
- Modify: `calculators/ui/CompareToggle.tsx`
- Modify: `calculators/ui/DeltaBadge.tsx`
- Modify: `components/ShareButton.tsx`
- Modify: `components/FeedbackWidget.tsx`

**Step 1: Update ResultCard**

Replace soft card styling:
- Remove `rounded-xl`, `shadow-sm`
- Add `border-2 border-gray-900 dark:border-gray-100`
- Primary result: Add `bg-[#008387] text-white border-[#008387]` bold treatment
- Value: Use `font-[var(--mcm-font-display)]` (serif) for the number

**Step 2: Update InputSlider**

Replace soft input styling:
- Remove `rounded-lg` from input wrapper
- Add `border-2 border-gray-900 dark:border-gray-100`
- Label: `uppercase tracking-wider text-xs font-bold`
- Slider track: Bold 3px track with sharp thumb

**Step 3: Update CompareToggle**

Replace soft toggle:
- Remove `rounded-full`
- Add `border-2 border-gray-900 dark:border-gray-100`

**Step 4: Update DeltaBadge**

Replace soft badge:
- Remove `rounded-full`
- Add `border-2 border-current font-bold uppercase text-xs`

**Step 5: Update ShareButton**

Replace soft button:
- Remove `rounded-lg`
- Add `border-2 border-gray-900 dark:border-gray-100 font-bold uppercase text-xs`

**Step 6: Update FeedbackWidget**

Replace soft widget:
- Remove `rounded-xl`
- Add `border-2 border-gray-900 dark:border-gray-100`

**Step 7: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 8: Commit**

```bash
git add calculators/ui/ResultCard.tsx calculators/ui/InputSlider.tsx calculators/ui/CompareToggle.tsx calculators/ui/DeltaBadge.tsx components/ShareButton.tsx components/FeedbackWidget.tsx
git commit -m "feat(design): MCM shared UI components — sharp borders, bold typography"
```

---

## Task 7: MCM Category & Blog Pages

**Objective:** Update category listing pages, blog pages, and pricing page with MCM design.

**Files:**
- Modify: `app/[category]/page.tsx` (category listing)
- Modify: `app/blog/page.tsx` (blog listing)
- Modify: `app/pricing/page.tsx` (pricing page)
- Modify: `app/calculators/page.tsx` (all calculators page)

**Step 1: Update category listing page**

Replace soft cards with MCM cards:
- Remove `rounded-xl`, `shadow-sm`
- Add `border-2 border-gray-900 dark:border-gray-100`
- Hover: color block transition

**Step 2: Update blog listing page**

Apply same MCM card treatment to blog post cards.

**Step 3: Update pricing page**

Replace soft pricing cards with bold MCM treatment:
- Remove `rounded-xl`, `shadow-md`
- Add `border-2 border-gray-900 dark:border-gray-100`
- Featured plan: `bg-[#008387] text-white border-[#008387]`

**Step 4: Update all calculators page**

Apply MCM card grid treatment.

**Step 5: Verify build**

Run: `npx next build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add app/\[category\]/page.tsx app/blog/page.tsx app/pricing/page.tsx app/calculators/page.tsx
git commit -m "feat(design): MCM category, blog, pricing, and calculators pages"
```

---

## Task 8: Final Verification & Cleanup

**Objective:** Run full build, tests, and verify MCM consistency across the site.

**Files:**
- Modify: `app/globals.css` (final cleanup of any orphaned classes)

**Step 1: Full build**

Run: `npx next build`
Expected: Clean build, 0 errors

**Step 2: Run unit tests**

Run: `npx vitest run`
Expected: 355/355 pass

**Step 3: Visual spot-check**

Start dev server and visually verify:
- Homepage hero is sharp-edged with bold borders
- Calculator page has asymmetric layout with serif headings
- FAQ accordions are sharp-bordered
- All cards use border-2 instead of shadows
- Nav is a sharp full-width bar

**Step 4: Remove orphaned CSS**

Clean up any unused `.mobbin-*` or old token references.

**Step 5: Commit final cleanup**

```bash
git add -A
git commit -m "chore(design): MCM overhaul complete — final cleanup"
```

**Step 6: Update roadmap**

Mark MCM design compliance as 100% in `HERMES_ROADMAP.md`.

```bash
git add docs/planning/HERMES_ROADMAP.md
git commit -m "docs: mark MCM design compliance as 100%"
```

---

## Files Changed Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `app/globals.css` | Major | MCM tokens, remove Mobbin classes |
| `components/Nav.tsx` | Major | Sharp full-width nav bar |
| `calculators/ui/CalculatorShell.tsx` | Major | MCM shell layout |
| `app/[category]/[slug]/CalculatorClient.tsx` | Major | MCM content sections |
| `app/page.tsx` | Major | MCM homepage |
| `calculators/ui/ResultCard.tsx` | Moderate | MCM result cards |
| `calculators/ui/InputSlider.tsx` | Moderate | MCM input styling |
| `calculators/ui/CompareToggle.tsx` | Minor | MCM toggle |
| `calculators/ui/DeltaBadge.tsx` | Minor | MCM badge |
| `components/ShareButton.tsx` | Minor | MCM button |
| `components/FeedbackWidget.tsx` | Minor | MCM widget |
| `app/[category]/page.tsx` | Moderate | MCM category cards |
| `app/blog/page.tsx` | Moderate | MCM blog cards |
| `app/pricing/page.tsx` | Moderate | MCM pricing cards |
| `app/calculators/page.tsx` | Moderate | MCM calculator grid |

## Risks & Tradeoffs

| Risk | Mitigation |
|------|------------|
| Removing all border-radius may feel too harsh on mobile | Use `border-radius: 2px` as minimum instead of 0 |
| Serif fonts may slow initial render | Use system serif stack (Georgia), no web font download |
| Bold borders may increase visual weight too much | Test with `border-2` not `border-3`; use color for hierarchy |
| Color block hovers may be jarring | Use smooth `transition-all duration-150` |
| i18n strings may need MCM-specific updates | Keep existing strings, only visual changes |
