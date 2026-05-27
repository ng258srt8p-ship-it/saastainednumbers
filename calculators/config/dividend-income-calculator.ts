import { registerCalculator } from "@/lib/registry";
import type { CalculatorConfig } from "./calculator-schema";

const config = {
  slug: "dividend-income-calculator",
  category: "personal-finance",
  meta: {
    title: "Dividend Income Calculator",
    description: "Project your dividend income stream from a portfolio of dividend-paying stocks with DRIP (dividend reinvestment) and compounding growth.",
    keywords: ["dividend income", "passive income", "dividend investing", "dividend reinvestment", "DRIP", "dividend stocks", "income investing"],
  },
  inputs: [
    { id: "initialInvestment", label: "Initial Investment ($)", type: "currency" as const, defaultValue: 10000, min: 0 },
    { id: "monthlyContribution", label: "Monthly Contribution ($)", type: "currency" as const, defaultValue: 500, min: 0 },
    { id: "dividendYield", label: "Dividend Yield (%)", type: "percentage" as const, defaultValue: 4, min: 0, max: 20 },
    { id: "dividendGrowthRate", label: "Dividend Growth Rate (%)", type: "percentage" as const, defaultValue: 6, min: 0, max: 20 },
    { id: "years", label: "Years", type: "number" as const, defaultValue: 10, min: 0 },
  ],
  outputs: [
    { id: "totalInvested", label: "Total Amount Invested", type: "currency" as const, isPrimary: false },
    { id: "portfolioValue", label: "Portfolio Value", type: "currency" as const, isPrimary: true },
    { id: "annualDividendIncome", label: "Annual Dividend Income", type: "currency" as const, isPrimary: false },
    { id: "monthlyDividendIncome", label: "Monthly Dividend Income", type: "currency" as const, isPrimary: false },
    { id: "dividendYield", label: "Portfolio Yield", type: "percentage" as const, isPrimary: false },
  ],
  content: {
    intro: "Dividend investing is a proven strategy for building passive income that grows over time. By investing in companies that regularly distribute a portion of their profits to shareholders, you create a stream of cash flow that can supplement your earned income or fund your retirement. Dividend reinvestment (DRIP) is the engine that amplifies this growth  -  when you reinvest dividends to buy more shares, those additional shares generate their own dividends, creating a powerful compounding effect. Dividend aristocrats (companies that have increased dividends for 25+ consecutive years) and dividend kings (50+ years) have reliably grown their payouts through market cycles. This calculator projects the growth of a dividend portfolio including monthly contributions, dividend reinvestment, and dividend growth. The output is eye-opening: a $10K initial investment with $500/month in a portfolio yielding 4% with 6% dividend growth can generate over $800/month in dividend income within 15 years  -  real passive income from capital. The strategy works because dividends are less volatile than stock prices and provide a tangible return even in flat markets. For dividend stock research, visit [Fool.com](https://fool.com) and [Investopedia](https://investopedia.com).",
    howToUse: "Enter your initial investment amount, monthly contributions you plan to make, the current dividend yield of your target portfolio, the expected annual dividend growth rate, and investment time horizon. The calculator shows your total invested amount, projected portfolio value, and estimated annual and monthly dividend income. For a conservative estimate, use 3-4% yield with 5-6% dividend growth (matching S&P 500 dividend growth rates). For a high-income approach, use 5-7% yield with 2-4% growth (REITs, BDCs, or preferred stocks). Use dividend screeners to find high-dividend stocks and ETFs like VYM, SCHD, or VIG for diversified dividend exposure.",
    formulaExplanation: "Total Invested = Initial Investment + Monthly Contribution × 12 × Years. Portfolio Value is calculated with monthly compounding: each month, contributions are added and the entire portfolio grows by the monthly dividend growth rate (annual growth / 12). At the end of each year, the annual dividend is calculated: Annual Dividend = Portfolio Value × Dividend Yield / 100. This dividend is effectively reinvested through the growth calculation in subsequent periods. Annual Dividend Income = Portfolio Value at end × Dividend Yield / 100. Monthly Dividend Income = Annual / 12. The portfolio yield equals the dividend yield input.",
    benchmarks: "The S&P 500 has a current dividend yield of approximately 1.3-1.5%, but a dedicated dividend portfolio can yield 3-5%. Dividend aristocrats have averaged 6-10% annual dividend growth over the past decade. A portfolio yielding 4% with 6% dividend growth and $500/month contributions would reach approximately $107K invested and generate ~$5,800/year in dividends after 10 years. Warren Buffett's Berkshire Hathaway generates over $5 billion annually in dividends from its portfolio. The Dividend Aristocrats index has outperformed the S&P 500 over 20-year periods with lower volatility. For tracking and management, use [Bankrate](https://bankrate.com) for dividend calculators and [Fool.com](https://fool.com) for stock picks.",
    benchmarkData: [
      { metric: "S&P 500 Current Yield", value: "~1.4%", source: "S&P Global" },
      { metric: "Dividend Aristocrat Avg Yield", value: "~2.5%", source: "S&P Global" },
      { metric: "Dividend Growth Rate (S&P 500)", value: "6-8% annually", source: "Morningstar" },
      { metric: "High-Yield Portfolio Range", value: "4-7% yield", source: "Investopedia" },
      { metric: "REIT Average Yield", value: "4-8%", source: "NAREIT" },
      { metric: "Longest Dividend Growth Streak", value: "64 years (Duke Energy)", source: "Dividend Kings" },
    ],
    relatedCalculators: ["investment-returns-calculator", "retire-401k-calculator", "fire-calculator"],
    faq: [
      { question: "What is the difference between dividend yield and dividend growth?", answer: "Dividend yield is the annual dividend payment divided by the stock price (e.g., $4/share dividend / $100/share price = 4% yield). Dividend growth is the rate at which the dividend payment increases annually (e.g., a stock paying $4 this year and $4.24 next year has 6% dividend growth). Investing is a trade-off between these: high-yield stocks often have low growth, and low-yield growth stocks may have high dividend growth. A balanced portfolio includes both." },
      { question: "What are dividend aristocrats and kings?", answer: "Dividend Aristocrats are S&P 500 companies that have increased dividends for at least 25 consecutive years (65 companies as of 2025, including Procter & Gamble, Coca-Cola, and Johnson & Johnson). Dividend Kings have 50+ consecutive years of dividend increases (about 50 companies globally, including 3M and ExxonMobil). These companies demonstrate reliable business models, disciplined capital allocation, and shareholder-friendly management." },
      { question: "How does dividend reinvestment (DRIP) work?", answer: "DRIP automatically uses your cash dividends to purchase additional shares of the stock, often without commission fees. Many companies offer DRIP plans directly, and most brokerages provide automatic reinvestment for any stock or ETF. Over time, DRIP dramatically accelerates wealth building because your additional shares generate their own dividends  -  the compounding snowball effect. A $10K investment yielding 3% with DRIP doubles its share count in approximately 24 years." },
      { question: "Are dividends taxed differently than other investment income?", answer: "Qualified dividends (paid by US corporations held for more than 60 days in the 121-day period around the ex-dividend date) are taxed at the lower capital gains rate: 0%, 15%, or 20% based on your income bracket. Non-qualified dividends (REITs, certain foreign stocks, short-term holdings) are taxed as ordinary income at your marginal tax rate. Tax-advantaged accounts (IRAs, 401ks) avoid dividend taxes entirely during the accumulation phase." },
      { question: "What is a safe dividend yield?", answer: "Generally, yields above 4-5% warrant scrutiny. A very high yield (8%+) may indicate a distressed company whose stock price has fallen dramatically. Sustainable dividend payout ratios vary by sector: 40-60% for consumer staples, 30-50% for technology, 60-80% for utilities and REITs. A payout ratio over 90% is often unsustainable. Check a company's free cash flow and earnings coverage before investing for income." },
      { question: "What are the best dividend ETFs for passive income?", answer: "Popular dividend ETFs include: VYM (Vanguard High Dividend Yield, ~3% yield, 0.06% ER), SCHD (Schwab US Dividend Equity, ~3.5% yield, 0.06% ER), VIG (Vanguard Dividend Appreciation, ~1.8% yield, 0.06% ER  -  focuses on growth), DGRO (iShares Core Dividend Growth, ~2.2% yield, 0.08% ER), and SPYD (SPDR Portfolio High Yield, ~4.5% yield, 0.07% ER). For international exposure: VYMI or IDV. Choose based on your balance of yield vs growth." },
      { question: "Can I live off dividend income?", answer: "Yes, but it requires substantial capital. To generate $40K/year in dividend income at a 4% yield, you need a $1M portfolio. At 3% yield, you'd need $1.33M. At 5%, $800K. The 4% Rule from retirement research applies here: a portfolio yielding 4% with 2-3% dividend growth can sustain inflation-adjusted withdrawals. Dividend income is more tax-efficient than selling shares and provides cash flow without depleting principal." },
      { question: "How do interest rates affect dividend stocks?", answer: "Rising interest rates make bonds and savings accounts more competitive with dividend stocks, often causing short-term price declines for dividend payers. However, quality dividend stocks with pricing power and strong balance sheets tend to raise dividends regardless of the rate environment. During periods of rising rates (2022-2023), dividend growth stocks actually outperformed the broader market. For long-term investors, rate cycles are noise  -  focus on the growing income stream." },
    ],
  },
} satisfies CalculatorConfig;

registerCalculator(config);
export default config;
