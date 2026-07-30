"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

const BUCKETS = 8;
const WORDS = ["zebra", "apple", "cat", "moon", "pizza", "code", "star", "book", "fish", "jazz", "kiwi", "lava"];

interface Entry {
  id: number;
  word: string;
  hash: number;
}

const hashOf = (w: string) => w.split("").reduce((s, c) => s + c.charCodeAt(0), 0);

/** Hash-maps-as-dictionaries: the key itself computes which bucket it lives in. */
export default function HashMapVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [lookupId, setLookupId] = useState<number | null>(null);
  const nextId = useRef(1);
  const wordIdx = useRef(0);
  const [log, setLog] = useState("Drop words in — the word ITSELF tells us which drawer it belongs to. No searching, ever.");
  const [techLog, setTechLog] = useState(`index = hash(key) % ${BUCKETS}`);

  const insert = () => {
    if (entries.length >= 12) {
      setLog("Plenty of collisions to see now — try a lookup, or reset.");
      return;
    }
    const word = WORDS[wordIdx.current++ % WORDS.length];
    const h = hashOf(word);
    const bucket = h % BUCKETS;
    const collision = entries.some((e) => e.hash % BUCKETS === bucket);
    setEntries((es) => [...es, { id: nextId.current++, word, hash: h }]);
    setFlash(bucket);
    setLookupId(null);
    setTimeout(() => setFlash(null), 1200);
    setLog(
      collision
        ? `"${word}" also maps to drawer ${bucket} — a COLLISION! No panic: it just hangs on the same hook, and we glance through the short chain.`
        : `"${word}" → do the math → drawer ${bucket}. Straight there, zero searching.`
    );
    setTechLog(`hash("${word}") = ${h} → ${h} % ${BUCKETS} = ${bucket}${collision ? "  // collision → chained" : ""}`);
  };

  const lookup = () => {
    if (!entries.length) return;
    const e = entries[Math.floor(Math.random() * entries.length)];
    const bucket = e.hash % BUCKETS;
    const chain = entries.filter((x) => x.hash % BUCKETS === bucket);
    setFlash(bucket);
    setLookupId(e.id);
    setTimeout(() => {
      setFlash(null);
      setLookupId(null);
    }, 1800);
    setLog(`Find "${e.word}": compute drawer ${bucket}, check ${chain.length} item${chain.length > 1 ? "s" : ""} on the hook. Compare that to reading all ${entries.length} words!`);
    setTechLog(`get("${e.word}"): bucket ${bucket}, chain length ${chain.length} — average O(1)`);
  };

  const reset = () => {
    setEntries([]);
    wordIdx.current = 0;
    setLog("Empty drawers. Start hashing!");
    setTechLog(`index = hash(key) % ${BUCKETS}`);
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-purple">📖 Hash Map — live</h3>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">{mode === "eli5" ? log : techLog}</p>

      <div className="mb-5 grid grid-cols-4 gap-2 rounded-xl border border-ink-700 bg-ink-900/60 p-4 sm:grid-cols-8">
        {Array.from({ length: BUCKETS }, (_, b) => {
          const chain = entries.filter((e) => e.hash % BUCKETS === b);
          return (
            <motion.div
              key={b}
              animate={{
                borderColor: flash === b ? "#fbbf24" : "#242c4a",
                boxShadow: flash === b ? "0 0 16px rgba(251,191,36,0.3)" : "none",
              }}
              className="flex min-h-[7rem] flex-col items-center gap-1 rounded-lg border-2 bg-ink-800 p-1.5"
            >
              <span className="font-mono text-[10px] font-bold text-slate-500">[{b}]</span>
              <AnimatePresence>
                {chain.map((e) => (
                  <motion.span
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: lookupId === e.id ? 1.1 : 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className={`w-full truncate rounded px-1 text-center font-mono text-[10px] font-bold ${
                      lookupId === e.id
                        ? "bg-neon-green/25 text-neon-green"
                        : "bg-ink-700 text-slate-300"
                    }`}
                  >
                    {e.word}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={insert}>🗝️ Insert next word</button>
        <button className="btn-ghost" onClick={lookup} disabled={!entries.length}>🔍 Look one up</button>
        <button className="btn-ghost" onClick={reset}>↺ Reset</button>
        <span className="ml-auto self-center font-mono text-[10px] text-slate-500">
          hash = sum of letter codes % {BUCKETS}
        </span>
      </div>
    </div>
  );
}
