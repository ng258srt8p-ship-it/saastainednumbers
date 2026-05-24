export interface PodcastRevenueParams {
  downloadsPerEpisode: number;
  episodesPerMonth: number;
  cpm: number;
  sponsorshipRate: number;
  sponsorsPerEpisode: number;
}

export interface PodcastRevenueResult {
  monthlyAdRevenue: number;
  monthlySponsorshipRevenue: number;
  monthlyTotalRevenue: number;
  annualRevenue: number;
  revenuePerThousandDownloads: number;
}

export function calculatePodcastRevenue(params: PodcastRevenueParams): PodcastRevenueResult {
  const { downloadsPerEpisode, episodesPerMonth, cpm, sponsorshipRate, sponsorsPerEpisode } = params;
  if (downloadsPerEpisode < 0 || episodesPerMonth < 0 || cpm < 0 || sponsorshipRate < 0 || sponsorsPerEpisode < 0) {
    throw new Error("Values must be positive");
  }
  const monthlyAdRevenue = (downloadsPerEpisode * episodesPerMonth / 1000) * cpm;
  const monthlySponsorshipRevenue = sponsorshipRate * sponsorsPerEpisode * episodesPerMonth;
  const monthlyTotalRevenue = monthlyAdRevenue + monthlySponsorshipRevenue;
  const annualRevenue = monthlyTotalRevenue * 12;
  const totalMonthlyDownloads = downloadsPerEpisode * episodesPerMonth;
  const revenuePerThousandDownloads = totalMonthlyDownloads > 0 ? (monthlyTotalRevenue / totalMonthlyDownloads) * 1000 : 0;
  return { monthlyAdRevenue, monthlySponsorshipRevenue, monthlyTotalRevenue, annualRevenue, revenuePerThousandDownloads };
}
