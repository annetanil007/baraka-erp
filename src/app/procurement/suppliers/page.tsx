import ModulePage from "@/components/shared/ModulePage";

export default function Page() {
  return (
    <div>
      <ModulePage title="Suppliers" description="Supplier performance, contracts and compliance status." actionLabel="Add supplier" stats={[{ label: "Active suppliers", value: "74", tone: "success" }, { label: "Spend this month", value: "AED 1.08M" }, { label: "Under review", value: "3", tone: "warning" }, { label: "On-time delivery", value: "94.8%" }]} columns={[{ key: "id", label: "Supplier", mono: true }, { key: "name", label: "Supplier name" }, { key: "category", label: "Category" }, { key: "orders", label: "Open orders", numeric: true }, { key: "rating", label: "Rating" }, { key: "status", label: "Status" }]} rows={[{ id: "SUP-00041", name: "Gulf Trading Co.", category: "Industrial", orders: 3, rating: "4.6 / 5", status: "Active" }, { id: "SUP-00040", name: "Emirates Supply LLC", category: "Components", orders: 2, rating: "4.8 / 5", status: "Active" }, { id: "SUP-00039", name: "Al Noor Industrial", category: "Machinery", orders: 1, rating: "4.2 / 5", status: "Under Review" }, { id: "SUP-00038", name: "Tech Solutions FZE", category: "Technology", orders: 0, rating: "4.9 / 5", status: "Active" }]} />
    </div>
  );
}
