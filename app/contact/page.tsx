import type { Metadata } from "next";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";
import { ContactForm } from "@/components/ContactForm";

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
  const { t, locale } = await getTranslations();

  const formStrings = {
    formTitle: t("contact.formTitle"),
    formName: t("contact.formName"),
    formEmail: t("contact.formEmail"),
    formSubject: t("contact.formSubject"),
    formMessage: t("contact.formMessage"),
    formSend: t("contact.formSend"),
    formSending: t("contact.formSending"),
    formSuccess: t("contact.formSuccess"),
    formError: t("contact.formError"),
    formSubjectGeneral: t("contact.formSubjectGeneral"),
    formSubjectBug: t("contact.formSubjectBug"),
    formSubjectSuggestion: t("contact.formSubjectSuggestion"),
    formSubjectLegal: t("contact.formSubjectLegal"),
  };

  return (
    <div className="mobbin-section">
      <div className="max-w-3xl mx-auto">
        <span className="mobbin-label">{t("contact.title")}</span>
        <h1 className="font-heading text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
          {t("contact.heading")}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("contact.subtitle")}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="mobbin-card">
              <h2 className="font-heading font-bold text-gray-900 dark:text-gray-100">{t("contact.emailLabel")}</h2>
              <a
                href="mailto:hello@saastainednumbers.com"
                className="mt-2 inline-block text-brand-600 dark:text-brand-400 hover:underline font-medium text-sm"
              >
                hello@saastainednumbers.com
              </a>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t("contact.responseTime")}</p>
            </div>
            <div className="mobbin-card">
              <h2 className="font-heading font-bold text-gray-900 dark:text-gray-100">Legal</h2>
              <a href="mailto:legal@saastainednumbers.com" className="mt-2 inline-block text-brand-600 dark:text-brand-400 hover:underline text-sm font-medium">
                legal@saastainednumbers.com
              </a>
            </div>
            <div className="mobbin-card">
              <h2 className="font-heading font-bold text-gray-900 dark:text-gray-100">Partnerships</h2>
              <a href="mailto:hello@saastainednumbers.com" className="mt-2 inline-block text-brand-600 dark:text-brand-400 hover:underline text-sm font-medium">
                hello@saastainednumbers.com
              </a>
            </div>
          </div>
          <div>
            <ContactForm strings={formStrings} />
          </div>
        </div>
      </div>
    </div>
  );
}
