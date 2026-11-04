"use client";

import { useState } from "react";
import { mockUsers } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function UsersPage() {
  const [users, setUsers] = useLocalStorage("baraka:users", mockUsers);
  const [dialog, setDialog] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const selectedUser = users.find((user) => user.id === selectedId);
  const openCreate = () => { setSelectedId(null); setFormError(""); setFormMessage(""); setDialog("create"); };
  const openEdit = (id: string) => { setSelectedId(id); setDialog("edit"); };
  const toggleStatus = (id: string) => setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user));
  const saveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "New User");
    const email = String(form.get("email") || "user@company.ae");
    const role = String(form.get("role") || "Operations Employee");
    const password = String(form.get("password") || "");
    if (dialog === "create") {
      if (password.length < 8) { setFormError("Password must be at least 8 characters."); return; }
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, email, password, role }) });
      const result = await response.json() as { error?: string; user?: { id?: string; email?: string } };
      if (!response.ok) { setFormError(result.error || "Could not create the Supabase user."); return; }
      setUsers((current) => [{ id: result.user?.id || `USR-${String(current.length + 1).padStart(3, "0")}`, name, email, role, branch: "Head Office", status: "Active", lastLogin: new Date().toISOString() }, ...current]);
      setFormMessage("User created in Supabase Auth and added to the local list.");
      setDialog(null);
      return;
    }
    if (dialog === "edit" && selectedId) setUsers((current) => current.map((user) => user.id === selectedId ? { ...user, name, email, role } : user));
    setDialog(null);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Users</h2>
          <p className="page-description">Manage platform users, roles and access levels.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><UserPlus size={13} /> Add User</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{u.email}</td>
                  <td><span className="tag">{u.role}</span></td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{u.branch}</td>
                  <td>
                    <span className={`badge ${u.status === "Active" ? "badge-success" : "badge-muted"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {formatDateTime(u.lastLogin)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u.id)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: u.status === "Active" ? "var(--color-danger)" : "var(--color-success)" }} onClick={() => toggleStatus(u.id)}>
                        {u.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {formMessage && <div className="alert-banner success" style={{ marginBottom: 16 }}>{formMessage}</div>}
      {dialog && <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}><form className="dialog" role="dialog" aria-modal="true" onSubmit={saveUser} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-header"><div><div className="card-title">{dialog === "create" ? "Add user" : "Edit user"}</div><div className="card-subtitle">Set identity and access for this platform user.</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button></div>
        <div className="dialog-body"><div className="form-group"><label className="form-label" htmlFor="user-name">Full name</label><input id="user-name" name="name" className="form-input" defaultValue={selectedUser?.name} required autoFocus /></div><div className="form-group"><label className="form-label" htmlFor="user-email">Work email</label><input id="user-email" name="email" type="email" className="form-input" defaultValue={selectedUser?.email} required /></div>{dialog === "create" && <div className="form-group"><label className="form-label" htmlFor="user-password">Temporary password</label><input id="user-password" name="password" type="password" minLength={8} className="form-input" placeholder="At least 8 characters" required /></div>}<div className="form-group"><label className="form-label" htmlFor="user-role">Role</label><select id="user-role" name="role" className="form-input" defaultValue={selectedUser?.role || "Operations Employee"}><option>Finance Manager</option><option>Procurement Manager</option><option>Inventory Manager</option><option>Operations Employee</option><option>Accountant</option></select></div>{formError && <div className="auth-error" role="alert">{formError}</div>}<div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setDialog(null)}>Cancel</button><button className="btn btn-primary" type="submit">Save user</button></div></div>
      </form></div>}
    </div>
  );
}
