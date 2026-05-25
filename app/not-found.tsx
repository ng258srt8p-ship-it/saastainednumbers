import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <p className="font-heading text-8xl font-bold text-gray-500">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
