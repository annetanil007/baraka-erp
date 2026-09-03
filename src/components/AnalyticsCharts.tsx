"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const revenue = [
  { month: "Apr", revenue: 1.18, expenses: 0.72 }, { month: "May", revenue: 1.34, expenses: 0.81 },
  { month: "Jun", revenue: 1.27, expenses: 0.77 }, { month: "Jul", revenue: 1.52, expenses: 0.92 },
  { month: "Aug", revenue: 1.68, expenses: 0.98 }, { month: "Sep", revenue: 1.84, expenses: 1.06 },
];
const exceptions = [
  { name: "Finance", value: 5, color: "#A8483D" }, { name: "Procurement", value: 3, color: "#9B681F" },
  { name: "Inventory", value: 2, color: "#91613D" }, { name: "Operations", value: 2, color: "#47735A" },
];

const tooltipStyle = { border: "1px solid #D9E0E6", borderRadius: 6, fontSize: 12, boxShadow: "0 4px 12px rgba(16,24,40,.08)" };

export default function AnalyticsCharts() {
  return (
    <div className="analytics-grid">
      <div className="card analytics-chart-card">
        <div className="card-header"><div><div className="card-title">Revenue &amp; spend trend</div><div className="card-subtitle">AED millions · last six months</div></div><span className="badge badge-success">+12.4% YoY</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenue} barGap={4}>
          <CartesianGrid stroke="#E8EDF1" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} tickFormatter={(value) => `${value}m`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`AED ${Number(value).toFixed(2)}m`, name === "revenue" ? "Revenue" : "Spend"]} />
          <Bar dataKey="revenue" fill="#91613D" radius={[3, 3, 0, 0]} /><Bar dataKey="expenses" fill="#C7B5A4" radius={[3, 3, 0, 0]} />
        </BarChart></ResponsiveContainer></div>
        <div className="chart-legend"><span><i style={{ background: "#91613D" }} /> Revenue</span><span><i style={{ background: "#C7B5A4" }} /> Spend</span></div>
      </div>
      <div className="card analytics-chart-card">
        <div className="card-header"><div><div className="card-title">Open exceptions by area</div><div className="card-subtitle">Prioritise the work that carries risk</div></div></div>
        <div className="chart-wrap donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={exceptions} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">{exceptions.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer><div className="donut-total"><strong>12</strong><span>open</span></div></div>
        <div className="chart-legend chart-legend-stack">{exceptions.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}<b>{entry.value}</b></span>)}</div>
      </div>
    </div>
  );
}