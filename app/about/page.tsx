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
    <div className="mobbin-section">
      <div className="max-w-3xl mx-auto">
        <span className="mobbin-label">{t("about.title")}</span>
        <h1 className="font-heading text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">{t("about.heading")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("about.subtitle")}</p>

        <div className="mt-10 space-y-6">
          {[
            { title: "Our Mission", text: t("about.mission") },
            { title: "Who We Are", text: t("about.whoWeAre") },
            { title: "Editorial Standards", text: t("about.editorial") },
            { title: "Why Is It Free?", text: t("about.freeModel") },
          ].map((section) => (
            <div key={section.title} className="mobbin-card">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center mobbin-card flex flex-col items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t("about.haveQuestions")}</p>
          <Link href="/contact" className="mobbin-btn-primary">
            {t("about.contactLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
