import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const locales = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "ja", name: "日本語" },
];

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.userAccount.findUnique({
    where: { id: session.user.id },
    select: { subscriptionTier: true, locale: true, stripeCustomerId: true },
  });

  const tier = user?.subscriptionTier ?? "free";
  const currentLocale = user?.locale ?? "en";
  const hasBilling = !!user?.stripeCustomerId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900">Account Settings</h1>
      <p className="mt-2 text-gray-500 mb-8">Manage your account preferences.</p>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <p className="text-sm text-gray-600">
            Signed in as <strong className="text-gray-900">{session.user.email}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Language</h2>
          <div className="flex flex-wrap gap-2">
            {locales.map((l) => (
              <span
                key={l.code}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  l.code === currentLocale
                    ? "bg-brand-100 text-brand-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {l.name}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Switch language using the dropdown in the navigation bar.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
          <p className="text-sm text-gray-600">
            You are on the{" "}
            <strong className={tier === "pro" ? "text-brand-600" : "text-gray-900"}>
              {tier === "pro" ? "Pro" : "Free"}
            </strong>{" "}
            plan.
          </p>
          <div className="mt-4 flex gap-3">
            {tier === "pro" ? (
              hasBilling ? (
                <Link
                  href="/api/stripe/portal"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  Manage Billing
                </Link>
              ) : null
            ) : (
              <Link
                href="/pricing"
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
