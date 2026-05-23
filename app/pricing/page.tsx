import { auth } from "@/lib/auth";
import { getProTier } from "@/lib/stripe";
import Link from "next/link";

const freeFeatures = [
  "5 essential calculators (MRR, CAC, LTV, Churn, ARPU)",
  "Basic embed support",
  "Real-time results",
  "URL sharing",
];

export default async function PricingPage() {
  const session = await auth();
  const pro = getProTier();
  const isPro = session?.user?.subscriptionTier === "pro";

  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-gray-500">
          Start free, upgrade when you need more power.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-gray-900">Free</h2>
          <p className="mt-1 text-sm text-gray-500">For quick calculations</p>
          <p className="mt-6">
            <span className="text-5xl font-bold text-gray-900">$0</span>
            <span className="text-gray-400">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/"
              className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-xl">
          <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
            Popular
          </span>
          <h2 className="font-heading text-xl font-bold text-gray-900">Pro</h2>
          <p className="mt-1 text-sm text-gray-500">For serious SaaS teams</p>
          <p className="mt-6">
            <span className="text-5xl font-bold text-gray-900">${pro.price / 100}</span>
            <span className="text-gray-400">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            {pro.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            {isPro ? (
              <Link
                href="/api/stripe/portal"
                className="block w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Manage Subscription
              </Link>
            ) : (
              <Link
                href={session?.user ? "/api/stripe/checkout" : "/auth/signin"}
                className="block w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                {session?.user ? "Upgrade to Pro" : "Sign in to Upgrade"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
