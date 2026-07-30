// Visualizer access layer: 80 step-scripts (one per lesson) from the data
// modules, plus the code samples and applied notes keyed alongside them.
// @ts-ignore untyped data module
import { VIZ_OF, FAMILY, TITLE, CODE, buildFrames } from "@/data/visualizers";
// @ts-ignore untyped data module
import { VIZ_OF_ADV, FAMILY_ADV, TITLE_ADV, buildAdv } from "@/data/visualizers-adv";
// @ts-ignore untyped data module
import { PY, USES } from "@/data/applied";
// @ts-ignore untyped data module
import { APPROACH } from "@/data/approach";

export interface Predict {
  q: string;
  a: string;
  b: string;
  t: boolean; // true → first option is correct
}

/** A frame is family-shaped; msg is universal, the rest is per-family. */
export interface Frame {
  msg: string;
  caption?: string;
  note?: string;
  predict?: Predict;
  [key: string]: unknown;
}

export interface LessonViz {
  key: string;
  family: string;
  title: string;
  code?: string; // JS snippet (core lessons)
  py?: string; // Python sample
  frames: Frame[];
}

export function vizForLesson(lessonId: string): LessonViz | null {
  const coreKey = (VIZ_OF as Record<string, string>)[lessonId];
  const advKey = (VIZ_OF_ADV as Record<string, string>)[lessonId];
  const key = coreKey ?? advKey;
  if (!key) return null;
  try {
    const frames: Frame[] = (coreKey ? buildFrames(key) : buildAdv(key)) ?? [];
    if (!frames?.length) return null;
    return {
      key,
      family:
        (FAMILY as Record<string, string>)[key] ??
        (FAMILY_ADV as Record<string, string>)[key] ??
        "unknown",
      title:
        (TITLE as Record<string, string>)[key] ??
        (TITLE_ADV as Record<string, string>)[key] ??
        "Watch it happen",
      code: (CODE as Record<string, string>)[key],
      py: (PY as Record<string, string>)[key],
      frames,
    };
  } catch (e) {
    console.warn("visualizer failed for", lessonId, e);
    return null;
  }
}

export function usesForLesson(lessonId: string): string[] | undefined {
  return (USES as Record<string, string[]>)[lessonId];
}

export function approachForLesson(lessonId: string, ap?: string[]): string[] | undefined {
  return ap ?? (APPROACH as Record<string, string[]>)[lessonId];
}
