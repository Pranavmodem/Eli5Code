"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

const HIDDEN_STEPS = [
  "check key fob signal 🔑",
  "engage fuel pump ⛽",
  "spark plugs fire ⚡",
  "pistons start cycling 🔩",
  "oil pressure builds 🛢️",
  "alternator charges 🔋",
  "ECU balances the idle 🧠",
];

/** Abstraction: one simple button hiding a pile of machinery. */
export default function AbstractionVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [hoodOpen, setHoodOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [log, setLog] = useState("You get ONE button: start the car. Everything else is the engine's problem.");
  const [techLog, setTechLog] = useState("interface Car { start(): void }  // callers see only this contract");

  const start = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setActiveStep(-1);
    setLog("You pressed START. Watch what the machine quietly does for you…");
    setTechLog("car.start();  // one call — implementation detail is invisible to the caller");
    HIDDEN_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActiveStep(i), 280 * i));
    });
    timers.current.push(
      setTimeout(() => {
        setRunning(true);
        setLog(
          hoodOpen
            ? "Engine running! You watched 7 hidden steps happen — but remember, the driver only pressed one button."
            : "Vroom — engine running! 7 complicated things just happened and you didn't see ANY of them. Open the hood to peek."
        );
        setTechLog("// start() completed: 7 private operations executed behind the interface");
      }, 280 * HIDDEN_STEPS.length + 200)
    );
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon">🚗 Abstraction — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 grid gap-4 rounded-xl border border-ink-700 bg-ink-900/60 p-4 sm:grid-cols-2">
        {/* the interface */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink-600 bg-ink-800 p-6">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">what the driver sees</div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={start}
            className={`flex h-24 w-24 items-center justify-center rounded-full border-4 text-sm font-extrabold transition-colors ${
              running
                ? "border-neon-green bg-neon-green/20 text-neon-green shadow-glow"
                : "border-ink-600 bg-ink-700 text-slate-200 hover:border-neon"
            }`}
          >
            {running ? "RUNNING" : "START"}
          </motion.button>
          <motion.div
            animate={running ? { rotate: [0, -2, 2, 0] } : {}}
            transition={{ repeat: running ? Infinity : 0, duration: 0.3 }}
            className="mt-4 text-4xl"
          >
            🚗
          </motion.div>
        </div>

        {/* under the hood */}
        <div className="rounded-xl border border-ink-600 bg-ink-800 p-4">
          <button
            onClick={() => setHoodOpen((o) => !o)}
            className="mb-2 w-full text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-neon"
          >
            {hoodOpen ? "🔧 under the hood (click to close)" : "🔒 under the hood — hidden (click to peek)"}
          </button>
          <AnimatePresence>
            {hoodOpen ? (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden font-mono text-[11px]"
              >
                {HIDDEN_STEPS.map((s, i) => (
                  <motion.li
                    key={s}
                    animate={{
                      backgroundColor: activeStep === i ? "rgba(34,211,238,0.18)" : "rgba(26,32,54,0.8)",
                      color: activeStep >= i ? "#e2e8f0" : "#475569",
                    }}
                    className="rounded px-2 py-1"
                  >
                    {activeStep >= i ? "✓ " : "· "}{s}
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-40 items-center justify-center text-3xl"
              >
                🙈
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="text-[10px] text-slate-500">
        Good abstraction = you could drive for years without ever opening the hood.
      </p>
    </div>
  );
}
