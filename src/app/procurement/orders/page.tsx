"use client";

import { useState } from "react";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus, Send, CheckCircle, Eye, Split, MessageSquare } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import WhatsAppDispatchModal, { WhatsAppRecipient } from "@/components/WhatsAppDispatchModal";
import { getWhatsAppNumber } from "@/lib/whatsapp-directory";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useLocalStorage("baraka:purchase-orders", mockPurchaseOrders);
  const [dialog, setDialog] = useState<"create" | "view" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockPurchaseOrders[number] | null>(null);
  const [whatsAppDispatch, setWhatsAppDispatch] = useState<{ reference: string; recipients: WhatsAppRecipient[] } | null>(null);
  const [notification, setNotification] = useState("");

  const authorizeAndSendPO = (po: typeof mockPurchaseOrders[number]) => {
    const supplierPhone = getWhatsAppNumber(po.supplier, "+971505551212");
    const warehousePhone = getWhatsAppNumber("Main Warehouse", "+971501112233");

    const recipients: WhatsAppRecipient[] = [
      {
        role: "Vendor",
        name: po.supplier,
        phone: supplierPhone,
        message: `*Baraka Enterprise Purchase Order Notice*\n\nDear Sales Team at ${po.supplier},\nPurchase Order *${po.id}* has been officially authorized.\n\n*Ordered Quantity:* ${po.orderedQty} units\n*Committed Value:* AED ${po.amount.toLocaleString()}\n*Delivery Location:* Main Warehouse (Jebel Ali Free Zone)\n\nPlease reply with expected dispatch date and delivery truck driver details.\n\nThank you,\nProcurement Department`,
      },
      {
        role: "Branch Manager",
        name: "Jebel Ali Receiving Dock",
        phone: warehousePhone,
        message: `*Inbound PO Advance Notice*\n\nAuthorized PO *${po.id}* from *${po.supplier}*.\nExpected delivery: ${po.orderedQty} units (Valuation: AED ${po.amount.toLocaleString()}).\nPrepare Goods Receipt Note (GRN) upon physical arrival.`,
      },
    ];

    setWhatsAppDispatch({ reference: po.id, recipients });
    setNotification(`Purchase Order ${po.id} authorized! Vendor WhatsApp dispatch queued.`);
  };

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <h2 className="page-title">Purchase Orders & Supplier Contract Dispatch</h2>
          <p className="page-description">
            Generate legally binding purchase commitments with automated WhatsApp dispatches to approved vendors.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}>
          <Plus size={13} /> New Purchase Order
        </button>
      </div>

      {notification && (
        <div className="toast" role="status">
          <CheckCircle size={15} /> {notification}
          <button type="button" onClick={() => setNotification("")}>Dismiss</button>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier / Vendor</th>
                <th style={{ textAlign: "right" }}>Contract Amount</th>
                <th style={{ textAlign: "right" }}>Ordered Qty</th>
                <th style={{ textAlign: "right" }}>Received Qty</th>
                <th style={{ textAlign: "right" }}>Invoiced Qty</th>
                <th>Institutional Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((po) => (
                <tr key={po.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{po.id}</td>
                  <td style={{ fontWeight: 600 }}>{po.supplier}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                    {formatCurrency(po.amount)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{po.orderedQty}</td>
                  <td style={{ textAlign: "right", color: po.receivedQty < po.orderedQty ? "var(--color-warning)" : "inherit" }}>
                    {po.receivedQty}
                  </td>
                  <td style={{ textAlign: "right", color: po.invoicedQty > po.receivedQty ? "var(--color-danger)" : "inherit" }}>
                    {po.invoicedQty}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "#25D366", color: "#fff", border: "none" }}
                        onClick={() => authorizeAndSendPO(po)}
                        title="Authorize PO and send WhatsApp dispatch to Supplier"
                      >
                        <Send size={11} /> Authorize & WhatsApp Vendor
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setSelectedOrder(po); setDialog("view"); }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Multi-Party Dispatch Modal */}
      {whatsAppDispatch && (
        <WhatsAppDispatchModal
          transactionType="Purchase Order"
          reference={whatsAppDispatch.reference}
          recipients={whatsAppDispatch.recipients}
          onClose={() => setWhatsAppDispatch(null)}
          onDispatched={() => {
            setNotification(`Purchase Order ${whatsAppDispatch.reference} sent to Vendor & Receiving Dock via WhatsApp.`);
            setWhatsAppDispatch(null);
          }}
        />
      )}

      {/* View Details */}
      {dialog === "view" && selectedOrder && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>
          <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <div className="card-title">Purchase Order Details — {selectedOrder.id}</div>
                <div className="card-subtitle">Contract commitments and fulfillment records</div>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button>
            </div>
            <div className="dialog-body">
              {Object.entries(selectedOrder).map(([key, value]) => (
                <div className="eval-row" key={key}>
                  <span className="eval-label">{key}</span>
                  <span className="eval-value">{key === "amount" ? formatCurrency(Number(value)) : String(value)}</span>
                </div>
              ))}
              <div className="dialog-actions">
                <button type="button" className="btn btn-primary" onClick={() => setDialog(null)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
