import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "cloud-infrastructure-cost-calculator",
  category: "ai-cost",
  isNew: true,
  meta: {
    title: "Cloud Infrastructure Cost Calculator",
    description: "Estimate monthly and annual cloud infrastructure costs including compute, storage, data transfer, and managed services.",
    keywords: ["cloud cost", "infrastructure cost", "aws cost", "azure cost", "gcp cost", "cloud computing", "devops costs", "server costs", "infrastructure budgeting"],
  },
  inputs: [
    { id: "computeInstances", label: "Compute Instances", type: "number" as const, defaultValue: 3, min: 0 },
    { id: "costPerInstanceHour", label: "Cost per Instance per Hour ($)", type: "currency" as const, defaultValue: 0.50, min: 0 },
    { id: "hoursPerMonth", label: "Hours per Month per Instance", type: "number" as const, defaultValue: 730, min: 0 },
    { id: "storageGB", label: "Storage (GB)", type: "number" as const, defaultValue: 500, min: 0 },
    { id: "storageCostPerGB", label: "Storage Cost per GB ($)", type: "currency" as const, defaultValue: 0.10, min: 0 },
    { id: "dataTransferGB", label: "Data Transfer per Month (GB)", type: "number" as const, defaultValue: 1000, min: 0 },
    { id: "dataTransferCostPerGB", label: "Data Transfer Cost per GB ($)", type: "currency" as const, defaultValue: 0.09, min: 0 },
    { id: "managedServicesCost", label: "Managed Services Cost per Month ($)", type: "currency" as const, defaultValue: 200, min: 0 },
  ],
  outputs: [
    { id: "monthlyComputeCost", label: "Monthly Compute Cost", type: "currency" as const, isPrimary: false },
    { id: "monthlyStorageCost", label: "Monthly Storage Cost", type: "currency" as const, isPrimary: false },
    { id: "monthlyDataTransferCost", label: "Monthly Data Transfer Cost", type: "currency" as const, isPrimary: false },
    { id: "monthlyManagedServicesCost", label: "Monthly Managed Services Cost", type: "currency" as const, isPrimary: false },
    { id: "totalMonthlyCost", label: "Total Monthly Cost", type: "currency" as const, isPrimary: true },
    { id: "annualProjectedCost", label: "Annual Projected Cost", type: "currency" as const, isPrimary: true },
  ],
  content: {
    intro: "Cloud infrastructure costs are one of the largest expenses for modern SaaS and AI companies. Understanding your compute, storage, data transfer, and managed services costs is essential for budgeting, pricing, and unit economics. This calculator breaks down total cloud spending by category and projects annual costs, helping you model different infrastructure configurations and optimize your cloud architecture before committing to a setup.",
    howToUse: "Enter your compute instances, hourly cost, hours per month, storage needs, data transfer requirements, and managed services costs. The calculator breaks down each cost component and shows your total monthly and annual cloud spend. Adjust variables to model different scenarios — such as reserved instances, storage optimization, or data transfer reductions.",
    formulaExplanation: "Monthly Compute = Instances × Cost/Hour × Hours. Monthly Storage = Storage GB × Cost per GB. Monthly Data Transfer = Transfer GB × Cost per GB. Monthly Managed Services = Fixed cost. Total Monthly = Compute + Storage + Transfer + Managed Services. Annual = Monthly × 12. Example: 3 instances × $0.50/hr × 730 hrs = $1,095 compute. 500 GB × $0.10 = $50 storage. 1,000 GB × $0.09 = $90 transfer. + $200 services = $1,435/month = $17,220/year.",
    benchmarks: "Typical SaaS cloud costs range from $500-5,000/month for early-stage startups to $50K-500K+/month for growth-stage companies. Cloud costs should represent 10-20% of revenue for most SaaS businesses. Compute typically accounts for 40-60% of total cloud spend, storage 10-20%, data transfer 10-20%, and managed services 10-30%. Use [AWS Pricing Calculator](https://calculator.aws), [Azure Pricing](https://azure.microsoft.com/pricing/calculator/), or [GCP Pricing Calculator](https://cloud.google.com/products/calculator) for provider-specific estimates.",
    benchmarkData: [
      { metric: "Cloud Cost as % of Revenue (SaaS)", value: "10-20%", source: "a16z Cloud Cost Report" },
      { metric: "Compute as % of Cloud Spend", value: "40-60%", source: "Flexera State of Cloud" },
      { metric: "Storage as % of Cloud Spend", value: "10-20%", source: "Flexera State of Cloud" },
      { metric: "Data Transfer as % of Cloud Spend", value: "10-20%", source: "Industry Average" },
      { metric: "Managed Services as % of Cloud Spend", value: "10-30%", source: "Industry Average" },
      { metric: "Early-Stage Startup Cloud Cost", value: "$500-5K/month", source: "Industry Standard" },
    ],
    relatedCalculators: ["gpu-compute-cost-calculator", "gross-margin-calculator", "burn-rate-calculator", "break-even-calculator"],
    faq: [
      { question: "How can I reduce cloud infrastructure costs?", answer: "Use reserved instances (40-60% discount vs on-demand), right-size instances (monitor utilization and downsize over-provisioned resources), implement auto-scaling, use spot instances for non-critical workloads, optimize storage (move infrequent access data to cheaper tiers), minimize data transfer costs (use CDN, same-region architecture), and clean up unused resources (orphaned volumes, idle load balancers)." },
      { question: "What cloud provider offers the best value?", answer: "AWS, Azure, and GCP offer comparable pricing for similar services, though each has strengths. AWS has the broadest service catalog and best discounts for committed use. Azure integrates well with Microsoft ecosystems. GCP offers the best pricing for data-intensive workloads and Kubernetes. The biggest cost savings come from architecture optimization, not provider choice. Use multi-cloud tools like [Vantage](https://vantage.sh) for cost optimization." },
      { question: "What are the hidden costs of cloud infrastructure?", answer: "Common hidden costs include: data transfer between regions/services (often higher than compute), NAT gateway and VPN costs, load balancer hourly charges, Elastic IPs (unattached), snapshot storage, monitoring/logging costs (CloudWatch, DataDog), support plan fees, and dev/test environments left running 24/7. These hidden costs can add 20-40% to your bill. Regular cost audits with tools like AWS Cost Explorer help identify them." },
      { question: "How does cloud cost scale with user growth?", answer: "Cloud costs typically scale sub-linearly with user growth due to database connection pooling, CDN caching, and compute efficiency. A 10x user increase might only increase cloud costs 3-5x. However, data transfer costs scale nearly linearly with usage. Most mature SaaS companies see cloud costs grow at 30-50% of revenue growth rate. Plan for cloud costs to be 15-25% of revenue at scale." },
      { question: "Should I use reserved instances or on-demand pricing?", answer: "Use reserved instances (1 or 3-year terms) for baseline, predictable workloads — they offer 40-60% discounts. Use on-demand or spot instances for variable, experimental, or fault-tolerant workloads. A good rule: reserve 60-70% of your expected baseline capacity, cover seasonal peaks with on-demand, and use spot for batch processing and non-critical dev/test environments." },
      { question: "What is the difference between vertical and horizontal scaling costs?", answer: "Vertical scaling (bigger instances) is simpler but has a cost premium — the largest instances cost 3-5x more per unit of compute than mid-range instances. Horizontal scaling (more small instances) is more cost-efficient and provides better resiliency. For most workloads, using multiple smaller instances with a load balancer is cheaper and more reliable than one large instance." },
      { question: "How do data transfer costs work across cloud providers?", answer: "Data transfer within the same region is typically free. Data transfer between regions or to the internet incurs charges ($0.05-0.12/GB depending on volume). Ingress (data coming in) is usually free. Egress (data going out) is the main cost. AWS, Azure, and GCP all offer free tiers (1-100GB/month egress). Use a CDN (CloudFront, CloudFlare) to cache content and reduce egress costs." },
      { question: "What is the cost impact of multi-region deployment?", answer: "Multi-region deployment typically increases costs 50-100% because you're running duplicate infrastructure in two or more regions. Data replication and cross-region traffic add significant costs. However, the redundancy and latency improvements may justify the expense for compliance, disaster recovery, or global user bases. Consider active-passive (one region live, one on standby) to reduce costs while maintaining failover capability." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
