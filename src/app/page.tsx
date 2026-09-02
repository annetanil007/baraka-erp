import { mockKPIs, mockExceptions, mockRecentActivity, mockApprovals } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

const PRIORITY_COLOR: Record<string, string> = {
  Critical: "critical", High: "high", Medium: "medium", Low: "low",
};

export default function DashboardPage() {
  const topExceptions = mockExceptions.slice(0, 5);
  const pendingApprovals = mockApprovals.filter((a) => a.status === "Pending");

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h2 className="page-title">Operational Overview</h2>
        <p className="page-description">
          Summary of current operational status, exceptions and pending actions.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label">Open Exceptions</div>
          <div className="kpi-value" style={{ color: "var(--color-danger)" }}>
            {mockKPIs.openExceptions}
          </div>
          <div className="kpi-sub">
            <Link href="/control/exceptions" style={{ color: "var(--color-accent)", fontSize: 12 }}>
              View all exceptions →
            </Link>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Pending Approvals</div>
          <div className="kpi-value" style={{ color: "var(--color-warning)" }}>
            {mockKPIs.pendingApprovals}
          </div>
          <div className="kpi-sub">
            <Link href="/control/approvals" style={{ color: "var(--color-accent)", fontSize: 12 }}>
              Review approvals →
            </Link>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Today's Revenue</div>
          <div className="kpi-value">{formatCurrency(mockKPIs.todaysRevenue)}</div>
          <div className="kpi-sub">
            <span className="kpi-trend-up" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12 }}>
              <ArrowUpRight size={12} />
              +{mockKPIs.revenueChange}% vs yesterday
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Inventory Alerts</div>
          <div className="kpi-value" style={{ color: "var(--color-warning)" }}>
            {mockKPIs.inventoryAlerts}
          </div>
          <div className="kpi-sub">
            <Link href="/operations/inventory" style={{ color: "var(--color-accent)", fontSize: 12 }}>
              View inventory →
            </Link>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Open Purchase Orders</div>
          <div className="kpi-value">{mockKPIs.openPOs}</div>
          <div className="kpi-sub">
            <Link href="/procurement/orders" style={{ color: "var(--color-accent)", fontSize: 12 }}>
              View orders →
            </Link>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Reconciliation Items</div>
          <div className="kpi-value" style={{ color: "var(--color-info)" }}>
            {mockKPIs.reconciliationItems}
          </div>
          <div className="kpi-sub">
            <Link href="/control/reconciliation" style={{ color: "var(--color-accent)", fontSize: 12 }}>
              View reconciliation →
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column main area */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>

        {/* Requires Attention */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={15} style={{ color: "var(--color-danger)" }} />
                Requires Attention
              </div>
              <div className="card-subtitle">Active exceptions requiring action</div>
            </div>
            <Link href="/control/exceptions" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: "0 20px" }}>
            {topExceptions.map((ex) => (
              <div key={ex.id} className="attention-item">
                <div className={`attention-dot ${PRIORITY_COLOR[ex.priority] ?? "low"}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                    <div className="attention-title">{ex.summary}</div>
                    <span className={`badge ${
                      ex.priority === "Critical" ? "priority-critical" :
                      ex.priority === "High" ? "priority-high" :
                      ex.priority === "Medium" ? "priority-medium" : "priority-low"
                    }`}>
                      {ex.priority}
                    </span>
                  </div>
                  <div className="attention-meta">
                    {ex.area} · {ex.id} · {ex.status}
                  </div>
                </div>
                <Link href={`/control/exceptions/${ex.id}`}
                  style={{ color: "var(--color-accent)", fontSize: 12, whiteSpace: "nowrap", marginLeft: 8 }}>
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Pending Approvals */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Pending Approvals</div>
              <Link href="/control/approvals" style={{ fontSize: 12, color: "var(--color-accent)" }}>
                View All
              </Link>
            </div>
            <div className="card-body" style={{ padding: "0 20px" }}>
              {pendingApprovals.map((apr) => (
                <div key={apr.id} className="attention-item">
                  <div style={{ flex: 1 }}>
                    <div className="attention-title">{apr.type}</div>
                    <div className="attention-meta">{apr.reference} · {apr.requestedBy}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {formatCurrency(apr.amount)}
                    </div>
                    <span className={`badge ${
                      apr.riskLevel === "High" || apr.riskLevel === "Critical" ? "badge-danger" :
                      apr.riskLevel === "Elevated" || apr.riskLevel === "Medium" ? "badge-warning" : "badge-muted"
                    }`} style={{ marginTop: 4 }}>
                      {apr.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="card-title">
                <Clock size={14} style={{ display: "inline", marginRight: 6 }} />
                Recent Activity
              </div>
            </div>
            <div className="card-body" style={{ padding: "8px 20px" }}>
              {mockRecentActivity.map((act, i) => (
                <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 500, width: 36, flexShrink: 0, paddingTop: 1 }}>
                    {act.time}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{act.action}</div>
                    <div style={{ fontSize: 11.5, color: "var(--color-text-muted)", marginTop: 2 }}>
                      {act.area} · {act.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
