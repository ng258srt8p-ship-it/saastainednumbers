# Comprehensive Mobbin-Style UI Refactor — Full Site

> **For Hermes:** Implement this plan systematically page-by-page. Each task touches specific files with concrete changes.

**Goal:** Redesign every page of SaaStainedNumbers to match Mobbin's high-fidelity, visual-first aesthetic — premium typography, card-based layouts, subtle depth, consistent spacing, and refined micro-interactions. This is a **full-site** refactor, not limited to canvas or calculator pages.

**Pages to cover:** Homepage, Category listing, Calculator pages, Blog (listing + detail), About, Contact, Legal, Pricing, Dashboard, Error pages (404, 500), Nav, Footer.

**Tech Stack:** Next.js 16, Tailwind 4, Framer Motion, Lucide React.

---

## Phase 1: Design Foundation (globals.css)

### 1a: Elevation & Shadow System
**Files:** `app/globals.css`
**Done:** ✅ `--elevation-1` through `--elevation-4`, `--elevation-card-hover`

### 1b: Global Utility Classes
**Files:** `app/globals.css`
- `.mobbin-card` — shared card base: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4`
- `.mobbin-input` — `rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all`
- `.mobbin-btn-primary` — `rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 transition-all`
- `.mobbin-btn-secondary` — `rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium px-4 py-2 transition-all`

### 1c: Typography Refinements
- Tighten tracking on headings
- Ensure consistent `leading-relaxed` on body text across all pages

---

## Phase 2: Global Components

### 2a: Nav (`components/Nav.tsx`)
- Add subtle backdrop blur on scroll (`backdrop-blur-md bg-white/80 dark:bg-gray-950/80`)
- Highlight active route with brand underline
- Refine mobile drawer to match card aesthetic

### 2b: Footer
- Refine with subtle top border gradient (teal to transparent)
- Compact, organized link columns with tighter spacing

### 2c: Breadcrumb (`components/Breadcrumb.tsx`)
- Reduce to `text-xs`, soft gray
- Add chevron separator icons

### 2d: Search (`components/CalculatorSearch.tsx`)
- Refine input to `.mobbin-input` style
- Card-style dropdown results with thumbnails

---

## Phase 3: Page-by-Page Refactor

### 3a: Homepage (`app/page.tsx`)
**Current:** Category grid with simple links
**Target:** Mobbin-style gallery with:
- Large hero section with gradient background + CTA
- Category cards with gradient thumbnail + icon, title, count badge
- Featured calculators row (horizontal scroll on mobile)
- Testimonial/social proof section
- Footer CTA section before footer

**Changes:**
- Replace category grid with `.mobbin-card` grid (3 col desktop, 2 col tablet, 1 col mobile)
- Add gradient thumbnail backgrounds per category
- Add "Popular Calculators" section
- Add "Trusted by" / stats section
- Add animated number counters for stats

### 3b: Category Pages (`app/[category]/page.tsx`)
**Current:** ✅ **Done** — sidebar + CalculatorCard grid
**Verify:** Ensure responsive at all breakpoints

### 3c: Calculator Pages — CalculatorClient.tsx
**Current:** Input sliders + ResultCard with Framer Motion ✅
**Remaining:**
- Style the stage selector (Seed/Series A/B/C/Growth) with pill buttons
- Style "Add Scenario" button with card-style dashed border
- Style FAQ details to match Mobbin accordion pattern
- Apply `.mobbin-card` to content sections

### 3d: Calculator Pages — Content sections
**Files:** `app/[category]/[slug]/page.tsx`
- Style "How to Use", "Formula", "Benchmarks", "FAQ" sections with `.mobbin-card`
- Add consistent section spacing
- Style benchmark tables with subtle row stripes

### 3e: Blog Listing (`app/blog/page.tsx`)
**Current:** Simple list
**Target:** Card grid with:
- Featured post hero card (large, cover image)
- Remaining posts as `.mobbin-card` grid (2-3 col)
- Category tags, date, read time
- Hover elevation on cards

### 3f: Blog Detail (`app/blog/[slug]/page.tsx`)
- Refine typography (readable body width, proper heading hierarchy)
- Add prose-like styling for article content
- Style code blocks

### 3g: Pricing Page (`app/pricing/page.tsx`)
**Current:** Centered card with $0
**Target:** Full pricing section with:
- Multiple plan tiers (Free, Pro, Enterprise) — even if all free
- Feature comparison table
- Mobbin-style pricing cards with badges
- FAQ section

### 3h: Dashboard (`app/dashboard/page.tsx`)
- Apply `.mobbin-card` to collection cards
- Style the sidebar with active state highlighting
- Refine the header to match site nav

### 3i: About / Contact / Legal (`app/about/page.tsx`, etc.)
- Ensure consistent spacing and typography
- Replace any inline styles with theme tokens

### 3j: Error Pages (`app/not-found.tsx`, etc.)
- Style with illustration area and branded button
- Add subtle animation

---

## Phase 4: Micro-interactions & Animations

### 4a: Page Transitions
**Files:** `components/PageTransition.tsx` (new)
- Wrap page content in `motion.div` with `initial={{ opacity: 0, y: 8 }}` / `animate={{ opacity: 1, y: 0 }}`
- Apply to `app/layout.tsx` children

### 4b: Interactive States
- All links: `transition-colors duration-150`
- All buttons: `transition-all duration-150 active:scale-[0.98]`
- All cards: `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`

### 4c: Data Visualizations
- Align chart colors with brand palette
- Clean tooltips with minimal styling

---

## Phase 5: Verification

### 5a: Build & Lint
```bash
npm run build  # Must pass with 0 errors
npm run lint   # Must pass with 0 errors (pre-existing warnings OK)
```

### 5b: E2E Testing
```bash
npx playwright test ./tests/e2e/ --reporter=list
```
- Critical paths: Home → Category → Calculator → Results
- Navigation between all pages
- Calculator input/output interaction

### 5c: Visual QA Checklist
- [ ] Homepage card grid renders at all breakpoints
- [ ] Category page has sidebar + card grid
- [ ] Calculator inputs functional with Framer Motion animations
- [ ] Pricing page styled consistently
- [ ] Blog listing shows cards
- [ ] Error pages styled
- [ ] Nav backdrop blur works
- [ ] Footer consistent with design system
- [ ] Dark mode parity on all pages
- [ ] No layout shift during navigation
