"use client";

import { usePageview } from "@/lib/posthog";

export function AnalyticsClient() {
  usePageview();
  return null;
}
