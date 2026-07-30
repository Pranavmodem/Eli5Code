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
  pivotId: number | null;
  comparingId: number | null;
  swapIds: number[];
  placedIds: number[];
  note: string;
  techNote: string;
}

function buildFrames(initial: Bar[]): Frame[] {
  const arr = [...initial];
  const placed: number[] = [];
  const frames: Frame[] = [
    {
      order: [...arr],
      pivotId: null,
      comparingId: null,
      swapIds: [],
      placedIds: [],
      note: "Pick a captain (the LAST kid), split everyone around them, repeat. Press play!",
      techNote: `quicksort with Lomuto partition, pivot = last element, n=${arr.length}`,
    },
  ];

  const snap = (over: Partial<Frame> & { note: string; techNote: string }) => {
    frames.push({
      order: [...arr],
      pivotId: null,
      comparingId: null,
      swapIds: [],
      placedIds: [...placed],
      ...over,
    });
  };

  const stack: [number, number][] = [[0, arr.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop()!;
    if (lo > hi) continue;
    if (lo === hi) {
      placed.push(arr[lo].id);
      snap({
        note: `${arr[lo].value} is a group of one — automatically in its perfect spot.`,
        techNote: `base case: [${lo}..${hi}] length 1 → fixed`,
      });
      continue;
    }
    const pivot = arr[hi];
    snap({
      pivotId: pivot.id,
      note: `New round! ${pivot.value} is the captain. Shorter kids go left, taller go right.`,
      techNote: `partition [${lo}..${hi}], pivot = arr[${hi}] = ${pivot.value}`,
    });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      snap({
        pivotId: pivot.id,
        comparingId: arr[j].id,
        note: `Is ${arr[j].value} shorter than captain ${pivot.value}?`,
        techNote: `j=${j}: arr[j]=${arr[j].value} ${arr[j].value < pivot.value ? "<" : "≥"} ${pivot.value}`,
      });
      if (arr[j].value < pivot.value) {
        i++;
        if (i !== j) {
          const a = arr[i];
          const b = arr[j];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          snap({
            pivotId: pivot.id,
            swapIds: [a.id, b.id],
            note: `Yes — ${b.value} hops into the "shorter" zone. 🔄`,
            techNote: `swap arr[${i}] ↔ arr[${j}]`,
          });
        }
      }
    }
    const pi = i + 1;
    if (pi !== hi) {
      const a = arr[pi];
      [arr[pi], arr[hi]] = [arr[hi], arr[pi]];
      placed.push(pivot.id);
      snap({
        swapIds: [a.id, pivot.id],
        note: `Captain ${pivot.value} steps between the groups — their FOREVER spot. Nobody moves them again. 🎯`,
        techNote: `swap pivot into index ${pi} — final position`,
      });
    } else {
      placed.push(pivot.id);
      snap({
        note: `Captain ${pivot.value} was already between the groups — locked in! 🎯`,
        techNote: `pivot already at index ${pi} — final position`,
      });
    }
    stack.push([lo, pi - 1]);
    stack.push([pi + 1, hi]);
  }

  snap({
    note: "Every kid found their forever spot, one captain at a time. Sorted! 🎉",
    techNote: "done — average O(n log n); worst O(n²) with adversarial pivots",
  });
  return frames;
}

export default function QuickSortVisualizer() {
  const mode = useBootcamp((s) => s.mode);
  const [bars, setBars] = useState<Bar[]>(() =>
    [54, 91, 22, 68, 13, 79, 36, 47].map((v, i) => ({ id: i, value: v }))
  );
  const frames = useMemo(() => buildFrames(bars), [bars]);
  const pb = usePlayback(frames.length);
  const frame = frames[pb.index];
  const maxValue = Math.max(...bars.map((b) => b.value));

  const shuffle = () => {
    pb.reset();
    setBars(
      Array.from({ length: 8 }, (_, i) => ({ id: i, value: 10 + Math.floor(Math.random() * 90) }))
    );
  };

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neon-green">🎯 Quick Sort — live</h3>
        <button className="btn-ghost px-3 py-1.5 text-xs" onClick={shuffle}>🎲 New lineup</button>
      </div>
      <p className="mb-4 min-h-[3rem] text-sm text-slate-300">{mode === "eli5" ? frame.note : frame.techNote}</p>

      <div className="mb-5 flex h-56 items-end justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 p-4">
        {frame.order.map((bar) => {
          const isPivot = frame.pivotId === bar.id;
          const isComparing = frame.comparingId === bar.id;
          const isSwapping = frame.swapIds.includes(bar.id);
          const isPlaced = frame.placedIds.includes(bar.id);
          return (
            <motion.div
              key={bar.id}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex w-9 flex-col items-center gap-1 sm:w-12"
            >
              {isPivot && <span className="text-[10px]">👑</span>}
              <motion.div
                animate={{
                  height: `${(bar.value / maxValue) * 150}px`,
                  scale: isSwapping ? 1.08 : 1,
                }}
                className={`w-full rounded-t-md ${
                  isSwapping
                    ? "bg-neon-rose shadow-glow"
                    : isPivot
                      ? "bg-neon-purple"
                      : isComparing
                        ? "bg-neon-amber"
                        : isPlaced
                          ? "bg-neon-green"
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
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-purple" /> 👑 pivot</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-amber" /> comparing</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-rose" /> swapping</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-sm bg-neon-green" /> forever spot</span>
      </div>
    </div>
  );
}
