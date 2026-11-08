"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Copy,
  Send,
  X,
  UserCheck,
  Building,
  Truck,
  Phone,
} from "lucide-react";

export type WhatsAppRecipient = {
  role: "Client" | "Vendor" | "Branch Manager" | "Warehouse";
  name: string;
  phone: string;
  message: string;
  status?: "Ready" | "Sent" | "Queued";
};

export default function WhatsAppDispatchModal({
  transactionType,
  reference,
  recipients,
  onClose,
  onDispatched,
}: {
  transactionType: "Sales Order" | "Purchase Order" | "Invoice Settlement" | "Customer Credit Notice";
  reference: string;
  recipients: WhatsAppRecipient[];
  onClose: () => void;
  onDispatched?: () => void;
}) {
  const [activeList, setActiveList] = useState<WhatsAppRecipient[]>(
    recipients.map((r) => ({ ...r, status: "Ready" }))
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sendDirectViaWhatsApp = (recipient: WhatsAppRecipient, index: number) => {
    // Format phone: remove spaces, +, -, etc.
    const cleanPhone = recipient.phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(recipient.message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // Open WhatsApp Web/Desktop in new tab
    window.open(waUrl, "_blank");

    // Mark as sent
    setActiveList((current) =>
      current.map((item, idx) => (idx === index ? { ...item, status: "Sent" } : item))
    );
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const markAllDispatched = () => {
    setActiveList((current) => current.map((item) => ({ ...item, status: "Sent" })));
    if (onDispatched) onDispatched();
  };

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog whatsapp-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(720px, 95vw)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={17} style={{ color: "#25D366" }} />
              WhatsApp Automated Transaction Dispatch
            </div>
            <div className="card-subtitle">
              Authorized {transactionType} <span className="mono-cell">{reference}</span> — multi-party notifications
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--color-surface-muted)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>
              Upon transaction approval, official document digests are queued for instant WhatsApp dispatch.
            </span>
            <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 size={12} /> WhatsApp Business API Ready
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeList.map((rec, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: 14,
                  borderLeft: `3px solid ${
                    rec.role === "Client"
                      ? "#25D366"
                      : rec.role === "Vendor"
                      ? "var(--color-accent)"
                      : "var(--color-primary)"
                  }`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="tag" style={{ fontWeight: 600, fontSize: 11 }}>
                        {rec.role}
                      </span>
                      <strong style={{ fontSize: 13 }}>{rec.name}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={12} /> {rec.phone}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => copyMessage(rec.message, index)}
                      title="Copy message text"
                    >
                      <Copy size={12} /> {copiedIndex === index ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        background: rec.status === "Sent" ? "var(--color-success)" : "#25D366",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      onClick={() => sendDirectViaWhatsApp(rec, index)}
                    >
                      {rec.status === "Sent" ? <CheckCircle2 size={13} /> : <Send size={13} />}
                      {rec.status === "Sent" ? "Sent via WhatsApp" : "Send WhatsApp"}
                    </button>
                  </div>
                </div>

                {/* Formatted Message Preview */}
                <pre
                  style={{
                    background: "var(--color-surface-muted)",
                    padding: 10,
                    borderRadius: "var(--radius-sm)",
                    fontSize: 11.5,
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {rec.message}
                </pre>
              </div>
            ))}
          </div>

          <div className="dialog-actions" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Dismiss
            </button>
            <button type="button" className="btn btn-primary" onClick={markAllDispatched}>
              Mark All Dispatched & Save Audit Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
