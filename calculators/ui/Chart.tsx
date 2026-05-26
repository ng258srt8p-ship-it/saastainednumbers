"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface ChartProps {
  type: "bar" | "line" | "area";
  title: string;
  data: Record<string, unknown>[];
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export function Chart({ type, title, data, dataKey, xAxisKey, color = "#3b82f6" }: ChartProps) {
  if (!data || data.length === 0) return null;

  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const gridStroke = isDark ? "#374151" : "#f0f0f0";
  const tickStroke = isDark ? "#6b7280" : "#9ca3af";

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke={tickStroke} />
            <YAxis tick={{ fontSize: 12 }} stroke={tickStroke} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke={tickStroke} />
            <YAxis tick={{ fontSize: 12 }} stroke={tickStroke} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke={tickStroke} />
            <YAxis tick={{ fontSize: 12 }} stroke={tickStroke} />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.1} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
