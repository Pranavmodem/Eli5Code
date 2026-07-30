import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "eli5" | "tech";

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
}

interface BootcampState {
  /** Signed-in Supabase user (null = guest). Never persisted locally —
   *  Supabase's own session storage is the source of truth. */
  authUser: AuthUser | null;
  authReady: boolean;
  setAuth: (user: AuthUser | null) => void;
  /** Global explanation mode: ELI5 analogies vs technical jargon */
  mode: Mode;
  /** Anonymous id used to sync progress to Supabase without an account */
  deviceId: string | null;
  /** ISO date the user started the 60-day journey */
  startDate: string | null;
  /** Lesson ids marked complete */
  completedLessons: string[];
  hasHydrated: boolean;

  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  ensureDeviceId: () => void;
  startJourney: () => void;
  completeLesson: (lessonId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  mergeRemote: (remote: { completedLessons?: string[]; startDate?: string | null }) => void;
  resetProgress: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useBootcamp = create<BootcampState>()(
  persist(
    (set, get) => ({
      authUser: null,
      authReady: false,
      setAuth: (user) => set({ authUser: user, authReady: true }),
      mode: "eli5",
      deviceId: null,
      startDate: null,
      completedLessons: [],
      hasHydrated: false,

      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "eli5" ? "tech" : "eli5" }),

      ensureDeviceId: () => {
        if (!get().deviceId && typeof crypto !== "undefined") {
          set({ deviceId: crypto.randomUUID() });
        }
      },

      startJourney: () => {
        if (!get().startDate) set({ startDate: new Date().toISOString() });
      },

      completeLesson: (lessonId) => {
        const { completedLessons, startDate } = get();
        if (completedLessons.includes(lessonId)) return;
        set({
          completedLessons: [...completedLessons, lessonId],
          startDate: startDate ?? new Date().toISOString(),
        });
      },

      uncompleteLesson: (lessonId) =>
        set({ completedLessons: get().completedLessons.filter((id) => id !== lessonId) }),

      mergeRemote: (remote) => {
        const local = get();
        const merged = Array.from(
          new Set([...local.completedLessons, ...(remote.completedLessons ?? [])])
        );
        const startDate =
          local.startDate && remote.startDate
            ? (local.startDate < remote.startDate ? local.startDate : remote.startDate)
            : local.startDate ?? remote.startDate ?? null;
        set({ completedLessons: merged, startDate });
      },

      resetProgress: () => set({ completedLessons: [], startDate: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "zero-to-hero-progress",
      partialize: (s) => ({
        mode: s.mode,
        deviceId: s.deviceId,
        startDate: s.startDate,
        completedLessons: s.completedLessons,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
