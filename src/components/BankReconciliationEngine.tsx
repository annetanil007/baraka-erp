"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Landmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Split,
  FileSpreadsheet,
  Check,
  RefreshCw,
} from "lucide-react";

export type BankFeedLine = {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: "credit" | "debit";
  matchedEntityId?: string;
  matchedEntityName?: string;
  matchConfidence: number;
  bankFee?: number;
  status: "matched" | "partial" | "unmatched" | "reconciled";
};

const initialFeed: BankFeedLine[] = [
  {
    id: "BNK-LINE-091",
    date: "02 Sep 2026",
    description: "WIRE TRF / FALCON INDUSTRIAL LLC / INV-2026-00880",
    reference: "FT2624500918",
    amount: 42000,
    type: "credit",
    matchedEntityId: "INV-2026-00880",
    matchedEntityName: "Falcon Industrial LLC",
    matchConfidence: 99,
    status: "matched",
  },
  {
    id: "BNK-LINE-092",
    date: "02 Sep 2026",
    description: "INWARD REMITTANCE / AL JADEED TRADING / LESS WIRE CHARGES",
    reference: "FT2624500922",
    amount: 33975,
    type: "credit",
    matchedEntityId: "INV-2026-00874",
    matchedEntityName: "Al Jadeed Trading (Claim: AED 34,000)",
    matchConfidence: 96,
    bankFee: 25,
    status: "partial",
  },
  {
    id: "BNK-LINE-093",
    date: "01 Sep 2026",
    description: "OUTWARD TT / GULF TRADING CO / PO-00441 SETTLEMENT",
    reference: "TT2624401884",
    amount: 160000,
    type: "debit",
    matchedEntityId: "PAY-2026-001",
    matchedEntityName: "Gulf Trading Co. (PO-2026-00441)",
    matchConfidence: 100,
    status: "matched",
  },
  {
    id: "BNK-LINE-094",
    date: "01 Sep 2026",
    description: "POS SETTLEMENT DUBAI SERVICE BRANCH BATCH 448",
    reference: "POS-DXB-448",
    amount: 18450,
    type: "credit",
    matchedEntityId: "SALES-BATCH-448",
    matchedEntityName: "Daily POS Retail Batch",
    matchConfidence: 94,
    status: "matched",
  },
  {
    id: "BNK-LINE-095",
    date: "31 Aug 2026",
    description: "DIRECT DEBIT UTILITIES SEWA ELECTRICITY DUBAI",
    reference: "DD-SEWA-992",
    amount: 4280,
    type: "debit",
    matchConfidence: 45,
    status: "unmatched",
  },
];

export default function BankReconciliationEngine() {
  const [feed, setFeed] = useState<BankFeedLine[]>(initialFeed);
  const [toast, setToast] = useState("");

  const reconciledCount = feed.filter((f) => f.status === "reconciled").length;
  const matchRate = Math.round((feed.filter((f) => f.matchConfidence >= 90).length / feed.length) * 100);

  const reconcileItem = (id: string) => {
    setFeed((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "reconciled" } : item))
    );
    setToast(`Bank transaction ${id} reconciled to General Ledger.`);
  };

  const reconcileAllMatches = () => {
    setFeed((current) =>
      current.map((item) =>
        item.status === "matched" || item.status === "partial" ? { ...item, status: "reconciled" } : item
      )
    );
    setToast(`Auto-reconciled 4 transactions. General ledger cash account updated.`);
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Landmark size={14} /> Autonomous Bank Statement Reconciliation
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
            Bank Feed & Electronic Clearing (Emirates NBD Main Account)
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
            AI parses statement descriptions, matches open AR/AP items, and auto-proposes bank-charge adjustments.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFeed(initialFeed)}>
            <RefreshCw size={13} /> Reset Demo Feed
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={reconcileAllMatches}
            disabled={reconciledCount === feed.length}
          >
            <Check size={13} /> Accept All High-Confidence Matches
          </button>
        </div>
      </div>

      {toast && (
        <div className="action-confirmation" role="status" style={{ marginTop: 14 }}>
          <CheckCircle2 size={15} /> {toast}
          <button type="button" onClick={() => setToast("")}>Dismiss</button>
        </div>
      )}

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, margin: "16px 0" }}>
        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Auto-Match Rate</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-success)", marginTop: 4 }}>
            {matchRate}% Confidence
          </div>
        </div>
        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Pending Reconciliation</span>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            {feed.length - reconciledCount} of {feed.length} Lines
          </div>
        </div>
        <div className="card" style={{ padding: 12, background: "var(--color-surface-muted)" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Bank Fee Handling</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-accent)", marginTop: 4 }}>
            Auto-Split to GL 6120
          </div>
        </div>
      </div>

      {/* Statement Table */}
      <div className="table-container">
        <table className="data-table" style={{ fontSize: 12.5 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bank Statement Description & Reference</th>
              <th style={{ textAlign: "right" }}>Amount (AED)</th>
              <th>System Proposed Match</th>
              <th>Confidence</th>
              <th>Reconciliation Action</th>
            </tr>
          </thead>
          <tbody>
            {feed.map((line) => {
              const isReconciled = line.status === "reconciled";
              return (
                <tr key={line.id} style={isReconciled ? { opacity: 0.65 } : undefined}>
                  <td style={{ whiteSpace: "nowrap", color: "var(--color-text-muted)" }}>{line.date}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{line.description}</div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                      Ref: {line.reference}
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: line.type === "credit" ? "var(--color-success)" : "var(--color-danger)",
                    }}
                  >
                    {line.type === "credit" ? "+" : "−"}
                    {formatCurrency(line.amount)}
                  </td>
                  <td>
                    {line.matchedEntityName ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{line.matchedEntityName}</div>
                        {line.bankFee && (
                          <div style={{ fontSize: 11, color: "var(--color-warning)", marginTop: 2 }}>
                            Detected wire fee: AED {line.bankFee} → auto-dr GL 6120
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                        Unlinked transaction (Manual GL mapping needed)
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        line.matchConfidence >= 95
                          ? "badge-success"
                          : line.matchConfidence >= 80
                          ? "badge-warning"
                          : "badge-muted"
                      }`}
                    >
                      {line.matchConfidence}% Match
                    </span>
                  </td>
                  <td>
                    {isReconciled ? (
                      <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={12} /> Reconciled
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => reconcileItem(line.id)}
                      >
                        Match & Post GL
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
