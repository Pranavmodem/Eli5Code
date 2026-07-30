// Modules 5–6: Advanced Data Structures, Graph Algorithms.
// Lesson: { id, t, a, e, k, ap[], use[], py, v, q }
export const MODULES_56 = [
  {
    id: 'm5', n: 'Module 5', name: 'Advanced Data Structures', days: [46, 56],
    blurb: 'The structures that separate a working solution from a fast one: heaps, tries, disjoint sets, segment trees, and the internals of the map you use every day.',
    lessons: [
      {
        id: 'm5l1', t: 'Heaps & Priority Queues', a: 'A triage nurse, not a queue', v: 'heaptree',
        e: 'A normal queue serves whoever arrived first. A triage nurse ignores arrival order and always takes the most urgent patient next. A heap is that nurse: it does not keep everyone sorted, it only guarantees that the most urgent one is at the front, which is much cheaper than full sorting.',
        k: 'A binary heap is a complete binary tree stored in a flat array — children of index i live at 2i+1 and 2i+2, so no pointers are needed. The heap property (every parent ≤ its children, for a min-heap) is weaker than full ordering, which is exactly why push and pop are O(log n) rather than O(n log n): only one root-to-leaf path is repaired per operation. peek is O(1). Note the array is NOT sorted — heap order and sorted order are different invariants, and confusing them is the most common heap bug.',
        ap: [
          'Reach for a heap the moment the phrase "top k", "k smallest", "next most urgent" or "merge k sorted things" appears. Sorting everything is O(n log n); a size-k heap does it in O(n log k), which matters when n is huge and k is small.',
          'Python only ships a MIN-heap (heapq). For a max-heap, push negated values, or push tuples (-priority, item). Forgetting this is the single most common heapq mistake.',
          'Push tuples for tie-breaking: (priority, insertion_counter, item). Without the counter, Python will try to compare your items when priorities tie and raise TypeError on non-comparable objects.',
          'Do not use a heap if you need to search, delete an arbitrary element, or iterate in order — all of those are O(n). Use the lazy-deletion trick instead: mark entries stale and skip them on pop.'
        ],
        use: ['Every OS task scheduler and every event-driven simulation', "Dijkstra's and Prim's algorithms use one as their engine", 'Kafka/log compaction merging k sorted streams, and "top 10 trending" queries'],
        py: 'import heapq\n\nh = []\nheapq.heappush(h, (2, "ship it"))\nheapq.heappush(h, (1, "fix prod"))   # urgent\nheapq.heappush(h, (3, "refactor"))\n\nheapq.heappop(h)     # (1, "fix prod")\nh[0]                 # peek — O(1)\n\n# top-k without sorting everything: O(n log k)\nheapq.nlargest(3, scores)\n\n# max-heap: negate\nheapq.heappush(h, (-priority, item))',
        q: { q: 'Is the underlying array of a valid min-heap sorted?', o: ['Yes, always', 'No — only the root is guaranteed smallest', 'Only after heapify'], x: 1, w: 'The heap property is local (parent ≤ children). That weaker guarantee is what makes operations O(log n).' }
      },
      {
        id: 'm5l2', t: 'Heapify & Heapsort', a: 'Building the pile bottom-up', v: 'heapbars',
        e: 'You could build a heap by adding patients one at a time, sifting each into place. Or you could start with everyone in the room and fix the small groups first, then the bigger groups. Fixing from the bottom up turns out to be dramatically cheaper — and it is not obvious why.',
        k: 'Building a heap by n successive pushes costs O(n log n). Building it bottom-up (sift-down from index n//2−1 to 0) costs O(n): most nodes are near the leaves and sift down almost no levels, and the sum n/2·0 + n/4·1 + n/8·2 + … converges to n. Heapsort then repeatedly swaps the root to the end and sifts down the shrunk heap: O(n log n) worst case with O(1) auxiliary space and no recursion — the only common sort that is both in-place and guaranteed n log n. Its weakness is cache behaviour: root-to-leaf jumps scatter across memory, which is why quicksort usually wins wall-clock despite the worse bound.',
        ap: [
          'Use heapq.heapify(list) — it is the O(n) bottom-up build, not n pushes. If you have all the data up front, never loop pushes.',
          'Choose heapsort when you need a hard O(n log n) guarantee AND O(1) space — embedded systems, or defending against adversarial input that would trigger quicksort\'s O(n²).',
          'Introsort (C++ std::sort) starts with quicksort and switches to heapsort when recursion gets too deep. That hybrid is the practical answer: quicksort\'s speed with heapsort\'s guarantee.',
          'The bottom-up analysis is a genuinely useful reasoning tool: when work per item shrinks as you go, the sum can collapse a level below what the naive multiplication suggests.'
        ],
        use: ['heapq.heapify and C++ std::make_heap', 'Introsort — the fallback inside std::sort that prevents quicksort blowups', 'Embedded and real-time systems needing sorted output with zero extra allocation'],
        py: 'import heapq\n\na = [5, 3, 8, 1, 9, 2, 7, 4]\nheapq.heapify(a)      # O(n) bottom-up, in place\n\n# heapsort\ndef heapsort(a):\n    heapq.heapify(a)                       # O(n)\n    return [heapq.heappop(a) for _ in range(len(a))]\n\n# why bottom-up is O(n):\n# n/2 nodes sift 0 levels, n/4 sift 1, n/8 sift 2 ...\n# sum(k * n / 2**(k+1)) -> n',
        q: { q: 'Cost of building a heap bottom-up from n items?', o: ['O(n log n)', 'O(n)', 'O(n²)'], x: 1, w: 'Most nodes sit near the leaves and barely move; the series sums to n.' }
      },
      {
        id: 'm5l3', t: 'Tries / Prefix Trees', a: 'A signpost at every letter', v: 'trie',
        e: 'Imagine a hallway where each doorway is labelled with one letter. To find "car" you walk through C, then A, then R. Every word sharing the prefix "ca" walks the same first two doorways, so the shared beginning is stored exactly once — and standing in the "ca" room, everything reachable from here starts with "ca".',
        k: 'A trie stores keys along the edges of a tree, so lookup is O(m) in the key length — independent of how many keys are stored. That is its real advantage over a hash map: not raw speed, but that prefix queries are free. Downside is space: a naive dict-per-node trie has heavy per-node overhead. Compressed variants (radix / Patricia tries) merge single-child chains into one edge, and that is what production routing tables and IP lookups actually use. A suffix trie/array generalises this to substring search.',
        ap: [
          'The trigger phrase is "prefix" — autocomplete, longest-prefix match, "all words starting with", wildcard matching. If the problem never mentions prefixes, a hash map is simpler and smaller.',
          'Store an is_word flag on nodes, not just children. Otherwise you cannot distinguish "car" being a stored word from "car" merely being a prefix of "cart" — a classic off-by-one-concept bug.',
          'Memory is the real constraint. Use arrays of size 26 only when the alphabet is truly fixed and dense; otherwise a dict per node. If memory bites, compress single-child chains.',
          'For scoring/ranked autocomplete, store the best k completions at each node so a query does not have to walk the whole subtree.'
        ],
        use: ['Autocomplete and search suggestions in every search box', 'IP routing tables — longest-prefix match is a radix trie', 'Spellcheckers, T9 predictive text, and word-game solvers'],
        py: 'class Trie:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\n\n    def insert(self, word):\n        node = self\n        for ch in word:\n            node = node.children.setdefault(ch, Trie())\n        node.is_word = True          # matters!\n\n    def find(self, prefix):\n        node = self\n        for ch in prefix:\n            if ch not in node.children:\n                return None\n            node = node.children[ch]\n        return node                  # subtree = all completions\n\n# lookup is O(len(word)), NOT O(number of words)',
        q: { q: "A trie holds 10 million words. Cost of looking up a 5-letter word?", o: ['O(log 10M)', 'O(5)', 'O(10M)'], x: 1, w: 'Cost depends on key length only — the number of stored keys is irrelevant.' }
      },
      {
        id: 'm5l4', t: 'Union-Find (Disjoint Set Union)', a: 'Merging friend groups', v: 'dsu',
        e: 'Everyone starts in their own group. When two people become friends you merge their whole groups, and to check whether two people are already connected you just ask "do you have the same group leader?" Each person remembers who to ask, and after a while everyone points almost directly at the leader.',
        k: 'DSU maintains a forest where each set is a tree with its root as the representative. Two optimisations make it fast: union by rank/size (always attach the smaller tree under the larger, keeping depth low) and path compression (on every find, re-point every node visited directly at the root). Together they give an amortised cost of O(α(n)) — the inverse Ackermann function, which is below 5 for any n you will ever see, so effectively constant. Crucially DSU only answers "are these connected?" — it cannot un-merge, and it cannot tell you the path.',
        ap: [
          "Recognise it by the words connected, groups, components, merge, or cycle detection in an UNDIRECTED graph. If you find yourself running BFS repeatedly just to ask 'same component?', you want DSU.",
          'Always implement both optimisations. Path compression alone is O(log n); union by rank alone is O(log n); together they are effectively O(1). Two lines each, no excuse to skip them.',
          "Use it to make Kruskal's MST work: sort edges, and accept an edge only if its endpoints are in different sets. That single check is the whole cycle-avoidance logic.",
          'It cannot support deletion or rollback. If the problem removes edges over time, reverse the timeline and add them instead — offline processing in reverse is the standard trick.'
        ],
        use: ["Kruskal's MST, and cycle detection in undirected graphs", 'Connected components in image segmentation and flood-fill', 'Account/entity deduplication: merging records that turn out to be the same person'],
        py: 'class DSU:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.size = [1] * n\n\n    def find(self, x):\n        while self.parent[x] != x:\n            self.parent[x] = self.parent[self.parent[x]]  # compress\n            x = self.parent[x]\n        return x\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False                  # already together -> cycle\n        if self.size[ra] < self.size[rb]:  # union by size\n            ra, rb = rb, ra\n        self.parent[rb] = ra\n        self.size[ra] += self.size[rb]\n        return True',
        q: { q: 'union(a, b) returns False. What does that tell you?', o: ['The union failed', 'They were already in the same set — adding this edge makes a cycle', 'One index was invalid'], x: 1, w: 'That is exactly the cycle test Kruskal relies on.' }
      },
      {
        id: 'm5l5', t: 'Segment Trees', a: 'Nested summaries of a shelf', v: 'segtree',
        e: 'A long shelf of numbers. Someone keeps asking "what is the total between slot 3 and slot 9?" and also keeps changing individual slots. Instead of re-adding every time, you keep a pyramid of pre-computed totals: totals for pairs, then for quarters, then the whole shelf. Any range is a handful of those pre-computed blocks, and changing one slot only invalidates the blocks above it.',
        k: 'A segment tree stores an associative aggregate (sum, min, max, gcd) for every node covering a contiguous range, in a 4n array. Both range query and point update are O(log n) because any range decomposes into at most O(log n) canonical nodes, and an update touches only the root path. Lazy propagation extends it to range updates by storing pending operations at internal nodes and pushing them down only when needed. The requirement is associativity — you cannot segment-tree an aggregate that depends on element order in a non-associative way.',
        ap: [
          'The signature is interleaved queries and updates on ranges. If the array never changes, use a prefix-sum array instead — O(1) queries and far simpler. Only pay for a segment tree when updates are live.',
          'If you only need prefix sums with point updates, a Fenwick tree is shorter, faster and uses n space instead of 4n. Segment trees earn their keep for min/max/gcd or for range updates.',
          'Range update plus range query means lazy propagation. Do not attempt it without it — you will silently get wrong answers or O(n) updates.',
          'Sanity-check with a brute-force oracle: for random small inputs, compare against the naive loop. Segment tree index arithmetic is genuinely error-prone and this catches it immediately.'
        ],
        use: ['Competitive programming range-query problems, near-universally', 'Time-series and analytics engines answering windowed aggregates over live data', 'Collaborative editors and interval bookkeeping (which seats/slots are free in a range)'],
        py: 'class SegTree:\n    def __init__(self, a):\n        self.n = len(a)\n        self.t = [0] * (4 * self.n)\n        self._build(a, 1, 0, self.n - 1)\n\n    def _build(self, a, node, lo, hi):\n        if lo == hi:\n            self.t[node] = a[lo]; return\n        mid = (lo + hi) // 2\n        self._build(a, 2*node,   lo,      mid)\n        self._build(a, 2*node+1, mid + 1, hi)\n        self.t[node] = self.t[2*node] + self.t[2*node+1]\n\n    def query(self, node, lo, hi, l, r):\n        if r < lo or hi < l:  return 0            # disjoint\n        if l <= lo and hi <= r: return self.t[node]  # fully inside\n        mid = (lo + hi) // 2\n        return (self.query(2*node,   lo,      mid, l, r) +\n                self.query(2*node+1, mid + 1, hi,  l, r))',
        q: { q: 'The array never changes, but you get millions of range-sum queries. Best tool?', o: ['Segment tree', 'Prefix sum array — O(1) per query', 'Fenwick tree'], x: 1, w: 'No updates means no tree needed. Prefix sums answer any range in one subtraction.' }
      },
      {
        id: 'm5l6', t: 'Fenwick Tree (BIT)', a: 'Rulers of clever lengths', v: 'fenwick',
        e: 'You want running totals that survive edits. Each slot secretly stores the total of a block ending at itself, and the block lengths are powers of two chosen so that any prefix is the sum of a few non-overlapping blocks. Walking those blocks is just repeatedly stripping the lowest set bit off a number.',
        k: 'A Fenwick tree (binary indexed tree) stores, at index i, the sum of the i & -i elements ending at i. Prefix sum walks i -= i & -i; point update walks i += i & -i. Both are O(log n) with a single n-length array and a two-line loop — far smaller constants and memory than a segment tree. The cost of that elegance is restricted power: it natively handles invertible, associative aggregates (sums, XOR) so a range is prefix(r) − prefix(l−1). Min/max are not invertible, so they need a segment tree.',
        ap: [
          'This is your default for "point update + prefix/range sum". It is roughly ten lines, so there is no complexity excuse to reach for a segment tree first.',
          'It is 1-indexed in every clean implementation. Fighting to make it 0-indexed is the main source of Fenwick bugs — just add 1 at the boundary.',
          'Counting inversions is the classic non-obvious application: sweep the array, and for each element query how many already-seen values exceed it. Same trick counts "smaller elements to the right".',
          'i & -i isolates the lowest set bit. Understand that one expression and the whole structure stops being magic — it is the entire index arithmetic.'
        ],
        use: ['Counting inversions and rank queries in O(n log n)', 'Live leaderboards: "what rank is this score?" with scores updating constantly', 'Database query planners maintaining running frequency statistics'],
        py: 'class Fenwick:\n    def __init__(self, n):\n        self.n = n\n        self.t = [0] * (n + 1)        # 1-indexed!\n\n    def add(self, i, delta):\n        while i <= self.n:\n            self.t[i] += delta\n            i += i & -i               # next block up\n\n    def prefix(self, i):\n        s = 0\n        while i > 0:\n            s += self.t[i]\n            i -= i & -i               # strip lowest set bit\n        return s\n\n    def range_sum(self, l, r):\n        return self.prefix(r) - self.prefix(l - 1)',
        q: { q: 'Why can a plain Fenwick tree not answer range MINIMUM queries?', o: ['It is too slow', 'min has no inverse, so prefix(r) minus prefix(l-1) is meaningless', 'It only stores integers'], x: 1, w: 'Fenwick relies on subtracting prefixes. That needs an invertible operation — sums work, min does not.' }
      },
      {
        id: 'm5l7', t: 'Self-Balancing Trees & Rotations', a: 'Straightening a leaning tower', v: 'avl',
        e: 'A search tree only stays fast if it stays bushy. Insert numbers in increasing order into a naive tree and you get a straight line — a linked list wearing a tree costume, and every search walks the whole thing. A self-balancing tree notices when one side is getting too tall and performs a small local rearrangement to straighten it.',
        k: 'A rotation is a constant-time, local restructuring that changes height while preserving the in-order sequence — the invariant that makes it legal. AVL trees keep every node\'s subtree heights within 1, giving tighter balance and faster lookups; red-black trees allow looser balance with fewer rotations per write, so they win on write-heavy workloads (which is why they back most standard libraries). Both guarantee O(log n) search, insert and delete. B-trees generalise the idea to high fan-out nodes sized to a disk page, minimising I/O rather than comparisons — which is why databases use them and not AVL.',
        ap: [
          'You will almost never implement one. What you must know is the failure mode: any tree-shaped structure fed sorted input degrades to O(n) unless it self-balances. That is a real production bug, not a textbook footnote.',
          'Choose by workload: read-heavy and latency-sensitive → AVL-like tight balance. Write-heavy → red-black. On-disk or huge → B-tree/B+tree, because the cost is page reads, not comparisons.',
          "Python has no built-in balanced tree. Use the sortedcontainers library, or bisect.insort on a list when n is small (insort is O(n) due to shifting — fine to a few thousand, not beyond).",
          'The in-order sequence is invariant under rotation. If you ever debug a rotation, verify that first — if the in-order walk changed, the rotation is wrong.'
        ],
        use: ['Database and filesystem indexes (B+trees) — the reason a WHERE clause is fast', 'std::map, TreeMap, and most ordered-map implementations (red-black)', 'In-memory ordered indexes for range scans and "next largest key" queries'],
        py: '# Right rotation — O(1), and the in-order walk is unchanged\ndef rotate_right(y):\n    x = y.left\n    y.left = x.right\n    x.right = y\n    return x            # x is the new subtree root\n\ndef height(n):  return 0 if n is None else n.height\ndef balance(n): return height(n.left) - height(n.right)\n# AVL invariant: abs(balance(n)) <= 1 for every node\n\n# In practice, in Python:\nfrom sortedcontainers import SortedDict\nd = SortedDict()\nd.irange(10, 20)      # ordered range query',
        q: { q: 'You insert 1,2,3,…,n into a plain (non-balancing) BST. Search cost?', o: ['O(log n)', 'O(n) — it degenerated into a list', 'O(1)'], x: 1, w: 'Sorted input is the worst case for an unbalanced tree. Balancing exists precisely to prevent this.' }
      },
      {
        id: 'm5l8', t: 'Hash Map Internals: Probing & Resizing', a: 'Looking for the next free seat', v: 'probe',
        e: 'Chaining keeps a little list on each page. Open addressing does something different: if your seat is taken, you walk to the next free seat and sit there. Fast, because everything stays in one tidy block of memory — but deleting someone leaves a hole that can break the trail for whoever came after them.',
        k: 'Open addressing stores entries directly in the table and resolves collisions by probing: linear (i+1, cache-friendly but suffers primary clustering), quadratic (i+k², spreads clusters), or double hashing (step size from a second hash, best distribution). Deletion cannot simply clear a slot — that would truncate probe chains — so implementations write a tombstone, and tombstones accumulate until a rehash clears them. CPython dicts use open addressing with a compact-array indirection that also preserves insertion order. Everything hinges on load factor: past roughly 0.7 probe sequences lengthen sharply, so the table resizes and rehashes every key.',
        ap: [
          "Never mutate an object after using it as a dict key. Its hash changes, so it lands in the wrong slot and becomes invisible — this is why Python forbids list keys and why dataclasses need frozen=True to be hashable.",
          'If you insert a known number of items, pre-size the container. Repeated rehashing is a real cost in hot paths and shows up as mysterious latency spikes.',
          'Iteration order is an implementation detail you should not rely on across languages. CPython 3.7+ guarantees insertion order; that is a Python promise, not a hash-map property.',
          'A user-controlled key space plus a weak hash is a denial-of-service vector: an attacker forces every key into one bucket and turns O(1) into O(n). Randomised hash seeds exist for this reason.'
        ],
        use: ['CPython dict and set — the structure behind almost every Python program you write', 'Redis and Memcached lookup tables', 'Compiler symbol tables and JIT inline caches'],
        py: '# open addressing with linear probing + tombstones\nEMPTY, TOMB = object(), object()\n\ndef find_slot(table, key):\n    i = hash(key) % len(table)\n    while table[i] is not EMPTY:\n        if table[i] is not TOMB and table[i][0] == key:\n            return i                    # found\n        i = (i + 1) % len(table)        # probe on\n    return None\n\n# deleting must leave a TOMB, never EMPTY,\n# or later probes stop early and lose entries\n\n# load factor > ~0.7 -> resize and rehash everything',
        q: { q: 'Why does deletion in open addressing write a tombstone instead of clearing the slot?', o: ['To save memory', 'An empty slot would end probe sequences early and hide later entries', 'To keep insertion order'], x: 1, w: 'The probe chain must stay walkable. A tombstone says "keep looking", an empty slot says "stop".' }
      },
      {
        id: 'm5l9', t: 'Designing an LRU Cache', a: 'A desk with limited space', v: 'lru',
        e: 'Your desk holds five books. Every time you use one you put it back on the left. When a sixth arrives, you get rid of whatever is furthest right — the one you have not touched in the longest time. The trick is doing both the "find a book instantly" part and the "know which is oldest" part at the same time.',
        k: 'LRU needs O(1) lookup AND O(1) recency reordering, and no single structure gives both — so you compose two: a hash map for key → node, and a doubly linked list holding nodes in recency order. Lookup goes through the map; promotion unlinks the node and re-inserts at the head, which needs prev pointers, which is exactly why the list must be doubly linked. Eviction removes the tail. Python\'s functools.lru_cache and OrderedDict.move_to_end are this structure. The alternative policies matter too: LFU counts frequency, and modern caches use adaptive or segmented schemes because pure LRU is defeated by a single large scan flushing everything useful.',
        ap: [
          'This is the canonical "compose two structures" design problem and a staple interview question. The insight to state out loud is that no single structure does both jobs — that is the whole answer.',
          'Use a sentinel head and tail node. It removes every null check from unlink/insert and eliminates the bugs that make this problem fiddly.',
          'In production, reach for functools.lru_cache or cachetools before writing your own. Write it by hand only to learn it, or when you need custom eviction.',
          'Know when LRU is wrong: a one-off full-table scan evicts your whole hot set. If your access pattern has scans, look at LFU, ARC or segmented LRU instead.'
        ],
        use: ['functools.lru_cache, and every HTTP/CDN and browser cache', 'Database buffer pools and OS page replacement', 'Session and API-response caches in front of an expensive backend'],
        py: 'from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n\n    def get(self, k):\n        if k not in self.d:\n            return -1\n        self.d.move_to_end(k)          # promote — O(1)\n        return self.d[k]\n\n    def put(self, k, v):\n        if k in self.d:\n            self.d.move_to_end(k)\n        self.d[k] = v\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)  # evict oldest\n\n# hash map = O(1) find, linked list = O(1) reorder\nfrom functools import lru_cache        # the real one',
        q: { q: 'Why must the recency list be DOUBLY linked?', o: ['To iterate backwards', 'To unlink a node in O(1) without searching for its predecessor', 'To store more data'], x: 1, w: 'Promotion means unlinking from the middle. Without prev, finding the predecessor is O(n) and the whole design collapses.' }
      },
      {
        id: 'm5l10', t: 'Bloom Filters', a: 'A bouncer with a bad memory', v: 'bloom',
        e: 'A bouncer cannot remember every face, so instead he remembers a few rough features of everyone who came in. If your features do not match, you definitely have not been here. If they do match, you probably have — but he might be confusing you with someone else. He is never wrong when he says no.',
        k: 'A Bloom filter is a bit array plus k independent hash functions. Insert sets k bits; a query returns "possibly present" only if all k bits are set. False positives are possible, false negatives are impossible — that asymmetry is the entire value. It stores no elements at all, so memory is a few bits per item regardless of item size, and the false-positive rate is tunable: about (1 − e^(−kn/m))^k, minimised at k = (m/n)·ln2. Plain Bloom filters cannot delete (clearing a bit would break other entries) — counting Bloom filters or cuckoo filters solve that.',
        ap: [
          'Use it as a cheap gatekeeper in front of an expensive lookup: check the filter, and only hit disk or the network when it says "maybe". The false positives just cost you an occasional wasted lookup.',
          'Size it deliberately from your target false-positive rate and expected n, before you build it. An undersized filter silently degrades until nearly every query is a false positive.',
          'Never use one where a false positive is unsafe. "Probably in the set" is unacceptable for authorisation or billing, and fine for "have I already crawled this URL".',
          'If you need deletion or counts, you need a counting Bloom or cuckoo filter — do not try to unset bits in a standard one.'
        ],
        use: ['Cassandra, HBase and LevelDB avoiding disk reads for absent keys', 'Chrome historically checked malicious URLs against a local filter first', 'Crawlers deduplicating billions of URLs, and CDNs deciding what is worth caching'],
        py: 'import hashlib\n\nclass Bloom:\n    def __init__(self, m=1024, k=3):\n        self.m, self.k = m, k\n        self.bits = bytearray(m)\n\n    def _hashes(self, item):\n        h = hashlib.sha256(str(item).encode()).digest()\n        return [int.from_bytes(h[i*4:(i+1)*4], "big") % self.m\n                for i in range(self.k)]\n\n    def add(self, item):\n        for i in self._hashes(item):\n            self.bits[i] = 1\n\n    def __contains__(self, item):\n        return all(self.bits[i] for i in self._hashes(item))\n        # True  -> PROBABLY present\n        # False -> DEFINITELY absent',
        q: { q: 'A Bloom filter says an item is absent. How sure can you be?', o: ['Certain — false negatives are impossible', 'Fairly sure', 'Not sure at all'], x: 0, w: 'That one-sided guarantee is the whole point: "no" is always trustworthy, "yes" is only probable.' }
      }
    ]
  },
  {
    id: 'm6', n: 'Module 6', name: 'Graph Algorithms', days: [57, 67],
    blurb: 'Weights change everything. Shortest paths, spanning trees, orderings and flow — with the reasoning for choosing between them.',
    lessons: [
      {
        id: 'm6l1', t: 'Weighted Graphs & Representations', a: 'Roads have lengths', v: 'wgraph',
        e: 'Until now every road took the same effort to walk. Real maps are not like that: some roads are motorways and some are muddy tracks. Once edges have costs, "fewest roads" and "shortest journey" stop being the same question — and the tool that answered the first one stops working.',
        k: 'A weighted graph attaches a cost to each edge, which breaks BFS: BFS finds minimum edge COUNT, not minimum total weight. Representation drives everything downstream. An adjacency list is O(V+E) space with O(deg) neighbour iteration — right for sparse graphs, which is nearly all real ones. An adjacency matrix is O(V²) with O(1) edge lookup — right for dense graphs and for Floyd-Warshall. An edge list is right when you iterate all edges, as Kruskal and Bellman-Ford do. Directed vs undirected, and the presence of negative weights or cycles, then determine which algorithm is even legal.',
        ap: [
          'Before choosing an algorithm, answer four questions: directed or not, weighted or not, any negative weights, and single-source or all-pairs. Those four answers pick the algorithm almost deterministically.',
          'Unweighted (or all-equal weights) means plain BFS — do not reach for Dijkstra. It is strictly more machinery for the same answer.',
          'Default to an adjacency list as defaultdict(list) of (neighbour, weight) tuples. Switch to a matrix only for dense graphs or Floyd-Warshall.',
          'For undirected graphs remember to add both directions. Forgetting the reverse edge is the most common graph-setup bug and produces answers that look plausible but are wrong.'
        ],
        use: ['Maps and navigation: distance, time, fuel or toll as the weight', 'Network routing where weight is latency or cost', 'Dependency graphs with build times, and pipelines with transfer costs'],
        py: 'from collections import defaultdict\n\n# adjacency list — O(V + E), right for sparse graphs\ng = defaultdict(list)\ndef add_edge(u, v, w, directed=False):\n    g[u].append((v, w))\n    if not directed:\n        g[v].append((u, w))    # do not forget this\n\n# adjacency matrix — O(V^2), O(1) edge lookup\nINF = float("inf")\nm = [[INF] * n for _ in range(n)]\nm[u][v] = w\n\n# edge list — for Kruskal / Bellman-Ford\nedges = [(w, u, v), ...]\n\n# BFS gives fewest EDGES. Weighted shortest path needs Dijkstra.',
        q: { q: 'All edges are weighted 1 except one weighted 100. Does BFS find the cheapest path?', o: ['Yes', 'No — BFS minimises edge count, not total weight', 'Only if the graph is a tree'], x: 1, w: 'BFS would happily take the 100-weight edge if it means one fewer hop.' }
      },
      {
        id: 'm6l2', t: "Dijkstra's Algorithm", a: 'Always explore the nearest unvisited town', v: 'dijkstra',
        e: 'You are mapping travel times from home. You keep a best-known time to every town, all starting at infinity. Then you repeatedly walk to the nearest town you have not settled yet, and from there check whether going through it gives a faster route to its neighbours. Because you always settle the closest one first, once a town is settled you can never find a shorter way to it.',
        k: 'Dijkstra grows a set of settled vertices in non-decreasing distance order, using a min-heap keyed by tentative distance. Each pop settles a vertex; each edge may trigger a decrease-key, implemented in practice by pushing a duplicate and skipping stale pops. Complexity is O((V+E) log V) with a binary heap. The correctness argument requires NON-NEGATIVE weights: settling the closest unsettled vertex is only safe if no later path can reduce it, and a negative edge destroys that. Dijkstra with negative weights does not merely run slowly — it returns wrong answers, silently.',
        ap: [
          'The moment weights are non-negative and you need single-source shortest paths, this is the answer. Recognise it from "fastest route", "minimum cost to reach", "cheapest path".',
          'Use lazy deletion: push (dist, node) duplicates and skip a pop if dist > best[node]. Implementing a real decrease-key is rarely worth the complexity in Python.',
          'To recover the actual path, store a parent pointer whenever you improve a distance, then walk parents backwards from the target. Most people forget this until they need the route, not just the cost.',
          'If ANY edge can be negative, switch to Bellman-Ford. Do not try to patch Dijkstra by adding a constant to all weights — that changes which path is shortest, because longer paths accumulate more constants.'
        ],
        use: ['Google/Apple Maps routing, and every GPS device', 'OSPF and IS-IS internet routing protocols', 'Game pathfinding costs, and cheapest-conversion paths in currency or logistics networks'],
        py: 'import heapq\n\ndef dijkstra(g, src):\n    dist = {src: 0}\n    parent = {}\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist.get(u, float("inf")):\n            continue                     # stale entry\n        for v, w in g[u]:\n            nd = d + w\n            if nd < dist.get(v, float("inf")):\n                dist[v] = nd\n                parent[v] = u            # for path recovery\n                heapq.heappush(pq, (nd, v))\n    return dist, parent\n\n# O((V + E) log V). NON-NEGATIVE weights only.',
        q: { q: 'Your graph has one edge of weight −3. What does Dijkstra do?', o: ['Runs slower but is correct', 'Can return a wrong answer with no error', 'Raises an exception'], x: 1, w: 'The greedy "settle the nearest" argument breaks. It fails silently, which is far worse than crashing.' }
      },
      {
        id: 'm6l3', t: 'Bellman-Ford & Negative Edges', a: 'Rumours spreading one hop per round', v: 'bellman',
        e: 'Instead of cleverly picking who to visit next, you brute-force it: every round, you look at every road and see whether it improves any known distance. After one round every one-road route is known, after two rounds every two-road route, and so on. Slower, but it copes with roads that somehow give you time back — and it can spot a loop that makes you infinitely early.',
        k: 'Bellman-Ford relaxes all E edges V−1 times, which suffices because any shortest path uses at most V−1 edges. This gives O(V·E) — slower than Dijkstra but it tolerates negative weights, because it never commits to a vertex being settled. Run one extra iteration: if any distance still improves, a negative cycle is reachable and no shortest path exists. That detection capability is often the real reason to choose it. SPFA is a queue-based optimisation with good average behaviour and the same worst case, and the distributed version of this idea is distance-vector routing.',
        ap: [
          'Choose it when negative weights are possible, or when you specifically need to DETECT a negative cycle. Otherwise Dijkstra is faster.',
          'Add the V-th iteration for cycle detection. Without it you get numbers that look fine but are meaningless in the presence of a negative cycle.',
          'Early-exit when a full pass makes no changes — on typical graphs it converges long before V−1 rounds and this is a large practical speedup.',
          'The classic application is currency arbitrage: take −log of exchange rates, and a negative cycle is a profitable loop. Recognising that transformation is worth more than memorising the loop.'
        ],
        use: ['Currency arbitrage detection via negative cycles', 'RIP and distance-vector routing protocols', 'Constraint systems with difference inequalities, and a subroutine inside Johnson\'s all-pairs algorithm'],
        py: 'def bellman_ford(n, edges, src):\n    INF = float("inf")\n    dist = [INF] * n\n    dist[src] = 0\n\n    for _ in range(n - 1):               # V-1 rounds\n        changed = False\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                changed = True\n        if not changed:\n            break                        # early exit\n\n    for u, v, w in edges:                 # one extra round\n        if dist[u] + w < dist[v]:\n            raise ValueError("negative cycle reachable")\n    return dist\n\n# O(V * E) — handles negative weights',
        q: { q: 'Why exactly V−1 relaxation rounds?', o: ['It is empirical', 'A shortest path visits at most V vertices, so uses at most V−1 edges', 'To match Dijkstra'], x: 1, w: 'Each round guarantees all shortest paths of one more edge. V−1 edges is the maximum a simple path can have.' }
      },
      {
        id: 'm6l4', t: 'Floyd-Warshall (All-Pairs)', a: 'Would going via this city help?', v: 'floyd',
        e: 'You want the travel time between every pair of towns. So you go through the towns one at a time and ask a single question: "for every pair, would routing through THIS town be quicker than what I already know?" Three nested loops, and after considering every town as a possible waypoint, every pair is optimal.',
        k: 'Floyd-Warshall is dynamic programming over the set of permitted intermediate vertices: after processing k, dist[i][j] is the shortest path using only vertices 1..k as waypoints. Hence the loop order is non-negotiable — k must be the OUTER loop. It runs in O(V³) time and O(V²) space, handles negative edges, and detects negative cycles via a negative value on the diagonal. For dense graphs it beats running Dijkstra V times; for sparse graphs V×Dijkstra or Johnson\'s algorithm wins. The same recurrence computes transitive closure by swapping min/+ for or/and.',
        ap: [
          'Use it when V is small (roughly ≤ 400) and you need all pairs, or when the graph is dense. Its unbeatable virtue is that it is five lines and hard to get wrong.',
          'Put k in the outer loop. Swapping the loop order is the classic bug: it compiles, runs, and produces subtly wrong distances.',
          'Initialise dist[i][i] = 0 and everything else to infinity, and after running, a negative dist[i][i] means a negative cycle through i.',
          'The same triple loop solves reachability (transitive closure), maximum-capacity paths and minimum-bottleneck paths by changing the combining operation. Recognising that pattern generalises the technique well beyond distances.'
        ],
        use: ['Small dense networks needing every-pair latency, e.g. datacenter topologies', 'Transitive closure in type checkers and reachability analysis', 'Game maps and board analysis where all-pairs distances are precomputed once'],
        py: 'def floyd_warshall(dist):\n    n = len(dist)\n    for k in range(n):            # k MUST be outermost\n        for i in range(n):\n            dik = dist[i][k]\n            if dik == float("inf"):\n                continue\n            for j in range(n):\n                if dik + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dik + dist[k][j]\n    for i in range(n):\n        if dist[i][i] < 0:\n            raise ValueError("negative cycle through", i)\n    return dist\n\n# O(V^3) time, O(V^2) space. Negative edges fine.',
        q: { q: 'What breaks if you make k the innermost loop?', o: ['Nothing, order is irrelevant', 'The DP invariant breaks and distances come out wrong', 'It becomes O(V⁴)'], x: 1, w: 'The invariant is "all waypoints up to k considered". Only k as the outer loop maintains it.' }
      },
      {
        id: 'm6l5', t: 'Topological Sort', a: 'Getting dressed in a valid order', v: 'toposort',
        e: 'Socks before shoes, shirt before jacket. Some things have no relationship at all — trousers and shirt, either order. A topological sort produces any sequence that respects every "must come before" rule. And if your rules form a loop, no valid order exists, which is itself the useful answer.',
        k: 'A topological order exists if and only if the directed graph is acyclic. Two standard algorithms, both O(V+E): Kahn\'s algorithm repeatedly removes vertices with in-degree zero using a queue and reports a cycle if it terminates before emitting all vertices; the DFS approach emits vertices on post-order and reverses, detecting cycles via a node currently on the recursion stack (grey in the white/grey/black colouring). Kahn\'s is easier to adapt to lexicographic order (use a heap) and to level-by-level scheduling; DFS is more natural when you are already recursing.',
        ap: [
          'Recognise it from prerequisites, dependencies, build order, "course schedule", "task ordering". If the problem says "is this even possible?", the real question is cycle detection.',
          'Prefer Kahn\'s when you also need cycle reporting or deterministic output — swap the queue for a heap and you get the lexicographically smallest valid order.',
          'For cycle detection in DFS you need THREE states, not two. A node merely visited is fine; a node on the current recursion stack is a back edge and therefore a cycle.',
          'The longest path through the DAG is the critical path, and it tells you the minimum possible completion time. That is how build systems and project schedulers turn this into an estimate.'
        ],
        use: ['Build systems: make, Bazel, webpack module ordering', 'pip and npm dependency resolution, including circular-dependency errors', 'Database migration ordering, spreadsheet formula recalculation, and CI job DAGs'],
        py: 'from collections import deque, defaultdict\n\ndef topo_sort(n, edges):\n    g = defaultdict(list)\n    indeg = [0] * n\n    for u, v in edges:            # u must come before v\n        g[u].append(v)\n        indeg[v] += 1\n\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in g[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n\n    if len(order) != n:\n        raise ValueError("cycle — no valid order exists")\n    return order\n\nimport graphlib          # stdlib since 3.9\nlist(graphlib.TopologicalSorter(deps).static_order())',
        q: { q: "Kahn's algorithm emits only 7 of 10 vertices. What does that mean?", o: ['A bug in the queue', 'There is a cycle among the remaining 3', 'The graph is disconnected'], x: 1, w: 'Vertices in a cycle never reach in-degree zero, so they are never emitted. That is the cycle test.' }
      },
      {
        id: 'm6l6', t: "Kruskal's MST", a: 'Cheapest cables first', v: 'kruskal',
        e: 'You must connect every building with cable, using as little cable as possible. Sort every possible cable run from cheapest to most expensive, then lay them one by one — but skip any cable joining two buildings that are already connected somehow, because that would just make a redundant loop.',
        k: 'Kruskal sorts all edges by weight and greedily accepts an edge unless it would form a cycle, tested in near-constant time with union-find. Complexity is O(E log E) dominated by the sort. Correctness rests on the cut property: for any partition of the vertices, the lightest edge crossing it belongs to some MST — so the greedy choice is always safe. It naturally produces a minimum spanning FOREST on disconnected graphs. Compared with Prim, Kruskal is edge-centric and better on sparse graphs and when edges arrive pre-sorted; Prim is vertex-centric and better on dense ones.',
        ap: [
          'Recognise MST from "connect everything at minimum total cost" with no source vertex and no path requirement. If the problem asks about a path between two nodes, it is shortest-path, not MST — these get confused constantly.',
          'Kruskal is the easier one to write correctly: sort, then union-find. If you know DSU, you know Kruskal.',
          "An MST minimises TOTAL weight, not the distance between any particular pair. The path between two nodes in an MST is often not their shortest path.",
          'Maximum spanning tree is the same algorithm with the sort reversed. Minimum-bottleneck (minimise the largest single edge) is also solved by the MST — a genuinely useful fact.'
        ],
        use: ['Network and utility layout: cabling, water, power distribution', 'Clustering — cut the k−1 heaviest MST edges to get k clusters (single-linkage)', 'Image segmentation, and approximation algorithms for travelling-salesman tours'],
        py: 'def kruskal(n, edges):        # edges: (w, u, v)\n    dsu = DSU(n)\n    mst, total = [], 0\n    for w, u, v in sorted(edges):        # cheapest first\n        if dsu.union(u, v):              # False => cycle, skip\n            mst.append((u, v, w))\n            total += w\n        if len(mst) == n - 1:\n            break                        # spanning tree complete\n    return mst, total\n\n# O(E log E) — the sort dominates\n# maximum spanning tree: sorted(edges, reverse=True)',
        q: { q: 'Kruskal skips an edge. Why?', o: ['It was too expensive', 'Its endpoints are already connected, so it would create a cycle', 'It was a duplicate'], x: 1, w: 'The union-find check is the cycle test — that is the whole of Kruskal beyond the sort.' }
      },
      {
        id: 'm6l7', t: "Prim's MST", a: 'Grow one blob outwards', v: 'prim',
        e: 'Rather than considering all cables globally, start at one building and grow a single connected blob. Each step, look at every cable leaving the blob and take the cheapest one that reaches a new building. The blob only ever grows, and it is always connected.',
        k: 'Prim maintains a connected tree and repeatedly adds the minimum-weight edge crossing from the tree to an unvisited vertex, using a min-heap of candidate edges. With a binary heap it is O(E log V); with a Fibonacci heap O(E + V log V); with a plain array O(V²), which is actually optimal for dense graphs. Its correctness rests on the same cut property as Kruskal. The structural difference is that Prim keeps one connected component throughout while Kruskal may hold many fragments until the end — which makes Prim the natural choice when the graph is dense or given as a matrix, and Kruskal better when edges are sparse or already sorted.',
        ap: [
          "Choose Prim over Kruskal when the graph is dense or represented as a matrix — with an array-based key you get O(V²) and skip sorting E ≈ V² edges entirely.",
          'The implementation is nearly identical to Dijkstra: same heap loop, but the key is the edge weight rather than the accumulated distance. Confusing those two keys is the classic Prim bug — and it silently produces a shortest-path tree instead of an MST.',
          'Mark vertices visited on POP, not on push, and skip already-visited pops. Otherwise stale heap entries add duplicate edges.',
          'For a complete graph built from coordinates (Euclidean MST), Prim with an array beats materialising all V² edges for Kruskal — both in memory and in time.'
        ],
        use: ['Dense-network design and Euclidean MST from point sets', 'Maze generation using randomised Prim', 'Circuit and VLSI routing, and hierarchical clustering'],
        py: 'import heapq\n\ndef prim(g, start=0):\n    visited = set()\n    pq = [(0, start)]\n    total, edges = 0, 0\n    while pq and len(visited) < len(g):\n        w, u = heapq.heappop(pq)\n        if u in visited:\n            continue                 # stale entry\n        visited.add(u)               # mark on POP\n        total += w\n        for v, wt in g[u]:\n            if v not in visited:\n                heapq.heappush(pq, (wt, v))   # key = EDGE weight,\n                                              # not accumulated dist\n    return total\n\n# O(E log V). Compare Dijkstra: nd = d + w  <- accumulates',
        q: { q: 'What is the one line that differs between Prim and Dijkstra?', o: ['The heap type', 'The key pushed: Prim pushes the edge weight, Dijkstra the accumulated distance', 'The visited set'], x: 1, w: 'Same loop, different key. Push d+w and you get a shortest-path tree instead of an MST.' }
      },
      {
        id: 'm6l8', t: 'A* Search', a: 'Dijkstra with a compass', v: 'astar',
        e: 'Dijkstra explores in every direction equally, like a ripple. But if you know roughly which way the destination lies, why explore backwards? A* adds a guess of the remaining distance to each candidate, so it leans towards the goal — the same guarantee, a fraction of the exploration.',
        k: 'A* orders its frontier by f(n) = g(n) + h(n), where g is the cost so far and h is a heuristic estimate of the remaining cost. If h is admissible (never overestimates) A* returns an optimal path; if h is also consistent/monotone, no node is expanded twice. h = 0 degenerates to Dijkstra; an inflated h (weighted A*) explores far less but may return a suboptimal path — a deliberate, tunable trade. On a grid the heuristic must match the movement model: Manhattan for 4-directional, octile for 8-directional, Euclidean for any-angle. Using Euclidean on a 4-directional grid is still admissible but weaker, and therefore slower.',
        ap: [
          'Use A* whenever you have a spatial or otherwise estimable target. On large maps it is often an order of magnitude less work than Dijkstra for an identical answer.',
          'Match the heuristic to the movement rules. The rule is simple: h must never exceed the true remaining cost. Overestimate and you lose the optimality guarantee — sometimes acceptable, but know you are choosing it.',
          'For games, weighted A* (f = g + 1.5h) or jump-point search buys big speedups where "good enough and fast" beats "provably optimal".',
          'If you are running the same queries repeatedly on a static map, precompute: contraction hierarchies or landmark heuristics (ALT) are what real routing engines use, and they dwarf plain A*.'
        ],
        use: ['Game pathfinding — the default in essentially every engine', 'Robot motion planning and warehouse AGV routing', 'Puzzle solving (15-puzzle, Rubik\'s) and as the basis of production route planners'],
        py: 'import heapq\n\ndef astar(start, goal, neighbours, h):\n    g = {start: 0}\n    pq = [(h(start), 0, start)]\n    parent = {}\n    while pq:\n        f, gu, u = heapq.heappop(pq)\n        if u == goal:\n            return gu, parent\n        if gu > g.get(u, float("inf")):\n            continue\n        for v, w in neighbours(u):\n            ng = gu + w\n            if ng < g.get(v, float("inf")):\n                g[v] = ng\n                parent[v] = u\n                heapq.heappush(pq, (ng + h(v), ng, v))\n    return None, parent\n\n# 4-dir grid: h = abs(dx) + abs(dy)      (Manhattan)\n# 8-dir grid: h = octile distance\n# h = 0  ->  this IS Dijkstra',
        q: { q: 'Your heuristic sometimes OVERestimates the remaining distance. Consequence?', o: ['A* gets slower', 'A* may return a suboptimal path', 'A* loops forever'], x: 1, w: 'Admissibility (never overestimate) is exactly what buys the optimality guarantee.' }
      },
      {
        id: 'm6l9', t: 'Strongly Connected Components', a: 'Neighbourhoods you can circle', v: 'scc',
        e: 'On a map of one-way streets, some clusters let you drive from anywhere to anywhere and back. Others you can enter but never leave. Finding those mutually-reachable clusters lets you shrink the whole messy map into a clean flowchart with no loops at all.',
        k: 'A strongly connected component is a maximal set of vertices mutually reachable in a directed graph. Kosaraju finds them with two passes: DFS to get a finishing order, then DFS on the reversed graph in that order. Tarjan does it in a single pass using discovery indices and a low-link value, tracking an explicit stack. Both are O(V+E). The payoff is the condensation graph — contract each SCC to a single node and the result is always a DAG, so you can topologically sort it and run DAG algorithms on a graph that originally had cycles. That reduction is the real reason to learn this.',
        ap: [
          'Recognise it from mutual reachability, cycles in a DIRECTED graph, or "can these two reach each other?". Undirected connectivity is just DSU or BFS — SCC is specifically a directed-graph concept.',
          'Condense to the DAG. Almost every hard directed-graph problem with cycles becomes tractable once you contract SCCs and topologically sort the result.',
          'Kosaraju is easier to remember and debug (two plain DFS passes). Tarjan is one pass and faster but the low-link bookkeeping is easy to get subtly wrong — pick based on whether you need the speed.',
          'The canonical application is 2-SAT: build the implication graph, and the formula is satisfiable exactly when no variable shares an SCC with its own negation. Worth knowing as a reduction pattern.'
        ],
        use: ['Deadlock detection, and circular-import/circular-dependency analysis', 'Compiler optimisation: contracting cycles in call and dataflow graphs', 'Web-graph analysis (link farms), social-network cluster detection, and 2-SAT solvers'],
        py: 'def kosaraju(n, g, rg):\n    seen, order = set(), []\n\n    def dfs1(u):\n        seen.add(u)\n        for v in g[u]:\n            if v not in seen:\n                dfs1(v)\n        order.append(u)              # finishing order\n\n    for u in range(n):\n        if u not in seen:\n            dfs1(u)\n\n    comp, sccs = {}, []\n    def dfs2(u, cid):\n        comp[u] = cid\n        sccs[cid].append(u)\n        for v in rg[u]:              # REVERSED graph\n            if v not in comp:\n                dfs2(v, cid)\n\n    for u in reversed(order):\n        if u not in comp:\n            sccs.append([])\n            dfs2(u, len(sccs) - 1)\n    return sccs      # contract these -> always a DAG',
        q: { q: 'You contract every SCC into a single node. What are you guaranteed?', o: ['A tree', 'A DAG — no cycles remain', 'A complete graph'], x: 1, w: 'Any remaining cycle would mean those SCCs were mutually reachable, so they would have been one SCC.' }
      },
      {
        id: 'm6l10', t: 'Max Flow & Min Cut', a: 'Water through pipes', v: 'maxflow',
        e: 'Pipes of different widths run from a reservoir to a town. How much water can flow at once? Not the sum of the pipes — the bottleneck decides. And here is the beautiful part: the maximum you can push equals the cheapest set of pipes you would have to cut to stop the water entirely.',
        k: 'Ford-Fulkerson repeatedly finds an augmenting path in the residual graph and pushes flow along it. Edmonds-Karp uses BFS to pick shortest augmenting paths, giving O(V·E²); Dinic\'s algorithm uses level graphs and blocking flows for O(V²·E), and O(E·√V) on unit-capacity graphs. The residual graph — including BACKWARD edges that let earlier decisions be undone — is what makes the method correct. The max-flow min-cut theorem states the maximum flow equals the minimum cut capacity, so the same computation solves both. Bipartite matching, edge-disjoint paths, and many scheduling and assignment problems reduce to max flow.',
        ap: [
          'The skill here is recognising the reduction, not memorising Dinic. Bipartite matching, assignment, "can every task be covered", vertex-disjoint paths and project selection are all max-flow in disguise.',
          'Always add the reverse residual edge with capacity 0. Without the ability to cancel flow, the algorithm gets stuck at a non-optimal answer — this is the number-one implementation bug.',
          'For bipartite matching use Hopcroft-Karp or plain Hungarian/Kuhn augmenting paths — much simpler than general max flow and usually enough.',
          'After the flow terminates, the vertices reachable from the source in the residual graph form one side of the minimum cut. That is how you extract the cut itself, which is often the answer the problem actually wants.'
        ],
        use: ['Bipartite matching: assigning shifts, students to schools, drivers to rides', 'Image segmentation via graph cuts, and network reliability/bottleneck analysis', 'Airline crew scheduling, sports elimination problems, and project-selection optimisation'],
        py: 'from collections import deque\n\ndef bfs_augment(cap, s, t, parent):\n    parent.clear()\n    parent[s] = None\n    q = deque([s])\n    while q:\n        u = q.popleft()\n        for v, c in cap[u].items():\n            if c > 0 and v not in parent:\n                parent[v] = u\n                if v == t:\n                    return True\n                q.append(v)\n    return False\n\ndef edmonds_karp(cap, s, t):\n    flow, parent = 0, {}\n    while bfs_augment(cap, s, t, parent):\n        # bottleneck along the found path\n        v, push = t, float("inf")\n        while parent[v] is not None:\n            u = parent[v]\n            push = min(push, cap[u][v]); v = u\n        v = t\n        while parent[v] is not None:\n            u = parent[v]\n            cap[u][v] -= push\n            cap[v][u] = cap[v].get(v, 0) + push   # RESIDUAL edge\n            v = u\n        flow += push\n    return flow',
        q: { q: 'What does the max-flow min-cut theorem let you compute for free?', o: ['The shortest path', 'The minimum cut — it equals the max flow', 'The MST'], x: 1, w: 'One computation answers both. The residual reachable set from the source gives you the cut itself.' }
      }
    ]
  }
];
