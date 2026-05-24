export interface NewsletterRevenueParams {
  subscribers: number;
  freeToPaidConversionRate: number;
  monthlyPrice: number;
  sponsorshipCpm: number;
  sponsorshipEmailsPerMonth: number;
  openRate: number;
}

export interface NewsletterRevenueResult {
  paidSubscribers: number;
  monthlySubscriptionRevenue: number;
  monthlySponsorshipRevenue: number;
  monthlyTotalRevenue: number;
  annualRevenue: number;
  revenuePerSubscriber: number;
}

export function calculateNewsletterRevenue(params: NewsletterRevenueParams): NewsletterRevenueResult {
  const { subscribers, freeToPaidConversionRate, monthlyPrice, sponsorshipCpm, sponsorshipEmailsPerMonth, openRate } = params;
  if (subscribers < 0 || freeToPaidConversionRate < 0 || monthlyPrice < 0 || sponsorshipCpm < 0 || sponsorshipEmailsPerMonth < 0 || openRate < 0) {
    throw new Error("Values must be positive");
  }
  const paidSubscribers = Math.round(subscribers * (freeToPaidConversionRate / 100));
  const monthlySubscriptionRevenue = paidSubscribers * monthlyPrice;
  const monthlySponsorshipRevenue = (sponsorshipEmailsPerMonth * subscribers * (openRate / 100) / 1000) * sponsorshipCpm;
  const monthlyTotalRevenue = monthlySubscriptionRevenue + monthlySponsorshipRevenue;
  const annualRevenue = monthlyTotalRevenue * 12;
  const revenuePerSubscriber = subscribers > 0 ? monthlyTotalRevenue / subscribers : 0;
  return { paidSubscribers, monthlySubscriptionRevenue, monthlySponsorshipRevenue, monthlyTotalRevenue, annualRevenue, revenuePerSubscriber };
}
