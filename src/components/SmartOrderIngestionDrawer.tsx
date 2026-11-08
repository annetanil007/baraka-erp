"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  X,
  FileUp,
} from "lucide-react";

export type ParsedOrderLine = {
  sku: string;
  name: string;
  requestedQty: number;
  availableStock: number;
  branchStock: number;
  unitPrice: number;
  status: "in_stock" | "partial_branch" | "backorder";
};

export default function SmartOrderIngestionDrawer({
  onClose,
  onOrderCreated,
}: {
  onClose: () => void;
  onOrderCreated: (order: { customer: string; amount: number; items: number }) => void;
}) {
  const [rawText, setRawText] = useState(
    `Salam Ahmed,\nPls book for Falcon Industrial LLC:\n- 15 units of Industrial Filter Type A (SKU: IFA-441)\n- 4 units Hydraulic Pump 5HP (SKU: HP5-220)\n- 20 units Safety Valve 2-inch (SKU: SV2-115)\nDeliver to Sharjah site by Thursday.`
  );

  const [customerName, setCustomerName] = useState("Falcon Industrial LLC");
  const [parsedLines, setParsedLines] = useState<ParsedOrderLine[]>([
    {
      sku: "IFA-441",
      name: "Industrial Filter Type A",
      requestedQty: 15,
      availableStock: 24,
      branchStock: 10,
      unitPrice: 185,
      status: "in_stock",
    },
    {
      sku: "HP5-220",
      name: "Hydraulic Pump 5HP",
      requestedQty: 4,
      availableStock: 8,
      branchStock: 2,
      unitPrice: 4840,
      status: "in_stock",
    },
    {
      sku: "SV2-115",
      name: "Safety Valve 2-inch",
      requestedQty: 20,
      availableStock: 150,
      branchStock: 50,
      unitPrice: 320,
      status: "in_stock",
    },
  ]);

  const totalOrderValue = parsedLines.reduce(
    (acc, line) => acc + line.requestedQty * line.unitPrice,
    0
  );

  const handleCreate = () => {
    onOrderCreated({
      customer: customerName,
      amount: totalOrderValue,
      items: parsedLines.length,
    });
  };

  return (
    <div className="dialog-backdrop smart-ingestion-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog smart-ingestion-drawer"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(740px, 95vw)" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={16} style={{ color: "var(--color-success)" }} />
              Smart WhatsApp & Raw RFQ Order Ingestion
            </div>
            <div className="card-subtitle">
              Instant AI extraction of Customer, SKUs, and inventory availability validation.
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Input Area */}
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Paste Raw Order Text, WhatsApp Quote, or Email:</span>
              <span style={{ fontSize: 11, color: "var(--color-accent)" }}>Auto-NLP extraction active</span>
            </label>
            <textarea
              className="form-input"
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste unstructured customer message..."
              style={{ fontSize: 12.5, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Identified Customer Account</label>
              <input
                className="form-input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Order Total Valuation</label>
              <input
                className="form-input"
                disabled
                value={formatCurrency(totalOrderValue)}
                style={{ fontWeight: 700, color: "var(--color-primary)" }}
              />
            </div>
          </div>

          {/* Parsed Line Items Table with Inventory Check */}
          <div>
            <div className="section-heading" style={{ marginBottom: 8 }}>
              Extracted Line Items & Live Warehouse Check
            </div>
            <div className="table-container">
              <table className="data-table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th>SKU & Product Name</th>
                    <th style={{ textAlign: "right" }}>Req. Qty</th>
                    <th style={{ textAlign: "right" }}>Warehouse Stock</th>
                    <th style={{ textAlign: "right" }}>Unit Price</th>
                    <th style={{ textAlign: "right" }}>Subtotal</th>
                    <th>Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedLines.map((line) => (
                    <tr key={line.sku}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{line.name}</div>
                        <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                          {line.sku}
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{line.requestedQty}</td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ color: line.availableStock >= line.requestedQty ? "var(--color-success)" : "var(--color-danger)" }}>
                          {line.availableStock} on hand
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace" }}>{formatCurrency(line.unitPrice)}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                        {formatCurrency(line.requestedQty * line.unitPrice)}
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <CheckCircle2 size={11} /> 100% Stocked
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Note */}
          <div style={{ background: "var(--color-surface-muted)", padding: 10, borderRadius: "var(--radius-md)", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Boxes size={15} style={{ color: "var(--color-primary)" }} />
            <span>Delivery Instructions parsed: <strong>Deliver to Sharjah site by Thursday</strong>. Priority: Normal.</span>
          </div>

          <div className="dialog-actions" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              Generate & Authorize Sales Order ({formatCurrency(totalOrderValue)}) <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
