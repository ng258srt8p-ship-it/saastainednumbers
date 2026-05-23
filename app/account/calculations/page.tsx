import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function MyCalculationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const calculations = await prisma.calculationRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">My Calculations</h1>
      <p className="text-gray-600 mb-8">
        Your saved calculations from the last 30 days.
      </p>

      {calculations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">No saved calculations yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-600 hover:text-brand-700 underline">
            Start a calculation &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => (
            <div key={calc.id} className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900 capitalize">
                {calc.calculatorSlug.replace(/-/g, " ")}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {calc.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
