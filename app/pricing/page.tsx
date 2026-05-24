import Link from "next/link";

const allFeatures = [
  "All 25 calculators  -  no limits",
  "Real-time results with benchmark comparisons",
  "Stage-based growth insights (Seed to Series C+)",
  "Unlimited embeds for your website",
  "URL sharing for collaboration",
  "Save calculations to your account",
  "Multi-language support (6 languages)",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-heading text-4xl font-bold text-gray-900">
        Everything is Free
      </h1>
      <p className="mt-3 text-lg text-gray-500">
        No subscriptions, no paywalls. All 25 calculators are completely free to use.
      </p>

      <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-5xl font-bold text-gray-900">$0</p>
        <p className="mt-1 text-sm text-gray-400">forever</p>

        <ul className="mt-8 space-y-4 text-left">
          {allFeatures.map((f) => (
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
            href="/calculators"
            className="inline-block rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            Browse All Calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
