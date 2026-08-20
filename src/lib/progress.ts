import {
  allLessons,
  CORE_LESSONS,
  MASTERY_PER_LESSON,
  TOTAL_DAYS,
  HOURS_PER_DAY,
} from "./curriculum";

export interface ProgressSummary {
  completedCount: number;
  totalLessons: number;
  /** DSA mastery, 0–100: one core lesson moves it 2.5 points */
  mastery: number;
  xp: number;
  level: number;
  streak: number;
  hoursLogged: number;
  /** Calendar day of the journey, 1-based; 0 if not started */
  calendarDay: number;
}

const XP_PER_LESSON = 25;

export function summarizeProgress(
  completedLessons: string[],
  startDate: string | null,
  activityDates: string[] = [],
  now: Date = new Date(),
  extras: { passedExercises?: string[]; quizResults?: Record<string, number> } = {}
): ProgressSummary {
  const done = new Set(completedLessons);
  const coreDone = CORE_LESSONS.filter((l) => done.has(l.id)).length;
  const totalDone = allLessons.filter((l) => done.has(l.id)).length;

  const mastery = Math.min(100, Math.round((coreDone / CORE_LESSONS.length) * 1000) / 10);
  const quizCorrect = allLessons.filter(
    (l) => l.q && extras.quizResults?.[l.id] === l.q.x
  ).length;
  const xp =
    totalDone * XP_PER_LESSON +
    (extras.passedExercises?.length ?? 0) * 15 +
    quizCorrect * 5;
  const level = Math.floor(xp / 100) + 1;

  let calendarDay = 0;
  if (startDate) {
    const ms = now.getTime() - new Date(startDate).getTime();
    calendarDay = Math.max(1, Math.min(TOTAL_DAYS, Math.floor(ms / 86_400_000) + 1));
  }

  // streak: consecutive days ending today or yesterday
  const days = new Set(activityDates);
  let streak = 0;
  const cursor = new Date(now);
  const key = (d: Date) => d.toISOString().slice(0, 10);
  if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1); // grace: yesterday keeps it alive
  while (days.has(key(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    completedCount: totalDone,
    totalLessons: allLessons.length,
    mastery,
    xp,
    level,
    streak,
    hoursLogged: totalDone * HOURS_PER_DAY,
    calendarDay,
  };
}

/** A module unlocks when at least 70% of the previous module is complete. */
export function isModuleUnlocked(
  moduleIndex: number,
  modules: { lessons: { id: string }[] }[],
  completedLessons: string[]
): boolean {
  if (moduleIndex === 0) return true;
  const prev = modules[moduleIndex - 1];
  const done = new Set(completedLessons);
  const count = prev.lessons.filter((l) => done.has(l.id)).length;
  return count >= Math.ceil(prev.lessons.length * 0.7);
}

export function moduleProgress(
  mod: { lessons: { id: string }[] },
  completedLessons: string[]
): number {
  const done = new Set(completedLessons);
  const n = mod.lessons.filter((l) => done.has(l.id)).length;
  return Math.round((n / mod.lessons.length) * 100);
}
