"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { BookOpen, CheckCircle, ShieldCheck, X } from "lucide-react";

export type JournalLine = {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
};

export type JournalEntryProps = {
  reference: string;
  entityType: string;
  description: string;
  lines: JournalLine[];
  onClose: () => void;
  onPost?: () => void;
};

export default function JournalEntryModal({
  reference,
  entityType,
  description,
  lines,
  onClose,
  onPost,
}: JournalEntryProps) {
  const [posted, setPosted] = useState(false);

  const totalDebit = lines.reduce((acc, l) => acc + l.debit, 0);
  const totalCredit = lines.reduce((acc, l) => acc + l.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handlePost = () => {
    setPosted(true);
    if (onPost) onPost();
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog journal-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(680px, 95vw)" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={16} style={{ color: "var(--color-primary)" }} />
              General Ledger Impact Simulation
            </div>
            <div className="card-subtitle">
              Pre-posting audit for {entityType} <span className="mono-cell">{reference}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "var(--color-surface-muted)", padding: 10, borderRadius: "var(--radius-md)" }}>
            <strong>Transaction Summary:</strong> {description}
          </div>

          <div className="table-container">
            <table className="data-table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th>GL Account</th>
                  <th>Account Name</th>
                  <th style={{ textAlign: "right" }}>Debit (DR)</th>
                  <th style={{ textAlign: "right" }}>Credit (CR)</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{line.accountCode}</td>
                    <td style={{ fontWeight: 500 }}>{line.accountName}</td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: line.debit > 0 ? 600 : 400 }}>
                      {line.debit > 0 ? formatCurrency(line.debit) : "—"}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: line.credit > 0 ? 600 : 400 }}>
                      {line.credit > 0 ? formatCurrency(line.credit) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--color-surface-muted)", fontWeight: 700, borderTop: "2px solid var(--color-border-strong)" }}>
                  <td colSpan={2} style={{ textAlign: "right", textTransform: "uppercase", fontSize: 11, letterSpacing: "0.05em" }}>
                    Total Balanced Movement:
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(totalDebit)}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(totalCredit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Balance verification seal */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: isBalanced ? "var(--color-success-bg)" : "var(--color-danger-bg)",
            border: `1px solid ${isBalanced ? "#CFE2D3" : "#F7C5C0"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: isBalanced ? "var(--color-success)" : "var(--color-danger)" }}>
              {isBalanced ? <ShieldCheck size={16} /> : <X size={16} />}
              <strong>{isBalanced ? "Zero-Tolerance Ledger Balance Verified (DR = CR)" : "Imbalance Detected: General Ledger requires zero net delta"}</strong>
            </div>
            <span className="tag" style={{ fontSize: 11 }}>Double-Entry Rule 101</span>
          </div>

          {posted && (
            <div className="action-confirmation" role="status">
              <CheckCircle size={15} /> Journal entry posted to immutable ledger for {reference}.
            </div>
          )}

          <div className="dialog-actions" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!isBalanced || posted}
              onClick={handlePost}
            >
              {posted ? "Posted to Ledger" : "Confirm & Post to Ledger"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
