// Contact Us page - E-E-A-T compliant
// This page provides clear contact pathways for different types of inquiries

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have questions regarding our calculator mathematical logic, API integrations, or business partnerships? Reach out to our specialized teams directly below.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-2">General Inquiries & Suggestions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">For general support, feedback on calculators, or partnership opportunities</p>
          <a 
            href="mailto:hello@saastainednumbers.com" 
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            hello@saastainednumbers.com
          </a>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-2">Affiliate & Sponsorship Inquiries</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">For advertising integrations, API partnerships, or business associations</p>
          <a 
            href="mailto:hello@saastainednumbers.com" 
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            hello@saastainednumbers.com
          </a>
        </div>

        <div className="pb-6">
          <h2 className="text-xl font-semibold mb-2">Legal & Data Rights</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">For questions regarding GDPR, California Consumer Privacy Act (CCPA), or cookie opt-out requests</p>
          <a 
            href="mailto:legal@saastainednumbers.com" 
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            legal@saastainednumbers.com
          </a>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Response Time Guarantee
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          We strive to respond to all inquiries within 48 hours during business days. For urgent matters, please indicate this in your email subject line.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Our support teams are available to assist with calculator usage, technical integration, business partnerships, and compliance questions.
        </p>
      </div>
    </div>
  );
}