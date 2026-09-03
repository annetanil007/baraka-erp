"use client";

import { useState } from "react";
import { mockSalesOrders } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const RISK_CLASS: Record<string, string> = {
  High: "priority-high", Medium: "priority-medium", Low: "priority-low",
};
const STATUS_CLASS: Record<string, string> = {
  Approved: "badge-success", "Under Review": "badge-warning",
  Pending: "badge-info", Rejected: "badge-danger",
};

export default function SalesPage() {
  const [orders, setOrders] = useLocalStorage("baraka:sales-orders", mockSalesOrders);
  const [dialog, setDialog] = useState<"create" | "view" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockSalesOrders[number] | null>(null);
  const flagged = orders.filter((o) => o.riskLevel === "Medium" || o.riskLevel === "High");
  const saveOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer") || "New customer");
    const amount = Number(form.get("amount") || 0);
    setOrders((current) => [{ id: `ORD-2026-${String(1204 + current.length).padStart(5, "0")}`, customer, amount, items: 1, status: "Under Review", riskLevel: "Low", createdAt: new Date().toISOString() }, ...current]);
    setDialog(null);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Sales Orders</h2>
          <p className="page-description">Active sales orders with validation status and risk evaluation.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}><Plus size={13} /> New Order</button>
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
              {orders.map((o) => (
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
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedOrder(o); setDialog("view"); }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {dialog && <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>{dialog === "create" ? <form className="dialog" role="dialog" aria-modal="true" onSubmit={saveOrder} onClick={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="card-title">New sales order</div><div className="card-subtitle">Create an order and send it through review.</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button></div><div className="dialog-body"><div className="form-group"><label className="form-label" htmlFor="order-customer">Customer</label><input id="order-customer" name="customer" className="form-input" placeholder="Customer name" required autoFocus /></div><div className="form-group"><label className="form-label" htmlFor="order-amount">Order value (AED)</label><input id="order-amount" name="amount" className="form-input" type="number" min="0" step="0.01" placeholder="0.00" required /></div><div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setDialog(null)}>Cancel</button><button className="btn btn-primary" type="submit">Create order</button></div></div></form> : <div className="dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="card-title">Order details</div><div className="card-subtitle">Sales order review</div></div><button className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button></div><div className="dialog-body">{selectedOrder && Object.entries(selectedOrder).map(([key, value]) => <div className="eval-row" key={key}><span className="eval-label">{key}</span><span className="eval-value">{key === "amount" ? formatCurrency(Number(value)) : String(value)}</span></div>)}</div></div>}</div>}
    </div>
  );
}
