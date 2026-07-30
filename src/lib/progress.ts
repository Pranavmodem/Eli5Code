import { allLessons, modules, Module, TOTAL_DAYS, HOURS_PER_DAY } from "./curriculum";

export interface ProgressSummary {
  completedCount: number;
  totalLessons: number;
  /** Days of curriculum material fully completed (each lesson covers a day range) */
  daysCompleted: number;
  hoursLogged: number;
  /** 0–100 "coding strength": 80% at day 30 of material, 90% at day 60 */
  strength: number;
  /** Calendar day of the journey, 1-based; 0 if not started */
  calendarDay: number;
  pace: "not-started" | "ahead" | "on-track" | "behind";
}

export function lessonDayCount(days: [number, number]): number {
  return days[1] - days[0] + 1;
}

export function summarizeProgress(
  completedLessons: string[],
  startDate: string | null,
  now: Date = new Date()
): ProgressSummary {
  const completedSet = new Set(completedLessons);
  const daysCompleted = allLessons
    .filter((l) => completedSet.has(l.id))
    .reduce((sum, l) => sum + lessonDayCount(l.days), 0);

  // Strength curve: linear to 80% over the first 30 days of material,
  // then linear from 80% to 90% over days 31–60.
  const strength =
    daysCompleted <= 30
      ? (daysCompleted / 30) * 80
      : 80 + ((daysCompleted - 30) / 30) * 10;

  let calendarDay = 0;
  if (startDate) {
    const ms = now.getTime() - new Date(startDate).getTime();
    calendarDay = Math.max(1, Math.min(TOTAL_DAYS, Math.floor(ms / 86_400_000) + 1));
  }

  let pace: ProgressSummary["pace"] = "not-started";
  if (startDate) {
    if (daysCompleted >= calendarDay) pace = "ahead";
    else if (daysCompleted >= calendarDay - 2) pace = "on-track";
    else pace = "behind";
  }

  return {
    completedCount: completedLessons.length,
    totalLessons: allLessons.length,
    daysCompleted,
    hoursLogged: daysCompleted * HOURS_PER_DAY,
    strength: Math.round(strength * 10) / 10,
    calendarDay,
    pace,
  };
}

/** A module unlocks when every lesson in all previous modules is complete. */
export function isModuleUnlocked(mod: Module, completedLessons: string[]): boolean {
  const completedSet = new Set(completedLessons);
  for (const m of modules) {
    if (m.order >= mod.order) break;
    if (!m.lessons.every((l) => completedSet.has(l.id))) return false;
  }
  return true;
}

export function moduleProgress(mod: Module, completedLessons: string[]): number {
  const completedSet = new Set(completedLessons);
  const done = mod.lessons.filter((l) => completedSet.has(l.id)).length;
  return Math.round((done / mod.lessons.length) * 100);
}
