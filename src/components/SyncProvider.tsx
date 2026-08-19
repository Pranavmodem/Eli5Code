"use client";

import { useEffect, useRef } from "react";
import { useBootcamp } from "@/lib/store";
import { fetchUserProgress, pushUserProgress } from "@/lib/supabase";

/**
 * Syncs progress with Supabase for signed-in users (rows keyed by user id in
 * `user_progress`, RLS: own row only).
 *
 * Progress is PER ACCOUNT. The local copy carries a `progressOwner`, and on
 * every identity change we decide what the local copy becomes:
 *   • same account again → merge, so work done offline isn't lost
 *   • guest → account whose server row is empty → carry the guest's work over
 *   • anything else (different account, or account already has progress)
 *     → adopt the server copy verbatim
 *   • signed out → wipe back to a clean guest slate
 * Without this, two people sharing a browser would see each other's progress.
 */
export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const mergeRemote = useBootcamp((s) => s.mergeRemote);
  const adoptRemote = useBootcamp((s) => s.adoptRemote);
  const claimLocalFor = useBootcamp((s) => s.claimLocalFor);
  const resetToGuest = useBootcamp((s) => s.resetToGuest);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const mode = useBootcamp((s) => s.mode);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const settledFor = useRef<string | null>(null);
  const pushesToSkip = useRef(1);

  useEffect(() => {
    if (!hydrated || !authReady) return;
    const identity = authUser?.id ?? "guest";
    if (settledFor.current === identity) return;
    settledFor.current = identity;

    // Signed out: never leave one account's progress on screen for the next person.
    if (!authUser) {
      const { progressOwner } = useBootcamp.getState();
      if (progressOwner !== null) {
        pushesToSkip.current += 1;
        resetToGuest();
      }
      return;
    }

    pushesToSkip.current += 1;
    const owner = useBootcamp.getState().progressOwner;

    fetchUserProgress(authUser.id).then((remote) => {
      const remoteProgress = remote
        ? { completedLessons: remote.completed_lessons ?? [], startDate: remote.start_date }
        : null;
      const remoteEmpty = !remoteProgress?.completedLessons.length;
      const local = useBootcamp.getState();

      if (owner === authUser.id) {
        // same account returning — reconcile local and server
        if (remoteProgress) mergeRemote(remoteProgress);
        else claimLocalFor(authUser.id);
        return;
      }
      if (owner === null && remoteEmpty && local.completedLessons.length) {
        // guest work carries into a brand-new account
        claimLocalFor(authUser.id);
        return;
      }
      // different account (or this one already has progress): the server wins
      adoptRemote(authUser.id, remoteProgress);
    });
  }, [hydrated, authReady, authUser, mergeRemote, adoptRemote, claimLocalFor, resetToGuest]);

  // Debounced push on change — signed-in users only; guests stay local.
  useEffect(() => {
    if (!hydrated || !authReady || !authUser) return;
    if (useBootcamp.getState().progressOwner !== authUser.id) return; // not settled yet
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
