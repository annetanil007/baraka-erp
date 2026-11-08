"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, FileText, ArrowRight, X, ShieldAlert, Split } from "lucide-react";

export type MatchRecord = {
  invoiceId: string;
  poId: string;
  grnId: string;
  supplier: string;
  poQty: number;
  poPrice: number;
  grnQty: number;
  invoiceQty: number;
  invoicePrice: number;
  paymentTerms: string;
};

export default function ThreeWayMatchDrawer({
  record,
  onClose,
  onResolve,
}: {
  record: MatchRecord;
  onClose: () => void;
  onResolve: (action: string) => void;
}) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const poTotal = record.poQty * record.poPrice;
  const grnTotal = record.grnQty * record.poPrice;
  const invoiceTotal = record.invoiceQty * record.invoicePrice;

  // Variances
  const qtyVariance = record.invoiceQty - record.grnQty;
  const qtyVarianceCost = qtyVariance * record.poPrice;
  const priceVariancePerUnit = record.invoicePrice - record.poPrice;
  const totalPPV = (record.invoicePrice - record.poPrice) * record.invoiceQty; // Purchase Price Variance
  const netVariance = invoiceTotal - grnTotal;

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog match-drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(780px, 95vw)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Split size={16} style={{ color: "var(--color-accent)" }} />
              Automated 3-Way Reconciliation Audit
            </div>
            <div className="card-subtitle">
              PO {record.poId} ↔ GRN {record.grnId} ↔ Invoice {record.invoiceId} ({record.supplier})
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Comparison Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {/* Purchase Order */}
            <div className="card" style={{ padding: 14, background: "var(--color-surface-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                <FileText size={13} /> 1. Purchase Order
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{record.poId}</div>
              <div className="divider" style={{ margin: "8px 0" }} />
              <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Authorized Qty:</span>
                  <strong>{record.poQty} units</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Contract Unit Cost:</span>
                  <span>{formatCurrency(record.poPrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontWeight: 600 }}>
                  <span>PO Amount:</span>
                  <span>{formatCurrency(poTotal)}</span>
                </div>
              </div>
            </div>

            {/* Goods Receipt Note */}
            <div className="card" style={{ padding: 14, background: "var(--color-surface-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                <CheckCircle2 size={13} style={{ color: "var(--color-success)" }} /> 2. Physical Receipt (GRN)
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{record.grnId}</div>
              <div className="divider" style={{ margin: "8px 0" }} />
              <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Warehouse Verified:</span>
                  <strong style={{ color: record.grnQty < record.poQty ? "var(--color-warning)" : "inherit" }}>
                    {record.grnQty} units
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Accrued Valuation:</span>
                  <span>{formatCurrency(record.poPrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontWeight: 600 }}>
                  <span>GRNI Value:</span>
                  <span>{formatCurrency(grnTotal)}</span>
                </div>
              </div>
            </div>

            {/* Supplier Invoice */}
            <div className="card" style={{ padding: 14, background: "var(--color-surface-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                <AlertTriangle size={13} style={{ color: "var(--color-danger)" }} /> 3. Billed Invoice
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{record.invoiceId}</div>
              <div className="divider" style={{ margin: "8px 0" }} />
              <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Billed Quantity:</span>
                  <strong style={{ color: qtyVariance > 0 ? "var(--color-danger)" : "inherit" }}>
                    {record.invoiceQty} units
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Billed Unit Price:</span>
                  <span style={{ color: priceVariancePerUnit > 0 ? "var(--color-danger)" : "inherit" }}>
                    {formatCurrency(record.invoicePrice)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontWeight: 600 }}>
                  <span>Claimed Total:</span>
                  <span style={{ color: "var(--color-danger)" }}>{formatCurrency(invoiceTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variance Breakdown Engine */}
          <div className="card" style={{ borderLeft: "4px solid var(--color-danger)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldAlert size={17} style={{ color: "var(--color-danger)" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>3-Way Variance Discrepancy Analysis</div>
                  <div style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>Automated variance attribution for general ledger booking</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase" }}>Net Invoice Deviation</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--color-danger)" }}>
                  +{formatCurrency(netVariance)}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 12.5, background: "var(--color-surface)", padding: 12, borderRadius: "var(--radius-md)" }}>
              <div>
                <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: 11, textTransform: "uppercase" }}>
                  PPV (Purchase Price Variance)
                </span>
                <strong style={{ fontSize: 14, color: totalPPV !== 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                  {totalPPV > 0 ? `+${formatCurrency(totalPPV)} (Unfavorable)` : totalPPV < 0 ? `-${formatCurrency(Math.abs(totalPPV))} (Favorable)` : "0.00 (Zero Variance)"}
                </strong>
                <p style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  Unit price variance: {formatCurrency(record.invoicePrice)} vs {formatCurrency(record.poPrice)} across {record.invoiceQty} units.
                </p>
              </div>

              <div>
                <span style={{ color: "var(--color-text-muted)", display: "block", fontSize: 11, textTransform: "uppercase" }}>
                  Quantity Match Discrepancy
                </span>
                <strong style={{ fontSize: 14, color: qtyVariance !== 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                  {qtyVariance > 0 ? `+${qtyVariance} Units Billed but Unreceived` : "Exact Physical Match (0 Variance)"}
                </strong>
                <p style={{ fontSize: 11.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {qtyVariance > 0
                    ? `AED ${formatCurrency(qtyVarianceCost)} exposure claimed without verified GRN receipt.`
                    : "Warehouse physical intake matches invoice billing count."}
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Resolution Controls */}
          <div>
            <div className="section-heading" style={{ marginBottom: 8 }}>Authorized Remediation Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <button
                type="button"
                className={`btn ${selectedAction === "credit_note" ? "btn-primary" : "btn-secondary"}`}
                style={{ height: "auto", padding: "10px 12px", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}
                onClick={() => setSelectedAction("credit_note")}
              >
                <strong style={{ fontSize: 12.5 }}>Hold & Request Credit Note</strong>
                <span style={{ fontSize: 11, color: "inherit", opacity: 0.8, marginTop: 2 }}>
                  Issue dispute of {formatCurrency(netVariance)} to {record.supplier}.
                </span>
              </button>

              <button
                type="button"
                className={`btn ${selectedAction === "accept_ppv" ? "btn-primary" : "btn-secondary"}`}
                style={{ height: "auto", padding: "10px 12px", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}
                onClick={() => setSelectedAction("accept_ppv")}
              >
                <strong style={{ fontSize: 12.5 }}>Book to PPV Account</strong>
                <span style={{ fontSize: 11, color: "inherit", opacity: 0.8, marginTop: 2 }}>
                  Debit GL 5210 Purchase Price Variance & pay full invoice.
                </span>
              </button>

              <button
                type="button"
                className={`btn ${selectedAction === "partial_pay" ? "btn-primary" : "btn-secondary"}`}
                style={{ height: "auto", padding: "10px 12px", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}
                onClick={() => setSelectedAction("partial_pay")}
              >
                <strong style={{ fontSize: 12.5 }}>Authorize GRN Match Only</strong>
                <span style={{ fontSize: 11, color: "inherit", opacity: 0.8, marginTop: 2 }}>
                  Pay only verified GRN ({formatCurrency(grnTotal)}), withholding balance.
                </span>
              </button>
            </div>
          </div>

          <div className="dialog-actions" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedAction}
              onClick={() => {
                if (selectedAction) onResolve(selectedAction);
              }}
            >
              Post Audit Decision <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
