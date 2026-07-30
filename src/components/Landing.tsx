"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useBootcamp } from "@/lib/store";
import { modules, TOTAL_DAYS } from "@/lib/curriculum";
import { vizForLesson } from "@/lib/viz";
import VizPlayer from "./VizPlayer";
import Dashboard from "./Dashboard";

/**
 * What a first-time visitor sees at "/": what this site is, who it's for,
 * and a live visualizer they can play with before signing up.
 * Signed-in learners skip straight to their dashboard.
 */
export default function Landing() {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const demo = useMemo(() => vizForLesson("m3l1"), []); // bubble sort

  if (authReady && authUser) return <Dashboard />;

  return (
    <div style={{ padding: "var(--space-8)", maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: "calc(var(--space-8) * 1.5)" }}>
      {/* ── hero ─────────────────────────────────────────────── */}
      <section style={{ textAlign: "center", paddingTop: "var(--space-6)" }}>
        <div className="kicker" style={{ marginBottom: "var(--space-3)" }}>
          Interactive coding bootcamp · {TOTAL_DAYS} days · 2 hours a day
        </div>
        <h1 style={{ fontSize: 58, lineHeight: 1.02, margin: "0 auto var(--space-4)", maxWidth: "16ch" }}>
          Data structures &amp; algorithms,{" "}
          <span style={{ color: "var(--color-accent)" }}>explained like you&apos;re five.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "58ch", margin: "0 auto var(--space-6)", color: "var(--color-neutral-800)" }}>
          Arrays are bookshelves. Stacks are tray piles. Big&nbsp;O is two chefs cooking for a
          wedding. Every concept starts as a story you already understand, becomes a
          <b> visualizer you can step through frame by frame</b> — and when you&apos;re ready,
          one switch flips the same lesson into precise technical language with real Python code.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: 15, padding: "10px 24px" }}>
            Start learning free
          </Link>
          <Link href="/learn/m1l1" className="btn btn-secondary" style={{ fontSize: 15, padding: "10px 24px" }}>
            Try a lesson — no account
          </Link>
        </div>
        <p className="text-muted" style={{ fontSize: 12, marginTop: "var(--space-3)" }}>
          8 modules · 80 lessons · a visualizer in every single one
        </p>
      </section>

      {/* ── live demo ────────────────────────────────────────── */}
      {demo && (
        <section>
          <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ margin: "0 0 4px" }}>Don&apos;t read it. Watch it.</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>
              This is a real lesson visualizer — press <b>Play</b>, step back and forth, and
              call the swaps before they happen. Every lesson on the site has one of these.
            </p>
          </div>
          <VizPlayer viz={demo} />
        </section>
      )}

      {/* ── how it works ─────────────────────────────────────── */}
      <section>
        <h2 style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>How ELI5Code teaches</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
          {[
            ["🧸 → ⚙", "One toggle, two depths", "Every lesson is written twice: a real-world analogy for your first read, and the precise technical version for when it clicks. Flip between them any time — even mid-answer in the AI tutor."],
            ["▶", "Step-through visualizers", "All 80 lessons ship with an interactive step script: sorting bars, treasure-hunt linked lists, rippling graph traversals, DP tables filling in. Play, pause, scrub, and predict what happens next."],
            ["📅", "A plan, not a pile", "A 60-day roadmap paced at 2 hours a day. DSA mastery climbs 2.5 points per lesson, modules unlock as you go, and streaks + XP keep the habit alive. An advanced track continues to day 90."],
            ["🐍", "Real code, real uses", "Each concept comes with Python and JavaScript implementations, 'how developers actually think' notes, and where the idea shows up in production systems."],
            ["✅", "Check yourself", "Predict-the-next-step challenges inside the visualizers and a quiz in every lesson catch shaky understanding before it compounds."],
            ["🤖", "An AI tutor on every page", "Stuck at 11pm? Ask anything. It answers in ELI5 or technical style — matching the same toggle as your lessons."],
          ].map(([icon, title, text]) => (
            <div key={title as string} className="blueprint" style={{ padding: "var(--space-4)" }}>
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <h4 style={{ marginBottom: 6 }}>{title}</h4>
              <p className="text-muted" style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── curriculum ───────────────────────────────────────── */}
      <section>
        <h2 style={{ textAlign: "center", marginBottom: "var(--space-2)" }}>What you&apos;ll master</h2>
        <p className="text-muted" style={{ textAlign: "center", fontSize: 14, marginBottom: "var(--space-6)" }}>
          Zero to interview-ready: the core track takes you to 100% DSA mastery in 60 days;
          the advanced track keeps going.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
          {modules.map((m) => (
            <Link key={m.id} href="/curriculum" className="zh-row" style={{ display: "block", textDecoration: "none", color: "inherit", border: "1px solid var(--color-divider)", padding: "var(--space-3) var(--space-4)" }}>
              <div className="kicker" style={{ fontSize: 10 }}>{m.n} · days {m.days[0]}–{m.days[1]}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17 }}>{m.name}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{m.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── final CTA ────────────────────────────────────────── */}
      <section className="blueprint" style={{ padding: "var(--space-8)", textAlign: "center" }}>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
        <h2 style={{ marginBottom: 6 }}>Day 1 takes two hours.</h2>
        <p className="text-muted" style={{ fontSize: 14.5, maxWidth: "48ch", margin: "0 auto var(--space-4)" }}>
          By day 30 you&apos;ll read code in data structures the way you read maps in
          neighborhoods. By day 60, Big&nbsp;O is instinct.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: 15, padding: "10px 24px" }}>Create your free account</Link>
          <Link href="/curriculum" className="btn btn-secondary" style={{ fontSize: 15 }}>Browse the full curriculum</Link>
        </div>
      </section>
    </div>
  );
}
