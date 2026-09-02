import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle } from "lucide-react";

const RISK_CLASS: Record<string, string> = {
  Critical: "priority-critical", High: "priority-high",
  Elevated: "priority-medium", Medium: "priority-medium", Low: "priority-low",
};
const STATUS_CLASS: Record<string, string> = {
  Approved: "badge-success", Submitted: "badge-info",
  "Under Review": "badge-warning", Draft: "badge-muted", Restricted: "badge-danger",
};

export default function PurchaseOrdersPage() {
  const flagged = mockPurchaseOrders.filter((po) => po.riskLevel === "Elevated" || po.riskLevel === "Critical");

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Purchase Orders</h2>
          <p className="page-description">Active and recent purchase orders with validation and risk status.</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> New Purchase Order</button>
      </div>

      {flagged.length > 0 && (
        <div className="alert-banner warning" style={{ marginBottom: 20 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <strong>{flagged.length} purchase orders require attention.</strong>&nbsp;
          Elevated or critical risk level assigned. Review before processing.
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Supplier</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPurchaseOrders.map((po) => (
                <tr key={po.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{po.id}</td>
                  <td style={{ fontWeight: 500 }}>{po.supplier}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(po.amount)}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{po.items}</td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[po.status] ?? "badge-muted"}`}>{po.status}</span>
                  </td>
                  <td>
                    <span className={`badge ${RISK_CLASS[po.riskLevel] ?? "badge-muted"}`}>{po.riskLevel}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(po.createdAt)}
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
