"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, Check, CheckSquare, Download, Pencil, Plus, Search, Square, Trash2, X } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type ModuleColumn = {
  key: string;
  label: string;
  mono?: boolean;
  numeric?: boolean;
};

export type ModuleStat = {
  label: string;
  value: string;
  tone?: "danger" | "warning" | "success" | "info";
};

type ModulePageProps = {
  title: string;
  description: string;
  actionLabel: string;
  columns: ModuleColumn[];
  rows: Record<string, string | number>[];
  stats: ModuleStat[];
};
type SavedView = { name: string; query: string; status: string };

const toneColors = {
  danger: "var(--color-danger)",
  warning: "var(--color-warning)",
  success: "var(--color-success)",
  info: "var(--color-info)",
};

function statusClass(value: string | number) {
  const status = String(value).toLowerCase();
  if (["active", "approved", "paid", "received", "ok", "completed"].includes(status)) return "badge-success";
  if (["critical", "overdue", "rejected", "inactive"].includes(status)) return "badge-danger";
  if (["pending", "under review", "low stock", "submitted", "draft", "scheduled"].includes(status)) return "badge-warning";
  if (["in transit", "transfer opportunity", "partially received"].includes(status)) return "badge-info";
  return "badge-muted";
}

export default function ModulePage({ title, description, actionLabel, columns, rows, stats }: ModulePageProps) {
  const [records, setRecords] = useLocalStorage(`baraka:${title.toLowerCase().replaceAll(" ", "-")}`, rows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [savedViews, setSavedViews] = useLocalStorage<SavedView[]>(`baraka:${title.toLowerCase().replaceAll(" ", "-")}:views`, []);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewName, setViewName] = useState("");
  const [dialog, setDialog] = useState<"create" | "view" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, string | number> | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const statusOptions = Array.from(new Set(records.map((row) => String(row.status ?? "")).filter(Boolean)));
  const rowKey = (row: Record<string, string | number>, index = 0) => String(row.id ?? row[columns[0]?.key] ?? index);
  const filteredRows = useMemo(() => records.filter((row) => {
    const matchesQuery = Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = status === "All statuses" || String(row.status) === status;
    return matchesQuery && matchesStatus;
  }), [query, records, status]);

  const createRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "New record");
    const firstKey = columns[0]?.key || "id";
    const nextRecord: Record<string, string | number> = { [firstKey]: `${title.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`, [columns[1]?.key || "name"]: name };
    if (columns.some((column) => column.key === "status")) nextRecord.status = "Draft";
    setRecords((current) => [nextRecord, ...current]);
    setDialog(null);
  };

  const exportRows = useCallback((rowsToExport = filteredRows) => {
    const csv = [columns.map((column) => column.label).join(","), ...rowsToExport.map((row) => columns.map((column) => JSON.stringify(row[column.key] ?? "")).join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [columns, filteredRows, title]);
  const saveView = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = viewName.trim();
    if (!name) return;
    setSavedViews((current) => [...current.filter((view) => view.name !== name), { name, query, status }]);
    setViewName("");
    setViewDialog(false);
  };
  const toggleSelection = (key: string) => setSelectedKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const visibleKeys = filteredRows.map((row, index) => rowKey(row, index));
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selectedKeys.includes(key));
  const toggleAllVisible = () => setSelectedKeys((current) => allVisibleSelected ? current.filter((key) => !visibleKeys.includes(key)) : [...new Set([...current, ...visibleKeys])]);
  const bulkUpdate = (nextStatus: string) => {
    setRecords((current) => current.map((row, index) => selectedKeys.includes(rowKey(row, index)) ? { ...row, status: nextStatus } : row));
    setSelectedKeys([]);
  };
  const deleteSelected = () => {
    if (selectedKeys.length === 0 || !window.confirm(`Remove ${selectedKeys.length} selected record${selectedKeys.length === 1 ? "" : "s"}?`)) return;
    setRecords((current) => current.filter((row, index) => !selectedKeys.includes(rowKey(row, index))));
    setSelectedKeys([]);
  };
  const exportSelected = () => exportRows(filteredRows.filter((row, index) => selectedKeys.includes(rowKey(row, index))));
  const startEditing = (row: Record<string, string | number>, column: ModuleColumn, index: number) => {
    if (column.key === "id" || column.key === "status" || column.key === "risk") return;
    setEditingKey(`${rowKey(row, index)}:${column.key}`);
    setEditingValue(String(row[column.key] ?? ""));
  };
  const finishEditing = (row: Record<string, string | number>, column: ModuleColumn, index: number) => {
    const key = rowKey(row, index);
    setRecords((current) => current.map((item, itemIndex) => rowKey(item, itemIndex) === key ? { ...item, [column.key]: editingValue.trim() || item[column.key] || "" } : item));
    setEditingKey(null);
  };
  useEffect(() => {
    const handleModuleAction = (event: Event) => {
      const action = (event as CustomEvent<{ action?: string }>).detail?.action;
      if (action === "create") setDialog("create");
      if (action === "export") exportRows();
    };
    window.addEventListener("baraka:module-action", handleModuleAction);
    return () => window.removeEventListener("baraka:module-action", handleModuleAction);
  }, [exportRows]);
  useEffect(() => {
    const handleShortcuts = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".module-search input")?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setDialog("create");
      }
      if (event.key === "Escape") setSelectedKeys([]);
    };
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  return (
    <div>
      <div className="page-header module-header">
        <div>
          <h2 className="page-title">{title}</h2>
          <p className="page-description">{description}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}><Plus size={13} /> {actionLabel}</button>
      </div>

      <div className="kpi-grid module-stats">
        {stats.map((stat) => (
          <div className="kpi-card" key={stat.label}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value" style={stat.tone ? { color: toneColors[stat.tone] } : undefined}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="toolbar module-toolbar">
        <div className="search-bar module-search">
          <Search size={14} style={{ color: "var(--color-text-muted)" }} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
        </div>
        {statusOptions.length > 0 && (
          <select className="form-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All statuses</option>
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        )}
        {savedViews.length > 0 && <select className="form-input saved-view-select" aria-label="Saved views" value="" onChange={(event) => { const view = savedViews.find((item) => item.name === event.target.value); if (view) { setQuery(view.query); setStatus(view.status); } }}><option value="">Saved views</option>{savedViews.map((view) => <option value={view.name} key={view.name}>{view.name}</option>)}</select>}
        <button className="btn btn-secondary btn-sm" title="Save current filters as a view" onClick={() => setViewDialog(true)}><Bookmark size={13} /> Save view</button>
        <button className="btn btn-secondary btn-sm" title="Export current records" onClick={() => exportRows()}><Download size={13} /> Export</button>
        <span className="module-result-count">{filteredRows.length} of {records.length} records</span>
      </div>
      {selectedKeys.length > 0 && <div className="bulk-toolbar" role="toolbar" aria-label="Bulk actions"><span><CheckSquare size={14} /> {selectedKeys.length} selected</span><button className="btn btn-secondary btn-sm" onClick={() => bulkUpdate("Reviewed")}><Check size={13} /> Mark reviewed</button><button className="btn btn-secondary btn-sm" onClick={exportSelected}><Download size={13} /> Export selected</button><button className="btn btn-danger btn-sm" onClick={deleteSelected}><Trash2 size={13} /> Remove</button><button className="btn btn-ghost btn-sm" onClick={() => setSelectedKeys([])}>Clear</button></div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th className="selection-cell"><button className="table-select-button" type="button" onClick={toggleAllVisible} aria-label={allVisibleSelected ? "Clear visible selection" : "Select all visible"}>{allVisibleSelected ? <CheckSquare size={15} /> : <Square size={15} />}</button></th>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={rowKey(row, index)}>
                  <td className="selection-cell"><button className="table-select-button" type="button" onClick={() => toggleSelection(rowKey(row, index))} aria-label={`Select ${rowKey(row, index)}`}>{selectedKeys.includes(rowKey(row, index)) ? <CheckSquare size={15} /> : <Square size={15} />}</button></td>
                  {columns.map((column) => {
                    const value = row[column.key] ?? "-";
                    const isStatus = column.key === "status" || column.key === "risk";
                    const cellKey = `${rowKey(row, index)}:${column.key}`;
                    return <td key={column.key} className={column.mono ? "mono-cell" : ""} style={column.numeric ? { fontWeight: 600 } : undefined} onDoubleClick={() => startEditing(row, column, index)} title={isStatus ? undefined : "Double-click to edit"}>
                      {editingKey === cellKey ? <input className="inline-edit-input" value={editingValue} onChange={(event) => setEditingValue(event.target.value)} onBlur={() => finishEditing(row, column, index)} onKeyDown={(event) => { if (event.key === "Enter") finishEditing(row, column, index); if (event.key === "Escape") setEditingKey(null); }} autoFocus /> : isStatus ? <span className={`badge ${statusClass(value)}`}>{value}</span> : <span className="editable-cell">{value}</span>}
                    </td>;
                  })}
                  <td><div className="table-actions"><button className="btn btn-secondary btn-sm" onClick={() => { setSelectedRow(row); setDialog("view"); }}>View</button><button className="btn btn-ghost btn-sm edit-row-button" onClick={() => startEditing(row, columns.find((column) => column.key !== "id" && column.key !== "status" && column.key !== "risk") ?? columns[0], index)} aria-label="Edit row"><Pencil size={13} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 && <div className="empty-state premium-empty-state"><div className="empty-state-icon"><Search size={20} /></div><strong>{records.length === 0 ? `Your ${title.toLowerCase()} workspace is ready` : "No records match these filters"}</strong><p>{records.length === 0 ? "Create your first record to start building an operating view." : "Try clearing a filter or searching for a different term."}</p>{records.length === 0 ? <button className="btn btn-primary btn-sm" onClick={() => setDialog("create")}><Plus size={13} /> {actionLabel}</button> : <button className="btn btn-secondary btn-sm" onClick={() => { setQuery(""); setStatus("All statuses"); }}>Clear filters</button>}</div>}
        </div>
      </div>
      {dialog && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(null)}>
          <div className="dialog" role="dialog" aria-modal="true" aria-label={dialog === "create" ? actionLabel : "Record details"} onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header"><div><div className="card-title">{dialog === "create" ? actionLabel : "Record details"}</div><div className="card-subtitle">{dialog === "create" ? `Add a new record to ${title.toLowerCase()}.` : "Review the latest record information."}</div></div><button className="btn btn-ghost btn-sm" onClick={() => setDialog(null)}>Close</button></div>
            {dialog === "create" ? <form className="dialog-body" onSubmit={createRecord}><div className="form-group"><label className="form-label">Name or reference</label><input name="name" className="form-input" placeholder="Enter a name or reference" autoFocus required /></div><div className="form-group"><label className="form-label">Notes</label><textarea name="notes" className="form-input" rows={3} placeholder="Add optional context" /></div><div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setDialog(null)}>Cancel</button><button className="btn btn-primary" type="submit">Save record</button></div></form> : <div className="dialog-body">{selectedRow && Object.entries(selectedRow).map(([key, value]) => <div className="eval-row" key={key}><span className="eval-label">{key}</span><span className="eval-value">{value}</span></div>)}<div className="dialog-actions"><button className="btn btn-primary" onClick={() => setDialog(null)}>Done</button></div></div>}
          </div>
        </div>
      )}
      {viewDialog && <div className="dialog-backdrop" role="presentation" onClick={() => setViewDialog(false)}><form className="dialog saved-view-dialog" role="dialog" aria-modal="true" aria-label="Save view" onSubmit={saveView} onClick={(event) => event.stopPropagation()}><div className="dialog-header"><div><div className="card-title">Save current view</div><div className="card-subtitle">Keep these filters ready for your next visit.</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setViewDialog(false)} aria-label="Close"><X size={14} /></button></div><div className="dialog-body"><div className="form-group"><label className="form-label" htmlFor="saved-view-name">View name</label><input id="saved-view-name" className="form-input" value={viewName} onChange={(event) => setViewName(event.target.value)} placeholder="e.g. High-risk invoices" autoFocus required /></div><div className="saved-view-summary"><span>Search: <b>{query || "All records"}</b></span><span>Status: <b>{status}</b></span></div><div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setViewDialog(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save view</button></div></div></form></div>}
    </div>
  );
}