"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const cccTrend = [
  { month: "May 2026", dso: 52, dio: 68, dpo: 38, ccc: 82 },
  { month: "Jun 2026", dso: 50, dio: 65, dpo: 36, ccc: 79 },
  { month: "Jul 2026", dso: 49, dio: 64, dpo: 39, ccc: 74 },
  { month: "Aug 2026", dso: 46, dio: 62, dpo: 41, ccc: 67 },
  { month: "Sep 2026", dso: 44, dio: 59, dpo: 40, ccc: 63 },
  { month: "Oct 2026", dso: 42, dio: 56, dpo: 42, ccc: 56 },
];

export default function WorkingCapitalAnalytics() {
  const [selectedCycle, setSelectedCycle] = useState<"standard" | "accelerated">("standard");

  // Key metrics
  const currentDSO = selectedCycle === "standard" ? 44 : 35; // Days Sales Outstanding
  const currentDIO = selectedCycle === "standard" ? 59 : 45; // Days Inventory Outstanding
  const currentDPO = selectedCycle === "standard" ? 40 : 45; // Days Payable Outstanding
  const currentCCC = currentDSO + currentDIO - currentDPO; // Cash Conversion Cycle

  // Working capital metrics
  const totalAR = 1260000; // Accounts Receivable
  const totalInventory = 4260000;
  const totalAP = 980000; // Accounts Payable
  const netWorkingCapital = totalAR + totalInventory - totalAP;

  // Potential cash unlocked if reaching benchmark targets
  const potentialCashRelease = selectedCycle === "standard" ? 485000 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Executive Working Capital Summary Strip */}
      <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-muted) 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <BarChart3 size={14} /> Institutional Working Capital & Liquidity Velocity
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: "var(--color-text-primary)" }}>
              Cash Conversion Cycle: <span style={{ color: currentCCC <= 60 ? "var(--color-success)" : "var(--color-warning)" }}>{currentCCC} Days</span>
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2, maxWidth: 620 }}>
              The time it takes to convert procurement investment back into realized operating cash.
              Formula: <strong>DSO ({currentDSO}d) + DIO ({currentDIO}d) − DPO ({currentDPO}d) = {currentCCC} days</strong>.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>Scenario:</span>
            <button
              type="button"
              className={`btn btn-sm ${selectedCycle === "standard" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCycle("standard")}
            >
              Current Run-Rate
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedCycle === "accelerated" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCycle("accelerated")}
            >
              Target Benchmark
            </button>
          </div>
        </div>

        <div className="divider" style={{ margin: "16px 0" }} />

        {/* The 4 Working Capital Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
          {/* DSO */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>DSO (Sales Outstanding)</span>
              <span className="badge badge-warning">{currentDSO} Days</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totalAR)}</div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 2 }}>
              Aged Receivables · Avg collection delay: 14d
            </div>
          </div>

          {/* DIO */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>DIO (Inventory Holding)</span>
              <span className="badge badge-danger">{currentDIO} Days</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totalInventory)}</div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 2 }}>
              Tied in 1,280 SKUs · Turnover: 6.2x/yr
            </div>
          </div>

          {/* DPO */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>DPO (Payables Outstanding)</span>
              <span className="badge badge-success">{currentDPO} Days</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totalAP)}</div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 2 }}>
              Vendor credit window utilized safely
            </div>
          </div>

          {/* Net Working Capital */}
          <div className="card" style={{ padding: 14, background: "var(--color-surface-muted)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>Net Working Capital</span>
              <ShieldCheck size={14} style={{ color: "var(--color-success)" }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)", marginTop: 6 }}>
              {formatCurrency(netWorkingCapital)}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
              Operating capital buffer: 3.4x monthly burn
            </div>
          </div>
        </div>
      </div>

      {/* Trapped Capital Opportunity Banner */}
      {potentialCashRelease > 0 && (
        <div className="alert-banner warning" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={18} style={{ color: "var(--color-warning)", flexShrink: 0 }} />
            <div>
              <strong>CFO Capital Efficiency Opportunity:</strong> Compressing DSO to 35 days and DIO to 45 days will release{" "}
              <strong>+{formatCurrency(potentialCashRelease)}</strong> in pure non-dilutive liquidity without additional borrowing.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            style={{ flexShrink: 0 }}
            onClick={() => setSelectedCycle("accelerated")}
          >
            Simulate Release Target
          </button>
        </div>
      )}

      {/* Historical Cash Conversion Trend Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Cash Conversion Velocity Trend (Last 6 Months)</div>
            <div className="card-subtitle">Month-over-month contraction in days required to turn inventory into cash</div>
          </div>
          <span className="badge badge-success">Improving (−19 Days)</span>
        </div>
        <div style={{ height: 260, padding: "16px 20px 0 0" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cccTrend} barGap={6}>
              <CartesianGrid stroke="#E8EDF1" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A96A3" }} tickFormatter={(v) => `${v}d`} />
              <Tooltip
                formatter={(val, name) => [
                  `${val} days`,
                  name === "ccc" ? "Net CCC" : name === "dso" ? "DSO (AR)" : name === "dio" ? "DIO (Inventory)" : "DPO (AP)",
                ]}
                contentStyle={{ border: "1px solid #D9E0E6", borderRadius: 6, fontSize: 12 }}
              />
              <Bar dataKey="dso" fill="#91613D" name="dso" radius={[2, 2, 0, 0]} />
              <Bar dataKey="dio" fill="#9B681F" name="dio" radius={[2, 2, 0, 0]} />
              <Bar dataKey="dpo" fill="#C7B5A4" name="dpo" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ccc" fill="#47735A" name="ccc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend" style={{ padding: "8px 20px 16px" }}>
          <span><i style={{ background: "#91613D" }} /> DSO (Receivables)</span>
          <span><i style={{ background: "#9B681F" }} /> DIO (Stock)</span>
          <span><i style={{ background: "#C7B5A4" }} /> DPO (Payables)</span>
          <span><i style={{ background: "#47735A" }} /> <strong>Net Cash Conversion Cycle (CCC)</strong></span>
        </div>
      </div>
    </div>
  );
}
