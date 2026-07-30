// Visualizers for Modules 5–8. Same frame contract as visualizers.js.
export const VIZ_OF_ADV = {
  m5l1: 'heaptree', m5l2: 'heapbars', m5l3: 'trie', m5l4: 'dsu', m5l5: 'segtree',
  m5l6: 'fenwick', m5l7: 'avl', m5l8: 'probe', m5l9: 'lru', m5l10: 'bloom',
  m6l1: 'wgraph', m6l2: 'dijkstra', m6l3: 'bellman', m6l4: 'floyd', m6l5: 'toposort',
  m6l6: 'kruskal', m6l7: 'prim', m6l8: 'astar', m6l9: 'scc', m6l10: 'maxflow',
  m7l1: 'twoptr', m7l2: 'window', m7l3: 'prefix', m7l4: 'bsanswer', m7l5: 'backtrack',
  m7l6: 'greedy', m7l7: 'divconq', m7l8: 'bits', m7l9: 'kmp', m7l10: 'sweep',
  m8l1: 'memo', m8l2: 'dp1d', m8l3: 'knapsack', m8l4: 'coins', m8l5: 'lcs',
  m8l6: 'edit', m8l7: 'lis', m8l8: 'griddp', m8l9: 'treedp', m8l10: 'bitmask'
};
export const FAMILY_ADV = {
  heaptree: 'graph', heapbars: 'bars', trie: 'graph', dsu: 'graph', segtree: 'graph',
  fenwick: 'cells', avl: 'graph', probe: 'cells', lru: 'nodes', bloom: 'cells',
  wgraph: 'graph', dijkstra: 'graph', bellman: 'matrix', floyd: 'matrix', toposort: 'graph',
  kruskal: 'graph', prim: 'graph', astar: 'matrix', scc: 'graph', maxflow: 'graph',
  twoptr: 'cells', window: 'cells', prefix: 'cells', bsanswer: 'cells', backtrack: 'graph',
  greedy: 'matrix', divconq: 'bars', bits: 'cells', kmp: 'matrix', sweep: 'matrix',
  memo: 'graph', dp1d: 'cells', knapsack: 'matrix', coins: 'matrix', lcs: 'matrix',
  edit: 'matrix', lis: 'cells', griddp: 'matrix', treedp: 'graph', bitmask: 'matrix'
};
export const TITLE_ADV = {
  heaptree: 'The heap as a tree', heapbars: 'Bottom-up build, then sort', trie: 'Walking the letters',
  dsu: 'Merging the forest', segtree: 'The pyramid of sums', fenwick: 'Stripping the lowest bit',
  avl: 'Rotating a leaning tree', probe: 'Probing for a free slot', lru: 'Promote and evict',
  bloom: 'Bits, not items', wgraph: 'Roads with costs', dijkstra: "Dijkstra's frontier",
  bellman: 'Relaxing every edge, round by round', floyd: 'Every pair, via every waypoint',
  toposort: 'Peeling off in-degree zero', kruskal: 'Cheapest edge that does not cycle',
  prim: 'Growing one blob', astar: 'Dijkstra with a compass', scc: 'Finding the loops',
  maxflow: 'Pushing flow, finding the cut', twoptr: 'Two fingers closing in',
  window: 'The window slides', prefix: 'Running totals', bsanswer: 'Binary searching the answer',
  backtrack: 'The decision tree, pruned', greedy: 'Greedy vs optimal', divconq: 'Split, solve, combine',
  bits: 'Switches in a byte', kmp: 'Falling back inside the pattern', sweep: 'Sweeping the timeline',
  memo: 'The call tree collapses', dp1d: 'Filling one row', knapsack: 'Take it or skip it',
  coins: 'Building every amount', lcs: 'Where two strings agree', edit: 'Three ways to fix a letter',
  lis: 'Patience piles', griddp: 'Paths through the grid', treedp: 'Answers flowing upward',
  bitmask: 'The set as one number'
};

const P = (q, a, b, t) => ({ q, a, b, t });

// ── shared frame helpers ────────────────────────────────────────────────────
const cellsF = (cells, msg, caption, predict) => ({ cells, msg, caption, predict });
const matF = (cols, rows, msg, caption, predict) => ({ cols, rows, msg, caption, predict });
const graphF = (g, visited, cur, front, msg, caption, predict) => ({ g, visited, cur, front, order: visited, msg, caption, predict });
const barF = (arr, hi, act, lock, msg, predict, pivot) => ({ arr, hi: hi || [], act: !!act, lock: lock || [], pivot: pivot == null ? null : pivot, msg, predict });
const nodeF = (nodes, hi, msg, caption, predict) => ({ nodes, hi: hi || [], back: false, msg, caption, predict });

// grid layout for a binary tree stored as an array
const heapLayout = (a) => {
  const nodes = [], W = 620, levels = Math.floor(Math.log2(a.length)) + 1;
  a.forEach((v, i) => {
    const lvl = Math.floor(Math.log2(i + 1));
    const idxInLvl = i + 1 - (1 << lvl);
    const count = 1 << lvl;
    const x = 20 + ((idxInLvl + 0.5) / count) * W;
    const y = 34 + lvl * (232 / Math.max(1, levels - 1 || 1));
    nodes.push([String(v), Math.round(x), Math.round(y)]);
  });
  const adj = {};
  a.forEach((v, i) => {
    adj[String(v)] = [];
    [2 * i + 1, 2 * i + 2].forEach(c => { if (c < a.length) adj[String(v)].push(String(a[c])); });
  });
  return { nodes, adj };
};

// ── MODULE 5 ────────────────────────────────────────────────────────────────
function heaptree() {
  const F = [];
  let a = [1, 3, 2, 7, 5, 8, 4];
  const g = () => heapLayout(a);
  F.push(graphF(g(), [], null, [], 'A min-heap drawn as a tree. It lives in a flat array — children of index i are at 2i+1 and 2i+2, so no pointers exist at all.', 'array: [' + a.join(', ') + ']'));
  F.push(graphF(g(), ['1'], '1', [], 'The only promise is local: every parent is smaller than its children. The root is therefore the global minimum — peek is O(1).', 'root = 1 = minimum',
    P('Is the underlying array sorted?', 'Yes', 'No', false)));
  F.push(graphF(g(), ['1', '3', '2'], null, ['3', '2'], 'Notice 3 sits left of 2 even though 3 > 2. Heap order is NOT sorted order — that weaker invariant is exactly what makes operations cheap.', 'heap order != sorted order'));
  F.push(graphF(g(), [], null, ['0'], 'Push 0. It goes into the next free array slot — the bottom right — then sifts UP while it is smaller than its parent.', 'push(0): place at the end'));
  a = [1, 3, 2, 7, 5, 8, 4, 0];
  F.push(graphF(heapLayout(a), [], '0', ['7'], '0 < 7, so they swap. One level up.', 'swap 0 and 7',
    P('Will 0 keep rising all the way to the root?', 'Yes', 'No', true)));
  a = [1, 0, 2, 3, 5, 8, 4, 7];
  F.push(graphF(heapLayout(a), [], '0', ['1'], '0 < 3, swap again. Only ONE root-to-leaf path is ever touched — that is the log n.', 'swap 0 and 3'));
  a = [0, 1, 2, 3, 5, 8, 4, 7];
  F.push(graphF(heapLayout(a), ['0'], '0', [], '0 < 1, swap once more and it is the root. Three swaps for eight elements — O(log n).', 'push complete: 3 swaps'));
  F.push(graphF(heapLayout(a), ['0'], '0', [], 'pop() removes the root, moves the LAST element into its place, then sifts DOWN. Same path length, same O(log n).', 'pop(): root out, last element in',
    P('Could you find the LARGEST element quickly in this min-heap?', 'Yes', 'No', false)));
  F.push(graphF(heapLayout(a), [], null, [], 'You could not — the maximum is somewhere among the leaves and finding it is O(n). A heap answers exactly one question fast, and that focus is the trade.', 'search / arbitrary delete: O(n)'));
  return F;
}
function heapbars() {
  const F = [];
  const a = [5, 3, 8, 1, 9, 2, 7, 4];
  F.push(barF(a.slice(), [], false, [], 'Eight values. We will build a heap bottom-up, then sort with it.', P('Is building a heap by n pushes O(n) or O(n log n)?', 'O(n)', 'O(n log n)', false)));
  F.push(barF(a.slice(), [], false, [], 'n pushes would be O(n log n). Bottom-up heapify is O(n): most nodes are near the leaves and barely sift at all.'));
  const h = a.slice();
  const sift = (arr, i, n) => {
    while (true) {
      let m = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && arr[l] < arr[m]) m = l;
      if (r < n && arr[r] < arr[m]) m = r;
      if (m === i) break;
      [arr[i], arr[m]] = [arr[m], arr[i]]; i = m;
    }
  };
  for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
    F.push(barF(h.slice(), [i], false, [], `Sift down from index ${i}. Nodes this low move at most a level or two — that is why the total is O(n), not O(n log n).`));
    sift(h, i, h.length);
    F.push(barF(h.slice(), [i], true, [], `Index ${i} now satisfies the heap property with its children.`));
  }
  F.push(barF(h.slice(), [0], true, [], `Heap built in O(n). Index 0 holds the minimum — but the array is NOT sorted.`,
    P('Is the array sorted now?', 'Yes', 'No', false)));
  const lock = [];
  for (let n = h.length - 1; n > 0; n--) {
    [h[0], h[n]] = [h[n], h[0]];
    lock.push(n);
    F.push(barF(h.slice(), [0, n], true, lock.slice(), `Swap the minimum to position ${n} and shrink the heap. That position is now final.`));
    sift(h, 0, n);
    F.push(barF(h.slice(), [0], false, lock.slice(), `Sift the new root down. O(log n) per extraction, n extractions — O(n log n) guaranteed, with O(1) extra space.`));
  }
  F.push(barF(h.slice(), [], false, h.map((_, i) => i), 'Heapsort done: guaranteed O(n log n), fully in place, no recursion. Its only weakness is cache behaviour, which is why quicksort usually wins wall-clock.'));
  return F;
}
function trie() {
  const F = [];
  const g = {
    nodes: [['·', 60, 150], ['c', 160, 90], ['a', 260, 90], ['r', 360, 60], ['t', 460, 60], ['n', 360, 130], ['d', 160, 220], ['o', 260, 220], ['g', 360, 220]],
    adj: { '·': ['c', 'd'], c: ['a'], a: ['r', 'n'], r: ['t'], t: [], n: [], d: ['o'], o: ['g'], g: [] }
  };
  F.push(graphF(g, [], null, [], 'A trie holding car, cart, can and dog. Each edge is one letter; the root holds nothing.', 'stored: car, cart, can, dog'));
  F.push(graphF(g, ['·', 'c'], 'c', ['a'], 'Look up "cart": step through c…', 'matched: c'));
  F.push(graphF(g, ['·', 'c', 'a'], 'a', ['r', 'n'], '…then a. Notice car, cart and can all shared these two nodes — the prefix is stored exactly once.', 'matched: ca — shared by 3 words',
    P('Does lookup cost depend on how many words the trie holds?', 'Yes', 'No', false)));
  F.push(graphF(g, ['·', 'c', 'a', 'r'], 'r', ['t'], 'r — and this node is itself a complete word ("car"), which is why nodes need an is_word flag, not just children.', 'matched: car (is_word = True)'));
  F.push(graphF(g, ['·', 'c', 'a', 'r', 't'], 't', [], 't. Found "cart" in four steps — O(length of key), completely independent of the 4 or 4 million words stored.', 'found: cart in 4 steps'));
  F.push(graphF(g, ['·', 'c', 'a'], 'a', ['r', 'n'], 'Now the thing a hash map cannot do: stand at "ca" and every word reachable below you starts with "ca". Autocomplete for free.', 'prefix "ca" -> car, cart, can',
    P('Could a hash map answer "all keys starting with ca" without scanning everything?', 'Yes', 'No', false)));
  F.push(graphF(g, ['·', 'c', 'a', 'r', 't', 'n'], null, [], 'That is the real reason to choose a trie: not speed, but that prefixes are structural. The cost is memory — one node per character, which is why production versions compress single-child chains.', 'subtree = all completions'));
  return F;
}
function dsu() {
  const F = [];
  const pos = [['A', 80, 60], ['B', 200, 60], ['C', 320, 60], ['D', 440, 60], ['E', 560, 60]];
  const mk = (adj) => ({ nodes: pos, adj });
  let adj = { A: [], B: [], C: [], D: [], E: [] };
  F.push(graphF(mk(adj), [], null, [], 'Five people, five separate groups. Everyone is their own leader.', 'components: 5',
    P('Are A and C connected?', 'Yes', 'No', false)));
  adj = { A: ['B'], B: [], C: [], D: [], E: [] };
  F.push(graphF(mk(adj), ['A', 'B'], 'A', [], 'union(A, B): B now points at A. A is the representative of the merged group.', 'components: 4 — {A,B} {C} {D} {E}'));
  adj = { A: ['B'], B: [], C: ['D'], D: [], E: [] };
  F.push(graphF(mk(adj), ['C', 'D'], 'C', [], 'union(C, D): a second group forms. DSU is a FOREST — many small trees, each with its own root.', 'components: 3'));
  adj = { A: ['B', 'C'], B: [], C: ['D'], D: [], E: [] };
  F.push(graphF(mk(adj), ['A', 'B', 'C', 'D'], 'A', [], 'union(B, D): find(B) is A, find(D) is C, so the smaller tree attaches under the bigger. That is union by size, and it keeps depth low.', 'components: 2 — {A,B,C,D} {E}',
    P('Now: are A and D connected?', 'Yes', 'No', true)));
  F.push(graphF(mk(adj), ['D', 'C', 'A'], 'D', [], 'find(D) walks D → C → A. Two hops. On the way, path compression re-points every node visited straight at the root.', 'find(D): D -> C -> A'));
  adj = { A: ['B', 'C', 'D'], B: [], C: [], D: [], E: [] };
  F.push(graphF(mk(adj), ['A', 'B', 'C', 'D'], 'A', [], 'Compressed. D now points directly at A, so the next find(D) is a single hop. Repeated queries flatten the tree almost completely.', 'after compression: depth 1'));
  F.push(graphF(mk(adj), ['A', 'B'], 'A', [], 'union(A, B) again returns False — same root, already connected. That single check IS cycle detection, and it is the whole of Kruskal.', 'union(A,B) -> False -> would form a cycle',
    P('Can DSU tell you the PATH between A and D?', 'Yes', 'No', false)));
  F.push(graphF(mk(adj), [], null, [], 'It cannot — it only answers "same set?". With both optimisations the amortised cost is O(α(n)), below 5 for any n you will ever meet: effectively constant.', 'amortised O(alpha(n)) ~ O(1)'));
  return F;
}
function segtree() {
  const F = [];
  const a = [3, 1, 4, 1, 5, 9];
  const build = (hl) => {
    const nodes = [['26', 320, 30], ['8', 170, 110], ['18', 470, 110], ['4', 90, 190], ['4', 250, 190], ['14', 400, 190], ['9', 545, 190], ['3', 50, 262], ['1', 130, 262], ['4', 210, 262], ['1', 290, 262], ['5', 370, 262], ['9', 440, 262]];
    const adj = { '26': ['8', '18'], '8': ['4', '4'], '18': ['14', '9'], '4': ['3', '1'], '14': ['5', '9'], '9': [], '3': [], '1': [], '5': [] };
    void hl; return { nodes, adj };
  };
  const g = build();
  F.push(graphF(g, [], null, [], `The array [${a.join(', ')}] with a pyramid of sums above it. Each node stores the total of the range it covers.`, 'leaves = the array, root = total 26'));
  F.push(graphF(g, ['26'], '26', [], 'The root covers everything: 3+1+4+1+5+9 = 26. Any range query will be assembled from a handful of these pre-computed blocks.', 'root covers [0..5] = 26',
    P('Would you ever need to visit all 6 leaves to answer a range sum?', 'Yes', 'No', false)));
  F.push(graphF(g, ['26', '8'], '8', ['18'], 'Query sum(1..4). Start at the root and descend: the left child covers [0..2], which only partially overlaps.', 'query [1..4]: partial overlap, descend'));
  F.push(graphF(g, ['8', '4'], '4', [], 'Node covering [1..2] = 1+4 = 5 is FULLY inside [1..4]. Take it whole and stop descending — that is the pruning.', 'take [1..2] = 5, stop here'));
  F.push(graphF(g, ['18', '14'], '14', [], 'On the right, [3..4] = 1+5 = 6 is fully inside too. Take it whole.', 'take [3..4] = 6'));
  F.push(graphF(g, ['4', '14'], null, [], 'Answer = 5 + 6 = 11, from two pre-computed nodes instead of four leaves. Any range decomposes into at most O(log n) such nodes.', 'sum(1..4) = 11 from 2 nodes'));
  F.push(graphF(g, ['4', '8', '26'], '4', [], 'Now update a[2] = 10. Only the nodes on the path from that leaf to the root are affected — three updates, not six.', 'update a[2]: leaf -> root path only',
    P('If the array never changed, would you still need this tree?', 'Yes', 'No', false)));
  F.push(graphF(g, [], null, [], 'No — a static array only needs prefix sums, which answer any range in one subtraction. Segment trees earn their 4n memory only when updates are live.', 'query O(log n), update O(log n)'));
  return F;
}
function fenwick() {
  const F = [];
  const a = [3, 1, 4, 1, 5, 9, 2, 6];
  const tree = [0, 3, 4, 4, 9, 5, 14, 2, 31];
  const build = (hi, dim) => tree.slice(1).map((v, i) => ({
    v, i: i + 1, tag: hi.indexOf(i + 1) >= 0 ? 'ADD' : '',
    s: hi.indexOf(i + 1) >= 0 ? 'hot' : dim ? 'off' : 'in'
  }));
  F.push(cellsF(build([], false), `Original array [${a.join(', ')}]. The Fenwick tree stores, at index i, the sum of the last (i & -i) elements ending at i.`, 'tree[i] covers (i & -i) elements'));
  F.push(cellsF(build([8], true), 'Index 8 in binary is 1000, so i & -i = 8 — tree[8] holds the sum of all eight elements: 31.', 'tree[8] = sum of 8 elements = 31',
    P('Does tree[7] also cover 8 elements?', 'Yes', 'No', false)));
  F.push(cellsF(build([7], true), '7 is 0111, so i & -i = 1 — tree[7] covers just one element. Block size is decided entirely by the lowest set bit.', 'tree[7] = 1 element = 2'));
  F.push(cellsF(build([], false), 'Now prefix(6): the sum of the first six elements, assembled by repeatedly stripping the lowest set bit off the index.', 'prefix(6): 6 = 110'));
  F.push(cellsF(build([6], true), '6 = 110. Take tree[6] = 14 (covering elements 5 and 6). Then 6 − (6 & −6) = 6 − 2 = 4.', 'take tree[6] = 14, jump to 4'));
  F.push(cellsF(build([6, 4], true), '4 = 100. Take tree[4] = 9 (covering elements 1..4). Then 4 − 4 = 0, so we stop.', 'take tree[4] = 9, jump to 0'));
  F.push(cellsF(build([6, 4], true), 'prefix(6) = 14 + 9 = 23, from two lookups instead of six additions. That is O(log n) with a single n-length array.', 'prefix(6) = 23 in 2 steps',
    P('Could this same structure answer range MINIMUM queries?', 'Yes', 'No', false)));
  F.push(cellsF(build([], false), 'No — Fenwick works by SUBTRACTING prefixes, so the operation must be invertible. Sums and XOR are; min is not, and that is what forces a segment tree.', 'needs an invertible operation'));
  return F;
}
function avl() {
  const F = [];
  const chain = { nodes: [['10', 150, 50], ['20', 250, 130], ['30', 350, 210]], adj: { '10': ['20'], '20': ['30'], '30': [] } };
  const bal = { nodes: [['20', 320, 60], ['10', 200, 180], ['30', 440, 180]], adj: { '20': ['10', '30'], '10': [], '30': [] } };
  F.push(graphF({ nodes: [['10', 150, 50]], adj: { '10': [] } }, ['10'], '10', [], 'Insert 10, 20, 30 in increasing order into a plain BST. Watch the shape.', 'inserted: 10'));
  F.push(graphF({ nodes: [['10', 150, 50], ['20', 250, 130]], adj: { '10': ['20'], '20': [] } }, ['10', '20'], '20', [], '20 > 10, so it goes right. Still fine.', 'height 2'));
  F.push(graphF(chain, ['10', '20', '30'], '30', [], '30 goes right again. This is not a tree any more — it is a linked list wearing a tree costume, and search is now O(n).', 'height 3, balance factor at 10 = -2',
    P('Is sorted input the BEST or WORST case for an unbalanced BST?', 'Best', 'Worst', false)));
  F.push(graphF(chain, ['10'], '10', ['20'], 'The AVL invariant is violated: node 10 has a balance factor of −2. Trigger a left rotation around 10.', 'abs(balance) > 1 -> rotate'));
  F.push(graphF(bal, ['20', '10', '30'], '20', [], 'Rotated. 20 becomes the root, 10 and 30 its children. Height dropped from 3 to 2 in constant time.', 'rotation is O(1)'));
  F.push(graphF(bal, ['10', '20', '30'], null, [], 'Critically, the in-order walk is still 10, 20, 30 — a rotation changes SHAPE but never ORDER. That invariant is what makes it a legal operation.', 'in-order: 10, 20, 30 — unchanged',
    P('Did the rotation change the sorted order of the elements?', 'Yes', 'No', false)));
  F.push(graphF(bal, [], null, [], 'AVL keeps heights within 1 (faster reads, more rotations). Red-black allows looser balance (fewer rotations, better writes) — which is why standard libraries use it. B-trees take the same idea to disk pages.', 'AVL: reads. Red-black: writes. B-tree: disk.'));
  return F;
}
function probe() {
  const F = [];
  const N = 8;
  const slots = new Array(N).fill(null);
  const draw = (hi) => slots.map((v, i) => ({
    v: v === 'TOMB' ? '×' : (v || ''), i,
    tag: i === hi ? 'PROBE' : '',
    s: i === hi ? 'hot' : v === 'TOMB' ? 'off' : v ? 'in' : ''
  }));
  F.push(cellsF(draw(-1), `${N} slots. Open addressing stores entries directly in the table — no chains, no pointers, everything in one cache-friendly block.`, 'load factor 0.00'));
  slots[3] = 'cat';
  F.push(cellsF(draw(3), 'hash("cat") = 3. Slot 3 is free, so "cat" sits there.', 'load factor 0.13'));
  F.push(cellsF(draw(3), 'Now insert "act" — an anagram, so with a character-sum hash it also maps to 3. Occupied.', 'hash("act") = 3 — collision',
    P('Does open addressing chain a list at slot 3?', 'Yes', 'No', false)));
  F.push(cellsF(draw(4), 'No chain. Linear probing walks to the next slot: 4. Free, so "act" goes there.', 'probe 3 -> 4'));
  slots[4] = 'act';
  F.push(cellsF(draw(4), '"act" stored at 4. Everything stays in one contiguous block, which is why this is faster than chaining despite the probing.', 'load factor 0.25'));
  F.push(cellsF(draw(3), 'Now delete "cat" from slot 3. If we simply empty it…', 'delete("cat")',
    P('Is it safe to just clear slot 3?', 'Yes', 'No', false)));
  slots[3] = 'TOMB';
  F.push(cellsF(draw(3), '…a later lookup for "act" would hash to 3, find it empty, and conclude "act" is absent — even though it sits at slot 4. So we write a TOMBSTONE: "keep looking".', 'slot 3 = tombstone, not empty'));
  F.push(cellsF(draw(4), 'Now find("act") hashes to 3, sees the tombstone, continues to 4, and finds it. The probe chain stayed walkable.', 'find("act"): 3 (tomb) -> 4 (hit)'));
  ['dog', 'bird', 'sun', 'fox'].forEach((k, n) => { slots[(5 + n) % N] = k; });
  F.push(cellsF(draw(-1), 'Tombstones accumulate and clusters grow. Past a load factor of about 0.7 probe sequences lengthen sharply, so the table resizes and rehashes everything — clearing the tombstones as a side effect.', 'load factor 0.75 -> resize',
    P('Can you safely mutate an object AFTER using it as a dict key?', 'Yes', 'No', false)));
  F.push(cellsF(draw(-1), 'Never. Its hash changes, so it now maps to a different slot and becomes invisible in the table. That is why Python forbids list keys and why dataclasses need frozen=True.', 'mutating a key = losing the entry'));
  return F;
}
function lru() {
  const F = [];
  const cap = 4;
  let list = [];
  const snap = (hi, msg, caption, predict) => F.push(nodeF(list.slice(), hi, msg, caption, predict));
  snap([], 'An LRU cache of capacity 4. The list is ordered most-recently-used first; a hash map (not drawn) points straight at each node.', 'empty — capacity 4');
  ['A', 'B', 'C', 'D'].forEach(k => {
    list.unshift(k);
    snap([0], `put("${k}") — inserted at the head, because it is the newest thing we have touched.`, `MRU -> ${list.join(' ')} <- LRU`);
  });
  snap([3], 'Full. The tail, A, is the least recently used — it is next to be evicted.', 'tail A is the eviction candidate',
    P('If we now READ B, does B move?', 'Yes', 'No', true));
  list = ['B', 'D', 'C', 'A'];
  snap([0], 'get("B") is a hit, so B is promoted to the head. This is the step that needs prev pointers: we unlink B from the middle in O(1).', 'B promoted to MRU');
  F.push(nodeF(list.slice(), [1], 'A subtle point: unlinking from the middle requires knowing B\'s predecessor. A singly linked list would need an O(n) search to find it — which is exactly why the list must be DOUBLY linked.', 'doubly linked => O(1) unlink',
    P('Would a singly linked list work here?', 'Yes', 'No', false)));
  snap([3], 'Now put("E") with the cache full. The tail A is evicted, and E enters at the head.', 'evict tail A');
  list = ['E', 'B', 'D', 'C'];
  snap([0], 'E is in, A is gone. Hash map gives O(1) find, linked list gives O(1) reorder — neither structure could do both alone, which is why LRU is a composition.', 'MRU -> E B D C <- LRU');
  F.push(nodeF(list.slice(), [], 'The failure mode worth knowing: one large scan touches every key once and flushes your entire hot set. That is why real caches use LFU, ARC or segmented LRU.', 'LRU is defeated by scans'));
  return F;
}
function bloom() {
  const F = [];
  const M = 16;
  const bits = new Array(M).fill(0);
  const draw = (hi) => bits.map((b, i) => ({ v: b ? '1' : '0', i, tag: hi.indexOf(i) >= 0 ? 'SET' : '', s: hi.indexOf(i) >= 0 ? 'hot' : b ? 'in' : '' }));
  F.push(cellsF(draw([]), `${M} bits, all zero. This filter will store NO items at all — only traces of them.`, 'm = 16 bits, k = 3 hashes'));
  F.push(cellsF(draw([]), 'Add "cat". Three independent hash functions give three positions.', 'hash("cat") -> 2, 7, 11',
    P('Will the filter store the string "cat" anywhere?', 'Yes', 'No', false)));
  [2, 7, 11].forEach(i => { bits[i] = 1; });
  F.push(cellsF(draw([2, 7, 11]), 'Only three bits flipped. The string itself is never stored, which is why memory is a few bits per item regardless of item size.', '3 bits set, 0 items stored'));
  [5, 9, 14].forEach(i => { bits[i] = 1; });
  F.push(cellsF(draw([5, 9, 14]), 'Add "dog": three more bits.', '6 bits set'));
  F.push(cellsF(draw([2, 7, 11]), 'Query "cat": check bits 2, 7, 11. All set, so the answer is "probably present".', 'all 3 bits set -> PROBABLY present'));
  F.push(cellsF(draw([1]), 'Query "fox": bits 1, 6, 13. Bit 1 is zero.', 'bit 1 is clear',
    P('Can we be CERTAIN "fox" was never added?', 'Yes', 'No', true)));
  F.push(cellsF(draw([1]), 'Certain. If "fox" had been added, bit 1 would be set. A "no" from a Bloom filter is always trustworthy — false negatives are impossible.', 'DEFINITELY absent'));
  [0, 1, 3, 4, 6, 8, 10, 12, 13, 15].forEach(i => { bits[i] = 1; });
  F.push(cellsF(draw([]), 'Now add many more items. The bit array fills up.', 'load rising — most bits set'));
  F.push(cellsF(draw([1, 6, 13]), 'Query "fox" again: bits 1, 6, 13 are all set now — by OTHER items. The filter says "probably present" for something never added. That is a false positive.', 'FALSE POSITIVE',
    P('Is a Bloom filter safe for an authorisation check?', 'Yes', 'No', false)));
  F.push(cellsF(draw([]), 'Never where a false positive is unsafe. It is perfect as a cheap gatekeeper: "maybe" costs one wasted disk read, and "no" saves you the trip entirely.', 'k = (m/n) * ln2 minimises the error rate'));
  return F;
}

// ── MODULE 6 ────────────────────────────────────────────────────────────────
const WG = {
  nodes: [['A', 70, 150], ['B', 240, 60], ['C', 240, 240], ['D', 420, 60], ['E', 420, 240], ['F', 580, 150]],
  adj: { A: ['B', 'C'], B: ['C', 'D'], C: ['B', 'E'], D: ['E', 'F'], E: ['F'], F: [] },
  w: { 'A-B': 4, 'A-C': 2, 'B-C': 5, 'B-D': 10, 'C-E': 3, 'E-D': 4, 'D-F': 11, 'E-F': 5 }
};
const wlabel = (dist) => ({
  nodes: WG.nodes.map(([id, x, y]) => [dist && dist[id] != null ? `${id} ${dist[id]}` : `${id} ∞`, x, y]),
  adj: Object.fromEntries(Object.keys(WG.adj).map(k => [
    dist && dist[k] != null ? `${k} ${dist[k]}` : `${k} ∞`,
    WG.adj[k].map(v => dist && dist[v] != null ? `${v} ${dist[v]}` : `${v} ∞`)
  ]))
});
const lab = (id, dist) => dist && dist[id] != null ? `${id} ${dist[id]}` : `${id} ∞`;

function wgraph() {
  const F = [];
  const plain = { nodes: WG.nodes, adj: WG.adj };
  F.push(graphF(plain, [], null, [], 'Six towns, eight roads — and now the roads have lengths. A-C is 2, A-B is 4, B-D is 10.', 'weights: A-B 4, A-C 2, B-C 5, B-D 10, C-E 3, E-D 4, D-F 11, E-F 5'));
  F.push(graphF(plain, ['A', 'B', 'D', 'F'], null, ['A', 'B', 'D', 'F'], 'BFS from A to F finds the path with the FEWEST roads: A → B → D → F, three hops.', 'BFS path: A B D F — 3 edges',
    P('Is that also the cheapest path by total weight?', 'Yes', 'No', false)));
  F.push(graphF(plain, ['A', 'B', 'D', 'F'], 'F', [], 'Its total cost is 4 + 10 + 11 = 25. BFS optimised the wrong thing entirely.', 'A B D F costs 25'));
  F.push(graphF(plain, ['A', 'C', 'E', 'F'], 'F', [], 'The actual cheapest route is A → C → E → F: 2 + 3 + 5 = 10. Same number of hops, less than half the cost.', 'A C E F costs 10 — the real answer'));
  F.push(graphF(plain, [], null, [], 'So weights break BFS, and you need a new tool. Which tool depends on four questions: directed or not, weighted or not, any negative weights, single-source or all-pairs.', 'those 4 answers pick the algorithm',
    P('All weights are equal. Do you still need Dijkstra?', 'Yes', 'No', false)));
  F.push(graphF(plain, [], null, [], 'Equal weights means plain BFS is correct and simpler. Reach for Dijkstra only when weights actually differ — and never when any of them is negative.', 'adjacency list: O(V+E) — right for sparse'));
  return F;
}
function dijkstra() {
  const F = [];
  const dist = { A: 0 };
  const settled = [];
  const snap = (cur, front, msg, caption, predict) => F.push(graphF(wlabel(dist), settled.map(x => lab(x, dist)), cur ? lab(cur, dist) : null, front.map(x => lab(x, dist)), msg, caption, predict));
  snap(null, [], 'Every distance starts at infinity except the source A, which is 0. The heap holds candidates ordered by tentative distance.', 'heap: [(0, A)]');
  snap('A', ['B', 'C'], 'Pop A (distance 0) and settle it. Relax its edges: B becomes 0+4 = 4, C becomes 0+2 = 2.', 'relax A: B=4, C=2');
  dist.B = 4; dist.C = 2; settled.push('A');
  snap('A', ['C', 'B'], 'Both improved from infinity. The heap now holds (2, C) and (4, B).', 'heap: [(2,C), (4,B)]',
    P('Will C be settled before B?', 'Yes', 'No', true));
  snap('C', ['B', 'E'], 'Yes — always the closest unsettled vertex. Pop C at distance 2 and settle it. That greedy choice is the whole algorithm.', 'settle C at 2');
  settled.push('C');
  dist.E = 5;
  snap('C', ['B', 'E'], 'Relax C: E becomes 2+3 = 5. Also check C→B = 2+5 = 7, but B is already 4, so no improvement — we keep the better value.', 'E=5. B stays 4 (7 is worse)');
  settled.push('B');
  snap('B', ['E', 'D'], 'Settle B at 4. Relax B→D = 4+10 = 14.', 'settle B at 4, D=14');
  dist.D = 14;
  snap('B', ['E', 'D'], 'D is 14 for now — via a very expensive road.', 'D = 14 (tentative)',
    P('Could D still get cheaper later?', 'Yes', 'No', true));
  settled.push('E');
  snap('E', ['D', 'F'], 'Settle E at 5. Relax E→D = 5+4 = 9, which beats 14 — so D improves. This is exactly why tentative distances must stay revisable until settled.', 'D improves 14 -> 9');
  dist.D = 9; dist.F = 10;
  snap('E', ['F', 'D'], 'And E→F = 5+5 = 10. The heap now holds (9, D) and (10, F).', 'D=9, F=10');
  settled.push('F');
  snap('F', ['D'], 'Settle F at 10 — cheaper than D, so it comes out first. Once settled, a vertex can never improve again.', 'settle F at 10');
  settled.push('D');
  snap('D', [], 'Settle D at 9. Every vertex is done: A=0, C=2, B=4, E=5, D=9, F=10.', 'final: A0 C2 B4 E5 D9 F10',
    P('Add one edge of weight −3. Does Dijkstra still work?', 'Yes', 'No', false));
  snap(null, [], 'It does not. Settling the nearest vertex is only safe if nothing later can reduce it — and a negative edge destroys that guarantee. Dijkstra then returns a wrong answer with no error at all. Use Bellman-Ford.', 'O((V+E) log V), non-negative weights only');
  return F;
}
function bellman() {
  const F = [];
  const V = ['A', 'B', 'C', 'D', 'E'];
  const edges = [['A', 'B', 4], ['A', 'C', 2], ['C', 'B', -3], ['B', 'D', 3], ['C', 'D', 6], ['D', 'E', 2]];
  const INF = '∞';
  let d = { A: 0, B: INF, C: INF, D: INF, E: INF };
  const rows = (hot) => V.map(v => ({ label: v, cells: [{ t: String(d[v]), s: hot === v ? 'hot' : d[v] === INF ? 'off' : 'on' }] }));
  const snap = (hot, msg, caption, predict) => F.push(matF(['dist'], rows(hot), msg, caption, predict));
  snap(null, 'Bellman-Ford does not pick clever vertices. It relaxes EVERY edge, over and over. Note C→B has weight −3 — Dijkstra would be illegal here.', 'edges: A-B 4, A-C 2, C-B -3, B-D 3, C-D 6, D-E 2');
  snap(null, 'Round 1 begins. After round k, every shortest path using at most k edges is correct — that is the invariant.', 'round 1 of V-1 = 4',
    P('Does Bellman-Ford ever mark a vertex as final mid-run?', 'Yes', 'No', false));
  d = { A: 0, B: 4, C: 2, D: 7, E: 9 };
  snap('B', 'Round 1: A→B gives 4, A→C gives 2. Then C→B = 2 + (−3) = −1… but we process edges in list order, so B is 4 for now and will improve later. Nothing is ever declared final.', 'round 1: B=4, C=2, D=7, E=9');
  d = { A: 0, B: -1, C: 2, D: 7, E: 9 };
  snap('B', 'Round 2: now C→B fires — 2 + (−3) = −1, which beats 4. A negative edge just made a path cheaper, which is precisely what Dijkstra cannot handle.', 'round 2: B improves 4 -> -1',
    P('Will D improve now that B got cheaper?', 'Yes', 'No', true));
  d = { A: 0, B: -1, C: 2, D: 2, E: 4 };
  snap('D', 'Round 3: B→D = −1 + 3 = 2, beating 7. And D→E = 2 + 2 = 4, beating 9. Improvements ripple outward one edge per round.', 'round 3: D=2, E=4');
  snap(null, 'Round 4 changes nothing, so we can exit early — on typical graphs convergence happens long before V−1 rounds.', 'round 4: no change -> early exit');
  snap(null, 'Now the extra V-th round: if ANY distance still improves, a negative CYCLE is reachable and no shortest path exists. That detection is often the real reason to choose Bellman-Ford.', 'extra round: no change -> no negative cycle',
    P('Currency arbitrage: would a negative cycle here mean free money?', 'Yes', 'No', true));
  snap(null, 'Exactly — take −log of each exchange rate and a negative cycle is a profitable loop. O(V·E) is slower than Dijkstra, but it handles negatives and finds cycles.', 'O(V*E), handles negative weights');
  return F;
}
function floyd() {
  const F = [];
  const V = ['A', 'B', 'C', 'D'];
  const I = '∞';
  let m = [[0, 3, I, 7], [8, 0, 2, I], [5, I, 0, 1], [2, I, I, 0]];
  const rows = (hotR, hotC, k) => V.map((v, i) => ({
    label: v, cells: m[i].map((val, j) => ({
      t: String(val),
      s: (i === hotR && j === hotC) ? 'hot' : (k != null && (i === k || j === k)) ? 'on' : val === I ? 'off' : ''
    }))
  }));
  const snap = (hr, hc, k, msg, caption, predict) => F.push(matF(V, rows(hr, hc, k), msg, caption, predict));
  snap(null, null, null, 'A 4×4 distance matrix. Direct edges only so far — infinity means no direct road.', 'dist[i][j] = direct edge, or infinity');
  snap(null, null, 0, 'Consider A as a waypoint. For EVERY pair, ask: is going via A cheaper than what I already know?', 'k = A: try every pair via A',
    P('Must k be the OUTERMOST loop?', 'Yes', 'No', true));
  m = [[0, 3, I, 7], [8, 0, 2, 15], [5, 8, 0, 1], [2, 5, I, 0]];
  snap(1, 3, 0, 'B→D was infinity. Via A: B→A is 8, A→D is 7, total 15. Better than infinity, so record 15.', 'dist[B][D] = 15 via A');
  snap(null, null, 1, 'Now k = B. Everything computed so far may improve again.', 'k = B');
  m = [[0, 3, 5, 7], [8, 0, 2, 15], [5, 8, 0, 1], [2, 5, 7, 0]];
  snap(0, 2, 1, 'A→C was infinity. Via B: 3 + 2 = 5. Recorded.', 'dist[A][C] = 5 via B');
  snap(null, null, 2, 'k = C. And now the payoff of the ordering.', 'k = C',
    P('Can A→D beat its current 7 by going via C?', 'Yes', 'No', true));
  m = [[0, 3, 5, 6], [8, 0, 2, 3], [5, 8, 0, 1], [2, 5, 7, 0]];
  snap(0, 3, 2, 'A→C is 5 (found via B last round) and C→D is 1, giving 6 — better than the direct road of 7. Notice this used a value that only existed because we processed B first.', 'dist[A][D] = 6 via B then C');
  snap(1, 3, 2, 'B→D collapses from 15 to 3 the same way: B→C is 2, C→D is 1.', 'dist[B][D] = 3');
  snap(null, null, 3, 'k = D finishes the job. Three nested loops, V³ operations, and every pair is now optimal.', 'k = D — final pass');
  snap(null, null, null, 'Five lines of code, O(V³) time, O(V²) space, negative edges fine, and a negative value on the diagonal would signal a negative cycle. Use it when V is small or the graph is dense.', 'O(V^3) — beats V x Dijkstra on dense graphs',
    P('V = 5000 sparse graph. Is Floyd-Warshall a good choice?', 'Yes', 'No', false));
  return F;
}
function toposort() {
  const F = [];
  const g = {
    nodes: [['socks', 90, 60], ['shoes', 300, 60], ['shirt', 90, 150], ['tie', 300, 150], ['jacket', 500, 150], ['trousers', 90, 245], ['belt', 300, 245]],
    adj: { socks: ['shoes'], shirt: ['tie'], tie: ['jacket'], trousers: ['shoes', 'belt'], belt: ['jacket'], shoes: [], jacket: [] }
  };
  const emitted = [];
  const snap = (cur, front, msg, caption, predict) => F.push(graphF(g, emitted.slice(), cur, front, msg, caption, predict));
  snap(null, ['socks', 'shirt', 'trousers'], 'Getting dressed. Arrows mean "must come before". Some items are unrelated — shirt and trousers, either order.', 'in-degree 0: socks, shirt, trousers',
    P('Is there exactly ONE valid order?', 'Yes', 'No', false));
  snap(null, ['socks', 'shirt', 'trousers'], 'Many valid orders exist. Kahn\'s algorithm starts with everything that has no prerequisites — in-degree zero.', 'queue: socks, shirt, trousers');
  emitted.push('socks');
  snap('socks', ['shirt', 'trousers'], 'Emit socks. Decrement the in-degree of everything it pointed at — shoes drops to 1 (still needs trousers).', 'emitted: socks | shoes in-degree 1');
  emitted.push('trousers');
  snap('trousers', ['shirt', 'shoes', 'belt'], 'Emit trousers. Now shoes hits in-degree 0 and joins the queue, and so does belt.', 'emitted: socks, trousers');
  emitted.push('shirt'); emitted.push('shoes');
  snap('shoes', ['belt', 'tie'], 'Emit shirt, then shoes. Order among independent items is free — swap them and the result is still valid.', 'emitted: 4 of 7');
  emitted.push('belt'); emitted.push('tie');
  snap('tie', ['jacket'], 'Emit belt and tie. Jacket needed BOTH of them, so only now does its in-degree reach zero.', 'jacket in-degree 0 at last',
    P('If jacket also had to come before shirt, would any order exist?', 'Yes', 'No', false));
  emitted.push('jacket');
  snap('jacket', [], 'Emit jacket. All 7 emitted, so the graph was acyclic and this is a valid order. O(V+E).', 'all 7 emitted -> no cycle');
  F.push(graphF(g, emitted, null, [], 'Had we emitted fewer than 7, the remainder would be stuck in a cycle — vertices in a cycle never reach in-degree zero. That IS the cycle test, and it is what "circular dependency" errors are reporting.', 'emitted < V  =>  cycle detected'));
  F.push(graphF(g, emitted, null, [], 'The longest path through the DAG is the critical path — the minimum possible completion time. That is how build systems turn this into an estimate.', 'longest path = critical path'));
  return F;
}
function kruskal() {
  const F = [];
  const nodes = WG.nodes, adj = WG.adj;
  const sorted = [['A', 'C', 2], ['B', 'C', 5], ['C', 'E', 3], ['A', 'B', 4], ['E', 'D', 4], ['E', 'F', 5], ['B', 'D', 10], ['D', 'F', 11]].sort((x, y) => x[2] - y[2]);
  const taken = [];
  const snap = (cur, msg, caption, predict) => F.push(graphF({ nodes, adj }, taken.flatMap(e => [e[0], e[1]]), cur, [], msg, caption, predict));
  snap(null, 'Connect every town with minimum total cable. Kruskal sorts all edges cheapest-first and never looks at the graph structure again.', 'sorted: AC2, CE3, AB4, ED4, BC5, EF5, BD10, DF11');
  const steps = [
    [['A', 'C', 2], true, 'A-C costs 2 — the cheapest. A and C are in different sets, so take it.'],
    [['C', 'E', 3], true, 'C-E costs 3. Different sets, take it. The tree is growing as separate fragments, which is fine.'],
    [['A', 'B', 4], true, 'A-B costs 4. B is on its own, so take it.'],
    [['E', 'D', 4], true, 'E-D costs 4. Take it. Four edges, five towns connected.'],
    [['B', 'C', 5], false, 'B-C costs 5 — but union-find says B and C already share a root. Taking it would make a cycle, so SKIP.'],
    [['E', 'F', 5], true, 'E-F costs 5, and F is still isolated. Take it — that is 5 edges for 6 towns, so we are done.']
  ];
  steps.forEach(([e, ok, msg], i) => {
    if (ok) taken.push(e);
    snap(e[1], msg, `${ok ? 'TAKE' : 'SKIP'} ${e[0]}-${e[1]} (${e[2]}) — total ${taken.reduce((s, x) => s + x[2], 0)}`,
      i === 3 ? P('Next is B-C at cost 5. Will Kruskal take it?', 'Yes', 'No', false) : undefined);
  });
  snap(null, 'MST complete: A-C, C-E, A-B, E-D, E-F for a total of 18. We stopped at V−1 = 5 edges, so B-D and D-F were never even considered.', 'MST total = 18, edges = 5 = V-1',
    P('Is the MST path from A to F also the SHORTEST path from A to F?', 'Yes', 'No', false));
  snap(null, 'Not necessarily — an MST minimises TOTAL weight across the whole graph, not the distance between any particular pair. Confusing MST with shortest path is one of the most common graph mistakes.', 'MST != shortest paths');
  return F;
}
function prim() {
  const F = [];
  const nodes = WG.nodes, adj = WG.adj;
  const inTree = ['A'];
  const snap = (cur, front, msg, caption, predict) => F.push(graphF({ nodes, adj }, inTree.slice(), cur, front, msg, caption, predict));
  snap('A', ['B', 'C'], 'Prim starts at one town and grows a single connected blob. Candidate edges out of A: A-B (4) and A-C (2).', 'heap: (2,C), (4,B)',
    P('Does Prim ever hold multiple disconnected fragments like Kruskal?', 'Yes', 'No', false));
  inTree.push('C');
  snap('C', ['B', 'E'], 'Never — the blob stays connected the whole way. Take the cheapest edge leaving it: A-C at 2.', 'in tree: A, C — total 2');
  snap('C', ['E', 'B'], 'New candidates from C: C-E (3) and C-B (5). Note the key pushed is the EDGE weight, not an accumulated distance — that one line is the entire difference from Dijkstra.', 'heap: (3,E), (4,B), (5,B)');
  inTree.push('E');
  snap('E', ['B', 'D', 'F'], 'C-E at 3 is cheapest. Take it. Now D (via E, cost 4) and F (via E, cost 5) become candidates.', 'in tree: A, C, E — total 5',
    P('Push d+w instead of w. What do you build?', 'An MST', 'A shortest-path tree', false));
  inTree.push('B');
  snap('B', ['D', 'F'], 'A-B at 4 and E-D at 4 tie; take A-B. Push d+w instead of w and you would silently build a shortest-path tree instead — a genuinely nasty bug because it still looks like a tree.', 'in tree: A, C, E, B — total 9');
  inTree.push('D');
  snap('D', ['F'], 'E-D at 4. Note B-C (5) is still in the heap but C is already in the tree, so when it pops we simply skip it. Mark visited on POP, not on push.', 'in tree: A, C, E, B, D — total 13');
  inTree.push('F');
  snap('F', [], 'E-F at 5 brings in the last town. Total 18 — the same total as Kruskal, because the MST weight is unique even when the edge set is not.', 'MST total = 18');
  snap(null, [], 'Choose Prim for dense graphs or matrix input (array-based gives O(V²) with no sorting of V² edges). Choose Kruskal for sparse graphs or pre-sorted edges.', 'Prim O(E log V) — dense. Kruskal O(E log E) — sparse.');
  return F;
}
function astar() {
  const F = [];
  const R = 6, C = 9;
  const walls = new Set(['2,3', '3,3', '4,3', '1,6', '2,6', '3,6']);
  const start = '4,1', goal = '1,7';
  const cells = (open, closed, path, showH) => Array.from({ length: R }, (_, r) => ({
    label: `r${r}`,
    cells: Array.from({ length: C }, (_, c) => {
      const k = `${r},${c}`;
      if (walls.has(k)) return { t: '█', s: 'off' };
      if (k === start) return { t: 'S', s: 'hot' };
      if (k === goal) return { t: 'G', s: 'hot' };
      if (path && path.has(k)) return { t: '•', s: 'hot' };
      if (closed.has(k)) return { t: '·', s: 'on' };
      if (open.has(k)) return { t: showH ? String(Math.abs(r - 1) + Math.abs(c - 7)) : '?', s: '' };
      return { t: '', s: 'off' };
    })
  }));
  const snap = (open, closed, path, showH, msg, caption, predict) => F.push(matF([], cells(new Set(open), new Set(closed), path ? new Set(path) : null, showH), msg, caption, predict));
  snap([], [], null, false, 'A grid. S is the start, G the goal, black cells are walls. Both Dijkstra and A* will find the same optimal path — the difference is how much they explore.', 'grid 6x9, 4-directional movement');
  snap(['3,1', '4,2', '5,1'], [start], null, false, 'Dijkstra expands outward equally in every direction. It has no idea where G is, so it explores backwards just as eagerly as forwards.', 'Dijkstra: h = 0 for every cell',
    P('Does Dijkstra know which direction the goal is in?', 'Yes', 'No', false));
  snap(['2,1', '3,2', '4,2', '5,2', '3,0', '4,0'], [start, '3,1', '5,1', '4,2'], null, false, 'Six cells expanded and it is still spreading left, away from the goal. On a big map this is where the waste happens.', 'Dijkstra: expanded 4, growing in all directions');
  snap([], Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => `${r},${c}`)).flat().filter(k => !walls.has(k)), null, false, 'Eventually Dijkstra expands nearly the whole reachable grid before it settles G. Correct, but wasteful.', 'Dijkstra: ~45 cells expanded');
  snap(['3,1', '4,2', '5,1'], [start], null, true, 'Now A*. Each candidate is scored f = g + h, where h is the Manhattan distance to G — a guess of the work remaining. The numbers shown are h.', 'f = g + h, h = |dr| + |dc|',
    P('Must h never OVERestimate the true remaining cost?', 'Yes', 'No', true));
  snap(['3,2', '4,2'], [start, '4,2'], null, true, 'Admissibility is exactly that: never overestimate. It is what buys the optimality guarantee. Because h pulls towards G, A* prefers cells heading up and right.', 'A*: expanding toward the goal only');
  snap(['2,2', '3,4'], [start, '4,2', '3,2', '2,2'], null, true, 'It walks around the wall rather than exploring away from it — h makes the leftward cells look expensive, so they sit at the back of the heap.', 'A*: wall avoided, no backward exploration');
  snap(['1,5', '2,5'], [start, '4,2', '3,2', '2,2', '1,2', '1,3', '1,4', '2,4'], null, true, 'Closing in. A* has expanded roughly a third of what Dijkstra needed for the identical answer.', 'A*: ~10 cells expanded');
  snap([], [start, '4,2', '3,2', '2,2', '1,2', '1,3', '1,4', '1,5', '2,5', '1,7'], ['4,1', '4,2', '3,2', '2,2', '1,2', '1,3', '1,4', '1,5', '2,5', '1,7'], true, 'Goal reached, path optimal, a fraction of the exploration. Set h = 0 and this code IS Dijkstra — they are the same algorithm with different heuristics.', 'h = 0  =>  Dijkstra',
    P('Inflate h by 1.5×. Faster, but still guaranteed optimal?', 'Yes', 'No', false));
  snap([], [start, '1,7'], ['4,1', '4,2', '3,2', '2,2', '1,2', '1,3', '1,4', '1,5', '2,5', '1,7'], true, 'Weighted A* explores far less but may return a suboptimal path — a deliberate, tunable trade that games make constantly. Match h to the movement model: Manhattan for 4-directional, octile for 8.', 'weighted A*: faster, no optimality guarantee');
  return F;
}
function scc() {
  const F = [];
  const g = {
    nodes: [['A', 100, 60], ['B', 260, 60], ['C', 180, 160], ['D', 420, 110], ['E', 560, 60], ['F', 560, 200], ['G', 420, 250]],
    adj: { A: ['B'], B: ['C'], C: ['A', 'D'], D: ['E'], E: ['F'], F: ['D'], G: ['F'] }
  };
  F.push(graphF(g, [], null, [], 'A directed graph. Arrows are one-way streets, so reachability is no longer symmetric.', 'V = 7, directed'));
  F.push(graphF(g, ['A', 'B', 'C'], 'A', [], 'A → B → C → A. From any of these three you can reach the other two and get back. That mutual reachability makes them one strongly connected component.', 'SCC 1: {A, B, C}',
    P('From D, can you get back to A?', 'Yes', 'No', false)));
  F.push(graphF(g, ['D', 'E', 'F'], 'D', [], 'You cannot — C→D is one-way. D, E and F form their own cycle: D → E → F → D.', 'SCC 2: {D, E, F}'));
  F.push(graphF(g, ['G'], 'G', [], 'G points into F but nothing points back at G, so G is alone in its own component.', 'SCC 3: {G}'));
  F.push(graphF(g, ['A', 'B', 'C'], null, ['D', 'E', 'F'], 'Kosaraju finds these in two passes: a DFS to record finishing order, then a DFS on the REVERSED graph in that order. Two plain traversals, O(V+E).', 'pass 1: finishing order. pass 2: reversed graph.',
    P('Contract each SCC to a single node. Can the result contain a cycle?', 'Yes', 'No', false)));
  F.push(graphF({
    nodes: [['{A,B,C}', 140, 90], ['{D,E,F}', 400, 90], ['{G}', 400, 230]],
    adj: { '{A,B,C}': ['{D,E,F}'], '{G}': ['{D,E,F}'], '{D,E,F}': [] }
  }, ['{A,B,C}', '{D,E,F}', '{G}'], null, [], 'Never. Any remaining cycle would mean those components were mutually reachable, so they would already be one SCC. The condensation is ALWAYS a DAG.', 'condensation graph = always a DAG'));
  F.push(graphF({
    nodes: [['{A,B,C}', 140, 90], ['{D,E,F}', 400, 90], ['{G}', 400, 230]],
    adj: { '{A,B,C}': ['{D,E,F}'], '{G}': ['{D,E,F}'], '{D,E,F}': [] }
  }, ['{A,B,C}', '{G}', '{D,E,F}'], null, [], 'And that is the real payoff: a cyclic graph you could not topologically sort has become one you can. Almost every hard directed-graph problem becomes tractable after this reduction.', 'now topologically sortable'));
  return F;
}
function maxflow() {
  const F = [];
  const g = {
    nodes: [['S', 70, 150], ['A', 250, 60], ['B', 250, 240], ['C', 440, 60], ['D', 440, 240], ['T', 600, 150]],
    adj: { S: ['A', 'B'], A: ['C', 'D'], B: ['D'], C: ['T'], D: ['T'], T: [] }
  };
  F.push(graphF(g, [], null, [], 'Pipes from source S to sink T. Capacities: S-A 10, S-B 5, A-C 4, A-D 8, B-D 6, C-T 10, D-T 7.', 'capacities on each pipe',
    P('Is the max flow just the sum of S\'s outgoing pipes (15)?', 'Yes', 'No', false)));
  F.push(graphF(g, ['S', 'A', 'C', 'T'], 'T', [], 'No — bottlenecks downstream decide. Find an augmenting path: S→A→C→T. Its bottleneck is the smallest capacity on the path, A-C at 4.', 'path 1: S A C T, bottleneck 4'));
  F.push(graphF(g, ['S', 'A', 'C', 'T'], 'T', [], 'Push 4 units. A-C is now saturated, and we add a BACKWARD residual edge of capacity 4 so this decision can be undone later.', 'flow = 4. residual C->A = 4'));
  F.push(graphF(g, ['S', 'A', 'D', 'T'], 'T', [], 'Next path: S→A→D→T. Bottleneck is D-T at 7… but S-A has only 6 left after pushing 4. So the bottleneck is 6.', 'path 2: S A D T, bottleneck 6'));
  F.push(graphF(g, ['S', 'A', 'D', 'T'], 'T', [], 'Push 6. Flow is now 10, and S-A is saturated.', 'flow = 10. S-A saturated'));
  F.push(graphF(g, ['S', 'B', 'D', 'T'], 'T', [], 'Next: S→B→D→T. S-B has 5, B-D has 6, but D-T has only 1 left. Bottleneck 1.', 'path 3: S B D T, bottleneck 1',
    P('Without the backward residual edges, would this still find the maximum?', 'Yes', 'No', false)));
  F.push(graphF(g, ['S', 'B', 'D', 'T'], 'T', [], 'Push 1. Flow is 11. Residual edges are what let the algorithm reroute earlier commitments — omit them and it gets stuck below the optimum. That is the number-one implementation bug.', 'flow = 11'));
  F.push(graphF(g, ['S', 'A', 'B'], null, [], 'No augmenting path remains, so 11 is the maximum flow. Now the elegant part: the vertices still reachable from S in the residual graph are {S, A, B}.', 'no augmenting path -> max flow = 11'));
  F.push(graphF(g, ['S', 'A', 'B'], null, ['C', 'D', 'T'], 'That reachable set defines the MINIMUM CUT — the cheapest set of pipes to sever to stop all flow. Its capacity is also 11. One computation, both answers.', 'min cut = 11 = max flow',
    P('Bipartite matching — can it be solved as a max-flow problem?', 'Yes', 'No', true)));
  F.push(graphF(g, [], null, [], 'It can, and that is the real skill here: recognising the reduction. Assignment, scheduling, disjoint paths and project selection are all max flow wearing different clothes.', 'Edmonds-Karp O(V*E^2), Dinic O(V^2*E)'));
  return F;
}

// ── MODULE 7 ────────────────────────────────────────────────────────────────
function twoptr(input) {
  const F = [];
  const a = input.slice().sort((x, y) => x - y);
  const target = a[1] + a[a.length - 2];
  let lo = 0, hi = a.length - 1;
  const draw = () => a.map((v, i) => ({ v, i, tag: i === lo ? 'LO' : i === hi ? 'HI' : '', s: i === lo || i === hi ? 'hot' : i < lo || i > hi ? 'off' : 'in' }));
  F.push(cellsF(draw(), `Sorted array, looking for two values summing to ${target}. The naive way is a nested loop — O(n²).`, `target ${target}`));
  F.push(cellsF(draw(), 'Instead, put one finger at each end. Their sum is the largest and smallest bracket available.', `a[${lo}] + a[${hi}] = ${a[lo] + a[hi]}`,
    P('If the sum is too big, which finger should move?', 'The left one', 'The right one', false)));
  let guard = 0;
  while (lo < hi && guard++ < 12) {
    const s = a[lo] + a[hi];
    if (s === target) { F.push(cellsF(draw(), `${a[lo]} + ${a[hi]} = ${target}. Found in ${guard} steps instead of up to ${a.length * a.length / 2}.`, `found: (${lo}, ${hi})`)); break; }
    if (s > target) { F.push(cellsF(draw(), `${s} is too big. The only way to reduce it is to move HI left — and in doing so we discard every pair involving a[${hi}], because they were all even bigger.`, `${s} > ${target}: hi--`)); hi--; }
    else { F.push(cellsF(draw(), `${s} is too small. Move LO right, discarding every pair involving a[${lo}] — all of them were smaller still.`, `${s} < ${target}: lo++`)); lo++; }
  }
  F.push(cellsF(draw(), 'Each step eliminated a whole ROW of the imaginary n×n pair matrix. That is why one sweep replaces a nested loop.', 'O(n) after sorting',
    P('Does this work on an UNSORTED array?', 'Yes', 'No', false)));
  F.push(cellsF(draw(), 'It does not — the elimination argument depends entirely on sortedness. No monotonicity, no two pointers. For 3-sum, fix one element and two-pointer the rest: O(n²) instead of O(n³).', 'monotonicity is the licence to discard'));
  return F;
}
function window(input) {
  const F = [];
  const s = 'AABCBBAC';
  const k = 2;
  let lo = 0;
  const count = {};
  const draw = (hi, best) => s.split('').map((ch, i) => ({
    v: ch, i, tag: i === lo ? 'LO' : i === hi ? 'HI' : '',
    s: i >= lo && i <= hi ? (i === lo || i === hi ? 'hot' : 'in') : 'off'
  }));
  void input;
  F.push(cellsF(draw(-1, 0), `Find the longest stretch of "${s}" containing at most ${k} distinct letters. Checking every substring is O(n²).`, `k = ${k} distinct allowed`));
  let best = 0, bestSpan = '';
  for (let hi = 0; hi < s.length; hi++) {
    count[s[hi]] = (count[s[hi]] || 0) + 1;
    F.push(cellsF(draw(hi, best), `Expand right to include '${s[hi]}'. The window now holds ${Object.keys(count).length} distinct letters.`, `window [${lo}..${hi}] — distinct ${Object.keys(count).length}`,
      hi === 3 ? P('Distinct count just exceeded k. Do we restart from scratch?', 'Yes', 'No', false) : undefined));
    while (Object.keys(count).length > k) {
      count[s[lo]]--;
      if (count[s[lo]] === 0) delete count[s[lo]];
      lo++;
      F.push(cellsF(draw(hi, best), `Too many distinct letters — shrink from the LEFT instead of restarting. Each character is entered once and left once, which is what keeps this O(n).`, `shrink: lo -> ${lo}`));
    }
    if (hi - lo + 1 > best) { best = hi - lo + 1; bestSpan = s.slice(lo, hi + 1); }
  }
  F.push(cellsF(draw(s.length - 1, best), `Longest valid window: "${bestSpan}", length ${best}. Every index was visited at most twice — O(n) total.`, `answer: ${best} ("${bestSpan}")`,
    P('The array can contain NEGATIVE numbers and you want sum ≥ S. Still a window?', 'Yes', 'No', false)));
  F.push(cellsF(draw(-1, best), 'No — negatives break monotonicity, because growing the window no longer reliably increases the sum. Switch to prefix sums plus a hash map. Knowing that boundary saves hours.', 'negatives -> prefix sums + hash map'));
  return F;
}
function prefix(input) {
  const F = [];
  const a = input.slice(0, 8);
  const pre = [0];
  a.forEach(v => pre.push(pre[pre.length - 1] + v));
  const drawA = (hi) => a.map((v, i) => ({ v, i, tag: hi.indexOf(i) >= 0 ? '·' : '', s: hi.indexOf(i) >= 0 ? 'hot' : 'in' }));
  const drawP = (hi) => pre.map((v, i) => ({ v, i, tag: hi.indexOf(i) >= 0 ? 'P' : '', s: hi.indexOf(i) >= 0 ? 'hot' : 'in' }));
  F.push(cellsF(drawA([]), `The array [${a.join(', ')}]. Someone will ask for many range sums.`, 'naive: O(n) per query'));
  F.push(cellsF(drawA([2, 3, 4]), 'sum(2..4) the naive way walks three cells. A thousand queries means a thousand walks.', 'sum(2..4) = ' + (a[2] + a[3] + a[4]),
    P('Can we make every range sum O(1) with one pass of preparation?', 'Yes', 'No', true)));
  F.push(cellsF(drawP([]), `Build running totals, with a sentinel zero at index 0: [${pre.join(', ')}]. One pass, O(n).`, 'P[i] = sum of the first i elements'));
  F.push(cellsF(drawP([5, 2]), `Now sum(2..4) = P[5] − P[2] = ${pre[5]} − ${pre[2]} = ${pre[5] - pre[2]}. One subtraction, no matter how wide the range.`, `P[5] - P[2] = ${pre[5] - pre[2]}`));
  F.push(cellsF(drawP([8, 0]), 'The whole array is P[8] − P[0]. The sentinel zero is why l = 0 needs no special case — always allocate n+1.', 'sentinel avoids the l=0 branch'));
  const D = new Array(a.length + 1).fill(0);
  const drawD = (hi) => D.slice(0, a.length).map((v, i) => ({ v, i, tag: hi.indexOf(i) >= 0 ? '±' : '', s: hi.indexOf(i) >= 0 ? 'hot' : v ? 'in' : '' }));
  F.push(cellsF(drawD([]), 'Now the mirror trick. You must add 5 to every element in range 2..5, then 3 to range 4..7, and only read the array at the end.', 'difference array',
    P('Do you need a segment tree with lazy propagation for this?', 'Yes', 'No', false)));
  D[2] += 5; D[6] -= 5;
  F.push(cellsF(drawD([2, 6]), 'No. Record "+5 starts at 2" and "−5 starts at 6". Two writes, O(1) per update.', 'D[2] += 5, D[6] -= 5'));
  D[4] += 3; D[8] -= 3;
  F.push(cellsF(drawD([4]), 'Second update: D[4] += 3, D[8] −= 3. Still O(1).', 'D[4] += 3, D[8] -= 3'));
  const out = [];
  let run = 0;
  for (let i = 0; i < a.length; i++) { run += D[i]; out.push(run); }
  F.push(cellsF(out.map((v, i) => ({ v, i, tag: '', s: 'in' })), `One final prefix pass materialises the result: [${out.join(', ')}]. m updates plus one pass — O(m + n) instead of O(mn).`, 'materialise once at the end'));
  F.push(cellsF(drawP([]), 'And the highest-value variant: prefix sums plus a Counter of seen sums counts subarrays with a target sum — and unlike a sliding window, it survives negative numbers.', 'count subarrays sum k: prefix + Counter'));
  return F;
}
function bsanswer() {
  const F = [];
  const weights = [3, 2, 2, 4, 1, 4];
  const days = 3;
  const check = (cap) => { let used = 1, cur = 0; for (const w of weights) { if (cur + w > cap) { used++; cur = 0; } cur += w; } return used <= days; };
  let lo = Math.max(...weights), hi = weights.reduce((s, v) => s + v, 0);
  const draw = (mid) => Array.from({ length: hi - Math.max(...weights) + 1 }, (_, k) => {
    const cap = Math.max(...weights) + k;
    return { v: cap, i: cap, tag: cap === mid ? 'TRY' : '', s: cap === mid ? 'hot' : cap < lo || cap > hi ? 'off' : check(cap) ? 'in' : '' };
  });
  F.push(cellsF(draw(-1), `Ship [${weights.join(', ')}] in ${days} days. What is the smallest daily capacity that works? We cannot compute it directly — but given any capacity we can CHECK it.`, `answer space: ${lo}..${hi}`));
  F.push(cellsF(draw(-1), 'The key insight: if capacity 7 works, then 8, 9, 10 all work too. Feasibility is MONOTONE — so the answer space is searchable.', 'feasible(x) is monotone in x',
    P('Can we binary search over the ANSWER rather than an array?', 'Yes', 'No', true)));
  let guard = 0;
  while (lo < hi && guard++ < 8) {
    const mid = Math.floor((lo + hi) / 2);
    const ok = check(mid);
    F.push(cellsF(draw(mid), `Try capacity ${mid}. Run the greedy packing check: ${ok ? 'it fits in ' + days + ' days.' : 'it needs too many days.'}`, `check(${mid}) = ${ok}`,
      guard === 1 ? P(`${mid} ${ok ? 'works' : 'fails'}. Do we search ${ok ? 'lower' : 'higher'} next?`, 'Yes', 'No', true) : undefined));
    if (ok) hi = mid; else lo = mid + 1;
    F.push(cellsF(draw(mid), ok ? `It works, so ${mid} is a valid answer — but maybe smaller is too. Discard everything above.` : `It fails, so nothing at or below ${mid} can work. Discard the lower half.`, `range now ${lo}..${hi}`));
  }
  F.push(cellsF(draw(lo), `Answer: ${lo}. O(n log(range)) — the check is the real algorithm, the binary search is just a wrapper around it.`, `minimum capacity = ${lo}`,
    P('If check() were NOT monotone, would this still be valid?', 'Yes', 'No', false)));
  F.push(cellsF(draw(lo), 'It would not — with no threshold to find, discarding half the range is unjustified. Recognise this pattern from "minimise the maximum", "maximise the minimum", "smallest X such that Y is possible".', 'monotonicity is the whole precondition'));
  return F;
}
function backtrack() {
  const F = [];
  const g = {
    nodes: [['·', 320, 30], ['1', 140, 110], ['2', 320, 110], ['3', 500, 110], ['12', 80, 195], ['13', 200, 195], ['21', 320, 195], ['31', 500, 195], ['123', 140, 265], ['132', 260, 265]],
    adj: { '·': ['1', '2', '3'], '1': ['12', '13'], '2': ['21'], '3': ['31'], '12': ['123'], '13': ['132'], '21': [], '31': [], '123': [], '132': [] }
  };
  F.push(graphF(g, [], null, [], 'The decision tree for permutations of [1,2,3]. Each level chooses one more element.', 'choose / explore / un-choose'));
  F.push(graphF(g, ['·'], '·', ['1', '2', '3'], 'At the root, three choices. Backtracking is just DFS over this tree.', 'depth 0: 3 choices',
    P('Will this tree be explored breadth-first?', 'Yes', 'No', false)));
  F.push(graphF(g, ['·', '1'], '1', ['12', '13'], 'Depth-first: commit to 1 and go deeper immediately. Mark 1 as used — that is the "choose" step.', 'chose 1 — used = {1}'));
  F.push(graphF(g, ['·', '1', '12'], '12', ['123'], 'Choose 2. Two down, one to go.', 'chose 2 — used = {1,2}'));
  F.push(graphF(g, ['·', '1', '12', '123'], '123', [], 'Choose 3. The path is complete, so record a COPY of it — not the live list, which we are about to mutate.', 'found: [1,2,3]'));
  F.push(graphF(g, ['·', '1', '12'], '12', [], 'Now un-choose 3 and un-choose 2, walking back up to the "1" node. Missing this un-choose step is the single most common backtracking bug.', 'un-choose: pop 3, pop 2'));
  F.push(graphF(g, ['·', '1', '13', '132'], '132', [], 'Take the other branch: 1, then 3, then 2. Found [1,3,2].', 'found: [1,3,2]',
    P('For N-queens, where should you check whether a square is attacked?', 'After recursing', 'Before recursing', false)));
  F.push(graphF(g, ['·', '2', '21'], '2', ['21'], 'Before — always. Pruning a branch before you spend a stack frame on it is where all the speed comes from. Check at the top of the call and you have already paid.', 'PRUNE before recursing'));
  F.push(graphF(g, ['·', '1', '2', '3', '12', '13', '21', '31', '123', '132'], null, [], 'The full tree has 3! = 6 leaves here, but for N-queens or Sudoku it is astronomically large. Constraint propagation and symmetry breaking are what make it finish at all.', 'exponential space — pruning makes it tractable'));
  return F;
}
function greedy() {
  const F = [];
  const cols = ['coins used', 'total'];
  const rows = (g, o, hot) => [
    { label: 'Greedy', cells: [{ t: g.join(' + ') || '—', s: hot === 0 ? 'hot' : 'on' }, { t: String(g.length), s: hot === 0 ? 'hot' : '' }] },
    { label: 'Optimal', cells: [{ t: o.join(' + ') || '—', s: hot === 1 ? 'hot' : 'on' }, { t: String(o.length), s: hot === 1 ? 'hot' : '' }] }
  ];
  F.push(matF(cols, rows([], [], null), 'Coins [1, 3, 4], make 6. Greedy takes the biggest coin that fits, repeatedly. Optimal is whatever actually minimises the count.', 'coins [1,3,4], target 6',
    P('Will greedy find the optimal answer here?', 'Yes', 'No', false)));
  F.push(matF(cols, rows([4], [], 0), 'Greedy grabs 4 — the biggest that fits. Two remaining.', 'greedy: 4, remaining 2'));
  F.push(matF(cols, rows([4, 1], [], 0), 'No 3 fits into 2, so it takes 1. One remaining.', 'greedy: 4 + 1, remaining 1'));
  F.push(matF(cols, rows([4, 1, 1], [], 0), 'And 1 again. Greedy total: three coins.', 'greedy: 3 coins'));
  F.push(matF(cols, rows([4, 1, 1], [3, 3], 1), 'But 3 + 3 is two coins. Greedy was WRONG, and its first choice — the locally best one — is exactly what ruined it.', 'optimal: 2 coins — greedy failed'));
  F.push(matF(cols, rows([4, 1, 1], [3, 3], null), 'Real currencies happen to be canonical systems where greedy IS optimal, which is why the instinct feels so reliable and then betrays you.', 'greedy needs the greedy-choice property',
    P('Interval scheduling: is sorting by earliest FINISH time provably optimal?', 'Yes', 'No', true)));
  const icols = ['sort key', 'meetings fitted'];
  F.push(matF(icols, [
    { label: 'By finish', cells: [{ t: 'earliest end', s: 'hot' }, { t: '4 — optimal', s: 'hot' }] },
    { label: 'By start', cells: [{ t: 'earliest start', s: 'on' }, { t: '2', s: '' }] },
    { label: 'By length', cells: [{ t: 'shortest first', s: 'on' }, { t: '3', s: '' }] }
  ], 'It is — and the exchange argument proves it: take any optimal schedule, swap in the earliest-finishing meeting, and it is no worse. The other two keys are simply wrong.', 'the sort key IS the algorithm'));
  F.push(matF(icols, [
    { label: 'Test it', cells: [{ t: 'find a counterexample', s: 'hot' }, { t: 'takes 30 seconds', s: 'hot' }] },
    { label: 'Prove it', cells: [{ t: 'exchange argument', s: 'on' }, { t: 'swap in the greedy choice', s: 'on' }] },
    { label: 'Fall back', cells: [{ t: 'greedy fails', s: 'on' }, { t: 'use DP', s: 'on' }] }
  ], 'So the discipline is: try to break it with a tiny example, and if you cannot, attempt the exchange argument. When greedy genuinely fails, the reason is that a choice affects future feasibility in a way local information cannot see — and that is DP.', 'break it, or prove it'));
  return F;
}
function divconq(input) {
  const F = [];
  const a = input.slice(0, 8);
  const lock = [];
  F.push(barF(a.slice(), [], false, [], `Count inversions in [${a.join(', ')}] — pairs that are out of order. The naive way compares every pair: O(n²).`,
    P('Can divide and conquer do better than O(n²) here?', 'Yes', 'No', true)));
  F.push(barF(a.slice(), [0, 1, 2, 3], false, [], 'Split in half. Inversions are of three kinds: entirely in the left half, entirely in the right half, or CROSSING between them.'));
  F.push(barF(a.slice(), [4, 5, 6, 7], false, [], 'Left and right are handled by recursion. The interesting work — and the whole insight — is counting the crossing pairs.'));
  F.push(barF(a.slice(), [0, 1], false, [], 'Recurse down to pairs. A single element has no inversions, which is the base case.'));
  const sortedL = a.slice(0, 4).sort((x, y) => x - y);
  const sortedR = a.slice(4).sort((x, y) => x - y);
  F.push(barF([...sortedL, ...a.slice(4)], [0, 1, 2, 3], true, [], `Left half comes back sorted: [${sortedL.join(', ')}]. Sorting it is free — it is a by-product of the merge.`));
  F.push(barF([...sortedL, ...sortedR], [4, 5, 6, 7], true, [], `Right half sorted too: [${sortedR.join(', ')}].`,
    P('While merging, if a right element is taken, does that reveal inversions?', 'Yes', 'No', true)));
  F.push(barF([...sortedL, ...sortedR], [0, 4], false, [], 'Yes — and this is the trick. If we take an element from the RIGHT, every element still remaining in the left half is greater than it, so they are all inversions. Add len(left) − i in one step.'));
  const merged = [...sortedL, ...sortedR].sort((x, y) => x - y);
  F.push(barF(merged.slice(), [], true, merged.map((_, i) => i), 'Counting a whole batch of inversions per merge step is what turns O(n²) into O(n log n). The combine step did the real work.'));
  F.push(barF(merged.slice(), [], false, merged.map((_, i) => i), 'Master Theorem: T(n) = 2T(n/2) + O(n) → O(n log n). Karatsuba is 3T(n/2) + O(n) → O(n^1.585), beating schoolbook multiplication. The recurrence tells you the answer.',
    P('Subproblems overlap heavily instead of being independent. What is it then?', 'Divide and conquer', 'Dynamic programming', false)));
  F.push(barF(merged.slice(), [], false, merged.map((_, i) => i), 'Overlap is the definition of a DP problem — add memoisation. Independence is exactly what makes plain divide and conquer efficient, and that boundary is worth knowing precisely.'));
  return F;
}
function bits() {
  const F = [];
  let x = 0b00101100;
  const draw = (hi, label) => Array.from({ length: 8 }, (_, k) => {
    const i = 7 - k;
    return { v: (x >> i) & 1 ? '1' : '0', i, tag: hi.indexOf(i) >= 0 ? label || '·' : '', s: hi.indexOf(i) >= 0 ? 'hot' : (x >> i) & 1 ? 'in' : '' };
  });
  F.push(cellsF(draw([]), `x = ${x} is secretly a row of switches: ${x.toString(2).padStart(8, '0')}. Bit positions run right to left from 0.`, `x = ${x} = 0b${x.toString(2).padStart(8, '0')}`));
  F.push(cellsF(draw([2], 'BIT2'), '(x >> 2) & 1 tests bit 2: shift it down to position 0, then mask off everything else. Answer: 1.', '(x >> 2) & 1 = 1',
    P('x & (x-1): what does that do?', 'Sets the lowest bit', 'Clears the lowest set bit', false)));
  F.push(cellsF(draw([2], 'LOW'), `x − 1 flips the lowest set bit to 0 and everything below it to 1. ANDing with x therefore clears exactly that one bit.`, `x & (x-1) clears bit 2`));
  x = x & (x - 1);
  F.push(cellsF(draw([]), `x is now ${x}. Loop this and you count set bits — Brian Kernighan's popcount, one iteration per set bit rather than per bit.`, `x = ${x}, popcount loop`));
  x = 0b00101100;
  F.push(cellsF(draw([2], 'ISO'), `x & −x isolates the lowest set bit instead of clearing it — giving ${x & -x}. That single expression is the entire index arithmetic of a Fenwick tree.`, `x & -x = ${x & -x}`));
  F.push(cellsF(draw([5], 'SET'), 'x | (1 << 5) sets bit 5. Clear with x & ~(1 << 5), flip with x ^ (1 << 5). Those four operations cover almost everything.', 'set / clear / flip / test'));
  F.push(cellsF(draw([]), 'Now the property that solves real problems: x ^ x = 0, so XOR is self-inverse.', 'XOR is self-inverse',
    P('An array has every value twice except one. Best way to find the loner?', 'Hash set', 'XOR everything', false)));
  const arr = [4, 1, 2, 1, 2];
  let acc = 0;
  arr.forEach(v => { acc ^= v; });
  F.push(cellsF(arr.map((v, i) => ({ v, i, tag: '', s: 'in' })), `XOR the lot: pairs cancel themselves out and the loner survives. Answer ${acc}, in O(n) time and O(1) space — no hash set, no sorting.`, `4^1^2^1^2 = ${acc}`));
  F.push(cellsF(draw([]), 'And a bitmask represents a whole SET as one integer, so enumerating all 2^n subsets is a plain range loop. That is the foundation of bitmask DP — and the reason chess engines use 64-bit bitboards.', 'for mask in range(1 << n)'));
  return F;
}
function kmp() {
  const F = [];
  const text = 'ABABABCABAB';
  const pat = 'ABABC';
  const lps = [0, 0, 1, 2, 0];
  const rows = (ti, pi, shift, matched) => [
    { label: 'text', cells: text.split('').map((ch, i) => ({ t: ch, s: i === ti ? 'hot' : matched && i >= shift && i < ti ? 'on' : '' })) },
    { label: 'pattern', cells: text.split('').map((ch, i) => {
      const j = i - shift;
      if (j < 0 || j >= pat.length) return { t: '', s: 'off' };
      return { t: pat[j], s: j === pi ? 'hot' : j < pi ? 'on' : '' };
    }) },
    { label: 'lps', cells: text.split('').map((ch, i) => (i < pat.length ? { t: String(lps[i]), s: '' } : { t: '', s: 'off' })) }
  ];
  const snap = (ti, pi, shift, matched, msg, caption, predict) => F.push(matF([], rows(ti, pi, shift, matched), msg, caption, predict));
  snap(-1, -1, 0, false, `Search for "${pat}" in "${text}". The naive method, on a mismatch, slides the pattern one place right and restarts from its first character — throwing away everything it just learned.`, 'naive: O(n*m)');
  snap(-1, -1, 0, false, `First, the failure array. lps[i] is the length of the longest proper prefix of the pattern that is also a suffix ending at i. For "${pat}" it is [${lps.join(', ')}].`, 'lps = [0, 0, 1, 2, 0]',
    P('Does the lps array depend on the TEXT at all?', 'Yes', 'No', false));
  snap(-1, -1, 0, false, 'It does not — it is precomputed from the pattern alone, in O(m). That is why the same pattern can be searched against any text cheaply.', 'lps is precomputed from the pattern only');
  snap(3, 3, 0, true, 'Matching proceeds: A, B, A, B all match. We are four characters in.', 'matched ABAB, k = 4');
  snap(4, 4, 0, true, `Now text[4] is 'A' but pattern[4] is 'C'. Mismatch after 4 matched characters.`, 'mismatch at k = 4',
    P('Naive would restart at text index 1. Must KMP re-read those characters?', 'Yes', 'No', false));
  snap(4, 2, 2, true, `No. lps[3] = 2 tells us the first 2 characters of the pattern ("AB") already match the last 2 we consumed. Shift the pattern so that prefix lines up and continue from k = 2 — the TEXT pointer never moves backwards.`, 'k = lps[3] = 2, text pointer stays');
  snap(5, 3, 2, true, 'Continue: text[5] matches pattern[3]. We reused the overlap instead of re-reading it.', 'matched again, k = 4');
  snap(6, 4, 2, true, `text[6] = 'C' matches pattern[4] = 'C'. Full match found at index 2.`, 'MATCH at index 2');
  snap(6, 4, 2, true, 'Because each text character is examined once, the total is O(n + m) — and the lps array is only O(m) space.', 'O(n + m) total',
    P('Searching for 5,000 patterns at once. Loop KMP 5,000 times?', 'Yes', 'No', false));
  snap(-1, -1, 0, false, 'No — that is Aho-Corasick, which builds a trie of all patterns with KMP-style failure links and scans the text ONCE. It is what intrusion detection and content filters actually run.', 'many patterns -> Aho-Corasick');
  return F;
}
function sweep() {
  const F = [];
  const iv = [[1, 5], [2, 7], [4, 6], [8, 10], [9, 12]];
  const T = 13;
  const rows = (t, active, count, best) => [
    { label: 'timeline', cells: Array.from({ length: T }, (_, i) => ({ t: String(i), s: i === t ? 'hot' : '' })) },
    ...iv.map(([s, e], k) => ({
      label: `bk ${k + 1}`,
      cells: Array.from({ length: T }, (_, i) => ({
        t: i >= s && i < e ? '█' : '', s: i >= s && i < e ? (t >= s && t < e && i === t ? 'hot' : 'on') : 'off'
      }))
    })),
    { label: 'concurrent', cells: Array.from({ length: T }, (_, i) => ({ t: i === t ? String(count) : '', s: i === t ? (count === best ? 'hot' : 'on') : 'off' })) }
  ];
  const snap = (t, count, best, msg, caption, predict) => F.push(matF([], rows(t, null, count, best), msg, caption, predict));
  snap(-1, 0, 0, 'Five bookings. What is the maximum number overlapping at once? Comparing every pair with every other is O(n²).', '5 bookings',
    P('Can one pass over sorted events answer this?', 'Yes', 'No', true));
  snap(-1, 0, 0, 'Turn each booking into two EVENTS: +1 at its start, −1 at its end. Sort all ten events by time, then walk the timeline with a running counter.', 'events: +1 at start, -1 at end');
  const events = [];
  iv.forEach(([s, e]) => { events.push([s, 1]); events.push([e, -1]); });
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, best = 0;
  const shown = {};
  events.forEach(([t, d], i) => {
    cur += d; best = Math.max(best, cur);
    if (!shown[t] || i === events.length - 1) {
      shown[t] = 1;
      snap(t, cur, best, d > 0 ? `t = ${t}: a booking starts. Running count is now ${cur}.` : `t = ${t}: a booking ends. Running count drops to ${cur}.`,
        `t=${t} count=${cur} max=${best}`,
        i === 3 ? P('At an identical timestamp, should ends be processed before starts?', 'Yes', 'No', true) : undefined);
    }
  });
  snap(-1, 0, best, `Ends before starts implements [start, end) semantics, so a booking ending exactly where another begins does NOT count as overlapping. Flipping that tie-break is the classic sweep-line bug.`, `answer: ${best} concurrent`);
  snap(-1, 0, best, 'O(n log n), dominated by the sort. The same sweep, with a heap of active end times, gives you minimum meeting rooms; with a balanced BST it gives rectangle union area and line-segment intersection.', 'sort dominates: O(n log n)');
  return F;
}

// ── MODULE 8 ────────────────────────────────────────────────────────────────
function memo() {
  const F = [];
  const g = {
    nodes: [['f5', 320, 24], ['f4', 200, 96], ['f3', 440, 96], ['f3b', 110, 168], ['f2', 280, 168], ['f2b', 400, 168], ['f1', 530, 168], ['f2c', 60, 240], ['f1b', 170, 240], ['f1c', 250, 240], ['f0', 340, 240]],
    adj: { f5: ['f4', 'f3'], f4: ['f3b', 'f2'], f3: ['f2b', 'f1'], f3b: ['f2c', 'f1b'], f2: ['f1c', 'f0'], f2b: [], f1: [], f2c: [], f1b: [], f1c: [], f0: [] }
  };
  F.push(graphF(g, [], null, [], 'The call tree for a naive fib(5). Each node calls two more.', 'fib(5) naive: exponential calls'));
  F.push(graphF(g, ['f5', 'f4', 'f3b'], 'f3b', [], 'Descend the left branch: fib(5) → fib(4) → fib(3).', 'computing fib(3)'));
  F.push(graphF(g, ['f5', 'f3'], 'f3', [], 'And now the right branch computes fib(3) AGAIN — from scratch, including its whole subtree.', 'fib(3) computed a SECOND time',
    P('For fib(50), how many times is fib(10) recomputed?', 'Once', 'Millions of times', false)));
  F.push(graphF(g, ['f3b', 'f3', 'f2', 'f2b', 'f2c'], null, ['f2', 'f2b', 'f2c'], 'Millions. fib(2) alone appears three times in this tiny tree, and the duplication compounds exponentially with n.', 'overlapping subproblems'));
  F.push(graphF(g, ['f5', 'f4', 'f3b', 'f2c', 'f1b'], 'f2c', [], 'Now add memoisation: the first time each argument is computed, write the answer down.', 'cache = {}',
    P('Will the right branch now recompute fib(3)?', 'Yes', 'No', false)));
  F.push(graphF({
    nodes: g.nodes, adj: { f5: ['f4', 'f3'], f4: ['f3b', 'f2'], f3: [], f3b: ['f2c', 'f1b'], f2: ['f1c', 'f0'], f2b: [], f1: [], f2c: [], f1b: [], f1c: [], f0: [] }
  }, ['f5', 'f4', 'f3b', 'f2c', 'f1b', 'f2', 'f1c', 'f0'], 'f3', [], 'The whole right subtree vanishes — fib(3) is a cache hit. The exponential tree collapses to one node per distinct argument: O(n).', 'exponential -> O(n) states'));
  F.push(graphF({
    nodes: [['f0', 90, 150], ['f1', 200, 150], ['f2', 310, 150], ['f3', 420, 150], ['f4', 530, 150]],
    adj: { f0: ['f1'], f1: ['f2'], f2: ['f3'], f3: ['f4'], f4: [] }
  }, ['f0', 'f1', 'f2', 'f3', 'f4'], null, [], 'Notice what the collapsed tree actually is: a straight chain. So you could skip recursion entirely and fill an array bottom-up in dependency order — that is tabulation.', 'tabulation: fill in dependency order'));
  F.push(graphF({
    nodes: [['prev', 220, 150], ['cur', 420, 150]], adj: { prev: ['cur'], cur: [] }
  }, ['prev', 'cur'], null, [], 'And since each value needs only the previous two, you can keep two variables instead of an array — O(1) space. Same complexity throughout; memo vs table vs rolling is an engineering choice.', 'state: dp[i]. transition: dp[i-1] + dp[i-2].',
    P('Complexity of any DP equals…', 'states x transition cost', 'the recursion depth', true)));
  F.push(graphF({ nodes: [['states × transition', 320, 150]], adj: { 'states × transition': [] } }, ['states × transition'], null, [], 'Count your states, multiply by the cost of one transition — that IS the complexity. If the product is too big, you need a better STATE, not a faster loop. That habit is most of DP.', 'define the state before writing code'));
  return F;
}
function dp1d() {
  const F = [];
  const a = [2, 7, 9, 3, 1];
  const dp = new Array(a.length).fill(0);
  const draw = (hi, showDp) => (showDp ? dp : a).map((v, i) => ({
    v: showDp && i > hi ? '' : v, i, tag: i === hi ? 'dp' : '',
    s: i === hi ? 'hot' : showDp && i < hi ? 'in' : showDp && i > hi ? 'off' : 'in'
  }));
  F.push(cellsF(draw(-1, false), `Houses worth [${a.join(', ')}]. You cannot rob two adjacent houses. Maximise the take.`, 'cannot rob adjacent',
    P('Is "always take the biggest remaining" optimal here?', 'Yes', 'No', false)));
  F.push(cellsF(draw(-1, false), 'Greedy takes 9, which then forbids 7 and 3. The right frame is instead: what is the LAST decision? At each house you either rob it or skip it.', 'state: dp[i] = best using houses 0..i'));
  dp[0] = a[0];
  F.push(cellsF(draw(0, true), `dp[0] = ${a[0]}. With one house there is no choice.`, `dp[0] = ${dp[0]}`));
  dp[1] = Math.max(a[0], a[1]);
  F.push(cellsF(draw(1, true), `dp[1] = max(${a[0]}, ${a[1]}) = ${dp[1]}. Two adjacent houses — take the better one.`, `dp[1] = ${dp[1]}`));
  for (let i = 2; i < a.length; i++) {
    const skip = dp[i - 1], take = dp[i - 2] + a[i];
    dp[i] = Math.max(skip, take);
    F.push(cellsF(draw(i, true),
      `dp[${i}] = max(skip = dp[${i - 1}] = ${skip}, take = dp[${i - 2}] + ${a[i]} = ${take}) = ${dp[i]}. The "take" branch reaches back TWO because robbing house ${i} forbids house ${i - 1}.`,
      `dp[${i}] = ${dp[i]}`,
      i === 2 ? P(`Skip gives ${skip}, take gives ${take}. Does taking win?`, 'Yes', 'No', take > skip) : undefined));
  }
  F.push(cellsF(draw(a.length - 1, true), `Answer ${dp[a.length - 1]} — and greedy would have said 9 + 1 = 10. The constraint is exactly what greedy could not see.`, `answer = ${dp[a.length - 1]}`));
  F.push(cellsF(draw(-1, true), 'Because the transition only looks back two positions, the whole array collapses to two variables — O(1) space. That is true of most 1D DP.', 'fixed lookback -> O(1) space',
    P('If your transition scanned ALL previous states, what would the cost be?', 'Still O(n)', 'O(n²)', false)));
  F.push(cellsF(draw(-1, true), 'n states × O(n) transition is quadratic — and a monotonic deque or prefix structure is usually what brings it back down. Kadane\'s "extend or restart" is the other template worth memorising.', 'states x transition = complexity'));
  return F;
}
function knapsack() {
  const F = [];
  const items = [[2, 3], [3, 4], [4, 5], [5, 6]];
  const W = 8;
  const dp = Array.from({ length: items.length + 1 }, () => new Array(W + 1).fill(0));
  const cols = Array.from({ length: W + 1 }, (_, w) => String(w));
  const rows = (upto, hi) => [
    { label: 'no items', cells: dp[0].map((v, w) => ({ t: String(v), s: '' })) },
    ...items.map(([wt, val], k) => ({
      label: `w${wt} v${val}`,
      cells: dp[k + 1].map((v, w) => ({
        t: k + 1 <= upto || (k + 1 === upto + 1 && w <= (hi == null ? -1 : hi)) ? String(v) : '',
        s: (k + 1 === upto && w === hi) ? 'hot' : (k + 1 <= upto ? 'on' : 'off')
      }))
    }))
  ];
  const snap = (upto, hi, msg, caption, predict) => F.push(matF(cols, rows(upto, hi), msg, caption, predict));
  snap(0, null, `Four items (weight/value) and a bag holding ${W}. Columns are remaining capacity; rows add one item at a time.`, 'dp[i][w] = best value using first i items within capacity w',
    P('Can you take half an item?', 'Yes', 'No', false));
  snap(0, null, 'No — this is 0/1: each item is taken whole or left. (Fractional knapsack IS solvable greedily, which is a nice contrast.)', 'row 0 = no items = all zeros');
  for (let i = 1; i <= items.length; i++) {
    const [wt, val] = items[i - 1];
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w];
      if (w >= wt) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt] + val);
    }
    const showW = Math.min(W, wt + 2);
    snap(i, showW,
      i === 1
        ? `Item 1 (weight ${wt}, value ${val}). For each capacity: skip it (dp[0][w]) or take it (dp[0][w−${wt}] + ${val}). Take whichever is larger.`
        : `Item ${i} (weight ${wt}, value ${val}). Same single question at every capacity — skip, or take and look up the best answer for the reduced capacity in the row ABOVE.`,
      `row ${i} filled — best so far ${Math.max(...dp[i])}`,
      i === 2 ? P('The "take" branch reads the row above. Why not the current row?', 'It is the same', 'Reading the current row would let one item be reused', false) : undefined);
  }
  snap(items.length, W, `Answer: ${dp[items.length][W]} in the bottom-right. O(nW) — and note that is PSEUDO-polynomial: polynomial in the VALUE of W, not its bit length, which is why knapsack remains NP-hard.`, `best value = ${dp[items.length][W]}`,
    P('In the 1D rolling version, do you loop capacity ascending or descending?', 'Ascending', 'Descending', false));
  snap(items.length, W, 'Descending — so dp[w − wt] still refers to the PREVIOUS row and each item is used at most once. Loop ascending and you have silently built unbounded knapsack. That one line is the most instructive bug in DP.', '1D: for w in range(W, wt-1, -1)');
  return F;
}
function coins() {
  const F = [];
  const coinSet = [1, 3, 4];
  const target = 6;
  const dp = [0, ...new Array(target).fill(Infinity)];
  const cols = Array.from({ length: target + 1 }, (_, i) => String(i));
  const rows = (hi, coin) => [
    { label: 'min coins', cells: dp.map((v, i) => ({ t: v === Infinity ? '∞' : String(v), s: i === hi ? 'hot' : v === Infinity ? 'off' : 'on' })) },
    { label: 'using', cells: dp.map((v, i) => ({ t: i === hi && coin ? `+${coin}` : '', s: i === hi ? 'hot' : 'off' })) }
  ];
  const snap = (hi, coin, msg, caption, predict) => F.push(matF(cols, rows(hi, coin), msg, caption, predict));
  snap(0, null, `Coins ${JSON.stringify(coinSet)}, make ${target} with as few as possible. Unlimited copies of each — this is UNBOUNDED knapsack.`, 'dp[a] = fewest coins to make amount a',
    P('Greedy takes 4 first. Will that give the optimum?', 'Yes', 'No', false));
  snap(0, null, 'It will not: 4+1+1 is three coins, but 3+3 is two. So we build up the answer for every amount from 0 upward.', 'dp[0] = 0, everything else = infinity');
  coinSet.forEach(c => {
    for (let a = c; a <= target; a++) {
      if (dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1;
      }
    }
    snap(target, c, `Process coin ${c}, sweeping amounts ASCENDING so dp[a−${c}] may already include coin ${c} — which is exactly what allows reuse.`, `after coin ${c}: dp = [${dp.map(v => v === Infinity ? '∞' : v).join(', ')}]`,
      c === 3 ? P('Ascending allows reuse. What would DESCENDING build?', 'The same thing', '0/1 knapsack — each coin once', false) : undefined);
  });
  snap(target, null, `dp[${target}] = ${dp[target]} — two coins, 3+3. Greedy would have said three.`, `answer = ${dp[target]} coins`);
  const comb = [1, 0, 0, 0, 0, 0, 0];
  coinSet.forEach(c => { for (let a = c; a <= target; a++) comb[a] += comb[a - c]; });
  F.push(matF(cols, [
    { label: 'combinations', cells: comb.map((v, i) => ({ t: String(v), s: i === target ? 'hot' : 'on' })) },
    { label: 'note', cells: comb.map((v, i) => ({ t: '', s: 'off' })) }
  ], `A different question on the same shape: how many WAYS to make ${target}? Coins in the OUTER loop counts combinations (unordered) — the answer is ${comb[target]}.`, 'coins outer -> combinations',
    P('Swap the loops so amount is outer. Does the count change?', 'Yes', 'No', true)));
  F.push(matF(cols, [
    { label: 'permutations', cells: comb.map((v, i) => ({ t: i === target ? '9' : '', s: i === target ? 'hot' : 'off' })) },
    { label: 'note', cells: comb.map(() => ({ t: '', s: 'off' })) }
  ], 'It does — amount outer counts PERMUTATIONS, where 1+3 and 3+1 are different. Same three lines, completely different meaning. Decide which you want BEFORE writing the loops.', 'amount outer -> permutations'));
  return F;
}
function lcs() {
  const F = [];
  const A = 'ABCBDAB', B = 'BDCABA';
  const dp = Array.from({ length: A.length + 1 }, () => new Array(B.length + 1).fill(0));
  const cols = ['', ...B.split('')];
  const rows = (ri, ci) => [
    { label: '', cells: dp[0].map((v, j) => ({ t: String(v), s: '' })) },
    ...A.split('').map((ch, i) => ({
      label: ch,
      cells: dp[i + 1].map((v, j) => ({
        t: (i + 1 < ri || (i + 1 === ri && j <= ci)) ? String(v) : '',
        s: (i + 1 === ri && j === ci) ? 'hot' : (i + 1 < ri || (i + 1 === ri && j < ci)) ? 'on' : 'off'
      }))
    }))
  ];
  const snap = (ri, ci, msg, caption, predict) => F.push(matF(cols, rows(ri, ci), msg, caption, predict));
  snap(0, 0, `Longest common subsequence of "${A}" and "${B}". Subsequence means in order but NOT necessarily adjacent.`, 'dp[i][j] = LCS of first i of A, first j of B',
    P('Is "BCAB" a valid subsequence of ABCBDAB?', 'Yes', 'No', true));
  snap(1, B.length, 'Row and column zero are all zeros — an empty string shares nothing. Now fill row by row, asking one question per cell.', 'base case: empty prefix -> 0');
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      dp[i][j] = A[i - 1] === B[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
    if (i <= 3 || i === A.length) {
      snap(i, B.length,
        i === 1
          ? `Row for '${A[0]}': where the letters match, take the DIAGONAL value and add 1. Where they differ, take the better of up or left.`
          : `Row for '${A[i - 1]}'. Match means extend the agreement we already had diagonally behind us; mismatch means drop a letter from one side and keep the best.`,
        `row ${i} — best so far ${Math.max(...dp[i])}`,
        i === 2 ? P('On a MATCH, which neighbour does the cell read?', 'The diagonal', 'The left one', true) : undefined);
    }
  }
  snap(A.length, B.length, `Bottom-right = ${dp[A.length][B.length]}: the LCS length. Walk backwards from the corner to recover the actual subsequence.`, `LCS length = ${dp[A.length][B.length]}`,
    P('Longest common SUBSTRING (contiguous) — what changes?', 'Nothing', 'On mismatch, reset to 0 instead of taking a max', false));
  snap(A.length, B.length, 'One line. Resetting to zero on mismatch enforces contiguity. And the lines NOT in the LCS are exactly the insertions and deletions — which is what git diff reports.', 'substring: else dp[i][j] = 0');
  return F;
}
function edit() {
  const F = [];
  const A = 'kitten', B = 'sitting';
  const dp = Array.from({ length: A.length + 1 }, (_, i) => new Array(B.length + 1).fill(0).map((_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  const cols = ['ø', ...B.split('')];
  const rows = (ri, ci) => [
    { label: 'ø', cells: dp[0].map(v => ({ t: String(v), s: '' })) },
    ...A.split('').map((ch, i) => ({
      label: ch,
      cells: dp[i + 1].map((v, j) => ({
        t: (i + 1 < ri || (i + 1 === ri && j <= ci)) ? String(v) : '',
        s: (i + 1 === ri && j === ci) ? 'hot' : (i + 1 < ri || (i + 1 === ri && j < ci)) ? 'on' : 'off'
      }))
    }))
  ];
  const snap = (ri, ci, msg, caption, predict) => F.push(matF(cols, rows(ri, ci), msg, caption, predict));
  snap(0, B.length, `Turn "${A}" into "${B}" in as few single-character edits as possible.`, 'dp[i][j] = edits to turn first i of A into first j of B',
    P('Do you already know the answer is 3?', 'Yes', 'No', true));
  snap(0, B.length, `Row zero is 0,1,2,3… — turning an empty string into j characters takes j INSERTIONS. Column zero is i DELETIONS. Those base cases matter.`, 'base: i deletions / j insertions');
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      dp[i][j] = A[i - 1] === B[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
    if (i <= 2 || i >= A.length - 1) {
      snap(i, B.length,
        i === 1
          ? `Row '${A[0]}': if the characters match the cell is FREE — copy the diagonal. If not, it is 1 + the cheapest of three neighbours: diagonal (replace), up (delete), left (insert).`
          : `Row '${A[i - 1]}'. Same three-way min at every cell. Diagonal = replace, up = delete, left = insert.`,
        `row ${i}`,
        i === 2 ? P('Which neighbour corresponds to DELETING a character from the source?', 'Up', 'Left', true) : undefined);
    }
  }
  snap(A.length, B.length, `Answer ${dp[A.length][B.length]}: replace k→s, replace e→i, insert g. O(nm) time, and O(min(n,m)) space if you only need the number.`, `edit distance = ${dp[A.length][B.length]}`,
    P('For spellcheck you only care "is it within 2?". Compute the whole table?', 'Yes', 'No', false));
  snap(A.length, B.length, 'No — band the DP to a diagonal strip of width 2d+1 and it becomes O(nd), a large real speedup. Damerau adds transposition, which catches "teh"→"the", one of the commonest human errors.', 'banded: O(n*d) for distance <= d');
  return F;
}
function lis(input) {
  const F = [];
  const a = input.slice(0, 9);
  const tails = [];
  const draw = (hi, arr, tag) => arr.map((v, i) => ({ v, i, tag: i === hi ? tag || '·' : '', s: i === hi ? 'hot' : 'in' }));
  F.push(cellsF(draw(-1, a), `Longest increasing subsequence of [${a.join(', ')}]. The O(n²) DP compares every pair; there is an O(n log n) way that feels like a card game.`, 'patience sorting',
    P('Must the subsequence be contiguous?', 'Yes', 'No', false)));
  F.push(cellsF(draw(-1, a), 'It must not — just increasing and in order. Deal each card onto the leftmost pile whose top is greater than or equal to it; otherwise start a new pile.', 'tails[k] = smallest tail of an increasing run of length k+1'));
  a.forEach((v, idx) => {
    let i = 0;
    while (i < tails.length && tails[i] < v) i++;
    const isNew = i === tails.length;
    if (isNew) tails.push(v); else tails[i] = v;
    F.push(cellsF(draw(i, tails, isNew ? 'NEW' : 'REPL'),
      isNew
        ? `${v} is bigger than every pile top, so it starts pile ${i + 1} — the longest run just got longer.`
        : `${v} replaces ${'' + tails[i]}'s slot at pile ${i + 1}: a smaller tail for the same length leaves more room for future cards. The LENGTH does not change.`,
      `after ${v}: tails = [${tails.join(', ')}] — LIS length ${tails.length}`,
      idx === 2 ? P('tails is always sorted. Does that let us binary search it?', 'Yes', 'No', true) : undefined));
  });
  F.push(cellsF(draw(-1, tails), `LIS length = ${tails.length}. Because tails stays sorted we binary search it — bisect_left for strictly increasing, bisect_right for non-decreasing. O(n log n).`, `answer: ${tails.length}`,
    P('Is the tails array itself a valid longest increasing subsequence?', 'Yes', 'No', false)));
  F.push(cellsF(draw(-1, tails), 'It is not — it holds the smallest possible tail per length, so the LENGTH is right but the elements need not form an actual subsequence of the input. Track predecessor indices if you need the real one.', 'tails gives the length, not the sequence'));
  F.push(cellsF(draw(-1, a), 'LIS hides inside many problems: minimum removals to sort (n − LIS), maximum envelope nesting, longest compatibility chain. For 2D nesting, sort by width ascending and height DESCENDING, then LIS the heights.', 'recognise LIS in disguise'));
  return F;
}
function griddp() {
  const F = [];
  const R = 4, C = 5;
  const walls = new Set(['1,2', '2,3']);
  const dp = Array.from({ length: R }, () => new Array(C).fill(0));
  const cols = Array.from({ length: C }, (_, c) => `c${c}`);
  const rows = (upto) => Array.from({ length: R }, (_, r) => ({
    label: `r${r}`,
    cells: Array.from({ length: C }, (_, c) => {
      if (walls.has(`${r},${c}`)) return { t: '█', s: 'off' };
      return { t: r <= upto ? String(dp[r][c]) : '', s: r === upto ? 'hot' : r < upto ? 'on' : 'off' };
    })
  }));
  const snap = (upto, msg, caption, predict) => F.push(matF(cols, rows(upto), msg, caption, predict));
  snap(-1, `A ${R}×${C} grid with two blocked cells. Count paths from top-left to bottom-right, moving only RIGHT or DOWN.`, 'moves: right and down only',
    P('Does "right or down only" guarantee no cycles?', 'Yes', 'No', true));
  snap(-1, 'It does — every move strictly increases r+c, so the dependency graph is a DAG and DP is valid. That is the precondition worth checking first.', 'DAG -> DP is valid');
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (walls.has(`${r},${c}`)) { dp[r][c] = 0; continue; }
      if (r === 0 && c === 0) { dp[r][c] = 1; continue; }
      dp[r][c] = (r > 0 ? dp[r - 1][c] : 0) + (c > 0 ? dp[r][c - 1] : 0);
    }
    snap(r,
      r === 0
        ? 'Row 0: only one way to reach each cell — keep going right. A wall would make everything after it zero.'
        : `Row ${r}: each cell is the sum of the cell above and the cell to the left. Walls are simply set to 0 rather than special-cased with a branch.`,
      `row ${r}: [${dp[r].join(', ')}]`,
      r === 1 ? P('The wall at r1,c2 — should we branch around it or set it to 0?', 'Branch', 'Set to 0', false) : undefined);
  }
  snap(R - 1, `${dp[R - 1][C - 1]} paths. Setting blocked cells to 0 keeps the loop uniform and bug-free — the same idea uses infinity for minimisation problems.`, `answer = ${dp[R - 1][C - 1]} paths`);
  snap(R - 1, 'Each row depends only on the row above, so a single array of length C suffices — O(C) space, or O(1) extra if you overwrite the input.', 'roll to one row: O(C) space',
    P('Movement becomes four-directional with costs. Still DP?', 'Yes', 'No', false));
  snap(R - 1, 'No — you can now revisit cells, so the dependency graph has cycles and it becomes a shortest-path problem: Dijkstra, or 0-1 BFS with a deque when weights are 0/1. Recognising that boundary is the real skill.', '4-directional -> Dijkstra / 0-1 BFS');
  return F;
}
function treedp() {
  const F = [];
  const g = {
    nodes: [['A 10', 320, 30], ['B 5', 170, 115], ['C 8', 470, 115], ['D 3', 80, 210], ['E 7', 250, 210], ['F 2', 400, 210], ['G 9', 545, 210]],
    adj: { 'A 10': ['B 5', 'C 8'], 'B 5': ['D 3', 'E 7'], 'C 8': ['F 2', 'G 9'], 'D 3': [], 'E 7': [], 'F 2': [], 'G 9': [] }
  };
  F.push(graphF(g, [], null, [], 'A tree with a value at each node. Pick a set of nodes with the maximum total, but you may never pick a node AND its parent.', 'maximum weight independent set on a tree',
    P('Could you solve this by just taking every other level?', 'Yes', 'No', false)));
  F.push(graphF(g, [], null, ['D 3', 'E 7', 'F 2', 'G 9'], 'No — the values decide, not the depth. Start at the LEAVES: a leaf either is taken or is not, and both answers are trivial.', 'dp[leaf] = (excl 0, incl value)'));
  F.push(graphF(g, ['D 3', 'E 7'], 'D 3', [], 'dp[D] = (excluding 0, including 3). dp[E] = (0, 7).', 'dp[D]=(0,3)  dp[E]=(0,7)'));
  F.push(graphF(g, ['D 3', 'E 7', 'B 5'], 'B 5', [], 'Now B can answer, because both its children have. Two cases: if B is EXCLUDED its children are free to do whatever is best — max(0,3) + max(0,7) = 10.', 'dp[B].excl = 3 + 7 = 10',
    P('If B is INCLUDED, may its children be included too?', 'Yes', 'No', false)));
  F.push(graphF(g, ['D 3', 'E 7', 'B 5'], 'B 5', [], 'They may not — that is the constraint. So dp[B].incl = 5 + dp[D].excl + dp[E].excl = 5 + 0 + 0 = 5. This is why the state needs a 0/1 dimension.', 'dp[B] = (excl 10, incl 5)'));
  F.push(graphF(g, ['F 2', 'G 9', 'C 8'], 'C 8', [], 'Same on the right: dp[C].excl = 2 + 9 = 11, dp[C].incl = 8 + 0 + 0 = 8.', 'dp[C] = (excl 11, incl 8)'));
  F.push(graphF(g, ['B 5', 'C 8', 'A 10'], 'A 10', [], 'Finally the root. Excluding A: max(10,5) + max(11,8) = 10 + 11 = 21. Including A: 10 + 10 + 11 = 31.', 'dp[A] = (excl 21, incl 31)'));
  F.push(graphF(g, ['A 10', 'D 3', 'E 7', 'F 2', 'G 9'], null, [], 'Answer 31: take A, D, E, F, G. Each node was visited exactly once — O(n), because a tree has no cycles for answers to loop around.', 'answer = 31 (A, D, E, F, G)',
    P('A 100,000-node path-shaped tree in Python. Any concern?', 'No', 'Yes — recursion depth', false)));
  F.push(graphF(g, [], null, [], 'Recursion depth. Python defaults to 1,000 frames, so deep trees need sys.setrecursionlimit or an iterative DFS — and a path-shaped tree is a realistic adversarial input.', 'post-order DFS, O(n), watch recursion depth'));
  return F;
}
function bitmask() {
  const F = [];
  const cities = ['A', 'B', 'C', 'D'];
  const n = 4;
  const cols = ['mask (binary)', 'visited set', 'best cost ending at each city'];
  const rowFor = (mask, hot) => ({
    label: `${mask}`,
    cells: [
      { t: mask.toString(2).padStart(n, '0'), s: hot ? 'hot' : 'on' },
      { t: '{' + cities.filter((c, i) => mask >> i & 1).join(',') + '}', s: hot ? 'hot' : 'on' },
      { t: hot ? 'computing…' : 'done', s: hot ? 'hot' : '' }
    ]
  });
  F.push(matF(cols, [rowFor(1, true)], `Travelling salesman over ${n} cities. The state we need is "which cities have I visited, and where am I now?"`, 'state: (visited set, current city)',
    P('Can a SET be stored as a single integer?', 'Yes', 'No', true)));
  F.push(matF(cols, [rowFor(1, true)], 'It can — one bit per city. mask 0001 means "only A visited". That packs the whole set into one number, so a dict keyed by (mask, city) memoises everything.', 'mask 0001 = {A}'));
  F.push(matF(cols, [rowFor(1, false), rowFor(3, true)], 'From A, go to B: set bit 1, giving mask 0011 = {A,B}. mask | (1 << j) is the entire "mark j as visited" operation.', 'mask | 1 << j'));
  F.push(matF(cols, [rowFor(1, false), rowFor(3, false), rowFor(5, true)], 'Or from A go to C: mask 0101 = {A,C}. Different path, different state, both cached separately.', 'mask 0101 = {A,C}',
    P('Do routes A→B→C and A→C→B share the same mask?', 'Yes', 'No', true)));
  F.push(matF(cols, [rowFor(7, true)], 'They do — both reach mask 0111 = {A,B,C}. But they end at DIFFERENT cities, which is why the state must include the current city. Without it the DP would be wrong.', 'mask 0111 — but ending city differs'));
  F.push(matF(cols, [rowFor(7, false), rowFor(15, true)], 'mask 1111 means everything is visited, so the only thing left is the trip home. That is the base case.', 'mask 1111 = all visited -> return home'));
  F.push(matF([['states'], ['transitions'], ['total']].map(x => x[0]), [
    { label: 'Held-Karp', cells: [{ t: '2^n × n', s: 'on' }, { t: 'n per state', s: 'on' }, { t: 'O(2^n · n²)', s: 'hot' }] },
    { label: 'Brute force', cells: [{ t: 'n! routes', s: 'on' }, { t: '—', s: '' }, { t: 'O(n!)', s: '' }] }
  ], 'Total: O(2^n · n²) — still exponential, but for n = 15 that is roughly 7 million operations versus 1.3 trillion for brute force. A vast improvement that is nonetheless not polynomial.', '2^n * n states, n transitions each',
    P('Roughly what n is the practical ceiling for this?', 'About 100', 'About 20', false)));
  F.push(matF(cols, [rowFor(15, false)], 'Around 20 — 2^20 states times n² transitions is feasible; beyond that memory explodes. Past that you switch to branch and bound, or approximation like Christofides, 2-opt or simulated annealing.', 'n <= ~20, then approximate'));
  F.push(matF(cols, [rowFor(7, false)], 'And a bonus: in ASSIGNMENT problems, popcount(mask) tells you which row you are on, so you get that dimension for free and halve the state space. Deriving one dimension from another is a general DP move worth stealing.', 'popcount gives a dimension free'));
  return F;
}

// ── dispatcher ──────────────────────────────────────────────────────────────
export function buildAdv(viz, opts) {
  const o = opts || {};
  const input = (String(o.input || '5,3,8,1,9,2,7,4').split(/[^0-9]+/).filter(Boolean).map(Number).filter(v => v > 0 && v < 100));
  const arr = input.length >= 3 ? input : [5, 3, 8, 1, 9, 2, 7, 4];
  switch (viz) {
    case 'heaptree': return heaptree();
    case 'heapbars': return heapbars();
    case 'trie': return trie();
    case 'dsu': return dsu();
    case 'segtree': return segtree();
    case 'fenwick': return fenwick();
    case 'avl': return avl();
    case 'probe': return probe();
    case 'lru': return lru();
    case 'bloom': return bloom();
    case 'wgraph': return wgraph();
    case 'dijkstra': return dijkstra();
    case 'bellman': return bellman();
    case 'floyd': return floyd();
    case 'toposort': return toposort();
    case 'kruskal': return kruskal();
    case 'prim': return prim();
    case 'astar': return astar();
    case 'scc': return scc();
    case 'maxflow': return maxflow();
    case 'twoptr': return twoptr(arr);
    case 'window': return window(arr);
    case 'prefix': return prefix(arr);
    case 'bsanswer': return bsanswer();
    case 'backtrack': return backtrack();
    case 'greedy': return greedy();
    case 'divconq': return divconq(arr);
    case 'bits': return bits();
    case 'kmp': return kmp();
    case 'sweep': return sweep();
    case 'memo': return memo();
    case 'dp1d': return dp1d();
    case 'knapsack': return knapsack();
    case 'coins': return coins();
    case 'lcs': return lcs();
    case 'edit': return edit();
    case 'lis': return lis(arr);
    case 'griddp': return griddp();
    case 'treedp': return treedp();
    case 'bitmask': return bitmask();
    default: return null;
  }
}
