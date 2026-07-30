"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

interface Item {
  id: number;
  label: number;
}

export default function StackQueueVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [tab, setTab] = useState<"stack" | "queue">("stack");
  const [stack, setStack] = useState<Item[]>([
    { id: 1, label: 1 },
    { id: 2, label: 2 },
    { id: 3, label: 3 },
  ]);
  const [queue, setQueue] = useState<Item[]>([
    { id: 1, label: 1 },
    { id: 2, label: 2 },
    { id: 3, label: 3 },
  ]);
  const [log, setLog] = useState("Pick a structure and start pushing!");
  const nextId = useRef(10);
  const counter = useRef(4);

  const push = () => {
    const item = { id: nextId.current++, label: counter.current++ };
    setStack((s) => [...s, item]);
    setLog(
      mode === "eli5"
        ? `Plate #${item.label} lands on TOP of the stack. It'll be the first one grabbed.`
        : `push(${item.label}) — O(1); top = ${item.label}`
    );
  };
  const pop = () => {
    if (!stack.length) return;
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setLog(
      mode === "eli5"
        ? `Grabbed plate #${top.label} from the top — last in, first out!`
        : `pop() → ${top.label} — O(1)`
    );
  };
  const enqueue = () => {
    const item = { id: nextId.current++, label: counter.current++ };
    setQueue((q) => [...q, item]);
    setLog(
      mode === "eli5"
        ? `Student #${item.label} joins the BACK of the lunch line. No cutting!`
        : `enqueue(${item.label}) — O(1) at tail`
    );
  };
  const dequeue = () => {
    if (!queue.length) return;
    const front = queue[0];
    setQueue((q) => q.slice(1));
    setLog(
      mode === "eli5"
        ? `Student #${front.label} gets served — they were here FIRST.`
        : `dequeue() → ${front.label} — O(1) at head`
    );
  };

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon-purple">
          🍽️ Stack & Queue — live
        </h3>
        <div className="flex rounded-full border border-ink-600 bg-ink-900 p-1 text-xs font-bold">
          {(["stack", "queue"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 transition-colors ${
                tab === t ? "bg-neon-purple text-ink-950" : "text-slate-400"
              }`}
            >
              {t === "stack" ? "🥞 Stack" : "🚶 Queue"}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{log}</p>

      {tab === "stack" ? (
        <>
          <div className="mb-4 flex h-64 flex-col-reverse items-center gap-1.5 overflow-hidden rounded-xl border border-ink-700 bg-ink-900/60 p-4">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">
              bottom of stack
            </span>
            <AnimatePresence mode="popLayout">
              {stack.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -60, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className={`flex w-40 items-center justify-center rounded-lg border py-2 font-mono text-sm font-bold ${
                    i === stack.length - 1
                      ? "border-neon-purple bg-neon-purple/15 text-neon-purple shadow-glow-purple"
                      : "border-ink-600 bg-ink-700 text-slate-200"
                  }`}
                >
                  🍽 Plate #{item.label}
                  {i === stack.length - 1 && <span className="ml-2 text-[10px]">← TOP</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={push}>
              ⬇ Push (add plate)
            </button>
            <button className="btn-ghost" onClick={pop} disabled={!stack.length}>
              ⬆ Pop (take plate)
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-64 flex-col justify-center rounded-xl border border-ink-700 bg-ink-900/60 p-4">
            <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-slate-500">
              <span>front (served next)</span>
              <span>back (new arrivals)</span>
            </div>
            <div className="flex min-h-[3.5rem] items-center gap-1.5 overflow-x-auto">
              <AnimatePresence mode="popLayout">
                {queue.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -60, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    className={`flex shrink-0 items-center justify-center rounded-lg border px-3 py-2 font-mono text-sm font-bold ${
                      i === 0
                        ? "border-neon-green bg-neon-green/15 text-neon-green"
                        : "border-ink-600 bg-ink-700 text-slate-200"
                    }`}
                  >
                    🧑‍🎓 #{item.label}
                  </motion.div>
                ))}
              </AnimatePresence>
              {queue.length === 0 && (
                <span className="text-xs text-slate-500">The line is empty!</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={enqueue}>
              ➕ Enqueue (join line)
            </button>
            <button className="btn-ghost" onClick={dequeue} disabled={!queue.length}>
              🍕 Dequeue (serve front)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
