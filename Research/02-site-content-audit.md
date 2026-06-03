# WebCalc — Site Content Audit

## Date
June 2, 2026

## Methodology
Full codebase exploration at `/Users/georgetozer/Development/WebCalc`

---

## Page Inventory

| Page Type | Count (x6 locales) | URL Pattern |
|-----------|-------------------|-------------|
| Calculator pages | 516 | `/{locale}/{category}/{slug}` |
| Embed pages | 516 (noindex) | `/{locale}/embed/{slug}` |
| Category listing | 54 | `/{locale}/{category}` |
| Blog posts | 192 | `/{locale}/blog/{slug}` |
| Blog listing | 6 | `/{locale}/blog` |
| Homepage | 6 | `/{locale}/` |
| All Calculators | 6 | `/{locale}/calculators` |
| Pricing | 6 | `/{locale}/pricing` |
| Dashboard | 6 | `/{locale}/dashboard` |
| Legal (combined) | 6 | `/{locale}/legal` |
| **Total** | **~1,326 pages** | |

---

## Calculator Content Assessment

Each calculator page has a content schema (`CalculatorContent`) that enforces:

- **Intro**: 100+ words explaining what the metric is and why it matters
- **How to Use**: 50+ words step-by-step instructions
- **Formula Explanation**: 30+ words with worked example
- **Industry Benchmarks**: 40+ words with context and cited data
- **Benchmark Data Table**: 3-5 rows with metric, value, source
- **FAQ**: 10-11 questions with 30-80 word answers each
- **Related Calculators**: 3-5 cross-links

**Assessment**: Calculator pages are content-rich and NOT thin content. The FAQ sections alone provide 300-800 words of educational content per calculator.

---

## Blog Content Assessment

**32 blog posts**, all SaaS metrics/industry topics.

| Metric | Value |
|--------|-------|
| Total posts | 32 |
| Average length | ~1,200-3,000 words |
| Content style | Educational guides with benchmarks, examples, formulas |
| Internal links | Heavy cross-linking to calculators (3-10+ per post) |
| External citations | Some benchmarks cited by source name, NO hyperlink citations |
| Images | None (pure text markdown) |
| Author attribution | Organization only ("SaaStainedNumbers") |
| Author bios | None |
| Update dates | None (only original publish date) |
| Post cadence | Apr 18 - May 27, 2026 (~1.3/day) |

**Assessment**: Blog content is substantive and well-written. Key gaps: no author bylines, no images, no external hyperlinks to sources.

---

## Essential Pages Assessment

### Legal Page (`/legal`)
- **315 lines** combining: Disclaimer, Privacy Policy, Terms of Service, Cookie Policy, Acceptable Use Policy, Contact
- Privacy policy is thorough and privacy-positive (client-side calculations, no data collection)
- Contact: email only (legal@saastainednumbers.com), no physical address
- **Issue: Single page bundles 6 separate legal/trust documents** — Google expects separate About, Contact, Privacy, Terms pages

### Missing Pages
- No dedicated About Us page
- No dedicated Contact page
- No separate Privacy Policy URL
- No separate Terms of Service URL
- No Team/Contributors page
- No Editorial Policy page

---

## Structured Data Assessment

| Schema Type | Present? | Notes |
|-------------|----------|-------|
| `WebApplication` | Yes | On calculator pages |
| `ItemList` | Yes | On category listing and calculators page |
| `BlogPosting` | Yes | On blog posts (Organization author) |
| `Organization` | Yes | On blog posts |
| `FAQPage` | Missing | Calculator FAQs exist but not marked up |
| `BreadcrumbList` | Missing | Breadcrumbs displayed but no schema |
| `HowTo` | Missing | How-to-use content exists but not marked up |
| `Person` (author) | Missing | Authors are Organization, not Person |

---

## SEO Assessment

### Strengths
- Full hreflang/alternate language support for 6 locales
- Dynamic OG images via `/api/og`
- Clean URL structure: `/{category}/{slug}`
- RSS feed for blog content
- Sitemap with proper priorities and alternates
- Robots.txt with proper rules
- Good page titles and meta descriptions via `generateMetadata`

### Weaknesses
- No individual author bylines (org-level only)
- No FAQPage schema on calculators (content exists, no markup)
- No BreadcrumbList or HowTo schema
- No update dates on blog posts
- No blog categories or tags (flat structure)

---

## User Engagement Features

| Feature | Status | Notes |
|---------|--------|-------|
| Feedback widget | Yes | "Was this helpful?" Yes/No |
| Share button | Yes | Copies URL with inputs |
| Compare mode | Yes | Scenario A vs B |
| Stage selector | Yes | Seed/Series A/B/C/Growth |
| Insights engine | Yes | Rule-based client-side |
| Embed functionality | Yes | iframe + postMessage |
| Social sharing buttons | Missing | Only copy-link share |
| User comments | Missing | No discussion on blog posts |
| Ratings/reviews | Missing | Calculators not ratable |
| Email newsletter | Missing | No subscription CTA |
| Social media links | Missing | No Twitter/LinkedIn/etc |

---

## Technical Performance

- Next.js 16.2.6 static export to Cloudflare Pages
- Minimal client-side JS (calculators run client-side, but engines are pure TS)
- Turbopack for fast builds
- No excessive third-party scripts
- Dark mode via CSS variables + localStorage
- No render-blocking resources detected

**Assessment**: Should pass Core Web Vitals easily given static export nature. If denied on technical grounds, would require actual Lighthouse/PageSpeed Insights measurement.
