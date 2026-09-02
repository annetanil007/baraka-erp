import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { GitMerge, AlertCircle } from "lucide-react";

export default function ReconciliationPage() {
  // Items with discrepancies
  const discrepancies = mockPurchaseOrders.filter(
    (po) => po.orderedQty !== po.receivedQty || po.receivedQty !== po.invoicedQty
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Reconciliation</h2>
        <p className="page-description">
          Automated comparison of related records across procurement, receiving and invoicing.
        </p>
      </div>

      {/* Alert */}
      {discrepancies.length > 0 && (
        <div className="alert-banner warning">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <strong>{discrepancies.length} reconciliation items require review.</strong>
          &nbsp;Quantity or value discrepancies identified between linked records.
        </div>
      )}

      {/* Procurement flow legend */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <GitMerge size={14} style={{ display: "inline", marginRight: 6 }} />
            Procurement Reconciliation
          </div>
          <div className="card-subtitle">Purchase Order → Goods Receipt → Supplier Invoice → Payment</div>
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
                const partialOk = po.receivedQty === 0 && po.invoicedQty === 0; // not yet received

                return (
                  <tr key={po.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12 }}>{po.id}</span>
                    </td>
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
                        <span className="badge badge-warning">Quantity Review Required</span>
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

      {/* Discrepancy detail */}
      <div className="section-heading">Items Requiring Review</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {discrepancies.map((po) => {
          const qtyDiff = po.invoicedQty - po.receivedQty;
          return (
            <div key={po.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{po.id} — {po.supplier}</div>
                    <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--color-text-secondary)" }}>
                      <span>Ordered: <strong>{po.orderedQty}</strong></span>
                      <span>Received: <strong>{po.receivedQty}</strong></span>
                      <span>Invoiced: <strong style={{ color: po.invoicedQty > po.receivedQty ? "var(--color-danger)" : "inherit" }}>{po.invoicedQty}</strong></span>
                    </div>
                    {qtyDiff > 0 && (
                      <div style={{ marginTop: 8, fontSize: 13, color: "var(--color-danger)" }}>
                        Quantity Review Required — Invoice quantity exceeds received quantity by {qtyDiff} units.
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-secondary btn-sm">View Records</button>
                    <button className="btn btn-accent btn-sm">Assign Reviewer</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
