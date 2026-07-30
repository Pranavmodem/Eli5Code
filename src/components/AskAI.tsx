"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/**
 * Floating AI tutor. Sends the question + current mode + page context to
 * /api/ask, which proxies an OpenAI-compatible endpoint using server-side
 * env vars (AI_API_URL / AI_API_KEY). Answers match the ELI5/Tech mode.
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
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon text-2xl text-ink-950 shadow-glow"
        aria-label="Ask the AI tutor"
      >
        {open ? "✕" : "🤖"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-24 right-5 z-50 w-[min(92vw,24rem)] rounded-2xl border border-ink-600 bg-ink-800 p-4 shadow-2xl"
          >
            <h3 className="mb-1 text-sm font-bold">🤖 AI Tutor</h3>
            <p className="mb-3 text-xs text-slate-400">
              Stuck on this lesson? Ask anything — I'll answer in{" "}
              <span className="font-bold text-neon-green">
                {mode === "eli5" ? "ELI5" : "technical"}
              </span>{" "}
              style to match your toggle.
            </p>
            <textarea
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
              className="mb-2 w-full resize-none rounded-lg border border-ink-600 bg-ink-900 p-2 text-sm text-slate-200 outline-none focus:border-neon/60"
            />
            <button className="btn-primary w-full" onClick={ask} disabled={loading || !question.trim()}>
              {loading ? "Thinking…" : "Ask"}
            </button>
            {error && <p className="mt-3 text-xs text-neon-rose">{error}</p>}
            {answer && (
              <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/70 p-3 text-sm leading-relaxed text-slate-200">
                {answer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
