"use client";

import { useState } from "react";
import { useBootcamp, Lang } from "@/lib/store";
// @ts-ignore untyped data module
import { DEEPDIVE } from "@/data/deepdive";

interface Section {
  h: string;
  kind: "table" | "rules" | "code" | "text";
  cols?: string[];
  rows?: (string | number)[][];
  items?: string[];
  code?: string;
  text?: string;
}

interface Entry {
  both?: Section[];
  py?: Section[];
  js?: Section[];
}

/**
 * "In depth" — the full reference for a lesson: every type/operation, its
 * memory cost and complexity, the rules, and runnable proof snippets.
 * Language-specific sections swap with the site-wide 🐍/JS toggle.
 */
export default function DeepDive({ lessonId }: { lessonId: string }) {
  const entry = (DEEPDIVE as Record<string, Entry>)[lessonId];
  const hydrated = useBootcamp((s) => s.hasHydrated);
  const lang = useBootcamp((s) => s.lang);
  const setLang = useBootcamp((s) => s.setLang);
  const [open, setOpen] = useState(true);

  if (!entry) return null;
  const activeLang: Lang = hydrated ? lang : "py";
  const hasLangSplit = Boolean(entry.py || entry.js);
  const sections = [...(entry.both ?? []), ...((activeLang === "py" ? entry.py : entry.js) ?? [])];
  if (!sections.length) return null;

  return (
    <section className="blueprint" style={{ padding: "var(--space-6)" }}>
      <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <span className="kicker">📖 In depth — the full reference</span>
        <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => setOpen(!open)}>
          {open ? "▾ collapse" : "▸ expand"}
        </button>
        {hasLangSplit && (
          <div className="seg" role="tablist" aria-label="Reference language" style={{ marginLeft: "auto" }}>
            {(["py", "js"] as const).map((l) => (
              <label
                key={l}
                className="seg-opt"
                style={{
                  background: activeLang === l ? "var(--color-accent)" : "transparent",
                  color: activeLang === l ? "var(--color-bg)" : "inherit",
                  cursor: "pointer",
                }}
              >
                <input type="radio" name="deepdive-lang" checked={activeLang === l} onChange={() => setLang(l)} />
                {l === "py" ? "🐍 Python" : "JS JavaScript"}
              </label>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", marginTop: "var(--space-4)" }}>
          {sections.map((s, i) => (
            <div key={`${activeLang}-${i}`}>
              <h3 style={{ fontSize: 14.5, margin: "0 0 var(--space-2)" }}>{s.h}</h3>
              {s.kind === "table" && s.cols && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "collapse", fontSize: 12.5, minWidth: 520, width: "100%" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--color-divider)", textAlign: "left" }}>
                        {s.cols.map((c, j) => (
                          <th key={j} className="kicker" style={{ padding: "6px 10px", fontSize: 9.5, whiteSpace: "nowrap" }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(s.rows ?? []).map((r, j) => (
                        <tr key={j} className="zh-row" style={{ borderBottom: "1px solid var(--color-divider)", verticalAlign: "top" }}>
                          {r.map((cell, k) => (
                            <td
                              key={k}
                              className={k <= 1 ? "mono" : undefined}
                              style={{ padding: "6px 10px", lineHeight: 1.5, fontSize: k <= 1 ? 12 : 12.5, whiteSpace: k === 0 ? "nowrap" : undefined, fontWeight: k === 0 ? 600 : undefined }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.kind === "rules" && (
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 7, fontSize: 13.5, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>
                  {(s.items ?? []).map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              )}
              {s.kind === "code" && <pre className="codeblock">{s.code}</pre>}
              {s.kind === "text" && (
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "var(--color-neutral-800)", maxWidth: "78ch" }}>{s.text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
