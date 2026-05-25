"use client";

import posthog from "posthog-js";

type PostHogEvent = "pageview" | "calculate" | "compare" | "feedback" | "signup" | "upgrade";

const enabled = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

function capture(event: PostHogEvent, properties?: Record<string, unknown>) {
  if (!enabled) return;
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
