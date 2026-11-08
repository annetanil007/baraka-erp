"use client";

import { useState } from "react";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { GitMerge, AlertCircle, Landmark } from "lucide-react";
import BankReconciliationEngine from "@/components/finance/BankReconciliationEngine";

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState<"bank" | "procurement">("bank");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assignedReviewers, setAssignedReviewers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const discrepancies = mockPurchaseOrders.filter(
    (po) => po.orderedQty !== po.receivedQty || po.receivedQty !== po.invoicedQty
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Autonomous Reconciliation & Clearing</h2>
        <p className="page-description">
          Continuous AI reconciliation across bank feeds, purchase orders, goods receipts, and invoices.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid var(--color-border)", marginBottom: 20 }}>
        <button
          type="button"
          className={`sidebar-item ${activeTab === "bank" ? "active" : ""}`}
          style={{ width: "auto", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "8px 16px", color: activeTab === "bank" ? "#fff" : "var(--color-text-secondary)" }}
          onClick={() => setActiveTab("bank")}
        >
          <Landmark size={14} style={{ display: "inline", marginRight: 6 }} />
          Bank Statement & Feed Clearing
        </button>
        <button
          type="button"
          className={`sidebar-item ${activeTab === "procurement" ? "active" : ""}`}
          style={{ width: "auto", borderRadius: "var(--radius-md) var(--radius-md) 0 0", padding: "8px 16px", color: activeTab === "procurement" ? "#fff" : "var(--color-text-secondary)" }}
          onClick={() => setActiveTab("procurement")}
        >
          <GitMerge size={14} style={{ display: "inline", marginRight: 6 }} />
          Procurement & Inventory Matching
        </button>
      </div>

      {activeTab === "bank" && <BankReconciliationEngine />}

      {activeTab === "procurement" && (
        <div>
          {/* Discrepancies Alert */}
          {discrepancies.length > 0 && (
            <div className="alert-banner warning" style={{ marginBottom: 20 }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <strong>{discrepancies.length} procurement reconciliation items require review.</strong>
              &nbsp;Quantity or value discrepancies identified between linked records.
            </div>
          )}

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title">Procurement Flow Tracking</div>
              <div className="card-subtitle">PO → GRN → Invoice → Payment</div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Purchase Order</th>
                    <th>Supplier</th>
                    <th>Amount</th>
                    <th>Ordered Qty</th>
                    <th>Received Qty</th>
                    <th>Invoiced Qty</th>
                    <th>Qty Status</th>
                    <th>Reconciliation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPurchaseOrders.map((po) => {
                    const qtyOk = po.orderedQty === po.receivedQty && po.receivedQty === po.invoicedQty;
                    const partialOk = po.receivedQty === 0 && po.invoicedQty === 0;

                    return (
                      <tr key={po.id}>
                        <td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{po.id}</span></td>
                        <td>{po.supplier}</td>
                        <td style={{ fontWeight: 500 }}>{formatCurrency(po.amount)}</td>
                        <td style={{ textAlign: "center" }}>{po.orderedQty}</td>
                        <td style={{ textAlign: "center", color: po.receivedQty < po.orderedQty ? "var(--color-warning)" : "inherit" }}>
                          {po.receivedQty}
                        </td>
                        <td style={{ textAlign: "center", color: po.invoicedQty > po.receivedQty ? "var(--color-danger)" : "inherit" }}>
                          {po.invoicedQty}
                        </td>
                        <td>
                          {qtyOk ? (
                            <span className="badge badge-success">Matched</span>
                          ) : partialOk ? (
                            <span className="badge badge-muted">Not Yet Received</span>
                          ) : po.invoicedQty > po.receivedQty ? (
                            <span className="badge badge-danger">Invoice Exceeds Receipt</span>
                          ) : (
                            <span className="badge badge-warning">Qty Discrepancy</span>
                          )}
                        </td>
                        <td>
                          {qtyOk ? (
                            <span className="badge badge-success">Reconciled</span>
                          ) : partialOk ? (
                            <span className="badge badge-info">Pending Receipt</span>
                          ) : (
                            <span className="badge badge-danger">Review Required</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
