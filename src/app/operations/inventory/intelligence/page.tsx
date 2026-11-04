"use client";

import { ArrowRight, ArrowRightLeft, Boxes, CircleDollarSign, Download, PackageSearch, Sparkles, TrendingDown, Truck } from "lucide-react";
import Link from "next/link";

const reorderItems = [
  { name: "Industrial Filter Type A", sku: "IFA-441", stock: "24 units", cover: "4 days", recommendation: "Order 60", supplier: "Gulf Trading Co.", tone: "danger" },
  { name: "Brake Pad Set", sku: "BPS-118", stock: "18 sets", cover: "6 days", recommendation: "Order 80", supplier: "Emirates Supply LLC", tone: "warning" },
  { name: "Drive Belt Premium", sku: "DBP-772", stock: "31 units", cover: "9 days", recommendation: "Order 50", supplier: "Al Noor Industrial", tone: "warning" },
];

const deadStock = [
  { name: "Air Intake Hose", sku: "AIH-902", quantity: "46 units", value: "AED 18,400", age: "94 days idle" },
  { name: "Control Module 12V", sku: "CM-221", quantity: "12 units", value: "AED 15,600", age: "81 days idle" },
  { name: "Premium Wiper Set", sku: "PWS-610", quantity: "38 sets", value: "AED 9,120", age: "67 days idle" },
];

export default function InventoryIntelligencePage() {
  return (
    <div className="inventory-intelligence">
      <div className="page-header module-header">
        <div>
          <div className="eyebrow"><Sparkles size={13} /> Operations intelligence</div>
          <h2 className="page-title">Inventory intelligence</h2>
          <p className="page-description">Turn stock signals into confident buying, transfer, and working-capital decisions.</p>
        </div>
        <div className="owner-hero-actions"><button className="btn btn-secondary btn-sm"><Download size={13} /> Export analysis</button><Link href="/operations/inventory" className="btn btn-primary btn-sm">Open inventory <ArrowRight size={13} /></Link></div>
      </div>

      <div className="intelligence-summary">
        <div className="intelligence-summary-featured"><span>Inventory health</span><strong>78<span>/100</span></strong><small>Good, with action needed on 6 products</small><div className="health-meter"><i /></div></div>
        <div className="intelligence-summary-card"><span>Stockout risk</span><strong>3 items</strong><small className="intel-danger"><TrendingDown size={12} /> Within 10 days</small></div>
        <div className="intelligence-summary-card"><span>Capital at risk</span><strong>AED 43K</strong><small className="intel-warning"><CircleDollarSign size={12} /> In dead stock</small></div>
        <div className="intelligence-summary-card"><span>Transfer opportunity</span><strong>8 units</strong><small className="intel-info"><ArrowRightLeft size={12} /> Can avoid new purchase</small></div>
      </div>

      <div className="intel-section-heading"><div><div className="section-kicker">Recommended decisions</div><h3>Buy only what the business needs</h3></div><span className="owner-section-count">Based on demand, cover, and lead time</span></div>
      <div className="reorder-grid">{reorderItems.map((item) => <div className="reorder-card" key={item.sku}><div className={`reorder-status ${item.tone}`}><TrendingDown size={14} /></div><div className="reorder-main"><div className="reorder-title"><strong>{item.name}</strong><span>{item.sku}</span></div><div className="reorder-facts"><span><b>{item.stock}</b> on hand</span><span><b>{item.cover}</b> cover</span></div><div className="reorder-recommendation"><PackageSearch size={14} /><span>Recommended <b>{item.recommendation}</b></span></div><div className="reorder-footer"><span>{item.supplier}</span><Link href="/procurement/requests">Create request <ArrowRight size={11} /></Link></div></div></div>)}</div>

      <div className="intel-main-grid">
        <div className="card">
          <div className="card-header"><div><div className="card-title">Dead stock radar</div><div className="card-subtitle">Capital that could be released or redeployed</div></div><span className="badge badge-warning">AED 43,120</span></div>
          <div className="dead-stock-list">{deadStock.map((item) => <div className="dead-stock-row" key={item.sku}><div className="dead-stock-icon"><Boxes size={15} /></div><div><strong>{item.name}</strong><span>{item.sku} · {item.quantity} · {item.age}</span></div><b>{item.value}</b><button className="btn btn-secondary btn-sm" type="button">Review</button></div>)}</div>
          <div className="intel-card-footer"><span>Recommendation: launch a clearance or branch-transfer campaign for these products.</span><Link href="/operations/transfers" className="text-link">Explore transfers <ArrowRight size={12} /></Link></div>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Branch transfer radar</div><div className="card-subtitle">Move stock before buying more</div></div><ArrowRightLeft size={16} style={{ color: "var(--color-info)" }} /></div>
          <div className="transfer-radar"><div className="transfer-route"><div className="branch-node"><strong>Branch A</strong><span>24 units surplus</span></div><ArrowRight size={16} /><div className="branch-node urgent"><strong>Branch B</strong><span>12 units at risk</span></div></div><div className="transfer-product"><div className="stock-thumb"><Boxes size={14} /></div><div><strong>Hydraulic Pump 5HP</strong><span>Transfer 8 units · saves AED 38,720 purchase cost</span></div></div><Link href="/operations/transfers" className="btn btn-primary btn-sm">Create transfer <ArrowRight size={12} /></Link></div>
        </div>
      </div>

      <div className="intel-callout"><div className="action-icon info"><Truck size={16} /></div><div><span className="eyebrow">Purchasing insight</span><strong>Supplier lead times are widening on machinery parts.</strong><p>Review open purchase orders before placing new requests. Two approved orders already cover 14 days of projected demand.</p></div><Link href="/procurement/orders" className="text-link">Review purchase orders <ArrowRight size={12} /></Link></div>
    </div>
  );
}
