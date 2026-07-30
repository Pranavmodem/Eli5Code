"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "./ModeToggle";
import { useBootcamp } from "@/lib/store";
import { summarizeProgress } from "@/lib/progress";
import { getSupabase } from "@/lib/supabase";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const summary = summarizeProgress(hydrated ? completedLessons : [], hydrated ? startDate : null);

  const signOut = () => {
    getSupabase()?.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="text-xl">🦸</span>
          <span className="hidden sm:inline">
            Zero<span className="text-neon">→</span>Hero
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                pathname === l.href
                  ? "bg-ink-700 text-neon"
                  : "text-slate-400 hover:bg-ink-800 hover:text-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-xs sm:flex"
            title="Coding strength"
          >
            <span>💪</span>
            <span className="font-bold text-neon-green">{summary.strength}%</span>
          </div>
          <ModeToggle compact />
          {authReady &&
            (authUser ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs font-bold text-neon-purple md:inline">
                  @{authUser.username ?? authUser.email.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:text-neon-rose"
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <Link href="/login" className="rounded-lg px-2 py-1.5 font-medium text-slate-400 hover:text-slate-100">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary px-3 py-1.5 text-xs">
                  Sign up
                </Link>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}
