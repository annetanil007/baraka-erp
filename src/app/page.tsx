import { mockExceptions, mockRecentActivity, mockApprovals } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, Clock3,
  CreditCard, ExternalLink, PackageCheck, Sparkles, WalletCards,
} from "lucide-react";
import Link from "next/link";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { getDashboardData } from "@/lib/dashboard-data";
import CommandTrigger from "@/components/CommandTrigger";

const PRIORITY_COLOR: Record<string, string> = {
  Critical: "critical", High: "high", Medium: "medium", Low: "low",
};

export const dynamic = "force-dynamic";

const actions = [
  { icon: AlertTriangle, tone: "danger", title: "Resolve invoice mismatch", detail: "PO-2026-00441 is AED 10,000 above approval.", href: "/control/exceptions/EX-2026-00184", label: "Review now" },
  { icon: PackageCheck, tone: "warning", title: "Replenish Industrial Filter", detail: "Only 4 days of cover remain at current demand.", href: "/operations/inventory", label: "Plan order" },
  { icon: CreditCard, tone: "info", title: "Approve supplier invoice", detail: "3 invoices are waiting for finance review.", href: "/finance/invoices", label: "Open queue" },
];

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  const insights = [
    { label: "Gross margin", value: "AED 1.90M", change: "+8.6%", note: "vs. last month", direction: "up" },
    { label: "Capital in inventory", value: "AED 4.26M", change: "AED 184K", note: "slow-moving", direction: "down" },
    { label: "Receivables due", value: formatCurrency(dashboardData.receivablesDue), change: "live balance", note: "needs follow-up", direction: "down" },
  ];
  const topExceptions = mockExceptions.slice(0, 3);
  const pendingApprovals = mockApprovals.filter((a) => a.status === "Pending").slice(0, 3);
  const lowStock = dashboardData.stockWatch;

  return (
    <div className="owner-dashboard">
      <section className="owner-hero">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> Owner command center</div>
          <h2 className="page-title">Good morning, Finance Manager</h2>
          <p className="page-description">Here&apos;s what deserves your attention across Baraka today.</p>
        </div>
        <div className="owner-hero-actions">
          <CommandTrigger />
          <Link className="btn btn-primary btn-sm" href="/operations/sales">New sale <ArrowUpRight size={13} /></Link>
        </div>
      </section>

      <section className="business-pulse">
        <div className="pulse-copy">
          <span className="pulse-label">Business pulse · {dashboardData.source === "demo" ? "Demo workspace" : "Live workspace"}</span>
          <strong>Healthy momentum, with 3 decisions waiting.</strong>
          <span className="pulse-note">Revenue is ahead of yesterday while inventory risk is concentrated in 2 parts.</span>
        </div>
        <div className="pulse-score"><span>Operating health</span><strong>82<span>/100</span></strong><div className="score-bar"><i /></div></div>
        <div className="pulse-status"><span className="pulse-dot" /><div><strong>All systems operational</strong><span>Synced 10:42 · Head Office</span></div></div>
      </section>

      <div className="owner-kpi-grid">
        <div className="owner-kpi owner-kpi-featured"><div className="kpi-label">Today&apos;s revenue</div><strong>{formatCurrency(dashboardData.todaysRevenue)}</strong><span className={dashboardData.revenueChange >= 0 ? "kpi-trend-up" : "kpi-trend-down"}>{dashboardData.revenueChange >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {Math.abs(dashboardData.revenueChange)}% vs yesterday</span><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
        {insights.map((insight) => <div className="owner-kpi" key={insight.label}><div className="kpi-label">{insight.label}</div><strong>{insight.value}</strong><span className={insight.direction === "up" ? "kpi-trend-up" : "kpi-trend-down"}>{insight.direction === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {insight.change} <em>{insight.note}</em></span></div>)}
      </div>

      <div className="owner-section-heading"><div><div className="section-kicker">Your next best actions</div><h3>Move the business forward</h3></div><span className="owner-section-count">3 recommended</span></div>
      <section className="action-grid">
        {actions.map((action) => <Link className="action-card" href={action.href} key={action.title}><div className={`action-icon ${action.tone}`}><action.icon size={16} /></div><div className="action-content"><strong>{action.title}</strong><span>{action.detail}</span><b>{action.label} <ArrowUpRight size={12} /></b></div></Link>)}
      </section>

      <div className="owner-main-grid">
        <div className="card">
          <div className="card-header"><div><div className="card-title">Business signals</div><div className="card-subtitle">The numbers behind today&apos;s decisions</div></div><Link href="/reports/financial" className="text-link">View reports <ExternalLink size={12} /></Link></div>
          <div className="signal-list">
            <div className="signal-row"><div className="signal-icon positive"><WalletCards size={15} /></div><div><strong>Cash coverage is comfortable</strong><span>Expected collections cover the next 21 days of commitments.</span></div><b className="signal-positive">+21 days</b></div>
            <div className="signal-row"><div className="signal-icon warning"><Boxes size={15} /></div><div><strong>Inventory is tying up capital</strong><span>12 products have not moved in more than 60 days.</span></div><b className="signal-warning">AED 184K</b></div>
            <div className="signal-row"><div className="signal-icon neutral"><PackageCheck size={15} /></div><div><strong>Supplier costs are shifting</strong><span>Hydraulic Pump 5HP purchase cost increased 8% this month.</span></div><b className="signal-neutral">+8%</b></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Stock watch</div><div className="card-subtitle">Products most likely to interrupt sales</div></div><Link href="/operations/inventory" className="text-link">All inventory <ExternalLink size={12} /></Link></div>
          <div className="stock-watch">{lowStock.map((item) => <div className="stock-row" key={item.id}><div className="stock-thumb"><Boxes size={14} /></div><div><strong>{item.name}</strong><span>{item.stock} {item.unit} left · {item.daysUntilShortfall ?? "—"} days cover</span></div><span className={`badge ${item.status === "Critical" ? "badge-danger" : "badge-warning"}`}>{item.status}</span></div>)}</div>
        </div>
      </div>

      <AnalyticsCharts />

      <div className="owner-bottom-grid">
        <div className="card"><div className="card-header"><div><div className="card-title"><AlertTriangle size={15} style={{ color: "var(--color-danger)", marginRight: 7, verticalAlign: "-2px" }} />Requires attention</div><div className="card-subtitle">Exceptions with financial or operational impact</div></div><Link href="/control/exceptions" className="text-link">View all <ExternalLink size={12} /></Link></div><div className="card-body owner-list-body">{topExceptions.map((ex) => <div key={ex.id} className="attention-item"><div className={`attention-dot ${PRIORITY_COLOR[ex.priority] ?? "low"}`} /><div style={{ flex: 1 }}><div className="attention-title">{ex.summary}</div><div className="attention-meta">{ex.area} · {ex.id}</div></div><span className={`badge ${ex.priority === "Critical" || ex.priority === "High" ? "badge-danger" : "badge-warning"}`}>{ex.priority}</span></div>)}</div></div>
        <div className="card"><div className="card-header"><div><div className="card-title"><Clock3 size={14} style={{ marginRight: 7, verticalAlign: "-2px" }} />Latest activity</div><div className="card-subtitle">A live view of your operation</div></div></div><div className="card-body owner-list-body">{mockRecentActivity.slice(0, 4).map((activity) => <div className="activity-row" key={`${activity.time}-${activity.action}`}><span>{activity.time}</span><div><strong>{activity.action}</strong><small>{activity.area} · {activity.user}</small></div></div>)}</div></div>
        <div className="card"><div className="card-header"><div><div className="card-title">Approval queue</div><div className="card-subtitle">Value waiting for a decision</div></div><Link href="/control/approvals" className="text-link">Open queue <ExternalLink size={12} /></Link></div><div className="card-body owner-list-body">{pendingApprovals.map((approval) => <div className="approval-row" key={approval.id}><div><strong>{approval.type}</strong><small>{approval.reference}</small></div><b>{formatCurrency(approval.amount)}</b></div>)}</div></div>
      </div>
    </div>
  );
}
