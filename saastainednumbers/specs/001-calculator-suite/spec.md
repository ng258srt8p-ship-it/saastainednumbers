# Feature Specification: Calculator Suite  -  WebCalc MVP

**Feature Branch**: `001-calculator-suite`
**Created**: 2026-05-21
**Status**: Draft
**Input**: Research documents from `/Users/georgetozer/Development/WebCalc/Research` (v1.1 through v2.1)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant Calculation (Priority: P1)

A SaaS founder visits a calculator page (e.g., "MRR Calculator"), enters their
customer count and average revenue per customer, and receives the calculated
result instantly without creating an account or signing in.

**Why this priority**: Without instant, account-free calculations, there is no
product. Every competitor (, CalculatorCove, OnlineCalcAI) offers
this as the default experience. This is the absolute foundation.

**Independent Test**: A first-time visitor can navigate to any calculator page,
input values into all fields, and see correct calculated results displayed
immediately  -  all without creating an account or providing any personal
information.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to an MRR Calculator page, **When** they
   enter values for customer count (1,000) and ARPU ($50), **Then** the
   calculated MRR ($50,000) is displayed instantly without a page reload.
2. **Given** a visitor is on any calculator page, **When** they change an
   input value, **Then** the calculated result updates in real-time without
   requiring a button click or page refresh.
3. **Given** a visitor has completed a calculation, **When** they copy or
   share the page URL, **Then** the URL contains all input values so the
   recipient sees the same calculation state.

---

### User Story 2 - Content-Rich Calculator Discovery (Priority: P1)

A SaaS operator searching Google for "how to calculate CAC payback period"
finds a calculator page that not only provides the tool but also explains
the formula, shows industry benchmarks, and answers related FAQs.

**Why this priority**: Search engine traffic is the primary growth channel.
Each calculator page must rank for its target keyword to attract visitors.
Without accompanying content (500+ words, FAQ, schema markup), search
engines will not rank the pages. This is equally foundational.

**Independent Test**: A calculator page can be indexed by search engines,
contains at least 500 words of explanatory content, structured FAQ section,
and renders rich results (schema markup) in search engine result pages.

**Acceptance Scenarios**:

1. **Given** a calculator page exists, **When** a search engine crawls it,
   **Then** the page returns structured data that enables rich result
   display (breadcrumb, WebApplication, FAQ schema).
2. **Given** a user lands on a calculator page from search, **When** they
   scroll below the calculator widget, **Then** they find at least 500 words
   of content explaining the formula, industry benchmarks, and a worked
   example.
3. **Given** a user is on any calculator page, **When** they scroll to the
   FAQ section, **Then** they see 5-12 commonly asked questions with answers
   about the metric or formula being calculated.

---

### User Story 3 - Interconnected Dashboard (Priority: P2)

A SaaS founder fills out a single form on the homepage with their business
metrics and instantly sees results across 12+ related calculators  -  MRR,
ARPU, LTV, CAC, churn rate, payback period, gross margin, and more  -  all
in one unified view.

**Why this priority**: The interconnected dashboard is the best UX pattern
in the competitor set (validated by SaaSMetricsCalculator). It creates a
"wow" experience that differentiates the product from single-calculator
competitors. P2 because it builds on top of the core calculator engine
(Story 1).

**Independent Test**: A visitor fills a single form with their business
data and sees calculated results from at least 5 different calculator types
displayed simultaneously on one page.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage dashboard, **When** they enter
   customer count, ARPU, monthly churn rate, and customer acquisition cost,
   **Then** they simultaneously see calculated MRR, ARR, LTV, CAC ratio,
   and payback period displayed in separate result cards.
2. **Given** the dashboard is displaying results, **When** the visitor
   changes a single input value, **Then** all affected calculator results
   update in real-time.
3. **Given** a visitor wants to explore one metric in detail, **When** they
   click on a result card, **Then** they are taken to the dedicated
   calculator page for that metric with their input values pre-filled.

---

### User Story 4 - Embeddable Calculator Widget (Priority: P2)

A SaaS blogger writing about "how to calculate MRR" embeds an interactive
MRR calculator directly in their blog post. Their readers use the
calculator without leaving the blog, and the embed includes a subtle
attribution link back to the platform.

**Why this priority**: No competitor offers embeddable widgets. This is the
primary technical differentiator and distribution channel. Every embed is
a free distribution point. P2 because it requires the core calculator
engine (Story 1) to be working first.

**Independent Test**: A third-party website can embed any calculator on
their own page using a provided code snippet, and the embedded calculator
functions identically to the version on the platform.

**Acceptance Scenarios**:

1. **Given** a user is on any calculator page, **When** they click the
   "Embed" button, **Then** they receive a copyable HTML snippet that they
   can paste into any website.
2. **Given** a third-party website has embedded a calculator, **When** a
   visitor to that site uses the calculator, **Then** all calculations work
   correctly without requiring navigation away from the host site.
3. **Given** an embedded calculator is in use, **When** it renders on the
   host page, **Then** it includes a visible "Powered by WebCalc"
   attribution link that is not blocked or hidden by the host site's CSS.

---

### User Story 5 - Freemium Pro Account (Priority: P3)

A power user who regularly calculates SaaS metrics wants to save their
calculation history, export results as PDF, and access premium-only
calculators. They create a free account, and after seeing the value,
upgrade to a paid Pro subscription.

**Why this priority**: Freemium is the second revenue stream (after ads).
But it requires the core calculator experience (Story 1) to be compelling
first. P3 because the free calculators must be proven useful before users
will pay for enhanced features.

**Independent Test**: A user can create an account, use calculators,
save calculations to their history, export a calculation as PDF, and
upgrade to a paid plan  -  all without any prior account or payment.

**Acceptance Scenarios**:

1. **Given** a visitor has performed 3+ calculations, **When** they see a
   prompt to create an account to save their history, **Then** they can
   register with an email address and password in under 2 minutes.
2. **Given** a registered user is viewing a saved calculation, **When**
   they click "Export as PDF", **Then** a properly formatted PDF document
   is generated showing the inputs, formula, and results.
3. **Given** a free-tier user attempts to access a premium-only calculator,
   **When** they click on it, **Then** they see a clear explanation of
   what Pro includes and a prompt to upgrade, not an error or dead end.
4. **Given** a user has upgraded to Pro, **When** they use any calculator,
   **Then** no advertisements are displayed and all premium features are
   unlocked.

---

### User Story 6 - Multi-Language Calculator Access (Priority: P4)

A Spanish-speaking SaaS founder in Latin America navigates to the platform
and finds all calculators, content, and labels translated into Spanish.
They use the calculator and share results with Spanish-speaking colleagues.

**Why this priority**: Multi-language is the highest-ROI SEO lever
(OnlineCalcAI proved 30x traffic multiplier from 30 languages). However,
it requires the English calculator suite (Story 1 and 2) to be stable
first. P4 because it is an expansion, not a foundation.

**Independent Test**: A user who selects Spanish as their language can
navigate the site, use any calculator, read all supporting content, and
share results  -  all entirely in Spanish.

**Acceptance Scenarios**:

1. **Given** a user visits the site with a Spanish-language browser
   preference, **When** the page loads, **Then** all navigation, calculator
   labels, and content are displayed in Spanish.
2. **Given** a user manually switches the site language to German, **When**
   they use any calculator, **Then** the input labels, result descriptions,
   and error messages appear in German.
3. **Given** a Spanish user shares a calculation URL with an English
   colleague, **When** the English colleague opens the URL, **Then** the
   page displays in English (respecting the recipient's language
   preference) while preserving all input values.

---

### User Story 7 - Developer API Access (Priority: P4)

A developer building a SaaS dashboard wants to integrate MRR and churn
calculations into their application. They sign up for API access, receive
an API key, and make REST calls to get calculation results programmatically.

**Why this priority**: API access is a revenue stream no competitor offers.
It opens B2B distribution. P4 because it requires the calculation engine
(Story 1) to be mature and reliable, and developer tooling is a
specialized audience.

**Independent Test**: A developer with a valid API key can send input
data to any calculator endpoint and receive correct calculation results
as structured data.

**Acceptance Scenarios**:

1. **Given** a registered developer, **When** they request an API key
   through their account settings, **Then** the key is generated and
   displayed immediately with usage documentation.
2. **Given** a developer has a valid API key, **When** they send a POST
   request with calculator inputs, **Then** the API returns correct
   calculation results as structured data within 500ms.
3. **Given** a free-tier API key has reached its monthly usage limit,
   **When** the developer sends an additional request, **Then** they
   receive a clear message explaining the limit and how to upgrade.

---

### Edge Cases

- **Invalid inputs**: User enters negative numbers, non-numeric characters,
  or zero values where division by zero would occur. Calculator shows
  clear, actionable error messages  -  not raw error codes or blank results.
- **Extreme values**: User enters extremely large numbers (billions) or
  extremely small (fractions of a cent). Calculator handles gracefully with
  appropriate formatting (scientific notation or rounded output).
- **Ad blockers active**: User has an ad blocker running. Calculators must
  still function fully  -  ad content is blocked gracefully without breaking
  the calculator experience.
- **Offline/disconnected**: If network connection drops while using the
  calculator, the tool should continue working for the current session
  (client-side calculations still function).
- **Empty input fields**: User clicks calculate with some or all fields
  empty. Calculator shows which fields are required rather than producing
  incorrect results.
- **Embed on HTTPS-only site**: Embedded calculator loads correctly on
  sites served over HTTPS (mixed content warnings must not appear).
- **Language fallback**: Content not yet translated into a requested
  language gracefully falls back to English rather than showing empty or
  broken pages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to use every calculator without creating
  an account or signing in.
- **FR-002**: Each calculator MUST accept all defined input values and
  display calculated results instantly (within 2 seconds of last input
  change).
- **FR-003**: Calculator inputs and state MUST be encoded in the page URL
  so that any calculation state can be shared, bookmarked, or revisited
  exactly as the user left it.
- **FR-004**: Each calculator page MUST include at least 500 words of
  unique explanatory content covering the formula, how to use it, industry
  benchmarks, and a worked example.
- **FR-005**: Each calculator page MUST provide structured data (schema
  markup) for WebApplication, BreadcrumbList, and FAQPage.
- **FR-006**: Each calculator page MUST include an FAQ section with 5-12
  questions and answers marked up with FAQPage schema.
- **FR-007**: An interconnected dashboard MUST allow users to input data
  once and see results from at least 5 related calculators simultaneously.
- **FR-008**: Every calculator MUST have an "Embed" option that generates
  a copyable HTML/iframe snippet for use on third-party websites.
- **FR-009**: Embedded calculators MUST function fully on the host site
  and MUST include a visible attribution link back to the platform.
- **FR-010**: Users MUST be able to create a free account with email and
  password.
- **FR-011**: Free account users MUST be able to save calculation history
  and revisit past calculations.
- **FR-012**: Pro subscribers MUST be able to export calculations as PDF.
- **FR-013**: Pro subscribers MUST have an ad-free experience across all
  calculator pages.
- **FR-014**: At least 5 premium-only calculators MUST be available
  exclusively to Pro subscribers.
- **FR-015**: The site MUST support at least 5 languages (including
  English) for all calculator interfaces, content, and navigation.
- **FR-016**: Language selection MUST respect the user's browser language
  preference and MUST be manually overridable.
- **FR-017**: A developer API MUST provide programmatic access to all
  calculator engines via REST endpoints.
- **FR-018**: API access MUST include free tier (rate-limited) and paid
  tiers (unlimited or higher limits).
- **FR-019**: API responses MUST include calculation results, the formula
  used, and input validation errors.
- **FR-020**: Invalid inputs (negative numbers where illogical, empty
  required fields, non-numeric in numeric fields) MUST display clear
  user-facing error messages, not system errors.
- **FR-021**: Extreme numeric inputs (e.g., billions, fractions) MUST be
  handled without crashing or producing incorrect results.
- **FR-022**: The system MUST track per-calculator usage (number of
  calculations performed) to inform content and monetization decisions.
- **FR-023**: At least 20 unique calculator types MUST be available at
  initial launch across a minimum of 4 categories (revenue metrics, unit
  economics, churn & retention, growth & efficiency).
- **FR-024**: Every calculator page MUST display a verified badge with
  source citation and last-verified date for all formulas and benchmarks
  (following CalculatorCove's trust-building pattern).
- **FR-025**: Every calculator page MUST include a feedback widget
  ("Was this helpful? Yes/No") that sends engagement signals to analytics.
- **FR-026**: Every calculator page MUST include a "Request a Calculator"
  link/button that collects user-submitted calculator ideas.
- **FR-027**: All calculator pages MUST display privacy messaging
  ("Your data never leaves your device. No calculations are stored on
  our servers.") to build user trust.
- **FR-028**: The site MUST display a live calculation counter
  ("N calculations this month") on the homepage and calculator pages
  as social proof.
- **FR-029**: Each calculator page's content MUST be at least 40% unique
  from any other calculator page to avoid Google's scaled-content
  enforcement (SpamBrain). Automated uniqueness checks MUST be in CI.
- **FR-030**: A pre-launch landing page with email capture MUST be live
  before calculator development completes, to build an initial audience.

### Key Entities

- **Calculator Definition**: Represents a single calculator type (e.g.,
  MRR Calculator, CAC Calculator). Contains: unique identifier, category,
  input fields and their types/ranges/v alidations, output fields with
  formatting, calculation formula reference, content sections (explanation,
  formula description, benchmarks, examples), FAQ items, schema metadata
  (title, description, keywords).
- **User Account**: Represents a registered user. Contains: email,
  subscription tier (Free/Pro), saved calculations, API key(s), language
  preference.
- **Calculation Record**: Represents a single use of a calculator by a
  user. Contains: calculator identifier, input values, output results,
  timestamp, associated user (if logged in).
- **Embed Instance**: Represents a third-party site embedding a calculator.
  Contains: originating URL, calculator identifier, embed creation date,
  total calculations performed via embed.
- **Language Locale**: Represents a supported language. Contains: language
  code (e.g., es, de, pt-BR), translated strings for all UI labels,
  translated calculator content, translated FAQ items.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can navigate to any calculator page and
  receive accurate calculation results in under 2 seconds  -  without
  creating an account.
- **SC-002**: At least 20 unique, fully functional calculator types are
  available at launch, distributed across at least 4 business categories.
- **SC-003**: Each calculator page contains at least 500 words of unique
  explanatory content, a formula box with worked example, industry
  benchmarks (where applicable), and 5-12 FAQ items.
- **SC-004**: Every calculator page renders as a rich search result
  (breadcrumb, WebApp, and FAQ schemas visible in structured data testing
  tools).
- **SC-005**: A user can share a specific calculation by copying the URL;
  the recipient opening that URL sees the exact same input values and
  results.
- **SC-006**: A user can embed any calculator on a third-party website
  using a provided code snippet; the embedded calculator functions
  identically to the platform version.
- **SC-007**: A user can create a free account and save a calculation in
  under 2 minutes from start to finish.
- **SC-008**: A Pro subscriber can export any saved calculation as a PDF
  document containing inputs, formulas, and results.
- **SC-009**: The homepage dashboard displays results from at least 5
  different calculator types from a single form submission.
- **SC-010**: All user-facing text  -  calculator labels, navigation,
  content, FAQs, error messages  -  is available in at least 5 languages,
  and language selection persists across sessions.
- **SC-011**: A developer with a valid API key can retrieve calculation
  results for any calculator via REST in under 500ms per request.
- **SC-012**: Invalid inputs (e.g., negative revenue, empty fields) result
  in clear, human-readable error messages  -  not system errors or blank
  screens.

## Assumptions

- **Target users are English-proficient SaaS founders/operators**: All
  initial content and UX is authored in English. Multi-language is added
  after the English suite is stable.
- **Calculators are used in a web browser with JavaScript enabled**: All
  calculation logic runs client-side for instant feedback. Users with
  JavaScript disabled will see the static content but cannot use the
  interactive tool.
- **Ad blockers are present on 45-65% of target user devices**: The
  calculator experience must never depend on ad delivery. Ads are served
  alongside, not as part of, the core functionality.
- **Third-party sites embedding calculators will accept iframe embeds**:
  No server-side SDK or npm package is provided at launch  -  distribution
  starts with simple iframe embeds.
- **Users have stable internet connectivity during initial page load**:
  Calculator pages are pre-built static HTML served via CDN. Once loaded,
  the calculator works without further network requests.
- **Pro subscription pricing starts at $7-15/month** (escalating to $9-19
  as the calculator library grows beyond 40 tools). This undercuts
 ' $9-19 for a smaller initial calculator set.
- **Dashboards and embeds do not replace dedicated calculator pages**:
  The interconnected dashboard is additive  -  every calculator also has its
  own dedicated page with full content and SEO treatment.
- **Multi-language starts with 5 languages**: Spanish, German, Portuguese,
  French, and Japanese (based on OnlineCalcAI's highest-traffic locales and
  SaaS market presence).
- **API is launched after the core calculator suite is stable**: API
  development begins only after at least 20 calculators are live and
  performing well in production.
