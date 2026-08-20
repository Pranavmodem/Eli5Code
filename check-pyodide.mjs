// End-to-end test of the PracticePanel Python path under REAL Pyodide
// (the same WASM CPython the browser worker loads) — including the
// globals.set injection, the harness, and JSON round-tripping.
import { loadPyodide } from "pyodide";
import { EXERCISES } from "./src/data/exercises.js";

const PY_HARNESS = [
  "import json, traceback",
  "def _norm(v):",
  "    if isinstance(v, bool): return v",
  "    if isinstance(v, float) and v.is_integer(): return int(v)",
  "    if isinstance(v, (list, tuple)): return [_norm(x) for x in v]",
  "    if isinstance(v, dict): return {k: _norm(x) for k, x in v.items()}",
  "    return v",
  "_out = {'results': []}",
  "_ns = {}",
  "try:",
  "    exec(USER_CODE, _ns)",
  "    _fn = _ns.get(FN_NAME)",
  "    if not callable(_fn):",
  "        _out = {'error': 'Define a function named ' + FN_NAME + ' — keep the signature from the starter code.'}",
  "    else:",
  "        for _t in json.loads(TESTS_JSON):",
  "            _r = {'args': _t['args'], 'expected': _t['expected'], 'ok': False}",
  "            try:",
  "                _got = _norm(_fn(*_t['args']))",
  "                try:",
  "                    _r['ok'] = json.dumps(_got, sort_keys=True) == json.dumps(_norm(_t['expected']), sort_keys=True)",
  "                    _r['got'] = _got",
  "                except TypeError:",
  "                    _r['err'] = 'returned a ' + type(_got).__name__ + ' — return lists/dicts/numbers/strings/booleans'",
  "            except BaseException as _e:",
  "                _r['err'] = type(_e).__name__ + ': ' + str(_e)",
  "            _out['results'].append(_r)",
  "except BaseException:",
  "    _out = {'error': traceback.format_exc().strip().split('\\n')[-1]}",
  "json.dumps(_out)",
].join("\n");

const pyodide = await loadPyodide();
console.log("pyodide loaded:", pyodide.version);

function run(code, fnName, tests) {
  pyodide.globals.set("USER_CODE", code);
  pyodide.globals.set("FN_NAME", fnName);
  pyodide.globals.set("TESTS_JSON", JSON.stringify(tests));
  return JSON.parse(pyodide.runPython(PY_HARNESS));
}

// A few representative solutions across tricky shapes:
const CASES = [
  ["m0l7", "def price_with_tax(price, rate):\n    return round((price + price * rate) * 100) / 100"], // float normalization
  ["m0l9", "def has_duplicate(emails):\n    seen = set()\n    for e in emails:\n        if e in seen: return True\n        seen.add(e)\n    return False"], // booleans
  ["m1l2", 'def paint_house(house, colour):\n    return {**house, "colour": colour}'], // dicts through JS->py->JS
  ["m2l3", 'def list_to_array(head):\n    out = []\n    while head:\n        out.append(head["value"]); head = head["next"]\n    return out'], // nested dicts + None
  ["m2l6", "def serve(queue, k):\n    return (queue[:k], queue[k:])"], // TUPLE return — must normalize to lists
  ["m3l7", "def binary_search(sorted_arr, t):\n    lo, hi = 0, len(sorted_arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if sorted_arr[mid] == t: return mid\n        if sorted_arr[mid] < t: lo = mid + 1\n        else: hi = mid - 1\n    return -1"],
  ["m4l8", "def first_duplicate(arr):\n    seen = set()\n    for x in arr:\n        if x in seen: return x\n        seen.add(x)\n    return None"], // None -> null
];

let bad = 0;
for (const [id, sol] of CASES) {
  const ex = EXERCISES[id];
  const res = run(sol, ex.pyFn, ex.tests);
  if (res.error || !res.results.every((r) => r.ok)) {
    console.log(`✗ ${id}:`, JSON.stringify(res).slice(0, 300));
    bad++;
  } else console.log(`✓ ${id} — ${res.results.length} tests pass under Pyodide`);
}

// Error paths:
const e1 = run("def nope(x): return x", "next_age", EXERCISES.m0l1.tests);
console.log(e1.error?.includes("next_age") ? "✓ missing-function error surfaces" : `✗ missing-fn: ${JSON.stringify(e1)}`);
const e2 = run("def next_age(age):\n    return age +", "next_age", EXERCISES.m0l1.tests);
console.log(e2.error?.includes("SyntaxError") ? "✓ syntax error surfaces" : `✗ syntax: ${JSON.stringify(e2)}`);
const e3 = run("def next_age(age):\n    return unknown_var", "next_age", EXERCISES.m0l1.tests);
console.log(e3.results?.[0]?.err?.includes("NameError") ? "✓ runtime error per-test surfaces" : `✗ runtime: ${JSON.stringify(e3)}`);
const e4 = run("def next_age(age):\n    return {1, 2}", "next_age", EXERCISES.m0l1.tests);
console.log(e4.results?.[0]?.err?.includes("set") ? "✓ unserializable return surfaces" : `✗ unserializable: ${JSON.stringify(e4)}`);
// wrong answer still reports got:
const e5 = run("def next_age(age):\n    return age", "next_age", EXERCISES.m0l1.tests);
console.log(e5.results && !e5.results[0].ok && e5.results[0].got === 12 ? "✓ wrong answer reports got" : `✗ wrong-answer: ${JSON.stringify(e5)}`);

console.log(bad === 0 ? "PYODIDE PATH CLEAN ✓" : `${bad} PROBLEM(S)`);
process.exit(bad === 0 ? 0 : 1);
