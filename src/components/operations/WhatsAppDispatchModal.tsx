"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  Mail,
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
  email?: string;
  message: string;
  emailSubject?: string;
  emailBody?: string;
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
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "email">("whatsapp");
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
  const sendViaEmail = (recipient: WhatsAppRecipient, index: number) => {
    if (!recipient.email) return;
    const subject = encodeURIComponent(recipient.emailSubject || `Formal ${transactionType} Notice — ${reference}`);
    const body = encodeURIComponent(recipient.emailBody || recipient.message.replace(/\*/g, ""));
    window.open(`mailto:${recipient.email}?subject=${subject}&body=${body}`, "_blank");
    setActiveList((current) => current.map((item, idx) => idx === index ? { ...item, status: "Sent" } : item));
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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="dialog-backdrop dispatch-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog dispatch-modal whatsapp-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(720px, 95vw)" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {activeChannel === "whatsapp" ? <MessageSquare size={17} style={{ color: "#25D366" }} /> : <Mail size={17} style={{ color: "var(--color-accent)" }} />}
              Formal Multi-Channel Transaction Dispatch
            </div>
            <div className="card-subtitle">
              Authorized {transactionType} <span className="mono-cell">{reference}</span> — formal multi-party notifications
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--color-surface-muted)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 7 }}>
              <button type="button" className={`btn btn-sm ${activeChannel === "whatsapp" ? "btn-primary" : "btn-secondary"}`} style={activeChannel === "whatsapp" ? { background: "#25D366", color: "#fff", border: "none" } : undefined} onClick={() => setActiveChannel("whatsapp")}><MessageSquare size={13} /> WhatsApp</button>
              <button type="button" className={`btn btn-sm ${activeChannel === "email" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveChannel("email")}><Mail size={13} /> Corporate Email</button>
            </div>
            <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 size={12} /> {activeChannel === "whatsapp" ? "WhatsApp handoff ready" : "Email handoff ready"}
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
                      onClick={() => copyMessage(activeChannel === "whatsapp" ? rec.message : (rec.emailBody || rec.message.replace(/\*/g, "")), index)}
                      title="Copy message text"
                    >
                      <Copy size={12} /> {copiedIndex === index ? "Copied" : "Copy"}
                    </button>
                    {activeChannel === "whatsapp" ? <button
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
                    </button> : <button type="button" className="btn btn-primary btn-sm" onClick={() => sendViaEmail(rec, index)}><Mail size={13} /> {rec.status === "Sent" ? "Email Opened" : "Open Corporate Email"}</button>}
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
                  {activeChannel === "whatsapp" ? rec.message : (rec.emailBody || rec.message.replace(/\*/g, ""))}
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
    </div>,
    document.body
  );
}
