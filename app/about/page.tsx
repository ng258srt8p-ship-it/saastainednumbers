import type { Metadata } from "next";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("about.title")} - SaaStainedNumbers`,
    description: t("about.subtitle"),
    alternates: {
      canonical: localeUrl("/about"),
      languages: alternateLanguages("/about"),
    },
    openGraph: {
      title: `${t("about.title")} - SaaStainedNumbers`,
      description: t("about.subtitle"),
      type: "website",
      images: ["/api/og?title=About&category=home"],
    },
  };
}

export default async function AboutPage() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("about.heading")}
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {t("about.subtitle")}
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Our Mission</h2>
        <p>{t("about.mission")}</p>

        <h2>Who We Are</h2>
        <p>{t("about.whoWeAre")}</p>

        <h2>Editorial Standards</h2>
        <p>{t("about.editorial")}</p>

        <h2>Why Is It Free?</h2>
        <p>{t("about.freeModel")}</p>

        <h2>Contact</h2>
        <p>
          Questions or suggestions?{" "}
          <Link href="/contact" className="text-brand-600 dark:text-brand-400 hover:underline">
            {t("about.contactLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
