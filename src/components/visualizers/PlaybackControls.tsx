"use client";

interface Props {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  speed: number;
  onSpeed: (s: number) => void;
  frame: number;
  totalFrames: number;
  extra?: React.ReactNode;
}

export default function PlaybackControls(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="btn-ghost px-3" onClick={p.onReset} title="Reset" aria-label="Reset">
        ⏮
      </button>
      <button
        className="btn-ghost px-3"
        onClick={p.onStepBack}
        title="Step back"
        aria-label="Step back"
      >
        ◀︎
      </button>
      {p.playing ? (
        <button className="btn-primary px-5" onClick={p.onPause} aria-label="Pause">
          ⏸ Pause
        </button>
      ) : (
        <button className="btn-primary px-5" onClick={p.onPlay} aria-label="Play">
          ▶ Play
        </button>
      )}
      <button
        className="btn-ghost px-3"
        onClick={p.onStepForward}
        title="Step forward"
        aria-label="Step forward"
      >
        ▶︎
      </button>
      <select
        className="btn-ghost bg-ink-800 px-2 py-2"
        value={p.speed}
        onChange={(e) => p.onSpeed(Number(e.target.value))}
        aria-label="Playback speed"
      >
        <option value={0.5}>0.5×</option>
        <option value={1}>1×</option>
        <option value={2}>2×</option>
        <option value={4}>4×</option>
      </select>
      <span className="ml-auto font-mono text-xs text-slate-400">
        step {p.frame + 1} / {p.totalFrames}
      </span>
      {p.extra}
    </div>
  );
}
