"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBootcamp } from "@/lib/store";
import { summarizeProgress } from "@/lib/progress";
import { getSupabase } from "@/lib/supabase";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/today", label: "Today's session" },
];

export default function NavBar() {
  const pathname = usePathname();
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const completedLessons = useBootcamp((s) => s.completedLessons);
  const startDate = useBootcamp((s) => s.startDate);
  const activityDates = useBootcamp((s) => s.activityDates);
  const mode = useBootcamp((s) => s.mode);
  const setMode = useBootcamp((s) => s.setMode);
  const theme = useBootcamp((s) => s.theme);
  const toggleTheme = useBootcamp((s) => s.toggleTheme);
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);

  // apply theme to <html> so every page (and portals) inherit tokens
  useEffect(() => {
    if (hydrated) document.documentElement.dataset.theme = theme;
  }, [hydrated, theme]);

  const s = summarizeProgress(
    hydrated ? completedLessons : [],
    hydrated ? startDate : null,
    hydrated ? activityDates : []
  );
  const activeMode = hydrated ? mode : "eli5";

  return (
    <header
      className="nav"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "var(--space-3) var(--space-8)",
        borderBottom: "1px solid var(--color-divider)",
        gap: "var(--space-6)",
        position: "sticky",
        top: 0,
        background: "var(--color-bg)",
        zIndex: 20,
      }}
    >
      <Link
        href="/"
        className="nav-brand"
        style={{ letterSpacing: "0.03em", textDecoration: "none", color: "inherit", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18 }}
      >
        ZERO&nbsp;/&nbsp;HERO
      </Link>
      <nav style={{ display: "flex", gap: "var(--space-6)", marginRight: "auto" }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              textDecoration: "none",
              color: pathname === l.href ? "var(--color-accent-700)" : "inherit",
              fontSize: 14,
              fontWeight: pathname === l.href ? 600 : 400,
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex" style={{ alignItems: "center", gap: "var(--space-2)" }}>
        <span className="tag tag-neutral">Streak {s.streak}d</span>
        <span className="tag tag-neutral">{s.xp} XP</span>
        <span className="tag tag-neutral">Level {s.level}</span>
        <span className="tag tag-outline">DSA {s.mastery}%</span>
      </div>

      {/* ELI5 / Tech — global switch */}
      <div className="seg" role="tablist" aria-label="Explanation mode">
        {(["eli5", "tech"] as const).map((m) => (
          <label key={m} className="seg-opt" style={{ background: activeMode === m ? "var(--color-accent)" : "transparent", color: activeMode === m ? "var(--color-bg)" : "inherit", cursor: "pointer" }}>
            <input type="radio" name="mode" checked={activeMode === m} onChange={() => setMode(m)} />
            {m === "eli5" ? "ELI5" : "Tech"}
          </label>
        ))}
      </div>

      <button
        className="btn btn-icon btn-secondary"
        onClick={toggleTheme}
        title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        aria-label="Toggle theme"
      >
        {hydrated && theme === "dark" ? "☀️" : "🌙"}
      </button>

      {authReady &&
        (authUser ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {authUser.isAdmin && (
              <Link href="/admin" className="tag tag-outline" style={{ textDecoration: "none" }}>
                Admin
              </Link>
            )}
            <Link href="/account" className="tag tag-accent" style={{ textDecoration: "none" }} title="Account settings">
              @{authUser.username ?? authUser.email.split("@")[0]}
            </Link>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => getSupabase()?.auth.signOut()}
            >
              Sign out
            </button>
          </span>
        ) : (
          <span style={{ display: "flex", gap: 8 }}>
            <Link href="/login" className="btn btn-secondary">Log in</Link>
            <Link href="/signup" className="btn btn-primary">Sign up</Link>
          </span>
        ))}
    </header>
  );
}
