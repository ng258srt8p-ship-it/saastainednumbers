"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChartDatum {
  label: string;
  scenarioA: number;
  scenarioB: number;
  type: string;
}

interface ComparisonChartProps {
  data: ChartDatum[];
}

function formatVal(val: number, type: string): string {
  switch (type) {
    case "currency": return `$${val.toLocaleString()}`;
    case "percentage": return `${val.toFixed(1)}%`;
    default: return val.toLocaleString();
  }
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<Record<string, unknown>>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const itemType = (payload[0]?.payload as Record<string, string>)?._type ?? "number";
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-gray-200 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-gray-400">
          <span className="font-medium" style={{ color: entry.dataKey === "Scenario A" ? "#008387" : "#143562" }}>{entry.name as string}:</span> {formatVal(entry.value as number, itemType)}
        </p>
      ))}
    </div>
  );
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    name: d.label.length > 20 ? `${d.label.slice(0, 18)}…` : d.label,
    "Scenario A": d.scenarioA,
    "Scenario B": d.scenarioB,
    _type: d.type,
  }));

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-200">Scenario Comparison</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 60)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} width={120} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#D1D5DB" }} />
          <Bar dataKey="Scenario A" fill="#008387" radius={[0, 4, 4, 0]} />
          <Bar dataKey="Scenario B" fill="#143562" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
