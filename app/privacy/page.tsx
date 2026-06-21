import type { Metadata } from "next";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("privacy.title")} - SaaStainedNumbers`,
    description: t("privacy.subtitle"),
    alternates: {
      canonical: localeUrl("/privacy"),
      languages: alternateLanguages("/privacy"),
      },
    openGraph: {
      title: `${t("privacy.title")} - SaaStainedNumbers`,
      description: t("privacy.subtitle"),
      type: "website",
      images: ["/api/og?title=Privacy+Policy"],
      siteName: "SaaStainedNumbers",
      },
    };
}

export default async function PrivacyPage() {
  const { t } = await getTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/legal" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-4 inline-block">
        ← {t("footer.legal")}
      </Link>
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("privacy.heading")}
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("privacy.lastUpdated")}
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>{t("privacy.commitmentTitle")}</h2>
        <p>
          {t("privacy.commitmentBody")}
        </p>

        <h2>{t("privacy.notCollectedTitle")}</h2>
        <ul>
          <li>{t("privacy.notCollected1")}</li>
          <li>{t("privacy.notCollected2")}</li>
          <li>{t("privacy.notCollected3")}</li>
        </ul>

        <h2>{t("privacy.cookiesTitle")}</h2>
        <p>
          {t("privacy.cookiesBody1")}
        </p>
        <p>
          {t("privacy.cookiesBody2")}
        </p>

        <h2>{t("privacy.thirdPartyTitle")}</h2>
        <p>{t("privacy.thirdPartyIntro")}</p>
        <ul>
          <li>{t("privacy.thirdParty1")}</li>
          <li>{t("privacy.thirdParty2")}</li>
          <li>{t("privacy.thirdParty3")}</li>
          <li>{t("privacy.thirdParty4")}</li>
        </ul>

        <h2>{t("privacy.yourRightsTitle")}</h2>
        <p>
          {t("privacy.yourRightsBody")}{" "}
          <a href="mailto:legal@saastainednumbers.com" className="text-brand-600 dark:text-brand-400 hover:underline">legal@saastainednumbers.com</a>.
          {t("privacy.yourRightsBody2")}
        </p>

        <h2>{t("privacy.dataRetentionTitle")}</h2>
        <p>
          {t("privacy.dataRetentionBody")}
        </p>

        <h2>{t("privacy.changesTitle")}</h2>
        <p>
          {t("privacy.changesBody")}
        </p>
      </div>
    </div>
  );
}
