"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/** Encapsulation: a bank account whose balance is only reachable via methods. */
export default function CapsuleVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [balance, setBalance] = useState(100);
  const [xray, setXray] = useState(false);
  const [shake, setShake] = useState(0);
  const [log, setLog] = useState("This account's balance lives INSIDE the capsule. Try the buttons — including the sneaky one.");
  const [techLog, setTechLog] = useState("class Account { #balance = 100; deposit(n) {...} withdraw(n) {...} }");
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);

  const pulse = (kind: "good" | "bad") => {
    setFlash(kind);
    setTimeout(() => setFlash(null), 900);
  };

  const deposit = () => {
    setBalance((b) => b + 50);
    pulse("good");
    setLog("You pressed the DEPOSIT button. The capsule updated its own insides safely. +$50!");
    setTechLog("account.deposit(50);  // public method mutates #balance with validation");
  };

  const withdraw = () => {
    if (balance < 50) {
      pulse("bad");
      setLog("The capsule said NO — you can't take out money that isn't there. The rule lives inside, so it can never be skipped.");
      setTechLog("account.withdraw(50);  // guard: insufficient funds → rejected, invariant held");
      return;
    }
    setBalance((b) => b - 50);
    pulse("good");
    setLog("WITHDRAW worked — the capsule checked the rule first, then paid out $50.");
    setTechLog("account.withdraw(50);  // checks #balance >= 50 before mutating");
  };

  const hack = () => {
    setShake((s) => s + 1);
    pulse("bad");
    setLog("BLOCKED! You tried to reach inside and scribble on the balance. The capsule is sealed — that's the whole point.");
    setTechLog('account.#balance = -999;  // ❌ SyntaxError: private field "#balance" is not accessible');
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon">💊 Encapsulation — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 flex justify-center rounded-xl border border-ink-700 bg-ink-900/60 p-6">
        <motion.div
          key={shake}
          animate={{ x: shake ? [0, -10, 10, -8, 8, -4, 4, 0] : 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-64 rounded-3xl border-2 p-5 transition-colors ${
            flash === "good"
              ? "border-neon-green shadow-glow"
              : flash === "bad"
                ? "border-neon-rose"
                : "border-ink-600"
          } bg-ink-800`}
        >
          <div className="mb-1 text-center font-mono text-xs font-bold text-slate-400">🏦 Account object</div>
          <div className="mb-3 rounded-xl border border-ink-600 bg-ink-950 p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              🔒 private balance
            </div>
            <motion.div
              key={balance}
              initial={{ scale: 1.3, color: "#34d399" }}
              animate={{ scale: 1, color: "#e2e8f0" }}
              className="font-mono text-2xl font-extrabold"
            >
              {xray ? `$${balance}` : "████"}
            </motion.div>
          </div>
          <div className="space-y-1 text-center font-mono text-[10px] text-slate-500">
            <div className="rounded-lg bg-ink-700 py-1 text-slate-300">public deposit()</div>
            <div className="rounded-lg bg-ink-700 py-1 text-slate-300">public withdraw()</div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={deposit}>💰 deposit($50)</button>
        <button className="btn-ghost" onClick={withdraw}>💸 withdraw($50)</button>
        <button className="btn-ghost border-neon-rose/50 text-neon-rose hover:border-neon-rose" onClick={hack}>
          😈 balance = -999
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <input type="checkbox" checked={xray} onChange={(e) => setXray(e.target.checked)} className="accent-cyan-400" />
          debugger x-ray
        </label>
      </div>
    </div>
  );
}
