"use client";

import { useState } from "react";
import { mockSalesOrders } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus, AlertCircle, BookOpen, Eye, CheckCircle, MessageSquare, Send } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import JournalEntryModal, { JournalLine } from "@/components/JournalEntryModal";
import SmartOrderIngestionDrawer from "@/components/SmartOrderIngestionDrawer";
import TransactionDispatchModal, { DispatchParty } from "@/components/TransactionDispatchModal";
import { getWhatsAppNumber, defaultWhatsAppDirectory } from "@/lib/whatsapp-directory";

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
  const [smartIngestOpen, setSmartIngestOpen] = useState(false);
  const [journalModal, setJournalModal] = useState<{ reference: string; lines: JournalLine[]; description: string } | null>(null);
  const [dispatchModal, setDispatchModal] = useState<{ reference: string; parties: DispatchParty[] } | null>(null);
  const [notification, setNotification] = useState("");

  const flagged = orders.filter((o) => o.riskLevel === "Medium" || o.riskLevel === "High");

  const saveOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer") || "New customer");
    const amount = Number(form.get("amount") || 0);
    const newId = `ORD-2026-${String(1204 + orders.length).padStart(5, "0")}`;
    const newOrder = {
      id: newId,
      customer,
      amount,
      items: 1,
      status: "Under Review" as const,
      riskLevel: "Low" as const,
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [newOrder, ...current]);
    setDialog(null);
    setNotification(`Sales Order ${newId} created and passed through automated credit validation.`);
  };

  const authorizeOrder = (order: typeof mockSalesOrders[number]) => {
    setOrders((current) =>
      current.map((o) => (o.id === order.id ? { ...o, status: "Approved" } : o))
    );

    const clientContact = defaultWhatsAppDirectory.find((c) => c.name.toLowerCase().includes(order.customer.toLowerCase())) || {
      phone: "+971501234567",
      email: "orders@falcon.ae",
    };
    const warehouseContact = defaultWhatsAppDirectory.find((c) => c.type === "Branch") || {
      phone: "+971501112233",
      email: "logistics@baraka.ae",
    };

    const netAmount = Math.round(order.amount / 1.05);
    const vatAmount = order.amount - netAmount;

    // Build Formal Multi-Party Parties
    const parties: DispatchParty[] = [
      {
        role: "Client",
        name: order.customer,
        phone: clientContact.phone,
        email: clientContact.email,
        whatsAppText: `*BARAKA HOLDING | OFFICIAL ORDER CONFIRMATION*\n\nDear Commercial Department,\n\nWe hereby confirm authorized execution of Sales Order *${order.id}* for *${order.customer}*.\n\n*Financial Summary:*\n• Subtotal (Excl. VAT): AED ${netAmount.toLocaleString()}\n• Standard VAT (5%): AED ${vatAmount.toLocaleString()}\n• *Total Contract Value: AED ${order.amount.toLocaleString()}*\n\n*Logistics:*\n• Scope: ${order.items} Line Item(s)\n• Staging: Jebel Ali Central Distribution Depot\n• Fulfillment Window: Within 48 Hours\n\n*Tax Registration:*\nTRN: 100294827100003\n\nKind regards,\nCommercial Sales & Order Administration\nBaraka Enterprise Management`,
        emailSubject: `OFFICIAL ORDER CONFIRMATION: Commercial Sales Order ${order.id} — Baraka Holding`,
        emailBody: `Dear Procurement & Finance Team,\n\nRE: OFFICIAL COMMERCIAL SALES ORDER CONFIRMATION — REF: ${order.id}\n\nWe have the honor to confirm that Commercial Sales Order ${order.id} has been formally authorized and released for warehouse fulfillment.\n\nCOMMERCIAL & TAX BREAKDOWN:\n=======================================================\nClient Account:      ${order.customer}\nSales Order Ref:     ${order.id}\nDate of Issue:       ${new Date().toLocaleDateString("en-GB")}\nCurrency:            United Arab Emirates Dirham (AED)\n\nNet Commercial Sum:  AED ${netAmount.toLocaleString()}\nStandard VAT (5%):   AED ${vatAmount.toLocaleString()}\nTotal Payable Value: AED ${order.amount.toLocaleString()}\nTax Registration:    TRN 100294827100003\nPayment Terms:       Agreed Commercial Credit Terms\n=======================================================\n\nFULFILLMENT & DISPATCH ADVICE:\nYour consignment is scheduled for release from the Jebel Ali Central Hub within 48 business hours. Delivery notes and electronic tax invoices will accompany the shipment.\n\nShould you require consignment tracking or documentation amendments, please contact our logistics team.\n\nSincerely,\n\nCommercial Director\nBaraka Holding Group\nDubai, United Arab Emirates\nEmail: commercial@baraka.ae | Web: baraka-erp.vercel.app`,
      },
      {
        role: "Warehouse",
        name: "Main Jebel Ali Distribution Hub",
        phone: warehouseContact.phone,
        email: warehouseContact.email,
        whatsAppText: `*BARAKA WAREHOUSE DISPATCH & LOADING DIRECTIVE*\n\nDirective Ref: *DISP-${order.id}*\nAuthorized Order: *${order.id}*\nConsignee: *${order.customer}*\nAuthorized Total: *AED ${order.amount.toLocaleString()}*\n\nAction: Initiate stock picking and staging. Issue Gate Pass upon driver arrival.`,
        emailSubject: `WAREHOUSE DIRECTIVE: Picking, Staging & Dispatch Authorization — Order ${order.id}`,
        emailBody: `To: Duty Warehouse Manager & Dispatch Supervisors\nFrom: Commercial Operations Control\nSubject: Warehouse Dispatch Directive — Order ${order.id}\n\nPlease be advised that Sales Order ${order.id} for account ${order.customer} has cleared commercial risk and credit control authorization.\n\nEXECUTION INSTRUCTIONS:\n1. Pull staged inventory as per Order SKU Schedule.\n2. Verify batch numbers and inspection seals.\n3. Prepare dual-copy Delivery Advice and verify commercial Gate Pass.\n\nAuthorized Value: AED ${order.amount.toLocaleString()}\nPriority: Standard Express Dispatch (48hr SLA)\n\nOperations Control Desk\nBaraka Enterprise Management`,
      },
    ];

    setDispatchModal({ reference: order.id, parties });
    setNotification(`Order ${order.id} authorized. WhatsApp and Corporate Email notices ready.`);
  };

  const handleSmartOrderCreated = (order: { customer: string; amount: number; items: number }) => {
    const newId = `ORD-2026-${String(1204 + orders.length).padStart(5, "0")}`;
    const created = {
      id: newId,
      customer: order.customer,
      amount: order.amount,
      items: order.items,
      status: "Approved" as const,
      riskLevel: "Low" as const,
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [created, ...current]);
    setSmartIngestOpen(false);
    authorizeOrder(created);
  };

  const previewGL = (order: typeof mockSalesOrders[number]) => {
    const netRevenue = Math.round(order.amount / 1.05);
    const vatOutput = order.amount - netRevenue;
    const estimatedCOGS = Math.round(netRevenue * 0.65);

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
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="page-title">Commercial Sales Orders & Multi-Channel Dispatch</h2>
          <p className="page-description">
            Zero-entry WhatsApp ingestion, formal corporate email confirmations, and automated double-entry GL posting.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setSmartIngestOpen(true)}
          >
            <MessageSquare size={13} style={{ color: "#25D366" }} /> WhatsApp / RFQ Ingest
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setDialog("create")}
          >
            <Plus size={13} /> New Order
          </button>
        </div>
      </div>

      {notification && !dispatchModal && (
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
                      {o.status !== "Approved" && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ background: "#25D366", color: "#fff", border: "none" }}
                          onClick={() => authorizeOrder(o)}
                          title="Authorize Order & Open Formal Multi-Channel Dispatch (WhatsApp + Email)"
                        >
                          <Send size={11} /> Authorize & Dispatch
                        </button>
                      )}
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
                        <BookOpen size={12} /> GL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Channel Formal Dispatch Modal */}
      {dispatchModal && (
        <TransactionDispatchModal
          transactionType="Sales Order"
          reference={dispatchModal.reference}
          parties={dispatchModal.parties}
          onClose={() => setDispatchModal(null)}
          onDispatched={() => {
            setNotification(`Formal multi-channel dispatches executed for Order ${dispatchModal.reference}.`);
            setDispatchModal(null);
          }}
        />
      )}

      {/* Smart Order Ingestion Drawer */}
      {smartIngestOpen && (
        <SmartOrderIngestionDrawer
          onClose={() => setSmartIngestOpen(false)}
          onOrderCreated={handleSmartOrderCreated}
        />
      )}

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
