"use client";

import { useEffect, useRef, useState } from "react";
import { useBootcamp } from "@/lib/store";
import { fetchNote, saveNote } from "@/lib/supabase";

/**
 * Per-lesson notes. Signed-in: stored in Supabase (RLS: own rows only) and
 * debounce-saved as you type. Guests: kept in this browser's localStorage.
 */
export default function NotesPanel({ lessonId }: { lessonId: string }) {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guestKey = `eli5code-note-${lessonId}`;

  useEffect(() => {
    setLoaded(false);
    setStatus("idle");
    if (!authReady) return;
    if (authUser) {
      fetchNote(authUser.id, lessonId).then((b) => { setBody(b); setLoaded(true); });
    } else {
      setBody(localStorage.getItem(guestKey) ?? "");
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, authUser?.id, lessonId]);

  const onChange = (v: string) => {
    setBody(v);
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (authUser) await saveNote(authUser.id, lessonId, v);
      else localStorage.setItem(guestKey, v);
      setStatus("saved");
    }, 900);
  };

  return (
    <section className="blueprint" style={{ padding: "var(--space-6)" }}>
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <span className="kicker">📝 My notes</span>
        <span className="text-muted" style={{ fontSize: 11, marginLeft: "auto" }}>
          {status === "saving" ? "saving…" : status === "saved" ? "✓ saved" : authUser ? "synced to your account" : "saved in this browser"}
        </span>
      </div>
      <textarea
        className="input"
        rows={4}
        placeholder="Write it in your own words — the analogy that clicked, the gotcha you'll forget, the question to ask the tutor…"
        value={body}
        disabled={!loaded}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: 13.5, lineHeight: 1.6 }}
        aria-label="Lesson notes"
      />
    </section>
  );
}
