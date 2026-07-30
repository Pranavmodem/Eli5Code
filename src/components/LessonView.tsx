"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getLesson, nextLesson } from "@/lib/curriculum";
import { useBootcamp } from "@/lib/store";
import ModeToggle from "./ModeToggle";
import VisualizerHost from "./visualizers/VisualizerHost";

/**
 * Reusable interactive lesson template: analogy banner, the global ELI5/Tech
 * toggle, animated explanation swap, an optional visualizer, and progress
 * controls. All lessons render through this one component.
 */
export default function LessonView({
  moduleId,
  lessonId,
}: {
  moduleId: string;
  lessonId: string;
}) {
  const hit = getLesson(moduleId, lessonId);
  const mode = useBootcamp((s) => s.mode);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const completeLesson = useBootcamp((s) => s.completeLesson);
  const uncompleteLesson = useBootcamp((s) => s.uncompleteLesson);

  if (!hit) return null;
  const { module: mod, lesson } = hit;
  const activeMode = hydrated ? mode : "eli5";
  const isComplete = hydrated && completedLessons.includes(lesson.id);
  const next = nextLesson(moduleId, lessonId);
  const paragraphs = activeMode === "eli5" ? lesson.eli5 : lesson.tech;

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard" className="hover:text-neon">
          Dashboard
        </Link>
        <span>/</span>
        <span>
          {mod.emoji} {mod.title}
        </span>
        <span>/</span>
        <span className="text-slate-300">{lesson.title}</span>
      </nav>

      <header className="card mb-6 p-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="mr-2">{lesson.emoji}</span>
            {lesson.title}
          </h1>
          <span className="shrink-0 rounded-full border border-ink-600 px-3 py-1 font-mono text-[10px] text-slate-400">
            Days {lesson.days[0]}–{lesson.days[1]}
          </span>
        </div>
        <p className="text-sm italic text-slate-400">“{lesson.analogy}”</p>
      </header>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
          {activeMode === "eli5" ? "🧸 Explained like you're five" : "⚙️ The technical version"}
        </h2>
        <ModeToggle />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className={`card mb-8 space-y-4 border-l-4 p-6 ${
            activeMode === "eli5" ? "border-l-neon-green" : "border-l-neon"
          }`}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`leading-relaxed ${
                activeMode === "tech" ? "font-mono text-[13px] text-slate-300" : "text-[15px] text-slate-200"
              }`}
            >
              {p}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>

      {lesson.visualizer && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">
            👀 See it happen
          </h2>
          <VisualizerHost vkey={lesson.visualizer} />
        </section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => (isComplete ? uncompleteLesson(lesson.id) : completeLesson(lesson.id))}
          className={isComplete ? "btn-ghost" : "btn-primary"}
        >
          {isComplete ? "✅ Completed — undo" : "Mark lesson complete"}
        </motion.button>
        {next ? (
          <Link
            href={`/learn/${next.module.id}/${next.lesson.id}`}
            className="btn-ghost"
          >
            Next: {next.lesson.emoji} {next.lesson.title} →
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-ghost">
            🏆 Back to dashboard
          </Link>
        )}
      </footer>
    </article>
  );
}
