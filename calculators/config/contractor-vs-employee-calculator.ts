import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "contractor-vs-employee-calculator",
  category: "general-business",
  meta: {
    title: "Contractor vs Employee Cost Calculator",
    description: "Compare the true annual cost of hiring a contractor versus a full-time employee including salary, taxes, benefits, equipment, and overhead.",
    keywords: ["contractor vs employee", "contractor cost", "employee cost", "hire contractor", "full time employee cost", "freelancer vs employee", "cost comparison"],
  },
  benchmarkMetric: "employee-cost",
  inputs: [
    { id: "contractorRate", label: "Contractor Hourly Rate ($)", type: "currency" as const, defaultValue: 100, min: 0 },
    { id: "contractorHoursPerYear", label: "Contractor Hours per Year", type: "number" as const, defaultValue: 2000, min: 0 },
    { id: "employeeSalary", label: "Employee Base Salary ($)", type: "currency" as const, defaultValue: 120000, min: 0 },
    { id: "employeeBonusPercent", label: "Employee Bonus (% of Salary)", type: "percentage" as const, defaultValue: 10, min: 0, max: 100 },
    { id: "employeeBenefitsPercent", label: "Employee Benefits (% of Salary)", type: "percentage" as const, defaultValue: 30, min: 0, max: 100 },
    { id: "employeePayrollTaxPercent", label: "Employee Payroll Tax Rate (%)", type: "percentage" as const, defaultValue: 7.65, min: 0, max: 100 },
    { id: "employeeEquipmentCost", label: "Employee Equipment Cost ($)", type: "currency" as const, defaultValue: 5000, min: 0 },
    { id: "employeeOfficeCost", label: "Employee Office Cost ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
  ],
  outputs: [
    { id: "contractorAnnualCost", label: "Contractor Annual Cost", type: "currency" as const, isPrimary: false },
    { id: "employeeAnnualCost", label: "Employee Annual Cost", type: "currency" as const, isPrimary: false },
    { id: "difference", label: "Cost Difference", type: "currency" as const, isPrimary: false },
    { id: "contractorCheaperBy", label: "Contractor is Cheaper By", type: "currency" as const, isPrimary: true },
    { id: "percentDiff", label: "Percent Difference", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "One of the most critical hiring decisions businesses face is whether to bring on a contractor or hire a full-time employee. The answer is rarely straightforward  -  it depends on cost, flexibility, commitment, and the nature of the work. This calculator compares the true annual cost of both options, factoring in everything beyond the headline rate or salary. For contractors, you pay a higher hourly rate but have zero overhead: no payroll taxes, no health insurance, no 401k matching, no equipment costs, no office space. For employees, the base salary is just the starting point  -  bonuses, payroll taxes (Social Security, Medicare, unemployment), benefits (health insurance, retirement, PTO), equipment (laptop, monitor, software licenses), and office costs add 25-60% on top. The real question is: does the flexibility and zero-overhead of a contractor justify the higher per-hour cost? Or does the commitment and cultural investment in an employee deliver better long-term value? This calculator helps you answer that with hard numbers, so you can make informed hiring decisions rather than guessing.",
    howToUse: "Enter the contractor's hourly rate and expected hours per year, then fill in the employee cost details including base salary, bonus percentage, benefits percentage, payroll tax rate, equipment costs, and office costs. The calculator shows the total annual cost for each option, the cost difference, and which option is cheaper. Adjust any input to see how changes affect the comparison  -  for example, see what happens to total cost when the employee bonus or benefits package changes.",
    formulaExplanation: "Contractor Annual Cost = Hourly Rate × Hours per Year. Employee Annual Cost = Salary + (Salary × Bonus%) + (Salary × Benefits%) + (Salary × Payroll Tax%) + Equipment + Office. Contractor is cheaper when Contractor Cost < Employee Cost. The percent difference is calculated as the absolute difference divided by the larger of the two costs. For example, a contractor at $100/hr × 2000 hrs = $200K vs an employee at $120K salary + $12K bonus (10%) + $36K benefits (30%) + $9,180 payroll tax (7.65%) + $5K equipment + $10K office = $192,180. In this case the employee is cheaper by $7,820.",
    benchmarks: "According to industry data, contractors typically cost 20-40% more per hour than the equivalent employee hourly rate. However, because employees carry 25-60% overhead beyond salary, the total annual cost can be surprisingly close. For roles requiring specialized expertise (engineering, design, consulting), contractors are common and cost $100-250/hr. For ongoing operational roles, employees are typically more cost-effective. Use [Gusto](https://gusto.com) for payroll and [Upwork](https://upwork.com) for contractor hiring.",
    benchmarkData: [
      { metric: "Contractor Premium vs Employee Hourly", value: "20-40% higher", source: "MBO Partners 2025" },
      { metric: "Employee Burden Rate (Remote)", value: "25-40%", source: "General benchmark" },
      { metric: "Employee Burden Rate (In-Office)", value: "40-60%", source: "General benchmark" },
      { metric: "Typical Contractor Rate (Tech)", value: "$100-250/hr", source: "Upwork 2025" },
      { metric: "US Payroll Tax (Employer Share)", value: "7.65%", source: "IRS" },
    ],
    relatedCalculators: ["employee-cost-calculator", "break-even-calculator", "cash-runway-calculator"],
    faq: [
      { question: "When should I hire a contractor instead of an employee?", answer: "Hire a contractor when the work is project-based, requires specialized expertise not needed long-term, or when you need to scale quickly without commitment. Contractors are ideal for short-term projects, seasonal workloads, or highly specialized tasks like legal, accounting, or niche development work that doesn't justify a full-time hire." },
      { question: "What hidden costs come with employees that contractors don't have?", answer: "Employees come with payroll taxes (7.65%+ for Social Security and Medicare), unemployment insurance, workers compensation, health insurance ($5-7K/year), 401k matching (3-6%), paid time off (2-4 weeks), training costs, equipment, office space, and management overhead. Contractors handle all of these themselves, which is why their rates are higher." },
      { question: "Are contractors more expensive than employees overall?", answer: "It depends. Per hour, contractors are almost always more expensive ($100-250/hr vs $50-100/hr effective employee rate). But because employees have 25-60% overhead, the total annual cost can be similar. Contractors are typically more expensive for ongoing full-time work but cheaper for short-term or part-time needs where you'd otherwise have idle employee capacity." },
      { question: "How do benefits costs vary by company size for employees?", answer: "Small companies (under 50 employees) pay 10-25% more for health insurance than large companies. 401k plans are more expensive to administer at small scale. Larger companies get better rates on everything from insurance to equipment leasing. If you're a small business, contractor costs may be relatively more attractive since you avoid these small-company premium penalties." },
      { question: "What are the legal risks of misclassifying an employee as a contractor?", answer: "Misclassification is a serious legal risk. The IRS and Department of Labor use a multi-factor test evaluating behavioral control, financial control, and the relationship type. Penalties include back taxes, fines, and overtime pay. If the worker is integrated into your team, uses your equipment, works set hours, and only for you, they're likely an employee. Consult an employment lawyer to be safe." },
      { question: "How does geography affect contractor vs employee costs?", answer: "In high-cost areas (SF, NYC), office space adds $12-24K/year per employee, making contractors relatively more attractive. In remote-first setups, the cost gap narrows since you save on office space. For contractors, geography matters less  -  you can hire globally at different rates. For employees, location affects salary expectations and legal compliance." },
      { question: "What is the break-even point for hiring an employee vs a contractor?", answer: "If you need someone for more than 6-12 months of continuous work, an employee is usually cheaper. Below that, a contractor is often more cost-effective. The break-even depends on the rate differential and overhead costs. Use this calculator with your specific numbers to find the exact point where employee cost becomes more favorable." },
      { question: "How do I compare a contractor's rate to an employee's hourly equivalent?", answer: "Take the employee's total annual cost (salary + all overhead) and divide by working hours per year (approximately 2,000 for full-time, minus PTO: ~1,920). An employee costing $180K total ÷ 1,920 hours = $93.75/hr effective rate. Compare that to the contractor's $100-150/hr rate. This calculator does this comparison automatically." },
    ],
  },
  locales: {
    ja: {
      meta: {
        title: "契約社員vs正社員比較計算機",
        description: "契約社員と正社員の年間コストを給与、税金、福利厚生、諸経費を含めて比較します。",
      },
    },
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
