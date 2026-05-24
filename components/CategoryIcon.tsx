interface Props {
  identifier?: string;
  className?: string;
}

const ICON_MAP: Record<string, string> = {
  revenue: "trending_up",
  "unit-economics": "bar_chart",
  "churn-retention": "sync",
  "growth-efficiency": "rocket_launch",
  "ai-cost": "smart_toy",
  "side-hustle": "work",
  "personal-finance": "account_balance_wallet",
  "general-business": "business",
  "saas-deepen": "layers",
};

export function CategoryIcon({ identifier, className = "" }: Props) {
  const icon = identifier ? ICON_MAP[identifier] : undefined;
  if (!icon) {
    return <span className={`inline-block w-5 h-5 bg-brand-100 rounded ${className}`} />;
  }

  return (
    <span
      className={`material-symbols-outlined inline-flex items-center justify-center leading-none select-none ${className}`}
      style={{ color: "#008387", fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden
    >
      {icon}
    </span>
  );
}
