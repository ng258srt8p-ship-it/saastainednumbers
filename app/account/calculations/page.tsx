import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyCalculationsPage() {
  let session;
  try { session = await auth(); } catch { session = null; }
  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Calculations</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sign in to see your saved calculations.
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Sign in is currently disabled.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline">
            Go to Home &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const calculations = await prisma.calculationRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Calculations</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your saved calculations from the last 30 days.
      </p>

      {calculations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No saved calculations yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline">
            Start a calculation &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => (
            <div key={calc.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {calc.calculatorSlug.replace(/-/g, " ")}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {calc.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
