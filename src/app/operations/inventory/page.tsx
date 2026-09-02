import { mockInventory } from "@/lib/mock-data";
import { AlertTriangle, TrendingDown, ArrowRightLeft, Plus } from "lucide-react";

const STATUS_CLASS: Record<string, string> = {
  OK: "badge-success",
  "Low Stock": "badge-warning",
  Critical: "badge-danger",
  "Transfer Opportunity": "badge-info",
};

export default function InventoryPage() {
  const critical = mockInventory.filter((p) => p.status === "Critical");
  const lowStock = mockInventory.filter((p) => p.status === "Low Stock");

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-description">
            Real-time stock levels with demand projections and operational alerts.
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Product</button>
      </div>

      {/* Demand Projection Alerts */}
      {(critical.length > 0 || lowStock.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {critical.map((p) => (
            <div key={p.id} className="alert-banner danger">
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Demand Projection — {p.name}:</strong> Stock is projected to fall below operational
                requirements within {p.daysUntilShortfall} day{p.daysUntilShortfall !== 1 ? "s" : ""}.
                Supplier lead time is {p.supplierLeadDays} days. Procurement action required immediately.
              </div>
            </div>
          ))}
          {lowStock.map((p) => (
            <div key={p.id} className="alert-banner warning">
              <TrendingDown size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Demand Projection — {p.name}:</strong> Stock is projected to fall below operational
                requirements within {p.daysUntilShortfall} days. Current supplier lead time is {p.supplierLeadDays} days.
                Procurement action is recommended.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Branch</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Daily Demand</th>
                <th>Lead Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{item.id}</div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{item.sku}</td>
                  <td><span className="tag">{item.category}</span></td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{item.branch}</td>
                  <td style={{
                    fontWeight: 600,
                    color: item.status === "Critical" ? "var(--color-danger)" :
                           item.status === "Low Stock" ? "var(--color-warning)" : "var(--color-text-primary)"
                  }}>
                    {item.stock} {item.unit}
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>{item.minStock}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {item.avgDailyDemand} / day
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {item.supplierLeadDays} days
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[item.status] ?? "badge-muted"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm">View</button>
                      {item.status === "Transfer Opportunity" && (
                        <button className="btn btn-accent btn-sm">
                          <ArrowRightLeft size={11} /> Transfer
                        </button>
                      )}
                    </div>
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
