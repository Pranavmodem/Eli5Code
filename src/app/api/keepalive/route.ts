import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Touched daily by a Vercel cron (see vercel.json). A lightweight query counts
 * as project activity, which stops Supabase's free tier from auto-pausing the
 * database after 7 quiet days (a pause takes logins down until manual restore).
 */
export async function GET() {
  const sb = getSupabase();
  if (!sb) return NextResponse.json({ ok: false, reason: "no client" }, { status: 500 });
  const { error } = await sb.rpc("username_available", { name: "keepalive-probe" });
  return NextResponse.json({ ok: !error, at: new Date().toISOString() });
}
