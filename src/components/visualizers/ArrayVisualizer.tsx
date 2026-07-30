"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

interface Slot {
  id: number;
  value: number;
}

/** Arrays-as-bookshelves: O(1) access vs O(n) middle insertion, with a step counter. */
export default function ArrayVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [slots, setSlots] = useState<Slot[]>(
    [42, 7, 93, 18, 65, 31].map((v, i) => ({ id: i, value: v }))
  );
  const [highlight, setHighlight] = useState<number | null>(null);
  const [shifting, setShifting] = useState<Set<number>>(new Set());
  const [steps, setSteps] = useState(0);
  const [accessIdx, setAccessIdx] = useState(3);
  const nextId = useRef(100);
  const [log, setLog] = useState("A bookshelf with numbered slots. Try grabbing a book vs squeezing one into the middle.");
  const [techLog, setTechLog] = useState(`arr = [42, 7, 93, 18, 65, 31]  // contiguous block`);

  const access = () => {
    const i = Math.min(accessIdx, slots.length - 1);
    setHighlight(i);
    setShifting(new Set());
    setSteps(1);
    setTimeout(() => setHighlight(null), 1500);
    setLog(`Slot ${i} — grabbed instantly! No searching, no walking the shelf. 1 step, no matter how long the shelf is.`);
    setTechLog(`arr[${i}] → ${slots[i].value}  // address = base + ${i} × size — O(1), 1 step`);
  };

  const insertMiddle = () => {
    if (slots.length >= 9) {
      setLog("Shelf's getting long — reset to keep experimenting.");
      return;
    }
    const idx = 2;
    const value = 10 + Math.floor(Math.random() * 89);
    const moved = slots.length - idx;
    setShifting(new Set(slots.slice(idx).map((s) => s.id)));
    setHighlight(null);
    setTimeout(() => {
      setSlots((ss) => [...ss.slice(0, idx), { id: nextId.current++, value }, ...ss.slice(idx)]);
      setSteps(moved + 1);
      setTimeout(() => setShifting(new Set()), 900);
    }, 500);
    setLog(`To fit ${value} into slot ${idx}, every book after it had to shove right — ${moved} moves + 1 placement. Imagine a million books…`);
    setTechLog(`arr.splice(${idx}, 0, ${value})  // shifts ${moved} elements — O(n), ${moved + 1} steps`);
  };

  const append = () => {
    if (slots.length >= 9) {
      setLog("Shelf's getting long — reset to keep experimenting.");
      return;
    }
    const value = 10 + Math.floor(Math.random() * 89);
    setSlots((ss) => [...ss, { id: nextId.current++, value }]);
    setSteps(1);
    setShifting(new Set());
    setLog(`Added ${value} at the END — nothing had to move. 1 step.`);
    setTechLog(`arr.push(${value})  // amortized O(1), 1 step`);
  };

  const reset = () => {
    setSlots([42, 7, 93, 18, 65, 31].map((v, i) => ({ id: nextId.current + i, value: v })));
    nextId.current += 10;
    setSteps(0);
    setShifting(new Set());
    setHighlight(null);
    setLog("Fresh shelf, six books.");
    setTechLog("arr = [42, 7, 93, 18, 65, 31]");
  };

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon-purple">📚 Array — live</h3>
        <span className="rounded-full border border-ink-600 px-3 py-1 font-mono text-xs">
          steps: <span className="font-bold text-neon-amber">{steps}</span>
        </span>
      </div>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 flex flex-wrap items-end justify-center gap-1.5 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        <AnimatePresence mode="popLayout">
          {slots.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: -30, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: highlight === i ? 1.12 : 1,
                x: shifting.has(s.id) ? 6 : 0,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`flex h-12 w-11 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                  highlight === i
                    ? "border-neon-green bg-neon-green/20 text-neon-green shadow-glow"
                    : shifting.has(s.id)
                      ? "border-neon-amber bg-neon-amber/10 text-neon-amber"
                      : "border-ink-600 bg-ink-700 text-slate-200"
                }`}
              >
                {s.value}
              </div>
              <span className="font-mono text-[9px] text-slate-500">[{i}]</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-slate-400">
          slot
          <select
            className="btn-ghost bg-ink-800 px-2 py-1"
            value={Math.min(accessIdx, slots.length - 1)}
            onChange={(e) => setAccessIdx(Number(e.target.value))}
          >
            {slots.map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <button className="btn-primary" onClick={access}>⚡ Grab arr[i] — O(1)</button>
        <button className="btn-ghost" onClick={insertMiddle}>🫸 Insert at 2 — O(n)</button>
        <button className="btn-ghost" onClick={append}>➕ Append — O(1)</button>
        <button className="btn-ghost" onClick={reset}>↺</button>
      </div>
    </div>
  );
}
