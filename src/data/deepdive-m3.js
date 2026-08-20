// In-depth reference sections for Module 3 (algorithms), split by language.
// Section kinds: table {cols, rows}, rules {items}, code {code}, text {text}.

const SORT_SCOREBOARD = {
  h: 'The sorting scoreboard (for reference across all five sorting lessons)',
  kind: 'table',
  cols: ['algorithm', 'best', 'average', 'worst', 'extra space', 'stable?'],
  rows: [
    ['bubble', 'O(n) with early exit', 'O(n²)', 'O(n²)', 'O(1)', 'yes'],
    ['selection', 'O(n²) — always', 'O(n²)', 'O(n²)', 'O(1)', 'no (long-range swaps)'],
    ['insertion', 'O(n) on sorted input', 'O(n²)', 'O(n²)', 'O(1)', 'yes'],
    ['merge', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'yes'],
    ['quick', 'O(n log n)', 'O(n log n)', 'O(n²) (bad pivots)', 'O(log n) stack', 'no (typical)'],
    ['Timsort (stdlib)', 'O(n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'yes'],
  ],
};

export const DEEPDIVE_M3 = {
  m3l1: {
    both: [
      SORT_SCOREBOARD,
      { h: 'Bubble sort — everything worth knowing', kind: 'rules', items: [
        'Invariant: after pass k, the k largest values sit in their FINAL slots at the right end — each pass can therefore stop one slot earlier.',
        'Stable: equal values never jump over each other, because only ADJACENT out-of-order pairs swap.',
        '"Stable" matters when values carry luggage: sort orders by price after sorting by date, and equal-priced orders stay date-ordered — only a stable sort promises that.',
        'The early-exit flag (no swaps in a pass → done) is what makes the best case O(n): one clean pass over already-sorted input.',
        'Nobody ships bubble sort — it exists to teach invariants, swaps and O(n²). Knowing WHY it loses to insertion sort (it moves elements one lazy step per pass) is the actual lesson.',
      ] },
    ],
    py: [
      { h: 'What Python actually uses', kind: 'rules', items: [
        'sorted(xs) returns a new sorted list; xs.sort() sorts in place. Both are Timsort: stable, O(n log n) worst case, O(n) on already-sorted or reversed runs.',
        'Sort by anything with key=: sorted(words, key=len), sorted(orders, key=lambda o: o.price). The key function runs ONCE per element.',
        'reverse=True beats sorting then reversing. For "largest 3", heapq.nlargest(3, xs) skips sorting entirely — O(n log 3).',
        'Timsort was invented FOR Python (Tim Peters, 2002) by hunting the runs already present in real data — merge sort\'s strategy plus insertion sort\'s manners.',
      ] },
    ],
    js: [
      { h: 'What JavaScript actually uses', kind: 'rules', items: [
        'arr.sort() mutates and — the classic trap — compares AS STRINGS by default: [10, 9, 2].sort() gives [10, 2, 9]. Always pass a comparator for numbers: arr.sort((a, b) => a - b).',
        'The comparator contract: negative = a first, positive = b first, 0 = tie. Returning a - b is ascending; b - a descending.',
        'Since ES2019 sort() is REQUIRED to be stable, and V8 uses Timsort too. arr.toSorted() (ES2023) is the non-mutating version.',
        'Sorting objects: orders.sort((a, b) => a.price - b.price || a.date - b.date) — the || chains tie-breakers.',
      ] },
    ],
  },

  m3l2: {
    both: [
      SORT_SCOREBOARD,
      { h: 'Selection sort — everything worth knowing', kind: 'rules', items: [
        'Invariant: after pass k, the k SMALLEST values sit in final position at the left — the mirror of bubble\'s invariant.',
        'Always O(n²), even on sorted input: it cannot know the minimum without scanning the whole unsorted region. No early exit exists.',
        'Its one superpower: at most n−1 swaps, the minimum possible for an in-place sort. When a "swap" is monstrously expensive (flash memory writes, huge records moved by robots), selection sort is genuinely used.',
        'NOT stable: the long-range swap can fly the minimum over an equal element. (A stable variant inserts instead of swapping — but then it is insertion sort with extra steps.)',
        'Heapsort (Module 5) is selection sort with a better "find the minimum": a heap answers in O(log n) instead of O(n), turning n passes × n scan into n × log n.',
      ] },
    ],
    py: [
      { h: 'Python corner', kind: 'rules', items: [
        'min(xs) and xs.index(...) hide inside every selection pass — but calling them per pass is still O(n²) total. Idiomatic Python reaches for sorted() and moves on.',
        'The "scan the rest, remember the best" pattern outlives the sort: best = min(candidates, key=score) is selection sort\'s inner loop, used daily.',
      ] },
    ],
    js: [
      { h: 'JavaScript corner', kind: 'rules', items: [
        'Math.min(...xs) spreads the whole array onto the call stack — fine for hundreds, RangeError for a million. The explicit loop scan survives everything.',
        'The inner-loop pattern as idiom: xs.reduce((best, x) => score(x) < score(best) ? x : best) — selection sort\'s scan in one line.',
      ] },
    ],
  },

  m3l3: {
    both: [
      SORT_SCOREBOARD,
      { h: 'Insertion sort — everything worth knowing', kind: 'rules', items: [
        'Invariant: after step i, the first i+1 elements are sorted AMONG THEMSELVES (not final positions yet — that is the difference from selection sort).',
        'ADAPTIVE — its defining virtue: runtime is O(n + d) where d = number of inversions (out-of-order pairs). Nearly-sorted data: nearly O(n). This is why it appears inside production sorts.',
        'Stable: the shifting scan stops at the first equal-or-smaller element, never jumping over equals.',
        'Online: it can sort a stream as items ARRIVE, holding a sorted hand at all times — like the card player.',
        'Real systems use it for small slices: Timsort switches to insertion sort under ~32 elements, because for tiny n the simple loop beats clever recursion\'s overhead.',
      ] },
    ],
    py: [
      { h: 'Python corner: bisect — insertion sort\'s fast half', kind: 'code', code: 'import bisect\nhand = [3, 7, 11, 18]\nspot = bisect.bisect_left(hand, 9)   # O(log n) — WHERE to insert\nbisect.insort(hand, 9)                # O(n) — the shift still costs\nprint(hand)                            # [3, 7, 9, 11, 18]\n# Finding the spot: binary search (next lessons!). Making room: O(n).\n# That O(n) shift is why a sorted list is not a database index.' },
    ],
    js: [
      { h: 'JavaScript corner', kind: 'rules', items: [
        'No bisect module — the sorted-insert is arr.splice(lo, 0, x) after a hand-rolled binary search for lo (you will write that search in two lessons).',
        'V8\'s Timsort also hands small runs to insertion sort — the algorithm you just learned runs somewhere inside every arr.sort() call you have ever made.',
      ] },
    ],
  },

  m3l4: {
    both: [
      SORT_SCOREBOARD,
      { h: 'Merge sort — everything worth knowing', kind: 'rules', items: [
        'Divide and conquer: split in half (log n levels), merge sorted halves (O(n) per level) → O(n log n) ALWAYS — no bad case exists. Determinism is its brand.',
        'The merge step is the whole trick: two sorted piles, compare the front cards, take the smaller — each element is touched once per level.',
        'Stable (take from the LEFT pile on ties) — which is why stdlib sorts descend from merge sort, not quicksort.',
        'The price: O(n) auxiliary memory for the merge scratch space. In-place merging exists but is grotesque; everyone pays the memory.',
        'Killer app — EXTERNAL sorting: data too big for RAM is sorted in chunks and merged from disk streams; merge only ever needs the FRONT of each pile in memory. Database ORDER BY on a billion rows is this.',
        'Recursion note: merge sort is the first algorithm here that NEEDS the recursion lesson — each half is "the same problem, smaller", trusted to the recursive call.',
      ] },
    ],
    py: [
      { h: 'Python corner: heapq.merge — the merge step as a stdlib tool', kind: 'code', code: 'import heapq\nlogs_server_a = [1, 4, 9]          # each already sorted (by timestamp)\nlogs_server_b = [2, 3, 10]\nmerged = list(heapq.merge(logs_server_a, logs_server_b))\nprint(merged)                        # [1, 2, 3, 4, 9, 10]\n# Lazy: works on generators/files without loading everything.\n# Merging k sorted streams at once is exactly how log aggregators work.' },
    ],
    js: [
      { h: 'JavaScript corner', kind: 'rules', items: [
        'No stdlib merge — the two-pointer while loop you wrote IS the tool. Keep it; you will reuse it for "merge intervals" and "squared sorted array" interview problems.',
        'Beware concat-in-a-loop merges: out = out.concat([x]) recopies out every time — O(n²). push() to the result array instead.',
      ] },
    ],
  },

  m3l5: {
    both: [
      SORT_SCOREBOARD,
      { h: 'Quick sort — everything worth knowing', kind: 'rules', items: [
        'Strategy inverted from merge sort: do the work BEFORE recursing (partition around a pivot), then the halves need no merging — the array is sorted when the recursion bottoms out.',
        'Average O(n log n) with constants small enough to beat merge sort in RAM; in-place (O(log n) stack only), which is why C\'s qsort and C++\'s introsort build on it.',
        'The O(n²) horror story: always picking the smallest/largest pivot (e.g. first element of SORTED input) makes one side empty — n levels × n work. Fixes: random pivot, median-of-three, or introsort\'s escape hatch (switch to heapsort past 2·log n depth).',
        'Partition schemes: Lomuto (single scan, simpler, more swaps) vs Hoare (two converging pointers, fewer swaps). Your exercise\'s two-bucket pass is the readable out-of-place version.',
        'Not stable in its fast in-place form — equal elements can leap across the pivot.',
        'Quickselect: recurse into ONE side only to find the k-th smallest in O(n) average — the median-finding trick interviews love.',
      ] },
    ],
    py: [
      { h: 'Python corner', kind: 'code', code: 'import random\n# random.choice as pivot defuses the sorted-input bomb\ndef quicksort(xs):\n    if len(xs) <= 1: return xs\n    p = random.choice(xs)\n    return (quicksort([x for x in xs if x < p])\n            + [x for x in xs if x == p]\n            + quicksort([x for x in xs if x > p]))\n# Readable, correct, O(n) extra memory. Python itself still uses\n# Timsort — this is for understanding, and for interviews.' },
    ],
    js: [
      { h: 'JavaScript corner', kind: 'rules', items: [
        'filter-based quicksort reads beautifully: [...quicksort(xs.filter(x => x < p)), ...xs.filter(x => x === p), ...quicksort(xs.filter(x => x > p))] — three passes per level, O(n) memory, fine for learning.',
        'The in-place version needs the classic swap: [a[i], a[j]] = [a[j], a[i]] — destructuring makes it one line, no temp variable.',
        'Historical scar: pre-2018 V8 used quicksort for sort() and was neither stable nor safe from adversarial O(n²) input — the spec now demands stability, hence Timsort.',
      ] },
    ],
  },

  m3l6: {
    both: [
      { h: 'Linear search — everything worth knowing', kind: 'table',
        cols: ['fact', 'value', 'note'],
        rows: [
          ['worst / average case', 'O(n) / ~n/2 probes', 'every drawer might need opening'],
          ['best case', 'O(1)', 'first drawer'],
          ['requirement on data', 'NONE', 'its entire superpower — unsorted, linked, streamed: all fine'],
          ['when it WINS', 'small n, one-off searches', 'sorting first costs O(n log n) — pointless for a single lookup'],
          ['when it loses', 'repeated searches on big data', 'sort once + binary search, or hash it'],
          ['variant: sentinel search', 'plant target at the end', 'removes the bounds check per step — a real micro-optimisation from the textbooks'],
        ] },
    ],
    py: [
      { h: 'Python: the built-ins ARE linear search', kind: 'code', code: 'xs = [4, 2, 7, 2]\nprint(7 in xs)           # True  — linear scan, O(n)\nprint(xs.index(2))        # 1     — first match, ValueError if absent\nprint(xs.count(2))        # 2     — full scan, always O(n)\n\n# first match with a condition — the generator idiom:\nfirst_even = next((x for x in xs if x % 2 == 0), None)\n\n# `x in big_list` inside a loop is the hidden O(n^2) from m0l9 —\n# a set makes the same test O(1).' },
    ],
    js: [
      { h: 'JavaScript: the built-ins ARE linear search', kind: 'code', code: 'const xs = [4, 2, 7, 2];\nxs.includes(7);              // true — O(n), handles NaN correctly\nxs.indexOf(2);                // 1 — first match, -1 if absent (uses ===)\nxs.find(x => x % 2 === 0);   // 4 — first VALUE matching a condition\nxs.findIndex(x => x > 5);    // 2 — first INDEX matching a condition\n\n// indexOf(NaN) is -1 (NaN !== NaN); includes uses SameValueZero and finds it.\n// arr.includes inside a loop = O(n^2); new Set(arr).has(x) = O(1).' },
    ],
  },

  m3l7: {
    both: [
      { h: 'Binary search — everything worth knowing', kind: 'table',
        cols: ['fact', 'value', 'note'],
        rows: [
          ['time', 'O(log n)', 'a billion items in 30 probes; each probe kills half'],
          ['requirement', 'SORTED data + O(1) random access', 'a sorted linked list is useless — no O(1) jump to the middle'],
          ['loop invariant', 'target, if present, is inside [lo, hi]', 'every correct variant defends exactly this'],
          ['classic bug #1', 'lo < hi vs lo <= hi', 'off-by-one: <= is right for the closed-interval version'],
          ['classic bug #2', 'mid = (lo+hi)/2 overflow', 'a REAL bug in Java\'s stdlib for 9 years; Python ints can\'t overflow, JS is safe below 2^53'],
          ['variants', 'first/last occurrence, insertion point', 'keep searching after a hit — "bisect_left vs bisect_right"'],
          ['generalisation', 'binary search on the ANSWER', 'any monotonic yes/no question: "smallest capacity that ships in D days" — Module 7 territory'],
        ] },
    ],
    py: [
      { h: 'Python: bisect, the stdlib binary search', kind: 'code', code: 'import bisect\nxs = [3, 7, 11, 18, 24, 31, 42]\ni = bisect.bisect_left(xs, 18)     # 3 — leftmost insertion point\nfound = i < len(xs) and xs[i] == 18  # membership test, O(log n)\n\n# bisect_left vs bisect_right on duplicates:\nds = [1, 3, 3, 3, 9]\nprint(bisect.bisect_left(ds, 3))    # 1 — before the run of 3s\nprint(bisect.bisect_right(ds, 3))   # 4 — after the run\n# right - left == how many 3s. Grade lookup, timestamp windows,\n# "closest value" — all bisect one-liners.' },
    ],
    js: [
      { h: 'JavaScript: you own the loop', kind: 'code', code: '// No stdlib binary search — the canonical closed-interval loop:\nfunction binarySearch(xs, t) {\n  let lo = 0, hi = xs.length - 1;\n  while (lo <= hi) {                       // <= : [lo, hi] may hold 1 item\n    const mid = (lo + hi) >> 1;            // safe: array indexes < 2^32\n    if (xs[mid] === t) return mid;\n    if (xs[mid] < t) lo = mid + 1;         // discard left half AND mid\n    else hi = mid - 1;                      // discard right half AND mid\n  }\n  return -1;\n}\n// Memorise this shape — every variant (first occurrence, insertion\n// point, search-on-answer) is a two-line edit of it.' },
    ],
  },

  m3l8: {
    both: [
      { h: 'BFS — everything worth knowing', kind: 'table',
        cols: ['fact', 'value', 'note'],
        rows: [
          ['time / space', 'O(V + E) / O(V)', 'each node enqueued once, each edge looked at once (twice if undirected)'],
          ['data structure', 'QUEUE — non-negotiable', 'swap in a stack and it silently becomes DFS'],
          ['guarantee', 'first arrival = fewest EDGES', 'shortest path in unweighted graphs — its defining superpower'],
          ['mark seen on ENQUEUE', 'not on dequeue', 'else a node enters the queue twice via two neighbours — subtle classic bug'],
          ['path recovery', 'store parent[child] = node when enqueueing', 'walk parents backward from the goal'],
          ['weighted graphs', 'BFS is NOT enough', 'fewest edges ≠ cheapest path — Dijkstra (Module 6) fixes this'],
          ['level tracking', 'process the queue one ring at a time', 'for level = len(queue) snapshots — "minimum moves" problems'],
        ] },
    ],
    py: [
      { h: 'Python: the canonical BFS', kind: 'code', code: 'from collections import deque\n\ndef bfs(adj, start):\n    order = []\n    seen = {start}                 # mark on enqueue!\n    q = deque([start])\n    while q:\n        node = q.popleft()          # O(1) — the deque lesson pays off\n        order.append(node)\n        for nb in adj[node]:\n            if nb not in seen:\n                seen.add(nb)\n                q.append(nb)\n    return order\n# list.pop(0) here would make BFS itself O(V^2). deque or bust.' },
    ],
    js: [
      { h: 'JavaScript: the canonical BFS', kind: 'code', code: 'function bfs(adj, start) {\n  const order = [];\n  const seen = new Set([start]);   // mark on enqueue!\n  const q = [start];\n  let head = 0;                     // index-pointer queue — O(1) dequeue\n  while (head < q.length) {\n    const node = q[head++];\n    order.push(node);\n    for (const nb of adj[node] ?? []) {\n      if (!seen.has(nb)) { seen.add(nb); q.push(nb); }\n    }\n  }\n  return order;\n}\n// q.shift() would work but costs O(n) per dequeue — the m2l6 trap.' },
    ],
  },

  m3l9: {
    both: [
      { h: 'DFS — everything worth knowing', kind: 'table',
        cols: ['fact', 'value', 'note'],
        rows: [
          ['time / space', 'O(V + E) / O(V)', 'same touch-count as BFS; the ORDER differs, not the cost'],
          ['data structure', 'STACK — explicit, or the call stack via recursion', 'recursion IS DFS borrowing the machine\'s stack'],
          ['guarantee', 'reaches everything reachable', 'but paths found are NOT shortest — that is BFS\'s job'],
          ['superpowers', 'cycle detection, topological sort, connected components, maze solving, backtracking', 'Modules 6–7 are built on these'],
          ['memory vs BFS', 'O(depth) vs O(width)', 'deep narrow graph → DFS cheap; shallow wide → BFS queue explodes'],
          ['recursion depth limit', 'deep graphs overflow the call stack', 'iterative stack version is immune — know both'],
          ['three colours', 'unvisited / in-progress / done', 'an edge to an IN-PROGRESS node = a cycle (the deadlock detector)'],
        ] },
    ],
    py: [
      { h: 'Python: recursive and iterative DFS', kind: 'code', code: 'import sys\n# sys.setrecursionlimit(200000)  # default ~1000 frames — deep graphs need more\n\ndef dfs(adj, start, seen=None, order=None):\n    seen = seen if seen is not None else set()   # never a mutable default!\n    order = order if order is not None else []\n    seen.add(start)\n    order.append(start)\n    for nb in adj[start]:\n        if nb not in seen:\n            dfs(adj, nb, seen, order)\n    return order\n\n# Iterative twin — no depth limit (reverse neighbours to match recursive order):\ndef dfs_iter(adj, start):\n    order, seen, stack = [], set(), [start]\n    while stack:\n        node = stack.pop()\n        if node in seen: continue\n        seen.add(node)\n        order.append(node)\n        stack.extend(reversed(adj[node]))\n    return order' },
    ],
    js: [
      { h: 'JavaScript: recursive and iterative DFS', kind: 'code', code: 'function dfs(adj, start, seen = new Set(), order = []) {\n  seen.add(start);\n  order.push(start);\n  for (const nb of adj[start] ?? []) {\n    if (!seen.has(nb)) dfs(adj, nb, seen, order);\n  }\n  return order;\n}\n\n// Iterative twin — survives graphs deeper than the JS call stack\n// (engine stacks give out around ~10k frames):\nfunction dfsIter(adj, start) {\n  const order = [], seen = new Set(), stack = [start];\n  while (stack.length) {\n    const node = stack.pop();\n    if (seen.has(node)) continue;\n    seen.add(node);\n    order.push(node);\n    const nbs = adj[node] ?? [];\n    for (let i = nbs.length - 1; i >= 0; i--) stack.push(nbs[i]); // keep order\n  }\n  return order;\n}' },
    ],
  },

  m3l10: {
    both: [
      { h: 'Recursion — everything worth knowing', kind: 'rules', items: [
        'Anatomy: BASE CASE (the smallest doll — answered directly, no recursion) + RECURSIVE CASE (shrink the problem, trust the smaller call). Missing or unreachable base case = infinite descent = stack overflow.',
        'The leap of faith: assume factorial(n−1) already works and only check that your step (× n) is right. Verifying the whole chain in your head is how people get lost.',
        'Every call pushes a frame (m0l7\'s vending machines) — so recursion costs O(depth) memory even when the maths is O(1).',
        'Recursion ⇄ iteration: anything recursive can be rewritten with an explicit stack, and simple tail-shaped recursions collapse to plain loops. Use recursion when the PROBLEM is recursive: trees, divide and conquer, backtracking.',
        'The naive-fibonacci trap: fib(n) calling fib(n−1) AND fib(n−2) re-solves the same subproblems exponentially — O(1.6ⁿ). Caching answers (memoization) collapses it to O(n) — that observation IS dynamic programming, Module 8.',
        'Where you have already used it: merge sort and quicksort (halves), DFS (neighbours) — recursion was load-bearing three lessons before it got named.',
      ] },
    ],
    py: [
      { h: 'Python specifics', kind: 'code', code: 'import sys\nprint(sys.getrecursionlimit())     # 1000 — Python\'s guard rail\n# Exceed it -> RecursionError (a clean exception, not a crash).\n# CPython does NOT optimise tail calls — Guido chose readable tracebacks.\n\nfrom functools import lru_cache\n@lru_cache(maxsize=None)            # memoization in one line\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nprint(fib(500))                      # instant — and arbitrary precision' },
    ],
    js: [
      { h: 'JavaScript specifics', kind: 'code', code: '// No recursion limit constant — engines throw RangeError\n// ("Maximum call stack size exceeded") around ~10k frames.\n// Tail-call optimisation is in the ES2015 spec but only Safari ships it:\n// do NOT rely on it.\n\n// Memoization by hand — a Map closure:\nconst memo = new Map();\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo.has(n)) return memo.get(n);\n  const v = fib(n - 1) + fib(n - 2);\n  memo.set(n, v);\n  return v;\n}\nconsole.log(fib(78));   // 8944394323791464 — the LAST exact one:\n// fib(79) exceeds 2^53 and silently loses precision. BigInt beyond.' },
    ],
  },
};
