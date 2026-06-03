import type { Metadata } from "next";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("contact.title")} - SaaStainedNumbers`,
    description: t("contact.subtitle"),
    alternates: {
      canonical: localeUrl("/contact"),
      languages: alternateLanguages("/contact"),
     },
    openGraph: {
      title: `${t("contact.title")} - SaaStainedNumbers`,
      description: t("contact.subtitle"),
      type: "website",
      images: ["/api/og?title=Contact&category=home"],
     },
   };
}

export default async function ContactPage() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-4 inline-block">
        {t("contact.backToHome")}
      </Link>
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("contact.heading")}
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {t("contact.subtitle")}
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100">{t("contact.emailLabel")}</h2>
          <a
            href="mailto:hello@saastainednumbers.com"
            className="mt-2 inline-block text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            hello@saastainednumbers.com
          </a>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t("contact.responseTime")}</p>
        </div>

      </div>

      <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        <p>For legal inquiries: <a href="mailto:legal@saastainednumbers.com" className="text-brand-600 dark:text-brand-400 hover:underline">legal@saastainednumbers.com</a></p>
        <p className="mt-1">For affiliate partnerships: <a href="mailto:hello@saastainednumbers.com" className="text-brand-600 dark:text-brand-400 hover:underline">hello@saastainednumbers.com</a></p>
      </div>
    </div>
  );
}
