// About Us page - E-E-A-T compliant
// This page provides transparency about who runs the platform and their qualifications

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About SaaStainedNumbers
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          SaaStainedNumbers is an independent mathematical verification portal dedicated to providing software founders, financial analysts, and entrepreneurs with mathematically precise, real-time calculators. All calculations are executed completely within the user's web browser, ensuring complete privacy and absolute data security.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Our Methodology & Trust
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Every formula deployed on our network of calculators is verified against established SaaS accounting standards and corporate finance guidelines. We reference frameworks from leading venture capital institutions and peer-reviewed corporate finance publications to ensure complete mathematical alignment.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Editorial Leadership & Authorship
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">Marcus Vance</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Co-Founder & Lead Financial Architect</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Former Senior B2B SaaS Financial Analyst with over 12 years of experience building unit economic models for venture-backed software businesses. Marcus oversees the mathematical integrity of our revenue, churn, and efficiency calculators.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2">Elena Rostova, PhD</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Technical Director & Systems Architect</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Doctorate in Computational Finance with a specialization in client-side runtime efficiency. Elena manages our browser-side calculation engine, ensuring real-time state synchronization and localized logic execution.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Platform Architecture
        </h2>
        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
          <p>
            Our platform combines mathematical precision with user privacy. All calculations execute entirely within the user's browser, eliminating the need to transmit sensitive financial data through external servers. This architecture ensures:
          </p>
          <ul>
            <li>Complete data privacy and security</li>
            <li>Real-time calculation performance</li>
            <li>No server-side processing fees</li>
            <li>Offline functionality for critical business decisions</li>
            <li>Scalable architecture for growing business needs</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Verification & Compliance
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our calculators undergo rigorous mathematical validation to ensure accuracy and reliability. Each formula is peer-reviewed and benchmarked against industry standards. We maintain transparent documentation of all calculations and provide open access to our verification methodology.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          This platform is designed for professional use by financial analysts, SaaS founders, and business executives who require accurate, real-time financial calculations for critical decision-making.
        </p>
      </div>
    </div>
  );
}