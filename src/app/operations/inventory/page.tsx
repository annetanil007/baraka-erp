"use client";

import { useMemo, useState } from "react";
import { mockInventory } from "@/lib/mock-data";
import { AlertTriangle, TrendingDown, ArrowRightLeft, Plus } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import ActionButton from "@/components/shared/ActionButton";

const STATUS_CLASS: Record<string, string> = {
  OK: "badge-success",
  "Low Stock": "badge-warning",
  Critical: "badge-danger",
  "Transfer Opportunity": "badge-info",
};

export default function InventoryPage() {
  const [products, setProducts] = useLocalStorage("baraka:inventory", mockInventory);
  const [dialog, setDialog] = useState(false);
  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => products.filter((product) => [product.name, product.sku, product.oemNumber, product.barcode, product.fitment, product.category].some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))), [products, search]);
  const critical = products.filter((p) => p.status === "Critical");
  const lowStock = products.filter((p) => p.status === "Low Stock");
  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "New product");
    const sku = String(form.get("sku") || "NEW-SKU");
    const category = String(form.get("category") || "General");
    const stock = Number(form.get("stock") || 0);
    const minStock = Number(form.get("minStock") || 0);
    const oemNumber = String(form.get("oemNumber") || "Review OEM");
    const barcode = String(form.get("barcode") || "Review barcode");
    const fitment = String(form.get("fitment") || "Universal");
    setProducts((current) => [{ id: `PROD-${String(500 + current.length).padStart(4, "0")}`, name, category, sku, oemNumber, barcode, fitment, stock, minStock, unit: "Units", branch: "Main Warehouse", avgDailyDemand: 0, supplierLeadDays: 0, status: stock <= minStock ? "Low Stock" : "OK", daysUntilShortfall: null }, ...current]);
    setDialog(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-description">
            Real-time stock levels with demand projections and operational alerts.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setDialog(true)}><Plus size={13} /> Add Product</button>
      </div>

      {/* Demand Projection Alerts */}
      {(critical.length > 0 || lowStock.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {critical.map((p) => (
            <div key={p.id} className="alert-banner danger">
              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Demand Projection — {p.name}:</strong> Stock is projected to fall below operational
                requirements within {p.daysUntilShortfall} day{p.daysUntilShortfall !== 1 ? "s" : ""}.
                Supplier lead time is {p.supplierLeadDays} days. Procurement action required immediately.
              </div>
            </div>
          ))}
          {lowStock.map((p) => (
            <div key={p.id} className="alert-banner warning">
              <TrendingDown size={15} style={{ flexShrink: 0 }} />
              <div>
                <strong>Demand Projection — {p.name}:</strong> Stock is projected to fall below operational
                requirements within {p.daysUntilShortfall} days. Current supplier lead time is {p.supplierLeadDays} days.
                Procurement action is recommended.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="toolbar inventory-toolbar"><div className="search-bar module-search"><span className="search-prefix">Part</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, OEM, barcode, vehicle..." /></div><span className="module-result-count">{filteredProducts.length} of {products.length} parts</span></div>
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>OEM / Barcode</th>
                <th>Vehicle fitment</th>
                <th>Category</th>
                <th>Branch</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Daily Demand</th>
                <th>Lead Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{item.id}</div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{item.sku}</td>
                  <td><div className="mono-cell">{item.oemNumber}</div><div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 3 }}>{item.barcode}</div></td>
                  <td style={{ color: "var(--color-text-secondary)", maxWidth: 180 }}>{item.fitment}</td>
                  <td><span className="tag">{item.category}</span></td>
                  <td style={{ color: "var(--color-text-secondary)" }}>{item.branch}</td>
                  <td style={{
                    fontWeight: 600,
                    color: item.status === "Critical" ? "var(--color-danger)" :
                           item.status === "Low Stock" ? "var(--color-warning)" : "var(--color-text-primary)"
                  }}>
                    {item.stock} {item.unit}
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>{item.minStock}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {item.avgDailyDemand} / day
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {item.supplierLeadDays} days
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[item.status] ?? "badge-muted"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <ActionButton label={`View ${item.name}`} />
                      {item.status === "Transfer Opportunity" && (
                        <ActionButton label={`Transfer ${item.name}`} className="btn btn-accent btn-sm">
                          <ArrowRightLeft size={11} /> Transfer
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {dialog && <div className="dialog-backdrop" role="presentation" onClick={() => setDialog(false)}><form className="dialog" role="dialog" aria-modal="true" onSubmit={addProduct} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-header"><div><div className="card-title">Add product</div><div className="card-subtitle">Create a stock item for the main warehouse.</div></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setDialog(false)}>Close</button></div>
        <div className="dialog-body"><div className="form-group"><label className="form-label" htmlFor="product-name">Product name</label><input id="product-name" name="name" className="form-input" placeholder="e.g. Brake pad set" required autoFocus /></div><div className="grid-2"><div className="form-group"><label className="form-label" htmlFor="product-sku">Internal SKU</label><input id="product-sku" name="sku" className="form-input" placeholder="SKU-001" required /></div><div className="form-group"><label className="form-label" htmlFor="product-category">Category</label><input id="product-category" name="category" className="form-input" placeholder="Brakes, filters..." required /></div></div><div className="grid-2"><div className="form-group"><label className="form-label" htmlFor="product-oem">OEM / part number</label><input id="product-oem" name="oemNumber" className="form-input" placeholder="e.g. 04465-0K240" required /></div><div className="form-group"><label className="form-label" htmlFor="product-barcode">Barcode</label><input id="product-barcode" name="barcode" className="form-input" inputMode="numeric" placeholder="Scan or enter barcode" required /></div></div><div className="form-group"><label className="form-label" htmlFor="product-fitment">Vehicle fitment</label><input id="product-fitment" name="fitment" className="form-input" placeholder="Make, model, year range, engine" required /></div><div className="grid-2"><div className="form-group"><label className="form-label" htmlFor="product-stock">Opening stock</label><input id="product-stock" name="stock" className="form-input" type="number" min="0" required /></div><div className="form-group"><label className="form-label" htmlFor="product-min-stock">Minimum stock</label><input id="product-min-stock" name="minStock" className="form-input" type="number" min="0" required /></div></div><div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setDialog(false)}>Cancel</button><button className="btn btn-primary" type="submit">Save product</button></div></div>
      </form></div>}
    </div>
  );
}
