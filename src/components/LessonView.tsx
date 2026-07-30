"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBootcamp } from "@/lib/store";
import { getLesson, nextLesson, prevLesson, dayOfLesson } from "@/lib/curriculum";
import { vizForLesson, usesForLesson, approachForLesson } from "@/lib/viz";
import VizPlayer from "./VizPlayer";

/** Lessons guests can try without an account. */
const SAMPLE_LESSONS = ["m1l1", "m3l1"];

export default function LessonView({ lessonId }: { lessonId: string }) {
  const hit = getLesson(lessonId);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const mode = useBootcamp((s) => s.mode);
  const setMode = useBootcamp((s) => s.setMode);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const completeLesson = useBootcamp((s) => s.completeLesson);
  const uncompleteLesson = useBootcamp((s) => s.uncompleteLesson);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);

  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [tab, setTab] = useState<"python" | "js" | "approach" | "applied">("python");

  const viz = useMemo(() => (hit ? vizForLesson(hit.lesson.id) : null), [hit]);

  if (!hit) return null;
  const { module: mod, lesson } = hit;
  const activeMode = hydrated ? mode : "eli5";
  const isComplete = hydrated && completedLessons.includes(lesson.id);
  const next = nextLesson(lessonId);
  const prev = prevLesson(lessonId);
  const uses = usesForLesson(lesson.id) ?? lesson.use;
  const approach = approachForLesson(lesson.id, lesson.ap);
  const py = viz?.py ?? lesson.py;
  const isGuestLocked = authReady && !authUser && !SAMPLE_LESSONS.includes(lesson.id);

  if (isGuestLocked) {
    return (
      <div style={{ padding: "var(--space-8)", maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <div className="blueprint" style={{ padding: "var(--space-8)" }}>
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <div className="kicker" style={{ marginBottom: "var(--space-2)" }}>{mod.n} · {lesson.a}</div>
          <h2 style={{ marginBottom: "var(--space-3)" }}>{lesson.t}</h2>
          <p className="text-muted" style={{ marginBottom: "var(--space-6)" }}>
            This lesson — and 79 more, each with its own step-through visualizer — unlocks
            with a free account, so your progress saves and syncs.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary">Create free account</Link>
            <Link href={`/learn/${SAMPLE_LESSONS[0]}`} className="btn btn-secondary">Try the sample lesson</Link>
          </div>
          <p className="text-muted" style={{ marginTop: "var(--space-4)", fontSize: 12 }}>
            Already signed up? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  const body = activeMode === "eli5" ? lesson.e : lesson.k;

  return (
    <article className="page" style={{ maxWidth: 1280, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* breadcrumb + day */}
      <nav style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12 }} className="text-muted">
        <Link href="/dashboard">Dashboard</Link>
        <span>/</span>
        <Link href="/curriculum">{mod.n} — {mod.name}</Link>
        <span>/</span>
        <span>{lesson.t}</span>
        <span className="tag tag-outline mono" style={{ marginLeft: "auto", fontSize: 10 }}>day {dayOfLesson(lesson.id)}</span>
      </nav>

      {/* header */}
      <header>
        <div className="kicker" style={{ marginBottom: 4 }}>{lesson.a}</div>
        <h1 className="h-page" style={{ margin: 0 }}>{lesson.t}</h1>
      </header>

      {/* explanation — ELI5/Tech toggle lives here, next to the definition */}
      <section className="blueprint" style={{ padding: "var(--space-6)" }}>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
          <span className="kicker">{activeMode === "eli5" ? "The analogy" : "Definition"}</span>
          <div className="seg" role="tablist" aria-label="Explanation mode" style={{ marginLeft: "auto" }}>
            {(["eli5", "tech"] as const).map((m) => (
              <label
                key={m}
                className="seg-opt"
                style={{
                  background: activeMode === m ? "var(--color-accent)" : "transparent",
                  color: activeMode === m ? "var(--color-bg)" : "inherit",
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="lesson-mode" checked={activeMode === m} onChange={() => setMode(m)} />
                {m === "eli5" ? "🧸 ELI5" : "⚙ Tech"}
              </label>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: 0, color: "var(--color-neutral-800)", maxWidth: "72ch" }}>
          {body}
        </p>
      </section>

      {/* visualizer */}
      {viz && <VizPlayer key={lesson.id} viz={viz} />}

      {/* code / approach / applied */}
      {(py || viz?.code || approach || uses) && (
        <section>
          <div className="seg" style={{ marginBottom: "var(--space-3)" }}>
            {py && <Tab id="python" cur={tab} set={setTab}>Python</Tab>}
            {viz?.code && <Tab id="js" cur={tab} set={setTab}>JavaScript</Tab>}
            {approach && <Tab id="approach" cur={tab} set={setTab}>How devs think</Tab>}
            {uses && <Tab id="applied" cur={tab} set={setTab}>Where it's used</Tab>}
          </div>
          {tab === "python" && py && <pre className="codeblock">{py}</pre>}
          {tab === "js" && viz?.code && <pre className="codeblock">{viz.code}</pre>}
          {tab === "approach" && approach && (
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>
              {approach.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}
          {tab === "applied" && uses && (
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>
              {uses.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}
        </section>
      )}

      {/* quiz */}
      {lesson.q && (
        <section className="blueprint" style={{ padding: "var(--space-6)" }}>
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <div className="kicker" style={{ marginBottom: "var(--space-3)" }}>Check yourself</div>
          <p style={{ fontSize: 15, fontWeight: 500 }}>{lesson.q.q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
            {lesson.q.o.map((o, i) => {
              const picked = quizPick === i;
              const isRight = i === lesson.q!.x;
              const revealed = quizPick != null;
              return (
                <button key={i} className="btn btn-secondary" onClick={() => setQuizPick(i)}
                  style={{
                    justifyContent: "flex-start", textAlign: "left", fontFamily: "var(--font-body)", fontWeight: 400,
                    borderColor: revealed && isRight ? "var(--color-accent)" : picked ? "var(--color-neutral-500)" : undefined,
                    background: revealed && isRight ? "color-mix(in srgb, var(--color-accent) 14%, transparent)" : undefined,
                  }}>
                  <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>{String.fromCharCode(65 + i)}</span> {o}
                  {revealed && isRight && <span style={{ marginLeft: "auto" }}>✓</span>}
                  {revealed && picked && !isRight && <span style={{ marginLeft: "auto" }}>✗</span>}
                </button>
              );
            })}
          </div>
          {quizPick != null && (
            <p className="text-muted" style={{ marginTop: "var(--space-3)", fontSize: 13.5 }}>
              {quizPick === lesson.q.x ? "Correct. " : "Not quite. "}{lesson.q.w}
            </p>
          )}
        </section>
      )}

      {/* footer nav */}
      <footer style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", borderTop: "1px solid var(--color-divider)", paddingTop: "var(--space-4)" }}>
        {prev && <Link href={`/learn/${prev.lesson.id}`} className="btn btn-secondary">← {prev.lesson.t}</Link>}
        <button
          className={isComplete ? "btn btn-secondary" : "btn btn-primary"}
          onClick={() => (isComplete ? uncompleteLesson(lesson.id) : completeLesson(lesson.id))}
          style={{ marginLeft: "auto" }}
        >
          {isComplete ? "✓ Completed — undo" : "Mark lesson complete (+25 XP)"}
        </button>
        {next && <Link href={`/learn/${next.lesson.id}`} className="btn btn-secondary">{next.lesson.t} →</Link>}
      </footer>
    </article>
  );
}

function Tab({ id, cur, set, children }: {
  id: "python" | "js" | "approach" | "applied";
  cur: string;
  set: (t: "python" | "js" | "approach" | "applied") => void;
  children: React.ReactNode;
}) {
  return (
    <label className="seg-opt" style={{ background: cur === id ? "var(--color-accent)" : "transparent", color: cur === id ? "var(--color-bg)" : "inherit", cursor: "pointer" }}>
      <input type="radio" name="lesson-tab" checked={cur === id} onChange={() => set(id)} />
      {children}
    </label>
  );
}
