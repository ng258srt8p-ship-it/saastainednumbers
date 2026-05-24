"use client";

export default function CalculatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center">
      <p className="font-heading text-6xl font-bold text-gray-200">Oops</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">{error.message || "An unexpected error occurred."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        Try Again
      </button>
    </div>
  );
}
