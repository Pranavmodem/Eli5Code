"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/**
 * Interactive complexity chart: five growth curves on a log-scale y axis.
 * Drag on the chart (or use the slider) to probe "what if I had n items?"
 * Palette validated for CVD safety on the dark surface; curves carry direct
 * end labels so identity never relies on color alone.
 */
const SERIES = [
  { key: "O(1)", color: "#0891b2", fn: (_n: number) => 1, direct: false },
  { key: "O(log n)", color: "#7c3aed", fn: (n: number) => Math.max(1, Math.log2(n)), direct: true },
  { key: "O(n)", color: "#059669", fn: (n: number) => n, direct: true },
  { key: "O(n log n)", color: "#d97706", fn: (n: number) => Math.max(1, n * Math.log2(n)), direct: true },
  { key: "O(n²)", color: "#e11d48", fn: (n: number) => n * n, direct: true },
];

const W = 640;
const H = 320;
const M = { top: 18, right: 92, bottom: 38, left: 52 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;
const N_MAX = 100;
const LOG_MAX = 4; // log10 of 100² = 10,000

const x = (n: number) => M.left + ((n - 1) / (N_MAX - 1)) * IW;
const y = (ops: number) => M.top + (1 - Math.log10(Math.max(1, ops)) / LOG_MAX) * IH;

function pathFor(fn: (n: number) => number): string {
  let d = "";
  for (let n = 1; n <= N_MAX; n++) {
    d += `${n === 1 ? "M" : "L"}${x(n).toFixed(1)},${y(fn(n)).toFixed(1)}`;
  }
  return d;
}

const fmt = (v: number) =>
  Math.round(v).toLocaleString("en-US");

export default function BigOChart() {
  const mode = useBootcamp((s) => s.mode);
  const [n, setN] = useState(40);
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => SERIES.map((s) => pathFor(s.fn)), []);

  const probeFromPointer = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const nn = Math.round(1 + ((px - M.left) / IW) * (N_MAX - 1));
    setN(Math.max(1, Math.min(N_MAX, nn)));
  };

  return (
    <div className="card p-5">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-neon-amber">
        📈 Big O — how work grows with n
      </h3>
      <p className="mb-4 text-sm text-slate-300">
        {mode === "eli5"
          ? `Drag across the chart: with ${n} items, the "compare everything with everything" method already needs ${fmt(n * n)} steps — the shortcut methods barely moved.`
          : `Operations at n=${n}, log-scale y. Note O(n²) diverging while O(log n) stays near-flat — constant factors are ignored; growth rate dominates.`}
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mb-3 w-full cursor-crosshair touch-none select-none rounded-xl border border-ink-700 bg-ink-900/60"
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          probeFromPointer(e);
        }}
        onPointerMove={(e) => e.buttons > 0 && probeFromPointer(e)}
        role="img"
        aria-label={`Growth curves for common time complexities at n = ${n}`}
      >
        {/* recessive grid: one line per power of ten */}
        {[0, 1, 2, 3, 4].map((p) => (
          <g key={p}>
            <line
              x1={M.left}
              y1={y(10 ** p)}
              x2={W - M.right}
              y2={y(10 ** p)}
              stroke="#242c4a"
              strokeWidth="1"
            />
            <text
              x={M.left - 8}
              y={y(10 ** p) + 4}
              textAnchor="end"
              className="fill-slate-500"
              fontSize="10"
              fontFamily="monospace"
            >
              {p === 3 ? "1k" : p === 4 ? "10k" : 10 ** p}
            </text>
          </g>
        ))}
        {/* x axis labels */}
        {[1, 25, 50, 75, 100].map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - M.bottom + 16}
            textAnchor="middle"
            className="fill-slate-500"
            fontSize="10"
            fontFamily="monospace"
          >
            {t}
          </text>
        ))}
        <text
          x={M.left + IW / 2}
          y={H - 6}
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="10"
        >
          n — number of items
        </text>
        <text
          x={14}
          y={M.top + IH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${M.top + IH / 2})`}
          className="fill-slate-400"
          fontSize="10"
        >
          operations (log scale)
        </text>

        {/* curves: 2px lines, direct labels at the ends */}
        {SERIES.map((s, i) => (
          <g key={s.key}>
            <path d={paths[i]} fill="none" stroke={s.color} strokeWidth="2" />
            {s.direct && (
              <text
                x={W - M.right + 6}
                y={y(s.fn(N_MAX)) + 4}
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                fill={s.color}
              >
                {s.key}
              </text>
            )}
          </g>
        ))}

        {/* probe line + intersection dots */}
        <motion.g animate={{ x: 0 }}>
          <line
            x1={x(n)}
            y1={M.top}
            x2={x(n)}
            y2={H - M.bottom}
            stroke="#64748b"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {SERIES.map((s) => (
            <circle
              key={s.key}
              cx={x(n)}
              cy={y(s.fn(n))}
              r="4.5"
              fill={s.color}
              stroke="#121627"
              strokeWidth="2"
            />
          ))}
        </motion.g>
      </svg>

      <input
        type="range"
        min={1}
        max={N_MAX}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        className="mb-4 w-full accent-cyan-400"
        aria-label="Number of items n"
      />

      {/* legend + live readout: identity chip + value, text in ink tokens */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SERIES.map((s) => (
          <div
            key={s.key}
            className="flex flex-col items-center rounded-lg border border-ink-700 bg-ink-900/60 px-2 py-2"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-300">
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.key}
            </span>
            <span className="font-mono text-sm text-slate-100">{fmt(s.fn(n))}</span>
            <span className="text-[9px] uppercase tracking-wide text-slate-500">ops</span>
          </div>
        ))}
      </div>
    </div>
  );
}
