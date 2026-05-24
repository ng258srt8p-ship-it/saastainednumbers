import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  let session;
  try { session = await auth(); } catch { session = null; }
  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-gray-500 mb-8">Manage your account preferences.</p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-600">Sign in is currently disabled.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-600 hover:text-brand-700 underline">
            Go to Home &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.userAccount.findUnique({
    where: { id: session.user.id },
    select: { locale: true },
  });

  const currentLocale = user?.locale ?? "en";

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
      </div>
    </div>
  );
}
