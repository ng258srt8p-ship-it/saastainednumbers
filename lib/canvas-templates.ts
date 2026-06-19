/**
 * Canvas Template definitions — curated preset configurations for the canvas workspace.
 * Each template defines a set of calculator slugs to load into the workspace.
 */
export type TemplateCategory = "saas" | "finance" | "marketing" | "operations" | "personal";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: TemplateCategory;
  slugs: string[];
}

const TEMPLATES: CanvasTemplate[] = [
  {
    id: "saas-starter",
    name: "SaaS Starter Pack",
    description: "Core SaaS metrics: MRR, churn, LTV, CAC, gross margin",
    icon: "rocket_launch",
    category: "saas",
    slugs: [
      "mrr-calculator",
      "churn-calculator",
      "ltv-calculator",
      "cac-calculator",
      "gross-margin-calculator",
    ],
  },
  {
    id: "unit-economics",
    name: "Unit Economics Deep Dive",
    description: "LTV, CAC, payback, margins, and LTV:CAC ratio",
    icon: "bar_chart",
    category: "saas",
    slugs: [
      "ltv-calculator",
      "cac-calculator",
      "cac-payback-period-enhanced-calculator",
      "gross-margin-calculator",
      "contribution-margin-calculator",
      "cac-ltv-ratio-calculator",
    ],
  },
  {
    id: "growth-efficiency",
    name: "Growth Efficiency Suite",
    description: "Quick ratio, magic number, rule of 40, burn multiple, NRR",
    icon: "trending_up",
    category: "saas",
    slugs: [
      "quick-ratio-calculator",
      "magic-number-calculator",
      "rule-of-40-calculator",
      "burn-multiple-calculator",
      "nrr-calculator",
    ],
  },
  {
    id: "revenue-metrics",
    name: "Revenue Metrics",
    description: "MRR, ARR, ARPU, MRR growth, expansion revenue",
    icon: "payments",
    category: "saas",
    slugs: [
      "mrr-calculator",
      "arpu-calculator",
      "mrr-growth-rate-calculator",
      "expansion-revenue-rate-calculator",
      "net-cash-flow-calculator",
    ],
  },
  {
    id: "ai-costs",
    name: "AI Cost Analyzer",
    description: "Compare API costs across Claude, ChatGPT, Gemini, and Grok",
    icon: "smart_toy",
    category: "operations",
    slugs: [
      "claude-api-cost-calculator",
      "chatgpt-api-cost-calculator",
      "gemini-api-cost-calculator",
      "grok-api-cost-calculator",
      "ai-model-comparison-calculator",
    ],
  },
  {
    id: "personal-finance",
    name: "Personal Finance Planner",
    description: "FIRE, savings rate, emergency fund, investments, debt payoff",
    icon: "account_balance",
    category: "personal",
    slugs: [
      "fire-calculator",
      "savings-rate-calculator",
      "emergency-fund-calculator",
      "investment-returns-calculator",
      "debt-payoff-calculator",
    ],
  },
  {
    id: "side-hustle",
    name: "Side Hustle Stack",
    description: "Freelance, affiliate, newsletter, side income tax, blogging",
    icon: "work",
    category: "finance",
    slugs: [
      "freelance-rate-calculator",
      "affiliate-income-calculator",
      "newsletter-revenue-calculator",
      "side-income-tax-calculator",
      "blogging-income-calculator",
    ],
  },
  {
    id: "business-health",
    name: "Business Health Check",
    description: "Break-even, burn rate, cash runway, employee cost, ROI",
    icon: "business",
    category: "operations",
    slugs: [
      "break-even-calculator",
      "burn-rate-calculator",
      "cash-runway-calculator",
      "employee-cost-calculator",
      "roi-calculator",
    ],
  },
  {
    id: "churn-retention",
    name: "Churn & Retention Audit",
    description: "Churn, NPS, engagement, health score, activation rate",
    icon: "sync",
    category: "marketing",
    slugs: [
      "churn-calculator",
      "nps-calculator",
      "customer-engagement-score-calculator",
      "customer-health-score-calculator",
      "activation-rate-calculator",
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start fresh with an empty workspace",
    icon: "auto_awesome",
    category: "operations",
    slugs: [],
  },
];

export function getTemplates(): CanvasTemplate[] {
  return TEMPLATES;
}

export function getTemplateById(id: string): CanvasTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: "saas", label: "SaaS Metrics" },
  { id: "finance", label: "Finance" },
  { id: "marketing", label: "Marketing" },
  { id: "operations", label: "Operations" },
  { id: "personal", label: "Personal" },
];
