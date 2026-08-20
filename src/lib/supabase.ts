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
  quiz_results?: Record<string, number>;
  passed_exercises?: string[];
  bookmarks?: string[];
}

export async function fetchUserProgress(userId: string): Promise<UserProgressRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("user_progress")
    .select("completed_lessons, start_date, mode, quiz_results, passed_exercises, bookmarks")
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
      quiz_results: p.quiz_results ?? {},
      passed_exercises: p.passed_exercises ?? [],
      bookmarks: p.bookmarks ?? [],
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

/* ── notes ─────────────────────────────────────────────────────────────── */

export async function fetchNote(userId: string, lessonId: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) return "";
  const { data } = await sb
    .from("notes")
    .select("body")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  return (data?.body as string) ?? "";
}

export async function saveNote(userId: string, lessonId: string, body: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from("notes").upsert(
    { user_id: userId, lesson_id: lessonId, body, updated_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" }
  );
  if (error) console.warn("note save failed:", error.message);
}

export interface NoteRow {
  lesson_id: string;
  body: string;
  updated_at: string;
}

export async function fetchAllNotes(userId: string): Promise<NoteRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("notes")
    .select("lesson_id, body, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return (data as NoteRow[]) ?? [];
}

/* ── feedback ──────────────────────────────────────────────────────────── */

export async function submitFeedback(f: {
  userId: string | null;
  username: string | null;
  lessonId: string | null;
  category: string;
  body: string;
}): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("feedback").insert({
    user_id: f.userId,
    username: f.username,
    lesson_id: f.lessonId,
    category: f.category,
    body: f.body,
  });
  if (error) console.warn("feedback failed:", error.message);
  return !error;
}

export interface FeedbackRow {
  id: string;
  username: string | null;
  lesson_id: string | null;
  category: string;
  body: string;
  created_at: string;
  resolved: boolean;
}

export async function adminListFeedback(): Promise<FeedbackRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("feedback")
    .select("id, username, lesson_id, category, body, created_at, resolved")
    .order("created_at", { ascending: false });
  if (error) console.warn("feedback list failed:", error.message);
  return (data as FeedbackRow[]) ?? [];
}

export async function adminResolveFeedback(id: string, resolved: boolean): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("feedback").update({ resolved }).eq("id", id);
}
