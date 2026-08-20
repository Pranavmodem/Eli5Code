// Verifies the Python practice pipeline end-to-end without a browser:
// for every exercise, runs a reference Python solution through the SAME
// harness PracticePanel ships to Pyodide, and checks all tests pass.
// Also runs each pyStarter through the harness to ensure starters parse
// and (being stubs) do NOT pass.
import { EXERCISES } from "./src/data/exercises.js";
import { execFileSync } from "node:child_process";

const SOLUTIONS = {
  m0l1: "def next_age(age):\n    older = age + 1\n    return older",
  m0l2: "def parse_plus_one(s):\n    return int(s) + 1",
  m0l3: 'def greet(name, age):\n    return f"Hi {name}! Next year you will be {age + 1}."',
  m0l4: "def wrap_hour(h):\n    return h % 12",
  m0l5: 'def grade(score):\n    if score >= 80:\n        return "great"\n    elif score >= 50:\n        return "pass"\n    else:\n        return "retry"',
  m0l6: "def sum_prices(prices):\n    total = 0\n    for p in prices:\n        total += p\n    return total",
  m0l7: "def price_with_tax(price, rate):\n    total = price + price * rate\n    return round(total * 100) / 100",
  m0l8: "def sum_odds(nums):\n    total = 0\n    for n in nums:\n        if n % 2 == 1:\n            total += n\n    return total",
  m0l9: "def has_duplicate(emails):\n    seen = set()\n    for e in emails:\n        if e in seen:\n            return True\n        seen.add(e)\n    return False",
  m1l2: 'def paint_house(house, colour):\n    return {**house, "colour": colour}',
  m1l4: 'def make_house(colour, address):\n    return {"colour": colour, "address": address, "ready": True}',
  m2l1: "def grab_slots(arr, i):\n    return [arr[i], arr[-1]]",
  m2l2: "def append_all(arr, items):\n    return arr + items",
  m2l3: 'def list_to_array(head):\n    out = []\n    node = head\n    while node:\n        out.append(node["value"])\n        node = node["next"]\n    return out',
  m2l4: 'def count_nodes(head):\n    n = 0\n    node = head\n    while node:\n        n += 1\n        node = node["next"]\n    return n',
  m2l5: "def reverse_with_stack(arr):\n    stack = []\n    out = []\n    for x in arr:\n        stack.append(x)\n    while stack:\n        out.append(stack.pop())\n    return out",
  m2l6: "def serve(queue, k):\n    return [queue[:k], queue[k:]]",
  m2l7: "def bucket_of(key, n):\n    h = 0\n    for ch in key:\n        h += ord(ch)\n    return h % n",
  m2l8: "def group_by_bucket(keys, n):\n    buckets = [[] for _ in range(n)]\n    for key in keys:\n        h = sum(ord(ch) for ch in key) % n\n        buckets[h].append(key)\n    return buckets",
  m2l9: 'def bst_contains(root, t):\n    node = root\n    while node:\n        if node["v"] == t:\n            return True\n        node = node["left"] if t < node["v"] else node["right"]\n    return False',
  m2l10: "def degree_of(adj, node):\n    return len(adj.get(node, []))",
  m3l6: "def linear_search(arr, t):\n    for i, x in enumerate(arr):\n        if x == t:\n            return i\n    return -1",
  m3l7: "def binary_search(sorted_arr, t):\n    lo, hi = 0, len(sorted_arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if sorted_arr[mid] == t:\n            return mid\n        if sorted_arr[mid] < t:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
  m3l1: "def bubble_sort(arr):\n    a = list(arr)\n    for i in range(len(a) - 1, 0, -1):\n        swapped = False\n        for j in range(i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                swapped = True\n        if not swapped:\n            break\n    return a",
  m3l2: "def selection_sort(arr):\n    a = list(arr)\n    for i in range(len(a)):\n        m = i\n        for j in range(i + 1, len(a)):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a",
  m3l3: "def insertion_sort(arr):\n    a = list(arr)\n    for i in range(1, len(a)):\n        x = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > x:\n            a[j + 1] = a[j]\n            j -= 1\n        a[j + 1] = x\n    return a",
  m3l10: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
  m3l4: "def merge(a, b):\n    out = []\n    i, j = 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    out.extend(a[i:])\n    out.extend(b[j:])\n    return out",
  m3l5: "def partition(arr, pivot):\n    smaller = []\n    rest = []\n    for x in arr:\n        if x < pivot:\n            smaller.append(x)\n        else:\n            rest.append(x)\n    return [smaller, rest]",
  m3l8: 'def bfs_order(adj, start):\n    order = []\n    queue = [start]\n    seen = {start}\n    head = 0\n    while head < len(queue):\n        node = queue[head]; head += 1\n        order.append(node)\n        for nb in adj.get(node, []):\n            if nb not in seen:\n                seen.add(nb)\n                queue.append(nb)\n    return order',
  m3l9: "def dfs_order(adj, start):\n    order = []\n    seen = set()\n    def visit(node):\n        seen.add(node)\n        order.append(node)\n        for nb in adj.get(node, []):\n            if nb not in seen:\n                visit(nb)\n    visit(start)\n    return order",
  m4l1: "def pair_count(n):\n    return n * (n - 1) // 2",
  m4l8: "def first_duplicate(arr):\n    seen = set()\n    for x in arr:\n        if x in seen:\n            return x\n        seen.add(x)\n    return None",
};

// EXACT copy of the harness PracticePanel embeds (keep in sync!).
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

function runHarness(userCode, fnName, tests) {
  // Same variable injection Pyodide does via globals.set, done with a prelude.
  const prelude =
    `USER_CODE = ${JSON.stringify(userCode)}\n` +
    `FN_NAME = ${JSON.stringify(fnName)}\n` +
    `TESTS_JSON = ${JSON.stringify(JSON.stringify(tests))}\n`;
  // runPython returns the last expression; plain python needs a print.
  const lines = PY_HARNESS.split("\n");
  const body = lines.slice(0, -1).join("\n") + `\nprint(${lines[lines.length - 1]})`;
  try {
    const out = execFileSync("python3", ["-c", prelude + body], { encoding: "utf8", timeout: 10000 });
    return JSON.parse(out.trim());
  } catch (e) {
    // A starter with a bare `while ...: pass` loops forever — in the browser
    // the worker timeout kills it; here we report it as a timeout "failure".
    if (e.killed || /ETIMEDOUT/.test(String(e.code))) return { timeout: true };
    throw e;
  }
}

let bad = 0;
for (const [lessonId, ex] of Object.entries(EXERCISES)) {
  if (!ex.pyStarter || !ex.pyFn) { console.log(`✗ ${lessonId}: missing pyStarter/pyFn`); bad++; continue; }
  const sol = SOLUTIONS[lessonId];
  if (!sol) { console.log(`✗ ${lessonId}: no reference solution in this checker`); bad++; continue; }

  // 1. The reference solution must pass every test.
  const res = runHarness(sol, ex.pyFn, ex.tests);
  if (res.error) { console.log(`✗ ${lessonId}: harness error — ${res.error}`); bad++; continue; }
  const fails = res.results.filter((r) => !r.ok);
  if (fails.length) {
    console.log(`✗ ${lessonId}: ${fails.length} failing — ${JSON.stringify(fails[0])}`);
    bad++;
    continue;
  }

  // 2. The starter must parse (no syntax error) and must NOT pass (it's a stub).
  const st = runHarness(ex.pyStarter, ex.pyFn, ex.tests);
  if (st.timeout) {
    console.log(`✓ ${lessonId} (${ex.pyFn}) — ${res.results.length} tests pass; starter loops (browser timeout handles it)`);
    continue;
  }
  if (st.error && /SyntaxError|IndentationError/.test(st.error)) {
    console.log(`✗ ${lessonId}: starter does not parse — ${st.error}`);
    bad++;
    continue;
  }
  if (st.results && st.results.every((r) => r.ok)) {
    console.log(`✗ ${lessonId}: starter already passes all tests — nothing to write!`);
    bad++;
    continue;
  }
  console.log(`✓ ${lessonId} (${ex.pyFn}) — ${res.results.length} tests pass, starter parses & fails as expected`);
}
console.log(bad === 0 ? "\nALL PYTHON EXERCISES CLEAN ✓" : `\n${bad} PROBLEM(S)`);
process.exit(bad === 0 ? 0 : 1);
