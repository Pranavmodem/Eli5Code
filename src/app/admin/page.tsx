"use client";

import { useEffect, useState } from "react";
import { useBootcamp } from "@/lib/store";
import { adminListUsers, AdminUserRow, adminListFeedback, adminResolveFeedback, FeedbackRow } from "@/lib/supabase";
import { getLesson } from "@/lib/curriculum";
import { allLessons } from "@/lib/curriculum";
import { summarizeProgress } from "@/lib/progress";

/** Admin console — visible only to accounts with profiles.is_admin. */
export default function AdminPage() {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authUser?.isAdmin) return;
    setLoading(true);
    Promise.all([adminListUsers().then(setRows), adminListFeedback().then(setFeedback)])
      .finally(() => setLoading(false));
  }, [authUser?.isAdmin]);

  const resolve = async (id: string, resolved: boolean) => {
    await adminResolveFeedback(id, resolved);
    setFeedback((fs) => fs.map((f) => (f.id === id ? { ...f, resolved } : f)));
  };

  if (!authReady) return <p className="text-muted" style={{ padding: "var(--space-8)", textAlign: "center" }}>Loading…</p>;
  if (!authUser?.isAdmin) {
    return (
      <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
        <h2>Admins only</h2>
        <p className="text-muted">This page requires an administrator account.</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="kicker" style={{ marginBottom: 4 }}>Admin console</div>
      <h1 style={{ marginBottom: "var(--space-2)" }}>Learners</h1>
      <p className="text-muted" style={{ fontSize: 13.5, marginBottom: "var(--space-6)" }}>
        Every account, the profile info collected at signup, and live progress.
        {loading && " Loading…"}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-divider)", textAlign: "left" }}>
              {["Username", "Email", "Password", "Role", "University", "Experience", "Goal", "Lessons", "Mastery", "Last active", "Joined"].map((h) => (
                <th key={h} className="kicker" style={{ padding: "8px 10px", fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => {
              const s = summarizeProgress(r.completed_lessons ?? [], null, []);
              return (
                <tr key={r.id} className="zh-row" style={{ borderBottom: "1px solid var(--color-divider)" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600 }}>
                    @{r.username} {r.is_admin && <span className="tag tag-accent" style={{ fontSize: 9 }}>admin</span>}
                  </td>
                  <td className="mono" style={{ padding: "8px 10px", fontSize: 12 }}>{r.email ?? "—"}</td>
                  <td className="mono" style={{ padding: "8px 10px", fontSize: 12 }} title="Password assigned at provisioning — unknowable if the user has changed it since">
                    {r.assigned_password ?? "set by user"}
                  </td>
                  <td style={{ padding: "8px 10px" }}>{r.role ?? "—"}</td>
                  <td style={{ padding: "8px 10px" }}>{r.university || "—"}</td>
                  <td style={{ padding: "8px 10px" }}>{r.experience ?? "—"}</td>
                  <td style={{ padding: "8px 10px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.goal ?? ""}>{r.goal || "—"}</td>
                  <td className="mono" style={{ padding: "8px 10px" }}>{(r.completed_lessons ?? []).length}/{allLessons.length}</td>
                  <td className="mono" style={{ padding: "8px 10px" }}>{s.mastery}%</td>
                  <td className="mono text-muted" style={{ padding: "8px 10px", fontSize: 11 }}>
                    {r.progress_updated_at ? new Date(r.progress_updated_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="mono text-muted" style={{ padding: "8px 10px", fontSize: 11 }}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              );
            })}
            {rows?.length === 0 && (
              <tr><td colSpan={11} className="text-muted" style={{ padding: 16, textAlign: "center" }}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ margin: "var(--space-8) 0 var(--space-2)" }}>Feedback</h2>
      <p className="text-muted" style={{ fontSize: 13.5, marginBottom: "var(--space-4)" }}>
        Reports from learners — per lesson or site-wide. Resolve them as you fix things.
        {feedback.length === 0 && " Nothing yet."}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {feedback.map((f) => {
          const hit = f.lesson_id ? getLesson(f.lesson_id) : null;
          return (
            <div key={f.id} className="blueprint" style={{ padding: "var(--space-3) var(--space-4)", opacity: f.resolved ? 0.55 : 1 }}>
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 4 }}>
                <span className="tag tag-accent" style={{ fontSize: 9 }}>{f.category}</span>
                <span className="tag tag-outline" style={{ fontSize: 9 }}>
                  {hit ? `${hit.module.n} · ${hit.lesson.t}` : f.lesson_id ?? "site-wide"}
                </span>
                <span className="text-muted mono" style={{ fontSize: 10 }}>
                  {f.username ? `@${f.username}` : "anonymous"} · {new Date(f.created_at).toLocaleString()}
                </span>
                <button className="btn btn-ghost" style={{ marginLeft: "auto", fontSize: 11 }} onClick={() => resolve(f.id, !f.resolved)}>
                  {f.resolved ? "↺ reopen" : "✓ mark resolved"}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{f.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
