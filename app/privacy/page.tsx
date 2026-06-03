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
        Last updated: May 26, 2026
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Our Commitment to Privacy</h2>
        <p>
          SaaStainedNumbers is designed to respect your privacy. All calculator calculations
           happen <strong>entirely in your browser</strong>; your input data never leaves your
          device. We do not store, transmit, or process your calculator inputs on our servers.
        </p>

        <h2>What We Do NOT Collect</h2>
        <ul>
          <li>We do <strong>not</strong> collect or store your calculator inputs.</li>
          <li>We do <strong>not</strong> sell, rent, or share your personal information with third parties.</li>
          <li>We do <strong>not</strong> use your data for advertising personalization or profiling.</li>
        </ul>

        <h2>Cookies and Local Storage</h2>
        <p>
          We use <strong>localStorage</strong> in your browser to remember your theme preference
          (light/dark mode) and locale selection. This data stays on your device and is not sent
          to our servers.
        </p>
        <p>
          We use Google Analytics (GA4) to understand aggregate traffic patterns. GA4 uses cookies
          to distinguish unique visitors. You can learn more about Google{'\''}s data practices in
          Google{'\''}s Privacy Policy.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Google Analytics</strong> - anonymized traffic analysis</li>
          <li><strong>EthicalAds</strong> - privacy-focused advertising</li>
          <li><strong>Skimlinks</strong> - affiliate link monetization (some outbound links to retailers and service providers may be affiliate links)</li>
           <li><strong>Neon (PostgreSQL)</strong> - database hosting for user accounts and saved calculations (currently dormant; sign-in is disabled)</li>
        </ul>

        <h2>Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, delete, or
          port your personal data. To exercise these rights, contact us at{" "}
          <a href="mailto:legal@saastainednumbers.com" className="text-brand-600 dark:text-brand-400 hover:underline">legal@saastainednumbers.com</a>.
          We will respond within the timeframe required by applicable law.
        </p>

        <h2>Data Retention</h2>
        <p>
          We do not retain personal data beyond what is necessary for the operation of the
          service. Analytics data is retained for 26 months per Google Analytics default settings.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated date.
        </p>
      </div>
    </div>
  );
}
