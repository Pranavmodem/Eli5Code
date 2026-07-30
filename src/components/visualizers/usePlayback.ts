"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Frame-by-frame playback engine shared by the algorithm visualizers.
 * Drives an index from 0..totalFrames-1 with play / pause / step / speed.
 */
export function usePlayback(totalFrames: number) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(totalFrames - 1, i)),
    [totalFrames]
  );

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= totalFrames - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 800 / speed);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, totalFrames]);

  const play = useCallback(() => {
    setIndex((i) => (i >= totalFrames - 1 ? 0 : i));
    setPlaying(true);
  }, [totalFrames]);
  const pause = useCallback(() => setPlaying(false), []);
  const stepForward = useCallback(() => {
    setPlaying(false);
    setIndex((i) => clamp(i + 1));
  }, [clamp]);
  const stepBack = useCallback(() => {
    setPlaying(false);
    setIndex((i) => clamp(i - 1));
  }, [clamp]);
  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  return { index, setIndex, playing, play, pause, stepForward, stepBack, reset, speed, setSpeed };
}
