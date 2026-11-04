export const mockExceptions = [
  {
    id: "EX-2026-00184",
    priority: "High",
    summary: "Invoice value exceeds approved purchase order",
    area: "Procurement",
    status: "Open",
    assignedTo: "Finance Manager",
    createdAt: "2026-09-02T08:14:00Z",
    riskLevel: "Elevated",
    details: {
      approvedValue: 150000,
      submittedValue: 160000,
      difference: 10000,
      currency: "AED",
      relatedRecords: ["PO-2026-00441", "GR-2026-00112", "INV-S-2026-00882"],
      recommendation: "Review invoice before payment approval.",
      factors: [
        "Invoice amount exceeds purchase order value by AED 10,000",
        "Supplier pricing differs from approved contract rates",
        "Deviation exceeds the 3% tolerance threshold",
      ],
    },
    timeline: [
      { time: "08:14", label: "Exception Created", note: "Automated — invoice value mismatch detected" },
      { time: "08:15", label: "Risk Evaluation Completed", note: "Risk Level: Elevated" },
      { time: "08:16", label: "Assigned to Finance Manager", note: "Awaiting review" },
    ],
  },
  {
    id: "EX-2026-00183",
    priority: "High",
    summary: "Potential duplicate payment risk identified",
    area: "Finance",
    status: "Under Review",
    assignedTo: "Accounts Team",
    createdAt: "2026-09-02T07:52:00Z",
    riskLevel: "High",
    details: {
      approvedValue: 48500,
      submittedValue: 48500,
      difference: 48500,
      currency: "AED",
      relatedRecords: ["PAY-2026-00301", "PAY-2026-00298"],
      recommendation: "Verify payment records before processing.",
      factors: [
        "Identical payment amount processed twice within 24 hours",
        "Same supplier and invoice reference",
        "Second payment submitted by different user",
      ],
    },
    timeline: [
      { time: "07:52", label: "Exception Created", note: "Duplicate payment pattern detected" },
      { time: "07:53", label: "Assigned to Accounts Team", note: "" },
      { time: "09:10", label: "Under Review", note: "Accounts Team reviewing payment records" },
    ],
  },
  {
    id: "EX-2026-00182",
    priority: "Medium",
    summary: "Inventory shortfall projected within 4 days",
    area: "Inventory",
    status: "Open",
    assignedTo: "Procurement",
    createdAt: "2026-09-01T14:30:00Z",
    riskLevel: "Medium",
    details: {
      approvedValue: 0,
      submittedValue: 0,
      difference: 14,
      currency: "Units",
      relatedRecords: ["PROD-0441", "WH-MAIN"],
      recommendation: "Procurement action should be considered within the next 3 business days.",
      factors: [
        "Current stock: 24 units",
        "Average daily demand: 6 units",
        "Supplier lead time: 7 days",
        "Projected shortfall: 14 units",
      ],
    },
    timeline: [
      { time: "14:30", label: "Demand Projection Completed", note: "Shortfall projected in 4 days" },
      { time: "14:31", label: "Exception Created", note: "Assigned to Procurement" },
    ],
  },
  {
    id: "EX-2026-00181",
    priority: "Low",
    summary: "Unusual sales pattern — volume spike detected",
    area: "Operations",
    status: "Monitoring",
    assignedTo: "Sales Manager",
    createdAt: "2026-09-01T11:05:00Z",
    riskLevel: "Low",
    details: {
      approvedValue: 0,
      submittedValue: 0,
      difference: 0,
      currency: "AED",
      relatedRecords: ["ORD-2026-01201", "ORD-2026-01202", "ORD-2026-01203"],
      recommendation: "Monitor for continued unusual activity.",
      factors: [
        "Sales volume 340% above daily average",
        "3 large orders from same customer within 2 hours",
        "No credit limit breach",
      ],
    },
    timeline: [
      { time: "11:05", label: "Exception Created", note: "Unusual sales pattern flagged" },
      { time: "11:06", label: "Assigned to Sales Manager", note: "Monitoring status" },
    ],
  },
  {
    id: "EX-2026-00180",
    priority: "Critical",
    summary: "Payment processed without approved invoice",
    area: "Finance",
    status: "Open",
    assignedTo: "Finance Manager",
    createdAt: "2026-09-02T06:30:00Z",
    riskLevel: "Critical",
    details: {
      approvedValue: 0,
      submittedValue: 225000,
      difference: 225000,
      currency: "AED",
      relatedRecords: ["PAY-2026-00299"],
      recommendation: "Immediate review required. Payment may need to be reversed.",
      factors: [
        "Payment of AED 225,000 processed with no corresponding approved invoice",
        "No purchase order linked",
        "Unusual timing — processed outside business hours",
      ],
    },
    timeline: [
      { time: "06:30", label: "Exception Created", note: "Payment without invoice — critical risk" },
      { time: "06:31", label: "Transaction Restricted", note: "Pending mandatory review" },
    ],
  },
];

export const mockApprovals = [
  { id: "APR-2026-00091", type: "Purchase Order", reference: "PO-2026-00441", amount: 160000, requestedBy: "Ahmed Al Mansouri", submittedAt: "2026-09-02T09:00:00Z", status: "Pending", riskLevel: "Elevated" },
  { id: "APR-2026-00090", type: "Expense", reference: "EXP-2026-00312", amount: 8400, requestedBy: "Sara Al Rashidi", submittedAt: "2026-09-02T08:45:00Z", status: "Pending", riskLevel: "Low" },
  { id: "APR-2026-00089", type: "Supplier Invoice", reference: "INV-S-2026-00880", amount: 42000, requestedBy: "Khalid Hassan", submittedAt: "2026-09-01T16:30:00Z", status: "Pending", riskLevel: "Medium" },
  { id: "APR-2026-00088", type: "Purchase Request", reference: "PR-2026-00201", amount: 95000, requestedBy: "Mariam Al Zaabi", submittedAt: "2026-09-01T14:00:00Z", status: "Approved", riskLevel: "Low" },
  { id: "APR-2026-00087", type: "Refund", reference: "REF-2026-00044", amount: 12500, requestedBy: "Omar Al Nouri", submittedAt: "2026-09-01T11:00:00Z", status: "Rejected", riskLevel: "High" },
];

export const mockPurchaseOrders = [
  { id: "PO-2026-00441", supplier: "Gulf Trading Co.", amount: 160000, items: 12, status: "Under Review", riskLevel: "Elevated", createdAt: "2026-09-02T07:00:00Z", orderedQty: 100, receivedQty: 0, invoicedQty: 100 },
  { id: "PO-2026-00440", supplier: "Emirates Supply LLC", amount: 48500, items: 4, status: "Approved", riskLevel: "Low", createdAt: "2026-09-01T14:00:00Z", orderedQty: 50, receivedQty: 50, invoicedQty: 50 },
  { id: "PO-2026-00439", supplier: "Al Noor Industrial", amount: 95000, items: 8, status: "Submitted", riskLevel: "Low", createdAt: "2026-09-01T10:00:00Z", orderedQty: 200, receivedQty: 198, invoicedQty: 200 },
  { id: "PO-2026-00438", supplier: "Tech Solutions FZE", amount: 32000, items: 3, status: "Approved", riskLevel: "Low", createdAt: "2026-08-31T09:00:00Z", orderedQty: 30, receivedQty: 30, invoicedQty: 30 },
  { id: "PO-2026-00437", supplier: "Global Parts DMCC", amount: 225000, items: 20, status: "Restricted", riskLevel: "Critical", createdAt: "2026-09-02T06:00:00Z", orderedQty: 500, receivedQty: 0, invoicedQty: 0 },
];

export const mockInvoices = [
  { id: "INV-S-2026-00882", supplier: "Gulf Trading Co.", amount: 160000, poRef: "PO-2026-00441", status: "Under Review", riskLevel: "Elevated", createdAt: "2026-09-02T08:00:00Z" },
  { id: "INV-S-2026-00881", supplier: "Emirates Supply LLC", amount: 48500, poRef: "PO-2026-00440", status: "Approved", riskLevel: "Low", createdAt: "2026-09-01T15:00:00Z" },
  { id: "INV-S-2026-00880", supplier: "Al Noor Industrial", amount: 42000, poRef: "PO-2026-00439", status: "Pending", riskLevel: "Medium", createdAt: "2026-09-01T12:00:00Z" },
  { id: "INV-S-2026-00879", supplier: "Tech Solutions FZE", amount: 32000, poRef: "PO-2026-00438", status: "Approved", riskLevel: "Low", createdAt: "2026-08-31T10:00:00Z" },
];

export const mockInventory = [
  { id: "PROD-0441", name: "Industrial Filter Type A", category: "Filters", sku: "IFA-441", oemNumber: "IF-A-441", barcode: "6291100441001", fitment: "Toyota Hilux 2018-2023", stock: 24, minStock: 20, unit: "Units", branch: "Main Warehouse", avgDailyDemand: 6, supplierLeadDays: 7, status: "Low Stock", daysUntilShortfall: 4 },
  { id: "PROD-0220", name: "Hydraulic Pump 5HP", category: "Machinery", sku: "HP5-220", oemNumber: "44310-0K010", barcode: "6291100220002", fitment: "Toyota Land Cruiser 2016-2022", stock: 8, minStock: 5, unit: "Units", branch: "Main Warehouse", avgDailyDemand: 1, supplierLeadDays: 14, status: "OK", daysUntilShortfall: null },
  { id: "PROD-0115", name: "Safety Valve 2-inch", category: "Valves", sku: "SV2-115", oemNumber: "SV-200-115", barcode: "6291100115008", fitment: "Nissan Patrol 2015-2021", stock: 150, minStock: 50, unit: "Units", branch: "Branch A", avgDailyDemand: 5, supplierLeadDays: 5, status: "OK", daysUntilShortfall: null },
  { id: "PROD-0088", name: "Pressure Gauge 100 PSI", category: "Instruments", sku: "PG100-088", oemNumber: "83520-60020", barcode: "6291100088006", fitment: "Toyota Prado 2017-2022", stock: 3, minStock: 10, unit: "Units", branch: "Branch B", avgDailyDemand: 2, supplierLeadDays: 10, status: "Critical", daysUntilShortfall: 1 },
  { id: "PROD-0331", name: "Electric Motor 15KW", category: "Machinery", sku: "EM15-331", oemNumber: "EM-15KW-331", barcode: "6291100331005", fitment: "Universal workshop equipment", stock: 40, minStock: 10, unit: "Units", branch: "Main Warehouse", avgDailyDemand: 3, supplierLeadDays: 21, status: "Transfer Opportunity", daysUntilShortfall: null },
];

export const mockSalesOrders = [
  { id: "ORD-2026-01203", customer: "Falcon Industrial LLC", amount: 87500, items: 5, status: "Approved", riskLevel: "Low", createdAt: "2026-09-02T10:00:00Z" },
  { id: "ORD-2026-01202", customer: "Falcon Industrial LLC", amount: 91000, items: 5, status: "Under Review", riskLevel: "Medium", createdAt: "2026-09-02T09:45:00Z" },
  { id: "ORD-2026-01201", customer: "Falcon Industrial LLC", amount: 88000, items: 5, status: "Under Review", riskLevel: "Medium", createdAt: "2026-09-02T09:30:00Z" },
  { id: "ORD-2026-01200", customer: "Al Jadeed Trading", amount: 34000, items: 3, status: "Approved", riskLevel: "Low", createdAt: "2026-09-02T08:00:00Z" },
  { id: "ORD-2026-01199", customer: "Emirates Contractors", amount: 120000, items: 8, status: "Approved", riskLevel: "Low", createdAt: "2026-09-01T14:00:00Z" },
];

export const mockKPIs = {
  openExceptions: 12,
  pendingApprovals: 8,
  inventoryAlerts: 3,
  todaysRevenue: 380500,
  revenueChange: 12.4,
  openPOs: 24,
  pendingPayments: 6,
  reconciliationItems: 4,
};

export const mockRecentActivity = [
  { time: "10:42", action: "Purchase Order PO-2026-00441 flagged for review", area: "Procurement", user: "System" },
  { time: "10:38", action: "Invoice INV-S-2026-00882 submitted by Gulf Trading Co.", area: "Finance", user: "Ahmed Al Mansouri" },
  { time: "10:15", action: "Sales Order ORD-2026-01203 approved", area: "Operations", user: "Sales Manager" },
  { time: "09:58", action: "Inventory shortfall projection updated — PROD-0441", area: "Inventory", user: "System" },
  { time: "09:30", action: "Expense EXP-2026-00312 submitted for approval", area: "Finance", user: "Sara Al Rashidi" },
  { time: "09:10", label: "Exception EX-2026-00183 assigned to Accounts Team", area: "Control", user: "System" },
];

export const mockUsers = [
  { id: "USR-001", name: "Ahmed Al Mansouri", email: "ahmed@company.ae", role: "Procurement Manager", branch: "Head Office", status: "Active", lastLogin: "2026-09-02T09:00:00Z" },
  { id: "USR-002", name: "Sara Al Rashidi",   email: "sara@company.ae",  role: "Finance Manager",      branch: "Head Office", status: "Active", lastLogin: "2026-09-02T08:45:00Z" },
  { id: "USR-003", name: "Khalid Hassan",     email: "khalid@company.ae", role: "Accountant",           branch: "Head Office", status: "Active", lastLogin: "2026-09-01T16:00:00Z" },
  { id: "USR-004", name: "Mariam Al Zaabi",   email: "mariam@company.ae", role: "Inventory Manager",    branch: "Branch A",    status: "Active", lastLogin: "2026-09-02T07:30:00Z" },
  { id: "USR-005", name: "Omar Al Nouri",     email: "omar@company.ae",   role: "Operations Employee",  branch: "Branch B",    status: "Inactive", lastLogin: "2026-08-28T10:00:00Z" },
];

export const mockBranches = [
  { id: "BR-001", name: "Head Office",    location: "Dubai, UAE",       manager: "Executive Management", employees: 45, status: "Active" },
  { id: "BR-002", name: "Main Warehouse", location: "Jebel Ali, Dubai", manager: "Mariam Al Zaabi",      employees: 12, status: "Active" },
  { id: "BR-003", name: "Branch A",       location: "Abu Dhabi, UAE",   manager: "Khalid Hassan",        employees: 18, status: "Active" },
  { id: "BR-004", name: "Branch B",       location: "Sharjah, UAE",     manager: "Omar Al Nouri",        employees: 9,  status: "Active" },
];
