"use client";

import { ArrowDownRight, ArrowUpRight, CalendarClock, CircleDollarSign, Download, ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";

const forecast = [
  { week: "This week", opening: 842, inflow: 286, outflow: 198, closing: 930 },
  { week: "14–20 Sep", opening: 930, inflow: 342, outflow: 284, closing: 988 },
  { week: "21–27 Sep", opening: 988, inflow: 216, outflow: 331, closing: 873 },
  { week: "28 Sep–04 Oct", opening: 873, inflow: 390, outflow: 244, closing: 1019 },
];

const commitments = [
  { label: "Supplier payments", detail: "5 invoices · due within 7 days", amount: "AED 198,400", tone: "warning" },
  { label: "Payroll & benefits", detail: "Scheduled · 28 Sep", amount: "AED 146,000", tone: "neutral" },
  { label: "Customer collections", detail: "14 accounts · expected within 14 days", amount: "AED 286,000", tone: "success" },
];

export default function CashFlowPage() {
  return (
    <div className="cash-flow-page">
      <div className="page-header module-header">
        <div>
          <div className="eyebrow"><WalletCards size={13} /> Finance intelligence</div>
          <h2 className="page-title">Cash flow center</h2>
          <p className="page-description">Know what you can spend, what is coming in, and where liquidity needs attention.</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Download size={13} /> Export forecast</button>
      </div>

      <div className="cash-summary-grid">
        <div className="cash-summary-featured"><span>Available cash</span><strong>AED 842,300</strong><small><ArrowUpRight size={13} /> AED 68K vs. last week</small><div className="cash-spark"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <div className="cash-summary-card"><span>Expected collections</span><strong>AED 286K</strong><small className="cash-positive">Due within 14 days</small></div>
        <div className="cash-summary-card"><span>Committed payments</span><strong>AED 198K</strong><small className="cash-warning">Due within 7 days</small></div>
        <div className="cash-summary-card"><span>Safety buffer</span><strong>21 days</strong><small className="cash-positive"><ShieldCheck size={12} /> Comfortable coverage</small></div>
      </div>

      <div className="cash-flow-main-grid">
        <div className="card">
          <div className="card-header"><div><div className="card-title">13-week liquidity outlook</div><div className="card-subtitle">Projected closing cash · AED thousands</div></div><span className="badge badge-success">Above buffer</span></div>
          <div className="forecast-chart">
            {forecast.map((item) => <div className="forecast-column" key={item.week}><div className="forecast-value">{item.closing}</div><div className="forecast-bar-wrap"><div className="forecast-bar" style={{ height: `${Math.max(28, item.closing / 10)}%` }} /></div><strong>{item.week}</strong><span>Opening {item.opening} · +{item.inflow} / -{item.outflow}</span></div>)}
          </div>
          <div className="cash-legend"><span><i className="legend-inflow" /> Expected inflows</span><span><i className="legend-outflow" /> Committed outflows</span><span><i className="legend-buffer" /> Minimum buffer AED 600K</span></div>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Liquidity confidence</div><div className="card-subtitle">Based on current commitments</div></div></div>
          <div className="confidence-body"><div className="confidence-ring"><strong>82</strong><span>/100</span></div><div><strong className="confidence-title">Comfortable</strong><p>Collections are expected to cover upcoming commitments without using the reserve.</p><Link href="/finance/invoices" className="text-link">Review collections <ArrowUpRight size={12} /></Link></div></div>
          <div className="confidence-foot"><CircleDollarSign size={14} /> Biggest variable: 3 overdue customer balances</div>
        </div>
      </div>

      <div className="cash-section-heading"><div><div className="section-kicker">Money movement</div><h3>What changes your balance next</h3></div><span className="cash-updated"><CalendarClock size={12} /> Updated just now</span></div>
      <div className="commitment-grid">{commitments.map((item) => <div className="commitment-card" key={item.label}><div className={`commitment-icon ${item.tone}`}>{item.tone === "success" ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}</div><div><strong>{item.label}</strong><span>{item.detail}</span></div><b>{item.amount}</b></div>)}</div>

      <div className="cash-callout"><div><span className="eyebrow">Owner recommendation</span><strong>You can approve the AED 160K purchase order without breaching the safety buffer.</strong><p>After the purchase, projected cash remains AED 784K at the end of this week.</p></div><Link href="/control/approvals" className="btn btn-primary btn-sm">Review approval <ArrowUpRight size={13} /></Link></div>
    </div>
  );
}
