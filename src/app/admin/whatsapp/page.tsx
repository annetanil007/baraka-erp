"use client";

import { useState } from "react";
import { defaultWhatsAppDirectory, DirectoryContact } from "@/lib/whatsapp-directory";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { MessageSquare, Plus, Search, Edit2, Phone, CheckCircle2, Send } from "lucide-react";

export default function WhatsAppDirectoryPage() {
  const [contacts, setContacts] = useLocalStorage<DirectoryContact[]>(
    "baraka:whatsapp-directory",
    defaultWhatsAppDirectory
  );
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [editingContact, setEditingContact] = useState<DirectoryContact | null>(null);
  const [toast, setToast] = useState("");

  const filtered = contacts.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.id.toLowerCase().includes(query.toLowerCase());
    const matchesType = selectedType === "All" || c.type === selectedType;
    return matchesQuery && matchesType;
  });

  const saveContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = editingContact?.id ? editingContact.id : `DIR-${Date.now().toString().slice(-4)}`;
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const email = String(form.get("email") || "");
    const type = form.get("type") as DirectoryContact["type"];

    const updated: DirectoryContact = {
      id,
      name,
      phone,
      email,
      type,
      countryCode: "AE",
      status: "Active",
    };

    if (editingContact?.id) {
      setContacts((cur) => cur.map((item) => (item.id === id ? updated : item)));
      setToast(`Updated WhatsApp number for ${name} (${phone})`);
    } else {
      setContacts((cur) => [updated, ...cur]);
      setToast(`Added new contact ${name} with WhatsApp ${phone}`);
    }
    setEditingContact(null);
  };

  const sendTestPing = (c: DirectoryContact) => {
    const cleanPhone = c.phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${c.name}, this is a test notification from the Baraka Enterprise Management System. WhatsApp transaction dispatches are active for your account.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6, color: "#25D366" }}>
            <MessageSquare size={14} /> Omni-Channel Communication Hub
          </div>
          <h2 className="page-title">WhatsApp Directory & Automated Dispatch Setup</h2>
          <p className="page-description">
            Maintain verified WhatsApp numbers for Clients, Vendors, and Branch Managers. Approved orders & payments auto-route here.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() =>
            setEditingContact({
              id: "",
              name: "",
              phone: "+9715",
              email: "",
              type: "Customer",
              countryCode: "AE",
              status: "Active",
            })
          }
        >
          <Plus size={13} /> Add Directory Number
        </button>
      </div>

      {toast && (
        <div className="toast" role="status" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={15} /> {toast}
          <button type="button" onClick={() => setToast("")}>Dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-label">Verified Client Numbers</div>
          <div className="kpi-value">{contacts.filter((c) => c.type === "Customer").length} Clients</div>
          <div className="kpi-sub kpi-trend-up">Order & SOA routing active</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Vendor Procurement Dispatch</div>
          <div className="kpi-value">{contacts.filter((c) => c.type === "Supplier").length} Suppliers</div>
          <div className="kpi-sub">PO & remittance routing</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Dealers & Branch Managers</div>
          <div className="kpi-value">{contacts.filter((c) => c.type === "Branch").length} Locations</div>
          <div className="kpi-sub">Warehouse pick-list alerts</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">API Gateway Status</div>
          <div className="kpi-value" style={{ color: "var(--color-success)" }}>Connected</div>
          <div className="kpi-sub">WhatsApp Cloud API & Direct</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar module-toolbar">
        <div className="search-bar module-search">
          <Search size={14} style={{ color: "var(--color-text-muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, contact ID, or phone number..."
          />
        </div>
        <select
          className="form-input"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Contact Types</option>
          <option value="Customer">Clients / Customers</option>
          <option value="Supplier">Vendors / Suppliers</option>
          <option value="Branch">Dealers / Branches</option>
        </select>
        <span className="module-result-count">{filtered.length} numbers registered</span>
      </div>

      {/* Directory Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name / Entity</th>
                <th>WhatsApp Phone</th>
                <th>Email Address</th>
                <th>Dispatch Rules</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span
                      className={`badge ${
                        c.type === "Customer"
                          ? "badge-success"
                          : c.type === "Supplier"
                          ? "badge-info"
                          : "badge-primary"
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    <div style={{ fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                      <Phone size={13} style={{ color: "#25D366" }} /> {c.phone}
                    </div>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{c.email}</td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {c.type === "Customer"
                      ? "Sales Confirmations, Statements"
                      : c.type === "Supplier"
                      ? "Purchase Orders, Remittances"
                      : "Internal Warehouse Pick-Lists"}
                  </td>
                  <td>
                    <span className="badge badge-success">Verified</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => sendTestPing(c)}
                        title="Send test WhatsApp message"
                      >
                        <Send size={12} style={{ color: "#25D366" }} /> Test Ping
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingContact(c)}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Contact Modal */}
      {editingContact && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setEditingContact(null)}>
          <form
            className="dialog"
            role="dialog"
            aria-modal="true"
            onSubmit={saveContact}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(480px, 95vw)" }}
          >
            <div className="dialog-header">
              <div>
                <div className="card-title">
                  {editingContact.id ? `Edit WhatsApp Number — ${editingContact.name}` : "Register New WhatsApp Number"}
                </div>
                <div className="card-subtitle">
                  Ensure phone format includes country code (e.g. +971501234567)
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setEditingContact(null)}
              >
                Close
              </button>
            </div>
            <div className="dialog-body">
              <div className="form-group">
                <label className="form-label">Contact / Organization Name</label>
                <input
                  name="name"
                  className="form-input"
                  defaultValue={editingContact.name}
                  placeholder="e.g. Falcon Industrial LLC"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Phone (International Format)</label>
                <input
                  name="phone"
                  className="form-input"
                  defaultValue={editingContact.phone}
                  placeholder="+971501234567"
                  required
                />
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                  Include + and country code. UAE numbers start with +971.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  defaultValue={editingContact.email}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Category</label>
                <select name="type" className="form-input" defaultValue={editingContact.type}>
                  <option value="Customer">Client / Customer</option>
                  <option value="Supplier">Vendor / Supplier</option>
                  <option value="Branch">Dealer / Branch Manager</option>
                </select>
              </div>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingContact(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Verified Number
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
