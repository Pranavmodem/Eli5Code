"use client";

import { useEffect, useState } from "react";
import { useBootcamp } from "@/lib/store";
import { adminListUsers, AdminUserRow } from "@/lib/supabase";
import { allLessons } from "@/lib/curriculum";
import { summarizeProgress } from "@/lib/progress";

/** Admin console — visible only to accounts with profiles.is_admin. */
export default function AdminPage() {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authUser?.isAdmin) return;
    setLoading(true);
    adminListUsers()
      .then(setRows)
      .finally(() => setLoading(false));
  }, [authUser?.isAdmin]);

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
    <div style={{ padding: "var(--space-8)", maxWidth: 1280, margin: "0 auto" }}>
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
              {["Username", "Role", "University", "Experience", "Goal", "Lessons", "Mastery", "Last active", "Joined"].map((h) => (
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
              <tr><td colSpan={9} className="text-muted" style={{ padding: 16, textAlign: "center" }}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
