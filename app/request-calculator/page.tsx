"use client";

import { useState } from "react";

export default function RequestCalculatorPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl bg-green-50 border border-green-200 p-10 text-center shadow-sm">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl mb-4">🎉</span>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h1>
          <p className="text-green-700 max-w-sm mx-auto">
            We&apos;ve received your calculator request. We review all suggestions and will notify you when it&apos;s available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Request a Calculator</h1>
        <p className="text-gray-500">
          Don&apos;t see the calculator you need? Tell us what you&apos;re looking for and we&apos;ll build it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Calculator Name
          </label>
          <input
            id="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            placeholder="e.g., Burn Rate Calculator"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            id="category"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
          >
            <option value="">Select a category</option>
            <option value="revenue">Revenue Metrics</option>
            <option value="growth-efficiency">Growth & Efficiency</option>
            <option value="churn-retention">Churn & Retention</option>
            <option value="unit-economics">Unit Economics</option>
          </select>
        </div>

        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1.5">
            Use Case
          </label>
          <textarea
            id="useCase"
            required
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            placeholder="Describe how you would use this calculator..."
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
