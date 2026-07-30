"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePlayback } from "./usePlayback";
import PlaybackControls from "./PlaybackControls";
import { useBootcamp } from "@/lib/store";

const VALUES = [3, 7, 11, 18, 24, 31, 42, 50, 57, 66, 72, 80, 88, 93, 99];

interface Frame {
  lo: number;
  hi: number;
  mid: number | null;
  found: boolean;
  note: string;
  techNote: string;
}

function buildFrames(target: number): Frame[] {
  const frames: Frame[] = [
    {
      lo: 0,
      hi: VALUES.length - 1,
      mid: null,
      found: false,
      note: `We're hunting for ${target}. The whole shelf is fair game — but we always ask the MIDDLE first.`,
      techNote: `lo=0, hi=${VALUES.length - 1}, target=${target}`,
    },
  ];
  let lo = 0;
  let hi = VALUES.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const v = VALUES[mid];
    if (v === target) {
      frames.push({
        lo,
        hi,
        mid,
        found: true,
        note: `The middle IS ${target}. Found it — and look how much shelf we never touched! 🎯`,
        techNote: `mid=${mid}, arr[mid]=${v} === target → return ${mid}`,
      });
      return frames;
    }
    frames.push({
      lo,
      hi,
      mid,
      found: false,
      note:
        v < target
          ? `Middle is ${v} — too small! Everything left of it is even smaller. Chop it all off. ✂️`
          : `Middle is ${v} — too big! Everything right of it is even bigger. Chop it all off. ✂️`,
      techNote: `mid=${mid}, arr[mid]=${v} ${v < target ? "<" : ">"} ${target} → ${
        v < target ? `lo=${mid + 1}` : `hi=${mid - 1}`
      }`,
    });
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  frames.push({
    lo,
    hi,
    mid: null,
    found: false,
    note: `The search zone shrank to nothing — ${target} isn't on this shelf at all.`,
    techNote: `lo(${lo}) > hi(${hi}) → return -1 (not found)`,
  });
  return frames;
}

export default function BinarySearchVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [target, setTarget] = useState(72);
  const frames = useMemo(() => buildFrames(target), [target]);
  const pb = usePlayback(frames.length);
  const frame = frames[pb.index];

  const pickTarget = (t: number) => {
    pb.reset();
    setTarget(t);
  };

  return (
    <div className="card p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon-green">
          🔍 Binary Search — live
        </h3>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          Target
          <select
            className="btn-ghost bg-ink-800 px-2 py-1"
            value={target}
            onChange={(e) => pickTarget(Number(e.target.value))}
          >
            {[...VALUES, 45].sort((a, b) => a - b).map((v) => (
              <option key={v} value={v}>
                {v}
                {VALUES.includes(v) ? "" : " (missing)"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">
        {mode === "eli5" ? frame.note : frame.techNote}
      </p>

      <div className="mb-2 flex justify-center gap-1 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        {VALUES.map((v, i) => {
          const inZone = i >= frame.lo && i <= frame.hi;
          const isMid = frame.mid === i;
          const isFound = isMid && frame.found;
          return (
            <div key={v} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  opacity: inZone ? 1 : 0.22,
                  scale: isMid ? 1.15 : 1,
                  y: isMid ? -6 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex h-9 w-7 items-center justify-center rounded-md border font-mono text-[10px] font-bold sm:h-11 sm:w-9 sm:text-xs ${
                  isFound
                    ? "border-neon-green bg-neon-green/20 text-neon-green shadow-glow"
                    : isMid
                      ? "border-neon-amber bg-neon-amber/15 text-neon-amber"
                      : inZone
                        ? "border-ink-600 bg-ink-700 text-slate-200"
                        : "border-ink-700 bg-ink-800 text-slate-500"
                }`}
              >
                {v}
              </motion.div>
              <span className="font-mono text-[9px] text-slate-600">{i}</span>
            </div>
          );
        })}
      </div>
      <div className="mb-5 text-center font-mono text-[10px] text-slate-500">
        dimmed = eliminated · <span className="text-neon-amber">amber = middle probe</span>
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
