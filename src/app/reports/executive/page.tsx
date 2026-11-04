import Link from "next/link";
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Boxes, BrainCircuit, Building2,
  CircleAlert, ExternalLink, Sparkles, WalletCards,
} from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const branches = [
  { name: "Head Office", revenue: 1240000, margin: "27.8%", inventory: 1840000, trend: "+9.4%", tone: "positive" },
  { name: "Dubai Service", revenue: 862000, margin: "24.1%", inventory: 1260000, trend: "+4.1%", tone: "positive" },
  { name: "Abu Dhabi", revenue: 618000, margin: "19.6%", inventory: 1160000, trend: "-2.8%", tone: "negative" },
];

export default async function ExecutiveIntelligencePage() {
  const dashboardData = await getDashboardData();
  const sourceLabel = dashboardData.source === "demo" ? "Demo workspace · illustrative figures" : "Live workspace · Supabase metrics";
  const revenueChange = dashboardData.revenueChange >= 0;
  const summary = revenueChange
    ? `Revenue is ${dashboardData.revenueChange}% ahead of yesterday, but ${formatCurrency(184000)} remains tied up in slow-moving inventory. The clearest owner action is to protect cash by converting excess stock and following up on ${formatCurrency(dashboardData.receivablesDue)} in receivables.`
    : `Revenue is ${Math.abs(dashboardData.revenueChange)}% below yesterday. Protect liquidity by accelerating collections, pausing non-essential purchasing, and reviewing the inventory categories with the lowest sell-through.`;

  return (
    <div className="executive-intelligence">
      <div className="page-header executive-header">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> Executive intelligence</div>
          <h2 className="page-title">The business, explained</h2>
          <p className="page-description">A daily decision brief for owners and leadership teams.</p>
        </div>
        <span className="executive-source">{sourceLabel}</span>
      </div>

      <section className="executive-briefing">
        <div className="executive-briefing-icon"><BrainCircuit size={20} /></div>
        <div><span className="section-kicker">Daily business briefing · 05 Nov 2026</span><h3>{summary}</h3><p>Generated from revenue, receivables, inventory and approval signals currently available to Baraka.</p></div>
      </section>

      <div className="executive-grid executive-kpis">
        <div className="executive-kpi executive-kpi-featured"><span>Revenue vs yesterday</span><strong>{revenueChange ? "+" : "-"}{Math.abs(dashboardData.revenueChange)}%</strong><small>{formatCurrency(dashboardData.todaysRevenue)} booked today</small><span className="executive-trend"><ArrowUpRight size={13} /> Momentum is {revenueChange ? "positive" : "softening"}</span></div>
        <div className="executive-kpi"><span>Cash-risk warning</span><strong>{formatCurrency(dashboardData.receivablesDue)}</strong><small>Receivables needing follow-up</small><b className="executive-warning"><CircleAlert size={13} /> Collection priority</b></div>
        <div className="executive-kpi"><span>Capital in inventory</span><strong>{formatCurrency(4260000)}</strong><small>{formatCurrency(184000)} slow-moving exposure</small><b className="executive-warning"><Boxes size={13} /> Release working capital</b></div>
        <div className="executive-kpi"><span>Operating health</span><strong>82<span>/100</span></strong><small>Across control and operations</small><b className="executive-positive"><ArrowUpRight size={13} /> Stable</b></div>
      </div>

      <div className="executive-main-grid">
        <section className="card">
          <div className="card-header"><div><div className="card-title">What changed since yesterday?</div><div className="card-subtitle">The movements most likely to affect decisions</div></div><Link href="/" className="text-link">Command center <ExternalLink size={12} /></Link></div>
          <div className="change-list">
            <div className="change-item"><div className="change-icon positive"><ArrowUpRight size={15} /></div><div><strong>Sales momentum improved</strong><span>Approved revenue moved {dashboardData.revenueChange >= 0 ? "ahead" : "below"} yesterday&apos;s pace.</span></div><b className={revenueChange ? "executive-positive" : "executive-danger"}>{revenueChange ? "+" : "-"}{Math.abs(dashboardData.revenueChange)}%</b></div>
            <div className="change-item"><div className="change-icon warning"><WalletCards size={15} /></div><div><strong>Cash conversion needs attention</strong><span>Receivables are the largest near-term source of liquidity improvement.</span></div><b className="executive-warning">{formatCurrency(dashboardData.receivablesDue)}</b></div>
            <div className="change-item"><div className="change-icon danger"><Boxes size={15} /></div><div><strong>Margin leakage is concentrated in stock</strong><span>Slow-moving products are carrying cost without contributing current sales.</span></div><b className="executive-danger">{formatCurrency(184000)}</b></div>
          </div>
        </section>

        <section className="card executive-explanation-card">
          <div className="card-header"><div><div className="card-title">Margin-loss explanation</div><div className="card-subtitle">Why profitability is under pressure</div></div><BarChart3 size={16} className="executive-muted" /></div>
          <div className="explanation-score"><strong>27.8%</strong><span>estimated gross margin</span></div>
          <ul className="executive-reasons"><li><b>+8%</b><span>purchase cost increase on Hydraulic Pump 5HP</span></li><li><b>{formatCurrency(184000)}</b><span>capital exposed to stock older than 60 days</span></li><li><b>3</b><span>approval decisions delaying purchasing velocity</span></li></ul>
          <Link className="btn btn-secondary btn-sm" href="/finance/cogs">Review COGS drivers <ExternalLink size={12} /></Link>
        </section>
      </div>

      <section className="card branch-comparison">
        <div className="card-header"><div><div className="card-title"><Building2 size={15} style={{ marginRight: 7, verticalAlign: "-2px" }} />Branch comparison</div><div className="card-subtitle">Performance and capital allocation across operating locations</div></div><Link href="/admin/branches" className="text-link">Manage branches <ExternalLink size={12} /></Link></div>
        <div className="table-container"><table className="data-table"><thead><tr><th>Branch</th><th>Revenue</th><th>Gross margin</th><th>Inventory capital</th><th>Change</th><th>Owner read</th></tr></thead><tbody>{branches.map((branch) => <tr key={branch.name}><td><strong>{branch.name}</strong></td><td>{formatCurrency(branch.revenue)}</td><td><strong>{branch.margin}</strong></td><td>{formatCurrency(branch.inventory)}</td><td><span className={branch.tone === "positive" ? "executive-positive" : "executive-danger"}>{branch.tone === "positive" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {branch.trend}</span></td><td><span className={`badge ${branch.tone === "positive" ? "badge-success" : "badge-warning"}`}>{branch.tone === "positive" ? "Scale carefully" : "Review mix"}</span></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
