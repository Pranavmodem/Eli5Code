"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

interface Child {
  id: string;
  emoji: string;
  name: string;
  ownTrait: string;
  overrides?: string;
}

const CHILDREN: Child[] = [
  { id: "dog", emoji: "🐕", name: "Dog", ownTrait: "bark()" },
  { id: "cat", emoji: "🐈", name: "Cat", ownTrait: "meow()", overrides: "sleep() — 16 hrs/day" },
  { id: "bird", emoji: "🦜", name: "Bird", ownTrait: "fly()" },
];

const PARENT_TRAITS = ["eat()", "sleep()", "breathe()"];

/** Inheritance-as-genetics: children receive the parent's traits automatically. */
export default function InheritanceVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [added, setAdded] = useState<Child[]>([]);
  const [log, setLog] = useState("Animal is the parent. Add a child and watch the family traits flow down the line — for free.");
  const [techLog, setTechLog] = useState("class Animal { eat() {} sleep() {} breathe() {} }");

  const add = (c: Child) => {
    if (added.some((a) => a.id === c.id)) return;
    setAdded((xs) => [...xs, c]);
    setLog(
      `${c.name} was born! It inherited eat, sleep, and breathe without writing them — and added its own trick: ${c.ownTrait}.` +
        (c.overrides ? ` It also does sleep() its OWN way (overriding).` : "")
    );
    setTechLog(
      `class ${c.name} extends Animal { ${c.ownTrait.replace("()", "")}() {...} ${
        c.overrides ? "sleep() {/* override */}" : ""
      } }`
    );
  };

  const reset = () => {
    setAdded([]);
    setLog("Family tree cleared. Only the parent Animal class remains.");
    setTechLog("class Animal { eat() {} sleep() {} breathe() {} }");
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon">🧬 Inheritance — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        {/* parent */}
        <div className="mx-auto w-52 rounded-xl border-2 border-neon/60 bg-ink-800 p-3 text-center">
          <div className="text-2xl">🧬</div>
          <div className="font-mono text-sm font-bold text-neon">class Animal</div>
          <div className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-400">
            {PARENT_TRAITS.map((t) => (
              <div key={t} className="rounded bg-ink-700 py-0.5">{t}</div>
            ))}
          </div>
        </div>

        {/* connector */}
        {added.length > 0 && <div className="mx-auto h-5 w-0.5 bg-ink-600" />}

        {/* children */}
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {added.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="w-44 rounded-xl border border-neon-purple/60 bg-ink-800 p-3 text-center"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="font-mono text-xs font-bold text-neon-purple">
                  class {c.name} extends Animal
                </div>
                <div className="mt-1 space-y-0.5 font-mono text-[10px]">
                  {PARENT_TRAITS.map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.15 }}
                      className={`rounded py-0.5 ${
                        c.overrides && t === "sleep()"
                          ? "bg-neon-amber/20 text-neon-amber line-through"
                          : "bg-ink-700 text-slate-500"
                      }`}
                      title={c.overrides && t === "sleep()" ? "overridden" : "inherited"}
                    >
                      {t} <span className="text-[8px]">↑</span>
                    </motion.div>
                  ))}
                  {c.overrides && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="rounded bg-neon-amber/30 py-0.5 font-bold text-neon-amber"
                    >
                      {c.overrides}
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="rounded bg-neon-green/20 py-0.5 font-bold text-neon-green"
                  >
                    {c.ownTrait} ✨
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CHILDREN.map((c) => (
          <button
            key={c.id}
            className="btn-primary"
            onClick={() => add(c)}
            disabled={added.some((a) => a.id === c.id)}
          >
            {c.emoji} extends → {c.name}
          </button>
        ))}
        <button className="btn-ghost" onClick={reset} disabled={!added.length}>↺ Reset</button>
      </div>
      <p className="mt-3 text-[10px] text-slate-500">
        ↑ = inherited free · <span className="text-neon-amber">amber = overridden</span> ·{" "}
        <span className="text-neon-green">green = the child's own addition</span>
      </p>
    </div>
  );
}
