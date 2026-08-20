"use client";

import { useBootcamp } from "@/lib/store";

const PROJECTS = [
  {
    id: "scheduler",
    emoji: "🗓",
    title: "Task Scheduler",
    uses: "priority queues · hash maps · graphs · topological sort",
    pitch: "Build a command-line task manager where tasks have priorities and dependencies. It must always suggest the most urgent task whose prerequisites are done.",
    steps: [
      "Model a Task (id, title, priority, dependsOn[]) and store tasks in a hash map by id — O(1) lookup",
      "Keep a ready-queue as a heap/priority queue ordered by priority",
      "Detect dependency cycles with DFS before accepting a new task",
      "Topologically sort the whole board into a valid work order",
      "Measure it: add 10,000 fake tasks and confirm suggest-next stays under a millisecond",
    ],
  },
  {
    id: "autocomplete",
    emoji: "⌨️",
    title: "Search Autocomplete",
    uses: "tries · strings · sorting · sliding window",
    pitch: "Type two letters, get the top suggestions instantly — like a search box. Works on a dictionary of 10,000+ words.",
    steps: [
      "Load a word list into a trie; each node stores its subtree's best-ranked completions",
      "Return top-5 completions for any prefix in O(prefix length)",
      "Add fuzzy matching for one typo using edit distance (DP!)",
      "Track trending searches with a sliding-window counter of recent queries",
      "Compare against a naive linear scan and chart both at n = 100 / 1k / 10k words",
    ],
  },
  {
    id: "pathfinder",
    emoji: "🗺",
    title: "Grid Pathfinder",
    uses: "graphs · BFS · Dijkstra · A* · heaps",
    pitch: "A maze on a grid with walls and mud (slow cells). Find the best route — then find it faster.",
    steps: [
      "Model the grid as a graph: cells are nodes, moves are edges (mud costs 3)",
      "BFS for shortest path when every step costs 1; reconstruct and print the route",
      "Dijkstra with a priority queue once mud enters the picture",
      "Upgrade to A* with the Manhattan-distance heuristic and count visited cells vs Dijkstra",
      "Animate the frontier in the terminal — watch the ripple, just like the visualizer",
    ],
  },
];

/** The proof-you-can-build-it project. Checklist state persists per account/browser. */
export default function CapstonePage() {
  const checks = useBootcamp((s) => s.capstoneChecks);
  const setCheck = useBootcamp((s) => s.setCapstoneCheck);
  const hydrated = useBootcamp((s) => s.hasHydrated);

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="kicker" style={{ marginBottom: 4 }}>The hero part of zero-to-hero</div>
      <h1 style={{ marginBottom: 4 }}>Capstone projects</h1>
      <p className="text-muted" style={{ maxWidth: "70ch", marginBottom: "var(--space-6)", fontSize: 14 }}>
        Lessons build recognition; a project builds ability. Pick ONE, build it in Python or
        JavaScript on your own machine, and tick the milestones as they genuinely work.
        Every step maps to lessons you have already completed.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
        {PROJECTS.map((p) => {
          const done = p.steps.filter((_, i) => hydrated && checks[`${p.id}:${i}`]).length;
          return (
            <section key={p.id} className="blueprint" style={{ padding: "var(--space-4)" }}>
              <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
              <div style={{ fontSize: 26 }}>{p.emoji}</div>
              <h3 style={{ margin: "4px 0 2px" }}>{p.title}</h3>
              <div className="kicker" style={{ marginBottom: 8, fontSize: 10 }}>{p.uses}</div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-neutral-800)" }}>{p.pitch}</p>
              <div style={{ height: 6, background: "var(--color-neutral-200)", border: "1px solid var(--color-divider)", margin: "var(--space-2) 0 var(--space-3)" }}>
                <i style={{ display: "block", height: "100%", width: `${(done / p.steps.length) * 100}%`, background: "var(--color-accent)" }} />
              </div>
              {p.steps.map((step, i) => {
                const key = `${p.id}:${i}`;
                const isDone = hydrated && !!checks[key];
                return (
                  <label key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", fontSize: 13, cursor: "pointer", lineHeight: 1.5 }}>
                    <input type="checkbox" checked={isDone} onChange={(e) => setCheck(key, e.target.checked)} style={{ accentColor: "var(--color-accent)", marginTop: 3 }} />
                    <span style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "var(--color-neutral-500)" : "inherit" }}>{step}</span>
                  </label>
                );
              })}
              {done === p.steps.length && (
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent-700)", marginTop: 8 }}>
                  🏆 Built. Put it on your GitHub — this is the thing interviews ask about.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
