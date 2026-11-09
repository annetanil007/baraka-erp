import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NODE_ENV !== "production";
  const demoWorkspace = request.cookies.get("baraka_demo_workspace")?.value;
  const pathname = request.nextUrl.pathname;

  if (demoMode && pathname.startsWith("/demo/")) {
    return response;
  }
  if (demoMode && (demoWorkspace === "manager" || demoWorkspace === "employee")) {
    if (demoWorkspace === "employee") {
      const employeeAllowed = pathname === "/employee"
        || pathname === "/operations/sales"
        || pathname === "/operations/inventory"
        || pathname === "/operations/transfers"
        || pathname === "/procurement/requests"
        || pathname === "/procurement/receiving"
        || pathname === "/control/exceptions"
        || pathname.startsWith("/control/exceptions/");
      if (!employeeAllowed) {
        return NextResponse.redirect(new URL("/employee", request.url));
      }
    }
    return response;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }
  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.warn("Proxy auth check error:", error);
    return response;
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|login|images/|api/ocr).*)"] };