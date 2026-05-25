import { getAffiliatesByCategory } from "@/lib/affiliates";

interface AffiliateToolsProps {
  category: string;
}

export function AffiliateTools({ category }: AffiliateToolsProps) {
  const tools = getAffiliatesByCategory(category);
  if (tools.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
      <h3 className="font-heading text-lg font-semibold">Recommended Tools</h3>
      <p className="mt-1 text-sm text-gray-500">
        These tools help you track and improve the metrics you just calculated.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.signupUrl || tool.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-lg border border-gray-200 bg-white p-3 text-sm hover:shadow-sm transition-shadow"
          >
            <span className="font-medium text-gray-900">{tool.name}</span>
            <p className="mt-0.5 text-gray-500">{tool.description}</p>
            {tool.commission !== "N/A (referral)" && (
              <span className="mt-1 inline-block text-xs text-amber-600">
                Affiliate • {tool.commission}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
