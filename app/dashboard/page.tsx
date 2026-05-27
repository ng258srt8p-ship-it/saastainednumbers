import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard  -  SaaStainedNumbers",
  description: "Track your SaaS metrics in one place. Free interconnected dashboard for MRR, CAC, LTV, churn, and ARPU.",
  alternates: {
    canonical: "https://saastainednumbers.com/dashboard",
  },
  openGraph: {
    title: "Dashboard  -  SaaStainedNumbers",
    description: "Track your SaaS metrics in one place. Free interconnected dashboard for MRR, CAC, LTV, churn, and ARPU.",
    images: ["/api/og?title=Dashboard&category=home"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard  -  SaaStainedNumbers",
    description: "Track your SaaS metrics in one place. Free interconnected dashboard for MRR, CAC, LTV, churn, and ARPU.",
    images: ["/api/og?title=Dashboard&category=home"],
  },
};

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
