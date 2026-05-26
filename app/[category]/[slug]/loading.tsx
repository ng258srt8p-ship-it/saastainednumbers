export default function LoadingCalculator() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-5 w-96 rounded bg-gray-100 dark:bg-gray-700" />
      <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-700" />
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
