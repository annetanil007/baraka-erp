"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldAlert,
  Send,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  Copy,
  X,
  MessageSquare,
} from "lucide-react";

export type CustomerCreditProfile = {
  id: string;
  name: string;
  segment: string;
  creditLimit: number;
  currentBalance: number;
  overdueBalance: number;
  avgPaymentDays: number; // e.g. 54 days vs 30 days term
  agingTier: {
    current: number; // 0-30 days
    tier30to60: number; // 31-60 days
    tier60to90: number; // 61-90 days
    tierOver90: number; // 90+ days
  };
  creditHoldActive: boolean;
};

export default function CustomerCreditRiskDrawer({
  customer,
  onClose,
  onToggleHold,
}: {
  customer: CustomerCreditProfile;
  onClose: () => void;
  onToggleHold: (customerId: string, nextStatus: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [statementSent, setStatementSent] = useState(false);

  const utilizationRate = Math.round((customer.currentBalance / customer.creditLimit) * 100);

  // Ready-to-send payment demand message
  const paymentDemandText = `Dear Finance Team at ${customer.name},\n\nThis is an automated Statement of Account notice from Baraka Holding.\n\nYour current outstanding balance is AED ${customer.currentBalance.toLocaleString()}, with AED ${customer.overdueBalance.toLocaleString()} exceeding your agreed 30-day payment terms.\n\nPlease remit payment or provide swift confirmation today to avoid temporary hold on new pending shipments.\n\nThank you,\nFinance & Credit Control Department`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentDemandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog credit-risk-drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(720px, 95vw)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={16} style={{ color: customer.creditHoldActive ? "var(--color-danger)" : "var(--color-warning)" }} />
              Dynamic Credit Risk & Debt Aging Profile
            </div>
            <div className="card-subtitle">
              {customer.name} ({customer.id}) · {customer.segment} Tier
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Key Risk Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Credit Limit Utilization</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: utilizationRate > 80 ? "var(--color-danger)" : "inherit", marginTop: 4 }}>
                {utilizationRate}%
              </div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                {formatCurrency(customer.currentBalance)} of {formatCurrency(customer.creditLimit)}
              </div>
            </div>

            <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Aged Overdue Exposure</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: customer.overdueBalance > 0 ? "var(--color-danger)" : "var(--color-success)", marginTop: 4 }}>
                {formatCurrency(customer.overdueBalance)}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                Breaches agreed 30-day terms
              </div>
            </div>

            <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Payment Delay Metric</span>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-warning)", marginTop: 4 }}>
                {customer.avgPaymentDays} Days DSO
              </div>
              <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                +24 days past invoice due date
              </div>
            </div>
          </div>

          {/* Aging Schedule Table */}
          <div>
            <div className="section-heading" style={{ marginBottom: 8 }}>Accounts Receivable Aging Schedule</div>
            <div className="table-container">
              <table className="data-table" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th>0–30 Days (Current)</th>
                    <th>31–60 Days (Grace)</th>
                    <th>61–90 Days (Late)</th>
                    <th>90+ Days (High Risk)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontFamily: "monospace" }}>{formatCurrency(customer.agingTier.current)}</td>
                    <td style={{ fontFamily: "monospace", color: customer.agingTier.tier30to60 > 0 ? "var(--color-warning)" : "inherit" }}>
                      {formatCurrency(customer.agingTier.tier30to60)}
                    </td>
                    <td style={{ fontFamily: "monospace", color: customer.agingTier.tier60to90 > 0 ? "var(--color-danger)" : "inherit", fontWeight: 600 }}>
                      {formatCurrency(customer.agingTier.tier60to90)}
                    </td>
                    <td style={{ fontFamily: "monospace", color: customer.agingTier.tierOver90 > 0 ? "var(--color-danger)" : "inherit", fontWeight: 700 }}>
                      {formatCurrency(customer.agingTier.tierOver90)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Hold Action Banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: customer.creditHoldActive ? "var(--color-danger-bg)" : "var(--color-surface-muted)",
            border: `1px solid ${customer.creditHoldActive ? "#F7C5C0" : "var(--color-border)"}`,
            borderRadius: "var(--radius-md)",
          }}>
            <div>
              <strong style={{ fontSize: 13, color: customer.creditHoldActive ? "var(--color-danger)" : "var(--color-text-primary)" }}>
                {customer.creditHoldActive ? "Commercial Credit Hold Active" : "Account in Standard Standing"}
              </strong>
              <p style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                {customer.creditHoldActive
                  ? "All warehouse dispatches and new Sales Orders are automatically blocked."
                  : "Sales reps may book standard orders up to the remaining credit limit."}
              </p>
            </div>
            <button
              type="button"
              className={`btn btn-sm ${customer.creditHoldActive ? "btn-secondary" : "btn-danger"}`}
              onClick={() => onToggleHold(customer.id, !customer.creditHoldActive)}
            >
              {customer.creditHoldActive ? "Release Credit Hold" : "Enforce Credit Hold"}
            </button>
          </div>

          {/* One-Click Payment Demand Notice */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <MessageSquare size={14} style={{ color: "var(--color-success)" }} />
                Instant Statement & WhatsApp Payment Demand
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={copyToClipboard}
              >
                <Copy size={12} /> {copied ? "Copied!" : "Copy Text"}
              </button>
            </div>
            <pre style={{
              fontSize: 11.5,
              whiteSpace: "pre-wrap",
              background: "var(--color-surface-muted)",
              padding: 10,
              borderRadius: "var(--radius-sm)",
              fontFamily: "inherit",
              color: "var(--color-text-secondary)",
            }}>
              {paymentDemandText}
            </pre>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setStatementSent(true)}
              >
                <Send size={12} /> {statementSent ? "Notice Sent via API" : "Send Formal Demand Notice"}
              </button>
            </div>
          </div>

          <div className="dialog-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
