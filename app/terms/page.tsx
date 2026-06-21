import type { Metadata } from "next";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("terms.title")} - SaaStainedNumbers`,
    description: t("terms.subtitle"),
    alternates: {
      canonical: localeUrl("/terms"),
      languages: alternateLanguages("/terms"),
       },
    openGraph: {
      title: `${t("terms.title")} - SaaStainedNumbers`,
      description: t("terms.subtitle"),
      type: "website",
      images: ["/api/og?title=Terms+of+Service"],
      siteName: "SaaStainedNumbers",
       },
     };
}

export default async function TermsPage() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/legal" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-4 inline-block">
        ← {t("footer.legal")}
      </Link>
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("terms.heading")}
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("terms.lastUpdated")}
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>{t("terms.acceptanceTitle")}</h2>
        <p>
          {t("terms.acceptanceBody")}
        </p>

        <h2>{t("terms.descriptionTitle")}</h2>
        <p>
          {t("terms.descriptionBody")}
        </p>

        <h2>{t("terms.userResponsibilitiesTitle")}</h2>
        <p>{t("terms.userResponsibilitiesIntro")}</p>
        <ul>
          <li>{t("terms.userResponsibility1")}</li>
          <li>{t("terms.userResponsibility2")}</li>
          <li>{t("terms.userResponsibility3")}</li>
          <li>{t("terms.userResponsibility4")}</li>
          <li>{t("terms.userResponsibility5")}</li>
        </ul>

        <h2>{t("terms.intellectualPropertyTitle")}</h2>
        <p>
          {t("terms.intellectualPropertyBody")}
        </p>

        <h2>{t("terms.limitationTitle")}</h2>
        <p>
          {t("terms.limitationBody")}
        </p>

        <h2>{t("terms.governingLawTitle")}</h2>
        <p>
          {t("terms.governingLawBody")}
        </p>

        <h2>{t("terms.changesTitle")}</h2>
        <p>
          {t("terms.changesBody")}
        </p>

        <h2>{t("terms.contactTitle")}</h2>
        <p>
          {t("terms.contactBody")}{" "}
          <a href="mailto:legal@saastainednumbers.com" className="text-brand-600 dark:text-brand-400 hover:underline">
            legal@saastainednumbers.com
          </a>.
        </p>
      </div>
    </div>
  );
}
