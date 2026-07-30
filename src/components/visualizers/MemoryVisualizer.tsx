"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/** Space complexity: how much EXTRA desk-room each approach needs as n grows. */
const SCENARIOS = [
  {
    key: "inplace",
    name: "In-place sort",
    formula: "O(1)",
    fn: (_n: number) => 1,
    eli5: "Sorting the bookshelf by swapping books right on the shelf — you only ever hold ONE book. Desk stays clean no matter how many books.",
    tech: "Bubble/selection/heap sort mutate the input array; auxiliary space is a constant handful of variables regardless of n.",
  },
  {
    key: "merge",
    name: "Merge sort buffer",
    formula: "O(n)",
    fn: (n: number) => n,
    eli5: "Merging piles needs a spare table exactly as big as the deck — every card gets copied over during the riffle.",
    tech: "Standard merge sort allocates an O(n) temporary buffer for merging; the recursion stack adds O(log n) on top.",
  },
  {
    key: "memo",
    name: "Memoization cache",
    formula: "O(n)",
    fn: (n: number) => n,
    eli5: "Writing every answer you compute on a sticky note so you never solve it twice — one note per sub-problem. Space buys speed!",
    tech: "Memoized fib(n) stores n entries, collapsing O(2ⁿ) repeated work into O(n) time — the classic time-space trade.",
  },
  {
    key: "grid",
    name: "2D grid / matrix",
    formula: "O(n²)",
    fn: (n: number) => n * n,
    eli5: "A seating chart pairing EVERY kid with every other kid — 10 kids need a 10×10 grid of 100 boxes. This desk fills up FAST.",
    tech: "Adjacency matrices and DP tables allocate n×n cells; at n=10⁵ that's 10¹⁰ cells — usually the sign to find a sparser structure.",
  },
];

export default function MemoryVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [n, setN] = useState(6);
  const blocks = Math.min(scenario.fn(n), 144);
  const overflow = scenario.fn(n) > 144;

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-amber">🧠 Space Complexity — live</h3>
      <p className="mb-4 min-h-[3.5rem] text-sm text-slate-300">
        {mode === "eli5" ? scenario.eli5 : scenario.tech}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            onClick={() => setScenario(s)}
            className={`btn text-xs ${
              scenario.key === s.key ? "bg-neon-amber text-ink-950" : "btn-ghost"
            }`}
          >
            {s.name} · {s.formula}
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {/* the input */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-4">
          <div className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">
            your input (n = {n}) — doesn't count
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: n }, (_, i) => (
              <div key={i} className="h-4 w-4 rounded-sm bg-ink-600" />
            ))}
          </div>
        </div>
        {/* the extra memory */}
        <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-4">
          <div className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">
            EXTRA memory used:{" "}
            <span className="font-bold text-neon-amber">
              {scenario.fn(n).toLocaleString()} block{scenario.fn(n) === 1 ? "" : "s"} — {scenario.formula}
            </span>
          </div>
          <div className="flex max-h-40 flex-wrap gap-1 overflow-hidden">
            <AnimatePresence>
              {Array.from({ length: blocks }, (_, i) => (
                <motion.div
                  key={`${scenario.key}-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: Math.min(i * 0.01, 0.6) }}
                  className="h-4 w-4 rounded-sm bg-neon-amber/80"
                />
              ))}
            </AnimatePresence>
          </div>
          {overflow && (
            <div className="mt-2 text-[10px] font-bold text-neon-rose">
              …and {(scenario.fn(n) - 144).toLocaleString()} more blocks that don't fit on screen! 📦📦📦
            </div>
          )}
        </div>
      </div>

      <label className="flex items-center gap-3 text-xs text-slate-400">
        n =
        <input
          type="range"
          min={1}
          max={12}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="flex-1 accent-amber-500"
        />
        <span className="w-6 font-mono font-bold text-slate-200">{n}</span>
      </label>
    </div>
  );
}
