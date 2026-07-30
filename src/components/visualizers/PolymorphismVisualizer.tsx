"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

const ANIMALS = [
  { id: "dog", emoji: "🐕", name: "Dog", sound: "Woof!" },
  { id: "cat", emoji: "🐈", name: "Cat", sound: "Meow!" },
  { id: "duck", emoji: "🦆", name: "Duck", sound: "Quack!" },
  { id: "robot", emoji: "🤖", name: "RoboDog", sound: "BEEP-WOOF!" },
];

/** Polymorphism: one speak() call, each subtype answers its own way. */
export default function PolymorphismVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [speaking, setSpeaking] = useState<Set<string>>(new Set());
  const [log, setLog] = useState("Four different animals, ONE button. Press it and give the same command to all of them.");
  const [techLog, setTechLog] = useState("const zoo: Animal[] = [new Dog(), new Cat(), new Duck(), new RoboDog()];");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const speakAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSpeaking(new Set());
    setLog("You shouted \"speak()\" once — but every animal answered in its OWN voice. Same command, many shapes.");
    setTechLog("zoo.forEach(a => a.speak());  // dynamic dispatch picks each subtype's override");
    ANIMALS.forEach((a, i) => {
      timers.current.push(
        setTimeout(() => {
          setSpeaking((prev) => new Set(prev).add(a.id));
        }, 350 * i)
      );
    });
    timers.current.push(
      setTimeout(() => setSpeaking(new Set()), 350 * ANIMALS.length + 2200)
    );
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon">🛠️ Polymorphism — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 flex flex-wrap items-end justify-center gap-6 rounded-xl border border-ink-700 bg-ink-900/60 p-6 pt-12">
        {ANIMALS.map((a) => (
          <div key={a.id} className="relative flex flex-col items-center">
            <AnimatePresence>
              {speaking.has(a.id) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute -top-9 whitespace-nowrap rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-1 text-xs font-extrabold text-ink-950"
                >
                  {a.sound}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              animate={speaking.has(a.id) ? { y: [-0, -8, 0], scale: [1, 1.15, 1] } : {}}
              className="text-4xl"
            >
              {a.emoji}
            </motion.div>
            <span className="mt-1 font-mono text-[10px] text-slate-400">{a.name}.speak()</span>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full" onClick={speakAll}>
        📣 zoo.forEach(a =&gt; a.speak()) — one command for everyone
      </button>
    </div>
  );
}
