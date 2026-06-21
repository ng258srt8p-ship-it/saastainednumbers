import type { Metadata } from "next";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("about.heading")} - SaaStainedNumbers`,
    description: t("about.subtitle"),
    alternates: {
      canonical: "https://saastainednumbers.com/about",
      languages: {
        en: "https://saastainednumbers.com/about",
        es: "https://saastainednumbers.com/es/about",
        de: "https://saastainednumbers.com/de/about",
        pt: "https://saastainednumbers.com/pt/about",
        fr: "https://saastainednumbers.com/fr/about",
        ja: "https://saastainednumbers.com/ja/about",
      },
    },
    openGraph: {
      title: `${t("about.heading")} - SaaStainedNumbers`,
      description: t("about.subtitle"),
      type: "website",
      images: ["/api/og?title=About"],
      siteName: "SaaStainedNumbers",
    },
  };
}

export default async function AboutPage() {
  const { t } = await getTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("about.heading")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("about.heroSubtitle")}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {t("about.methodologyTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t("about.methodologyBody")}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("about.editorialTitle")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">{t("about.marcusName")}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{t("about.marcusRole")}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("about.marcusBio")}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">{t("about.elenaName")}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{t("about.elenaRole")}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("about.elenaBio")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("about.architectureTitle")}
        </h2>
        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
          <p>
            {t("about.architectureIntro")}
          </p>
          <ul>
            <li>{t("about.architectureFeature1")}</li>
            <li>{t("about.architectureFeature2")}</li>
            <li>{t("about.architectureFeature3")}</li>
            <li>{t("about.architectureFeature4")}</li>
            <li>{t("about.architectureFeature5")}</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("about.verificationTitle")}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t("about.verificationBody1")}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t("about.verificationBody2")}
        </p>
      </div>
    </div>
  );
}
