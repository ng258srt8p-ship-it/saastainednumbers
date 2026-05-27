const API_BASE = "https://api.baremetrics.com/v1";

function getApiKey(): string {
  return process.env.BAREMETRICS_LIVE_KEY || "";
}

interface BaremetricsMetricResponse {
  date: string;
  mrr?: number;
  arr?: number;
  ltv?: number;
  churn_rate?: number;
  arpu?: number;
  customer_count?: number;
  quick_ratio?: number;
}

interface BaremetricsSource {
  id: string;
  provider: string;
  display_name: string;
  connected: boolean;
}

async function fetchMetric<T>(endpoint: string): Promise<T> {
  const key = getApiKey();
  if (!key) {
    throw new Error("BAREMETRICS_LIVE_KEY is not configured");
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Baremetrics API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getSources(): Promise<BaremetricsSource[]> {
  const data = await fetchMetric<{ sources: BaremetricsSource[] }>("/sources");
  return data.sources;
}

export async function getMRR(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/mrr");
}

export async function getARR(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/arr");
}

export async function getLTV(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/ltv");
}

export async function getChurnRate(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/churn-rate");
}

export async function getARPU(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/arpu");
}

export async function getCustomerCount(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/customer-count");
}

export async function getQuickRatio(): Promise<BaremetricsMetricResponse> {
  return fetchMetric<BaremetricsMetricResponse>("/metrics/quick-ratio");
}

export async function getAllMetrics(): Promise<{
  mrr: BaremetricsMetricResponse;
  arr: BaremetricsMetricResponse;
  ltv: BaremetricsMetricResponse;
  churnRate: BaremetricsMetricResponse;
  arpu: BaremetricsMetricResponse;
  customerCount: BaremetricsMetricResponse;
  quickRatio: BaremetricsMetricResponse;
}> {
  const [mrr, arr, ltv, churnRate, arpu, customerCount, quickRatio] = await Promise.all([
    getMRR(), getARR(), getLTV(), getChurnRate(),
    getARPU(), getCustomerCount(), getQuickRatio(),
  ]);
  return { mrr, arr, ltv, churnRate, arpu, customerCount, quickRatio };
}
