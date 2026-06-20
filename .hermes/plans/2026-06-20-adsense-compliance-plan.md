# Google AdSense Compliance — Remediation Plan

## State of the Union

I audited every claim in the referenced document against the actual codebase. Several diagnoses are outdated or incorrect — the project already has working `/about/`, `/terms/`, `/privacy/`, `/contact/`, and `/legal/` pages; full JSON-LD schema (Organization, WebSite, WebApplication, BreadcrumbList, FAQPage); an `ads.txt` with the correct publisher ID; disclaimer text on every calculator page; and no forbidden ad-click language. The plan below addresses *real* gaps only.

---

## Task 1: Add `/privacy-policy` → `/privacy` 301 Redirect

**Why:** Any external link or stale reference pointing to `/privacy-policy/` returns a 404. Google's crawler treats this as a policy violation because every publisher must have a crawlable privacy policy.

**What:**
- Create `app/privacy-policy/route.ts` (Next.js App Router route handler) that issues a 301 Permanent Redirect to `/privacy`.
- The redirect applies across all locales — just a URL-level rewrite.

**Files:**
- `CREATE app/privacy-policy/route.ts`

---

## Task 2: Create Middleware for Locale Detection

**Why:** `AGENTS.md` describes locale detection via `Accept-Language` header → cookie, but `middleware.ts` does not exist in the project root. Without it, browser language negotiation doesn't work, which means non-English users always see English until they manually switch.

**What:**
- Create `middleware.ts` at project root with:
  - `Accept-Language` header parsing → redirect to `/{locale}/{path}` for non-English preferred locales
  - Cookie-based locale persistence so manual switches survive navigation
  - Skip `/api/`, `/_next/`, static files, and `/embed/` routes
  - Match the locale support (en, es, de, pt, fr, ja)

**Files:**
- `CREATE middleware.ts` (root)

---

## Task 3: Add Interactive Contact Form to `/contact`

**Why:** The contact page only has `mailto:` links. An interactive form gives Google reviewers a direct, verifiable communication channel and strengthens E-E-A-T signals.

**What:**
- Add a contact form component using Formspree (or similar zero-server form backend).
- Fields: Name, Email, Subject, Message.
- Client-side validation + success message after submission.
- Keep existing email contact cards alongside the form.

**Files:**
- `CREATE components/ContactForm.tsx`
- `MODIFY app/contact/page.tsx`

---

## Task 4: Upgrade Disclaimer Visibility on Calculator Pages

**Why:** The current disclaimer is a 1-line `<p>` at the bottom of the calculator content. YMYL financial tools need a more prominent, styled disclaimer block that signals "not professional advice" clearly to both users and automated reviewers.

**What:**
- Replace the single disclaimer `<p>` in `CalculatorClient.tsx` with a styled banner component (yellow/amber left-border box).
- Include: "Not financial advice" heading, explanation that results are for educational purposes only, and recommendation to consult a professional.
- Inject this as a reusable `<DisclaimerBanner>` component.

**Files:**
- `CREATE calculators/ui/DisclaimerBanner.tsx`
- `MODIFY app/[category]/[slug]/CalculatorClient.tsx`
- `MODIFY app/embed/[slug]/page.tsx` (embed version)

---

## Task 5: Inject YMYL Disclaimer into Calculator Page Schema Markup

**Why:** The `WebApplication` schema is present, but adding `@type: WebPage` with `about` and `specialty` properties that explicitly declare the page as financial/educational content helps crawlers classify it correctly as YMYL content rather than thin utility.

**What:**
- In `lib/seo.ts` → `generateJsonLd()`: add a `WebPage` entry alongside existing schemas with `about` referencing financial education and `specialty` set to "FinancialPlanning".

**Files:**
- `MODIFY lib/seo.ts`

---

## Task 6: Add `bypassAdBlock` / "click our ads" Phrase Scan

**Why:** A pre-emptive scan to ensure no accidental forbidden language exists anywhere in the codebase.

**What:**
- Write a script that greps for: "click our ads", "support us by clicking", "click ads below", "disable adblock", "ad blocker detected".
- Run it and confirm zero hits (my manual search found none).

**Files:**
- `scripts/scan-forbidden-phrases.sh` (one-time use, not kept)
- `RUN` once via terminal

---

## Task 7: Verify Build + E2E Smoke Test

**Why:** Every code change must be validated before declaring done.

**What:**
- `npx next build` — must pass with 0 TS errors
- `npx vitest run` — all 355 tests must pass
- Quick browser check of `/privacy-policy` redirect, `/contact` form, and a calculator page disclaimer

**Files:**
- `RUN` via terminal
