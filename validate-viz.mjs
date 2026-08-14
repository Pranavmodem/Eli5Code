// Validates every frame of all 80 visualizers against what VizPlayer's family
// renderers actually consume. Catches values that would be rendered as React
// children but aren't primitives (the "Objects are not valid as a React child" crash).
import { VIZ_OF, FAMILY, buildFrames } from "./src/data/visualizers.js";
import { VIZ_OF_ADV, FAMILY_ADV, buildAdv } from "./src/data/visualizers-adv.js";

const bad = [];
const prim = (v) => v === null || v === undefined || ["string", "number", "boolean"].includes(typeof v);
const note = (key, fi, msg, sample) =>
  bad.push(`${key} frame#${fi}: ${msg}${sample !== undefined ? " → " + JSON.stringify(sample).slice(0, 90) : ""}`);

// The field each family needs in order to draw anything at all.
const PRIMARY = {
  bars: ["arr"], cells: ["cells"], nodes: ["nodes"], vstack: ["items"], hqueue: ["items"],
  buckets: ["buckets"], graph: ["g"], matrix: ["rows"], panels: ["panels"],
  objects: ["cls", "objs"], chart: ["series", "cols"],
};

function checkFrame(key, fam, f, fi) {
  const arr = (x) => (Array.isArray(x) ? x : []);
  const need = PRIMARY[fam] ?? [];
  if (need.length && !need.some((k) => f[k] !== undefined))
    note(key, fi, `renders blank — none of [${need.join(", ")}] present; has [${Object.keys(f).join(", ")}]`);
  if (!prim(f.msg)) note(key, fi, "msg not primitive", f.msg);
  if (f.caption !== undefined && !prim(f.caption)) note(key, fi, "caption not primitive", f.caption);
  if (f.note !== undefined && !prim(f.note)) note(key, fi, "note not primitive", f.note);
  if (f.predict) {
    const p = f.predict;
    if (!prim(p.q) || !prim(p.a) || !prim(p.b)) note(key, fi, "predict fields not primitive", p);
  }

  switch (fam) {
    case "bars":
      arr(f.arr).forEach((v, i) => !prim(v) && note(key, fi, `arr[${i}] not primitive`, v));
      break;
    case "cells":
      arr(f.cells).forEach((c, i) => {
        if (!c || typeof c !== "object") return note(key, fi, `cells[${i}] not an object`, c);
        if (!prim(c.v)) note(key, fi, `cells[${i}].v not primitive`, c.v);
        if (c.tag !== undefined && !prim(c.tag)) note(key, fi, `cells[${i}].tag not primitive`, c.tag);
      });
      break;
    case "nodes":
      arr(f.nodes).forEach((v, i) => !prim(v) && note(key, fi, `nodes[${i}] not primitive`, v));
      break;
    case "vstack":
    case "hqueue":
      arr(f.items).forEach((v, i) => !prim(v) && note(key, fi, `items[${i}] not primitive`, v));
      break;
    case "buckets":
      arr(f.buckets).forEach((b, i) =>
        arr(b).forEach((v, j) => !prim(v) && note(key, fi, `buckets[${i}][${j}] not primitive`, v))
      );
      break;
    case "graph": {
      const g = f.g;
      if (!g || !Array.isArray(g.nodes)) return note(key, fi, "graph frame missing g.nodes", g);
      g.nodes.forEach((n, i) => {
        if (!Array.isArray(n) || !prim(n[0]) || typeof n[1] !== "number" || typeof n[2] !== "number")
          note(key, fi, `g.nodes[${i}] malformed`, n);
      });
      arr(f.visited).forEach((v, i) => !prim(v) && note(key, fi, `visited[${i}] not primitive`, v));
      arr(f.front).forEach((v, i) => !prim(v) && note(key, fi, `front[${i}] not primitive`, v));
      if (f.cur !== undefined && !prim(f.cur)) note(key, fi, "cur not primitive", f.cur);
      break;
    }
    case "matrix":
      arr(f.cols).forEach((c, i) => !prim(c) && note(key, fi, `cols[${i}] not primitive`, c));
      arr(f.rows).forEach((r, i) => {
        if (!r || typeof r !== "object") return note(key, fi, `rows[${i}] not an object`, r);
        if (!prim(r.label)) note(key, fi, `rows[${i}].label not primitive`, r.label);
        arr(r.cells).forEach((c, j) => {
          if (!c || typeof c !== "object") return note(key, fi, `rows[${i}].cells[${j}] not an object`, c);
          if (!prim(c.t)) note(key, fi, `rows[${i}].cells[${j}].t not primitive`, c.t);
        });
      });
      break;
    case "panels":
      arr(f.panels).forEach((p, i) => {
        if (!p || typeof p !== "object") return note(key, fi, `panels[${i}] not an object`, p);
        if (!prim(p.title)) note(key, fi, `panels[${i}].title not primitive`, p.title);
        arr(p.rows).forEach((r, j) => {
          if (!r || typeof r !== "object") return note(key, fi, `panels[${i}].rows[${j}] not an object`, r);
          if (!prim(r.t)) note(key, fi, `panels[${i}].rows[${j}].t not primitive`, r.t);
        });
      });
      arr(f.log).forEach((l, i) => {
        if (!prim(l) && !(l && typeof l === "object" && prim(l.t)))
          note(key, fi, `log[${i}] neither primitive nor {t}`, l);
      });
      break;
    case "objects": {
      if (f.cls) {
        if (!prim(f.cls.name)) note(key, fi, "cls.name not primitive", f.cls.name);
        arr(f.cls.fields).forEach((x, i) => !prim(x) && note(key, fi, `cls.fields[${i}] not primitive`, x));
      }
      arr(f.objs).forEach((o, i) => {
        if (!o || typeof o !== "object") return note(key, fi, `objs[${i}] not an object`, o);
        if (!prim(o.type) || !prim(o.colour) || !prim(o.id)) note(key, fi, `objs[${i}] fields not primitive`, o);
      });
      break;
    }
    case "chart":
      // three accepted shapes: object series, string series (curve keys), or cost columns
      arr(f.series).forEach((s, i) => {
        if (typeof s === "string") return; // curve key, e.g. "n2"
        if (!s || typeof s !== "object") return note(key, fi, `series[${i}] neither string nor object`, s);
        if (!prim(s.name) || !prim(s.k) || typeof s.mul !== "number")
          note(key, fi, `series[${i}] object fields malformed`, s);
      });
      arr(f.cols).forEach((c, i) => {
        if (!c || typeof c !== "object" || typeof c.cost !== "number" || !prim(c.label))
          note(key, fi, `cols[${i}] malformed`, c);
      });
      break;
    default:
      note(key, fi, `unknown family "${fam}"`);
  }
}

let frameCount = 0;
const run = (map, famMap, build) => {
  for (const [lesson, key] of Object.entries(map)) {
    const fam = famMap[key];
    let frames;
    try {
      frames = build(key) ?? [];
    } catch (e) {
      bad.push(`${key} (${lesson}): buildFrames THREW ${e.message}`);
      continue;
    }
    if (!frames.length) bad.push(`${key} (${lesson}): produced no frames`);
    frames.forEach((f, i) => {
      frameCount++;
      checkFrame(`${key}(${lesson},${fam})`, fam, f, i);
    });
  }
};

run(VIZ_OF, FAMILY, buildFrames);
run(VIZ_OF_ADV, FAMILY_ADV, buildAdv);

console.log(`checked ${Object.keys(VIZ_OF).length + Object.keys(VIZ_OF_ADV).length} visualizers, ${frameCount} frames`);
if (bad.length === 0) console.log("ALL CLEAN ✓");
else {
  console.log(`\n${bad.length} PROBLEM(S):`);
  const seen = new Set();
  bad.forEach((b) => {
    const sig = b.replace(/frame#\d+/, "frame#*").replace(/\[\d+\]/g, "[*]");
    if (seen.has(sig)) return;
    seen.add(sig);
    console.log(" -", b);
  });
  console.log(`(${seen.size} unique signatures)`);
}
