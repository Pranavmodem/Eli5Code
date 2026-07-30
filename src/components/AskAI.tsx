"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useBootcamp } from "@/lib/store";

/**
 * Floating AI tutor. Sends the question + current mode + page context to
 * /api/ask, which proxies an OpenAI-compatible endpoint using server-side
 * env vars (AI_API_URL / AI_API_KEY / AI_MODEL). Answers match ELI5/Tech mode.
 */
export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mode = useBootcamp((s) => s.mode);
  const pathname = usePathname();

  const ask = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, mode, page: pathname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setAnswer(data.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask the AI tutor"
        className="btn btn-primary"
        style={{ position: "fixed", bottom: 22, right: 22, zIndex: 50, width: 52, height: 52, borderRadius: "50%", fontSize: 22, boxShadow: "var(--shadow-lg)", padding: 0 }}
      >
        {open ? "✕" : "?"}
      </button>

      {open && (
        <div
          className="blueprint"
          style={{ position: "fixed", bottom: 86, right: 22, zIndex: 50, width: "min(92vw, 380px)", background: "var(--color-bg)", boxShadow: "var(--shadow-lg)", padding: "var(--space-4)" }}
        >
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <div className="kicker" style={{ marginBottom: 4 }}>AI tutor</div>
          <p className="text-muted" style={{ fontSize: 12, marginBottom: "var(--space-3)" }}>
            Stuck? Ask anything — answers come in <b>{mode === "eli5" ? "ELI5" : "technical"}</b> style to match your toggle.
          </p>
          <textarea
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
            rows={2}
            placeholder="e.g. Why is binary search O(log n)?"
            style={{ marginBottom: 8 }}
          />
          <button className="btn btn-primary btn-block" onClick={ask} disabled={loading || !question.trim()}>
            {loading ? "Thinking…" : "Ask"}
          </button>
          {error && <p style={{ color: "var(--color-accent-700)", fontSize: 12, marginTop: 8 }}>{error}</p>}
          {answer && (
            <div style={{ marginTop: 10, maxHeight: 260, overflowY: "auto", border: "1px solid var(--color-divider)", background: "var(--color-surface)", padding: "var(--space-3)", fontSize: 13.5, lineHeight: 1.55 }}>
              {answer}
            </div>
          )}
        </div>
      )}
    </>
  );
}
