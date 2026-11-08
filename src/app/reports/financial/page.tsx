"use client";

import { useState } from "react";
import ReportCharts from "@/components/intelligence/ReportCharts";
import WorkingCapitalAnalytics from "@/components/finance/WorkingCapitalAnalytics";
import VatAuditSummary from "@/components/finance/VatAuditSummary";
import { Download, FileText, Landmark, ShieldCheck } from "lucide-react";

export default function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState<"working_capital" | "overview" | "vat">("working_capital");

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)" }}>
            <ShieldCheck size={13} /> Institutional Financial Management
          </div>
          <h2 className="page-title">Financial Intelligence & Compliance</h2>
          <p className="page-description">
            CFO-level cash conversion velocity, automated VAT 201 sub-ledger, and working capital optimization.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-secondary btn-sm">
            <Download size={13} /> Export Financial Package (Excel)
          </button>
        </div>
      </div>

      {/* Institutional Navigation Tabs */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid var(--color-border)", marginBottom: 20 }}>
        <button
          type="button"
          className={`sidebar-item ${activeTab === "working_capital" ? "active" : ""}`}
          style={{ width: "auto", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "8px 16px", color: activeTab === "working_capital" ? "#fff" : "var(--color-text-secondary)" }}
          onClick={() => setActiveTab("working_capital")}
        >
          Working Capital & Cash Conversion Cycle (CCC)
        </button>
        <button
          type="button"
          className={`sidebar-item ${activeTab === "vat" ? "active" : ""}`}
          style={{ width: "auto", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "8px 16px", color: activeTab === "vat" ? "#fff" : "var(--color-text-secondary)" }}
          onClick={() => setActiveTab("vat")}
        >
          VAT Return & Tax Audit (Form 201)
        </button>
        <button
          type="button"
          className={`sidebar-item ${activeTab === "overview" ? "active" : ""}`}
          style={{ width: "auto", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "8px 16px", color: activeTab === "overview" ? "#fff" : "var(--color-text-secondary)" }}
          onClick={() => setActiveTab("overview")}
        >
          P&L / Operating Performance
        </button>
      </div>

      {/* Tab 1: Working Capital & CCC Engine */}
      {activeTab === "working_capital" && (
        <div>
          <WorkingCapitalAnalytics />
        </div>
      )}

      {/* Tab 2: VAT Form 201 Engine */}
      {activeTab === "vat" && (
        <div>
          <VatAuditSummary />
        </div>
      )}

      {/* Tab 3: Overview Charts */}
      {activeTab === "overview" && (
        <div>
          <ReportCharts variant="financial" />
        </div>
      )}
    </div>
  );
}
