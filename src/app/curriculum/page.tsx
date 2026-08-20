"use client";

import { useState } from "react";
import Link from "next/link";
import { modules, PROGRAM_DAYS, TOTAL_DAYS, allLessons } from "@/lib/curriculum";

export default function CurriculumPage() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const matches = needle
    ? allLessons.filter((l) =>
        `${l.t} ${l.a} ${l.e} ${l.k}`.toLowerCase().includes(needle)
      )
    : null;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="kicker" style={{ marginBottom: "var(--space-2)" }}>
        9 modules · {allLessons.length} lessons · {TOTAL_DAYS}-day core + advanced track to day {PROGRAM_DAYS}
      </div>
      <h1 style={{ marginBottom: "var(--space-4)" }}>The curriculum</h1>

      <input
        className="input"
        placeholder="Search all lessons — try 'recursion', 'hash', 'pivot', 'scope'…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 460, marginBottom: "var(--space-6)" }}
        aria-label="Search lessons"
      />

      {matches ? (
        <section>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: "var(--space-3)" }}>
            {matches.length} lesson{matches.length === 1 ? "" : "s"} match "{q}"
          </p>
          {matches.map((l) => {
            const m = modules.find((x) => x.lessons.some((y) => y.id === l.id))!;
            return (
              <Link key={l.id} href={`/learn/${l.id}`} className="zh-row" style={{ display: "flex", gap: "var(--space-4)", alignItems: "baseline", padding: "8px", textDecoration: "none", color: "inherit", borderBottom: "1px solid color-mix(in srgb, var(--color-divider) 50%, transparent)" }}>
                <span className="mono text-muted" style={{ fontSize: 11, minWidth: 70 }}>{m.n}</span>
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{l.t}</span>
                <span className="text-muted" style={{ fontSize: 12.5, marginLeft: "auto", textAlign: "right" }}>{l.a}</span>
              </Link>
            );
          })}
        </section>
      ) : (
        modules.map((m) => (
          <section key={m.id} style={{ marginBottom: "var(--space-8)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", borderBottom: "1px solid var(--color-divider)", paddingBottom: "var(--space-2)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
              <span className="kicker">{m.n}</span>
              <h3 style={{ margin: 0 }}>{m.name}</h3>
              <span className="text-muted mono" style={{ marginLeft: "auto", fontSize: 11 }}>days {m.days[0]}–{m.days[1]}</span>
              <Link href={`/cheatsheet/${m.id}`} className="tag tag-outline" style={{ textDecoration: "none", fontSize: 10 }}>cheatsheet ↗</Link>
            </div>
            <p className="text-muted" style={{ fontSize: 13.5, marginBottom: "var(--space-3)" }}>{m.blurb}</p>
            <div>
              {m.lessons.map((l, i) => (
                <Link key={l.id} href={`/learn/${l.id}`} className="zh-row" style={{ display: "flex", gap: "var(--space-4)", alignItems: "baseline", padding: "7px 8px", textDecoration: "none", color: "inherit", borderBottom: "1px solid color-mix(in srgb, var(--color-divider) 50%, transparent)" }}>
                  <span className="mono text-muted" style={{ fontSize: 11, width: 34 }}>{m.id}·{i + 1}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{l.t}</span>
                  <span className="text-muted" style={{ fontSize: 12.5, marginLeft: "auto", textAlign: "right" }}>{l.a}</span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
