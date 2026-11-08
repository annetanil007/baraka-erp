export type DirectoryContact = {
  id: string;
  name: string;
  type: "Customer" | "Supplier" | "Branch";
  phone: string;
  email: string;
  countryCode: string;
  status: "Active" | "Inactive";
};

export const defaultWhatsAppDirectory: DirectoryContact[] = [
  // Customers / Clients
  { id: "CUS-00184", name: "Falcon Industrial LLC", type: "Customer", phone: "+971501234567", email: "procurement@falcon.ae", countryCode: "AE", status: "Active" },
  { id: "CUS-00183", name: "Al Jadeed Trading", type: "Customer", phone: "+971529876543", email: "finance@aljadeed.com", countryCode: "AE", status: "Active" },
  { id: "CUS-00182", name: "Emirates Contractors", type: "Customer", phone: "+971553334444", email: "orders@emiratescontractors.ae", countryCode: "AE", status: "Active" },
  { id: "CUS-00181", name: "Nexus Maintenance", type: "Customer", phone: "+971567778899", email: "billing@nexus.ae", countryCode: "AE", status: "Active" },

  // Suppliers / Vendors
  { id: "SUP-001", name: "Gulf Trading Co.", type: "Supplier", phone: "+971505551212", email: "sales@gulftrading.ae", countryCode: "AE", status: "Active" },
  { id: "SUP-002", name: "Emirates Supply LLC", type: "Supplier", phone: "+971508889900", email: "support@emiratessupply.com", countryCode: "AE", status: "Active" },
  { id: "SUP-003", name: "Al Noor Industrial", type: "Supplier", phone: "+971542223344", email: "orders@alnoor.ae", countryCode: "AE", status: "Active" },
  { id: "SUP-004", name: "Tech Solutions FZE", type: "Supplier", phone: "+971504445566", email: "dispatch@techsolutions.ae", countryCode: "AE", status: "Active" },

  // Dealers / Branches / Warehouse Managers
  { id: "BR-001", name: "Main Warehouse (Jebel Ali)", type: "Branch", phone: "+971501112233", email: "wh-lead@baraka.ae", countryCode: "AE", status: "Active" },
  { id: "BR-002", name: "Branch A (Abu Dhabi)", type: "Branch", phone: "+971504447788", email: "abudhabi@baraka.ae", countryCode: "AE", status: "Active" },
  { id: "BR-003", name: "Branch B (Sharjah)", type: "Branch", phone: "+971509990011", email: "sharjah@baraka.ae", countryCode: "AE", status: "Active" },
];

export function getWhatsAppNumber(idOrName: string, fallbackPhone = "+971501234567"): string {
  const contact = defaultWhatsAppDirectory.find(
    (c) => c.id.toLowerCase() === idOrName.toLowerCase() || c.name.toLowerCase().includes(idOrName.toLowerCase())
  );
  return contact ? contact.phone : fallbackPhone;
}
