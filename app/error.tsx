"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
        <div className="text-center max-w-md">
          <p className="font-heading text-8xl font-bold text-gray-300 dark:text-gray-700">500</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600 font-mono">
            {error.digest && `Error ID: ${error.digest}`}
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
