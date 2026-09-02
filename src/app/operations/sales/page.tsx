import { mockSalesOrders } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle } from "lucide-react";

const RISK_CLASS: Record<string, string> = {
  High: "priority-high", Medium: "priority-medium", Low: "priority-low",
};
const STATUS_CLASS: Record<string, string> = {
  Approved: "badge-success", "Under Review": "badge-warning",
  Pending: "badge-info", Rejected: "badge-danger",
};

export default function SalesPage() {
  const flagged = mockSalesOrders.filter((o) => o.riskLevel === "Medium" || o.riskLevel === "High");

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Sales Orders</h2>
          <p className="page-description">Active sales orders with validation status and risk evaluation.</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> New Order</button>
      </div>

      {/* Flagged orders notice */}
      {flagged.length > 0 && (
        <div className="alert-banner warning" style={{ marginBottom: 20 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <div>
            <strong>{flagged.length} sales orders require review.</strong> Unusual activity patterns identified.
            Falcon Industrial LLC placed 3 high-value orders within 2 hours, exceeding the normal daily volume by 340%.
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockSalesOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(o.amount)}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{o.items}</td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[o.status] ?? "badge-muted"}`}>{o.status}</span>
                  </td>
                  <td>
                    <span className={`badge ${RISK_CLASS[o.riskLevel] ?? "badge-muted"}`}>{o.riskLevel}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(o.createdAt)}
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
