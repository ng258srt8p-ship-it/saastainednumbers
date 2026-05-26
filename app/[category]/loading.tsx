export default function LoadingCategory() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
      <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-5 w-80 rounded bg-gray-100 dark:bg-gray-700" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100 dark:bg-gray-700" />
            <div className="mt-1 h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
