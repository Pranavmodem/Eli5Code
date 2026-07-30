"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBootcamp } from "@/lib/store";
import { lessonForDay } from "@/lib/curriculum";
import { summarizeProgress } from "@/lib/progress";

/** Jumps straight to the lesson scheduled for the learner's current day. */
export default function TodayPage() {
  const router = useRouter();
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const startDate = useBootcamp((s) => s.startDate);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startJourney = useBootcamp((s) => s.startJourney);

  useEffect(() => {
    if (!hydrated) return;
    if (!startDate) startJourney();
    const s = summarizeProgress(completedLessons, startDate ?? new Date().toISOString());
    const hit = lessonForDay(Math.max(1, s.calendarDay || 1));
    router.replace(`/learn/${hit.lesson.id}`);
  }, [hydrated, startDate, completedLessons, router, startJourney]);

  return (
    <div style={{ padding: "var(--space-8)", textAlign: "center" }} className="text-muted">
      Finding today's session…
    </div>
  );
}
