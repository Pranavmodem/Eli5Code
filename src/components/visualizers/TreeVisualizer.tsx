"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/**
 * BST org-chart: nodes stored heap-style (root=1, children 2i / 2i+1) so
 * layout is pure math. Inserts/searches animate the comparison path.
 */
const MAX_DEPTH = 4; // indexes 1..15
const W = 640;
const H = 260;

function posOf(index: number) {
  const depth = Math.floor(Math.log2(index));
  const posInRow = index - 2 ** depth;
  const cols = 2 ** depth;
  return {
    x: (W / cols) * (posInRow + 0.5),
    y: 34 + depth * ((H - 60) / (MAX_DEPTH - 1)),
  };
}

export default function TreeVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [nodes, setNodes] = useState<Map<number, number>>(new Map([[1, 50]]));
  const [path, setPath] = useState<number[]>([]);
  const [foundIdx, setFoundIdx] = useState<number | null>(null);
  const busy = useRef(false);
  const [log, setLog] = useState("50 is the CEO. Insert numbers and watch each one ask its way down the chart: smaller → left, bigger → right.");
  const [techLog, setTechLog] = useState("root = new Node(50)");

  const animatePath = (visited: number[], done: () => void) => {
    busy.current = true;
    setFoundIdx(null);
    setPath([]);
    visited.forEach((idx, i) => {
      setTimeout(() => setPath(visited.slice(0, i + 1)), 380 * i);
    });
    setTimeout(() => {
      done();
      setTimeout(() => {
        setPath([]);
        busy.current = false;
      }, 1400);
    }, 380 * visited.length);
  };

  const insert = () => {
    if (busy.current) return;
    const value = 1 + Math.floor(Math.random() * 99);
    let idx = 1;
    const visited: number[] = [];
    while (nodes.has(idx) && Math.floor(Math.log2(idx)) < MAX_DEPTH - 1) {
      visited.push(idx);
      idx = value < nodes.get(idx)! ? idx * 2 : idx * 2 + 1;
    }
    if (nodes.has(idx)) {
      setLog(`No room for ${value} down that path (demo tree caps at ${MAX_DEPTH} levels). Try again or reset!`);
      setTechLog(`// depth limit reached inserting ${value}`);
      return;
    }
    const cmps = visited.map((v) => `${value}${value < nodes.get(v)! ? "<" : "≥"}${nodes.get(v)}`).join(", ");
    setLog(`${value} walks the chart: ${visited.map((v) => nodes.get(v)).join(" → ")} → new desk! Each question skipped half the org.`);
    setTechLog(`insert(${value}): ${cmps} → placed after ${visited.length} comparisons (O(log n) when balanced)`);
    animatePath(visited, () => {
      setNodes((m) => new Map(m).set(idx, value));
      setFoundIdx(idx);
    });
  };

  const search = () => {
    if (busy.current || nodes.size < 2) return;
    const values = Array.from(nodes.values());
    const target = values[Math.floor(Math.random() * values.length)];
    let idx = 1;
    const visited: number[] = [];
    let hit: number | null = null;
    while (nodes.has(idx)) {
      visited.push(idx);
      const v = nodes.get(idx)!;
      if (v === target) {
        hit = idx;
        break;
      }
      idx = target < v ? idx * 2 : idx * 2 + 1;
    }
    setLog(`Searching for ${target}: asked ${visited.length} people out of ${nodes.size}. That's the org-chart shortcut!`);
    setTechLog(`search(${target}): ${visited.length} comparisons for n=${nodes.size} — O(log n) vs O(n) linear scan`);
    animatePath(visited, () => setFoundIdx(hit));
  };

  const reset = () => {
    if (busy.current) return;
    setNodes(new Map([[1, 50]]));
    setPath([]);
    setFoundIdx(null);
    setLog("Back to just the CEO (50). Build the company again!");
    setTechLog("root = new Node(50)");
  };

  const entries = Array.from(nodes.entries());

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-purple">🌳 Binary Search Tree — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mb-4 w-full rounded-xl border border-ink-700 bg-ink-900/60">
        {/* edges */}
        {entries.map(([idx]) =>
          idx > 1 && nodes.has(Math.floor(idx / 2)) ? (
            <line
              key={`e${idx}`}
              x1={posOf(Math.floor(idx / 2)).x}
              y1={posOf(Math.floor(idx / 2)).y}
              x2={posOf(idx).x}
              y2={posOf(idx).y}
              stroke="#242c4a"
              strokeWidth="1.5"
            />
          ) : null
        )}
        {/* nodes */}
        <AnimatePresence>
          {entries.map(([idx, value]) => {
            const { x, y } = posOf(idx);
            const onPath = path.includes(idx);
            const isFound = foundIdx === idx;
            return (
              <motion.g
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: onPath || isFound ? 1.2 : 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill={isFound ? "rgba(52,211,153,0.25)" : onPath ? "rgba(251,191,36,0.2)" : "#1a2036"}
                  stroke={isFound ? "#34d399" : onPath ? "#fbbf24" : "#242c4a"}
                  strokeWidth="2"
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
                  fill={isFound ? "#34d399" : onPath ? "#fbbf24" : "#e2e8f0"}>
                  {value}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={insert}>🎲 Insert random</button>
        <button className="btn-ghost" onClick={search} disabled={nodes.size < 2}>🔍 Search random</button>
        <button className="btn-ghost" onClick={reset}>↺ Reset</button>
        <span className="ml-auto self-center font-mono text-xs text-slate-500">
          n = {nodes.size} · <span className="text-neon-amber">amber = asking</span> · <span className="text-neon-green">green = found/placed</span>
        </span>
      </div>
    </div>
  );
}
