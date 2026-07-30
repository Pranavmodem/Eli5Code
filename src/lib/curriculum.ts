// Curriculum wrapper — merges the three data modules (m1–m4 core, m5–m8
// advanced) into one typed API. Lesson/quiz content lives in src/data/.
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

export const modules: Module[] = [
  ...(MODULES as unknown as Module[]),
  ...(MODULES_56 as unknown as Module[]),
  ...(MODULES_78 as unknown as Module[]),
];

/** Core program: modules 1–4, the 60-day / 0→100% track. */
export const coreModules = modules.slice(0, 4);
export const advancedModules = modules.slice(4);

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);
export const CORE_LESSONS = coreModules.flatMap((m) => m.lessons);
export const HOURS_PER_DAY = 2;
export const TOTAL_DAYS = 60; // the headline program
export const PROGRAM_DAYS = 90; // including the advanced track
export const MASTERY_PER_LESSON = 2.5; // one core lesson moves DSA mastery 2.5 points

export const MILESTONES = [
  { day: 30, strength: 80, label: "Day 30 — 80% coding strength" },
  { day: 60, strength: 100, label: "Day 60 — core mastery 100%" },
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
