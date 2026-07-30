"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePlayback } from "./usePlayback";
import PlaybackControls from "./PlaybackControls";
import { useBootcamp } from "@/lib/store";

/** Small fixed graph; BFS spreads like ripples, DFS dives like a maze-runner. */
const NODES = [
  { id: "A", x: 90, y: 120 },
  { id: "B", x: 220, y: 50 },
  { id: "C", x: 220, y: 190 },
  { id: "D", x: 350, y: 50 },
  { id: "E", x: 350, y: 190 },
  { id: "F", x: 480, y: 120 },
  { id: "G", x: 480, y: 230 },
  { id: "H", x: 580, y: 60 },
];
const EDGES: [string, string][] = [
  ["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"], ["D", "F"],
  ["E", "F"], ["E", "G"], ["D", "H"], ["F", "H"],
];

const neighborsOf = (id: string) =>
  EDGES.filter(([a, b]) => a === id || b === id)
    .map(([a, b]) => (a === id ? b : a))
    .sort();

interface Frame {
  current: string | null;
  visited: string[];
  frontier: string[];
  usedEdges: [string, string][];
  note: string;
  techNote: string;
}

function buildFrames(algo: "bfs" | "dfs"): Frame[] {
  const frames: Frame[] = [];
  const visited: string[] = [];
  const usedEdges: [string, string][] = [];
  const frontier: { id: string; from: string | null }[] = [{ id: "A", from: null }];
  const seen = new Set(["A"]);
  const structure = algo === "bfs" ? "queue" : "stack";

  frames.push({
    current: null,
    visited: [],
    frontier: ["A"],
    usedEdges: [],
    note:
      algo === "bfs"
        ? "Drop the stone at A. The ripple will spread ring by ring — nearest friends first."
        : "Enter the maze at A. We'll dive DEEP down one path and backtrack at dead ends.",
    techNote: `${structure} = [A], visited = {}`,
  });

  while (frontier.length) {
    const item = algo === "bfs" ? frontier.shift()! : frontier.pop()!;
    visited.push(item.id);
    if (item.from) usedEdges.push([item.from, item.id]);
    const nbrs = neighborsOf(item.id).filter((n) => !seen.has(n));
    nbrs.forEach((n) => {
      seen.add(n);
      frontier.push({ id: n, from: item.id });
    });
    frames.push({
      current: item.id,
      visited: [...visited],
      frontier: frontier.map((f) => f.id),
      usedEdges: [...usedEdges],
      note:
        algo === "bfs"
          ? `The ripple reaches ${item.id}${nbrs.length ? `, and its unvisited neighbors (${nbrs.join(", ")}) join the back of the line` : " — no new neighbors here"}.`
          : `Dive into ${item.id}${nbrs.length ? ` and note the forks (${nbrs.join(", ")}) on our breadcrumb stack` : " — dead end! Backtrack to the last fork"}.`,
      techNote: `visit ${item.id}; ${algo === "bfs" ? "enqueue" : "push"} [${nbrs.join(", ") || "—"}] → ${structure} = [${frames.length && frontier.map((f) => f.id).join(", ")}]`,
    });
  }

  frames.push({
    current: null,
    visited: [...visited],
    frontier: [],
    usedEdges: [...usedEdges],
    note: `Every node explored, in order: ${visited.join(" → ")}. ${
      algo === "bfs" ? "Notice: closest rings first — that's why BFS finds shortest paths!" : "Notice the deep dives and the backtracking jumps!"
    }`,
    techNote: `order: ${visited.join(", ")} — O(V + E) time, O(V) space`,
  });
  return frames;
}

export default function GraphTraversalVisualizer({ algo }: { algo: "bfs" | "dfs" }) {
  const mode = useBootcamp((s) => s.mode);
  const frames = useMemo(() => buildFrames(algo), [algo]);
  const pb = usePlayback(frames.length);
  const frame = frames[pb.index];

  const color = (id: string) =>
    frame.current === id
      ? { fill: "rgba(251,191,36,0.25)", stroke: "#fbbf24", text: "#fbbf24" }
      : frame.visited.includes(id)
        ? { fill: "rgba(52,211,153,0.2)", stroke: "#34d399", text: "#34d399" }
        : frame.frontier.includes(id)
          ? { fill: "rgba(34,211,238,0.15)", stroke: "#22d3ee", text: "#22d3ee" }
          : { fill: "#1a2036", stroke: "#242c4a", text: "#94a3b8" };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-green">
        {algo === "bfs" ? "🌊 BFS — ripples" : "🧗 DFS — maze diver"} — live
      </h3>
      <p className="mb-4 min-h-[3rem] text-sm text-slate-300">{mode === "eli5" ? frame.note : frame.techNote}</p>

      <svg viewBox="0 0 660 280" className="mb-2 w-full rounded-xl border border-ink-700 bg-ink-900/60">
        {EDGES.map(([a, b]) => {
          const na = NODES.find((n) => n.id === a)!;
          const nb = NODES.find((n) => n.id === b)!;
          const used = frame.usedEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
          return (
            <motion.line
              key={`${a}${b}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              animate={{ stroke: used ? "#34d399" : "#242c4a", strokeWidth: used ? 2.5 : 1.5 }}
            />
          );
        })}
        {NODES.map((n) => {
          const c = color(n.id);
          return (
            <motion.g key={n.id} animate={{ scale: frame.current === n.id ? 1.18 : 1 }} style={{ originX: `${n.x}px`, originY: `${n.y}px` }}>
              <circle cx={n.x} cy={n.y} r="20" fill={c.fill} stroke={c.stroke} strokeWidth="2.5" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="monospace" fill={c.text}>
                {n.id}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mb-4 rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2 font-mono text-xs text-slate-400">
        {algo === "bfs" ? "queue (front → back): " : "stack (bottom → top): "}
        <span className="text-neon">[{frame.frontier.join(", ") || "empty"}]</span>
        <span className="ml-3">visited: <span className="text-neon-green">{frame.visited.join(" ") || "—"}</span></span>
      </div>

      <PlaybackControls
        playing={pb.playing}
        onPlay={pb.play}
        onPause={pb.pause}
        onStepBack={pb.stepBack}
        onStepForward={pb.stepForward}
        onReset={pb.reset}
        speed={pb.speed}
        onSpeed={pb.setSpeed}
        frame={pb.index}
        totalFrames={frames.length}
      />
    </div>
  );
}
