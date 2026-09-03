import ModulePage from "@/components/ModulePage";

export default function Page() {
  return (
    <div>
      <ModulePage title="Receiving" description="Inbound deliveries matched to purchase orders and supplier invoices." actionLabel="Record receipt" stats={[{ label: "Expected today", value: "6", tone: "info" }, { label: "Awaiting inspection", value: "4", tone: "warning" }, { label: "Received this month", value: "AED 842,600" }, { label: "Match rate", value: "97.4%", tone: "success" }]} columns={[{ key: "id", label: "Receipt", mono: true }, { key: "po", label: "Purchase order", mono: true }, { key: "supplier", label: "Supplier" }, { key: "items", label: "Items", numeric: true }, { key: "warehouse", label: "Warehouse" }, { key: "status", label: "Status" }]} rows={[{ id: "GR-2026-00112", po: "PO-2026-00441", supplier: "Gulf Trading Co.", items: 12, warehouse: "Main Warehouse", status: "Awaiting inspection" }, { id: "GR-2026-00111", po: "PO-2026-00440", supplier: "Emirates Supply LLC", items: 4, warehouse: "Main Warehouse", status: "Received" }, { id: "GR-2026-00110", po: "PO-2026-00439", supplier: "Al Noor Industrial", items: 8, warehouse: "Branch A", status: "Partially received" }, { id: "GR-2026-00109", po: "PO-2026-00438", supplier: "Tech Solutions FZE", items: 3, warehouse: "Head Office", status: "Received" }]} />
    </div>
  );
}
