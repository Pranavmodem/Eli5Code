import Link from "next/link";
import { modules, PROGRAM_DAYS, TOTAL_DAYS } from "@/lib/curriculum";

export const metadata = { title: "Curriculum — ELI5Code" };

export default function CurriculumPage() {
  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="kicker" style={{ marginBottom: "var(--space-2)" }}>
        8 modules · 80 lessons · {TOTAL_DAYS}-day core + advanced track to day {PROGRAM_DAYS}
      </div>
      <h1 style={{ marginBottom: "var(--space-6)" }}>The curriculum</h1>
      {modules.map((m) => (
        <section key={m.id} style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", borderBottom: "1px solid var(--color-divider)", paddingBottom: "var(--space-2)", marginBottom: "var(--space-2)" }}>
            <span className="kicker">{m.n}</span>
            <h3 style={{ margin: 0 }}>{m.name}</h3>
            <span className="text-muted mono" style={{ marginLeft: "auto", fontSize: 11 }}>days {m.days[0]}–{m.days[1]}</span>
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
      ))}
    </div>
  );
}
