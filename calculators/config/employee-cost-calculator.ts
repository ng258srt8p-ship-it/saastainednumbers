import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "employee-cost-calculator",
  category: "general-business",
  meta: {
    title: "Employee Cost Calculator",
    description: "Calculate the true cost of an employee including salary, taxes, benefits, equipment, and overhead.",
    keywords: ["employee cost", "cost of employee", "employer cost", "total compensation", "hiring budget", "payroll cost"],
  },
  benchmarkMetric: "employee-cost",
  inputs: [
    { id: "baseSalary", label: "Base Salary ($)", type: "currency" as const, defaultValue: 80000, min: 0 },
    { id: "bonusPercent", label: "Bonus (% of Salary)", type: "percentage" as const, defaultValue: 10, min: 0, max: 100 },
    { id: "payrollTaxPercent", label: "Payroll Tax Rate (%)", type: "percentage" as const, defaultValue: 7.65, min: 0, max: 100 },
    { id: "benefitsPercent", label: "Benefits (% of Salary)", type: "percentage" as const, defaultValue: 30, min: 0, max: 100 },
    { id: "equipmentCost", label: "Equipment Cost ($)", type: "currency" as const, defaultValue: 5000, min: 0 },
    { id: "officeSpaceCost", label: "Office Space Cost ($)", type: "currency" as const, defaultValue: 6000, min: 0 },
    { id: "headcount", label: "Headcount", type: "number" as const, defaultValue: 1, min: 1 },
  ],
  outputs: [
    { id: "totalCostPerEmployee", label: "Total Cost per Employee", type: "currency" as const, isPrimary: true },
    { id: "totalCostAllEmployees", label: "Total Cost (All Employees)", type: "currency" as const, isPrimary: true },
    { id: "salaryBurdenPercent", label: "Salary Burden (%)", type: "percentage" as const, isPrimary: false },
    { id: "monthlyCostPerEmployee", label: "Monthly Cost per Employee", type: "currency" as const, isPrimary: false },
  ],
  content: {
    intro: "The true cost of an employee goes far beyond their base salary. When you factor in bonuses, payroll taxes (Social Security, Medicare, unemployment), benefits (health insurance, 401k matching, paid time off, training), equipment, and office space, the total cost is typically 1.25-1.4x the base salary. This multiplier  -  called the salary burden or burden rate  -  is essential for accurate budgeting, pricing, and hiring decisions.",
    howToUse: "Enter the employee's base salary, expected bonus percentage, payroll tax rate (standard is 7.65% for Social Security + Medicare, plus unemployment), benefits percentage (typically 25-35% of salary), equipment and office costs, and headcount. The calculator shows total cost per employee, burden percentage, and monthly costs.",
    formulaExplanation: "Bonus = Salary × Bonus%. Payroll Tax = Salary × Payroll Tax%. Benefits = Salary × Benefits%. Total per Employee = Salary + Bonus + Payroll Tax + Benefits + Equipment + Office. Burden % = (Total  -  Salary) ÷ Salary × 100. Example: $80K salary + $8K bonus + $6.1K tax + $24K benefits + $5K equip + $6K office = $129K total ($49K burden, 61% burden rate).",
    benchmarks: "The standard salary burden is 25-40% for fully remote employees (payroll tax + benefits) and 40-60% for in-office employees (adds office space, equipment). US employer payroll taxes are 7.65% (6.2% Social Security + 1.45% Medicare) plus state unemployment (0.5-5%). Benefits (health insurance, 401k, PTO, training) typically add 20-35%. Use [Gusto](https://gusto.com) or [Rippling](https://rippling.com) for payroll management.",
    benchmarkData: [
      { metric: "US Payroll Tax (Social Security + Medicare)", value: "7.65%", source: "IRS" },
      { metric: "Health Insurance Cost (Employer Share)", value: "$5-7K / year per employee", source: "KFF 2025" },
      { metric: "401k Match Typical", value: "3-6% of salary", source: "Vanguard" },
      { metric: "Remote Employee Burden Rate", value: "25-40%", source: "General benchmark" },
      { metric: "In-Office Employee Burden Rate", value: "40-60%", source: "General benchmark" },
      { metric: "Total Cost for $100K Employee", value: "$150-175K (in-office)", source: "Calculated" },
    ],
    relatedCalculators: ["break-even-calculator", "pricing-strategy-calculator"],
    faq: [
      { question: "What is included in employee cost beyond salary?", answer: "Payroll taxes (Social Security, Medicare, unemployment  -  7.65-12%), health insurance ($5-7K/year), 401k matching (3-6% of salary), paid time off (2-4 weeks × daily rate), life/disability insurance, training and development, equipment (laptop, monitor, software), and office space/utilities ($4-12K/year per employee)." },
      { question: "What is a typical salary burden percentage?", answer: "Remote employees: 25-40% burden (just payroll tax + benefits). In-office employees: 40-60% burden (adds office space, equipment, supplies). Tech companies with generous benefits: 50-70%. Minimum burden (no benefits, no office): ~10% (just payroll tax). Use 30% as a safe default for planning." },
      { question: "How do I calculate budget for a new hire?", answer: "Determine the fully loaded cost (salary × 1.3 to 1.5), then multiply by 1.2-1.5x for overhead (management, HR, recruiting, tools). A $100K salary hire costs $130-150K fully loaded and $155-225K including overhead. Budget conservatively  -  hiring is always more expensive than expected." },
      { question: "How does geography affect employee cost?", answer: "San Francisco/NYC: in-office costs 50-80% more than remote due to office space and salary premiums. Secondary markets (Austin, Denver): 20-30% premium for in-office. Remote: uniform cost regardless of location if pay is location-agnostic. Some companies adjust salary by location, reducing costs in lower COL areas." },
      { question: "What employee costs are tax-deductible?", answer: "All ordinary and necessary employee costs are tax-deductible business expenses: salaries, bonuses, payroll taxes, health insurance premiums, 401k contributions, training, equipment, and office space. This reduces the after-tax cost by 21-35% depending on corporate tax rate." },
      { question: "How do contractors compare to employees in cost?", answer: "Contractors cost 20-40% more per hour than employee equivalent hourly rate ($100-200/hr for contractors vs $50-100/hr employee equivalent). However, contractors have zero overhead  -  no benefits, no payroll tax, no office space, no equipment. Contractors are better for variable or project-based work; employees for core, ongoing roles." },
      { question: "What is the ROI of a new employee?", answer: "A: Calculate fully loaded annual cost. B: Estimate incremental revenue or value the employee generates. Target ROI = (B  -  A) ÷ A ≥ 2x within 12-18 months. Revenue-generating roles (sales) can justify higher costs. Support roles should be evaluated on efficiency gains and cost avoidance rather than direct revenue." },
      { question: "How do benefits costs vary by company size?", answer: "Small companies (under 50 employees) pay 10-25% more for health insurance than large companies due to less negotiating power. 401k plans cost more for small companies to administer. As you scale, per-employee benefits costs typically decrease. Group buying power and plan design optimize at 100+ employees." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "従業員コスト計算機",
        description: "給与、税金、福利厚生、備品、諸経費を含む従業員の真のコストを計算します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
