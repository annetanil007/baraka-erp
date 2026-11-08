"use client";

import { useState } from "react";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus, Send, CheckCircle, Eye, Split, MessageSquare, Mail } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import TransactionDispatchModal, { DispatchParty } from "@/components/TransactionDispatchModal";
import { defaultWhatsAppDirectory } from "@/lib/whatsapp-directory";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useLocalStorage("baraka:purchase-orders", mockPurchaseOrders);
  const [dialog, setDialog] = useState<"create" | "view" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockPurchaseOrders[number] | null>(null);
  const [dispatchModal, setDispatchModal] = useState<{ reference: string; parties: DispatchParty[] } | null>(null);
  const [notification, setNotification] = useState("");

  const authorizeAndSendPO = (po: typeof mockPurchaseOrders[number]) => {
    const supplierContact = defaultWhatsAppDirectory.find(
      (c) => c.name.toLowerCase().includes(po.supplier.toLowerCase())
    ) || { phone: "+971505551212", email: "sales@gulftrading.ae" };

    const warehouseContact = defaultWhatsAppDirectory.find((c) => c.type === "Branch") || {
      phone: "+971501112233",
      email: "receiving@baraka.ae",
    };

    const netAmount = Math.round(po.amount / 1.05);
    const vatAmount = po.amount - netAmount;

    const parties: DispatchParty[] = [
      {
        role: "Vendor",
        name: po.supplier,
        phone: supplierContact.phone,
        email: supplierContact.email,
        whatsAppText: `*BARAKA HOLDING | OFFICIAL PURCHASE ORDER TRANSMITTAL*\n\nAuthorized PO Ref: *${po.id}*\nVendor: *${po.supplier}*\n\n*Contract Commitments:*\n• Contract Sum: AED ${po.amount.toLocaleString()}\n• Ordered Units: ${po.orderedQty} Units\n• Inbound Delivery Site: Main Jebel Ali Dock 4\n• Payment Term: Net 30 Days from GRN verification\n\nPlease confirm delivery schedule and dispatch driver details.\n\nProcurement & Supply Chain Division\nBaraka Enterprise Management`,
        emailSubject: `OFFICIAL PURCHASE ORDER: Transmittal Ref ${po.id} — Baraka Holding`,
        emailBody: `Dear Commercial & Dispatch Team at ${po.supplier},\n\nRE: OFFICIAL PURCHASE ORDER AUTHORIZATION — REF: ${po.id}\n\nPlease accept this formal procurement notice as legally binding authorization for Purchase Order ${po.id}.\n\nPURCHASE SPECIFICATION & CONTRACT SUM:\n=======================================================\nVendor Entity:       ${po.supplier}\nPurchase Order:      ${po.id}\nIssuance Date:       ${new Date().toLocaleDateString("en-GB")}\nCurrency:            United Arab Emirates Dirham (AED)\n\nContracted Net Sum:  AED ${netAmount.toLocaleString()}\nApplicable VAT (5%): AED ${vatAmount.toLocaleString()}\nTotal Committed Sum: AED ${po.amount.toLocaleString()}\nOrdered Quantity:    ${po.orderedQty} Standard Verified Units\nTax Registration:    Buyer TRN 100294827100003\n=======================================================\n\nDELIVERY & INTAKE PROTOCOL:\nConsignments must be delivered to Baraka Central Warehouse, Jebel Ali Free Zone, accompanied by dual-copy Delivery Notes bearing PO Ref ${po.id}.\n\nGoods will undergo formal physical intake verification before Goods Receipt Notes (GRN) and payment approvals are issued.\n\nSincerely,\n\nDirector of Procurement & Supply Chain\nBaraka Holding Group\nDubai, United Arab Emirates\nEmail: procurement@baraka.ae | Web: baraka-erp.vercel.app`,
      },
      {
        role: "Branch Manager",
        name: "Main Jebel Ali Receiving Dock",
        phone: warehouseContact.phone,
        email: warehouseContact.email,
        whatsAppText: `*WAREHOUSE INBOUND ADVANCE NOTICE*\n\nAuthorized PO Ref: *${po.id}*\nSupplier: *${po.supplier}*\nInbound Volume: *${po.orderedQty} units*\nValuation: *AED ${po.amount.toLocaleString()}*\n\nPlease stage receiving dock and prepare GRN verification log.`,
        emailSubject: `INBOUND ADVANCE NOTICE: Authorized PO ${po.id} from ${po.supplier}`,
        emailBody: `To: Inbound Logistics & Receiving Quality Inspection\nSubject: Authorized PO ${po.id} — Receiving Staging Directive\n\nPlease note that Purchase Order ${po.id} for supplier ${po.supplier} has been approved.\n\nKey Parameters:\n• Expected Quantity: ${po.orderedQty} units\n• Procurement Value: AED ${po.amount.toLocaleString()}\n• Delivery Port: Receiving Bay 2\n\nMandatory Protocol:\nPerform physical piece count and package integrity checks. Discrepancies between physical count and invoice must be flagged in the 3-Way Match engine immediately.\n\nProcurement Operations Control\nBaraka Enterprise Management`,
      },
    ];

    setDispatchModal({ reference: po.id, parties });
    setNotification(`Purchase Order ${po.id} authorized. WhatsApp and Corporate Email notices generated.`);
  };

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <h2 className="page-title">Purchase Orders & Supplier Contract Dispatch</h2>
          <p className="page-description">
            Generate legally binding purchase commitments with automated WhatsApp & formal corporate email dispatches.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}>
          <Plus size={13} /> New Purchase Order
        </button>
      </div>

      {notification && !dispatchModal && (
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
                        title="Authorize PO and send formal multi-channel dispatch (WhatsApp + Email)"
                      >
                        <Send size={11} /> Authorize & Dispatch
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

      {/* Multi-Channel Formal Dispatch Modal */}
      {dispatchModal && (
        <TransactionDispatchModal
          transactionType="Purchase Order"
          reference={dispatchModal.reference}
          parties={dispatchModal.parties}
          onClose={() => setDispatchModal(null)}
          onDispatched={() => {
            setNotification(`Formal PO dispatches logged for ${dispatchModal.reference}.`);
            setDispatchModal(null);
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
