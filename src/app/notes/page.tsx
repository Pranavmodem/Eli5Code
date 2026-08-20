"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBootcamp } from "@/lib/store";
import { fetchAllNotes, NoteRow } from "@/lib/supabase";
import { getLesson, allLessons } from "@/lib/curriculum";

/** Everything the learner wrote or starred, in one place. */
export default function NotesPage() {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const bookmarks = useBootcamp((s) => s.bookmarks);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authReady || !hydrated) return;
    if (authUser) {
      fetchAllNotes(authUser.id).then((n) => { setNotes(n.filter((x) => x.body.trim())); setLoaded(true); });
    } else {
      // guests: gather from localStorage
      const local: NoteRow[] = [];
      for (const l of allLessons) {
        const body = localStorage.getItem(`eli5code-note-${l.id}`);
        if (body?.trim()) local.push({ lesson_id: l.id, body, updated_at: "" });
      }
      setNotes(local);
      setLoaded(true);
    }
  }, [authReady, authUser, hydrated]);

  const starred = hydrated ? bookmarks.map((id) => getLesson(id)).filter(Boolean) : [];

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="kicker" style={{ marginBottom: 4 }}>Your studio</div>
      <h1 style={{ marginBottom: "var(--space-6)" }}>Notes & bookmarks</h1>

      {starred.length > 0 && (
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h3 style={{ marginBottom: "var(--space-3)" }}>★ Bookmarked lessons</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {starred.map((hit) => (
              <Link key={hit!.lesson.id} href={`/learn/${hit!.lesson.id}`} className="tag tag-outline" style={{ textDecoration: "none" }}>
                {hit!.module.n} · {hit!.lesson.t}
              </Link>
            ))}
          </div>
        </section>
      )}

      <h3 style={{ marginBottom: "var(--space-3)" }}>📝 Lesson notes</h3>
      {!loaded && <p className="text-muted">Loading…</p>}
      {loaded && notes.length === 0 && (
        <p className="text-muted" style={{ fontSize: 14 }}>
          Nothing yet. Every lesson has a "My notes" box near the bottom — what you write there collects here.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {notes.map((n) => {
          const hit = getLesson(n.lesson_id);
          return (
            <div key={n.lesson_id} className="blueprint" style={{ padding: "var(--space-4)" }}>
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <Link href={`/learn/${n.lesson_id}`} style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, textDecoration: "none", color: "inherit" }}>
                  {hit ? `${hit.module.n} · ${hit.lesson.t}` : n.lesson_id}
                </Link>
                {n.updated_at && (
                  <span className="text-muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>
                    {new Date(n.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 13.5, whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--color-neutral-800)" }}>{n.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
