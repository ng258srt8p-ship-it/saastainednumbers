"use client";

import Link from "next/link";

/**
 * Global error boundary for the root layout.
 * This is the ONLY error file allowed to render <html> in Next.js App Router.
 * Without this file, Next.js falls back to its internal handler which renders
 * <html> inside the root layout's <main>, causing hydration errors.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
        <div className="text-center max-w-md">
          <p className="font-heading text-8xl font-bold text-gray-700">500</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          <p className="mt-1 text-xs text-gray-600 font-mono">
            {error.digest && `Error ID: ${error.digest}`}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 hover:border-brand-500 transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
