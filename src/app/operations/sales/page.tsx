"use client";

import { useState } from "react";
import { mockSalesOrders } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle, BookOpen, Eye, CheckCircle } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import JournalEntryModal, { JournalLine } from "@/components/JournalEntryModal";

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
  const [journalModal, setJournalModal] = useState<{ reference: string; lines: JournalLine[]; description: string } | null>(null);
  const [notification, setNotification] = useState("");

  const flagged = orders.filter((o) => o.riskLevel === "Medium" || o.riskLevel === "High");

  const saveOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer") || "New customer");
    const amount = Number(form.get("amount") || 0);
    const newId = `ORD-2026-${String(1204 + orders.length).padStart(5, "0")}`;
    setOrders((current) => [
      { id: newId, customer, amount, items: 1, status: "Under Review", riskLevel: "Low", createdAt: new Date().toISOString() },
      ...current,
    ]);
    setDialog(null);
    setNotification(`Sales Order ${newId} created and passed through automated credit validation.`);
  };

  const previewGL = (order: typeof mockSalesOrders[number]) => {
    const netRevenue = Math.round(order.amount / 1.05);
    const vatOutput = order.amount - netRevenue;
    const estimatedCOGS = Math.round(netRevenue * 0.65); // standard 65% cost-to-retail ratio

    setJournalModal({
      reference: order.id,
      description: `Sales revenue recognition and inventory cost derecognition for ${order.customer}`,
      lines: [
        { accountCode: "1200", accountName: "Accounts Receivable (Trade Debtors)", debit: order.amount, credit: 0 },
        { accountCode: "4010", accountName: "Sales Revenue (Standard Supplies)", debit: 0, credit: netRevenue },
        { accountCode: "2200", accountName: "VAT Output Tax Payable (5%)", debit: 0, credit: vatOutput },
        { accountCode: "5010", accountName: "Cost of Goods Sold (COGS)", debit: estimatedCOGS, credit: 0 },
        { accountCode: "1300", accountName: "Inventory Asset (Warehouse Dispatch)", debit: 0, credit: estimatedCOGS },
      ],
    });
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Sales Orders & Commercial Revenue</h2>
          <p className="page-description">Commercial orders with real-time risk evaluation and automated general ledger posting.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}><Plus size={13} /> New Order</button>
      </div>

      {notification && (
        <div className="toast" role="status">
          <CheckCircle size={15} /> {notification}
          <button type="button" onClick={() => setNotification("")}>Dismiss</button>
        </div>
      )}

      {/* Flagged orders notice */}
      {flagged.length > 0 && (
        <div className="alert-banner warning" style={{ marginBottom: 20 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <div>
            <strong>{flagged.length} sales orders require review.</strong> Unusual velocity patterns identified.
            Falcon Industrial LLC placed multiple high-value orders within 2 hours, exceeding normal credit limits.
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
                <th>Order Value</th>
                <th>Items</th>
                <th>Status</th>
                <th>Risk Evaluation</th>
                <th>Timestamp</th>
                <th>Institutional Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{formatCurrency(o.amount)}</td>
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
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setSelectedOrder(o); setDialog("view"); }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        title="Simulate General Ledger Impact"
                        onClick={() => previewGL(o)}
                      >
                        <BookOpen size={12} /> GL Impact
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail or Create Modal */}
      {dialog && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>
          {dialog === "create" ? (
            <form className="dialog" role="dialog" aria-modal="true" onSubmit={saveOrder} onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <div className="card-title">New Commercial Sales Order</div>
                  <div className="card-subtitle">Creates an authorized order subject to automated credit and inventory availability checks.</div>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button>
              </div>
              <div className="dialog-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="order-customer">Customer Account</label>
                  <input id="order-customer" name="customer" className="form-input" placeholder="e.g. Falcon Industrial LLC" required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="order-amount">Contract Order Total (AED)</label>
                  <input id="order-amount" name="amount" className="form-input" type="number" min="0" step="0.01" placeholder="0.00" required />
                </div>
                <div className="dialog-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setDialog(null)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Submit & Validate Order</button>
                </div>
              </div>
            </form>
          ) : (
            <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <div className="dialog-header">
                <div>
                  <div className="card-title">Commercial Order Audit — {selectedOrder?.id}</div>
                  <div className="card-subtitle">Comprehensive order verification records</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button>
              </div>
              <div className="dialog-body">
                {selectedOrder && Object.entries(selectedOrder).map(([key, value]) => (
                  <div className="eval-row" key={key}>
                    <span className="eval-label">{key}</span>
                    <span className="eval-value">{key === "amount" ? formatCurrency(Number(value)) : String(value)}</span>
                  </div>
                ))}
                <div className="dialog-actions">
                  <button className="btn btn-primary" onClick={() => setDialog(null)}>Done</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* General Ledger Impact Modal */}
      {journalModal && (
        <JournalEntryModal
          reference={journalModal.reference}
          entityType="Commercial Sales Order"
          description={journalModal.description}
          lines={journalModal.lines}
          onClose={() => setJournalModal(null)}
          onPost={() => {
            setNotification(`Revenue & COGS entry posted to general ledger for ${journalModal.reference}.`);
          }}
        />
      )}
    </div>
  );
}
