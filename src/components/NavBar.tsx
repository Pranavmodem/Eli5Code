"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "./ModeToggle";
import { useBootcamp } from "@/lib/store";
import { summarizeProgress } from "@/lib/progress";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const summary = summarizeProgress(hydrated ? completedLessons : [], hydrated ? startDate : null);

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
        </div>
      </div>
    </header>
  );
}
