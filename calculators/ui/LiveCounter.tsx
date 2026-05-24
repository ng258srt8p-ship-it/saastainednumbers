interface LiveCounterProps {
  count?: number;
  growth?: number;
}

export function LiveCounter({ count = 1234, growth = 38 }: LiveCounterProps) {
  const formatted = new Intl.NumberFormat("en-US").format(count);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-4 py-1.5 text-sm text-brand-200">
      <span className="h-2 w-2 rounded-full bg-green-400" />
      {formatted} calculations this month
      {growth > 0 && <span className="text-green-400">+{growth}%</span>}
    </span>
  );
}
