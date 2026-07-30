"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { modules, lessonForDay, MILESTONES, TOTAL_DAYS, HOURS_PER_DAY } from "@/lib/curriculum";
import { isModuleUnlocked, moduleProgress, summarizeProgress } from "@/lib/progress";
import { useBootcamp } from "@/lib/store";

export default function Dashboard() {
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const startJourney = useBootcamp((s) => s.startJourney);
  const resetProgress = useBootcamp((s) => s.resetProgress);

  const completed = hydrated ? completedLessons : [];
  const start = hydrated ? startDate : null;
  const s = summarizeProgress(completed, start);
  const completedSet = new Set(completed);

  const dayStatus = (day: number) => {
    const hit = lessonForDay(day);
    if (!hit) return { status: "none" as const, hit };
    if (completedSet.has(hit.lesson.id)) return { status: "done" as const, hit };
    if (start && day === s.calendarDay) return { status: "today" as const, hit };
    return { status: "todo" as const, hit };
  };

  return (
    <div className="space-y-10">
      {/* ---- header + strength meter ---- */}
      <section>
        <div className="mb-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your 60-Day Roadmap
          </h1>
          {start ? (
            <span className="rounded-full border border-ink-600 bg-ink-800 px-4 py-1.5 text-sm font-bold text-neon">
              📅 Day {s.calendarDay} of {TOTAL_DAYS}
            </span>
          ) : (
            <button className="btn-primary" onClick={startJourney}>
              🚀 Start my 60-day journey
            </button>
          )}
        </div>
        <p className="mb-6 text-sm text-slate-400">
          {HOURS_PER_DAY} hours a day. Each square is one day of material — finish a lesson and
          its days light up green.
        </p>

        <div className="card p-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
              💪 Coding strength
            </span>
            <span className="text-2xl font-extrabold text-neon-green">{s.strength}%</span>
          </div>
          <div className="relative mb-6 h-4 overflow-hidden rounded-full bg-ink-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon to-neon-green"
              initial={{ width: 0 }}
              animate={{ width: `${(s.strength / 100) * 100}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
            {MILESTONES.map((m) => (
              <div
                key={m.day}
                className="absolute top-0 h-full w-0.5 bg-neon-amber/70"
                style={{ left: `${m.strength}%` }}
                title={m.label}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <Stat label="Lessons done" value={`${s.completedCount}/${s.totalLessons}`} />
            <Stat label="Hours logged" value={`${s.hoursLogged}h`} />
            <Stat
              label="Day-30 target"
              value="80%"
              hint={s.daysCompleted >= 30 ? "hit! 🎉" : `${Math.max(0, 30 - s.daysCompleted)} days left`}
            />
            <Stat
              label="Pace"
              value={
                s.pace === "not-started"
                  ? "—"
                  : s.pace === "ahead"
                    ? "🔥 Ahead"
                    : s.pace === "on-track"
                      ? "✅ On track"
                      : "🐢 Behind"
              }
            />
          </div>
        </div>
      </section>

      {/* ---- 60-day grid ---- */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">
          The 60 days
        </h2>
        <div className="card p-5">
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
              const { status, hit } = dayStatus(day);
              const milestone = MILESTONES.find((m) => m.day === day);
              const cell = (
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`flex aspect-square items-center justify-center rounded-md font-mono text-[9px] font-bold transition-colors sm:text-[11px] ${
                    status === "done"
                      ? "bg-neon-green/80 text-ink-950"
                      : status === "today"
                        ? "bg-neon text-ink-950 shadow-glow"
                        : "bg-ink-700 text-slate-400 hover:bg-ink-600"
                  } ${milestone ? "ring-2 ring-neon-amber" : ""}`}
                  title={
                    (hit ? `Day ${day}: ${hit.lesson.title}` : `Day ${day}`) +
                    (milestone ? ` — ${milestone.label}` : "")
                  }
                >
                  {milestone ? "🏆" : day}
                </motion.div>
              );
              return hit ? (
                <Link key={day} href={`/learn/${hit.module.id}/${hit.lesson.id}`}>
                  {cell}
                </Link>
              ) : (
                <div key={day}>{cell}</div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <i className="h-3 w-3 rounded-sm bg-neon-green/80" /> completed
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3 w-3 rounded-sm bg-neon" /> today
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3 w-3 rounded-sm bg-ink-700" /> upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3 w-3 rounded-sm ring-2 ring-neon-amber" /> milestone (Day 30 → 80%, Day 60 → 90%)
            </span>
          </div>
        </div>
      </section>

      {/* ---- modules ---- */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">
          Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((mod) => {
            const unlocked = isModuleUnlocked(mod, completed);
            const pct = moduleProgress(mod, completed);
            return (
              <div
                key={mod.id}
                className={`card p-5 ${unlocked ? "" : "opacity-60"}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className={`font-extrabold ${mod.color}`}>
                    {mod.emoji} Module {mod.order}: {mod.title}
                  </h3>
                  {!unlocked && <span title="Finish the previous module to unlock">🔒</span>}
                </div>
                <p className="mb-3 text-xs text-slate-400">{mod.tagline}</p>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-ink-700">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-neon to-neon-purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                  />
                </div>
                <ul className="space-y-1.5">
                  {mod.lessons.map((l) => {
                    const done = completedSet.has(l.id);
                    return (
                      <li key={l.id}>
                        {unlocked ? (
                          <Link
                            href={`/learn/${mod.id}/${l.id}`}
                            className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-ink-700"
                          >
                            <span className={done ? "text-slate-500 line-through" : "text-slate-200"}>
                              {done ? "✅" : "○"} {l.emoji} {l.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 group-hover:text-neon">
                              d{l.days[0]}–{l.days[1]}
                            </span>
                          </Link>
                        ) : (
                          <span className="flex items-center justify-between px-2 py-1.5 text-sm text-slate-500">
                            <span>🔒 {l.emoji} {l.title}</span>
                            <span className="font-mono text-[10px]">d{l.days[0]}–{l.days[1]}</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {start && (
        <div className="text-right">
          <button
            className="text-xs text-slate-600 underline-offset-2 hover:text-neon-rose hover:underline"
            onClick={() => {
              if (confirm("Reset ALL progress? This cannot be undone.")) resetProgress();
            }}
          >
            reset all progress
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/60 px-3 py-3">
      <div className="text-lg font-extrabold text-slate-100">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      {hint && <div className="mt-0.5 text-[10px] text-neon-amber">{hint}</div>}
    </div>
  );
}
