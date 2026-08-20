// Index of all in-depth reference content, keyed by lessonId.
// Each entry: { both?: Section[], py?: Section[], js?: Section[] } where
// Section = { h, kind: 'table' | 'rules' | 'code' | 'text', cols?, rows?, items?, code?, text? }.
// `both` always renders; `py`/`js` swap with the site-wide language toggle.
import { DEEPDIVE_M0 } from "./deepdive-m0.js";
import { DEEPDIVE_M2 } from "./deepdive-m2.js";
import { DEEPDIVE_M3 } from "./deepdive-m3.js";

export const DEEPDIVE = { ...DEEPDIVE_M0, ...DEEPDIVE_M2, ...DEEPDIVE_M3 };
