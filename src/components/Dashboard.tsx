"use client";

import Link from "next/link";
import { useBootcamp } from "@/lib/store";
import {
  modules,
  coreModules,
  TOTAL_DAYS,
  PROGRAM_DAYS,
  lessonForDay,
  MILESTONES,
} from "@/lib/curriculum";
import { summarizeProgress, isModuleUnlocked, moduleProgress } from "@/lib/progress";

export default function Dashboard() {
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const activityDates = useBootcamp((s) => s.activityDates);
  const startJourney = useBootcamp((s) => s.startJourney);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);

  const completed = hydrated ? completedLessons : [];
  const done = new Set(completed);
  const s = summarizeProgress(completed, hydrated ? startDate : null, hydrated ? activityDates : []);
  const day = Math.max(1, s.calendarDay || 1);
  const todays = lessonForDay(day);

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: 1560 }}>
      {authReady && !authUser && (
        <div className="blueprint" style={{ padding: "var(--space-4) var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <span style={{ fontSize: 14 }}>
            You're browsing as a <b>guest</b> — sample lessons are open; a free account saves your progress and unlocks everything.
          </span>
          <span style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <Link href="/signup" className="btn btn-primary">Create account</Link>
            <Link href="/learn/m1l1" className="btn btn-secondary">Try the sample</Link>
          </span>
        </div>
      )}

      {/* hero */}
      <section className="hero-grid">
        <div>
          <div className="kicker" style={{ marginBottom: "var(--space-3)" }}>
            60 days — 2 hours a day — Python — 0 to 100%
          </div>
          <h1 className="h-display" style={{ lineHeight: 0.95, margin: "0 0 var(--space-4)" }}>
            DAY {day} <span style={{ color: "var(--color-neutral-500)" }}>/ {TOTAL_DAYS}</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.55, maxWidth: "54ch", margin: "0 0 var(--space-6)", color: "var(--color-neutral-800)" }}>
            {startDate
              ? <>Today's material: <b>{todays.module.n}</b> — {todays.lesson.t}. {todays.lesson.a}.</>
              : "Your 60-day run from zero to hero hasn't started yet. Day 1 is one click away — two focused hours, one lesson, one visualizer."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 660 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-heading)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
              <span>DSA mastery — one lesson moves it 2.5 points</span>
              <span>{s.mastery}%</span>
            </div>
            <div style={{ position: "relative", height: 12, background: "var(--color-neutral-200)", border: "1px solid var(--color-divider)" }}>
              <i style={{ position: "absolute", inset: "0 auto 0 0", width: `${s.mastery}%`, background: "var(--color-accent)", transition: "width .4s" }} />
              {MILESTONES.map((m) => (
                <i key={m.day} title={m.label} style={{ position: "absolute", top: 0, bottom: 0, left: `${m.strength}%`, width: 2, background: "var(--color-accent-800)", opacity: 0.65 }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "var(--space-2)" }}>
              <Stat v={`${s.streak}d`} l="streak" />
              <Stat v={`${s.xp}`} l="XP" />
              <Stat v={`${s.hoursLogged}h`} l="hours logged" />
              <Stat v={`${s.completedCount}/${s.totalLessons}`} l="lessons" />
            </div>
          </div>

          <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-3)" }}>
            {startDate ? (
              <Link href={`/learn/${todays.lesson.id}`} className="btn btn-primary" style={{ fontSize: 15, padding: "10px 22px" }}>
                Start today's session →
              </Link>
            ) : (
              <button className="btn btn-primary" style={{ fontSize: 15, padding: "10px 22px" }} onClick={startJourney}>
                Begin Day 1
              </button>
            )}
            <Link href="/curriculum" className="btn btn-secondary" style={{ fontSize: 15 }}>Browse curriculum</Link>
          </div>
        </div>

        {/* 60-day plan strip */}
        <figure className="blueprint" style={{ margin: 0, padding: "var(--space-6)" }}>
          <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
          <div className="kicker" style={{ marginBottom: "var(--space-3)" }}>The {TOTAL_DAYS} days</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4 }}>
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
              const hit = lessonForDay(d);
              const isDone = done.has(hit.lesson.id);
              const isToday = startDate && d === day;
              return (
                <Link key={d} href={`/learn/${hit.lesson.id}`} title={`Day ${d}: ${hit.lesson.t}`} className="zh-cell"
                  style={{
                    aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontFamily: "ui-monospace,monospace", textDecoration: "none",
                    border: "1px solid var(--color-divider)",
                    background: isDone ? "var(--color-accent)" : isToday ? "var(--color-accent-300)" : "var(--color-surface)",
                    color: isDone ? "var(--color-bg)" : "var(--color-text)",
                    outline: isToday ? "2px solid var(--color-accent-700)" : "none",
                  }}>
                  {d}
                </Link>
              );
            })}
          </div>
          <figcaption style={{ marginTop: "var(--space-3)" }}>
            filled = lesson complete · outlined = today · days 46–60 begin the advanced track (runs to day {PROGRAM_DAYS})
          </figcaption>
        </figure>
      </section>

      {/* modules */}
      <section>
        <h2 style={{ marginBottom: "var(--space-4)" }}>Core — the 0→100% track</h2>
        <ModuleGrid mods={coreModules} allMods={modules} completed={completed} />
        <h2 style={{ margin: "var(--space-8) 0 var(--space-4)" }}>Advanced — beyond the core</h2>
        <ModuleGrid mods={modules.slice(4)} allMods={modules} completed={completed} />
      </section>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div style={{ border: "1px solid var(--color-divider)", background: "var(--color-surface)", padding: "var(--space-2) var(--space-3)" }}>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20 }}>{v}</div>
      <div className="text-muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
    </div>
  );
}

function ModuleGrid({ mods, allMods, completed }: {
  mods: typeof modules; allMods: typeof modules; completed: string[];
}) {
  const done = new Set(completed);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
      {mods.map((m) => {
        const idx = allMods.findIndex((x) => x.id === m.id);
        const unlocked = isModuleUnlocked(idx, allMods, completed);
        const pct = moduleProgress(m, completed);
        return (
          <div key={m.id} className="blueprint" style={{ padding: "var(--space-4)", opacity: unlocked ? 1 : 0.55 }}>
            <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="kicker">{m.n} · days {m.days[0]}–{m.days[1]}</span>
              <span className="tag tag-outline mono" style={{ fontSize: 10 }}>{pct}%</span>
            </div>
            <h4 style={{ margin: "4px 0 4px" }}>{unlocked ? "" : "🔒 "}{m.name}</h4>
            <p className="text-muted" style={{ fontSize: 12.5, marginBottom: "var(--space-3)" }}>{m.blurb}</p>
            <div style={{ height: 6, background: "var(--color-neutral-200)", border: "1px solid var(--color-divider)", marginBottom: "var(--space-3)" }}>
              <i style={{ display: "block", height: "100%", width: `${pct}%`, background: "var(--color-accent)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {m.lessons.map((l, li) => (
                unlocked ? (
                  <Link key={l.id} href={`/learn/${l.id}`} className="zh-row" style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "4px 6px", textDecoration: "none", color: "inherit", fontSize: 13 }}>
                    <span style={{ textDecoration: done.has(l.id) ? "line-through" : "none", color: done.has(l.id) ? "var(--color-neutral-500)" : "inherit" }}>
                      {done.has(l.id) ? "■" : "□"} {li + 1}. {l.t}
                    </span>
                    <span className="mono text-muted" style={{ fontSize: 10, whiteSpace: "nowrap" }}>{l.a}</span>
                  </Link>
                ) : (
                  <span key={l.id} className="text-muted" style={{ display: "flex", padding: "4px 6px", fontSize: 13 }}>□ {li + 1}. {l.t}</span>
                )
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
