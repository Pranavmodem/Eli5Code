"use client";

import { useEffect, useRef, useState } from "react";
import { useBootcamp } from "@/lib/store";
// @ts-ignore untyped data module
import { EXERCISES } from "@/data/exercises";

interface Exercise {
  fn: string;
  prompt: string;
  starter: string;
  tests: { args: unknown[]; expected: unknown }[];
}

interface TestResult {
  args: unknown[];
  expected: unknown;
  got?: unknown;
  ok: boolean;
  err?: string;
}

/** The Web Worker body: runs user code against the tests, fully off the UI thread. */
const WORKER_SRC = `
self.onmessage = (e) => {
  const { code, fnName, tests } = e.data;
  try {
    const factory = new Function(code + '\\n;return (typeof ' + fnName + ' !== "undefined") ? ' + fnName + ' : undefined;');
    const fn = factory();
    if (typeof fn !== 'function') { self.postMessage({ error: 'Define a function named ' + fnName + ' — keep the signature from the starter code.' }); return; }
    const results = [];
    for (const t of tests) {
      let got, ok = false, err;
      try {
        got = fn(...JSON.parse(JSON.stringify(t.args)));
        ok = JSON.stringify(got) === JSON.stringify(t.expected);
      } catch (ex) { err = String((ex && ex.message) || ex); }
      results.push({ args: t.args, expected: t.expected, got, ok: ok && !err, err });
    }
    self.postMessage({ results });
  } catch (ex) {
    self.postMessage({ error: String((ex && ex.message) || ex) });
  }
};`;

/**
 * Write-it-yourself practice: an editor, the lesson's exercise, and a test
 * runner executing the learner's JavaScript in a sandboxed Web Worker
 * (terminated after 3s, so infinite loops can't freeze the page).
 */
export default function PracticePanel({ lessonId }: { lessonId: string }) {
  const ex = (EXERCISES as Record<string, Exercise>)[lessonId];
  const passedExercises = useBootcamp((s) => s.passedExercises);
  const passExercise = useBootcamp((s) => s.passExercise);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const draftKey = `eli5code-draft-${lessonId}`;

  useEffect(() => {
    if (!ex) return;
    const draft = typeof window !== "undefined" ? localStorage.getItem(draftKey) : null;
    setCode(draft ?? ex.starter);
    setResults(null);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  if (!ex) return null;
  const passed = hydrated && passedExercises.includes(lessonId);

  const run = () => {
    setRunning(true);
    setError("");
    setResults(null);
    localStorage.setItem(draftKey, code);
    workerRef.current?.terminate();
    const worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" })));
    workerRef.current = worker;
    const timeout = setTimeout(() => {
      worker.terminate();
      setRunning(false);
      setError("Timed out after 3 seconds — an infinite loop, probably. Check that your loop makes progress toward stopping.");
    }, 3000);
    worker.onmessage = (e) => {
      clearTimeout(timeout);
      setRunning(false);
      if (e.data.error) setError(e.data.error);
      else {
        const rs = e.data.results as TestResult[];
        setResults(rs);
        if (rs.every((r) => r.ok)) passExercise(lessonId);
      }
      worker.terminate();
    };
    worker.postMessage({ code, fnName: ex.fn, tests: ex.tests });
  };

  const j = (v: unknown) => JSON.stringify(v);

  return (
    <section className="blueprint" style={{ padding: "var(--space-6)" }}>
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
        <span className="kicker">Practice — write it yourself</span>
        {passed && <span className="tag tag-accent">✓ passed (+15 XP)</span>}
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: "var(--space-3)", maxWidth: "78ch" }}>{ex.prompt}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={Math.max(8, code.split("\n").length + 1)}
        className="input mono"
        style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre", tabSize: 2 }}
        aria-label="Code editor"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const t = e.currentTarget;
            const s = t.selectionStart;
            setCode(code.slice(0, s) + "  " + code.slice(t.selectionEnd));
            requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
          }
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: "var(--space-3)", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run tests"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { setCode(ex.starter); localStorage.removeItem(draftKey); setResults(null); setError(""); }}
        >
          Reset to starter
        </button>
        <span className="text-muted" style={{ alignSelf: "center", fontSize: 11.5 }}>
          JavaScript · runs in your browser · your draft is saved locally
        </span>
      </div>

      {error && (
        <pre className="mono" style={{ marginTop: "var(--space-3)", padding: "var(--space-3)", fontSize: 12.5, background: "color-mix(in srgb, var(--color-accent) 8%, transparent)", border: "1px solid var(--color-divider)", whiteSpace: "pre-wrap" }}>
          ✗ {error}
        </pre>
      )}

      {results && (
        <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} className="mono" style={{ fontSize: 12.5, padding: "6px 10px", border: "1px solid var(--color-divider)", background: r.ok ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "var(--color-surface)" }}>
              {r.ok ? "✓" : "✗"} {ex.fn}({r.args.map(j).join(", ")}) → expected {j(r.expected)}
              {!r.ok && <span style={{ color: "var(--color-accent-800)" }}> · got {r.err ? `error: ${r.err}` : j(r.got)}</span>}
            </div>
          ))}
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>
            {results.every((r) => r.ok)
              ? "All tests pass — you didn't just recognise it, you built it. 🏆"
              : `${results.filter((r) => r.ok).length}/${results.length} passing — read the failing case closely; the bug is in the gap between plan and code.`}
          </div>
        </div>
      )}
    </section>
  );
}
