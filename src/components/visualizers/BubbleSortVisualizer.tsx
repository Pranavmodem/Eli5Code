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
  comparing: number[]; // bar ids under comparison
  swapping: number[]; // bar ids mid-swap
  sortedIds: number[]; // bars locked in final position
  note: string;
  techNote: string;
}

function randomBars(n = 8): Bar[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    value: 10 + Math.floor(Math.random() * 90),
  }));
}

function buildFrames(initial: Bar[]): Frame[] {
  const arr = [...initial];
  const n = arr.length;
  const sorted: number[] = [];
  const frames: Frame[] = [
    {
      order: [...arr],
      comparing: [],
      swapping: [],
      sortedIds: [],
      note: "Here's our messy line of kids. Press play to start comparing neighbors!",
      techNote: `Unsorted input, n = ${n}. Outer loop will run at most ${n - 1} passes.`,
    },
  ];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      const a = arr[j];
      const b = arr[j + 1];
      frames.push({
        order: [...arr],
        comparing: [a.id, b.id],
        swapping: [],
        sortedIds: [...sorted],
        note: `Is ${a.value} taller than ${b.value}?`,
        techNote: `pass ${i + 1}: compare arr[${j}]=${a.value} with arr[${j + 1}]=${b.value}`,
      });
      if (a.value > b.value) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        frames.push({
          order: [...arr],
          comparing: [],
          swapping: [a.id, b.id],
          sortedIds: [...sorted],
          note: `Yes! ${a.value} > ${b.value} — they swap places. 🔄`,
          techNote: `swap arr[${j}] ↔ arr[${j + 1}]`,
        });
      }
    }
    sorted.unshift(arr[n - 1 - i].id);
    frames.push({
      order: [...arr],
      comparing: [],
      swapping: [],
      sortedIds: [...sorted],
      note: `Pass ${i + 1} done — ${arr[n - 1 - i].value} bubbled to its forever home! 🏠`,
      techNote: `end of pass ${i + 1}: index ${n - 1 - i} is final. ${
        swapped ? "" : "No swaps this pass → early exit."
      }`,
    });
    if (!swapped) break;
  }

  frames.push({
    order: [...arr],
    comparing: [],
    swapping: [],
    sortedIds: arr.map((b) => b.id),
    note: "Everyone is in height order. Sorted! 🎉",
    techNote: `Sorted. Total steps recorded: comparisons + swaps grow as O(n²).`,
  });
  return frames;
}

export default function BubbleSortVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [bars, setBars] = useState<Bar[]>(() => [
    { id: 0, value: 64 },
    { id: 1, value: 25 },
    { id: 2, value: 82 },
    { id: 3, value: 12 },
    { id: 4, value: 47 },
    { id: 5, value: 95 },
    { id: 6, value: 31 },
    { id: 7, value: 58 },
  ]);
  const frames = useMemo(() => buildFrames(bars), [bars]);
  const pb = usePlayback(frames.length);
  const frame = frames[pb.index];
  const maxValue = Math.max(...bars.map((b) => b.value));

  const shuffle = () => {
    pb.reset();
    setBars(randomBars());
  };

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon">
          🫧 Bubble Sort — live
        </h3>
        <button className="btn-ghost px-3 py-1.5 text-xs" onClick={shuffle}>
          🎲 New array
        </button>
      </div>
      <p className="mb-4 min-h-[2.5rem] text-sm text-slate-300">
        {mode === "eli5" ? frame.note : frame.techNote}
      </p>

      <div className="mb-5 flex h-56 items-end justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        {frame.order.map((bar) => {
          const isComparing = frame.comparing.includes(bar.id);
          const isSwapping = frame.swapping.includes(bar.id);
          const isSorted = frame.sortedIds.includes(bar.id);
          return (
            <motion.div
              key={bar.id}
              layout
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex w-9 flex-col items-center gap-1 sm:w-12"
            >
              <motion.div
                animate={{
                  height: `${(bar.value / maxValue) * 160}px`,
                  scale: isSwapping ? 1.08 : 1,
                }}
                className={`w-full rounded-t-md ${
                  isSwapping
                    ? "bg-neon-rose shadow-glow"
                    : isComparing
                      ? "bg-neon-amber"
                      : isSorted
                        ? "bg-neon-green"
                        : "bg-ink-600"
                }`}
              />
              <span
                className={`font-mono text-[10px] sm:text-xs ${
                  isComparing || isSwapping ? "text-neon-amber" : "text-slate-400"
                }`}
              >
                {bar.value}
              </span>
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
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded-sm bg-neon-amber" /> comparing
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded-sm bg-neon-rose" /> swapping
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-3 w-3 rounded-sm bg-neon-green" /> locked in place
        </span>
      </div>
    </div>
  );
}
