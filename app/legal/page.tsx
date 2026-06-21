import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("legal.title")} - SaaStainedNumbers`,
    description: t("legal.subtitle"),
    alternates: {
      canonical: "https://saastainednumbers.com/legal",
      languages: {
        en: "https://saastainednumbers.com/legal",
        es: "https://saastainednumbers.com/es/legal",
        de: "https://saastainednumbers.com/de/legal",
        pt: "https://saastainednumbers.com/pt/legal",
        fr: "https://saastainednumbers.com/fr/legal",
        ja: "https://saastainednumbers.com/ja/legal",
      },
    },
    openGraph: {
      title: `${t("legal.title")} - SaaStainedNumbers`,
      description: t("legal.subtitle"),
      type: "website",
      images: ["/api/og?title=Legal"],
      siteName: "SaaStainedNumbers",
    },
  };
}

export default async function LegalPage() {
  const { t } = await getTranslations();

  const sections = [
    {
      id: "disclaimer",
      title: t("legal.sectionDisclaimer.title"),
      href: "/legal#disclaimer",
      description: t("legal.sectionDisclaimer.description"),
    },
    {
      id: "privacy",
      title: t("footer.privacyPolicy"),
      href: "/privacy",
      description: t("legal.sectionPrivacy.description"),
    },
    {
      id: "terms",
      title: t("footer.termsOfService"),
      href: "/terms",
      description: t("legal.sectionTerms.description"),
    },
    {
      id: "cookies",
      title: t("footer.cookiePolicy"),
      href: "/legal#cookies",
      description: t("legal.sectionCookies.description"),
    },
    {
      id: "acceptable-use",
      title: t("legal.sectionAcceptableUse.title"),
      href: "/legal#acceptable-use",
      description: t("legal.sectionAcceptableUse.description"),
    },
    {
      id: "contact",
      title: t("contact.title"),
      href: "/contact",
      description: t("legal.sectionContact.description"),
    },
  ];

  return (
    <div className="mobbin-section"><div className="max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t("legal.title")}
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {t("legal.subtitle")}
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="grid gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Disclaimer */}
      <section id="disclaimer" className="scroll-mt-20">
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 mb-8">
          <h2 className="font-heading text-xl font-bold text-amber-800 dark:text-amber-300">
            {t("legal.disclaimer.title")}
          </h2>
          <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
            {t("legal.disclaimer.lastUpdated")}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>{t("legal.disclaimer.notFinancialAdviceTitle")}</h3>
          <p>
            {t("legal.disclaimer.notFinancialAdviceBody1")}
          </p>
          <p>
            {t("legal.disclaimer.notFinancialAdviceBody2")}
          </p>

          <h3>{t("legal.disclaimer.noGuaranteeTitle")}</h3>
          <p>
            {t("legal.disclaimer.noGuaranteeBody")}
          </p>

          <h3>{t("legal.disclaimer.useAtOwnRiskTitle")}</h3>
          <p>
            {t("legal.disclaimer.useAtOwnRiskBody")}
          </p>

          <h3>{t("legal.disclaimer.benchmarksTitle")}</h3>
          <p>
            {t("legal.disclaimer.benchmarksBody")}
          </p>

          <h3>{t("legal.disclaimer.embeddedTitle")}</h3>
          <p>
            {t("legal.disclaimer.embeddedBody")}
          </p>

          <h3>{t("legal.disclaimer.availabilityTitle")}</h3>
          <p>
            {t("legal.disclaimer.availabilityBody")}
          </p>
        </div>
      </section>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Cookie Policy */}
      <section id="cookies" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("footer.cookiePolicy")}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("legal.cookies.lastUpdated")}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>{t("legal.cookies.whatAreCookiesTitle")}</h3>
          <p>
            {t("legal.cookies.whatAreCookiesBody")}
          </p>

          <h3>{t("legal.cookies.localStorageTitle")}</h3>
          <p>
            {t("legal.cookies.localStorageBody")}
          </p>

          <h3>{t("legal.cookies.analyticsTitle")}</h3>
          <p>
            {t("legal.cookies.analyticsBody")}
          </p>
        </div>
      </section>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Acceptable Use */}
      <section id="acceptable-use" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("legal.sectionAcceptableUse.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("legal.acceptableUse.lastUpdated")}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>{t("legal.acceptableUse.embeddedTitle")}</h3>
          <p>
            {t("legal.acceptableUse.embeddedIntro")}
          </p>
          <ul>
            <li>{t("legal.acceptableUse.embeddedItem1")}</li>
            <li>{t("legal.acceptableUse.embeddedItem2")}</li>
            <li>{t("legal.acceptableUse.embeddedItem3")}</li>
            <li>{t("legal.acceptableUse.embeddedItem4")}</li>
          </ul>

          <h3>{t("legal.acceptableUse.prohibitedTitle")}</h3>
          <p>{t("legal.acceptableUse.prohibitedIntro")}</p>
          <ul>
            <li>{t("legal.acceptableUse.prohibitedItem1")}</li>
            <li>{t("legal.acceptableUse.prohibitedItem2")}</li>
            <li>{t("legal.acceptableUse.prohibitedItem3")}</li>
          </ul>

          <h3>{t("legal.acceptableUse.enforcementTitle")}</h3>
          <p>
            {t("legal.acceptableUse.enforcementBody")}
          </p>
        </div>
      </section>
    </div></div>
  );
}
