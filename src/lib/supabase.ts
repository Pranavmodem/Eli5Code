import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Publishable values only — safe in the browser; Row Level Security guards the table.
// Overridable via env for a different Supabase project.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kcnjvsdgzvvswsadcibw.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_LItpZ8EN5YgExO8t5u7A1A_mXzJLIip";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}

export interface Profile {
  id: string;
  username: string;
  role: string | null;
  university: string | null;
  experience: string | null;
  goal: string | null;
  is_admin?: boolean;
}

export interface AdminUserRow extends Profile {
  email?: string;
  /** Password assigned at provisioning; null once unknown (user-chosen). */
  assigned_password?: string | null;
  created_at?: string;
  completed_lessons?: string[];
  progress_updated_at?: string | null;
}

/** Admin-only RPC: full user roster incl. login email and assigned password. */
export async function adminListUsers(): Promise<AdminUserRow[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("admin_list_users");
  if (error) {
    console.warn("admin list failed:", error.message);
    return null;
  }
  return (data ?? []).map((r: Record<string, unknown>) => ({
    ...(r as unknown as AdminUserRow),
    completed_lessons: (r.completed_lessons as string[]) ?? [],
  }));
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("profiles")
    .select("id, username, role, university, experience, goal, is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.warn("Profile fetch failed:", error.message);
    return null;
  }
  return data;
}

export async function isUsernameAvailable(name: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return true;
  const { data, error } = await sb.rpc("username_available", { name });
  if (error) {
    console.warn("Username check failed:", error.message);
    return true; // signup trigger resolves races server-side
  }
  return Boolean(data);
}

export interface UserProgressRow {
  completed_lessons: string[];
  start_date: string | null;
  mode: string;
}

export async function fetchUserProgress(userId: string): Promise<UserProgressRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("user_progress")
    .select("completed_lessons, start_date, mode")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("User progress fetch failed:", error.message);
    return null;
  }
  return data;
}

export async function pushUserProgress(userId: string, p: UserProgressRow): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from("user_progress").upsert(
    {
      user_id: userId,
      completed_lessons: p.completed_lessons,
      start_date: p.start_date,
      mode: p.mode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.warn("User progress sync failed:", error.message);
}

export interface RemoteProgress {
  device_id: string;
  completed_lessons: string[];
  start_date: string | null;
  mode: string;
}

export async function fetchProgress(deviceId: string): Promise<RemoteProgress | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("progress")
    .select("device_id, completed_lessons, start_date, mode")
    .eq("device_id", deviceId)
    .maybeSingle();
  if (error) {
    console.warn("Supabase fetch failed:", error.message);
    return null;
  }
  return data;
}

export async function pushProgress(p: RemoteProgress): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from("progress").upsert(
    {
      device_id: p.device_id,
      completed_lessons: p.completed_lessons,
      start_date: p.start_date,
      mode: p.mode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id" }
  );
  if (error) console.warn("Supabase sync failed:", error.message);
}
