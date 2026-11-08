import { mockInventory, mockKPIs } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

type SalesOrderRow = { amount: number | null; status: string | null; created_at: string };
type CustomerRow = { balance: number | null };
type ProductRow = { id: string; name: string; stock: number; minimum_stock: number; unit: string };

export type DashboardData = {
  source: "demo" | "supabase";
  viewer: {
    name: string;
    role: string;
  };
  todaysRevenue: number;
  revenueChange: number;
  receivablesDue: number;
  inventoryAlerts: number;
  stockWatch: typeof mockInventory;
};

function dayStart(offsetDays = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - offsetDays);
  return date.toISOString();
}

export async function getDashboardData(): Promise<DashboardData> {
  const fallbackData: DashboardData = {
    source: "demo",
    viewer: {
      name: "Sara Al Rashidi",
      role: "Finance Manager",
    },
    todaysRevenue: mockKPIs.todaysRevenue,
    revenueChange: mockKPIs.revenueChange,
    receivablesDue: 682000,
    inventoryAlerts: mockKPIs.inventoryAlerts,
    stockWatch: mockInventory.filter((item) => item.status !== "OK").slice(0, 3),
  };

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return fallbackData;
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return fallbackData;
    const [profileResult, todayResult, yesterdayResult, customersResult, productsResult] = await Promise.all([
      supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle(),
      supabase.from("sales_orders").select("amount, status, created_at").gte("created_at", dayStart()),
      supabase.from("sales_orders").select("amount, status, created_at").gte("created_at", dayStart(1)).lt("created_at", dayStart()),
      supabase.from("customers").select("balance"),
      supabase.from("products").select("id, name, stock, minimum_stock, unit").order("stock", { ascending: true }).limit(50),
    ]);

    const firstError = [profileResult.error, todayResult.error, yesterdayResult.error, customersResult.error, productsResult.error].find(Boolean);
    if (firstError) {
      console.warn("Falling back to demo data due to Supabase query error:", firstError.message);
      return fallbackData;
    }

    const approvedRevenue = (rows: SalesOrderRow[] | null) => (rows ?? [])
      .filter((row) => row.status === "Approved")
      .reduce((total, row) => total + Number(row.amount ?? 0), 0);
    const todaysRevenue = approvedRevenue(todayResult.data as SalesOrderRow[]);
    const yesterdayRevenue = approvedRevenue(yesterdayResult.data as SalesOrderRow[]);
    const revenueChange = yesterdayRevenue === 0 ? 0 : Number((((todaysRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1));
    const products = ((productsResult.data as ProductRow[]) || []).map((product) => ({
      id: product.id,
      name: product.name,
      category: "General",
      sku: product.id,
      oemNumber: "—",
      barcode: "—",
      fitment: "—",
      stock: Number(product.stock),
      minStock: Number(product.minimum_stock),
      unit: product.unit,
      branch: "All branches",
      avgDailyDemand: 0,
      supplierLeadDays: 0,
      status: Number(product.stock) <= Number(product.minimum_stock) ? "Low Stock" : "OK",
      daysUntilShortfall: null,
    })) as typeof mockInventory;

    return {
      source: "supabase",
      viewer: {
        name: profileResult.data?.full_name || user.user_metadata?.full_name || user.email || "Team member",
        role: profileResult.data?.role || user.user_metadata?.role || "Operations Employee",
      },
      todaysRevenue,
      revenueChange,
      receivablesDue: ((customersResult.data as CustomerRow[]) || []).reduce((total, row) => total + Number(row.balance ?? 0), 0),
      inventoryAlerts: products.filter((product) => product.status !== "OK").length,
      stockWatch: products.filter((product) => product.status !== "OK").slice(0, 3),
    };
  } catch (error) {
    console.warn("Falling back to demo data due to Supabase initialization error:", error);
    return fallbackData;
  }
}
