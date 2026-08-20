// In-depth reference sections for Module 2 (data structures), split by language.
// Section kinds: table {cols, rows}, rules {items}, code {code}, text {text}.
export const DEEPDIVE_M2 = {
  m2l1: {
    both: [
      { h: 'Array operations and what they cost', kind: 'table',
        cols: ['operation', 'cost', 'why'],
        rows: [
          ['read arr[i]', 'O(1)', 'address = start + i × slot size — one multiplication, one jump'],
          ['write arr[i] = x', 'O(1)', 'same arithmetic, then one store'],
          ['search (unsorted)', 'O(n)', 'no shortcut — every slot may hide the value'],
          ['insert at the END', 'O(1) amortized', 'drop into the next free slot (details next lesson)'],
          ['insert at index i', 'O(n)', 'every element from i onward must shift right one slot'],
          ['delete at index i', 'O(n)', 'every element after i shifts left to close the gap'],
          ['length', 'O(1)', 'stored in the header — never counted'],
        ] },
    ],
    py: [
      { h: 'Python lists — the full indexing toolkit', kind: 'rules', items: [
        'Negative indexes count from the end: arr[-1] is the last element, arr[-2] second-to-last. arr[len(arr)] raises IndexError — Python never reads past the shelf.',
        'Slicing copies: arr[2:5] is a NEW list of slots 2,3,4 (half-open — the stop index is excluded). arr[:] is a full shallow copy; arr[::-1] a reversed copy.',
        'A Python list stores POINTERS to objects, not the objects themselves — so one list can mix types, and each slot costs 8 bytes regardless of what it points to.',
        'For a million plain numbers, array("d", ...) from the array module or a NumPy array stores raw values instead of pointers — ~8 bytes each with no per-object overhead.',
      ] },
      { h: 'See it yourself', kind: 'code', code: 'arr = [12, 30, 21, 45, 9]\nprint(arr[2], arr[-1])   # 21 9 — both O(1)\nprint(arr[1:3])           # [30, 21] (a copy)\narr[2] = 99               # O(1) write\narr.insert(0, 7)          # O(n) — everything shifts right\ndel arr[0]                # O(n) — everything shifts left' },
    ],
    js: [
      { h: 'JavaScript arrays — the full indexing toolkit', kind: 'rules', items: [
        'arr[arr.length - 1] or arr.at(-1) for the last element — at() accepts negatives, [] does not (arr[-1] looks up a property literally named "-1" and gives undefined).',
        'Reading past the end returns undefined, never throws. Writing past the end silently creates a HOLE — arr[100] = 1 on a 3-element array makes a sparse array, which V8 stores as a slow dictionary. Avoid.',
        'slice(2, 5) copies (half-open, like Python). splice(i, k) mutates — removes k elements at i and shifts the rest: O(n).',
        'V8 keeps arrays in fast "packed" modes (all ints, all doubles, or mixed) — mixing types or making holes downgrades the whole array\'s representation.',
        'For a million raw numbers, typed arrays (Float64Array, Int32Array) store values directly — fixed length, no per-element boxing.',
      ] },
      { h: 'See it yourself', kind: 'code', code: 'const arr = [12, 30, 21, 45, 9];\nconsole.log(arr[2], arr.at(-1));  // 21 9\nconsole.log(arr.slice(1, 3));      // [30, 21] (a copy)\narr[2] = 99;                        // O(1) write\narr.splice(0, 0, 7);                // insert at front — O(n)\narr.splice(0, 1);                   // delete at front — O(n)' },
    ],
  },

  m2l2: {
    both: [
      { h: 'How the growth trick actually works', kind: 'text',
        text: 'A dynamic array keeps two numbers: length (slots used) and capacity (slots allocated). Append fits? O(1). Array full? Allocate a bigger block, copy everything across — O(n) for that one append — then appends are cheap again. Because each expensive copy buys proportionally many cheap appends, the AVERAGE stays O(1): that is amortized analysis, formalised in Module 4.' },
    ],
    py: [
      { h: 'CPython list growth — the real numbers', kind: 'table',
        cols: ['fact', 'value', 'consequence'],
        rows: [
          ['growth factor', '~1.125× (+ constant)', 'gentler than doubling — wastes less memory, copies a bit more often'],
          ['empty list', '56 bytes, capacity 0', 'the first append always allocates'],
          ['append', 'O(1) amortized', 'list.append is THE idiomatic accumulator'],
          ['pop() from end', 'O(1)', 'shrinks capacity only when 1/2 empty'],
          ['pop(0) / insert(0, x)', 'O(n)', 'front operations shift everything — use collections.deque instead'],
          ['preallocating', '[0] * n', 'one allocation instead of n growth steps'],
        ] },
      { h: 'See it yourself', kind: 'code', code: 'import sys\nxs = []\nlast = 0\nfor i in range(60):\n    xs.append(i)\n    size = sys.getsizeof(xs)\n    if size != last:              # capacity jumped -> a copy happened\n        print(f"len={len(xs):2}  bytes={size}")\n        last = size\n# jumps land at 1, 5, 9, 17, 26, 36, 47... — the ~1.125x staircase' },
    ],
    js: [
      { h: 'V8 array growth — the real numbers', kind: 'table',
        cols: ['fact', 'value', 'consequence'],
        rows: [
          ['growth formula', 'old × 1.5 + 16', 'push is O(1) amortized, same shape as Python'],
          ['push / pop (end)', 'O(1) amortized', 'the fast pair — use them for stacks'],
          ['unshift / shift (front)', 'O(n)', 'shifts every element — never use in a loop over big arrays'],
          ['new Array(n)', 'n holes', 'creates a HOLEY array (slow mode); prefer Array.from({length: n}, ...) or fill()'],
          ['length = 0', 'truncates in place', 'the idiomatic clear'],
        ] },
      { h: 'See it yourself', kind: 'code', code: 'const xs = [];\nfor (let i = 0; i < 1000; i++) xs.push(i);   // 1000 pushes, ~a dozen copies\n\n// The trap: shift() in a loop is O(n^2) total\nconst q = [...xs];\nwhile (q.length) q.shift();       // 1000 shifts x 1000 moves = slow\n// Fix: walk an index pointer instead (see the Queues lesson)' },
    ],
  },

  m2l3: {
    both: [
      { h: 'Array vs linked list — the whole trade in one table', kind: 'table',
        cols: ['operation', 'array', 'linked list', 'who wins'],
        rows: [
          ['read the i-th item', 'O(1)', 'O(n) — walk i hops', 'array'],
          ['insert/delete at front', 'O(n) — shift all', 'O(1) — re-aim two pointers', 'list'],
          ['insert after a node you HOLD', 'O(n)', 'O(1)', 'list'],
          ['search by value', 'O(n)', 'O(n)', 'tie'],
          ['memory per element', 'value only', 'value + next pointer (+prev if doubly)', 'array'],
          ['cache friendliness', 'contiguous — prefetcher loves it', 'scattered — every hop may miss cache', 'array (often decisive in practice)'],
        ] },
      { h: 'The honest footnote', kind: 'text',
        text: 'On modern hardware the cache line is so dominant that arrays beat linked lists even at some jobs the table awards to lists — the O(1) relink only wins if FINDING the spot was already free (you held a pointer). That is why real linked lists appear where handles are held for you: LRU caches, schedulers, undo chains, allocators.' },
    ],
    py: [
      { h: 'Python specifics', kind: 'rules', items: [
        'Python has no built-in singly linked list — you build nodes from a class (or dicts, as this exercise does), and that is deliberate: list covers most needs better.',
        'collections.deque IS the standard library\'s linked structure — a doubly linked list of 64-slot blocks: O(1) at both ends, O(n) in the middle.',
        'A node class is three lines: class Node: def __init__(self, value, next=None): self.value, self.next = value, next.',
        'Every node is a full Python object: ~56 bytes overhead per node vs 8 bytes per list slot — a 7× memory tax for the relink superpower.',
      ] },
    ],
    js: [
      { h: 'JavaScript specifics', kind: 'rules', items: [
        'No built-in linked list here either — nodes are plain objects: { value, next: null }.',
        'Hidden classes make uniform node shapes fast: always create nodes with the same fields in the same order.',
        'The exercise\'s { value, next } objects serialize cleanly to JSON — real node classes with methods would not.',
        'Each node object costs ~3–5× the bytes of an array slot; V8 cannot pack scattered heap objects the way it packs a numeric array.',
      ] },
    ],
  },

  m2l4: {
    both: [
      { h: 'Singly vs doubly linked', kind: 'table',
        cols: ['ability', 'singly', 'doubly', 'price of doubly'],
        rows: [
          ['walk forward', 'O(1)/hop', 'O(1)/hop', '—'],
          ['walk backward', 'impossible without re-walking', 'O(1)/hop', 'one extra pointer per node'],
          ['delete a node you HOLD', 'O(n) — must find its previous', 'O(1) — node.prev is right there', 'every insert must wire 4 pointers, not 2'],
          ['insert before a held node', 'O(n)', 'O(1)', 'same'],
          ['memory per node', 'value + 1 pointer', 'value + 2 pointers', '+8 bytes/node'],
        ] },
    ],
    py: [
      { h: 'collections.deque — the doubly linked workhorse', kind: 'table',
        cols: ['operation', 'cost', 'note'],
        rows: [
          ['append(x) / appendleft(x)', 'O(1)', 'both ends are first-class'],
          ['pop() / popleft()', 'O(1)', 'this is why BFS uses deque, never list.pop(0)'],
          ['d[i] middle access', 'O(n)', 'it is a list of blocks, not an array'],
          ['maxlen=k', 'auto-evicts', 'a rolling window in one argument'],
          ['rotate(k)', 'O(k)', 'carousel behaviour for free'],
        ] },
      { h: 'See it yourself', kind: 'code', code: "from collections import deque\nhistory = deque(maxlen=3)          # a browser's back button\nfor page in ['a', 'b', 'c', 'd']:\n    history.append(page)\nprint(list(history))                # ['b', 'c', 'd'] — 'a' fell off\nhistory.pop()                        # go back: O(1)\nhistory.appendleft('start')         # O(1) at the other end too" },
    ],
    js: [
      { h: 'JavaScript specifics', kind: 'rules', items: [
        'No standard doubly linked list — you wire { value, prev, next } objects yourself, exactly like the visualizer shows.',
        'The classic real use is an LRU cache: a Map for O(1) lookup pointing INTO a doubly linked list for O(1) move-to-front — Module 5 builds it.',
        'Map itself secretly maintains a doubly linked list through its entries — that is how it guarantees insertion-order iteration with O(1) delete.',
        'When wiring by hand, update all FOUR pointers on insert (new.prev, new.next, left.next, right.prev) — forgetting one is the classic bug, and drawing the diagram first is the classic fix.',
      ] },
    ],
  },

  m2l5: {
    both: [
      { h: 'Stack operations — all of them', kind: 'table',
        cols: ['operation', 'meaning', 'cost'],
        rows: [
          ['push(x)', 'put x on top', 'O(1)'],
          ['pop()', 'remove and return the top', 'O(1)'],
          ['peek / top', 'look at the top without removing', 'O(1)'],
          ['isEmpty', 'anything left?', 'O(1)'],
          ['search / access by depth', 'NOT a stack operation', 'O(n) — if you need it, you wanted a different structure'],
        ] },
      { h: 'Where stacks hide', kind: 'rules', items: [
        'The call stack (Module 0\'s vending machines) — every function call pushes a frame, every return pops one. "Stack overflow" is this stack hitting its ceiling.',
        'Undo/redo: two stacks — undo pops from history and pushes onto redo.',
        'Matching brackets/tags: push every opener, pop on each closer, and the pairs match iff the stack ends empty.',
        'DFS (Module 3) is a stack-driven walk; recursion is DFS borrowing the call stack.',
      ] },
    ],
    py: [
      { h: 'Python: a list IS the stack', kind: 'code', code: 'stack = []\nstack.append(1)      # push — O(1) amortized\nstack.append(2)\ntop = stack[-1]       # peek — O(1)\nx = stack.pop()       # pop — O(1), returns 2\nif not stack: ...     # isEmpty — empty list is falsy\n# Never use insert(0)/pop(0) as a stack — wrong end, O(n)' },
    ],
    js: [
      { h: 'JavaScript: an array IS the stack', kind: 'code', code: 'const stack = [];\nstack.push(1);                 // push — O(1) amortized\nstack.push(2);\nconst top = stack.at(-1);      // peek — O(1)\nconst x = stack.pop();          // pop — O(1), returns 2\nif (stack.length === 0) { }     // isEmpty\n// push/pop use the FAST end; unshift/shift would be the slow end' },
    ],
  },

  m2l6: {
    both: [
      { h: 'Queue operations — all of them', kind: 'table',
        cols: ['operation', 'meaning', 'cost (proper queue)'],
        rows: [
          ['enqueue(x)', 'join at the back', 'O(1)'],
          ['dequeue()', 'serve from the front', 'O(1)'],
          ['peek front', 'who is next?', 'O(1)'],
          ['isEmpty', 'anyone waiting?', 'O(1)'],
        ] },
      { h: 'Variants you will meet', kind: 'rules', items: [
        'Deque (double-ended queue): O(1) at BOTH ends — the sliding-window pattern in Module 7 depends on it.',
        'Circular buffer: a fixed array + two wrapping indexes (head % size, tail % size) — the % operator from Module 0 doing production work in every audio driver and network card.',
        'Priority queue: serves the most URGENT, not the oldest — that is a heap, Module 5.',
        'BFS (Module 3) is a queue-driven walk — the queue IS what makes it explore ring by ring.',
      ] },
    ],
    py: [
      { h: 'Python: deque, never list.pop(0)', kind: 'code', code: 'from collections import deque\nq = deque()\nq.append("Ada")       # enqueue — O(1)\nq.append("Bo")\nfirst = q[0]           # peek — O(1)\nserved = q.popleft()   # dequeue — O(1)  <- the whole point\n\n# The trap: list.pop(0) shifts every element — O(n) per serve,\n# O(n^2) to drain. queue.Queue is for threads, not algorithms.' },
    ],
    js: [
      { h: 'JavaScript: shift() is a trap — use an index', kind: 'code', code: 'const q = ["Ada", "Bo", "Cy"];\n// q.shift() works but moves every element: O(n) per serve.\n\n// O(1) amortized queue: never delete, just advance a pointer\nlet head = 0;\nconst enqueue = (x) => q.push(x);\nconst dequeue = () => q[head++];\n// (reclaim memory occasionally: if (head > 1000) { q.splice(0, head); head = 0; })' },
    ],
  },

  m2l7: {
    both: [
      { h: 'Hash map operations', kind: 'table',
        cols: ['operation', 'average', 'worst', 'note'],
        rows: [
          ['get(key)', 'O(1)', 'O(n)', 'worst = every key colliding; real hash functions make this astronomically unlikely'],
          ['set(key, v)', 'O(1)', 'O(n)', 'occasional O(n) resize, amortized away'],
          ['delete(key)', 'O(1)', 'O(n)', ''],
          ['contains key?', 'O(1)', 'O(n)', 'the duplicate-check superpower from m0l9'],
          ['iterate all', 'O(n)', 'O(n)', 'order: insertion order in Python 3.7+ and JS Map'],
          ['min/max/range', 'O(n)', 'O(n)', 'hashing destroys order — a BST gives you this instead'],
        ] },
    ],
    py: [
      { h: 'dict — the details that bite', kind: 'rules', items: [
        'Keys must be hashable: str, int, float, bool, tuple-of-hashables. A list or dict as a key raises TypeError — freeze it into a tuple first.',
        'd[k] on a missing key raises KeyError; d.get(k) returns None; d.get(k, default) returns your fallback; d.setdefault(k, []).append(x) builds grouped lists in one line.',
        'Insertion order is GUARANTEED (Python 3.7+) — iterating a dict replays the story of how it was built.',
        'set is a dict without values: `x in s` is the same O(1) machinery. collections.Counter and defaultdict are dicts with superpowers.',
        'Since strings hash randomly per process (security), never rely on hash(x) being stable across runs.',
      ] },
      { h: 'See it yourself', kind: 'code', code: 'ages = {"ada": 36, "bo": 7}\nprint(ages.get("cy"))            # None — no crash\nages.setdefault("cy", 0)          # insert-if-missing\nprint("ada" in ages)              # True — O(1)\n\nfrom collections import Counter\nprint(Counter("mississippi").most_common(2))  # [(\'i\', 4), (\'s\', 4)]' },
    ],
    js: [
      { h: 'Map vs plain object — pick right', kind: 'table',
        cols: ['aspect', 'plain object {}', 'Map'],
        rows: [
          ['key types', 'strings & symbols only (numbers coerce to strings!)', 'ANY value — objects, numbers, NaN'],
          ['size', 'Object.keys(o).length — O(n)', 'm.size — O(1)'],
          ['iteration order', 'integer-like keys first, then insertion', 'pure insertion order'],
          ['prototype traps', '"constructor" in o is TRUE', 'no inherited keys — clean'],
          ['use when', 'fixed, known string fields (records)', 'dynamic keys, frequent add/delete (dictionaries)'],
        ] },
      { h: 'See it yourself', kind: 'code', code: 'const m = new Map();\nm.set("ada", 36).set("bo", 7);\nconsole.log(m.get("cy"));        // undefined — no crash\nconsole.log(m.has("ada"));       // true — O(1)\nconsole.log(m.size);              // 2\n\nconst s = new Set([1, 2, 2, 3]);\nconsole.log(s.size);              // 3 — the duplicate vanished' },
    ],
  },

  m2l8: {
    both: [
      { h: 'The two collision strategies', kind: 'table',
        cols: ['strategy', 'idea', 'delete', 'memory', 'used by'],
        rows: [
          ['separate chaining', 'each bucket holds a little list; colliders line up in it', 'easy — unlink from the chain', 'pointers per entry', 'Java HashMap, C++ unordered_map'],
          ['open addressing', 'bucket taken? probe another slot in a fixed pattern', 'tricky — needs tombstones', 'one flat array, cache-friendly', 'CPython dict, V8, Rust HashMap'],
        ] },
      { h: 'Load factor — the crowding dial', kind: 'text',
        text: 'load factor = entries / buckets. Low: wasted space but rare collisions. High: compact but chains grow and O(1) rots toward O(n). Every real implementation picks a threshold and RESIZES past it, rehashing every key into a bigger table — an O(n) event amortized across the inserts that caused it. This is the dynamic-array growth story again, wearing a hash.' },
    ],
    py: [
      { h: 'CPython dict internals', kind: 'rules', items: [
        'Open addressing with a pseudo-random probe sequence (perturb): a collision does not check the NEXT slot — it jumps in a pattern derived from the full hash, dodging pile-ups.',
        'Resizes when 2/3 full — the table you pay for is always ≥1.5× your entries.',
        'Small ints hash to themselves: hash(42) == 42. Strings use SipHash, randomized per process.',
        'Two objects that compare equal MUST hash equal — that is why you always override __hash__ together with __eq__.',
        'A malicious set of all-colliding keys turns a dict into an O(n²) denial-of-service — the reason string hashing is randomized (a real 2011 attack on web frameworks).',
      ] },
    ],
    js: [
      { h: 'V8 internals', kind: 'rules', items: [
        'Map/Set use a flat table with deterministic probing plus an insertion-order backbone — iteration order is part of the JS spec, so the structure carries both a hash index and an ordered list.',
        'Plain objects with many dynamic keys flip into "dictionary mode" — a real hash table, dropping the hidden-class fast path. Another reason Map is the right tool for dynamic keys.',
        'Object keys that look like array indexes ("0", "7") are stored in a separate elements table and iterate FIRST — the classic "my keys reordered themselves" surprise.',
        'You cannot override hashing/equality for Map keys: two different objects are always different keys, even with identical contents. Serialize to a string key if you need value-equality.',
      ] },
    ],
  },

  m2l9: {
    both: [
      { h: 'BST operations — balanced vs neglected', kind: 'table',
        cols: ['operation', 'balanced', 'degenerate (sorted inserts)', 'note'],
        rows: [
          ['search', 'O(log n)', 'O(n)', 'the tree became a linked list in disguise'],
          ['insert', 'O(log n)', 'O(n)', 'same walk as search, plus one link'],
          ['delete', 'O(log n)', 'O(n)', '3 cases: leaf, one child, two children (swap with in-order successor)'],
          ['min / max', 'O(log n)', 'O(n)', 'walk all the way left / right'],
          ['in-order walk', 'O(n)', 'O(n)', 'visits every value IN SORTED ORDER — the party trick hashes cannot do'],
          ['range query [a, b]', 'O(log n + k)', 'O(n)', 'k = matches returned; the reason databases use trees'],
        ] },
      { h: 'Tree vocabulary you now own', kind: 'rules', items: [
        'root (the top), leaf (no children), height (longest root→leaf path), depth of a node (distance from root), subtree (any node and everything under it).',
        'BST invariant: EVERYTHING in the left subtree is smaller, EVERYTHING right is bigger — recursively, not just the immediate children.',
        'A BST\'s power is the invariant, and its weakness is neglect: feed it sorted input and it degenerates. Self-balancing trees (AVL — Module 5) rotate to prevent this.',
        'In-order = left, node, right. Pre-order copies trees; post-order deletes them; level-order is BFS with a queue.',
      ] },
    ],
    py: [
      { h: 'Python specifics', kind: 'rules', items: [
        'No built-in BST. The standard-library answer to "sorted + fast" is bisect on a sorted list (O(log n) find, O(n) insert) or heapq for priority access (Module 5).',
        'The de-facto third-party answer is sortedcontainers.SortedList — O(log n) everything, no tree in sight (it is clever chunked lists).',
        'Nodes here are dicts {v, left, right} to match the exercise; a real implementation would be a class with insert/search methods.',
      ] },
    ],
    js: [
      { h: 'JavaScript specifics', kind: 'rules', items: [
        'No built-in BST either — Map is insertion-ordered, not sorted. Range queries mean a library or your own tree.',
        'Nodes as {v, left, right} object literals mirror the exercise; null is the conventional empty tree.',
        'V8\'s own object property tables and the TypeScript compiler\'s symbol tables use trees/tries internally — you meet trees every time you use the tools.',
      ] },
    ],
  },

  m2l10: {
    both: [
      { h: 'The two representations', kind: 'table',
        cols: ['aspect', 'adjacency LIST', 'adjacency MATRIX'],
        rows: [
          ['memory', 'O(V + E) — only real friendships stored', 'O(V²) — every possible pair, mostly zeros'],
          ['edge lookup u—v?', 'O(degree(u))', 'O(1) — matrix[u][v]'],
          ['list all neighbours of u', 'O(degree(u)) — already a list', 'O(V) — scan the whole row'],
          ['add edge', 'O(1)', 'O(1)'],
          ['best for', 'sparse graphs (almost all real ones)', 'dense graphs, or O(1) edge tests'],
        ] },
      { h: 'Graph vocabulary you now own', kind: 'rules', items: [
        'directed vs undirected (one-way vs mutual), weighted (edges carry costs — Module 6 lives here), degree (edge count at a node).',
        'path (walk along edges), cycle (a path back to where you started), connected (everyone reachable from everyone).',
        'A tree is exactly the special case: connected, acyclic, one designated root — every tree is a graph, not every graph is a tree.',
        'Facebook friendships: undirected. Twitter follows: directed. Flight prices: directed AND weighted. Your codebase\'s imports: directed, and you pray acyclic.',
      ] },
    ],
    py: [
      { h: 'Python: dict of lists', kind: 'code', code: 'graph = {\n    "A": ["B", "C"],\n    "B": ["A", "D"],\n    "C": ["A"],\n    "D": ["B"],\n}\nprint(len(graph["A"]))          # degree of A — O(1) lookup + O(1) len\nprint("D" in graph["B"])        # edge test — O(degree)\n\n# weighted variant: dict of dicts\ncosts = {"A": {"B": 5, "C": 2}}\nprint(costs["A"]["C"])           # 2 — O(1) edge lookup, list AND matrix perks' },
    ],
    js: [
      { h: 'JavaScript: Map of arrays', kind: 'code', code: 'const graph = new Map([\n  ["A", ["B", "C"]],\n  ["B", ["A", "D"]],\n  ["C", ["A"]],\n  ["D", ["B"]],\n]);\nconsole.log(graph.get("A").length);        // degree of A\nconsole.log(graph.get("B").includes("D")); // edge test — O(degree)\n\n// weighted variant: Map of Maps\nconst costs = new Map([["A", new Map([["B", 5], ["C", 2]])]]);\nconsole.log(costs.get("A").get("C"));       // 2' },
    ],
  },
};
