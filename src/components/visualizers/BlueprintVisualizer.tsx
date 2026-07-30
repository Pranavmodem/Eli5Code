"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

interface House {
  id: number;
  color: string;
  colorName: string;
  street: string;
  ringing: boolean;
}

const COLORS = [
  ["#0891b2", "blue"],
  ["#059669", "green"],
  ["#e11d48", "red"],
  ["#7c3aed", "purple"],
  ["#d97706", "orange"],
] as const;
const STREETS = ["Oak St", "Elm St", "Main St", "Pine Ave", "Maple Dr", "Cedar Ln"];

/** Classes-as-blueprints / objects-as-houses. `focus` tweaks the copy only. */
export default function BlueprintVisualizer({ focus = "class" }: { focus?: "class" | "objects" }) {
  const mode = useBootcamp((s) => s.mode);
  const [houses, setHouses] = useState<House[]>([]);
  const nextId = useRef(1);
  const [log, setLog] = useState(
    focus === "class"
      ? "One blueprint, zero houses. Press the button and watch construction happen."
      : "Build a few houses — then ring their doorbells. Same blueprint, different houses."
  );
  const [techLog, setTechLog] = useState("class House { constructor(color, street) {...} ringDoorbell() {...} }");

  const build = () => {
    if (houses.length >= 4) {
      setLog("The street is full! Demolish one to keep building.");
      setTechLog("// heap allocation: 4 instances live");
      return;
    }
    const [color, colorName] = COLORS[Math.floor(Math.random() * COLORS.length)];
    const street = STREETS[Math.floor(Math.random() * STREETS.length)];
    const h: House = { id: nextId.current++, color, colorName, street, ringing: false };
    setHouses((hs) => [...hs, h]);
    setLog(`A ${colorName} house appears on ${street} — built from the SAME blueprint, but it's its own real house.`);
    setTechLog(`const house${h.id} = new House("${colorName}", "${street}");  // new instance on the heap`);
  };

  const ring = (id: number) => {
    setHouses((hs) => hs.map((h) => (h.id === id ? { ...h, ringing: true } : h)));
    setTimeout(() => setHouses((hs) => hs.map((h) => (h.id === id ? { ...h, ringing: false } : h))), 1200);
    const h = houses.find((x) => x.id === id);
    setLog(`Ding dong at the ${h?.colorName} house! Only THIS house rang — the others didn't hear a thing.`);
    setTechLog(`house${id}.ringDoorbell();  // method runs on one instance's state`);
  };

  const demolish = () => {
    setHouses((hs) => hs.slice(0, -1));
    setLog("Demolished the newest house. The blueprint is untouched — build again anytime.");
    setTechLog("// instance garbage-collected; the class definition remains");
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon">
        📐 Blueprint → Houses — live
      </h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 grid gap-4 rounded-xl border border-ink-700 bg-ink-900/60 p-4 sm:grid-cols-[180px,1fr]">
        {/* the class */}
        <div className="rounded-xl border-2 border-dashed border-neon/60 bg-ink-800/80 p-3 font-mono text-xs">
          <div className="mb-2 font-bold text-neon">CLASS: House 📘</div>
          <div className="text-slate-400">color</div>
          <div className="text-slate-400">street</div>
          <div className="mt-2 border-t border-ink-600 pt-2 text-slate-300">ringDoorbell()</div>
          <div className="mt-2 text-[10px] italic text-slate-500">just a plan — nobody lives here</div>
        </div>
        {/* the objects */}
        <div className="flex min-h-[8rem] flex-wrap items-end gap-3">
          <AnimatePresence mode="popLayout">
            {houses.map((h) => (
              <motion.button
                key={h.id}
                layout
                onClick={() => ring(h.id)}
                initial={{ opacity: 0, y: -30, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: h.ringing ? [0, -3, 3, -3, 0] : 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative flex flex-col items-center"
                title="Click to ring the doorbell"
              >
                {h.ringing && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-6 rounded-full bg-neon-amber px-2 py-0.5 text-[10px] font-bold text-ink-950"
                  >
                    Ding dong!
                  </motion.span>
                )}
                <span className="text-3xl" style={{ filter: `drop-shadow(0 0 6px ${h.color})` }}>
                  🏠
                </span>
                <span className="mt-1 rounded px-1.5 font-mono text-[10px] font-bold" style={{ color: h.color }}>
                  {h.colorName}
                </span>
                <span className="font-mono text-[9px] text-slate-500">{h.street}</span>
              </motion.button>
            ))}
          </AnimatePresence>
          {houses.length === 0 && (
            <span className="text-xs italic text-slate-600">empty lot — no objects yet</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={build}>🏗️ new House(...)</button>
        <button className="btn-ghost" onClick={demolish} disabled={!houses.length}>💥 Demolish last</button>
      </div>
    </div>
  );
}
