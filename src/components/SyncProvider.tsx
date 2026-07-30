"use client";

import { useEffect, useRef } from "react";
import { useBootcamp } from "@/lib/store";
import {
  fetchProgress,
  pushProgress,
  fetchUserProgress,
  pushUserProgress,
} from "@/lib/supabase";

/**
 * Keeps local zustand progress in sync with Supabase.
 * - Signed in: rows keyed by user id in `user_progress` (RLS: own row only).
 * - Guest: anonymous device-id row in `progress` (sample mode).
 * On identity change (login) the remote row is pulled and merged (union) so
 * guest sample progress carries into the account. Works fully offline too.
 */
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const ensureDeviceId = useBootcamp((s) => s.ensureDeviceId);
  const mergeRemote = useBootcamp((s) => s.mergeRemote);
  const deviceId = useBootcamp((s) => s.deviceId);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const mode = useBootcamp((s) => s.mode);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const pulledFor = useRef<string | null>(null);
  const pushesToSkip = useRef(1);

  useEffect(() => {
    if (hydrated) ensureDeviceId();
  }, [hydrated, ensureDeviceId]);

  // Pull + merge whenever identity settles or changes (guest -> user, etc.)
  const identity = authUser ? `user:${authUser.id}` : deviceId ? `device:${deviceId}` : null;

  useEffect(() => {
    if (!hydrated || !authReady || !identity || pulledFor.current === identity) return;
    pulledFor.current = identity;
    pushesToSkip.current += 1; // the merge itself shouldn't trigger a push loop
    const pull = authUser
      ? fetchUserProgress(authUser.id)
      : fetchProgress(deviceId!).then((r) =>
          r ? { completed_lessons: r.completed_lessons, start_date: r.start_date, mode: r.mode } : null
        );
    pull.then((remote) => {
      if (remote) {
        mergeRemote({
          completedLessons: remote.completed_lessons ?? [],
          startDate: remote.start_date,
        });
      }
    });
  }, [hydrated, authReady, identity, authUser, deviceId, mergeRemote]);

  // Debounced push on change
  useEffect(() => {
    if (!hydrated || !authReady || !identity) return;
    if (pushesToSkip.current > 0) {
      pushesToSkip.current -= 1;
      return;
    }
    const t = setTimeout(() => {
      if (authUser) {
        pushUserProgress(authUser.id, {
          completed_lessons: completedLessons,
          start_date: startDate,
          mode,
        });
      } else if (deviceId) {
        pushProgress({
          device_id: deviceId,
          completed_lessons: completedLessons,
          start_date: startDate,
          mode,
        });
      }
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, authReady, identity, completedLessons, startDate, mode]);

  return <>{children}</>;
}
