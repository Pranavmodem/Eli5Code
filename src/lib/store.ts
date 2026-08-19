import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "eli5" | "tech";
export type Theme = "light" | "dark";

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  isAdmin?: boolean;
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
  /** yyyy-mm-dd days with activity — drives the streak tag */
  activityDates: string[];
  /** Whose progress the local copy belongs to: a user id, or null for a guest.
   *  Progress is per-account, so switching identity must never carry it over. */
  progressOwner: string | null;
  theme: Theme;
  hasHydrated: boolean;

  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  ensureDeviceId: () => void;
  startJourney: () => void;
  completeLesson: (lessonId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  mergeRemote: (remote: { completedLessons?: string[]; startDate?: string | null }) => void;
  /** Replace local progress with this account's server copy. */
  adoptRemote: (
    owner: string,
    remote: { completedLessons?: string[]; startDate?: string | null } | null
  ) => void;
  /** Keep the current local progress and attach it to this account. */
  claimLocalFor: (owner: string) => void;
  /** Wipe progress back to a clean guest slate (used on sign-out). */
  resetToGuest: () => void;
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
      activityDates: [],
      progressOwner: null,
      theme: "light",
      hasHydrated: false,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
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
        const { completedLessons, startDate, activityDates } = get();
        if (completedLessons.includes(lessonId)) return;
        const today = new Date().toISOString().slice(0, 10);
        set({
          completedLessons: [...completedLessons, lessonId],
          activityDates: activityDates.includes(today)
            ? activityDates
            : [...activityDates, today],
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

      adoptRemote: (owner, remote) =>
        set({
          progressOwner: owner,
          completedLessons: remote?.completedLessons ?? [],
          startDate: remote?.startDate ?? null,
          activityDates: [],
        }),

      claimLocalFor: (owner) => set({ progressOwner: owner }),

      resetToGuest: () =>
        set({ progressOwner: null, completedLessons: [], startDate: null, activityDates: [] }),

      resetProgress: () => set({ completedLessons: [], startDate: null, activityDates: [] }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "zero-to-hero-progress",
      partialize: (s) => ({
        mode: s.mode,
        theme: s.theme,
        deviceId: s.deviceId,
        startDate: s.startDate,
        completedLessons: s.completedLessons,
        activityDates: s.activityDates,
        progressOwner: s.progressOwner,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
