import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <p className="font-heading text-8xl font-bold text-gray-500 dark:text-gray-400">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
