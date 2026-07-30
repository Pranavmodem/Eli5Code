// Developer approach notes for Modules 1–4 (modules 5–8 carry their own `ap`).
export const APPROACH = {
  m1l1: [
    'When you model a domain, the first question is "what are the nouns?" Each recurring noun with its own state and behaviour is a candidate class. Resist making a class for something that has no state — that is just a function.',
    'A class with only data and no behaviour should probably be a dataclass or a NamedTuple. A class with only behaviour and no state should probably be a module of functions.',
    'Beware the God class. If your class name contains "Manager", "Helper" or "Util", it is usually several classes that have not been separated yet.',
    'In Python, prefer @dataclass for anything that is mostly fields. It generates __init__, __repr__ and __eq__ correctly, which people routinely get wrong by hand.'
  ],
  m1l2: [
    'Mutable default arguments are the classic Python trap: def f(items=[]) shares ONE list across every call. Use None and create the list inside.',
    'Class attributes are shared by all instances; instance attributes are per-object. Assigning a mutable class attribute is the same bug at class scope, and it produces bewildering action-at-a-distance.',
    'Object identity (is) and equality (==) are different questions. Define __eq__ when two distinct objects should count as equal, and __hash__ alongside it if they go in sets or dict keys.',
    'When debugging "why did this change?", check whether you passed a reference and mutated it. Python passes references — copy.deepcopy or an immutable type is the fix.'
  ],
  m1l3: [
    'Prefer computed properties over storing derived data. Two fields that must stay in sync are a bug waiting to happen; a @property that computes on read cannot go stale.',
    'Methods that never touch self should be @staticmethod or a plain function. That is a signal about coupling, not just style.',
    'Keep methods at one level of abstraction. If a method both makes a network call and formats a string, it is two methods.',
    'Name methods as verbs and attributes as nouns. It sounds trivial until a codebase does the opposite and every call site reads ambiguously.'
  ],
  m1l4: [
    'Do real work in the constructor only if it cannot fail in surprising ways. Network calls and file I/O in __init__ make objects impossible to construct in tests — use a classmethod factory instead.',
    'Validate arguments in the constructor and raise immediately. An object that exists in an invalid state will fail somewhere far from the cause.',
    'Use classmethods as named alternative constructors: User.from_json(...), Duration.from_seconds(...). Far clearer than one __init__ with eight optional parameters.',
    'If your constructor takes more than about four positional parameters, use keyword-only arguments (*, after the positional ones). Call sites become self-documenting and reordering stops being a silent bug.'
  ],
  m1l5: [
    'Python has no true private, only conventions: _name means "internal, do not touch" and __name triggers name mangling. Respect the underscore in libraries you consume — it is not a promise.',
    'Expose the smallest surface you can. Every public attribute is a promise you have to keep across versions; every private one is a decision you can reverse.',
    'Use @property to add validation or computation later without changing any call site. That is the practical payoff of encapsulation: you can change your mind.',
    'Getters and setters for every field is not encapsulation, it is boilerplate. Encapsulation means the class enforces its own invariants — if the setter accepts anything, it added nothing.'
  ],
  m1l6: [
    'Inheritance is for is-a, and it is the strongest coupling you can create. Ask "will I ever want to change the parent without auditing every child?" — if yes, do not inherit.',
    'Prefer composition, and inherit mainly to satisfy a framework contract (Django models, Exception hierarchies, ABCs) or to share a genuine interface.',
    'Keep hierarchies shallow — two or three levels. Deep chains make it impossible to know where a method actually comes from, and the MRO becomes a research project.',
    'Use abstract base classes (abc.ABC + @abstractmethod) to state a contract explicitly. A subclass that forgets a method then fails loudly at construction, not mysteriously at runtime.'
  ],
  m1l7: [
    'Always call super() when overriding, unless you deliberately intend to replace the parent behaviour entirely. Silently skipping the parent breaks invariants it was maintaining.',
    'An override must honour the parent contract: same meaning, no stricter inputs, no weaker guarantees. Violating that (the Liskov principle) produces bugs that only appear polymorphically.',
    'Do not override to change semantics. If your subclass\'s save() does not save, you have made the abstraction lie, and every caller is now wrong.',
    'The methods worth overriding in everyday Python are the dunders: __repr__ for debugging, __eq__/__hash__ for value semantics, __enter__/__exit__ for resources.'
  ],
  m1l8: [
    'In Python, polymorphism is mostly duck typing: anything with .read() works where a file is expected. Type against BEHAVIOUR, not class — that is why the protocols matter more than the hierarchy.',
    'Use typing.Protocol to describe the shape you need without forcing inheritance. It gives you static checking with no coupling at all.',
    'A long if/elif chain on a type or a string kind is polymorphism trying to happen. Replace it with a dict dispatch table or a set of small classes.',
    'The test for good polymorphism: can you add a new implementation WITHOUT editing any existing file? If not, the abstraction is in the wrong place.'
  ],
  m1l9: [
    'Choose the abstraction level deliberately per layer. Business logic should not know about HTTP status codes; HTTP handlers should not know about SQL.',
    'A leaky abstraction is worse than none, because it costs you the indirection AND the understanding. If callers must know the internals to use it correctly, simplify instead.',
    'Do not abstract on the first occurrence. Wait for the second or third real use — premature abstraction guesses wrong and then constrains you.',
    'The best interfaces are hard to misuse: make invalid states unrepresentable, prefer enums over strings, and make required arguments required.'
  ],
  m1l10: [
    'Default to composition. It keeps things swappable at runtime, testable in isolation, and free of inherited surprises.',
    'Inject dependencies rather than constructing them inside. A class that builds its own database connection cannot be tested without a database.',
    'Mixins are a middle path, but keep them tiny and orthogonal. A mixin that touches state owned by another mixin is a hierarchy pretending not to be one.',
    'When you feel the pull to inherit for code reuse only, extract a helper object instead. Reuse is not a good enough reason to couple two types forever.'
  ],
  m2l1: [
    'Reach for a list by default in Python; it is a dynamic array with O(1) index and amortised O(1) append. Only diverge when profiling or the access pattern says so.',
    'Never use list.insert(0, x) or list.pop(0) in a loop — both are O(n). That single mistake turns an O(n) algorithm into O(n²) and is one of the most common real slowdowns.',
    'Use array.array or NumPy when you have millions of homogeneous numbers. Python lists store pointers to boxed objects, so the memory and cache cost is large.',
    'Contiguity is why iterating a list beats hopping pointers. If a hot loop is slow, ask whether the data is scattered in memory before you micro-optimise the arithmetic.'
  ],
  m2l2: [
    'If you know the final size, build with a comprehension or preallocate. Repeated growth is amortised O(1) but not free, and it fragments memory.',
    'Do not append inside a loop to build a string — each concatenation copies. Collect into a list and "".join() once.',
    'sys.getsizeof on a growing list shows the capacity jumps. Worth doing once so amortisation stops being abstract.',
    'The amortised guarantee is about the SEQUENCE. In latency-sensitive code the occasional resize is a real spike, and pre-sizing is how you avoid it.'
  ],
  m2l3: [
    'You will rarely hand-roll a linked list in Python — collections.deque covers almost every real need with a C implementation.',
    'Reach for the concept when you need O(1) splice or removal given a node reference: LRU caches, undo chains, free lists, intrusive lists in systems code.',
    'The trade is always the same: cheap restructuring, expensive traversal, poor cache locality. If you find yourself indexing into a linked list, you chose wrong.',
    'Use a sentinel head node when implementing one. It removes every null check from insert and delete, which is where the bugs live.'
  ],
  m2l4: [
    'collections.deque IS a doubly linked list of blocks — appendleft, pop and popleft are all O(1). Use it for queues, sliding windows and anything needing both ends.',
    'The extra pointer costs memory and doubles the writes per mutation. For a forward-only iteration, singly linked is strictly better.',
    'Doubly linked plus a hash map is the LRU pattern, and it is worth recognising as a reusable composition rather than a one-off trick.',
    'Circular doubly linked lists are how schedulers do round-robin without ever checking for the end. Neat when you need continuous rotation.'
  ],
  m2l5: [
    'A plain Python list is the idiomatic stack: append and pop are both O(1) at the end. Do not import anything.',
    'Any recursive algorithm can be rewritten with an explicit stack, and sometimes must be — Python\'s 1,000-frame default limit makes deep recursion a real risk on large inputs.',
    'Recognise the stack shape in: bracket matching, expression parsing, undo, monotonic-stack problems (next greater element), and DFS.',
    'Monotonic stacks are the high-value variant: keeping a stack sorted lets you answer "next greater/smaller element" in O(n) instead of O(n²).'
  ],
  m2l6: [
    'Use collections.deque, never a list, for a queue. list.pop(0) is O(n) and this is the single most common accidental quadratic in Python.',
    'queue.Queue is for THREAD-SAFE producer/consumer, not for algorithms. It has locking overhead you do not want inside a BFS.',
    'The queue is what makes BFS find shortest paths. If you swap it for a stack you get DFS and lose that guarantee — worth internalising as one idea.',
    'For bounded buffers use deque(maxlen=n) — it drops from the other end automatically, which is a neat fit for rolling windows and recent-event logs.'
  ],
  m2l7: [
    'dict and set are your first thought for any "have I seen this?", "group by", or "look up by id" problem. Converting an O(n²) nested scan into a dict lookup is the most frequent real-world speedup there is.',
    'Keys must be hashable and must not be mutated afterwards. Use tuples, frozensets or frozen dataclasses for composite keys.',
    'defaultdict and Counter remove most of the boilerplate around grouping and counting. collections is worth reading end to end once.',
    'Dicts are memory-hungry compared with lists. For millions of small records, consider __slots__, NamedTuple, or a columnar layout.'
  ],
  m2l8: [
    'You rarely handle collisions yourself, but you do choose keys. A key with poor distribution (all the same prefix, low-entropy hashes) degrades a dict toward a list.',
    'Never hash user-controlled data with a weak custom hash in a public endpoint — that is an algorithmic complexity attack. Python randomises string hashing per process for this reason.',
    'If you implement __hash__, make it consistent with __eq__ and derived only from immutable fields. An inconsistent pair produces objects that vanish from sets.',
    'For huge key spaces where approximate membership is acceptable, a Bloom or cuckoo filter in front of the map saves enormous memory.'
  ],
  m2l9: [
    'Python has no built-in balanced tree. Use sortedcontainers (SortedDict/SortedList) when you need ordered operations, or bisect on a list when n is small.',
    'Reach for a tree when you need ORDER: range queries, next-greater key, in-order iteration, percentile lookups. If you only need membership, a hash map wins.',
    'Any tree fed sorted input degrades to a list unless it self-balances. That is a real production failure, not a theoretical one.',
    'Recursive tree code on user-supplied depth needs a guarded recursion limit or an iterative rewrite. Deeply nested JSON is a genuine attack vector.'
  ],
  m2l10: [
    'Model as a graph the moment relationships matter more than the items: dependencies, permissions, social connections, routing, state machines.',
    'Use defaultdict(list) for adjacency in Python — it is compact and fast enough for nearly everything. Reach for networkx when you need algorithms, not correctness of your own loops.',
    'Always ask directed or undirected FIRST, and remember to add both directions for undirected. Forgetting the reverse edge is the most common graph bug.',
    'Cycles are the thing to check for early. Circular imports, deadlocks and infinite recalculation loops are all cycle detection in disguise.'
  ],
  m3l1: [
    'Never write your own sort in production — sorted() is Timsort in C, and it is faster and more correct than anything you will write.',
    'What you DO write is the key function: sorted(items, key=lambda x: (x.priority, x.created)). Tuple keys give you multi-level sorting for free.',
    'Timsort is STABLE, so you can sort by secondary key then primary key and both orderings survive. That is a genuinely useful technique.',
    'Learn bubble sort for the compare-and-swap primitive and the early-exit idea, then move on. Its value is pedagogical.'
  ],
  m3l2: [
    'The lesson worth keeping is that comparison cost and WRITE cost are different budgets. On flash memory, in append-only stores, or where writes trigger replication, minimising writes matters more than minimising comparisons.',
    'For "k smallest of n", do not sort — use heapq.nsmallest(k, items) for O(n log k).',
    'When you need a stable minimum with a tie-break, min(items, key=...) is clearer and faster than sorting the whole collection.',
    'Selection sort\'s fixed comparison count also makes it a constant-time-ish choice in side-channel-sensitive code, where data-dependent timing is a vulnerability.'
  ],
  m3l3: [
    'This is the one classic sort you genuinely use: it is what Timsort runs on small runs, and it is optimal for nearly-sorted data.',
    'If you are maintaining a sorted collection as items arrive one at a time, bisect.insort is the practical form of this idea.',
    'Recognise "nearly sorted" in the wild — timestamped logs, incrementally updated leaderboards, mostly-ordered imports. An adaptive algorithm turns O(n log n) into nearly O(n).',
    'For a live sorted structure at scale, use sortedcontainers rather than insort, since insort still shifts O(n) elements.'
  ],
  m3l4: [
    'Merge sort is the algorithm for data that does not fit in memory: sort chunks, write them out, then merge streams. That is how databases sort terabytes.',
    'heapq.merge merges any number of sorted iterables lazily, which is the streaming form of the merge step and extremely useful for log processing.',
    'Its stability is why it is chosen when equal records must keep their original order — spreadsheets, financial ledgers, anything user-visible.',
    'The O(n) auxiliary space is the real cost. On memory-constrained systems that is what pushes you to heapsort or quicksort instead.'
  ],
  m3l5: [
    'Quicksort\'s real gift is the PARTITION step. Quickselect uses it to find the k-th smallest or a median in O(n) average, without sorting.',
    'Never use a fixed pivot on data you did not generate — sorted or adversarial input triggers O(n²). Randomise, or use median-of-three.',
    'The O(log n) stack depth is only guaranteed if you recurse into the smaller side and loop on the larger. Otherwise a bad split can overflow.',
    'In practice you use it via sorted() / std::sort, which is introsort: quicksort until recursion gets deep, then heapsort as insurance.'
  ],
  m3l6: [
    'Linear search is often the right answer for small n. Building an index or sorting first costs more than scanning 50 items, and the code is clearer.',
    'Use any(), next() and generator expressions to short-circuit — next((x for x in items if pred(x)), None) stops at the first hit.',
    'The moment you scan the same collection repeatedly, build a dict or a set once and stop scanning. That is the single highest-value refactor in most slow code.',
    'x in list is O(n) while x in set is O(1). Spotting a membership test inside a loop over a list is free performance.'
  ],
  m3l7: [
    'Use the bisect module rather than writing the loop: bisect_left, bisect_right and insort cover almost every need and have no off-by-one bugs.',
    'The precondition is sortedness, and it is on YOU to guarantee it. Binary searching unsorted data returns wrong answers silently.',
    'bisect_left vs bisect_right decides your boundary behaviour with duplicates. Choose deliberately — this is where the real bugs are.',
    'The bigger idea is binary searching a MONOTONE PREDICATE, not just an array. git bisect, capacity planning and parameter tuning are all this pattern.'
  ],
  m3l8: [
    'BFS is your default for shortest path on unweighted graphs, and for anything "fewest steps" or "closest first".',
    'Use collections.deque and mark nodes visited when you ENQUEUE, not when you dequeue. Marking on dequeue lets duplicates into the queue and can blow up memory.',
    'Level-by-level processing (loop over len(queue) at each depth) gives you distance for free and is how you answer "how many steps".',
    'For huge graphs, bidirectional BFS from both ends roughly square-roots the explored frontier. Worth knowing when the graph is too big for one search.'
  ],
  m3l9: [
    'DFS is the tool for exhaustive exploration, cycle detection, topological order and connected components — not for shortest paths.',
    'Prefer an explicit stack over recursion for anything user-sized. Python\'s recursion limit is a real constraint and the iterative version is barely longer.',
    'Cycle detection in a DIRECTED graph needs three states (unvisited / on the current stack / finished). Two states silently miss back edges.',
    'Post-order DFS is what gives you topological sort and tree DP. Recognising "children before parent" as a shape pays off constantly.'
  ],
  m3l10: [
    'Recursion is for recursively-shaped data: trees, nested JSON, filesystems, grammars. For linear data, a loop is clearer and cheaper.',
    'Write the base case FIRST. Most infinite recursions are a missing or unreachable base case, not a wrong recursive step.',
    'Python has no tail-call optimisation, so deep recursion will overflow. Convert to an explicit stack when depth is data-dependent.',
    'Add @cache the moment the same arguments recur — that single decorator turns exponential recursion into linear DP.'
  ],
  m4l1: [
    'Reason about complexity BEFORE writing code, and about constants AFTER profiling. Asymptotics choose the algorithm; measurement chooses the implementation.',
    'State the n. "This is O(n²)" is meaningless without saying whether n is users, requests or rows — and whether n is 50 or 50 million.',
    'The most valuable habit in code review is asking "what happens when this collection is a hundred times bigger?" It catches most scaling bugs before they ship.',
    'Remember that I/O usually dominates. An O(n²) loop over 100 items is irrelevant next to one N+1 query pattern.'
  ],
  m4l2: [
    'Convert repeated lookups to O(1) by building a dict once. This is the highest-leverage optimisation in ordinary application code.',
    'O(1) does not mean fast. A hash of a large object, or a disk-backed cache hit, is constant but not cheap.',
    'Beware operations that LOOK constant but are not: len() on a generator, x in list, or a property that runs a query.',
    'Caching turns expensive work into O(1) amortised, but adds invalidation as a new problem. Choose the cache key and TTL deliberately.'
  ],
  m4l3: [
    'A single pass is often optimal, so aim for one. Two passes is fine; a pass inside a pass is the thing to catch.',
    'Prefer generators and itertools for large data — same O(n) time, but O(1) memory instead of O(n).',
    'Watch for hidden linear work in a loop: repeated in on a list, repeated string concatenation, or re-sorting inside an iteration.',
    'In data pipelines, one linear pass that computes several aggregates beats several passes that each compute one. Fewer scans is often the whole optimisation.'
  ],
  m4l4: [
    'The N+1 query is the quadratic that actually costs companies money. Look for a loop that queries, and fix it with a join, a prefetch, or a single batched IN query.',
    'Any nested loop over the same collection deserves a second look. A dict, a set or a sort first usually removes the inner loop.',
    'Quadratic algorithms pass every test suite, because test data is small. Load-test with realistic volume or you will not see it until production.',
    'When n is genuinely small and bounded, O(n²) is fine and often clearest. Optimise for the n you have, not the n you imagine.'
  ],
  m4l5: [
    'Logarithmic behaviour is effectively free at any realistic scale. If you can turn a linear scan into a log lookup with an index, do it.',
    'This is what a database index buys you, and why an unindexed WHERE clause on a large table is a production incident.',
    'Recognise the halving structure: sorted data, balanced trees, heaps, and binary search on a monotone predicate.',
    'Do not add an index for a table of 200 rows. The log win is meaningless and you pay on every write.'
  ],
  m4l6: [
    'n log n is the realistic floor for general sorting, so stop looking for O(n). If you need better, you need a non-comparison sort (counting, radix) and the constraints to justify it.',
    'Sorting is rarely your bottleneck. If a request is slow and it sorts 1,000 items, the sort is not the problem.',
    'When you sort just to find a few extremes, use a heap instead: nlargest/nsmallest is O(n log k).',
    'If you sort the same data repeatedly, keep it sorted (sortedcontainers, an index, or a sorted insert) rather than re-sorting each time.'
  ],
  m4l7: [
    'Estimate before you optimise: multiply your n by the growth class and see whether the number is plausible for your latency budget.',
    'Asymptotics only decide the winner for large n. For small inputs, constants and cache behaviour dominate — which is why insertion sort beats merge sort under 32 elements.',
    'Profile before you commit. cProfile, py-spy or a flame graph will tell you where the time actually goes, and it is usually not where you guessed.',
    'Write down the expected n in a comment next to any non-obvious algorithm choice. Future maintainers need to know which assumption to re-check.'
  ],
  m4l8: [
    'Memory is the binding constraint more often than people expect: containers, serverless functions and mobile all have hard ceilings.',
    'Stream instead of loading. Generators, iterators and chunked reads turn O(n) memory into O(1) with no change in time complexity.',
    'Recursion depth is space. A data-dependent depth is both a memory risk and a crash risk.',
    'Trading memory for time (caching, precomputation, indexes) is usually right — but state the trade explicitly, because caches introduce staleness bugs.'
  ],
  m4l9: [
    'Amortised is the honest way to describe list.append and dict insert. It is a promise about the sequence, not about any single call.',
    'For p99 latency, amortised guarantees are not enough — the resize spike IS your p99. Pre-size containers in hot paths.',
    'Distinguish amortised (averaged over a worst-case sequence) from average-case (averaged over inputs). Quicksort is average-case O(n log n); append is amortised O(1). Different claims.',
    'Rehashing, log compaction and garbage collection are all amortised costs that show up as periodic latency spikes. When you see regular spikes, look for a doubling structure.'
  ],
  m4l10: [
    'Decide from the DOMINANT operation. Write down what the code does most, then choose the structure whose complexity table favours it.',
    'Default to dict, list and deque in Python; they cover the vast majority of cases well. Reach further only when the access pattern demands it.',
    'Ask what you will NEVER need. Not needing order, or not needing deletion, unlocks much faster options (hash maps, Bloom filters, append-only logs).',
    'Write the complexity of your chosen structure in a comment at the definition. It documents the assumption and makes the next person\'s change safe.'
  ]
};
