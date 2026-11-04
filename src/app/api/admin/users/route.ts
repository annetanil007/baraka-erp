import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "Admin user creation is not configured. Add SUPABASE_SERVICE_ROLE_KEY on the server." }, { status: 503 });
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { data: profile } = await sessionClient.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["Administrator", "Executive Management"].includes(profile.role)) return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });

  const body = await request.json() as { email?: string; password?: string; fullName?: string; role?: string };
  if (!body.email || !body.password || !body.fullName) return NextResponse.json({ error: "Full name, email, and password are required." }, { status: 400 });
  if (body.password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const admin = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.auth.admin.createUser({ email: body.email, password: body.password, email_confirm: true, user_metadata: { full_name: body.fullName, role: body.role || "Operations Employee" } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (data.user) await admin.from("profiles").update({ full_name: body.fullName, role: body.role || "Operations Employee" }).eq("id", data.user.id);
  return NextResponse.json({ user: { id: data.user?.id, email: data.user?.email } }, { status: 201 });
}