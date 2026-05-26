"use client";

import posthog from "posthog-js";

type PostHogEvent = "pageview" | "calculate" | "compare" | "feedback" | "signup" | "upgrade";

function capture(event: PostHogEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof posthog.__loaded === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    /* analytics silently fail */
  }
}

export const analytics = {
  calculate: (slug: string, inputs: Record<string, number>) =>
    capture("calculate", { slug, inputs }),
  compare: (slug: string, inputsA: Record<string, number>, inputsB: Record<string, number>) =>
    capture("compare", { slug, inputsA, inputsB }),
  feedback: (slug: string, helpful: boolean) =>
    capture("feedback", { slug, helpful }),
  signup: (method: string) => capture("signup", { method }),
  upgrade: () => capture("upgrade"),
};
