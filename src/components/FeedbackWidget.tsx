"use client";

import { useState } from "react";
import { useBootcamp } from "@/lib/store";
import { submitFeedback } from "@/lib/supabase";

const CATEGORIES = ["Mistake in content", "Visualizer bug", "Typo", "Suggestion", "Other"];

/**
 * Feedback entry point — per lesson (lessonId set) or site-wide (omitted).
 * Anyone may submit, including guests; admins read it in the Admin console.
 */
export default function FeedbackWidget({ lessonId, label }: { lessonId?: string; label?: string }) {
  const authUser = useBootcamp((s) => s.authUser);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const send = async () => {
    if (body.trim().length < 3) return;
    setState("sending");
    const ok = await submitFeedback({
      userId: authUser?.id ?? null,
      username: authUser?.username ?? null,
      lessonId: lessonId ?? null,
      category,
      body: body.trim().slice(0, 4000),
    });
    setState(ok ? "sent" : "failed");
    if (ok) setBody("");
  };

  if (!open) {
    return (
      <button className="btn btn-ghost" style={{ fontSize: 12.5 }} onClick={() => { setOpen(true); setState("idle"); }}>
        ⚑ {label ?? (lessonId ? "Spotted a mistake in this lesson?" : "Give feedback")}
      </button>
    );
  }

  return (
    <div className="blueprint" style={{ padding: "var(--space-4)", maxWidth: 560, width: "100%" }}>
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: "var(--space-2)" }}>
        <span className="kicker">{lessonId ? `Feedback — this lesson` : "Feedback — the whole site"}</span>
        <button className="btn btn-ghost" style={{ marginLeft: "auto", fontSize: 12 }} onClick={() => setOpen(false)}>✕ close</button>
      </div>
      {state === "sent" ? (
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--color-accent-700)" }}>
          ✓ Sent — thank you. Every report is read{authUser ? "" : " (submitted anonymously)"}.
        </p>
      ) : (
        <>
          <div className="field" style={{ marginBottom: 8 }}>
            <label>What kind?</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 8 }}>
            <label>Tell us what's wrong (or right)</label>
            <textarea className="input" rows={3} value={body} onChange={(e) => setBody(e.target.value)}
              placeholder={lessonId ? "e.g. the quiz's correct answer looks wrong because…" : "e.g. the dashboard could show…"} />
          </div>
          {state === "failed" && <p style={{ fontSize: 12, color: "var(--color-accent-800)" }}>Couldn't send — try again in a moment.</p>}
          <button className="btn btn-primary" onClick={send} disabled={state === "sending" || body.trim().length < 3}>
            {state === "sending" ? "Sending…" : "Send feedback"}
          </button>
        </>
      )}
    </div>
  );
}
