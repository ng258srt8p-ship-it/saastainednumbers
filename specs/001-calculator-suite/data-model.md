# Data Model: Calculator Suite  -  WebCalc MVP

## Overview

Five core entities drive the WebCalc platform. Calculator Definitions and
Language Locales are configuration data loaded at build time. User Accounts
and Calculation Records are runtime data stored in the database. Embed
Instances are tracked analytics data.

---

## Entity: CalculatorDefinition

A single calculator type (e.g., "MRR Calculator", "CAC Calculator"). Each
calculator is defined once in a TypeScript config and rendered across all
supported languages.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| slug | string | yes | URL-friendly identifier (e.g., "mrr-calculator") |
| category | enum | yes | One of: "saas-metrics", "unit-economics", "churn-retention", "growth-efficiency", "cost-pricing", "marketing-roi", "freelance-ops" |
| meta.title | string | yes | SEO title (< 60 chars) |
| meta.description | string | yes | Meta description (150-160 chars) |
| meta.keywords | string[] | no | Related long-tail keywords |
| inputs | CalculatorInput[] | yes | Array of input field definitions |
| outputs | CalculatorOutput[] | yes | Array of result display definitions |
| engine | { formula: string } | yes | Human-readable formula explanation |
| charts | ChartConfig[] | no | Optional chart configurations |
| premium | boolean | yes | Whether this calc requires Pro subscription |
| content | CalculatorContent | yes | Per-calculator SEO content blocks |
| faq | FAQItem[] | yes | 5-12 FAQ items with schema markup |
| benchmarks | BenchmarkData[] | no | Industry benchmarks for comparison |

### CalculatorInput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Machine-readable key (e.g., "customers") |
| label | string | yes | User-facing label (e.g., "Number of Customers") |
| type | enum | yes | "number", "currency", "percentage", "range" |
| defaultValue | number | yes | Starting value |
| min | number | no | Minimum allowed value |
| max | number | no | Maximum allowed value |
| step | number | no | Increment step for range inputs |
| prefix | string | no | Display prefix ("$", "€") |
| suffix | string | no | Display suffix ("%", "users") |
| required | boolean | no | Whether input is mandatory |

### CalculatorOutput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Machine-readable key (e.g., "mrr") |
| label | string | yes | User-facing label (e.g., "Monthly Recurring Revenue") |
| format | enum | yes | "currency", "percentage", "number", "ratio" |
| isPrimary | boolean | no | Whether this is the hero result |

### CalculatorContent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| intro | string | yes | 2-3 sentence intro defining the metric |
| howToUse | string | yes | Numbered steps for using the calculator |
| formulaExplanation | string | yes | Formula with worked example |
| benchmarks | string | no | Industry benchmarks / "what good looks like" |
| relatedCalculators | string[] | no | Slugs of related calculators for internal linking |

### FAQItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| question | string | yes | Question text |
| answer | string | yes | Answer text (can include formatting) |

---

## Entity: UserAccount

A registered user. Created via NextAuth.js (email magic link or Google OAuth).
Free tier requires only an email. Pro tier adds Stripe subscription.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | yes | Primary key |
| email | string | yes | Unique email address |
| displayName | string | no | Optional display name |
| subscriptionTier | enum | yes | "free" or "pro" |
| subscriptionId | string | no | Stripe subscription ID (Pro only) |
| locale | string | yes | Preferred language code (default: "en") |
| apiKey | string | no | API key (generated on demand for Pro users) |
| createdAt | timestamp | yes | Account creation date |
| lastLoginAt | timestamp | yes | Last sign-in timestamp |

### Validation Rules
- Email must be unique
- SubscriptionId present iff subscriptionTier = "pro"
- Display name max 100 characters
- Locale must be a supported language code

### State Transitions
- free → pro: Upon successful Stripe payment confirmation
- pro → free: Upon subscription cancellation or payment failure
- free → deleted: Account deletion (anonymizes calculation records)

---

## Entity: CalculationRecord

A single use of a calculator. Stored for anonymous users (in localStorage)
and synced to the database for logged-in users.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | yes | Primary key |
| userId | uuid | no | Foreign key to UserAccount (null for anonymous) |
| calculatorSlug | string | yes | Which calculator was used |
| inputs | JSON | yes | Input values as key-value pairs |
| outputs | JSON | yes | Calculated results as key-value pairs |
| embedSource | string | no | URL of embedding site (if used via embed) |
| createdAt | timestamp | yes | When calculation was performed |

### Validation Rules
- CalculatorSlug must reference an existing CalculatorDefinition
- Inputs must match CalculatorDefinition's input schema
- Outputs must match CalculatorDefinition's output schema

### Retention
- Anonymous records: stored in localStorage indefinitely (user-controlled)
- Free tier records: retained for 90 days since last login
- Pro tier records: retained indefinitely

---

## Entity: EmbedInstance

Tracks a third-party site that has embedded a calculator. Created when the
embed snippet is first loaded from a new origin.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | yes | Primary key |
| originUrl | string | yes | Embedding site's origin URL |
| calculatorSlug | string | yes | Which calculator is embedded |
| totalCalculations | number | yes | Cumulative calculation count via this embed |
| createdAt | timestamp | yes | When embed was first detected |

### Aggregations
- Total embeds per calculator
- Total calculations performed via embeds
- Unique embedding domains

---

## Entity: LanguageLocale

Defines translations for all user-facing text in a given language.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | yes | Language code (e.g., "es", "de", "pt-BR") |
| name | string | yes | Native language name (e.g., "Español") |
| translations | JSON | yes | Key-value pairs of translation strings |
| calculatorContent | JSON | no | Per-calculator translated content blocks |
| faqTranslations | JSON | no | Per-calculator translated FAQ items |
| isRTL | boolean | yes | Right-to-left layout flag |

### Supported Languages (MVP)
- English (en)  -  source language
- Spanish (es)
- German (de)
- Portuguese (pt-BR)
- French (fr)
- Japanese (ja)

---

## Entity Relationships

```
UserAccount 1──N CalculationRecord
  (A user has many calculation records)

CalculatorDefinition 1──N CalculationRecord
  (A calculator is used in many calculations)

CalculatorDefinition 1──N EmbedInstance
  (A calculator can be embedded on many sites)

LanguageLocale N──N CalculatorDefinition
  (A calculator is available in many locales;
   a locale translates many calculators)
```
