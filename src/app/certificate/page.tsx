"use client";

import Link from "next/link";
import { useBootcamp } from "@/lib/store";
import { CORE_LESSONS, coreModules } from "@/lib/curriculum";
import { summarizeProgress } from "@/lib/progress";

/** Printable certificate — earned when every core lesson (modules 0–4) is complete. */
export default function CertificatePage() {
  const authUser = useBootcamp((s) => s.authUser);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const activityDates = useBootcamp((s) => s.activityDates);
  const passedExercises = useBootcamp((s) => s.passedExercises);
  const quizResults = useBootcamp((s) => s.quizResults);

  const done = new Set(hydrated ? completedLessons : []);
  const coreDone = CORE_LESSONS.filter((l) => done.has(l.id)).length;
  const earned = coreDone === CORE_LESSONS.length;
  const s = summarizeProgress(hydrated ? completedLessons : [], hydrated ? startDate : null, hydrated ? activityDates : [], new Date(), { passedExercises, quizResults });

  if (!hydrated) return null;

  if (!earned) {
    return (
      <div className="page" style={{ maxWidth: 640, textAlign: "center" }}>
        <div className="blueprint" style={{ padding: "var(--space-8)" }}>
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <div style={{ fontSize: 34 }}>🎓</div>
          <h1 style={{ marginBottom: 6 }}>Not yet — and that's the point</h1>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: "var(--space-4)" }}>
            The certificate unlocks when all {CORE_LESSONS.length} core lessons
            (Modules 0–4) are complete. You're at <b>{coreDone}/{CORE_LESSONS.length}</b>.
          </p>
          <div style={{ height: 10, background: "var(--color-neutral-200)", border: "1px solid var(--color-divider)", marginBottom: "var(--space-4)" }}>
            <i style={{ display: "block", height: "100%", width: `${(coreDone / CORE_LESSONS.length) * 100}%`, background: "var(--color-accent)" }} />
          </div>
          <Link href="/today" className="btn btn-primary">Continue today's session →</Link>
        </div>
      </div>
    );
  }

  const name = authUser?.username ?? "Learner";
  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <div className="print-hide" style={{ display: "flex", gap: 8, marginBottom: "var(--space-4)" }}>
        <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print / save as PDF</button>
        <Link href="/capstone" className="btn btn-secondary">Add a capstone to it →</Link>
      </div>
      <div className="blueprint" style={{ padding: "calc(var(--space-8) * 1.5)", textAlign: "center", background: "var(--color-bg)" }}>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
        <div className="kicker" style={{ letterSpacing: "0.25em" }}>ELI5CODE · ZERO / HERO</div>
        <h1 style={{ fontSize: 44, margin: "var(--space-4) 0 var(--space-2)" }}>Certificate of Completion</h1>
        <p className="text-muted" style={{ fontSize: 14 }}>This certifies that</p>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 38, color: "var(--color-accent-700)", margin: "var(--space-2) 0" }}>@{name}</div>
        <p style={{ fontSize: 15, maxWidth: "56ch", margin: "0 auto var(--space-4)", lineHeight: 1.6 }}>
          completed the core track — {coreModules.length} modules, {CORE_LESSONS.length} lessons —
          spanning programming foundations, object-oriented programming, data structures,
          algorithms, and complexity analysis, with every concept visualised, quizzed and practised.
        </p>
        <div style={{ display: "flex", gap: "var(--space-6)", justifyContent: "center", flexWrap: "wrap", fontSize: 13 }} className="mono">
          <span>DSA mastery: <b>{s.mastery}%</b></span>
          <span>XP: <b>{s.xp}</b></span>
          <span>exercises passed: <b>{passedExercises.length}</b></span>
          <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
        <div className="kicker" style={{ marginTop: "var(--space-6)", fontSize: 10 }}>eli5code.com</div>
      </div>
    </div>
  );
}
