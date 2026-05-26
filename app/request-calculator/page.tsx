"use client";

import { useState, type FormEvent } from "react";

const CATEGORIES = [
  "revenue", "churn-retention", "growth-efficiency", "unit-economics",
  "ai-cost", "side-hustle", "personal-finance", "general-business", "saas-deepen",
];

export default function RequestCalculatorPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [useCase, setUseCase] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!name.trim()) errs.push("name");
    if (!category) errs.push("category");
    if (!useCase.trim()) errs.push("useCase");
    if (!email.trim()) errs.push("email");
    setErrors(errs);
    if (errs.length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <p className="text-6xl">🎉</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">Thank You!</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We&apos;ll review your suggestion and get back to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">Request a Calculator</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Don&apos;t see what you need? Tell us what calculator you&apos;d like us to build.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Calculator Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g., SaaS Gross Profit Calculator"
          />
          {errors.includes("name") && <p className="mt-1 text-xs text-red-500">Name is required</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
          {errors.includes("category") && <p className="mt-1 text-xs text-red-500">Category is required</p>}
        </div>

        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Use Case</label>
          <textarea
            id="useCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Describe how you'd use this calculator..."
          />
          {errors.includes("useCase") && <p className="mt-1 text-xs text-red-500">Use case is required</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="you@example.com"
          />
          {errors.includes("email") && <p className="mt-1 text-xs text-red-500">Email is required</p>}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
