import { NextResponse } from "next/server";

const WORKSPACES = new Set(["manager", "employee"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspace: string }> },
) {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NODE_ENV !== "production";
  if (!demoMode) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { workspace } = await params;
  const destination = workspace === "employee" ? "/employee" : "/";
  if (!WORKSPACES.has(workspace)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.set("baraka_demo_workspace", workspace, {
    httpOnly: false,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
