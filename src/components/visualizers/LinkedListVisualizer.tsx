"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

interface Node {
  id: number;
  value: number;
}

const START: Node[] = [
  { id: 1, value: 12 },
  { id: 2, value: 47 },
  { id: 3, value: 83 },
];

export default function LinkedListVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [nodes, setNodes] = useState<Node[]>(START);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [rewiredAfterId, setRewiredAfterId] = useState<number | "head" | null>(null);
  const [log, setLog] = useState(
    "This treasure hunt has 3 clues. Add or remove clues and watch the arrows rewire."
  );
  const [techLog, setTechLog] = useState("head → 12 → 47 → 83 → null");
  const nextId = useRef(100);

  const chain = (list: Node[]) =>
    "head → " + list.map((n) => n.value).join(" → ") + (list.length ? " → null" : " null");

  const flash = (id: number, rewired: number | "head" | null) => {
    setHighlightId(id);
    setRewiredAfterId(rewired);
    setTimeout(() => {
      setHighlightId(null);
      setRewiredAfterId(null);
    }, 1600);
  };

  const randomValue = () => 10 + Math.floor(Math.random() * 90);

  const insertHead = () => {
    const node = { id: nextId.current++, value: randomValue() };
    const next = [node, ...nodes];
    setNodes(next);
    flash(node.id, "head");
    setLog(
      `New clue ${node.value} placed FIRST. It points at the old first clue — one arrow change, instant!`
    );
    setTechLog(`newNode.next = head; head = newNode;  // O(1) — ${chain(next)}`);
  };

  const insertTail = () => {
    const node = { id: nextId.current++, value: randomValue() };
    const next = [...nodes, node];
    setNodes(next);
    flash(node.id, nodes.length ? nodes[nodes.length - 1].id : "head");
    setLog(
      `New clue ${node.value} added at the END. We had to walk the whole hunt to find the last clue first!`
    );
    setTechLog(`walk to tail (O(n)), tail.next = newNode;  // ${chain(next)}`);
  };

  const deleteHead = () => {
    if (!nodes.length) return;
    const [removed, ...rest] = nodes;
    setNodes(rest);
    flash(rest[0]?.id ?? -1, "head");
    setLog(`First clue ${removed.value} thrown away. The hunt now starts at the next clue.`);
    setTechLog(`head = head.next;  // O(1) — ${chain(rest)}`);
  };

  const reset = () => {
    setNodes(START);
    setLog("Back to the original 3-clue hunt.");
    setTechLog(chain(START));
  };

  const Arrow = ({ hot }: { hot: boolean }) => (
    <motion.svg
      layout
      width="34"
      height="20"
      viewBox="0 0 34 20"
      className="shrink-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.line
        x1="2"
        y1="10"
        x2="24"
        y2="10"
        strokeWidth="2"
        animate={{ stroke: hot ? "#34d399" : "#475569" }}
      />
      <motion.path
        d="M22 4 L32 10 L22 16 Z"
        animate={{ fill: hot ? "#34d399" : "#475569" }}
      />
    </motion.svg>
  );

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-purple">
        🗺️ Linked List — live
      </h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">
        {mode === "eli5" ? log : techLog}
      </p>

      <div className="mb-5 flex min-h-[7rem] flex-wrap items-center gap-1 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        <span className="mr-1 rounded-lg border border-neon-purple/50 bg-neon-purple/10 px-2 py-1 font-mono text-xs font-bold text-neon-purple">
          HEAD
        </span>
        <Arrow hot={rewiredAfterId === "head"} />
        <AnimatePresence mode="popLayout">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, y: -40, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center gap-1"
            >
              <div
                className={`flex overflow-hidden rounded-lg border font-mono text-sm transition-colors ${
                  highlightId === node.id
                    ? "border-neon-green shadow-glow"
                    : "border-ink-600"
                }`}
              >
                <span className="bg-ink-700 px-3 py-2 font-bold text-slate-100">
                  {node.value}
                </span>
                <span
                  className="bg-ink-800 px-2 py-2 text-[10px] text-slate-500"
                  title="next pointer"
                >
                  next
                </span>
              </div>
              {i < nodes.length - 1 ? (
                <Arrow hot={rewiredAfterId === node.id} />
              ) : (
                <>
                  <Arrow hot={rewiredAfterId === node.id} />
                  <span className="rounded-lg border border-ink-600 px-2 py-1 font-mono text-xs text-slate-500">
                    null
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {nodes.length === 0 && (
          <span className="rounded-lg border border-ink-600 px-2 py-1 font-mono text-xs text-slate-500">
            null
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={insertHead}>
          ⚡ Insert at head — O(1)
        </button>
        <button className="btn-ghost" onClick={insertTail}>
          🚶 Insert at tail — O(n)
        </button>
        <button className="btn-ghost" onClick={deleteHead} disabled={!nodes.length}>
          🗑 Delete head
        </button>
        <button className="btn-ghost" onClick={reset}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
