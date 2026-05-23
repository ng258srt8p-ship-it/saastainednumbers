# Quickstart: Calculator Suite — WebCalc MVP

## Prerequisites

- Node.js 22+
- npm 10+
- Git
- Vercel account (free)
- Stripe account (for freemium)
- PostHog account (free tier)

## Setup

```bash
# Clone and install
git clone <repo-url>
cd webcalc
npm install

# Set up environment
cp .env.example .env.local
# Fill in: DATABASE_URL, STRIPE_KEY, POSTHOG_KEY, RESEND_KEY, NEXTAUTH_SECRET
# Leave NEXTAUTH_URL as http://localhost:3000 for development

# Run database migrations
npm run db:migrate

# Generate all calculator pages
npm run generate

# Start development server
npm run dev
```

Visit `http://localhost:3000` — you should see the homepage with category
navigation and the interconnected dashboard.

## First Calculator Visit

```text
Navigate to localhost:3000/saas-metrics/mrr-calculator
→ You see: MRR calculator widget + 500+ words of content + FAQ section
→ Enter: customers=1000, arpu=50
→ Result: MRR = $50,000 displayed instantly
→ URL updates to: ...?customers=1000&arpu=50  (shareable link)
```

## Project Structure Quick Reference

```text
webcalc/                     # Repository root
├── calculators/             # All calculator code (config + engine + UI)
│   ├── config/              # One TypeScript file per calculator
│   ├── engine/              # Pure math functions, no framework deps
│   └── ui/                  # Shared React components
├── app/                     # Next.js App Router pages
│   ├── [category]/[slug]/   # Dynamic calculator pages (SSG)
│   ├── embed/[slug]/        # Embed widget route
│   ├── dashboard/           # Interconnected dashboard
│   └── api/v1/              # REST API routes
├── lib/                     # Shared utilities
│   ├── registry.ts          # Calculator config loader
│   └── seo.ts               # Schema + metadata generators
├── i18n/                    # Multi-language locale files
├── specs/                   # Feature documentation
│   └── 001-calculator-suite/
└── tests/                   # Test suites
    ├── calculators/         # Unit tests for engines
    ├── e2e/                 # Playwright end-to-end tests
    └── lighthouse/          # Performance regression checks
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run generate` | Build all calculator pages (SSG) |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright tests |
| `npm run lint` | Run Biome linting |
| `npm run typecheck` | Run TypeScript type check |
| `npm run build` | Production build |
| `npm run lighthouse` | Run Lighthouse CI checks |

## Adding a New Calculator

Adding a new calculator follows a standard process:

1. Create config in `calculators/config/new-calc.ts`
2. Create engine in `calculators/engine/new-calc.ts`
3. Register in `lib/registry.ts`
4. Run `npm run generate` → SSG builds all pages
5. Verify: `npm run test` + `npm run typecheck`

A calculator can be added in under 30 minutes once the config and engine are
written. Blog posts and embed outreach happen separately.

## Checking the Spec

The full feature specification is at
`specs/001-calculator-suite/spec.md` — it covers 7 user stories
(P1-P4), 23 functional requirements, 12 success criteria, and
7 edge cases.
