"use client";

import { useState } from "react";

export default function PrelaunchPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          SaaS Calculators Built for Founders
        </h1>
        <p className="mt-6 text-lg text-gray-500">
          Free, instant calculators for MRR, CAC, LTV, churn, and more. Get early access and
          be the first to know when new calculators launch.
        </p>
        <div className="mt-10">
          {submitted ? (
            <div className="mx-auto max-w-md rounded-2xl bg-brand-50 border border-brand-100 p-6">
              <p className="text-lg font-semibold text-brand-800">You&rsquo;re on the list!</p>
              <p className="mt-1 text-sm text-brand-600">
                We&rsquo;ll keep you updated on new calculator launches and features.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-shadow"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Get Early Access
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
          <div>
            <p className="font-heading text-3xl font-bold text-brand-600">25</p>
            <p className="text-sm text-gray-500">Calculators</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-brand-500">4</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold text-brand-700">Free</p>
            <p className="text-sm text-gray-500">No Account Needed</p>
          </div>
        </div>
      </div>
    </main>
  );
}
