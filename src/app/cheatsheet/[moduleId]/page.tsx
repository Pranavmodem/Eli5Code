import Link from "next/link";
import { notFound } from "next/navigation";
import { modules } from "@/lib/curriculum";
import { vizForLesson } from "@/lib/viz";

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export function generateMetadata({ params }: { params: { moduleId: string } }) {
  const m = modules.find((x) => x.id === params.moduleId);
  return { title: m ? `${m.name} — Cheatsheet` : "Cheatsheet" };
}

/** One printable page per module: every lesson's analogy, definition and code. */
export default function CheatsheetPage({ params }: { params: { moduleId: string } }) {
  const m = modules.find((x) => x.id === params.moduleId);
  if (!m) notFound();
  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <div className="kicker" style={{ marginBottom: 4 }}>{m.n} · days {m.days[0]}–{m.days[1]} · cheatsheet</div>
      <h1 style={{ marginBottom: 4 }}>{m.name}</h1>
      <p className="text-muted" style={{ marginBottom: "var(--space-6)", fontSize: 13.5 }}>
        The whole module on one page — analogy on the left of your memory, definition on the right.
        Print it (Ctrl/Cmd+P) and stick it above your desk.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {m.lessons.map((l, i) => {
          const py = vizForLesson(l.id)?.py ?? l.py;
          return (
            <section key={l.id} className="blueprint" style={{ padding: "var(--space-4)", breakInside: "avoid" }}>
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span className="mono text-muted" style={{ fontSize: 11 }}>{i + 1}.</span>
                <Link href={`/learn/${l.id}`} style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, textDecoration: "none", color: "inherit" }}>{l.t}</Link>
                <span className="text-muted" style={{ fontSize: 12, marginLeft: "auto", textAlign: "right" }}>{l.a}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, margin: "0 0 8px", color: "var(--color-neutral-800)" }}>
                {l.k.split(". ").slice(0, 2).join(". ")}.
              </p>
              {py && <pre className="codeblock" style={{ fontSize: 11.5, maxHeight: 180, overflow: "auto" }}>{py}</pre>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
