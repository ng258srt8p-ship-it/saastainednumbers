import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal  —  SaaStainedNumbers",
  description:
    "Disclaimer, privacy policy, terms of service, and other legal information for SaaStainedNumbers calculators.",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        Legal
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Disclaimer, privacy policy, terms of service, and other legal information.
      </p>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

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

      {/* Privacy Policy */}
      <section id="privacy" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          Privacy Policy
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Last updated: May 26, 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>Our Commitment to Privacy</h3>
          <p>
            SaaStainedNumbers is designed to respect your privacy. All calculator calculations
            happen <strong>entirely in your browser</strong> — your input data never leaves your
            device. We do not store, transmit, or process your calculator inputs on our servers.
          </p>

          <h3>What We Do NOT Collect</h3>
          <ul>
            <li>We do <strong>not</strong> collect or store your calculator inputs.</li>
            <li>We do <strong>not</strong> sell, rent, or share your personal information with third parties.</li>
            <li>We do <strong>not</strong> use your data for advertising personalization or profiling.</li>
          </ul>

          <h3>Cookies and Local Storage</h3>
          <p>
            We use <strong>localStorage</strong> in your browser to remember your theme preference
            (light/dark mode). This data stays on your device and is not sent to our servers. See our{" "}
            <a href="#cookies" className="text-brand-600 dark:text-brand-400 hover:underline">Cookie Policy</a> for details.
          </p>

          <h3>Third-Party Services</h3>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Neon (PostgreSQL)</strong> — database hosting for user accounts and saved calculations (currently dormant — sign-in is disabled).</li>
          </ul>

          <h3>Your Rights</h3>
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, delete, or
            port your personal data. To exercise these rights, contact us at the email address
            below. We will respond within the timeframe required by applicable law.
          </p>

          <h3>Data Retention</h3>
          <p>
            We do not retain any personal data. All calculator calculations happen entirely in your
            browser and are never stored on our servers.
          </p>
        </div>
      </section>

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Terms of Service */}
      <section id="terms" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          Terms of Service
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Last updated: May 26, 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <h3>Acceptance of Terms</h3>
          <p>
            By accessing or using SaaStainedNumbers, you agree to be bound by these Terms of
            Service. If you do not agree, do not use the website.
          </p>

          <h3>Description of Service</h3>
          <p>
            SaaStainedNumbers provides free, browser-based financial and business calculators for
            informational and educational purposes. All calculations are performed client-side. No
            account is required to use the calculators.
          </p>

          <h3>User Responsibilities</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use SaaStainedNumbers for any unlawful purpose or in violation of any applicable law.</li>
            <li>Scrape, crawl, or otherwise automatically extract data from the website.</li>
            <li>Interfere with the operation of the website or attempt to circumvent its security.</li>
            <li>Misrepresent calculator results as your own or as professional advice.</li>
            <li>Use the website in a way that could damage, disable, or impair our infrastructure.</li>
          </ul>

          <h3>Intellectual Property</h3>
          <p>
            All content, calculators, tools, design, logos, and code on SaaStainedNumbers are the
            property of SaaStainedNumbers unless otherwise noted. You may not reproduce, distribute,
            modify, or create derivative works without prior written permission. Calculator results
            generated by you are yours to use freely.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, SaaStainedNumbers and its operators shall not
            be liable for any direct, indirect, incidental, consequential, or punitive damages
            arising from or related to your use of the website, including but not limited to
            financial losses, business decisions, or lost profits based on calculator results or
            content.
          </p>

          <h3>Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless SaaStainedNumbers and its operators from any
            claims, damages, liabilities, costs, or expenses (including reasonable legal fees)
            arising from your use of the website or violation of these terms.
          </p>

          <h3>Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Changes are effective
            immediately upon posting. Your continued use after changes constitutes acceptance of
            the new terms.
          </p>

          <h3>Governing Law</h3>
          <p>
            These terms are governed by the laws of Ontario, Canada and the federal laws of Canada
            applicable therein. Any disputes shall be resolved in the courts of Ontario, Canada.
          </p>

          <h3>Severability</h3>
          <p>
            If any provision of these terms is found to be unenforceable, the remaining provisions
            shall remain in full force and effect.
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
            preference (light/dark mode). This data never leaves your device and is not accessible
            to our servers or third parties.
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
            <li>Reverse engineering, decompiling, or attempting to extract the source code of calculators.</li>
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

      <hr className="my-10 border-gray-200 dark:border-gray-700" />

      {/* Contact */}
      <section id="contact" className="scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
          Contact
        </h2>

        <div className="prose prose-gray dark:prose-invert max-w-none mt-6">
          <p>
            If you have questions about these policies, wish to exercise your data rights, or need
            to report a legal concern, please contact us at:
          </p>
          <p>
            <a
              href="mailto:legal@saastainednumbers.com"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              legal@saastainednumbers.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
