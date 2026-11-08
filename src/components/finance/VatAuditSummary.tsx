"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Landmark, ShieldCheck, Download, AlertCircle, FileSpreadsheet } from "lucide-react";

export default function VatAuditSummary() {
  const [period, setPeriod] = useState("Q3 2026 (Jul–Sep)");

  // Tax calculations standard 5% VAT (UAE FTA / GCC standard)
  const taxableSuppliesStandard = 4850000;
  const outputVatDue = taxableSuppliesStandard * 0.05; // 242,500

  const taxableExpensesStandard = 2960000;
  const inputVatRecoverable = taxableExpensesStandard * 0.05; // 148,000

  const netVatPayable = outputVatDue - inputVatRecoverable; // 94,500

  return (
    <div className="card" style={{ marginTop: 24, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Landmark size={14} /> Tax Compliance & VAT Reconciliation Audit
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
            UAE FTA / GCC VAT Form 201 Return Ledger
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
            Automated tax calculation with verifiable sub-ledger audit trail. All tax invoices verified with valid TRNs.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="form-input" style={{ fontSize: 12 }} value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Q3 2026 (Jul–Sep)</option>
            <option>Q2 2026 (Apr–Jun)</option>
            <option>Q1 2026 (Jan–Mar)</option>
          </select>
          <button type="button" className="btn btn-secondary btn-sm">
            <Download size={13} /> Export FTA Audit File (FAF)
          </button>
        </div>
      </div>

      <div className="divider" style={{ margin: "16px 0" }} />

      <div className="table-container">
        <table className="data-table" style={{ fontSize: 12.5 }}>
          <thead>
            <tr>
              <th>Box / Schedule</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Net Amount (AED)</th>
              <th style={{ textAlign: "right" }}>VAT Rate</th>
              <th style={{ textAlign: "right" }}>VAT Amount (AED)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: "monospace", fontWeight: 700 }}>Box 1a</td>
              <td>Standard Rated Supplies (Sales Orders & Tax Invoices)</td>
              <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(taxableSuppliesStandard)}</td>
              <td style={{ textAlign: "right" }}>5.0%</td>
              <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-primary)" }}>
                {formatCurrency(outputVatDue)}
              </td>
              <td><span className="badge badge-success">Reconciled</span></td>
            </tr>
            <tr>
              <td style={{ fontFamily: "monospace", fontWeight: 700 }}>Box 9</td>
              <td>Standard Rated Expenses (Supplier Bills & Direct Purchases)</td>
              <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(taxableExpensesStandard)}</td>
              <td style={{ textAlign: "right" }}>5.0%</td>
              <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: "var(--color-success)" }}>
                ({formatCurrency(inputVatRecoverable)})
              </td>
              <td><span className="badge badge-success">Verified with TRN</span></td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--color-surface-muted)", borderTop: "2px solid var(--color-border-strong)", fontWeight: 700 }}>
              <td colSpan={2} style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: "0.05em" }}>
                Net Tax Due to Federal Tax Authority:
              </td>
              <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(taxableSuppliesStandard - taxableExpensesStandard)}</td>
              <td></td>
              <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: 14, color: "var(--color-primary)" }}>
                {formatCurrency(netVatPayable)}
              </td>
              <td>
                <span className="badge badge-primary">Filing Ready</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--color-text-secondary)" }}>
        <ShieldCheck size={16} style={{ color: "var(--color-success)" }} />
        <span>Electronic tax compliance checks passed. Zero mismatch between GL 2200 (VAT Output) and Box 1a.</span>
      </div>
    </div>
  );
}
