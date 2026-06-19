import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Legal - SaaStainedNumbers",
    description:
      "Disclaimer, privacy policy, terms of service, and other legal information for SaaStainedNumbers calculators.",
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
      title: "Legal - SaaStainedNumbers",
      description:
        "Disclaimer, privacy policy, terms of service, and other legal information for SaaStainedNumbers calculators.",
      type: "website",
      images: ["/api/og?title=Legal"],
      siteName: "SaaStainedNumbers",
    },
  };
}

const sections = [
  {
    id: "disclaimer",
    title: "Disclaimer",
    href: "/legal#disclaimer",
    description: "Not financial, legal, or professional advice. Calculator results are for informational purposes only.",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    href: "/privacy",
     description: "How we handle your data. All calculations happen in your browser, nothing is stored on our servers.",
  },
  {
    id: "terms",
    title: "Terms of Service",
    href: "/terms",
    description: "The rules governing your use of SaaStainedNumbers calculators and content.",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    href: "/legal#cookies",
    description: "How we use localStorage and cookies for theme preferences and analytics.",
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    href: "/legal#acceptable-use",
    description: "Guidelines for embedding calculators and using the service responsibly.",
  },
  {
    id: "contact",
    title: "Contact",
    href: "/contact",
    description: "Get in touch with us for questions, feedback, or legal inquiries.",
  },
];

export default function LegalPage() {
  return (
    <div className="mobbin-section"><div className="max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        Legal
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Disclaimer, privacy policy, terms of service, and other legal information.
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
            Disclaimer
          </h2>
          <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
            Last updated: May 26, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h3>Not Financial, Legal, or Professional Advice</h3>
          <p>
            The calculators, tools, content, benchmarks, and insights provided on SaaStainedNumbers
            are for <strong>informational and educational purposes only</strong>. They are not
            intended to be, and must not be taken as, financial advice, legal advice, tax advice,
            investment advice, accounting advice, or any other form of professional advice.
          </p>
          <p>
            You should <strong>not</strong> rely on any information obtained through SaaStainedNumbers
            to make financial, business, investment, legal, or other decisions. Always consult a
            qualified professional (such as a certified financial planner, accountant, or attorney)
            who understands your specific situation before making any decision that could have
            financial, legal, or tax consequences.
          </p>

          <h3>No Guarantee of Accuracy</h3>
          <p>
            While we strive to ensure that all calculators, formulas, benchmarks, and content are
            accurate and up to date, we make <strong>no representations or warranties</strong> of
            any kind, express or implied, about the completeness, accuracy, reliability, suitability,
            or availability of any information, products, services, or related graphics on
            SaaStainedNumbers. Calculator results are based on the inputs you provide and may not
            reflect real-world outcomes.
          </p>

          <h3>Use at Your Own Risk</h3>
          <p>
            You use SaaStainedNumbers and its results <strong>entirely at your own risk</strong>.
            In no event will SaaStainedNumbers, its operators, contributors, or affiliates be liable
            for any loss or damage (including without limitation indirect or consequential loss or
            damage) arising from your use of, or reliance on, any information or results obtained
            through this website.
          </p>

          <h3>Benchmarks and Industry Data</h3>
          <p>
            Any benchmarks, industry averages, or reference data presented on SaaStainedNumbers are
            for general illustrative purposes. They are based on publicly available sources and may
            not reflect current market conditions, your specific industry, or your business&apos;s
            performance. Past performance does not guarantee future results.
          </p>

          <h3>Embedded Calculators</h3>
          <p>
            Third-party websites that embed SaaStainedNumbers calculators are solely responsible for
            how those calculators are presented and used. We make no representations about the
            accuracy or suitability of calculator results displayed on third-party sites and accept
            no liability for their use.
          </p>

          <h3>No Guarantee of Availability</h3>
          <p>
            We reserve the right to modify, suspend, or discontinue any calculator, tool, or feature
            at any time without notice. We are not liable for any unavailability of the service.
          </p>
        </div>
      </section>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Cookie Policy */}
      <section id="cookies" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cookie Policy
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Last updated: May 26, 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>What Are Cookies</h3>
          <p>
            Cookies are small text files stored on your device by your browser. They are commonly
            used to remember preferences, distinguish visitors, and analyze usage patterns.
          </p>

          <h3>Local Storage</h3>
          <p>
            We use browser <strong>localStorage</strong> (not cookies) to store your theme
            preference (light/dark mode) and locale selection. This data never leaves your device
            and is not accessible to our servers or third parties.
          </p>

          <h3>Analytics</h3>
          <p>
            We use Google Analytics (GA4) to understand aggregate traffic patterns. GA4 uses cookies
            to distinguish unique visitors. You can opt out of Google Analytics by installing the
            Google Analytics Opt-out Browser Add-on.
          </p>
        </div>
      </section>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Acceptable Use */}
      <section id="acceptable-use" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          Acceptable Use Policy
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Last updated: May 26, 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>Embedded Calculators</h3>
          <p>
            You are welcome to embed SaaStainedNumbers calculators on your website via the embed
            feature. By doing so, you agree to:
          </p>
          <ul>
            <li>Not modify or obscure the SaaStainedNumbers branding displayed within the embed.</li>
            <li>Not misrepresent calculator results as your own or as professional advice.</li>
            <li>Not use the embed for any unlawful purpose.</li>
            <li>Ensure your use of the embed complies with your own privacy policy and applicable laws.</li>
          </ul>

          <h3>Prohibited Uses</h3>
          <p>The following activities are strictly prohibited:</p>
          <ul>
            <li>Automated scraping, crawling, or data extraction of any kind.</li>
            <li>Using the service in a way that could overburden our infrastructure.</li>
            <li>Republishing calculator content or results as a substitute for professional advice.</li>
          </ul>

          <h3>Enforcement</h3>
          <p>
            We reserve the right to block, restrict, or disable access to any user or embed that
            violates this policy, without prior notice.
          </p>
        </div>
      </section>
    </div></div>
  );
}
