export default function LoadingEmbed() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-pulse">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-700" />
          </div>
        ))}
        <div className="mt-4 space-y-3">
          <div className="h-16 rounded-lg bg-gray-100 dark:bg-gray-700" />
          <div className="h-16 rounded-lg bg-gray-100 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
