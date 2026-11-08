import ModulePage from "@/components/shared/ModulePage";

export default function Page() {
  return <ModulePage
    title="Cost of Goods Sold"
    description="Posted inventory costs recognized against sales, with traceable source movements."
    actionLabel="Post COGS"
    stats={[
      { label: "This month", value: "AED 1.94M" },
      { label: "Gross margin", value: "AED 1.90M", tone: "success" },
      { label: "Pending costing", value: "18", tone: "warning" },
      { label: "Inventory value", value: "AED 4.26M" },
    ]}
    columns={[
      { key: "id", label: "Entry", mono: true },
      { key: "order", label: "Sales order", mono: true },
      { key: "product", label: "Product" },
      { key: "quantity", label: "Quantity", numeric: true },
      { key: "unitCost", label: "Unit cost", numeric: true },
      { key: "totalCost", label: "Total cost", numeric: true },
      { key: "method", label: "Method" },
      { key: "status", label: "Status" },
      { key: "posted", label: "Posted" },
    ]}
    rows={[
      { id: "COGS-2026-00184", order: "SO-2026-01201", product: "Industrial Filter Type A", quantity: 12, unitCost: "AED 185.00", totalCost: "AED 2,220.00", method: "Weighted average", status: "Posted", posted: "02 Sep 2026" },
      { id: "COGS-2026-00183", order: "SO-2026-01198", product: "Hydraulic Pump 5HP", quantity: 2, unitCost: "AED 4,840.00", totalCost: "AED 9,680.00", method: "FIFO", status: "Posted", posted: "02 Sep 2026" },
      { id: "COGS-2026-00182", order: "SO-2026-01194", product: "Brake Pad Set", quantity: 25, unitCost: "AED 92.50", totalCost: "AED 2,312.50", method: "Weighted average", status: "Posted", posted: "01 Sep 2026" },
      { id: "COGS-2026-00181", order: "SO-2026-01188", product: "Drive Belt Premium", quantity: 8, unitCost: "AED 138.00", totalCost: "AED 1,104.00", method: "FIFO", status: "Reversed", posted: "31 Aug 2026" },
    ]}
  />;
}
