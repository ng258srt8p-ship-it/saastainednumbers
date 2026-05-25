export interface AffiliateProgram {
  name: string;
  url: string;
  description: string;
  categories: string[];
  commission: string;
  signupUrl: string;
}

export const affiliatePrograms: AffiliateProgram[] = [
  {
    name: "ChartMogul",
    url: "https://chartmogul.com",
    description: "SaaS analytics and metrics platform",
    categories: ["revenue", "churn-retention", "growth-efficiency"],
    commission: "20% recurring for 12 months",
    signupUrl: "https://chartmogul.com/partners/",
  },
  {
    name: "Baremetrics",
    url: "https://baremetrics.com",
    description: "SaaS metrics and insights",
    categories: ["revenue", "churn-retention"],
    commission: "30% recurring",
    signupUrl: "https://baremetrics.com/affiliate",
  },
  {
    name: "ProfitWell",
    url: "https://www.profitwell.com",
    description: "Subscription analytics and retention tools",
    categories: ["revenue", "churn-retention", "unit-economics"],
    commission: "20% recurring",
    signupUrl: "https://www.profitwell.com/affiliates",
  },
  {
    name: "Stripe",
    url: "https://stripe.com",
    description: "Payment processing for SaaS businesses",
    categories: ["general-business"],
    commission: "Varies by volume",
    signupUrl: "https://stripe.com/partners/affiliate",
  },
  {
    name: "HubSpot",
    url: "https://hubspot.com",
    description: "CRM and marketing platform",
    categories: ["growth-efficiency", "general-business"],
    commission: "30% recurring for 12 months",
    signupUrl: "https://hubspot.com/partners/affiliate",
  },
  {
    name: "Intercom",
    url: "https://intercom.com",
    description: "Customer communication platform",
    categories: ["churn-retention", "growth-efficiency"],
    commission: "25% recurring",
    signupUrl: "https://intercom.com/affiliates",
  },
  {
    name: "NerdWallet",
    url: "https://nerdwallet.com",
    description: "Personal finance tools and advice",
    categories: ["personal-finance"],
    commission: "Varies",
    signupUrl: "https://nerdwallet.com/affiliates",
  },
  {
    name: "Gumroad",
    url: "https://gumroad.com",
    description: "Digital product sales platform",
    categories: ["side-hustle"],
    commission: "Varies",
    signupUrl: "https://gumroad.com/affiliates",
  },
  {
    name: "Patreon",
    url: "https://patreon.com",
    description: "Membership platform for creators",
    categories: ["side-hustle"],
    commission: "Varies",
    signupUrl: "https://patreon.com/affiliates",
  },
  {
    name: "Shopify",
    url: "https://shopify.com",
    description: "E-commerce platform",
    categories: ["side-hustle", "general-business"],
    commission: "Varies",
    signupUrl: "https://shopify.com/affiliates",
  },
  {
    name: "OpenView",
    url: "https://openviewpartners.com",
    description: "SaaS growth resources and benchmarks",
    categories: ["revenue", "growth-efficiency"],
    commission: "N/A (referral)",
    signupUrl: "",
  },
  {
    name: "First Round Capital",
    url: "https://firstround.com",
    description: "Startup resources and guides",
    categories: ["general-business"],
    commission: "N/A (referral)",
    signupUrl: "",
  },
];

export function getAffiliatesByCategory(category: string): AffiliateProgram[] {
  return affiliatePrograms.filter((p) => p.categories.includes(category));
}
