"use client";

import { useEffect, useRef } from "react";
import { useBootcamp } from "@/lib/store";
import { fetchUserProgress, pushUserProgress } from "@/lib/supabase";

/**
 * Keeps progress in sync with Supabase for signed-in users (rows keyed by
 * user id in `user_progress`, RLS: own row only). Guests are local-only —
 * zustand persists to localStorage, and on first login the local state is
 * merged (union) into the account row, so sample-lesson progress carries over.
 */
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const mergeRemote = useBootcamp((s) => s.mergeRemote);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const mode = useBootcamp((s) => s.mode);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const pulledFor = useRef<string | null>(null);
  const pushesToSkip = useRef(1);

  // Pull + merge once per signed-in identity
  useEffect(() => {
    if (!hydrated || !authReady || !authUser || pulledFor.current === authUser.id) return;
    pulledFor.current = authUser.id;
    pushesToSkip.current += 1; // the merge itself shouldn't trigger a push loop
    fetchUserProgress(authUser.id).then((remote) => {
      if (remote) {
        mergeRemote({
          completedLessons: remote.completed_lessons ?? [],
          startDate: remote.start_date,
        });
      }
    });
  }, [hydrated, authReady, authUser, mergeRemote]);

  // Debounced push on change (signed-in only)
  useEffect(() => {
    if (!hydrated || !authReady || !authUser) return;
    if (pushesToSkip.current > 0) {
      pushesToSkip.current -= 1;
      return;
    }
    const t = setTimeout(() => {
      pushUserProgress(authUser.id, {
        completed_lessons: completedLessons,
        start_date: startDate,
        mode,
      });
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, authReady, authUser?.id, completedLessons, startDate, mode]);

  return <>{children}</>;
}
