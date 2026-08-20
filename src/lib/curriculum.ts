// Curriculum wrapper — merges the three data modules (m1–m4 core, m5–m8
// advanced) into one typed API. Lesson/quiz content lives in src/data/.
// @ts-ignore untyped data module
import { MODULES_M0 } from "@/data/curriculum-m0";
// @ts-ignore untyped data module
import { MODULES } from "@/data/curriculum";
// @ts-ignore untyped data module
import { MODULES_56 } from "@/data/curriculum-m56";
// @ts-ignore untyped data module
import { MODULES_78 } from "@/data/curriculum-m78";

export interface Quiz {
  q: string;
  o: string[];
  x: number;
  w: string;
}

export interface Lesson {
  id: string; // globally unique, e.g. "m3l1"
  t: string; // title
  a: string; // analogy label
  e: string; // ELI5 body
  k: string; // Tech body
  v: string | null; // visualizer key
  q?: Quiz;
  ap?: string[]; // approach notes (modules 5–8 carry their own)
  use?: string[]; // real-world applications (modules 5–8 carry their own)
  py?: string; // python sample (modules 5–8 carry their own)
}

export interface Module {
  id: string;
  n: string; // "Module 1"
  name: string;
  blurb: string;
  days: [number, number];
  lessons: Lesson[];
}

// ── Learning-order restructure ─────────────────────────────────────────────
// Research-backed sequence (CS50 / Princeton / standard curricula): programming
// fundamentals first, and recursion BEFORE the lessons that depend on it
// (merge sort, quick sort, DFS). Lesson ids are stable — only order changes —
// so existing progress, URLs and visualizer keys are untouched.
const M3_ORDER = [
  "m3l6", // Linear Search — gentlest start, no prerequisites
  "m3l7", // Binary Search — builds directly on linear
  "m3l1", // Bubble Sort
  "m3l2", // Selection Sort
  "m3l3", // Insertion Sort — the three iterative sorts together
  "m3l10", // Recursion — MUST precede merge/quick/DFS
  "m3l4", // Merge Sort — first recursive algorithm
  "m3l5", // Quick Sort
  "m3l8", // BFS — queue-driven
  "m3l9", // DFS — stack/recursion-driven, last
];

// Day ranges with the 9-day Foundations module in front (program: 99 days;
// the 60-day headline still covers the full core track, which ends day 54).
const DAY_RANGES: Record<string, [number, number]> = {
  m0: [1, 9], m1: [10, 20], m2: [21, 31], m3: [32, 43], m4: [44, 54],
  m5: [55, 65], m6: [66, 76], m7: [77, 88], m8: [89, 99],
};

function restructure(mods: Module[]): Module[] {
  return mods.map((m) => {
    const days = DAY_RANGES[m.id] ?? m.days;
    if (m.id !== "m3") return { ...m, days };
    const byId = new Map(m.lessons.map((l) => [l.id, l]));
    return { ...m, days, lessons: M3_ORDER.map((id) => byId.get(id)!).filter(Boolean) };
  });
}

export const modules: Module[] = restructure([
  ...(MODULES_M0 as unknown as Module[]),
  ...(MODULES as unknown as Module[]),
  ...(MODULES_56 as unknown as Module[]),
  ...(MODULES_78 as unknown as Module[]),
]);

/** Core program: modules 0–4, the 0→100% mastery track. */
export const coreModules = modules.slice(0, 5);
export const advancedModules = modules.slice(5);

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);
export const CORE_LESSONS = coreModules.flatMap((m) => m.lessons);
export const HOURS_PER_DAY = 2;
export const TOTAL_DAYS = 60; // the headline program
export const PROGRAM_DAYS = 99; // including the advanced track
/** One core lesson's worth of DSA mastery (core = modules 0–4). */
export const MASTERY_PER_LESSON = 100 / (5 * 10);

export const MILESTONES = [
  { day: 30, strength: 80, label: "Day 30 — ~80% core mastery" },
  { day: 54, strength: 100, label: "Day 54 — core mastery 100%" },
];

const lessonIndexById = new Map<string, { module: Module; lesson: Lesson; flat: number }>();
allLessons.forEach((l, i) => {
  const mod = modules.find((m) => m.lessons.some((x) => x.id === l.id))!;
  lessonIndexById.set(l.id, { module: mod, lesson: l, flat: i });
});

export function getLesson(lessonId: string) {
  return lessonIndexById.get(lessonId);
}

export function nextLesson(lessonId: string) {
  const hit = lessonIndexById.get(lessonId);
  if (!hit || hit.flat >= allLessons.length - 1) return undefined;
  const next = allLessons[hit.flat + 1];
  return lessonIndexById.get(next.id);
}

export function prevLesson(lessonId: string) {
  const hit = lessonIndexById.get(lessonId);
  if (!hit || hit.flat === 0) return undefined;
  const prev = allLessons[hit.flat - 1];
  return lessonIndexById.get(prev.id);
}

/** First (start) day of a lesson within its module's day range. */
export function dayOfLesson(lessonId: string): number {
  const hit = lessonIndexById.get(lessonId);
  if (!hit) return 1;
  const { module: m, lesson } = hit;
  const i = m.lessons.findIndex((l) => l.id === lesson.id);
  const span = m.days[1] - m.days[0] + 1;
  return m.days[0] + Math.floor((i * span) / m.lessons.length);
}

/** The lesson scheduled for a given program day (1..90). */
export function lessonForDay(day: number) {
  const d = Math.max(1, Math.min(PROGRAM_DAYS, day));
  const m = modules.find((x) => d >= x.days[0] && d <= x.days[1]) ?? modules[modules.length - 1];
  const span = m.days[1] - m.days[0] + 1;
  const i = Math.min(m.lessons.length - 1, Math.floor(((d - m.days[0]) * m.lessons.length) / span));
  return lessonIndexById.get(m.lessons[i].id)!;
}
