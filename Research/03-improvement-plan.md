# WebCalc — AdSense Quality Improvement Plan

## Date
June 2, 2026

## Goal
Fix Google AdSense "low quality content" rejection by improving trust signals, content depth, and E-E-A-T across the entire website.

---

## Phase 1: Trust & Identity (HIGHEST PRIORITY)

These changes directly address the #1 reason tool/calculator sites get rejected: anonymity.

### 1.1 — Create `/about` Page
**Files to create:**
- `app/about/page.tsx`
- i18n keys for 6 locales

**Content to include (400-500 words):**
- Mission statement: why we built free SaaS calculators
- Who runs the site (name, background in SaaS/metrics)
- Editorial standards and commitment to accuracy
- Physical business address (Ontario, Canada — from Terms)
- How we keep calculators free (ads + affiliates model explanation)
- Link to Contact page

**Signals addressed:** Trustworthiness, Authoritativeness, site identity

### 1.2 — Split `/legal` Into Separate Routes
**Files to create/modify:**
- `app/privacy/page.tsx` (new) — Privacy Policy
- `app/terms/page.tsx` (new) — Terms of Service
- `app/contact/page.tsx` (new) — Contact page with email + address
- `app/legal/page.tsx` (modify) — Keep as hub linking to each, or redirect
- Update sitemap to include new pages
- Update footer nav links
- Add i18n keys for page titles/metadata

**Content:** Move each section from the combined legal page into its own page with expanded content (especially Contact: add physical address, add contact form or clearer email)

**Signals addressed:** Essential pages requirement, trustworthiness

### 1.3 — Add Author System to Blog Posts
**Files to create/modify:**
- `content/authors.ts` or `lib/authors.ts` — Author registry
- `content/blog/*.md` — Add `author: slug` to frontmatter
- `app/blog/[slug]/page.tsx` — Render author bio section below article
- Update JSON-LD from `Organization` to `Person` schema

**Author data model:**
```ts
interface Author {
  slug: string;
  name: string;
  title: string;        // "SaaS Metrics Analyst" etc.
  bio: string;           // 1-2 sentence bio
  avatar?: string;       // Optional photo
  linkedin?: string;    // LinkedIn URL
  twitter?: string;     // Twitter URL
  website?: string;     // Personal site
}
```

**For initial launch:** Can use 1-2 authors (even pseudonymous). Key is having NAMED human authors with bios and linked professional profiles.

**Signals addressed:** E-E-A-T (Experience, Expertise, Authoritativeness), Information Gain

### 1.4 — Add Homepage Trust Signals
**File to modify:** `app/page.tsx`
- Add a "Trusted by" or "Why use our calculators" section
- Add a brief "About the team" excerpt linking to `/about`
- Add social proof line (e.g., "Trusted by founders at [logos or generic text]")
- Add "As featured in" or publication credit if applicable

**Signals addressed:** Trustworthiness, Authority

---

## Phase 2: Content Enhancement

### 2.1 — Enrich Blog Posts with Images
**Files to modify:** `app/blog/[slug]/page.tsx` and `app/blog/page.tsx`
- Add support for featured image in blog frontmatter
- Add OpenGraph image per post (OG API exists but could be richer)
- For now: generate OG image with title + category, add support for in-post images
- Add chart screenshots or diagrams to existing posts

**Why this matters:** Visual content is an engagement signal and improves perceived quality. Pure-text blogs look like AI output.

### 2.2 — Add External Citation Hyperlinks
**Files to modify:** `content/blog/*.md`
- Review all 32 blog posts for benchmark claims and source references
- Add hyperlinks to the actual sources (SaaS Capital, KeyBanc, OpenView, etc.)
- Minimum: 2-3 external links per post to authoritative sources

**Why this matters:** Demonstrates research rigor and factual grounding. Sites with no external links look insular or AI-generated.

### 2.3 — Add Structured Data Markup
**Files to modify:** `app/[category]/[slug]/page.tsx`, `lib/seo.ts`
- Add `FAQPage` JSON-LD to calculator pages (questions + answers already exist in config)
- Add `BreadcrumbList` JSON-LD to calculator pages (breadcrumbs already rendered)
- Add `HowTo` JSON-LD to calculator pages (how-to-use content already exists)
- Update blog `BlogPosting` to use `Person` author schema

**Why this matters:** Rich snippets improve search visibility and signal content quality to Google.

### 2.4 — Expand Pricing Page
**File to modify:** `app/pricing/page.tsx`
- Add FAQ section explaining the business model
- Explain why calculators are free (ads + affiliate model)
- Add transparency about data privacy (calculations are client-side)
- Target: increase from 85 lines to 150+ lines

**Why this matters:** The pricing page is the thinnest standalone page. Expanding it shows the site has substance beyond just "everything is free."

### 2.5 — Add "Last Updated" Dates to Blog Posts
**Files to modify:** Blog frontmatter, post template
- Add `updated: YYYY-MM-DD` field to blog frontmatter
- Display both publish date and last updated date on post pages
- Add `dateModified` to JSON-LD

**Why this matters:** Freshness signals improve E-E-A-T, especially for fast-moving topics like SaaS benchmarks.

---

## Phase 3: Social Proof & Engagement

### 3.1 — Create Social Media Profiles
**Actions (outside codebase):**
- Create Twitter/X account for SaaStainedNumbers
- Create LinkedIn company page
- Share blog posts on both platforms
- Link profiles in site header/footer

**Signals addressed:** Authoritativeness, social proof

### 3.2 — Add Social Sharing Buttons
**Files to create/modify:**
- `components/ShareButtons.tsx` — Twitter, LinkedIn, Facebook share links
- Add to blog posts and calculator result sections

### 3.3 — Add Testimonials Section
**Files to modify:** `app/page.tsx`
- Collect user feedback (already have feedback widget data via PostHog)
- Display a "What people are saying" section with anonymized testimonials
- Even 3-4 quotes add significant trust

### 3.4 — Add User Ratings to Calculators
**Files to create/modify:**
- Add star rating component to calculator result area
- Store ratings in localStorage or PostHog events
- Display aggregate rating on calculator pages

---

## Phase 4: Technical Polish

### 4.1 — Run Lighthouse/PageSpeed Audits
- Measure current Core Web Vitals (LCP, FCP, CLS, TBT, Speed Index)
- Fix any issues found (unlikely given static export, but verify)
- Document results in Research directory

### 4.2 — Strengthen Internal Linking
- Ensure every blog post links to at least 3 related calculators
- Add "Related blog posts" section to calculator pages
- Add "Related calculators" section to blog posts

### 4.3 — Add Blog Categories/Tags
- Add taxonomy to blog content model
- Add category archive pages
- Improves site structure and topical authority

---

## Implementation Order

```
Week 1: Phase 1 (Trust & Identity)
  -> 1.1 About page
  -> 1.2 Split legal pages
  -> 1.3 Author system
  -> 1.4 Homepage trust signals

Week 2: Phase 2 (Content Enhancement)
  -> 2.1 Blog images
  -> 2.2 External citations
  -> 2.3 Structured data
  -> 2.4 Pricing page
  -> 2.5 Last updated dates

Week 3: Phase 3 (Social Proof)
  -> 3.1 Social profiles (external)
  -> 3.2 Social share buttons
  -> 3.3 Testimonials
  -> 3.4 User ratings

Week 4: Phase 4 + Re-apply
  -> 4.1 Performance audit
  -> 4.2 Internal linking pass
  -> 4.3 Blog categories
  -> Re-apply to AdSense
```

---

## Success Criteria

Before re-applying to AdSense, verify:
- [ ] `/about` page exists with real information and address
- [ ] `/privacy`, `/terms`, `/contact` are separate URLs
- [ ] `/contact` has email + physical address
- [ ] Blog posts have named authors with bios
- [ ] Blog posts have JSON-LD `Person` author schema
- [ ] At least 1 social profile exists and is linked from site
- [ ] Blog posts have images (featured image minimum)
- [ ] Blog posts have 2+ external citation hyperlinks
- [ ] FAQPage schema on all calculator pages
- [ ] BreadcrumbList schema on all calculator pages
- [ ] Pricing page expanded with FAQ
- [ ] All 5 non-English locales updated with new page translations
- [ ] Build passes (0 TS errors, 0 lint errors)
- [ ] All 355 tests pass
