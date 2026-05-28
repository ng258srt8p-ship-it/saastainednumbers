import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard  -  SaaStainedNumbers",
  description: "Build your own SaaS metrics dashboard. Add any calculator, enter data once, and see interconnected metrics update live. Free, no sign-up.",
  alternates: {
    canonical: "https://saastainednumbers.com/dashboard",
  },
  openGraph: {
    title: "Dashboard  -  SaaStainedNumbers",
    description: "Build your own SaaS metrics dashboard. Add any calculator, enter data once, and see interconnected metrics update live. Free, no sign-up.",
    images: ["/api/og?title=Dashboard&category=home"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard  -  SaaStainedNumbers",
    description: "Build your own SaaS metrics dashboard. Add any calculator, enter data once, and see interconnected metrics update live. Free, no sign-up.",
    images: ["/api/og?title=Dashboard&category=home"],
  },
};

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}
