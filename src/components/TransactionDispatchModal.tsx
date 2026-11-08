"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  Mail,
  CheckCircle2,
  Copy,
  Send,
  X,
  Phone,
  Building2,
  ShieldCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

export type DispatchParty = {
  role: "Client" | "Vendor" | "Branch Manager" | "Warehouse";
  name: string;
  phone: string;
  email: string;
  whatsAppText: string;
  emailSubject: string;
  emailBody: string;
  status?: "Ready" | "Sent" | "Queued";
};

export default function TransactionDispatchModal({
  transactionType,
  reference,
  parties,
  onClose,
  onDispatched,
}: {
  transactionType: "Sales Order" | "Purchase Order" | "Invoice Settlement" | "Credit Notice";
  reference: string;
  parties: DispatchParty[];
  onClose: () => void;
  onDispatched?: () => void;
}) {
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [activeList, setActiveList] = useState<DispatchParty[]>(
    parties.map((p) => ({ ...p, status: "Ready" }))
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sendWhatsApp = (party: DispatchParty, index: number) => {
    const cleanPhone = party.phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(party.whatsAppText);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
    markSent(index);
  };

  const sendEmail = (party: DispatchParty, index: number) => {
    const subject = encodeURIComponent(party.emailSubject);
    const body = encodeURIComponent(party.emailBody);
    window.open(`mailto:${party.email}?subject=${subject}&body=${body}`, "_blank");
    markSent(index);
  };

  const markSent = (index: number) => {
    setActiveList((current) =>
      current.map((item, idx) => (idx === index ? { ...item, status: "Sent" } : item))
    );
  };

  const copyContent = (text: string, index: number) => {
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
        className="dialog transaction-dispatch-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(820px, 95vw)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="dialog-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} style={{ color: "var(--color-primary)" }} />
              Authorized Transaction Multi-Channel Dispatch
            </div>
            <div className="card-subtitle">
              Formal Document Delivery for {transactionType} <span className="mono-cell">{reference}</span>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Channel Selector Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-surface-muted)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className={`btn btn-sm ${activeChannel === "whatsapp" ? "btn-primary" : "btn-secondary"}`}
                style={activeChannel === "whatsapp" ? { background: "#25D366", color: "#fff", border: "none" } : undefined}
                onClick={() => setActiveChannel("whatsapp")}
              >
                <MessageSquare size={13} /> WhatsApp Instant Digest
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeChannel === "email" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveChannel("email")}
              >
                <Mail size={13} /> Formal Corporate Email Notice
              </button>
            </div>
            <span style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>
              {activeList.filter((p) => p.status === "Sent").length} of {activeList.length} dispatched
            </span>
          </div>

          {/* Party List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activeList.map((party, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: 16,
                  borderLeft: `4px solid ${
                    party.role === "Client"
                      ? "#25D366"
                      : party.role === "Vendor"
                      ? "var(--color-accent)"
                      : "var(--color-primary)"
                  }`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="tag" style={{ fontWeight: 600, fontSize: 11 }}>
                        {party.role}
                      </span>
                      <strong style={{ fontSize: 13.5 }}>{party.name}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 3, display: "flex", gap: 16 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Phone size={12} style={{ color: "#25D366" }} /> {party.phone}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Mail size={12} style={{ color: "var(--color-text-muted)" }} /> {party.email}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        copyContent(
                          activeChannel === "whatsapp" ? party.whatsAppText : party.emailBody,
                          index
                        )
                      }
                      title="Copy text to clipboard"
                    >
                      <Copy size={12} /> {copiedIndex === index ? "Copied" : "Copy Content"}
                    </button>

                    {activeChannel === "whatsapp" ? (
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{
                          background: party.status === "Sent" ? "var(--color-success)" : "#25D366",
                          color: "#fff",
                          border: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => sendWhatsApp(party, index)}
                      >
                        {party.status === "Sent" ? <CheckCircle2 size={13} /> : <Send size={13} />}
                        {party.status === "Sent" ? "WhatsApp Sent" : "Send WhatsApp"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                        onClick={() => sendEmail(party, index)}
                      >
                        {party.status === "Sent" ? <CheckCircle2 size={13} /> : <Send size={13} />}
                        {party.status === "Sent" ? "Email Opened" : "Open Email Client"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                {activeChannel === "whatsapp" ? (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                      WhatsApp Message Preview:
                    </span>
                    <pre
                      style={{
                        background: "var(--color-surface-muted)",
                        padding: 12,
                        borderRadius: "var(--radius-sm)",
                        fontSize: 11.5,
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.45,
                        marginTop: 4,
                      }}
                    >
                      {party.whatsAppText}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--color-text-muted)" }}>Subject: </span>
                      <strong style={{ color: "var(--color-text-primary)" }}>{party.emailSubject}</strong>
                    </div>
                    <pre
                      style={{
                        background: "var(--color-surface-muted)",
                        padding: 14,
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.5,
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {party.emailBody}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="dialog-actions" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Dismiss
            </button>
            <button type="button" className="btn btn-primary" onClick={markAllDispatched}>
              Mark All Dispatched & Save Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
