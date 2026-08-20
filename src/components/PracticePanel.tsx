"use client";

import { useEffect, useRef, useState } from "react";
import { useBootcamp, Lang } from "@/lib/store";
// @ts-ignore untyped data module
import { EXERCISES } from "@/data/exercises";

interface Exercise {
  fn: string;
  prompt: string;
  starter: string;
  pyFn?: string;
  pyPrompt?: string;
  pyStarter?: string;
  tests: { args: unknown[]; expected: unknown }[];
}

interface TestResult {
  args: unknown[];
  expected: unknown;
  got?: unknown;
  ok: boolean;
  err?: string;
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

/** Python harness run inside Pyodide: executes the learner's code in a fresh
 *  namespace and JSON-compares each test's return value (floats that are
 *  whole numbers count as ints, tuples as lists — so 10/5 == 2 passes). */
const PY_HARNESS = [
  "import json, traceback",
  "def _norm(v):",
  "    if isinstance(v, bool): return v",
  "    if isinstance(v, float) and v.is_integer(): return int(v)",
  "    if isinstance(v, (list, tuple)): return [_norm(x) for x in v]",
  "    if isinstance(v, dict): return {k: _norm(x) for k, x in v.items()}",
  "    return v",
  "_out = {'results': []}",
  "_ns = {}",
  "try:",
  "    exec(USER_CODE, _ns)",
  "    _fn = _ns.get(FN_NAME)",
  "    if not callable(_fn):",
  "        _out = {'error': 'Define a function named ' + FN_NAME + ' — keep the signature from the starter code.'}",
  "    else:",
  "        for _t in json.loads(TESTS_JSON):",
  "            _r = {'args': _t['args'], 'expected': _t['expected'], 'ok': False}",
  "            try:",
  "                _got = _norm(_fn(*_t['args']))",
  "                try:",
  "                    _r['ok'] = json.dumps(_got, sort_keys=True) == json.dumps(_norm(_t['expected']), sort_keys=True)",
  "                    _r['got'] = _got",
  "                except TypeError:",
  "                    _r['err'] = 'returned a ' + type(_got).__name__ + ' — return lists/dicts/numbers/strings/booleans'",
  "            except BaseException as _e:",
  "                _r['err'] = type(_e).__name__ + ': ' + str(_e)",
  "            _out['results'].append(_r)",
  "except BaseException:",
  "    _out = {'error': traceback.format_exc().strip().split('\\n')[-1]}",
  "json.dumps(_out)",
].join("\n");

/** The Web Worker body: runs user code (JS directly, Python via Pyodide)
 *  against the tests, fully off the UI thread. */
const WORKER_SRC = `
const PY_HARNESS = ${JSON.stringify(PY_HARNESS)};
let pyodidePromise = null;
self.onmessage = async (e) => {
  const { lang, code, fnName, tests } = e.data;
  if (lang === 'py') {
    try {
      if (!pyodidePromise) {
        self.postMessage({ phase: 'loading' });
        // fetch + eval instead of importScripts: modern Chromium blocks
        // importScripts of network URLs from blob-URL workers.
        pyodidePromise = fetch('${PYODIDE_URL}pyodide.js')
          .then((r) => { if (!r.ok) throw new Error('CDN responded ' + r.status); return r.text(); })
          .then((src) => { (0, eval)(src); return self.loadPyodide({ indexURL: '${PYODIDE_URL}' }); });
      }
      const pyodide = await pyodidePromise;
      self.postMessage({ phase: 'running' });
      pyodide.globals.set('USER_CODE', code);
      pyodide.globals.set('FN_NAME', fnName);
      pyodide.globals.set('TESTS_JSON', JSON.stringify(tests));
      const out = pyodide.runPython(PY_HARNESS);
      self.postMessage(JSON.parse(out));
    } catch (ex) {
      pyodidePromise = null;
      self.postMessage({ error: 'Python runtime error: ' + String((ex && ex.message) || ex) });
    }
    return;
  }
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
 * runner executing the learner's Python (Pyodide, loaded on first run) or
 * JavaScript in a sandboxed Web Worker — killed on timeout, so infinite
 * loops can't freeze the page.
 */
export default function PracticePanel({ lessonId }: { lessonId: string }) {
  const ex = (EXERCISES as Record<string, Exercise>)[lessonId];
  const passedExercises = useBootcamp((s) => s.passedExercises);
  const passExercise = useBootcamp((s) => s.passExercise);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const storeLang = useBootcamp((s) => s.lang);
  const setLang = useBootcamp((s) => s.setLang);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Python is the default; fall back to JS for exercises without a Python variant.
  const lang: Lang = (hydrated ? storeLang : "py") === "py" && ex?.pyStarter ? "py" : "js";
  const fnName = lang === "py" ? ex?.pyFn ?? ex?.fn : ex?.fn;
  const starter = lang === "py" ? ex?.pyStarter ?? ex?.starter : ex?.starter;
  const prompt = lang === "py" ? ex?.pyPrompt ?? ex?.prompt : ex?.prompt;
  // JS drafts keep their historical key so nobody loses work in the upgrade.
  const draftKey = lang === "py" ? `eli5code-draft-${lessonId}-py` : `eli5code-draft-${lessonId}`;

  useEffect(() => {
    if (!ex) return;
    const draft = typeof window !== "undefined" ? localStorage.getItem(draftKey) : null;
    setCode(draft ?? starter ?? "");
    setResults(null);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lang]);

  useEffect(() => () => { workerRef.current?.terminate(); if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!ex) return null;
  const passed = hydrated && passedExercises.includes(lessonId);

  const armTimer = (ms: number, message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      workerRef.current?.terminate();
      workerRef.current = null; // the Python runtime dies with the worker; next run reloads it
      setRunning(false);
      setStatus("");
      setError(message);
    }, ms);
  };

  const run = () => {
    setRunning(true);
    setError("");
    setResults(null);
    setStatus(lang === "py" ? "Running…" : "");
    localStorage.setItem(draftKey, code);
    // Reuse the live worker so the Python runtime loads only once per page.
    let worker = workerRef.current;
    if (!worker) {
      worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" })));
      workerRef.current = worker;
    }
    const loopMsg =
      "Timed out — an infinite loop, probably. Check that your loop makes progress toward stopping.";
    armTimer(lang === "py" ? 120000 : 3000, lang === "py" ? "The Python runtime took too long to load — check your connection and try again." : loopMsg);
    worker.onmessage = (e) => {
      if (e.data.phase === "loading") {
        setStatus("Loading the Python runtime — first run only (~10 MB)…");
        armTimer(120000, "The Python runtime took too long to load — check your connection and try again.");
        return;
      }
      if (e.data.phase === "running") {
        setStatus("Running…");
        armTimer(8000, loopMsg);
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      setRunning(false);
      setStatus("");
      if (e.data.error) setError(e.data.error);
      else {
        const rs = e.data.results as TestResult[];
        setResults(rs);
        if (rs.every((r) => r.ok)) passExercise(lessonId);
      }
    };
    worker.postMessage({ lang, code, fnName, tests: ex.tests });
  };

  const j = (v: unknown) => JSON.stringify(v);

  return (
    <section className="blueprint" style={{ padding: "var(--space-6)" }}>
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
        <span className="kicker">Practice — write it yourself</span>
        {passed && <span className="tag tag-accent">✓ passed (+15 XP)</span>}
        {ex.pyStarter && (
          <div className="seg" role="tablist" aria-label="Practice language" style={{ marginLeft: "auto" }}>
            {(["py", "js"] as const).map((l) => (
              <label
                key={l}
                className="seg-opt"
                style={{
                  background: lang === l ? "var(--color-accent)" : "transparent",
                  color: lang === l ? "var(--color-bg)" : "inherit",
                  cursor: running ? "not-allowed" : "pointer",
                  opacity: running ? 0.6 : 1,
                }}
              >
                <input type="radio" name={`practice-lang-${lessonId}`} disabled={running} checked={lang === l} onChange={() => setLang(l)} />
                {l === "py" ? "🐍 Python" : "JS JavaScript"}
              </label>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: "var(--space-3)", maxWidth: "78ch" }}>{prompt}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={Math.max(8, code.split("\n").length + 1)}
        className="input mono"
        style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre", tabSize: lang === "py" ? 4 : 2 }}
        aria-label="Code editor"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const t = e.currentTarget;
            const s = t.selectionStart;
            const indent = lang === "py" ? "    " : "  ";
            setCode(code.slice(0, s) + indent + code.slice(t.selectionEnd));
            requestAnimationFrame(() => t.setSelectionRange(s + indent.length, s + indent.length));
          }
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: "var(--space-3)", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={run} disabled={running}>
          {running ? status || "Running…" : "▶ Run tests"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { setCode(starter ?? ""); localStorage.removeItem(draftKey); setResults(null); setError(""); }}
        >
          Reset to starter
        </button>
        <span className="text-muted" style={{ alignSelf: "center", fontSize: 11.5 }}>
          {lang === "py" ? "Python 3 · runs in your browser" : "JavaScript · runs in your browser"} · your draft is saved locally
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
              {r.ok ? "✓" : "✗"} {fnName}({r.args.map(j).join(", ")}) → expected {j(r.expected)}
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
