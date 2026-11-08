import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Clock3,
  WalletCards,
} from "lucide-react";
import type { DashboardData } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/utils";

type Decision = {
  tone: "danger" | "warning" | "positive";
  icon: typeof CircleAlert;
  changed: string;
  meaning: string;
  impact: string;
  confidence: string;
  href: string;
  action: string;
};

export default function OwnerDecisionOS({ data }: { data: DashboardData }) {
  const revenueDirection = data.revenueChange >= 0 ? "ahead of" : "below";
  const revenueTone = data.revenueChange >= 0 ? "positive" : "danger";
  const decisions: Decision[] = [
    {
      tone: revenueTone,
      icon: data.revenueChange >= 0 ? CheckCircle2 : CircleAlert,
      changed: `Revenue is ${Math.abs(data.revenueChange)}% ${revenueDirection} yesterday`,
      meaning: data.revenueChange >= 0
        ? "Demand is moving positively; protect service levels before adding spend."
        : "Momentum is softening; prioritize collections and avoid non-essential buying.",
      impact: `${formatCurrency(data.todaysRevenue)} booked today`,
      confidence: "High · sales orders",
      href: "/reports/executive",
      action: "View explanation",
    },
    {
      tone: "warning",
      icon: WalletCards,
      changed: `${formatCurrency(data.receivablesDue)} is waiting in receivables`,
      meaning: "Collections are the fastest available lever to improve near-term liquidity.",
      impact: "Protect cash coverage",
      confidence: "High · customer balances",
      href: "/finance/invoices",
      action: "Review collections",
    },
    {
      tone: "warning",
      icon: Clock3,
      changed: `${data.inventoryAlerts} inventory items need attention`,
      meaning: "Stock risk can interrupt sales or trap more capital if left unresolved.",
      impact: "Reduce stock-out exposure",
      confidence: "Medium · stock thresholds",
      href: "/operations/inventory/intelligence",
      action: "Plan inventory",
    },
  ];

  return (
    <section className="decision-os card">
      <div className="decision-os-header">
        <div className="decision-os-title">
          <div className="decision-os-icon"><BrainCircuit size={17} /></div>
          <div>
            <div className="section-kicker">Baraka Decision OS</div>
            <h3>What should the owner do next?</h3>
            <p>Evidence-led decisions from the signals available today.</p>
          </div>
        </div>
        <span className="decision-os-source">{data.source === "demo" ? "Demo signals" : "Live signals"}</span>
      </div>
      <div className="decision-os-list">
        {decisions.map((decision) => {
          const Icon = decision.icon;
          return (
            <div className="decision-os-row" key={decision.changed}>
              <div className={`decision-os-status ${decision.tone}`}><Icon size={15} /></div>
              <div className="decision-os-content">
                <strong>{decision.changed}</strong>
                <span>{decision.meaning}</span>
                <small>{decision.confidence}</small>
              </div>
              <div className="decision-os-impact"><b>{decision.impact}</b><Link href={decision.href}>{decision.action} <ArrowRight size={12} /></Link></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
