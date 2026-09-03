"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ReportChartsProps = { variant: "operational" | "financial" | "inventory" };
type ReportPoint = { month: string; [metric: string]: string | number };

const data: Record<ReportChartsProps["variant"], ReportPoint[]> = {
  operational: [
    { month: "Apr", orders: 982, fulfilment: 93.1 }, { month: "May", orders: 1048, fulfilment: 94.2 },
    { month: "Jun", orders: 1104, fulfilment: 95.0 }, { month: "Jul", orders: 1168, fulfilment: 95.6 },
    { month: "Aug", orders: 1210, fulfilment: 96.1 }, { month: "Sep", orders: 1284, fulfilment: 96.8 },
  ],
  financial: [
    { month: "Apr", revenue: 1.18, expenses: 0.72 }, { month: "May", revenue: 1.34, expenses: 0.81 },
    { month: "Jun", revenue: 1.27, expenses: 0.77 }, { month: "Jul", revenue: 1.52, expenses: 0.92 },
    { month: "Aug", revenue: 1.68, expenses: 0.98 }, { month: "Sep", revenue: 1.84, expenses: 1.06 },
  ],
  inventory: [
    { month: "Apr", value: 3.62, coverage: 24 }, { month: "May", value: 3.76, coverage: 25 },
    { month: "Jun", value: 3.94, coverage: 26 }, { month: "Jul", value: 4.08, coverage: 27 },
    { month: "Aug", value: 4.16, coverage: 27 }, { month: "Sep", value: 4.20, coverage: 28 },
  ],
};

const copy = {
  operational: { title: "Monthly operations", subtitle: "Order volume and fulfilment performance", left: "orders", right: "fulfilment", leftName: "Orders", rightName: "Fulfilment %", leftColor: "#91613D", rightColor: "#47735A" },
  financial: { title: "Monthly financial performance", subtitle: "Revenue and operating expenses in AED millions", left: "revenue", right: "expenses", leftName: "Revenue", rightName: "Expenses", leftColor: "#91613D", rightColor: "#9B681F" },
  inventory: { title: "Monthly inventory position", subtitle: "Inventory value and stock coverage", left: "value", right: "coverage", leftName: "Value (AED m)", rightName: "Coverage (days)", leftColor: "#91613D", rightColor: "#47735A" },
} as const;

export default function ReportCharts({ variant }: ReportChartsProps) {
  const config = copy[variant];
  return <div className="card report-chart-card">
    <div className="card-header"><div><div className="card-title">{config.title}</div><div className="card-subtitle">{config.subtitle} · hover a point for monthly detail</div></div><span className="badge badge-info">Apr–Sep 2026</span></div>
    <div className="chart-wrap report-chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={data[variant]} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
      <CartesianGrid stroke="#E8EDF1" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} /><YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} /><YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} />
      <Tooltip contentStyle={{ border: "1px solid #D9E0E6", borderRadius: 6, fontSize: 12 }} labelStyle={{ color: "#18212A", fontWeight: 600 }} formatter={(value, name) => [variant === "financial" || variant === "inventory" && name === "value" ? `AED ${Number(value).toFixed(2)}m` : variant === "operational" && name === "fulfilment" ? `${value}%` : `${value}`, name === config.left ? config.leftName : config.rightName]} />
      <Line yAxisId="left" type="monotone" dataKey={config.left} name={config.left} stroke={config.leftColor} strokeWidth={2.5} dot={{ r: 4, fill: config.leftColor, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} /><Line yAxisId="right" type="monotone" dataKey={config.right} name={config.right} stroke={config.rightColor} strokeWidth={2.5} dot={{ r: 4, fill: config.rightColor, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
    </LineChart></ResponsiveContainer></div>
    <div className="chart-legend"><span><i style={{ background: config.leftColor }} />{config.leftName}</span><span><i style={{ background: config.rightColor }} />{config.rightName}</span></div>
  </div>;
}