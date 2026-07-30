"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePlayback } from "./usePlayback";
import PlaybackControls from "./PlaybackControls";
import { useBootcamp } from "@/lib/store";

interface Bar {
  id: number;
  value: number;
}

interface Frame {
  order: Bar[];
  rangeA: [number, number] | null; // index ranges being merged (left pile)
  rangeB: [number, number] | null; // right pile
  merged: boolean;
  note: string;
  techNote: string;
}

function buildFrames(initial: Bar[]): Frame[] {
  let arr = [...initial];
  const n = arr.length;
  const frames: Frame[] = [
    {
      order: [...arr],
      rangeA: null,
      rangeB: null,
      merged: false,
      note: "Every card alone is already 'sorted'. We'll merge tiny piles into bigger sorted piles.",
      techNote: `bottom-up merge sort, n=${n}: widths 1 → 2 → 4`,
    },
  ];

  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n - width; lo += width * 2) {
      const mid = lo + width;
      const hi = Math.min(lo + width * 2, n);
      frames.push({
        order: [...arr],
        rangeA: [lo, mid - 1],
        rangeB: [mid, hi - 1],
        merged: false,
        note: `Two sorted piles of ${width}: [${arr.slice(lo, mid).map((b) => b.value).join(", ")}] and [${arr
          .slice(mid, hi)
          .map((b) => b.value)
          .join(", ")}]. Compare tops, take the smaller, repeat.`,
        techNote: `merge(arr, ${lo}, ${mid}, ${hi - 1}) — two-pointer pass, ${hi - lo} comparisons max`,
      });
      const merged: Bar[] = [];
      let i = lo;
      let j = mid;
      while (i < mid && j < hi) merged.push(arr[i].value <= arr[j].value ? arr[i++] : arr[j++]);
      while (i < mid) merged.push(arr[i++]);
      while (j < hi) merged.push(arr[j++]);
      arr = [...arr.slice(0, lo), ...merged, ...arr.slice(hi)];
      frames.push({
        order: [...arr],
        rangeA: [lo, hi - 1],
        rangeB: null,
        merged: true,
        note: `Riffled together into one sorted pile of ${hi - lo}. ✨`,
        techNote: `merged [${lo}..${hi - 1}] — this level costs O(n) total across all merges`,
      });
    }
  }

  frames.push({
    order: [...arr],
    rangeA: [0, n - 1],
    rangeB: null,
    merged: true,
    note: "One perfectly sorted deck! Splitting is fast (halving), and every merge was a simple walk-through. 🎉",
    techNote: `sorted: log₂(${n}) = ${Math.log2(n)} levels × O(n) work per level = O(n log n)`,
  });
  return frames;
}

export default function MergeSortVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [bars, setBars] = useState<Bar[]>(() =>
    [61, 24, 88, 15, 73, 42, 96, 37].map((v, i) => ({ id: i, value: v }))
  );
  const frames = useMemo(() => buildFrames(bars), [bars]);
  const pb = usePlayback(frames.length);
  const frame = frames[pb.index];
  const maxValue = Math.max(...bars.map((b) => b.value));

  const inRange = (i: number, r: [number, number] | null) => r !== null && i >= r[0] && i <= r[1];

  const shuffle = () => {
    pb.reset();
    setBars(
      Array.from({ length: 8 }, (_, i) => ({ id: i, value: 10 + Math.floor(Math.random() * 90) }))
    );
  };

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon-green">🃏 Merge Sort — live</h3>
        <button className="btn-ghost px-3 py-1.5 text-xs" onClick={shuffle}>🎲 New deck</button>
      </div>
      <p className="mb-4 min-h-[3rem] text-sm text-slate-300">{mode === "eli5" ? frame.note : frame.techNote}</p>

      <div className="mb-5 flex h-56 items-end justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        {frame.order.map((bar, i) => {
          const inA = inRange(i, frame.rangeA);
          const inB = inRange(i, frame.rangeB);
          return (
            <motion.div
              key={bar.id}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="flex w-9 flex-col items-center gap-1 sm:w-12"
            >
              <motion.div
                animate={{ height: `${(bar.value / maxValue) * 160}px` }}
                className={`w-full rounded-t-md ${
                  inA && frame.merged
                    ? "bg-neon-green"
                    : inA
                      ? "bg-neon"
                      : inB
                        ? "bg-neon-purple"
                        : "bg-ink-600"
                }`}
              />
              <span className="font-mono text-[10px] text-slate-400 sm:text-xs">{bar.value}</span>
            </motion.div>
          );
        })}
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
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon" /> left pile</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-purple" /> right pile</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-green" /> merged & sorted</span>
      </div>
    </div>
  );
}
